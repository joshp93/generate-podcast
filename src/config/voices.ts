/** A Piper voice model available for download. */
export interface VoiceDefinition {
  readonly id: string;
  readonly description: string;
  readonly modelUrl: string;
  readonly configUrl: string;
}

const baseUrl = 'https://huggingface.co/rhasspy/piper-voices/resolve/main/en';

const buildVoice = (id: string, locale: string, name: string, description: string): VoiceDefinition => {
  const url = `${baseUrl}/${locale}/${name}/medium/${locale}-${name}-medium.onnx`;
  return { id, description, modelUrl: url, configUrl: `${url}.json` };
};

/** Catalog of selectable voices keyed by short id. */
export const voiceCatalog: Readonly<Record<string, VoiceDefinition>> = {
  ryan: buildVoice('ryan', 'en_US', 'ryan', 'American male'),
  amy: buildVoice('amy', 'en_US', 'amy', 'American female'),
  lessac: buildVoice('lessac', 'en_US', 'lessac', 'American female, neutral'),
  joe: buildVoice('joe', 'en_US', 'joe', 'American male, deep'),
  alan: buildVoice('alan', 'en_GB', 'alan', 'British male'),
};

/** Ids of every selectable voice. */
export const voiceIds = Object.keys(voiceCatalog) as [string, ...string[]];

/** Default voice for the host. */
export const defaultHostVoice = 'ryan';

/** Default voice for the co-host. */
export const defaultCohostVoice = 'amy';
