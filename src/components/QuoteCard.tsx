import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Scene} from '../storyboard';
import {HEADLINE_FONT_FAMILY, KICKER_FONT_FAMILY} from '../fonts';

// Styled block quote with attribution, used when scene.kind is 'quote'.
// Replaces TitleCard for this scene kind — the italic serif display face
// mirrors TitleCard's "cinematic" (hook/cta) treatment so a quote beat
// reads as the same editorial template, not a different visual language.
export const QuoteCard: React.FC<{
	scene: Scene;
	brandColor: string;
	accentColor: string;
	transitionFrames?: number;
	isFirstScene?: boolean;
}> = ({scene, brandColor, accentColor, transitionFrames = 0, isFirstScene = true}) => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();

	if (!scene.quote) {
		return null;
	}
	const {text, attribution} = scene.quote;

	const entranceDelay = isFirstScene ? 0 : transitionFrames;
	const entrance = spring({frame: frame - entranceDelay, fps, config: {damping: 200}});
	const opacity = interpolate(entrance, [0, 1], [0, 1]);
	const translateY = interpolate(entrance, [0, 1], [24, 0]);

	const exitStart = Math.max(durationInFrames - transitionFrames, 0);
	const exitOpacity = interpolate(frame, [exitStart, durationInFrames], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: '0 12%', opacity: exitOpacity}}>
			<div style={{opacity, transform: `translateY(${translateY}px)`, textAlign: 'center'}}>
				<div
					style={{
						fontFamily: `"${HEADLINE_FONT_FAMILY}", Georgia, serif`,
						fontSize: 120,
						lineHeight: 0.6,
						color: accentColor,
						marginBottom: 12,
					}}
				>
					&ldquo;
				</div>
				<div
					style={{
						fontFamily: `"${HEADLINE_FONT_FAMILY}", Georgia, serif`,
						fontWeight: 600,
						fontStyle: 'italic',
						fontSize: 54,
						lineHeight: 1.25,
						color: 'white',
						textShadow: '0 2px 16px rgba(0,0,0,0.55)',
					}}
				>
					{text}
				</div>
				{attribution ? (
					<div
						style={{
							marginTop: 24,
							fontFamily: `"${KICKER_FONT_FAMILY}", sans-serif`,
							fontWeight: 500,
							textTransform: 'uppercase',
							letterSpacing: '0.09em',
							fontSize: 22,
							color: brandColor,
						}}
					>
						— {attribution}
					</div>
				) : null}
			</div>
		</AbsoluteFill>
	);
};
