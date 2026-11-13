import React, { useState } from 'react';
import { useJavaStore } from '../store/useJavaStore';
import {
  TestLifecycleMode,
  simulateJunitLifecycle,
  evaluateAssertions,
  simulateMockitoBehavior
} from '../utils/junitEngine';
import {
  FlaskConical,
  Layers,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Cpu,
  Terminal,
  Sparkles,
  Box,
  Play,
  ShieldCheck,
  Code2,
  ArrowRight,
  Sliders,
  Zap
} from 'lucide-react';

type JunitTab = 'lifecycle' | 'architecture' | 'assertions' | 'mockito' | 'integration';

export const JUnitView: React.FC = () => {
  const { language, addError } = useJavaStore();
  const [activeTab, setActiveTab] = useState<JunitTab>('lifecycle');

  // Tab 1: Lifecycle simulator state
  const [lifecycleMode, setLifecycleMode] = useState<TestLifecycleMode>('PER_METHOD');
  const [testCount, setTestCount] = useState<number>(3);

  // Tab 3: Assertions vs assertAll simulator state
  const [assertionMode, setAssertionMode] = useState<'sequential' | 'assertAll'>('assertAll');
  const [userNameActual, setUserNameActual] = useState<string>('Bob');
  const [userAgeActual, setUserAgeActual] = useState<number>(17);

  // Tab 4: Mockito Mock vs Spy state
  const [mockitoKind, setMockitoKind] = useState<'mock' | 'spy'>('mock');
  const [useDoReturn, setUseDoReturn] = useState<boolean>(false);

  const lifecycleSim = simulateJunitLifecycle(lifecycleMode, testCount);

  const assertionChecks = [
    { label: 'user.id()', expected: 42, actual: 42 },
    { label: 'user.name()', expected: 'Alice', actual: userNameActual },
    { label: 'user.age()', expected: 25, actual: userAgeActual }
  ];
  const assertionResult = evaluateAssertions(assertionChecks, assertionMode);
  const mockitoSim = simulateMockitoBehavior(mockitoKind, useDoReturn);

  const handleRunAssertions = () => {
    if (assertionResult.failures.length > 0) {
      addError(
        assertionMode === 'sequential'
          ? `[JUnit Fail-Fast] Stoppé à l'échec #1 (${assertionResult.hiddenFailuresCount} échec(s) masqué(s) !)`
          : `[MultipleFailuresError] ${assertionResult.failures.length} échec(s) collectés simultanément via assertAll() !`
      );
    }
  };

  const handleTriggerSpyTrap = (kind: 'mock' | 'spy', doRet: boolean) => {
    setMockitoKind(kind);
    setUseDoReturn(doRet);
    if (kind === 'spy' && !doRet) {
      addError(
        language === 'fr'
          ? 'Piège Spy : when(spy.get(0)) appelle la VRAIE méthode get(0) avant le stub -> IndexOutOfBoundsException !'
          : 'Spy Trap: when(spy.get(0)) calls REAL get(0) prior to stubbing -> IndexOutOfBoundsException!'
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 border border-teal-900/40 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-mono uppercase tracking-wider mb-3">
              <FlaskConical className="w-3.5 h-3.5" />
              <span>JUnit 5 (Platform • Jupiter • Vintage) • ByteBuddy Mocks • Testcontainers</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {language === 'fr'
                ? 'JUnit 5, Cycle de Vie JVM & Écosystème de Tests'
                : 'JUnit 5, JVM Lifecycle & Java Testing Ecosystem'}
            </h1>
            <p className="mt-2 text-sm text-slate-300 max-w-3xl leading-relaxed">
              {language === 'fr'
                ? "Découvrez comment le moteur JUnit Jupiter alloue des instances sur le Tas (PER_METHOD vs PER_CLASS), collecte toutes les erreurs avec assertAll(), génère des proxies Mockito avec ByteBuddy/Objenesis sans appeler de constructeur, et orchestre les tests Spring & Testcontainers."
                : 'Understand how JUnit Jupiter allocates Heap instances (PER_METHOD vs PER_CLASS), collects failures with assertAll(), generates ByteBuddy/Objenesis mocks without running constructors, and compares C testing frameworks with Java.'}
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-teal-900/30">
          {[
            { id: 'lifecycle', fr: '1. Cycle de Vie JVM (PER_METHOD/CLASS)', en: '1. JVM Lifecycle', icon: <Cpu className="w-4 h-4" /> },
            { id: 'architecture', fr: '2. Architecture Platform & JUnit 4 vs 5', en: '2. Platform & JUnit 4 vs 5', icon: <Layers className="w-4 h-4" /> },
            { id: 'assertions', fr: '3. Assertions, assertAll & @Parameterized', en: '3. Assertions & Parameterized', icon: <Sliders className="w-4 h-4" /> },
            { id: 'mockito', fr: '4. Mockito (ByteBuddy @Mock vs @Spy)', en: '4. Mockito (@Mock vs @Spy)', icon: <ShieldCheck className="w-4 h-4" /> },
            { id: 'integration', fr: '5. CUnit vs JUnit, Spring Slices & Docker', en: '5. CUnit vs JUnit & Spring', icon: <Zap className="w-4 h-4" /> }
          ].map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as JunitTab)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  active
                    ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30 border border-teal-400/40'
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

      {/* TAB 1: JUNIT LIFECYCLE & HEAP ISOLATION */}
      {activeTab === 'lifecycle' && (
        <div className="space-y-8 animate-fadeIn">
          <div className="bg-slate-900/90 border border-teal-900/30 rounded-2xl p-6 shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                  <Cpu className="w-5 h-5 text-teal-400" />
                  <span>
                    {language === 'fr'
                      ? 'Simulateur d’Allocation Mémoire JUnit 5 (@TestInstance)'
                      : 'JUnit 5 Heap Allocation Simulator (@TestInstance)'}
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {language === 'fr'
                    ? "Par défaut (PER_METHOD), JUnit crée une NOUVELLE instance de votre classe de test sur le Tas pour CHAQUE méthode @Test afin d'empêcher les fuites d'état entre tests !"
                    : 'By default (PER_METHOD), JUnit allocates a FRESH Heap instance of the test class for EACH @Test method to guarantee field isolation!'}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setLifecycleMode('PER_METHOD')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all border ${
                    lifecycleMode === 'PER_METHOD'
                      ? 'bg-teal-600 text-white border-teal-400 shadow-md'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  PER_METHOD (Défaut)
                </button>
                <button
                  onClick={() => setLifecycleMode('PER_CLASS')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all border ${
                    lifecycleMode === 'PER_CLASS'
                      ? 'bg-amber-600 text-white border-amber-400 shadow-md'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  PER_CLASS (Partagé)
                </button>
              </div>
            </div>

            {/* Test count slider + Stats cards */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-2">
                  <span>Méthodes @Test :</span>
                  <span className="text-teal-400 font-mono font-bold">{testCount}</span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={6}
                  value={testCount}
                  onChange={(e) => setTestCount(Number(e.target.value))}
                  className="w-full accent-teal-500"
                />
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="text-[11px] text-slate-400">Objets alloués sur le Tas</div>
                <div className="text-xl font-extrabold text-teal-400 mt-1">
                  {lifecycleSim.heapInstancesAllocated} instance(s)
                </div>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="text-[11px] text-slate-400">@BeforeAll doit être static ?</div>
                <div className={`text-sm font-bold mt-1.5 ${lifecycleSim.beforeAllMustBeStatic ? 'text-amber-300' : 'text-emerald-400'}`}>
                  {lifecycleSim.beforeAllMustBeStatic ? 'OUI (obligatoire en PER_METHOD)' : 'NON (méthode d’instance autorisée)'}
                </div>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="text-[11px] text-slate-400">Risque de fuite d'état muté</div>
                <div className={`text-sm font-bold mt-1.5 ${lifecycleSim.sharedStateRisk ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {lifecycleSim.sharedStateRisk ? 'ÉLEVÉ (champs partagés !)' : 'NUL (isolation totale)'}
                </div>
              </div>
            </div>

            {/* Chronological Hook Trace */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 max-h-80 overflow-y-auto">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Trace Chronologique d’Exécution JVM ({lifecycleSim.events.length} étapes) :
              </div>
              {lifecycleSim.events.map((ev) => (
                <div
                  key={ev.step}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/80 font-mono text-xs"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-slate-500 font-bold w-6">#{ev.step}</span>
                    <span className="text-teal-300 font-bold">{ev.hook}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-[11px] text-slate-400 font-sans">{ev.detail}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-950 border border-slate-700 text-amber-300 shrink-0">
                      {ev.targetInstanceId}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ARCHITECTURE JUNIT 5 & JUNIT 4 VS 5 */}
      {activeTab === 'architecture' && (
        <div className="space-y-8 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900/90 border border-sky-900/30 rounded-2xl p-6 space-y-2">
              <div className="text-xs font-mono uppercase text-sky-400 font-bold">1. JUnit Platform</div>
              <h3 className="text-base font-bold text-white">Le Socle & TestEngine SPI</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Définit l'interface standard <code className="text-amber-300">TestEngine</code> utilisée par Maven Surefire, Gradle, IntelliJ et Eclipse pour découvrir et lancer n'importe quel moteur (Jupiter, Vintage, jqwik, Spock, Cucumber).
              </p>
            </div>
            <div className="bg-slate-900/90 border border-teal-900/40 rounded-2xl p-6 space-y-2">
              <div className="text-xs font-mono uppercase text-teal-400 font-bold">2. JUnit Jupiter</div>
              <h3 className="text-base font-bold text-white">Nouveau Modèle Java 8+</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Apporte les annotations modernes (<code className="text-teal-300">@BeforeEach</code>, <code className="text-teal-300">@ParameterizedTest</code>), les lambdas d'assertion (<code className="text-teal-300">assertThrows</code>, <code className="text-teal-300">assertAll</code>) et l'API unifiée <code className="text-teal-300">@ExtendWith</code> remplaçant les Runners/Rules.
              </p>
            </div>
            <div className="bg-slate-900/90 border border-amber-900/30 rounded-2xl p-6 space-y-2">
              <div className="text-xs font-mono uppercase text-amber-400 font-bold">3. JUnit Vintage</div>
              <h3 className="text-base font-bold text-white">Rétrocompatibilité JUnit 3 & 4</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Fournit un <code className="text-amber-300">VintageTestEngine</code> pour exécuter vos anciens tests JUnit 4 (<code className="text-slate-400">org.junit.Test</code>) côte à côte avec vos nouveaux tests JUnit 5 durant une migration progressive.
              </p>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-base font-bold text-white mb-4">Comparatif JUnit 4 vs JUnit 5 (Jupiter)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase">
                    <th className="py-2 pr-4">Concept</th>
                    <th className="py-2 pr-4 text-amber-400">JUnit 4 (org.junit.*)</th>
                    <th className="py-2 text-teal-400">JUnit 5 Jupiter (org.junit.jupiter.api.*)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70 font-mono text-slate-300">
                  <tr>
                    <td className="py-2.5 pr-4 font-sans font-semibold text-white">Visibilité classe/méthode</td>
                    <td className="py-2.5 pr-4 text-rose-300">public obligatoire</td>
                    <td className="py-2.5 text-emerald-300">package-private suffisant (plus propre !)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-sans font-semibold text-white">Hooks Avant/Après</td>
                    <td className="py-2.5 pr-4">@Before / @After / @BeforeClass</td>
                    <td className="py-2.5 text-teal-300">@BeforeEach / @AfterEach / @BeforeAll</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-sans font-semibold text-white">Exceptions attendues</td>
                    <td className="py-2.5 pr-4">@Test(expected = FooException.class)</td>
                    <td className="py-2.5 text-teal-300">assertThrows(FooException.class, () -&gt; ...)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-sans font-semibold text-white">Extensions / Mocks</td>
                    <td className="py-2.5 pr-4">@RunWith (1 seul!) + @Rule</td>
                    <td className="py-2.5 text-teal-300">@ExtendWith (composable à l'infini)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-sans font-semibold text-white">Ignorer un test</td>
                    <td className="py-2.5 pr-4">@Ignore</td>
                    <td className="py-2.5 text-teal-300">@Disabled("Raison")</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ASSERTIONS, ASSERTALL & PARAMETERIZED */}
      {activeTab === 'assertions' && (
        <div className="space-y-8 animate-fadeIn">
          <div className="bg-slate-900/90 border border-teal-900/30 rounded-2xl p-6 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                  <Sliders className="w-5 h-5 text-teal-400" />
                  <span>
                    {language === 'fr'
                      ? 'Simulateur : Assertions Séquentielles vs assertAll()'
                      : 'Simulator: Sequential Fail-Fast vs assertAll()'}
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {language === 'fr'
                    ? "Avec des assertions séquentielles, la 1ère erreur coupe le test et masque les bugs suivants ! assertAll() exécute tous les lambdas Executable et agrège toutes les erreurs."
                    : 'Sequential assertions abort on the 1st error, hiding subsequent failures. assertAll() executes every Executable lambda and aggregates all errors into MultipleFailuresError.'}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setAssertionMode('sequential')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    assertionMode === 'sequential'
                      ? 'bg-rose-600 text-white border-rose-400'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  Séquentiel (Fail-Fast)
                </button>
                <button
                  onClick={() => setAssertionMode('assertAll')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    assertionMode === 'assertAll'
                      ? 'bg-teal-600 text-white border-teal-400'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  assertAll() (Groupé)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      user.name() réel (attendu: "Alice") :
                    </label>
                    <input
                      type="text"
                      value={userNameActual}
                      onChange={(e) => setUserNameActual(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      user.age() réel (attendu: 25) :
                    </label>
                    <input
                      type="number"
                      value={userAgeActual}
                      onChange={(e) => setUserAgeActual(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white"
                    />
                  </div>
                </div>

                <button
                  onClick={handleRunAssertions}
                  className="w-full py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-md"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Exécuter les assertions & notifier l’Error Manager</span>
                </button>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Assertions exécutées :</span>
                    <span className="text-teal-300 font-bold">{assertionResult.executedCount} / 3</span>
                  </div>
                  {assertionResult.hiddenFailuresCount > 0 && (
                    <div className="text-amber-400 font-bold">
                      ⚠️ {assertionResult.hiddenFailuresCount} bug(s) masqué(s) par l'arrêt prématuré !
                    </div>
                  )}
                  {assertionResult.failures.length === 0 ? (
                    <div className="text-emerald-400 font-bold">✅ Toutes les assertions ont réussi !</div>
                  ) : (
                    <div className="space-y-1 pt-2 border-t border-slate-800 text-rose-300">
                      {assertionResult.failures.map((f, i) => (
                        <div key={i}>{f}</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
                <div className="text-teal-400 font-bold mb-2">// @ParameterizedTest & assertAll()</div>
                <pre>{`@ParameterizedTest
@CsvSource({
    "42, Alice, 25",
    "99, Bob,   30"
})
@DisplayName("Vérifie tous les attributs utilisateur en 1 passe")
void shouldValidateUser(int id, String name, int age) {
    User u = service.find(id);
    assertAll("Propriétés User",
        () -> assertEquals(id, u.id()),
        () -> assertEquals(name, u.name()),
        () -> assertEquals(age, u.age())
    );
}`}</pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: MOCKITO UNDER THE HOOD (BYTEBUDDY & OBJENESIS) */}
      {activeTab === 'mockito' && (
        <div className="space-y-8 animate-fadeIn">
          <div className="bg-slate-900/90 border border-indigo-900/30 rounded-2xl p-6 shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-indigo-400" />
                  <span>Mockito sous le capot : ByteBuddy, Objenesis & Piège du @Spy</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Comment <code className="text-indigo-300">@Mock</code> instancie un objet sans jamais appeler son constructeur Java, et pourquoi <code className="text-amber-300">when(spy.get(0))</code> échoue !
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleTriggerSpyTrap('mock', false)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${
                    mockitoKind === 'mock' ? 'bg-indigo-600 text-white border-indigo-400' : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  @Mock (Coquille vide ByteBuddy)
                </button>
                <button
                  onClick={() => handleTriggerSpyTrap('spy', false)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${
                    mockitoKind === 'spy' && !useDoReturn ? 'bg-rose-600 text-white border-rose-400' : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  @Spy + when() [PIÈGE]
                </button>
                <button
                  onClick={() => handleTriggerSpyTrap('spy', true)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${
                    mockitoKind === 'spy' && useDoReturn ? 'bg-emerald-600 text-white border-emerald-400' : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  @Spy + doReturn() [SÛR]
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs space-y-2.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Classe générée (Metaspace) :</span>
                  <span className="text-indigo-300 font-bold">{mockitoSim.generatedClassName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Constructeur réel exécuté ?</span>
                  <span className={mockitoSim.constructorInvoked ? 'text-amber-300 font-bold' : 'text-sky-400 font-bold'}>
                    {mockitoSim.constructorInvoked ? 'OUI (enveloppe vraie instance)' : 'NON (Objenesis alloue sans <init>)'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Comportement si non stubbé :</span>
                  <span className="text-slate-200">{mockitoSim.unstubbedMethodReturn}</span>
                </div>
                <div
                  className={`p-3 rounded-lg border mt-2 ${
                    mockitoSim.whenStubTrapTriggered
                      ? 'bg-rose-950/40 border-rose-600 text-rose-300'
                      : 'bg-emerald-950/30 border-emerald-700/50 text-emerald-300'
                  }`}
                >
                  {mockitoSim.explanation}
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
                <pre>{`List<String> list = new ArrayList<>();
List<String> spy = Mockito.spy(list);

// ❌ PIÈGE : Java évalue l'argument 'spy.get(0)' AVANT when() !
// La vraie ArrayList est vide -> IndexOutOfBoundsException !
when(spy.get(0)).thenReturn("Hello");

// ✅ SOLUTION SÛRE pour @Spy :
doReturn("Hello").when(spy).get(0);`}</pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: CUNIT VS JUNIT, SPRING TEST SLICES & TESTCONTAINERS */}
      {activeTab === 'integration' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-2">
              <div className="font-mono font-bold text-sky-400">@WebMvcTest (Slice Rapide)</div>
              <p className="text-slate-300">
                Ne démarre que la couche HTTP/JSON (MockMvc, Jackson, Security), sans BDD ni @Service. Démarrage : ~0,8 s.
              </p>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-2">
              <div className="font-mono font-bold text-amber-400">@DataJpaTest + Testcontainers</div>
              <p className="text-slate-300">
                Lance un vrai conteneur Docker PostgreSQL éphémère (<code className="text-amber-300">@ServiceConnection</code> Boot 3.1+) au lieu d'un faux H2 in-memory !
              </p>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-2">
              <div className="font-mono font-bold text-rose-400">@SpringBootTest (End-to-End)</div>
              <p className="text-slate-300">
                Charge TOUT l'ApplicationContext en mémoire. À limiter aux scénarios E2E critiques grâce au Context Caching de Spring Test.
              </p>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-base font-bold text-white mb-3">Comparaison C (CUnit / Criterion / Unity) vs Java (JUnit 5)</h3>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
              <pre>{`// En C : Aucune réflexion ! Enregistrement manuel de pointeurs de fonctions (CUnit)
// ou macros d'auto-enregistrement ELF sections + fork() (Criterion) pour survivre aux SEGFAULT :
CU_add_test(suite, "test_addition", test_addition_fn);

// En Java (JUnit 5) :
// 1. Découverte automatique via Scan du Classpath & Réflexion sur @Test.
// 2. Pas de SEGFAULT possible : un NullPointerException est attrapé proprement par
//    le TestEngine qui déroule la pile et passe immédiatement au @Test suivant.`}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
