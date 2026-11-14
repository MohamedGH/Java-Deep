import React, { useState } from 'react';
import { useJavaStore } from './store/useJavaStore';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ChapterView } from './components/ChapterView';
import { ExecutionStepperView } from './components/ExecutionStepperView';
import { VTableView } from './components/VTableView';
import { JvmVisualizer } from './components/JvmVisualizer';
import { BytecodeModifierView } from './components/BytecodeModifierView';
import { JavaHistoryView } from './components/JavaHistoryView';
import { CvsJavaView } from './components/CvsJavaView';
import { PlaygroundView } from './components/PlaygroundView';
import { QuizView } from './components/QuizView';
import { TestSuiteView } from './components/TestSuiteView';
import { ErrorToast } from './components/ErrorToast';
import { ModifiersView } from './components/ModifiersView';
import { DomainModelsView } from './components/DomainModelsView';
import { BuildToolsView } from './components/BuildToolsView';
import { SpringView } from './components/SpringView';
import { JUnitView } from './components/JUnitView';
import { JavadocView } from './components/JavadocView';
import { KotlinView } from './components/KotlinView';
import { MobileBottomNav } from './components/MobileBottomNav';
import { ModuleExplorerDrawer } from './components/ModuleExplorerDrawer';
import { getGroupForLabRoute, LAB_ROUTE_TO_CHAPTER } from './utils/navigationEngine';
import { JAVA_CHAPTERS } from './data/javaChapters';
import { BookOpen, PlayCircle, Award } from 'lucide-react';

export default function App() {
  const { currentRoute, setRoute, setSelectedChapterId, language } = useJavaStore();
  const [modulesOpen, setModulesOpen] = useState(false);

  const labGroup = getGroupForLabRoute(currentRoute);
  const linkedChapterId = LAB_ROUTE_TO_CHAPTER[currentRoute];
  const linkedChapter = linkedChapterId
    ? JAVA_CHAPTERS.find((c) => c.id === linkedChapterId)
    : null;

  const renderActiveRoute = () => {
    switch (currentRoute) {
      case 'chapters':
        return <ChapterView />;
      case 'stepper':
        return <ExecutionStepperView />;
      case 'modifiers':
        return <ModifiersView />;
      case 'domain':
        return <DomainModelsView />;
      case 'buildtools':
        return <BuildToolsView />;
      case 'spring':
        return <SpringView />;
      case 'junit':
        return <JUnitView />;
      case 'javadoc':
        return <JavadocView />;
      case 'kotlin':
        return <KotlinView />;
      case 'vtable':
        return <VTableView />;
      case 'bytecode':
        return <BytecodeModifierView />;
      case 'history':
        return <JavaHistoryView />;
      case 'visualizer':
        return <JvmVisualizer />;
      case 'cvsjava':
        return <CvsJavaView />;
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
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950 pb-14 lg:pb-0">
      <Navbar onOpenModules={() => setModulesOpen(true)} />
      <main className="flex-1">
        {labGroup && linkedChapter && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5">
            <div className="bg-[#0F1623] border border-slate-800/90 rounded-2xl px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs text-slate-400 truncate">
                <span className="font-semibold text-amber-400">{labGroup.title[language]}</span>
                <span aria-hidden="true" className="mx-2">·</span>
                <span className="text-slate-200">{linkedChapter.title[language]}</span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    setSelectedChapterId(linkedChapter.id);
                    setRoute('chapters');
                  }}
                  className="min-h-[36px] px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors whitespace-nowrap"
                >
                  <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                  <span>{language === 'fr' ? 'Cours du chapitre' : 'Lesson'}</span>
                </button>
                <button
                  onClick={() => {
                    setSelectedChapterId(linkedChapter.id);
                    setRoute('stepper');
                  }}
                  className="min-h-[36px] px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors whitespace-nowrap"
                >
                  <PlayCircle className="w-3.5 h-3.5 text-sky-400" />
                  <span>Stepper</span>
                </button>
                <button
                  onClick={() => {
                    setSelectedChapterId(linkedChapter.id);
                    setRoute('quizzes');
                  }}
                  className="min-h-[36px] px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors whitespace-nowrap"
                >
                  <Award className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Quiz</span>
                </button>
              </div>
            </div>
          </div>
        )}
        {renderActiveRoute()}
      </main>
      <Footer />
      <MobileBottomNav onOpenModules={() => setModulesOpen(true)} />
      <ModuleExplorerDrawer isOpen={modulesOpen} onClose={() => setModulesOpen(false)} />
      <ErrorToast />
    </div>
  );
}
