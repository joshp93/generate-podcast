import { defaultCohostVoice, defaultHostVoice } from './config/voices.js';
import { ensureDependencies } from './deps/ensureDependencies.js';
import { log } from './deps/log.js';

await ensureDependencies([defaultHostVoice, defaultCohostVoice]);
log('Dependencies ready');
