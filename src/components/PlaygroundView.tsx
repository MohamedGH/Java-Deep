import React, { useState } from 'react';
import { useJavaStore } from '../store/useJavaStore';
import { 
  Terminal, 
  Sparkles, 
  Play, 
  Code2, 
  Cpu, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  Bookmark,
  Layers,
  HelpCircle
} from 'lucide-react';

export const PlaygroundView: React.FC = () => {
  const { customSnippets, addCustomSnippet, language, addError } = useJavaStore();

  const templates = [
    {
      id: 'fact',
      title: 'Recursive Factorial',
      code: `public class FactorialCalculator {
    public static void main(String[] args) {
        int number = 5;
        long result = calculateFactorial(number);
        System.out.println("Factorial of " + number + " is " + result);
    }
    
    public static long calculateFactorial(int n) {
        if (n <= 1) return 1;
        return n * calculateFactorial(n - 1);
    }
}`
    },
    {
      id: 'str',
      title: 'String Pool vs new String()',
      code: `public class StringPoolTest {
    public static void main(String[] args) {
        String s1 = "Babel";
        String s2 = "Babel";
        String s3 = new String("Babel");
        
        System.out.println("s1 == s2 : " + (s1 == s2)); // true (Pool)
        System.out.println("s1 == s3 : " + (s1 == s3)); // false (Heap)
        System.out.println("s1.equals(s3) : " + s1.equals(s3)); // true
    }
}`
    },
    {
      id: 'poly',
      title: 'Polymorphism & VTable',
      code: `abstract class Device {
    abstract void powerOn();
}

class Phone extends Device {
    @Override
    void powerOn() { System.out.println("Phone booted in 3s"); }
}

public class Main {
    public static void main(String[] args) {
        Device dev = new Phone();
        dev.powerOn(); // invokevirtual dynamic dispatch
    }
}`
    },
    {
      id: 'stream',
      title: 'Streams & Functional Lambdas',
      code: `import java.util.*;
import java.util.stream.*;

public class StreamFilter {
    public static void main(String[] args) {
        List<Integer> values = List.of(1, 2, 3, 4, 5, 6, 7, 8);
        int total = values.stream()
            .filter(v -> v % 2 == 0)
            .map(v -> v * 10)
            .reduce(0, Integer::sum);
        System.out.println("Sum of even x10: " + total);
    }
}`
    },
    {
      id: 'nested',
      title: 'Nested vs Inner (this$0)',
      code: `public class Outer {
    private String tag = "PARENT_INSTANCE";

    // Static Nested: Pas de lien mémoire
    public static class StaticHelper {
        public void run() { System.out.println("Static Nested (0 surcoût)"); }
    }

    // Inner Class: Lien caché this$0 vers Outer !
    public class InnerWorker {
        public void work() { System.out.println("Inner accède: " + tag); }
    }

    public static void main(String[] args) {
        Outer.StaticHelper s = new Outer.StaticHelper();
        Outer o = new Outer();
        Outer.InnerWorker w = o.new InnerWorker();
    }
}`
    }
  ];

  const [code, setCode] = useState<string>(templates[0].code);
  const [snippetTitle, setSnippetTitle] = useState(templates[0].title);
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
      const msg = err.message || 'Network error connecting to AI analysis server.';
      setError(msg);
      addError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSnippet = () => {
    if (!snippetTitle.trim() || !code.trim()) return;
    addCustomSnippet(snippetTitle, code);
  };

  const loadTemplate = (tmpl: typeof templates[0]) => {
    setCode(tmpl.code);
    setSnippetTitle(tmpl.title);
    setAnalysisResult(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div>
          <div className="flex items-center space-x-2 text-amber-400 font-semibold text-xs uppercase tracking-wider mb-2">
            <Terminal className="w-4 h-4" />
            <span>{language === 'fr' ? 'Dissecteur de Code Java par IA' : 'AI Java Code Dissector'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            {language === 'fr' ? 'Laboratoire Interactif & Tuteur Virtuel' : 'Interactive Playground & AI Tutor'}
          </h1>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl">
            {language === 'fr'
              ? 'Écrivez ou collez n\'importe quel code Java pour obtenir instantanément une dissection ligne par ligne à la Babel-IT, une modélisation mémoire et des pièges à éviter.'
              : 'Paste any Java snippet to receive an instant Babel-IT style line-by-line dissection, JVM memory trace, and common gotchas.'}
          </p>
        </div>
      </div>

      {/* Templates Row */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-400 font-semibold mr-2">
          {language === 'fr' ? 'Modèles prêts à l\'emploi :' : 'Quick Templates:'}
        </span>
        {templates.map((tmpl) => (
          <button
            key={tmpl.id}
            onClick={() => loadTemplate(tmpl)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-amber-300 font-medium transition-all"
          >
            {tmpl.title}
          </button>
        ))}
      </div>

      {/* Main Grid: Code Editor on Left, Dissection on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Editor Column */}
        <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Code2 className="w-5 h-5 text-amber-400" />
                <span className="font-bold text-white text-sm">
                  {language === 'fr' ? 'Éditeur Source Java' : 'Java Source Editor'}
                </span>
              </div>
              <input
                type="text"
                value={snippetTitle}
                onChange={(e) => setSnippetTitle(e.target.value)}
                placeholder="Titre du snippet..."
                className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500 font-sans"
              />
            </div>

            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={16}
              className="w-full bg-slate-950 font-mono text-xs sm:text-sm text-slate-200 p-4 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500 leading-relaxed resize-y"
              placeholder="// Écrivez ou collez votre code Java ici..."
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              onClick={handleSaveSnippet}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-all border border-slate-700"
            >
              {language === 'fr' ? 'Sauvegarder au profil' : 'Save to Library'}
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
              <span>{loading ? (language === 'fr' ? 'Analyse en cours...' : 'Analyzing...') : (language === 'fr' ? 'Dissecter avec l\'IA' : 'Dissect with AI')}</span>
            </button>
          </div>
        </div>

        {/* Results Column */}
        <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4 overflow-y-auto max-h-[700px]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
              <Cpu className="w-5 h-5" />
              <span>{language === 'fr' ? 'Rapport de Dissection Pédagogique' : 'Dissection Report'}</span>
            </div>
            {analysisResult && (
              <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/20 font-semibold">
                {language === 'fr' ? 'Analyse Complète' : 'Analysis Ready'}
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
            <div className="py-20 text-center space-y-3 text-slate-400">
              <Sparkles className="w-10 h-10 text-amber-400/40 mx-auto animate-bounce" />
              <p className="text-sm font-medium">
                {language === 'fr'
                  ? 'Cliquez sur "Dissecter avec l\'IA" pour obtenir l\'explication ligne par ligne et l\'analyse de la mémoire.'
                  : 'Click "Dissect with AI" to generate line-by-line breakdowns and JVM memory traces.'}
              </p>
            </div>
          )}

          {loading && (
            <div className="py-20 text-center space-y-4 text-slate-300">
              <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm font-semibold animate-pulse">
                {language === 'fr' ? 'Consultation de l\'expert Java & Spécification JVM...' : 'Consulting Java Expert & JVM Spec...'}
              </p>
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
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    {language === 'fr' ? 'Dissection Ligne par Ligne' : 'Line-by-Line Breakdown'}
                  </h4>
                  <div className="space-y-2">
                    {analysisResult.lineBreakdown.map((item: any, idx: number) => (
                      <div key={idx} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                        <div className="flex items-center justify-between font-mono text-xs">
                          <span className="text-amber-300 font-bold">Ligne {item.lineNumber}</span>
                          <span className="text-slate-500">{item.code}</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">{item.explanation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {analysisResult.jvmMemoryNotes && (
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-orange-400 flex items-center space-x-1.5">
                    <Cpu className="w-4 h-4" />
                    <span>{language === 'fr' ? 'Notes Mémoire JVM' : 'JVM Memory Notes'}</span>
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{analysisResult.jvmMemoryNotes}</p>
                </div>
              )}

              {analysisResult.commonPitfalls && analysisResult.commonPitfalls.length > 0 && (
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-red-400">
                    {language === 'fr' ? 'Pièges Communs Détectés' : 'Common Pitfalls'}
                  </h4>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {analysisResult.commonPitfalls.map((p: string, idx: number) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-red-400">•</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
