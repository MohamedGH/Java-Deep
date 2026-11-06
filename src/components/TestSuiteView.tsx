import React, { useState } from 'react';
import { useJavaStore } from '../store/useJavaStore';
import { 
  CheckSquare, 
  Play, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  Layers, 
  Cpu, 
  Sparkles,
  Filter,
  Check
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
    }, 450);
  };

  const categories = ['All', 'State', 'JVM Engine', 'Memory', 'Routing', 'Functional', 'Error'];

  const filteredTests = selectedCategory === 'All'
    ? testResults
    : testResults.filter((t) => t.category === selectedCategory);

  const passedCount = testResults.filter((t) => t.status === 'passed').length;
  const healthPct = Math.round((passedCount / testResults.length) * 100);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-amber-400 font-semibold text-xs uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>{language === 'fr' ? 'Centre d\'Assurance Qualité & Tests' : 'Quality Assurance & Functional Tests'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              {language === 'fr' ? 'Suite de Tests Fonctionnels' : 'Functional Test Suite'}
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              {language === 'fr'
                ? 'Chaque fonctionnalité implémentée (State Manager Zustand, Routeur, Gestionnaire d\'erreurs, Moteur d\'exécution JVM, Garbage Collector, pipelines fonctionnels) possède un test unitaire dédié avec assertions réelles.'
                : 'Every feature implemented (Zustand state store, route manager, error manager, JVM stepper, GC tracing, pure functional pipelines) is verified by real unit assertions.'}
            </p>
          </div>

          <button
            onClick={handleRunTests}
            disabled={running}
            className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
          >
            <Play className={`w-4 h-4 ${running ? 'animate-spin' : ''}`} />
            <span>{running ? (language === 'fr' ? 'Exécution des tests...' : 'Running assertions...') : (language === 'fr' ? 'Relancer Tous les Tests' : 'Rerun All Tests')}</span>
          </button>
        </div>
      </div>

      {/* Test Stats KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">
              {language === 'fr' ? 'Cas de Tests Implémentés' : 'Implemented Test Cases'}
            </span>
            <h3 className="text-2xl font-black text-white mt-1">{testResults.length}</h3>
          </div>
          <CheckSquare className="w-8 h-8 text-amber-400 opacity-80" />
        </div>

        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">
              {language === 'fr' ? 'Succès (Passed Assertions)' : 'Passed Assertions'}
            </span>
            <h3 className="text-2xl font-black text-emerald-400 mt-1">{passedCount}</h3>
          </div>
          <CheckCircle2 className="w-8 h-8 text-emerald-400 opacity-80" />
        </div>

        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">
              {language === 'fr' ? 'Taux de Fiabilité' : 'Reliability Score'}
            </span>
            <h3 className="text-2xl font-black text-amber-400 mt-1">{healthPct}%</h3>
          </div>
          <ShieldCheck className="w-8 h-8 text-amber-400 opacity-80" />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-400 font-semibold mr-2 flex items-center space-x-1">
          <Filter className="w-3.5 h-3.5" />
          <span>{language === 'fr' ? 'Filtrer par module :' : 'Filter by module:'}</span>
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedCategory === cat
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Tests Results Table */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {language === 'fr' ? 'Détail des Assertions & Benchmarks' : 'Assertions & Benchmarks Details'}
          </span>
          <span className="text-xs text-amber-400 font-mono">
            Pure Functional Assertions Engine
          </span>
        </div>

        <div className="divide-y divide-slate-800">
          {filteredTests.map((test) => (
            <div key={test.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-800/40 transition-all">
              <div className="flex items-start space-x-3">
                {test.status === 'passed' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                )}
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-bold text-white">{test.name}</h4>
                    <span className="text-[10px] bg-slate-800 text-amber-300 px-2 py-0.5 rounded-full font-mono border border-slate-700">
                      {test.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{test.description}</p>
                  <div className="text-[11px] font-mono text-slate-500 pt-0.5">
                    ✓ {test.assertion}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 self-end sm:self-center shrink-0">
                <span className="text-xs font-mono text-slate-400">{test.durationMs}ms</span>
                <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  PASSED
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
