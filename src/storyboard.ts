import {z} from 'zod';

// A storyboard is the single source of truth for one video. It is written
// (by hand or by Claude) to `public/content/<slug>/storyboard.json` and
// drives the Remotion composition — no video-specific React code needed.

export const brandSchema = z.object({
	primaryColor: z.string().default('#111827'),
	secondaryColor: z.string().default('#F9FAFB'),
	accentColor: z.string().default('#6366F1'),
	fontFamily: z.string().default('Inter'),
});

export const backgroundSchema = z.discriminatedUnion('type', [
	z.object({type: z.literal('color'), value: z.string()}),
	z.object({
		type: z.literal('image'),
		src: z.string(), // path relative to public/, e.g. content/my-video/assets/bg1.jpg
		kenBurns: z.enum(['in', 'out', 'left', 'right', 'none']).default('in'),
	}),
	z.object({
		type: z.literal('video'),
		src: z.string(),
		muted: z.boolean().default(true),
	}),
]);

export const voiceoverSchema = z.object({
	text: z.string(),
	// Path relative to public/, e.g. content/my-video/assets/voiceover/scene-1.mp3
	// Omit until TTS audio has been generated — duration then falls back to
	// a words-per-minute estimate from `text`.
	src: z.string().optional(),
});

export const textOverlaySchema = z.object({
	heading: z.string().optional(),
	body: z.string().optional(),
	position: z
		.enum(['top', 'center', 'bottom'])
		.default('bottom'),
});

// A small, generic per-topic iconography vocabulary — covers common
// travel/explainer beats (a bus for a transit scene, a fork for a meal, a
// landmark glyph for a monument, ...) without being tied to any one video's
// subject matter. Optional: not every scene (e.g. a multi-topic overview)
// needs one. See SceneMotif.tsx for how this renders.
export const sceneMotifSchema = z.enum([
	'transit',
	'food',
	'landmark',
	'money',
	'lodging',
	'nature',
	'reflection',
]);

export const sceneSchema = z.object({
	id: z.string(),
	kind: z.enum(['hook', 'point', 'list', 'quote', 'cta', 'custom']).default('point'),
	// Explicit duration overrides voiceover-derived duration when set.
	durationInSeconds: z.number().positive().optional(),
	voiceover: voiceoverSchema.optional(),
	background: backgroundSchema,
	textOverlay: textOverlaySchema.optional(),
	// Lower-third label (speaker name, chapter title) — long-form only.
	label: z.string().optional(),
	captions: z.enum(['subtitle', 'none']).default('subtitle'),
	// Optional per-scene visual motif (see sceneMotifSchema above).
	motif: sceneMotifSchema.optional(),
});

export const storyboardSchema = z.object({
	meta: z.object({
		title: z.string(),
		slug: z.string(),
		platform: z.enum(['shorts', 'longform']),
		fps: z.number().int().positive().default(30),
		width: z.number().int().positive(),
		height: z.number().int().positive(),
		brand: brandSchema.default({
			primaryColor: '#111827',
			secondaryColor: '#F9FAFB',
			accentColor: '#6366F1',
			fontFamily: 'Inter',
		}),
		music: z
			.object({
				src: z.string(), // path relative to public/
				volume: z.number().min(0).max(1).default(0.15),
			})
			.optional(),
	}),
	scenes: z.array(sceneSchema).min(1),
});

export type Storyboard = z.infer<typeof storyboardSchema>;
export type Scene = z.infer<typeof sceneSchema>;
export type Background = z.infer<typeof backgroundSchema>;

const WORDS_PER_MINUTE = 150;

export const estimateDurationFromText = (text: string): number => {
	const words = text.trim().split(/\s+/).filter(Boolean).length;
	const seconds = (words / WORDS_PER_MINUTE) * 60;
	return Math.max(seconds, 1.5);
};
