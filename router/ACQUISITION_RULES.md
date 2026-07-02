# Skill Acquisition Rules

## 定位

本文件定义缺少本地 Skill 时如何通过 `skills.sh` 寻找、下载和安装外部 Skill。

目标是支持按任务补齐 Skill，同时避免静默下载未知内容。

## 何时读取

只有在以下情况读取本文件：

- `BUSINESS_SKILL_ROOT` 没有合适分类或子类。
- `SUPER_SKILL_ROOT` 示例 Skill 也不足以完成任务。
- 用户明确要求查找、安装、下载或补齐 Skill。

## 允许的来源

优先级：

1. `https://skills.sh/` 的搜索、详情和审计结果。
2. `router/SKILL_REGISTRY.md` 中缓存的可信来源。
3. 用户在当前对话中明确提供的 GitHub 仓库、URL 或本地路径。
4. 当前项目文档明确指定的 Skill 来源。

禁止：

- 从搜索结果中静默选择未知仓库并安装。
- 下载没有 `SKILL.md` 的目录作为 Skill。
- 覆盖已有 Skill 文件而不确认。
- 把外部 Skill 默认安装到 Super Skill Router 框架目录。

## skills.sh 查询流程

需要外部 Skill 时：

1. 从用户任务提取 2 到 5 个搜索关键词。
2. 查询 `skills.sh`，优先使用 API：

```text
GET https://skills.sh/api/v1/internal-skills/search?q=[query]&limit=5
```

3. 排除 `isDuplicate = true` 的候选，除非没有其他可用结果。
4. 对 1 到 3 个候选读取详情：

```text
GET https://skills.sh/api/v1/internal-skills/{id}
```

5. 如可用，读取审计信息：

```text
GET https://skills.sh/api/v1/internal-skills/audit/{id}
```

6. 优先选择审计通过、来源清晰、安装量较高、任务匹配度高的 Skill。
7. 不要读取或安装超过必要候选。

## skills.sh 安装流程

只有用户明确说“确认安装”后，才运行安装命令。

默认命令：

```text
npx skills add <skill-name-or-source>
```

如果 `skills.sh` 结果提供 `installUrl`，可使用：

```text
npx skills add <installUrl>
```

如果用户要求减少遥测，或没有明确允许遥测，优先关闭遥测。

Windows PowerShell：

```powershell
$env:DISABLE_TELEMETRY='1'; npx skills add <skill-name-or-source>
```

macOS / Linux：

```sh
DISABLE_TELEMETRY=1 npx skills add <skill-name-or-source>
```

安装后必须验证：

- 本地出现新的 Skill 目录或文件。
- 新 Skill 包含 `SKILL.md`。
- 需要时同步更新 `SUBCATEGORY_INDEX.md` 或 `SKILL_TAG.md`。

## 自动化边界

可以自动执行：

- 判断当前任务缺少哪类 Skill。
- 查询 `skills.sh` 搜索、详情和审计信息。
- 读取 `SKILL_REGISTRY.md`。
- 匹配候选 Skill。
- 生成 `Skill Install Proposal`。

必须等待用户确认：

- 下载远程仓库内容。
- 运行 `npx skills add`。
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
~/.codex/internal-skills/[skill-name]
```

## Skill Install Proposal 格式

必须使用以下格式：

# Skill Install Proposal

## 缺失能力

说明当前任务缺少的 Skill 能力。

## 推荐来源

填写 `skills.sh` 页面、API 返回的 `id`、`installUrl`、注册表来源、用户提供来源或当前项目指定来源。

## 安装命令

```text
npx skills add <skill-name-or-source>
```

## 安装目标

填写目标路径。

## 安装原因

说明为什么需要安装，而不是使用已有 Skill。

## 安装后索引更新

说明需要更新的 `CATEGORY_TAG.md`、`SUBCATEGORY_INDEX.md` 或 `SKILL_TAG.md`。

## 是否需要用户确认

是。默认不下载、不安装、不覆盖文件。

