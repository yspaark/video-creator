import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Scene} from '../storyboard';
import {BODY_FONT_FAMILY} from '../fonts';

// Simple full-line captions, fading in per scene. Timing is proportional to
// the scene's duration since we don't have word-level alignment yet — once
// a forced-alignment step (e.g. Whisper) is wired up, swap this for
// per-word highlighting driven by real timestamps.
export const Captions: React.FC<{
	scene: Scene;
	brandColor: string;
	transitionFrames?: number;
	isFirstScene?: boolean;
}> = ({scene, brandColor, transitionFrames = 0, isFirstScene = true}) => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();

	if (scene.captions === 'none' || !scene.voiceover?.text) {
		return null;
	}

	// Clear fully before the next scene's crossfade starts, and hold off
	// appearing until this scene has finished dissolving in — otherwise the
	// outgoing and incoming scenes' captions overlap into an illegible
	// double-exposure during the transition (visible in early review stills).
	const entranceDelay = isFirstScene ? 0 : transitionFrames;
	const exitStart = Math.max(durationInFrames - transitionFrames, 0);
	const opacity = interpolate(
		frame,
		[entranceDelay, entranceDelay + 8, exitStart, durationInFrames],
		[0, 1, 1, 0],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
	);

	return (
		<AbsoluteFill
			style={{
				justifyContent: 'flex-end',
				alignItems: 'center',
				paddingBottom: '9%',
				paddingLeft: '10%',
				paddingRight: '10%',
			}}
		>
			<div
				style={{
					opacity,
					fontFamily: `"${BODY_FONT_FAMILY}", sans-serif`,
					fontWeight: 500,
					fontSize: 40,
					lineHeight: 1.35,
					textAlign: 'center',
					color: 'white',
					textShadow: '0 2px 14px rgba(0,0,0,0.7), 0 0 2px rgba(0,0,0,0.8)',
					background: 'linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0.15))',
					borderRadius: 10,
					padding: '8px 20px',
					boxDecorationBreak: 'clone',
					WebkitBoxDecorationBreak: 'clone',
					borderLeft: `2px solid ${brandColor}66`,
				}}
			>
				{scene.voiceover.text}
			</div>
		</AbsoluteFill>
	);
};
