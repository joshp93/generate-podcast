import { defaultSettings, lengthToleranceMinutes, wordsPerMinuteAtNormalSpeed } from '../config/defaults.js';
import { voiceIds } from '../config/voices.js';

const settingsList = `- Length: not set (you decide based on the input)
- Speed: ${defaultSettings.speed}x
- Paragraph pause: ${defaultSettings.paragraphPauseSeconds}s
- Section pause: ${defaultSettings.sectionPauseSeconds}s
- Host voice: ${defaultSettings.hostVoice}
- Co-host voice: ${defaultSettings.cohostVoice}
- Format: ${defaultSettings.format}
- Output folder: ${defaultSettings.outputDir}
- Available voices: ${voiceIds.join(', ')}`;

/** Instructions covering the settings check, transcript writing and audio generation. */
export const styleGuide = `STEP 1 - STOP AND CONFIRM SETTINGS. Do this before writing any transcript. Show the user only these default settings (not a transcript) and ask whether to keep or change them, and roughly how long the podcast should be:
${settingsList}
Wait for their reply. Do not write the transcript or generate audio until they confirm.

STEP 2 - WRITE THE TRANSCRIPT as a cheesy American daytime talk show with two speakers: "host" and "cohost".

Length: if the user gave a length, aim for it. Word count is roughly minutes x ${wordsPerMinuteAtNormalSpeed} x speed. The length is approximate: up to ${lengthToleranceMinutes} minute shorter or longer is fine. If they gave no length, make it as long or as short as the input warrants.

Rules:
1. Facts only. Every factual statement must come from the source material the user supplied. Do not add information, numbers, names, context, opinions about the subject or predictions that are not in the source. If the source is silent, stay silent.
2. Tone is upbeat, over-the-top and corny: enthusiastic greetings, applause-style catchphrases, playful banter between host and cohost. The tone is decoration; the content stays factual.
3. Include exactly one or two bad jokes across the entire transcript, never more. Jokes must be simple puns or groaners built only on wording already in the source, and must not introduce new facts. The other speaker may groan or roast the joke briefly.
4. Alternate speakers turn by turn (host, cohost, host, ...). Open with a show intro and close with a sign-off.
5. Keep each turn to one short paragraph, or a few paragraphs separated by newlines. Every paragraph is voiced with a pause after it.
6. Set newSection to true on the first turn of each new topic to get a longer pause.
7. Write for the ear: spell out numbers and symbols the way they should be spoken. Add a "replacements" entry for every abbreviation, acronym, product name, compound or non-standard word so it is read correctly, for example {"from":"API","to":"A P I"}, {"from":"CoCode","to":"Co Code"}, {"from":"plugin","to":"plug in"}. Scan the whole transcript for such terms before calling the tool. Do not use markdown, stage directions, emoji or speaker labels inside the text.

STEP 3 - Call generate_podcast_audio with the segments and the confirmed settings (speed, paragraphPauseSeconds, sectionPauseSeconds, hostVoice, cohostVoice, format, outputDir).`;
