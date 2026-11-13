import React, { useState } from 'react';
import { useJavaStore } from '../store/useJavaStore';
import {
  CheckSquare,
  Play,
  CheckCircle2,
  XCircle,
  ShieldCheck
} from 'lucide-react';

export const TestSuiteView: React.FC = () => {
  const { testResults, runTestSuite, language } = useJavaStore();
  const [running, setRunning] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const handleRunTests = () => {
    setRunning(true);
    setTimeout(() => {
      runTestSuite();
      setRunning(false);
    }, 300);
  };

  const categories = ['All', 'State', 'JVM Engine', 'Memory', 'Routing', 'Functional', 'Error'];

  const filteredTests =
    selectedCategory === 'All'
      ? testResults
      : testResults.filter((t) => t.category === selectedCategory);

  const passedCount = testResults.filter((t) => t.status === 'passed').length;
  const healthPct = Math.round((passedCount / Math.max(1, testResults.length)) * 100);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Header */}
      <section className="bg-[#0F1623] rounded-2xl p-6 sm:p-8 border border-slate-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>
              {language === 'fr'
                ? 'Assurance qualité & tests unitaires'
                : 'Quality Assurance & Unit Tests'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {language === 'fr' ? 'Suite de tests fonctionnels' : 'Functional Test Suite'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {language === 'fr'
              ? 'Chaque moteur (Zustand, Routeur, Gestionnaire d’erreurs, JVM, Build, Spring, JUnit, Javadoc) est validé par des assertions déterministes.'
              : 'Every module (Zustand, Router, Error Manager, JVM, Build, Spring, JUnit, Javadoc) is verified by deterministic assertions.'}
          </p>
        </div>

        <button
          onClick={handleRunTests}
          disabled={running}
          className="min-h-[44px] px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50 whitespace-nowrap shrink-0"
        >
          <Play className="w-4 h-4" />
          <span>
            {running
              ? language === 'fr'
                ? 'Exécution...'
                : 'Running...'
              : language === 'fr'
              ? 'Relancer les tests'
              : 'Rerun all tests'}
          </span>
        </button>
      </section>

      {/* KPI Row */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#0F1623] p-5 rounded-2xl border border-slate-800/90 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">
              {language === 'fr' ? 'Tests implémentés' : 'Implemented tests'}
            </div>
            <div className="text-2xl font-bold text-white mt-1 tabular-nums">
              {testResults.length}
            </div>
          </div>
          <CheckSquare className="w-6 h-6 text-amber-400" />
        </div>

        <div className="bg-[#0F1623] p-5 rounded-2xl border border-slate-800/90 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">
              {language === 'fr' ? 'Assertions réussies' : 'Passed assertions'}
            </div>
            <div className="text-2xl font-bold text-emerald-400 mt-1 tabular-nums">
              {passedCount}
            </div>
          </div>
          <CheckCircle2 className="w-6 h-6 text-emerald-400" />
        </div>

        <div className="bg-[#0F1623] p-5 rounded-2xl border border-slate-800/90 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">
              {language === 'fr' ? 'Taux de réussite' : 'Pass rate'}
            </div>
            <div className="text-2xl font-bold text-amber-400 mt-1 tabular-nums">
              {healthPct}%
            </div>
          </div>
          <ShieldCheck className="w-6 h-6 text-amber-400" />
        </div>
      </section>

      {/* Segmented Filter Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap shrink-0 border ${
              selectedCategory === cat
                ? 'bg-amber-500 text-slate-950 border-amber-500 font-bold'
                : 'bg-[#0F1623] text-slate-400 hover:text-white border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results List */}
      <section className="bg-[#0F1623] rounded-2xl border border-slate-800/90 overflow-hidden">
        <div className="bg-[#0B101B] px-5 py-3.5 border-b border-slate-800 flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-300">
            {language === 'fr' ? 'Résultats des assertions' : 'Assertion Results'}
          </span>
          <span className="font-mono text-slate-400 tabular-nums">
            {filteredTests.length} {language === 'fr' ? 'affichés' : 'shown'}
          </span>
        </div>

        <div className="divide-y divide-slate-800/80">
          {filteredTests.map((test) => {
            const ok = test.status === 'passed';
            return (
              <div
                key={test.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  {ok ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <h3 className="text-sm font-semibold text-white">{test.name}</h3>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span className="text-amber-400 font-medium">{test.category}</span>
                    </div>
                    <p className="text-xs text-slate-400">{test.description}</p>
                    <p className="text-[11px] font-mono text-slate-400 pt-0.5">
                      {test.assertion}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center shrink-0 font-mono text-xs tabular-nums">
                  <span className="text-slate-400">{test.durationMs} ms</span>
                  <span className={`font-semibold ${ok ? 'text-emerald-400' : 'text-red-400'}`}>
                    {ok ? 'PASSED' : 'FAILED'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
