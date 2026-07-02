const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const srcSkillsDir = path.join(rootDir, 'skills');
const routerDir = path.join(rootDir, 'router');
const internalSkillsDir = path.join(rootDir, 'internal-skills');

// 辅助函数：递归创建目录
function mkdirsSync(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// 辅助函数：递归删除目录
function rmDirSync(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
}

// 辅助函数：拷贝目录
function copyDirSync(src, dest) {
  mkdirsSync(dest);
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 辅助函数：移动目录
function moveDirSync(src, dest) {
  if (!fs.existsSync(src)) return;
  mkdirsSync(path.dirname(dest));
  try {
    fs.renameSync(src, dest);
  } catch (e) {
    // 跨驱动器可能导致 rename 失败，fallback 到 copy + delete
    copyDirSync(src, dest);
    rmDirSync(src);
  }
}

console.log('🚀 开始重构目录结构...');

// 1. 建立 router/ 目录，搬迁 skills/_super-skill/ 下的配置文件
const superSkillDir = path.join(srcSkillsDir, '_super-skill');
if (fs.existsSync(superSkillDir)) {
  mkdirsSync(routerDir);
  const files = fs.readdirSync(superSkillDir);
  files.forEach(file => {
    // 排除 SKILL.md，因为根目录有更详细的 SKILL.md
    if (file === 'SKILL.md') {
      console.log('  [跳过] 搬迁 _super-skill/SKILL.md (根目录已存在)');
      return;
    }
    const srcPath = path.join(superSkillDir, file);
    const destPath = path.join(routerDir, file);
    if (fs.statSync(srcPath).isFile()) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`  [拷贝] ${file} -> router/${file}`);
    }
  });
}

// 2. 清理顶层散落的重复子目录
const duplicateDirsToDelete = [
  'cheat-bump', 'cheat-init', 'cheat-learn-from', 'cheat-migrate', 'cheat-on-content',
  'cheat-persona', 'cheat-predict', 'cheat-publish', 'cheat-recommend', 'cheat-retro',
  'cheat-score', 'cheat-score-blind', 'cheat-seed', 'cheat-shoot', 'cheat-status', 'cheat-trends',
  'code-simplifier', 'codegraph', 'diagnose', 'grill-me', 'handoff', 'improve-codebase-architecture',
  'prototype', 'tdd', 'to-issues', 'to-prd', 'zoom-out'
];

duplicateDirsToDelete.forEach(dirName => {
  const fullPath = path.join(srcSkillsDir, dirName);
  if (fs.existsSync(fullPath)) {
    rmDirSync(fullPath);
    console.log(`  [删除重复顶层目录] skills/${dirName}`);
  }
});

// 3. 将不重复但散落在顶层的技能移动到对应的规范分类中
const relocations = [
  { from: 'donet-handjob', to: 'specialized/donet-handjob' },
  { from: 'serenity-skill', to: 'specialized/serenity-skill' },
  { from: 'simple-replie', to: 'specialized/simple-replie' },
  { from: 'ducument-skill', to: 'document/document-skills' }, // 重命名纠错
  { from: 'find-skill', to: 'ai-agent/find-skill' },
  { from: 'taste-skill', to: 'frontend/taste-skill' },
  { from: 'impeccable', to: 'frontend/impeccable' },
  { from: 'karpathy-guidelines', to: 'engineering/development/karpathy-guidelines' }
];

relocations.forEach(r => {
  const srcPath = path.join(srcSkillsDir, r.from);
  const destPath = path.join(srcSkillsDir, r.to);
  if (fs.existsSync(srcPath)) {
    moveDirSync(srcPath, destPath);
    console.log(`  [移动技能] skills/${r.from} -> skills/${r.to}`);
  }
});

// 4. 清理旧的 _super-skill 目录
if (fs.existsSync(superSkillDir)) {
  rmDirSync(superSkillDir);
  console.log('  [删除] skills/_super-skill 目录');
}

// 5. 将 skills 目录重命名为 internal-skills
if (fs.existsSync(srcSkillsDir) && !fs.existsSync(internalSkillsDir)) {
  moveDirSync(srcSkillsDir, internalSkillsDir);
  console.log('  [重命名根目录] skills -> internal-skills');
}

console.log('✓ 目录物理结构调整完毕。');

console.log('🚀 开始将 SKILL.md 改名为 INSTRUCTION.md 并修复 Markdown 里的文件链接...');

// 6. 递归遍历 internal-skills 目录：重命名 SKILL.md
const allInstructionPaths = [];

function processDir(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (let file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      processDir(fullPath);
    } else if (file.name.toLowerCase() === 'skill.md') {
      const newPath = path.join(dir, 'INSTRUCTION.md');
      fs.renameSync(fullPath, newPath);
      allInstructionPaths.push(newPath);
      console.log(`  [重命名文件] ${path.relative(rootDir, fullPath)} -> INSTRUCTION.md`);
    }
  }
}

if (fs.existsSync(internalSkillsDir)) {
  processDir(internalSkillsDir);
}

// 7. 扫描所有 markdown 文件，将里面的链接 SKILL.md 替换为 INSTRUCTION.md，并清理旧绝对路径
function getFiles(dir, ext = '.md', filesList = []) {
  if (!fs.existsSync(dir)) return filesList;
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const filePath = path.join(dir, file.name);
    if (file.isDirectory()) {
      getFiles(filePath, ext, filesList);
    } else if (file.name.endsWith(ext)) {
      filesList.push(filePath);
    }
  }
  return filesList;
}

const allMdFiles = [
  ...getFiles(rootDir, '.md'),
  ...getFiles(routerDir, '.md'),
  ...getFiles(internalSkillsDir, '.md')
];

let updatedLinksCount = 0;
allMdFiles.forEach(file => {
  // 排除根目录的 SKILL.md 本身
  if (file === path.join(rootDir, 'SKILL.md')) return;

  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // 1. 将包含 SKILL.md (不区分大小写) 的链接转换成 INSTRUCTION.md
  content = content.replace(/(\([^)]+?)\/[Ss][Kk][Ii][Ll][Ll]\.[Mm][Dd](\))/g, '$1/INSTRUCTION.md$2');
  content = content.replace(/\/SKILL\.md/gi, '/INSTRUCTION.md');
  content = content.replace(/\\SKILL\.md/gi, '/INSTRUCTION.md');

  // 2. 修复绝对路径，改为相对路径。
  content = content.replace(/C:\/Users\/a1028\/\.gemini\/config\/skills\/super-skill-router\/skills\//gi, '../../');
  content = content.replace(/skills\//gi, 'internal-skills/');

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    updatedLinksCount++;
  }
});

console.log(`✓ 修复了 ${updatedLinksCount} 个 Markdown 文件中的链接和路径。`);

// 8. 构造 skills-manifest.json
console.log('🚀 开始生成 skills-manifest.json...');
const manifestPath = path.join(rootDir, 'skills-manifest.json');

// 定义所有的 Skill 元数据
const manifestData = {
  version: 1,
  skills: [
    {
      id: "agent-memory",
      name: "Agent Memory",
      category: "ai-agent",
      visibility: "internal",
      role: "primary",
      canonical: true,
      triggers: ["memory", "claude-mem", "session", "context", "persistence", "记忆", "历史", "会话", "上下文", "持久化"],
      priority: 1,
      instructionPath: "internal-skills/ai-agent/agent-memory/INSTRUCTION.md"
    },
    {
      id: "code-indexing",
      name: "Code Indexing",
      category: "ai-agent",
      visibility: "internal",
      role: "primary",
      canonical: true,
      aliases: ["codegraph"],
      triggers: ["indexing", "codegraph", "索引", "代码分析", "模块关系", "探索陌生项目", "调用链路"],
      priority: 1,
      instructionPath: "internal-skills/ai-agent/code-indexing/INSTRUCTION.md"
    },
    {
      id: "context-engineering",
      name: "Context Engineering",
      category: "ai-agent",
      visibility: "internal",
      role: "primary",
      canonical: true,
      triggers: ["context", "token", "prompt", "limits", "上下文工程", "合理化", "精炼"],
      priority: 1,
      instructionPath: "internal-skills/ai-agent/context-engineering/INSTRUCTION.md"
    },
    {
      id: "headroom",
      name: "Headroom Log Compressor",
      category: "ai-agent",
      visibility: "internal",
      role: "primary",
      canonical: true,
      triggers: ["headroom", "compression", "logs", "output", "会话压缩", "日志瘦身", "超长报错", "测试报错堆栈"],
      priority: 1,
      instructionPath: "internal-skills/ai-agent/headroom/INSTRUCTION.md"
    },
    {
      id: "skill-design",
      name: "Skill Design",
      category: "ai-agent",
      visibility: "internal",
      role: "primary",
      canonical: true,
      triggers: ["skill", "prompt", "rule", "routing", "设计技能", "维护技能", "新建技能"],
      priority: 1,
      instructionPath: "internal-skills/ai-agent/skill-design/INSTRUCTION.md"
    },
    {
      id: "find-skill",
      name: "Find Skill",
      category: "ai-agent",
      visibility: "internal",
      role: "auxiliary",
      canonical: true,
      triggers: ["find", "discover", "install", "有没有某种", "如何安装", "找一个能做"],
      priority: 1,
      instructionPath: "internal-skills/ai-agent/find-skill/INSTRUCTION.md"
    },
    {
      id: "using-agent-skills",
      name: "Using Agent Skills",
      category: "ai-agent",
      visibility: "internal",
      role: "auxiliary",
      canonical: true,
      triggers: ["using", "guide", "how to load", "使用技能手册"],
      priority: 1,
      instructionPath: "internal-skills/ai-agent/using-agent-skills/INSTRUCTION.md"
    },
    {
      id: "api-backend",
      name: "API Backend",
      category: "backend",
      visibility: "internal",
      role: "primary",
      canonical: true,
      aliases: ["backend-api", "server-api"],
      triggers: ["api", "接口", "后端", "鉴权", "token", "session", "crud", "database", "express", "nest"],
      priority: 1,
      instructionPath: "internal-skills/backend/api-backend/INSTRUCTION.md"
    },
    {
      id: "nginx",
      name: "Nginx Deployment",
      category: "deployment",
      visibility: "internal",
      role: "primary",
      canonical: true,
      triggers: ["nginx", "reverse proxy", "ssl", "https", "domain", "server block", "负载均衡", "反向代理"],
      priority: 1,
      instructionPath: "internal-skills/deployment/nginx/INSTRUCTION.md"
    },
    {
      id: "writing",
      name: "Writing & Document",
      category: "document",
      visibility: "internal",
      role: "primary",
      canonical: true,
      triggers: ["write", "draft", "summarize", "improve", "写作", "编写", "起草", "润色", "总结", "大纲"],
      priority: 1,
      instructionPath: "internal-skills/document/writing/INSTRUCTION.md"
    },
    {
      id: "document-skills",
      name: "Document Skills",
      category: "document",
      visibility: "internal",
      role: "primary",
      canonical: true,
      triggers: ["doc", "pdf", "word", "xlsx", "excel", "ppt", "简历", "表格", "幻灯片"],
      priority: 1,
      instructionPath: "internal-skills/document/document-skills/INSTRUCTION.md"
    },
    {
      id: "documentation-and-adrs",
      name: "Documentation & ADRs",
      category: "document",
      visibility: "internal",
      role: "auxiliary",
      canonical: true,
      triggers: ["adr", "architecture decision record", "readme", "architecture docs", "架构设计决策", "设计记录"],
      priority: 1,
      instructionPath: "internal-skills/document/documentation-and-adrs/INSTRUCTION.md"
    },
    {
      id: "diagnose",
      name: "Diagnostics & Error Recovery",
      category: "engineering",
      visibility: "internal",
      role: "primary",
      canonical: true,
      aliases: ["debugging-and-error-recovery"],
      triggers: ["debug", "diagnose", "bug", "crash", "error", "leak", "stack trace", "报错", "故障", "卡顿", "崩溃", "排查", "修复"],
      priority: 1,
      instructionPath: "internal-skills/engineering/development/diagnose/INSTRUCTION.md"
    },
    {
      id: "improve-codebase-architecture",
      name: "Improve Codebase Architecture",
      category: "engineering",
      visibility: "internal",
      role: "primary",
      canonical: true,
      triggers: ["architecture", "refactor", "design pattern", "structure", "重构", "架构", "设计模式", "消除冗余", "模块划分"],
      priority: 1,
      instructionPath: "internal-skills/engineering/development/improve-codebase-architecture/INSTRUCTION.md"
    },
    {
      id: "tdd",
      name: "Test Driven Development",
      category: "engineering",
      visibility: "internal",
      role: "primary",
      canonical: true,
      aliases: ["test-driven-development"],
      triggers: ["tdd", "test", "unit test", "spec", "jest", "vitest", "测试驱动", "单测", "编写测试", "红绿重构"],
      priority: 1,
      instructionPath: "internal-skills/engineering/development/tdd/INSTRUCTION.md"
    },
    {
      id: "zoom-out",
      name: "Zoom Out Overview",
      category: "engineering",
      visibility: "internal",
      role: "auxiliary",
      canonical: true,
      triggers: ["zoom", "overview", "macro", "dependencies", "高空审视", "全局依赖", "业务全貌", "梳理"],
      priority: 1,
      instructionPath: "internal-skills/engineering/development/zoom-out/INSTRUCTION.md"
    },
    {
      id: "grill-me",
      name: "Grill Me Plan Review",
      category: "engineering",
      visibility: "internal",
      role: "auxiliary",
      canonical: true,
      aliases: ["interview-me"],
      triggers: ["grill", "review", "challenge", "plan review", "质疑", "对齐", "交互式提问", "方案评审"],
      priority: 1,
      instructionPath: "internal-skills/engineering/planning/grill-me/INSTRUCTION.md"
    },
    {
      id: "to-prd",
      name: "Plan to PRD",
      category: "engineering",
      visibility: "internal",
      role: "auxiliary",
      canonical: true,
      triggers: ["prd", "requirement", "product requirement", "需求文档", "产品需求", "编写 prd"],
      priority: 1,
      instructionPath: "internal-skills/engineering/planning/to-prd/INSTRUCTION.md"
    },
    {
      id: "to-issues",
      name: "Plan to GitHub Issues",
      category: "engineering",
      visibility: "internal",
      role: "auxiliary",
      canonical: true,
      triggers: ["issue", "ticket", "split", "slice", "task breakdown", "任务拆解", "切片", "github issues"],
      priority: 1,
      instructionPath: "internal-skills/engineering/planning/to-issues/INSTRUCTION.md"
    },
    {
      id: "handoff",
      name: "Handoff Session Compaction",
      category: "engineering",
      visibility: "internal",
      role: "auxiliary",
      canonical: true,
      triggers: ["handoff", "session", "compaction", "limits", "交接", "进度接力", "压缩会话"],
      priority: 1,
      instructionPath: "internal-skills/engineering/collaboration/handoff/INSTRUCTION.md"
    },
    {
      id: "prototype",
      name: "Throwaway Prototyping",
      category: "engineering",
      visibility: "internal",
      role: "primary",
      canonical: true,
      triggers: ["prototype", "experiment", "poc", "throwaway", "原型", "概念验证", "极简 cli"],
      priority: 1,
      instructionPath: "internal-skills/engineering/prototyping/prototype/INSTRUCTION.md"
    },
    {
      id: "karpathy-guidelines",
      name: "Karpathy Coding Guidelines",
      category: "engineering",
      visibility: "internal",
      role: "auxiliary",
      canonical: true,
      triggers: ["karpathy", "rules", "guidelines", "quality", "规范", "设计实现", "工程判断"],
      priority: 1,
      instructionPath: "internal-skills/engineering/development/karpathy-guidelines/INSTRUCTION.md"
    },
    {
      id: "agent-skills",
      name: "Addy Osmani Agent Skills",
      category: "engineering",
      visibility: "internal",
      role: "primary",
      canonical: true,
      triggers: ["addy", "osmani", "agent-skills", "best practices", "软件工程技能"],
      priority: 1,
      instructionPath: "internal-skills/engineering/development/agent-skills/INSTRUCTION.md"
    },
    {
      id: "pm-skills",
      name: "Product Management Skills",
      category: "engineering",
      visibility: "internal",
      role: "primary",
      canonical: true,
      triggers: ["pm-skills", "product management", "huryn", "产品经理技能"],
      priority: 1,
      instructionPath: "internal-skills/engineering/planning/pm-skills/INSTRUCTION.md"
    },
    {
      id: "web-frontend",
      name: "Fused Web Frontend",
      category: "frontend",
      visibility: "internal",
      role: "primary",
      canonical: true,
      aliases: ["frontend-design", "ui-ux-pro-max"],
      triggers: ["ui", "ux", "css", "html", "style", "page", "button", "animation", "react", "vue", "layout", "网页", "前端", "美化"],
      priority: 1,
      instructionPath: "internal-skills/frontend/web-frontend/INSTRUCTION.md"
    },
    {
      id: "taste-skill",
      name: "Taste Premium Frontend Design",
      category: "frontend",
      visibility: "internal",
      role: "auxiliary",
      canonical: true,
      triggers: ["taste", "premium", "design", "aesthetic", "anti-slop", "视觉细节", "美化", "质感"],
      priority: 1,
      instructionPath: "internal-skills/frontend/taste-skill/INSTRUCTION.md"
    },
    {
      id: "impeccable",
      name: "Impeccable Frontend Redesign",
      category: "frontend",
      visibility: "internal",
      role: "auxiliary",
      canonical: true,
      triggers: ["impeccable", "redesign", "polish", "distill", "audit", "视觉层级", "设计系统"],
      priority: 1,
      instructionPath: "internal-skills/frontend/impeccable/INSTRUCTION.md"
    },
    {
      id: "browser-automation",
      name: "Browser Automation with DevTools",
      category: "frontend",
      visibility: "internal",
      role: "auxiliary",
      canonical: true,
      triggers: ["browser-automation", "devtools", "puppeteer", "screenshot", "自动化测试", "截图", "网络追踪"],
      priority: 1,
      instructionPath: "internal-skills/frontend/browser-automation/INSTRUCTION.md"
    },
    {
      id: "anime",
      name: "Anime.js Animation Engine",
      category: "frontend",
      visibility: "internal",
      role: "auxiliary",
      canonical: true,
      triggers: ["anime", "animejs", "micro-animation", "svg morphing", "动效合成"],
      priority: 1,
      instructionPath: "internal-skills/frontend/anime/INSTRUCTION.md"
    },
    {
      id: "hyperframes",
      name: "HyperFrames Video Engine",
      category: "frontend",
      visibility: "internal",
      role: "primary",
      canonical: true,
      triggers: ["hyperframes", "remotion", "video render", "video workflow", "视频合成", "渲染引擎"],
      priority: 1,
      instructionPath: "internal-skills/frontend/hyperframes/INSTRUCTION.md"
    },
    {
      id: "jianying-editor-skill",
      name: "JianYing JyWrapper JyAPI",
      category: "frontend",
      visibility: "internal",
      role: "primary",
      canonical: true,
      triggers: ["jianying", "jywrapper", "jyapi", "剪映", "自动化剪辑"],
      priority: 1,
      instructionPath: "internal-skills/frontend/jianying-editor-skill/INSTRUCTION.md"
    },
    {
      id: "mimo-jianying-video-workflow",
      name: "MiMo JianYing Video Workflow",
      category: "frontend",
      visibility: "internal",
      role: "primary",
      canonical: true,
      triggers: ["mimo", "demo video", "critique", "录屏剪辑", "产品演示视频"],
      priority: 1,
      instructionPath: "internal-skills/frontend/mimo-jianying-video-workflow/INSTRUCTION.md"
    },
    {
      id: "ai-paper-pipeline",
      name: "AI Paper Experiment Pipeline",
      category: "paper",
      visibility: "internal",
      role: "primary",
      canonical: true,
      triggers: ["paper", "pipeline", "literature search", "latex", "experiment", "学术论文", "实验分析"],
      priority: 1,
      instructionPath: "internal-skills/paper/ai-paper-pipeline/INSTRUCTION.md"
    },
    {
      id: "scientific-research-skill",
      name: "Scientific Research Workflow",
      category: "paper",
      visibility: "internal",
      role: "primary",
      canonical: true,
      triggers: ["scientific", "nature-style", "manuscript", "citation", "rebuttal", "科研写作", "答辩"],
      priority: 1,
      instructionPath: "internal-skills/paper/scientific-research-skill/INSTRUCTION.md"
    },
    {
      id: "cheat-on-content",
      name: "Cheat on Content Calibration",
      category: "content",
      visibility: "internal",
      role: "primary",
      canonical: true,
      triggers: ["cheat", "rubric", "predict", "calibration", "复盘", "选题推荐", "自媒体", "内容打分"],
      priority: 1,
      instructionPath: "internal-skills/content/cheat-on-content/INSTRUCTION.md"
    },
    {
      id: "donet-handjob",
      name: ".NET Desktop Prototyper",
      category: "specialized",
      visibility: "internal",
      role: "primary",
      canonical: true,
      triggers: ["dotnet", "wpf", "winforms", "desktop", "课程作业", "拖拽界面"],
      priority: 1,
      instructionPath: "internal-skills/specialized/donet-handjob/INSTRUCTION.md"
    },
    {
      id: "serenity-skill",
      name: "Serenity Investment Thesis Stress Tester",
      category: "specialized",
      visibility: "internal",
      role: "primary",
      canonical: true,
      triggers: ["serenity", "investment", "value chain", "bottleneck", "产业链", "瓶颈", "投资调研", "压力测试"],
      priority: 1,
      instructionPath: "internal-skills/specialized/serenity-skill/INSTRUCTION.md"
    },
    {
      id: "simple-replie",
      name: "Minimal User Replies Chinese",
      category: "specialized",
      visibility: "internal",
      role: "auxiliary",
      canonical: true,
      triggers: ["minimal", "replies", "short answers", "极简回复", "中文短答", "不作多余汇报"],
      priority: 1,
      instructionPath: "internal-skills/specialized/simple-replie/INSTRUCTION.md"
    }
  ]
};

fs.writeFileSync(manifestPath, JSON.stringify(manifestData, null, 2), 'utf8');
console.log('✓ skills-manifest.json 生成完毕。');
console.log('🎉 整个重组脚本执行完成！');
