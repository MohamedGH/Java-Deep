import { Chapter, Language, RouteType } from '../types';

export type ChapterCategoryFilter = 'All' | Chapter['category'];

/**
 * Pure function filtering chapters by search query and category without mutating source array.
 */
export const filterChapters = (
  chapters: ReadonlyArray<Chapter>,
  query: string,
  category: ChapterCategoryFilter,
  language: Language
): Chapter[] => {
  const normalizedQuery = query.trim().toLowerCase();
  return chapters.filter((ch) => {
    const matchesCategory = category === 'All' || ch.category === category;
    if (!matchesCategory) return false;
    if (!normalizedQuery) return true;
    return (
      ch.title[language].toLowerCase().includes(normalizedQuery) ||
      ch.subtitle[language].toLowerCase().includes(normalizedQuery) ||
      ch.category.toLowerCase().includes(normalizedQuery)
    );
  });
};

/**
 * Pure circular chapter stepping helper (replaces <select> chapter switching).
 */
export const getAdjacentChapterId = (
  chapters: ReadonlyArray<Chapter>,
  currentId: string,
  direction: 'prev' | 'next'
): string => {
  if (chapters.length === 0) return currentId;
  const currentIndex = Math.max(
    0,
    chapters.findIndex((c) => c.id === currentId)
  );
  const delta = direction === 'next' ? 1 : -1;
  const targetIndex = (currentIndex + delta + chapters.length) % chapters.length;
  return chapters[targetIndex].id;
};

/**
 * Complete registry of all active application routes for drawer verification.
 */
export const REGISTERED_ROUTES: ReadonlyArray<RouteType> = [
  'chapters',
  'stepper',
  'modifiers',
  'domain',
  'buildtools',
  'spring',
  'junit',
  'javadoc',
  'vtable',
  'visualizer',
  'bytecode',
  'history',
  'cvsjava',
  'playground',
  'quizzes',
  'tests'
];
