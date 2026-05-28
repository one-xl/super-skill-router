# Code Indexing Skill Tag

## 标签

CodeGraph、SQLite、FTS5、AST、知识图谱、代码分析、符号搜索、调用链、影响范围、MCP

## 适用场景

- 需要了解项目全局结构、模块依赖、或大规模符号关系。
- 进行静态代码分析、查找 callers 或 callees、或者是探索复杂的类与方法调用链。
- 进行重构影响分析（Impact Radius Analysis），确定修改范围。
- 搜索特定类型的符号（如 class, method, function, route, component）。

## 读取完整 Skill 的条件

- 需要系统配置或优化 CodeGraph 的索引规则（如 exclude 路径）。
- 需要使用命令行参数手动初始化、索引或管理 CodeGraph 数据库。
- 标签信息不足以理解如何高效率配合 CodeGraph 进行微创重构。
