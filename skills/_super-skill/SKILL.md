---
name: super-skill-router
description: Route AI Agent tasks to the right Skill with progressive disclosure. Use when an agent needs to select, combine, acquire, or maintain Skills without reading all Skill files at once; supports same-repository and external dependency modes.
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
- 支持缺少本地 Skill 时通过 `skills.sh` 生成外部 Skill 安装建议。
- 支持根据任务类型自动选择辅助 Skill。
- 支持轻量项目识别、Skill 使用策略和可选路由解释。
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
11. 如果本地缺少 Skill，应优先通过 `skills.sh` 生成 Skill Install Proposal。
12. 不要从未知来源静默下载或安装 Skill。
13. 辅助 Skill 必须显式登记，不要扫描全部全局 Skill。
14. 项目识别只读取少量根目录高信号文件。
15. 默认不输出完整路由过程，除非用户要求。

## 默认读取流程

1. 读取本文件。
2. 读取 `SUPER_SKILL_ROOT/_super-skill/CATEGORY_INDEX.md`。
3. 读取 `SKILL_POLICY.md`，确认自动读取、安装、更新和辅助 Skill 边界。
4. 如果任务涉及代码、构建、部署、测试或项目结构，读取 `PROJECT_PROFILE.md` 做轻量项目识别。
5. 根据用户任务和项目画像选择候选大类。
6. 优先从 `BUSINESS_SKILL_ROOT` 读取候选大类的 `CATEGORY_TAG.md`。
7. 如果 `BUSINESS_SKILL_ROOT` 没有该大类，再从 `SUPER_SKILL_ROOT` 示例 Skill 中 fallback。
8. 读取候选大类的 `SUBCATEGORY_INDEX.md`。
9. 读取候选子类的 `SKILL_TAG.md`。
10. 只有当 `SKILL_TAG.md` 明确要求时，才读取完整 `SKILL.md`。
11. 如果任务涉及编码、审查、重构或测试，读取 `AUXILIARY_SKILLS.md` 并选择必要辅助 Skill。
12. 如果没有合适 Skill，读取 `ACQUISITION_RULES.md`，通过 `skills.sh` 判断是否需要生成 Skill Install Proposal。
13. 执行任务。
14. 如用户要求说明路由过程，读取 `ROUTING_TRACE.md` 输出简短摘要。
15. 读取 `UPDATE_RULES.md`，判断是否需要生成 Skill Update Proposal。

## 路径优先级

1. Super Skill 自身规则从 `SUPER_SKILL_ROOT/_super-skill` 读取。
2. 业务 Skill 优先从 `BUSINESS_SKILL_ROOT` 读取。
3. 如果 `BUSINESS_SKILL_ROOT` 没有对应分类或子类，可以 fallback 到 `SUPER_SKILL_ROOT` 下的示例 Skill。
4. 如果示例 Skill 也没有合适内容，则读取 `ACQUISITION_RULES.md` 并到 `skills.sh` 查找候选 Skill。
5. 如果 `skills.sh` 没有合适内容，则生成 Skill Update Proposal。
6. Proposal 应建议用户把新 Skill 添加到 `BUSINESS_SKILL_ROOT`，而不是改 Super Skill 框架本身。

## 外部 Skill 获取

- 默认外部 Skill 来源为 `https://skills.sh/`。
- 优先使用 `skills.sh` 搜索、详情和审计信息判断候选 Skill。
- 可将高频可信 Skill 记录到 `SUPER_SKILL_ROOT/_super-skill/SKILL_REGISTRY.md` 作为本地缓存。
- 只使用 `skills.sh`、注册表中明确列出的来源，或用户本次明确提供的来源。
- 默认只生成 `Skill Install Proposal`。
- 只有用户明确说“确认安装”时，才通过 `npx skills add <skill-name-or-source>` 下载或安装外部 Skill。
- 安装目标优先为 `BUSINESS_SKILL_ROOT`，避免修改 Super Skill Router 框架。

## 输出约束

- 回答用户任务时，不要暴露过多内部路由细节。
- 如果用户要求说明使用了哪些 Skill，可以给出主 Skill 和辅助 Skill。
- 如果任务跨领域，必须区分主 Skill 和辅助 Skill。
- 编码任务默认把 `karpathy-guidelines` 作为辅助 Skill，用于控制实现质量。
- 如果用户要求解释 Skill 选择，使用 `ROUTING_TRACE.md` 的简短格式。
- 如果产生可复用经验，末尾生成 Skill Update Proposal。
- 如果缺少本地 Skill 但 `skills.sh` 有候选，生成 Skill Install Proposal。
- 默认不要直接修改 Skill 文件。
- 只有用户明确说“确认更新”时，才执行文件更新。
- 只有用户明确说“确认安装”时，才安装外部 Skill。

## 继续读取

- 路由细则：读取 `SUPER_SKILL_ROOT/_super-skill/ROUTER.md`。
- 使用策略：需要安装、更新、辅助 Skill 或低置信度判断时读取 `SUPER_SKILL_ROOT/_super-skill/SKILL_POLICY.md`。
- 项目画像：代码、构建、部署、测试任务可读取 `SUPER_SKILL_ROOT/_super-skill/PROJECT_PROFILE.md`。
- 辅助 Skill：需要时读取 `SUPER_SKILL_ROOT/_super-skill/AUXILIARY_SKILLS.md`。
- 路由解释：用户要求时读取 `SUPER_SKILL_ROOT/_super-skill/ROUTING_TRACE.md`。
- 外部 Skill 获取：需要时读取 `SUPER_SKILL_ROOT/_super-skill/ACQUISITION_RULES.md`。
- 更新判断：任务结束后读取 `SUPER_SKILL_ROOT/_super-skill/UPDATE_RULES.md`。
