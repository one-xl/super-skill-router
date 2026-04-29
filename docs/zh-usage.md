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

### 自动使用编码辅助 Skill

Router 支持按任务类型自动选择辅助 Skill。

默认规则：

- 写代码、改代码、修 bug、重构、审查、加测试时，自动选择 `karpathy-guidelines`。
- `karpathy-guidelines` 只做辅助约束，不替代主 Skill。
- 主 Skill 仍由任务领域决定，例如前端任务主 Skill 是 `frontend/web-frontend`，后端任务主 Skill 是 `backend/api-backend`。
- 不扫描全部全局 Skill，只读取 `AUXILIARY_SKILLS.md` 中显式登记的辅助 Skill。

示例：

```text
用户任务：帮我修复这个 React 表单 bug。
主 Skill：frontend/web-frontend
辅助 Skill：karpathy-guidelines
```

执行效果：

- 先按前端 Skill 理解 UI 和代码结构。
- 再用 `karpathy-guidelines` 约束实现：最小修改、避免过度设计、明确验证。
- 输出时默认不展示内部路由细节，除非用户询问使用了哪些 Skill。

## 6. 缺少 Skill 时如何处理

默认不自动下载或覆盖 Skill。

当本地缺少合适 Skill 时：

1. Router 先检查 `BUSINESS_SKILL_ROOT`。
2. 再检查 `SUPER_SKILL_ROOT` 示例 Skill。
3. 如果仍不够，读取 `ACQUISITION_RULES.md`。
4. 优先到 `https://skills.sh/` 搜索候选 Skill。
5. 可选读取 `SKILL_REGISTRY.md` 中缓存的可信来源。
6. 生成 `Skill Install Proposal`。
7. 只有用户明确说“确认安装”时，才下载、复制或更新索引。

这样可以避免 Agent 静默安装未知仓库内容。

### skills.sh 安装流程

Router 使用 `skills.sh` 时遵循以下流程：

1. 根据任务生成搜索关键词。
2. 查询 `https://skills.sh/api/v1/skills/search?q=[query]&limit=5`。
3. 读取候选 Skill 详情和审计信息。
4. 排除明显重复、低相关或高风险候选。
5. 生成包含来源、安装命令和目标路径的 `Skill Install Proposal`。
6. 用户确认后运行安装命令。

常用安装命令：

```text
npx skills add <skill-name-or-source>
```

如果 `skills.sh` 提供 `installUrl`：

```text
npx skills add <installUrl>
```

默认建议关闭安装遥测。

Windows PowerShell：

```powershell
$env:DISABLE_TELEMETRY='1'; npx skills add <skill-name-or-source>
```

macOS / Linux：

```sh
DISABLE_TELEMETRY=1 npx skills add <skill-name-or-source>
```

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

让 Router 从 skills.sh 查找外部 Skill：

```text
如果本地没有合适 Skill，请到 skills.sh 查找候选，并给我 Skill Install Proposal。
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
