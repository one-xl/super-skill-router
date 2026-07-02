const fs = require('fs');
const path = require('path');

const workspacePath = path.resolve(__dirname, '..');
const skillsRoot = path.join(workspacePath, 'skills');

console.log('🙈 Hiding nested sub-skills (depth > 4) from top-level discovery...');

// Helper to recursively find files
function getFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const filePath = path.join(dir, file.name);
    if (file.isDirectory()) {
      getFiles(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const allFiles = getFiles(skillsRoot);
const markdownFiles = allFiles.filter(f => f.endsWith('.md'));

// Find and rename SKILL.md in sub-skills
let renamedCount = 0;
markdownFiles.forEach(file => {
  const filename = path.basename(file);
  if (filename.toLowerCase() === 'skill.md') {
    const relative = path.relative(skillsRoot, file).replace(/\\/g, '/');
    const segments = relative.split('/');
    
    // If it's a child skill (depth > 4, e.g. engineering/planning/pm-skills/create-prd/SKILL.md)
    if (segments.length > 4) {
      const parentDir = path.dirname(file);
      const newPath = path.join(parentDir, 'INSTRUCTION.md');
      
      console.log(`  [RENAMING] ${relative} -> INSTRUCTION.md`);
      fs.renameSync(file, newPath);
      renamedCount++;
    }
  }
});

console.log(`\n✓ Renamed ${renamedCount} child skill SKILL.md files to INSTRUCTION.md.`);

// Refresh files list after renaming
const updatedFiles = getFiles(skillsRoot);
const updatedMdFiles = updatedFiles.filter(f => f.endsWith('.md'));

// Update all links in parent skills
let updatedLinksCount = 0;
updatedMdFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;
  
  // Replace links like (something/SKILL.md) with (something/INSTRUCTION.md)
  // We match (relative_path/SKILL.md) case-insensitively
  content = content.replace(/(\([^)]+?)\/[Ss][Kk][Ii][Ll][Ll]\.[Mm][Dd](\))/g, '$1/INSTRUCTION.md$2');
  
  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    const relative = path.relative(skillsRoot, file).replace(/\\/g, '/');
    console.log(`  [UPDATED LINKS] in ${relative}`);
    updatedLinksCount++;
  }
});

console.log(`✓ Updated links in ${updatedLinksCount} markdown files.`);
