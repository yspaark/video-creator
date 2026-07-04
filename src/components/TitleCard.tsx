import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Scene} from '../storyboard';

const POSITION_TO_JUSTIFY: Record<string, string> = {
	top: 'flex-start',
	center: 'center',
	bottom: 'flex-end',
};

export const TitleCard: React.FC<{scene: Scene; brandColor: string; accentColor: string}> = ({
	scene,
	brandColor,
	accentColor,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	if (!scene.textOverlay) {
		return null;
	}

	const entrance = spring({frame, fps, config: {damping: 200}});
	const translateY = interpolate(entrance, [0, 1], [40, 0]);
	const opacity = interpolate(entrance, [0, 1], [0, 1]);
	const {heading, body, position = 'bottom'} = scene.textOverlay;

	return (
		<AbsoluteFill
			style={{
				justifyContent: POSITION_TO_JUSTIFY[position],
				alignItems: 'flex-start',
				padding: '8% 8%',
			}}
		>
			<div style={{transform: `translateY(${translateY}px)`, opacity}}>
				{heading ? (
					<div
						style={{
							fontFamily: 'Inter, sans-serif',
							fontWeight: 800,
							fontSize: 64,
							lineHeight: 1.1,
							color: 'white',
							textShadow: '0 2px 16px rgba(0,0,0,0.55)',
							borderLeft: `8px solid ${accentColor}`,
							paddingLeft: 20,
							marginBottom: body ? 12 : 0,
						}}
					>
						{heading}
					</div>
				) : null}
				{body ? (
					<div
						style={{
							fontFamily: 'Inter, sans-serif',
							fontWeight: 500,
							fontSize: 32,
							color: brandColor === '#111827' ? '#F3F4F6' : brandColor,
							maxWidth: '80%',
						}}
					>
						{body}
					</div>
				) : null}
			</div>
		</AbsoluteFill>
	);
};
