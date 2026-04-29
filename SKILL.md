---
name: super-skill-router
description: Global entrypoint for Super Skill Router. Use for non-trivial AI Agent tasks that may benefit from selecting, combining, acquiring, or maintaining Skills through progressive routing instead of reading all Skill files at once.
---

# Super Skill Router Global Entrypoint

This file makes the repository installable as a Codex global skill.

## Resolve Roots

Set:

```text
THIS_SKILL_DIR = directory containing this SKILL.md
SUPER_SKILL_ROOT = THIS_SKILL_DIR/skills
```

Set `BUSINESS_SKILL_ROOT` with this priority:

1. If the current workspace has a `skills/` directory, use that.
2. Otherwise use `THIS_SKILL_DIR/skills` for the built-in example Skills.

## Continue

Read:

```text
SUPER_SKILL_ROOT/_super-skill/SKILL.md
SUPER_SKILL_ROOT/_super-skill/ROUTER.md
```

Then follow the router rules:

- Read `CATEGORY_INDEX.md` first.
- Read only candidate category tags.
- Read only candidate subcategory tags.
- Read auxiliary Skill rules when the task needs coding, review, refactoring, testing, or implementation discipline.
- Read full `SKILL.md` only when the tag says it is needed.
- Use `skills.sh` as the default external Skill discovery and installation source.
- Generate Skill Install Proposal when a suitable external Skill exists but is not installed locally.
- Generate Skill Update Proposal when no suitable Skill exists or reusable experience appears.
- Do not update Skill files unless the user explicitly confirms.
- Do not download or install external Skills unless the user explicitly confirms.
