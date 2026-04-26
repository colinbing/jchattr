/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AI_MISTAKE_EXPLANATIONS_ENABLED?: string;
  readonly VITE_AI_MISTAKE_EXPLANATION_ENDPOINT?: string;
  readonly VITE_AI_OUTPUT_COACH_ENABLED?: string;
  readonly VITE_AI_OUTPUT_COACH_ENDPOINT?: string;
  readonly VITE_VOICE_COACH_SPIKE_ENABLED?: string;
}
