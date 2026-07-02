const fs = require('fs');
const path = require('path');
const os = require('os');

const workspacePath = path.resolve(__dirname, '..');
const skillsRoot = path.join(workspacePath, 'skills');
const artifactsDir = 'C:/Users/a1028/.gemini/antigravity/brain/fee3f7e9-e33c-44e6-a405-b7666f416a48';
const outputFile = path.join(artifactsDir, 'all_skills_catalog.md');

console.log('Generating comprehensive skills catalog...');

// Helper to walk directory recursively
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of list) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else if (file.name.toLowerCase() === 'skill.md' || file.name.toLowerCase() === 'instruction.md') {
      results.push(fullPath);
    }
  }
  return results;
}

const allSkillFiles = walk(skillsRoot);
const categories = {};

allSkillFiles.forEach(file => {
  const relative = path.relative(skillsRoot, file).replace(/\\/g, '/');
  const segments = relative.split('/');
  const filename = segments.pop(); // SKILL.md or INSTRUCTION.md
  
  // Exclude router metadata directory
  if (segments[0] === '_super-skill') return;
  
  let category = 'General';
  let parentSkillName = '';
  let subSkillName = '';
  let isChild = false;
  
  if (segments.length === 1) {
    // E.g. skills/cheat-bump/SKILL.md -> segments: ['cheat-bump']
    parentSkillName = segments[0];
  } else if (segments.length === 2) {
    // E.g. skills/ai-agent/headroom/SKILL.md -> segments: ['ai-agent', 'headroom']
    category = segments[0];
    parentSkillName = segments[1];
  } else if (segments.length === 3) {
    // E.g. skills/engineering/planning/pm-skills/SKILL.md -> segments: ['engineering', 'planning', 'pm-skills']
    category = `${segments[0]}/${segments[1]}`;
    parentSkillName = segments[2];
  } else {
    // E.g. skills/engineering/planning/pm-skills/create-prd/INSTRUCTION.md -> segments: ['engineering', 'planning', 'pm-skills', 'create-prd']
    // E.g. skills/frontend/hyperframes/embedded-captions/INSTRUCTION.md -> segments: ['frontend', 'hyperframes', 'embedded-captions']
    isChild = true;
    if (segments.length === 4) {
      category = `${segments[0]}/${segments[1]}`;
      parentSkillName = segments[2];
      subSkillName = segments[3];
    } else if (segments.length === 3) {
      category = segments[0];
      parentSkillName = segments[1];
      subSkillName = segments[2];
    }
  }
  
  // Read description from frontmatter
  const content = fs.readFileSync(file, 'utf8');
  let name = parentSkillName;
  let desc = 'No description available.';
  
  const nameMatch = content.match(/name:\s*(.*)/);
  if (nameMatch && nameMatch[1]) {
    name = nameMatch[1].trim();
  }
  const descMatch = content.match(/description:\s*(.*)/);
  if (descMatch && descMatch[1]) {
    desc = descMatch[1].trim().replace(/^["']|["']$/g, ''); // strip quotes
  }
  
  // Clean up category formatting
  category = category.split('/').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' / ');
  
  if (!categories[category]) {
    categories[category] = {};
  }
  
  if (isChild) {
    if (!categories[category][parentSkillName]) {
      categories[category][parentSkillName] = { isParent: false, subSkills: [] };
    }
    categories[category][parentSkillName].subSkills.push({
      name: subSkillName,
      description: desc,
      path: `skills/${relative}`
    });
  } else {
    if (!categories[category][parentSkillName]) {
      categories[category][parentSkillName] = { subSkills: [] };
    }
    categories[category][parentSkillName].name = name;
    categories[category][parentSkillName].description = desc;
    categories[category][parentSkillName].path = `skills/${relative}`;
    categories[category][parentSkillName].isParent = true;
  }
});

// Build Markdown content
let md = `# Comprehensive Skills Catalog\n\n`;
md += `This catalog contains all parent skills and nested child skills registered in the \`super-skill-router\`, organized by classification.\n\n`;

// TOC
md += `## Table of Contents\n\n`;
Object.keys(categories).sort().forEach(cat => {
  const anchor = cat.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
  md += `- [${cat}](#${anchor})\n`;
});
md += `\n---\n\n`;

// Content
Object.keys(categories).sort().forEach(cat => {
  md += `## ${cat}\n\n`;
  
  const parentSkills = categories[cat];
  Object.keys(parentSkills).sort().forEach(parentKey => {
    const parent = parentSkills[parentKey];
    const parentName = parent.name || parentKey;
    md += `### 📦 ${parentName}\n\n`;
    md += `**Description**: ${parent.description || 'Parent orchestrator skill.'}  \n`;
    if (parent.path) {
      md += `**Path**: [\`${parent.path}\`](file:///${workspacePath.replace(/\\/g, '/')}/${parent.path})  \n`;
    }
    md += `\n`;
    
    if (parent.subSkills && parent.subSkills.length > 0) {
      md += `#### 🔧 Sub-skills of ${parentName}\n\n`;
      md += `| Sub-skill | Description | Location |\n`;
      md += `| :--- | :--- | :--- |\n`;
      parent.subSkills.sort((a, b) => a.name.localeCompare(b.name)).forEach(sub => {
        md += `| **${sub.name}** | ${sub.description} | [\`INSTRUCTION.md\`](file:///${workspacePath.replace(/\\/g, '/')}/${sub.path}) |\n`;
      });
      md += `\n`;
    }
    md += `---\n\n`;
  });
});

fs.writeFileSync(outputFile, md, 'utf8');
console.log(`✓ Catalog written to ${outputFile}`);
