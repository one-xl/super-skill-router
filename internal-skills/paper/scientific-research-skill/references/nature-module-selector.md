# Nature Module Selector

Use this reference when mode is `nature-style`, or when `hybrid` mode needs high-impact journal writing, figure, citation, data, reading, polishing, or response behavior.

The downloaded upstream repo lives at `_external/nature-skills` when present. Exact upstream modules are under `_external/nature-internal-skills/internal-skills/nature-*`. Prefer the distilled rules below unless the task needs module-specific details.

## Module Choices

| Module | Use When | Key Advantage | Upstream Folder |
|---|---|---|---|
| `nature-writing` | Drafting or restructuring abstract, introduction, related work, methods, results, discussion, conclusion, title, or full manuscript argument | Evidence-first section architecture and claim-evidence map | `internal-skills/nature-writing` |
| `nature-polishing` | Polishing, translating, or restructuring academic prose, especially Chinese notes or rough English | Argument repair before sentence polish; Nature-leaning English | `internal-skills/nature-polishing` |
| `nature-figure` | Creating, revising, auditing, or polishing manuscript figures | Figure contract, panel logic, backend gate, publication export QA | `internal-skills/nature-figure` |
| `nature-citation` | Segmenting text into citable claims, finding support, exporting ENW/RIS/RDF | Conservative support grades and reference-manager outputs | `internal-skills/nature-citation` |
| `nature-academic-search` | Multi-source literature search, citation verification, MeSH, citation conversion | Search source routing and format conversion workflows | `internal-skills/nature-academic-search` |
| `nature-data` | Data availability statements, repository plans, FAIR metadata | Nature-ready data availability and missing-information flags | `internal-skills/nature-data` |
| `nature-response` | Point-by-point reviewer response and revision packages | Faithful comment preservation, action mapping, tone QA | `internal-skills/nature-response` |
| `nature-reader` | Full-paper bilingual Markdown reader from PDF/DOI/arXiv/HTML/text | Source-grounded bilingual reading with figures/tables/source map | `internal-skills/nature-reader` |
| `nature-paper2ppt` | Turning a paper into a presentation | Adjacent deliverable, use only when user asks for PPT | `internal-skills/nature-paper2ppt` |

## Nature Writing Adapter

Use when the manuscript needs a stronger argument or section architecture.

Core stance:

- Author evidence comes first. Do not invent results, mechanisms, references, methods, novelty, statistics, or limitations.
- Write the argument before writing sentences.
- Use ambitious but bounded claims.
- If core claim, evidence, or boundary is missing, expose the gap before drafting.

Default full-paper chain:

```text
field-scale need -> unresolved bottleneck -> proposed move -> decisive evidence -> broader implication -> boundary
```

Section defaults:

- Abstract: `context/problem -> gap -> approach -> key result -> implication -> boundary`
- Introduction: `field scale -> bottleneck -> prior attempts -> unresolved gap -> present study`
- Results: evidence ladder from system/workflow to validation, main result, comparison, mechanism/diagnostic analysis, application/generalization.
- Related Work: group by technical topic and mechanism, not by year.
- Discussion: central advance, evidence meaning, relation to prior work, constraints, future use.
- Conclusion: contribution, decisive evidence, implication, boundary.

Return claim-evidence maps for major claims.

## Nature Figure Adapter

Use for publication figures, multi-panel plots, or Figure 1 logic.

Blocking gate:

- If the user has not chosen Python or R, ask "Python or R?" and stop.
- Once chosen, use only that backend for drawing, previewing, exporting, and visual QA.

Figure contract:

1. Core conclusion: one-sentence claim the figure must defend.
2. Evidence chain: each panel must carry a unique piece of evidence.
3. Archetype: `quantitative grid`, `schematic-led composite`, `image plate + quant`, or `asymmetric mixed-modality figure`.
4. Export contract: dimensions, editable text, source data, statistics, image integrity, SVG/PDF/TIFF/PNG needs.
5. Review risks: unsupported panel, overcrowding, unclear statistics, inconsistent palette, missing source data.

In `hybrid` mode, AI experiments provide data; Nature figure adapter controls figure argument and QA.

## Nature Citation Adapter

Use when the user asks for Nature/CNS support, citation export, claim-to-reference mapping, or strict citation support.

Workflow:

1. Segment text into focused citable claims.
2. Translate each segment into English search claims when needed.
3. Search structured metadata and publisher pages.
4. Grade support: `strong`, `partial`, `background`, `contradictory/limiting`, or `metadata-only`.
5. Export ENW/RIS/RDF only when requested or useful.

Do not treat `metadata-only` as support. Do not force a CNS citation when no direct support exists.

## Nature Data Adapter

Use for data availability and FAIR metadata.

Return:

- ready-to-paste `Data Availability`
- repository and citation actions
- missing information/risk flags
- Chinese notes when the user works in Chinese

Do not invent DOIs, accession numbers, embargo dates, repository names, licences, ethics approvals, or access committees.

## Nature Response Adapter

Use for reviewer comments, editor decisions, rebuttal letters, and revision plans.

Workflow:

1. Preserve editor and reviewer comments faithfully.
2. Assign IDs such as `E.1`, `R1.1`, `R2.1`.
3. Classify severity, type, proposed action, missing input, and risk.
4. Map every response to manuscript change, evidence, figure/table, citation, or `AUTHOR_INPUT_NEEDED`.
5. Run QA for completeness, traceability, factuality, and tone.

Output a response strategy summary, tracker table, point-by-point response letter, change checklist, and missing-information flags.

## Nature Reader Adapter

Use for complete paper reading or translation artifacts.

Default outputs:

- `paper.md`
- `source_map.json`
- `translation_notes.md`
- `assets/`

Do not degrade a full-paper reader into a summary unless the user explicitly asks for a summary.

## Nature Polishing Adapter

Use when the task is already a draft and the user wants publication-quality English or Chinese-to-English reconstruction.

Diagnose before editing:

```text
paper type -> section job -> paragraph logic -> claim/evidence/boundary -> sentence polish
```

Do not polish unsupported claims into stronger language. Sentence-level beauty cannot override evidence.

## How To Use Upstream Files

When exact module behavior is needed and `_external/nature-skills` exists:

- Read the relevant upstream `SKILL.md` first.
- Then read only the specific referenced files needed for the task.
- Do not bulk-load all Nature references or assets.
- Do not expose private local paths or upstream file provenance in manuscript text.

If upstream is absent, use this distilled selector reference.
