Generated listening audio files belong in this folder.

Default convention:
- `/audio/listening/<listening-item-id>.mp3`

Generate them with:
- `OPENAI_API_KEY=... npm run generate:listening-audio`

Optional flags/env:
- `npm run generate:listening-audio -- --force`
- `npm run generate:listening-audio -- --ids=listening-self-intro,listening-kore-nan`
- `LISTENING_TTS_VOICE=cedar`
- `LISTENING_TTS_MODEL=gpt-4o-mini-tts`

If files are missing, the app falls back to the existing transcript-first listening flow.
