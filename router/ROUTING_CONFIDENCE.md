# Routing Confidence Rules

## Purpose

Routing confidence helps the agent decide whether to proceed, ask one small question, or generate a proposal.

This file is for internal routing decisions. Do not show confidence by default unless the user asks for routing details.

## Score Levels

Use exactly one level:

- `high`
- `medium`
- `low`

## Inputs

Use only information already allowed by the router:

- User task text.
- `CATEGORY_INDEX.md`.
- Candidate `CATEGORY_TAG.md`.
- Candidate `SUBCATEGORY_INDEX.md`.
- Candidate `SKILL_TAG.md`.
- Optional `PROJECT_PROFILE.md` result.
- Optional external Skill candidate metadata from `skills.sh`.

Do not read extra Skill files just to raise confidence.

## High Confidence

Use `high` when:

- The task clearly matches one category.
- One subcategory clearly matches.
- The selected `SKILL_TAG.md` read condition is met.
- Project profile signals do not conflict with the task.

Action:

- Proceed with the selected main Skill.
- Add auxiliary Skills if policy allows.
- Do not ask a clarification question.

## Medium Confidence

Use `medium` when:

- The category is clear but multiple subcategories may apply.
- The task crosses two categories but one main Skill is still clear.
- Project profile is weak but not conflicting.
- A fallback example Skill is useful but not exact.

Action:

- Proceed with the smallest safe Skill combination.
- Keep assumptions explicit in the final answer when relevant.
- Generate Skill Update Proposal if the gap is reusable.

## Low Confidence

Use `low` when:

- No category clearly matches.
- Candidate category tags conflict.
- No subcategory is a good fit.
- The task requires missing domain knowledge and `skills.sh` has no clear candidate.
- Project profile conflicts with task wording.

Action:

1. Ask one minimal clarification question, or state the lowest-risk assumption.
2. Do not read more than 3 candidate category tags or 3 candidate Skill tags.
3. Do not install external Skills.
4. If the gap is structural, generate Skill Update Proposal or Skill Install Proposal.

## Internal Format

```text
Routing Confidence
- level: high / medium / low
- main signal: [short reason]
- uncertainty: [short reason or none]
- action: proceed / ask / proposal
```

