/**
 * Creates a run of silence.
 * @param seconds - Duration in seconds.
 * @param sampleRate - Sample rate in Hz.
 * @returns Zero-filled samples.
 */
export const makeSilence = (seconds: number, sampleRate: number): Int16Array =>
  new Int16Array(Math.round(seconds * sampleRate));
