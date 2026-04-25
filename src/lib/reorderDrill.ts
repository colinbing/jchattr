const REORDER_PROMPT_DELIMITER = /[:：]/;
const TARGET_PARTICLES_BY_FOCUS = new Map<string, string[]>([
  ['grammar-destination-ni', ['に']],
  ['grammar-time-ni', ['に']],
  ['grammar-weekdays-ni', ['に']],
]);

type ReorderTokenOptions = {
  focusId?: string;
};

export function getReorderTokens(
  prompt: string,
  seed: string,
  options: ReorderTokenOptions = {},
) {
  const tokens = splitTargetParticles(
    extractReorderTokens(prompt),
    getTargetParticles(options.focusId),
  );

  if (tokens.length <= 1) {
    return tokens;
  }

  const shuffledEntries = tokens
    .map((token, index) => ({
      token,
      index,
      rank: hashReorderSeed(`${seed}:${index}:${token}`),
    }))
    .sort((left, right) => {
      if (left.rank !== right.rank) {
        return left.rank - right.rank;
      }

      return left.index - right.index;
    });

  if (shuffledEntries.every((entry, index) => entry.index === index)) {
    return rotateTokens(tokens);
  }

  return shuffledEntries.map((entry) => entry.token);
}

function extractReorderTokens(prompt: string) {
  const promptParts = prompt.split(REORDER_PROMPT_DELIMITER);
  const chunkSource = promptParts.length > 1 ? promptParts.slice(1).join(':') : prompt;

  return chunkSource
    .split('/')
    .map((token) => token.trim())
    .filter(Boolean);
}

export function formatReorderPrompt(prompt: string) {
  return extractReorderTokens(prompt).length > 1
    ? 'Put the chunks in order.'
    : prompt;
}

function getTargetParticles(focusId: string | undefined) {
  if (!focusId) {
    return [];
  }

  return TARGET_PARTICLES_BY_FOCUS.get(focusId) ?? [];
}

function splitTargetParticles(tokens: string[], particles: string[]) {
  if (particles.length === 0) {
    return tokens;
  }

  return tokens.flatMap((token) => {
    const particle = particles.find((candidate) => {
      return token.length > candidate.length && token.endsWith(candidate);
    });

    if (!particle) {
      return [token];
    }

    return [token.slice(0, -particle.length), particle].filter(Boolean);
  });
}

function rotateTokens(tokens: string[]) {
  if (tokens.length <= 1) {
    return tokens;
  }

  return [...tokens.slice(1), tokens[0]];
}

function hashReorderSeed(seed: string) {
  let hash = 0;

  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 33 + seed.charCodeAt(index)) >>> 0;
  }

  return hash;
}
