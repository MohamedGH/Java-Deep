import React, { useState } from 'react';
import { JAVA_CHAPTERS } from '../data/javaChapters';
import { useJavaStore } from '../store/useJavaStore';
import { ChapterNavigatorBar } from './ChapterDrawer';
import {
  CheckCircle2,
  Bookmark,
  Cpu,
  ChevronRight,
  HelpCircle,
  AlertTriangle,
  ArrowRight,
  PlayCircle
} from 'lucide-react';

export const ChapterView: React.FC = () => {
  const {
    selectedChapterId,
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Chapter Context Bar + Drawer (replaces cramped sidebar) */}
      <ChapterNavigatorBar
        onChapterSelect={() => setActiveLine(1)}
        contextLabel={{ fr: 'Cours', en: 'Lesson' }}
      />

      {/* Chapter Overview */}
      <section className="bg-[#0F1623] rounded-2xl p-6 sm:p-8 border border-slate-800/90 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="font-semibold text-amber-400">{chapter.category}</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">{chapter.estimatedTime}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleBookmarkChapter(chapter.id)}
              className={`min-h-[44px] sm:min-h-[40px] min-w-[44px] sm:min-w-[40px] px-3 py-2 rounded-xl border transition-colors flex items-center justify-center ${
                isBookmarked
                  ? 'bg-amber-500/15 border-amber-500/50 text-amber-400'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
              }`}
              title={language === 'fr' ? 'Mettre en favori' : 'Bookmark'}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400' : ''}`} />
            </button>

            <button
              onClick={() => toggleCompleteChapter(chapter.id)}
              className={`min-h-[44px] sm:min-h-[40px] px-4 py-2 rounded-xl font-semibold text-xs border transition-colors flex items-center gap-2 whitespace-nowrap ${
                isCompleted
                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-900 text-slate-200 border-slate-800 hover:bg-slate-800'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>
                {isCompleted
                  ? language === 'fr'
                    ? 'Complété'
                    : 'Completed'
                  : language === 'fr'
                  ? 'Marquer terminé'
                  : 'Mark complete'}
              </span>
            </button>

            <button
              onClick={() => setRoute('stepper')}
              className="min-h-[44px] sm:min-h-[40px] px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 whitespace-nowrap"
            >
              <PlayCircle className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">
                {language === 'fr' ? 'Ouvrir Stepper' : 'Open Stepper'}
              </span>
            </button>
          </div>
        </div>

        <div className="space-y-2 max-w-4xl">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight text-balance">
            {chapter.title[language]}
          </h1>
          <p className="text-sm sm:text-base text-amber-300 font-medium">
            {chapter.subtitle[language]}
          </p>
          <p className="text-sm text-slate-300 leading-relaxed pt-1">
            {chapter.summary[language]}
          </p>
        </div>
      </section>

      {/* Two-Zone Code Dissector Workbench */}
      <section className="bg-[#0F1623] rounded-2xl border border-slate-800/90 overflow-hidden">
        {/* Segmented Control Header */}
        <div className="bg-[#0B101B] px-4 sm:px-6 py-3 border-b border-slate-800/90 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800">
            {[
              { id: 'java' as const, label: language === 'fr' ? 'Code Java' : 'Java Source' },
              { id: 'bytecode' as const, label: 'Bytecode JVM' },
              { id: 'c' as const, label: language === 'fr' ? 'Équivalent C' : 'C Equivalent' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                  activeTab === tab.id
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <span className="text-xs text-slate-400">
            {activeTab === 'java' &&
              (language === 'fr'
                ? 'Sélectionnez une ligne pour inspecter son effet JVM'
                : 'Select any line to inspect JVM effects')}
            {activeTab === 'bytecode' && 'HotSpot Bytecode (javap -c)'}
            {activeTab === 'c' &&
              (language === 'fr' ? 'Comparatif modèle mémoire C' : 'C Memory Comparison')}
          </span>
        </div>

        {/* Tab 1: Java Interactive Dissector */}
        {activeTab === 'java' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-800/90">
            <div className="lg:col-span-7 p-4 sm:p-5 font-mono text-xs overflow-x-auto bg-[#090D16]">
              <pre className="space-y-1">
                {chapter.codeSnippet.split('\n').map((lineText, idx) => {
                  const lineNum = idx + 1;
                  const isSelected = activeLine === lineNum;
                  return (
                    <button
                      type="button"
                      key={lineNum}
                      onClick={() => setActiveLine(lineNum)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-3 border ${
                        isSelected
                          ? 'bg-amber-500/15 text-amber-200 border-amber-500/40'
                          : 'text-slate-300 border-transparent hover:bg-slate-900 hover:text-white'
                      }`}
                    >
                      <span className="w-6 text-right text-slate-500 select-none tabular-nums shrink-0">
                        {lineNum}
                      </span>
                      <span className="flex-1 whitespace-pre">{lineText}</span>
                      <ChevronRight
                        className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                          isSelected ? 'text-amber-400 translate-x-0.5' : 'opacity-0'
                        }`}
                      />
                    </button>
                  );
                })}
              </pre>
            </div>

            <div className="lg:col-span-5 p-5 sm:p-6 bg-[#0F1623] flex flex-col justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
                  <HelpCircle className="w-4 h-4 shrink-0" />
                  <span className="tabular-nums">
                    {language === 'fr'
                      ? `Analyse ligne ${activeLine}`
                      : `Line ${activeLine} Breakdown`}
                  </span>
                </div>

                {activeExplanation ? (
                  <div className="space-y-4">
                    <div className="bg-[#090D16] p-3.5 rounded-xl border border-slate-800 font-mono text-xs text-amber-200 overflow-x-auto">
                      {activeExplanation.code}
                    </div>
                    <p className="text-slate-200 text-sm leading-relaxed">
                      {activeExplanation.explanation[language]}
                    </p>
                    {activeExplanation.memoryHint && (
                      <div className="flex items-start gap-2.5 text-xs text-amber-300 bg-amber-500/10 p-3.5 rounded-xl border border-amber-500/25">
                        <Cpu className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>
                          <strong>JVM :</strong> {activeExplanation.memoryHint[language]}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">
                    {language === 'fr'
                      ? 'Cliquez sur une ligne d’instruction à gauche pour afficher son comportement JVM et mémoire.'
                      : 'Select an instruction line on the left to inspect its JVM and memory behavior.'}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => setRoute('stepper')}
                  className="min-h-[44px] sm:min-h-[40px] px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-2"
                >
                  <span>
                    {language === 'fr' ? 'Exécuter dans le Stepper' : 'Run in Step Debugger'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Bytecode */}
        {activeTab === 'bytecode' && (
          <div className="p-5 sm:p-6 bg-[#090D16] font-mono text-xs space-y-2.5">
            <p className="text-slate-400 font-sans text-xs pb-1">
              {language === 'fr'
                ? `Sortie désassemblée de ${chapter.id}.class via javap -c`
                : `Disassembled ${chapter.id}.class output via javap -c`}
            </p>
            {chapter.bytecode.map((bc, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-[#0F1623] rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="flex items-center gap-3">
                  <span className="text-amber-400 font-semibold w-10 text-right tabular-nums shrink-0">
                    {bc.offset}:
                  </span>
                  <span className="text-white font-semibold">{bc.opcode}</span>
                </div>
                <span className="text-slate-400 text-xs font-sans">
                  {bc.comment[language]}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: C Comparison */}
        {activeTab === 'c' && (
          <div className="p-5 sm:p-6 bg-[#090D16] space-y-5">
            <div className="font-mono text-xs bg-[#0F1623] p-4 rounded-xl border border-slate-800 text-sky-300 overflow-x-auto">
              <pre>{chapter.cComparison.cCode}</pre>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#0F1623] p-4 rounded-xl border border-slate-800 space-y-1.5">
                <h3 className="text-xs font-semibold text-sky-400">
                  {language === 'fr' ? 'Analyse comparative' : 'Comparative Analysis'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {chapter.cComparison.explanation[language]}
                </p>
              </div>

              <div className="bg-[#0F1623] p-4 rounded-xl border border-slate-800 space-y-1.5">
                <h3 className="text-xs font-semibold text-amber-400">
                  {language === 'fr' ? 'Différence mémoire' : 'Memory Model Difference'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {chapter.cComparison.memoryDifference[language]}
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* JVM Memory Notes & Common Pitfalls */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#0F1623] rounded-2xl p-6 border border-slate-800/90 space-y-2.5">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{language === 'fr' ? 'Mécanique mémoire JVM' : 'JVM Memory Mechanics'}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {chapter.jvmMemoryNotes[language]}
          </p>
        </div>

        <div className="bg-[#0F1623] rounded-2xl p-6 border border-slate-800/90 space-y-2.5">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{language === 'fr' ? 'Pièges fréquents' : 'Common Pitfalls'}</span>
          </h2>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
            {chapter.commonPitfalls[language].map((pitfall, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="text-amber-400 font-semibold mt-0.5">·</span>
                <span className="leading-relaxed">{pitfall}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};
