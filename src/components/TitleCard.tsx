import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Scene} from '../storyboard';
import {BODY_FONT_FAMILY, HEADLINE_FONT_FAMILY, KICKER_FONT_FAMILY} from '../fonts';

const POSITION_TO_JUSTIFY: Record<string, string> = {
	top: 'flex-start',
	center: 'center',
	bottom: 'flex-end',
};

// How far each position anchors from its edge. "bottom" in particular needs
// real clearance above the caption strip + (on long-form) the lower-third
// chapter chip — anchoring it to the same 8% edge those use is what caused
// heading/body/captions/label text to physically overlap on screen.
const POSITION_TO_PADDING: Record<string, string> = {
	top: '15% 8% 0',
	center: '0 8%',
	bottom: '0 8% 24%',
};

// A scrim that falls off toward frame center instead of a full-width bar
// behind the text — reads as a light graded vignette around a caption
// rather than a slide's title-safe box.
const POSITION_TO_SCRIM: Record<string, string> = {
	top: 'linear-gradient(105deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.28) 38%, rgba(0,0,0,0) 68%)',
	center: 'radial-gradient(48% 46% at 38% 50%, rgba(0,0,0,0.42), rgba(0,0,0,0) 72%)',
	bottom: 'linear-gradient(255deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.28) 38%, rgba(0,0,0,0) 68%)',
};

// Scenes that open/close the video get a bigger, editorial "cinematic
// title" treatment (serif display face, generous tracking); everything in
// between reads as a documentary chyron — a compact, edge-anchored info
// card that doesn't compete with captions or the chapter chip for the same
// screen real estate.
const CINEMATIC_KINDS = new Set(['hook', 'cta']);

export const TitleCard: React.FC<{
	scene: Scene;
	brandColor: string;
	accentColor: string;
	transitionFrames?: number;
	isFirstScene?: boolean;
}> = ({scene, brandColor, accentColor, transitionFrames = 0, isFirstScene = true}) => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();

	if (!scene.textOverlay) {
		return null;
	}

	const entranceDelay = isFirstScene ? 0 : transitionFrames;
	const localFrame = frame - entranceDelay;

	const headingEntrance = spring({frame: localFrame, fps, config: {damping: 200}});
	const headingY = interpolate(headingEntrance, [0, 1], [32, 0]);
	const headingOpacity = interpolate(headingEntrance, [0, 1], [0, 1]);

	// Body follows a beat behind the heading instead of arriving in lockstep.
	const bodyEntrance = spring({frame: localFrame - 6, fps, config: {damping: 200}});
	const bodyY = interpolate(bodyEntrance, [0, 1], [20, 0]);
	const bodyOpacity = interpolate(bodyEntrance, [0, 1], [0, 1]);

	// Fully clear the text before the next scene starts crossfading in, so
	// two scenes' titles never sit on top of each other mid-transition.
	const exitStart = Math.max(durationInFrames - transitionFrames, 0);
	const exitOpacity = interpolate(frame, [exitStart, durationInFrames], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const {heading, body, position = 'bottom'} = scene.textOverlay;
	const cinematic = CINEMATIC_KINDS.has(scene.kind);

	return (
		<AbsoluteFill style={{background: POSITION_TO_SCRIM[position], opacity: exitOpacity}}>
			<AbsoluteFill
				style={{
					justifyContent: POSITION_TO_JUSTIFY[position],
					alignItems: 'flex-start',
					padding: POSITION_TO_PADDING[position],
				}}
			>
				<div style={{maxWidth: cinematic ? '72%' : '58%'}}>
					{heading ? (
						<div
							style={{
								transform: `translateY(${headingY}px)`,
								opacity: headingOpacity,
								fontFamily: cinematic
									? `"${HEADLINE_FONT_FAMILY}", Georgia, serif`
									: `"${KICKER_FONT_FAMILY}", "${BODY_FONT_FAMILY}", sans-serif`,
								fontWeight: cinematic ? 600 : 600,
								fontStyle: cinematic ? 'italic' : 'normal',
								textTransform: cinematic ? 'none' : 'uppercase',
								letterSpacing: cinematic ? '0.002em' : '0.04em',
								fontSize: cinematic ? 76 : 38,
								lineHeight: cinematic ? 1.12 : 1.3,
								color: 'white',
								textShadow: '0 2px 20px rgba(0,0,0,0.6)',
								marginBottom: body ? 10 : 0,
							}}
						>
							{heading}
						</div>
					) : null}
					{heading && !cinematic ? (
						<div
							style={{
								width: 56,
								height: 3,
								background: accentColor,
								opacity: headingOpacity,
								marginBottom: body ? 14 : 0,
								borderRadius: 2,
							}}
						/>
					) : null}
					{body ? (
						<div
							style={{
								transform: `translateY(${bodyY}px)`,
								opacity: bodyOpacity,
								fontFamily: `"${BODY_FONT_FAMILY}", sans-serif`,
								fontWeight: cinematic ? 400 : 500,
								fontStyle: cinematic ? 'italic' : 'normal',
								fontSize: cinematic ? 30 : 24,
								color: brandColor === '#111827' ? '#F3F4F6' : brandColor,
								textShadow: '0 2px 12px rgba(0,0,0,0.6)',
							}}
						>
							{body}
						</div>
					) : null}
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
