import type {CSSProperties} from 'react';
import {withAlpha} from './color-utils';

// A consistent frosted-glass card treatment — used behind captions, stat
// callouts, list items, and quote cards so every text overlay reads as one
// designed system (a "premium caption app" look) instead of each component
// inventing its own translucent-black box.
export const glassPanelStyle = (
	accentColor: string,
	opts?: {radius?: number; padding?: string},
): CSSProperties => ({
	// A dark "smoked glass" tint (with just a hint of accent-color sheen in
	// one corner) rather than a light frosted-white one — it needs to
	// darken whatever's behind it for legible white text no matter how
	// bright or saturated the scene background is, which a light overlay
	// can't guarantee.
	background: [
		`linear-gradient(160deg, ${withAlpha(accentColor, 0.16)} 0%,`,
		'rgba(10,10,16,0.6) 45%, rgba(4,4,8,0.72) 100%)',
	].join(' '),
	backdropFilter: 'blur(18px)',
	WebkitBackdropFilter: 'blur(18px)',
	border: '1px solid rgba(255,255,255,0.14)',
	borderRadius: opts?.radius ?? 18,
	padding: opts?.padding,
	boxShadow: [
		'0 12px 34px rgba(0,0,0,0.4)',
		`0 0 46px ${withAlpha(accentColor, 0.2)}`,
		'inset 0 1px 0 rgba(255,255,255,0.12)',
	].join(', '),
});
