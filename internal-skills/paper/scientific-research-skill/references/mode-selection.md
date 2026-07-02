# Mode Selection

This skill is a selector. Pick one mode for the current task, then optionally attach modules.

## Primary Modes

| Mode | Use When | Primary Strength | Avoid When |
|---|---|---|---|
| `ai-conference` | AI/ML/CS conference paper, experiments, reproducibility, LaTeX template, rebuttal loop | End-to-end research pipeline and hard evidence gates | User only asks to polish a paragraph or make a Nature figure |
| `nature-style` | Nature/CNS/high-impact journal prose, data availability, figure logic, citation support, response letters | Argument-first writing, conservative claim calibration, publication figures | User needs full experiment generation and AI conference page/template compliance |
| `hybrid` | AI/ML paper needs rigorous experiments plus Nature-level narrative/figures/polish | AI evidence pipeline with Nature editorial modules | User wants a pure Nature submission or a pure code experiment |

## Selection Questions

Ask or infer:

1. What is the target venue or family?
2. Is the task research execution, manuscript writing, figure generation, citation support, data availability, paper reading, polishing, or reviewer response?
3. Does the paper need runnable experiments, ablations, baselines, and result logs?
4. Does the user need Nature/CNS-specific journal conventions?
5. Is the source material Chinese, mixed Chinese-English, or rough lab notes?

## Stage Adapter Matrix

| Stage / Need | AI-Conference Adapter | Nature-Style Adapter | Hybrid Rule |
|---|---|---|---|
| Topic definition | SMART goal and problem tree | Core claim, boundary, paper type | Use AI goal plus Nature one-sentence argument |
| Literature search | Multi-source academic search, >=30 relevant references | Conservative support for citable claims and journal scope | Use AI broad search first, Nature claim support for final prose |
| Knowledge synthesis | Clusters, gaps, falsifiable hypotheses | Article argument chain and section architecture | Convert gaps into a field-scale need -> bottleneck -> proposed move chain |
| Experiment design | YAML plan, baselines, ablations, metrics, compute budget | Figure/evidence ladder and claim support | AI plan controls; Nature checks whether evidence is narratable |
| Code/run | Deterministic real experiments, time guards, logs | Usually not responsible | AI adapter only |
| Analysis | Exact numbers, statistical checks, decision loops | Results narrative and bounded interpretation | AI computes; Nature calibrates wording |
| Writing | Conference structure and page/template constraints | Nature abstract/intro/results/discussion/conclusion patterns | Conference structure stays; Nature improves rhetorical flow |
| Figures | Generated from actual results | Figure contract, panel logic, publication export QA | AI supplies data; Nature controls figure argument and visual QA |
| Citations | DOI/arXiv/URL verification and BibTeX | Claim segmentation, support grades, ENW/RIS/RDF if needed | AI BibTeX remains; Nature support grades final claims |
| Data availability | Reproducibility archive | Nature-ready data availability and FAIR metadata | Use both when journal requires data statement |
| Review/rebuttal | Harsh conference review, REFINE/PIVOT | Point-by-point reviewer response package | Use AI for experiments, Nature for response tone/traceability |

## Conflict Rules

- If a venue has strict template/page rules, venue rules win.
- If Nature prose style would weaken reproducibility detail in a conference Methods section, keep reproducibility detail and improve clarity instead.
- If AI-conference prompts ask for broad literature but Nature citation scope is CNS-only, use the broader search for Related Work and the strict Nature/CNS scope only for explicit user requests.
- If Nature-style modules ask for polished prose but evidence is missing, evidence gate wins.
- If a module asks for a backend choice, such as Python/R for figures, treat that as a blocking gate.

## Output Tagging

For substantial work, start artifacts or progress notes with:

```text
Mode: ai-conference | nature-style | hybrid
Selected modules: [...]
Reason:
Evidence inputs:
Pending gates:
```
