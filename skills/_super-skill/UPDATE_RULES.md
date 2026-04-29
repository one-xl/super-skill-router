# Skill Update Rules

## 何时生成更新建议

出现以下情况时，生成 Skill Update Proposal：

- 用户提供了新的固定流程。
- 用户纠正了已有 Skill 的做法。
- 任务中出现新技术栈。
- 当前 Skill 缺少对应处理流程。
- 现有分类无法覆盖任务。
- 某个大类标签不够准确。
- 某个子类标签不够准确。
- 多个 Skill 内容重复。
- 某个 Skill 已经过时。
- 任务过程产生了可复用经验。

## 更新目标判断

- 分类判断规则问题：更新 `CATEGORY_INDEX.md` 或 `CATEGORY_TAG.md`。
- 子类选择问题：更新 `SUBCATEGORY_INDEX.md` 或 `SKILL_TAG.md`。
- 具体执行流程问题：更新具体 `SKILL.md`。
- 新领域：新增大类。
- 已有大类下的新方向：新增子类。
- 重复内容：建议合并。
- 过时内容：建议标记 deprecated。

## 默认更新策略

1. 默认只生成建议，不直接修改文件。
2. 只有用户明确说“确认更新”时，才修改文件。
3. 修改具体 Skill 时，也要同步检查对应 `SKILL_TAG.md` 是否需要更新。
4. 新增子类时，也要同步更新 `SUBCATEGORY_INDEX.md`。
5. 新增大类时，也要同步更新 `CATEGORY_INDEX.md`。
6. 外部依赖模式下，默认建议更新 `BUSINESS_SKILL_ROOT`，而不是 `SUPER_SKILL_ROOT`。

## Skill Update Proposal 格式

必须使用以下格式：

# Skill Update Proposal

## 更新类型

新增 / 修改 / 删除 / 合并 / 标记废弃

## 目标文件

填写相对路径。

## 更新原因

说明为什么需要更新。

## 建议内容

```md
这里写建议新增或修改的 Markdown 内容
```

## 是否需要用户确认

是。默认不自动修改文件。

