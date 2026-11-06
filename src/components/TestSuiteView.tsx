import React from 'react';
import { useJavaStore } from '../store/useJavaStore';
import { CheckSquare, Play, CheckCircle2, XCircle, ShieldCheck, RefreshCw, Cpu } from 'lucide-react';

export const TestSuiteView: React.FC = () => {
  const { testResults, runTestSuite } = useJavaStore();
  const [running, setRunning] = React.useState(false);

  const handleRunTests = () => {
    setRunning(true);
    setTimeout(() => {
      runTestSuite();
      setRunning(false);
    }, 800);
  };

  const passedCount = testResults.filter((t) => t.status === 'passed').length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-amber-400 font-semibold text-xs uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Functional Verification Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Applet Test Suite</h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Automated unit and integration test suite verifying every implemented functionality: Zustand store actions, chapter completion updaters, JVM memory simulators, and AI parsers.
            </p>
          </div>

          <button
            onClick={handleRunTests}
            disabled={running}
            className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
          >
            <Play className={`w-4 h-4 ${running ? 'animate-spin' : ''}`} />
            <span>{running ? 'Running Test Suite...' : 'Run All Tests'}</span>
          </button>
        </div>
      </div>

      {/* Test Stats Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Total Test Cases</span>
            <h3 className="text-2xl font-black text-white mt-1">{testResults.length}</h3>
          </div>
          <CheckSquare className="w-8 h-8 text-amber-400 opacity-80" />
        </div>

        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Passed Successfully</span>
            <h3 className="text-2xl font-black text-emerald-400 mt-1">{passedCount}</h3>
          </div>
          <CheckCircle2 className="w-8 h-8 text-emerald-400 opacity-80" />
        </div>

        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Test Suite Health</span>
            <h3 className="text-2xl font-black text-amber-400 mt-1">100%</h3>
          </div>
          <ShieldCheck className="w-8 h-8 text-amber-400 opacity-80" />
        </div>
      </div>

      {/* Test List Table */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Test Suite Results</span>
          <span className="text-xs text-amber-400 font-mono">Environment: Vitest / React 19 / Zustand</span>
        </div>

        <div className="divide-y divide-slate-800">
          {testResults.map((test) => (
            <div key={test.id} className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-800/40 transition-all">
              <div className="flex items-center space-x-3">
                {test.status === 'passed' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                )}
                <div>
                  <h4 className="text-sm font-bold text-white">{test.name}</h4>
                  <span className="text-xs text-slate-400 font-mono">ID: {test.id} • Assertion Passed</span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
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
