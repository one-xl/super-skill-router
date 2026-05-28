# 本机 Skill 整理清单

本文整理当前 Codex 全局已安装 Skill，方便手动查看和 Router 自动选择。

> 说明：这里只记录用途和触发场景，不复制完整 Skill 内容。

## 编码与工程质量

| Skill | 角色 | 适用场景 |
| --- | --- | --- |
| `karpathy-guidelines` | 辅助 | 写代码、改代码、审查、重构、修 bug、加测试，约束实现方式。 |
| `code-simplifier` | 辅助 | 简化代码、清理代码、提升可读性、保持功能不变地重构。 |

## 前端与 UI

| Skill | 角色 | 适用场景 |
| --- | --- | --- |
| `frontend-design` | 主 / 辅助 | 页面、组件、React、HTML/CSS、Web UI、视觉优化。 |
| `ui-ux-pro-max` | 辅助 | 更系统的 UI/UX、设计系统、色彩、排版、动效、复杂 dashboard。 |

## 文档与文件

| Skill | 角色 | 适用场景 |
| --- | --- | --- |
| `document-skills` | 主 | Word、PDF、PPT、Excel 等 Office 文件创建、编辑和分析。 |

## Skill 发现与路由

| Skill | 角色 | 适用场景 |
| --- | --- | --- |
| `super-skill-router` | 入口 | 根据任务选择、组合、获取或维护 Skill。 |
| `find-skills` | 辅助 | 用户明确询问查找或安装某类 Skill。 |

## 沟通风格

| Skill | 角色 | 适用场景 |
| --- | --- | --- |
| `minimal-user-replies-zh` | 辅助 | 用户要求极简中文回复、不汇报过程。 |

## 特定技术场景

| Skill | 角色 | 适用场景 |
| --- | --- | --- |
| `donet-handjob` | 主 | .NET Windows 桌面项目、WPF、WinForms、课程作业、Visual Studio 设计器风格。 |

## Router 建议

- 编码任务默认组合：主业务 Skill + `karpathy-guidelines`。
- 前端视觉任务优先组合：`frontend-design` + `karpathy-guidelines`。
- 复杂 UI/UX 任务再加：`ui-ux-pro-max`。
- 代码清理任务组合：`code-simplifier` + `karpathy-guidelines`。
- Office 文件任务直接使用：`document-skills`。
- 缺少本地 Skill 时优先走：`skills.sh` 查询和 Skill Install Proposal。

