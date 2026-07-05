import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

// A classic YouTube-explainer lower-third label, e.g. for naming a speaker
// or labeling a section. Distinct from Captions (which renders spoken text).
export const LowerThird: React.FC<{label: string; accentColor: string}> = ({label, accentColor}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const entrance = spring({frame, fps, config: {damping: 200}});
	const translateX = interpolate(entrance, [0, 1], [-60, 0]);
	const opacity = interpolate(entrance, [0, 1], [0, 1]);

	return (
		<div
			style={{
				position: 'absolute',
				left: 64,
				bottom: 96,
				transform: `translateX(${translateX}px)`,
				opacity,
				display: 'flex',
				alignItems: 'center',
				background: 'rgba(10,10,10,0.4)',
				backdropFilter: 'blur(6px)',
				borderRadius: 8,
				padding: '10px 24px 10px 14px',
			}}
		>
			<div style={{width: 6, height: 32, backgroundColor: accentColor, marginRight: 16, borderRadius: 3}} />
			<div
				style={{
					fontFamily: 'Inter, sans-serif',
					fontWeight: 700,
					fontSize: 30,
					color: 'white',
					textShadow: '0 2px 12px rgba(0,0,0,0.6)',
				}}
			>
				{label}
			</div>
		</div>
	);
};
