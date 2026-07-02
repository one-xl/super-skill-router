const fs = require('fs');
const path = require('path');

// 1. Map agent-skills by Addy Osmani
const agentSkillsMap = {
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

console.log('🚀 Starting external skills copying...');

// A. Copy agent-skills
const agentSkillsSrcDir = path.resolve(__dirname, '../agent-skills/skills');
if (fs.existsSync(agentSkillsSrcDir)) {
  for (const [subName, relDest] of Object.entries(agentSkillsMap)) {
    const srcPath = path.join(agentSkillsSrcDir, subName);
    const destPath = path.resolve(__dirname, '..', relDest);
    if (fs.existsSync(srcPath)) {
      copyDirRecursive(srcPath, destPath);
      console.log(`  [Copied] agent-skills/${subName} -> ${relDest}`);
    } else {
      console.warn(`  [Warning] Source agent-skill not found: ${srcPath}`);
    }
  }
} else {
  console.error('Error: agent-skills/skills source directory not found!');
}

// B. Copy pm-skills
const pmSkillsSrcDir = path.resolve(__dirname, '../pm-skills');
const pmSkillsDestDir = path.resolve(__dirname, '../skills/engineering/planning/pm-skills');
if (fs.existsSync(pmSkillsSrcDir)) {
  fs.mkdirSync(pmSkillsDestDir, { recursive: true });
  
  // Recursively search for SKILL.md under pm-skills
  function traverse(dir) {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    for (const file of files) {
      const full = path.join(dir, file.name);
      if (file.isDirectory()) {
        if (file.name === 'skills') {
          // Inside a "skills" directory, each folder is a sub-skill
          const subSkills = fs.readdirSync(full, { withFileTypes: true });
          for (const sub of subSkills) {
            const subPath = path.join(full, sub.name);
            const skillFile = path.join(subPath, 'SKILL.md');
            if (sub.isDirectory() && fs.existsSync(skillFile)) {
              const destSubPath = path.join(pmSkillsDestDir, sub.name);
              copyDirRecursive(subPath, destSubPath);
              console.log(`  [Copied] pm-skill/${sub.name} -> skills/engineering/planning/pm-skills/${sub.name}`);
            }
          }
        } else if (file.name !== '.git' && file.name !== '.claude-plugin') {
          traverse(full);
        }
      }
    }
  }
  traverse(pmSkillsSrcDir);
} else {
  console.error('Error: pm-skills source directory not found!');
}

// C. Create headroom skill
const headroomDestDir = path.resolve(__dirname, '../skills/ai-agent/headroom');
fs.mkdirSync(headroomDestDir, { recursive: true });
const headroomSkillContent = `---
name: headroom
description: \"Context compression layer for AI agents. Compresses logs, outputs, and histories to save 60-95% tokens. Use when encountering massive terminal output, very long stack traces, or large log files.\"
---

# Headroom Context Compression

## Purpose

Use Headroom to compress large text blocks (command outputs, logs, conversation history, RAG chunks) to save token cost and avoid context window limits.

## How to use

1. **Proxy Mode**: Run \\\`headroom proxy --port 8787\\\` and direct your LLM client base URL to \\\`http://localhost:8787/v1\\\`.
2. **CLI Wrapping**: Run \\\`headroom wrap claude\\\` or \\\`headroom wrap codex\\\` to automatically compress tool outputs in real-time.
3. **MCP Server**: Configure the headroom MCP server in your agent's config using command \\\`headroom-mcp\\\` or equivalent.

## Headroom vs CodeGraph Comparison

- **CodeGraph**: Best for code intelligence, symbol definitions, and codebase navigation. It works by \"selective reading\" (preventing unnecessary files from being loaded).
- **Headroom**: Best for prose, long stack traces, and test log compression. It works by \"text summarization and AST pruning\" of already generated context.
- **Priority**: Use CodeGraph for code navigation. Use Headroom as a post-processing tool for massive terminal outputs or long history retention.
`;

fs.writeFileSync(path.join(headroomDestDir, 'SKILL.md'), headroomSkillContent, 'utf8');
console.log('  [Created] skills/ai-agent/headroom/SKILL.md');

console.log('🎉 External skills integration complete!');
