---
name: headroom
description: "Context compression layer for AI agents. Compresses logs, outputs, and histories to save 60-95% tokens. Use when encountering massive terminal output, very long stack traces, or large log files."
---

# Headroom Context Compression

## Purpose

Use Headroom to compress large text blocks (command outputs, logs, conversation history, RAG chunks) to save token cost and avoid context window limits.

## How to use

1. **Proxy Mode**: Run \`headroom proxy --port 8787\` and direct your LLM client base URL to \`http://localhost:8787/v1\`.
2. **CLI Wrapping**: Run \`headroom wrap claude\` or \`headroom wrap codex\` to automatically compress tool outputs in real-time.
3. **MCP Server**: Configure the headroom MCP server in your agent's config using command \`headroom-mcp\` or equivalent.

## Headroom vs CodeGraph Comparison

- **CodeGraph**: Best for code intelligence, symbol definitions, and codebase navigation. It works by "selective reading" (preventing unnecessary files from being loaded).
- **Headroom**: Best for prose, long stack traces, and test log compression. It works by "text summarization and AST pruning" of already generated context.
- **Priority**: Use CodeGraph for code navigation. Use Headroom as a post-processing tool for massive terminal outputs or long history retention.
