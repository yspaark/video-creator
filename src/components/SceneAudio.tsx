import React from 'react';
import {Audio, staticFile} from 'remotion';
import type {Scene} from '../storyboard';

// Plays the voiceover clip for a scene, if one has been generated yet.
// Until a TTS step produces `voiceover.src`, scenes are silent and rely on
// the text-length duration estimate — see estimateDurationFromText.
export const SceneAudio: React.FC<{scene: Scene}> = ({scene}) => {
	if (!scene.voiceover?.src) {
		return null;
	}
	return <Audio src={staticFile(scene.voiceover.src)} />;
};
