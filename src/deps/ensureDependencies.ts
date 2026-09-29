import { ensurePiper } from './ensurePiper.js';
import { ensureVoice } from './ensureVoice.js';

/** Resolved local paths for the synthesis engine and requested voices. */
export interface ResolvedDependencies {
  readonly piper: string;
  readonly models: Readonly<Record<string, string>>;
}

/**
 * Ensures Piper and every requested voice are available locally, downloading whatever is missing.
 * @param voiceIds - Voice ids that must be available.
 * @returns Paths to Piper and each voice model.
 */
export const ensureDependencies = async (voiceIds: readonly string[]): Promise<ResolvedDependencies> => {
  const piper = await ensurePiper();
  const unique = [...new Set(voiceIds)];
  const paths = await Promise.all(unique.map(ensureVoice));
  return { piper, models: Object.fromEntries(unique.map((id, i) => [id, paths[i]])) };
};
