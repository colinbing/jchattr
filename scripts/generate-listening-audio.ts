/**
 * Generate static listening audio into public/audio/listening using the OpenAI Speech API.
 *
 * Usage:
 *   OPENAI_API_KEY=... npm run generate:listening-audio
 *   OPENAI_API_KEY=... LISTENING_TTS_VOICE=cedar npm run generate:listening-audio -- --force
 *
 * Output:
 *   public/audio/listening/<listening-item-id>.mp3
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import OpenAI from 'openai';
import { listeningItems } from '../src/content/listeningItems';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC_ROOT = path.join(REPO_ROOT, 'public');

const DEFAULT_MODEL = process.env.LISTENING_TTS_MODEL ?? 'gpt-4o-mini-tts';
const DEFAULT_VOICE = process.env.LISTENING_TTS_VOICE ?? 'marin';
const DEFAULT_FORMAT = process.env.LISTENING_TTS_FORMAT ?? 'mp3';
const DEFAULT_INSTRUCTIONS =
  process.env.LISTENING_TTS_INSTRUCTIONS ??
  'Speak in clear natural Japanese at a calm beginner-friendly pace.';
const DEFAULT_SPEED = Number(process.env.LISTENING_TTS_SPEED ?? '0.92');

const args = process.argv.slice(2);
const force = args.includes('--force');
const requestedIds = readIdsFlag(args);

async function main() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('Missing OPENAI_API_KEY. Set it in your environment before running this script.');
  }

  const client = new OpenAI({ apiKey });
  const items = requestedIds
    ? listeningItems.filter((item) => requestedIds.includes(item.id))
    : listeningItems;

  if (requestedIds && items.length !== requestedIds.length) {
    const foundIds = new Set(items.map((item) => item.id));
    const missingIds = requestedIds.filter((id) => !foundIds.has(id));
    throw new Error(`Unknown listening item ids: ${missingIds.join(', ')}`);
  }

  if (items.length === 0) {
    console.log('No listening items selected.');
    return;
  }

  console.log(
    `Generating ${items.length} listening audio file(s) with model=${DEFAULT_MODEL}, voice=${DEFAULT_VOICE}.`,
  );

  for (const item of items) {
    const outputFilePath = resolveOutputFilePath(item.id, item.audioRef);
    const responseFormat = getResponseFormat(outputFilePath);

    await fs.mkdir(path.dirname(outputFilePath), { recursive: true });

    if (!force && (await fileExists(outputFilePath))) {
      console.log(`skip ${item.id} -> ${path.relative(REPO_ROOT, outputFilePath)}`);
      continue;
    }

    const audio = await client.audio.speech.create({
      model: DEFAULT_MODEL,
      voice: DEFAULT_VOICE,
      input: item.transcript,
      instructions: DEFAULT_INSTRUCTIONS,
      response_format: responseFormat,
      speed: DEFAULT_SPEED,
    });

    const buffer = Buffer.from(await audio.arrayBuffer());
    await fs.writeFile(outputFilePath, buffer);

    console.log(`wrote ${item.id} -> ${path.relative(REPO_ROOT, outputFilePath)}`);
  }
}

function readIdsFlag(argv: string[]) {
  const idsFlag = argv.find((arg) => arg.startsWith('--ids='));

  if (!idsFlag) {
    return null;
  }

  return idsFlag
    .slice('--ids='.length)
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
}

function resolveOutputFilePath(itemId: string, audioRef?: string) {
  if (audioRef) {
    return path.join(PUBLIC_ROOT, audioRef.replace(/^\//, ''));
  }

  return path.join(PUBLIC_ROOT, 'audio', 'listening', `${itemId}.${DEFAULT_FORMAT}`);
}

function getResponseFormat(outputFilePath: string) {
  const extension = path.extname(outputFilePath).replace(/^\./, '');

  switch (extension) {
    case 'mp3':
    case 'opus':
    case 'aac':
    case 'flac':
    case 'wav':
    case 'pcm':
      return extension;
    default:
      return DEFAULT_FORMAT;
  }
}

async function fileExists(filePath: string) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Listening audio generation failed: ${message}`);
  process.exitCode = 1;
});
