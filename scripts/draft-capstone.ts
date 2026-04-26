/**
 * Draft a review-only capstone story with OpenAI from selected source examples.
 *
 * Usage:
 *   npm run draft:capstone -- --help
 *   npm run draft:capstone -- --chapter=ch02 --packs=6-10 --examples=ex-id-a,ex-id-b --print-source-packet
 *   OPENAI_API_KEY=... npm run draft:capstone -- --chapter=ch02 --packs=6-10 --examples=ex-id-a,ex-id-b
 *
 * Output:
 *   drafts/ai-content/capstones/<chapter>-capstone-draft-<timestamp>.json
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import OpenAI from 'openai';
import { z } from 'zod';
import { contentPacks } from '../src/content/contentPacks';
import { getStarterContent } from '../src/lib/content/loader';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REVIEW_OUTPUT_ROOT = path.join(REPO_ROOT, 'drafts', 'ai-content', 'capstones');
const TMP_REVIEW_OUTPUT_ROOT = path.join('/tmp', 'japanese-os-ai-drafts', 'capstones');
const DEFAULT_MODEL = process.env.OPENAI_CAPSTONE_DRAFT_MODEL ?? 'gpt-4.1';

const DraftLineSchema = z.object({
  draftId: z.string().trim().min(1),
  japanese: z.string().trim().min(1),
  reading: z.string().trim().min(1),
  english: z.string().trim().min(1),
  grammarTags: z.array(z.string().trim().min(1)),
  vocabTags: z.array(z.string().trim().min(1)),
  sourceExampleIds: z.array(z.string().trim().min(1)).min(1),
  sourceLineIds: z.array(z.string().trim().min(1)).optional(),
  auditNotes: z.array(z.string().trim().min(1)),
});

const DraftCheckSchema = z
  .object({
    draftId: z.string().trim().min(1),
    lineDraftId: z.string().trim().min(1),
    prompt: z.string().trim().min(1),
    choices: z.array(z.string().trim().min(1)).min(2),
    answer: z.string().trim().min(1),
    support: z.string().trim().min(1),
    auditNotes: z.array(z.string().trim().min(1)),
  })
  .refine((value) => value.choices.includes(value.answer), {
    message: 'Draft check answer must match one of the provided choices.',
  });

const CapstoneDraftSchema = z.object({
  lineDrafts: z.array(DraftLineSchema).min(1),
  checkDrafts: z.array(DraftCheckSchema),
  auditSummary: z.array(z.string().trim().min(1)).min(1),
});

interface DraftOptions {
  chapterId: string;
  targetPackIds: number[];
  sourceExampleIds: string[];
  style: 'source-exact' | 'beginner-natural';
  allowedTenseStyle: 'polite-only' | 'recognition-safe-plain-style';
  maxLines: number;
  maxChecks: number;
  model: string;
  outputPath: string | null;
  printSourcePacket: boolean;
}

interface SourcePacket {
  task: 'capstone-story';
  targetChapterId: string;
  targetPackIds: number[];
  allowedGrammarLessonIds: string[];
  allowedVocabIds: string[];
  sourceExampleIds: string[];
  sourceExamples: Array<{
    id: string;
    japanese: string;
    reading: string;
    english: string;
    grammarTags: string[];
    vocabTags: string[];
  }>;
  constraints: {
    maxLines: number;
    maxChecks: number;
    style: 'source-exact' | 'beginner-natural';
    allowedTenseStyle: 'polite-only' | 'recognition-safe-plain-style';
    learnerLevel: 'N5-beginner';
  };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  if (!options) {
    return;
  }

  const sourcePacket = buildSourcePacket(options);

  if (options.printSourcePacket) {
    console.log(JSON.stringify(sourcePacket, null, 2));
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error(
      'Missing OPENAI_API_KEY. No draft was written. Use --print-source-packet to audit inputs without calling OpenAI.',
    );
  }

  const outputPath = resolveReviewOnlyOutputPath(options);
  const client = new OpenAI({ apiKey });
  const response = await client.responses.create({
    model: options.model,
    input: buildPrompt(sourcePacket),
    text: {
      format: {
        type: 'json_object',
      },
    },
  });

  const parsedDraft = CapstoneDraftSchema.parse(parseJsonObject(response.output_text));
  validateDraftTraceability(parsedDraft, sourcePacket);
  const output = {
    reviewStatus: 'unreviewed',
    generatedAt: new Date().toISOString(),
    model: options.model,
    productionContentModified: false,
    promotionChecklist: [
      'Confirm every sourceExampleIds entry exists in src/content/exampleSentences.ts.',
      'Confirm grammar and vocabulary stay within the source packet.',
      'Confirm Japanese is correct, beginner-natural, and N5-safe.',
      'Confirm reading, Japanese, and English match exactly.',
      'Run schema validation, typecheck/build, and content reports after any manual promotion.',
    ],
    sourcePacket,
    draft: parsedDraft,
  };

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, 'utf8');

  console.log(`wrote review-only draft -> ${path.relative(REPO_ROOT, outputPath)}`);
  console.log('No production content was modified.');
}

function parseArgs(argv: string[]): DraftOptions | null {
  if (argv.includes('--help') || argv.includes('-h')) {
    printHelp();
    return null;
  }

  const chapterId = readStringFlag(argv, '--chapter') ?? readStringFlag(argv, '--chapter-id');
  const packFlag = readStringFlag(argv, '--packs');
  const exampleFlag = readStringFlag(argv, '--examples');
  const style = readStyleFlag(readStringFlag(argv, '--style') ?? 'beginner-natural');
  const tenseStyle = readTenseStyleFlag(readStringFlag(argv, '--tense-style') ?? 'polite-only');
  const maxLines = readPositiveIntFlag(argv, '--max-lines') ?? 8;
  const maxChecks = readPositiveIntFlag(argv, '--max-checks') ?? 3;
  const model = readStringFlag(argv, '--model') ?? DEFAULT_MODEL;
  const outputPath = readStringFlag(argv, '--output');
  const printSourcePacket = argv.includes('--print-source-packet');

  if (!chapterId) {
    throw new Error('Missing --chapter=<chapter-id>.');
  }

  if (!packFlag) {
    throw new Error('Missing --packs=<pack-range-or-list>, for example --packs=1-5.');
  }

  if (!exampleFlag) {
    throw new Error('Missing --examples=<example-id-list>. Select source examples explicitly.');
  }

  return {
    chapterId,
    targetPackIds: parsePackIds(packFlag),
    sourceExampleIds: parseCsv(exampleFlag),
    style,
    allowedTenseStyle: tenseStyle,
    maxLines,
    maxChecks,
    model,
    outputPath,
    printSourcePacket,
  };
}

function buildSourcePacket(options: DraftOptions): SourcePacket {
  const starterContent = getStarterContent();
  const selectedPacks = contentPacks.filter((pack) => options.targetPackIds.includes(pack.packNumber));

  if (selectedPacks.length !== options.targetPackIds.length) {
    const foundPackIds = new Set(selectedPacks.map((pack) => pack.packNumber));
    const missingPackIds = options.targetPackIds.filter((packId) => !foundPackIds.has(packId));
    throw new Error(`Unknown content pack number(s): ${missingPackIds.join(', ')}`);
  }

  const sourceExamples = options.sourceExampleIds.map((id) => {
    const example = starterContent.byId.exampleSentences[id];

    if (!example) {
      throw new Error(`Unknown source example id: ${id}`);
    }

    return {
      id: example.id,
      japanese: example.japanese,
      reading: example.reading,
      english: example.english,
      grammarTags: example.grammarTags,
      vocabTags: example.vocabTags,
    };
  });

  const allowedExampleIds = new Set(selectedPacks.flatMap((pack) => pack.exampleIds));
  const outsidePackExampleIds = options.sourceExampleIds.filter((id) => !allowedExampleIds.has(id));

  if (outsidePackExampleIds.length > 0) {
    throw new Error(
      `Source examples must come from selected packs. Outside pack range: ${outsidePackExampleIds.join(', ')}`,
    );
  }

  return {
    task: 'capstone-story',
    targetChapterId: options.chapterId,
    targetPackIds: options.targetPackIds,
    allowedGrammarLessonIds: uniqueSorted(selectedPacks.flatMap((pack) => pack.grammarLessonIds)),
    allowedVocabIds: uniqueSorted(selectedPacks.flatMap((pack) => pack.vocabIds)),
    sourceExampleIds: options.sourceExampleIds,
    sourceExamples,
    constraints: {
      maxLines: options.maxLines,
      maxChecks: options.maxChecks,
      style: options.style,
      allowedTenseStyle: options.allowedTenseStyle,
      learnerLevel: 'N5-beginner',
    },
  };
}

function buildPrompt(sourcePacket: SourcePacket) {
  return [
    'You are drafting REVIEW-ONLY Japanese learning content for a local-first N5 app.',
    '',
    'Hard constraints:',
    '- Use only the provided source packet.',
    '- Do not introduce grammar outside allowedGrammarLessonIds.',
    '- Do not introduce vocabulary outside allowedVocabIds unless it already appears in sourceExamples.',
    '- Keep Japanese beginner-natural and Genki-quality.',
    '- Prefer short, clear lines over literary prose.',
    '- Preserve source traceability with sourceExampleIds on every line and check.',
    '- Include reading and English for every line.',
    '- If uncertain, add an audit note instead of guessing.',
    '- Output valid JSON only. Do not write production code.',
    '',
    'Return exactly this JSON object shape:',
    '{',
    '  "lineDrafts": [',
    '    {',
    '      "draftId": "string",',
    '      "japanese": "string",',
    '      "reading": "string",',
    '      "english": "string",',
    '      "grammarTags": ["string"],',
    '      "vocabTags": ["string"],',
    '      "sourceExampleIds": ["string"],',
    '      "auditNotes": ["string"]',
    '    }',
    '  ],',
    '  "checkDrafts": [',
    '    {',
    '      "draftId": "string",',
    '      "lineDraftId": "string",',
    '      "prompt": "string",',
    '      "choices": ["string", "string"],',
    '      "answer": "string matching one choices entry",',
    '      "support": "string",',
    '      "auditNotes": ["string"]',
    '    }',
    '  ],',
    '  "auditSummary": ["string"]',
    '}',
    '',
    `Task: Draft up to ${sourcePacket.constraints.maxLines} capstone lines and up to ${sourcePacket.constraints.maxChecks} comprehension checks.`,
    '',
    'Source packet:',
    JSON.stringify(sourcePacket, null, 2),
  ].join('\n');
}

function resolveReviewOnlyOutputPath(options: DraftOptions) {
  const outputPath =
    options.outputPath ??
    path.join(
      REVIEW_OUTPUT_ROOT,
      `${slugify(options.chapterId)}-capstone-draft-${timestampForFileName()}.json`,
    );

  const resolvedPath = path.resolve(outputPath);
  const allowedRoots = [REVIEW_OUTPUT_ROOT, TMP_REVIEW_OUTPUT_ROOT].map((root) => path.resolve(root));
  const isAllowedReviewPath = allowedRoots.some(
    (root) => resolvedPath === root || resolvedPath.startsWith(`${root}${path.sep}`),
  );

  if (!isAllowedReviewPath) {
    throw new Error(
      `Refusing to write outside review-only draft roots. Use ${path.relative(REPO_ROOT, REVIEW_OUTPUT_ROOT)} or ${TMP_REVIEW_OUTPUT_ROOT}.`,
    );
  }

  return resolvedPath;
}

function validateDraftTraceability(draft: z.infer<typeof CapstoneDraftSchema>, sourcePacket: SourcePacket) {
  const allowedSourceExampleIds = new Set(sourcePacket.sourceExampleIds);
  const lineDraftIds = new Set(draft.lineDrafts.map((line) => line.draftId));

  for (const line of draft.lineDrafts) {
    const invalidSourceIds = line.sourceExampleIds.filter((id) => !allowedSourceExampleIds.has(id));

    if (invalidSourceIds.length > 0) {
      throw new Error(
        `Draft line ${line.draftId} references source examples outside the packet: ${invalidSourceIds.join(', ')}`,
      );
    }
  }

  for (const check of draft.checkDrafts) {
    if (!lineDraftIds.has(check.lineDraftId)) {
      throw new Error(
        `Draft check ${check.draftId} references unknown line draft id: ${check.lineDraftId}`,
      );
    }
  }
}

function parseJsonObject(text: string) {
  const trimmed = text.trim();
  const withoutFence = trimmed
    .replace(/^```(?:json)?\s*/u, '')
    .replace(/\s*```$/u, '')
    .trim();

  return JSON.parse(withoutFence);
}

function readStringFlag(argv: string[], flag: string) {
  const value = argv.find((arg) => arg.startsWith(`${flag}=`));

  if (!value) {
    return null;
  }

  return value.slice(flag.length + 1).trim();
}

function readPositiveIntFlag(argv: string[], flag: string) {
  const value = readStringFlag(argv, flag);

  if (!value) {
    return null;
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`${flag} must be a positive integer.`);
  }

  return parsed;
}

function parseCsv(value: string) {
  const items = value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  if (items.length === 0) {
    throw new Error('Expected at least one comma-separated value.');
  }

  return items;
}

function parsePackIds(value: string) {
  const packIds = value.split(',').flatMap((part) => {
    const trimmedPart = part.trim();
    const rangeMatch = trimmedPart.match(/^(\d+)-(\d+)$/u);

    if (rangeMatch) {
      const start = Number(rangeMatch[1]);
      const end = Number(rangeMatch[2]);

      if (start > end) {
        throw new Error(`Invalid descending pack range: ${trimmedPart}`);
      }

      return Array.from({ length: end - start + 1 }, (_, index) => start + index);
    }

    const packId = Number(trimmedPart);

    if (!Number.isInteger(packId) || packId <= 0) {
      throw new Error(`Invalid pack number: ${trimmedPart}`);
    }

    return [packId];
  });

  return uniqueSorted(packIds);
}

function readStyleFlag(value: string) {
  if (value === 'source-exact' || value === 'beginner-natural') {
    return value;
  }

  throw new Error('--style must be source-exact or beginner-natural.');
}

function readTenseStyleFlag(value: string) {
  if (value === 'polite-only' || value === 'recognition-safe-plain-style') {
    return value;
  }

  throw new Error('--tense-style must be polite-only or recognition-safe-plain-style.');
}

function uniqueSorted<T extends string | number>(items: T[]) {
  return Array.from(new Set(items)).sort((left, right) => {
    if (typeof left === 'number' && typeof right === 'number') {
      return left - right;
    }

    return String(left).localeCompare(String(right));
  });
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, '-')
    .replace(/^-|-$/gu, '');
}

function timestampForFileName() {
  return new Date().toISOString().replace(/[:.]/gu, '-');
}

function printHelp() {
  console.log(`
Review-only capstone draft script

Usage:
  npm run draft:capstone -- --chapter=ch02 --packs=6-10 --examples=ex-id-a,ex-id-b
  npm run draft:capstone -- --chapter=ch02 --packs=6-10 --examples=ex-id-a,ex-id-b --print-source-packet

Required flags:
  --chapter=<id>         Target chapter id, for example ch02.
  --packs=<range|list>   Source pack numbers, for example 1-5 or 1,2,3.
  --examples=<ids>       Comma-separated source example ids. They must be in the selected packs.

Optional flags:
  --style=<value>        source-exact or beginner-natural. Default: beginner-natural.
  --tense-style=<value>  polite-only or recognition-safe-plain-style. Default: polite-only.
  --max-lines=<number>   Default: 8.
  --max-checks=<number>  Default: 3.
  --model=<model>        Default: OPENAI_CAPSTONE_DRAFT_MODEL or ${DEFAULT_MODEL}.
  --output=<path>        Must be under drafts/ai-content/capstones or /tmp/japanese-os-ai-drafts/capstones.
  --print-source-packet  Print the source packet and do not call OpenAI.

OpenAI usage:
  Set OPENAI_API_KEY only when you want to generate a draft. Without a key, no draft is written.
`.trim());
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Capstone draft failed: ${message}`);
  process.exitCode = 1;
});
