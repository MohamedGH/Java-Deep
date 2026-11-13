import React, { useState } from 'react';
import { useJavaStore } from '../store/useJavaStore';
import {
  MavenPhase,
  MAVEN_DEFAULT_LIFECYCLE,
  simulateMavenLifecycle,
  DependencyPathNode,
  resolveDependencyConflict,
  evaluateGradleDag,
  GradleTaskInputs
} from '../utils/buildEngine';
import {
  Hammer,
  Package,
  GitBranch,
  Layers,
  Terminal,
  Play,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Cpu,
  Clock,
  Box,
  Sparkles,
  FileCode,
  ArrowRight,
  Zap,
  Shield,
  RefreshCw,
  FolderTree
} from 'lucide-react';

type BuildTab = 'overview' | 'ant' | 'maven' | 'gradle' | 'beyond';
type ConfigFormat = 'make' | 'ant' | 'maven' | 'gradle' | 'bazel';

const SAMPLE_CONFLICT_GRAPH: ReadonlyArray<DependencyPathNode> = [
  {
    artifact: 'com.google.guava:guava',
    version: '28.0.0',
    depth: 2,
    path: 'App -> legacy-auth-sdk -> guava:28.0.0'
  },
  {
    artifact: 'com.google.guava:guava',
    version: '32.1.3',
    depth: 3,
    path: 'App -> web-client -> http-core -> guava:32.1.3'
  },
  {
    artifact: 'com.google.guava:guava',
    version: '31.1.0',
    depth: 3,
    path: 'App -> metrics-lib -> exporter -> guava:31.1.0'
  }
];

export const BuildToolsView: React.FC = () => {
  const { language, addError } = useJavaStore();
  const [activeTab, setActiveTab] = useState<BuildTab>('overview');
  const [selectedConfig, setSelectedConfig] = useState<ConfigFormat>('maven');

  // Maven Lifecycle Simulator state
  const [targetMavenPhase, setTargetMavenPhase] = useState<MavenPhase>('package');
  const [failAtMavenPhase, setFailAtMavenPhase] = useState<MavenPhase | null>(null);

  // Gradle Incremental DAG Simulator state
  const [gradleInputs, setGradleInputs] = useState<GradleTaskInputs>({
    srcModified: false,
    testModified: false,
    resourcesModified: false,
    buildCacheEnabled: true,
    configCacheEnabled: true,
    daemonWarm: true
  });

  // Dependency conflict simulation mode
  const [conflictEngine, setConflictEngine] = useState<'maven' | 'gradle'>('maven');

  const mavenRun = simulateMavenLifecycle(targetMavenPhase, failAtMavenPhase);
  const gradleRun = evaluateGradleDag(gradleInputs);
  const conflictWinner = resolveDependencyConflict(SAMPLE_CONFLICT_GRAPH, conflictEngine);

  const handleMavenFailToggle = (phase: MavenPhase) => {
    if (failAtMavenPhase === phase) {
      setFailAtMavenPhase(null);
      return;
    }
    setFailAtMavenPhase(phase);
    addError(
      language === 'fr'
        ? `[BUILD FAILURE] Maven interrompu à la phase '${phase}' ! Les phases suivantes sont ignorées.`
        : `[BUILD FAILURE] Maven aborted at phase '${phase}'! Subsequent phases skipped.`
    );
  };

  const configSnippets: Record<ConfigFormat, { title: string; badge: string; paradigm: string; code: string }> = {
    make: {
      title: 'Makefile (C / Unix classique)',
      badge: 'Shell Impératif + Timestamps',
      paradigm: 'Basé sur les timestamps fichiers & commandes shell OS-dépendantes',
      code: `# Makefile (Monde C / natif)
CC = gcc
CFLAGS = -Wall -O2

app: main.o utils.o
\t$(CC) -o app main.o utils.o

%.o: %.c
\t$(CC) $(CFLAGS) -c $< -o $@

clean:
\trm -f *.o app`
    },
    ant: {
      title: 'build.xml (Apache Ant - 2000)',
      badge: 'XML Impératif (Procédural)',
      paradigm: 'Multiplateforme JVM, mais vous écrivez chaque étape manuellement (pas de convention ni dépendances)',
      code: `<!-- build.xml (Apache Ant) -->
<project name="JavaApp" default="jar" basedir=".">
  <target name="init">
    <mkdir dir="build/classes"/>
  </target>
  <target name="compile" depends="init">
    <javac srcdir="src" destdir="build/classes" classpath="lib/guava.jar"/>
  </target>
  <target name="jar" depends="compile">
    <jar destfile="dist/app.jar" basedir="build/classes"/>
  </target>
</project>`
    },
    maven: {
      title: 'pom.xml (Apache Maven - 2004)',
      badge: 'XML Déclaratif + Convention',
      paradigm: 'Convention over Configuration (src/main/java) + Cycle de vie fixe + Dépôt Central (.m2)',
      code: `<!-- pom.xml (Apache Maven) -->
<project>
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.javababel</groupId>
  <artifactId>core-engine</artifactId>
  <version>1.0.0</version>

  <properties>
    <maven.compiler.release>21</maven.compiler.release>
  </properties>

  <dependencies>
    <dependency>
      <groupId>com.google.guava</groupId>
      <artifactId>guava</artifactId>
      <version>32.1.3-jre</version>
    </dependency>
  </dependencies>
</project>`
    },
    gradle: {
      title: 'build.gradle.kts (Gradle Kotlin DSL)',
      badge: 'Task DAG + Build Cache',
      paradigm: 'Graphe Acyclique Dirigé (DAG), compilation incrémentale, Daemon chaud & DSL typé Kotlin',
      code: `// build.gradle.kts (Gradle Kotlin DSL)
plugins {
    java
    application
}

java {
    toolchain.languageVersion.set(JavaLanguageVersion.of(21))
}

repositories { mavenCentral() }

dependencies {
    implementation("com.google.guava:guava:32.1.3-jre")
    testImplementation("org.junit.jupiter:junit-jupiter:5.10.2")
}`
    },
    bazel: {
      title: 'BUILD.bazel (Google Bazel)',
      badge: 'Hermétique & Distribué',
      paradigm: 'Sandbox hermétique par hash SHA-256, monorepos polyglottes C/Java/Go & cache distant',
      code: `# BUILD.bazel (Google Bazel)
java_binary(
    name = "app",
    srcs = glob(["src/main/java/**/*.java"]),
    main_class = "com.javababel.Main",
    deps = [
        "@maven//:com_google_guava_guava",
    ],
)`
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 border border-sky-900/40 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-mono uppercase tracking-wider mb-3">
              <Hammer className="w-3.5 h-3.5" />
              <span>Make vs Ant • Maven • Gradle • Bazel • Mill • jlink</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {language === 'fr'
                ? 'Outils de Build & Gestion de Dépendances Java'
                : 'Java Build Systems & Dependency Management'}
            </h1>
            <p className="mt-2 text-sm text-slate-300 max-w-3xl leading-relaxed">
              {language === 'fr'
                ? "De la compilation manuelle javac et du Makefile en C jusqu'à Apache Ant, Maven (Convention & POM), Gradle (Task DAG & Build Cache) et aux outils modernes (Bazel, mvnd, JBang, jlink/jpackage) : comprenez comment vos sources .java deviennent des artefacts .jar exécutables."
                : 'From manual javac and C Makefiles to Apache Ant, Maven (Convention & POM), Gradle (Task DAG & Build Cache), and modern ecosystems (Bazel, mvnd, JBang, jlink/jpackage).'}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-sky-900/30">
          {[
            { id: 'overview', labelFr: '1. Vue d’ensemble & Make vs Java', labelEn: '1. Overview & Make vs Java', color: 'sky', icon: <FolderTree className="w-4 h-4" /> },
            { id: 'ant', labelFr: '2. Apache Ant (Impératif)', labelEn: '2. Apache Ant (Imperative)', color: 'orange', icon: <Terminal className="w-4 h-4" /> },
            { id: 'maven', labelFr: '3. Apache Maven (Cycle & POM)', labelEn: '3. Apache Maven (Lifecycle)', color: 'rose', icon: <Package className="w-4 h-4" /> },
            { id: 'gradle', labelFr: '4. Gradle (DAG & Cache)', labelEn: '4. Gradle (DAG & Cache)', color: 'emerald', icon: <GitBranch className="w-4 h-4" /> },
            { id: 'beyond', labelFr: '5. Bazel, Mill, JBang & jlink', labelEn: '5. Bazel, Mill, JBang & jlink', color: 'purple', icon: <Zap className="w-4 h-4" /> }
          ].map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as BuildTab)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  active
                    ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30 border border-sky-400/40'
                    : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/50'
                }`}
              >
                {tab.icon}
                <span>{language === 'fr' ? tab.labelFr : tab.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: OVERVIEW & ROSETTA COMPARATOR */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Why manual javac fails */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-bold text-white mb-2 flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span>
                {language === 'fr'
                  ? 'Pourquoi ne pas compiler simplement avec javac et java ?'
                  : 'Why not just compile manually with javac and java?'}
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
              {language === 'fr'
                ? "Un projet réel comporte des centaines de classes et 40+ bibliothèques externes (Spring, Jackson, PostgreSQL JDBC, JUnit), chacune ayant ses propres dépendances transitives. Sans outil de build, la commande devient vite ingérable :"
                : 'A real-world Java project contains hundreds of classes and 40+ external libraries with transitive dependencies. Without a build tool, manual CLI invocation explodes:'}
            </p>
            <div className="bg-slate-950 p-4 rounded-xl border border-rose-900/40 font-mono text-xs text-rose-300 overflow-x-auto">
              <pre>{`# L'enfer du Classpath manuel ("JAR Hell") :
javac -cp "libs/jackson-core-2.17.jar:libs/jackson-databind.jar:libs/slf4j-api.jar:..." \\
      -d out/classes src/com/app/Main.java src/com/app/Service.java ...
jar cfe app.jar com.app.Main -C out/classes .`}</pre>
            </div>
          </div>

          {/* Rosetta Stone Config Comparator */}
          <div className="bg-slate-900/90 border border-sky-900/30 rounded-2xl p-6 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                  <FileCode className="w-5 h-5 text-sky-400" />
                  <span>
                    {language === 'fr'
                      ? 'Pierre de Rosette des Fichiers de Build : Make vs Ant vs Maven vs Gradle vs Bazel'
                      : 'Build Configuration Rosetta Stone: Make vs Ant vs Maven vs Gradle vs Bazel'}
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {language === 'fr'
                    ? 'Comparez la syntaxe, le paradigme et le niveau d’abstraction pour compiler une application et gérer une dépendance.'
                    : 'Compare syntax, paradigm, and abstraction level for compiling and managing dependencies.'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {(['make', 'ant', 'maven', 'gradle', 'bazel'] as ConfigFormat[]).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setSelectedConfig(fmt)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition-all border ${
                    selectedConfig === fmt
                      ? 'bg-sky-600 text-white border-sky-400 shadow-md'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {fmt === 'make' ? 'Makefile (C)' : fmt === 'ant' ? 'Ant (build.xml)' : fmt === 'maven' ? 'Maven (pom.xml)' : fmt === 'gradle' ? 'Gradle (.kts)' : 'Bazel (BUILD)'}
                </button>
              ))}
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div className="text-sm font-bold text-sky-300">{configSnippets[selectedConfig].title}</div>
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-300 border border-sky-500/30">
                  {configSnippets[selectedConfig].badge}
                </span>
              </div>
              <div className="text-xs text-slate-400 italic">{configSnippets[selectedConfig].paradigm}</div>
              <pre className="font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed">
                {configSnippets[selectedConfig].code}
              </pre>
            </div>
          </div>

          {/* Comparison Matrix Table */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-lg">
            <h3 className="text-base font-bold text-white mb-4">
              {language === 'fr' ? 'Tableau Comparatif Historique & Technique' : 'Historical & Technical Comparison Matrix'}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase">
                    <th className="py-2.5 pr-4">Outil (Année)</th>
                    <th className="py-2.5 pr-4">Format</th>
                    <th className="py-2.5 pr-4">Paradigme</th>
                    <th className="py-2.5 pr-4">Gestion Dépendances</th>
                    <th className="py-2.5">Performance / Cache</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70 text-slate-300">
                  <tr>
                    <td className="py-3 pr-4 font-bold text-slate-200">GNU Make (1976)</td>
                    <td className="py-3 pr-4 font-mono">Makefile</td>
                    <td className="py-3 pr-4">Règles & Timestamps OS</td>
                    <td className="py-3 pr-4 text-rose-400">Aucune (pkg-config / système)</td>
                    <td className="py-3">Incrémental par mtime fichier</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-bold text-orange-400">Apache Ant (2000)</td>
                    <td className="py-3 pr-4 font-mono">build.xml</td>
                    <td className="py-3 pr-4">Impératif procédural</td>
                    <td className="py-3 pr-4 text-amber-400">Via plugin externe (Apache Ivy)</td>
                    <td className="py-3">Recompile souvent tout sans soin</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-bold text-rose-400">Apache Maven (2004)</td>
                    <td className="py-3 pr-4 font-mono">pom.xml</td>
                    <td className="py-3 pr-4">Déclaratif + Convention</td>
                    <td className="py-3 pr-4 text-emerald-400">Natif (Maven Central + ~/.m2)</td>
                    <td className="py-3">Rapide avec <code className="text-sky-300">mvnd</code> (Daemon)</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-bold text-emerald-400">Gradle (2007/2012)</td>
                    <td className="py-3 pr-4 font-mono">.gradle / .kts</td>
                    <td className="py-3 pr-4">Task DAG programmable</td>
                    <td className="py-3 pr-4 text-emerald-400">Natif + Version Catalogs (.toml)</td>
                    <td className="py-3 text-emerald-300">Daemon + Build & Config Cache SHA-256</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-bold text-purple-400">Google Bazel (2015)</td>
                    <td className="py-3 pr-4 font-mono">BUILD.bazel</td>
                    <td className="py-3 pr-4">Hermétique & Reproductible</td>
                    <td className="py-3 pr-4 text-sky-400">Bzlmod + rules_jvm_external</td>
                    <td className="py-3 text-purple-300">Exécution distante massive (Monorepo)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: APACHE ANT & MAKE */}
      {activeTab === 'ant' && (
        <div className="space-y-8 animate-fadeIn">
          <div className="bg-slate-900/90 border border-orange-900/30 rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-bold text-white mb-2">
              {language === 'fr'
                ? 'Apache Ant (2000) : "Another Neat Tool" — L\'héritier multiplateforme de Make'
                : 'Apache Ant (2000): "Another Neat Tool" — The Cross-Platform Make Successor'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {language === 'fr'
                ? "Créé par James Duncan Davidson (auteur de Tomcat) car GNU Make cassait entre Windows et Solaris/Linux à cause des commandes shell (rm vs del, slashs / vs \\) et lançait un nouveau processus JVM par fichier compilé. Ant exécute tout DANS UNE SEULE JVM en utilisant des tâches Java portables (<javac>, <mkdir>, <jar>)."
                : 'Created by James Duncan Davidson because GNU Make broke across Windows and Unix shells and spawned separate processes per invocation. Ant runs tasks inside a single JVM using portable XML tags (<javac>, <mkdir>, <jar>).'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-base font-bold text-emerald-400 mb-3">Ce que Ant a révolutionné vs Make</h3>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span><strong>100% Multiplateforme (WORA)</strong> : <code className="text-amber-300">&lt;delete dir="build"/&gt;</code> fonctionne de manière identique sur Windows, macOS et Linux.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span><strong>Une seule JVM pour compiler</strong> : Finis les milliers d'appels fork/exec à <code className="text-amber-300">javac</code> comme dans les Makefiles naïfs.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span><strong>Liberté totale</strong> : Vous orchestrez exactement les cibles (<code className="text-amber-300">&lt;target depends="clean,compile"&gt;</code>) sans contrainte de dossiers.</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-900/90 border border-rose-900/30 rounded-2xl p-6">
              <h3 className="text-base font-bold text-rose-400 mb-3">Pourquoi Ant a été détrôné par Maven & Gradle</h3>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start space-x-2">
                  <XCircle className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
                  <span><strong>Aucune convention de structure</strong> : Chaque projet plaçait ses sources dans <code className="text-rose-300">src/</code>, <code className="text-rose-300">source/</code> ou <code className="text-rose-300">java/</code>, rendant chaque fichier <code className="text-rose-300">build.xml</code> unique et long (souvent 1 000+ lignes !).</span>
                </li>
                <li className="flex items-start space-x-2">
                  <XCircle className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
                  <span><strong>XML utilisé comme langage impératif</strong> : Écrire des boucles ou des conditions <code className="text-rose-300">&lt;if&gt;</code> en XML est un cauchemar de lisibilité.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <XCircle className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
                  <span><strong>Pas de gestion de dépendances</strong> : Il fallait commiter les fichiers <code className="text-rose-300">.jar</code> directement dans Git ou ajouter <strong>Apache Ivy</strong> en renfort.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: APACHE MAVEN */}
      {activeTab === 'maven' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Interactive Maven Lifecycle Stepper */}
          <div className="bg-slate-900/90 border border-rose-900/30 rounded-2xl p-6 shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                  <Package className="w-5 h-5 text-rose-400" />
                  <span>
                    {language === 'fr'
                      ? 'Simulateur de Cycle de Vie Maven (Default Lifecycle)'
                      : 'Interactive Maven Default Lifecycle Simulator'}
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {language === 'fr'
                    ? "Dans Maven, appeler une phase exécute séquentiellement TOUTES les phases précédentes. Cliquez une phase cible et simulez éventuellement un échec (ex: bug JUnit à 'test')."
                    : 'In Maven, invoking any lifecycle phase sequentially runs ALL prior phases. Select a target phase and optionally inject a failure.'}
                </p>
              </div>
              <div className="flex items-center space-x-2 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 font-mono text-xs">
                <span className="text-slate-400">$ mvn</span>
                <span className="text-amber-400 font-bold">{targetMavenPhase}</span>
              </div>
            </div>

            {/* Target Phase Picker */}
            <div className="mb-6">
              <div className="text-xs font-semibold text-slate-300 mb-2">
                {language === 'fr' ? '1. Choisir la phase cible (mvn <phase>) :' : '1. Choose target phase:'}
              </div>
              <div className="flex flex-wrap gap-2">
                {MAVEN_DEFAULT_LIFECYCLE.map((item) => (
                  <button
                    key={item.phase}
                    onClick={() => setTargetMavenPhase(item.phase)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border ${
                      targetMavenPhase === item.phase
                        ? 'bg-rose-600 text-white border-rose-400 shadow-md'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {item.phase}
                  </button>
                ))}
              </div>
            </div>

            {/* Phase Execution Visualizer */}
            <div className="space-y-2.5">
              {mavenRun.steps.map((step, idx) => {
                const isFailed = step.status === 'FAILED';
                const isSkipped = step.status === 'SKIPPED';
                return (
                  <div
                    key={step.phase}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-xl border font-mono text-xs transition-all ${
                      isFailed
                        ? 'bg-rose-950/40 border-rose-600 text-rose-200'
                        : isSkipped
                        ? 'bg-slate-950/50 border-slate-800/60 text-slate-500 opacity-70'
                        : 'bg-emerald-950/20 border-emerald-800/40 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-[11px] font-bold">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold uppercase text-white">{step.phase}</span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                              isFailed
                                ? 'bg-rose-500/20 text-rose-300'
                                : isSkipped
                                ? 'bg-slate-800 text-slate-400'
                                : 'bg-emerald-500/20 text-emerald-300'
                            }`}
                          >
                            {step.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{step.pluginGoal}</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className="text-slate-400">{step.durationMs} ms</span>
                      <button
                        onClick={() => handleMavenFailToggle(step.phase)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all border ${
                          failAtMavenPhase === step.phase
                            ? 'bg-rose-600 text-white border-rose-400'
                            : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-rose-300'
                        }`}
                      >
                        {failAtMavenPhase === step.phase ? 'Réparer phase' : 'Simuler échec'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs font-mono">
              <div>
                Statut global :{' '}
                <span className={mavenRun.buildSuccess ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                  {mavenRun.buildSuccess ? 'BUILD SUCCESS' : `BUILD FAILURE (arrêté à ${mavenRun.failedPhase})`}
                </span>
              </div>
              <div className="text-slate-400">Durée totale : {mavenRun.totalMs} ms</div>
            </div>
          </div>

          {/* Maven Scopes & Convention */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-base font-bold text-white mb-3">Les 3 Cycles & La Convention d'Arborescence</h3>
              <p className="text-xs text-slate-400 mb-3">
                {language === 'fr'
                  ? 'Tout projet Maven suit la même arborescence universelle et 3 cycles indépendants (clean, default, site) :'
                  : 'Every Maven project uses one universal directory standard and 3 independent lifecycles:'}
              </p>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300">
                <pre>{`mon-projet/
├── pom.xml                  # Project Object Model (GAV + deps)
├── mvnw / mvnw.cmd          # Maven Wrapper (version Maven figée)
├── src/
│   ├── main/java/           # Code source compilé dans le JAR
│   ├── main/resources/      # application.properties, XML, SQL
│   ├── test/java/           # Tests JUnit (jamais empaquetés !)
│   └── test/resources/      # Données de test
└── target/                  # Artefacts générés (gitignored)`}</pre>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-base font-bold text-white mb-3">Portées des Dépendances Maven (&lt;scope&gt;)</h3>
              <div className="space-y-2 text-xs">
                {[
                  { scope: 'compile', desc: 'Défaut. Disponible partout (compilation, test, exécution) et inclus dans le JAR/WAR.' },
                  { scope: 'provided', desc: 'Compil & test uniquement, mais absent du livrable final (ex: Servlet API fournie par Tomcat, Lombok).' },
                  { scope: 'runtime', desc: 'Invisible à la compilation, requis uniquement au runtime & test (ex: driver JDBC PostgreSQL).' },
                  { scope: 'test', desc: 'Visible uniquement dans src/test/java (ex: JUnit 5, Mockito, AssertJ).' },
                  { scope: 'import', desc: 'Utilisé uniquement avec <type>pom</type> dans dependencyManagement (BOM Spring Boot).' }
                ].map((row) => (
                  <div key={row.scope} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-start space-x-3">
                    <span className="font-mono font-bold text-rose-400 min-w-[75px]">{row.scope}</span>
                    <span className="text-slate-300">{row.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: GRADLE (DAG, CACHE & CONFLICT MEDIATION) */}
      {activeTab === 'gradle' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Interactive Gradle Incremental DAG Simulator */}
          <div className="bg-slate-900/90 border border-emerald-900/30 rounded-2xl p-6 shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                  <GitBranch className="w-5 h-5 text-emerald-400" />
                  <span>
                    {language === 'fr'
                      ? 'Simulateur Gradle : Task DAG & Compilation Incrémentale'
                      : 'Gradle Simulator: Task DAG & Incremental Build Cache'}
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {language === 'fr'
                    ? 'Gradle calcule un hash SHA-256 des entrées/sorties de chaque tâche. Modifiez les toggles ci-dessous pour observer comment Gradle saute les tâches inchangées (UP-TO-DATE / FROM-CACHE) !'
                    : 'Gradle tracks SHA-256 input/output snapshots per task. Toggle modifications and caches to observe UP-TO-DATE and FROM-CACHE behavior.'}
                </p>
              </div>
              <div className="bg-slate-950 px-4 py-2 rounded-xl border border-emerald-800/40 font-mono text-xs">
                <span className="text-slate-400">Temps total : </span>
                <span className="text-emerald-400 font-extrabold text-sm">{gradleRun.totalMs} ms</span>
              </div>
            </div>

            {/* Toggles */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-6">
              {[
                { key: 'srcModified', label: 'Main.java modifié' },
                { key: 'testModified', label: 'Test modifié' },
                { key: 'resourcesModified', label: 'Resources modifiés' },
                { key: 'buildCacheEnabled', label: 'Build Cache ON' },
                { key: 'configCacheEnabled', label: 'Config Cache ON' },
                { key: 'daemonWarm', label: 'Gradle Daemon chaud' }
              ].map((toggle) => {
                const k = toggle.key as keyof GradleTaskInputs;
                const active = gradleInputs[k];
                return (
                  <button
                    key={toggle.key}
                    onClick={() => setGradleInputs((prev) => ({ ...prev, [k]: !prev[k] }))}
                    className={`p-2.5 rounded-xl border text-xs font-semibold transition-all text-left flex items-center justify-between ${
                      active
                        ? 'bg-emerald-600/20 border-emerald-500 text-emerald-200'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>{toggle.label}</span>
                    <span className={`w-2.5 h-2.5 rounded-full ${active ? 'bg-emerald-400' : 'bg-slate-700'}`} />
                  </button>
                );
              })}
            </div>

            {/* Phases & Task DAG */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs mb-4 flex flex-wrap justify-between gap-2">
              <span className="text-slate-300">
                Phase Configuration DAG : <strong className="text-sky-400">{gradleRun.configPhaseMs} ms</strong>{' '}
                {gradleInputs.configCacheEnabled ? '(Reused Configuration Cache!)' : '(Full script evaluation)'}
              </span>
              <span className="text-slate-400">
                Daemon JVM : {gradleInputs.daemonWarm ? 'Chaud en RAM (0 ms startup)' : 'Démarrage à froid (+1850 ms)'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {gradleRun.tasks.map((task) => {
                const badgeColor =
                  task.outcome === 'UP-TO-DATE'
                    ? 'bg-sky-500/20 text-sky-300 border-sky-500/30'
                    : task.outcome === 'FROM-CACHE'
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30';

                return (
                  <div key={task.taskName} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 font-mono text-xs flex flex-col justify-between space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{task.taskName}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${badgeColor}`}>
                        {task.outcome} ({task.durationMs} ms)
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">{task.reason}</div>
                    {task.dependsOn.length > 0 && (
                      <div className="text-[10px] text-slate-500">
                        dependsOn: {task.dependsOn.join(', ')}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Transitive Dependency Conflict Resolver (Maven vs Gradle) */}
          <div className="bg-slate-900/90 border border-indigo-900/30 rounded-2xl p-6 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <Layers className="w-5 h-5 text-indigo-400" />
                  <span>
                    {language === 'fr'
                      ? 'Résolution de Conflits Transitifs : Maven vs Gradle'
                      : 'Transitive Dependency Conflict Mediation: Maven vs Gradle'}
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {language === 'fr'
                    ? "Que se passe-t-il quand deux bibliothèques demandent des versions différentes de Guava ? Une seule version peut entrer dans le Classpath JVM !"
                    : 'What happens when two libraries request conflicting versions of Guava? Only one version can sit on the JVM Classpath!'}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setConflictEngine('maven')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    conflictEngine === 'maven'
                      ? 'bg-rose-600 text-white border-rose-400'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  Stratégie Maven (Nearest Wins)
                </button>
                <button
                  onClick={() => setConflictEngine('gradle')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    conflictEngine === 'gradle'
                      ? 'bg-emerald-600 text-white border-emerald-400'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  Stratégie Gradle (Highest Wins)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {SAMPLE_CONFLICT_GRAPH.map((node) => {
                const isWinner = conflictWinner?.path === node.path;
                return (
                  <div
                    key={node.path}
                    className={`p-4 rounded-xl border font-mono text-xs transition-all ${
                      isWinner
                        ? 'bg-emerald-950/30 border-emerald-500 shadow-lg shadow-emerald-500/10'
                        : 'bg-slate-950 border-slate-800 opacity-65'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-amber-300">v{node.version}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-slate-300">
                        Profondeur BFS : {node.depth}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-300 break-words mb-2">{node.path}</div>
                    {isWinner && (
                      <div className="text-[11px] text-emerald-400 font-bold flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>SÉLECTIONNÉE DANS LE CLASSPATH</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed">
              {conflictEngine === 'maven' ? (
                <span>
                  <strong className="text-rose-400">Règle Maven (Nearest Definition Wins) :</strong> Maven choisit{' '}
                  <code className="text-amber-300">guava:28.0.0</code> car sa profondeur dans l'arbre (2 sauts) est plus courte que celle de la version 32.1.3 (3 sauts) !{' '}
                  <span className="text-rose-300">Piège : si http-core utilise une méthode ajoutée en Guava 32, un <code className="text-rose-200">NoSuchMethodError</code> éclatera au runtime !</span>
                </span>
              ) : (
                <span>
                  <strong className="text-emerald-400">Règle Gradle (Highest Version Wins) :</strong> Gradle analyse tout le graphe et sélectionne automatiquement la version sémantique la plus élevée (<code className="text-amber-300">guava:32.1.3</code>), évitant les régressions d'API manquantes.
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: BEYOND (BAZEL, MILL, JBANG, MVND, JLINK, JPACKAGE) */}
      {activeTab === 'beyond' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Google Bazel */}
            <div className="bg-slate-900/90 border border-purple-900/30 rounded-2xl p-6 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">Google Bazel (Blaze)</h3>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Hermétique & Monorepo
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {language === 'fr'
                  ? "Conçu pour des monorepos géants (millions de lignes en C++, Java, Go, Rust). Chaque action s'exécute dans un bac à sable (sandbox) hermétique : aucun accès réseau ni disque hors entrées déclarées. Permet la distribution sur des fermes de compilation cloud (Remote Execution)."
                  : 'Designed for massive polyglot monorepos (C++, Java, Go). Every build step runs inside a hermetic sandbox enabling distributed remote caching and execution.'}
              </p>
            </div>

            {/* Maven Daemon (mvnd) */}
            <div className="bg-slate-900/90 border border-rose-900/30 rounded-2xl p-6 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">Maven Daemon (mvnd)</h3>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  GraalVM Native + Daemon
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {language === 'fr'
                  ? "Répond à la lenteur historique de Maven face à Gradle : un client natif compilé avec GraalVM communique instantanément avec un Daemon JVM persistant en arrière-plan, tout en exécutant vos pom.xml existants en parallèle !"
                  : 'Solves Maven startup latency: a GraalVM native CLI talks to a persistent background JVM Daemon, executing standard pom.xml builds in parallel.'}
              </p>
            </div>

            {/* JBang */}
            <div className="bg-slate-900/90 border border-amber-900/30 rounded-2xl p-6 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">JBang (Scripting Java sans pom.xml)</h3>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  //DEPS inline
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {language === 'fr'
                  ? "Exécutez un unique fichier script.java comme un script Python ou Bash ! Déclarez vos dépendances Maven directement dans un commentaire en tête de fichier :"
                  : 'Run single-file Java scripts just like Python! Declare Maven coordinates directly in a top comment:'}
              </p>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-amber-300">
                <pre>{`///usr/bin/env jbang "$0" "$@" ; exit $?
//DEPS info.picocli:picocli:4.7.5
//JAVA 21+
public class HelloCLI { ... }`}</pre>
              </div>
            </div>

            {/* Mill */}
            <div className="bg-slate-900/90 border border-sky-900/30 rounded-2xl p-6 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">Mill & Buck2</h3>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  Nouvelle Génération
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {language === 'fr'
                  ? "Mill (écrit par Li Haoyi) modélise le build comme un graphe de fonctions pures mémorisées sur disque (inspiré de Bazel mais sans complexité). Meta Buck2 (écrit en Rust) applique une architecture similaire ultra-rapide pour les gros dépôts Java/Kotlin/Android."
                  : 'Mill models builds as pure memoized functions (Bazel-speed without complexity), while Meta Buck2 (written in Rust) scales large monorepos.'}
              </p>
            </div>
          </div>

          {/* jlink & jpackage (Native Packaging built into JDK) */}
          <div className="bg-slate-900/90 border border-emerald-900/30 rounded-2xl p-6 shadow-lg">
            <h3 className="text-base font-bold text-white mb-2 flex items-center space-x-2">
              <Box className="w-5 h-5 text-emerald-400" />
              <span>Outils natifs du JDK : jlink (Java 9+) & jpackage (Java 14+/16)</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              {language === 'fr'
                ? "Maven et Gradle produisent des fichiers .jar qui nécessitent une JVM installée sur le poste client. Depuis Java 9 et 16, le JDK inclut deux outils majeurs pour livrer des applications autonomes :"
                : 'Maven and Gradle produce .jar files requiring a pre-installed JVM. Modern JDKs ship two native distribution tools:'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="text-emerald-400 font-bold">1. jlink (Custom Minimal JRE ~35 Mo)</div>
                <p className="font-sans text-slate-400 text-xs">
                  Analyse les modules JPMS utilisés (ex: <code className="text-amber-300">java.base, java.sql</code>) et assemble un mini-runtime sans inclure JavaFX ou CORBA inutilisés.
                </p>
                <pre className="text-slate-300 overflow-x-auto">{`jlink --add-modules java.base,java.logging \\
      --strip-debug --compress=2 \\
      --output custom-jre/`}</pre>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="text-sky-400 font-bold">2. jpackage (Installateur natif .exe/.dmg/.deb)</div>
                <p className="font-sans text-slate-400 text-xs">
                  Empaquette votre JAR + votre image <code className="text-sky-300">jlink</code> dans un véritable installeur natif OS avec icône et exécutable sans demander à l'utilisateur d'installer Java !
                </p>
                <pre className="text-slate-300 overflow-x-auto">{`jpackage --input target/ \\
         --name JavaBabelApp \\
         --main-jar app.jar \\
         --type dmg   # ou exe, msi, deb, rpm`}</pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
