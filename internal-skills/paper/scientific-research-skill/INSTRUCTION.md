---
name: scientific-research-skill
description: Selectable scientific paper workflow that combines an AI top-conference research/experiment pipeline with Nature-style manuscript writing, citation, figure, data-availability, polishing, reader, and reviewer-response modules. Use when Codex is asked to plan, execute, write, revise, audit, or package a research manuscript while choosing between AI-conference, Nature-style, or hybrid strategies.
---

# Scientific Research Skill

Use this skill as a selector, not as a single merged prompt. It preserves two complementary traditions:

- **AI conference pipeline**: staged research definition, literature search, experiment generation/execution, evidence gates, LaTeX export, and rebuttal loops.
- **Nature-style modules**: argument-first writing, section architecture, figure contracts, conservative citation support, data availability, polishing, bilingual reading, and point-by-point reviewer response.

When the two disagree, choose explicitly by venue, paper type, available evidence, and user intent. Do not silently blend incompatible rules.

## First Move

1. Identify the target: `ai-conference`, `nature-style`, or `hybrid`.
2. Read [references/mode-selection.md](references/mode-selection.md) before doing substantive work.
3. For AI-conference research loops, read [references/ai-conference-pipeline.md](references/ai-conference-pipeline.md).
4. For Nature-style or high-impact journal writing modules, read [references/nature-module-selector.md](references/nature-module-selector.md).
5. Before experiments, citations, manuscript claims, review, or final export, read [references/hard-constraints.md](references/hard-constraints.md).
6. Read [references/prompt-blocks.yaml](references/prompt-blocks.yaml) only when constructing stage prompts.

If `_external/nature-skills` exists in the workspace, it is the downloaded upstream reference. Use it only as an optional source for exact module behavior; the distilled selector files in `references/` are the stable interface for this skill.

## Mode Summary

### `ai-conference`

Choose this for NeurIPS, ICML, ICLR, ACL, CVPR, AAAI, KDD, or similar AI/CS conferences.

Default stance:

- Run the 25-stage loop with gated literature, experiments, analysis, writing, quality checks, citation verification, external review, and rebuttal.
- Use real code, real data, real APIs, real citations, and traceable logs.
- Prioritize strong baselines, ablations, reproducibility, and exact methodology-evidence consistency.
- Write in the target conference LaTeX template.

### `nature-style`

Choose this for Nature, Nature Communications, Science, Cell, high-impact journal articles, or when the user asks for Nature-style writing, figures, citation support, data availability, or reviewer response.

Default stance:

- Write from evidence outward: core claim, boundary, figure logic, section architecture, and conservative prose.
- Use Nature-style modules selectively: writing, polishing, figure, citation, data, reader, response.
- Keep claim-evidence maps visible.
- Do not invent line numbers, sample sizes, citations, experiments, figure panels, or repository identifiers.

### `hybrid`

Choose this when the paper is an AI/ML research manuscript but the user wants Nature-level narrative, figures, or editorial polish.

Default stance:

- Use AI-conference stages for research, experiments, result integrity, and LaTeX/conference compliance.
- Use Nature-style writing and figure modules for abstract, introduction, paragraph flow, Figure 1 logic, discussion, conclusion, and reviewer-facing clarity.
- Use Nature citation/data/response modules only when the target venue or user request calls for them.

## Project Layout

Use or create this layout for a paper project unless the user provides another:

```text
<project>-paper/
  MEGA_PROMPT.md
  RESTRICTS.yaml
  PROGRESS.md
  code/
  data/
  docs/
  paper/
    <target-template>/
    mypaper/
      figures/
      main.tex
      sections/
  plans/
  results/
```

For this skill repository itself:

```text
scientific-research-skill/
  SKILL.md
  agents/openai.yaml
  references/
  _external/nature-internal-skills/   # downloaded upstream reference, not required at runtime
```

## Universal Operating Rules

- Choose a mode before acting. Record the selected mode and reason in `PROGRESS.md` or the task notes.
- Create a plan file before each major stage when working inside a paper project.
- Treat gates as real: literature screen, experiment design, quality gate, citation verification, and reviewer response QA may stop the pipeline.
- Preserve artifacts before any `REFINE` or `PIVOT`.
- Keep every claim traceable to source documents, project code/docs/examples, literature cards, result files, logs, figures, or supplied reviewer comments.
- If evidence is missing, mark `AUTHOR_INPUT_NEEDED`, create a scaffold, or roll back. Do not fill gaps with plausible prose.

## Stop Conditions

Stop and ask before proceeding when:

- The user has not provided enough topic, venue, project, evidence, or target-mode information to choose safely.
- A requested external policy or journal requirement may have changed and cannot be verified.
- Literature or citation search cannot access reliable sources.
- Experiments cannot be run truthfully in the available compute budget.
- A manuscript claim conflicts with code, logs, result files, citations, source documents, or reviewer comments.
