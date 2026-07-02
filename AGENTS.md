# AGENTS.md

本仓库面向 AI Agent 使用。在执行任务时，必须严格遵守以下规则。

## 默认入口

Agent 的第一步必须且只能从读取以下文件开始：

```text
SKILL.md
```

## 路由与惰性加载原则

为了最大化节省上下文 Token，严禁盲目读取大量文件：
- **按需索取**：优先读取 `router/CATEGORY_INDEX.md` 确定候选大类。
- **排行榜参考**：访问 `router/SKILL_RANKINGS.md` 以获取大类下的技能梯队优先级。
- **条件触发**：只有在子类的 `SKILL_TAG.md` 中所定义的“读取条件”被任务完全命中时，才允许读取该子类目录下的 `INSTRUCTION.md`。

## 更新与安装原则

- **更新提议**：当任务产生可复用经验时，只生成 `Skill Update Proposal`，严禁擅自修改 Skill 文件。
- **安装提议**：若本地缺失对应 Skill，可查找推荐并生成 `Skill Install Proposal`。
- **确认机制**：只有当用户给出“确认更新”或“确认安装”指令后，才可修改 Skill 内容或执行下载安装。

## 外部依赖模式

在外部依赖模式下，所有的外部 Skill 应优先安装在 `BUSINESS_SKILL_ROOT` (即项目的 `internal-skills` 目录)，不要修改 Router 框架本身的结构。
