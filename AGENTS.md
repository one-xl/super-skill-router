# AGENTS.md

本仓库面向 AI Agent 使用。执行任务时遵守以下规则。

## 默认入口

从以下文件开始：

```text
skills/_super-skill/SKILL.md
```

## 路由原则

- 先读 `skills/_super-skill/CATEGORY_INDEX.md`。
- 只读取候选分类的 `CATEGORY_TAG.md`。
- 只读取候选子类的 `SKILL_TAG.md`。
- 只有命中 `SKILL_TAG.md` 的读取条件时，才读取完整 `SKILL.md`。
- 不要扫描全部 `skills`。
- 不要一次性读取全部标签文件。
- 不要一次性读取全部完整 Skill。

## 更新原则

- 默认只生成 `Skill Update Proposal`。
- 缺少合适 Skill 时，可以生成 `Skill Install Proposal`。
- 不要直接改 Skill 文件。
- 只有用户明确说“确认更新”或“确认安装”时，才修改文件或安装外部 Skill。
- 外部依赖模式下，优先建议更新 `BUSINESS_SKILL_ROOT`，不要默认改 Router 框架。
- 不要从未知来源静默下载 Skill。

## 内容原则

- 保持文档短小、明确、可执行。
- 标签文件只用于判断，不承载完整知识。
- 完整流程写入具体子类的 `SKILL.md`。
- 示例 Skill 只用于演示框架，不作为完整领域知识库。
