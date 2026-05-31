# Local Skill Catalog

## 定位

本文件是本机已安装 Codex Skill 的精简目录，用于辅助 Router 选择可用 Skill。它只记录触发信息和使用边界，不复制完整 Skill 内容。

## 使用规则

- 优先使用业务 Skill 和 Router 内置示例 Skill。
- 当任务明显命中本目录中的全局 Skill 时，可以读取对应全局 `SKILL.md`。
- 每次任务最多选择 1 个主全局 Skill 和 3 个辅助 Skill。

## 可用 Skill

### super-skill-router

路径：`~/.codex/skills/super-skill-router/SKILL.md`  
类别：router  
默认角色：入口 Skill  
触发：需要选择、组合、获取或维护 Skill。  
不要用于：作为业务领域 Skill 替代其他专业 Skill。

### web-frontend

路径：`~/.codex/skills/super-skill-router/skills/frontend/web-frontend/SKILL.md`  
类别：frontend  
默认角色：主 Skill 或辅助 Skill  
触发：构建网页、React 组件、HTML/CSS 布局、前端视觉优化、页面美化、Web UI 设计、GSAP 动画、样式/触控交互设计、去除 AI 味 (impeccable)、提高审美。  
不要用于：纯后端接口、纯部署或普通文档写作。

### api-backend

路径：`~/.codex/skills/super-skill-router/skills/backend/api-backend/SKILL.md`  
类别：backend  
默认角色：主 Skill  
触发：设计或修改 API、后端逻辑、接口契约、身份鉴权、数据库优化、防 SQL 注入与安全加固。  
不要用于：纯前端页面样式、浏览器交互。

### code-simplifier

路径：`~/.codex/skills/code-simplifier/SKILL.md`  
类别：coding / refactor  
默认角色：辅助 Skill  
触发：简化代码、清理代码、提升可读性、重构最近修改的代码、保持功能不变地优化实现。  
不要用于：需要新增复杂功能但没有重构需求的任务。

### karpathy-guidelines

路径：`~/.codex/skills/karpathy-guidelines/SKILL.md`  
类别：coding / quality  
默认角色：辅助 Skill  
触发：写代码、改代码、审查代码、重构、修 bug、加测试、设计实现方案。  
不要用于：纯文本写作或无需工程判断的简单问题。

### document-skills

路径：`~/.codex/skills/ducument-skill/SKILL.md`  
类别：document / office  
默认角色：主 Skill  
触发：处理 Word、PDF、PPT、Excel、专业文档创建、编辑、分析、格式保留。  
不要用于：普通 Markdown 文案，除非涉及 Office 文件。

### find-skills

路径：`~/.codex/skills/find-skill/SKILL.md`  
类别：skill-discovery  
默认角色：辅助 Skill  
触发：用户询问“有没有某种 Skill”“如何安装 Skill”“找一个能做 X 的 Skill”。

### minimal-user-replies-zh

路径：`~/.codex/skills/simple-replie/SKILL.md`  
类别：communication  
默认角色：辅助 Skill  
触发：用户明确要求极简回复、不要过程汇报、只用中文短答。

### donet-handjob

路径：`~/.codex/skills/donet-handjob/SKILL.md`  
类别：dotnet / desktop-coursework  
默认角色：主 Skill  
触发：.NET Windows 桌面项目、WPF、WinForms、课程作业、需要看起来像 Visual Studio 拖拽式设计器生成的项目。

### codegraph

路径：`~/.codex/skills/codegraph/SKILL.md`  
类别：ai-agent / code-indexing  
默认角色：辅助 Skill 或主 Skill  
触发：代码分析、模块关系、探索陌生项目、查找 callers / callees、调用链路追踪、重构影响范围分析。

### tdd

路径：`~/.codex/skills/tdd/SKILL.md`  
类别：engineering / development  
默认角色：主 Skill 或辅助 Skill  
触发：测试驱动开发、TDD、Red-Green-Refactor 循环、编写单元测试或集成测试、垂直切片。

### diagnose

路径：`~/.codex/skills/diagnose/SKILL.md`  
类别：engineering / development  
默认角色：主 Skill  
触发：Bug 调试诊断、程序崩溃、内存泄露、死锁、性能退化、构建可靠反馈回路（Feedback Loop）。

### improve-codebase-architecture

路径：`~/.codex/skills/improve-codebase-architecture/SKILL.md`  
类别：engineering / development  
默认角色：主 Skill  
触发：分析代码架构、提取深层模块（Deep Modules）、消除冗余与坏味道、优化项目逻辑界限。

### zoom-out

路径：`~/.codex/skills/zoom-out/SKILL.md`  
类别：engineering / development  
默认角色：辅助 Skill  
触发：从宏观高空审视庞大且完全陌生的模块、梳理全局依赖或业务全貌。

### prototype

路径：`~/.codex/skills/prototype/SKILL.md`  
类别：engineering / prototyping  
默认角色：主 Skill  
触发：快速搭建 throwaway 验证原型、多套对比界面原型、极简 CLI 命令行原型。

### grill-me

路径：`~/.codex/skills/grill-me/SKILL.md`  
类别：engineering / planning  
默认角色：辅助 Skill  
触发：在动手前通过交互式提问质疑（Grilling）挑战方案决策、消除隐藏歧义与漏洞。

### to-prd

路径：`~/.codex/skills/to-prd/SKILL.md`  
类别：engineering / planning  
默认角色：辅助 Skill  
触发：将当前零碎谈话与规划自动总结并编写成标准的 PRD（产品需求文档）格式。

### to-issues

路径：`~/.codex/skills/to-issues/SKILL.md`  
类别：engineering / planning  
默认角色：辅助 Skill  
触发：将庞大或中型需求方案拆解为“垂直切片”（Vertical Slice）的 GitHub Issues 独立交付列表。

### handoff

路径：`~/.codex/skills/handoff/SKILL.md`  
类别：engineering / collaboration  
默认角色：辅助 Skill  
触发：当前会话即将达到 token 上限或需将会话进度接力交接给下一个代理。

### impeccable

路径：`~/.codex/skills/impeccable/SKILL.md`（也可通过 `web-frontend` 的 `references/impeccable.md` 渐进式加载）  
类别：frontend / lint  
默认角色：辅助 Skill  
触发：去除网站 AI 味、样式审查、可访问性及 HTML/CSS 规范。

### taste-skill

路径：`~/.codex/skills/taste-skill/SKILL.md`（也可通过 `web-frontend` 的 `references/taste-skill.md` 渐进式加载）  
类别：frontend / aesthetic  
默认角色：辅助 Skill  
触发：提高 AI 编程 agent 的审美、UI 设计高标准和硬性规则排查。

### skill-design

路径：`~/.codex/skills/super-skill-router/skills/ai-agent/skill-design/SKILL.md`  
类别：ai-agent / skill-design  
默认角色：主 Skill  
触发：设计、编写、优化 Codex Skill 文件，自主 Skill 路由方案，Skill 架构设计。

### nginx

路径：`~/.codex/skills/super-skill-router/skills/deployment/nginx/SKILL.md`  
类别：deployment  
默认角色：主 Skill  
触发：Nginx 配置、反向代理、HTTPS/SSL 设置、域名绑定、静态文件服务、负载均衡。

### writing

路径：`~/.codex/skills/super-skill-router/skills/document/writing/SKILL.md`  
类别：document  
默认角色：主 Skill  
触发：文档写作、技术文章、规范说明、用户手册、产品文案。

## 建议组合

- 前端编码与精修：`web-frontend` + `karpathy-guidelines`（含 GSAP/Impeccable/Taste 渐进式子手册）。
- 后端开发：`api-backend` + `karpathy-guidelines`。
- 代码清理：`code-simplifier` + `karpathy-guidelines`。
- Office 文档：`document-skills`。
- Skill 查找：`super-skill-router` + `find-skills` 或 `skills.sh`。
- 极简回复：`minimal-user-replies-zh`。
- 工程化敏捷开发：`to-prd` + `grill-me` + `to-issues` + `tdd` + `karpathy-guidelines`。
- 复杂Bug攻坚：`diagnose` + `codegraph` + `karpathy-guidelines`。
- 陌生系统重构：`zoom-out` + `codegraph` + `improve-codebase-architecture` + `karpathy-guidelines`。
- 部署配置：`nginx` + `karpathy-guidelines`。
- Skill 设计与路由：`skill-design` + `super-skill-router`。
- 技术写作：`writing`。
