# Auxiliary Skill Rules

## 定位

辅助 Skill 用于给主 Skill 增加执行约束。它不替代主 Skill，也不改变分类路由结果。

禁止扫描全部全局 Skill。只能使用本文件显式登记的辅助 Skill，或用户本次明确指定的 Skill。

## 选择规则

每次任务最多选择 3 个辅助 Skill。

如果任务很小且可以直接完成，可以不选择辅助 Skill。

如果用户显式指定某个 Skill，优先尊重用户指定。

## 已登记辅助 Skill

### karpathy-guidelines

来源：Codex 全局 Skill  
路径：`~/.codex/internal-skills/karpathy-guidelines/INSTRUCTION.md`  
角色：编码质量约束  
作为辅助 Skill，不作为主 Skill。

触发条件：

- 写代码。
- 修改代码。
- 重构代码。
- 审查代码。
- 修复 bug。
- 添加测试。
- 设计实现方案。
- 用户要求保持实现简单、避免过度设计、做最小修改或明确验证标准。

使用方式：

1. 在读取主 Skill 后读取 `karpathy-guidelines`。
2. 用它约束实现策略：先理解、保持简单、外科手术式修改、目标驱动验证。
3. 不要把它当成领域知识来源。
4. 不要为了展示辅助 Skill 而增加用户输出。

未安装时：

1. 不要阻塞任务。
2. 使用本文件中的简要原则继续执行。
3. 任务结束后生成 Skill Install Proposal，建议安装 `karpathy-guidelines` 或等价编码规范 Skill。

### agent-memory

来源：Router 内置 AI Agent 技能  
路径：`~/.codex/internal-skills/super-skill-router/internal-skills/ai-agent/agent-memory/INSTRUCTION.md`  
角色：持久化记忆与会话管理  
触发条件：
- 全局持续运行（所有任务）。
- 需要检索历史会话背景、长期知识沉淀或使用 claude-mem 进行跨会话上下文管理时。

使用方式：
1. 始终在后台加载并作为默认上下文层运行，在回答末尾列出 `[已启用的 Skill：agent-memory]`。

### codegraph

来源：Codex 全局 Skill  
路径：`~/.codex/internal-skills/codegraph/INSTRUCTION.md`  
角色：代码语义导航与搜索  
触发条件：
- 全局持续运行（任何涉及代码导航、搜索及工程依赖分析的任务）。
- 需要查找函数定义、跨文件引用或分析大项目架构时，优先使用 CodeGraph 代替常规 Grep。

使用方式：
1. 始终在涉及代码的会话中处于激活状态，优先调用 CodeGraph 服务提供的 MCP 工具，并在回答末尾列出 `[已启用的 Skill：codegraph]`。

### headroom

来源：Router 内置 AI Agent 技能  
路径：`~/.codex/internal-skills/super-skill-router/internal-skills/ai-agent/headroom/INSTRUCTION.md`  
角色：上下文极限压缩与 Token 节约  
触发条件：
- 全局持续运行（所有大文件、长日志及复杂执行历史任务）。
- 当遇到超过 5k+ 字符的执行输出、巨型报错堆栈、长 log 文件时，自动激活并进行后置压缩。

使用方式：
1. 作为后置处理器，在遇到大文本时自动触发压缩，保证上下文简洁，并在回答末尾列出 `[已启用的 Skill：headroom]`。


