# Super Skill Router 优化建议

## 背景

`super-skill-router` 的定位是一个全局 Skill 路由器：用户提出编程、开发、调试、重构、UI/UX、架构、文档、论文等复杂任务时，它负责判断应该加载哪个专业 Skill。

当前主要问题是：`super-skill-router` 的子目录里存在大量 `SKILL.md`，Codex 会把这些子 Skill 全部当成独立 Skill 展示，导致 UI 中出现海量 Skill，也会增加上下文污染和误触发风险。

优化目标是把它从“暴露大量子 Skill 的大合集”，改造成真正的“单入口智能路由器”。

## 总体目标

1. Codex UI 中只暴露一个入口：`super-skill-router`。
2. 子 Skill 作为内部路由资源存在，不被 Codex 直接扫描为独立 Skill。
3. 路由过程更轻量：先读机器可读索引，再按需读取具体说明。
4. 消除重复 Skill、旧路径链接和内部 Sub-skill 泄漏。
5. 让路由输出结构化、可测试、可维护。

## 1. 只暴露一个入口 Skill

只保留根目录：

```text
super-skill-router/INSTRUCTION.md
```

所有子 Skill 的入口文件统一改名：

```text
SKILL.md -> INSTRUCTION.md
```

或者根据用途拆成：

```text
INSTRUCTION.md
SKILL_TAG.md
README.md
```

这样 Codex UI 只显示 `super-skill-router`，具体子 Skill 选择交给 router 自己完成。

## 2. 区分公开入口和内部 Skill

建议目录结构：

```text
super-skill-router/
  SKILL.md
  router/
    CATEGORY_INDEX.md
    SKILL_RANKINGS.md
    ROUTER.md
    ROUTING_CONFIDENCE.md
    SKILL_POLICY.md
  internal-skills/
    frontend/
    backend/
    deployment/
    document/
    ai-agent/
    engineering/
    paper/
    content/
    specialized/
  scripts/
    route.js
    doctor.js
  skills-manifest.json
```

核心原则：

- `SKILL.md` 只存在于根目录。
- `internal-skills/` 下不再出现 `SKILL.md`。
- 内部 Skill 使用 `INSTRUCTION.md` 或 `SKILL_TAG.md`。
- `router/` 存放路由策略文档。

## 3. 增加机器可读 Manifest

新增：

```text
skills-manifest.json
```

示例：

```json
{
  "version": 1,
  "skills": [
    {
      "id": "api-backend",
      "name": "API Backend",
      "category": "backend",
      "visibility": "internal",
      "role": "primary",
      "canonical": true,
      "aliases": ["backend-api", "server-api"],
      "triggers": ["api", "接口", "后端", "鉴权", "token", "session", "crud"],
      "priority": 1,
      "instructionPath": "internal-skills/backend/api-backend/INSTRUCTION.md"
    }
  ]
}
```

推荐路由流程：

1. 先读 `skills-manifest.json`。
2. 根据 query 匹配类别和候选 Skill。
3. 输出候选及置信度。
4. 只读取最终选中的 `INSTRUCTION.md`。

这样可以显著减少上下文占用。

## 4. 清理重复 Skill

当前可能存在这些重复或多路径 Skill：

- `api-and-interface-design` 同时存在于 backend 和 engineering agent-skills。
- `cheat-*` 存在多层重复目录。
- `hyperframes-*` 同时存在顶层和嵌套路径。
- `browser-testing-with-devtools` 在 frontend 与 engineering 中重复。

建议规则：

1. 每个 Skill 只有一个 canonical path。
2. 其它位置不复制完整文件，只放 alias 或 manifest 映射。
3. 子系统内部 Skill 标记为 `internal` 或 `subagent`。
4. 用户不应直接触发的 Skill 不写入公开入口。

建议字段：

```yaml
visibility: public | internal
role: primary | auxiliary | subagent
canonical: true | false
aliases:
  - old-name
  - alternate-name
```

例如：

```yaml
id: cheat-score-blind
visibility: internal
role: subagent
canonical: true
```

## 5. 结构化 route.js 输出

建议 `scripts/route.js` 输出稳定 JSON：

```json
{
  "primary": "diagnose",
  "auxiliary": ["codegraph", "karpathy-guidelines"],
  "confidence": 0.87,
  "category": "engineering",
  "reason": "用户请求修复 bug，需要诊断流程和代码索引。",
  "filesToRead": [
    "internal-skills/engineering/diagnose/INSTRUCTION.md",
    "internal-skills/ai-agent/codegraph/INSTRUCTION.md"
  ],
  "warnings": []
}
```

这样 Agent 可以按 `filesToRead` 精确读取，避免误读整套文档。

## 6. 增加冲突规则

很多 Skill 会争夺同一个任务，需要明确优先级。

建议规则：

```text
修 bug：
  primary = diagnose
  auxiliary = codegraph, karpathy-guidelines

新功能开发：
  primary = incremental-implementation 或 tdd
  auxiliary = codegraph, karpathy-guidelines

代码审查：
  primary = code-review-and-quality
  auxiliary = security-and-hardening 或 performance-optimization

架构重构：
  primary = improve-codebase-architecture
  auxiliary = codegraph, code-simplifier

前端 UI：
  primary = frontend-ui-engineering 或 web-frontend
  auxiliary = taste-skill, browser-testing-with-devtools

后端 API：
  primary = api-backend
  auxiliary = api-and-interface-design, security-and-hardening

部署：
  primary = nginx 或 ci-cd-and-automation
  auxiliary = observability-and-instrumentation

论文：
  primary = scientific-research-skill 或 ai-paper-pipeline
```

后处理 Skill：

```text
开发完成后：
  optional = code-simplifier

长日志/大输出：
  optional = headroom

交接：
  optional = handoff
```

## 7. 低置信度降级策略

建议引入置信度阈值：

```text
confidence >= 0.80:
  直接选择 primary + 必要 auxiliary。

0.50 <= confidence < 0.80:
  选择一个 primary + 一个最相关 auxiliary，并在结果中说明不确定点。

confidence < 0.50:
  不加载大 Skill，只读 CATEGORY_INDEX，并向用户问一个澄清问题。
```

目的：避免不确定时一次性加载大量 Skill，造成上下文污染。

## 8. 修复旧路径和无效链接

当前部分文档中可能存在旧路径，例如：

```text
<absolute-path>
<absolute-path>
```

这些链接会误导 Agent 和维护者。建议全部改成相对路径：

```md
[api-backend](internal-skills/backend/api-backend/INSTRUCTION.md)
```

或由 manifest 统一管理：

```json
"instructionPath": "internal-skills/backend/api-backend/INSTRUCTION.md"
```

## 9. 增加 doctor 健康检查

建议新增：

```text
scripts/doctor.js
```

检查项：

1. 是否只有根目录存在 `SKILL.md`。
2. 是否存在重复 Skill id。
3. 是否存在多个 canonical Skill。
4. 是否存在无效 `instructionPath`。
5. 是否存在旧绝对路径链接。
6. 是否有 internal/subagent Skill 暴露为 public。
7. 是否有 orphan Skill 不在 manifest 中。
8. 是否有 manifest 中声明但文件不存在的 Skill。
9. 是否有重复 description 或高度相似触发词。

示例输出：

```json
{
  "ok": false,
  "errors": [
    {
      "type": "LEAKED_SKILL_MD",
      "path": "internal-skills/frontend/anime/INSTRUCTION.md",
      "fix": "Rename to INSTRUCTION.md"
    }
  ],
  "warnings": [
    {
      "type": "DUPLICATE_ALIAS",
      "id": "api-and-interface-design"
    }
  ]
}
```

## 10. 建议实施顺序

### Phase 1：UI 降噪

目标：Codex UI 只显示 `super-skill-router`。

动作：

1. 只保留根目录 `SKILL.md`。
2. 批量将子 Skill 的 `SKILL.md` 改为 `INSTRUCTION.md`。
3. 更新 router 文档中的路径引用。
4. 验证全仓库只有一个 `SKILL.md`。

验证命令：

```powershell
Get-ChildItem -Recurse -Force "<absolute-path>" -Filter SKILL.md |
  Select-Object FullName
```

期望只输出：

```text
...\super-skill-router/INSTRUCTION.md
```

### Phase 2：Manifest 化

目标：路由先读 JSON，少读 Markdown。

动作：

1. 生成 `skills-manifest.json`。
2. 为每个 Skill 标注 `category`、`visibility`、`role`、`aliases`、`triggers`、`priority`、`instructionPath`。
3. 修改 `route.js`，优先读取 manifest。
4. 输出结构化 JSON。

### Phase 3：去重与规范化

目标：消除重复 Skill 和路径混乱。

动作：

1. 选定 canonical path。
2. 删除重复文件或改成 alias。
3. 标记 internal/subagent。
4. 修复旧绝对路径。

### Phase 4：健康检查与 CI

目标：以后不再回退成海量暴露。

动作：

1. 新增 `scripts/doctor.js`。
2. 在 README 中加入检查命令。
3. 可选：在 CI 或 pre-commit 中运行 doctor。

## 推荐最终形态

```text
super-skill-router/
  SKILL.md
  skills-manifest.json
  router/
    CATEGORY_INDEX.md
    SKILL_RANKINGS.md
    ROUTER.md
    SKILL_POLICY.md
    ROUTING_CONFIDENCE.md
  internal-skills/
    frontend/
      web-frontend/
        INSTRUCTION.md
    backend/
      api-backend/
        INSTRUCTION.md
    engineering/
      diagnose/
        INSTRUCTION.md
  scripts/
    route.js
    doctor.js
```

## 一句话总结

`super-skill-router` 应该是唯一公开入口；所有子 Skill 都应成为内部路由资源，由 manifest 和 `route.js` 精确选择，而不是被 Codex UI 直接展开。
