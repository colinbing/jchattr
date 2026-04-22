import type { ListeningItem } from '../lib/content/types';

export const listeningItems = [
  {
    id: 'listening-self-intro',
    transcript: 'わたしはコリンです。',
    reading: 'わたしはコリンです。',
    translation: 'I am Colin.',
    focusPoint: 'Hear the topic marker は and the polite ending です.',
    difficulty: 'easy',
  },
  {
    id: 'listening-teacher-question',
    transcript: 'せんせいですか。',
    reading: 'せんせいですか。',
    translation: 'Are you a teacher?',
    focusPoint: 'Catch the question ending か without relying on English-style word order.',
    difficulty: 'easy',
  },
  {
    id: 'listening-home-study',
    transcript: 'うちでにほんごをべんきょうします。',
    reading: 'うちでにほんごをべんきょうします。',
    translation: 'I study Japanese at home.',
    focusPoint: 'Identify the location particle で and the study verb.',
    difficulty: 'medium',
  },
  {
    id: 'listening-cafe-coffee',
    transcript: 'カフェでコーヒーをのみます。',
    reading: 'カフェでコーヒーをのみます。',
    translation: 'I drink coffee at a cafe.',
    focusPoint: 'Listen for where the action happens before the object and verb.',
    difficulty: 'medium',
  },
] satisfies ListeningItem[];
