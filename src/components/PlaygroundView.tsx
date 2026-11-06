import React, { useState } from 'react';
import { useJavaStore } from '../store/useJavaStore';
import { Terminal, Sparkles, Play, Code2, Cpu, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

export const PlaygroundView: React.FC = () => {
  const { customSnippets, addCustomSnippet } = useJavaStore();
  const [code, setCode] = useState<string>(
    `public class FactorialCalculator {\n    public static void main(String[] args) {\n        int number = 5;\n        long result = calculateFactorial(number);\n        System.out.println("Factorial of " + number + " is " + result);\n    }\n    \n    public static long calculateFactorial(int n) {\n        if (n <= 1) return 1;\n        return n * calculateFactorial(n - 1);\n    }\n}`
  );
  const [snippetTitle, setSnippetTitle] = useState('Recursive Factorial');
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyzeCode = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/java/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to analyze code');
      setAnalysisResult(data);
    } catch (err: any) {
      setError(err.message || 'Network error connecting to AI analysis server.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSnippet = () => {
    if (!snippetTitle.trim() || !code.trim()) return;
    addCustomSnippet(snippetTitle, code);
    alert('Snippet saved successfully to your library!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-amber-400 font-semibold text-xs uppercase tracking-wider mb-2">
              <Terminal className="w-4 h-4" />
              <span>AI-Powered Java Code Dissector</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Interactive Java Playground & AI Tutor</h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Paste any Java snippet below and get an instant line-by-line Babel-IT breakdown, JVM Stack/Heap analysis, and debugging insights powered by Gemini.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Editor Column */}
        <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Code2 className="w-5 h-5 text-amber-400" />
                <span className="font-bold text-white text-sm">Java Source Editor</span>
              </div>
              <input
                type="text"
                value={snippetTitle}
                onChange={(e) => setSnippetTitle(e.target.value)}
                placeholder="Snippet title..."
                className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={14}
              className="w-full bg-slate-950 font-mono text-xs sm:text-sm text-slate-200 p-4 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500 leading-relaxed resize-y"
              placeholder="Write or paste your Java code here..."
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              onClick={handleSaveSnippet}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-all border border-slate-700"
            >
              Save to Library
            </button>

            <button
              onClick={handleAnalyzeCode}
              disabled={loading}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              <span>{loading ? 'Analyzing with AI...' : 'Analyze with AI Dissector'}</span>
            </button>
          </div>
        </div>

        {/* Analysis Results Column */}
        <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4 overflow-y-auto max-h-[700px]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
              <Cpu className="w-5 h-5" />
              <span>Babel-IT AI Explanation Report</span>
            </div>
            {analysisResult && (
              <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/20 font-semibold">
                Analysis Complete
              </span>
            )}
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl text-red-400 text-xs flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {!analysisResult && !loading && !error && (
            <div className="py-16 text-center space-y-3 text-slate-400">
              <Sparkles className="w-10 h-10 text-amber-400/40 mx-auto animate-bounce" />
              <p className="text-sm font-medium">Click "Analyze with AI Dissector" to generate a line-by-line breakdown and JVM memory trace for your code.</p>
            </div>
          )}

          {loading && (
            <div className="py-20 text-center space-y-4 text-slate-300">
              <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm font-semibold animate-pulse">Consulting AI Java Expert & JVM Spec...</p>
            </div>
          )}

          {analysisResult && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-extrabold text-white">{analysisResult.title}</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{analysisResult.overview}</p>
              </div>

              {analysisResult.lineBreakdown && analysisResult.lineBreakdown.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">Line-by-Line Dissection</h4>
                  <div className="space-y-2">
                    {analysisResult.lineBreakdown.map((item: any, idx: number) => (
                      <div key={idx} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                        <div className="flex items-center justify-between font-mono text-xs">
                          <span className="text-amber-300 font-bold">Line {item.lineNumber}</span>
                          <span className="text-slate-500">{item.code}</span>
                        </div>
                        <p className="text-xs text-slate-300">{item.explanation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {analysisResult.jvmMemoryNotes && (
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-orange-400 flex items-center space-x-1.5">
                    <Cpu className="w-4 h-4" />
                    <span>JVM Memory Notes</span>
                  </h4>
                  <p className="text-xs text-slate-300">{analysisResult.jvmMemoryNotes}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
