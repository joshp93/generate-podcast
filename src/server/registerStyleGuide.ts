import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { styleGuide } from '../podcast/styleGuide.js';

/**
 * Registers a `get_podcast_style_guide` tool and a `podcast_transcript` prompt exposing the transcript rules.
 * @param server - MCP server to register on.
 */
export const registerStyleGuide = (server: McpServer): void => {
  server.registerTool(
    'get_podcast_style_guide',
    {
      title: 'Get podcast style guide',
      description: 'Call this FIRST for any podcast request, before writing anything. Returns the workflow: confirm default settings and length with the user, then write the transcript, then generate audio.',
    },
    async () => ({ content: [{ type: 'text', text: styleGuide }] }),
  );

  server.registerPrompt(
    'podcast_transcript',
    { title: 'Podcast transcript', description: 'Write a talk-show transcript from the material in the conversation, then generate the audio.' },
    () => ({
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `Turn the material we have discussed into a podcast.\n\n${styleGuide}`,
          },
        },
      ],
    }),
  );
};
