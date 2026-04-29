---
name: super-skill-router
description: Route AI Agent tasks to the right Skill with progressive disclosure. Use when an agent needs to select, combine, or maintain Skills without reading all Skill files at once; supports same-repository and external dependency modes.
---

# Super Skill Router

## 定位

本 Skill 是 Skill Router，不是万能 Skill。

它负责：

- 根据用户任务选择合适的 Skill 分类。
- 根据分类标签选择子类 Skill。
- 只在必要时读取完整 Skill。
- 支持多个 Skill 组合。
- 支持任务结束后的 Skill 更新建议。
- 支持缺少本地 Skill 时生成外部 Skill 安装建议。
- 支持同仓库模式和外部依赖模式。

## 核心变量

- `SUPER_SKILL_ROOT` = Super Skill Router 所在的 `skills` 目录。
- `BUSINESS_SKILL_ROOT` = 实际业务 Skill 所在的 `skills` 目录。

### 同仓库模式

```text
SUPER_SKILL_ROOT = skills
BUSINESS_SKILL_ROOT = skills
入口文件 = skills/_super-skill/SKILL.md
```

### 外部依赖模式

```text
SUPER_SKILL_ROOT = vendor/super-skill-router/skills
BUSINESS_SKILL_ROOT = skills
入口文件 = vendor/super-skill-router/skills/_super-skill/SKILL.md
```

## 核心原则

1. 不要一次性读取全部 skills。
2. 不要扫描整个 Skill 目录。
3. 默认只读取入口文件和 CATEGORY_INDEX.md。
4. 先读大类索引。
5. 再读候选大类标签。
6. 再读候选子类标签。
7. 最后才读必要的完整 SKILL.md。
8. 标签文件只用于判断，不承载完整知识。
9. 具体知识、流程、代码规范写入 SKILL.md。
10. 如果没有合适 Skill，不要硬套，应生成 Skill Update Proposal。
11. 如果可信注册表里存在合适外部 Skill，应先生成 Skill Install Proposal。
12. 不要从未知来源静默下载或安装 Skill。

## 默认读取流程

1. 读取本文件。
2. 读取 `SUPER_SKILL_ROOT/_super-skill/CATEGORY_INDEX.md`。
3. 根据用户任务选择候选大类。
4. 优先从 `BUSINESS_SKILL_ROOT` 读取候选大类的 `CATEGORY_TAG.md`。
5. 如果 `BUSINESS_SKILL_ROOT` 没有该大类，再从 `SUPER_SKILL_ROOT` 示例 Skill 中 fallback。
6. 读取候选大类的 `SUBCATEGORY_INDEX.md`。
7. 读取候选子类的 `SKILL_TAG.md`。
8. 只有当 `SKILL_TAG.md` 明确要求时，才读取完整 `SKILL.md`。
9. 执行任务。
10. 如果没有合适 Skill，读取 `ACQUISITION_RULES.md`，判断是否需要生成 Skill Install Proposal。
11. 读取 `UPDATE_RULES.md`，判断是否需要生成 Skill Update Proposal。

## 路径优先级

1. Super Skill 自身规则从 `SUPER_SKILL_ROOT/_super-skill` 读取。
2. 业务 Skill 优先从 `BUSINESS_SKILL_ROOT` 读取。
3. 如果 `BUSINESS_SKILL_ROOT` 没有对应分类或子类，可以 fallback 到 `SUPER_SKILL_ROOT` 下的示例 Skill。
4. 如果示例 Skill 也没有合适内容，则生成 Skill Update Proposal。
5. Proposal 应建议用户把新 Skill 添加到 `BUSINESS_SKILL_ROOT`，而不是改 Super Skill 框架本身。

## 外部 Skill 获取

- 外部 Skill 候选来源记录在 `SUPER_SKILL_ROOT/_super-skill/SKILL_REGISTRY.md`。
- 只使用注册表中明确列出的来源。
- 默认只生成 `Skill Install Proposal`。
- 只有用户明确说“确认安装”时，才下载或复制外部 Skill。
- 安装目标优先为 `BUSINESS_SKILL_ROOT`，避免修改 Super Skill Router 框架。

## 输出约束

- 回答用户任务时，不要暴露过多内部路由细节。
- 如果用户要求说明使用了哪些 Skill，可以给出主 Skill 和辅助 Skill。
- 如果任务跨领域，必须区分主 Skill 和辅助 Skill。
- 如果产生可复用经验，末尾生成 Skill Update Proposal。
- 如果缺少本地 Skill 但注册表有可信候选，生成 Skill Install Proposal。
- 默认不要直接修改 Skill 文件。
- 只有用户明确说“确认更新”时，才执行文件更新。
- 只有用户明确说“确认安装”时，才安装外部 Skill。

## 继续读取

- 路由细则：读取 `SUPER_SKILL_ROOT/_super-skill/ROUTER.md`。
- 外部 Skill 获取：需要时读取 `SUPER_SKILL_ROOT/_super-skill/ACQUISITION_RULES.md`。
- 更新判断：任务结束后读取 `SUPER_SKILL_ROOT/_super-skill/UPDATE_RULES.md`。
