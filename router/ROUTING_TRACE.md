# Routing Trace Rules

## 定位

本文件定义如何记录和输出路由摘要。

默认不要向用户展示完整路由过程。只有用户要求解释“用了哪些 Skill”“为什么选这个 Skill”或调试 Router 时，才输出 Routing Trace。

## 内部记录

执行任务时可以维护一个简短内部摘要：

```text
Routing Trace
- project profile: [type / stack / confidence]
- candidate categories: [category...]
- selected main skill: [category/subcategory]
- auxiliary skills: [skill...]
- external skill: none / proposal / installed
- confidence: high / medium / low
- reason: one short sentence
```

## 输出格式

用户要求说明时，使用以下格式：

```text
Routing Trace
- 主 Skill: frontend/web-frontend
- 辅助 Skill: karpathy-guidelines
- 外部 Skill: none
- 置信度: high
- 原因: 任务涉及 React 表单 bug，前端 Skill 处理领域知识，karpathy-guidelines 约束实现方式。
```

## 置信度规则

### high

- 任务关键词明确命中分类。
- 子类标签明确命中。
- 项目信号与任务一致。

### medium

- 分类明确，但子类可能有多个。
- 项目信号有限，但不冲突。
- 需要辅助 Skill 但主 Skill 清晰。

### low

- 分类不清晰。
- 子类无法判断。
- 项目信号冲突。
- 本地缺少相关 Skill 且外部候选不明确。

## 低置信度处理

当置信度为 `low`：

1. 优先问一个最小澄清问题。
2. 如果用户要求继续，选择风险最低的主 Skill。
3. 不要通过读取大量 Skill 来提高置信度。
4. 任务结束后考虑生成 Skill Update Proposal。

## 隐私与输出约束

- 不输出绝对本机路径，除非用户要求。
- 不输出完整文件扫描结果。
- 不输出无关候选 Skill。
- 不把内部路由过程变成长篇解释。

