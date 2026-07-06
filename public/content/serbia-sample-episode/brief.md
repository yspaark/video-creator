# Serbia, Self-Planned

- Slug: serbia-sample-episode
- Platform: longform

## Reference

No single reference video — this is the pilot/sample episode for a new
channel, built from a competitive-landscape analysis rather than one
reference to imitate. Premise: a Korean couple in their 50s doing
self-planned (not package-tour), backpacking-esque overseas travel.

Landscape finding: every existing Korean couple-travel channel skews
20s-30s (유랑쓰, 용숙부부, 부부여유들). The channels that get the calm,
competence-driven 50s tone right (아재여행, 캡틴따거) are solo. The one
real married-50s-couple story found (EBS's camper-van retirees segment)
is a one-off broadcast clip, not an ongoing channel. Nobody currently
owns "married + 50s+ + self-planned + international + ongoing series."
International equivalents exist (Retirement Travelers, OlderBackpacker)
but nothing in Korean.

### Competitor voice/narration breakdown

What each cluster actually sounds like, not just who they are — this is
what the "Voice" style note below is reacting against/toward.

**20s-30s Korean couple channels (유랑쓰, 용숙부부, 부부여유 cluster)** —
voice is built around the couple's personalities, not the itinerary:
- 유랑쓰: FIRE-movement framing (재산을 주식에 넣고 세계 여행), slow
  "한 달 살기" everyday-life vlogging. Personal-life disclosure — money,
  relationship struggles, life decisions — *is* the content, travel is
  the backdrop. (Channel ended amid personal controversy, which is itself
  a data point on how exposed that format runs.)
- 용숙부부: comedic double-act, one partner carries the comic timing,
  heavily sponsored segments. The couple's banter *is* the product;
  logistics are a footnote.
- Broader cluster: watched and ranked by audiences on-camera personality/
  chemistry (see travel-YouTuber community discussion threads), not
  information density. Reaction-caption-heavy editing reinforces this —
  the caption is a punchline, not a fact.
- **Take nothing tonally from this cluster** except that couple banter
  itself is a proven watchable format — just not built on disclosure or
  comedy-bit structure.

**Calm/competent solo channels (아재여행, 캡틴따거)** — the closest
tonal match, but neither is a couple format:
- 아재여행: almost no personal-life disclosure, stays on the travel
  itself, understated and consistently positive, rarely shows
  frustration even when things go wrong. Self-edited but polished. Voice
  reads as "quietly capable," not "instructive."
- 캡틴따거: goes deep on local history/politics/language for each
  place — real substance, not surface-level trivia — delivered at a
  slower pace than typical travel vlogging, which is why it skews an
  older audience. Risk if copied directly: for a *single* host,
  extended historical exposition works; split across two voices
  bantering, the same length reads as one partner lecturing the other.
- **Take**: low self-disclosure, calm/unhurried delivery, real (not
  invented) factual substance. **Adapt**: compress the historical/
  informational aside to one clean sentence delivered *as dialogue*
  between the two of them, not a monologue either one holds the floor
  for.

**International equivalents (Retirement Travelers, OlderBackpacker)** —
same "older, self-planned" premise, different voice than ours:
- Retirement Travelers (John & Bev): warmth delivered through
  self-deprecating comic banter ("slightly lost, mildly hangry") —
  mishaps are played for laughs.
- OlderBackpacker (Stu): explicitly "no drones, no script, no
  sugar-coating" — raw/unscripted, budget-first, leans toward the
  hardship-vlog aesthetic we're deliberately avoiding.
- **Take**: neither — both convert "things went wrong" into a bit
  (comedy or grit) rather than stating it as a fact and moving on, which
  is exactly the reaction we're avoiding (see Scene 1 of `script.md`:
  the missed bus is stated once, flatly, no sting).

**The actual gap, sharpened**: nobody — Korean or international —
currently does *two voices, calm competence, informational-but-brief,
banter that isn't a comedy bit or a disclosure vehicle*. Every
competitor resolves "how do we make this watchable" with either
personality drama, comedy timing, or grit. Ours resolves it with
competence itself being the hook.

## Goal

Prove the house style works on a real itinerary before committing to a
full series. Viewer should come away thinking "these two clearly planned
this themselves and know what they're doing" — competence and warmth,
not hardship or spectacle. Episode 1: arrival day in Belgrade.

## Style notes

Positioning: "둘이 계획하고, 둘이 떠난다" — two people, no agency, no
rush. Competence over hardship.

- **Visual**: steady handheld, warm neutral grade (sand/ink base + a
  confident navy accent) — not the saturated teal-orange influencer
  look. Practical on-screen info (transit, prices) via `TitleCard`/
  `LowerThird` instead of dense reaction-caption spam.
- **Structure/pacing**: cold open on one concrete practical moment (not
  edited-up hardship), a short "today's plan" recap up front, then
  day/chapter-based scenes.
- **Voice**: calm, competent, warm couple banter; informational asides
  delivered unhurried (closer to 캡틴따거/아재여행 than to 생고생-style
  reaction travel). Concretely, per the competitor breakdown above:
  - The couple's relationship/personal life is texture, never the plot —
    no 유랑쓰-style disclosure of money/relationship struggles as content.
  - No comedic double-act structure (용숙부부) — banter is two people
    thinking out loud together, not one partner setting up the other's
    punchline.
  - A historical/informational aside is one clean sentence, delivered as
    something either of them would actually say to the other — not a
    캡틴따거-length monologue one voice holds the floor for.
  - A mishap (missed bus, wrong turn, etc.) is stated once, flatly, and
    the scene moves on — never milked for comedy (Retirement Travelers)
    or played as hardship/grit (OlderBackpacker).
- **Captions**: sparse, functional — prices, translations, logistics —
  not comedic emphasis.
- **Music**: understated acoustic under reflective/practical beats,
  gentler upbeat cue during transit — never the genre's constant hype
  track. (Not yet sourced — see script notes.)
- **Titles/thumbnails** (for the real upload, not this render): practical
  hook over shock-face, e.g. "짐 하나로 6개월, 계획은 우리가 짰다."

First preview render read as flat placeholder slides, not footage — solid
fills with no depth. Fixed at the component level (`KenBurnsMedia`,
`SceneRenderer`, `TitleCard`, `Captions`, `LowerThird`), not by hacking
this slug: solid-color scenes now get an animated gradient + drifting
warm glow instead of a flat fill, plus a shared film-grain/vignette
color-grade pass, scrimmed title text, and pill/glass-backed captions and
lower-thirds. Applies to every future video using color placeholders,
not just this one. Real location photography is still blocked — no
image API keys configured, and this sandbox's network policy also
denies outbound fetches to image hosts (e.g. Wikimedia Commons) even
though no key would be required — so backgrounds stay generative until
either a stock-image key is added or the producer supplies real footage.
