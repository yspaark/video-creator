---
name: make-video
description: Use when the producer asks to create a video — "OO 같은 비디오 만들어줘", "make a short like this", "이 유튜브 영상 스타일로 만들어줘", "turn this into an explainer". Orchestrates the full pipeline on top of the Remotion setup in this repo — clarify, analyze reference, script, storyboard, assets, render, iterate, deliver.
---

# make-video

You are producing a video for someone who will not touch code or a video
editor — they describe what they want, you deliver a finished `.mp4`. Read
`CLAUDE.md` first if you haven't already; it explains the architecture
(`src/storyboard.ts` schema, `src/compositions/`, `public/content/<slug>/`).
This skill is the workflow on top of that architecture.

## 0. Understand the request

Figure out, from the request plus whatever reference material was given
(link / text description / local files):

- **Platform**: shorts (TikTok/Reels/Shorts, 9:16) or long-form (YouTube,
  16:9)? Usually obvious from the reference or the ask. Ask only if it
  genuinely changes the deliverable and isn't inferable.
- **Reference**: a URL, a text description of vibe/tone, and/or attached
  files. Note what you actually have — the next step depends on it.
- **Goal**: what the video is for and what the viewer should feel/do after.
  If this isn't stated, a reasonable default is fine; don't interrogate the
  producer over things that don't change the outcome.

Don't over-ask. One round of clarifying questions at most, only for things
that would make you build the wrong thing.

## 1. Analyze the reference

Delegate to the `reference-analyst` agent with whatever reference material
you have (link, description, file paths). It returns a structured style
breakdown (pacing, structure, hook pattern, visual style, tone, captions,
music) — it does not write files, you use its report in the next step.

Skip this step only if there's no real reference to analyze (e.g. the
producer just described a generic idea from scratch) — in that case, apply
sensible defaults for the chosen platform.

## 2. Scaffold the project

```
npm run new-video -- <slug> <shorts|longform> "Working Title"
```

Pick `<slug>` yourself (kebab-case, short, descriptive). This creates
`public/content/<slug>/{brief.md, script.md, storyboard.json, assets/}`.
Fill in `brief.md` with the reference summary and the reference-analyst's
style notes — this is the record of *why* the video looks the way it does,
useful if you or the producer come back to iterate later.

## 3. Write the script

Delegate to the `script-writer` agent with the producer's baseline story and
key points, the slug/platform, and whatever the reference-analyst returned
(or a note that there was no reference). It returns a draft — narration
scene-by-scene matching the reference's or channel's established
structure/pacing/tone, plus per-scene `kind`/`label`/`motif` suggestions to
make the next step close to mechanical — but does not write any file
itself. Show the draft to the producer and resolve any flagged open
questions/`[VERIFY]` items before saving it to `script.md` and moving on.

## 4. Encode the storyboard

Translate the script into `storyboard.json`, conforming to
`src/storyboard.ts`'s schema. For each scene decide:

- `voiceover.text` (always) and `voiceover.src` (only if you've generated
  actual TTS audio — see step 5).
- `background`: use provided local images/video if the producer attached
  any (copy them into `assets/images/` or `assets/video/` and reference with
  a `content/<slug>/assets/...` path); otherwise a solid brand color is a
  fine placeholder — don't block on missing visuals.
- `textOverlay` / `label` / `captions` as appropriate to the scene's `kind`.

**Do not fork `ShortForm.tsx`/`LongForm.tsx` or hardcode this video's
content into a component.** If the reference calls for a visual idea the
current schema/components can't express (e.g. a split-screen, a chart, a
specific transition), extend `src/storyboard.ts` and add a small reusable
component in `src/components/` — generalize it, since the next video will
likely want it too. Then use it via the schema like any other field.

## 5. Assets: use what's available, don't block on what isn't

Check `.env` (see `.env.example`) for configured keys:

- **No keys configured**: proceed with silent voiceover (duration estimated
  from text) and solid-color/provided-image backgrounds. Tell the producer
  what's missing and that quality will improve once keys are added — don't
  silently ship something that looks like a placeholder without saying so.
- **TTS key present**: generate real voiceover audio per scene, save to
  `assets/voiceover/<scene-id>.mp3`, set `voiceover.src`. Duration then comes
  from the actual audio file automatically (`computeSceneTimings`).
- **Image/stock keys present**: generate or fetch real backgrounds into
  `assets/images/` or `assets/video/` instead of solid colors.

Never invent a fake API call or stub data for a service that isn't
configured — the honest placeholder path (color backgrounds, text-based
timing) is the intended fallback, not a bug to hide.

## 6. Render a preview

```
npx remotion render <ShortForm|LongForm> out/<slug>-preview.mp4 --props='{"slug":"<slug>"}'
```

Send it to the producer (`SendUserFile`) and describe what you built and
what's still a placeholder. Iterate on `script.md`/`storyboard.json`/assets
based on feedback — re-render is cheap, don't be precious about the first
cut.

## 7. Final render and delivery

Once approved, render the final output and deliver it with `SendUserFile`.
Mention the slug/output path so the producer can ask for tweaks later
without you having to rediscover which project it was.

## Notes

- `out/` is gitignored — renders are ephemeral, the storyboard/script/assets
  under `public/content/<slug>/` are the durable source of truth.
- If asked to make "another one like the last video," reuse its
  `brief.md`/style notes rather than re-analyzing the reference from
  scratch, unless the ask has clearly changed.
