/**
 * Writes a diagnostic line to stderr (stdout is reserved for the MCP protocol).
 * @param message - Message to log.
 */
export const log = (message: string): void => {
  process.stderr.write(`[generate-podcast] ${message}\n`);
};
