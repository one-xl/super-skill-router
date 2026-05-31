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
- 支持读取本机 Skill 精简目录，按任务选择已安装全局 Skill。
- 支持轻量项目识别、Skill 使用策略和可选路由解释。
- 支持路由置信度、外部 Skill 锁定记录和结构健康检查。
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
3. 优先使用 CodeGraph 路由引擎：运行 `node <THIS_SKILL_DIR>/scripts/route.js --query "<user_query>" --workspace "<active_workspace>"` 全自动、智能化分析项目结构与匹配 Skill。
4. 在脚本执行成功后，实行**渐进式披露**（Progressive Disclosure）：仅加载脚本返回的 `skillFile` 及其指定匹配的 `progressiveReferences` 列表文件，避免 prompt 膨胀与上下文浪费。
5. 默认只读取入口文件和 `CATEGORY_INDEX.md`（脚本未运行成功时的回退方案）。
6. 先读大类索引。
7. 再读候选大类标签。
8. 再读候选子类标签。
9. 最后才读必要的完整 `SKILL.md`。
10. 标签文件只用于判断，不承载完整知识。
11. 具体知识、流程、代码规范写入 `SKILL.md`。
12. 如果没有合适 Skill，不要硬套，应生成 Skill Update Proposal。
13. 如果本地缺少 Skill，应优先通过 `skills.sh` 生成 Skill Install Proposal。
14. 不要从未知来源静默下载或安装 Skill。
15. 辅助 Skill 必须显式登记，不要扫描全部全局 Skill。
16. 项目识别只读取少量根目录高信号文件。
17. 默认不输出完整路由过程，除非用户要求。
18. 路由低置信度时，不要通过读取大量 Skill 来试错。
19. 外部 Skill 安装后应记录 Skill Lock。
20. 健康检查只按索引验证结构，不读取所有完整 Skill。
21. 本机全局 Skill 只能通过 `LOCAL_SKILL_CATALOG.md` 精简目录选择。

## 默认读取流程

1. 读取本文件。
2. **优先智能路由**：使用 Node.js 运行路由脚本：
   ```bash
   node <SUPER_SKILL_ROOT>/../scripts/route.js --query "<用户任务>" --workspace "<当前工作区绝对路径>"
   ```
3. **根据脚本 JSON 结果加载**：如果上述路由脚本执行成功且置信度为 `high` 或 `medium`：
   - 直接读取并加载脚本返回的 `skillFile` 主文件。
   - 实行渐进式披露：仅加载 `progressiveReferences` 数组里列出的子类参考文件（如 `gsap.md`, `taste-skill.md` 等）。
   - 加载指定的 `auxiliarySkills` 辅助 Skill。
   - 直接跳转到**第 16 步（执行任务）**。
4. **手动回退匹配（如果脚本未执行或置信度为 `low`）**：
   - 读取 `SUPER_SKILL_ROOT/_super-skill/CATEGORY_INDEX.md`。
   - 读取 `SKILL_POLICY.md`，确认自动读取、安装、更新和辅助 Skill 边界。
   - 如果任务涉及代码、构建、部署、测试或项目结构，读取 `PROJECT_PROFILE.md` 做轻量项目识别。
   - 根据用户任务和项目画像选择候选大类。
   - 如果分类或子类选择不确定，读取 `ROUTING_CONFIDENCE.md` 判断是否继续、提问或生成 Proposal。
   - 优先从 `BUSINESS_SKILL_ROOT` 读取候选大类的 `CATEGORY_TAG.md`。
   - 如果 `BUSINESS_SKILL_ROOT` 没有该大类，再从 `SUPER_SKILL_ROOT` 示例 Skill 中 fallback。
   - 读取候选大类的 `SUBCATEGORY_INDEX.md`。
   - 读取候选子类的 `SKILL_TAG.md`。
   - 只有当 `SKILL_TAG.md` 明确要求时，才读取完整 `SKILL.md`。
   - 如果任务涉及编码、审查、重构或测试，读取 `AUXILIARY_SKILLS.md` 并选择必要辅助 Skill。
5. 如果任务明显命中已安装全局 Skill，读取 `LOCAL_SKILL_CATALOG.md` 选择候选。
6. 如果没有合适 Skill，读取 `ACQUISITION_RULES.md`，通过 `skills.sh` 判断是否需要生成 Skill Install Proposal。
7. 外部 Skill 安装或更新完成后，读取 `SKILL_LOCK.md` 并生成锁定记录建议。
8. **执行任务**。
9. 如用户要求说明路由过程，读取 `ROUTING_TRACE.md` 输出简短摘要。
10. 如用户要求检查 Skill 结构，读取 `HEALTH_CHECK.md`。
11. 读取 `UPDATE_RULES.md`，判断是否需要生成 Skill Update Proposal。

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
- 外部 Skill 安装后，生成或更新 Skill Lock 记录。
- 用户要求健康检查时，按索引输出结构检查结果。
- 默认不要直接修改 Skill 文件。
- 只有用户明确说“确认更新”时，才执行文件更新。
- 只有用户明确说“确认安装”时，才安装外部 Skill。

## 继续读取

- 路由细则：读取 `SUPER_SKILL_ROOT/_super-skill/ROUTER.md`。
- 使用策略：需要安装、更新、辅助 Skill 或低置信度判断时读取 `SUPER_SKILL_ROOT/_super-skill/SKILL_POLICY.md`。
- 项目画像：代码、构建、部署、测试任务可读取 `SUPER_SKILL_ROOT/_super-skill/PROJECT_PROFILE.md`。
- 路由置信度：分类或子类不确定时读取 `SUPER_SKILL_ROOT/_super-skill/ROUTING_CONFIDENCE.md`。
- 辅助 Skill：需要时读取 `SUPER_SKILL_ROOT/_super-skill/AUXILIARY_SKILLS.md`。
- 本机 Skill 目录：需要使用已安装全局 Skill 时读取 `SUPER_SKILL_ROOT/_super-skill/LOCAL_SKILL_CATALOG.md`。
- 路由解释：用户要求时读取 `SUPER_SKILL_ROOT/_super-skill/ROUTING_TRACE.md`。
- 外部 Skill 获取：需要时读取 `SUPER_SKILL_ROOT/_super-skill/ACQUISITION_RULES.md`。
- Skill Lock：外部 Skill 安装或更新后读取 `SUPER_SKILL_ROOT/_super-skill/SKILL_LOCK.md`。
- 健康检查：用户要求验证、审计或修复 Skill 结构时读取 `SUPER_SKILL_ROOT/_super-skill/HEALTH_CHECK.md`。
- 更新判断：任务结束后读取 `SUPER_SKILL_ROOT/_super-skill/UPDATE_RULES.md`。

