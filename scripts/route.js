const path = require('path');
const fs = require('fs');

// Attempt to load CodeGraph library
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
    // Keep it null, fallback to static profiling
  }
}

const CATEGORY_KEYWORDS = {
  frontend: ['ui', 'ux', 'css', 'html', 'style', 'page', 'button', 'component', 'animation', 'layout', 'canvas', 'render', 'browser', 'react', 'vue', 'next.js', 'vite', 'gsap', 'responsive', 'flexbox', 'grid', 'color', 'theme', 'design', 'accessibility', 'a11y', 'aria', 'font', 'fonts', 'typography', 'button', 'buttons', 'input', 'inputs', 'modal', 'modals', 'dialog', 'dialogs', 'toast', 'toasts', 'interactive', 'interaction', 'hover', 'active', 'focus', 'aesthetic', 'beautiful', 'prose', 'text', 'copy', 'comment', 'lint'],
  backend: ['api', 'route', 'controller', 'service', 'database', 'sql', 'query', 'auth', 'jwt', 'session', 'token', 'login', 'signup', 'express', 'nest', 'koa', 'fastify', 'spring', 'django', 'flask', 'security', 'cors', 'validation', 'error', 'middleware', 'prisma', 'mongoose', 'orm', 'db'],
  deployment: ['docker', 'nginx', 'pm2', 'deploy', 'server', 'ssl', 'https', 'domain', 'hosting', 'compose', 'kubernetes', 'cloud', 'cicd'],
  engineering: ['tdd', 'test', 'debug', 'diagnose', 'refactor', 'architecture', 'bug', 'crash', 'performance', 'prototype', 'grill', 'prd', 'issue', 'git', 'commit', 'pr', 'audit', 'zoom', 'overview', 'handoff', 'session', 'compaction'],
  document: ['doc', 'pdf', 'word', 'xlsx', 'excel', 'ppt', 'resume', 'report', 'write', 'translate', 'mail'],
  'ai-agent': ['agent', 'prompt', 'skill', 'workflow', 'mcp', 'router', 'llm', 'chatbot', 'indexing', 'codegraph']
};

/**
 * Main execution
 */
async function main() {
  const args = process.argv.slice(2);
  const queryArg = getArgValue(args, '--query') || '';
  const workspaceArg = getArgValue(args, '--workspace') || process.cwd();
  const auditMode = args.includes('--audit');
  const updateMode = args.includes('--update');

  const resolvedWorkspace = path.resolve(workspaceArg);

  if (auditMode || updateMode) {
    await runAudit(resolvedWorkspace, updateMode);
    return;
  }

  if (!queryArg) {
    console.log(JSON.stringify({
      error: 'Please specify --query "<user request>"'
    }, null, 2));
    process.exit(1);
  }

  // Profile project
  const profile = await profileProject(resolvedWorkspace, queryArg);

  // Determine active skills & progressive disclosure paths
  const decision = routeTask(queryArg, profile);

  console.log(JSON.stringify(decision, null, 2));
}

function getArgValue(args, flag) {
  const idx = args.indexOf(flag);
  if (idx !== -1 && idx + 1 < args.length) {
    return args[idx + 1];
  }
  return null;
}

/**
 * Analyzes the workspace using CodeGraph if available, or static config files
 */
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

  // 1. CodeGraph analysis if initialized
  if (CodeGraph && fs.existsSync(path.join(workspacePath, '.codegraph'))) {
    try {
      const cg = await CodeGraph.open(workspacePath);
      profile.hasCodeGraph = true;
      profile.signals.push('.codegraph');

      // Get stats
      const stats = cg.getStats();
      profile.filesCount = stats.fileCount || stats.files || 0;
      profile.nodesCount = stats.nodeCount || stats.nodes || 0;
      profile.edgesCount = stats.edgeCount || stats.edges || 0;

      // Get detected frameworks
      profile.detectedFrameworks = cg.getDetectedFrameworks();
      if (profile.detectedFrameworks.length > 0) {
        profile.stack.push(...profile.detectedFrameworks);
      }

      // Analyze file languages
      const files = cg.getFiles();
      const extCounts = {};
      files.forEach(f => {
        const ext = path.extname(f.path).toLowerCase();
        extCounts[ext] = (extCounts[ext] || 0) + 1;
      });

      // Map languages
      if (extCounts['.ts'] || extCounts['.tsx'] || extCounts['.js'] || extCounts['.jsx']) {
        profile.languages.push('JavaScript/TypeScript');
      }
      if (extCounts['.py']) profile.languages.push('Python');
      if (extCounts['.go']) profile.languages.push('Go');
      if (extCounts['.rs']) profile.languages.push('Rust');
      if (extCounts['.java']) profile.languages.push('Java');
      if (extCounts['.cs']) profile.languages.push('C#');

      // Scan imports for libraries
      try {
        const imports = cg.getNodesByKind('import');
        if (imports && imports.length > 0) {
          const importNames = imports.map(i => i.name.toLowerCase());
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
      } catch (e) {
        // Safe fallback
      }

      // Check specific symbols matching the query
      const matches = cg.searchNodes(userQuery, { limit: 15 });
      if (matches.length > 0) {
        profile.signals.push(`matched_symbols(${matches.length})`);
        matches.forEach(m => {
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
        });
      }

      cg.close();
    } catch (e) {
      profile.signals.push(`codegraph_error: ${e.message}`);
    }
  }

  // 2. Static root config file analysis (supplement/fallback)
  const rootFiles = {
    'package.json': () => {
      try {
        const pkg = JSON.parse(fs.readFileSync(path.join(workspacePath, 'package.json'), 'utf8'));
        profile.signals.push('package.json');
        const deps = Object.keys(pkg.dependencies || {}).concat(Object.keys(pkg.devDependencies || {}));
        
        // Detect stack details
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

  // Deduplicate
  profile.stack = [...new Set(profile.stack)];
  profile.signals = [...new Set(profile.signals)];
  profile.languages = [...new Set(profile.languages)];

  // Categorize overall project type
  const isFrontend = profile.stack.some(s => ['React', 'Vue', 'Next.js', 'Nuxt.js', 'GSAP', 'TailwindCSS'].includes(s)) || profile.signals.includes('frontend_symbol_match');
  const isBackend = profile.stack.some(s => ['Express', 'NestJS', 'Prisma', 'Mongoose'].includes(s)) || profile.languages.some(l => ['Go', 'Rust', 'Java', 'C#'].includes(l)) || profile.signals.includes('backend_symbol_match');
  
  if (isFrontend && isBackend) {
    profile.type = 'fullstack';
  } else if (isFrontend) {
    profile.type = 'frontend';
  } else if (isBackend) {
    profile.type = 'backend';
  } else if (profile.signals.includes('Dockerfile') || profile.signals.includes('docker-compose.yml')) {
    profile.type = 'deployment';
  }

  return profile;
}

/**
 * Route task based on query keywords and project profile
 */
function routeTask(query, profile) {
  const queryLower = query.toLowerCase();

  // 1. Calculate weights for each category based on keywords in query
  const weights = {};
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    let score = 0;
    keywords.forEach(keyword => {
      if (queryLower.includes(keyword)) {
        score += 2;
      }
    });
    weights[category] = score;
  }

  // 2. Adjust weights based on project profile
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

  if (profile.signals.includes('test_symbol_match')) {
    weights['engineering'] += 3;
  }
  if (profile.signals.includes('frontend_symbol_match')) {
    weights['frontend'] += 2;
  }
  if (profile.signals.includes('backend_symbol_match')) {
    weights['backend'] += 2;
  }

  if (profile.languages.includes('JavaScript/TypeScript')) {
    weights['frontend'] += 1;
    weights['backend'] += 1;
  }

  // 3. Find category with maximum weight
  let bestCategory = 'engineering'; // Default fallback
  let maxWeight = 0;
  for (const [category, weight] of Object.entries(weights)) {
    if (weight > maxWeight) {
      maxWeight = weight;
      bestCategory = category;
    }
  }

  // 4. Construct progressive disclosure decisions
  const decision = {
    category: bestCategory,
    subcategory: '',
    skillFile: '',
    progressiveReferences: [],
    auxiliarySkills: [],
    routingReason: `Best category matched: ${bestCategory} (score: ${maxWeight}) based on project profile and user query semantic analysis.`,
    confidence: maxWeight >= 4 ? 'high' : (maxWeight >= 2 ? 'medium' : 'low')
  };

  // Map category to subcategory & specific skills
  if (bestCategory === 'frontend') {
    decision.subcategory = 'web-frontend';
    decision.skillFile = 'skills/frontend/web-frontend/SKILL.md';

    const referencesPath = 'skills/frontend/web-frontend/references';
    
    // Check for GSAP animations
    if (queryLower.includes('animation') || queryLower.includes('gsap') || queryLower.includes('scroll') || profile.stack.includes('GSAP')) {
      decision.progressiveReferences.push(`${referencesPath}/gsap.md`);
      decision.routingReason += ' Target involves animation/motion: loaded GSAP sub-manual.';
    }
    
    // Check for visual aesthetics / taste
    if (queryLower.includes('design') || queryLower.includes('aesthetic') || queryLower.includes('beautiful') || queryLower.includes('color') || queryLower.includes('font') || queryLower.includes('theme') || queryLower.includes('ui') || queryLower.includes('ux') || queryLower.includes('taste') || queryLower.includes('button') || queryLower.includes('style') || queryLower.includes('look') || queryLower.includes('premium') || queryLower.includes('visual')) {
      decision.progressiveReferences.push(`${referencesPath}/frontend-design.md`);
      decision.progressiveReferences.push(`${referencesPath}/taste-skill.md`);
      decision.routingReason += ' Target involves high aesthetic styling: loaded Frontend Design and Taste manuals.';
    }
    
    // Check for UI usability or accessibility
    if (queryLower.includes('contrast') || queryLower.includes('accessib') || queryLower.includes('a11y') || queryLower.includes('aria') || queryLower.includes('focus') || queryLower.includes('keyboard') || queryLower.includes('toast') || queryLower.includes('modal') || queryLower.includes('form') || queryLower.includes('responsive')) {
      decision.progressiveReferences.push(`${referencesPath}/ui-ux-pro-max.md`);
      decision.routingReason += ' Target involves UX/accessibility patterns: loaded UI/UX Pro Max guide.';
    }

    // Check for impeccable (AI smell removal)
    if (queryLower.includes('prose') || queryLower.includes('marketing') || queryLower.includes('text') || queryLower.includes('word') || queryLower.includes('comment') || queryLower.includes('ai smell') || queryLower.includes('slop') || queryLower.includes('lint')) {
      decision.progressiveReferences.push(`${referencesPath}/impeccable.md`);
      decision.routingReason += ' Target involves editorial prose/comments: loaded Impeccable manual.';
    }

    if (decision.progressiveReferences.length === 0) {
      decision.progressiveReferences.push(`${referencesPath}/frontend-design.md`);
    }

    decision.auxiliarySkills.push('karpathy-guidelines');
  } else if (bestCategory === 'backend') {
    decision.subcategory = 'api-backend';
    decision.skillFile = 'skills/backend/api-backend/SKILL.md';
    decision.auxiliarySkills.push('karpathy-guidelines');
  } else if (bestCategory === 'deployment') {
    decision.subcategory = 'nginx';
    decision.skillFile = 'skills/deployment/nginx/SKILL.md';
    decision.auxiliarySkills.push('karpathy-guidelines');
  } else if (bestCategory === 'document') {
    decision.subcategory = 'writing';
    decision.skillFile = 'skills/document/writing/SKILL.md';
  } else if (bestCategory === 'ai-agent') {
    if (queryLower.includes('indexing') || queryLower.includes('codegraph')) {
      decision.subcategory = 'code-indexing';
      decision.skillFile = 'skills/ai-agent/code-indexing/SKILL.md';
    } else {
      decision.subcategory = 'skill-design';
      decision.skillFile = 'skills/ai-agent/skill-design/SKILL.md';
    }
  } else if (bestCategory === 'engineering') {
    // Map to engineering subcategories
    if (queryLower.includes('test') || queryLower.includes('tdd') || queryLower.includes('jest') || queryLower.includes('vitest') || queryLower.includes('spec') || queryLower.includes('pytest')) {
      decision.subcategory = 'development/tdd';
      decision.skillFile = 'skills/engineering/development/tdd/SKILL.md';
    } else if (queryLower.includes('debug') || queryLower.includes('diagnose') || queryLower.includes('crash') || queryLower.includes('error') || queryLower.includes('bug') || queryLower.includes('leak') || queryLower.includes('performance')) {
      decision.subcategory = 'development/diagnose';
      decision.skillFile = 'skills/engineering/development/diagnose/SKILL.md';
      decision.auxiliarySkills.push('diagnose');
    } else if (queryLower.includes('zoom') || queryLower.includes('macro') || queryLower.includes('overview') || queryLower.includes('全貌') || queryLower.includes('依赖')) {
      decision.subcategory = 'development/zoom-out';
      decision.skillFile = 'skills/engineering/development/zoom-out/SKILL.md';
    } else if (queryLower.includes('grill') || queryLower.includes('challenge') || queryLower.includes('审查') || queryLower.includes('对齐')) {
      decision.subcategory = 'planning/grill-me';
      decision.skillFile = 'skills/engineering/planning/grill-me/SKILL.md';
    } else if (queryLower.includes('issue') || queryLower.includes('ticket') || queryLower.includes('split') || queryLower.includes('slice')) {
      decision.subcategory = 'planning/to-issues';
      decision.skillFile = 'skills/engineering/planning/to-issues/SKILL.md';
    } else if (queryLower.includes('prd') || queryLower.includes('requirement')) {
      decision.subcategory = 'planning/to-prd';
      decision.skillFile = 'skills/engineering/planning/to-prd/SKILL.md';
    } else if (queryLower.includes('handoff') || queryLower.includes('session') || queryLower.includes('compaction') || queryLower.includes('交接')) {
      decision.subcategory = 'collaboration/handoff';
      decision.skillFile = 'skills/engineering/collaboration/handoff/SKILL.md';
    } else if (queryLower.includes('prototype') || queryLower.includes('experiment') || queryLower.includes('poc') || queryLower.includes('原型')) {
      decision.subcategory = 'prototyping/prototype';
      decision.skillFile = 'skills/engineering/prototyping/prototype/SKILL.md';
    } else {
      decision.subcategory = 'development/improve-codebase-architecture';
      decision.skillFile = 'skills/engineering/development/improve-codebase-architecture/SKILL.md';
    }
    decision.auxiliarySkills.push('codegraph');
  }

  // Deduplicate
  decision.progressiveReferences = [...new Set(decision.progressiveReferences)];
  decision.auxiliarySkills = [...new Set(decision.auxiliarySkills)];

  return decision;
}

/**
 * Health Check, Link Verification and Autonomous Updates/Merges for Skills
 */
async function runAudit(workspacePath, executeUpdates) {
  console.log(`🔍 Auditing skills repository at ${workspacePath}...`);

  const report = {
    missingSkills: [],
    redundantSkills: [],
    unregisteredSkills: [],
    brokenMarkdownLinks: [],
    structureIssues: []
  };

  const skillsRoot = path.join(workspacePath, 'skills');
  if (!fs.existsSync(skillsRoot)) {
    console.error('Error: skills directory not found!');
    process.exit(1);
  }

  // 1. Scan for missing category structural files
  const categories = ['frontend', 'backend', 'deployment', 'document', 'ai-agent', 'engineering'];
  categories.forEach(cat => {
    const catPath = path.join(skillsRoot, cat);
    if (fs.existsSync(catPath)) {
      const tagPath = path.join(catPath, 'CATEGORY_TAG.md');
      const idxPath = path.join(catPath, 'SUBCATEGORY_INDEX.md');
      
      if (!fs.existsSync(tagPath)) {
        report.structureIssues.push({
          file: `skills/${cat}/CATEGORY_TAG.md`,
          issue: 'Missing category tag file',
          fix: 'Create CATEGORY_TAG.md with expert tag guidelines'
        });
      }
      if (!fs.existsSync(idxPath)) {
        report.structureIssues.push({
          file: `skills/${cat}/SUBCATEGORY_INDEX.md`,
          issue: 'Missing subcategory index file',
          fix: 'Create SUBCATEGORY_INDEX.md'
        });
      }
    }
  });

  // 2. Recursively find all SKILL.md and check links & catalog
  const foundSkills = [];
  const allMdFiles = [];

  function traverseMd(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(f => {
      const full = path.join(dir, f);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        traverseMd(full);
      } else if (f.toLowerCase() === 'skill.md') {
        foundSkills.push(full);
        allMdFiles.push(full);
      } else if (f.endsWith('.md')) {
        allMdFiles.push(full);
      }
    });
  }
  traverseMd(skillsRoot);

  // Read Local Catalog
  const catalogPath = path.join(skillsRoot, '_super-skill', 'LOCAL_SKILL_CATALOG.md');
  let catalogContent = '';
  if (fs.existsSync(catalogPath)) {
    catalogContent = fs.readFileSync(catalogPath, 'utf8');
  }

  // Check Unregistered Skills
  foundSkills.forEach(skillFile => {
    const content = fs.readFileSync(skillFile, 'utf8');
    const relative = path.relative(skillsRoot, skillFile).replace(/\\/g, '/');
    const skillName = path.basename(path.dirname(skillFile));

    // Exclude the router itself
    if (skillName === '_super-skill') return;

    if (!catalogContent.includes(skillName)) {
      report.unregisteredSkills.push({
        name: skillName,
        path: `skills/${relative}`,
        reason: `${skillName} is in the workspace but not registered in LOCAL_SKILL_CATALOG.md.`
      });
    }
  });

  // Verify internal file:/// links integrity
  allMdFiles.forEach(mdFile => {
    const content = fs.readFileSync(mdFile, 'utf8');
    const regex = /file:\/\/\/([^\s"'\)]+)/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
      const rawUrl = match[1];
      const decodedPath = decodeURIComponent(rawUrl).replace(/\\/g, '/');
      
      // We check if the target absolute path exists on this system
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

  // Check duplicate references
  const gsapMatches = catalogContent.match(/gsap-/g);
  if (gsapMatches && gsapMatches.length > 2) {
    report.redundantSkills.push({
      name: 'GSAP sub-skills',
      reason: 'Redundant individual GSAP sub-skills registered. Merged gsap.md is already present.'
    });
  }

  console.log('\n--- Skill Audit Report ---');
  console.log(JSON.stringify(report, null, 2));

  // If update mode is enabled, execute fixes
  if (executeUpdates) {
    console.log('\n🔧 Running autonomous updates, repair, and synchronization...');
    let changesMade = 0;

    // A. Resolve missing category structures
    report.structureIssues.forEach(update => {
      const fullPath = path.join(workspacePath, update.file);
      if (update.issue === 'Missing category tag file') {
        const dirname = path.dirname(update.file).split('/').pop() || path.dirname(update.file).split('\\').pop();
        const content = `# ${dirname.toUpperCase()} Category Tag\n\n## Category Purpose\n\nAuto-generated tag guidelines for ${dirname}.\n\n## Matching Conditions\n\n- Query contains keywords of ${dirname}.\n`;
        fs.mkdirSync(path.dirname(fullPath), { recursive: true });
        fs.writeFileSync(fullPath, content);
        console.log(`  [FIXED] Created missing category tag: ${update.file}`);
        changesMade++;
      }
    });

    // B. Auto-repair broken file:/// links
    if (report.brokenMarkdownLinks.length > 0) {
      // Index all md files in the active workspace to locate targets
      const workspaceFiles = {};
      function indexWorkspace(dir) {
        const files = fs.readdirSync(dir);
        files.forEach(f => {
          const full = path.join(dir, f);
          const stat = fs.statSync(full);
          if (stat.isDirectory()) {
            if (f !== 'node_modules' && f !== '.git' && f !== '.codegraph') {
              indexWorkspace(full);
            }
          } else if (f.endsWith('.md')) {
            workspaceFiles[f] = full;
          }
        });
      }
      indexWorkspace(workspacePath);

      // Group broken links by file to rewrite them at once
      const fixesByFile = {};
      report.brokenMarkdownLinks.forEach(item => {
        if (!fixesByFile[item.sourceFile]) fixesByFile[item.sourceFile] = [];
        fixesByFile[item.sourceFile].push(item);
      });

      for (const [relSourcePath, list] of Object.entries(fixesByFile)) {
        const sourceFullPath = path.join(workspacePath, relSourcePath);
        let content = fs.readFileSync(sourceFullPath, 'utf8');
        let fileUpdated = false;

        list.forEach(item => {
          const targetBasename = item.basename;
          if (workspaceFiles[targetBasename]) {
            const cleanNewPath = workspaceFiles[targetBasename].replace(/\\/g, '/');
            const newLink = `file:///${cleanNewPath}`;
            content = content.replace(item.brokenLink, newLink);
            console.log(`  [LINK REPAIRED] In ${relSourcePath}: Replaced broken link with ${newLink}`);
            fileUpdated = true;
          }
        });

        if (fileUpdated) {
          fs.writeFileSync(sourceFullPath, content);
          changesMade++;
        }
      }
    }

    // C. Auto-register unregistered skills in LOCAL_SKILL_CATALOG.md
    if (report.unregisteredSkills.length > 0 && fs.existsSync(catalogPath)) {
      let catalog = fs.readFileSync(catalogPath, 'utf8');
      report.unregisteredSkills.forEach(skill => {
        const skillFullPath = path.join(workspacePath, skill.path);
        const skillContent = fs.readFileSync(skillFullPath, 'utf8');
        
        // Parse frontmatter description
        let desc = 'Auto-registered skill';
        const descMatch = skillContent.match(/description:\s*(.*)/);
        if (descMatch && descMatch[1]) {
          desc = descMatch[1].trim();
        }

        const category = skill.path.split('/')[1] || 'general';
        const entry = `\n### ${skill.name}\n\n路径：\`~/.codex/skills/super-skill-router/${skill.path}\`  \n类别：${category}  \n默认角色：主 Skill  \n触发：${desc}\n`;
        catalog += entry;
        console.log(`  [CATALOG REGISTERED] Registered ${skill.name} in LOCAL_SKILL_CATALOG.md`);
        changesMade++;
      });
      fs.writeFileSync(catalogPath, catalog);
    }

    // D. Synchronize folders to global/vendor destinations
    const globalDestinations = [
      'C:/Users/a1028/.gemini/config/skills/super-skill-router',
      'C:/Users/a1028/.codex/skills/super-skill-router',
      'C:/Users/a1028/.codex/vendor/super-skill-router'
    ];

    globalDestinations.forEach(destRoot => {
      try {
        console.log(`  [SYNCING] Deploying workspace to ${destRoot}...`);
        syncDirectory(path.join(workspacePath, 'skills'), path.join(destRoot, 'skills'));
        syncDirectory(path.join(workspacePath, 'scripts'), path.join(destRoot, 'scripts'));
        
        // Also sync AGENTS.md, README.md, SKILL.md, and configs to destRoot
        const rootFilesToSync = ['SKILL.md', 'README.md', 'AGENTS.md', '.gitignore', 'package.json'];
        rootFilesToSync.forEach(f => {
          const srcFile = path.join(workspacePath, f);
          if (fs.existsSync(srcFile)) {
            fs.copyFileSync(srcFile, path.join(destRoot, f));
          }
        });
        console.log(`  [SYNCED SUCCESS] Synced successfully to ${destRoot}`);
      } catch (err) {
        console.error(`  [SYNC ERROR] Failed syncing to ${destRoot}: ${err.message}`);
      }
    });

    console.log(`\n✓ Autonomous updates completed: ${changesMade} changes applied successfully to workspace and global environments.`);
  }
}

/**
 * Helper to sync directory recursively (mirror source to destination)
 */
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

// Start
main().catch(err => {
  console.error(err);
  process.exit(1);
});
