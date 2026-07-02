const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const proposalPath = path.join(rootDir, 'ROUTER_OPTIMIZATION_PROPOSAL.md');
const manifestPath = path.join(rootDir, 'skills-manifest.json');

console.log('🛠️  开始执行最终的绝对路径清理与多余配置彻底除脏脚本...');

// 1. 清理 ROUTER_OPTIMIZATION_PROPOSAL.md
if (fs.existsSync(proposalPath)) {
  let content = fs.readFileSync(proposalPath, 'utf8');
  const original = content;

  // 正则匹配并替换所有本机绝对路径
  // 匹配形如 file:///C:/Users/... 或 C:\Users\...
  content = content.replace(/file:\/\/\/C:\/[^\s"'\)]+/gi, '<absolute-path>');
  content = content.replace(/[A-Za-z]:\\Users\\[^\s"'\)]+/gi, '<absolute-path>');
  content = content.replace(/[A-Za-z]:\/Users\/[^\s"'\)]+/gi, '<absolute-path>');
  content = content.replace(/C:\/Users\/a1028\/Desktop\/02_开发工具\/vibecoding\/super-skill\/super-skill-router/gi, '<repo-root>');

  if (content !== original) {
    fs.writeFileSync(proposalPath, content, 'utf8');
    console.log('✓ ROUTER_OPTIMIZATION_PROPOSAL.md 中的绝对路径已全部清洗为占位符。');
  } else {
    console.log('  ROUTER_OPTIMIZATION_PROPOSAL.md 已经十分干净，未做修改。');
  }
}

// 2. 清理 skills-manifest.json 中由于旧状态可能残留的 test-driven-development
if (fs.existsSync(manifestPath)) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const beforeCount = manifest.skills.length;

  // 过滤掉 id === 'test-driven-development' 的项，因为在去重后我们只需要保留 id === 'tdd' 的项
  // 且 'test-driven-development' 会作为 'tdd' 的 aliases
  manifest.skills = manifest.skills.filter(s => {
    if (s.id.toLowerCase() === 'test-driven-development') {
      console.log(`  [清洗] 移除了 manifest 中多余的旧 ID 项: ${s.id} (${s.instructionPath})`);
      return false;
    }
    return true;
  });

  // 确保 tdd 项目拥有 test-driven-development 别名
  const tddSkill = manifest.skills.find(s => s.id === 'tdd');
  if (tddSkill) {
    if (!tddSkill.aliases) tddSkill.aliases = [];
    if (!tddSkill.aliases.includes('test-driven-development')) {
      tddSkill.aliases.push('test-driven-development');
    }
  }

  const afterCount = manifest.skills.length;
  if (beforeCount !== afterCount) {
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
    console.log(`✓ skills-manifest.json 清理完毕 (由 ${beforeCount} 项降至 ${afterCount} 项)。`);
  } else {
    console.log('  skills-manifest.json 中已无多余旧 ID 项。');
  }
}

console.log('🎉 最终轮清理工作圆满结束！');
