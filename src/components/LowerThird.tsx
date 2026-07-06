import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {KICKER_FONT_FAMILY} from '../fonts';

// A persistent chapter "chip" pinned top-left — think broadcast/documentary
// chapter marker, not a lower-third bar across the bottom. It used to sit
// bottom-left, which put it in the same screen band as bottom-anchored
// title cards and captions; three text layers stacking on the same 20% of
// frame is what produced illegible overlapping text in review stills. The
// top-left corner is otherwise empty on every position variant, so the
// chip never competes with anything else on screen.
export const LowerThird: React.FC<{
	label: string;
	accentColor: string;
	transitionFrames?: number;
	isFirstScene?: boolean;
}> = ({label, accentColor, transitionFrames = 0, isFirstScene = true}) => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();

	const entranceDelay = isFirstScene ? 0 : transitionFrames;
	const entrance = spring({frame: frame - entranceDelay, fps, config: {damping: 200}});
	const translateY = interpolate(entrance, [0, 1], [-16, 0]);
	const entranceOpacity = interpolate(entrance, [0, 1], [0, 1]);

	const exitStart = Math.max(durationInFrames - transitionFrames, 0);
	const exitOpacity = interpolate(frame, [exitStart, durationInFrames], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<div
			style={{
				position: 'absolute',
				left: 56,
				top: 48,
				transform: `translateY(${translateY}px)`,
				opacity: entranceOpacity * exitOpacity,
				display: 'flex',
				alignItems: 'center',
				gap: 10,
			}}
		>
			<div style={{width: 5, height: 5, borderRadius: '50%', backgroundColor: accentColor}} />
			<div
				style={{
					fontFamily: `"${KICKER_FONT_FAMILY}", sans-serif`,
					fontWeight: 500,
					fontSize: 20,
					letterSpacing: '0.09em',
					textTransform: 'uppercase',
					color: 'rgba(255,255,255,0.88)',
					textShadow: '0 2px 10px rgba(0,0,0,0.7)',
				}}
			>
				{label}
			</div>
		</div>
	);
};
