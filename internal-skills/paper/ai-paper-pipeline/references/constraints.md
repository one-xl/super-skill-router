# AI Paper Pipeline Constraints

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

## Resource Guardrails

- Before a main experiment loop, run one pilot condition and print `TIME_ESTIMATE: Xs`.
- If experiment conditions exceed 100, reduce seeds to 3-5. Do not force 20 seeds.
- If time is insufficient, cap optimization steps, for example `<= 5000`, and document the cap.
- Add `time_guard` logic that stops around 80% of budget and saves partial real data.
- Record environment changes in `PROGRESS.md`, including dependencies, versions, and environment variables used.
- Prefer virtual environments, conda, or Docker for reversible configuration.

## Experiment Truthfulness

- Never use `random.uniform()` or similar random generation to fake loss curves or results.
- Randomness is allowed only for legitimate initialization, synthetic data generation, stochastic algorithms, or resampling; seed it and document it.
- Implement real objectives/losses and real mathematical operations, preferably with NumPy arrays when suitable.
- Use real convergence criteria, such as objective change `< 1e-8` for consecutive iterations. Do not rely on a fixed loop alone.
- For NaN/Inf or warnings, fix the source: learning rate, division by zero, scaling, normalization, overflow, or invalid domain. Do not mask with broad exception handling or `np.nan_to_num`.
- Claims about statistical tests must match implemented code and saved outputs.

## NumPy 2.x Compatibility

- Use `np.trapezoid`, not `np.trapz`.
- Use `scipy.special.erfinv`, not `np.erfinv`.
- Use Python builtins `bool`, `int`, `float`, `complex`, `str`, and `object`, not removed NumPy aliases.
- Use standard library `math`, not `np.math`.

## Literature Truthfulness

- Literature must be found in real online databases, official proceedings, arXiv, DOI pages, or publisher pages.
- Keep at least 30 relevant references when possible, preferably after the configured year cutoff.
- Prioritize top AI/ML venues where relevant.
- Preserve original cite keys and DOI/arXiv/URL fields in cards and BibTeX.
- Reject unrelated papers even if they are high quality.

## Project And Technology Accuracy

- Frequently inspect the target project's source, docs, and examples before describing it.
- Do not invent project features, APIs, benchmarks, or implementation details.
- In Methodology, explain the target technology's design principles, core mechanisms, and execution model only when verified.
- In Experiments, use the target project/technology only in ways supported by source/docs/examples or actual runnable code.
- In Discussion, include honest limitations and future improvements.

## Paper Construction Standards

- Focus on 1-2 core innovations. Keep other pieces simple and rigorous.
- Figure 1 must be planned before the first draft and should communicate the central contribution independently.
- Any effective component mentioned in the paper must have an ablation in code and paper results.
- Baselines must be tuned with comparable effort to the proposed method.
- Introduction target: 800-1000 words unless the conference/page budget forces a documented adjustment.
- Method target: 1000-1500 words unless the conference/page budget forces a documented adjustment.
- Expand with research-gap analysis, formalism, or technical details only. Do not pad with repetitive filler.
- Match claims to exact evidence. Overclaiming is a gate failure.

## Evidence Review Red Lines

During `PEER_REVIEW` and `CITATION_VERIFY`, compare manuscript, `results.json`, logs, code, and literature cards.

Critical failures requiring rollback:

- Paper claims more datasets, seeds, trials, baselines, conditions, or statistical tests than logs/code show.
- Paper reports metric values absent from results.
- Paper describes methods or ablations not implemented.
- Paper cites a source for a claim that the paper does not support.
- Paper treats setup/debug/runtime failures as findings.

Label these as `CRITICAL FABRICATION` and return to the correct experiment or writing stage.
