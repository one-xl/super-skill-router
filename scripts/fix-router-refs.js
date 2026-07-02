const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const routerDir = path.join(rootDir, 'router');

console.log('🚀 开始修复 router/ 目录下的核心路由策略文件引用路径...');

const files = fs.readdirSync(routerDir);

files.forEach(file => {
  if (!file.endsWith('.md')) return;
  const filePath = path.join(routerDir, file);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // 1. 将 file:///../../_super-skill/SKILL_RANKINGS.md 替换为同目录的 SKILL_RANKINGS.md
  content = content.replace(/file:\/\/\/\.\.\/\.\.\/_super-skill\/SKILL_RANKINGS\.md/g, 'SKILL_RANKINGS.md');
  
  // 2. 将 SUPER_SKILL_ROOT/_super-skill/ 替换为 router/
  content = content.replace(/SUPER_SKILL_ROOT\/_super-skill\//g, 'router/');
  
  // 3. 替换任何仍包含 _super-skill/ 的残留路径
  content = content.replace(/_super-skill\//g, 'router/');

  // 4. 将 file:/// 绝对路径转换为相对路径
  content = content.replace(/file:\/\/\/[^\s"'\)]+SKILL_RANKINGS\.md/g, 'SKILL_RANKINGS.md');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  [已修复] router/${file}`);
  }
});

console.log('🎉 router/ 下核心文件引用修复全部成功！');
