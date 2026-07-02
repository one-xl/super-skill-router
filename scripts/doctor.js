const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const manifestPath = path.join(rootDir, 'skills-manifest.json');
const internalSkillsDir = path.join(rootDir, 'internal-skills');

let ok = true;
const errors = [];
const warnings = [];

console.log('🩺 启动 Super Skill Router 健康度深度体检 (Doctor System)...');

// 1. 加载 Manifest
let manifest = null;
if (!fs.existsSync(manifestPath)) {
  ok = false;
  errors.push({
    type: 'MISSING_MANIFEST',
    message: '找不到根目录下的 skills-manifest.json 清单配置文件！',
    fix: '请运行重组脚本生成 skills-manifest.json。'
  });
} else {
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  } catch (e) {
    ok = false;
    errors.push({
      type: 'INVALID_MANIFEST_JSON',
      message: `无法解析 skills-manifest.json，格式可能损坏: ${e.message}`,
      fix: '请检查并修复 JSON 文件语法。'
    });
  }
}

// 辅助函数：递归搜寻指定后缀名的文件
function getFiles(dir, ext = '.md', filesList = []) {
  if (!fs.existsSync(dir)) return filesList;
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const filePath = path.join(dir, file.name);
    if (file.isDirectory()) {
      if (file.name !== 'node_modules' && file.name !== '.git' && file.name !== '.codegraph') {
        getFiles(filePath, ext, filesList);
      }
    } else if (file.name.toLowerCase().endsWith(ext)) {
      filesList.push(filePath);
    }
  }
  return filesList;
}

// 辅助函数：递归搜寻特定文件名的文件
function getSpecificFiles(dir, targetName, filesList = []) {
  if (!fs.existsSync(dir)) return filesList;
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const filePath = path.join(dir, file.name);
    if (file.isDirectory()) {
      if (file.name !== 'node_modules' && file.name !== '.git' && file.name !== '.codegraph') {
        getSpecificFiles(filePath, targetName, filesList);
      }
    } else if (file.name.toLowerCase() === targetName.toLowerCase()) {
      filesList.push(filePath);
    }
  }
  return filesList;
}

// 2. 检查是否只有根目录存在 SKILL.md (防止 Codex UI 暴露海量子 Skill)
const allSkillMdFiles = getSpecificFiles(rootDir, 'skill.md');
allSkillMdFiles.forEach(file => {
  const relPath = path.relative(rootDir, file).replace(/\\/g, '/');
  if (relPath !== 'SKILL.md' && relPath !== 'skills/taste-skill/SKILL.md') {
    // 忽略一些已知路径（如果有），但目前应该只保留根目录的 SKILL.md
    ok = false;
    errors.push({
      type: 'LEAKED_SKILL_MD',
      path: relPath,
      message: `在子目录中泄露了 SKILL.md: ${relPath}。这会导致 Codex UI 产生海量独立入口！`,
      fix: '将该文件改名为 INSTRUCTION.md'
    });
  }
});

if (manifest && Array.isArray(manifest.skills)) {
  const skillIds = new Set();
  const canonicalPaths = new Set();
  
  manifest.skills.forEach((s, idx) => {
    // 3. 检查重复的 Skill ID
    if (skillIds.has(s.id)) {
      ok = false;
      errors.push({
        type: 'DUPLICATE_SKILL_ID',
        id: s.id,
        message: `清单中存在重复声明的技能 ID: [${s.id}]`,
        fix: '在清单中合并重复的技能项。'
      });
    }
    skillIds.add(s.id);

    // 4. 检查是否声明了多个 Canonical 路径
    const fullInsPath = path.resolve(rootDir, s.instructionPath);
    if (s.canonical) {
      if (canonicalPaths.has(s.id)) {
        warnings.push({
          type: 'MULTIPLE_CANONICAL_DECLARATIONS',
          id: s.id,
          message: `技能 ID [${s.id}] 具有多个 canonical 物理副本路径。`
        });
      }
      canonicalPaths.add(s.id);
    }

    // 5. 检查 Manifest 中声明但文件物理不存在的 Skill
    if (!fs.existsSync(fullInsPath)) {
      ok = false;
      errors.push({
        type: 'INVALID_INSTRUCTION_PATH',
        id: s.id,
        path: s.instructionPath,
        message: `技能清单中声明的文件在物理磁盘中不存在: ${s.instructionPath}`,
        fix: `请在 ${s.instructionPath} 路径下建立 INSTRUCTION.md，或修正清单中的配置。`
      });
    }

    // 6. 检查是否有子技能的 visibility 设为了 public
    if (s.visibility === 'public') {
      ok = false;
      errors.push({
        type: 'PUBLIC_VISIBILITY_LEAK',
        id: s.id,
        message: `内部子技能 [${s.id}] 的 visibility 被错误设为了 'public'！这与单入口网关规范冲突。`,
        fix: "将 visibility 修改为 'internal'。"
      });
    }
  });

  // 7. 检查物理存在但是不在清单中的 Orphan (孤儿) 技能
  if (fs.existsSync(internalSkillsDir)) {
    const categories = fs.readdirSync(internalSkillsDir);
    categories.forEach(cat => {
      const catPath = path.join(internalSkillsDir, cat);
      if (fs.statSync(catPath).isDirectory() && cat !== 'router') {
        const subcats = fs.readdirSync(catPath);
        subcats.forEach(subcat => {
          const subcatPath = path.join(catPath, subcat);
          if (fs.statSync(subcatPath).isDirectory()) {
            const insFile = path.join(subcatPath, 'INSTRUCTION.md');
            if (fs.existsSync(insFile)) {
              // 检查这个 subcat 是否被清单管理了（检查 id 和 aliases）
              const registered = manifest.skills.some(s => 
                s.id.toLowerCase() === subcat.toLowerCase() || 
                (s.aliases && s.aliases.some(alias => alias.toLowerCase() === subcat.toLowerCase()))
              );
              if (!registered) {
                warnings.push({
                  type: 'ORPHAN_SKILL',
                  path: `internal-skills/${cat}/${subcat}`,
                  message: `物理技能目录 [internal-skills/${cat}/${subcat}] 未在 skills-manifest.json 配置文件中注册！`,
                  fix: '在 skills-manifest.json 中增加此技能声明项目。'
                });
              }
            }
          }
        });
      }
    });
  }

  // 8. 检查触发词和描述高度相似的情况（冲突隐患）
  for (let i = 0; i < manifest.skills.length; i++) {
    for (let j = i + 1; j < manifest.skills.length; j++) {
      const s1 = manifest.skills[i];
      const s2 = manifest.skills[j];
      
      // 两两对比触发词相交集
      const intersect = s1.triggers.filter(t => s2.triggers.includes(t));
      if (intersect.length >= 4) {
        warnings.push({
          type: 'HIGH_TRIGGER_COLLISION',
          skills: [s1.id, s2.id],
          collisions: intersect,
          message: `技能 [${s1.id}] 与 [${s2.id}] 的触发词重合度高达 ${intersect.length} 个！可能会干扰路由分类判定。`,
          fix: '优化两者的触发词，提高语义区分度。'
        });
      }
    }
  }
}

// 9. 扫描所有 Markdown 文件，检查是否有本机绝对路径和文件内链损坏
const allMdFiles = getFiles(rootDir, '.md');
const absolutePathPattern = /C:\/Users\/a1028\/[^\s"'\)]+/gi;
allMdFiles.forEach(file => {
  // 排除医生健康检查以及重构脚本本身
  const relPath = path.relative(rootDir, file).replace(/\\/g, '/');
  if (relPath.startsWith('scripts/') || relPath.startsWith('node_modules/')) return;

  const content = fs.readFileSync(file, 'utf8');

  const isHistoryOrProposal = relPath.includes('修改建议.md') ||
                              relPath.includes('修复建议.md') ||
                              relPath.includes('ROUTER_OPTIMIZATION_PROPOSAL.md') ||
                              relPath.includes('optimization-plan.md') ||
                              relPath.includes('walkthrough.md');

  // 9.1 根目录 SKILL.md frontmatter 粘连语法检查
  if (relPath === 'SKILL.md') {
    if (/description:.*---/i.test(content)) {
      ok = false;
      errors.push({
        type: 'SKILL_FM_STICKY',
        file: relPath,
        message: '根目录 SKILL.md 中的 description 描述与结束 --- 粘连在了同一行！',
        fix: '请将 结束 --- 单独分行放置。'
      });
    }
  }

  // 9.2 核心策略路径指导 废弃脚本调用 ../scripts/ 检查
  if (relPath.startsWith('router/')) {
    if (content.includes('../scripts/route.js')) {
      ok = false;
      errors.push({
        type: 'OUTDATED_SCRIPT_CALL_PATH',
        file: relPath,
        message: `在策略文件 ${relPath} 中发现了已废弃的相对路径脚本调用 ../scripts/route.js！`,
        fix: '请修改为规范的 scripts/route.js 路径。'
      });
    }
  }

  // 9.4 废弃变量定义检查（屏蔽迁移历史与本复查说明文档本身）
  if (!isHistoryOrProposal) {
    if (content.includes('BUSINESS_SKILL_ROOT = skills') || content.includes('SUPER_SKILL_ROOT = skills')) {
      ok = false;
      errors.push({
        type: 'OUTDATED_VARIABLE_DEFINITION',
        file: relPath,
        message: `在非历史文档 ${relPath} 中发现了已废弃的 BUSINESS_SKILL_ROOT = skills 或 SUPER_SKILL_ROOT = skills 示例！`,
        fix: '请统一修改为 internal-skills 以及 . 指代。'
      });
    }
  }

  // 9.5 核心文档 Mojibake 乱码断言检查 (降级为 warning 告警)
  const coreDocs = [
    'SKILL.md', 'AGENTS.md', 'README.md',
    'router/CATEGORY_INDEX.md', 'router/SKILL_POLICY.md', 'router/ROUTER.md',
    'docs/zh-usage.md', 'CONTRIBUTING.md'
  ];
  const isCoreOrRouter = coreDocs.includes(relPath) || relPath.startsWith('router/');
  if (isCoreOrRouter) {
    const mojibakePattern = /[锛銆鐨璺褰涓]/g;
    const matches = content.match(mojibakePattern);
    if (matches && matches.length > 0) {
      warnings.push({
        type: 'MOJIBAKE_DOCUMENT',
        file: relPath,
        count: matches.length,
        message: `在核心指导文档 ${relPath} 中检测到了共 ${matches.length} 处 mojibake 中文乱码符号（如 ${[...new Set(matches)].join(', ')}）！`,
        fix: '请使用纯净的标准中文完全重写修复此文件，消除任何乱码残留。'
      });
    }
  }

  // 检查本机硬编码绝对路径
  if (absolutePathPattern.test(content)) {
    warnings.push({
      type: 'HARDCODED_ABSOLUTE_PATH',
      file: relPath,
      message: `在 Markdown 文件 ${relPath} 中发现了本机绝对路径引用！`,
      fix: '建议修改为相对路径以保证项目的跨设备可移植性。'
    });
  }

  // 验证 markdown 内部链接损坏情况
  const fileLinkPattern = /file:\/\/\/([^\s"'\)`]+)/g;
  let match;
  while ((match = fileLinkPattern.exec(content)) !== null) {
    const rawUrl = match[1];
    const decodedPath = decodeURIComponent(rawUrl).replace(/\\/g, '/');
    const fileExists = fs.existsSync(decodedPath);
    if (!fileExists) {
      ok = false;
      errors.push({
        type: 'BROKEN_FILE_LINK',
        file: relPath,
        link: match[0],
        message: `在文件 ${relPath} 中发现了损坏的绝对路径引用 [${match[0]}]。`,
        fix: '请修改该引用，使其指向物理存在的文件路径。'
      });
    }
  }
});

// ==================== 10. 路由样例冒烟与物理路径可达性校验 ====================
console.log('🧪 执行 route.js 动态路由输出路径冒烟检查...');
const execSync = require('child_process').execSync;
const smokeCases = [
  "修复 React 页面按钮样式 bug",
  "review backend auth API security",
  "给论文实验结果写 rebuttal",
  "把需求拆成 GitHub issues",
  "配置 nginx 反向代理和 https 证书"
];

smokeCases.forEach((query, idx) => {
  try {
    const routeScriptPath = path.join(rootDir, 'scripts', 'route.js');
    const cmd = `node "${routeScriptPath}" --query "${query}" --workspace "${rootDir}"`;
    const outputRaw = execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
    const result = JSON.parse(outputRaw);

    // 验证核心字段
    if (!result.primary) {
      ok = false;
      errors.push({
        type: 'SMOKE_ROUTE_FAIL',
        message: `用例 [${query}] 的路由输出中缺失 primary 技能字段。`
      });
    } else {
      if (manifest && manifest.skills) {
        const hasSkill = manifest.skills.some(s => s.id.toLowerCase() === result.primary.toLowerCase());
        if (!hasSkill) {
          ok = false;
          errors.push({
            type: 'SMOKE_ROUTE_INVALID_PRIMARY',
            message: `用例 [${query}] 输出的 primary 技能 [${result.primary}] 未在清单中注册！`
          });
        }
      }
    }

    // 验证 filesToRead 是否全部真实存在于磁盘上
    if (Array.isArray(result.filesToRead)) {
      result.filesToRead.forEach(p => {
        const absFile = path.resolve(rootDir, p);
        if (!fs.existsSync(absFile)) {
          ok = false;
          errors.push({
            type: 'SMOKE_ROUTE_MISSING_FILE',
            message: `用例 [${query}] 返回的待读取文件在磁盘上不存在: ${p}`
          });
        }
      });
    }

    // 验证 absoluteSkillPath 是否真实存在
    if (result.absoluteSkillPath) {
      if (!fs.existsSync(result.absoluteSkillPath)) {
        ok = false;
        errors.push({
          type: 'SMOKE_ROUTE_MISSING_ABSOLUTE_SKILL',
          message: `用例 [${query}] 返回的绝对路径主技能文件不存在: ${result.absoluteSkillPath}`
        });
      }
    }

    // 验证 absoluteAuxiliaryPaths 列表是否全都真实存在
    if (Array.isArray(result.absoluteAuxiliaryPaths)) {
      result.absoluteAuxiliaryPaths.forEach(p => {
        if (!fs.existsSync(p)) {
          ok = false;
          errors.push({
            type: 'SMOKE_ROUTE_MISSING_ABSOLUTE_AUXILIARY',
            message: `用例 [${query}] 返回的绝对路径辅助技能文件不存在: ${p}`
          });
        }
      });
    }

    // 验证中置信度下的数据一致性 (filesToRead 与 auxiliary 数量对齐)
    if (result.confidence < 0.80 && result.confidence >= 0.50) {
      const filesCountWithoutCategoryIndex = result.filesToRead.filter(p => !p.includes('CATEGORY_INDEX.md')).length;
      const expectedCount = 1 + (result.auxiliary ? result.auxiliary.length : 0);
      if (filesCountWithoutCategoryIndex !== expectedCount) {
        ok = false;
        errors.push({
          type: 'SMOKE_ROUTE_LIST_INCONSISTENT',
          message: `用例 [${query}] 处于中置信度，但输出的 filesToRead 个数 (${filesCountWithoutCategoryIndex}) 与预期映射个数 (${expectedCount}) 不一致！`
        });
      }
    }
  } catch (err) {
    ok = false;
    errors.push({
      type: 'SMOKE_ROUTE_CRASH',
      message: `用例 [${query}] 运行时崩溃: ${err.message}`
    });
  }
});
// ============================================================================

// 9.3 静态代码死路径检查 (scripts/route.js 中硬编码 grammar-check 路径)
const routeScriptFile = path.join(rootDir, 'scripts/route.js');
if (fs.existsSync(routeScriptFile)) {
  const routeContent = fs.readFileSync(routeScriptFile, 'utf8');
  if (routeContent.includes('internal-skills/document/grammar-check')) {
    ok = false;
    errors.push({
      type: 'DEAD_CODE_PATH_LEAK',
      file: 'scripts/route.js',
      message: '在 scripts/route.js 中检测到了硬编码残留的 grammar-check 死代码物理路径！',
      fix: '请完全通过清单动态检索，删除该写死的硬编码字符串。'
    });
  }
}

// 输出终期评估
console.log('\n================ 健康体检诊断报告 ================');
console.log(`诊断结果: ${ok ? '💚 PASS (健康良好)' : '❌ FAIL (存在致命异常)'}`);
console.log(`致命错误项数: ${errors.length}`);
console.log(`潜在警告隐患项数: ${warnings.length}\n`);

if (errors.length > 0) {
  console.log('🛑 [致命错误列表] 需要立即纠正:');
  errors.forEach((err, index) => {
    console.log(`  ${index + 1}. [${err.type}] 在 ${err.file || err.path || '仓库'} : ${err.message}`);
    if (err.fix) console.log(`     👉 修复方案: ${err.fix}`);
  });
}

if (warnings.length > 0) {
  console.log('\n⚠️  [潜在风险列表] 建议在后续迭代中优化:');
  warnings.forEach((warn, index) => {
    console.log(`  ${index + 1}. [${warn.type}] : ${warn.message}`);
    if (warn.fix) console.log(`     👉 优化建议: ${warn.fix}`);
  });
}
console.log('==================================================');

process.exit(ok ? 0 : 1);
