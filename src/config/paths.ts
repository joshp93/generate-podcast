import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** Absolute path of the project root (the folder containing `package.json`). */
export const projectRoot: string = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

/** Folder holding downloaded runtime dependencies (Piper and voice models). */
export const vendorDir: string = path.join(projectRoot, 'vendor');

/** Folder extracted from the Piper release archive. */
export const piperDir: string = path.join(vendorDir, 'piper');

/** Path of the Piper executable. */
export const piperExecutable: string = path.join(piperDir, 'piper.exe');

/** Folder holding downloaded voice models. */
export const voicesDir: string = path.join(vendorDir, 'voices');

/** Default folder for generated transcripts and audio. */
export const defaultOutputDir: string = path.join(projectRoot, 'outputs');
