---
name: ai-paper-pipeline
description: Run a rigorous AI top-conference paper pipeline from research definition through real literature search, reproducible experiments, LaTeX writing, evidence review, quality gates, and rebuttal iteration. Use when Codex is asked to generate, execute, or manage an AI/ML research paper workflow with staged planning, experiments, citations, and submission-ready manuscript artifacts.
---

# AI Paper Pipeline

Use this skill to turn a user-provided AI research idea and project resources into a staged, auditable paper pipeline. The goal is a truthful, reproducible, submission-ready manuscript for a target AI conference; never promise acceptance, fabricate data, or treat environment/debugging issues as research contributions.

## Load Order

1. Read the user's paper brief and identify placeholders such as `<paper_title>`, `<target_conference>`, `<project_name>`, resource paths, page limit, deadline, topic, metric, and year cutoff.
2. If the project folder already contains `MEGA_PROMPT.md`, `RESTRICTS.yaml`, or `docs/*.md`, read them before any planning or writing. If `MEGA_PROMPT.md` or `RESTRICTS.yaml` are missing and the user provided their contents in the request, create them in the paper project root.
3. Read [references/pipeline.md](references/pipeline.md) before executing stages.
4. Read [references/constraints.md](references/constraints.md) before literature collection, experiment generation, experiment execution, paper writing, peer review, citation verification, and final quality gates.
5. Read [references/prompt-blocks.yaml](references/prompt-blocks.yaml) only when generating stage-specific LLM prompts or templates.

## Required Project Layout

Use or create this layout under `<project_name>-paper` unless the user gives another root:

```text
<project>-paper/
  MEGA_PROMPT.md
  RESTRICTS.yaml
  PROGRESS.md
  code/
  data/
  docs/
  paper/
    <target-conference-template>/
    mypaper/
      figures/
      main.tex
      sections/
  plans/
  results/
```

Write experiments in `code/`, real inputs in `data/`, normalized outputs in `results/`, manuscript files in `paper/mypaper/`, and one plan markdown file in `plans/` before every stage.

## Operating Rules

- Maintain `PROGRESS.md` as a versioned state machine, not a linear checklist. Record stage status, artifacts, evidence paths, loop version (`v1`, `v2`, ...), REFINE/PIVOT jumps, and changes from prior versions.
- At each gate stage, pause for approval unless the user explicitly provided `--auto-approve`.
- Version artifacts before any REFINE or PIVOT. Preserve earlier results and drafts.
- Commit after completed stages when the target folder is a git repository and the user has not forbidden commits.
- Use real APIs or official databases for literature where possible: OpenAlex, Semantic Scholar, arXiv, DOI/Crossref pages, or conference proceedings. Do not invent citations.
- Run real experiments only. Do not fabricate metrics, curves, datasets, logs, or statistical tests.
- Start main experiment loops with a pilot run that prints `TIME_ESTIMATE: Xs`, then scale work according to compute budget.
- Use subagents or fresh model contexts only where available and useful for independent analysis, harsh review, or result critique; pass them evidence artifacts rather than your conclusions.

## Execution Summary

Follow the 25 stages in [references/pipeline.md](references/pipeline.md), with mandatory loops:

- Stage 15 may decide `PROCEED`, `REFINE -> Stage 13`, or `PIVOT -> Stage 8`.
- Stage 25 may trigger experiment `REFINE -> Stage 13` or manuscript `PIVOT -> Stage 16`.
- Run at least two full review/improvement cycles unless blocked by user, budget, or missing evidence.

## Manuscript Standards

- Keep the Abstract as close as possible to the submitted placeholder abstract unless the user authorizes changes.
- Use the target conference LaTeX template and write in `paper/mypaper`.
- Keep body pages at or below the specified limit through Conclusion; references and appendices may continue afterward if allowed by the venue.
- Main sections: Introduction, Related Work, Methodology, Experiments, Results, Discussion, Limitations, Conclusion, References, Appendix.
- Before writing the draft, design Figure 1 as the paper's central visual argument. For illustration figures, leave a precise Nano Banana 2 prompt as a LaTeX comment. Generate data charts directly from real experiment outputs.
- Every paper claim must trace to one of: project source/docs/examples, literature card, experiment code, result file, or log.

## Stop Conditions

Stop and ask the user before continuing if:

- A required project/resource path is missing and no reasonable fallback exists.
- A gate rejects the current artifact and the next action would discard user work.
- Literature APIs/network access are unavailable and the paper would need unsupported citations.
- Experiments cannot run truthfully within the available compute budget.
- Evidence review finds a `CRITICAL FABRICATION` mismatch between manuscript claims and logs/results.
