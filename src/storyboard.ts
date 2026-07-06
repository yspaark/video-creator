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

export const wordTimestampSchema = z.object({
	word: z.string(),
	startSeconds: z.number(),
	endSeconds: z.number(),
});

export const voiceoverSchema = z.object({
	text: z.string(),
	// Path relative to public/, e.g. content/my-video/assets/voiceover/scene-1.mp3
	// Omit until TTS audio has been generated — duration then falls back to
	// a words-per-minute estimate from `text`.
	src: z.string().optional(),
	// Per-word timing from a forced-alignment step (e.g. Whisper). Omit until
	// that's wired up — Captions then falls back to a character-length-
	// weighted estimate across the scene's duration.
	wordTimestamps: z.array(wordTimestampSchema).optional(),
});

export const textOverlaySchema = z.object({
	heading: z.string().optional(),
	body: z.string().optional(),
	position: z
		.enum(['top', 'center', 'bottom'])
		.default('bottom'),
});

export const statSchema = z.object({
	value: z.string(), // e.g. "87"
	prefix: z.string().optional(), // e.g. "$"
	suffix: z.string().optional(), // e.g. "%", "+"
	label: z.string().optional(), // e.g. "faster render time"
});

export const quoteSchema = z.object({
	text: z.string(),
	attribution: z.string().optional(),
});

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
	// Words to always render emphasized in captions, regardless of timing.
	emphasize: z.array(z.string()).optional(),
	// Big animated number/stat, e.g. for "87% faster" beats. Can accompany
	// any scene kind — it layers on top of the kind's own overlay.
	stat: statSchema.optional(),
	// Staggered checklist/bullet reveal — used when kind is 'list'.
	listItems: z.array(z.string()).min(1).optional(),
	// Styled block quote with attribution — used when kind is 'quote'.
	quote: quoteSchema.optional(),
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
