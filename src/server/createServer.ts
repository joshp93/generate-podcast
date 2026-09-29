import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerGeneratePodcastTool } from './registerGeneratePodcastTool.js';
import { registerSetupTool } from './registerSetupTool.js';
import { registerStyleGuide } from './registerStyleGuide.js';

/**
 * Builds the podcast MCP server with all tools and prompts registered.
 * @returns The configured server.
 */
export const createServer = (): McpServer => {
  const server = new McpServer({ name: 'generate-podcast', version: '1.0.0' });
  registerStyleGuide(server);
  registerSetupTool(server);
  registerGeneratePodcastTool(server);
  return server;
};
