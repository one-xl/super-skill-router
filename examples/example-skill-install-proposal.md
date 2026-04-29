# Skill Install Proposal

## 缺失能力

当前任务需要数据库迁移 Skill，但 `BUSINESS_SKILL_ROOT` 和 `SUPER_SKILL_ROOT` 都没有对应分类或子类。

## 推荐来源

`SKILL_REGISTRY.md` 中登记的 `database-migration` Skill。

## 安装目标

`BUSINESS_SKILL_ROOT/backend/database-migration`

## 安装原因

已有 `backend/api-backend` 只覆盖 API 和业务逻辑，不覆盖数据库迁移流程、回滚策略和迁移验证。

## 安装后索引更新

- 更新 `backend/SUBCATEGORY_INDEX.md`，加入 `database-migration`。
- 确认 `backend/database-migration/SKILL_TAG.md` 存在。

## 是否需要用户确认

是。默认不下载、不安装、不覆盖文件。

