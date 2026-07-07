#!/usr/bin/env node
// Scaffolds public/trips/<slug>/ for a new trip: the pre-trip capture files
// (trip brief, research log, content calendar), the during-trip logging
// convention (daily logs, footage log), and a footage staging folder.
// Usage: npm run new-trip -- <slug> "Trip Title"

import {existsSync, mkdirSync, writeFileSync} from 'node:fs';
import path from 'node:path';

const [, , slugArg, ...titleParts] = process.argv;

if (!slugArg) {
	console.error('Usage: npm run new-trip -- <slug> "Trip Title"');
	process.exit(1);
}

const slug = slugArg;
const title = titleParts.join(' ') || slug;

const root = path.join('public', 'trips', slug);
if (existsSync(root)) {
	console.error(`trips/${slug} already exists.`);
	process.exit(1);
}

mkdirSync(path.join(root, 'daily-logs'), {recursive: true});
mkdirSync(path.join(root, 'assets', 'footage'), {recursive: true});
mkdirSync(path.join(root, 'assets', 'voice-memos'), {recursive: true});

writeFileSync(
	path.join(root, 'trip-brief.md'),
	`# ${title} — Trip Brief\n\n` +
		`- Trip slug: ${slug}\n` +
		`- Dates: (start) – (end)\n` +
		`- Destinations: (route, in order)\n\n` +
		`## Key decisions\n` +
		`(what you decided and *why* — this becomes the backbone of the\n` +
		`narration/script later; capture the reasoning while it's fresh,\n` +
		`not reconstructed after the fact)\n\n` +
		`- Decision: ...\n` +
		`  Why: ...\n` +
		`  Backup options considered: ...\n\n` +
		`## Budget\n(rough total, per-category breakdown if useful)\n\n` +
		`## Logistics notes\n(routes, timing, visas, bookings — anything a\n` +
		`future script needs to get right)\n`,
);

writeFileSync(
	path.join(root, 'research-log.md'),
	`# ${title} — Research Log\n\n` +
		`Capture destination research *as you do it* — routes, timing,\n` +
		`logistics, budget comparisons, options rejected and why. This is\n` +
		`content in itself (a "how we planned this" video draws directly from\n` +
		`this log), so add entries while researching, not after the trip.\n\n` +
		`## ${new Date().toISOString().slice(0, 10)}\n\n` +
		`- Researched: ...\n` +
		`- Considered: ...\n` +
		`- Decided: ... (why)\n`,
);

writeFileSync(
	path.join(root, 'content-calendar.md'),
	`# ${title} — Content Calendar\n\n` +
		`Which piece of this trip maps to which video. Add a row per planned\n` +
		`video; fill in the slug once it's scaffolded with \`npm run new-video\`\n` +
		`and update status as it moves through the pipeline.\n\n` +
		`| Video | Slug | Platform | Source material | Status |\n` +
		`|---|---|---|---|---|\n` +
		`| How we planned this | (tbd) | longform | trip-brief.md + research-log.md | idea |\n` +
		`| Day 1 vlog | (tbd) | shorts/longform | daily-logs/day-01.md + footage | idea |\n\n` +
		`## Series continuity notes\n` +
		`(cross-references between videos in this trip's series — e.g. the\n` +
		`planning video teases the trip video, a day-3 vlog callbacks a\n` +
		`decision made in the planning video — so the channel voice and any\n` +
		`payoffs stay consistent across the set)\n`,
);

writeFileSync(
	path.join(root, 'footage-log.md'),
	`# ${title} — Footage Log\n\n` +
		`## Naming convention\n` +
		`Use this for every clip so editing doesn't start with a pile of\n` +
		`unsorted footage. Suggested pattern:\n\n` +
		`\`day<NN>-<location-slug>-<shot-desc>-<take>.<ext>\`\n` +
		`e.g. \`day03-kalemegdan-sunset-wide-01.mp4\`\n\n` +
		`Tag voice memos the same way:\n` +
		`\`day<NN>-<topic-slug>-memo.<ext>\`\n` +
		`e.g. \`day03-bus-mixup-memo.m4a\`\n\n` +
		`## Log\n` +
		`One line per clip/memo as you shoot it — what it is, why you shot\n` +
		`it, whether it's a highlight candidate. Future-you editing footage\n` +
		`will not remember why a random restaurant made the cut.\n\n` +
		`| File | Day | What / why | Highlight? |\n` +
		`|---|---|---|---|\n` +
		`| day01-arrival-bus-missed.mp4 | 1 | missed the bus, sets the tone | yes |\n`,
);

writeFileSync(
	path.join(root, 'daily-logs', 'day-01.md'),
	`# Day 1 — ${title}\n\n` +
		`Voice memo / text log, as close to real-time as practical. Capture:\n` +
		`what worked, what didn't, funny moments, decision points and why —\n` +
		`the "why" is what you'll lose first if you wait until editing.\n\n` +
		`- ...\n`,
);

console.log(`Created public/trips/${slug}/`);
console.log(`  - trip-brief.md       (destinations, dates, key decisions + why)`);
console.log(`  - research-log.md     (capture research as you do it)`);
console.log(`  - content-calendar.md (trip -> video(s) mapping + series continuity)`);
console.log(`  - footage-log.md      (naming convention + shot log)`);
console.log(`  - daily-logs/day-01.md (copy per day)`);
console.log(`  - assets/footage/, assets/voice-memos/ (raw capture staging)`);
console.log(`\nEach planned video still gets its own public/content/<slug>/ via`);
console.log(`\`npm run new-video\` — link it from content-calendar.md.`);
