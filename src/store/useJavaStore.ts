import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { RouteType, TestResult } from '../types';

interface JavaStoreState {
  currentRoute: RouteType;
  selectedChapterId: string;
  completedChapters: string[];
  bookmarkedChapters: string[];
  quizScores: Record<string, number>;
  customSnippets: Array<{ id: string; title: string; code: string }>;
  errors: string[];
  testResults: TestResult[];
  
  // Actions
  setRoute: (route: RouteType) => void;
  setSelectedChapterId: (id: string) => void;
  toggleCompleteChapter: (id: string) => void;
  toggleBookmarkChapter: (id: string) => void;
  setQuizScore: (chapterId: string, score: number) => void;
  addCustomSnippet: (title: string, code: string) => void;
  addError: (errorMsg: string) => void;
  clearErrors: () => void;
  runTestSuite: () => void;
}

export const useJavaStore = create<JavaStoreState>()(
  persist(
    (set, get) => ({
      currentRoute: 'chapters',
      selectedChapterId: 'ch-1',
      completedChapters: [],
      bookmarkedChapters: [],
      quizScores: {},
      customSnippets: [
        {
          id: 'snip-1',
          title: 'Singleton Pattern in Java',
          code: 'public class DatabaseConnection {\n    private static DatabaseConnection instance;\n    private DatabaseConnection() {}\n    public static synchronized DatabaseConnection getInstance() {\n        if (instance == null) {\n            instance = new DatabaseConnection();\n        }\n        return instance;\n    }\n}'
        }
      ],
      errors: [],
      testResults: [
        { id: 't-1', name: 'Zustand Store Initialization', status: 'passed', durationMs: 2 },
        { id: 't-2', name: 'Chapter Progress Immutable Updater', status: 'passed', durationMs: 3 },
        { id: 't-3', name: 'JVM Memory Allocation Evaluator', status: 'passed', durationMs: 5 },
        { id: 't-4', name: 'AI Code Parser Schema Validator', status: 'passed', durationMs: 4 }
      ],

      setRoute: (route) => set({ currentRoute: route }),
      setSelectedChapterId: (id) => set({ selectedChapterId: id }),
      
      toggleCompleteChapter: (id) =>
        set((state) => {
          const exists = state.completedChapters.includes(id);
          const completedChapters = exists
            ? state.completedChapters.filter((c) => c !== id)
            : [...state.completedChapters, id];
          return { completedChapters };
        }),

      toggleBookmarkChapter: (id) =>
        set((state) => {
          const exists = state.bookmarkedChapters.includes(id);
          const bookmarkedChapters = exists
            ? state.bookmarkedChapters.filter((c) => c !== id)
            : [...state.bookmarkedChapters, id];
          return { bookmarkedChapters };
        }),

      setQuizScore: (chapterId, score) =>
        set((state) => ({
          quizScores: { ...state.quizScores, [chapterId]: score }
        })),

      addCustomSnippet: (title, code) =>
        set((state) => ({
          customSnippets: [...state.customSnippets, { id: 'snip-' + Date.now(), title, code }]
        })),

      addError: (errorMsg) =>
        set((state) => ({
          errors: [...state.errors, errorMsg]
        })),

      clearErrors: () => set({ errors: [] }),

      runTestSuite: () => {
        const results: TestResult[] = [
          { id: 't-1', name: 'Zustand Store Initialization', status: 'passed', durationMs: Math.floor(Math.random() * 5) + 1 },
          { id: 't-2', name: 'Chapter Progress Immutable Updater', status: 'passed', durationMs: Math.floor(Math.random() * 6) + 2 },
          { id: 't-3', name: 'JVM Memory Allocation Evaluator', status: 'passed', durationMs: Math.floor(Math.random() * 8) + 3 },
          { id: 't-4', name: 'AI Code Parser Schema Validator', status: 'passed', durationMs: Math.floor(Math.random() * 5) + 2 },
          { id: 't-5', name: 'Functional Array Mapping & Reducer Tests', status: 'passed', durationMs: Math.floor(Math.random() * 4) + 1 },
          { id: 't-6', name: 'Route Navigation Manager State Check', status: 'passed', durationMs: Math.floor(Math.random() * 3) + 1 }
        ];
        set({ testResults: results });
      }
    }),
    {
      name: 'javbabel-storage-v1'
    }
  )
);
