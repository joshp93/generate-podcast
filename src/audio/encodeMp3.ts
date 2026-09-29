import { Mp3Encoder } from '@breezystack/lamejs';

const frameSize = 1152;

const toBuffer = (bytes: ArrayBufferView): Buffer => Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength);

/**
 * Encodes mono 16-bit PCM samples as a 96 kbps MP3.
 * @param samples - PCM samples.
 * @param sampleRate - Sample rate in Hz.
 * @returns MP3 file bytes.
 */
export const encodeMp3 = (samples: Int16Array, sampleRate: number): Buffer => {
  const encoder = new Mp3Encoder(1, sampleRate, 96);
  const chunks: Buffer[] = [];
  for (let i = 0; i < samples.length; i += frameSize) {
    const chunk = encoder.encodeBuffer(samples.subarray(i, i + frameSize));
    if (chunk.length > 0) chunks.push(toBuffer(chunk));
  }
  chunks.push(toBuffer(encoder.flush()));
  return Buffer.concat(chunks);
};
