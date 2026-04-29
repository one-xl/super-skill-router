# super-skill-router

`super-skill-router` 是一个可复用的 AI Agent Skill 路由框架。它不是万能知识库，而是让 Agent 先读索引、再读标签、最后只在必要时读取完整 Skill，从而降低 token 消耗并提升 Skill 选择准确性。

## 目标

- 单独复用 Super Skill Router。
- 支持 clone 后直接使用。
- 不依赖任何个人项目或私有 Skill。
- 支持同仓库模式和外部依赖模式。
- 支持大类分类和子类分类。
- 支持只读取标签文件，不一次性读取全部 Skill。
- 支持任务结束后生成 Skill 更新建议。
- 默认不自动覆盖 Skill，除非用户明确确认。
- 支持在本地缺少合适 Skill 时到 [skills.sh](https://skills.sh/) 查找候选并生成 Skill Install Proposal。

## 目录结构

```text
super-skill-router/
├── skills/
│   ├── _super-skill/
│   ├── frontend/
│   ├── backend/
│   ├── document/
│   ├── ai-agent/
│   └── deployment/
├── templates/
└── examples/
```

## 核心变量

- `SUPER_SKILL_ROOT`：Super Skill Router 所在的 `skills` 目录。
- `BUSINESS_SKILL_ROOT`：实际业务 Skill 所在的 `skills` 目录。

### 模式 1：同仓库模式

```text
project/
└── skills/
    ├── _super-skill/
    ├── frontend/
    ├── backend/
    └── ...
```

```text
SUPER_SKILL_ROOT = skills
BUSINESS_SKILL_ROOT = skills
入口文件 = skills/_super-skill/SKILL.md
```

### 模式 2：外部依赖模式

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

```text
SUPER_SKILL_ROOT = vendor/super-skill-router/skills
BUSINESS_SKILL_ROOT = skills
入口文件 = vendor/super-skill-router/skills/_super-skill/SKILL.md
```

## 使用方式

1. 将本仓库作为独立仓库使用，或复制到项目的 `vendor/super-skill-router/`。
2. 让 AI Agent 读取入口文件：`skills/_super-skill/SKILL.md`。
3. Agent 按照路由规则读取 `CATEGORY_INDEX.md`、候选分类标签、候选子类标签。
4. 只有当标签命中读取条件时，才读取完整 `SKILL.md`。
5. 任务结束后，如果产生可复用经验，生成 `Skill Update Proposal`。

更完整的中文使用教程见 [docs/zh-usage.md](docs/zh-usage.md)。

## 外部 Skill 安装

当 `BUSINESS_SKILL_ROOT` 和 `SUPER_SKILL_ROOT` 都没有合适 Skill 时，Router 可以读取 `skills/_super-skill/ACQUISITION_RULES.md`，并通过 `skills.sh` 查找可安装的外部 Skill。

默认策略：

- 可以自动判断缺失 Skill。
- 可以通过 `skills.sh` 搜索候选 Skill。
- 可以生成 `Skill Install Proposal`。
- 不默认下载或安装外部 Skill。
- 只有用户明确确认安装时，才下载、安装或更新索引。
- 外部依赖模式下，优先安装到 `BUSINESS_SKILL_ROOT`，不修改 Router 框架。
- 推荐安装命令：`npx skills add <skill-name-or-source>`。

## 设计边界

- 不扫描全部 `skills`。
- 不一次性读取全部 `SKILL.md`。
- 不把标签文件写成完整知识库。
- 不把 Super Skill 写成超大知识库。
- 具体领域知识应放在业务 Skill 中，而不是放进 Router。
- 外部 Skill 默认只从 `skills.sh`、本地注册表或用户明确提供的来源获取。
- 不从未知来源静默下载 Skill。

## 添加新 Skill

优先使用 `templates/` 中的模板：

- `CATEGORY_TAG.template.md`
- `SUBCATEGORY_INDEX.template.md`
- `SKILL_TAG.template.md`
- `SKILL.template.md`
- `SKILL_REGISTRY.template.md`

新增大类时，同步更新 `skills/_super-skill/CATEGORY_INDEX.md`。新增子类时，同步更新对应分类的 `SUBCATEGORY_INDEX.md`。

## 标识

一XL

