---
name: mimo-jianying-video-workflow
description: End-to-end Chinese product demo video workflow that combines jianying-editor-skill automation with MiMo-only video understanding, MiMo TTS narration, iterative rendered-video critique, targeted revisions, JianYing draft creation, and final MP4 export. Use when Codex is asked to turn product requirements, screenshots, recordings, or app demos into a polished JianYing/剪映 demo video and the workflow must include MiMo analysis before and after editing.
---

# MiMo JianYing Video Workflow

Use this skill to produce a finished product demo video through a closed loop:

`requirements -> collect/record assets -> MiMo video understanding -> edit with jianying-editor-skill -> MiMo TTS -> export -> MiMo review -> targeted revision -> final MP4 + JianYing draft`.

## Required companion skill

Always load and follow `jianying-editor-skill` before creating or updating JianYing drafts. Use its wrappers and conventions for draft creation, media import, subtitles, audio, keyframes, recording, effects, and export.

## MiMo-only policy

For video understanding, UI recognition, shot selection, subtitle/voice alignment review, privacy detection, and final video critique, use only:

- `mimo-v2.5` for visual/UI/video understanding.
- `mimo-v2-omni` only when audio, subtitles, and video must be judged together and it is available.
- `mimo-v2.5-tts` for Chinese narration unless the user requests a different MiMo TTS variant.

Do not substitute GPT-4V, Gemini Vision, Claude Vision, Qwen-VL, InternVL, LLaVA, or other video understanding models. If MiMo is unavailable for a required video-understanding step, stop that step and report the blocker.

Keep API keys in `.env` or environment variables. Never hardcode keys in scripts, draft metadata, or final files.

## Workflow

1. **Understand the request**
   - Extract target audience, duration, aspect ratio, language, required scenes, voice style, subtitle style, privacy constraints, and output names.
   - If the user provides a fixed storyboard, preserve its structure unless a technical constraint requires adjustment.

2. **Collect or create assets**
   - Prefer real project screenshots/recordings from the workspace.
   - If assets are missing, create safe placeholder demo assets without interrupting the task.
   - Redact or replace real names, emails, phone numbers, tokens, API keys, database URLs, private paths, internal company data, and other sensitive text.

3. **Run MiMo understanding before editing**
   - Send source recordings or compressed analysis clips to MiMo.
   - Produce a short understanding report before creating the draft:
     - recognized pages/modules
     - useful time ranges
     - UI areas to zoom/highlight
     - privacy risks to remove
     - invalid ranges to skip
     - recommended pacing
   - Base shot selection and zoom/highlight decisions on MiMo output, not guesses.

4. **Edit the first cut**
   - Use JianYing automation or deterministic FFmpeg/Python helpers as appropriate, then import the final asset into a JianYing draft when needed.
   - Build 16:9 1080p unless the user asks otherwise.
   - Add Chinese captions at the bottom and keep them off critical UI.
   - Use MiMo TTS narration at natural speed. Prefer adjusting scene duration to voice length over applying tempo filters to speech.
   - Use clean transitions: fade, push, or subtle zoom. Avoid decorative overlays that do not track the footage.
   - Use highlight boxes only when their position is tied to the shown UI region and time range. Remove stale/static boxes that do not match changing footage.
   - For recorder popups or browser chrome, prefer crop, delogo, or a background-matched cleanup patch. Avoid unexplained black masks.

5. **Export and validate**
   - Export the MP4 with the requested filename.
   - Verify duration, resolution, aspect ratio, audio presence, and video readability with `ffprobe` and sampled frames.
   - Verify the JianYing draft opens or at least exists at the expected draft location.

6. **Run MiMo review on the rendered video**
   - Send the exported MP4 to MiMo.
   - Ask for concrete issues with timestamps: missing modules, unreadable UI, bad masks, subtitle mismatch, privacy leaks, pacing, and voice problems.
   - Save MiMo raw output and extracted JSON when possible.

7. **Revise targeted issues**
   - Fix only the issues that materially affect comprehension or quality.
   - Re-export and re-check the affected timestamps.
   - Repeat MiMo review when the change affects video understanding, audio/subtitle sync, or privacy.

8. **Deliver**
   - Provide the final MP4 path, JianYing draft path, duration/resolution verification, and any remaining known limitations.

## Practical rules learned from this workflow

- Use fonts that support Chinese, such as Microsoft YaHei or Noto Sans SC.
- Force sample aspect ratio to `1:1` on generated/rendered video to avoid stretched text.
- Do not use `atempo` or other speech time-stretching for TTS unless explicitly requested; pad or trim silence instead.
- Treat screen recorder overlays as source defects. Remove them cleanly; do not cover them with unexplained black rectangles.
- Keep subtitle backgrounds intentional and consistent. If a dark rectangle has no label or purpose, remove it.
- If a draft write fails because JianYing or AppData is locked, keep the exported MP4 and retry draft creation with appropriate permission after confirming the MP4 is correct.

## Detailed checklist

Read `references/implementation-checklist.md` when actually running the workflow or writing helper scripts.
