import React, { useEffect } from 'react';
import { useJavaStore } from '../store/useJavaStore';
import { JAVA_CHAPTERS } from '../data/javaChapters';
import { ChapterNavigatorBar } from './ChapterDrawer';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Layers,
  Cpu,
  Terminal,
  Gauge
} from 'lucide-react';

export const ExecutionStepperView: React.FC = () => {
  const {
    selectedChapterId,
    stepperIndex,
    isStepperPlaying,
    stepperSpeedMs,
    setStepperIndex,
    nextStepperStep,
    prevStepperStep,
    resetStepper,
    setIsStepperPlaying,
    setStepperSpeedMs,
    language
  } = useJavaStore();

  const chapter = JAVA_CHAPTERS.find((c) => c.id === selectedChapterId) || JAVA_CHAPTERS[0];
  const steps = chapter.executionSteps;
  const currentStep = steps[stepperIndex] || steps[0];

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    if (isStepperPlaying) {
      timer = setInterval(() => {
        if (stepperIndex < steps.length - 1) {
          nextStepperStep();
        } else {
          setIsStepperPlaying(false);
        }
      }, stepperSpeedMs);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isStepperPlaying, stepperIndex, steps.length, stepperSpeedMs, nextStepperStep, setIsStepperPlaying]);

  const progressPct = Math.round(((stepperIndex + 1) / steps.length) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Chapter Picker Bar (No <select> dropdown) */}
      <ChapterNavigatorBar
        onChapterSelect={() => resetStepper()}
        contextLabel={{ fr: 'Débogueur Pas-à-Pas', en: 'Step Debugger' }}
      />

      {/* Playback Control Deck */}
      <section className="bg-[#0F1623] rounded-2xl p-4 sm:px-6 border border-slate-800/90 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={prevStepperStep}
            disabled={stepperIndex === 0}
            className="min-h-[44px] sm:min-h-[40px] min-w-[44px] sm:min-w-[40px] rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 disabled:opacity-40 flex items-center justify-center transition-colors"
            title={language === 'fr' ? 'Étape précédente' : 'Previous step'}
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsStepperPlaying(!isStepperPlaying)}
            className="min-h-[44px] sm:min-h-[40px] px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-colors whitespace-nowrap"
          >
            {isStepperPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>
              {isStepperPlaying
                ? 'Pause'
                : language === 'fr'
                ? 'Lecture auto'
                : 'Auto play'}
            </span>
          </button>

          <button
            onClick={nextStepperStep}
            disabled={stepperIndex === steps.length - 1}
            className="min-h-[44px] sm:min-h-[40px] min-w-[44px] sm:min-w-[40px] rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 disabled:opacity-40 flex items-center justify-center transition-colors"
            title={language === 'fr' ? 'Étape suivante' : 'Next step'}
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <button
            onClick={resetStepper}
            className="min-h-[44px] sm:min-h-[40px] min-w-[44px] sm:min-w-[40px] rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 flex items-center justify-center transition-colors"
            title={language === 'fr' ? 'Réinitialiser' : 'Reset'}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Speed segmented control */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Gauge className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="hidden sm:inline">{language === 'fr' ? 'Vitesse' : 'Speed'}</span>
          <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800">
            {[
              { label: '0.5x', ms: 2500 },
              { label: '1x', ms: 1500 },
              { label: '2x', ms: 750 }
            ].map((sp) => (
              <button
                key={sp.label}
                onClick={() => setStepperSpeedMs(sp.ms)}
                className={`px-2.5 py-1 rounded-lg font-mono text-xs tabular-nums transition-colors ${
                  stepperSpeedMs === sp.ms
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {sp.label}
              </button>
            ))}
          </div>
        </div>

        {/* Step Progress Counter */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs font-mono font-semibold text-amber-400 tabular-nums">
              {language === 'fr'
                ? `Étape ${stepperIndex + 1} / ${steps.length}`
                : `Step ${stepperIndex + 1} / ${steps.length}`}
            </div>
            <div className="w-28 sm:w-36 bg-slate-800 rounded-full h-1.5 mt-1.5 overflow-hidden">
              <div
                className="bg-amber-500 h-full transition-all duration-200"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Split: Source Code (5 cols) + Stack & Heap Inspector (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Source Code Pane */}
        <div className="lg:col-span-5 bg-[#0F1623] rounded-2xl border border-slate-800/90 overflow-hidden">
          <div className="bg-[#0B101B] px-4 py-3 border-b border-slate-800 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300">{chapter.id}.java</span>
            <span className="text-amber-400 tabular-nums">PC: {currentStep.programCounter}</span>
          </div>

          <div className="p-4 font-mono text-xs overflow-x-auto bg-[#090D16] space-y-1">
            {chapter.codeSnippet.split('\n').map((line, idx) => {
              const lineNum = idx + 1;
              const isActive = lineNum === currentStep.lineNumber;
              return (
                <button
                  type="button"
                  key={lineNum}
                  onClick={() => {
                    const matchedIdx = steps.findIndex((s) => s.lineNumber === lineNum);
                    if (matchedIdx !== -1) setStepperIndex(matchedIdx);
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg transition-colors flex items-center gap-3 border ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-200 border-amber-500/40 font-semibold'
                      : 'text-slate-300 border-transparent hover:bg-slate-900'
                  }`}
                >
                  <span className="w-5 text-right text-slate-500 select-none tabular-nums shrink-0">
                    {lineNum}
                  </span>
                  <span className="flex-1 whitespace-pre">{line}</span>
                  {isActive && (
                    <span className="text-[10px] font-mono text-amber-400 font-bold shrink-0">
                      ACTIVE
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="p-4 bg-[#0B101B] border-t border-slate-800 space-y-1">
            <div className="text-xs font-semibold text-amber-400">
              {language === 'fr' ? 'État de l’instruction' : 'Instruction State'}
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {currentStep.description[language]}
            </p>
          </div>
        </div>

        {/* Memory Inspector */}
        <div className="lg:col-span-7 space-y-6">
          {/* Thread Stack */}
          <div className="bg-[#0F1623] rounded-2xl p-5 border border-slate-800/90 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs">
                <Layers className="w-4 h-4 shrink-0" />
                <span>
                  {language === 'fr'
                    ? 'Pile d’exécution (Thread Stack · LIFO)'
                    : 'Execution Stack (Thread Stack · LIFO)'}
                </span>
              </div>
              <span className="text-xs text-slate-400 font-mono tabular-nums">
                {currentStep.stackFrames.length}{' '}
                {language === 'fr' ? 'cadre(s)' : 'frame(s)'}
              </span>
            </div>

            {currentStep.stackFrames.length === 0 ? (
              <p className="text-xs text-slate-500 py-3 text-center">
                {language === 'fr' ? 'Aucun cadre actif sur la pile.' : 'No active stack frame.'}
              </p>
            ) : (
              <div className="space-y-3">
                {currentStep.stackFrames.map((frame, fIdx) => (
                  <div
                    key={fIdx}
                    className="bg-[#090D16] p-3.5 rounded-xl border border-slate-800 space-y-2.5"
                  >
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-semibold text-amber-300">{frame.method}</span>
                      <span className="text-slate-500 tabular-nums">Frame #{fIdx + 1}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {frame.variables.map((v, vIdx) => (
                        <div
                          key={vIdx}
                          className="bg-[#0F1623] px-3 py-2 rounded-lg border border-slate-800/80 flex items-center justify-between text-xs font-mono gap-2"
                        >
                          <span className="text-slate-400 truncate">
                            {v.type} {v.name}
                          </span>
                          <span
                            className={`font-semibold tabular-nums shrink-0 ${
                              v.isRef ? 'text-amber-400' : 'text-emerald-400'
                            }`}
                          >
                            {v.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Heap Memory */}
          <div className="bg-[#0F1623] rounded-2xl p-5 border border-slate-800/90 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
                <Cpu className="w-4 h-4 shrink-0" />
                <span>
                  {language === 'fr' ? 'Tas JVM (Heap Instances)' : 'JVM Heap Instances'}
                </span>
              </div>
              <span className="text-xs text-slate-400 font-mono tabular-nums">
                {currentStep.heapObjects.length}{' '}
                {language === 'fr' ? 'objet(s)' : 'object(s)'}
              </span>
            </div>

            {currentStep.heapObjects.length === 0 ? (
              <p className="text-xs text-slate-500 py-3 text-center">
                {language === 'fr'
                  ? 'Aucun objet alloué sur le Tas à cette étape.'
                  : 'No Heap object allocated at this step.'}
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentStep.heapObjects.map((obj) => (
                  <div
                    key={obj.id}
                    className={`p-3.5 rounded-xl border text-xs font-mono space-y-2 ${
                      obj.isGarbage
                        ? 'bg-red-950/20 border-red-500/40 text-red-200'
                        : 'bg-[#090D16] border-slate-800 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-white truncate">{obj.className}</span>
                      <span className="text-amber-400 font-semibold tabular-nums shrink-0">
                        {obj.address}
                      </span>
                    </div>

                    <div className="space-y-1 text-[11px] border-t border-slate-800/80 pt-2">
                      {Object.entries(obj.fields).map(([k, val]) => (
                        <div key={k} className="flex justify-between gap-2">
                          <span className="text-slate-400">{k}</span>
                          <span className="text-slate-200 font-medium truncate">{val}</span>
                        </div>
                      ))}
                    </div>

                    <div className="text-[11px] font-sans font-semibold pt-1">
                      <span className={obj.isGarbage ? 'text-red-400' : 'text-emerald-400'}>
                        {obj.isGarbage ? 'Garbage Candidate' : 'Live Instance'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Standard Output */}
          <div className="bg-[#0F1623] rounded-2xl p-4 border border-slate-800/90 space-y-2">
            <div className="flex items-center gap-2 text-slate-300 font-semibold text-xs border-b border-slate-800 pb-2">
              <Terminal className="w-4 h-4 text-amber-400 shrink-0" />
              <span>System.out</span>
            </div>

            <div className="bg-[#090D16] rounded-xl p-3 font-mono text-xs min-h-[48px] border border-slate-800 text-emerald-400 space-y-1">
              {currentStep.stdout.length === 0 ? (
                <span className="text-slate-500">
                  {language === 'fr' ? 'Aucune sortie console à cette étape.' : 'No stdout output at this step.'}
                </span>
              ) : (
                currentStep.stdout.map((line, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-slate-500 select-none">&gt;</span>
                    <span>{line}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
