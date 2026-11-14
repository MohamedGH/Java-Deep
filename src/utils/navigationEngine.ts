import { Chapter, Language, RouteType } from '../types';

export type ChapterCategoryFilter = 'All' | Chapter['category'];

export type ChapterGroupId =
  | 'group-1'
  | 'group-2'
  | 'group-3'
  | 'group-4'
  | 'group-5';

export interface ChapterGroupSpec {
  id: ChapterGroupId;
  roman: string;
  title: { fr: string; en: string };
  subtitle: { fr: string; en: string };
  chapterIds: ReadonlyArray<string>;
  labRoutes: ReadonlyArray<RouteType>;
}

/**
 * Pure canonical grouping of all 19 lessons and specialized interactive labs into 5 Chapters.
 */
export const CHAPTER_GROUPS: ReadonlyArray<ChapterGroupSpec> = [
  {
    id: 'group-1',
    roman: 'I',
    title: { fr: 'Chapitre I · Mémoire JVM & Bases C', en: 'Chapter I · JVM Memory & C Foundations' },
    subtitle: {
      fr: 'Compilation, Pile Stack, Tas Heap, Pointeurs C vs Références, String Pool & GC',
      en: 'Compilation, Stack vs Heap, C Pointers vs References, String Pool & GC'
    },
    chapterIds: ['ch-1', 'ch-2', 'ch-3', 'ch-4', 'ch-7'],
    labRoutes: ['visualizer', 'cvsjava', 'history']
  },
  {
    id: 'group-2',
    roman: 'II',
    title: { fr: 'Chapitre II · POO, VTable & Modèle Domaine', en: 'Chapter II · OOP, VTable & Domain Modeling' },
    subtitle: {
      fr: 'Encapsulation, VTable O(1), Classes Imbriquées this$0, Static/Visibilité, Records & Enums',
      en: 'Encapsulation, O(1) VTable, Nested this$0, Static/Visibility, Records & Enums'
    },
    chapterIds: ['ch-5', 'ch-6', 'ch-11', 'ch-13', 'ch-14'],
    labRoutes: ['vtable', 'modifiers', 'domain']
  },
  {
    id: 'group-3',
    roman: 'III',
    title: { fr: 'Chapitre III · Collections, Streams & Bytecode', en: 'Chapter III · Collections, Streams & Bytecode' },
    subtitle: {
      fr: 'Génériques & Autoboxing, Exceptions, Lambdas/Streams & Instrumentation Bytecode',
      en: 'Generics & Autoboxing, Exceptions, Lambdas/Streams & Bytecode Agents'
    },
    chapterIds: ['ch-8', 'ch-9', 'ch-10', 'ch-12'],
    labRoutes: ['bytecode', 'playground']
  },
  {
    id: 'group-4',
    roman: 'IV',
    title: { fr: 'Chapitre IV · Build, Spring, JUnit & Javadoc', en: 'Chapter IV · Build, Spring, JUnit & Javadoc' },
    subtitle: {
      fr: 'Ant/Maven/Gradle, Spring IoC/AOP, Tests JUnit 5/Mockito & Javadoc/Markdown',
      en: 'Ant/Maven/Gradle, Spring IoC/AOP, JUnit 5/Mockito & Javadoc/Markdown'
    },
    chapterIds: ['ch-15', 'ch-16', 'ch-17', 'ch-18'],
    labRoutes: ['buildtools', 'spring', 'junit', 'javadoc']
  },
  {
    id: 'group-5',
    roman: 'V',
    title: { fr: 'Chapitre V · Kotlin sur la JVM', en: 'Chapter V · Kotlin on the JVM' },
    subtitle: {
      fr: 'kotlinc Lowering, Null-Safety & Int? Boxing, inline/reified & Coroutines CPS',
      en: 'kotlinc Lowering, Null-Safety & Int? Boxing, inline/reified & CPS Coroutines'
    },
    chapterIds: ['ch-19'],
    labRoutes: ['kotlin']
  }
];

/**
 * Maps specific lesson IDs to their dedicated interactive workbench route.
 */
export const CHAPTER_TO_LAB_ROUTE: Partial<Record<string, RouteType>> = {
  'ch-1': 'history',
  'ch-2': 'visualizer',
  'ch-3': 'cvsjava',
  'ch-4': 'visualizer',
  'ch-6': 'vtable',
  'ch-7': 'visualizer',
  'ch-12': 'bytecode',
  'ch-13': 'modifiers',
  'ch-14': 'domain',
  'ch-15': 'buildtools',
  'ch-16': 'spring',
  'ch-17': 'junit',
  'ch-18': 'javadoc',
  'ch-19': 'kotlin'
};

/**
 * Reverse lookup from any lab route back to its primary lesson ID.
 */
export const LAB_ROUTE_TO_CHAPTER: Partial<Record<RouteType, string>> = {
  history: 'ch-1',
  cvsjava: 'ch-3',
  visualizer: 'ch-7',
  vtable: 'ch-6',
  bytecode: 'ch-12',
  modifiers: 'ch-13',
  domain: 'ch-14',
  buildtools: 'ch-15',
  spring: 'ch-16',
  junit: 'ch-17',
  javadoc: 'ch-18',
  kotlin: 'ch-19',
  playground: 'ch-10'
};

/**
 * Pure helper returning the ChapterGroupSpec containing a given lesson ID.
 */
export const getGroupForChapterId = (chapterId: string): ChapterGroupSpec =>
  CHAPTER_GROUPS.find((g) => g.chapterIds.includes(chapterId)) || CHAPTER_GROUPS[0];

/**
 * Pure helper returning the ChapterGroupSpec associated with any interactive lab route.
 */
export const getGroupForLabRoute = (route: RouteType): ChapterGroupSpec | null =>
  CHAPTER_GROUPS.find((g) => g.labRoutes.includes(route)) || null;

/**
 * Pure function filtering chapters by search query, category, and optional chapter group.
 */
export const filterChapters = (
  chapters: ReadonlyArray<Chapter>,
  query: string,
  category: ChapterCategoryFilter,
  language: Language,
  groupId: 'All' | ChapterGroupId = 'All'
): Chapter[] => {
  const normalizedQuery = query.trim().toLowerCase();
  const groupSpec =
    groupId === 'All' ? null : CHAPTER_GROUPS.find((g) => g.id === groupId) || null;

  return chapters.filter((ch) => {
    if (groupSpec && !groupSpec.chapterIds.includes(ch.id)) return false;
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
  'kotlin',
  'vtable',
  'visualizer',
  'bytecode',
  'history',
  'cvsjava',
  'playground',
  'quizzes',
  'tests'
];
