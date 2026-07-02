# Super Skill Router 中文使用指南

本文档阐述如何在 AI Agent 开发空间和多端桌面端（如 Codex / Antigravity）中配置和使用本路由框架。

## 核心配置模式

### 模式 1：同仓库模式 (内置模式)

如果将 Router 与业务技能放在同一个 Git 仓库内，配置如下：

```text
SUPER_SKILL_ROOT = . (项目根目录)
BUSINESS_SKILL_ROOT = internal-skills (专业业务技能目录)
```

- 此时 Agent 优先从根目录唯一的 `SKILL.md` 入手读取。

### 模式 2：外部依赖模式 (子模块或 vendor 引入)

如果把本框架复制到其他项目的 `vendor/super-skill-router/` 下，配置如下：

```text
SUPER_SKILL_ROOT = vendor/super-skill-router
BUSINESS_SKILL_ROOT = internal-skills
```

- Agent 应从 `vendor/super-skill-router/SKILL.md` 入手读取。

## 典型匹配用例说明

使用路由脚本能够对典型任务给出极高置信度的判断：
- **前端页面 Bug 修复**：直接将任务关联至 `web-frontend` 并推荐 `diagnose` 辅助规则。
- **论文 Rebuttal 写作**：匹配 `scientific-research-skill` 并动态提取 `grammar-check` 指令进行语法润色。
- **后端安全审计**：匹配 `security-and-hardening` 安全加固技能。

## 结构健康体检 (doctor.js)

框架提供健康自诊断脚本，该脚本集成在部署审计流程中：

```bash
node scripts/doctor.js
```

体检脚本会执行以下三类强阻断拦截断言，一旦检测失败将阻断同步：
1. **Frontmatter 格式校验**：保证根目录全局入口格式规范，无结束符粘连。
2. **废弃指令校验**：禁止引入过时的 `../scripts/` 相对路径脚本调用。
3. **中文乱码校验 (Mojibake 防御)**：统计关键文件中的 Mojibake 乱码特征汉字，出现频次大于 0 时阻断，确保文本内容字面可读性。
