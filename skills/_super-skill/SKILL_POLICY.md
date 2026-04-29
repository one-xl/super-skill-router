# Skill Policy

## 定位

本文件定义 Skill 的使用、安装、更新和安全边界。

它不负责选择具体业务 Skill；具体路由仍由 `CATEGORY_INDEX.md`、`CATEGORY_TAG.md`、`SUBCATEGORY_INDEX.md` 和 `SKILL_TAG.md` 决定。

## 默认策略

- 默认可以读取 Router 自身规则文件。
- 默认可以读取候选分类和候选子类标签。
- 默认只在命中读取条件时读取完整 `SKILL.md`。
- 默认不安装外部 Skill。
- 默认不覆盖已有 Skill。
- 默认不扫描全部 Skill。
- 默认不把标签文件当作完整知识来源。

## 自动允许

以下行为可以自动执行：

- 读取 `CATEGORY_INDEX.md`。
- 读取 1 到 3 个候选分类的 `CATEGORY_TAG.md`。
- 读取 1 到 3 个候选子类的 `SKILL_TAG.md`。
- 读取命中条件的完整 `SKILL.md`。
- 读取 `PROJECT_PROFILE.md` 做轻量项目识别。
- 读取 `AUXILIARY_SKILLS.md` 选择已登记辅助 Skill。
- 读取 `ROUTING_TRACE.md` 生成内部路由摘要。

## 需要用户确认

以下行为必须等待用户明确确认：

- 运行 `npx skills add`。
- 下载远程 Skill。
- 安装外部 Skill。
- 覆盖已有 Skill 文件。
- 修改 Skill 索引文件。
- 修改 Codex 全局 `~/.codex/skills`。
- 将未审计或低置信度来源加入 `SKILL_REGISTRY.md`。

## 默认辅助 Skill

### karpathy-guidelines

触发：编码、改代码、重构、审查、修 bug、加测试、设计实现方案。  
权限：可以自动作为辅助 Skill 使用。  
限制：只作为执行约束，不作为领域知识来源。

## 外部 Skill 策略

- 默认来源为 `skills.sh`。
- 外部 Skill 只生成 `Skill Install Proposal`，不静默安装。
- 优先选择审计通过、来源清晰、安装量较高、任务匹配度高的 Skill。
- 如果审计结果为 `fail`、`HIGH` 或 `CRITICAL`，不要建议安装，除非用户明确要求并接受风险。
- 如果没有审计结果，可以列为候选，但必须标记为“需要人工确认风险”。

## 低置信度策略

当路由置信度为 `low` 时：

1. 不要读取大量 Skill 来试错。
2. 提出一个最小澄清问题，或生成候选路由说明。
3. 如果用户要求继续，选择最小可行 Skill 组合。

## 更新策略

- 可复用经验进入 `Skill Update Proposal`。
- 新外部来源进入 `Skill Install Proposal`。
- 只有用户明确说“确认更新”时，才修改 Skill 文件。
- 只有用户明确说“确认安装”时，才安装外部 Skill。

