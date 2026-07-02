---
name: codegraph
description: Code intelligence, symbols, call graphs, and impact analysis using CodeGraph MCP server. Use when you need to understand codebase structure, trace function flows, find callers/callees, analyze impact radius, or explore the codebase without excessive Grep/Read calls.
---

# CodeGraph Integration Skill

## Philosophy

**Core Principle**: Treat the codebase as a pre-indexed queryable semantic graph, rather than raw text files. Leverage CodeGraph's SQLite-backed AST indexer to navigate code instantly. Reduce token footprint and tool execution latency by up to 90% by substituting expensive multi-turn `grep` and file reading with targeted `codegraph` queries.

## When to Use

- **Exploring Unfamiliar Codebases**: To get a high-level view of module boundaries, routes, or files.
- **Trace-First Analysis**: Understanding the flow from a route handler to a database service (e.g., "how does request X reach db query Y").
- **Impact Assessment**: Analyzing what components or functions will be affected if you rename or refactor a specific function or interface.
- **Test Identification**: Finding which unit or integration tests are affected by recent source changes.

## Available MCP Tools

CodeGraph exposes the following tools to the agent:
1. `codegraph_query`: Full-text search and symbol matching.
2. `codegraph_explore`: Structured exploratory search that returns detailed symbol contexts.
3. `codegraph_trace`: Traces the direct or indirect call paths between a source and destination symbol.
4. `codegraph_callers`: Finds all direct callers of a specific symbol.
5. `codegraph_callees`: Finds all direct callees that a specific symbol calls.
6. `codegraph_impact`: Traces the full downstream impact radius of editing a symbol.
7. `codegraph_affected`: Identifies test files affected by changes in source files.
8. `codegraph_status`: Shows index coverage, SQLite backend details, and watcher status.
9. `codegraph_context`: Builds a customized markdown context for a given coding task.

## Rules of Engagement

### 1. Trust, Don't Re-Verify
Once a `codegraph` tool returns a symbol definition, call path, or impact list, **trust the result**. Do NOT run `grep` or `list_dir` to verify if the file or function exists.

### 2. Trace First for Flow Analysis
When asked "how does X connect to Y" or "what is the call flow of X":
- Run `codegraph_trace` with `from` and `to` symbols.
- If it connects, CodeGraph will inline the bodies of the hops, meaning you have completed your investigation in **exactly 1 tool call** instead of recursively reading files.

### 3. Explore Before Reading God-Files
If a file is extremely large (e.g., >500 lines or >20KB):
- Run `codegraph_explore` or `codegraph_query` to pull out the structural symbols.
- Do NOT run `view_file` on the whole file unless you are ready to make a surgical modification.

### 4. Run Impact Analysis Before Refactoring
Before changing a method signature, renaming a variable, or editing an interface:
- Run `codegraph_impact` on that symbol.
- Use the output to identify all downstream call-sites and files that require corresponding updates.

## Verification & Status

Ensure you run `codegraph status` first in any new workspace to check if:
- CodeGraph is initialized (`.codegraph/` exists).
- The file watcher is active.
- SQLite FTS5 index is fully populated.
