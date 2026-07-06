import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Scene} from '../storyboard';

// Styled block quote with attribution, used when scene.kind is 'quote'.
// Replaces TitleCard for this scene kind.
export const QuoteCard: React.FC<{scene: Scene; brandColor: string; accentColor: string}> = ({
	scene,
	brandColor,
	accentColor,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	if (!scene.quote) {
		return null;
	}
	const {text, attribution} = scene.quote;

	const entrance = spring({frame, fps, config: {damping: 200}});
	const opacity = interpolate(entrance, [0, 1], [0, 1]);
	const translateY = interpolate(entrance, [0, 1], [24, 0]);

	return (
		<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: '0 12%'}}>
			<div style={{opacity, transform: `translateY(${translateY}px)`, textAlign: 'center'}}>
				<div
					style={{
						fontFamily: 'Georgia, serif',
						fontSize: 120,
						lineHeight: 0.6,
						color: accentColor,
						marginBottom: 12,
					}}
				>
					&ldquo;
				</div>
				<div
					style={{
						fontFamily: 'Inter, sans-serif',
						fontWeight: 700,
						fontStyle: 'italic',
						fontSize: 46,
						lineHeight: 1.3,
						color: 'white',
						textShadow: '0 2px 16px rgba(0,0,0,0.55)',
					}}
				>
					{text}
				</div>
				{attribution ? (
					<div
						style={{
							marginTop: 24,
							fontFamily: 'Inter, sans-serif',
							fontWeight: 600,
							fontSize: 28,
							color: brandColor,
						}}
					>
						— {attribution}
					</div>
				) : null}
			</div>
		</AbsoluteFill>
	);
};
