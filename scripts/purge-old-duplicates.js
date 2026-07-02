const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const internalSkillsDir = path.join(rootDir, 'internal-skills');
const manifestPath = path.join(rootDir, 'skills-manifest.json');

console.log('🧹 启动老散落物理副本深度清理与去重 (Purging Old Scattered Agent Skills)...');

// 辅助函数：递归删除目录
function rmDirSync(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
}

// 需要彻底物理删除的老物理副本路径列表（因为它们都在 internal-skills/engineering/development/agent-skills/ 下有了规范备份）
const oldAgentSkillsScatteredPaths = [
  'backend/api-and-interface-design',
  'frontend/browser-testing-with-devtools',
  'deployment/ci-cd-and-automation',
  'deployment/shipping-and-launch',
  'frontend/frontend-ui-engineering',
  'ai-agent/context-engineering',
  'ai-agent/using-agent-skills',
  'document/documentation-and-adrs',
  'engineering/development/code-review-and-quality',
  'engineering/development/code-simplification',
  'engineering/development/debugging-and-error-recovery',
  'engineering/development/deprecation-and-migration',
  'engineering/development/doubt-driven-development',
  'engineering/development/git-workflow-and-versioning',
  'engineering/development/incremental-implementation',
  'engineering/development/observability-and-instrumentation',
  'engineering/development/performance-optimization',
  'engineering/development/security-and-hardening',
  'engineering/development/source-driven-development',
  'engineering/development/test-driven-development',
  'engineering/planning/idea-refine',
  'engineering/planning/interview-me',
  'engineering/planning/planning-and-task-breakdown',
  'engineering/planning/spec-driven-development'
];

let deletedPhysicalDirsCount = 0;
oldAgentSkillsScatteredPaths.forEach(relPath => {
  const fullPath = path.join(internalSkillsDir, relPath);
  if (fs.existsSync(fullPath)) {
    rmDirSync(fullPath);
    deletedPhysicalDirsCount++;
    console.log(`  [物理清理] 删除了老散落物理文件夹: internal-skills/${relPath}`);
  }
});

console.log(`✓ 物理副本清理完毕，共清除了 ${deletedPhysicalDirsCount} 个多余的物理文件夹。`);

// 2. 清理 skills-manifest.json，移除包含老物理路径的技能注册项，仅保留 canonical 路径（即 agent-skills/ 下的副本）
if (fs.existsSync(manifestPath)) {
  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    const uniqueSkills = [];
    const idsSeen = new Set();

    manifest.skills.forEach(s => {
      // 检查物理路径是否真实存在
      const absPath = path.resolve(rootDir, s.instructionPath);
      if (!fs.existsSync(absPath)) {
        console.log(`  [配置清理] 移除了已删除老路径的清单项: ${s.id} (${s.instructionPath})`);
        return;
      }

      // 如果是 agent-skills 里的子项，我们为其在清单中保留 canonical 状态
      // 如果它出现在外面（例如不在 agent-skills/ 下，却与 agent-skills/ 下的子项同名），我们应该将其剔除
      const isAgentSkillSub = s.instructionPath.includes('agent-skills/');
      const hasCanonicalSubInAgentSkills = manifest.skills.some(other => 
        other.id === s.id && other.instructionPath.includes('agent-skills/')
      );

      if (!isAgentSkillSub && hasCanonicalSubInAgentSkills) {
        console.log(`  [配置清理] 移除了非 canonical 的老清单项: ${s.id} (${s.instructionPath})`);
        return;
      }

      // 检查 ID 重复
      if (idsSeen.has(s.id.toLowerCase())) {
        console.log(`  [配置清理] 移除了重复声明的清单项: ${s.id} (${s.instructionPath})`);
        return;
      }

      uniqueSkills.push(s);
      idsSeen.add(s.id.toLowerCase());
    });

    manifest.skills = uniqueSkills;
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
    console.log('✓ skills-manifest.json 清单清理完毕。');
  } catch (e) {
    console.error('清理 manifest 错误:', e.message);
  }
}

// 3. 运行第三轮相对链接修复，确保所有 Markdown 的相对引用都更新为 agent-skills/ 内部子路径
console.log('🚀 运行最终轮链接定向校准...');
const allMdFiles = [];
function traverseMd(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(f => {
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (f !== 'node_modules' && f !== '.git' && f !== '.codegraph') {
        traverseMd(full);
      }
    } else if (f.endsWith('.md')) {
      allMdFiles.push(full);
    }
  });
}
traverseMd(rootDir);

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
let fixedLinksCount = 0;

allMdFiles.forEach(file => {
  const relFile = path.relative(rootDir, file).replace(/\\/g, '/');
  if (relFile.startsWith('scripts/')) return;

  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // 匹配形式：\[([^\]]+)\]\(([^)]+)\)
  // 看括号里的相对路径是不是已经指向了已被删除的老路径
  // 如果是，从 manifest 中找到该技能的新 instructionPath 并重新计算相对路径
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  
  content = content.replace(linkRegex, (match, text, url) => {
    // 过滤掉网络链接与锚点链接
    if (url.startsWith('http') || url.startsWith('#')) return match;

    // 解析出 url 指向的绝对路径，并看其物理存在性
    const targetAbsPath = path.resolve(path.dirname(file), url);
    const exists = fs.existsSync(targetAbsPath);

    if (!exists) {
      // 链接损坏了！试图根据文本或者 url 中的 id 重新寻找
      const cleanText = text.trim().toLowerCase();
      let targetSkill = manifest.skills.find(s => 
        s.id.toLowerCase() === cleanText ||
        s.name.toLowerCase() === cleanText ||
        (s.aliases && s.aliases.some(a => a.toLowerCase() === cleanText))
      );

      if (!targetSkill) {
        // 根据 URL 中的文件名寻找
        const lastPart = url.split('/').pop().replace(/\.[a-zA-Z]+$/, '');
        targetSkill = manifest.skills.find(s => s.id.toLowerCase() === lastPart.toLowerCase());
      }

      if (targetSkill) {
        const correctAbsPath = path.resolve(rootDir, targetSkill.instructionPath);
        const correctRelPath = path.relative(path.dirname(file), correctAbsPath).replace(/\\/g, '/');
        fixedLinksCount++;
        return `[${text}](${correctRelPath})`;
      }
    }
    return match;
  });

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
  }
});

console.log(`✓ 定向修复了 ${fixedLinksCount} 处受文件清理影响的失效链接。`);
console.log('🎉 最终轮清理与校准圆满完成！');
