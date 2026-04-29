# Super Skill Router 中文使用教程

本文说明如何在 Codex 或其他 AI Agent 中全局使用 `super-skill-router`，让 Agent 像 Claude Code 一样拥有“全局规则 + 项目 Skill + 按需读取”的工作方式。

## 1. 核心概念

`super-skill-router` 不是万能知识库，而是 Skill 路由框架。它的职责是：

- 先读分类索引，判断任务属于哪些大类。
- 再读候选分类标签，判断是否相关。
- 再读候选子类标签，判断是否需要完整 Skill。
- 最后只读取必要的 `SKILL.md`。
- 如果本地没有合适 Skill，生成更新或安装建议。

两个关键变量：

```text
SUPER_SKILL_ROOT = Super Skill Router 所在的 skills 目录
BUSINESS_SKILL_ROOT = 当前项目实际业务 Skill 所在的 skills 目录
```

## 2. 同仓库模式

适合把 Router 和业务 Skill 放在同一个项目里。

```text
project/
└── skills/
    ├── _super-skill/
    ├── frontend/
    ├── backend/
    └── ...
```

配置含义：

```text
SUPER_SKILL_ROOT = skills
BUSINESS_SKILL_ROOT = skills
入口文件 = skills/_super-skill/SKILL.md
```

使用方式：

1. 让 Agent 从 `skills/_super-skill/SKILL.md` 开始。
2. Agent 读取 `CATEGORY_INDEX.md`。
3. Agent 只读取候选分类和候选子类的标签。
4. 命中条件后，再读取完整 Skill。

## 3. 外部依赖模式

适合把 Router 当成通用依赖，业务 Skill 放在当前项目里。

```text
project/
├── skills/
│   ├── frontend/
│   ├── backend/
│   └── ...
└── vendor/
    └── super-skill-router/
        └── skills/
            └── _super-skill/
```

配置含义：

```text
SUPER_SKILL_ROOT = vendor/super-skill-router/skills
BUSINESS_SKILL_ROOT = skills
入口文件 = vendor/super-skill-router/skills/_super-skill/SKILL.md
```

推荐流程：

1. 当前项目自己的 `skills/` 放业务 Skill。
2. `vendor/super-skill-router/` 放 Router 框架。
3. Router 优先读取 `BUSINESS_SKILL_ROOT`。
4. 如果业务 Skill 缺失，再 fallback 到 Router 内置示例。
5. 如果示例也不够，生成 `Skill Update Proposal` 或 `Skill Install Proposal`。

## 4. Codex 全局安装方式

Codex 的全局 Skill 目录通常是：

```text
~/.codex/skills
```

推荐结构：

```text
~/.codex/
├── AGENTS.md
├── skills/
│   └── super-skill-router/
│       └── SKILL.md
└── vendor/
    └── super-skill-router/
        ├── README.md
        ├── SKILL.md
        └── skills/
            └── _super-skill/
```

这样 Codex 只会发现一个全局入口：

```text
~/.codex/skills/super-skill-router/SKILL.md
```

完整 Router 项目则放在：

```text
~/.codex/vendor/super-skill-router
```

全局入口负责设置：

```text
SUPER_SKILL_ROOT = ~/.codex/vendor/super-skill-router/skills
```

如果当前项目存在 `skills/`，则：

```text
BUSINESS_SKILL_ROOT = 当前项目/skills
```

否则：

```text
BUSINESS_SKILL_ROOT = SUPER_SKILL_ROOT
```

## 5. 如何模拟 Claude Code 的效果

建议组合：

- 全局规则：`~/.codex/AGENTS.md`
- 全局 Router：`~/.codex/skills/super-skill-router/SKILL.md`
- Router 框架：`~/.codex/vendor/super-skill-router`
- 项目知识：当前项目的 `skills/`

项目结构示例：

```text
my-project/
├── AGENTS.md
├── skills/
│   ├── frontend/
│   ├── backend/
│   └── deployment/
└── src/
```

推荐在全局 `AGENTS.md` 中加入类似规则：

```md
For non-trivial tasks, first consider using the global `super-skill-router` skill.
Read the category index, then candidate tags, then full Skills only when needed.
Do not scan all Skills or read every Skill file at once.
```

这样 Agent 会先用全局 Router 做任务分流，再读取项目自己的业务 Skill。

## 6. 缺少 Skill 时如何处理

默认不自动下载或覆盖 Skill。

当本地缺少合适 Skill 时：

1. Router 先检查 `BUSINESS_SKILL_ROOT`。
2. 再检查 `SUPER_SKILL_ROOT` 示例 Skill。
3. 如果仍不够，读取 `ACQUISITION_RULES.md`。
4. 再读取 `SKILL_REGISTRY.md` 查找可信来源。
5. 生成 `Skill Install Proposal`。
6. 只有用户明确说“确认安装”时，才下载、复制或更新索引。

这样可以避免 Agent 静默安装未知仓库内容。

## 7. 添加业务 Skill

新增子类 Skill 时，推荐结构：

```text
skills/
└── backend/
    ├── CATEGORY_TAG.md
    ├── SUBCATEGORY_INDEX.md
    └── database-migration/
        ├── SKILL_TAG.md
        └── SKILL.md
```

操作步骤：

1. 在对应大类下新增子类目录。
2. 写 `SKILL_TAG.md`，只放标签、适用场景和读取完整 Skill 的条件。
3. 写 `SKILL.md`，放完整流程和执行规则。
4. 更新 `SUBCATEGORY_INDEX.md`。
5. 如果是新大类，再更新 `_super-skill/CATEGORY_INDEX.md`。

## 8. 常用触发语

显式使用 Router：

```text
使用 super-skill-router 处理这个任务：...
```

让 Router 检查是否缺少 Skill：

```text
使用 super-skill-router 判断这个任务是否需要新增或安装 Skill：...
```

确认安装外部 Skill：

```text
确认安装上面 proposal 里的 Skill。
```

确认更新本地 Skill：

```text
确认更新上面 proposal 里的 Skill 文件。
```

## 9. 维护原则

- Router 只做路由、组合、维护建议。
- 标签文件只做判断，不承载完整知识。
- 完整流程写在具体子类的 `SKILL.md`。
- 默认不扫描全部 Skill。
- 默认不一次性读取全部 Skill。
- 默认不静默下载外部 Skill。

