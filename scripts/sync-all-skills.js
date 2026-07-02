const fs = require('fs');
const path = require('path');
const os = require('os');

const homeDir = os.homedir().replace(/\\/g, '/');
const srcDir = `${homeDir}/.gemini/config/skills`;
const destDir = `${homeDir}/.codex/skills`;

console.log(`🔄 Syncing all skills from Antigravity (${srcDir}) to Codex (${destDir})...`);

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
      // Only copy if destination doesn't exist or is different size/mtime
      let shouldCopy = true;
      if (fs.existsSync(destPath)) {
        const srcStat = fs.statSync(srcPath);
        const destStat = fs.statSync(destPath);
        if (srcStat.size === destStat.size && srcStat.mtimeMs === destStat.mtimeMs) {
          shouldCopy = false;
        }
      }
      if (shouldCopy) {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
}

if (!fs.existsSync(srcDir)) {
  console.error(`❌ Source directory ${srcDir} does not exist!`);
  process.exit(1);
}

try {
  const skills = fs.readdirSync(srcDir, { withFileTypes: true });
  let count = 0;
  
  for (const skill of skills) {
    if (skill.isDirectory()) {
      const srcSkillPath = path.join(srcDir, skill.name);
      const destSkillPath = path.join(destDir, skill.name);
      
      console.log(`  [SYNCING] ${skill.name}...`);
      syncDirectory(srcSkillPath, destSkillPath);
      count++;
    }
  }
  
  console.log(`\n✓ Successfully synchronized ${count} skills from Antigravity to Codex.`);
} catch (err) {
  console.error(`❌ Sync failed: ${err.message}`);
  process.exit(1);
}
