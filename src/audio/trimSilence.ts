const threshold = 100;
const marginSeconds = 0.08;

/**
 * Trims leading and trailing silence, leaving a short margin.
 * @param samples - PCM samples.
 * @param sampleRate - Sample rate in Hz.
 * @returns The trimmed samples, or the input when it is entirely silent.
 */
export const trimSilence = (samples: Int16Array, sampleRate: number): Int16Array => {
  const first = samples.findIndex((s) => Math.abs(s) > threshold);
  if (first < 0) return samples;
  let last = samples.length - 1;
  while (Math.abs(samples[last]) <= threshold) last--;
  const margin = Math.round(sampleRate * marginSeconds);
  return samples.slice(Math.max(0, first - margin), Math.min(samples.length, last + margin + 1));
};
