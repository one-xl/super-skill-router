const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const manifestPath = path.join(rootDir, 'skills-manifest.json');
const internalSkillsDir = path.join(rootDir, 'internal-skills');
const routerDir = path.join(rootDir, 'router');

console.log('🔄 启动 Manifest 补充注册与损坏链接自动修复脚本...');

// 1. 读取现有的 skills-manifest.json
let manifest = { version: 1, skills: [] };
if (fs.existsSync(manifestPath)) {
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  } catch (e) {
    console.error('读取 manifest 失败，重新创建', e.message);
  }
}

// 辅助函数：递归搜寻所有 INSTRUCTION.md 所在目录
function getInstructionDirs(dir, list = []) {
  if (!fs.existsSync(dir)) return list;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let hasInstruction = false;
  for (const entry of entries) {
    if (entry.isFile() && entry.name === 'INSTRUCTION.md') {
      hasInstruction = true;
    }
  }
  if (hasInstruction) {
    list.push(dir);
  }
  // 递归子目录
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.git' && entry.name !== '.codegraph' && entry.name !== 'router') {
        getInstructionDirs(path.join(dir, entry.name), list);
      }
    }
  }
  return list;
}

const physicalDirs = getInstructionDirs(internalSkillsDir);
console.log(`🔍 物理扫描完毕，共发现 ${physicalDirs.length} 个有效的子技能目录。`);

// 提取 frontmatter 的辅助函数
function parseFrontmatter(filePath) {
  const meta = { name: '', description: '' };
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const match = content.match(/^---([\s\S]*?)---/);
    if (match && match[1]) {
      const lines = match[1].split('\n');
      lines.forEach(line => {
        const parts = line.split(':');
        if (parts.length >= 2) {
          const key = parts[0].trim();
          const val = parts.slice(1).join(':').trim().replace(/^['"]|['"]$/g, '');
          if (key === 'name') meta.name = val;
          if (key === 'description') meta.description = val;
        }
      });
    }
  } catch (e) {}
  return meta;
}

// 2. 自动补充缺失的技能到 manifest
let newSkillsAdded = 0;
physicalDirs.forEach(dir => {
  const relPath = path.relative(rootDir, dir).replace(/\\/g, '/');
  const insPath = `${relPath}/INSTRUCTION.md`;
  
  // 检查是否已经在 manifest 中注册了
  const exists = manifest.skills.some(s => s.instructionPath.toLowerCase() === insPath.toLowerCase());
  
  if (!exists) {
    const dirName = path.basename(dir);
    const meta = parseFrontmatter(path.join(dir, 'INSTRUCTION.md'));
    
    // 自动推断所属大类
    const segments = relPath.split('/');
    const category = segments[1] || 'specialized';
    
    // 根据描述和名称生成 triggers
    const triggers = [dirName.toLowerCase()];
    if (meta.name) triggers.push(meta.name.toLowerCase());
    if (meta.description) {
      // 提取中文或英文单词作为触发词
      const words = meta.description.toLowerCase().match(/[\u4e00-\u9fa5\w-]+/g) || [];
      words.forEach(w => {
        if (w.length > 2 && !triggers.includes(w)) {
          triggers.push(w);
        }
      });
    }

    const newSkill = {
      id: dirName,
      name: meta.name || dirName,
      category: category,
      visibility: "internal",
      role: "primary",
      canonical: true,
      triggers: [...new Set(triggers)].slice(0, 10), // 限制前 10 个触发词
      priority: 1,
      instructionPath: insPath
    };
    
    manifest.skills.push(newSkill);
    newSkillsAdded++;
    console.log(`  [补充注册] 发现孤儿技能: ${dirName}，已注册至清单。`);
  }
});

// 保存更新后的 manifest
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
console.log(`✓ 补充注册完成，新增了 ${newSkillsAdded} 个技能项目。`);

// 3. 扫描所有 Markdown 文件，进行损坏链接自动替换
function getMdFiles(dir, filesList = []) {
  if (!fs.existsSync(dir)) return filesList;
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const filePath = path.join(dir, file.name);
    if (file.isDirectory()) {
      if (file.name !== 'node_modules' && file.name !== '.git' && file.name !== '.codegraph') {
        getMdFiles(filePath, filesList);
      }
    } else if (file.name.endsWith('.md')) {
      filesList.push(filePath);
    }
  }
  return filesList;
}

const allMdFiles = getMdFiles(rootDir);
let fixedLinksCount = 0;

allMdFiles.forEach(file => {
  // 排除脚本本身
  const relFile = path.relative(rootDir, file).replace(/\\/g, '/');
  if (relFile.startsWith('scripts/')) return;

  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // 使用正则匹配 [LinkText](file:///...) 或者 [LinkText](C:/...) 或者 [LinkText](skills/...) 这样的链接
  // 匹配形式：\[([^\]]+)\]\((file:\/\/\/|C:\/|[a-zA-Z]:\/|skills\/|internal-skills\/)([^\)]+)\)
  const linkRegex = /\[([^\]]+)\]\((file:\/\/\/|C:\/|skills\/|internal-skills\/)([^\)]+)\)/gi;
  
  content = content.replace(linkRegex, (match, text, prefix, rest) => {
    // 尝试在 manifest 中检索这个技能
    let targetSkill = null;
    const cleanText = text.trim().toLowerCase();
    
    // 提取可能的技能文件名/路径名
    const pathParts = rest.split('/');
    const lastPart = pathParts[pathParts.length - 1];
    const folderName = pathParts.length > 1 ? pathParts[pathParts.length - 2] : '';
    
    // 先根据 text 匹配 id/name/aliases
    targetSkill = manifest.skills.find(s => 
      s.id.toLowerCase() === cleanText || 
      s.name.toLowerCase() === cleanText ||
      (s.aliases && s.aliases.some(a => a.toLowerCase() === cleanText))
    );

    // 若没有匹配上，根据文件夹名或者路径匹配
    if (!targetSkill && folderName) {
      targetSkill = manifest.skills.find(s => s.id.toLowerCase() === folderName.toLowerCase());
    }
    
    if (!targetSkill) {
      // 最后一搏：根据文件名匹配
      const cleanFileName = lastPart.replace(/\.[a-zA-Z]+$/, '').toLowerCase();
      targetSkill = manifest.skills.find(s => s.id.toLowerCase() === cleanFileName);
    }

    if (targetSkill) {
      // 找到了目标技能，计算相对路径
      const targetAbsPath = path.resolve(rootDir, targetSkill.instructionPath);
      const currentFileDir = path.dirname(file);
      let relativePath = path.relative(currentFileDir, targetAbsPath).replace(/\\/g, '/');
      
      fixedLinksCount++;
      return `[${text}](${relativePath})`;
    }

    // 针对 awesome-skills / 外部链接的特殊降级处理
    if (cleanText === 'awesome-skills') {
      return `[awesome-skills](../router/LOCAL_SKILL_CATALOG.md)`;
    }

    return match; // 找不到则保留原样
  });

  // 清除因为多次替换可能产生的 internal-internal-skills 重复字符串
  content = content.replace(/internal-internal-skills/gi, 'internal-skills');
  content = content.replace(/pm-internal-skills/gi, 'pm-skills');

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
  }
});

console.log(`✓ 损坏链接修复完成，共分析并修正了 ${fixedLinksCount} 处引用链接。`);
console.log('🎉 同步与修复过程全部成功！');
