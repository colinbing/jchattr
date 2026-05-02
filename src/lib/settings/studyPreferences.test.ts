import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  readStudyPreferences,
  STUDY_PREFERENCES_STORAGE_KEY,
} from './studyPreferences';

describe('studyPreferences', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('parses legacy records with focusMode safely', () => {
    const localStorage = createLocalStorageStub({
      [STUDY_PREFERENCES_STORAGE_KEY]: JSON.stringify({
        version: 1,
        focusMode: 'more-listening',
        readingDisplayMode: 'kana-support',
        updatedAt: '2026-01-01T00:00:00.000Z',
      }),
    });
    vi.stubGlobal('window', {
      localStorage,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    });

    const preferences = readStudyPreferences();

    expect(preferences).toEqual({
      version: 1,
      readingDisplayMode: 'kana-support',
      updatedAt: '2026-01-01T00:00:00.000Z',
    });
    expect('focusMode' in preferences).toBe(false);
  });
});

function createLocalStorageStub(entries: Record<string, string>) {
  const store = new Map(Object.entries(entries));

  return {
    getItem: vi.fn((key: string) => store.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store.set(key, value);
    }),
    removeItem: vi.fn((key: string) => {
      store.delete(key);
    }),
  };
}
