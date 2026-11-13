import React, { useState } from 'react';
import { useJavaStore } from '../store/useJavaStore';
import {
  BeanDefinition,
  resolveSpringIocGraph,
  SpringScope,
  calculateBeanScopeMemory,
  simulateSpringAopCall
} from '../utils/springEngine';
import {
  Leaf,
  GitBranch,
  Layers,
  Cpu,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Terminal,
  Zap,
  RefreshCw,
  ArrowRight,
  Lock,
  Sparkles,
  Activity,
  Box,
  Database
} from 'lucide-react';

type SpringTab = 'ioc' | 'aop' | 'scopes' | 'boot' | 'aot';

const BASE_BEAN_GRAPH: BeanDefinition[] = [
  { name: 'OrderController', stereotype: '@RestController', dependsOn: ['OrderService'] },
  { name: 'OrderService', stereotype: '@Service', dependsOn: ['PaymentService', 'OrderRepository'], proxied: true },
  { name: 'PaymentService', stereotype: '@Service', dependsOn: ['StripeClient'] },
  { name: 'OrderRepository', stereotype: '@Repository', dependsOn: ['DataSource'] },
  { name: 'StripeClient', stereotype: '@Bean', dependsOn: [] },
  { name: 'DataSource', stereotype: '@Bean', dependsOn: [] }
];

export const SpringView: React.FC = () => {
  const { language, addError } = useJavaStore();
  const [activeTab, setActiveTab] = useState<SpringTab>('ioc');

  // Tab 1: IoC Graph & Circular Dependency toggle
  const [injectCycle, setInjectCycle] = useState<boolean>(false);

  // Tab 2: AOP Proxy Simulator
  const [aopCallType, setAopCallType] = useState<'external_proxy' | 'self_invocation'>('external_proxy');
  const [simulateSqlError, setSimulateSqlError] = useState<boolean>(false);

  // Tab 3: Bean Scope Memory Simulator
  const [selectedScope, setSelectedScope] = useState<SpringScope>('singleton');
  const [httpRequestsCount, setHttpRequestsCount] = useState<number>(1000);

  const activeGraph: BeanDefinition[] = injectCycle
    ? [
        ...BASE_BEAN_GRAPH.slice(0, 2),
        { name: 'PaymentService', stereotype: '@Service', dependsOn: ['OrderService'] }, // Cycle: OrderService <-> PaymentService!
        ...BASE_BEAN_GRAPH.slice(3)
      ]
    : BASE_BEAN_GRAPH;

  const iocResult = resolveSpringIocGraph(activeGraph);
  const aopResult = simulateSpringAopCall(aopCallType, simulateSqlError);
  const scopeMemory = calculateBeanScopeMemory(selectedScope, httpRequestsCount, 48);

  const handleToggleCycle = () => {
    const next = !injectCycle;
    setInjectCycle(next);
    if (next) {
      addError(
        language === 'fr'
          ? '[Spring Boot Startup Failed] BeanCurrentlyInCreationException: Dépendance circulaire détectée entre OrderService <-> PaymentService !'
          : '[Spring Boot Startup Failed] BeanCurrentlyInCreationException: Circular reference detected between OrderService <-> PaymentService!'
      );
    }
  };

  const handleSelectAopCall = (type: 'external_proxy' | 'self_invocation') => {
    setAopCallType(type);
    if (type === 'self_invocation') {
      addError(
        language === 'fr'
          ? 'Piège Self-Invocation : this.method() court-circuite le proxy CGLIB ! @Transactional ignoré !'
          : 'Self-Invocation Trap: this.method() bypasses CGLIB proxy! @Transactional ignored!'
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border border-emerald-900/40 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono uppercase tracking-wider mb-3">
              <Leaf className="w-3.5 h-3.5" />
              <span>Spring Framework 6 • Spring Boot 3 • IoC • CGLIB AOP • GraalVM AOT</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {language === 'fr'
                ? 'Spring Framework & Boot sous le capot de la JVM'
                : 'Spring Framework & Boot JVM Internals'}
            </h1>
            <p className="mt-2 text-sm text-slate-300 max-w-3xl leading-relaxed">
              {language === 'fr'
                ? "Au-delà des annotations @Service et @Autowired : comment l'ApplicationContext construit le graphe d'objets, génère des sous-classes bytecode CGLIB à chaud pour @Transactional, gère la mémoire des Beans Singleton vs Prototype, et compile en binaire natif avec GraalVM AOT."
                : 'Go beyond @Service and @Autowired: explore how ApplicationContext resolves the Bean DAG, weaves runtime CGLIB bytecode proxies for @Transactional, manages Singleton vs Prototype Heap memory, and compiles ahead-of-time with GraalVM AOT.'}
            </p>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-emerald-900/30">
          {[
            { id: 'ioc', fr: '1. Conteneur IoC & Injection', en: '1. IoC Container & DI', icon: <GitBranch className="w-4 h-4" /> },
            { id: 'aop', fr: '2. Proxies AOP & @Transactional', en: '2. AOP Proxies & @Transactional', icon: <ShieldCheck className="w-4 h-4" /> },
            { id: 'scopes', fr: '3. Scopes, Mémoire & Cycle de Vie', en: '3. Scopes, Memory & Lifecycle', icon: <Cpu className="w-4 h-4" /> },
            { id: 'boot', fr: '4. Spring Boot, Tomcat vs Virtual Threads', en: '4. Spring Boot & Threading', icon: <Zap className="w-4 h-4" /> },
            { id: 'aot', fr: '5. Pur Java / C vs Spring AOT', en: '5. Plain Java / C vs Spring AOT', icon: <Terminal className="w-4 h-4" /> }
          ].map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as SpringTab)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  active
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 border border-emerald-400/40'
                    : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/50'
                }`}
              >
                {tab.icon}
                <span>{language === 'fr' ? tab.fr : tab.en}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: IOC CONTAINER & DEPENDENCY INJECTION */}
      {activeTab === 'ioc' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Interactive IoC Topological Resolution & Cycle Detector */}
          <div className="bg-slate-900/90 border border-emerald-900/30 rounded-2xl p-6 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                  <GitBranch className="w-5 h-5 text-emerald-400" />
                  <span>
                    {language === 'fr'
                      ? "Simulateur d'Initialisation IoC (ApplicationContext & Tri Topologique)"
                      : 'IoC Startup Simulator (ApplicationContext Topological Sort)'}
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {language === 'fr'
                    ? "Spring lit vos BeanDefinitions, résout les dépendances en partant des feuilles (DataSource, StripeClient) et injecte par constructeur."
                    : 'Spring parses BeanDefinitions, resolves dependencies bottom-up from leaf nodes, and wires via constructor injection.'}
                </p>
              </div>
              <button
                onClick={handleToggleCycle}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border flex items-center space-x-2 ${
                  injectCycle
                    ? 'bg-rose-600 text-white border-rose-400 shadow-lg shadow-rose-600/30'
                    : 'bg-slate-950 text-amber-300 border-amber-500/40 hover:bg-amber-950/30'
                }`}
              >
                <AlertTriangle className="w-4 h-4" />
                <span>
                  {injectCycle
                    ? language === 'fr'
                      ? 'Supprimer la dépendance circulaire'
                      : 'Fix Circular Dependency'
                    : language === 'fr'
                    ? 'Injecter un cycle (OrderService <-> PaymentService)'
                    : 'Inject Cycle (OrderService <-> PaymentService)'}
                </span>
              </button>
            </div>

            {/* Bean Graph Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
              {activeGraph.map((bean) => {
                const inCycle = iocResult.cyclePath?.includes(bean.name);
                return (
                  <div
                    key={bean.name}
                    className={`p-3.5 rounded-xl border font-mono text-xs transition-all ${
                      inCycle
                        ? 'bg-rose-950/40 border-rose-500 text-rose-200'
                        : 'bg-slate-950 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-white">{bean.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                        {bean.stereotype}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Injecte :{' '}
                      <span className={inCycle ? 'text-rose-300 font-bold' : 'text-amber-300'}>
                        {bean.dependsOn.length > 0 ? bean.dependsOn.join(', ') : '(Aucune dépendance - Feuille)'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Outcome Console */}
            {iocResult.success ? (
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-700/50 space-y-2">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>ApplicationContext démarré ! Ordre exact d'instanciation en mémoire (Singleton Registry) :</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 font-mono text-xs pt-1">
                  {iocResult.creationOrder.map((name, idx) => (
                    <React.Fragment key={name}>
                      <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-emerald-500/40 text-emerald-300 font-bold">
                        {idx + 1}. new {name}()
                      </span>
                      {idx < iocResult.creationOrder.length - 1 && <ArrowRight className="w-3.5 h-3.5 text-slate-500" />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-600/60 font-mono text-xs text-rose-200 space-y-1.5">
                <div className="flex items-center space-x-2 font-bold text-rose-400">
                  <XCircle className="w-4 h-4" />
                  <span>APPLICATION FAILED TO START</span>
                </div>
                <div>{iocResult.error}</div>
                <div className="text-[11px] text-rose-300/80 pt-1">
                  Astuce JVM : Spring Boot 2.6+ interdit les cycles par défaut. Refactorisez en extrayant un troisième service ou en utilisant des événements applicatifs (ApplicationEventPublisher).
                </div>
              </div>
            )}
          </div>

          {/* Constructor Injection vs Field @Autowired */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-900/90 border border-emerald-900/40 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono uppercase px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Recommandé : Constructor Injection
                </span>
                <span className="text-xs text-emerald-400 font-bold">Immuable (final)</span>
              </div>
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 mb-3">
                <pre>{`@Service
public class OrderService {
    private final PaymentService paymentService; // Immuable !

    // @Autowired optionnel si 1 seul constructeur (Spring 4.3+)
    public OrderService(PaymentService paymentService) {
        this.paymentService = paymentService;
    }
}`}</pre>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                <li className="flex items-center space-x-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /><span>Champs <code className="text-amber-300">final</code> garantis initialisés (Thread-safe JMM).</span></li>
                <li className="flex items-center space-x-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /><span>Test unitaire pur Java : <code className="text-amber-300">new OrderService(mock)</code> sans Spring !</span></li>
                <li className="flex items-center space-x-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /><span>Zéro réflexion sur champs privés, compatible GraalVM Native.</span></li>
              </ul>
            </div>

            <div className="bg-slate-900/90 border border-rose-900/30 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono uppercase px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30">
                  Anti-Pattern : Field @Autowired
                </span>
                <span className="text-xs text-rose-400 font-bold">Réflexion Unsafe</span>
              </div>
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 mb-3">
                <pre>{`@Service
public class OrderService {
    @Autowired // Force field.setAccessible(true) à l'exécution !
    private PaymentService paymentService; // NE PEUT PAS être final !
}`}</pre>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                <li className="flex items-center space-x-2"><XCircle className="w-3.5 h-3.5 text-rose-400" /><span>Impossible de rendre les dépendances <code className="text-rose-300">final</code>.</span></li>
                <li className="flex items-center space-x-2"><XCircle className="w-3.5 h-3.5 text-rose-400" /><span>Brise l'encapsulation Java 17+ (<code className="text-rose-300">setAccessible(true)</code>).</span></li>
                <li className="flex items-center space-x-2"><XCircle className="w-3.5 h-3.5 text-rose-400" /><span>Masque la violation du principe de responsabilité unique (SRP).</span></li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AOP & DYNAMIC PROXIES */}
      {activeTab === 'aop' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Interactive Self-Invocation vs Proxy Call Visualizer */}
          <div className="bg-slate-900/90 border border-amber-900/30 rounded-2xl p-6 shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-amber-400" />
                  <span>
                    {language === 'fr'
                      ? 'Simulateur AOP : Proxy CGLIB vs Le Piège du Self-Invocation'
                      : 'AOP Simulator: CGLIB Proxy vs Self-Invocation Trap'}
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {language === 'fr'
                    ? "Pourquoi @Transactional, @Async ou @Cacheable ne fonctionnent-ils JAMAIS lorsqu'une méthode appelle une autre méthode de la MÊME classe via this ?"
                    : 'Why do @Transactional, @Async, or @Cacheable silently fail when calling another method inside the same class via "this"?'}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleSelectAopCall('external_proxy')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    aopCallType === 'external_proxy'
                      ? 'bg-emerald-600 text-white border-emerald-400'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  Appel Externe (via Proxy CGLIB)
                </button>
                <button
                  onClick={() => handleSelectAopCall('self_invocation')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    aopCallType === 'self_invocation'
                      ? 'bg-rose-600 text-white border-rose-400'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  Appel Interne (this.method())
                </button>
                <button
                  onClick={() => setSimulateSqlError(!simulateSqlError)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    simulateSqlError
                      ? 'bg-amber-600 text-white border-amber-400'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  {simulateSqlError ? 'Exception SQL: ON' : 'Simuler RuntimeException'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Steps Trace */}
              <div className="space-y-2.5">
                {aopResult.steps.map((s, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-xl border font-mono text-xs transition-all ${
                      s.active
                        ? 'bg-slate-950 border-emerald-800/60 text-slate-200'
                        : 'bg-rose-950/30 border-rose-700/60 text-rose-300'
                    }`}
                  >
                    <div className="text-[10px] uppercase tracking-wider text-amber-400 font-bold mb-0.5">{s.actor}</div>
                    <div>{s.step}</div>
                  </div>
                ))}

                <div
                  className={`p-3.5 rounded-xl border text-xs font-bold ${
                    aopResult.proxyIntercepted
                      ? 'bg-emerald-950/30 border-emerald-600/50 text-emerald-300'
                      : 'bg-rose-950/40 border-rose-600/60 text-rose-300'
                  }`}
                >
                  {aopResult.summary}
                </div>
              </div>

              {/* Code & Bytecode Class explanation */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 space-y-3 overflow-x-auto">
                <div className="text-amber-400 font-bold">// Ce que Spring génère en Bytecode au démarrage :</div>
                <pre>{`// Classe générée dynamiquement dans le Metaspace (CGLIB) :
public class OrderService$$SpringCGLIB$$0 extends OrderService {
    private TransactionInterceptor txInterceptor;
    private OrderService targetPojo;

    @Override
    public void placeOrder() {
        // 1. Ouvre la transaction SQL
        TransactionStatus tx = txManager.getTransaction(...);
        try {
            targetPojo.placeOrder(); // Appel du vrai code !
            txManager.commit(tx);
        } catch (RuntimeException ex) {
            txManager.rollback(tx);  // Rollback automatique !
            throw ex;
        }
    }
}

// PIÈGE : si placeOrder() dans targetPojo appelle this.saveAuditLog(),
// "this" est targetPojo (PAS le proxy CGLIB) -> aucune transaction !`}</pre>
              </div>
            </div>
          </div>

          {/* JDK Dynamic Proxy vs CGLIB */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-base font-bold text-sky-400 mb-2">1. JDK Dynamic Proxy (`java.lang.reflect.Proxy`)</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-2">
                {language === 'fr'
                  ? "Natif dans le JDK. Fonctionne uniquement si votre classe implémente une interface Java. Génère un objet implémentant l'interface et délègue tout à InvocationHandler.invoke()."
                  : 'Built into JDK. Requires an interface. Generates a $Proxy class forwarding all calls to InvocationHandler.invoke().'}
              </p>
              <div className="text-[11px] font-mono text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                Limite : Si vous injectez la classe concrète au lieu de l'interface, échec de démarrage !
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-base font-bold text-emerald-400 mb-2">2. CGLIB Subclass Proxy (Défaut Spring Boot 2+/3)</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-2">
                {language === 'fr'
                  ? "Génère une sous-classe bytecode à la volée (OrderService$$SpringCGLIB$$0 extends OrderService) et surcharge vos méthodes via VTable. Pas besoin d'interface !"
                  : 'Generates a bytecode subclass at runtime overriding methods via JVM VTable. No interface required!'}
              </p>
              <div className="text-[11px] font-mono text-rose-300 bg-slate-950 p-2.5 rounded-lg border border-rose-900/40">
                Contrainte JVM : Votre classe et vos méthodes @Transactional NE DOIVENT PAS être `final` ou `private` (car impossible à hériter/surcharger en bytecode !).
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SCOPES, MEMORY & BEAN LIFECYCLE */}
      {activeTab === 'scopes' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Interactive Scope Memory Simulator */}
          <div className="bg-slate-900/90 border border-emerald-900/30 rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-bold text-white mb-2 flex items-center space-x-2">
              <Cpu className="w-5 h-5 text-emerald-400" />
              <span>
                {language === 'fr'
                  ? 'Simulateur Mémoire des Scopes Spring (Singleton vs Prototype vs Request)'
                  : 'Spring Bean Scope JVM Memory Simulator'}
              </span>
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              {language === 'fr'
                ? 'Par défaut, TOUS les Beans Spring (@Service, @Controller, @Repository) sont SINGLETONS : 1 unique instance en mémoire partagée par tous les threads HTTP !'
                : 'By default, EVERY Spring Bean is a SINGLETON: 1 shared instance on Heap across all concurrent HTTP threads!'}
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">Scope du Bean (@Scope) :</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['singleton', 'prototype', 'request'] as SpringScope[]).map((sc) => (
                      <button
                        key={sc}
                        onClick={() => setSelectedScope(sc)}
                        className={`py-2 px-3 rounded-xl text-xs font-mono font-bold transition-all border ${
                          selectedScope === sc
                            ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        @{sc}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                    <span>Nombre de requêtes HTTP / appels getBean() :</span>
                    <span className="text-amber-400 font-mono">{httpRequestsCount.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={5000}
                    step={50}
                    value={httpRequestsCount}
                    onChange={(e) => setHttpRequestsCount(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs space-y-2.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Instances allouées sur le Tas JVM :</span>
                  <span className="text-emerald-400 font-bold">{scopeMemory.instancesAllocated.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Mémoire Tas consommée (48 B/instance) :</span>
                  <span className="text-amber-400 font-bold">{scopeMemory.totalHeapBytes.toLocaleString()} octets</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Spring appelle @PreDestroy ?</span>
                  <span className={scopeMemory.preDestroyCalled ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                    {scopeMemory.preDestroyCalled ? 'OUI (Conteneur gère destruction)' : 'NON ! (Géré par GC uniquement)'}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-800 text-[11px] text-amber-300 leading-relaxed">
                  {scopeMemory.threadSafeRisk}
                </div>
              </div>
            </div>
          </div>

          {/* 8 Stages of Spring Bean Lifecycle */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-base font-bold text-white mb-4">Cycle de vie complet d'un Bean dans la JVM</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
              {[
                { step: '1. Instantiation', desc: 'Appel du constructeur Java via réflexion ou MethodHandle.' },
                { step: '2. Populate Props', desc: 'Injection des dépendances et @Value.' },
                { step: '3. Aware Interfaces', desc: 'BeanNameAware, ApplicationContextAware.' },
                { step: '4. BPP.beforeInit', desc: 'BeanPostProcessor.postProcessBeforeInitialization().' },
                { step: '5. @PostConstruct', desc: 'Méthode d’init métier / InitializingBean.' },
                { step: '6. BPP.afterInit (AOP)', desc: 'Création du Proxy CGLIB / JDK enveloppant le Bean !' },
                { step: '7. Singleton Cache', desc: 'Stocké dans ConcurrentHashMap singletonObjects.' },
                { step: '8. @PreDestroy', desc: 'Fermeture pools/connexions à l’arrêt (sauf prototype).' }
              ].map((s) => (
                <div key={s.step} className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="text-emerald-400 font-bold mb-1">{s.step}</div>
                  <div className="text-slate-400 font-sans text-[11px]">{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SPRING BOOT AUTO-CONFIGURATION & THREADING */}
      {activeTab === 'boot' && (
        <div className="space-y-8 animate-fadeIn">
          <div className="bg-slate-900/90 border border-sky-900/30 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-2">
              {language === 'fr'
                ? "Comment fonctionne la 'magie' de @SpringBootApplication ?"
                : 'How does @SpringBootApplication Auto-Configuration actually work?'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
              {language === 'fr'
                ? "Spring Boot n'a aucune magie cachée : @SpringBootApplication combine simplement 3 annotations (@SpringBootConfiguration + @ComponentScan + @EnableAutoConfiguration). Au démarrage, il lit le fichier META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports dans vos JARs et évalue des conditions purement classpath :"
                : '@SpringBootApplication combines @Configuration, @ComponentScan, and @EnableAutoConfiguration. At boot, it evaluates AutoConfiguration.imports via deterministic classpath conditionals:'}
            </p>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-sky-300 overflow-x-auto">
              <pre>{`@AutoConfiguration
@ConditionalOnClass(DataSource.class)       // Pilote SQL présent dans le pom.xml/Gradle ?
@ConditionalOnMissingBean(DataSource.class) // Le développeur n'a pas défini son propre @Bean ?
public class DataSourceAutoConfiguration {
    @Bean
    public DataSource hikariDataSource(...) {
        return new HikariDataSource(...);     // Crée le pool HikariCP automatiquement !
    }
}`}</pre>
            </div>
          </div>

          {/* Threading Architectures Comparison */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-base font-bold text-white mb-4">
              Comparatif Mémoire & Concurrence Web : Spring MVC vs Virtual Threads vs WebFlux
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="font-bold text-amber-400">1. Spring MVC (Tomcat Classique)</div>
                <div className="text-slate-300">Modèle <strong>Thread-per-Request</strong> (200 Threads OS par défaut).</div>
                <div className="text-slate-400 font-mono text-[11px]">Coût RAM : ~1 Mo de pile native par thread bloqué en attente SQL/HTTP.</div>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-emerald-700/50 space-y-2">
                <div className="font-bold text-emerald-400">2. MVC + Java 21 Virtual Threads</div>
                <div className="text-slate-300">
                  <code className="text-amber-300">spring.threads.virtual.enabled=true</code> (Spring Boot 3.2+).
                </div>
                <div className="text-slate-400 font-mono text-[11px]">Coût RAM : quelques Ko par Virtual Thread ! Code impératif simple, scalabilité massive.</div>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-purple-700/50 space-y-2">
                <div className="font-bold text-purple-400">3. Spring WebFlux (Netty Réactif)</div>
                <div className="text-slate-300">Event Loop non-bloquant (Project Reactor: <code className="text-purple-300">Mono/Flux</code>).</div>
                <div className="text-slate-400 font-mono text-[11px]">4 à 8 Threads OS fixes, zéro blocage I/O (R2DBC requis, JDBC bloquant interdit).</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: PLAIN JAVA / C VS SPRING & GRAALVM AOT */}
      {activeTab === 'aot' && (
        <div className="space-y-8 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-3">
              <h3 className="text-base font-bold text-white">Démarrage Classique (JIT + Réflexion)</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {language === 'fr'
                  ? "À l'exécution, Spring scanne le bytecode avec ASM, charge les annotations par réflexion et crée les proxies CGLIB dynamiquement. Temps de démarrage : 1,5 à 5 secondes, empreinte RAM : ~250 Mo."
                  : 'At runtime, Spring scans bytecode with ASM, inspects annotations reflectively, and generates CGLIB proxies dynamically. Boot time: 1.5–5s, RSS ~250 MB.'}
              </p>
            </div>
            <div className="bg-slate-900/90 border border-emerald-900/40 rounded-2xl p-6 space-y-3">
              <h3 className="text-base font-bold text-emerald-400">Spring 6 / Boot 3 GraalVM Native Image (AOT)</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {language === 'fr'
                  ? "Le moteur AOT pré-évalue les @Conditional, génère le code Java de câblage des Beans à la COMPILATION (sans scan ni réflexion au runtime) et compile le tout en binaire natif ELF/Mach-O sans JVM ! Démarrage : ~40 millisecondes, RAM : ~35 Mo (idéal Serverless / Kubernetes)."
                  : 'Spring AOT pre-evaluates conditionals at BUILD time, generating plain instantiation code compiled into a standalone native binary via GraalVM! Startup: ~40ms, RSS ~35 MB.'}
              </p>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
            <h4 className="text-base font-bold text-white mb-3">Comparaison C / Pur Java vs Spring IoC</h4>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
              <pre>{`// Sans Spring (Manual Dependency Injection / Composition Root en Java pur ou C) :
DataSource ds = new HikariDataSource(url);
OrderRepository repo = new JdbcOrderRepository(ds);
PaymentService pay = new StripePaymentService(apiKey);
OrderService service = new OrderService(pay, repo);
OrderController ctrl = new OrderController(service);
// Inconvénient à grande échelle : câblage manuel fastidieux + pas d'AOP (@Transactional) automatique.

// Avec Spring 6 AOT : vous écrivez des annotations déclaratives, et Spring génère
// exactement ce code Java optimisé statiquement lors de 'mvn -Pnative native:compile' !`}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
