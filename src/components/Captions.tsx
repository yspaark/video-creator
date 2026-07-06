import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Scene} from '../storyboard';

const FADE_FRAMES = 8;
const POP_FRAMES = 4;

type WordSpan = {word: string; startFrame: number; endFrame: number};

// Splits the scene's voiceover text into per-word spans. Uses real
// per-word timestamps once a forced-alignment step (e.g. Whisper) has
// produced them; until then, falls back to a character-length-weighted
// split across the scene's duration so longer words hold the highlight a
// little longer than short ones.
const buildWordSpans = (
	text: string,
	durationInFrames: number,
	fps: number,
	wordTimestamps?: {word: string; startSeconds: number; endSeconds: number}[],
): WordSpan[] => {
	if (wordTimestamps && wordTimestamps.length > 0) {
		return wordTimestamps.map((w) => ({
			word: w.word,
			startFrame: Math.round(w.startSeconds * fps),
			endFrame: Math.round(w.endSeconds * fps),
		}));
	}

	const words = text.trim().split(/\s+/).filter(Boolean);
	const usableFrames = Math.max(durationInFrames - FADE_FRAMES * 2, 1);
	const weights = words.map((w) => w.length + 2);
	const totalWeight = weights.reduce((a, b) => a + b, 0);

	let cursor = FADE_FRAMES;
	return words.map((word, i) => {
		const span = (weights[i] / totalWeight) * usableFrames;
		const startFrame = cursor;
		const endFrame = cursor + span;
		cursor = endFrame;
		return {word, startFrame, endFrame};
	});
};

export const Captions: React.FC<{scene: Scene; brandColor: string; accentColor: string}> = ({
	scene,
	brandColor,
	accentColor,
}) => {
	const frame = useCurrentFrame();
	const {durationInFrames, fps} = useVideoConfig();

	if (scene.captions === 'none' || !scene.voiceover?.text) {
		return null;
	}

	const containerOpacity = interpolate(
		frame,
		[0, FADE_FRAMES, durationInFrames - FADE_FRAMES, durationInFrames],
		[0, 1, 1, 0],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
	);

	const spans = buildWordSpans(
		scene.voiceover.text,
		durationInFrames,
		fps,
		scene.voiceover.wordTimestamps,
	);
	const emphasize = new Set((scene.emphasize ?? []).map((w) => w.toLowerCase()));

	return (
		<AbsoluteFill
			style={{
				justifyContent: 'flex-end',
				alignItems: 'center',
				paddingBottom: '10%',
				paddingLeft: '8%',
				paddingRight: '8%',
			}}
		>
			<div
				style={{
					opacity: containerOpacity,
					display: 'flex',
					flexWrap: 'wrap',
					justifyContent: 'center',
					columnGap: '0.4em',
					rowGap: '0.15em',
					fontFamily: 'Inter, sans-serif',
					fontWeight: 700,
					fontSize: 48,
					lineHeight: 1.35,
					textAlign: 'center',
				}}
			>
				{spans.map((span, i) => {
					const isEmphasized = emphasize.has(span.word.replace(/[^\w]/g, '').toLowerCase());
					const active = frame >= span.startFrame && frame < span.endFrame;
					const spoken = frame >= span.endFrame;

					const pop = interpolate(
						frame,
						[span.startFrame, span.startFrame + POP_FRAMES],
						[0.85, 1],
						{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
					);

					return (
						<span
							key={`${span.word}-${i}`}
							style={{
								display: 'inline-block',
								transform: `scale(${active ? pop : 1})`,
								color: active || isEmphasized ? accentColor : 'white',
								opacity: spoken && !isEmphasized ? 0.55 : 1,
								textShadow: '0 2px 12px rgba(0,0,0,0.65)',
								WebkitTextStroke: active || isEmphasized ? 'none' : `1px ${brandColor}`,
							}}
						>
							{span.word}
						</span>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};
