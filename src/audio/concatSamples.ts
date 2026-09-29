/**
 * Joins sample arrays end to end.
 * @param parts - Arrays to join.
 * @returns A single array containing all samples in order.
 */
export const concatSamples = (parts: readonly Int16Array[]): Int16Array => {
  const result = new Int16Array(parts.reduce((total, part) => total + part.length, 0));
  parts.reduce((offset, part) => {
    result.set(part, offset);
    return offset + part.length;
  }, 0);
  return result;
};
