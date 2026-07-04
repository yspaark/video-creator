import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';

// Thin top progress bar, common in short-form (TikTok/Reels/Shorts) to show
// how much of the clip remains.
export const ProgressBar: React.FC<{accentColor: string}> = ({accentColor}) => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();
	const progress = frame / Math.max(durationInFrames - 1, 1);

	return (
		<div
			style={{
				position: 'absolute',
				top: 0,
				left: 0,
				right: 0,
				height: 6,
				backgroundColor: 'rgba(255,255,255,0.25)',
			}}
		>
			<div
				style={{
					height: '100%',
					width: `${progress * 100}%`,
					backgroundColor: accentColor,
				}}
			/>
		</div>
	);
};
