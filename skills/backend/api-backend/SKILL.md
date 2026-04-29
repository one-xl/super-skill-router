---
name: api-backend
description: Minimal example Skill for backend API tasks. Use after routing when a task requires implementing or reviewing service-side APIs, auth, validation, business logic, or error handling.
---

# API Backend

## 执行流程

1. 先确认现有路由、控制器、服务层和错误处理约定。
2. 保持接口输入、输出和错误格式一致。
3. 在靠近边界的位置做请求校验和权限检查。
4. 避免把业务逻辑散落到无关层级。
5. 完成后运行项目已有的后端测试或检查命令。

## 输出要求

- 说明接口行为变化。
- 说明兼容性影响和验证结果。
- 如果发现可复用后端模式，生成 Skill Update Proposal。

