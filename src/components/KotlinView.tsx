import React, { useState } from 'react';
import { useJavaStore } from '../store/useJavaStore';
import {
  KotlinTypeKind,
  KotlinNullOperator,
  KotlinConstructId,
  simulateKotlinNullSafety,
  evaluateKotlinJvmLowering,
  simulateCoroutineStateMachine
} from '../utils/kotlinEngine';
import {
  Code2,
  ShieldAlert,
  Cpu,
  Layers,
  GitBranch,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertTriangle
} from 'lucide-react';

type KotlinTab = 'nullsafety' | 'lowering' | 'coroutines' | 'interop' | 'comparison';

export const KotlinView: React.FC = () => {
  const { language, addError } = useJavaStore();
  const [activeTab, setActiveTab] = useState<KotlinTab>('nullsafety');

  // Tab 1: Null-Safety & Boxing state
  const [kotlinType, setKotlinType] = useState<KotlinTypeKind>('String?');
  const [nullOp, setNullOp] = useState<KotlinNullOperator>('?:');
  const [inputIsNull, setInputIsNull] = useState<boolean>(true);

  // Tab 2: kotlinc Lowering inspector state
  const [constructId, setConstructId] = useState<KotlinConstructId>('data_class');

  // Tab 3: Coroutine CPS state machine step
  const [coroStep, setCoroStep] = useState<number>(1);

  const nullSim = simulateKotlinNullSafety(kotlinType, nullOp, inputIsNull);
  const lowering = evaluateKotlinJvmLowering(constructId);
  const coro = simulateCoroutineStateMachine(coroStep);

  const handleOperatorChange = (op: KotlinNullOperator) => {
    setNullOp(op);
    if (kotlinType.endsWith('?') && inputIsNull && op === '!!') {
      addError(
        language === 'fr'
          ? 'Opérateur !! sur valeur null : NullPointerException immédiate au runtime !'
          : 'Operator !! on null value: immediate runtime NullPointerException!'
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Header */}
      <section className="bg-[#0F1623] border border-slate-800/90 rounded-2xl p-6 sm:p-8 space-y-5">
        <div className="space-y-2 max-w-3xl">
          <div className="text-xs font-semibold text-amber-400">
            kotlinc · JVM Bytecode · Coroutines CPS · Java Interop
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight text-balance">
            {language === 'fr'
              ? 'Kotlin sur la JVM : Bytecode, Boxing, Coroutines & Interop'
              : 'Kotlin on the JVM: Bytecode, Boxing, Coroutines & Interop'}
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            {language === 'fr'
              ? 'Explorez comment kotlinc compile la null-safety, les data classes, inline/reified, @JvmInline value class et les fonctions suspend en pur bytecode JVM exécuté sur HotSpot aux côtés de Java.'
              : 'Explore how kotlinc compiles null-safety, data classes, inline/reified, @JvmInline value classes, and suspend functions into standard HotSpot JVM bytecode alongside Java.'}
          </p>
        </div>

        {/* Tab Bar */}
        <div className="flex flex-wrap gap-1.5 pt-4 border-t border-slate-800/90">
          {[
            { id: 'nullsafety' as const, fr: 'Null-Safety & Boxing (Int?)', en: 'Null-Safety & Boxing', icon: <ShieldAlert className="w-4 h-4" /> },
            { id: 'lowering' as const, fr: 'Décompilation kotlinc -> JVM', en: 'kotlinc Lowering', icon: <Cpu className="w-4 h-4" /> },
            { id: 'coroutines' as const, fr: 'Coroutines CPS vs Virtual Threads', en: 'Coroutines vs Loom', icon: <GitBranch className="w-4 h-4" /> },
            { id: 'interop' as const, fr: 'Interop Java <-> Kotlin', en: 'Java Interop', icon: <Layers className="w-4 h-4" /> },
            { id: 'comparison' as const, fr: 'Kotlin vs Java vs C', en: 'Kotlin vs Java vs C', icon: <Code2 className="w-4 h-4" /> }
          ].map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`min-h-[44px] sm:min-h-[40px] flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap shrink-0 border ${
                  active
                    ? 'bg-amber-500 text-slate-950 border-amber-500 font-bold'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white'
                }`}
              >
                {tab.icon}
                <span>{language === 'fr' ? tab.fr : tab.en}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* TAB 1: Null-Safety & Boxing */}
      {activeTab === 'nullsafety' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Controls */}
          <div className="lg:col-span-5 bg-[#0F1623] border border-slate-800/90 rounded-2xl p-5 space-y-5">
            <div>
              <div className="text-xs font-semibold text-slate-400 mb-2">
                {language === 'fr' ? '1. Type Kotlin déclaré' : '1. Declared Kotlin Type'}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {(['String', 'String?', 'Int', 'Int?'] as KotlinTypeKind[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setKotlinType(t)}
                    className={`min-h-[44px] px-3 py-2 rounded-xl font-mono text-xs font-semibold border transition-colors ${
                      kotlinType === t
                        ? 'bg-amber-500 text-slate-950 border-amber-500 font-bold'
                        : 'bg-[#090D16] text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold text-slate-400 mb-2">
                {language === 'fr' ? '2. Valeur fournie à l’appel' : '2. Runtime Input Value'}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setInputIsNull(false)}
                  className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                    !inputIsNull
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
                      : 'bg-[#090D16] text-slate-400 border-slate-800'
                  }`}
                >
                  {kotlinType.startsWith('Int') ? '42 (Valid)' : '"JavaBabel" (Valid)'}
                </button>
                <button
                  onClick={() => setInputIsNull(true)}
                  className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                    inputIsNull
                      ? 'bg-red-500/15 text-red-300 border-red-500/40'
                      : 'bg-[#090D16] text-slate-400 border-slate-800'
                  }`}
                >
                  null
                </button>
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold text-slate-400 mb-2">
                {language === 'fr' ? '3. Opérateur sur nullable' : '3. Nullable Operator'}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {([
                  { op: '?.' as const, label: '?. Safe' },
                  { op: '?:' as const, label: '?: Elvis' },
                  { op: '!!' as const, label: '!! Assert' }
                ]).map((item) => (
                  <button
                    key={item.op}
                    onClick={() => handleOperatorChange(item.op)}
                    className={`min-h-[44px] px-2.5 py-2 rounded-xl font-mono text-xs font-semibold border transition-colors ${
                      nullOp === item.op
                        ? 'bg-amber-500 text-slate-950 border-amber-500 font-bold'
                        : 'bg-[#090D16] text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Output */}
          <div className="lg:col-span-7 bg-[#0F1623] border border-slate-800/90 rounded-2xl p-5 sm:p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <div className="text-xs text-slate-400">JVM Method Descriptor</div>
                <div className="font-mono text-sm font-bold text-amber-300 mt-0.5">
                  {nullSim.jvmSignature}
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold">
                {nullSim.runtimeNpeThrown || !nullSim.compilesCleanly ? (
                  <span className="flex items-center gap-1.5 text-red-400">
                    <XCircle className="w-4 h-4" />
                    <span>{!nullSim.compilesCleanly ? 'COMPILE REJECTED' : 'RUNTIME NPE'}</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>SAFE EXECUTION</span>
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-[#090D16] p-3.5 rounded-xl border border-slate-800">
                <div className="text-slate-400">Heap Boxing (Int vs Integer)</div>
                <div
                  className={`font-semibold mt-1 ${
                    nullSim.heapBoxedObject ? 'text-amber-400' : 'text-emerald-400'
                  }`}
                >
                  {nullSim.heapBoxedObject
                    ? 'BOXED (java.lang.Integer on Heap)'
                    : 'ZERO BOXING (Primitive or Direct Ref)'}
                </div>
              </div>
              <div className="bg-[#090D16] p-3.5 rounded-xl border border-slate-800">
                <div className="text-slate-400">Result</div>
                <div className="font-mono font-semibold text-white mt-1 truncate">
                  {nullSim.outcomeValue}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-300">
                {language === 'fr' ? 'Bytecode émis par kotlinc' : 'Bytecode emitted by kotlinc'}
              </div>
              <pre className="bg-[#090D16] border border-slate-800 rounded-xl p-4 font-mono text-xs text-sky-200 overflow-x-auto leading-relaxed">
                {nullSim.bytecodeProbe.join('\n')}
              </pre>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{nullSim.explanation}</p>
          </div>
        </div>
      )}

      {/* TAB 2: kotlinc Lowering */}
      {activeTab === 'lowering' && (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {([
              { id: 'data_class' as const, label: 'data class' },
              { id: 'inline_reified' as const, label: 'inline & reified' },
              { id: 'value_class' as const, label: '@JvmInline value' },
              { id: 'object_singleton' as const, label: 'object Singleton' },
              { id: 'sealed_class' as const, label: 'sealed class' },
              { id: 'extension_fn' as const, label: 'Extension fun' }
            ]).map((item) => (
              <button
                key={item.id}
                onClick={() => setConstructId(item.id)}
                className={`min-h-[40px] px-3.5 py-2 rounded-xl font-mono text-xs font-semibold border transition-colors ${
                  constructId === item.id
                    ? 'bg-amber-500 text-slate-950 border-amber-500 font-bold'
                    : 'bg-[#0F1623] text-slate-300 border-slate-800 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#0F1623] border border-slate-800/90 rounded-2xl p-5 space-y-4">
              <h2 className="text-sm font-bold text-white">{lowering.title}</h2>
              <div>
                <div className="text-xs text-slate-400 mb-1.5">Kotlin Source</div>
                <pre className="bg-[#090D16] border border-slate-800 rounded-xl p-4 font-mono text-xs text-amber-200 overflow-x-auto">
                  {lowering.kotlinCode}
                </pre>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-1.5">
                  {language === 'fr' ? 'Décompilation JVM équivalente' : 'Lowered JVM Representation'}
                </div>
                <pre className="bg-[#090D16] border border-slate-800 rounded-xl p-4 font-mono text-xs text-sky-200 overflow-x-auto leading-relaxed">
                  {lowering.loweredJvmJava}
                </pre>
              </div>
            </div>

            <div className="bg-[#0F1623] border border-slate-800/90 rounded-2xl p-5 space-y-4">
              <div>
                <h3 className="text-xs font-semibold text-amber-400 mb-2">
                  {language === 'fr' ? 'Mécaniques Bytecode (.class)' : 'Bytecode Mechanics (.class)'}
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                  {lowering.bytecodeHighlights.map((hl, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">·</span>
                      <span>{hl}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-[#090D16] border border-slate-800 space-y-1">
                <div className="text-xs font-semibold text-emerald-400">
                  {language === 'fr' ? 'Empreinte Heap & Metaspace' : 'Heap & Metaspace Footprint'}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{lowering.heapImpact}</p>
              </div>

              <div className="p-4 rounded-xl bg-[#090D16] border border-slate-800 space-y-1">
                <div className="text-xs font-semibold text-sky-400">
                  {language === 'fr' ? 'Comparaison avec Java moderne' : 'Modern Java Comparison'}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{lowering.javaComparison}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Coroutines CPS State Machine vs Java 21 Virtual Threads */}
      {activeTab === 'coroutines' && (
        <div className="space-y-6">
          <div className="bg-[#0F1623] border border-slate-800/90 rounded-2xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-white">
                  {language === 'fr'
                    ? 'Machine à États CPS d’une fonction suspend'
                    : 'CPS State Machine of a suspend Function'}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {language === 'fr'
                    ? 'kotlinc transforme chaque point suspend en tableswitch(label) et sauvegarde les variables locales dans un objet Continuation sur le Tas.'
                    : 'kotlinc rewrites suspend points into tableswitch(label) saving locals in a Heap Continuation object.'}
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                {coro.allSteps.map((s) => (
                  <button
                    key={s.step}
                    onClick={() => setCoroStep(s.step)}
                    className={`min-h-[40px] px-3 py-1.5 rounded-xl font-mono text-xs font-semibold border tabular-nums transition-colors ${
                      coroStep === s.step
                        ? 'bg-amber-500 text-slate-950 border-amber-500 font-bold'
                        : 'bg-[#090D16] text-slate-300 border-slate-800 hover:text-white'
                    }`}
                  >
                    Step {s.step + 1}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-[#090D16] p-4 rounded-xl border border-slate-800">
                <div className="text-slate-400">CPS Label / State</div>
                <div className="font-mono font-bold text-amber-300 mt-1 tabular-nums">
                  label = {coro.currentStep.labelValue} · {coro.currentStep.state}
                </div>
              </div>
              <div className="bg-[#090D16] p-4 rounded-xl border border-slate-800">
                <div className="text-slate-400">Carrier Thread</div>
                <div className="font-mono font-semibold text-emerald-300 mt-1 truncate">
                  {coro.currentStep.threadName}
                </div>
              </div>
              <div className="bg-[#090D16] p-4 rounded-xl border border-slate-800">
                <div className="text-slate-400">Heap Continuation</div>
                <div className="font-mono text-sky-300 mt-1 truncate">
                  {coro.currentStep.continuationHeap}
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-200 bg-[#090D16] p-4 rounded-xl border border-slate-800">
              {coro.currentStep.detail}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#0F1623] border border-slate-800/90 rounded-2xl p-5 space-y-2">
              <h3 className="text-sm font-bold text-amber-400">Kotlin Coroutines (Compiler CPS)</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {language === 'fr'
                  ? 'Sans pile JVM par coroutine (juste ~100 octets dans un objet Continuation sur le Tas), fonctionne dès Java 8 et apporte la Structured Concurrency native (CoroutineScope, Flow, async/await).'
                  : 'Stackless (~100B Heap Continuation object), runs on Java 8+, and ships built-in Structured Concurrency (CoroutineScope, Flow, async/await).'}
              </p>
            </div>
            <div className="bg-[#0F1623] border border-slate-800/90 rounded-2xl p-5 space-y-2">
              <h3 className="text-sm font-bold text-sky-400">Java 21 Virtual Threads (JVM Loom)</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {language === 'fr'
                  ? 'Piles continues montées/démontées par la JVM HotSpot elle-même (stack-chunk objects). Aucun mot-clé suspend requis : du code JDBC bloquant standard se met à l’échelle automatiquement.'
                  : 'Stackful continuations managed inside HotSpot JVM itself. Requires zero `suspend` coloring—legacy blocking JDBC/socket calls scale transparently.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Java <-> Kotlin Interop */}
      {activeTab === 'interop' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#0F1623] border border-slate-800/90 rounded-2xl p-5 space-y-3">
            <h2 className="text-sm font-bold text-white">
              {language === 'fr'
                ? 'Annotations d’interopérabilité JVM'
                : 'JVM Interoperability Annotations'}
            </h2>
            <pre className="bg-[#090D16] border border-slate-800 rounded-xl p-4 font-mono text-xs text-sky-200 overflow-x-auto leading-relaxed">
{`class PriceCalculator @JvmOverloads constructor(
    @JvmField val currency: String = "EUR",
    private val taxRate: Double = 0.20
) {
    @Throws(IOException::class)
    fun loadRates() { /* Checked exception visible to Java */ }

    companion object {
        @JvmStatic fun createDefault() = PriceCalculator()
    }
}`}
            </pre>
          </div>

          <div className="bg-[#0F1623] border border-slate-800/90 rounded-2xl p-5 space-y-3 text-xs sm:text-sm text-slate-300">
            <h2 className="text-sm font-bold text-white">
              {language === 'fr' ? 'Pièges fréquents d’interopérabilité' : 'Common Interop Traps'}
            </h2>
            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-[#090D16] border border-slate-800 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Platform Types (String!) :</strong>{' '}
                  {language === 'fr'
                    ? 'Une valeur Java sans @Nullable/@NotNull arrive en Kotlin avec nullabilité inconnue (String!) : annotez ou forcez le type explicite.'
                    : 'Unannotated Java values enter Kotlin as String! (unknown nullability)—explicitly annotate or declare nullable types.'}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#090D16] border border-slate-800 flex items-start gap-2.5">
                <ArrowRight className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Checked Exceptions :</strong>{' '}
                  {language === 'fr'
                    ? 'Kotlin ne vérifie aucune Checked Exception à la compilation. Ajoutez @Throws(...) si des méthodes Java appellent votre code Kotlin.'
                    : 'Kotlin has no checked exceptions. Add @Throws(...) when exposing throwing APIs to Java callers.'}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#090D16] border border-slate-800 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">@JvmStatic &amp; @JvmOverloads :</strong>{' '}
                  {language === 'fr'
                    ? 'Génèrent des méthodes statiques réelles et des surcharges télescopiques compatibles avec Java et Spring.'
                    : 'Emit real static bytecode methods and overloaded constructors compatible with Java and Spring.'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Kotlin vs Java vs C */}
      {activeTab === 'comparison' && (
        <div className="bg-[#0F1623] border border-slate-800/90 rounded-2xl p-5 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono">
                <th className="py-2.5 pr-4">Aspect</th>
                <th className="py-2.5 pr-4">Kotlin (JVM)</th>
                <th className="py-2.5 pr-4">Java 21+</th>
                <th className="py-2.5">C (POSIX)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 text-slate-300">
              <tr>
                <td className="py-3 pr-4 font-semibold text-white">Null Safety</td>
                <td className="py-3 pr-4">Type system (T vs T?) + ifnull bytecode</td>
                <td className="py-3 pr-4">Nullable by default (Optional / JSpecify)</td>
                <td className="py-3">NULL pointer dereference = SIGSEGV</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-semibold text-white">Primitives &amp; Value</td>
                <td className="py-3 pr-4">Int (int), Int? (Integer), @JvmInline value</td>
                <td className="py-3 pr-4">int vs Integer (Valhalla coming)</td>
                <td className="py-3">int / struct stack-allocated by value</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-semibold text-white">Immutability</td>
                <td className="py-3 pr-4">val + data class + List vs MutableList</td>
                <td className="py-3 pr-4">final + record + List.of()</td>
                <td className="py-3">const pointer discipline</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-semibold text-white">Concurrency</td>
                <td className="py-3 pr-4">CPS Coroutines (stackless Heap state machine)</td>
                <td className="py-3 pr-4">Virtual Threads (Project Loom stack chunks)</td>
                <td className="py-3">pthreads / epoll / io_uring event loop</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-semibold text-white">Generics</td>
                <td className="py-3 pr-4">Type erasure + `inline reified` workaround</td>
                <td className="py-3 pr-4">Type erasure (Class&lt;T&gt; token)</td>
                <td className="py-3">_Generic / preprocessor macros / void*</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
