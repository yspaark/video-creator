import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Scene} from '../storyboard';

const POSITION_TO_JUSTIFY: Record<string, string> = {
	top: 'flex-start',
	center: 'center',
	bottom: 'flex-end',
};

// A dark scrim local to wherever the text sits, so heading/body legibility
// doesn't depend on the background happening to be dark there.
const POSITION_TO_SCRIM: Record<string, string> = {
	top: 'linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0) 65%)',
	center: 'radial-gradient(55% 55% at 50% 50%, rgba(0,0,0,0.4), rgba(0,0,0,0) 70%)',
	bottom: 'linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0) 65%)',
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

	const headingEntrance = spring({frame, fps, config: {damping: 200}});
	const headingY = interpolate(headingEntrance, [0, 1], [40, 0]);
	const headingOpacity = interpolate(headingEntrance, [0, 1], [0, 1]);

	// Body follows a beat behind the heading instead of arriving in lockstep.
	const bodyEntrance = spring({frame: frame - 6, fps, config: {damping: 200}});
	const bodyY = interpolate(bodyEntrance, [0, 1], [24, 0]);
	const bodyOpacity = interpolate(bodyEntrance, [0, 1], [0, 1]);

	const {heading, body, position = 'bottom'} = scene.textOverlay;

	return (
		<AbsoluteFill style={{background: POSITION_TO_SCRIM[position]}}>
			<AbsoluteFill
				style={{
					justifyContent: POSITION_TO_JUSTIFY[position],
					alignItems: 'flex-start',
					padding: '8% 8%',
				}}
			>
				<div>
					{heading ? (
						<div
							style={{
								transform: `translateY(${headingY}px)`,
								opacity: headingOpacity,
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
								transform: `translateY(${bodyY}px)`,
								opacity: bodyOpacity,
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
		</AbsoluteFill>
	);
};
