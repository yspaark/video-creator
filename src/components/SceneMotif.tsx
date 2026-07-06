import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Bus, Coins, Hotel, Landmark, Sunset, Trees, Utensils} from 'lucide-react';
import type {Scene} from '../storyboard';

// lucide-react — verified before adding this dependency (per this round's
// requirement to check, not assume): its own LICENSE file
// (github.com/lucide-icons/lucide, fetched via raw.githubusercontent.com
// since npm's registry metadata alone isn't the source of truth) shows the
// project is ISC-licensed as a whole, with the subset of icons it carried
// over from the original Feather Icons project additionally dual-licensed
// MIT. ISC and MIT are both short, permissive, attribution-only licenses
// (no copyleft, no field-of-use restriction) — functionally equivalent for
// our purposes here.
const MOTIF_ICONS: Record<
	NonNullable<Scene['motif']>,
	React.ComponentType<{size?: number; strokeWidth?: number; color?: string}>
> = {
	transit: Bus,
	food: Utensils,
	landmark: Landmark,
	money: Coins,
	lodging: Hotel,
	nature: Trees,
	reflection: Sunset,
};

// TitleCard is always left-aligned (see TitleCard.tsx) and captions always
// live in a strip at the very bottom, so the right side of frame is free in
// every case *except* wherever the heading/body currently sit vertically.
// Flip the motif to the opposite vertical band from textOverlay.position so
// a per-topic glyph (bus/fork/landmark/...) reads as a quiet signature
// rather than colliding with copy.
const VERTICAL_ANCHOR: Record<'top' | 'center' | 'bottom', {top?: string; bottom?: string}> = {
	// When the heading sits up top, the icon goes in the vertical middle
	// band — clear of the text above and, crucially, clear of the caption
	// strip below (a bottom-pinned icon here was overlapping the caption
	// card's top-right corner in review stills).
	top: {top: '38%'},
	center: {top: '8%'},
	bottom: {top: '8%'},
};

// A single per-scene topic icon, rendered large, low-contrast, and slowly
// drifting — a per-topic visual signature (transit/food/landmark/...) so
// scenes are differentiated by more than background color alone, without
// competing with the text overlay or captions for attention.
export const SceneMotif: React.FC<{
	scene: Scene;
	transitionFrames?: number;
	isFirstScene?: boolean;
}> = ({scene, transitionFrames = 0, isFirstScene = true}) => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();

	if (!scene.motif) {
		return null;
	}

	const Icon = MOTIF_ICONS[scene.motif];
	const position = scene.textOverlay?.position ?? 'bottom';
	const anchor = VERTICAL_ANCHOR[position];

	// Slow continuous "breathe" drift, independent of scene duration/entry —
	// this is ambient texture, not a cued animation, so a plain sine wave
	// (rather than a spring anchored to frame 0) keeps it alive without ever
	// looking like it "arrives" or "finishes."
	const cycleSeconds = 10;
	const t = (frame / fps / cycleSeconds) * Math.PI * 2;
	const scale = 1 + Math.sin(t) * 0.04;
	const drift = Math.sin(t * 0.55) * 12;

	// Adjacent scenes can land on the same anchor point (e.g. two
	// consecutive scenes both using textOverlay.position: "bottom"), which
	// made two different glyphs visibly ghost through each other during the
	// crossfade in review stills. Fade the motif fully out/in across the
	// same transitionFrames window TitleCard/Captions already use for
	// exactly this reason, instead of leaving it exposed for the dissolve.
	const entranceDelay = isFirstScene ? 0 : transitionFrames;
	const entranceOpacity = interpolate(frame, [entranceDelay, entranceDelay + 12], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const exitStart = Math.max(durationInFrames - transitionFrames, 0);
	const exitOpacity = interpolate(frame, [exitStart, durationInFrames], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<div
			style={{
				position: 'absolute',
				right: '7%',
				...anchor,
				opacity: 0.16 * entranceOpacity * exitOpacity,
				transform: `translateY(${drift}px) scale(${scale})`,
				// A fixed light tint (rather than the scene/brand accent color)
				// so the glyph stays legible against every background hue —
				// several of this episode's scene colors sit close in hue to
				// the brand accent, which made an accent-tinted icon nearly
				// disappear against those backgrounds in review stills.
				color: '#F5F1E8',
				filter: 'blur(0.3px)',
			}}
		>
			<Icon size={280} strokeWidth={0.6} />
		</div>
	);
};
