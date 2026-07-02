# Implementation Checklist

## Inputs to collect

- User requirements: duration, aspect ratio, language, style, output filename, draft name.
- Source assets: recordings, screenshots, app URL, product name, brand text, desired narration.
- MiMo config: `MIMO_API_KEY`, base URL, model (`mimo-v2.5` or `mimo-v2-omni`), fps, media resolution.
- JianYing config: draft root, project name, export path.

## MiMo pre-edit prompt shape

Ask MiMo to output JSON with:

```json
{
  "pages": [{"module": "...", "status": "found|missing|unclear", "time": "MM:SS-MM:SS", "evidence": "..."}],
  "segments": [{"time": "MM:SS-MM:SS", "purpose": "...", "reason": "..."}],
  "zoom_regions": [{"time": "MM:SS-MM:SS", "target": "...", "region_hint": "top-left|top|top-right|left|center|right|bottom-left|bottom|bottom-right|full", "label": "..."}],
  "privacy": [{"time": "MM:SS-MM:SS", "risk": "...", "action": "blur|replace|none|unclear"}],
  "skip": [{"time": "MM:SS-MM:SS", "reason": "..."}],
  "rhythm": ["..."]
}
```

## MiMo final-review prompt shape

Ask MiMo to inspect the rendered MP4 and output JSON with:

```json
{
  "overall_score": 0,
  "summary": "...",
  "issues": [{"time": "MM:SS-MM:SS", "severity": "high|medium|low", "problem": "...", "fix": "..."}],
  "missing_or_weak_modules": [{"module": "...", "status": "missing|weak|ok", "fix": "..."}],
  "privacy_risks": [{"time": "MM:SS-MM:SS", "risk": "...", "fix": "..."}],
  "edit_plan": [{"priority": 1, "change": "...", "expected_effect": "..."}]
}
```

Some MiMo responses may place useful JSON in `reasoning_content` instead of `content`; inspect the full response before declaring the review failed.

## Editing checklist

- Use real recordings first; create placeholder scenes only for missing modules.
- Crop browser chrome and taskbars when possible.
- Add zooms only for stable UI regions and time ranges identified by MiMo.
- Prefer title cards and bottom subtitles over floating boxes that pretend to track UI.
- For privacy cleanup, use blur/delogo/background-matched patches instead of opaque unexplained masks.
- Keep Chinese subtitles legible and no more than two lines.
- Use MiMo TTS at natural speed; align scene durations to voice clips.
- Keep BGM low enough to avoid fighting narration.

## Validation checklist

Run or equivalent-check:

- `ffprobe` duration between requested limits.
- `ffprobe` width/height and sample/display aspect ratio.
- Sample frames at key timestamps for text rendering, overlays, subtitle placement, and privacy cleanup.
- Listen to several narration transitions for stutter or unnatural tempo changes.
- Confirm final MP4 exists at requested path.
- Confirm JianYing draft exists or report the draft path/blocker.
