import React from 'react';
import {Audio, staticFile} from 'remotion';
import type {Storyboard} from '../storyboard';

export const BackgroundMusic: React.FC<{music: Storyboard['meta']['music']}> = ({music}) => {
	if (!music) {
		return null;
	}
	return <Audio src={staticFile(music.src)} volume={music.volume} loop />;
};
