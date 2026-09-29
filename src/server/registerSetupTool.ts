import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { defaultCohostVoice, defaultHostVoice, voiceIds } from '../config/voices.js';
import { ensureDependencies } from '../deps/ensureDependencies.js';

/**
 * Registers the `setup_podcast_dependencies` tool, which pre-downloads Piper and voices.
 * @param server - MCP server to register on.
 */
export const registerSetupTool = (server: McpServer): void => {
  server.registerTool(
    'setup_podcast_dependencies',
    {
      title: 'Set up podcast dependencies',
      description: `Download Piper and the given voices if they are missing (also happens automatically on first generation). Available voices: ${voiceIds.join(', ')}.`,
      inputSchema: {
        voices: z.array(z.enum(voiceIds)).default([defaultHostVoice, defaultCohostVoice]),
      },
    },
    async ({ voices }) => {
      try {
        const deps = await ensureDependencies(voices);
        return { content: [{ type: 'text', text: JSON.stringify(deps, null, 2) }] };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return { isError: true, content: [{ type: 'text', text: `Setup failed: ${message}` }] };
      }
    },
  );
};
