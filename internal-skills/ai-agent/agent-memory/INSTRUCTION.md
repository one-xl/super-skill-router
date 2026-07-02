---
name: agent-memory
description: Persistent Context and Session Memory Management. Use when the task involves analyzing history, compacting contexts, or using claude-mem to retain knowledge across terminal sessions.
---

# Agent Memory (claude-mem) Management Playbook

Use this skill to inspect, search, and manage persistent session memories when using `claude-mem`.

## Core CLI Actions

* **Search Memory**: Search history logs with natural language:
  ```bash
  npx claude-mem search "<query>"
  ```
* **View Memory Logs**: Launch the local web viewer interface to inspect chronological memory streams:
  * URL: [http://localhost:37777](http://localhost:37777)
* **Check Status**: Show memory compaction statistics and token costs:
  ```bash
  npx claude-mem status
  ```
* **Compaction and Pruning (Storage Cleanup)**:
  To prevent database bloat and memory explosion, run the custom pruning script (which vacuums the database to release filesystem blocks):
  * Prune database records older than N days (default: 30 days):
    ```bash
    node <SUPER_SKILL_ROOT>/../scripts/clean-mem.js --days 30
    ```
  * Remove memory records of a specific project:
    ```bash
    node <SUPER_SKILL_ROOT>/../scripts/clean-mem.js --project <project_name>
    ```
  * Completely reset/clear all stored session memories:
    ```bash
    node <SUPER_SKILL_ROOT>/../scripts/clean-mem.js --reset
    ```
* **Privacy Control**: To exclude sensitive data from being recorded in memory, use `<private>...</private>` tags around logs or code content.


## Memory Isolation Policy (防止上下文记忆混乱)

为确保不同项目之间的上下文和记忆互不干扰，禁止进行跨项目的全局记忆检索。必须严格遵守以下隔离规则：

1. **项目名称限定**：在进行任何 `claude-mem` 搜索或查询时，必须在查询词中显式附带当前项目文件夹名称作为过滤条件（例如：`npx claude-mem search "<query> project:<project_name>"`）。
2. **直接数据库查询隔离**：如果通过 `sqlite3` 直接读取 `~/.claude-mem/claude-mem.db`，必须在 SQL 语句中显式指定项目过滤条件：
   ```sql
   SELECT * FROM observations WHERE project = 'modest-salk' AND ...;
   ```
3. **隔离审计**：在回答用户关于历史进度的提问时，若检索出不属于当前项目目录的记忆记录，必须予以忽略，不得将其他项目的上下文混入当前对话中。

## Routing Policy

* When the user query relates to "what we did in the last session" or "check past changes", query the database using `npx claude-mem search` or direct SQL query, strictly limited to the current project's scope.

