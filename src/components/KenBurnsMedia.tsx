import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Background} from '../storyboard';
import {deriveAtmosphere} from '../color-utils';

const KEN_BURNS_SCALE = 1.12;

export const KenBurnsMedia: React.FC<{background: Background}> = ({background}) => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();
	const progress = interpolate(frame, [0, Math.max(durationInFrames - 1, 1)], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	if (background.type === 'color') {
		// A flat fill reads as a slide, not a shot — animate a diagonal
		// gradient plus a slow-drifting warm glow derived from the one
		// authored color, so placeholder scenes still feel lit rather than
		// solid-filled.
		const {gradientPartner, glow} = deriveAtmosphere(background.value);
		const angle = interpolate(progress, [0, 1], [124, 148]);
		const glowX = interpolate(progress, [0, 1], [28, 72]);
		const glowY = interpolate(progress, [0, 1], [70, 32]);
		return (
			<AbsoluteFill
				style={{
					background: `radial-gradient(65% 60% at ${glowX}% ${glowY}%, ${glow}4d, transparent 62%), linear-gradient(${angle}deg, ${background.value}, ${gradientPartner})`,
				}}
			/>
		);
	}

	if (background.type === 'video') {
		return (
			<AbsoluteFill>
				<OffthreadVideo
					src={staticFile(background.src)}
					muted={background.muted}
					style={{width: '100%', height: '100%', objectFit: 'cover'}}
				/>
			</AbsoluteFill>
		);
	}

	// Ken Burns image pan/zoom.
	let scale = 1;
	let translateX = 0;
	let translateY = 0;
	const maxShift = 4; // percent

	switch (background.kenBurns) {
		case 'in':
			scale = interpolate(progress, [0, 1], [1, KEN_BURNS_SCALE]);
			break;
		case 'out':
			scale = interpolate(progress, [0, 1], [KEN_BURNS_SCALE, 1]);
			break;
		case 'left':
			scale = KEN_BURNS_SCALE;
			translateX = interpolate(progress, [0, 1], [maxShift, -maxShift]);
			break;
		case 'right':
			scale = KEN_BURNS_SCALE;
			translateX = interpolate(progress, [0, 1], [-maxShift, maxShift]);
			break;
		default:
			scale = 1;
	}

	return (
		<AbsoluteFill style={{overflow: 'hidden'}}>
			<Img
				src={staticFile(background.src)}
				style={{
					width: '100%',
					height: '100%',
					objectFit: 'cover',
					transform: `scale(${scale}) translate(${translateX}%, ${translateY}%)`,
				}}
			/>
		</AbsoluteFill>
	);
};
