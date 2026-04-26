# Voice Coach Spike

## Purpose

Feature 8E is a spike only. It evaluates whether a browser voice-coach surface is worth pursuing
without adding speech input, pronunciation scoring, or runtime AI to the main study loop.

## Current Recommendation

Start with a narrow **record-and-review pronunciation probe**, not a realtime conversation agent.

The smallest useful path is:

1. Browser captures one short learner recording after an explicit user click.
2. The app measures local capture behavior: permission status, recording duration, MIME type, file
   size, and whether playback works.
3. A future local/backend proxy transcribes the clip with a speech-to-text model.
4. Deterministic comparison checks whether the transcript roughly matches the target line.
5. Optional AI feedback can comment on one narrow thing after the transcript exists.

Do not start with speech-to-speech chat. It is higher-latency to debug, easier to over-scope, and
less aligned with the current deterministic mission model.

## Official OpenAI Docs Checked

- Speech-to-text supports file transcription and realtime transcription. Current higher-quality
  transcription models include `gpt-4o-mini-transcribe` and `gpt-4o-transcribe`; file uploads are
  limited to 25 MB and support common browser-friendly formats including `webm`.
- Realtime transcription can stream ongoing microphone audio, but browser use should authenticate
  through an ephemeral token created by a backend or local proxy.
- Realtime WebRTC is recommended for browser-based speech-to-speech or realtime audio apps, again
  using ephemeral credentials minted server-side.
- Text-to-speech requires clear disclosure that generated voices are AI-generated. It is not needed
  for the first pronunciation probe because the repo already has static listening audio assets.

Sources:

- https://platform.openai.com/docs/guides/speech-to-text
- https://platform.openai.com/docs/guides/realtime-transcription
- https://platform.openai.com/docs/guides/realtime-webrtc
- https://platform.openai.com/docs/guides/text-to-speech

## Prototype Boundary

The isolated prototype route is disabled by default:

```bash
VITE_VOICE_COACH_SPIKE_ENABLED=true
```

When enabled in local development, the route is:

```text
/dev/voice-coach-spike
```

The route is not linked from navigation, Today, Missions, Review, or Settings.

The prototype:

- requests microphone permission only after the user clicks Record
- records a short local clip with `MediaRecorder`
- creates local playback with `URL.createObjectURL`
- shows capture metadata
- does not upload audio
- does not call OpenAI
- does not store audio in app progress
- does not affect mission completion, review, weak points, recommendations, or daily tracking

## Success Criteria For A Future Product Slice

Promote voice coach work only if the spike proves:

- microphone permission UX is understandable on desktop and mobile browsers
- recording/playback is reliable enough in the target browser
- short clips can be transcribed through a proxy with acceptable latency
- transcript matching catches obvious misses without punishing accent
- feedback is narrow enough to help one retry instead of turning into a broad tutor chat

## Rejection Criteria

Do not promote if:

- microphone permission creates too much friction
- transcription latency makes the loop feel slower than typed output
- feedback is vague, overconfident, or not beginner-safe
- pronunciation scoring implies precision the system cannot justify
- implementation requires putting an OpenAI API key in browser code
