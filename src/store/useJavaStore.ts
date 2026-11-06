import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { RouteType, TestResult, Language } from '../types';
import { runAllFunctionalTests } from '../utils/testRunner';
import { JAVA_CHAPTERS } from '../data/javaChapters';

interface JavaStoreState {
  currentRoute: RouteType;
  selectedChapterId: string;
  language: Language;
  completedChapters: string[];
  bookmarkedChapters: string[];
  quizScores: Record<string, number>;
  customSnippets: Array<{ id: string; title: string; code: string }>;
  errors: string[];
  testResults: TestResult[];
  
  // Stepper State
  stepperIndex: number;
  isStepperPlaying: boolean;
  stepperSpeedMs: number;

  // Actions
  setRoute: (route: RouteType) => void;
  setSelectedChapterId: (id: string) => void;
  setLanguage: (lang: Language) => void;
  toggleCompleteChapter: (id: string) => void;
  toggleBookmarkChapter: (id: string) => void;
  setQuizScore: (chapterId: string, score: number) => void;
  addCustomSnippet: (title: string, code: string) => void;
  addError: (errorMsg: string) => void;
  clearErrors: () => void;
  
  // Stepper actions
  setStepperIndex: (idx: number) => void;
  nextStepperStep: () => void;
  prevStepperStep: () => void;
  resetStepper: () => void;
  setIsStepperPlaying: (playing: boolean) => void;
  setStepperSpeedMs: (speed: number) => void;

  // Functional test suite
  runTestSuite: () => void;
}

export const useJavaStore = create<JavaStoreState>()(
  persist(
    (set, get) => ({
      currentRoute: 'chapters',
      selectedChapterId: 'ch-1',
      language: 'fr',
      completedChapters: [],
      bookmarkedChapters: [],
      quizScores: {},
      customSnippets: [
        {
          id: 'snip-1',
          title: 'Singleton Thread-Safe en Java (Bill Pugh)',
          code: 'public class DatabaseConnection {\n    private DatabaseConnection() {}\n    private static class Holder {\n        private static final DatabaseConnection INSTANCE = new DatabaseConnection();\n    }\n    public static DatabaseConnection getInstance() {\n        return Holder.INSTANCE;\n    }\n}'
        },
        {
          id: 'snip-2',
          title: 'Stream Pipeline & Filter',
          code: 'import java.util.*;\nimport java.util.stream.*;\n\npublic class QuickStream {\n    public static void main(String[] args) {\n        List<String> names = List.of("Java", "Babel", "C", "JVM");\n        names.stream().filter(s -> s.length() > 3).forEach(System.out::println);\n    }\n}'
        }
      ],
      errors: [],
      testResults: runAllFunctionalTests(),

      stepperIndex: 0,
      isStepperPlaying: false,
      stepperSpeedMs: 1500,

      setRoute: (route) => set({ currentRoute: route }),
      setSelectedChapterId: (id) => set({ selectedChapterId: id, stepperIndex: 0, isStepperPlaying: false }),
      setLanguage: (lang) => set({ language: lang }),
      
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
        set((state) => {
          if (state.errors.includes(errorMsg)) return state;
          return { errors: [...state.errors, errorMsg] };
        }),

      clearErrors: () => set({ errors: [] }),

      setStepperIndex: (idx) => set({ stepperIndex: idx }),
      nextStepperStep: () => {
        const state = get();
        const ch = JAVA_CHAPTERS.find((c) => c.id === state.selectedChapterId) || JAVA_CHAPTERS[0];
        const max = ch.executionSteps.length - 1;
        if (state.stepperIndex < max) {
          set({ stepperIndex: state.stepperIndex + 1 });
        } else {
          set({ isStepperPlaying: false });
        }
      },
      prevStepperStep: () => {
        const state = get();
        if (state.stepperIndex > 0) {
          set({ stepperIndex: state.stepperIndex - 1 });
        }
      },
      resetStepper: () => set({ stepperIndex: 0, isStepperPlaying: false }),
      setIsStepperPlaying: (playing) => set({ isStepperPlaying: playing }),
      setStepperSpeedMs: (speed) => set({ stepperSpeedMs: speed }),

      runTestSuite: () => {
        const results = runAllFunctionalTests();
        set({ testResults: results });
      }
    }),
    {
      name: 'javbabel-storage-v2',
      partialize: (state) => ({
        completedChapters: state.completedChapters,
        bookmarkedChapters: state.bookmarkedChapters,
        quizScores: state.quizScores,
        customSnippets: state.customSnippets,
        language: state.language
      })
    }
  )
);
