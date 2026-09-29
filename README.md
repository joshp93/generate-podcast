# generate-podcast MCP

Local stdio MCP server. Claude writes a cheesy talk-show transcript (host + co-host, facts only, one or two bad jokes) and this server turns it into audio with [Piper](https://github.com/rhasspy/piper) TTS, fully offline after the first run.

## Setup

```powershell
pnpm install
pnpm build
```

Piper and voices download automatically on first use (or run `pnpm setup:deps`, or call the `setup_podcast_dependencies` tool). They are stored in `vendor/`.

Register globally:

```powershell
claude mcp add --scope user generate-podcast -- node C:\apps\generate-podcast\dist\index.js
```

## Tools

| Tool | Purpose |
| --- | --- |
| `get_podcast_style_guide` | Rules for writing the transcript. |
| `setup_podcast_dependencies` | Pre-download Piper and voices. |
| `generate_podcast_audio` | Synthesize `segments` (`host` / `cohost` turns) into MP3/WAV plus a transcript file. |

`generate_podcast_audio` options, all settable from the prompt: `speed` (multiplier, default 1.2), `paragraphPauseSeconds`, `sectionPauseSeconds` (with `newSection` on a segment), `replacements` (e.g. `CoCode` → `Co Code`, audio only), `hostVoice` / `cohostVoice` (`ryan`, `amy`, `lessac`, `joe`, `alan`), `format` (`mp3`, `wav`, `both`), `outputDir` (default `outputs/`), `keepParts`.

Legacy Python scripts and files from the previous version are in `legacy/`.
