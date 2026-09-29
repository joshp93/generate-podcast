import path from 'node:path';
import { voicesDir } from '../config/paths.js';
import { voiceCatalog } from '../config/voices.js';
import { downloadFile } from './downloadFile.js';
import { fileExists } from './fileExists.js';

/**
 * Ensures a voice model and its config are present, downloading them if missing.
 * @param voiceId - Key of the voice in the catalog.
 * @returns Path to the voice's `.onnx` model.
 * @throws When the voice id is unknown or a download fails.
 */
export const ensureVoice = async (voiceId: string): Promise<string> => {
  const voice = voiceCatalog[voiceId];
  if (!voice) throw new Error(`Unknown voice "${voiceId}"`);
  const model = path.join(voicesDir, path.basename(new URL(voice.modelUrl).pathname));
  const config = `${model}.json`;
  if (!(await fileExists(model))) await downloadFile(voice.modelUrl, model);
  if (!(await fileExists(config))) await downloadFile(voice.configUrl, config);
  return model;
};
