import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Scene} from '../storyboard';
import {BODY_FONT_FAMILY} from '../fonts';
import {glassPanelStyle} from '../glass';
import {adjustLightness, readableInkColor, withAlpha} from '../color-utils';

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

export const Captions: React.FC<{
	scene: Scene;
	brandColor: string;
	accentColor: string;
	transitionFrames?: number;
	isFirstScene?: boolean;
}> = ({scene, brandColor, accentColor, transitionFrames = 0, isFirstScene = true}) => {
	const frame = useCurrentFrame();
	const {durationInFrames, fps} = useVideoConfig();

	if (scene.captions === 'none' || !scene.voiceover?.text) {
		return null;
	}

	// Clear fully before the next scene's crossfade starts, and hold off
	// appearing until this scene has finished dissolving in — otherwise the
	// outgoing and incoming scenes' captions overlap into an illegible
	// double-exposure during the transition (visible in early review stills).
	const entranceDelay = isFirstScene ? 0 : transitionFrames;
	const exitStart = Math.max(durationInFrames - transitionFrames, 0);
	const containerOpacity = interpolate(
		frame,
		[entranceDelay, entranceDelay + 8, exitStart, durationInFrames],
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
	const chipInk = readableInkColor(accentColor);

	return (
		<AbsoluteFill
			style={{
				justifyContent: 'flex-end',
				alignItems: 'center',
				paddingBottom: '9%',
				paddingLeft: '10%',
				paddingRight: '10%',
			}}
		>
			<div
				style={{
					...glassPanelStyle(accentColor, {radius: 16, padding: '12px 26px'}),
					opacity: containerOpacity,
					display: 'flex',
					flexWrap: 'wrap',
					justifyContent: 'center',
					columnGap: '0.4em',
					rowGap: '0.2em',
					fontFamily: `"${BODY_FONT_FAMILY}", sans-serif`,
					fontWeight: 500,
					fontSize: 40,
					lineHeight: 1.35,
					textAlign: 'center',
					color: 'white',
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
								fontWeight: active || isEmphasized ? 700 : 500,
								color: active ? chipInk : isEmphasized ? accentColor : 'white',
								background: active
									? `linear-gradient(135deg, ${accentColor}, ${adjustLightness(accentColor, 0.14)})`
									: 'transparent',
								borderRadius: 8,
								padding: '2px 9px',
								margin: '0 -9px',
								boxShadow: active ? `0 6px 16px ${withAlpha(accentColor, 0.5)}` : 'none',
								textShadow: active ? 'none' : '0 2px 10px rgba(0,0,0,0.55)',
								opacity: spoken && !isEmphasized ? 0.55 : 1,
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
