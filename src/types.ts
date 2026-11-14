export type RouteType = 'chapters' | 'stepper' | 'modifiers' | 'domain' | 'buildtools' | 'spring' | 'junit' | 'javadoc' | 'kotlin' | 'vtable' | 'visualizer' | 'bytecode' | 'history' | 'cvsjava' | 'playground' | 'quizzes' | 'tests';

export interface JavaVersionRelease {
  version: string;
  year: number;
  codename?: string;
  isLts: boolean;
  status: 'Active LTS' | 'Historic' | 'Latest';
  era: 'Foundation' | 'Generics & Concurrency' | 'Functional Revolution' | 'Modular & Rapid Cadence' | 'Modern Loom & Panama';
  description: {
    fr: string;
    en: string;
  };
  jvmChanges: {
    fr: string;
    en: string;
  };
  features: Array<{
    name: string;
    description: { fr: string; en: string };
    codeSnippet?: string;
    cComparison?: { fr: string; en: string };
  }>;
}

export type Language = 'fr' | 'en';

export interface LineBreakdownItem {
  lineNumber: number;
  code: string;
  explanation: {
    fr: string;
    en: string;
  };
  memoryHint?: {
    fr: string;
    en: string;
  };
}

export interface JvmExecutionStep {
  stepIndex: number;
  lineNumber: number;
  description: {
    fr: string;
    en: string;
  };
  programCounter: number;
  stackFrames: Array<{
    method: string;
    variables: Array<{ name: string; type: string; value: string; isRef?: boolean }>;
    operandStack?: string[];
  }>;
  heapObjects: Array<{
    id: string;
    address: string;
    className: string;
    fields: Record<string, string>;
    isGarbage: boolean;
  }>;
  stdout: string[];
}

export interface BytecodeLine {
  offset: number;
  opcode: string;
  comment: {
    fr: string;
    en: string;
  };
}

export interface CComparison {
  cCode: string;
  explanation: {
    fr: string;
    en: string;
  };
  memoryDifference: {
    fr: string;
    en: string;
  };
}

export interface QuizQuestion {
  id: string;
  question: {
    fr: string;
    en: string;
  };
  options: {
    fr: string[];
    en: string[];
  };
  correctIndex: number;
  explanation: {
    fr: string;
    en: string;
  };
}

export interface Chapter {
  id: string;
  title: {
    fr: string;
    en: string;
  };
  subtitle: {
    fr: string;
    en: string;
  };
  category: 'Fundamentals' | 'Memory & JVM' | 'OOP' | 'Advanced';
  estimatedTime: string;
  iconName: string;
  summary: {
    fr: string;
    en: string;
  };
  codeSnippet: string;
  lineBreakdown: LineBreakdownItem[];
  bytecode: BytecodeLine[];
  cComparison: CComparison;
  executionSteps: JvmExecutionStep[];
  jvmMemoryNotes: {
    fr: string;
    en: string;
  };
  commonPitfalls: {
    fr: string[];
    en: string[];
  };
  quiz: QuizQuestion;
}

export interface TestResult {
  id: string;
  name: string;
  description: string;
  category: 'State' | 'JVM Engine' | 'Memory' | 'Routing' | 'Functional' | 'Error';
  status: 'passed' | 'failed' | 'pending';
  durationMs: number;
  assertion: string;
}

export interface UserProgress {
  completedChapters: string[];
  bookmarkedChapters: string[];
  quizScores: Record<string, number>;
  customSnippetsCount: number;
}
