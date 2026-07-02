# Example Routing Trace

这是给维护者看的示例，不要求 Agent 默认向用户完整输出。

## 输入

```text
请帮我给一个 Web 应用新增登录表单，并说明后端需要提供哪些 API。
```

## 路由

1. 读取 `SUPER_SKILL_ROOT/router/CATEGORY_INDEX.md`。
2. 候选大类：`frontend`、`backend`。
3. 读取 `BUSINESS_SKILL_ROOT/frontend/CATEGORY_TAG.md`，如果不存在则 fallback 到 `SUPER_SKILL_ROOT/frontend/CATEGORY_TAG.md`。
4. 读取 `frontend/SUBCATEGORY_INDEX.md`。
5. 候选子类：`web-frontend`。
6. 读取 `frontend/web-frontend/SKILL_TAG.md`。
7. 命中读取完整 Skill 条件，读取 `frontend/web-frontend/INSTRUCTION.md`。
8. 对辅助后端需求重复候选读取，读取 `backend/api-backend/SKILL_TAG.md`；如需具体接口设计，再读取完整 `SKILL.md`。

## 输出策略

- 用户默认只看到任务结果。
- 如果用户询问路由过程，再说明主 Skill 和辅助 Skill。

