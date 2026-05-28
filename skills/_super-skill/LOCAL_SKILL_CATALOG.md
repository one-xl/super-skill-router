# Local Skill Catalog

## 定位

本文件是本机已安装 Codex Skill 的精简目录，用于辅助 Router 选择可用 Skill。

它只记录触发信息和使用边界，不复制完整 Skill 内容。

## 使用规则

- 优先使用业务 Skill 和 Router 内置示例 Skill。
- 当任务明显命中本目录中的全局 Skill 时，可以读取对应全局 `SKILL.md`。
- 不要扫描全部 `~/.codex/skills`。
- 不要一次性读取本目录列出的所有完整 Skill。
- 每次任务最多选择 1 个主全局 Skill 和 3 个辅助 Skill。
- 如果用户显式点名某个 Skill，优先使用用户指定。

## 可用 Skill

### code-simplifier

路径：`~/.codex/skills/code-simplifier/SKILL.md`  
类别：coding / refactor  
默认角色：辅助 Skill  
触发：简化代码、清理代码、提升可读性、重构最近修改的代码、保持功能不变地优化实现。  
不要用于：需要新增复杂功能但没有重构需求的任务。

### frontend-design

路径：`~/.codex/skills/frontend-design/SKILL.md`  
类别：frontend / design  
默认角色：主 Skill 或辅助 Skill  
触发：构建网页、React 组件、HTML/CSS 布局、前端视觉优化、页面美化、Web UI 设计。  
不要用于：纯后端接口、纯部署或普通文档写作。

### ui-ux-pro-max

路径：`~/.codex/skills/ui-pro-max-skill/SKILL.md`  
类别：frontend / ui-ux  
默认角色：辅助 Skill  
触发：需要更系统的 UI/UX 方案、色彩、排版、动效、可访问性、设计系统、移动端界面或复杂 dashboard。  
不要用于：只需要小范围 CSS 修复的任务。

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
不要用于：Router 已能通过 `skills.sh` 直接生成 Skill Install Proposal 的普通缺失 Skill 场景。

### minimal-user-replies-zh

路径：`~/.codex/skills/simple-replie/SKILL.md`  
类别：communication  
默认角色：辅助 Skill  
触发：用户明确要求极简回复、不要过程汇报、只用中文短答。  
不要用于：需要详细解释、教程、报告或审查结论的任务。

### donet-handjob

路径：`~/.codex/skills/donet-handjob/SKILL.md`  
类别：dotnet / desktop-coursework  
默认角色：主 Skill  
触发：.NET Windows 桌面项目、WPF、WinForms、课程作业、需要看起来像 Visual Studio 拖拽式设计器生成的项目。  
不要用于：普通 .NET Web API、非课程项目或不需要视觉设计器风格的任务。

### super-skill-router

路径：`~/.codex/skills/super-skill-router/SKILL.md`  
类别：router  
默认角色：入口 Skill  
触发：需要选择、组合、获取或维护 Skill。  
不要用于：作为业务领域 Skill 替代其他专业 Skill。

### gsap-core

路径：`~/.codex/skills/gsap-core/SKILL.md`  
类别：frontend / animation-core  
默认角色：主 Skill 或辅助 Skill  
触发：动画库、JavaScript 动画、JS 动画、GSAP 补间动画、缓动、交错、基础动画、Webflow 交互、变换、透明度、响应式、无障碍、减少运动、matchMedia。  
不要用于：需要复杂的时间轴序列动画或特定框架逻辑的场合。

### gsap-timeline

路径：`~/.codex/skills/gsap-timeline/SKILL.md`  
类别：frontend / animation-timeline  
默认角色：主 Skill 或辅助 Skill  
触发：动画排序、时间轴、关键帧、多步骤动画、动画顺序、gsap.timeline()。  
不要用于：简单的单个 Tween 动画。

### gsap-scrolltrigger

路径：`~/.codex/skills/gsap-scrolltrigger/SKILL.md`  
类别：frontend / animation-scroll  
默认角色：主 Skill 或辅助 Skill  
触发：滚动动画、ScrollTrigger、元素固定、滚动擦除、视差滚动、滚动驱动、滚动关联。  
不要用于：与滚动无关的前端动画。

### gsap-plugins

路径：`~/.codex/skills/gsap-plugins/SKILL.md`  
类别：frontend / animation-plugins  
默认角色：辅助 Skill  
触发：GSAP 插件、SplitText、MorphSVG、DrawSVG、Flip、Draggable、Inertia、Observer、ScrollTo、ScrollSmoother、ScrambleText、自定义缓动、物理动画。  
不要用于：只使用核心 GSAP 动画，不需要高级插件的场景。

### gsap-utils

路径：`~/.codex/skills/gsap-utils/SKILL.md`  
类别：frontend / animation-utils  
默认角色：辅助 Skill  
触发：gsap.utils、clamp、mapRange、随机、捕捉、toArray、选择器、wrap、pipe。  
不要用于：与 GSAP 辅助计算无关的任务。

### gsap-react

路径：`~/.codex/skills/gsap-react/SKILL.md`  
类别：frontend / animation-react  
默认角色：主 Skill 或辅助 Skill  
触发：React、Next.js、useGSAP、GSAP React、useEffect 清理、上下文、SSR、动画还原、revert。  
不要用于：非 React 项目。

### gsap-performance

路径：`~/.codex/skills/gsap-performance/SKILL.md`  
类别：frontend / animation-perf  
默认角色：辅助 Skill  
触发：动画性能、卡顿、断续、缓慢、帧率、FPS、60fps、硬件加速变换、will-change。  
不要用于：与动画性能调优无关的任务。

### gsap-frameworks

路径：`~/.codex/skills/gsap-frameworks/SKILL.md`  
类别：frontend / animation-frameworks  
默认角色：主 Skill 或辅助 Skill  
触发：Vue、Nuxt、Svelte、SvelteKit、Astro、前端框架生命周期、组件卸载清理、onMounted、onDestroy。  
不要用于：React 项目或原生 JS 项目。

### codegraph

路径：`~/.codex/skills/codegraph/SKILL.md`  
类别：ai-agent / code-indexing  
默认角色：辅助 Skill 或主 Skill  
触发：代码分析、模块关系、探索陌生项目、查找 callers / callees、调用链路追踪、重构影响范围分析。  
不要用于：常规纯文本编辑、无代码的日常问答。

### tdd

路径：`~/.codex/skills/tdd/SKILL.md`  
类别：engineering / development  
默认角色：主 Skill 或辅助 Skill  
触发：测试驱动开发、TDD、Red-Green-Refactor 循环、编写单元测试或集成测试、垂直切片。  
不要用于：未安装测试框架或用户明确禁止写测试的项目。

### diagnose

路径：`~/.codex/skills/diagnose/SKILL.md`  
类别：engineering / development  
默认角色：主 Skill  
触发：Bug 调试诊断、程序崩溃、内存泄露、死锁、性能退化、构建可靠反馈回路（Feedback Loop）。  
不要用于：无明显 Bug 或性能问题的常规新需求开发。

### improve-codebase-architecture

路径：`~/.codex/skills/improve-codebase-architecture/SKILL.md`  
类别：engineering / development  
默认角色：主 Skill  
触发：分析代码架构、提取深层模块（Deep Modules）、消除冗余与坏味道、优化项目逻辑界限。  
不要用于：简单修复或微小代码修改。

### zoom-out

路径：`~/.codex/skills/zoom-out/SKILL.md`  
类别：engineering / development  
默认角色：辅助 Skill  
触发：从宏观高空审视庞大且完全陌生的模块、梳理全局依赖或业务全貌。  
不要用于：微观单函数修改或非常熟悉的代码。

### prototype

路径：`~/.codex/skills/prototype/SKILL.md`  
类别：engineering / prototyping  
默认角色：主 Skill  
触发：快速搭建 throwaway 验证原型、多套对比界面原型、极简 CLI 命令行原型。  
不要用于：生产环境的直接主干开发，除非明确要求验证可行性。

### grill-me

路径：`~/.codex/skills/grill-me/SKILL.md`  
类别：engineering / planning  
默认角色：辅助 Skill  
触发：在动手前通过交互式提问质疑（Grilling）挑战方案决策、消除隐藏歧义与漏洞。  
不要用于：极度简单、答案明确的无风险小更改。

### to-prd

路径：`~/.codex/skills/to-prd/SKILL.md`  
类别：engineering / planning  
默认角色：辅助 Skill  
触发：将当前零碎谈话与规划自动总结并编写成标准的 PRD（产品需求文档）格式。  
不要用于：非工程或已具备完整 PRD 的开发任务。

### to-issues

路径：`~/.codex/skills/to-issues/SKILL.md`  
类别：engineering / planning  
默认角色：辅助 Skill  
触发：将庞大或中型需求方案拆解为“垂直切片”（Vertical Slice）的 GitHub Issues 独立交付列表。  
不要用于：微小且不需要任务管理的小型修改。

### handoff

路径：`~/.codex/skills/handoff/SKILL.md`  
类别：engineering / collaboration  
默认角色：辅助 Skill  
触发：当前会话即将达到 token 上限或需将会话进度接力交接给下一个代理。  
不要用于：单次独立且能直接全部做完的小任务。

## 建议组合

- 前端编码：`frontend-design` + `karpathy-guidelines`。
- 前端精修：`frontend-design` + `ui-ux-pro-max` + `karpathy-guidelines`。
- 前端 GSAP 动画：`gsap-core` + `gsap-react`/`gsap-frameworks` + `gsap-performance` + `karpathy-guidelines`。
- 代码清理：`code-simplifier` + `karpathy-guidelines`。
- Office 文档：`document-skills`。
- Skill 查找：`super-skill-router` + `find-skills` 或 `skills.sh`。
- 极简回复：`minimal-user-replies-zh`。
- 工程化敏捷开发：`to-prd` + `grill-me` + `to-issues` + `tdd` + `karpathy-guidelines`。
- 复杂Bug攻坚：`diagnose` + `codegraph` + `karpathy-guidelines`。
- 陌生系统重构：`zoom-out` + `codegraph` + `improve-codebase-architecture` + `karpathy-guidelines`。
