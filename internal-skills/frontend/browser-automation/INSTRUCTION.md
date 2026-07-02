---
name: browser-automation
description: Control and inspect Chrome browser through Chrome DevTools MCP. Use when the task involves automated UI testing, console debugging, network tracing, or profiling Web performance.
---

# Chrome Browser Automation & DevTools Playbook

Use this skill to control the Chrome browser, capture screenshots, analyze network payloads, and debug console logs using `chrome-devtools-mcp`.

## Core Capabilities & Tools

* **Headless Page Control**: Navigate URLs, click elements, fill forms, and input text via Puppeteer tools.
* **Console Logging**: Check console errors with original stack traces mapped to source maps.
* **Network Inspector**: Audit backend APIs, fetch latency, and check payload sizes from the Network tab.
* **Performance Profiling**: Record CPU/timeline traces to identify render blocking or memory leaks.

## Routing Policy

* When testing a web application or diagnosing frontend layout issues, run a headless Chrome session and inspect the console logs first.
