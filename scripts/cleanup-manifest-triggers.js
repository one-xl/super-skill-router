const fs = require('fs');
const path = require('path');

const manifestPath = path.resolve(__dirname, '../skills-manifest.json');

console.log('🧹 启动 Manifest 触发词深度去冲突与清洗脚本...');

if (!fs.existsSync(manifestPath)) {
  console.error('未找到 skills-manifest.json');
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

// 1. 定义需要剔除的通用无特异性高频泛词
const genericStopWords = new Set([
  'use', 'when', 'create', 'generate', 'plan', 'code', 'writing', 'engineering',
  'development', 'skills', 'skill', 'implement', 'design', 'process', 'using',
  'how', 'method', 'approach', 'strategy', 'system', 'build'
]);

manifest.skills.forEach(s => {
  // 初步过滤：过滤掉泛词
  s.triggers = s.triggers.filter(t => {
    const clean = t.toLowerCase().trim();
    return clean.length > 2 && !genericStopWords.has(clean);
  });

  // 2. 针对具体有冲突的技能，进行精细化词汇校准与定向过滤
  const id = s.id.toLowerCase();
  
  if (id === 'incremental-implementation') {
    // 剔除包含测试相关的词以与 tdd 区分
    s.triggers = s.triggers.filter(t => !['test', 'tdd', 'testing', 'tests'].includes(t.toLowerCase()));
    // 加入独特的逐步实现标志词
    s.triggers.push('逐步实现', '分步', 'incremental', 'step-by-step', 'vertical slice');
  }
  
  if (id === 'tdd' || id === 'test-driven-development') {
    s.triggers.push('red-green', 'unit-test-first', '先写测试', '测试驱动');
  }

  if (id === 'spec-driven-development') {
    s.triggers = s.triggers.filter(t => !['context', 'agent', 'using'].includes(t.toLowerCase()));
    s.triggers.push('spec', 'specification', '设计文档', '需求定义');
  }

  if (id === 'context-engineering') {
    s.triggers = s.triggers.filter(t => !['agent', 'skills', 'spec', 'using'].includes(t.toLowerCase()));
    s.triggers.push('context', 'context-engineering', '上下文', '上下文工程');
  }

  if (id === 'using-agent-skills') {
    s.triggers = s.triggers.filter(t => !['context'].includes(t.toLowerCase()));
    s.triggers.push('using-agent', '调用技能');
  }

  // 处理 existing 偏向词
  if (id.endsWith('-existing')) {
    s.triggers = s.triggers.filter(t => !['new', 'scratch', '新建', '空白'].includes(t.toLowerCase()));
    s.triggers.push('existing', 'current', 'already', '已有', '当前');
  }

  // 处理 new 偏向词
  if (id.endsWith('-new')) {
    s.triggers = s.triggers.filter(t => !['existing', 'current', 'already', '已有', '当前'].includes(t.toLowerCase()));
    s.triggers.push('new', 'scratch', 'from scratch', '新建', '全新');
  }

  // 清洗 hyperframes
  if (id === 'hyperframes-core') {
    s.triggers = s.triggers.filter(t => !['remotion', 'convert', '转换'].includes(t.toLowerCase()));
    s.triggers.push('hyperframes-core', 'core', '核心库');
  }

  if (id === 'remotion-to-hyperframes') {
    s.triggers = s.triggers.filter(t => !['core', '核心'].includes(t.toLowerCase()));
    s.triggers.push('remotion', 'convert', '转换工具');
  }

  // 数组去重并过滤空值
  s.triggers = [...new Set(s.triggers)].map(t => t.trim()).filter(Boolean);
});

// ==================== 3. 自动相交词迭代擦除冲突词算法 ====================
// 定义更广泛的 PM 类共享泛词，彻底移除，因为它们无法区分特定的子意图
const pmSharedStopWords = new Set([
  'brainstorm', 'ideas', 'analysis', 'summarize', 'question', 'interview', 'meeting', 'prioritize', 'features',
  '头脑风暴', '分析', '总结', '会议', '提问', '访谈', '优先级', '规划'
]);

manifest.skills.forEach(s => {
  s.triggers = s.triggers.filter(t => !pmSharedStopWords.has(t.toLowerCase().trim()));
});

// 在擦除前，为一些具体技能增补高特异性的动作专属词
manifest.skills.forEach(s => {
  const id = s.id.toLowerCase();
  if (id.includes('experiments')) {
    s.triggers.push('experiment design', 'hypothesis test', 'a/b test plan', '实验设计', '假定验证');
  }
  if (id.includes('ideas')) {
    s.triggers.push('ideation', 'concept options', 'solution ideas', '概念细化', '想法碰撞');
  }
  if (id.includes('assumptions')) {
    s.triggers.push('assumption mapping', 'riskiest assumption', '假设识别', '高风险假设');
  }
  if (id.includes('positioning')) {
    s.triggers.push('positioning statement', 'category narrative', '产品定位', '定位陈述');
  }
  if (id.includes('summarize-interview')) {
    s.triggers.push('interview transcript', 'customer quote', '访谈整理', '用户反馈提取');
  }
  if (id.includes('summarize-meeting')) {
    s.triggers.push('meeting notes', 'action items', '会议纪要', '待办事项提取');
  }
  if (id.includes('prioritize-features')) {
    s.triggers.push('feature prioritizing', 'backlog prioritization', '功能优先级划分', '需求排序');
  }
  
  // 对 existing / new 大类补充多维方向词
  if (id.endsWith('-existing')) {
    s.triggers.push('already launched', 'deployed', '现有的', '已经上线的');
  }
  if (id.endsWith('-new')) {
    s.triggers.push('greenfield', 'start new', '全新的', '起步阶段');
  }
});

console.log('🔄 开始进行多轮冲突擦除迭代直至数学收敛...');
let hasCollision = true;
let iterations = 0;

while (hasCollision && iterations < 50) {
  hasCollision = false;
  for (let i = 0; i < manifest.skills.length; i++) {
    for (let j = i + 1; j < manifest.skills.length; j++) {
      const s1 = manifest.skills[i];
      const s2 = manifest.skills[j];
      
      // 找出重合项
      const intersect = s1.triggers.filter(t => s2.triggers.includes(t));
      if (intersect.length >= 4) {
        // 发现重合度 >= 4 的碰撞！将这些交集词从两者中全部剔除
        intersect.forEach(word => {
          const cleanWord = word.toLowerCase().trim();
          const protect1 = [s1.id.toLowerCase(), s1.name.toLowerCase()];
          const protect2 = [s2.id.toLowerCase(), s2.name.toLowerCase()];
          
          if (!protect1.includes(cleanWord) && !protect2.includes(cleanWord)) {
            s1.triggers = s1.triggers.filter(t => t !== word);
            s2.triggers = s2.triggers.filter(t => t !== word);
          }
        });
        hasCollision = true;
      }
    }
  }
  iterations++;
}
console.log(`✓ 迭代结束，共进行了 ${iterations} 轮冲突擦除。`);

// 二次去重并整理
manifest.skills.forEach(s => {
  s.triggers = [...new Set(s.triggers)].map(t => t.trim()).filter(Boolean);
});
// =========================================================================

// 保存清单文件
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
console.log('✓ skills-manifest.json 触发词清洗完毕，已消除大部分重合冲突！');
