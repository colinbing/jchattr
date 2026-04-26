import { z } from 'zod';
import type { MistakeExplanation } from './mistakeExplanations';

const AI_MISTAKE_EXPLANATION_CONFIG = {
  enabled: import.meta.env.VITE_AI_MISTAKE_EXPLANATIONS_ENABLED === 'true',
  endpoint: import.meta.env.VITE_AI_MISTAKE_EXPLANATION_ENDPOINT?.trim() ?? '',
};

const AiMistakeExplanationResponseSchema = z.object({
  title: z.string().trim().min(1),
  correctPattern: z.string().trim().min(1),
  likelyConfusion: z.string().trim().min(1).optional(),
  explanation: z.string().trim().min(1),
  retryHint: z.string().trim().min(1),
});

export type AiMistakeExplanationSurface = 'grammar' | 'listening' | 'reading' | 'output';

export type AiMistakeExplanationContext = {
  surface: AiMistakeExplanationSurface;
  prompt: string;
  correctAnswer: string;
  learnerAnswer: string | null;
  allowedGrammarTags?: string[];
  allowedVocabTags?: string[];
  sourceJapanese?: string;
  sourceReading?: string;
  sourceEnglish?: string;
  support?: string;
};

export type AiMistakeExplanationResult =
  | {
      status: 'available';
      explanation: MistakeExplanation;
    }
  | {
      status: 'skipped' | 'disabled' | 'error';
      reason: string;
    };

export type AiMistakeExplanationRequest = {
  feature: 'mistake-explanation-fallback';
  version: 1;
  correctnessLocked: true;
  context: AiMistakeExplanationContext;
  instructions: string[];
};

export function isAiMistakeExplanationConfigured() {
  return AI_MISTAKE_EXPLANATION_CONFIG.enabled && AI_MISTAKE_EXPLANATION_CONFIG.endpoint.length > 0;
}

export function getAiMistakeExplanationConfigStatus() {
  if (!AI_MISTAKE_EXPLANATION_CONFIG.enabled) {
    return {
      configured: false,
      reason: 'VITE_AI_MISTAKE_EXPLANATIONS_ENABLED is not true.',
    };
  }

  if (!AI_MISTAKE_EXPLANATION_CONFIG.endpoint) {
    return {
      configured: false,
      reason: 'VITE_AI_MISTAKE_EXPLANATION_ENDPOINT is missing.',
    };
  }

  return {
    configured: true,
    reason: 'AI mistake fallback endpoint is configured.',
  };
}

export async function requestAiMistakeExplanationFallback({
  deterministicExplanation,
  context,
  signal,
}: {
  deterministicExplanation: MistakeExplanation | null;
  context: AiMistakeExplanationContext;
  signal?: AbortSignal;
}): Promise<AiMistakeExplanationResult> {
  if (deterministicExplanation) {
    return {
      status: 'skipped',
      reason: 'Deterministic explanation already exists.',
    };
  }

  if (!isAiMistakeExplanationConfigured()) {
    return {
      status: 'disabled',
      reason: getAiMistakeExplanationConfigStatus().reason,
    };
  }

  try {
    const response = await fetch(AI_MISTAKE_EXPLANATION_CONFIG.endpoint, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(buildAiMistakeExplanationRequest(context)),
      signal,
    });

    if (!response.ok) {
      return {
        status: 'error',
        reason: `AI fallback endpoint returned ${response.status}.`,
      };
    }

    const parsedResponse = AiMistakeExplanationResponseSchema.parse(await response.json());

    return {
      status: 'available',
      explanation: {
        ...parsedResponse,
        source: 'ai-fallback',
        safetyNote:
          'AI explanation only. Correctness was already decided by the deterministic mission check.',
      },
    };
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      return {
        status: 'skipped',
        reason: 'AI fallback request was cancelled.',
      };
    }

    return {
      status: 'error',
      reason: error instanceof Error ? error.message : String(error),
    };
  }
}

export function buildAiMistakeExplanationRequest(
  context: AiMistakeExplanationContext,
): AiMistakeExplanationRequest {
  return {
    feature: 'mistake-explanation-fallback',
    version: 1,
    correctnessLocked: true,
    context: sanitizeAiMistakeExplanationContext(context),
    instructions: [
      'Explain only the supplied missed item.',
      'Do not decide whether the learner was correct.',
      'Do not introduce grammar outside allowedGrammarTags.',
      'Keep the explanation short, beginner-safe, and N5-oriented.',
      'If the context is insufficient, return a conservative retry hint instead of guessing.',
    ],
  };
}

function sanitizeAiMistakeExplanationContext(
  context: AiMistakeExplanationContext,
): AiMistakeExplanationContext {
  return {
    surface: context.surface,
    prompt: limitText(context.prompt, 300),
    correctAnswer: limitText(context.correctAnswer, 300),
    learnerAnswer: context.learnerAnswer ? limitText(context.learnerAnswer, 300) : null,
    allowedGrammarTags: context.allowedGrammarTags?.slice(0, 12),
    allowedVocabTags: context.allowedVocabTags?.slice(0, 16),
    sourceJapanese: context.sourceJapanese ? limitText(context.sourceJapanese, 300) : undefined,
    sourceReading: context.sourceReading ? limitText(context.sourceReading, 300) : undefined,
    sourceEnglish: context.sourceEnglish ? limitText(context.sourceEnglish, 300) : undefined,
    support: context.support ? limitText(context.support, 300) : undefined,
  };
}

function limitText(value: string, maxLength: number) {
  return value.length <= maxLength ? value : `${value.slice(0, maxLength - 1)}…`;
}
