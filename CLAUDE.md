# video-creator

This repo is not a product — it's Claude's toolkit for producing professional
short-form (TikTok/Reels/Shorts) and long-form (YouTube) videos on request,
run entirely through Claude Code sessions (usually claude.ai/code web). The
producer opens a session and says something like "OO 같은 비디오 만들어줘"
(reference a link, a description, or attached files); Claude does the rest.

**Start here:** when a request looks like "make a video like X", read and
follow `.claude/skills/make-video/SKILL.md`. It is the authoritative
end-to-end workflow (clarify → analyze reference → script → assets → render →
iterate → deliver). This file only covers the architecture the skill relies on.

## Architecture

- **Rendering engine: Remotion** (`src/`) — video is written in React/TypeScript
  and rendered by Chromium, not assembled by hand in a video editor or via raw
  ffmpeg filters. This gives frame-accurate timing, real component reuse, and
  git-diffable video "source code."
- **`src/storyboard.ts`** — the zod schema that is the contract between
  content and rendering. A video is fully described by one JSON file
  (`storyboard.json`) conforming to this schema: metadata (platform, fps,
  dimensions, brand colors) + an ordered list of scenes (voiceover text/audio,
  background, text overlay, captions, label).
- **`src/compositions/ShortForm.tsx` and `LongForm.tsx`** — data-driven
  Remotion compositions. They take a `slug`, read
  `public/content/<slug>/storyboard.json` (via `calculateMetadata`, see
  `src/load-storyboard.ts`), and render whatever scenes are in it using
  `TransitionSeries` for cross-fades. **They must stay generic** — no
  video-specific logic ever belongs here. If a new video needs a new visual
  idea, add a new reusable component to `src/components/` (or a new scene
  `kind`/field to the schema), don't fork the composition.
- **`src/components/`** — reusable building blocks: `KenBurnsMedia` (pan/zoom
  background image or video), `Captions` (proportional-timing subtitles),
  `TitleCard` (heading/body overlay), `LowerThird` (speaker/chapter label,
  long-form), `ProgressBar` (top progress bar, shorts), `SceneAudio` /
  `BackgroundMusic`.
- **`public/content/<slug>/`** — one directory per video: `brief.md`
  (reference + goal + style notes), `script.md` (narration draft),
  `storyboard.json` (the render contract), `assets/{images,video,voiceover,music}/`.
  Remotion serves everything under `public/` via `staticFile()`, so assets
  must live under this directory to be renderable.
- **`scripts/new-video.mjs`** — scaffolds a new `public/content/<slug>/` with
  template files. Run via `npm run new-video -- <slug> <shorts|longform> "Title"`.

## Commands

- `npm run studio` — open Remotion Studio to preview a composition live.
- `npm run render:shorts` / `npm run render:longform` — render
  `ShortForm`/`LongForm` for whatever slug is set as `defaultProps` in
  `src/Root.tsx`, or override with `npx remotion render ShortForm out/x.mp4 --props='{"slug":"..."}'`.
- `npm run typecheck` — `tsc --noEmit`.

## Sandbox notes

- Outbound network is restricted; Remotion's own Chrome-headless-shell
  download is blocked. `remotion.config.ts` auto-detects the
  Playwright-provisioned headless-shell already on disk
  (`/opt/pw-browsers/chromium_headless_shell-1194/...`) and points Remotion
  at it — no env var needed on this environment. If that path doesn't exist
  (different environment), set `REMOTION_BROWSER_EXECUTABLE` explicitly.
- System `ffmpeg` is not installed and is not required — Remotion 4's own
  compositor stitches and encodes frames without it.

## Asset generation: no API keys configured yet

See `.env.example`. Until keys are added, scenes render with silent audio
(duration estimated from voiceover text length via
`estimateDurationFromText`) and solid-color or manually-provided
image/video backgrounds. When a key becomes available:

- **TTS** (`ELEVENLABS_API_KEY`) → generate `assets/voiceover/scene-N.mp3`,
  set `voiceover.src` in storyboard.json; duration then comes from the real
  audio file instead of the text estimate.
- **Forced alignment** (`OPENAI_API_KEY`, Whisper) → word-level timestamps to
  upgrade `Captions` from proportional-timing subtitles to karaoke-style
  highlighting.
- **Images/stock** (`STABILITY_API_KEY`/`REPLICATE_API_TOKEN`,
  `PEXELS_API_KEY`, ...) → real backgrounds instead of solid colors.

Don't build speculative integrations for services that aren't configured —
wire each one in only once its key is actually set, and keep the
placeholder path working either way.

## Conventions

- Everything about *one specific video* (script, storyboard, assets) lives
  under `public/content/<slug>/` — never invent a second place to put it.
- Everything about *how videos are made in general* (components,
  compositions, schema, skill workflow) lives under `src/` and
  `.claude/` — it should never reference a specific slug or project.
