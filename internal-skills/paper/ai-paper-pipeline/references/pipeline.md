# AI Paper Pipeline Reference

## Stage Groups

### A. Research Definition

1. `TOPIC_INIT`: Create a SMART research goal from topic, domains, project, quality threshold, deadline, and conference.
2. `PROBLEM_DECOMPOSE`: Build a structured problem tree with prioritized sub-questions and risks.
2.5. `HARDWARE_DETECT`: Detect NVIDIA CUDA, Apple MPS, or CPU-only execution. Warn when hardware is insufficient and adapt experiment code/package choices.

### B. Literature Discovery

3. `SEARCH_STRATEGY`: Build a multi-source search plan covering topic, methods, datasets/benchmarks, foundations, and applications.
4. `LITERATURE_COLLECT`: Use real sources such as OpenAlex, Semantic Scholar, arXiv, DOI/Crossref, and conference proceedings. Collect at least 30 genuinely relevant papers, preferably after the configured year cutoff and from top venues.
5. `LITERATURE_SCREEN` gate: Screen relevance and quality aggressively. Reject off-topic work even if prestigious.
6. `KNOWLEDGE_EXTRACT`: Produce evidence cards preserving `cite_key`, DOI, URL, year, source, problem, method, data, metrics, findings, and limitations.

### C. Knowledge Synthesis

7. `SYNTHESIS`: Cluster findings, identify gaps, and connect every gap to the core research question.
8. `HYPOTHESIS_GEN`: Generate falsifiable hypotheses through debate or independent critique. Include rationale, measurable prediction, and failure condition.
8.5. `THEORETICAL_BOUNDS`: Derive preliminary mathematical proof obligations plus time and space complexity.

### D. Experiment Design

9. `EXPERIMENT_DESIGN` gate: Produce YAML with `objectives`, `datasets`, `baselines`, `proposed_methods`, `ablations`, `metrics`, `risks`, and `compute_budget`.
10. `CODE_GENERATION`: Generate deterministic, hardware-aware, runnable experiment code. Prefer stdlib, `numpy`, `math`, and `statistics`; add heavier libraries only when necessary.
11. `RESOURCE_PLANNING`: Estimate GPU/time tasks, dependencies, and budget.

### E. Experiment Execution

12. `EXPERIMENT_RUN`: Run a small pilot first, print `TIME_ESTIMATE: Xs`, then execute the planned experiment matrix. Save logs and structured outputs.
13. `ITERATIVE_REFINE`: Repair runtime bugs, NaN/Inf, numerical instability, and weak experimental coverage by diagnosing root causes. Do not hide issues with broad `try/except` or `np.nan_to_num`.

### F. Analysis And Decision

14. `RESULT_ANALYSIS`: Use exact result values from JSON/CSV/logs. Prefer independent analysis contexts when available; ask for harsh critique and improvement suggestions.
15. `RESEARCH_DECISION`: Decide `PROCEED`, `REFINE`, or `PIVOT` with evidence and next actions. If data is insufficient, return to experiment design/refinement or hypothesis generation.

### G. Paper Writing

16. `PAPER_OUTLINE`: Build a section-level outline with evidence links and Figure 1 plan.
17. `PAPER_DRAFT`: Draft a full conference paper with 5,000-6,500 main-body words unless the target venue requires otherwise.
18. `PEER_REVIEW`: Simulate at least two rigorous reviewers and check methodology-evidence consistency.
19. `PAPER_REVISION`: Revise for page limit, claim support, data sufficiency, clarity, and reviewer objections.

### H. Final Manuscript

20. `QUALITY_GATE` gate: Score the paper and require fixes for unsupported claims, missing ablations, weak baselines, or under-length sections.
21. `KNOWLEDGE_ARCHIVE`: Record retrospective notes, reproducibility details, environment, lessons, and future work.
22. `EXPORT_PUBLISH`: Export to LaTeX using the target conference template. Keep files organized in `paper/mypaper`.
23. `CITATION_VERIFY`: Verify citation existence, relevance, DOI/URL, venue/year, and claim support.

### I. Review Iteration

24. `3RD_PARTY_REVIEW`: Use a separate context/model when available as a strict external expert reviewer.
25. `REBUTTAL`: Address review issues through manuscript changes and, when necessary, new experiments. May trigger `REFINE -> Stage 13` or paper `PIVOT -> Stage 16`.

## Gate Behavior

Gate stages are 5, 9, and 20. If `--auto-approve` is absent, present the gate artifact, recommendation, risk summary, and exact next step before proceeding. If rejected, roll back to the appropriate prior stage while preserving artifacts.

## Loop Requirements

At every stage end:

- Update `PROGRESS.md`.
- Summarize produced artifacts and evidence paths.
- Re-check `MEGA_PROMPT.md` and `RESTRICTS.yaml` if present and relevant.
- Decide whether the stage result requires `PROCEED`, `REFINE`, or `PIVOT`.
- Perform at least two review/improvement loops unless the user stops, evidence is insufficient, or compute budget prevents it.

## Literature Outputs

Store literature artifacts in a structured form:

- `results/literature_candidates.jsonl`
- `results/literature_shortlist.jsonl`
- `results/knowledge_cards.json`
- `paper/mypaper/<conference>.bib` or the provided template bibliography file

Preserve original identifiers: DOI, arXiv ID, URL, source, year, cite key, and collected timestamp.

## Experiment Outputs

Minimum expected outputs:

- `code/README.md` explaining how to reproduce.
- `code/requirements.txt` or environment file when dependencies are added.
- `results/results.json` with nested per-method/per-condition metrics.
- Raw logs with pilot timing, seed, hardware, command, commit hash when available, and warnings/errors.
- Figures generated from actual result files in `paper/mypaper/figures`.

Run enough conditions to support claims; the target is at least 10-15 meaningful experiment conditions unless compute or data constraints require a documented reduction.

## External Tools And Environment

When available in the user's environment, use configured environment variables rather than hard-coded credentials:

- `OPENAI_API_BASE`
- `OPENAI_API_KEY`
- `OPENAI_MODEL_NAME`
- `KAGGLE_API_TOKEN`
- `TAVILY_API_KEY`

Use external coding or research tools such as Claude Code, GitHub Copilot CLI, `gh`, `duckduckgo`, Kaggle, or literature APIs only when they are actually installed/configured and allowed by the current sandbox. If a tool is unavailable, document the fallback and do not pretend it was used.

Suggested model routing, when the user supplied model aliases:

- Strongest model: synthesis, paper writing, review, decision, and complex code generation.
- Cheaper/faster model: simple extraction, formatting, and bulk low-risk calls.
- Code-oriented model: experiment code generation and repair.

## Paper Outputs

Minimum expected manuscript files:

- `paper/mypaper/main.tex`
- `paper/mypaper/sections/introduction.tex`
- `paper/mypaper/sections/related_work.tex`
- `paper/mypaper/sections/methodology.tex`
- `paper/mypaper/sections/experiments.tex`
- `paper/mypaper/sections/results.tex`
- `paper/mypaper/sections/discussion.tex`
- `paper/mypaper/sections/limitations.tex`
- `paper/mypaper/sections/conclusion.tex`
- `paper/mypaper/sections/appendix.tex`

Keep less critical details in the appendix when body page limits are tight. Do not add acknowledgements or a reproducibility statement unless the user asks.
