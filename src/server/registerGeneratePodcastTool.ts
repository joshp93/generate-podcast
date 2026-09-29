import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { defaultSettings } from '../config/defaults.js';
import { voiceIds } from '../config/voices.js';
import { generatePodcast } from '../podcast/generatePodcast.js';

const description = `Generate a two-voice (host and co-host) talk-show podcast as audio from a transcript you have already written, and save the transcript alongside it. Downloads Piper and the voices on first use.

Before writing the transcript, call get_podcast_style_guide and follow it: confirm the settings and length with the user first, then write the transcript, then call this tool.`;

/**
 * Registers the `generate_podcast_audio` tool.
 * @param server - MCP server to register on.
 */
export const registerGeneratePodcastTool = (server: McpServer): void => {
  server.registerTool(
    'generate_podcast_audio',
    {
      title: 'Generate podcast audio',
      description,
      inputSchema: {
        title: z.string().min(1).describe('Podcast title; also used for output file names.'),
        segments: z
          .array(
            z.object({
              speaker: z.enum(['host', 'cohost']),
              text: z.string().min(1).describe('Spoken text. Line breaks separate paragraphs.'),
              newSection: z.boolean().optional().describe('Start a new topic: uses the longer section pause before it.'),
            }),
          )
          .min(1)
          .describe('Dialogue turns in order, normally alternating host and cohost.'),
        replacements: z
          .array(z.object({ from: z.string().min(1), to: z.string() }))
          .default([])
          .describe('Spoken-text swaps, e.g. {"from":"CoCode","to":"Co Code"}. Applied to audio only; the transcript keeps the original.'),
        caseSensitiveReplacements: z.boolean().default(defaultSettings.caseSensitiveReplacements),
        speed: z.number().min(0.5).max(2).default(defaultSettings.speed).describe('Speech speed multiplier; 1 is the voice default.'),
        paragraphPauseSeconds: z.number().min(0).max(10).default(defaultSettings.paragraphPauseSeconds).describe('Silence after each paragraph.'),
        sectionPauseSeconds: z.number().min(0).max(10).default(defaultSettings.sectionPauseSeconds).describe('Silence before a segment flagged newSection.'),
        hostVoice: z.enum(voiceIds).default(defaultSettings.hostVoice),
        cohostVoice: z.enum(voiceIds).default(defaultSettings.cohostVoice),
        format: z.enum(['mp3', 'wav', 'both']).default(defaultSettings.format),
        outputDir: z.string().default(defaultSettings.outputDir).describe('Folder for the audio and transcript files.'),
        keepParts: z.boolean().default(defaultSettings.keepParts).describe('Also keep the individual per-paragraph WAV clips.'),
      },
    },
    async (input) => {
      try {
        const result = await generatePodcast(input);
        return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return { isError: true, content: [{ type: 'text', text: `Podcast generation failed: ${message}` }] };
      }
    },
  );
};
