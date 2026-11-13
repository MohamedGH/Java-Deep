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
import { MobileBottomNav } from './components/MobileBottomNav';
import { ModuleExplorerDrawer } from './components/ModuleExplorerDrawer';

export default function App() {
  const { currentRoute } = useJavaStore();
  const [modulesOpen, setModulesOpen] = useState(false);

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
        {renderActiveRoute()}
      </main>
      <Footer />
      <MobileBottomNav onOpenModules={() => setModulesOpen(true)} />
      <ModuleExplorerDrawer isOpen={modulesOpen} onClose={() => setModulesOpen(false)} />
      <ErrorToast />
    </div>
  );
}
