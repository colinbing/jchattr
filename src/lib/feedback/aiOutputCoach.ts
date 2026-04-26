import { z } from 'zod';
import type { OutputTask } from '../content/types';
import type { OutputEvaluationResult } from '../outputEvaluation';

const AI_OUTPUT_COACH_CONFIG = {
  enabled: import.meta.env.VITE_AI_OUTPUT_COACH_ENABLED === 'true',
  endpoint: import.meta.env.VITE_AI_OUTPUT_COACH_ENDPOINT?.trim() ?? '',
};

const AiOutputCoachFeedbackSchema = z.object({
  title: z.string().trim().min(1),
  observation: z.string().trim().min(1),
  patternNote: z.string().trim().min(1),
  nextTry: z.string().trim().min(1),
});

export type AiOutputCoachContext = {
  prompt: string;
  learnerAnswer: string;
  acceptableAnswers: string[];
  tokenPatterns?: string[][];
  localEvaluation: Pick<
    OutputEvaluationResult,
    'isAccepted' | 'tone' | 'title' | 'message' | 'expectedAnswer'
  >;
  allowedGrammarTags?: string[];
  allowedVocabTags?: string[];
  support?: string;
};

export type AiOutputCoachFeedback = z.infer<typeof AiOutputCoachFeedbackSchema> & {
  source: 'ai-output-coach';
  safetyNote: string;
};

export type AiOutputCoachResult =
  | {
      status: 'available';
      feedback: AiOutputCoachFeedback;
    }
  | {
      status: 'skipped' | 'disabled' | 'error';
      reason: string;
    };

export type AiOutputCoachRequest = {
  feature: 'typed-output-coach';
  version: 1;
  correctnessLocked: true;
  context: AiOutputCoachContext;
  instructions: string[];
};

export function isAiOutputCoachConfigured() {
  return AI_OUTPUT_COACH_CONFIG.enabled && AI_OUTPUT_COACH_CONFIG.endpoint.length > 0;
}

export function getAiOutputCoachConfigStatus() {
  if (!AI_OUTPUT_COACH_CONFIG.enabled) {
    return {
      configured: false,
      reason: 'VITE_AI_OUTPUT_COACH_ENABLED is not true.',
    };
  }

  if (!AI_OUTPUT_COACH_CONFIG.endpoint) {
    return {
      configured: false,
      reason: 'VITE_AI_OUTPUT_COACH_ENDPOINT is missing.',
    };
  }

  return {
    configured: true,
    reason: 'AI output coach endpoint is configured.',
  };
}

export async function requestAiOutputCoachFeedback({
  task,
  learnerAnswer,
  localEvaluation,
  allowedGrammarTags,
  allowedVocabTags,
  signal,
}: {
  task: Pick<OutputTask, 'prompt' | 'acceptableAnswers' | 'evaluation' | 'hint'>;
  learnerAnswer: string;
  localEvaluation: OutputEvaluationResult | null;
  allowedGrammarTags?: string[];
  allowedVocabTags?: string[];
  signal?: AbortSignal;
}): Promise<AiOutputCoachResult> {
  if (!localEvaluation) {
    return {
      status: 'skipped',
      reason: 'Output coach requires a completed local evaluation first.',
    };
  }

  if (!learnerAnswer.trim()) {
    return {
      status: 'skipped',
      reason: 'Output coach requires a learner answer.',
    };
  }

  if (!isAiOutputCoachConfigured()) {
    return {
      status: 'disabled',
      reason: getAiOutputCoachConfigStatus().reason,
    };
  }

  try {
    const response = await fetch(AI_OUTPUT_COACH_CONFIG.endpoint, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(
        buildAiOutputCoachRequest({
          prompt: task.prompt,
          learnerAnswer,
          acceptableAnswers: task.acceptableAnswers,
          tokenPatterns: task.evaluation?.tokenPatterns,
          localEvaluation,
          allowedGrammarTags,
          allowedVocabTags,
          support: task.hint,
        }),
      ),
      signal,
    });

    if (!response.ok) {
      return {
        status: 'error',
        reason: `AI output coach endpoint returned ${response.status}.`,
      };
    }

    const parsedFeedback = AiOutputCoachFeedbackSchema.parse(await response.json());

    return {
      status: 'available',
      feedback: {
        ...parsedFeedback,
        source: 'ai-output-coach',
        safetyNote:
          'AI coaching only. Correctness was already decided by the local output evaluator.',
      },
    };
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      return {
        status: 'skipped',
        reason: 'AI output coach request was cancelled.',
      };
    }

    return {
      status: 'error',
      reason: error instanceof Error ? error.message : String(error),
    };
  }
}

export function buildAiOutputCoachRequest(
  context: AiOutputCoachContext,
): AiOutputCoachRequest {
  return {
    feature: 'typed-output-coach',
    version: 1,
    correctnessLocked: true,
    context: sanitizeAiOutputCoachContext(context),
    instructions: [
      'Coach only the supplied typed-output response.',
      'Do not decide whether the learner was correct.',
      'Do not override localEvaluation.',
      'Do not introduce grammar outside allowedGrammarTags.',
      'Keep feedback short, beginner-safe, and N5-oriented.',
      'Suggest one next retry, not a full lesson.',
    ],
  };
}

function sanitizeAiOutputCoachContext(context: AiOutputCoachContext): AiOutputCoachContext {
  return {
    prompt: limitText(context.prompt, 300),
    learnerAnswer: limitText(context.learnerAnswer, 300),
    acceptableAnswers: context.acceptableAnswers.slice(0, 4).map((answer) => limitText(answer, 300)),
    tokenPatterns: context.tokenPatterns?.slice(0, 4).map((pattern) =>
      pattern.slice(0, 12).map((token) => limitText(token, 80)),
    ),
    localEvaluation: {
      isAccepted: context.localEvaluation.isAccepted,
      tone: context.localEvaluation.tone,
      title: limitText(context.localEvaluation.title, 120),
      message: limitText(context.localEvaluation.message, 240),
      expectedAnswer: limitText(context.localEvaluation.expectedAnswer, 300),
    },
    allowedGrammarTags: context.allowedGrammarTags?.slice(0, 12),
    allowedVocabTags: context.allowedVocabTags?.slice(0, 16),
    support: context.support ? limitText(context.support, 300) : undefined,
  };
}

function limitText(value: string, maxLength: number) {
  return value.length <= maxLength ? value : `${value.slice(0, maxLength - 1)}…`;
}
