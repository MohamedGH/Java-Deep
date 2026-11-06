import React, { useState } from 'react';
import { JAVA_CHAPTERS } from '../data/javaChapters';
import { useJavaStore } from '../store/useJavaStore';
import { BookOpen, CheckCircle2, Bookmark, Cpu, ChevronRight, HelpCircle, AlertTriangle, ArrowRight } from 'lucide-react';

export const ChapterView: React.FC = () => {
  const {
    selectedChapterId,
    setSelectedChapterId,
    completedChapters,
    toggleCompleteChapter,
    bookmarkedChapters,
    toggleBookmarkChapter,
    setRoute
  } = useJavaStore();

  const [activeLine, setActiveLine] = useState<number | null>(1);

  const chapter = JAVA_CHAPTERS.find((c) => c.id === selectedChapterId) || JAVA_CHAPTERS[0];
  const isCompleted = completedChapters.includes(chapter.id);
  const isBookmarked = bookmarkedChapters.includes(chapter.id);

  const activeExplanation = chapter.lineBreakdown.find((item) => item.lineNumber === activeLine);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Chapter Navigator */}
        <div className="lg:col-span-1 space-y-3">
          <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 shadow-xl">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-amber-400 mb-3 flex items-center justify-between">
              <span>Curriculum Chapters</span>
              <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">
                {completedChapters.length}/{JAVA_CHAPTERS.length} Done
              </span>
            </h2>
            <div className="space-y-1.5">
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
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-between ${
                      active
                        ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center space-x-2 truncate">
                      {done ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-600 shrink-0" />
                      )}
                      <span className="truncate">{ch.title.split('.')[1] || ch.title}</span>
                    </div>
                    {book && <Bookmark className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-2xl p-4 border border-amber-500/30">
            <div className="flex items-center space-x-2 text-amber-400 font-semibold text-sm mb-1">
              <Cpu className="w-4 h-4" />
              <span>JVM Mental Model</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Click any line in the code viewer to instantly inspect stack frames, heap allocation, and bytecode execution rules.
            </p>
          </div>
        </div>

        {/* Main Content & Babel-IT Dissector */}
        <div className="lg:col-span-3 space-y-6">
          {/* Chapter Header Card */}
          <div className="bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {chapter.category}
                </span>
                <span className="text-xs text-slate-400 flex items-center space-x-1">
                  <span>⏱️ {chapter.estimatedTime}</span>
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
                  title="Bookmark chapter"
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
                  <span>{isCompleted ? 'Completed' : 'Mark Complete'}</span>
                </button>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">{chapter.title}</h1>
            <p className="text-sm sm:text-base text-amber-300 font-medium mb-4">{chapter.subtitle}</p>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">{chapter.summary}</p>
          </div>

          {/* Babel-IT Interactive Code Dissector */}
          <div className="bg-slate-900/95 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
            <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-xs font-mono text-slate-400 ml-2">Interactive Code Dissector (Click any line)</span>
              </div>
              <span className="text-xs text-amber-400 font-mono">Java 17+ JVM Target</span>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 divide-y xl:divide-y-0 xl:divide-x divide-slate-800">
              {/* Code Snippet Box */}
              <div className="p-6 font-mono text-xs sm:text-sm overflow-x-auto bg-slate-950/65">
                <pre className="space-y-1">
                  {chapter.codeSnippet.split('\n').map((lineText, idx) => {
                    const lineNum = idx + 1;
                    const isSelected = activeLine === lineNum;
                    return (
                      <div
                        key={lineNum}
                        onClick={() => setActiveLine(lineNum)}
                        className={`group px-3 py-1.5 rounded-lg cursor-pointer transition-all flex items-center space-x-4 ${
                          isSelected
                            ? 'bg-amber-500/20 text-amber-300 border-l-4 border-amber-400 shadow-sm'
                            : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                        }`}
                      >
                        <span className="w-6 text-right text-slate-600 select-none text-xs">{lineNum}</span>
                        <span className="flex-1 whitespace-pre">{lineText}</span>
                        <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'text-amber-400 translate-x-1' : 'opacity-0 group-hover:opacity-50 text-slate-500'}`} />
                      </div>
                    );
                  })}
                </pre>
              </div>

              {/* Line Explanation & JVM Mental Model Card */}
              <div className="p-6 bg-slate-900/90 flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-3">
                    <HelpCircle className="w-4 h-4" />
                    <span>Line {activeLine} Deep-Dive</span>
                  </div>

                  {activeExplanation ? (
                    <div className="space-y-4">
                      <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 font-mono text-xs text-amber-200">
                        {activeExplanation.code}
                      </div>
                      <p className="text-slate-200 text-sm leading-relaxed">
                        {activeExplanation.explanation}
                      </p>
                      {activeExplanation.memoryHint && (
                        <div className="flex items-center space-x-2 text-xs text-orange-400 bg-orange-500/10 px-3 py-2 rounded-xl border border-orange-500/20">
                          <Cpu className="w-4 h-4 shrink-0" />
                          <span><strong>JVM Memory Target:</strong> {activeExplanation.memoryHint}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 italic">Click a line of code on the left to inspect its JVM execution and memory mechanics.</p>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
                  <button
                    onClick={() => setRoute('quizzes')}
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-amber-500/20"
                  >
                    <span>Test Knowledge in Quiz</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* JVM Memory Notes & Common Pitfalls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800">
              <h3 className="text-base font-bold text-white mb-3 flex items-center space-x-2">
                <Cpu className="w-5 h-5 text-amber-400" />
                <span>JVM Memory Mechanics</span>
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">{chapter.jvmMemoryNotes}</p>
            </div>

            <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800">
              <h3 className="text-base font-bold text-white mb-3 flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-orange-400" />
                <span>Common Pitfalls & Gotchas</span>
              </h3>
              <ul className="space-y-2 text-sm text-slate-300">
                {chapter.commonPitfalls.map((pitfall, idx) => (
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
