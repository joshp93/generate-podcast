import { access } from 'node:fs/promises';

/**
 * Checks whether a file or folder exists.
 * @param target - Path to check.
 * @returns True when the path is accessible.
 */
export const fileExists = async (target: string): Promise<boolean> =>
  access(target).then(
    () => true,
    () => false,
  );
