import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Scene} from '../storyboard';

// Simple full-line captions, fading in per scene. Timing is proportional to
// the scene's duration since we don't have word-level alignment yet — once
// a forced-alignment step (e.g. Whisper) is wired up, swap this for
// per-word highlighting driven by real timestamps.
export const Captions: React.FC<{scene: Scene; brandColor: string}> = ({scene, brandColor}) => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();

	if (scene.captions === 'none' || !scene.voiceover?.text) {
		return null;
	}

	const opacity = interpolate(
		frame,
		[0, 8, durationInFrames - 8, durationInFrames],
		[0, 1, 1, 0],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
	);

	return (
		<AbsoluteFill
			style={{
				justifyContent: 'flex-end',
				alignItems: 'center',
				paddingBottom: '10%',
				paddingLeft: '8%',
				paddingRight: '8%',
			}}
		>
			<div
				style={{
					opacity,
					fontFamily: 'Inter, sans-serif',
					fontWeight: 700,
					fontSize: 48,
					lineHeight: 1.25,
					textAlign: 'center',
					color: 'white',
					textShadow: '0 2px 12px rgba(0,0,0,0.65)',
					WebkitTextStroke: `1px ${brandColor}`,
				}}
			>
				{scene.voiceover.text}
			</div>
		</AbsoluteFill>
	);
};
