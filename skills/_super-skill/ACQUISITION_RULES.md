# Skill Acquisition Rules

## 定位

本文件定义缺少本地 Skill 时如何寻找和安装外部 Skill。

目标是支持按任务补齐 Skill，同时避免静默下载未知内容。

## 何时读取

只有在以下情况读取本文件：

- `BUSINESS_SKILL_ROOT` 没有合适分类或子类。
- `SUPER_SKILL_ROOT` 示例 Skill 也不足以完成任务。
- 用户明确要求查找、安装、下载或补齐 Skill。

## 允许的来源

优先级：

1. `SUPER_SKILL_ROOT/_super-skill/SKILL_REGISTRY.md` 中列出的可信来源。
2. 用户在当前对话中明确提供的 GitHub 仓库、URL 或本地路径。
3. 当前项目文档明确指定的 Skill 来源。

禁止：

- 从搜索结果中静默选择未知仓库并安装。
- 下载没有 `SKILL.md` 的目录作为 Skill。
- 覆盖已有 Skill 文件而不确认。
- 把外部 Skill 默认安装到 Super Skill Router 框架目录。

## 自动化边界

可以自动执行：

- 判断当前任务缺少哪类 Skill。
- 读取 `SKILL_REGISTRY.md`。
- 匹配候选 Skill。
- 生成 `Skill Install Proposal`。

必须等待用户确认：

- 下载远程仓库内容。
- 复制外部 Skill 到本地。
- 覆盖已有文件。
- 修改索引文件。
- 安装到 Codex 全局 skills 目录。

## 安装目标

默认安装到：

```text
BUSINESS_SKILL_ROOT/[category]/[subcategory]
```

只有用户明确要求全局安装时，才安装到：

```text
~/.codex/skills/[skill-name]
```

## Skill Install Proposal 格式

必须使用以下格式：

# Skill Install Proposal

## 缺失能力

说明当前任务缺少的 Skill 能力。

## 推荐来源

填写注册表来源、用户提供来源或当前项目指定来源。

## 安装目标

填写目标路径。

## 安装原因

说明为什么需要安装，而不是使用已有 Skill。

## 安装后索引更新

说明需要更新的 `CATEGORY_TAG.md`、`SUBCATEGORY_INDEX.md` 或 `SKILL_TAG.md`。

## 是否需要用户确认

是。默认不下载、不安装、不覆盖文件。

