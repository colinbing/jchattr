import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { installMockWindow, type MockWindowControls } from '../../test/mockWindow';
import {
  getDefaultStudyPreferences,
  readStudyPreferences,
  resetStudyPreferences,
  setReadingDisplayMode,
  STUDY_PREFERENCES_STORAGE_KEY,
} from './studyPreferences';

let mockWindow: MockWindowControls;

describe('studyPreferences', () => {
  beforeEach(() => {
    mockWindow = installMockWindow();
    resetStudyPreferences();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('reads default preferences when localStorage is empty', () => {
    expect(readStudyPreferences()).toEqual(getDefaultStudyPreferences());
  });

  it('falls back safely when localStorage is corrupted', () => {
    mockWindow.setRaw(STUDY_PREFERENCES_STORAGE_KEY, '{not valid json');

    expect(readStudyPreferences()).toEqual(getDefaultStudyPreferences());
  });

  it('parses legacy records with focusMode safely', () => {
    mockWindow.setRaw(
      STUDY_PREFERENCES_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        focusMode: 'more-listening',
        readingDisplayMode: 'kana-support',
        updatedAt: '2026-01-01T00:00:00.000Z',
      }),
    );

    const preferences = readStudyPreferences();

    expect(preferences).toEqual({
      version: 1,
      readingDisplayMode: 'kana-support',
      updatedAt: '2026-01-01T00:00:00.000Z',
    });
    expect('focusMode' in preferences).toBe(false);
  });

  it('sets and resets reading display mode', () => {
    expect(
      setReadingDisplayMode(
        'japanese-only',
        new Date('2026-05-02T12:00:00.000Z'),
      ),
    ).toEqual({
      version: 1,
      readingDisplayMode: 'japanese-only',
      updatedAt: '2026-05-02T12:00:00.000Z',
    });

    expect(resetStudyPreferences()).toEqual(getDefaultStudyPreferences());
    expect(readStudyPreferences()).toEqual(getDefaultStudyPreferences());
  });
});
