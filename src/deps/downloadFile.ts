import { createWriteStream } from 'node:fs';
import { mkdir, rename } from 'node:fs/promises';
import path from 'node:path';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { log } from './log.js';

/**
 * Downloads a URL to a local file, writing atomically via a temporary `.part` file.
 * @param url - Source URL (redirects are followed).
 * @param destination - Absolute destination path.
 * @throws When the response is not successful.
 */
export const downloadFile = async (url: string, destination: string): Promise<void> => {
  log(`Downloading ${url}`);
  const response = await fetch(url);
  if (!response.ok || !response.body) {
    throw new Error(`Download failed (${response.status} ${response.statusText}): ${url}`);
  }
  await mkdir(path.dirname(destination), { recursive: true });
  const partial = `${destination}.part`;
  await pipeline(Readable.fromWeb(response.body as never), createWriteStream(partial));
  await rename(partial, destination);
};
