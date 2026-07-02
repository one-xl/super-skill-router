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

路径：`~/.codex/internal-skills/code-simplifier/INSTRUCTION.md`  
类别：coding / refactor  
默认角色：辅助 Skill  
触发：简化代码、清理代码、提升可读性、重构最近修改的代码、保持功能不变地优化实现。  
不要用于：需要新增复杂功能但没有重构需求的任务。

### frontend-design

路径：`~/.codex/internal-skills/frontend-design/INSTRUCTION.md`  
类别：frontend / design  
默认角色：主 Skill 或辅助 Skill  
触发：构建网页、React 组件、HTML/CSS 布局、前端视觉优化、页面美化、Web UI 设计。  
不要用于：纯后端接口、纯部署或普通文档写作。

### ui-ux-pro-max

路径：`~/.codex/internal-skills/ui-pro-max-skill/INSTRUCTION.md`  
类别：frontend / ui-ux  
默认角色：辅助 Skill  
触发：需要更系统的 UI/UX 方案、色彩、排版、动效、可访问性、设计系统、移动端界面或复杂 dashboard。  
不要用于：只需要小范围 CSS 修复的任务。

### karpathy-guidelines

路径：`~/.codex/internal-skills/karpathy-guidelines/INSTRUCTION.md`  
类别：coding / quality  
默认角色：辅助 Skill  
触发：写代码、改代码、审查代码、重构、修 bug、加测试、设计实现方案。  
不要用于：纯文本写作或无需工程判断的简单问题。

### document-skills

路径：`~/.codex/internal-skills/ducument-skill/INSTRUCTION.md`  
类别：document / office  
默认角色：主 Skill  
触发：处理 Word、PDF、PPT、Excel、专业文档创建、编辑、分析、格式保留。  
不要用于：普通 Markdown 文案，除非涉及 Office 文件。

### find-skills

路径：`~/.codex/internal-skills/find-skill/INSTRUCTION.md`  
类别：skill-discovery  
默认角色：辅助 Skill  
触发：用户询问“有没有某种 Skill”“如何安装 Skill”“找一个能做 X 的 Skill”。  
不要用于：Router 已能通过 `skills.sh` 直接生成 Skill Install Proposal 的普通缺失 Skill 场景。

### minimal-user-replies-zh

路径：`~/.codex/internal-skills/simple-replie/INSTRUCTION.md`  
类别：communication  
默认角色：辅助 Skill  
触发：用户明确要求极简回复、不要过程汇报、只用中文短答。  
不要用于：需要详细解释、教程、报告或审查结论的任务。

### donet-handjob

路径：`~/.codex/internal-skills/donet-handjob/INSTRUCTION.md`  
类别：dotnet / desktop-coursework  
默认角色：主 Skill  
触发：.NET Windows 桌面项目、WPF、WinForms、课程作业、需要看起来像 Visual Studio 拖拽式设计器生成的项目。  
不要用于：普通 .NET Web API、非课程项目或不需要视觉设计器风格的任务。

### super-skill-router

路径：`~/.codex/internal-skills/super-skill-router/INSTRUCTION.md`  
类别：router  
默认角色：入口 Skill  
触发：需要选择、组合、获取或维护 Skill。  
不要用于：作为业务领域 Skill 替代其他专业 Skill。

### gsap-core

路径：`~/.codex/internal-skills/gsap-core/INSTRUCTION.md`  
类别：frontend / animation-core  
默认角色：主 Skill 或辅助 Skill  
触发：动画库、JavaScript 动画、JS 动画、GSAP 补间动画、缓动、交错、基础动画、Webflow 交互、变换、透明度、响应式、无障碍、减少运动、matchMedia。  
不要用于：需要复杂的时间轴序列动画或特定框架逻辑的场合。

### gsap-timeline

路径：`~/.codex/internal-skills/gsap-timeline/INSTRUCTION.md`  
类别：frontend / animation-timeline  
默认角色：主 Skill 或辅助 Skill  
触发：动画排序、时间轴、关键帧、多步骤动画、动画顺序、gsap.timeline()。  
不要用于：简单的单个 Tween 动画。

### gsap-scrolltrigger

路径：`~/.codex/internal-skills/gsap-scrolltrigger/INSTRUCTION.md`  
类别：frontend / animation-scroll  
默认角色：主 Skill 或辅助 Skill  
触发：滚动动画、ScrollTrigger、元素固定、滚动擦除、视差滚动、滚动驱动、滚动关联。  
不要用于：与滚动无关的前端动画。

### gsap-plugins

路径：`~/.codex/internal-skills/gsap-plugins/INSTRUCTION.md`  
类别：frontend / animation-plugins  
默认角色：辅助 Skill  
触发：GSAP 插件、SplitText、MorphSVG、DrawSVG、Flip、Draggable、Inertia、Observer、ScrollTo、ScrollSmoother、ScrambleText、自定义缓动、物理动画。  
不要用于：只使用核心 GSAP 动画，不需要高级插件的场景。

### gsap-utils

路径：`~/.codex/internal-skills/gsap-utils/INSTRUCTION.md`  
类别：frontend / animation-utils  
默认角色：辅助 Skill  
触发：gsap.utils、clamp、mapRange、随机、捕捉、toArray、选择器、wrap、pipe。  
不要用于：与 GSAP 辅助计算无关的任务。

### gsap-react

路径：`~/.codex/internal-skills/gsap-react/INSTRUCTION.md`  
类别：frontend / animation-react  
默认角色：主 Skill 或辅助 Skill  
触发：React、Next.js、useGSAP、GSAP React、useEffect 清理、上下文、SSR、动画还原、revert。  
不要用于：非 React 项目。

### gsap-performance

路径：`~/.codex/internal-skills/gsap-performance/INSTRUCTION.md`  
类别：frontend / animation-perf  
默认角色：辅助 Skill  
触发：动画性能、卡顿、断续、缓慢、帧率、FPS、60fps、硬件加速变换、will-change。  
不要用于：与动画性能调优无关的任务。

### gsap-frameworks

路径：`~/.codex/internal-skills/gsap-frameworks/INSTRUCTION.md`  
类别：frontend / animation-frameworks  
默认角色：主 Skill 或辅助 Skill  
触发：Vue、Nuxt、Svelte、SvelteKit、Astro、前端框架生命周期、组件卸载清理、onMounted、onDestroy。  
不要用于：React 项目或原生 JS 项目。

### codegraph

路径：`~/.codex/internal-skills/codegraph/INSTRUCTION.md`  
类别：ai-agent / code-indexing  
默认角色：辅助 Skill 或主 Skill  
触发：代码分析、模块关系、探索陌生项目、查找 callers / callees、调用链路追踪、重构影响范围分析。  
不要用于：常规纯文本编辑、无代码的日常问答。

### tdd

路径：`~/.codex/internal-skills/tdd/INSTRUCTION.md`  
类别：engineering / development  
默认角色：主 Skill 或辅助 Skill  
触发：测试驱动开发、TDD、Red-Green-Refactor 循环、编写单元测试或集成测试、垂直切片。  
不要用于：未安装测试框架或用户明确禁止写测试的项目。

### diagnose

路径：`~/.codex/internal-skills/diagnose/INSTRUCTION.md`  
类别：engineering / development  
默认角色：主 Skill  
触发：Bug 调试诊断、程序崩溃、内存泄露、死锁、性能退化、构建可靠反馈回路（Feedback Loop）。  
不要用于：无明显 Bug 或性能问题的常规新需求开发。

### improve-codebase-architecture

路径：`~/.codex/internal-skills/improve-codebase-architecture/INSTRUCTION.md`  
类别：engineering / development  
默认角色：主 Skill  
触发：分析代码架构、提取深层模块（Deep Modules）、消除冗余与坏味道、优化项目逻辑界限。  
不要用于：简单修复或微小代码修改。

### zoom-out

路径：`~/.codex/internal-skills/zoom-out/INSTRUCTION.md`  
类别：engineering / development  
默认角色：辅助 Skill  
触发：从宏观高空审视庞大且完全陌生的模块、梳理全局依赖或业务全貌。  
不要用于：微观单函数修改或非常熟悉的代码。

### prototype

路径：`~/.codex/internal-skills/prototype/INSTRUCTION.md`  
类别：engineering / prototyping  
默认角色：主 Skill  
触发：快速搭建 throwaway 验证原型、多套对比界面原型、极简 CLI 命令行原型。  
不要用于：生产环境的直接主干开发，除非明确要求验证可行性。

### grill-me

路径：`~/.codex/internal-skills/grill-me/INSTRUCTION.md`  
类别：engineering / planning  
默认角色：辅助 Skill  
触发：在动手前通过交互式提问质疑（Grilling）挑战方案决策、消除隐藏歧义与漏洞。  
不要用于：极度简单、答案明确的无风险小更改。

### to-prd

路径：`~/.codex/internal-skills/to-prd/INSTRUCTION.md`  
类别：engineering / planning  
默认角色：辅助 Skill  
触发：将当前零碎谈话与规划自动总结并编写成标准的 PRD（产品需求文档）格式。  
不要用于：非工程或已具备完整 PRD 的开发任务。

### to-issues

路径：`~/.codex/internal-skills/to-issues/INSTRUCTION.md`  
类别：engineering / planning  
默认角色：辅助 Skill  
触发：将庞大或中型需求方案拆解为“垂直切片”（Vertical Slice）的 GitHub Issues 独立交付列表。  
不要用于：微小且不需要任务管理的小型修改。

### handoff

路径：`~/.codex/internal-skills/handoff/INSTRUCTION.md`  
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

### agent-memory

路径：`~/.codex/internal-skills/super-skill-router/internal-skills/ai-agent/agent-memory/INSTRUCTION.md`  
类别：ai-agent  
默认角色：主 Skill  
触发：Persistent Context and Session Memory Management. Use when the task involves analyzing history, compacting contexts, or using claude-mem to retain knowledge across terminal sessions.

### headroom

路径：`~/.codex/internal-skills/super-skill-router/internal-skills/ai-agent/headroom/INSTRUCTION.md`  
类别：ai-agent  
默认角色：主 Skill  
触发："Context compression layer for AI agents. Compresses logs, outputs, and histories to save 60-95% tokens. Use when encountering massive terminal output, very long stack traces, or large log files."

### skill-design

路径：`~/.codex/internal-skills/super-skill-router/internal-skills/ai-agent/skill-design/INSTRUCTION.md`  
类别：ai-agent  
默认角色：主 Skill  
触发：Minimal example Skill for AI Agent Skill design tasks. Use after routing when a task requires creating, reviewing, or maintaining Skills, prompts, routing rules, or reusable agent workflows.

### api-backend

路径：`~/.codex/internal-skills/super-skill-router/internal-skills/backend/api-backend/INSTRUCTION.md`  
类别：backend  
默认角色：主 Skill  
触发：Comprehensive Backend API Skill. Provides guidelines and best practices for RESTful API design, schema validation, token/session authentication, database query optimization, security hardening, and error handling.

### cheat-bump

路径：`~/.codex/internal-skills/super-skill-router/internal-skills/cheat-bump/INSTRUCTION.md`  
类别：cheat-bump  
默认角色：主 Skill  
触发：提议并执行 rubric 或 bucket 升级。两种模式：**完整 rubric bump**（最高风险动作，5 步强制 + 跨模型审核）和 **--bucket-only 轻量重校**（只换 bucket 边界，不动 rubric 公式）。**Phase 2 强制走 cheat-score-blind sub-agent 给校准池重打分**——不接受 self-scored fallback。触发词："升级 rubric"/"bump rubric"/"更新公式"/"我想加一个维度"/"调整权重"/"重校桶"/"recalibrate bucket"。

### cheat-init

路径：`~/.codex/internal-skills/super-skill-router/internal-skills/cheat-init/INSTRUCTION.md`  
类别：cheat-init  
默认角色：主 Skill  
触发：cheat-on-content 的首次 onboarding 与脚手架创建器。统一流程——所有用户都走相同 5 阶段闭环，唯一区别是"发过视频的人"会在 init 时多一步：抓取已有视频建立历史 context（用于后续 cheat-seed 给更贴合的选题、更准的 baseline）。触发词："初始化"/"init"/"首次使用"/"我是新用户"/"setup cheat-on-content"。**必须在用户第一次会话执行；其他子 skill 在 .cheat-state.json 不存在时自动路由到此。**

### cheat-learn-from

路径：`~/.codex/internal-skills/super-skill-router/internal-skills/cheat-learn-from/INSTRUCTION.md`  
类别：cheat-learn-from  
默认角色：主 Skill  
触发：从对标账号导入 script + 数据 → 拆 pattern + 派生 base rubric 信号 → 写到 benchmark.md / script_patterns.md / rubric_notes.md。**这是工具最早期信号的来源**——cold-start 用户没自己历史时全靠对标，发过历史的用户也建议至少 1 个对标做 sanity check。触发词："学这个账号"/"拆这几个对标视频"/"learn from"/"导入对标账号"/"找对标"。

### cheat-migrate

路径：`~/.codex/internal-skills/super-skill-router/internal-skills/cheat-migrate/INSTRUCTION.md`  
类别：cheat-migrate  
默认角色：主 Skill  
触发：把老用户的 .cheat-state.json 升级到当前 schema_version。读 migrations/registry.md 算迁移链，按顺序应用每一步迁移文件。幂等：跑两次结果一样。失败停在中间版本不前进。触发词："迁移"/"升级 state"/"migrate"/"我的 state 是老版本"/"schema 版本不对"。

### cheat-on-content

路径：`~/.codex/internal-skills/super-skill-router/internal-skills/cheat-on-content/cheat-on-content/INSTRUCTION.md`  
类别：cheat-on-content  
默认角色：主 Skill  
触发：给所有想把"感觉"变成可校准预测的内容创作者。**方法论通用**——打分 → 盲预测 → T+3d 复盘 → 进化 rubric 的循环适用任何能被量化（播放 / 阅读 / 收听 / 点击）的内容。**rubric 是循环的内容，不是循环本身**——当前内置一份观点视频 rubric（参考博主 25+ 视频拟合），其他形态可借这套起步并 bump 调权重。**强烈建议导入对标账号**作为初始信号源（/cheat-learn-from）。触发词："初始化"/"打分这篇"/"启动预测"/"已发布"/"复盘"/"升级 rubric"/"推荐选题"/"抓热点"/"状态"/"找对标"/"learn from"。**首次使用必须先跑 /cheat-init。**

### cheat-on-content

路径：`~/.codex/internal-skills/super-skill-router/internal-skills/cheat-on-content/INSTRUCTION.md`  
类别：cheat-on-content  
默认角色：主 Skill  
触发：给所有想把"感觉"变成可校准预测的内容创作者。**方法论通用**——打分 → 盲预测 → T+3d 复盘 → 进化 rubric 的循环适用任何能被量化（播放 / 阅读 / 收听 / 点击）的内容。**rubric 是循环的内容，不是循环本身**——当前内置一份观点视频 rubric（参考博主 25+ 视频拟合），其他形态可借这套起步并 bump 调权重。**强烈建议导入对标账号**作为初始信号源（/cheat-learn-from）。触发词："初始化"/"打分这篇"/"启动预测"/"已发布"/"复盘"/"升级 rubric"/"推荐选题"/"抓热点"/"状态"/"找对标"/"learn from"。**首次使用必须先跑 /cheat-init。**

### cheat-bump

路径：`~/.codex/internal-skills/super-skill-router/internal-skills/cheat-on-content/internal-skills/cheat-bump/INSTRUCTION.md`  
类别：cheat-on-content  
默认角色：主 Skill  
触发：提议并执行 rubric 或 bucket 升级。两种模式：**完整 rubric bump**（最高风险动作，5 步强制 + 跨模型审核）和 **--bucket-only 轻量重校**（只换 bucket 边界，不动 rubric 公式）。**Phase 2 强制走 cheat-score-blind sub-agent 给校准池重打分**——不接受 self-scored fallback。触发词："升级 rubric"/"bump rubric"/"更新公式"/"我想加一个维度"/"调整权重"/"重校桶"/"recalibrate bucket"。

### cheat-init

路径：`~/.codex/internal-skills/super-skill-router/internal-skills/cheat-on-content/internal-skills/cheat-init/INSTRUCTION.md`  
类别：cheat-on-content  
默认角色：主 Skill  
触发：cheat-on-content 的首次 onboarding 与脚手架创建器。统一流程——所有用户都走相同 5 阶段闭环，唯一区别是"发过视频的人"会在 init 时多一步：抓取已有视频建立历史 context（用于后续 cheat-seed 给更贴合的选题、更准的 baseline）。触发词："初始化"/"init"/"首次使用"/"我是新用户"/"setup cheat-on-content"。**必须在用户第一次会话执行；其他子 skill 在 .cheat-state.json 不存在时自动路由到此。**

### cheat-learn-from

路径：`~/.codex/internal-skills/super-skill-router/internal-skills/cheat-on-content/internal-skills/cheat-learn-from/INSTRUCTION.md`  
类别：cheat-on-content  
默认角色：主 Skill  
触发：从对标账号导入 script + 数据 → 拆 pattern + 派生 base rubric 信号 → 写到 benchmark.md / script_patterns.md / rubric_notes.md。**这是工具最早期信号的来源**——cold-start 用户没自己历史时全靠对标，发过历史的用户也建议至少 1 个对标做 sanity check。触发词："学这个账号"/"拆这几个对标视频"/"learn from"/"导入对标账号"/"找对标"。

### cheat-migrate

路径：`~/.codex/internal-skills/super-skill-router/internal-skills/cheat-on-content/internal-skills/cheat-migrate/INSTRUCTION.md`  
类别：cheat-on-content  
默认角色：主 Skill  
触发：把老用户的 .cheat-state.json 升级到当前 schema_version。读 migrations/registry.md 算迁移链，按顺序应用每一步迁移文件。幂等：跑两次结果一样。失败停在中间版本不前进。触发词："迁移"/"升级 state"/"migrate"/"我的 state 是老版本"/"schema 版本不对"。

### cheat-persona

路径：`~/.codex/internal-skills/super-skill-router/internal-skills/cheat-on-content/internal-skills/cheat-persona/INSTRUCTION.md`  
类别：cheat-on-content  
默认角色：主 Skill  
触发：从复盘评论数据派生 / 刷新账号的受众画像，写入 audience.md。这是和 rubric 平行的第二个派生物——rubric 答"怎么打分"，persona 答"谁在看"。cheat-seed 选题 / 写稿时读它。**audience.md 含实绩信号，cheat-score-blind 硬禁读**。触发词："构造受众画像"/"更新 persona"/"我的观众是谁"/"build persona"/"刷新受众画像"/"看看我的受众画像"。

### cheat-predict

路径：`~/.codex/internal-skills/super-skill-router/internal-skills/cheat-on-content/internal-skills/cheat-predict/INSTRUCTION.md`  
类别：cheat-on-content  
默认角色：主 Skill  
触发：给最终稿写一份 immutable 盲预测日志。这是 cheat-on-content 整个校准循环的核心动作——预测段一旦写完不可改，由 hook 强制。**自动检测**：如目标文件已有 `## 预测` / `## 预测 v1` 段（被 cheat-shoot 调用走 v2 模式），改成 append `## 预测 v2` 而非覆盖。**打分通过 Task tool 委派给 `cheat-score-blind` sub-agent**（context-isolated channel B），主 Claude review 后落盘。触发词："启动预测"/"start prediction"/"给这稿子打分并预测"/"写预测日志"。

### cheat-publish

路径：`~/.codex/internal-skills/super-skill-router/internal-skills/cheat-on-content/internal-skills/cheat-publish/INSTRUCTION.md`  
类别：cheat-on-content  
默认角色：主 Skill  
触发：登记一篇内容已发布，把 URL/平台 ID/发布时间写入对应预测文件 header 和 state file。这是一个轻量动作——只更新元数据，**不动预测段任何字符**。触发词："已发布"/"I shipped"/"发布链接是 X"/"刚发完 [url]"/"publish registered"。

### cheat-recommend

路径：`~/.codex/internal-skills/super-skill-router/internal-skills/cheat-on-content/internal-skills/cheat-recommend/INSTRUCTION.md`  
类别：cheat-on-content  
默认角色：主 Skill  
触发：从 candidates.md 里按当前 rubric 排序推荐 top N 选题，每条带 composite + 一句 rationale + 锚点对比。**candidates 不存在时给引导而非报错**。触发词："推荐选题"/"next topic"/"下一篇做什么"/"recommend topics"/"挑一个选题"。

### cheat-retro

路径：`~/.codex/internal-skills/super-skill-router/internal-skills/cheat-on-content/internal-skills/cheat-retro/INSTRUCTION.md`  
类别：cheat-on-content  
默认角色：主 Skill  
触发：T+N 天数据回收 + 复盘 + 把实绩观察写入 rubric-memo.md。这是校准循环的反馈环节——不复盘的预测等于占星。触发词："复盘 [path]"/"retro this"/"T+3d 数据来了"/"抓数据 [path]"/"把这篇复盘了"。

### cheat-score

路径：`~/.codex/internal-skills/super-skill-router/internal-skills/cheat-on-content/internal-skills/cheat-score/INSTRUCTION.md`  
类别：cheat-on-content  
默认角色：主 Skill  
触发：给单篇稿子打 rubric 分。**只在控制台输出，不写文件，不预测**。触发词："打分这篇 [path]"/"score this [path]"/"给这稿子打分"/"先打分看看"。是 cheat-predict 之前的轻量探索动作。

### cheat-score-blind

路径：`~/.codex/internal-skills/super-skill-router/internal-skills/cheat-on-content/internal-skills/cheat-score-blind/INSTRUCTION.md`  
类别：cheat-on-content  
默认角色：主 Skill  
触发：|

### cheat-seed

路径：`~/.codex/internal-skills/super-skill-router/internal-skills/cheat-on-content/internal-skills/cheat-seed/INSTRUCTION.md`  
类别：cheat-on-content  
默认角色：主 Skill  
触发：跟用户对话讨论选题——**默认一次一个**，用户主动给主题或经历，AI 围绕用户的输入深挖、提炼角度、写一份 draft。不是 AI 拿三个开放问题追用户，也不是一次给 5 个候选。触发词："找选题"/"我想做一条 X"/"最近有个想法"/"seed"/"启动种子"。可选 batch 模式：`/cheat-seed --batch 5` 走旧的 brainstorm 5 候选 + 写 5 draft 流程。

### cheat-shoot

路径：`~/.codex/internal-skills/super-skill-router/internal-skills/cheat-on-content/internal-skills/cheat-shoot/INSTRUCTION.md`  
类别：cheat-on-content  
默认角色：主 Skill  
触发：登记一条视频已拍摄。**建 video folder + 询问实际拍摄稿是否与 scripts/<id>.md 一致 + buffer +1**。与 cheat-publish 配对：拍了进队列，发了出队列。触发词："拍了"/"拍了 X"/"shot"/"shot it"/"已拍 X"/"录完了"。

### cheat-status

路径：`~/.codex/internal-skills/super-skill-router/internal-skills/cheat-on-content/internal-skills/cheat-status/INSTRUCTION.md`  
类别：cheat-on-content  
默认角色：主 Skill  
触发：cheat-on-content 的状态看板。显示当前模式 / rubric 版本 / 校准进度 / 待复盘 / pool 状态 / 是否该升级 SQLite / 是否该 bump rubric。**任何时候都可调，无副作用**。触发词："状态"/"看板"/"status"/"我现在该做什么"/"进度怎么样"。

### cheat-trends

路径：`~/.codex/internal-skills/super-skill-router/internal-skills/cheat-on-content/internal-skills/cheat-trends/INSTRUCTION.md`  
类别：cheat-on-content  
默认角色：主 Skill  
触发：从配置的热点源（HN / Reddit / YouTube trending / B 站热门 / 等）抓今天的热门话题，去重 + 粗打分 + 写入 candidates.md。**绝大部分人没有候选池——这是让"我没素材"问题在 onboarding 第二步就消失的钥匙**。触发词："抓热点"/"fetch trends"/"今天有什么可做的"/"trending now"/"找选题"。

### cheat-persona

路径：`~/.codex/internal-skills/super-skill-router/internal-skills/cheat-persona/INSTRUCTION.md`  
类别：cheat-persona  
默认角色：主 Skill  
触发：从复盘评论数据派生 / 刷新账号的受众画像，写入 audience.md。这是和 rubric 平行的第二个派生物——rubric 答"怎么打分"，persona 答"谁在看"。cheat-seed 选题 / 写稿时读它。**audience.md 含实绩信号，cheat-score-blind 硬禁读**。触发词："构造受众画像"/"更新 persona"/"我的观众是谁"/"build persona"/"刷新受众画像"/"看看我的受众画像"。

### cheat-predict

路径：`~/.codex/internal-skills/super-skill-router/internal-skills/cheat-predict/INSTRUCTION.md`  
类别：cheat-predict  
默认角色：主 Skill  
触发：给最终稿写一份 immutable 盲预测日志。这是 cheat-on-content 整个校准循环的核心动作——预测段一旦写完不可改，由 hook 强制。**自动检测**：如目标文件已有 `## 预测` / `## 预测 v1` 段（被 cheat-shoot 调用走 v2 模式），改成 append `## 预测 v2` 而非覆盖。**打分通过 Task tool 委派给 `cheat-score-blind` sub-agent**（context-isolated channel B），主 Claude review 后落盘。触发词："启动预测"/"start prediction"/"给这稿子打分并预测"/"写预测日志"。

### cheat-publish

路径：`~/.codex/internal-skills/super-skill-router/internal-skills/cheat-publish/INSTRUCTION.md`  
类别：cheat-publish  
默认角色：主 Skill  
触发：登记一篇内容已发布，把 URL/平台 ID/发布时间写入对应预测文件 header 和 state file。这是一个轻量动作——只更新元数据，**不动预测段任何字符**。触发词："已发布"/"I shipped"/"发布链接是 X"/"刚发完 [url]"/"publish registered"。

### cheat-recommend

路径：`~/.codex/internal-skills/super-skill-router/internal-skills/cheat-recommend/INSTRUCTION.md`  
类别：cheat-recommend  
默认角色：主 Skill  
触发：从 candidates.md 里按当前 rubric 排序推荐 top N 选题，每条带 composite + 一句 rationale + 锚点对比。**candidates 不存在时给引导而非报错**。触发词："推荐选题"/"next topic"/"下一篇做什么"/"recommend topics"/"挑一个选题"。

### cheat-retro

路径：`~/.codex/internal-skills/super-skill-router/internal-skills/cheat-retro/INSTRUCTION.md`  
类别：cheat-retro  
默认角色：主 Skill  
触发：T+N 天数据回收 + 复盘 + 把实绩观察写入 rubric-memo.md。这是校准循环的反馈环节——不复盘的预测等于占星。触发词："复盘 [path]"/"retro this"/"T+3d 数据来了"/"抓数据 [path]"/"把这篇复盘了"。

### cheat-score

路径：`~/.codex/internal-skills/super-skill-router/internal-skills/cheat-score/INSTRUCTION.md`  
类别：cheat-score  
默认角色：主 Skill  
触发：给单篇稿子打 rubric 分。**只在控制台输出，不写文件，不预测**。触发词："打分这篇 [path]"/"score this [path]"/"给这稿子打分"/"先打分看看"。是 cheat-predict 之前的轻量探索动作。

### cheat-score-blind

路径：`~/.codex/internal-skills/super-skill-router/internal-skills/cheat-score-blind/INSTRUCTION.md`  
类别：cheat-score-blind  
默认角色：主 Skill  
触发：|

### cheat-seed

路径：`~/.codex/internal-skills/super-skill-router/internal-skills/cheat-seed/INSTRUCTION.md`  
类别：cheat-seed  
默认角色：主 Skill  
触发：跟用户对话讨论选题——**默认一次一个**，用户主动给主题或经历，AI 围绕用户的输入深挖、提炼角度、写一份 draft。不是 AI 拿三个开放问题追用户，也不是一次给 5 个候选。触发词："找选题"/"我想做一条 X"/"最近有个想法"/"seed"/"启动种子"。可选 batch 模式：`/cheat-seed --batch 5` 走旧的 brainstorm 5 候选 + 写 5 draft 流程。

### cheat-shoot

路径：`~/.codex/internal-skills/super-skill-router/internal-skills/cheat-shoot/INSTRUCTION.md`  
类别：cheat-shoot  
默认角色：主 Skill  
触发：登记一条视频已拍摄。**建 video folder + 询问实际拍摄稿是否与 scripts/<id>.md 一致 + buffer +1**。与 cheat-publish 配对：拍了进队列，发了出队列。触发词："拍了"/"拍了 X"/"shot"/"shot it"/"已拍 X"/"录完了"。

### cheat-status

路径：`~/.codex/internal-skills/super-skill-router/internal-skills/cheat-status/INSTRUCTION.md`  
类别：cheat-status  
默认角色：主 Skill  
触发：cheat-on-content 的状态看板。显示当前模式 / rubric 版本 / 校准进度 / 待复盘 / pool 状态 / 是否该升级 SQLite / 是否该 bump rubric。**任何时候都可调，无副作用**。触发词："状态"/"看板"/"status"/"我现在该做什么"/"进度怎么样"。

### cheat-trends

路径：`~/.codex/internal-skills/super-skill-router/internal-skills/cheat-trends/INSTRUCTION.md`  
类别：cheat-trends  
默认角色：主 Skill  
触发：从配置的热点源（HN / Reddit / YouTube trending / B 站热门 / 等）抓今天的热门话题，去重 + 粗打分 + 写入 candidates.md。**绝大部分人没有候选池——这是让"我没素材"问题在 onboarding 第二步就消失的钥匙**。触发词："抓热点"/"fetch trends"/"今天有什么可做的"/"trending now"/"找选题"。

### nginx

路径：`~/.codex/internal-skills/super-skill-router/internal-skills/deployment/nginx/INSTRUCTION.md`  
类别：deployment  
默认角色：主 Skill  
触发：Minimal example Skill for Nginx deployment tasks. Use after routing when a task requires creating, reviewing, or troubleshooting Nginx reverse proxy, HTTPS, domain, port, or static file configuration.

### writing

路径：`~/.codex/internal-skills/super-skill-router/internal-skills/document/writing/INSTRUCTION.md`  
类别：document  
默认角色：主 Skill  
触发：Minimal example Skill for writing tasks. Use after routing when a task requires drafting, rewriting, summarizing, or improving structured natural-language documents.

### agent-skills

路径：`~/.codex/internal-skills/super-skill-router/internal-skills/engineering/development/agent-internal-skills/INSTRUCTION.md`  
类别：engineering  
默认角色：主 Skill  
触发："Addy Osmani's Production-grade Software Engineering Skills for AI Coding Agents. Contains 24 sub-skills covering TDD, debugging, CI/CD, Git, API design, code simplification, security, and planning."

### pm-skills

路径：`~/.codex/internal-skills/super-skill-router/internal-skills/engineering/planning/pm-skills/INSTRUCTION.md`  
类别：engineering  
默认角色：主 Skill  
触发："Pawel Huryn's Product Management Skills Marketplace. Contains 68 specialized skills covering product discovery, product strategy, OKRs, user stories, roadmaps, PRD creation, and sprint planning."

### anime

路径：`~/.codex/internal-skills/super-skill-router/internal-skills/frontend/anime/INSTRUCTION.md`  
类别：frontend  
默认角色：主 Skill  
触发：Anime.js animation engine - light, powerful, timeline-based Javascript animation library. Use for UI/web micro-animations, SVG paths, morphing, and complex transitions.

### browser-automation

路径：`~/.codex/internal-skills/super-skill-router/internal-skills/frontend/browser-automation/INSTRUCTION.md`  
类别：frontend  
默认角色：主 Skill  
触发：Control and inspect Chrome browser through Chrome DevTools MCP. Use when the task involves automated UI testing, console debugging, network tracing, or profiling Web performance.

### embedded-captions

路径：`~/.codex/internal-skills/super-skill-router/internal-skills/frontend/hyperframes/embedded-captions/INSTRUCTION.md`  
类别：frontend  
默认角色：主 Skill  
触发：'Add captions to a talking-head video. ONE catalog (CATALOG.md) of 32 visual identities behind two engines: column-flow (captions composited INTO the scene — matte occlusion + mix-blend; cream/ink/editorial/keynote/documentary/loud/neon/glitch/chrome/velocity) and themed constitutions (anchor/ordnance/terminal/neonsign/stardust/stomp/scoreboard/transit/vhs/arcade/dossier/laser/thunder/hologram/biolume/aurora/spectrum/papercut/popup/chalkboard/graffiti/brush/inkwater/ransom/lastpage/nightcity — e.g. a glyph-decode climax, a neon sign WRITTEN stroke by stroke, or the quiet `anchor` rail default). Route by identity, never by mode. Trigger on "captions/subtitles", "embed/cinematic captions", "VFX captions", "炸/特效/酷炫字幕", a named identity, or top-tier motion-graphics asks. Embedding every word is wrong for most talking-head content — `anchor` is the verbatim default. Pipeline: transcription → hyperframes remove-background matting → HTML render → ffmpeg overlay. Requires hyperframes and a single-subject clip.'

### faceless-explainer

路径：`~/.codex/internal-skills/super-skill-router/internal-skills/frontend/hyperframes/faceless-explainer/INSTRUCTION.md`  
类别：frontend  
默认角色：主 Skill  
触发：faceless-explainer video workflow - arbitrary text (article / notes / topic / brief) -> narrator_scripts.json + audio (voice + BGM) + section_plan.md -> typography / abstract-graphics / diagram / data-viz video. Typical length up to ~3 min (sweet spot ~30-90s); a genuinely longer piece is general-video, not this workflow. Generates its OWN narration (TTS) — it does not sync to a user-supplied / pre-recorded voiceover (that is general-video). No website capture, no real product screenshots. If the text names a product / its site to promote, that is /product-launch-video; when product-vs-topic is unclear, start at /hyperframes-read-first.

### general-video

路径：`~/.codex/internal-skills/super-skill-router/internal-skills/frontend/hyperframes/general-video/INSTRUCTION.md`  
类别：frontend  
默认角色：主 Skill  
触发：>

### graphic-overlays

路径：`~/.codex/internal-skills/super-skill-router/internal-skills/frontend/hyperframes/graphic-overlays/INSTRUCTION.md`  
类别：frontend  
默认角色：主 Skill  
触发：Package an existing talking-head / interview / podcast video by layering timed, designed GRAPHIC OVERLAY cards onto the playing video — titles, lower-thirds, data callouts, quotes, side panels, picture-in-picture — synced to the transcript. The source video plays in full; the agent designs and writes each card's HTML in conversation, then renders to MP4 via hyperframes. Use when the user asks for graphic overlays, on-screen graphics / lower-thirds / data callouts / kinetic titles on a video, "package / dress up my video", "add overlay cards / graphic cards", or AI-composed graphic packaging of an existing video. NOT for plain subtitles (→ embedded-captions) or building a video from scratch (→ the creation workflows); when unsure overlays-vs-captions, see /hyperframes-read-first.

### hyperframes-animation

路径：`~/.codex/internal-skills/super-skill-router/internal-skills/frontend/hyperframes/hyperframes-animation/INSTRUCTION.md`  
类别：frontend  
默认角色：主 Skill  
触发："All animation knowledge for HyperFrames — atomic motion rules, multi-phase scene blueprints, scene transitions, broader motion-design techniques, AND the seven runtime adapters (GSAP default, plus Lottie, Three.js, Anime.js, CSS keyframes, Web Animations API, TypeGPU). Use for any motion or animation task: pick 2-4 rules and compose, or load a blueprint, or look up runtime-specific API (e.g. GSAP eases / Lottie player / Three.js mixer). HyperFrames-native: single paused timeline, seek-safe, deterministic."

### hyperframes-cli

路径：`~/.codex/internal-skills/super-skill-router/internal-skills/frontend/hyperframes/hyperframes-cli/INSTRUCTION.md`  
类别：frontend  
默认角色：主 Skill  
触发：HyperFrames CLI dev loop. Use when running npx hyperframes init, add, catalog, capture, lint, validate, inspect, layout, snapshot, preview, play, render, publish, lambda, doctor, browser, info, upgrade, skills, compositions, docs, benchmark, telemetry, transcribe, tts, or remove-background, or when troubleshooting the HyperFrames build/render environment. Entry point for AWS Lambda cloud rendering (`hyperframes lambda deploy / render / progress / destroy / policies`).

### hyperframes-core

路径：`~/.codex/internal-skills/super-skill-router/internal-skills/frontend/hyperframes/hyperframes-core/INSTRUCTION.md`  
类别：frontend  
默认角色：主 Skill  
触发：HyperFrames HTML composition contract. Use for composition structure, data attributes, clips, tracks, sub-compositions, variables, media playback, deterministic render rules, and validation of minimal renderable projects.

### hyperframes-creative

路径：`~/.codex/internal-skills/super-skill-router/internal-skills/frontend/hyperframes/hyperframes-creative/INSTRUCTION.md`  
类别：frontend  
默认角色：主 Skill  
触发：Non-animation creative direction for HyperFrames videos. Use for design spec (frame.md / design.md) handling, palettes, typography, narration, beat planning, audio-reactive visuals, composition patterns, and brand / style decisions. For atomic motion patterns and scene blueprints, use `hyperframes-animation`.

### hyperframes-media

路径：`~/.codex/internal-skills/super-skill-router/internal-skills/frontend/hyperframes/hyperframes-media/INSTRUCTION.md`  
类别：frontend  
默认角色：主 Skill  
触发：Asset preprocessing for HyperFrames compositions — multi-provider TTS (HeyGen / ElevenLabs / Kokoro local), multi-provider BGM (Google Lyria / local MusicGen), Whisper transcription, background removal, and caption authoring. Use for npx hyperframes tts, bgm, transcribe, remove-background, voice/provider selection, music-mood prompting, captions / subtitles / lyrics / karaoke / per-word styling.

### hyperframes-registry

路径：`~/.codex/internal-skills/super-skill-router/internal-skills/frontend/hyperframes/hyperframes-registry/INSTRUCTION.md`  
类别：frontend  
默认角色：主 Skill  
触发：Install and wire registry blocks and components into HyperFrames compositions. Use when running hyperframes add, installing a block or component, wiring an installed item into index.html, or working with hyperframes.json. Covers the add command, install locations, block sub-composition wiring, component snippet merging, registry discovery, and authoring a new block or component to contribute upstream (idea → scaffold → validate → PR).

### motion-graphics

路径：`~/.codex/internal-skills/super-skill-router/internal-skills/frontend/hyperframes/motion-graphics/INSTRUCTION.md`  
类别：frontend  
默认角色：主 Skill  
触发：>

### pr-to-video

路径：`~/.codex/internal-skills/super-skill-router/internal-skills/frontend/hyperframes/pr-to-video/INSTRUCTION.md`  
类别：frontend  
默认角色：主 Skill  
触发：pr-to-video workflow - a GitHub pull request (URL like github.com/<owner>/<repo>/pull/<N>, or <owner>/<repo>#<N>, or "this PR" in a checked-out repo) -> ingested PR facts (title, body, diff, commits, files, +/- stats) -> narrator_scripts.json + audio (voice + BGM) + section_plan.md -> code-diff / before-after / impact explainer video. Input is a CODE CHANGE. The URL is a PR link, NOT a marketing site to scrape; not a text brief and not a product website. For a non-PR input (product site, general website, topic text), see /hyperframes-read-first.

### product-launch-video

路径：`~/.codex/internal-skills/super-skill-router/internal-skills/frontend/hyperframes/product-launch-video/INSTRUCTION.md`  
类别：frontend  
默认角色：主 Skill  
触发：>

### remotion-to-hyperframes

路径：`~/.codex/internal-skills/super-skill-router/internal-skills/frontend/hyperframes/remotion-to-hyperframes/INSTRUCTION.md`  
类别：frontend  
默认角色：主 Skill  
触发：'Port an existing Remotion (React) composition to HyperFrames HTML. Use ONLY when the user explicitly asks to port/convert/migrate/translate a Remotion source. Do NOT use: (a) authoring a new HyperFrames composition; (b) Remotion mentioned in passing; (c) Remotion code shared as reference only; (d) "same video as my Remotion one" without explicit migrate request — treat as fresh build. Doubt → `/general-video`. One-way, Remotion-only: no reverse export (HyperFrames→Remotion or any framework), no non-Remotion source (After Effects, Framer Motion, plain React/CSS) → out of scope, re-create via `/general-video`. Flags unsupported patterns (useState, useEffect, async calculateMetadata, third-party React libs, `@remotion/lambda`) and recommends runtime interop over lossy translation. Unsure whether to port vs. build fresh, or only a passing Remotion mention? → /hyperframes-read-first.'

### hyperframes

路径：`~/.codex/internal-skills/super-skill-router/internal-skills/frontend/hyperframes/INSTRUCTION.md`  
类别：frontend  
默认角色：主 Skill  
触发：>

### website-to-video

路径：`~/.codex/internal-skills/super-skill-router/internal-skills/frontend/hyperframes/website-to-video/INSTRUCTION.md`  
类别：frontend  
默认角色：主 Skill  
触发："Capture a general website/URL and turn it into a HyperFrames video (site tour, showcase, or social clip from the site's own visuals). Uses headless Chrome screenshots + brand assets. Use when intent is general — portfolio/blog/landing-page showcase or social clip from the site. NOT for: product/SaaS launch or promo (→ /product-launch-video, even from a URL); topic explainer with no site (→ /faceless-explainer); GitHub PR (→ /pr-to-video); adding captions to existing video (→ /embedded-captions); short unnarrated page-highlight motion graphic (→ /motion-graphics). Unclear launch-vs-general-site? Ask one question or start at /hyperframes-read-first."

### jianying-editor-skill

路径：`~/.codex/internal-skills/super-skill-router/internal-skills/frontend/jianying-editor-skill/INSTRUCTION.md`  
类别：frontend  
默认角色：主 Skill  
触发：剪映 (JianYing) AI自动化剪辑的高级封装 API (JyWrapper)。提供开箱即用的 Python 接口，支持录屏、素材导入、字幕生成、Web 动效合成及项目导出。

### mimo-jianying-video-workflow

路径：`~/.codex/internal-skills/super-skill-router/internal-skills/frontend/mimo-jianying-video-workflow/INSTRUCTION.md`  
类别：frontend  
默认角色：主 Skill  
触发：End-to-end Chinese product demo video workflow that combines jianying-editor-skill automation with MiMo-only video understanding, MiMo TTS narration, iterative rendered-video critique, targeted revisions, JianYing draft creation, and final MP4 export. Use when Codex is asked to turn product requirements, screenshots, recordings, or app demos into a polished JianYing/剪映 demo video and the workflow must include MiMo analysis before and after editing.

### web-frontend

路径：`~/.codex/internal-skills/super-skill-router/internal-skills/frontend/web-frontend/INSTRUCTION.md`  
类别：frontend  
默认角色：主 Skill  
触发：Fused Frontend Skill. Combines Frontend Design, UI/UX Pro Max, GSAP Animation, Impeccable (AI-smell removal), and Taste/Aesthetic standards. Provides high-end styling, responsive layout, motion choreography, and design audit.

### impeccable

路径：`~/.codex/internal-skills/super-skill-router/internal-skills/impeccable/INSTRUCTION.md`  
类别：impeccable  
默认角色：主 Skill  
触发：Use when the user wants to design, redesign, shape, critique, audit, polish, clarify, distill, harden, optimize, adapt, animate, colorize, extract, or otherwise improve a frontend interface. Covers websites, landing pages, dashboards, product UI, app shells, components, forms, settings, onboarding, and empty states. Handles UX review, visual hierarchy, information architecture, cognitive load, accessibility, performance, responsive behavior, theming, anti-patterns, typography, fonts, spacing, layout, alignment, color, motion, micro-interactions, UX copy, error states, edge cases, i18n, and reusable design systems or tokens. Also use for bland designs that need to become bolder or more delightful, loud designs that should become quieter, live browser iteration on UI elements, or ambitious visual effects that should feel technically extraordinary. Not for backend-only or non-UI tasks.

### ai-paper-pipeline

路径：`~/.codex/internal-skills/super-skill-router/internal-skills/paper/ai-paper-pipeline/INSTRUCTION.md`  
类别：paper  
默认角色：主 Skill  
触发：Run a rigorous AI top-conference paper pipeline from research definition through real literature search, reproducible experiments, LaTeX writing, evidence review, quality gates, and rebuttal iteration. Use when Codex is asked to generate, execute, or manage an AI/ML research paper workflow with staged planning, experiments, citations, and submission-ready manuscript artifacts.

### scientific-research-skill

路径：`~/.codex/internal-skills/super-skill-router/internal-skills/paper/scientific-research-skill/INSTRUCTION.md`  
类别：paper  
默认角色：主 Skill  
触发：Selectable scientific paper workflow that combines an AI top-conference research/experiment pipeline with Nature-style manuscript writing, citation, figure, data-availability, polishing, reader, and reviewer-response modules. Use when Codex is asked to plan, execute, write, revise, audit, or package a research manuscript while choosing between AI-conference, Nature-style, or hybrid strategies.

### serenity-skill

路径：`~/.codex/internal-skills/super-skill-router/internal-skills/serenity-skill/INSTRUCTION.md`  
类别：serenity-skill  
默认角色：主 Skill  
触发：Turn an investment agent into a supply-chain bottleneck hunter. Use this skill for source-backed investment research, live market/theme scans, AI/semi/technology value-chain mapping, A-share/HK/US stock screening, thesis stress tests, and Serenity-inspired research conversations. Trigger on requests like "用 Serenity 的方式看", "深度调研", "产业链/供应链/卡点/瓶颈", "A股 AI 半导体哪个最值得研究", "find unknown bottlenecks", "rank candidates", or "challenge this thesis". Outputs plain-language reasoning, ranked research priorities, evidence chains, risks, and next verification steps. Research support only; no trade execution.

### taste-skill

路径：`~/.codex/internal-skills/super-skill-router/internal-skills/taste-skill/INSTRUCTION.md`  
类别：taste-skill  
默认角色：主 Skill  
触发：Anti-slop frontend skill for landing pages, portfolios, and redesigns. The agent reads the brief, infers the right design direction, and ships interfaces that do not look templated. Real design systems when applicable, audit-first on redesigns, strict pre-flight check.
