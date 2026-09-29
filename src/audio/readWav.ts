import { readFile } from 'node:fs/promises';

/** Decoded mono 16-bit PCM audio. */
export interface PcmAudio {
  readonly sampleRate: number;
  readonly samples: Int16Array;
}

/**
 * Reads a mono 16-bit PCM WAV file.
 * @param file - Path to the WAV file.
 * @returns Sample rate and samples.
 * @throws When the file is not mono 16-bit PCM WAV.
 */
export const readWav = async (file: string): Promise<PcmAudio> => {
  const buffer = await readFile(file);
  if (buffer.toString('ascii', 0, 4) !== 'RIFF' || buffer.toString('ascii', 8, 12) !== 'WAVE') {
    throw new Error(`Not a WAV file: ${file}`);
  }
  let offset = 12;
  let sampleRate = 0;
  while (offset + 8 <= buffer.length) {
    const id = buffer.toString('ascii', offset, offset + 4);
    const size = buffer.readUInt32LE(offset + 4);
    const body = offset + 8;
    if (id === 'fmt ') {
      const channels = buffer.readUInt16LE(body + 2);
      sampleRate = buffer.readUInt32LE(body + 4);
      const bits = buffer.readUInt16LE(body + 14);
      if (channels !== 1 || bits !== 16) throw new Error(`Expected mono 16-bit WAV: ${file}`);
    }
    if (id === 'data') {
      const length = Math.min(size, buffer.length - body) & ~1;
      const samples = new Int16Array(length / 2);
      for (let i = 0; i < samples.length; i++) samples[i] = buffer.readInt16LE(body + i * 2);
      return { sampleRate, samples };
    }
    offset = body + size + (size % 2);
  }
  throw new Error(`No audio data in WAV file: ${file}`);
};
