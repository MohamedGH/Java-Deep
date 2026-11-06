import React, { useState } from 'react';
import { JAVA_CHAPTERS } from '../data/javaChapters';
import { useJavaStore } from '../store/useJavaStore';
import { 
  BookOpen, 
  CheckCircle2, 
  Bookmark, 
  Cpu, 
  ChevronRight, 
  HelpCircle, 
  AlertTriangle, 
  ArrowRight,
  Terminal,
  SplitSquareVertical,
  PlayCircle
} from 'lucide-react';

export const ChapterView: React.FC = () => {
  const {
    selectedChapterId,
    setSelectedChapterId,
    completedChapters,
    toggleCompleteChapter,
    bookmarkedChapters,
    toggleBookmarkChapter,
    setRoute,
    language
  } = useJavaStore();

  const [activeLine, setActiveLine] = useState<number | null>(1);
  const [activeTab, setActiveTab] = useState<'java' | 'bytecode' | 'c'>('java');

  const chapter = JAVA_CHAPTERS.find((c) => c.id === selectedChapterId) || JAVA_CHAPTERS[0];
  const isCompleted = completedChapters.includes(chapter.id);
  const isBookmarked = bookmarkedChapters.includes(chapter.id);

  const activeExplanation = chapter.lineBreakdown.find((item) => item.lineNumber === activeLine);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Chapter Navigator (1 col) */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 shadow-xl">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-3 flex items-center justify-between">
              <span>{language === 'fr' ? 'Programme Pédagogique' : 'Learning Curriculum'}</span>
              <span className="text-[11px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">
                {completedChapters.length}/{JAVA_CHAPTERS.length}
              </span>
            </h2>
            <div className="space-y-1.5 max-h-[580px] overflow-y-auto pr-1">
              {JAVA_CHAPTERS.map((ch) => {
                const active = ch.id === chapter.id;
                const done = completedChapters.includes(ch.id);
                const book = bookmarkedChapters.includes(ch.id);

                return (
                  <button
                    key={ch.id}
                    onClick={() => {
                      setSelectedChapterId(ch.id);
                      setActiveLine(1);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                      active
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center space-x-2 truncate">
                      {done ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                      )}
                      <span className="truncate">{ch.title[language]}</span>
                    </div>
                    {book && <Bookmark className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-2xl p-4 border border-amber-500/30 space-y-2">
            <div className="flex items-center space-x-2 text-amber-400 font-semibold text-xs">
              <PlayCircle className="w-4 h-4" />
              <span>{language === 'fr' ? 'Débogueur Pas-à-Pas' : 'Step Debugger'}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {language === 'fr'
                ? 'Testez l\'exécution pas à pas de ce chapitre dans notre simulateur JVM interactif.'
                : 'Step through this chapter instruction by instruction in our live JVM simulator.'}
            </p>
            <button
              onClick={() => setRoute('stepper')}
              className="w-full mt-2 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-all flex items-center justify-center space-x-1.5"
            >
              <span>{language === 'fr' ? 'Lancer l\'Exécution' : 'Start Stepper'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Main Content & Dissector (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Chapter Header Card */}
          <div className="bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {chapter.category}
                </span>
                <span className="text-xs text-slate-400">
                  ⏱️ {chapter.estimatedTime}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleBookmarkChapter(chapter.id)}
                  className={`p-2 rounded-xl border transition-all ${
                    isBookmarked
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                  }`}
                  title="Bookmark"
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400' : ''}`} />
                </button>

                <button
                  onClick={() => toggleCompleteChapter(chapter.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold text-xs transition-all ${
                    isCompleted
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isCompleted ? (language === 'fr' ? 'Complété' : 'Completed') : (language === 'fr' ? 'Marquer Terminé' : 'Mark Complete')}</span>
                </button>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">{chapter.title[language]}</h1>
            <p className="text-sm sm:text-base text-amber-300 font-medium mb-3">{chapter.subtitle[language]}</p>
            <p className="text-slate-300 text-sm leading-relaxed">{chapter.summary[language]}</p>
          </div>

          {/* Interactive Dissector with Tabs (Java / Bytecode / C) */}
          <div className="bg-slate-900/95 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
            {/* Tab Header */}
            <div className="bg-slate-950 px-6 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setActiveTab('java')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'java'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  ☕ Code Java Dissecté
                </button>
                <button
                  onClick={() => setActiveTab('bytecode')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'bytecode'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  ⚙️ Bytecode JVM (javap -c)
                </button>
                <button
                  onClick={() => setActiveTab('c')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'c'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  🔄 Équivalent en C
                </button>
              </div>

              <span className="text-[11px] font-mono text-slate-400">
                {activeTab === 'java' && (language === 'fr' ? 'Cliquez sur une ligne pour l\'analyser' : 'Click any line to dissect')}
                {activeTab === 'bytecode' && 'Désassemblage JVM HotSpot'}
                {activeTab === 'c' && 'Comparatif bas-niveau'}
              </span>
            </div>

            {/* Tab 1: Java Interactive Code Dissector */}
            {activeTab === 'java' && (
              <div className="grid grid-cols-1 xl:grid-cols-2 divide-y xl:divide-y-0 xl:divide-x divide-slate-800">
                {/* Code Snippet */}
                <div className="p-5 font-mono text-xs overflow-x-auto bg-slate-950/70">
                  <pre className="space-y-1">
                    {chapter.codeSnippet.split('\n').map((lineText, idx) => {
                      const lineNum = idx + 1;
                      const isSelected = activeLine === lineNum;
                      return (
                        <div
                          key={lineNum}
                          onClick={() => setActiveLine(lineNum)}
                          className={`group px-3 py-1.5 rounded-lg cursor-pointer transition-all flex items-center space-x-3 ${
                            isSelected
                              ? 'bg-amber-500/20 text-amber-300 border-l-4 border-amber-400 shadow-sm'
                              : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                          }`}
                        >
                          <span className="w-5 text-right text-slate-600 select-none text-[11px]">{lineNum}</span>
                          <span className="flex-1 whitespace-pre">{lineText}</span>
                          <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'text-amber-400 translate-x-1' : 'opacity-0 group-hover:opacity-50 text-slate-500'}`} />
                        </div>
                      );
                    })}
                  </pre>
                </div>

                {/* Line Explanation & Deep Dive */}
                <div className="p-6 bg-slate-900/90 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center space-x-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-3">
                      <HelpCircle className="w-4 h-4" />
                      <span>{language === 'fr' ? `Analyse Détaillée - Ligne ${activeLine}` : `Line ${activeLine} Analysis`}</span>
                    </div>

                    {activeExplanation ? (
                      <div className="space-y-4">
                        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 font-mono text-xs text-amber-200">
                          {activeExplanation.code}
                        </div>
                        <p className="text-slate-200 text-sm leading-relaxed">
                          {activeExplanation.explanation[language]}
                        </p>
                        {activeExplanation.memoryHint && (
                          <div className="flex items-center space-x-2 text-xs text-orange-400 bg-orange-500/10 px-3 py-2 rounded-xl border border-orange-500/20">
                            <Cpu className="w-4 h-4 shrink-0" />
                            <span><strong>JVM:</strong> {activeExplanation.memoryHint[language]}</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-400 italic">
                        {language === 'fr'
                          ? 'Cliquez sur une ligne du code source à gauche pour afficher son décryptage JVM et mémoire.'
                          : 'Click any line of code to inspect its execution mechanics and memory footprint.'}
                      </p>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
                    <button
                      onClick={() => setRoute('stepper')}
                      className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-amber-500/20"
                    >
                      <span>{language === 'fr' ? 'Exécuter au pas-à-pas' : 'Run in Step Debugger'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Bytecode View */}
            {activeTab === 'bytecode' && (
              <div className="p-6 bg-slate-950 font-mono text-xs space-y-3">
                <div className="text-slate-400 text-[11px] mb-2">
                  // Compiled from {chapter.id}.java via `javac -g` followed by `javap -c -v`
                </div>
                <div className="space-y-2">
                  {chapter.bytecode.map((bc, idx) => (
                    <div key={idx} className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center space-x-3">
                        <span className="text-amber-400 font-bold w-12 text-right">{bc.offset}:</span>
                        <span className="text-white font-bold">{bc.opcode}</span>
                      </div>
                      <span className="text-slate-400 text-xs font-sans">
                        // {bc.comment[language]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: C Equivalent View */}
            {activeTab === 'c' && (
              <div className="p-6 bg-slate-950 space-y-4">
                <div className="font-mono text-xs bg-slate-900 p-4 rounded-xl border border-slate-800 text-blue-300 overflow-x-auto">
                  <pre>{chapter.cComparison.cCode}</pre>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-1.5">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-blue-400">
                      {language === 'fr' ? 'Analyse Comparative' : 'Comparative Analysis'}
                    </h5>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {chapter.cComparison.explanation[language]}
                    </p>
                  </div>

                  <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-1.5">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                      {language === 'fr' ? 'Différence Mémoire' : 'Memory Model Difference'}
                    </h5>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {chapter.cComparison.memoryDifference[language]}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* JVM Memory Notes & Pitfalls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 space-y-2">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-amber-400" />
                <span>{language === 'fr' ? 'Mécanique Mémoire JVM' : 'JVM Memory Mechanics'}</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{chapter.jvmMemoryNotes[language]}</p>
            </div>

            <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 space-y-2">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-orange-400" />
                <span>{language === 'fr' ? 'Pièges Fréquents' : 'Common Pitfalls'}</span>
              </h3>
              <ul className="space-y-1.5 text-xs sm:text-sm text-slate-300">
                {chapter.commonPitfalls[language].map((pitfall, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-orange-400 font-bold">•</span>
                    <span>{pitfall}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
