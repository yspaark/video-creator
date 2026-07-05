import {staticFile} from 'remotion';

// Self-hosted display/kicker/body faces, used in place of Inter-everywhere
// so headings and chapter labels read as an edited video rather than a deck.
//
// We deliberately do NOT use `@remotion/google-fonts`' `loadFont()` here:
// that helper fetches the actual woff2 from fonts.gstatic.com at render
// time, inside the headless-shell Chromium instance. In this sandbox that
// request reaches a transparent TLS-terminating proxy whose CA Chromium
// does not trust, so it fails with ERR_CERT_AUTHORITY_INVALID (confirmed by
// a throwaway test composition) — and the fix for that would be disabling
// certificate verification in Chromium, which we're not allowed to do.
// Instead these three woff2 files were downloaded once (via curl, which
// does go through the trusted proxy CA) into public/fonts/ and are loaded
// here as same-origin static assets — no runtime network access needed.
//
// Coverage note: none of these three families ship Hangul glyphs (Google
// serves Latin/Cyrillic/Vietnamese subsets for them, not Korean), so Korean
// scene text still falls back to the system CJK font. That's fine — these
// fonts affect headings/kickers/numerals/English copy, which is exactly
// the generic-SaaS-deck problem "Inter everywhere at 800 weight" caused.
export const HEADLINE_FONT_FAMILY = 'Fraunces';
export const KICKER_FONT_FAMILY = 'Oswald';
export const BODY_FONT_FAMILY = 'Work Sans';

type FontFaceSpec = {
	family: string;
	weight: string;
	style: string;
	src: string;
};

const FONT_FACES: FontFaceSpec[] = [
	{
		family: HEADLINE_FONT_FAMILY,
		weight: '600',
		style: 'normal',
		src: staticFile('fonts/fraunces/fraunces-600-normal-latin.woff2'),
	},
	{
		family: HEADLINE_FONT_FAMILY,
		weight: '600',
		style: 'italic',
		src: staticFile('fonts/fraunces/fraunces-600-italic-latin.woff2'),
	},
	// Variable-font files: one physical file covers the whole weight axis,
	// the browser picks the instance closest to the FontFace `weight`
	// descriptor used at `document.fonts.add()` time.
	{
		family: KICKER_FONT_FAMILY,
		weight: '200 700',
		style: 'normal',
		src: staticFile('fonts/oswald/oswald-latin-variable.woff2'),
	},
	{
		family: BODY_FONT_FAMILY,
		weight: '100 900',
		style: 'normal',
		src: staticFile('fonts/work-sans/work-sans-latin-variable.woff2'),
	},
];

let fontsPromise: Promise<void> | null = null;

export const ensureDisplayFontsLoaded = (): Promise<void> => {
	if (typeof FontFace === 'undefined') {
		// Non-browser evaluation context (e.g. a Node-only lint/type pass) —
		// nothing to do.
		return Promise.resolve();
	}
	if (!fontsPromise) {
		fontsPromise = Promise.all(
			FONT_FACES.map(async ({family, weight, style, src}) => {
				const face = new FontFace(family, `url(${src}) format('woff2')`, {weight, style});
				await face.load();
				document.fonts.add(face);
			}),
		).then(() => undefined);
	}
	return fontsPromise;
};
