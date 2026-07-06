import React from 'react';
import {AbsoluteFill} from 'remotion';
import type {Scene, Storyboard} from '../storyboard';
import {KenBurnsMedia} from './KenBurnsMedia';
import {TitleCard} from './TitleCard';
import {ListReveal} from './ListReveal';
import {QuoteCard} from './QuoteCard';
import {StatCallout} from './StatCallout';
import {Captions} from './Captions';
import {SceneAudio} from './SceneAudio';
import {Vignette} from './Vignette';
import {FilmGrain} from './FilmGrain';
import {SceneMotif} from './SceneMotif';

// Renders a single scene: background media, the kind-appropriate overlay,
// an optional stat callout, captions, and its voiceover audio. Shared by
// ShortForm and LongForm so both platforms stay visually consistent for the
// same storyboard schema.
//
// `transitionFrames`/`isFirstScene` let text overlays clear the screen
// before the next scene's crossfade begins (and hold off entering until
// the previous one has finished dissolving in), so two scenes' text never
// double-exposes mid-transition — see TitleCard/Captions for the timing.
export const SceneRenderer: React.FC<{
	scene: Scene;
	brand: Storyboard['meta']['brand'];
	transitionFrames?: number;
	isFirstScene?: boolean;
}> = ({scene, brand, transitionFrames = 0, isFirstScene = true}) => {
	const brandColor = brand.secondaryColor;
	const accentColor = brand.accentColor;
	const overlayProps = {scene, brandColor, accentColor, transitionFrames, isFirstScene};

	return (
		<AbsoluteFill>
			<KenBurnsMedia background={scene.background} />
			<Vignette />
			<SceneMotif scene={scene} transitionFrames={transitionFrames} isFirstScene={isFirstScene} />
			{scene.kind === 'list' ? (
				<ListReveal {...overlayProps} />
			) : scene.kind === 'quote' ? (
				<QuoteCard {...overlayProps} />
			) : (
				<TitleCard {...overlayProps} />
			)}
			<StatCallout {...overlayProps} />
			<Captions
				scene={scene}
				brandColor={brand.primaryColor}
				accentColor={accentColor}
				transitionFrames={transitionFrames}
				isFirstScene={isFirstScene}
			/>
			<FilmGrain />
			<SceneAudio scene={scene} />
		</AbsoluteFill>
	);
};
