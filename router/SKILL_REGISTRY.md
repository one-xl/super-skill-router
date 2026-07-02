# Skill Registry

## 定位

这是可选的外部 Skill 注册表，用于缓存从 `skills.sh` 或用户确认来源中筛选过的可信 Skill。

默认保持为空，避免把 Super Skill Router 变成知识库或依赖固定生态。实际发现外部 Skill 时，优先查询 `https://skills.sh/`。

## 添加规则

- 只登记可信、可复用、可公开访问或项目明确授权的来源。
- 每条记录只写路由所需信息。
- 不在这里复制完整 Skill 内容。
- 不自动安装注册表中的 Skill，必须先生成 Skill Install Proposal。
- 优先记录 `skills.sh` 的 `id`、页面 URL 和安装命令。

## 记录格式

```md
### [skill-name]

分类：frontend / backend / deployment / document / ai-agent / other
子类：[subcategory-name]
标签：关键词 1、关键词 2、关键词 3
skills.sh id：[source/slug]
skills.sh url：https://skills.sh/[source]/[slug]
安装命令：npx skills add [skill-name-or-source]
来源：[GitHub URL、本地路径或安装命令说明]
安装目标：BUSINESS_SKILL_ROOT/[category]/[subcategory]
读取条件：什么任务需要安装或读取该 Skill
```

## Registry

当前没有默认外部 Skill。需要外部 Skill 时，优先到 `skills.sh` 搜索。

