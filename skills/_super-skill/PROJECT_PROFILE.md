# Project Profile Rules

## 定位

本文件定义如何轻量识别当前项目类型，用于辅助路由。

它只允许读取少量高信号文件，不允许扫描整个项目。

## 何时读取

在选择候选大类后，如果任务涉及代码、构建、部署、测试或项目结构，可以读取本文件。

## 允许读取的文件

优先读取当前工作区根目录下的这些文件。只读存在的文件，不递归扫描：

- `package.json`
- `pnpm-lock.yaml`
- `yarn.lock`
- `package-lock.json`
- `tsconfig.json`
- `vite.config.*`
- `next.config.*`
- `nuxt.config.*`
- `Cargo.toml`
- `pyproject.toml`
- `requirements.txt`
- `go.mod`
- `pom.xml`
- `build.gradle`
- `*.csproj`
- `*.sln`
- `Dockerfile`
- `docker-compose.yml`
- `compose.yml`
- `README.md`
- `AGENTS.md`

## 禁止

- 不要递归扫描源码目录。
- 不要读取大量业务文件来判断技术栈。
- 不要把项目识别当作完整代码审查。
- 不要因为识别到技术栈就跳过 Skill 路由。

## 输出格式

内部使用以下格式，不要求默认展示给用户：

```text
Project Profile
- type: frontend / backend / fullstack / library / docs / unknown
- stack: React / Vue / Next.js / Node.js / Python / .NET / Docker / unknown
- signals: package.json, Dockerfile
- routing hint: frontend + deployment
- confidence: high / medium / low
```

## 路由影响

- 识别到 React、Vue、Next.js、Vite：提高 `frontend` 权重。
- 识别到 Express、Nest、Fastify、Django、Flask、Spring、ASP.NET：提高 `backend` 权重。
- 识别到 Dockerfile、compose、Nginx 配置：提高 `deployment` 权重。
- 识别到大量 Markdown 或文档任务：提高 `document` 权重。
- 识别到 Skill、Agent、Prompt、workflow：提高 `ai-agent` 权重。

## 置信度

- `high`：有明确配置文件和任务关键词一致。
- `medium`：只有配置文件或任务关键词单方面命中。
- `low`：信号冲突或缺少高信号文件。

