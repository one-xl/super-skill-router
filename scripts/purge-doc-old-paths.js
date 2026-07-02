const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

console.log('📝 启动核心文档编码格式化与旧路径清理脚本...');

// 1. 替换 CONTRIBUTING.md, docs/zh-usage.md, examples/example-routing-trace.md 中的旧路径
const docsToFix = [
  path.join(rootDir, 'CONTRIBUTING.md'),
  path.join(rootDir, 'docs/zh-usage.md'),
  path.join(rootDir, 'examples/example-routing-trace.md')
];

docsToFix.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  // 替换旧路径表达为新路径表达
  content = content.replace(/internal-skills\/_super-skill\/CATEGORY_INDEX\.md/g, 'router/CATEGORY_INDEX.md');
  content = content.replace(/internal-skills\/_super-skill\/INSTRUCTION\.md/g, 'SKILL.md');
  content = content.replace(/internal-skills\/_super-skill\/SKILL\.md/g, 'SKILL.md');
  content = content.replace(/_super-skill\/CATEGORY_INDEX\.md/g, 'router/CATEGORY_INDEX.md');
  content = content.replace(/_super-skill\/INSTRUCTION\.md/g, 'SKILL.md');
  content = content.replace(/_super-skill\//g, 'router/');
  content = content.replace(/SUPER_SKILL_ROOT\/_super-skill\//g, 'router/');
  content = content.replace(/SUPER_SKILL_ROOT = skills/g, 'SUPER_SKILL_ROOT = .');
  content = content.replace(/THIS_SKILL_DIR\/skills/g, 'THIS_SKILL_DIR');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  [已清理路径] ${path.relative(rootDir, filePath)}`);
  }
});

// 2. 强制核心 Markdown 策略文件写入为干净的 UTF-8 编码以防乱码
const utf8Docs = [
  path.join(rootDir, 'SKILL.md'),
  path.join(rootDir, 'AGENTS.md'),
  path.join(rootDir, 'README.md'),
  path.join(rootDir, 'router/CATEGORY_INDEX.md'),
  path.join(rootDir, 'router/SKILL_RANKINGS.md'),
  path.join(rootDir, 'router/SKILL_POLICY.md'),
  path.join(rootDir, 'router/ROUTING_CONFIDENCE.md')
];

utf8Docs.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  try {
    // 以 UTF-8 格式读取并重新写入
    const content = fs.readFileSync(filePath, 'utf8');
    // 使用带 UTF-8 BOM 或是无 BOM 的标准 UTF-8 写回，此处写入无 BOM 纯净 UTF-8
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  [编码转换成功] UTF-8 规范化: ${path.relative(rootDir, filePath)}`);
  } catch (err) {
    console.error(`  [编码转换失败] ${path.relative(rootDir, filePath)}: ${err.message}`);
  }
});

console.log('🎉 核心策略文档编码转换与旧路径清除工作圆满完成！');
