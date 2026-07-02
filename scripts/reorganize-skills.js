const fs = require('fs');
const path = require('path');

// 1. Redefine agent-skills map to nest under engineering/development/agent-skills/
const agentSkills = [
  'api-and-interface-design',
  'browser-testing-with-devtools',
  'ci-cd-and-automation',
  'code-review-and-quality',
  'code-simplification',
  'context-engineering',
  'debugging-and-error-recovery',
  'deprecation-and-migration',
  'documentation-and-adrs',
  'doubt-driven-development',
  'frontend-ui-engineering',
  'git-workflow-and-versioning',
  'idea-refine',
  'incremental-implementation',
  'interview-me',
  'observability-and-instrumentation',
  'performance-optimization',
  'planning-and-task-breakdown',
  'security-and-hardening',
  'shipping-and-launch',
  'source-driven-development',
  'spec-driven-development',
  'test-driven-development',
  'using-agent-skills'
];

// Old mapped paths for Addy's skills to clean up
const oldAgentSkillsMap = {
  'api-and-interface-design': 'skills/backend/api-and-interface-design',
  'browser-testing-with-devtools': 'skills/frontend/browser-testing-with-devtools',
  'ci-cd-and-automation': 'skills/deployment/ci-cd-and-automation',
  'code-review-and-quality': 'skills/engineering/development/code-review-and-quality',
  'code-simplification': 'skills/engineering/development/code-simplification',
  'context-engineering': 'skills/ai-agent/context-engineering',
  'debugging-and-error-recovery': 'skills/engineering/development/debugging-and-error-recovery',
  'deprecation-and-migration': 'skills/engineering/development/deprecation-and-migration',
  'documentation-and-adrs': 'skills/document/documentation-and-adrs',
  'doubt-driven-development': 'skills/engineering/development/doubt-driven-development',
  'frontend-ui-engineering': 'skills/frontend/frontend-ui-engineering',
  'git-workflow-and-versioning': 'skills/engineering/development/git-workflow-and-versioning',
  'idea-refine': 'skills/engineering/planning/idea-refine',
  'incremental-implementation': 'skills/engineering/development/incremental-implementation',
  'interview-me': 'skills/engineering/planning/interview-me',
  'observability-and-instrumentation': 'skills/engineering/development/observability-and-instrumentation',
  'performance-optimization': 'skills/engineering/development/performance-optimization',
  'planning-and-task-breakdown': 'skills/engineering/planning/planning-and-task-breakdown',
  'security-and-hardening': 'skills/engineering/development/security-and-hardening',
  'shipping-and-launch': 'skills/deployment/shipping-and-launch',
  'source-driven-development': 'skills/engineering/development/source-driven-development',
  'spec-driven-development': 'skills/engineering/planning/spec-driven-development',
  'test-driven-development': 'skills/engineering/development/test-driven-development',
  'using-agent-skills': 'skills/ai-agent/using-agent-skills'
};

// Hyperframes sub-skills to group
const hyperframesSubFolders = [
  'embedded-captions',
  'faceless-explainer',
  'general-video',
  'graphic-overlays',
  'hyperframes-animation',
  'hyperframes-cli',
  'hyperframes-core',
  'hyperframes-creative',
  'hyperframes-media',
  'hyperframes-registry',
  'motion-graphics',
  'pr-to-video',
  'product-launch-video',
  'remotion-to-hyperframes',
  'website-to-video'
];

function copyDirRecursive(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function removeDirRecursive(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
}

console.log('📂 Starting skills reorganization...');

// 1. Group Addy Osmani's agent-skills under engineering/development/agent-skills/
const newAgentParentDir = path.resolve(__dirname, '../skills/engineering/development/agent-skills');
fs.mkdirSync(newAgentParentDir, { recursive: true });

const agentSkillsSrcDir = path.resolve(__dirname, '../agent-skills/skills');
if (fs.existsSync(agentSkillsSrcDir)) {
  agentSkills.forEach(subName => {
    const srcPath = path.join(agentSkillsSrcDir, subName);
    const destPath = path.join(newAgentParentDir, subName);
    if (fs.existsSync(srcPath)) {
      copyDirRecursive(srcPath, destPath);
      console.log(`  [Copied] agent-skills/${subName} -> skills/engineering/development/agent-skills/${subName}`);
    }
  });

  // Create parent SKILL.md for agent-skills
  const parentAgentSkillContent = `---
name: agent-skills
description: \"Addy Osmani's Production-grade Software Engineering Skills for AI Coding Agents. Contains 24 sub-skills covering TDD, debugging, CI/CD, Git, API design, code simplification, security, and planning.\"
---

# Agent Skills (Addy Osmani Engineering Best Practices)

## Purpose

This is the parent entry point for 24 high-standard software engineering skills developed by Addy Osmani. AI coding agents should load the appropriate sub-skills as needed by navigating their relative paths.

## Available Sub-Skills

- **API & Interface Design**: [api-and-interface-design](api-and-interface-design/SKILL.md)
- **Browser Testing**: [browser-testing-with-devtools](browser-testing-with-devtools/SKILL.md)
- **CI/CD & Automation**: [ci-cd-and-automation](ci-cd-and-automation/SKILL.md)
- **Code Review**: [code-review-and-quality](code-review-and-quality/SKILL.md)
- **Code Simplification**: [code-simplification](code-simplification/SKILL.md)
- **Context Engineering**: [context-engineering](context-engineering/SKILL.md)
- **Debugging & Diagnostics**: [debugging-and-error-recovery](debugging-and-error-recovery/SKILL.md)
- **Deprecation & Migration**: [deprecation-and-migration](deprecation-and-migration/SKILL.md)
- **ADRs & Documentation**: [documentation-and-adrs](documentation-and-adrs/SKILL.md)
- **Doubt-Driven Development**: [doubt-driven-development](doubt-driven-development/SKILL.md)
- **Frontend UI Engineering**: [frontend-ui-engineering](frontend-ui-engineering/SKILL.md)
- **Git Workflow**: [git-workflow-and-versioning](git-workflow-and-versioning/SKILL.md)
- **Idea Refinement**: [idea-refine](idea-refine/SKILL.md)
- **Incremental Implementation**: [incremental-implementation](incremental-implementation/SKILL.md)
- **Self-Interview (Interview Me)**: [interview-me](interview-me/SKILL.md)
- **Observability**: [observability-and-instrumentation](observability-and-instrumentation/SKILL.md)
- **Performance Optimization**: [performance-optimization](performance-optimization/SKILL.md)
- **Task Planning & Breakdown**: [planning-and-task-breakdown](planning-and-task-breakdown/SKILL.md)
- **Security & Hardening**: [security-and-hardening](security-and-hardening/SKILL.md)
- **Shipping & Launch**: [shipping-and-launch](shipping-and-launch/SKILL.md)
- **Source-Driven Development**: [source-driven-development](source-driven-development/SKILL.md)
- **Spec-Driven Development**: [spec-driven-development](spec-driven-development/SKILL.md)
- **Test-Driven Development (TDD)**: [test-driven-development](test-driven-development/SKILL.md)
- **Using Agent Skills Guide**: [using-agent-skills](using-agent-skills/SKILL.md)
`;
  fs.writeFileSync(path.join(newAgentParentDir, 'SKILL.md'), parentAgentSkillContent, 'utf8');
  console.log('  [Created] skills/engineering/development/agent-skills/SKILL.md');
}

// 2. Clean up Addy\'s old scattered folders
for (const [subName, relDest] of Object.entries(oldAgentSkillsMap)) {
  const fullOldPath = path.resolve(__dirname, '..', relDest);
  removeDirRecursive(fullOldPath);
  console.log(`  [Cleaned] Removed old scattered folder: ${relDest}`);
}

// 3. Move hyperframes sub-skills under skills/frontend/hyperframes/
const newHyperframesParentDir = path.resolve(__dirname, '../skills/frontend/hyperframes');
fs.mkdirSync(newHyperframesParentDir, { recursive: true });

// Move hyperframes-read-first SKILL.md as the main parent skill
const oldReadFirst = path.resolve(__dirname, '../skills/frontend/hyperframes-read-first');
if (fs.existsSync(oldReadFirst)) {
  const parentSkillContent = fs.readFileSync(path.join(oldReadFirst, 'SKILL.md'), 'utf8')
    .replace('name: hyperframes-read-first', 'name: hyperframes')
    .replace(/C:\/Users\/a1028\/\.gemini\/config\/skills\/super-skill-router\/skills\/frontend\/hyperframes-media\/SKILL\.md/g, 'media/SKILL.md')
    .replace(/hyperframes-/g, ''); // Make links relative
  fs.writeFileSync(path.join(newHyperframesParentDir, 'SKILL.md'), parentSkillContent, 'utf8');
  removeDirRecursive(oldReadFirst);
  console.log('  [Moved & Renamed] hyperframes-read-first -> skills/frontend/hyperframes/SKILL.md');
}

// Move other subfolders under skills/frontend/
hyperframesSubFolders.forEach(subName => {
  const oldPath = path.resolve(__dirname, `../skills/frontend/${subName}`);
  const destPath = path.join(newHyperframesParentDir, subName);
  if (fs.existsSync(oldPath)) {
    copyDirRecursive(oldPath, destPath);
    removeDirRecursive(oldPath);
    console.log(`  [Moved] skills/frontend/${subName} -> skills/frontend/hyperframes/${subName}`);
  }
});

// Update pm-skills parent SKILL.md
const pmParentDir = path.resolve(__dirname, '../skills/engineering/planning/pm-skills');
if (fs.existsSync(pmParentDir)) {
  const pmParentSkillContent = `---
name: pm-skills
description: \"Pawel Huryn's Product Management Skills Marketplace. Contains 68 specialized skills covering product discovery, product strategy, OKRs, user stories, roadmaps, PRD creation, and sprint planning.\"
---

# Product Management Skills (pm-skills)

## Purpose

This is the parent entry point for 68 Product Management skills. AI agents should load the appropriate sub-skills as needed by navigating their relative paths.

## Major Sub-Skill Categories

- **Product Discovery**: E.g. [analyze-feature-requests](analyze-feature-requests/SKILL.md), [opportunity-solution-tree](opportunity-solution-tree/SKILL.md)
- **Product Strategy**: E.g. [product-strategy](product-strategy/SKILL.md), [lean-canvas](lean-canvas/SKILL.md), [product-vision](product-vision/SKILL.md)
- **Execution & OKRs**: E.g. [create-prd](create-prd/SKILL.md), [brainstorm-okrs](brainstorm-okrs/SKILL.md), [user-stories](user-stories/SKILL.md), [retro](retro/SKILL.md)
- **GTM & Market Research**: E.g. [gtm-strategy](gtm-strategy/SKILL.md), [competitor-analysis](competitor-analysis/SKILL.md), [user-personas](user-personas/SKILL.md)
`;
  fs.writeFileSync(path.join(pmParentDir, 'SKILL.md'), pmParentSkillContent, 'utf8');
  console.log('  [Created] skills/engineering/planning/pm-skills/SKILL.md');
}

console.log('🎉 Skills reorganization complete!');
