# Router Rules

本文档定义了路由匹配的具体流程，供机器和智能体作为执行依据。

## 变量默认初始化

如果调用时未显式指定变量，默认设置为：

```text
SUPER_SKILL_ROOT = . (指代项目根目录)
BUSINESS_SKILL_ROOT = internal-skills
```

## Step 1：自动路由（可选执行轨）

若当前环境支持运行 Node.js 脚本，应优先运行以下命令进行快速匹配：

```bash
node <SUPER_SKILL_ROOT>/scripts/route.js --query "<任务描述>" --workspace "<工作区绝对路径>"
```

脚本将输出包含推荐主技能、辅助技能及置信度分数的结构化 JSON 结果作为关键决策线索。

## Step 2：按需决策树（手动解析轨）

无论脚本输出置信度如何，智能体均应执行以下步骤进行最终确认：

1. **读取索引**：读取 `router/CATEGORY_INDEX.md` 确定候选大类。
2. **查阅排行**：查阅 `router/SKILL_RANKINGS.md` 确定大类下各技能的选用优先级和分级。
3. **查阅大类标签**：读取 `BUSINESS_SKILL_ROOT/[category]/CATEGORY_TAG.md`（不存在时 fallback 读取 `SUPER_SKILL_ROOT` 下的同名文件）。
4. **定位子类**：读取该大类对应的 `SUBCATEGORY_INDEX.md`，进而读取具体子类的 `SKILL_TAG.md`。
5. **加载完整指令**：仅当 `SKILL_TAG.md` 中的“读取条件”被完全命中时，才允许读取该子类的 `INSTRUCTION.md` 完整文件。
6. **引入辅助 Skill**：如果任务涉及编码、重构、审查、调试或方案设计，读取 `router/AUXILIARY_SKILLS.md` 以加载对应的规范约束（如 `karpathy-guidelines`）。

## Step 3：同步与健康度维护

在对技能结构进行修改、验证或同步时，运行以下体检命令：

- **自检模式**：
  ```bash
  node <SUPER_SKILL_ROOT>/scripts/route.js --audit
  ```
- **同步部署模式**（将更新自动分发至全局环境）：
  ```bash
  node <SUPER_SKILL_ROOT>/scripts/route.js --audit --update
  ```
