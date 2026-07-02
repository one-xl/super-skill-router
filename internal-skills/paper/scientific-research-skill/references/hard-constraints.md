# Hard Constraints

These constraints apply across all modes.

## Topic Discipline

Use this block in planning and review prompts by substituting `{topic}`:

```text
=== HARD TOPIC CONSTRAINT ===
The paper MUST be about: {topic}

PROHIBITED content unless the user explicitly specifies case-study mode:
- Do NOT treat environment setup, dependency installation, or infrastructure failures as a research contribution.
- Do NOT present debugging logs, system errors, or configuration issues as experimental findings.
- Do NOT drift to tangential topics not directly related to the stated topic.
- Every section MUST connect back to the core research question.
- The Abstract and Introduction MUST clearly state the research problem derived from: {topic}
- The Method section MUST describe a technical approach, not a workflow.
- The Results section MUST report quantitative outcomes of experiments, not environment status.
=== END CONSTRAINT ===
```

## Evidence First

- Never invent data, citations, methods, experiments, line numbers, figure panels, repository IDs, sample sizes, statistics, or reviewer comments.
- Every claim must trace to a concrete source: supplied notes, project source/docs/examples, literature metadata/full text, experiment code, result files, logs, figures, data repositories, or reviewer letters.
- If evidence is missing, use `AUTHOR_INPUT_NEEDED`, weaken the claim, create a placeholder, or roll back to the relevant stage.
- Keep boundaries explicit. A paper is stronger when it states what the result does not prove.

## Experiment Truthfulness

- Before a main experiment loop, run one pilot condition and print `TIME_ESTIMATE: Xs`.
- If experiment conditions exceed 100, reduce seeds to 3-5. Do not force 20 seeds.
- Add `time_guard` logic that stops near 80% of budget and saves partial real data.
- Never use `random.uniform()` or similar calls to fake loss curves or results.
- Randomness is allowed only for legitimate initialization, synthetic data generation, stochastic algorithms, or resampling; seed and document it.
- Implement real objectives/losses and real mathematical operations.
- Use convergence criteria; do not rely on a fixed loop alone.
- For NaN/Inf or warnings, fix the numerical source rather than suppressing it.

## NumPy 2.x Compatibility

- Use `np.trapezoid`, not `np.trapz`.
- Use `scipy.special.erfinv`, not `np.erfinv`.
- Use Python builtins `bool`, `int`, `float`, `complex`, `str`, and `object`, not removed NumPy aliases.
- Use standard library `math`, not `np.math`.

## Literature And Citation Truthfulness

- Use real online databases, official proceedings, arXiv, DOI pages, PubMed/Crossref when relevant, or publisher pages.
- Preserve DOI, arXiv ID, PMID, URL, source, year, cite key, and collected timestamp.
- Reject unrelated papers even if prestigious.
- Do not cite a source for a stronger claim than it supports.
- Nature/CNS citation mode must grade support conservatively.

## Writing Standards

- Focus on 1-2 core innovations. Avoid unrelated module accumulation.
- Figure 1 must have a claim and evidence contract before drafting.
- Any effective component mentioned in the paper must have an ablation or an explicit reason why ablation is impossible.
- Baselines must be tuned with comparable effort to the proposed method.
- Expand only with research-gap analysis, technical details, evidence interpretation, limitations, or reproducibility detail. Do not pad with repetitive filler.
- Abstract and Introduction must clearly state contribution and boundary.

## Evidence Review Red Lines

During peer review, citation verification, and response QA, compare manuscript, `results.json`, logs, code, literature cards, figures, and reviewer comments.

Critical failures requiring rollback:

- Paper claims more datasets, seeds, trials, baselines, conditions, or statistical tests than logs/code show.
- Paper reports metrics absent from results.
- Paper describes methods or ablations not implemented.
- Paper cites a source for a claim it does not support.
- Paper treats setup/debug/runtime failures as research findings.
- Response letter claims a change was made without supplied manuscript evidence.

Label these as `CRITICAL FABRICATION` and return to the correct stage.
