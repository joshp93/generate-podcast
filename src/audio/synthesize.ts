import { spawn } from 'node:child_process';
import path from 'node:path';

/** Options for a single Piper synthesis run. */
export interface SynthesizeOptions {
  readonly piper: string;
  readonly model: string;
  readonly text: string;
  readonly outputFile: string;
  readonly lengthScale: number;
  readonly sentenceSilence: number;
}

/**
 * Synthesizes text to a WAV file with Piper.
 * @param options - Engine, voice, text, output path and pacing.
 * @returns Resolves when the WAV file has been written.
 * @throws When Piper cannot start or exits with a non-zero code.
 */
export const synthesize = (options: SynthesizeOptions): Promise<void> =>
  new Promise((resolve, reject) => {
    const child = spawn(
      options.piper,
      [
        '--model', options.model,
        '--output_file', options.outputFile,
        '--length_scale', String(options.lengthScale),
        '--sentence_silence', String(options.sentenceSilence),
      ],
      { cwd: path.dirname(options.piper), stdio: ['pipe', 'ignore', 'pipe'] },
    );
    let stderr = '';
    child.stderr.on('data', (data: Buffer) => {
      stderr += data.toString();
    });
    child.on('error', reject);
    child.on('close', (code) =>
      code === 0 ? resolve() : reject(new Error(`Piper exited with code ${code}: ${stderr.slice(-500)}`)),
    );
    child.stdin.end(options.text, 'utf8');
  });
