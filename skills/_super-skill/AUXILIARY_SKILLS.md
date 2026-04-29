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
路径：`~/.codex/skills/karpathy-guidelines/SKILL.md`  
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

