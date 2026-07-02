# Skill Lock Rules

## Purpose

Skill lock records installed external Skills so the project remains auditable and reproducible.

It is not a package manager and does not install anything by itself.

## Default Lockfile

When a project installs external Skills, record them in:

```text
BUSINESS_SKILL_ROOT/SKILL_LOCK.md
```

If `BUSINESS_SKILL_ROOT` is unavailable, propose creating:

```text
internal-skills/SKILL_LOCK.md
```

Do not write a lockfile unless the user confirms installation or update.

## When To Update

Update the lockfile only after user confirmation when:

- A Skill is installed from `skills.sh`.
- A Skill is copied from a user-provided source.
- An external Skill is updated.
- An external Skill is removed.
- A Skill source URL or audit status changes.

## Record Format

Use this format:

```md
## [skill-name]

category: [category]
subcategory: [subcategory]
source: skills.sh / github / local / user-provided
source_id: [skills.sh id or repository path]
source_url: [url]
install_command: [command]
installed_to: [relative path]
installed_at: [YYYY-MM-DD]
audit_status: pass / warn / fail / unavailable
notes: [short reason]
```

## Safety Rules

- Do not include secrets, tokens, private local absolute paths, or machine-specific credentials.
- Prefer relative paths.
- If a Skill is installed globally, record that explicitly.
- If audit status is unavailable, write `unavailable` instead of guessing.

## Proposal Format

When a lockfile update is needed, include this section in the install or update proposal:

```md
## Skill Lock Update

目标文件：BUSINESS_SKILL_ROOT/SKILL_LOCK.md

建议记录：

[lock entry]
```
