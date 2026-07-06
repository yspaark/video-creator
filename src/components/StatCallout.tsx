import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Scene} from '../storyboard';
import {HEADLINE_FONT_FAMILY, KICKER_FONT_FAMILY} from '../fonts';
import {glassPanelStyle} from '../glass';
import {adjustLightness, withAlpha} from '../color-utils';

// Big animated number/stat callout, e.g. for "87% faster" beats. Layers on
// top of whatever overlay the scene's `kind` already renders. Sits inside a
// glass card with a soft accent-colored glow behind the numeral, and the
// serif display face matches TitleCard's cinematic treatment so a stat beat
// reads as the same editorial template rather than a bare floating number.
export const StatCallout: React.FC<{
	scene: Scene;
	brandColor: string;
	accentColor: string;
	transitionFrames?: number;
	isFirstScene?: boolean;
}> = ({scene, brandColor, accentColor, transitionFrames = 0, isFirstScene = true}) => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();

	if (!scene.stat) {
		return null;
	}
	const {value, prefix, suffix, label} = scene.stat;

	const entranceDelay = isFirstScene ? 0 : transitionFrames;
	const localFrame = frame - entranceDelay;

	const pop = spring({frame: localFrame, fps, config: {damping: 12, mass: 0.6, stiffness: 120}});
	const scale = interpolate(pop, [0, 1], [0.4, 1]);
	const opacity = interpolate(pop, [0, 1], [0, 1]);

	const labelEntrance = spring({frame: localFrame - 6, fps, config: {damping: 200}});
	const labelOpacity = interpolate(labelEntrance, [0, 1], [0, 1]);
	const labelY = interpolate(labelEntrance, [0, 1], [16, 0]);

	const exitStart = Math.max(durationInFrames - transitionFrames, 0);
	const exitOpacity = interpolate(frame, [exitStart, durationInFrames], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const numberGradient = `linear-gradient(180deg, ${adjustLightness(accentColor, 0.16)}, ${accentColor})`;

	return (
		<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: '10%', opacity: exitOpacity}}>
			<div
				style={{
					position: 'relative',
					transform: `scale(${scale})`,
					opacity,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					...glassPanelStyle(accentColor, {radius: 28, padding: '36px 56px'}),
				}}
			>
				{/* Soft glow seated behind the numeral, inside the card, for depth. */}
				<div
					style={{
						position: 'absolute',
						width: '70%',
						height: '60%',
						top: '18%',
						borderRadius: '50%',
						background: `radial-gradient(closest-side, ${withAlpha(accentColor, 0.45)}, transparent 72%)`,
						filter: 'blur(6px)',
					}}
				/>
				<div style={{position: 'relative', display: 'flex', alignItems: 'baseline'}}>
					{prefix ? (
						<span
							style={{
								fontFamily: `"${HEADLINE_FONT_FAMILY}", Georgia, serif`,
								fontSize: 64,
								fontWeight: 600,
								color: brandColor,
								marginRight: 4,
							}}
						>
							{prefix}
						</span>
					) : null}
					<span
						style={{
							fontFamily: `"${HEADLINE_FONT_FAMILY}", Georgia, serif`,
							fontWeight: 600,
							fontSize: 168,
							lineHeight: 1,
							backgroundImage: numberGradient,
							backgroundClip: 'text',
							WebkitBackgroundClip: 'text',
							color: 'transparent',
							WebkitTextFillColor: 'transparent',
							filter: `drop-shadow(0 8px 22px ${withAlpha(accentColor, 0.55)})`,
						}}
					>
						{value}
					</span>
					{suffix ? (
						<span
							style={{
								fontFamily: `"${HEADLINE_FONT_FAMILY}", Georgia, serif`,
								fontSize: 64,
								fontWeight: 600,
								color: brandColor,
								marginLeft: 4,
							}}
						>
							{suffix}
						</span>
					) : null}
				</div>
				{label ? (
					<div
						style={{
							position: 'relative',
							display: 'flex',
							alignItems: 'center',
							gap: 10,
							marginTop: 18,
							transform: `translateY(${labelY}px)`,
							opacity: labelOpacity,
						}}
					>
						<div style={{width: 20, height: 2, background: accentColor, borderRadius: 1}} />
						<div
							style={{
								fontFamily: `"${KICKER_FONT_FAMILY}", sans-serif`,
								fontWeight: 500,
								textTransform: 'uppercase',
								letterSpacing: '0.06em',
								fontSize: 24,
								color: brandColor,
								textAlign: 'center',
								maxWidth: '70%',
							}}
						>
							{label}
						</div>
						<div style={{width: 20, height: 2, background: accentColor, borderRadius: 1}} />
					</div>
				) : null}
			</div>
		</AbsoluteFill>
	);
};
