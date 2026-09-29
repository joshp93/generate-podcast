import { rm } from 'node:fs/promises';
import path from 'node:path';
import AdmZip from 'adm-zip';
import { piperArchiveUrl } from '../config/piperRelease.js';
import { piperExecutable, vendorDir } from '../config/paths.js';
import { downloadFile } from './downloadFile.js';
import { fileExists } from './fileExists.js';
import { log } from './log.js';

/**
 * Ensures the Piper executable is present, downloading and extracting it if missing.
 * @returns Path to the Piper executable.
 * @throws When the archive cannot be downloaded or does not contain the executable.
 */
export const ensurePiper = async (): Promise<string> => {
  if (await fileExists(piperExecutable)) return piperExecutable;
  const archive = path.join(vendorDir, 'piper.zip');
  await downloadFile(piperArchiveUrl, archive);
  log('Extracting Piper');
  new AdmZip(archive).extractAllTo(vendorDir, true);
  await rm(archive, { force: true });
  if (!(await fileExists(piperExecutable))) {
    throw new Error(`Piper executable not found after extraction: ${piperExecutable}`);
  }
  return piperExecutable;
};
