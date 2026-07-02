# Skill Security Policy (技能安全审查策略)

此文件定义 Super Skill Router 的安全审计规则与集成 NVIDIA SkillSpector 后的安全策略。

## 安全扫描机制

我们在 `super-skill-router` 审计流程（`--audit`）中集成了 NVIDIA 的 **SkillSpector** 静态安全扫描引擎。
每次运行审计或进行全局分发同步（`--update`）时，系统都会自动对 `internal-skills/` 文件夹下的所有文件进行全量扫描。

### 扫描范围
- **静态规则匹配**：利用 YARA 规则等引擎，静态分析所有文本文件（`.md` / `.js` / `.py` 等），寻找潜在的 Prompt 注入、命令注入（`shell=True`）、非法环境变量获取、高敏感 API 调用等。
- **二进制排除**：自动过滤 `.mp3`、`.png`、`.jpg`、`.zip` 等静态音频/图片/压缩资源，减少误报噪音。

## 扫描结果处理策略

当 SkillSpector 完成扫描并返回报告后，路由脚本根据 findings 做出以下处理决策：

1. **PASS（安全通过）**：
   - 零漏洞 findings（或 findings 仅存在于被过滤的二进制静态资源中）。
   - 允许顺利进行全局分发和更新同步。

2. **WARN（轻微警告）**：
   - 发现了 `LOW` 或 `MEDIUM` 级别的漏洞/敏感词，但其存在于测试用例、说明文档、或者低风险场景中。
   - 终端打印详细的 finding 位置与整改建议。允许完成同步，但建议后续尽快整改。

3. **FAIL（安全拦截）**：
   - 发现了任意一个 **`HIGH`** 或 **`CRITICAL`** 级别的严重安全隐患（如恶意的命令参数拼接、未授权的敏感数据泄露或恶意 prompt）。
   - **安全机制会立刻拦截同步**！在 `executeUpdates` 模式下将抛出错误并退出，禁止将此版本的技能包同步部署到全局技能目录中。

## 如何处理拦截 (FAIL)

1. 打开 SkillSpector 的扫描报告，定位到具体的漏洞文件与行数。
2. 按照报告中的 **Remediation（整改建议）** 修改源文件：
   - 清除恶意的 Prompt 注入语句。
   - 对任何外部命令参数或工具参数添加白名单验证。
   - 移除 Pen-test 类似的网络探测特征或硬编码的敏感密钥。
3. 重新运行 `node scripts/route.js --audit` 进行验证，直到安全等级变为 `PASS`。
