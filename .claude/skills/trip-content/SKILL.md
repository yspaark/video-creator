---
name: trip-content
description: Use when the producer is planning, taking, or has just returned from a trip and wants to turn it into video content — "우리 세르비아 여행 콘텐츠로 만들자", "help me plan content for this trip", "we just got back, let's turn the footage into videos". Runs the full pre-trip/during-trip/post-trip/publishing lifecycle for a trip that may produce multiple videos, calling into make-video for each individual video's render pipeline.
---

# trip-content

A trip is a *content lifecycle*, not a single video. One trip typically
produces several videos (a planning video, day-by-day vlogs, a recap) that
should read as a series and share a paper trail. This skill owns that
lifecycle; `make-video` (`.claude/skills/make-video/SKILL.md`) still owns
turning one script into one rendered `.mp4` — this skill calls into it once
per planned video.

Trip-level material lives in `public/trips/<trip-slug>/`, scaffolded with
`npm run new-trip -- <slug> "Trip Title"`. This is separate from
`public/content/<slug>/`, which stays one-directory-per-*video* as always —
a trip's `content-calendar.md` is what links the two.

## Phase 1 — Pre-trip (the differentiator; don't skip this)

This phase is what makes the content different from generic travel vlogs,
so capture it as it happens, not reconstructed afterward.

1. **Scaffold the trip**: `npm run new-trip -- <slug> "Trip Title"` if it
   doesn't exist yet.
2. **Capture research as you do it**: while doing destination research
   (routes, timing, logistics, budget comparisons) with the producer, add
   entries to `research-log.md` in the same session — don't wait until
   research is "done" to write it up. This log is itself a candidate for a
   "how we planned this" video later.
3. **Turn planning notes into `trip-brief.md`**: destinations, dates, and
   — most importantly — key decisions *and why you made them*, plus backup
   options that were considered and rejected. The "why" is the backbone of
   narration later; a decision without its reasoning is dead weight in a
   script.
4. **Decide the content calendar**: with the producer, work out which parts
   of this trip become which video(s) — a single "how we planned this"
   video, a day-by-day vlog series, or both — and record it in
   `content-calendar.md` along with each video's intended source material
   and status. Don't scaffold the actual `public/content/<slug>/` projects
   yet unless the producer wants to start writing one now; the calendar can
   name a video before it's scaffolded.

## Phase 2 — During the trip

Claude is typically not directly in the loop turn-by-turn during the trip
itself, but set the producer up to make post-trip editing tractable:

- **Daily logs**: one `daily-logs/day-NN.md` per day (copy `day-01.md`'s
  template). Capture voice memos or text logs of what worked, what didn't,
  funny moments, and decision points — the "why" behind an in-trip decision
  (like why they picked a particular restaurant) is the first thing
  future-you forgets when editing.
- **Footage naming/tagging**: `footage-log.md` defines the convention
  (`day<NN>-<location>-<shot-desc>-<take>.<ext>` for clips,
  `day<NN>-<topic>-memo.<ext>` for voice memos) and a running log of what
  was shot and why, with a highlight-candidate flag. Remind the producer to
  follow it as they shoot/log, not batch-rename everything at the end.
- If the producer sends logs/memos/footage mid-trip, file them under
  `assets/footage/` or `assets/voice-memos/` and append to `footage-log.md`
  and the relevant `daily-logs/day-NN.md` right away.

## Phase 3 — Post-trip / editing

Run this once per video in `content-calendar.md`:

1. **Transcripts**: if the producer has voice-memo/footage transcripts
   already (e.g. from their phone's transcription, Otter, or similar),
   file them alongside the relevant `daily-logs/day-NN.md` entry or as
   their own file under the trip folder. This repo has no speech-to-text
   integration wired up yet (no ASR key in `.env.example`) — don't fake
   one. If the producer only has raw audio/video and no transcript, ask
   them for a transcript or a text summary rather than inventing content
   from a file you can't actually transcribe.
2. **First-draft script**: scaffold the video with `npm run new-video` if
   not already done, then delegate to the `script-writer` agent, giving it
   the trip's `trip-brief.md`, the relevant `daily-logs/*.md`/transcripts,
   and `footage-log.md`'s highlight flags — plus `content-calendar.md` so
   it knows which beats belong to *this* video vs a sibling video in the
   series. It returns a draft narration; review with the producer before
   saving to `script.md`.
3. **Continue the make-video pipeline** from its storyboard-encoding step
   onward (`.claude/skills/make-video/SKILL.md`, steps 4-6): encode
   `storyboard.json`, wire up whatever assets are available (real footage
   goes in `assets/video/`/`assets/images/` copied over from the trip's
   `assets/footage/`), and render a preview.
4. **Highlight selection**: when placing background media for scenes, use
   `footage-log.md`'s highlight flags and `daily-logs` notes to choose
   which actual clips earn a spot, instead of defaulting to the first clip
   chronologically.

## Phase 4 — Publishing

1. **Metadata**: once a video's `script.md`/`storyboard.json` is settled
   (rendered or not), delegate to the `metadata-writer` agent with the
   script/storyboard, the video's `brief.md`, and the trip's
   `trip-brief.md`/`content-calendar.md` for series context. It returns
   title options, description, tags, chapters, and thumbnail concepts —
   review with the producer.
2. **Scheduling/consistency tracking**: update `content-calendar.md`'s
   status column as each video moves through drafted → scripted →
   rendered → published, and record the actual publish date once known —
   this is the source of truth for "what's left in this trip's series."
3. **Series cross-referencing**: check that sibling videos' metadata stay
   consistent (the planning video's description links the trip video and
   vice versa; recurring naming patterns match) — `metadata-writer` flags
   inconsistencies it notices, but do a final pass yourself using
   `content-calendar.md`'s series continuity notes before calling a video
   done.

## Notes

- Don't build this out as one monolithic mega-video by default — ask the
  producer's intent in Phase 1 (calendar) once, then follow it; don't
  re-litigate the format per video.
- If the producer jumps straight to "here's our footage, make the videos"
  without ever using Phase 1, that's fine — scaffold the trip retroactively
  (`trip-brief.md`/`research-log.md` can be filled in from memory/notes
  after the fact), but say so, since the pre-trip "why" material will be
  thinner than if it had been captured live.
- A trip's videos are still full `make-video` citizens — everything in that
  skill's iterate/deliver/render notes applies unchanged per video.
