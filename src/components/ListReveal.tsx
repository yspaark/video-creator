import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Scene} from '../storyboard';
import {BODY_FONT_FAMILY, KICKER_FONT_FAMILY} from '../fonts';

const STAGGER_FRAMES = 6;

// Staggered numbered-checklist reveal, used when scene.kind is 'list'
// (e.g. "3 tips" videos). Renders scene.textOverlay?.heading above the list
// since it replaces TitleCard for this scene kind — mirrors TitleCard's
// non-cinematic kicker treatment and transition-aware fade so it reads as
// the same template, not a different component bolted on.
export const ListReveal: React.FC<{
	scene: Scene;
	brandColor: string;
	accentColor: string;
	transitionFrames?: number;
	isFirstScene?: boolean;
}> = ({scene, brandColor, accentColor, transitionFrames = 0, isFirstScene = true}) => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();

	if (!scene.listItems || scene.listItems.length === 0) {
		return null;
	}

	const heading = scene.textOverlay?.heading;
	const entranceDelay = isFirstScene ? 0 : transitionFrames;
	const localFrame = frame - entranceDelay;

	const exitStart = Math.max(durationInFrames - transitionFrames, 0);
	const exitOpacity = interpolate(frame, [exitStart, durationInFrames], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const headingEntrance = spring({frame: localFrame, fps, config: {damping: 200}});
	const headingOpacity = interpolate(headingEntrance, [0, 1], [0, 1]);
	const headingY = interpolate(headingEntrance, [0, 1], [20, 0]);

	return (
		<AbsoluteFill style={{opacity: exitOpacity}}>
			<AbsoluteFill style={{justifyContent: 'center', alignItems: 'flex-start', padding: '0 10%'}}>
				{heading ? (
					<div style={{marginBottom: 28}}>
						<div
							style={{
								transform: `translateY(${headingY}px)`,
								opacity: headingOpacity,
								fontFamily: `"${KICKER_FONT_FAMILY}", "${BODY_FONT_FAMILY}", sans-serif`,
								fontWeight: 600,
								textTransform: 'uppercase',
								letterSpacing: '0.04em',
								fontSize: 38,
								lineHeight: 1.3,
								color: 'white',
								textShadow: '0 2px 20px rgba(0,0,0,0.6)',
								marginBottom: 14,
							}}
						>
							{heading}
						</div>
						<div
							style={{
								width: 56,
								height: 3,
								background: accentColor,
								opacity: headingOpacity,
								borderRadius: 2,
							}}
						/>
					</div>
				) : null}
				{scene.listItems.map((item, i) => {
					const entrance = spring({
						frame: localFrame - i * STAGGER_FRAMES,
						fps,
						config: {damping: 200},
					});
					const translateX = interpolate(entrance, [0, 1], [-50, 0]);
					const opacity = interpolate(entrance, [0, 1], [0, 1]);

					return (
						<div
							key={i}
							style={{
								display: 'flex',
								alignItems: 'center',
								transform: `translateX(${translateX}px)`,
								opacity,
								marginBottom: 20,
							}}
						>
							<div
								style={{
									width: 36,
									height: 36,
									borderRadius: '50%',
									backgroundColor: accentColor,
									color: 'white',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									fontFamily: `"${KICKER_FONT_FAMILY}", sans-serif`,
									fontWeight: 600,
									fontSize: 20,
									marginRight: 20,
									flexShrink: 0,
								}}
							>
								{i + 1}
							</div>
							<div
								style={{
									fontFamily: `"${BODY_FONT_FAMILY}", sans-serif`,
									fontWeight: 500,
									fontSize: 34,
									color: brandColor === '#111827' ? '#F3F4F6' : brandColor,
									textShadow: '0 2px 12px rgba(0,0,0,0.55)',
									maxWidth: '85%',
								}}
							>
								{item}
							</div>
						</div>
					);
				})}
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
