---
name: super-skill-router
description: Global entrypoint for Super Skill Router. MUST BE TRIGGERED for ANY coding, development, bug fixing, refactoring, code review, UI/UX design, or architecture task.
---

# Super Skill Router 全局入口

当用户请求编程、写代码、开发、修bug、前端、后端或任何复杂任务时，必须触发此路由以选择合适的专业 Skill。

此文件将本仓库作为 Codex/Antigravity 全局 Skill 进行安装。

## 核心变量与路径解析

- **THIS_SKILL_DIR**：包含当前 `SKILL.md` 的目录。
- **SUPER_SKILL_ROOT**：指向 `THIS_SKILL_DIR`。
- **BUSINESS_SKILL_ROOT**：
  1. 如果当前工作区中包含 `internal-skills/` 目录，则优先使用该目录作为业务技能库。
  2. 否则，使用 `THIS_SKILL_DIR/internal-skills` 作为内置专业技能库。

## 自动路由执行方式

如果 Node.js 环境可用，智能体通过运行以下命令获取路由推荐：

```bash
node <SUPER_SKILL_ROOT>/scripts/route.js --query "<用户任务>" --workspace "<项目绝对路径>"
```

该命令输出包含 `primary`、`auxiliary`、`confidence`、`filesToRead` 的标准 JSON 结果。

## 路由维护策略文档

在决策或维护路由时，请按需调阅以下配置文件：

- **大类索引**：[router/CATEGORY_INDEX.md](file:///router/CATEGORY_INDEX.md) （定义分类与标签）
- **梯队排行榜**：[router/SKILL_RANKINGS.md](file:///router/SKILL_RANKINGS.md) （规定技能的优先级与替代规则）
- **安全与控制边界**：[router/SKILL_POLICY.md](file:///router/SKILL_POLICY.md) （关于确认、惰性加载与辅助 Skill 的规定）
- **路由细节**：[router/ROUTER.md](file:///router/ROUTER.md) （机器与 Agent 具体的路由步骤说明）
