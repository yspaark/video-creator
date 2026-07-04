import React from 'react';
import {AbsoluteFill} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import type {Storyboard} from '../storyboard';
import type {SceneTiming} from '../load-storyboard';
import {SceneRenderer} from '../components/SceneRenderer';
import {LowerThird} from '../components/LowerThird';
import {BackgroundMusic} from '../components/BackgroundMusic';

export type LongFormProps = {
	slug: string;
	storyboard?: Storyboard;
	timings?: SceneTiming[];
};

const TRANSITION_FRAMES = 20;

// Horizontal (16:9) template for YouTube long-form / explainer videos:
// slower pacing, wider title cards, no progress bar. Same storyboard schema
// as ShortForm so a single script can be authored once and rendered for
// either platform by changing meta.platform / width / height.
export const LongForm: React.FC<LongFormProps> = ({storyboard, timings}) => {
	if (!storyboard || !timings) {
		return null;
	}

	return (
		<AbsoluteFill style={{backgroundColor: 'black'}}>
			<TransitionSeries>
				{storyboard.scenes.map((scene, i) => (
					<React.Fragment key={scene.id}>
						{i > 0 ? (
							<TransitionSeries.Transition
								presentation={fade()}
								timing={linearTiming({durationInFrames: TRANSITION_FRAMES})}
							/>
						) : null}
						<TransitionSeries.Sequence durationInFrames={timings[i].durationInFrames}>
							<SceneRenderer scene={scene} brand={storyboard.meta.brand} />
							{scene.label ? (
								<LowerThird label={scene.label} accentColor={storyboard.meta.brand.accentColor} />
							) : null}
						</TransitionSeries.Sequence>
					</React.Fragment>
				))}
			</TransitionSeries>
			<BackgroundMusic music={storyboard.meta.music} />
		</AbsoluteFill>
	);
};
