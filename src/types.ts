export type RouteType = 'chapters' | 'visualizer' | 'playground' | 'quizzes' | 'tests';

export interface LineBreakdownItem {
  lineNumber: number;
  code: string;
  explanation: string;
  memoryHint?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Chapter {
  id: string;
  title: string;
  subtitle: string;
  category: 'Fundamentals' | 'OOP' | 'Memory & JVM' | 'Advanced';
  iconName: string;
  estimatedTime: string;
  summary: string;
  codeSnippet: string;
  lineBreakdown: LineBreakdownItem[];
  jvmMemoryNotes: string;
  commonPitfalls: string[];
  quiz: QuizQuestion;
}

export interface TestResult {
  id: string;
  name: string;
  status: 'passed' | 'failed' | 'pending';
  durationMs: number;
  message?: string;
}

export interface UserProgress {
  completedChapters: string[];
  bookmarkedChapters: string[];
  quizScores: Record<string, number>;
  customSnippetsCount: number;
}
