import React from 'react';
import { useJavaStore } from './store/useJavaStore';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ChapterView } from './components/ChapterView';
import { JvmVisualizer } from './components/JvmVisualizer';
import { PlaygroundView } from './components/PlaygroundView';
import { QuizView } from './components/QuizView';
import { TestSuiteView } from './components/TestSuiteView';
import { ErrorToast } from './components/ErrorToast';

export default function App() {
  const { currentRoute } = useJavaStore();

  const renderActiveRoute = () => {
    switch (currentRoute) {
      case 'chapters':
        return <ChapterView />;
      case 'visualizer':
        return <JvmVisualizer />;
      case 'playground':
        return <PlaygroundView />;
      case 'quizzes':
        return <QuizView />;
      case 'tests':
        return <TestSuiteView />;
      default:
        return <ChapterView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      <Navbar />
      <main className="flex-1">
        {renderActiveRoute()}
      </main>
      <Footer />
      <ErrorToast />
    </div>
  );
}
