import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Scene} from '../storyboard';
import {BODY_FONT_FAMILY, KICKER_FONT_FAMILY} from '../fonts';
import {glassPanelStyle} from '../glass';
import {adjustLightness, withAlpha} from '../color-utils';

const STAGGER_FRAMES = 6;

// Staggered numbered-checklist reveal, used when scene.kind is 'list'
// (e.g. "3 tips" videos). Renders scene.textOverlay?.heading above the list
// since it replaces TitleCard for this scene kind — mirrors TitleCard's
// non-cinematic kicker treatment and transition-aware fade so it reads as
// the same template, not a different component bolted on. Each item sits
// in its own glass card so the list reads as designed rows, not bare text.
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

	const badgeGradient = `linear-gradient(140deg, ${adjustLightness(accentColor, 0.14)}, ${accentColor})`;

	return (
		<AbsoluteFill style={{opacity: exitOpacity}}>
			<AbsoluteFill style={{justifyContent: 'center', alignItems: 'flex-start', padding: '0 9%'}}>
				{heading ? (
					<div style={{marginBottom: 30}}>
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
								background: `linear-gradient(90deg, ${accentColor}, transparent)`,
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
								marginBottom: 16,
								...glassPanelStyle(accentColor, {radius: 16, padding: '14px 24px 14px 14px'}),
							}}
						>
							<div
								style={{
									width: 40,
									height: 40,
									borderRadius: '50%',
									background: badgeGradient,
									boxShadow: `0 4px 14px ${withAlpha(accentColor, 0.5)}`,
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
