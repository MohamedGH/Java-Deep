import React, { useEffect } from 'react';
import { useJavaStore } from '../store/useJavaStore';
import { JAVA_CHAPTERS } from '../data/javaChapters';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  RotateCcw, 
  Layers, 
  Cpu, 
  Terminal, 
  Sparkles, 
  ArrowRight,
  Gauge,
  CheckCircle2
} from 'lucide-react';

export const ExecutionStepperView: React.FC = () => {
  const {
    selectedChapterId,
    setSelectedChapterId,
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

  // Auto-play interval
  useEffect(() => {
    let timer: any = null;
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner & Chapter Selector */}
      <div className="bg-slate-900/90 rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 font-semibold text-xs uppercase tracking-wider mb-1">
            <Cpu className="w-4 h-4" />
            <span>{language === 'fr' ? 'Débogueur Pédagogique Pas-à-Pas' : 'Step-by-Step Educational Debugger'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center space-x-2">
            <span>{chapter.title[language]}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {language === 'fr' 
              ? 'Exécution pas à pas avec inspection en temps réel de la Pile, du Tas et du Program Counter (PC).' 
              : 'Line-by-line stepping with real-time inspection of Stack, Heap, and Program Counter (PC).'}
          </p>
        </div>

        {/* Chapter Switcher Dropdown */}
        <div className="flex items-center space-x-3">
          <label className="text-xs font-semibold text-slate-400 whitespace-nowrap">
            {language === 'fr' ? 'Chapitre :' : 'Chapter:'}
          </label>
          <select
            value={chapter.id}
            onChange={(e) => {
              setSelectedChapterId(e.target.value);
              resetStepper();
            }}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-amber-300 font-semibold focus:outline-none focus:border-amber-500"
          >
            {JAVA_CHAPTERS.map((ch) => (
              <option key={ch.id} value={ch.id}>
                {ch.title[language]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stepper Control Deck */}
      <div className="bg-slate-900/95 rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        {/* Step Navigation Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={prevStepperStep}
            disabled={stepperIndex === 0}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 disabled:opacity-40 transition-all"
            title={language === 'fr' ? 'Étape précédente' : 'Previous step'}
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsStepperPlaying(!isStepperPlaying)}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-amber-500/20"
          >
            {isStepperPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isStepperPlaying ? (language === 'fr' ? 'Pause' : 'Pause') : (language === 'fr' ? 'Lecture Auto' : 'Auto Play')}</span>
          </button>

          <button
            onClick={nextStepperStep}
            disabled={stepperIndex === steps.length - 1}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 disabled:opacity-40 transition-all"
            title={language === 'fr' ? 'Étape suivante' : 'Next step'}
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <button
            onClick={resetStepper}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-all"
            title={language === 'fr' ? 'Réinitialiser' : 'Reset'}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Speed Selector */}
        <div className="flex items-center space-x-2 text-xs text-slate-400 font-mono">
          <Gauge className="w-4 h-4 text-amber-400" />
          <span>{language === 'fr' ? 'Vitesse :' : 'Speed:'}</span>
          {[
            { label: '0.5x', ms: 2500 },
            { label: '1x', ms: 1500 },
            { label: '2x', ms: 750 }
          ].map((sp) => (
            <button
              key={sp.label}
              onClick={() => setStepperSpeedMs(sp.ms)}
              className={`px-2 py-1 rounded-lg transition-all ${
                stepperSpeedMs === sp.ms
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {sp.label}
            </button>
          ))}
        </div>

        {/* Step Progress Counter */}
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <span className="text-xs font-mono font-bold text-amber-400">
              {language === 'fr' ? `Étape ${stepperIndex + 1} / ${steps.length}` : `Step ${stepperIndex + 1} / ${steps.length}`}
            </span>
            <div className="w-28 sm:w-36 bg-slate-800 rounded-full h-1.5 mt-1 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-400 to-orange-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Split: Code View + Step Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Source Code View (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col justify-between">
          <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-xs font-mono text-slate-400 ml-2">Source: {chapter.id}.java</span>
            </div>
            <span className="text-[10px] font-mono bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/20">
              PC: {currentStep.programCounter}
            </span>
          </div>

          <div className="p-4 font-mono text-xs overflow-x-auto bg-slate-950/70 space-y-1">
            {chapter.codeSnippet.split('\n').map((line, idx) => {
              const lineNum = idx + 1;
              const isActive = lineNum === currentStep.lineNumber;

              return (
                <div
                  key={lineNum}
                  onClick={() => {
                    const matchedIdx = steps.findIndex((s) => s.lineNumber === lineNum);
                    if (matchedIdx !== -1) setStepperIndex(matchedIdx);
                  }}
                  className={`group px-3 py-1.5 rounded-lg cursor-pointer transition-all flex items-center space-x-3 ${
                    isActive
                      ? 'bg-amber-500/20 text-amber-300 border-l-4 border-amber-400 shadow-md font-bold'
                      : 'text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <span className="w-5 text-right text-slate-600 select-none text-[11px]">{lineNum}</span>
                  <span className="flex-1 whitespace-pre">{line}</span>
                  {isActive && (
                    <span className="text-[10px] bg-amber-400 text-slate-950 font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 animate-pulse">
                      ► Active
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Current Step Explanation Bar */}
          <div className="p-4 bg-slate-950/90 border-t border-slate-800 space-y-1">
            <div className="flex items-center space-x-2 text-xs font-bold text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'fr' ? 'Explication de l\'instruction' : 'Instruction Explanation'}</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-sans">
              {currentStep.description[language]}
            </p>
          </div>
        </div>

        {/* Right: Real-time Memory Inspector (Stack, Heap, Stdout) (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Thread Stack Card */}
          <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                <Layers className="w-4 h-4" />
                <span>{language === 'fr' ? 'Pile d\'Exécution (Thread Stack - LIFO)' : 'Execution Stack (Thread Stack - LIFO)'}</span>
              </div>
              <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/20 font-mono">
                {currentStep.stackFrames.length} {language === 'fr' ? 'Cadre(s)' : 'Frame(s)'}
              </span>
            </div>

            {currentStep.stackFrames.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-3 text-center">
                {language === 'fr' ? 'Aucun cadre actif sur la pile.' : 'No active frame on the stack.'}
              </p>
            ) : (
              <div className="space-y-3">
                {currentStep.stackFrames.map((frame, fIdx) => (
                  <div key={fIdx} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono font-bold text-amber-300">
                      <span>Frame: {frame.method}</span>
                      <span className="text-[10px] text-slate-500 uppercase tracking-widest">Stack Frame #{fIdx + 1}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {frame.variables.map((v, vIdx) => (
                        <div key={vIdx} className="bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800 flex items-center justify-between text-xs font-mono">
                          <span className="text-slate-400 font-medium">{v.type} {v.name} =</span>
                          <span className={`font-bold ${v.isRef ? 'text-amber-400' : 'text-emerald-400'}`}>
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

          {/* Heap Memory Card */}
          <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                <Cpu className="w-4 h-4" />
                <span>{language === 'fr' ? 'Tas de la JVM (Heap Memory Instances)' : 'JVM Heap Memory Instances'}</span>
              </div>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20 font-mono">
                {currentStep.heapObjects.length} {language === 'fr' ? 'Objet(s)' : 'Object(s)'}
              </span>
            </div>

            {currentStep.heapObjects.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-3 text-center">
                {language === 'fr' ? 'Aucun objet alloué sur le Tas à cette étape.' : 'No object allocated on the Heap at this step.'}
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentStep.heapObjects.map((obj) => (
                  <div
                    key={obj.id}
                    className={`p-3.5 rounded-xl border transition-all text-xs font-mono space-y-1.5 ${
                      obj.isGarbage
                        ? 'bg-red-950/20 border-red-500/40 text-red-300'
                        : 'bg-slate-950 border-slate-800 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white flex items-center space-x-1.5">
                        <span className={`w-2 h-2 rounded-full ${obj.isGarbage ? 'bg-red-500' : 'bg-emerald-400'}`} />
                        <span>{obj.className}</span>
                      </span>
                      <span className="text-amber-400 font-bold">{obj.address}</span>
                    </div>

                    <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-800 space-y-0.5 text-[11px]">
                      {Object.entries(obj.fields).map(([k, val]) => (
                        <div key={k} className="flex justify-between">
                          <span className="text-slate-400">{k}:</span>
                          <span className="text-slate-200 font-semibold">{val}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-end pt-1">
                      <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                        obj.isGarbage ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {obj.isGarbage ? 'Garbage Candidate' : 'Live Instance'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Standard Output (stdout) Console */}
          <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 shadow-xl space-y-2">
            <div className="flex items-center space-x-2 text-slate-400 font-bold text-xs uppercase tracking-wider border-b border-slate-800 pb-2">
              <Terminal className="w-4 h-4 text-amber-400" />
              <span>Console Standard Output (System.out)</span>
            </div>

            <div className="bg-slate-950 rounded-xl p-3 font-mono text-xs min-h-[50px] border border-slate-800 text-emerald-400 space-y-1">
              {currentStep.stdout.length === 0 ? (
                <span className="text-slate-600 italic">// Empty output...</span>
              ) : (
                currentStep.stdout.map((line, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <span className="text-slate-600 select-none">&gt;</span>
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
