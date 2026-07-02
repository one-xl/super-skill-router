# Super Skill Router

`super-skill-router` 是一个给 AI Agent 用的 Skill 惰性路由框架。它通过“先读分类索引、再读标签、最后按需加载完整 Skill”的机制，极大地节约了 Token 并提升了选择精度。

## 目录结构

```text
super-skill-router/
├── internal-skills/     # 业务专业领域技能目录
│   ├── frontend/
│   ├── backend/
│   └── ...
├── router/              # 路由配置与策略库
│   ├── CATEGORY_INDEX.md
│   ├── SKILL_RANKINGS.md
│   ├── SKILL_POLICY.md
│   └── ROUTER.md
├── scripts/             # 路由匹配与健康体检脚本
│   ├── route.js
│   └── doctor.js
├── skills-manifest.json # 机器可读技能清单配置文件
└── SKILL.md             # 全局唯一公开入口文件
```

## 使用与配置

配置两个关键变量（支持同仓库模式和外部依赖模式）：
- **SUPER_SKILL_ROOT**：指向框架根目录 `.`。
- **BUSINESS_SKILL_ROOT**：业务 Skill 文件夹 `internal-skills`。

### 自动路由匹配命令

```bash
node scripts/route.js --query "<用户任务描述>" --workspace "<项目绝对路径>"
```

### 全局同步与结构体检

在构建或更新技能结构后，运行自检和全局多端同步：

```bash
node scripts/route.js --audit --update
```
