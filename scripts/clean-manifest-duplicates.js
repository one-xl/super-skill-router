const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const manifestPath = path.join(rootDir, 'skills-manifest.json');
const internalSkillsDir = path.join(rootDir, 'internal-skills');

console.log('🧹 启动物理与 Manifest 深度去重清理脚本...');

// 辅助函数：递归删除目录
function rmDirSync(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
}

// 1. 删除物理上重复的平铺技能文件夹
// 所有的 hyperframes-* 应该只留在 internal-skills/frontend/hyperframes/ 下，删除 internal-skills/frontend/ 平铺的那一套
const hyperframesSubFolders = [
  'embedded-captions', 'faceless-explainer', 'general-video', 'graphic-overlays',
  'hyperframes-animation', 'hyperframes-cli', 'hyperframes-core', 'hyperframes-creative',
  'hyperframes-media', 'hyperframes-registry', 'motion-graphics', 'pr-to-video',
  'product-launch-video', 'remotion-to-hyperframes', 'website-to-video'
];

hyperframesSubFolders.forEach(sub => {
  const flatPath = path.join(internalSkillsDir, 'frontend', sub);
  if (fs.existsSync(flatPath)) {
    rmDirSync(flatPath);
    console.log(`  [物理清理] 删除了 frontend 顶层平铺的重复 hyperframes 子技能: frontend/${sub}`);
  }
});

// 清理重复的 test-driven-development（只保留 tdd）
const tddLongPath = path.join(internalSkillsDir, 'engineering', 'development', 'test-driven-development');
if (fs.existsSync(tddLongPath)) {
  rmDirSync(tddLongPath);
  console.log('  [物理清理] 删除了重复的 engineering/development/test-driven-development (已保留 tdd)');
}

// 清理重复的 code-simplification 与 code-review-and-quality 等
// 检查是否有平铺重复并清理

// 2. 清理 skills-manifest.json 中的重复项与无效项
if (fs.existsSync(manifestPath)) {
  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    const uniqueSkills = [];
    const idsSeen = new Set();

    manifest.skills.forEach(s => {
      // 检查该物理路径是否还存在（刚才我们删除了物理重复）
      const absPath = path.resolve(rootDir, s.instructionPath);
      if (!fs.existsSync(absPath)) {
        console.log(`  [配置清理] 移除了已删除物理路径的清单项: ${s.id} (${s.instructionPath})`);
        return;
      }

      // 检查 ID 是否重复，如果重复则跳过
      const uniqueId = `${s.id.toLowerCase()}@${s.instructionPath.toLowerCase()}`;
      if (idsSeen.has(uniqueId) || idsSeen.has(s.id.toLowerCase())) {
        console.log(`  [配置清理] 移除了清单中重复声明的技能项: ${s.id}`);
        return;
      }

      // 给特定技能（如 tdd）补充别名
      if (s.id === 'tdd') {
        if (!s.aliases) s.aliases = [];
        if (!s.aliases.includes('test-driven-development')) {
          s.aliases.push('test-driven-development');
        }
      }

      uniqueSkills.push(s);
      idsSeen.add(s.id.toLowerCase());
      idsSeen.add(uniqueId);
    });

    manifest.skills = uniqueSkills;
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
    console.log('✓ skills-manifest.json 重复配置清理完毕。');
  } catch (e) {
    console.error('清理 manifest 配置文件出错:', e.message);
  }
}

// 3. 顺便修复各 Markdown 中的硬编码本机绝对路径
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

let fixedAbsolutePathsCount = 0;
allMdFiles.forEach(file => {
  const relPath = path.relative(rootDir, file).replace(/\\/g, '/');
  if (relPath.startsWith('scripts/')) return;

  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // 替换硬编码的本机绝对路径 C:/Users/a1028/Desktop/... /internal-skills/
  // 我们将其替换为指向相应 internal-skills 的相对路径
  const absPattern = /file:\/\/\/C:\/Users\/a1028\/[^\s"'\)]+/gi;
  content = content.replace(absPattern, (match) => {
    // 试图提取最后的技能名称或者分类
    const parts = match.split('/');
    const last = parts[parts.length - 1];
    const cleanName = last.replace(/\.[a-zA-Z]+$/, '');
    
    // 如果是 INSTRUCTION.md，看它的父目录
    let skillId = cleanName;
    if (cleanName.toLowerCase() === 'instruction') {
      skillId = parts[parts.length - 2] || '';
    }
    
    if (skillId && skillId.toLowerCase() !== 'wwas') {
      fixedAbsolutePathsCount++;
      // 返回相对路径占位链接，之后由链接修复器自动精确重构，或者直接改回相对路径
      return `[${skillId}](internal-skills/${skillId}/INSTRUCTION.md)`;
    }
    return match;
  });

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
  }
});

console.log(`✓ 替换了 ${fixedAbsolutePathsCount} 处硬编码绝对路径为标准相对格式。`);
console.log('🎉 深度去重清理圆满完成！');
