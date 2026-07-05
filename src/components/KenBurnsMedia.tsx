import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Background} from '../storyboard';
import {AtmosphereBackground} from './AtmosphereBackground';

const KEN_BURNS_SCALE = 1.12;

export const KenBurnsMedia: React.FC<{background: Background}> = ({background}) => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();
	const progress = interpolate(frame, [0, Math.max(durationInFrames - 1, 1)], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	if (background.type === 'color') {
		// A flat or gradient-filled rectangle behind text is a slide
		// background no matter how it's animated — see AtmosphereBackground
		// for the layered depth/parallax treatment placeholder scenes get
		// instead, derived procedurally from the one authored color.
		return <AtmosphereBackground baseHex={background.value} />;
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
