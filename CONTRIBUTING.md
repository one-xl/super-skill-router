# Contributing to Super Skill Router

欢迎为本项目做贡献。在新增、修改或重构技能库结构时，请遵守以下流程规范。

## 新增专业领域 Skill 的规范步骤

1. **新建技能目录**：
   在 `internal-skills/[category]/[subcategory]/` 下建立技能物理文件夹。
2. **建立指令文件**：
   在物理目录下建立 `INSTRUCTION.md` 和 `SKILL_TAG.md`（可以使用 `templates/` 下的模板文件）。
3. **注册至 Manifest 配置文件**：
   将技能的 id、名称、instructionPath 物理路径、触发词以及辅助关联等信息，注册至项目根目录下的 `skills-manifest.json` 中。
4. **运行触发词深度去重**：
   运行以下命令，自动迭代擦除重合度高的触发词：
   ```bash
   node scripts/cleanup-manifest-triggers.js
   ```
5. **执行健康度体检**：
   ```bash
   node scripts/doctor.js
   ```
   体检必须通过（诊断结果为 PASS，0 错误、0 警告）。
6. **执行全局镜像分发**：
   ```bash
   node scripts/route.js --audit --update
   ```
   确认待提交的工作树极其干净且只包含新增 Skill 及清单文件。
