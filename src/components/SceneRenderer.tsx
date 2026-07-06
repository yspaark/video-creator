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

// Renders a single scene: background media, the kind-appropriate overlay,
// an optional stat callout, captions, and its voiceover audio. Shared by
// ShortForm and LongForm so both platforms stay visually consistent for the
// same storyboard schema.
export const SceneRenderer: React.FC<{scene: Scene; brand: Storyboard['meta']['brand']}> = ({
	scene,
	brand,
}) => {
	const brandColor = brand.secondaryColor;
	const accentColor = brand.accentColor;

	return (
		<AbsoluteFill>
			<KenBurnsMedia background={scene.background} />
			{scene.kind === 'list' ? (
				<ListReveal scene={scene} brandColor={brandColor} accentColor={accentColor} />
			) : scene.kind === 'quote' ? (
				<QuoteCard scene={scene} brandColor={brandColor} accentColor={accentColor} />
			) : (
				<TitleCard scene={scene} brandColor={brandColor} accentColor={accentColor} />
			)}
			<StatCallout scene={scene} brandColor={brandColor} accentColor={accentColor} />
			<Captions scene={scene} brandColor={brand.primaryColor} accentColor={accentColor} />
			<SceneAudio scene={scene} />
		</AbsoluteFill>
	);
};
