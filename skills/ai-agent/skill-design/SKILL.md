---
name: skill-design
description: Minimal example Skill for AI Agent Skill design tasks. Use after routing when a task requires creating, reviewing, or maintaining Skills, prompts, routing rules, or reusable agent workflows.
---

# Skill Design

## 执行流程

1. 明确 Skill 的触发场景、边界和成功标准。
2. 保持入口文件简洁，把细节拆到按需读取的文件。
3. 使用标签文件做选择判断，不承载完整流程。
4. 避免把临时项目知识写成通用 Skill。
5. 任务结束后评估是否需要 Skill Update Proposal。

## 输出要求

- 给出可直接落地的 Skill 文档或修改建议。
- 明确哪些内容属于路由、标签或完整 Skill。
- 默认只建议更新，不直接覆盖已有 Skill。

