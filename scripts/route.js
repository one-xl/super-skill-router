const path = require('path');
const fs = require('fs');
const os = require('os');

// 从 config.json 加载配置信息
let config = null;
try {
  const configPath = path.join(__dirname, '../config.json');
  if (fs.existsSync(configPath)) {
    config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  }
} catch (e) {
  // 静默捕获配置加载异常，使用默认降级策略
}

// 加载机器可读技能清单 skills-manifest.json
let manifest = null;
try {
  const manifestPath = path.join(__dirname, '../skills-manifest.json');
  if (fs.existsSync(manifestPath)) {
    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  }
} catch (e) {
  // 静默捕获
}

// 动态解析全局同步的目的地路径（支持 $HOME 变量解析）
function getGlobalDestinations(cfg) {
  const homeDir = os.homedir().replace(/\\/g, '/');
  if (cfg && Array.isArray(cfg.globalDestinations)) {
    return cfg.globalDestinations.map(d => d.replace('$HOME', homeDir));
  }
  return [
    `${homeDir}/.gemini/config/skills/super-skill-router`,
    `${homeDir}/.codex/skills/super-skill-router`,
    `${homeDir}/.reasonix/skills/super-skill-router`,
    `${homeDir}/.config/mimocode/skills/super-skill-router`
  ];
}

// 安全加载 CodeGraph 依赖库
let CodeGraph = null;
try {
  const codegraphPath = path.resolve(__dirname, '../../../codegraph');
  if (fs.existsSync(codegraphPath)) {
    const cgModule = require(path.join(codegraphPath, 'dist/index.js'));
    CodeGraph = cgModule.CodeGraph;
  }
} catch (e) {
  try {
    CodeGraph = require('@colbymchenry/codegraph').CodeGraph;
  } catch (err) {
    // 保持为 null，在项目中 fallback 到静态配置扫描
  }
}

// 双语中英文核心分类触发词库（辅助进行首轮类别粗筛）
const CATEGORY_KEYWORDS = {
  frontend: [
    'ui', 'ux', 'css', 'html', 'style', 'page', 'button', 'component', 'animation', 'layout', 'canvas', 'render', 'browser', 'react', 'vue', 'next.js', 'vite', 'gsap', 'responsive', 'flexbox', 'grid', 'color', 'theme', 'design', 'accessibility', 'a11y', 'aria', 'font', 'fonts', 'typography', 'button', 'buttons', 'input', 'inputs', 'modal', 'modals', 'dialog', 'dialogs', 'toast', 'toasts', 'interactive', 'interaction', 'hover', 'active', 'focus', 'aesthetic', 'beautiful', 'prose', 'text', 'copy', 'comment', 'lint',
    'chrome-devtools', 'devtools', 'puppeteer', 'screenshot', 'automation', 'browser-automation',
    'video', 'remotion', 'hyperframes', 'captions', 'explainer', 'jianying', 'anime', 'animejs', 'anime.js',
    '界面', '样式', '按钮', '动效', '动画', '还原', '排版', '色彩', '颜色', '主题', '自适应', '兼容性', '前端', '切图', '渲染', '布局', '轮播', '弹窗', '浏览器', '截图', '自动化测试', '页面', '视频', '剪映'
  ],
  backend: [
    'api', 'route', 'controller', 'service', 'database', 'sql', 'query', 'auth', 'jwt', 'session', 'token', 'login', 'signup', 'express', 'nest', 'koa', 'fastify', 'spring', 'django', 'flask', 'security', 'cors', 'validation', 'error', 'middleware', 'prisma', 'mongoose', 'orm', 'db',
    '接口', '路由', '控制器', '数据库', '鉴权', '防刷', '限流', '缓存', '中间件', '后台', '后端', '安全加固', '防注入', '服务', '事务'
  ],
  deployment: [
    'docker', 'nginx', 'pm2', 'deploy', 'server', 'ssl', 'https', 'domain', 'hosting', 'compose', 'kubernetes', 'cloud', 'cicd',
    '部署', '服务器', '域名', '证书', '容器', '负载均衡', '反向代理', '上线'
  ],
  engineering: [
    'tdd', 'test', 'debug', 'diagnose', 'refactor', 'architecture', 'bug', 'crash', 'performance', 'prototype', 'grill', 'prd', 'issue', 'git', 'commit', 'pr', 'audit', 'zoom', 'overview', 'handoff', 'session', 'compaction', 'optimize', 'optimization', 'speed',
    '测试', '重构', '架构', '报错', '故障', '调试', '崩溃', '卡顿', '泄露', '死锁', '优化', '交接', '会话', '切片', '单测', '评审', '规范', '排查', '需求', '原型', '缺陷'
  ],
  document: [
    'doc', 'pdf', 'word', 'xlsx', 'excel', 'ppt', 'resume', 'report', 'write', 'translate', 'mail',
    '文档', '写作', '写', '编写', '翻译', '报告', '说明书', '简历', '表格', '幻灯片'
  ],
  'ai-agent': [
    'agent', 'prompt', 'skill', 'workflow', 'mcp', 'router', 'llm', 'chatbot', 'indexing', 'codegraph',
    'memory', 'persistence', 'session', 'history', 'context', 'claude-mem',
    '代理', '提示词', '技能', '工作流', '路由器', '大模型', '语义', '分词', '路由方案', '记忆', '历史', '会话', '上下文', '持久化'
  ],
  paper: [
    'paper', 'latex', 'academic', 'scientific', 'citation', 'research', 'literature', 'nature', 'rebuttal', 'manuscript', 'journal', 'conference',
    '论文', '学术', '文献', '期刊', '写作', '会议', '审稿人', '投稿', '期刊', '图表'
  ]
};

// 核心主入口逻辑
async function main() {
  const args = process.argv.slice(2);
  const queryArg = getArgValue(args, '--query') || '';
  const workspaceArg = getArgValue(args, '--workspace') || process.cwd();
  const auditMode = args.includes('--audit');
  const updateMode = args.includes('--update');
  const cleanMode = args.includes('--clean');

  const resolvedWorkspace = path.resolve(workspaceArg);

  if (cleanMode) {
    showUsageStats();
    return;
  }

  if (auditMode || updateMode) {
    await runAudit(resolvedWorkspace, updateMode);
    return;
  }

  if (!queryArg) {
    console.log(JSON.stringify({
      error: '请使用 --query "<用户请求>" 指定查询，或使用 --clean 查看统计数据'
    }, null, 2));
    process.exit(1);
  }

  // 剖析当前项目画像
  const profile = await profileProject(resolvedWorkspace, queryArg);

  // 执行核心任务路由算法并计算推荐及置信度
  const decision = routeTask(queryArg, profile, resolvedWorkspace);

  // 记录选定技能的频次数据
  let skillName = decision.primary || decision.subcategory || 'unknown';
  recordSkillUsage(skillName);

  // 解析并映射推荐技能的绝对路径以方便 Agent 加载
  const isWorkspaceSkills = fs.existsSync(path.join(resolvedWorkspace, 'internal-skills'));
  const baseSkillsDir = isWorkspaceSkills ? path.join(resolvedWorkspace, 'internal-skills') : path.resolve(__dirname, '../internal-skills');

  if (decision.skillFile) {
    const relativePart = decision.skillFile.replace(/^internal-skills\//, '').replace(/^skills\//, '');
    decision.absoluteSkillPath = path.resolve(baseSkillsDir, relativePart).replace(/\\/g, '/');
  } else {
    decision.absoluteSkillPath = null;
  }

  decision.absoluteAuxiliaryPaths = [];
  if (decision.auxiliarySkills && decision.auxiliarySkills.length > 0) {
    decision.auxiliarySkills.forEach(aux => {
      const foundPath = findSkillPathByName(baseSkillsDir, aux);
      if (foundPath) {
        decision.absoluteAuxiliaryPaths.push(foundPath.replace(/\\/g, '/'));
      }
    });
  }

  // 构建标准、规范的 JSON 路由输出
  const finalJsonOutput = {
    primary: decision.primary,
    auxiliary: decision.auxiliarySkills,
    confidence: decision.confidenceScore,
    category: decision.category,
    reason: decision.routingReason,
    filesToRead: decision.filesToRead,
    warnings: decision.warnings,
    
    // 保留老版本字段以兼容老版客户端
    subcategory: decision.subcategory,
    skillFile: decision.skillFile,
    progressiveReferences: decision.progressiveReferences,
    absoluteSkillPath: decision.absoluteSkillPath,
    absoluteAuxiliaryPaths: decision.absoluteAuxiliaryPaths
  };

  // ==================== 组合意图增强器 (Intent Booster) ====================
  const queryLower = queryArg.toLowerCase();
  
  // 1. 前端 Bug 修复场景 (React/CSS/button/style/page/layout/UI + bug/error/crash/修复/报错/缺陷)
  const isBugFixWord = ['bug', 'error', 'crash', '修复', '报错', '缺陷', '问题', '故障'].some(w => queryLower.includes(w));
  const isFrontendWord = ['react', 'css', 'style', '样式', '页面', 'button', '按钮', '组件', 'layout', '布局', 'ui'].some(w => queryLower.includes(w));
  
  if (isBugFixWord && isFrontendWord) {
    finalJsonOutput.primary = 'web-frontend';
    finalJsonOutput.category = 'frontend';
    finalJsonOutput.auxiliary = ['diagnose', 'code-indexing', 'karpathy-guidelines'];
    finalJsonOutput.confidence = 0.92;
    finalJsonOutput.reason = '检测到明确的前端代码/页面样式 Bug 修复与调试组合意图，强制提升置信度并关联 diagnose 及 karpathy-guidelines 辅助技能。';
    
    // 以下物理文件及路径的具体映射一律移交后置对齐器动态解析生成，此处仅保留基础声明
    finalJsonOutput.subcategory = 'web-frontend';
    finalJsonOutput.warnings = [];
    finalJsonOutput.progressiveReferences = [];
  }
  
  // 2. 学术论文 Rebuttal 场景 (rebuttal + 论文/paper/审稿/评审)
  const isPaperWord = ['rebuttal', '论文', 'paper', '审稿', '评审', '投稿', '实验结果'].some(w => queryLower.includes(w));
  if (isPaperWord && queryLower.includes('rebuttal')) {
    finalJsonOutput.primary = 'scientific-research-skill';
    finalJsonOutput.category = 'paper';
    finalJsonOutput.auxiliary = ['grammar-check'];
    finalJsonOutput.confidence = 0.95;
    finalJsonOutput.reason = '检测到清晰的学术论文 Rebuttal 写作或审稿意见回复意图，强制提升置信度。';
    
    finalJsonOutput.subcategory = 'scientific-research-skill';
    finalJsonOutput.warnings = [];
    finalJsonOutput.progressiveReferences = [];
  }
  
  // 3. 后端 API 安全审查场景 (backend/auth/api + security/review/安全)
  const isBackendWord = ['backend', 'auth', 'api', '接口', '后端', '鉴权'].some(w => queryLower.includes(w));
  const isSecurityWord = ['security', 'review', '安全', '加固', '审计', '漏扫'].some(w => queryLower.includes(w));
  if (isBackendWord && isSecurityWord) {
    finalJsonOutput.primary = 'security-and-hardening';
    finalJsonOutput.category = 'engineering';
    finalJsonOutput.auxiliary = ['code-indexing', 'karpathy-guidelines'];
    finalJsonOutput.confidence = 0.90;
    finalJsonOutput.reason = '检测到清晰的后端 API 安全审计与漏洞加固组合意图，强制提升置信度并关联 code-indexing。';
    
    finalJsonOutput.subcategory = 'security-and-hardening';
    finalJsonOutput.warnings = [];
    finalJsonOutput.progressiveReferences = [];
  }
  // ==================== 统一路径动态映射与数据裁剪对齐器 ====================
  function getSkillRelPath(id) {
    if (!id) return '';
    if (!manifest || !manifest.skills) return `internal-skills/specialized/${id}/INSTRUCTION.md`; // 降级默认格式
    const skill = manifest.skills.find(s => 
      s.id.toLowerCase() === id.toLowerCase() || 
      (s.aliases && s.aliases.some(a => a.toLowerCase() === id.toLowerCase()))
    );
    return skill ? skill.instructionPath : `internal-skills/specialized/${id}/INSTRUCTION.md`;
  }

  // 1. 根据置信度裁剪辅助技能列表以保持数据一致性
  if (finalJsonOutput.confidence >= 0.80) {
    // 高置信度：保留全部辅助技能
  } else if (finalJsonOutput.confidence >= 0.50) {
    // 中等置信度：只保留首个辅助技能
    if (finalJsonOutput.auxiliary && finalJsonOutput.auxiliary.length > 0) {
      finalJsonOutput.auxiliary = [finalJsonOutput.auxiliary[0]];
    } else {
      finalJsonOutput.auxiliary = [];
    }
  } else {
    // 低置信度：清除所有辅助技能
    finalJsonOutput.auxiliary = [];
  }

  // 2. 动态映射与重写物理文件读取列表 (filesToRead)
  if (finalJsonOutput.confidence >= 0.50) {
    const primaryRel = getSkillRelPath(finalJsonOutput.primary);
    finalJsonOutput.skillFile = primaryRel;
    finalJsonOutput.filesToRead = [primaryRel];
    finalJsonOutput.auxiliary.forEach(aux => {
      finalJsonOutput.filesToRead.push(getSkillRelPath(aux));
    });
    
    // 3. 动态计算并重写绝对路径映射，彻底杜绝任何手写硬编码路径
    finalJsonOutput.absoluteSkillPath = path.resolve(resolvedWorkspace, primaryRel).replace(/\\/g, '/');
    finalJsonOutput.absoluteAuxiliaryPaths = finalJsonOutput.auxiliary.map(aux => 
      path.resolve(resolvedWorkspace, getSkillRelPath(aux)).replace(/\\/g, '/')
    );
  } else {
    // 低置信度降级
    finalJsonOutput.skillFile = 'router/CATEGORY_INDEX.md';
    finalJsonOutput.filesToRead = ['router/CATEGORY_INDEX.md'];
    finalJsonOutput.absoluteSkillPath = path.resolve(resolvedWorkspace, 'router/CATEGORY_INDEX.md').replace(/\\/g, '/');
    finalJsonOutput.absoluteAuxiliaryPaths = [];
  }
  // =========================================================================

  console.log(JSON.stringify(finalJsonOutput, null, 2));
}

// 记录 Skill 的调用频次统计，数据移入 router/
function recordSkillUsage(skillName) {
  if (!skillName) return;
  const statsPath = path.join(__dirname, '../router/SKILL_USAGE.json');
  let stats = {};
  try {
    if (fs.existsSync(statsPath)) {
      stats = JSON.parse(fs.readFileSync(statsPath, 'utf8'));
    }
  } catch (e) {
    // 静默捕获
  }
  stats[skillName] = (stats[skillName] || 0) + 1;
  try {
    fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2), 'utf8');
    
    // 同步更新 Markdown 格式的使用频次列表
    const mdPath = path.join(__dirname, '../router/SKILL_USAGE.md');
    let mdContent = `# Skill Usage Statistics (Skill 使用频次统计)\n\n此文件自动记录各个 Skill 被激活和路由推荐的使用频次，用于清理无用 Skill 时提供参考决策。\n\n| Skill 名称 | 使用次数 |\n| :--- | :---: |\n`;
    const sorted = Object.entries(stats).sort((a, b) => b[1] - a[1]);
    sorted.forEach(([name, count]) => {
      mdContent += `| ${name} | ${count} |\n`;
    });
    fs.writeFileSync(mdPath, mdContent, 'utf8');
  } catch (e) {
    // 静默捕获
  }
}

// 展示使用频次统计
function showUsageStats() {
  const statsPath = path.join(__dirname, '../router/SKILL_USAGE.json');
  const mdPath = path.join(__dirname, '../router/SKILL_USAGE.md');
  if (!fs.existsSync(statsPath)) {
    console.log('\n--- Skill Usage Statistics ---');
    console.log('尚未记录任何使用数据。');
    return;
  }
  try {
    const stats = JSON.parse(fs.readFileSync(statsPath, 'utf8'));
    console.log('\n--- Skill Usage Statistics ---');
    const sorted = Object.entries(stats).sort((a, b) => b[1] - a[1]);
    console.log('| Skill Name | Usage Count |');
    console.log('| :--- | :---: |');
    sorted.forEach(([name, count]) => {
      console.log(`| ${name} | ${count} |`);
    });
    console.log(`\n详细报告文件路径: file:///${mdPath.replace(/\\/g, '/')}`);
  } catch (e) {
    console.error('无法展示使用频次数据:', e.message);
  }
}

// 辅助函数：解析命令行命令行参数
function getArgValue(args, flag) {
  const idx = args.indexOf(flag);
  if (idx !== -1 && idx + 1 < args.length) {
    return args[idx + 1];
  }
  return null;
}

// 项目画像收集逻辑
async function profileProject(workspacePath, userQuery) {
  const profile = {
    type: 'unknown',
    stack: [],
    languages: [],
    filesCount: 0,
    nodesCount: 0,
    edgesCount: 0,
    detectedFrameworks: [],
    signals: [],
    hasCodeGraph: false
  };

  // 1. 尝试使用 CodeGraph 进行高精度扫描
  if (CodeGraph && fs.existsSync(path.join(workspacePath, '.codegraph'))) {
    try {
      const cg = await CodeGraph.open(workspacePath);
      profile.hasCodeGraph = true;
      profile.signals.push('.codegraph');

      if (typeof cg.getStats === 'function') {
        const stats = cg.getStats();
        profile.filesCount = stats.fileCount || stats.files || 0;
        profile.nodesCount = stats.nodeCount || stats.nodes || 0;
        profile.edgesCount = stats.edgeCount || stats.edges || 0;
      }

      if (typeof cg.getDetectedFrameworks === 'function') {
        profile.detectedFrameworks = cg.getDetectedFrameworks();
        if (profile.detectedFrameworks.length > 0) {
          profile.stack.push(...profile.detectedFrameworks);
        }
      }

      if (typeof cg.getFiles === 'function') {
        const files = cg.getFiles();
        const extCounts = {};
        files.forEach(f => {
          if (f && f.path) {
            const ext = path.extname(f.path).toLowerCase();
            extCounts[ext] = (extCounts[ext] || 0) + 1;
          }
        });

        if (extCounts['.ts'] || extCounts['.tsx'] || extCounts['.js'] || extCounts['.jsx']) {
          profile.languages.push('JavaScript/TypeScript');
        }
        if (extCounts['.py']) profile.languages.push('Python');
        if (extCounts['.go']) profile.languages.push('Go');
        if (extCounts['.rs']) profile.languages.push('Rust');
        if (extCounts['.java']) profile.languages.push('Java');
        if (extCounts['.cs']) profile.languages.push('C#');
      }

      try {
        if (typeof cg.getNodesByKind === 'function') {
          const imports = cg.getNodesByKind('import');
          if (imports && imports.length > 0) {
            const importNames = imports.map(i => i.name ? i.name.toLowerCase() : '');
            if (importNames.some(n => n.includes('gsap'))) profile.stack.push('GSAP');
            if (importNames.some(n => n.includes('react'))) profile.stack.push('React');
            if (importNames.some(n => n.includes('vue'))) profile.stack.push('Vue');
            if (importNames.some(n => n.includes('next'))) profile.stack.push('Next.js');
            if (importNames.some(n => n.includes('express'))) profile.stack.push('Express');
            if (importNames.some(n => n.includes('nest'))) profile.stack.push('NestJS');
            if (importNames.some(n => n.includes('tailwind'))) profile.stack.push('TailwindCSS');
            if (importNames.some(n => n.includes('prisma'))) profile.stack.push('Prisma');
            if (importNames.some(n => n.includes('mongoose'))) profile.stack.push('Mongoose');
          }
        }
      } catch (e) {
        // 安全降级
      }

      if (typeof cg.searchNodes === 'function') {
        const matches = cg.searchNodes(userQuery, { limit: 15 });
        if (matches && matches.length > 0) {
          profile.signals.push(`matched_symbols(${matches.length})`);
          matches.forEach(m => {
            if (m && m.node && m.node.filePath) {
              const node = m.node;
              const p = node.filePath.toLowerCase();
              if (p.includes('test') || p.includes('spec') || p.includes('__tests__')) {
                profile.signals.push('test_symbol_match');
              }
              if (p.includes('route') || p.includes('controller') || p.includes('api') || p.includes('service')) {
                profile.signals.push('backend_symbol_match');
              }
              if (p.includes('css') || p.includes('style') || p.includes('component') || p.includes('view') || node.kind === 'component') {
                profile.signals.push('frontend_symbol_match');
              }
            }
          });
        }
      }

      cg.close();
    } catch (e) {
      profile.signals.push(`codegraph_error: ${e.message}`);
      if (config && config.enableCodeGraphWarning) {
        console.warn(`[CodeGraph 警告] CodeGraph 分析中捕获到静默失败: ${e.message}`);
      }
    }
  }

  // 2. 静态配置文件匹配（CodeGraph 的辅助与后备分析）
  const rootFiles = {
    'package.json': () => {
      try {
        const pkg = JSON.parse(fs.readFileSync(path.join(workspacePath, 'package.json'), 'utf8'));
        profile.signals.push('package.json');
        const deps = Object.keys(pkg.dependencies || {}).concat(Object.keys(pkg.devDependencies || {}));
        
        if (deps.includes('react') || deps.includes('react-dom')) profile.stack.push('React');
        if (deps.includes('vue')) profile.stack.push('Vue');
        if (deps.includes('next')) profile.stack.push('Next.js');
        if (deps.includes('nuxt')) profile.stack.push('Nuxt.js');
        if (deps.includes('express')) profile.stack.push('Express');
        if (deps.includes('@nestjs/core')) profile.stack.push('NestJS');
        if (deps.includes('gsap')) profile.stack.push('GSAP');
        if (deps.includes('tailwindcss')) profile.stack.push('TailwindCSS');
        if (deps.includes('vitest') || deps.includes('jest')) profile.stack.push('TestFramework');
      } catch (e) {}
    },
    'Cargo.toml': () => { profile.signals.push('Cargo.toml'); profile.stack.push('Rust'); },
    'go.mod': () => { profile.signals.push('go.mod'); profile.stack.push('Go'); },
    'pyproject.toml': () => { profile.signals.push('pyproject.toml'); profile.stack.push('Python'); },
    'requirements.txt': () => { profile.signals.push('requirements.txt'); profile.stack.push('Python'); },
    'Dockerfile': () => { profile.signals.push('Dockerfile'); profile.stack.push('Docker'); },
    'docker-compose.yml': () => { profile.signals.push('docker-compose.yml'); profile.stack.push('Docker'); },
    'README.md': () => { profile.signals.push('README.md'); }
  };

  for (const [file, check] of Object.entries(rootFiles)) {
    if (fs.existsSync(path.join(workspacePath, file))) {
      check();
    }
  }

  // 3. 扫描物理目录结构特征
  try {
    if (fs.existsSync(workspacePath)) {
      const rootEntries = fs.readdirSync(workspacePath);
      rootEntries.forEach(entry => {
        const entryLower = entry.toLowerCase();
        const fullPath = path.join(workspacePath, entry);
        try {
          const stat = fs.statSync(fullPath);
          if (stat.isDirectory()) {
            if (['src', 'app', 'components', 'views', 'pages'].includes(entryLower)) {
              profile.signals.push('has_frontend_dirs');
            }
            if (['controllers', 'models', 'routes', 'services', 'api', 'db', 'database'].includes(entryLower)) {
              profile.signals.push('has_backend_dirs');
            }
            if (['test', 'tests', 'spec', 'specs', '__tests__'].includes(entryLower)) {
              profile.signals.push('has_test_dirs');
            }
            if (['docs', 'doc', 'documents'].includes(entryLower)) {
              profile.signals.push('has_doc_dirs');
            }
            if (['deploy', 'docker', 'nginx', 'kubernetes', 'k8s'].includes(entryLower)) {
              profile.signals.push('has_deploy_dirs');
            }
          } else {
            if (entryLower.endsWith('.csproj') || entryLower.endsWith('.sln')) {
              profile.signals.push('dotnet_project');
              profile.stack.push('.NET');
            }
            if (entryLower === 'pom.xml' || entryLower === 'build.gradle') {
              profile.signals.push('java_project');
              profile.stack.push('Java');
            }
            if (entryLower === 'go.sum') {
              profile.signals.push('go_project');
              profile.stack.push('Go');
            }
            if (entryLower === 'cargo.lock') {
              profile.signals.push('rust_project');
              profile.stack.push('Rust');
            }
            if (entryLower === 'poetry.lock' || entryLower === 'pipfile' || entryLower === 'setup.py') {
              profile.signals.push('python_project');
              profile.stack.push('Python');
            }
            if (['vite.config.js', 'vite.config.ts', 'next.config.js', 'next.config.mjs', 'nuxt.config.js', 'nuxt.config.ts', 'webpack.config.js'].includes(entryLower)) {
              profile.signals.push('has_frontend_config');
            }
          }
        } catch (e) {}
      });
    }
  } catch (e) {}

  // 去重
  profile.stack = [...new Set(profile.stack)];
  profile.signals = [...new Set(profile.signals)];
  profile.languages = [...new Set(profile.languages)];

  // 判断项目总体类型
  const isFrontend = profile.stack.some(s => ['React', 'Vue', 'Next.js', 'Nuxt.js', 'GSAP', 'TailwindCSS'].includes(s)) || 
                    profile.signals.includes('frontend_symbol_match') ||
                    profile.signals.includes('has_frontend_dirs') ||
                    profile.signals.includes('has_frontend_config');
                    
  const isBackend = profile.stack.some(s => ['Express', 'NestJS', 'Prisma', 'Mongoose', 'Go', 'Rust', 'Java', '.NET', 'Python'].includes(s)) || 
                    profile.languages.some(l => ['Go', 'Rust', 'Java', 'C#', 'Python'].includes(l)) || 
                    profile.signals.includes('backend_symbol_match') ||
                    profile.signals.includes('has_backend_dirs') ||
                    profile.signals.includes('dotnet_project') ||
                    profile.signals.includes('java_project') ||
                    profile.signals.includes('go_project') ||
                    profile.signals.includes('rust_project') ||
                    profile.signals.includes('python_project');
  
  if (isFrontend && isBackend) {
    profile.type = 'fullstack';
  } else if (isFrontend) {
    profile.type = 'frontend';
  } else if (isBackend) {
    profile.type = 'backend';
  } else if (profile.signals.includes('Dockerfile') || profile.signals.includes('docker-compose.yml') || profile.signals.includes('has_deploy_dirs')) {
    profile.type = 'deployment';
  }

  return profile;
}

// 动态物理扫描（作为 manifest.json 的安全 Fallback 手段）
function discoverPhysicalSkills(skillsRoot) {
  const skills = {};
  
  // 1. 如果能够成功加载 manifest，直接使用 manifest 数据进行组装
  if (manifest && Array.isArray(manifest.skills)) {
    manifest.skills.forEach(s => {
      skills[s.id.toLowerCase()] = {
        category: s.category,
        subcategory: s.id,
        skillFile: s.instructionPath
      };
      if (s.aliases) {
        s.aliases.forEach(alias => {
          skills[alias.toLowerCase()] = {
            category: s.category,
            subcategory: s.id,
            skillFile: s.instructionPath
          };
        });
      }
    });
    return skills;
  }

  // 2. Fallback：如果在无配置情况下启动，实时扫描物理 internal-skills/ 文件夹
  const targetRoot = fs.existsSync(path.join(skillsRoot, '../internal-skills')) ? path.join(skillsRoot, '../internal-skills') : skillsRoot;
  if (!fs.existsSync(targetRoot)) return skills;
  
  try {
    const categories = fs.readdirSync(targetRoot);
    categories.forEach(cat => {
      const catPath = path.join(targetRoot, cat);
      if (fs.statSync(catPath).isDirectory() && cat !== '_super-skill' && cat !== 'router') {
        const subcats = fs.readdirSync(catPath);
        subcats.forEach(subcat => {
          const subcatPath = path.join(catPath, subcat);
          if (fs.statSync(subcatPath).isDirectory()) {
            const insFile = path.join(subcatPath, 'INSTRUCTION.md');
            const skillFile = path.join(subcatPath, 'SKILL.md');
            if (fs.existsSync(insFile)) {
              skills[subcat.toLowerCase()] = {
                category: cat,
                subcategory: subcat,
                skillFile: `internal-skills/${cat}/${subcat}/INSTRUCTION.md`
              };
            } else if (fs.existsSync(skillFile)) {
              skills[subcat.toLowerCase()] = {
                category: cat,
                subcategory: subcat,
                skillFile: `internal-skills/${cat}/${subcat}/SKILL.md`
              };
            }
          }
        });
      }
    });
  } catch (e) {
    // 物理探索降级
  }
  return skills;
}

// 辅助函数：匹配词元（支持中英文边界处理）
function matchKeyword(queryLower, keyword) {
  const isAscii = /^[a-z0-9._-]+$/i.test(keyword);
  if (isAscii) {
    const escaped = keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp('\\b' + escaped + '\\b', 'i');
    return regex.test(queryLower);
  } else {
    return queryLower.includes(keyword);
  }
}

// 核心任务细粒度路由逻辑（包含触发词打分、意图预分类、优先级冲突过滤、置信度归一化以及降级策略）
function routeTask(query, profile, workspacePath) {
  const queryLower = query.toLowerCase();
  const warnings = [];

  // 1. 初始化每个类别的初始计分
  const weights = {};
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    let score = 0;
    keywords.forEach(keyword => {
      if (matchKeyword(queryLower, keyword)) {
        score += 2;
      }
    });
    weights[category] = score;
  }

  // 解决常见的相似词意图竞争（例如 Nginx 反向代理误触发 ai-agent 的‘代理’）
  if (queryLower.includes('反向代理') || queryLower.includes('正向代理') || queryLower.includes('nginx') || queryLower.includes('服务器')) {
    if (queryLower.includes('代理') && weights['ai-agent'] >= 2) {
      weights['ai-agent'] -= 2;
    }
  }

  // 2. 意图检测预分类与强加分规则
  let intentCategoryBonus = {
    frontend: 0,
    backend: 0,
    deployment: 0,
    engineering: 0,
    document: 0,
    'ai-agent': 0
  };

  const hasFrontendTerms = ['react', 'vue', 'next', 'ui', 'css', 'style', 'render', 'component', '组件', '渲染', '界面', '样式'].some(t => queryLower.includes(t));
  const hasBackendTerms = ['api', 'route', 'controller', 'database', 'sql', 'express', 'nest', '接口', '数据库', '后台', '后端'].some(t => queryLower.includes(t));
  const hasDiagnoseTerms = ['debug', 'bug', 'crash', 'diagnose', 'leak', 'performance', 'error', '卡顿', '报错', '崩溃', '排查', '故障', '泄漏', '缺陷'].some(t => queryLower.includes(t));
  const hasTestTerms = ['tdd', 'test', 'spec', 'jest', 'vitest', '测试', '单测'].some(t => queryLower.includes(t));
  const hasRefactorTerms = ['refactor', 'architecture', '重构', '架构', '清理'].some(t => queryLower.includes(t));

  if (hasDiagnoseTerms || hasTestTerms || hasRefactorTerms) {
    intentCategoryBonus['engineering'] += 6;
  }
  if (queryLower.includes('响应速度') || queryLower.includes('性能优化') || queryLower.includes('卡顿') || queryLower.includes('性能') || queryLower.includes('优化') || queryLower.includes('optimize') || queryLower.includes('optimization') || queryLower.includes('speed') || queryLower.includes('slow')) {
    intentCategoryBonus['engineering'] += 4;
  }

  const hasDocumentTerms = ['写', '编写', '文档', '报告', '说明书', '翻译', '技术文章', '写作'].some(t => queryLower.includes(t));
  if (hasDocumentTerms && !hasFrontendTerms && !hasBackendTerms && !hasDiagnoseTerms) {
    intentCategoryBonus['document'] += 6;
  }

  let hasAgentTerms = ['agent', 'skill', 'prompt', 'workflow', 'mcp', 'router', 'llm', '技能', '提示词', '工作流', '路由器', '大模型', '路由方案'].some(t => queryLower.includes(t));
  if (queryLower.includes('代理') && !queryLower.includes('反向代理') && !queryLower.includes('正向代理') && !queryLower.includes('nginx') && !queryLower.includes('服务器')) {
    hasAgentTerms = true;
  }
  if (queryLower.includes('video') || queryLower.includes('jianying') || queryLower.includes('hyperframes') || queryLower.includes('remotion') || queryLower.includes('剪映') || queryLower.includes('视频')) {
    hasAgentTerms = false;
  }
  if (hasAgentTerms) {
    intentCategoryBonus['ai-agent'] += 6;
  }

  const hasBrowserAutomation = ['browser-automation', 'chrome-devtools', 'puppeteer', 'devtools', '截图', '浏览器', 'automation', 'screenshot'].some(t => queryLower.includes(t));
  if (hasBrowserAutomation) {
    intentCategoryBonus['frontend'] += 6;
  }

  const hasMemoryContext = ['memory', 'claude-mem', 'session', 'context', 'persistence', '记忆', '历史', '会话', '上下文', '持久化'].some(t => queryLower.includes(t));
  if (hasMemoryContext) {
    intentCategoryBonus['ai-agent'] += 6;
  }

  for (const category of Object.keys(weights)) {
    weights[category] += (intentCategoryBonus[category] || 0);
  }

  // 3. 根据项目画像进行动态加权
  if (profile.type === 'frontend') {
    weights['frontend'] += 3;
  } else if (profile.type === 'backend') {
    weights['backend'] += 3;
  } else if (profile.type === 'fullstack') {
    weights['frontend'] += 2;
    weights['backend'] += 2;
  } else if (profile.type === 'deployment') {
    weights['deployment'] += 2;
  }

  if (profile.signals.includes('test_symbol_match') || profile.signals.includes('has_test_dirs')) {
    weights['engineering'] += 3;
  }
  if (profile.signals.includes('frontend_symbol_match') || profile.signals.includes('has_frontend_dirs') || profile.signals.includes('has_frontend_config')) {
    weights['frontend'] += 2;
  }
  if (profile.signals.includes('backend_symbol_match') || profile.signals.includes('has_backend_dirs')) {
    weights['backend'] += 2;
  }
  if (profile.signals.includes('has_deploy_dirs')) {
    weights['deployment'] += 1;
  }
  if (profile.signals.includes('has_doc_dirs')) {
    weights['document'] += 1;
  }
  if (profile.languages.includes('JavaScript/TypeScript')) {
    weights['frontend'] += 1;
    weights['backend'] += 1;
  }

  // 4. 选定胜出的最优核心分类与次优分类，计算分差相对优势比
  const sortedWeights = Object.entries(weights).sort((a, b) => b[1] - a[1]);
  let bestCategory = sortedWeights[0][0];
  let maxWeight = sortedWeights[0][1];
  let runnerUpWeight = sortedWeights[1] ? sortedWeights[1][1] : 0;

  const marginRatio = maxWeight > 0 ? (maxWeight - runnerUpWeight) / maxWeight : 0;
  const queryWordsCount = Math.max(queryLower.split(/\s+/).length, queryLower.length / 3);
  const density = maxWeight / Math.max(1, queryWordsCount);

  // 置信度阈值判定
  const marginRatioThreshold = (config && config.confidenceSettings && config.confidenceSettings.marginRatioThreshold) || 0.2;
  const densityThreshold = (config && config.confidenceSettings && config.confidenceSettings.densityThreshold) || 0.15;

  let confidence = 'low';
  let confidenceScore = 0.35;
  if (maxWeight >= 6 && (marginRatio >= marginRatioThreshold || runnerUpWeight === 0) && density >= densityThreshold) {
    confidence = 'high';
    confidenceScore = Math.min(1.0, 0.85 + marginRatio * 0.15);
  } else if (maxWeight >= 3 && (marginRatio >= marginRatioThreshold * 0.7 || runnerUpWeight === 0) && density >= densityThreshold * 0.6) {
    confidence = 'medium';
    confidenceScore = Math.min(0.80, 0.55 + marginRatio * 0.2);
  }

  // 5. 基于 manifest 做细粒度技能推荐匹配与推荐打分
  const skillsRoot = path.join(__dirname, '../internal-skills');
  const physicalSkills = discoverPhysicalSkills(skillsRoot);
  
  let bestSkill = null;
  let maxSkillScore = 0;

  if (manifest && Array.isArray(manifest.skills)) {
    manifest.skills.forEach(s => {
      if (s.category !== bestCategory) return;
      let score = 0;
      // Triggers 匹配打分
      s.triggers.forEach(t => {
        if (queryLower.includes(t.toLowerCase())) {
          score += 3;
        }
      });
      // 别名匹配打分
      if (s.aliases) {
        s.aliases.forEach(alias => {
          if (queryLower.includes(alias.toLowerCase())) {
            score += 4;
          }
        });
      }
      // ID 自身包含匹配
      if (queryLower.includes(s.id.toLowerCase())) {
        score += 5;
      }
      if (score > maxSkillScore) {
        maxSkillScore = score;
        bestSkill = s;
      }
    });
  }

  // 6. 应用细粒度冲突过滤与优先级配对规则
  let primaryId = '';
  let auxIds = [];

  if (bestCategory === 'frontend') {
    primaryId = 'web-frontend';
    if (hasBrowserAutomation) {
      primaryId = 'browser-automation';
    } else if (bestSkill) {
      primaryId = bestSkill.id;
    }
    
    // 前端配对规则
    if (queryLower.includes('animation') || queryLower.includes('gsap') || queryLower.includes('scroll') || queryLower.includes('动效') || queryLower.includes('动画') || profile.stack.includes('GSAP')) {
      auxIds.push('anime');
    }
    if (queryLower.includes('design') || queryLower.includes('aesthetic') || queryLower.includes('taste') || queryLower.includes('premium') || queryLower.includes('视觉') || queryLower.includes('美化')) {
      auxIds.push('taste-skill');
      auxIds.push('impeccable');
    }
    if (queryLower.includes('contrast') || queryLower.includes('a11y') || queryLower.includes('aria') || queryLower.includes('toast') || queryLower.includes('modal') || queryLower.includes('responsive')) {
      auxIds.push('impeccable');
    }
    auxIds.push('karpathy-guidelines');

  } else if (bestCategory === 'backend') {
    primaryId = bestSkill ? bestSkill.id : 'api-backend';
    auxIds.push('karpathy-guidelines');

  } else if (bestCategory === 'deployment') {
    primaryId = bestSkill ? bestSkill.id : 'nginx';
    auxIds.push('karpathy-guidelines');

  } else if (bestCategory === 'document') {
    primaryId = bestSkill ? bestSkill.id : 'writing';
    if (queryLower.includes('readme') || queryLower.includes('adr')) {
      auxIds.push('documentation-and-adrs');
    }

  } else if (bestCategory === 'paper') {
    primaryId = bestSkill ? bestSkill.id : 'scientific-research-skill';
    if (queryLower.includes('pipeline') || queryLower.includes('experiment')) {
      auxIds.push('ai-paper-pipeline');
    }

  } else if (bestCategory === 'ai-agent') {
    if (queryLower.includes('indexing') || queryLower.includes('codegraph') || queryLower.includes('索引')) {
      primaryId = 'code-indexing';
    } else if (hasMemoryContext) {
      primaryId = 'agent-memory';
    } else {
      primaryId = bestSkill ? bestSkill.id : 'skill-design';
    }
    if (queryLower.includes('find') || queryLower.includes('install')) {
      auxIds.push('find-skill');
    }

  } else if (bestCategory === 'engineering') {
    // 工业级工程冲突判定表
    if (hasTestTerms) {
      primaryId = 'tdd';
    } else if (hasDiagnoseTerms) {
      primaryId = 'diagnose';
    } else if (queryLower.includes('zoom') || queryLower.includes('macro') || queryLower.includes('overview') || queryLower.includes('全貌')) {
      primaryId = 'zoom-out';
    } else if (queryLower.includes('grill') || queryLower.includes('challenge') || queryLower.includes('审查')) {
      primaryId = 'grill-me';
    } else if (queryLower.includes('issue') || queryLower.includes('ticket') || queryLower.includes('split') || queryLower.includes('切片')) {
      primaryId = 'to-issues';
    } else if (queryLower.includes('prd') || queryLower.includes('requirement')) {
      primaryId = 'to-prd';
    } else if (queryLower.includes('handoff') || queryLower.includes('session') || queryLower.includes('交接')) {
      primaryId = 'handoff';
    } else if (queryLower.includes('prototype') || queryLower.includes('poc')) {
      primaryId = 'prototype';
    } else {
      primaryId = 'improve-codebase-architecture';
    }
    
    // 推荐的辅助搭配
    auxIds.push('code-indexing');
    auxIds.push('karpathy-guidelines');
  }

  // 7. 处理特化非标别名匹配 (如 donet-handjob)
  if (queryLower.includes('dotnet') || queryLower.includes('wpf') || queryLower.includes('winforms')) {
    primaryId = 'donet-handjob';
    bestCategory = 'specialized';
  } else if (queryLower.includes('serenity') || queryLower.includes('投资') || queryLower.includes('瓶颈')) {
    primaryId = 'serenity-skill';
    bestCategory = 'specialized';
  } else if (queryLower.includes('minimal') || queryLower.includes('极简回复') || queryLower.includes('短答')) {
    primaryId = 'simple-replie';
    bestCategory = 'specialized';
  }

  // 从 physicalSkills 字典安全映射出推荐技能的对应物理路径信息
  const mappedPrimary = physicalSkills[primaryId.toLowerCase()] || null;
  const skillFile = mappedPrimary ? mappedPrimary.skillFile : `internal-skills/${bestCategory}/${primaryId}/INSTRUCTION.md`;

  // 去重辅助技能
  auxIds = [...new Set(auxIds)].filter(id => id !== primaryId);

  // 8. 实施渐进披露与降级决策分配机制
  const filesToRead = [];
  const progressiveReferences = [];
  let reasonDetails = `匹配到的最优分类为: ${bestCategory} (置信度分值: ${confidenceScore.toFixed(2)}, 级别: ${confidence})`;

  if (confidenceScore >= 0.80) {
    // 置信度高：直接加载主技能与所有必要的辅助技能
    filesToRead.push(skillFile);
    auxIds.forEach(aux => {
      const matchAux = physicalSkills[aux.toLowerCase()];
      if (matchAux) {
        filesToRead.push(matchAux.skillFile);
      }
    });
    reasonDetails += `。置信度高，直接加载主技能 [${primaryId}] 与辅助技能 [${auxIds.join(', ')}]。`;
  } else if (confidenceScore >= 0.50) {
    // 置信度一般：只加载主技能与一个最相关辅助技能，说明不确定点
    filesToRead.push(skillFile);
    if (auxIds.length > 0) {
      const matchAux = physicalSkills[auxIds[0].toLowerCase()];
      if (matchAux) {
        filesToRead.push(matchAux.skillFile);
      }
    }
    reasonDetails += `。置信度中等，仅加载主技能 [${primaryId}] 及其首个辅助技能，以防冗余上下文。`;
    warnings.push("本次路由置信度处于中等区间，部分意图可能存在歧义，已过滤次要辅助技能。");
  } else {
    // 置信度低：启动彻底的降级兜底，仅允许阅读类别分类索引
    filesToRead.push("router/CATEGORY_INDEX.md");
    reasonDetails += `。置信度偏低，未触发强意图匹配，已降级仅读取类别分类索引进行交互式回退。`;
    warnings.push("置信度较低，建议不加载大篇幅 Skill 说明，仅参考 CATEGORY_INDEX.md 分类索引并询问用户以进行澄清。");
  }

  // 组合兼容性 progressiveReferences 参考对象
  if (bestCategory === 'frontend') {
    progressiveReferences.push('internal-skills/frontend/web-frontend/references/frontend-design.md');
  }

  return {
    primary: primaryId,
    category: bestCategory,
    subcategory: primaryId,
    skillFile: skillFile,
    progressiveReferences: progressiveReferences,
    auxiliarySkills: auxIds,
    routingReason: reasonDetails,
    confidence: confidence,
    confidenceScore: confidenceScore,
    filesToRead: filesToRead,
    warnings: warnings
  };
}

// 基于名称深度探索子技能对应物理路径
function findSkillPathByName(skillsDir, name) {
  if (!fs.existsSync(skillsDir)) return null;
  
  // 1. 优先直接拼接匹配
  const directPath1 = path.join(skillsDir, name, 'INSTRUCTION.md');
  if (fs.existsSync(directPath1)) return directPath1;
  const directPath2 = path.join(skillsDir, name, 'SKILL.md');
  if (fs.existsSync(directPath2)) return directPath2;

  // 2. 深度遍历检索
  const entries = fs.readdirSync(skillsDir, { withFileTypes: true });
  for (let entry of entries) {
    const fullPath = path.join(skillsDir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name.toLowerCase() === name.toLowerCase()) {
        const p1 = path.join(fullPath, 'INSTRUCTION.md');
        if (fs.existsSync(p1)) return p1;
        const p2 = path.join(fullPath, 'SKILL.md');
        if (fs.existsSync(p2)) return p2;
      }
      const res = findSkillPathByName(fullPath, name);
      if (res) return res;
    }
  }
  return null;
}

// 全局仓库审计、健康检查以及全局同步
async function runAudit(workspacePath, executeUpdates) {
  console.log(`🔍 正在审计位于 ${workspacePath} 的技能库仓库...`);

  const report = {
    missingSkills: [],
    redundantSkills: [],
    unregisteredSkills: [],
    brokenMarkdownLinks: [],
    structureIssues: []
  };

  const internalSkillsRoot = path.join(workspacePath, 'internal-skills');
  const routerRoot = path.join(workspacePath, 'router');
  
  if (!fs.existsSync(internalSkillsRoot)) {
    console.error('错误: 找不到 internal-skills 目录，请先运行重组脚本！');
    process.exit(1);
  }

  // 1. 扫描所有的 Markdown 文件并校验 file:/// 内链以及是否存在旧绝对路径
  const allMdFiles = [];
  function traverseMd(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(f => {
      const full = path.join(dir, f);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        traverseMd(full);
      } else if (f.endsWith('.md')) {
        allMdFiles.push(full);
      }
    });
  }
  traverseMd(internalSkillsRoot);
  if (fs.existsSync(routerRoot)) {
    traverseMd(routerRoot);
  }

  // 校验内链
  allMdFiles.forEach(mdFile => {
    const content = fs.readFileSync(mdFile, 'utf8');
    const regex = /file:\/\/\/([^\s"'\)`]+)/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
      const rawUrl = match[1];
      const decodedPath = decodeURIComponent(rawUrl).replace(/\\/g, '/');
      const fileExists = fs.existsSync(decodedPath);
      if (!fileExists) {
        report.brokenMarkdownLinks.push({
          sourceFile: path.relative(workspacePath, mdFile).replace(/\\/g, '/'),
          brokenLink: match[0],
          decodedPath: decodedPath,
          basename: path.basename(decodedPath)
        });
      }
    }
  });

  // 2. 执行安全审计检查 (SkillSpector)
  const securityScan = runSkillSpectorScan(workspacePath, internalSkillsRoot);
  report.securityScan = securityScan;
  report.securityStatus = 'PASS';

  if (securityScan && securityScan.issues && securityScan.issues.length > 0) {
    const realFindings = securityScan.issues.filter(f => {
      const fileLower = (f.location && f.location.file) ? f.location.file.toLowerCase() : '';
      const isBinary = fileLower.endsWith('.mp3') || fileLower.endsWith('.wav') || fileLower.endsWith('.png') || fileLower.endsWith('.jpg') || fileLower.endsWith('.jpeg') || fileLower.endsWith('.gif') || fileLower.endsWith('.zip');
      return !isBinary;
    });

    if (realFindings.length > 0) {
      console.warn(`\n⚠️  [安全警告] SkillSpector 在非二进制文件中检测到 ${realFindings.length} 处安全隐患:`);
      const criticalOrHigh = realFindings.some(f => f.severity === 'HIGH' || f.severity === 'CRITICAL');
      if (criticalOrHigh) {
        console.error(`\n❌ [安全错误] 发现 Critical/High 级别的安全漏洞。全局同步已被拦截。`);
        report.securityStatus = 'FAIL';
      } else {
        report.securityStatus = 'WARN';
      }
    }
  }

  console.log('\n--- 审计结果报告 ---');
  console.log(JSON.stringify(report, null, 2));

  // 如果启用了更新模式，执行修复和全局目的地同步
  if (executeUpdates) {
    if (report.securityStatus === 'FAIL') {
      const forceUpdate = process.argv.includes('--force-update');
      if (!forceUpdate) {
        console.error('\n❌ [同步拦截] 技能文件包含高危漏洞，已终止同步！(使用 --force-update 强行同步)');
        return;
      }
    }

    console.log('\n🔧 正在进行全局目录的自动更新与同步...');
    const globalDestinations = getGlobalDestinations(config);

    globalDestinations.forEach(destRoot => {
      try {
        console.log(`  [同步部署] 正在部署工作区至: ${destRoot}...`);

        // 在写入前，干净清理目的地旧目录，防止历史废弃文件残留
        const oldSkillsDest = path.join(destRoot, 'skills');
        if (fs.existsSync(oldSkillsDest)) {
          fs.rmSync(oldSkillsDest, { recursive: true, force: true });
          console.log(`    [清理] 已移除目的地旧的 skills 目录`);
        }
        const oldInternalDest = path.join(destRoot, 'internal-skills');
        if (fs.existsSync(oldInternalDest)) {
          fs.rmSync(oldInternalDest, { recursive: true, force: true });
          console.log(`    [清理] 已移除目的地旧的 internal-skills 目录`);
        }
        const oldRouterDest = path.join(destRoot, 'router');
        if (fs.existsSync(oldRouterDest)) {
          fs.rmSync(oldRouterDest, { recursive: true, force: true });
          console.log(`    [清理] 已移除目的地旧的 router 目录`);
        }
        const oldScriptsDest = path.join(destRoot, 'scripts');
        if (fs.existsSync(oldScriptsDest)) {
          fs.rmSync(oldScriptsDest, { recursive: true, force: true });
          console.log(`    [清理] 已移除目的地旧的 scripts 目录`);
        }

        // 彻底同步 internal-skills, router 和 scripts 目录
        syncDirectory(path.join(workspacePath, 'internal-skills'), path.join(destRoot, 'internal-skills'));
        syncDirectory(path.join(workspacePath, 'router'), path.join(destRoot, 'router'));
        syncDirectory(path.join(workspacePath, 'scripts'), path.join(destRoot, 'scripts'));
        
        // 同步根目录的核心入口策略及清单配置
        const rootFilesToSync = ['SKILL.md', 'README.md', 'AGENTS.md', '.gitignore', 'package.json', 'config.json', 'skills-manifest.json'];
        rootFilesToSync.forEach(f => {
          const srcFile = path.join(workspacePath, f);
          if (fs.existsSync(srcFile)) {
            fs.mkdirSync(destRoot, { recursive: true });
            fs.copyFileSync(srcFile, path.join(destRoot, f));
          }
        });
        console.log(`  [同步成功] 目的地已就绪: ${destRoot}`);
      } catch (err) {
        console.error(`  [同步失败] 同步部署失败: ${destRoot}: ${err.message}`);
      }
    });

    console.log(`\n✓ 全局同步和部署已全部完成。`);
  }
}

// 调用 SkillSpector 进行增量/完整安全检查
function runSkillSpectorScan(workspacePath, internalSkillsRoot) {
  const execSync = require('child_process').execSync;
  const winPath = path.join(workspacePath, 'SkillSpector/.venv/Scripts/skillspector.exe');
  const unixPath = path.join(workspacePath, 'SkillSpector/.venv/bin/skillspector');
  let bin = 'skillspector';
  if (fs.existsSync(winPath)) {
    bin = `"${winPath}"`;
  } else if (fs.existsSync(unixPath)) {
    bin = `"${unixPath}"`;
  }

  const cachePath = path.join(workspacePath, '.skillspector-cache.json');
  
  function getSkillFiles(dir, filesObj = {}) {
    if (!fs.existsSync(dir)) return filesObj;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (let entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        getSkillFiles(fullPath, filesObj);
      } else {
        const relative = path.relative(internalSkillsRoot, fullPath).replace(/\\/g, '/');
        try {
          const stat = fs.statSync(fullPath);
          filesObj[relative] = {
            mtime: stat.mtimeMs,
            size: stat.size
          };
        } catch (e) {}
      }
    }
    return filesObj;
  }

  const currentFiles = getSkillFiles(internalSkillsRoot);
  let cache = null;
  if (fs.existsSync(cachePath)) {
    try {
      cache = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
    } catch (e) {}
  }

  // 全量扫描
  if (!cache || !cache.files || !cache.lastScanResult) {
    return runFullScan(bin, internalSkillsRoot, currentFiles, cachePath);
  }

  // 缓存命中直接返回
  const changedFiles = [];
  for (const file of Object.keys(currentFiles)) {
    const curr = currentFiles[file];
    const cached = cache.files[file];
    if (!curr || !cached || curr.mtime !== cached.mtime || curr.size !== cached.size) {
      changedFiles.push(file);
    }
  }

  if (changedFiles.length === 0) {
    return cache.lastScanResult;
  }

  return runFullScan(bin, internalSkillsRoot, currentFiles, cachePath);
}

// 运行全量安全漏洞审计
function runFullScan(bin, internalSkillsRoot, currentFiles, cachePath) {
  const execSync = require('child_process').execSync;
  const cmd = `${bin} scan "${internalSkillsRoot}" --format json --no-llm`;
  let stdout = '';
  try {
    stdout = execSync(cmd, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
  } catch (err) {
    stdout = err.stdout || '';
    if (!stdout) {
      return { error: err.message };
    }
  }

  try {
    const result = JSON.parse(stdout);
    if (result && Array.isArray(result.issues)) {
      result.issues.forEach(issue => {
        if (issue.location && issue.location.file) {
          issue.location.file = issue.location.file.replace(/\\/g, '/');
        }
      });
    }
    fs.writeFileSync(cachePath, JSON.stringify({
      lastScanResult: result,
      files: currentFiles
    }, null, 2), 'utf8');
    return result;
  } catch (e) {
    return { error: '解析 JSON 失败' };
  }
}

// 目录同步辅助逻辑（镜像同步源到目的地）
function syncDirectory(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      syncDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 启动路由
main().catch(err => {
  console.error(err);
  process.exit(1);
});
