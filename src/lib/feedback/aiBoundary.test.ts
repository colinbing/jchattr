import { describe, expect, it, vi } from 'vitest';
import {
  buildAiMistakeExplanationRequest,
  requestAiMistakeExplanationFallback,
  type AiMistakeExplanationResult,
} from './aiMistakeExplanations';
import {
  buildAiOutputCoachRequest,
  requestAiOutputCoachFeedback,
  type AiOutputCoachFeedback,
  type AiOutputCoachResult,
} from './aiOutputCoach';

describe('AI runtime boundaries', () => {
  it('builds mistake-explanation requests with locked correctness and text limits', () => {
    const request = buildAiMistakeExplanationRequest({
      surface: 'grammar',
      prompt: 'p'.repeat(350),
      correctAnswer: 'c'.repeat(350),
      learnerAnswer: 'l'.repeat(350),
      allowedGrammarTags: Array.from({ length: 20 }, (_, index) => `grammar-${index}`),
      allowedVocabTags: Array.from({ length: 20 }, (_, index) => `vocab-${index}`),
      sourceJapanese: 'j'.repeat(350),
      sourceReading: 'r'.repeat(350),
      sourceEnglish: 'e'.repeat(350),
      support: 's'.repeat(350),
    });

    expect(request).toMatchObject({
      feature: 'mistake-explanation-fallback',
      version: 1,
      correctnessLocked: true,
    });
    expect(request.context.prompt).toHaveLength(300);
    expect(request.context.prompt.endsWith('…')).toBe(true);
    expect(request.context.correctAnswer).toHaveLength(300);
    expect(request.context.learnerAnswer).toHaveLength(300);
    expect(request.context.allowedGrammarTags).toHaveLength(12);
    expect(request.context.allowedVocabTags).toHaveLength(16);
    expect(request.instructions.join(' ')).toContain(
      'Do not decide whether the learner was correct.',
    );
  });

  it('builds output-coach requests with local evaluation locked into the payload', () => {
    const request = buildAiOutputCoachRequest({
      prompt: 'Translate: I am Tanaka.'.repeat(20),
      learnerAnswer: 'わたしはたなかです。'.repeat(40),
      acceptableAnswers: ['a'.repeat(350), 'b'.repeat(350), 'c', 'd', 'e'],
      tokenPatterns: [
        Array.from({ length: 20 }, (_, index) => `token-${index}`),
        ['extra'],
        ['extra-2'],
        ['extra-3'],
        ['extra-4'],
      ],
      localEvaluation: {
        isAccepted: false,
        tone: 'close',
        title: 'Needs the topic marker'.repeat(10),
        message: 'Particle looks off.'.repeat(30),
        expectedAnswer: 'わたしはたなかです。'.repeat(40),
      },
      allowedGrammarTags: Array.from({ length: 20 }, (_, index) => `grammar-${index}`),
      allowedVocabTags: Array.from({ length: 20 }, (_, index) => `vocab-${index}`),
      support: 'Remember the topic marker.'.repeat(30),
    });

    expect(request).toMatchObject({
      feature: 'typed-output-coach',
      version: 1,
      correctnessLocked: true,
    });
    expect(request.context.localEvaluation).toMatchObject({
      isAccepted: false,
      tone: 'close',
    });
    expect(request.context.prompt).toHaveLength(300);
    expect(request.context.learnerAnswer).toHaveLength(300);
    expect(request.context.acceptableAnswers).toHaveLength(4);
    expect(request.context.acceptableAnswers[0]).toHaveLength(300);
    expect(request.context.tokenPatterns).toHaveLength(4);
    expect(request.context.tokenPatterns?.[0]).toHaveLength(12);
    expect(request.context.localEvaluation.title).toHaveLength(120);
    expect(request.context.localEvaluation.message).toHaveLength(240);
    expect(request.context.localEvaluation.expectedAnswer).toHaveLength(300);
    expect(request.instructions.join(' ')).toContain('Do not override localEvaluation.');
  });

  it('keeps browser fallbacks disabled when endpoint env is not configured', async () => {
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockRejectedValue(new Error('fetch should not be called'));

    try {
      await expect(
        requestAiMistakeExplanationFallback({
          deterministicExplanation: null,
          context: {
            surface: 'grammar',
            prompt: 'Pick the right particle.',
            correctAnswer: 'は',
            learnerAnswer: 'が',
          },
        }),
      ).resolves.toMatchObject({
        status: 'disabled',
      });

      await expect(
        requestAiOutputCoachFeedback({
          task: {
            prompt: 'Translate: I am Tanaka.',
            acceptableAnswers: ['わたしはたなかです。'],
          },
          learnerAnswer: 'わたしがたなかです。',
          localEvaluation: {
            isAccepted: false,
            tone: 'close',
            title: 'Close',
            message: 'Particle looks off.',
            expectedAnswer: 'わたしはたなかです。',
          },
        }),
      ).resolves.toMatchObject({
        status: 'disabled',
      });

      expect(fetchSpy).not.toHaveBeenCalled();
    } finally {
      fetchSpy.mockRestore();
    }
  });

  it('does not represent AI correctness overrides in result types', () => {
    type MistakeResultCanOverrideCorrectness =
      'isAccepted' extends keyof Extract<
        AiMistakeExplanationResult,
        { status: 'available' }
      >['explanation']
        ? true
        : false;
    type OutputCoachCanOverrideCorrectness =
      'isAccepted' extends keyof AiOutputCoachFeedback ? true : false;
    type OutputCoachResultCanMarkCompletion =
      'completeMission' extends keyof Extract<
        AiOutputCoachResult,
        { status: 'available' }
      >['feedback']
        ? true
        : false;

    const mistakeResultCanOverrideCorrectness: MistakeResultCanOverrideCorrectness = false;
    const outputCoachCanOverrideCorrectness: OutputCoachCanOverrideCorrectness = false;
    const outputCoachResultCanMarkCompletion: OutputCoachResultCanMarkCompletion = false;

    expect(mistakeResultCanOverrideCorrectness).toBe(false);
    expect(outputCoachCanOverrideCorrectness).toBe(false);
    expect(outputCoachResultCanMarkCompletion).toBe(false);
  });
});
