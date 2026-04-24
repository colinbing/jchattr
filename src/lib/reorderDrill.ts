const REORDER_PROMPT_DELIMITER = /[:：]/;

export function getReorderTokens(prompt: string, seed: string) {
  const tokens = extractReorderTokens(prompt);

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
