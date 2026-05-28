# Router Rules

## Step 1：初始化

确定：

- `SUPER_SKILL_ROOT`
- `BUSINESS_SKILL_ROOT`
- 用户任务

如果用户没有显式提供变量，则默认：

```text
SUPER_SKILL_ROOT = skills
BUSINESS_SKILL_ROOT = skills
```

## Step 2：读取总索引

读取：

```text
SUPER_SKILL_ROOT/_super-skill/CATEGORY_INDEX.md
```

禁止：

- 扫描全部 `skills`
- 一次性读取全部 `CATEGORY_TAG.md`
- 一次性读取全部 `SKILL_TAG.md`
- 一次性读取全部 `SKILL.md`

## Step 3：读取策略边界

读取：

```text
SUPER_SKILL_ROOT/_super-skill/SKILL_POLICY.md
```

用于确认哪些行为可以自动执行，哪些行为必须用户确认。

## Step 4：轻量项目识别

如果任务涉及代码、构建、部署、测试或项目结构，读取：

```text
SUPER_SKILL_ROOT/_super-skill/PROJECT_PROFILE.md
```

只读取该文件允许的根目录高信号文件，不递归扫描源码。

## Step 5：选择候选大类

根据 `CATEGORY_INDEX.md` 的关键词标签，选择 1 到 3 个候选大类。

如果任务明显跨领域，可以选择多个大类。

如果无法判断，选择最可能的大类，并在必要时提出一个最小问题。

如果分类或子类选择不确定，读取：

```text
SUPER_SKILL_ROOT/_super-skill/ROUTING_CONFIDENCE.md
```

根据置信度决定继续、提出一个最小问题，或生成 Proposal。不要通过读取大量 Skill 来提高置信度。

## Step 6：读取候选大类标签

对每个候选大类，优先读取：

```text
BUSINESS_SKILL_ROOT/[category]/CATEGORY_TAG.md
```

如果不存在，则读取：

```text
SUPER_SKILL_ROOT/[category]/CATEGORY_TAG.md
```

如果两者都不存在，则记录为缺失分类，后续生成 Skill Install Proposal 或 Skill Update Proposal。

## Step 7：读取子类索引

如果 `CATEGORY_TAG.md` 判断该大类相关，则读取：

```text
BUSINESS_SKILL_ROOT/[category]/SUBCATEGORY_INDEX.md
```

如果不存在，则读取：

```text
SUPER_SKILL_ROOT/[category]/SUBCATEGORY_INDEX.md
```

## Step 8：读取候选子类标签

根据 `SUBCATEGORY_INDEX.md`，选择 1 到 3 个候选子类。

只读取候选子类的：

```text
SKILL_TAG.md
```

优先路径：

```text
BUSINESS_SKILL_ROOT/[category]/[subcategory]/SKILL_TAG.md
```

fallback 路径：

```text
SUPER_SKILL_ROOT/[category]/[subcategory]/SKILL_TAG.md
```

## Step 9：读取完整 Skill

只有当 `SKILL_TAG.md` 中的“读取完整 Skill 的条件”命中时，才读取：

```text
SKILL.md
```

优先路径：

```text
BUSINESS_SKILL_ROOT/[category]/[subcategory]/SKILL.md
```

fallback 路径：

```text
SUPER_SKILL_ROOT/[category]/[subcategory]/SKILL.md
```

## Step 10：执行任务

执行时：

- 明确主 Skill。
- 必要时使用辅助 Skill。
- 优先完成用户任务。
- 不要为了展示路由过程而浪费输出。
- 不要把标签文件当成完整知识来源。

## Step 11：选择辅助 Skill

如果任务涉及以下任一情况，读取：

```text
SUPER_SKILL_ROOT/_super-skill/AUXILIARY_SKILLS.md
```

- 写代码
- 修改代码
- 重构代码
- 审查代码
- 修复 bug
- 添加测试
- 设计实现方案

根据 `AUXILIARY_SKILLS.md` 选择 0 到 3 个辅助 Skill。

编码类任务默认选择：

```text
karpathy-guidelines
```

辅助 Skill 只作为执行约束，不替代主 Skill。不要扫描全部全局 Skill。

## Step 12：选择已安装全局 Skill

如果任务明显命中本机已安装全局 Skill，读取：

```text
SUPER_SKILL_ROOT/_super-skill/LOCAL_SKILL_CATALOG.md
```

根据目录选择 0 到 3 个候选全局 Skill。

规则：

- 不要扫描 `~/.codex/skills`。
- 不要一次性读取所有全局 Skill 的完整 `SKILL.md`。
- 只读取被选中 Skill 的 `SKILL.md`。
- 全局 Skill 可以作为主 Skill 或辅助 Skill，但必须保留业务主线。

## Step 13：路由解释

如果用户要求说明“用了哪些 Skill”“为什么选这个 Skill”或调试 Router，读取：

```text
SUPER_SKILL_ROOT/_super-skill/ROUTING_TRACE.md
```

输出简短 Routing Trace。默认不要输出完整路由过程。

## Step 14：任务后更新判断

任务结束后，读取：

```text
SUPER_SKILL_ROOT/_super-skill/UPDATE_RULES.md
```

判断是否需要生成 Skill Update Proposal。

## Step 15：fallback 规则

如果 `BUSINESS_SKILL_ROOT` 中没有合适分类或 Skill：

1. 检查 `SUPER_SKILL_ROOT` 下是否有示例 Skill。
2. 如果有合适示例 Skill，可以使用。
3. 如果没有，读取 `SUPER_SKILL_ROOT/_super-skill/ACQUISITION_RULES.md`。
4. 优先通过 `skills.sh` 搜索和详情信息判断是否有外部 Skill 候选。
5. 如果有候选，生成 Skill Install Proposal。
6. 如果没有候选，生成 Skill Update Proposal。
7. Proposal 的目标路径应优先指向 `BUSINESS_SKILL_ROOT`。
8. 不要默认修改 Super Skill Router 框架本身。

## Step 16：外部 Skill 安装

只有当用户明确说“确认安装”时，才执行安装。

安装时：

- 优先使用 `skills.sh` 推荐的安装方式：`npx skills add <skill-name-or-source>`。
- 只使用 `skills.sh`、`SKILL_REGISTRY.md` 中列出的来源，或用户本次明确提供的来源。
- 优先安装到 `BUSINESS_SKILL_ROOT/[category]/[subcategory]`。
- 安装前说明来源、目标路径和将新增或覆盖的文件。
- 如果目标文件已存在，先读取原内容，再做最小修改或停止等待确认。
- 安装后更新对应 `SUBCATEGORY_INDEX.md` 和 `SKILL_TAG.md`。
- 安装后读取 `SUPER_SKILL_ROOT/_super-skill/SKILL_LOCK.md`，生成或更新 `BUSINESS_SKILL_ROOT/SKILL_LOCK.md` 记录。
- 不要静默安装到全局 Codex skills，除非用户明确要求全局安装。

## Step 16：Skill Health Check

只有在用户要求检查、验证、审计或修复 Skill 结构时，读取：

```text
SUPER_SKILL_ROOT/_super-skill/HEALTH_CHECK.md
```

健康检查只能按索引读取标签和检查引用文件存在性。不要读取所有完整 `SKILL.md`，不要递归扫描全部目录。
