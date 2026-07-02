# Skill Health Check Rules

## Purpose

Skill Health Check validates the router and business Skill structure without loading all Skill content.

It is for maintenance, not normal task execution.

## When To Run

Run only when:

- The user asks to check, validate, audit, or repair Skills.
- A Skill installation or update just completed.
- The router detects broken index references.
- The user asks why a Skill was not selected.

Do not run health checks by default for ordinary tasks.

## Allowed Reads

Allowed:

- `CATEGORY_INDEX.md`.
- Referenced `CATEGORY_TAG.md` files.
- Referenced `SUBCATEGORY_INDEX.md` files.
- Referenced `SKILL_TAG.md` files.
- Existence checks for referenced `SKILL.md` files.
- `SKILL_LOCK.md` if present.

Avoid:

- Reading every full `SKILL.md`.
- Recursive scanning of all folders.
- Loading large Skill bodies only to validate structure.

## Checks

Check these items:

- Every category in `CATEGORY_INDEX.md` has a referenced `CATEGORY_TAG.md`.
- Every relevant category has `SUBCATEGORY_INDEX.md`.
- Every subcategory in `SUBCATEGORY_INDEX.md` has `SKILL_TAG.md`.
- Every `SKILL_TAG.md` has a clear "read full Skill" condition.
- Referenced `SKILL.md` exists.
- External Skills recorded in `SKILL_LOCK.md` still have local files.
- No tag file is acting as a large knowledge document.
- No obvious duplicate category or subcategory labels.

## Output Format

```text
Skill Health Check
- status: pass / warn / fail
- checked scope: [router / category / subcategory / lockfile]
- findings:
  - [short issue]
- suggested fixes:
  - [short fix]
```

## Fix Policy

- Default: report findings only.
- Only modify files when the user explicitly says "确认修复" or "确认更新".
- Keep fixes minimal.
- If a new Skill is needed, generate Skill Update Proposal or Skill Install Proposal.

