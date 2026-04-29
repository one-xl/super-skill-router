---
name: nginx
description: Minimal example Skill for Nginx deployment tasks. Use after routing when a task requires creating, reviewing, or troubleshooting Nginx reverse proxy, HTTPS, domain, port, or static file configuration.
---

# Nginx

## 执行流程

1. 明确目标服务、监听端口、域名和静态资源路径。
2. 区分反向代理规则和静态资源规则。
3. 保留最小可读配置，避免把环境私有信息写入通用示例。
4. 修改后检查配置语法，并规划平滑重载。
5. 对访问问题同时检查服务状态、端口、代理规则和证书状态。

## 输出要求

- 给出配置片段或排查步骤。
- 明确需要用户替换的占位值。
- 如果形成可复用部署流程，生成 Skill Update Proposal。

