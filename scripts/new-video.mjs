#!/usr/bin/env node
// Scaffolds public/content/<slug>/ for a new video: a brief, an empty
// storyboard.json matching src/storyboard.ts's schema, and asset folders.
// Usage: npm run new-video -- <slug> <shorts|longform> "Working Title"

import {existsSync, mkdirSync, writeFileSync} from 'node:fs';
import path from 'node:path';

const [, , slugArg, platformArg, ...titleParts] = process.argv;

if (!slugArg || !['shorts', 'longform'].includes(platformArg)) {
	console.error('Usage: npm run new-video -- <slug> <shorts|longform> "Working Title"');
	process.exit(1);
}

const slug = slugArg;
const platform = platformArg;
const title = titleParts.join(' ') || slug;
const isShorts = platform === 'shorts';

const root = path.join('public', 'content', slug);
if (existsSync(root)) {
	console.error(`content/${slug} already exists.`);
	process.exit(1);
}

mkdirSync(path.join(root, 'assets', 'images'), {recursive: true});
mkdirSync(path.join(root, 'assets', 'video'), {recursive: true});
mkdirSync(path.join(root, 'assets', 'voiceover'), {recursive: true});
mkdirSync(path.join(root, 'assets', 'music'), {recursive: true});

const storyboard = {
	meta: {
		title,
		slug,
		platform,
		fps: 30,
		width: isShorts ? 1080 : 1920,
		height: isShorts ? 1920 : 1080,
		brand: {
			primaryColor: '#111827',
			secondaryColor: '#F9FAFB',
			accentColor: '#6366F1',
			fontFamily: 'Inter',
		},
	},
	scenes: [
		{
			id: 'scene-1-hook',
			kind: 'hook',
			voiceover: {text: 'REPLACE ME: the opening line that hooks the viewer.'},
			background: {type: 'color', value: '#111827'},
			textOverlay: {heading: 'REPLACE ME', position: 'center'},
			captions: 'subtitle',
		},
	],
};

writeFileSync(path.join(root, 'storyboard.json'), JSON.stringify(storyboard, null, '\t') + '\n');

writeFileSync(
	path.join(root, 'brief.md'),
	`# ${title}\n\n` +
		`- Slug: ${slug}\n` +
		`- Platform: ${platform}\n\n` +
		`## Reference\n(link / description / attached files)\n\n` +
		`## Goal\n(what should the viewer feel / do after watching)\n\n` +
		`## Style notes\n(pacing, tone, visual style, music style — from reference analysis)\n`,
);

writeFileSync(
	path.join(root, 'script.md'),
	`# ${title} — Script\n\n` +
		`Scene-by-scene narration and visual notes go here before being encoded into storyboard.json.\n`,
);

console.log(`Created public/content/${slug}/`);
console.log(`  - brief.md        (fill in reference + goal)`);
console.log(`  - script.md       (write the narration scene by scene)`);
console.log(`  - storyboard.json (encode scenes for Remotion)`);
console.log(`  - assets/         (images, video, voiceover, music)`);
console.log(`\nPreview: npm run studio  (select ${isShorts ? 'ShortForm' : 'LongForm'}, set slug="${slug}")`);
