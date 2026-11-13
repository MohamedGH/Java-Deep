import React, { useState } from 'react';
import { useJavaStore } from '../store/useJavaStore';
import {
  JavadocVisibilityFlag,
  parseAndValidateJavadoc,
  compareJavadocVisibilityFlags,
  getJavadocEvolutionMilestones
} from '../utils/javadocEngine';
import {
  FileText,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Cpu,
  Layers,
  Code2,
  Eye,
  Sparkles,
  Hammer,
  BookOpen,
  Play,
  ShieldCheck,
  Terminal
} from 'lucide-react';

type JavadocTab = 'linter' | 'pipeline' | 'tags' | 'modern' | 'build';

interface JavadocPreset {
  id: string;
  label: { fr: string; en: string };
  signature: string;
  comment: string;
}

const PRESETS: JavadocPreset[] = [
  {
    id: 'clean',
    label: { fr: 'Contrat sain (-Xdoclint OK)', en: 'Clean Contract (-Xdoclint OK)' },
    signature: 'public BigDecimal calculateTax(BigDecimal amount, String countryCode) throws IllegalArgumentException',
    comment: `/**
 * Computes VAT tax using {@code BigDecimal} half-even rounding.
 * <p>Delegates rate lookup to {@link TaxRegistry#findRate(String)}.</p>
 *
 * @param amount net monetary amount (must be positive)
 * @param countryCode ISO-3166 alpha-2 code (e.g. {@code "FR"})
 * @return calculated tax rounded to 2 decimal places
 * @throws IllegalArgumentException if {@code amount} is negative
 * @since 2.1
 */`
  },
  {
    id: 'broken-doclint',
    label: { fr: 'Pièges -Xdoclint (<T> & @param manquant)', en: '-Xdoclint Traps (<T> & missing @param)' },
    signature: 'public List<String> filterUsers(List<String> users, int minAge)',
    comment: `/**
 * Filters a List<String> of users without wrapping generics in {@code}.
 *
 * @param users the raw user list
 */`
  },
  {
    id: 'ignored-comment',
    label: { fr: 'Commentaire /* ... */ ignoré par le Lexer', en: 'Standard /* ... */ Ignored by Lexer' },
    signature: 'public void processOrder(String orderId)',
    comment: `/*
 * Attention: un seul astérisque après le slash!
 * Ignoré totalement par javac DocTree et StandardDoclet.
 * @param orderId ignoré
 */`
  },
  {
    id: 'markdown-23',
    label: { fr: 'Java 23 Markdown /// (JEP 467)', en: 'Java 23 Markdown /// (JEP 467)' },
    signature: 'public Optional<User> findByEmail(String email)',
    comment: `/// Looks up a user by normalized email inside [UserRepository].
///
/// Supports \`List<String>\` safely without \`{@code}\` boilerplate!
///
/// @param email lowercase email address
/// @return optional matching [User], empty if absent`
  }
];

export const JavadocView: React.FC = () => {
  const { language, addError } = useJavaStore();
  const [activeTab, setActiveTab] = useState<JavadocTab>('linter');

  // Tab 1: Live Linter & HTML5 Preview state
  const [selectedPresetId, setSelectedPresetId] = useState<string>('clean');
  const [methodSig, setMethodSig] = useState<string>(PRESETS[0].signature);
  const [docComment, setDocComment] = useState<string>(PRESETS[0].comment);

  // Tab 3: Visibility Flag Simulator state
  const [visibilityFlag, setVisibilityFlag] = useState<JavadocVisibilityFlag>('protected');

  const validation = parseAndValidateJavadoc(docComment, methodSig);
  const visibilityMatrix = compareJavadocVisibilityFlags(visibilityFlag);
  const milestones = getJavadocEvolutionMilestones();

  const applyPreset = (preset: JavadocPreset) => {
    setSelectedPresetId(preset.id);
    setMethodSig(preset.signature);
    setDocComment(preset.comment);
  };

  const handleRunLintCheck = () => {
    if (validation.errorCount > 0) {
      addError(
        language === 'fr'
          ? `-Xdoclint a bloqué le build : ${validation.errorCount} erreur(s), ${validation.warningCount} avertissement(s).`
          : `-Xdoclint failed build: ${validation.errorCount} error(s), ${validation.warningCount} warning(s).`
      );
    } else if (validation.warningCount > 0) {
      addError(
        language === 'fr'
          ? `Avertissement Javadoc (${validation.warningCount}) : vérifiez les annotations/commentaires.`
          : `Javadoc warning (${validation.warningCount}): check comment/annotation alignment.`
      );
    }
  };

  const sampleClassMembers: Array<{
    visibility: 'public' | 'protected' | 'package-private' | 'private';
    decl: string;
    note: { fr: string; en: string };
  }> = [
    {
      visibility: 'public',
      decl: 'public BigDecimal getBalance()',
      note: { fr: 'API publique stable', en: 'Stable public API' }
    },
    {
      visibility: 'protected',
      decl: 'protected void onBalanceChanged(BigDecimal delta)',
      note: { fr: 'Hook d’extension pour sous-classes', en: 'Subclass extension hook' }
    },
    {
      visibility: 'package-private',
      decl: 'void resetInternalCache()',
      note: { fr: 'Utilitaire interne au package', en: 'Package-internal helper' }
    },
    {
      visibility: 'private',
      decl: 'private final AtomicLong txCounter',
      note: { fr: 'État interne encapsulé', en: 'Encapsulated internal state' }
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 border border-sky-900/40 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-mono uppercase tracking-wider mb-3">
              <FileText className="w-3.5 h-3.5" />
              <span>DocTree AST • StandardDoclet • -Xdoclint • JEP 413 & JEP 467</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {language === 'fr'
                ? 'Javadoc, Doclets & Compilateur de Documentation'
                : 'Javadoc, Doclets & Documentation Compiler'}
            </h1>
            <p className="mt-2 text-sm text-slate-300 max-w-3xl leading-relaxed">
              {language === 'fr'
                ? "Contrairement à une simple convention cosmétique, Javadoc est un véritable outil du JDK branché sur le compilateur javac : il analyse l'AST Java + DocTree, valide vos contrats avec -Xdoclint, génère des portails HTML5 et évolue vers les Snippets exécutables (Java 18) et le Markdown /// (Java 23)."
                : 'Far more than comments, Javadoc is a JDK frontend tool plugged directly into javac: it parses Java + DocTree ASTs, enforces -Xdoclint contracts, outputs searchable HTML5 portals, and evolves with executable Snippets (Java 18) and /// Markdown (Java 23).'}
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-sky-900/30">
          {[
            { id: 'linter', fr: '1. Analyseur -Xdoclint & Aperçu HTML5', en: '1. -Xdoclint & HTML5 Preview', icon: <Code2 className="w-4 h-4" /> },
            { id: 'pipeline', fr: '2. Pipeline javac, Doclet & Bytecode', en: '2. javac Pipeline & Doclet', icon: <Cpu className="w-4 h-4" /> },
            { id: 'tags', fr: '3. Tags Blocs/Inline & Visibilité', en: '3. Tags & Visibility Flags', icon: <Eye className="w-4 h-4" /> },
            { id: 'modern', fr: '4. Java 18 {@snippet} & Java 23 Markdown ///', en: '4. {@snippet} & Markdown ///', icon: <Sparkles className="w-4 h-4" /> },
            { id: 'build', fr: '5. Maven/Gradle, CI/CD & C Doxygen', en: '5. Maven/Gradle & Doxygen', icon: <Hammer className="w-4 h-4" /> }
          ].map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as JavadocTab)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  active
                    ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30 border border-sky-400/40'
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

      {/* TAB 1: Live -Xdoclint Analyzer & HTML5 Preview */}
      {activeTab === 'linter' && (
        <div className="space-y-6">
          {/* Presets */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-sky-400" />
                <span>
                  {language === 'fr'
                    ? 'Simulateur DocTree & -Xdoclint:all'
                    : 'DocTree & -Xdoclint:all Simulator'}
                </span>
              </h2>
              <button
                onClick={handleRunLintCheck}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-all self-start sm:self-auto"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{language === 'fr' ? 'Lancer javadoc -Xdoclint:all' : 'Run javadoc -Xdoclint:all'}</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => applyPreset(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    selectedPresetId === p.id
                      ? 'bg-sky-500/20 text-sky-300 border-sky-500/50'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {p.label[language]}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Editor column */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                  {language === 'fr' ? 'Commentaire Javadoc (/** ... */ ou ///)' : 'Javadoc Comment (/** ... */ or ///)'}
                </label>
                <textarea
                  value={docComment}
                  onChange={(e) => setDocComment(e.target.value)}
                  rows={10}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 focus:border-sky-500 focus:outline-none p-3 font-mono text-xs text-sky-200 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                  {language === 'fr' ? 'Signature Java associée (AST Méthode)' : 'Target Java Signature (Method AST)'}
                </label>
                <input
                  type="text"
                  value={methodSig}
                  onChange={(e) => setMethodSig(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 focus:border-sky-500 focus:outline-none px-3 py-2 font-mono text-xs text-amber-300"
                />
              </div>
            </div>

            {/* Diagnostic & Rendered HTML5 Preview */}
            <div className="space-y-6">
              {/* Doclint Diagnostics */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-sky-400" />
                    <span>{language === 'fr' ? 'Diagnostics -Xdoclint' : '-Xdoclint Diagnostics'}</span>
                  </h3>
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span
                      className={`px-2 py-0.5 rounded-md border ${
                        validation.errorCount === 0
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-red-500/10 text-red-400 border-red-500/30'
                      }`}
                    >
                      {validation.errorCount} error(s)
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md border ${
                        validation.warningCount === 0
                          ? 'bg-slate-800 text-slate-400 border-slate-700'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      }`}
                    >
                      {validation.warningCount} warning(s)
                    </span>
                  </div>
                </div>

                {validation.issues.length === 0 ? (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>
                      {language === 'fr'
                        ? '0 erreur ! Le DocTree correspond exactement aux paramètres, au retour et aux exceptions de la signature.'
                        : '0 errors! DocTree strictly matches method parameters, return type, and throws clauses.'}
                    </span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {validation.issues.map((issue, idx) => (
                      <div
                        key={idx}
                        className={`flex items-start gap-2.5 p-3 rounded-xl border text-xs ${
                          issue.severity === 'error'
                            ? 'bg-red-500/10 border-red-500/30 text-red-300'
                            : 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                        }`}
                      >
                        {issue.severity === 'error' ? (
                          <XCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                        )}
                        <div>
                          <span className="font-mono font-bold uppercase text-[10px] mr-2 px-1.5 py-0.5 rounded bg-slate-950/60">
                            {issue.rule}
                          </span>
                          <span>{issue.message}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Extracted AST metadata */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-xs">
                  <div className="bg-slate-950 rounded-xl p-2.5 border border-slate-800">
                    <div className="text-[10px] font-mono text-slate-500 uppercase">Mode Lexer</div>
                    <div className="font-bold text-sky-300 mt-0.5">
                      {!validation.isValidDocComment
                        ? 'Ignored'
                        : validation.isMarkdownDoc
                        ? 'Markdown /// (JEP 467)'
                        : 'Classic /** ... */'}
                    </div>
                  </div>
                  <div className="bg-slate-950 rounded-xl p-2.5 border border-slate-800">
                    <div className="text-[10px] font-mono text-slate-500 uppercase">Params AST</div>
                    <div className="font-mono text-slate-200 mt-0.5 truncate">
                      {validation.declaredParams.length > 0 ? validation.declaredParams.join(', ') : 'none'}
                    </div>
                  </div>
                  <div className="bg-slate-950 rounded-xl p-2.5 border border-slate-800 col-span-2 sm:col-span-1">
                    <div className="text-[10px] font-mono text-slate-500 uppercase">Return Type</div>
                    <div className="font-mono text-amber-300 mt-0.5 truncate">{validation.returnType}</div>
                  </div>
                </div>
              </div>

              {/* Simulated StandardDoclet HTML5 Output */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-sky-400" />
                    <span>{language === 'fr' ? 'Rendu StandardDoclet (HTML5)' : 'StandardDoclet HTML5 Output'}</span>
                  </h3>
                  <span className="text-[11px] font-mono text-slate-400">Method Detail</span>
                </div>

                {!validation.isValidDocComment ? (
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 italic">
                    {language === 'fr'
                      ? 'Aucune documentation générée : ce commentaire a été éliminé avant le DocTree.'
                      : 'No documentation emitted: comment stripped prior to DocTree construction.'}
                  </div>
                ) : (
                  <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 space-y-3 text-xs">
                    <div className="font-mono text-sky-300 font-semibold border-b border-slate-800 pb-2 break-all">
                      {methodSig}
                    </div>
                    <p className="text-slate-200 leading-relaxed">{validation.summarySentence}</p>
                    {validation.tags.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        {validation.tags
                          .filter((t) => t.kind === 'block')
                          .map((t, idx) => (
                            <div key={idx} className="flex flex-wrap gap-2 items-baseline">
                              <span className="font-mono text-[11px] font-bold text-amber-400 min-w-[76px]">
                                {t.tag}
                              </span>
                              <span className="text-slate-300">{t.argument}</span>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Pipeline javac, DocTree AST, Doclet API & Bytecode */}
      {activeTab === 'pipeline' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-sky-400">Étape 1 — Frontend javac</div>
              <h3 className="text-base font-bold text-white">Lexer &amp; DocTree AST</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {language === 'fr'
                  ? "Pendant l'analyse lexicale, javac jette immédiatement les commentaires // et /* ... */. En revanche, tout bloc commençant par /** (ou /// depuis Java 23) est capturé comme jeton de documentation et parsé en arbre DocTree (com.sun.source.doctree) attaché au nœud AST de la classe ou méthode."
                  : 'During lexing, javac discards // and /* ... */ immediately. Blocks starting with /** (or /// in Java 23+) are captured and parsed into a DocTree AST attached to the enclosing class or method tree.'}
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-amber-400">Étape 2 — Bytecode .class</div>
              <h3 className="text-base font-bold text-white">Zéro Javadoc dans la JVM !</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {language === 'fr'
                  ? "Le texte Javadoc n'est JAMAIS compilé dans le fichier .class ni chargé dans le Metaspace (contrairement aux @Retention(RUNTIME) Annotations). Seule l'annotation @Deprecated survit en bytecode (RuntimeVisibleAnnotations), tandis que la Javadoc exige les sources .java (*-sources.jar)."
                  : 'Javadoc prose is NEVER emitted into .class bytecode or Metaspace. Only @Deprecated survives in classfile attributes; tools like IDEs need -sources.jar or pre-built -javadoc.jar.'}
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-emerald-400">Étape 3 — Doclet API</div>
              <h3 className="text-base font-bold text-white">jdk.javadoc.doclet (Java 9+)</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {language === 'fr'
                  ? "Un Doclet est un plugin Java implémentant jdk.javadoc.doclet.Doclet. Le StandardDoclet génère les pages HTML5 + index de recherche JS, mais des doclets personnalisés génèrent des diagrammes UML, des specs OpenAPI ou des manuels PDF à partir du DocletEnvironment."
                  : 'A Doclet implements jdk.javadoc.doclet.Doclet. StandardDoclet builds searchable HTML5 portals, while custom doclets emit UML diagrams, OpenAPI specs, or PDFs directly from DocletEnvironment.'}
              </p>
            </div>
          </div>

          {/* Legacy vs Modern Doclet API + Bytecode Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-bold text-white">
                {language === 'fr'
                  ? 'Migration Doclet : com.sun.javadoc vs jdk.javadoc.doclet'
                  : 'Doclet Migration: com.sun.javadoc vs jdk.javadoc.doclet'}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-mono">
                      <th className="py-2 pr-3">Aspect</th>
                      <th className="py-2 pr-3">Legacy (Java 1.2 - 8)</th>
                      <th className="py-2">Modern (Java 9+)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    <tr>
                      <td className="py-2.5 pr-3 font-semibold text-white">Package API</td>
                      <td className="py-2.5 pr-3 font-mono text-red-300">com.sun.javadoc.*</td>
                      <td className="py-2.5 font-mono text-emerald-300">jdk.javadoc.doclet.*</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-3 font-semibold text-white">Modèle AST</td>
                      <td className="py-2.5 pr-3">RootDoc / ClassDoc propriétaire</td>
                      <td className="py-2.5">javax.lang.model + DocTrees (partagé javac)</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-3 font-semibold text-white">Sortie HTML</td>
                      <td className="py-2.5 pr-3">HTML 4 Framesets (supprimés en Java 11)</td>
                      <td className="py-2.5">HTML5 responsive + Recherche JS</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-3 font-semibold text-white">Modules JPMS</td>
                      <td className="py-2.5 pr-3">Inexistant (tools.jar)</td>
                      <td className="py-2.5">Module standard jdk.javadoc</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-bold text-white">
                {language === 'fr'
                  ? 'Pourquoi @Deprecated + @deprecated doivent aller ensemble'
                  : 'Why @Deprecated and @deprecated Must Pair'}
              </h3>
              <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed">
{`/**
 * @deprecated Use {@link #transferV2(Iban, Money)} instead;
 *             scheduled for removal in v3.0.
 */
@Deprecated(since = "2.4", forRemoval = true)
public void transferLegacy(String iban, double amount) { ... }`}
              </pre>
              <p className="text-xs text-slate-300 leading-relaxed">
                {language === 'fr'
                  ? "L'annotation @Deprecated(since, forRemoval) s'inscrit dans le bytecode .class et force javac à émettre un warning à la compilation chez l'appelant. Le tag Javadoc @deprecated fournit l'explication de migration dans la doc HTML5."
                  : '@Deprecated(since, forRemoval) is retained in .class bytecode so javac emits warnings for callers, while Javadoc @deprecated explains the replacement path in HTML5.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Block vs Inline Tags & Visibility Flags */}
      {activeTab === 'tags' && (
        <div className="space-y-6">
          {/* Visibility Simulator */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-white">
                  {language === 'fr'
                    ? 'Simulateur de Visibilité StandardDoclet (-public / -protected / -package / -private)'
                    : 'StandardDoclet Visibility Flag Simulator'}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {visibilityMatrix.useCase}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {(['public', 'protected', 'package', 'private'] as JavadocVisibilityFlag[]).map((flag) => (
                  <button
                    key={flag}
                    onClick={() => setVisibilityFlag(flag)}
                    className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold border transition-all ${
                      visibilityFlag === flag
                        ? 'bg-sky-600 text-white border-sky-400 shadow-md shadow-sky-600/20'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    -{flag}
                    {flag === 'protected' && ' (default)'}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {sampleClassMembers.map((m, idx) => {
                const included = visibilityMatrix.includedModifiers.includes(m.visibility);
                return (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                      included
                        ? 'bg-emerald-500/5 border-emerald-500/30'
                        : 'bg-slate-950/60 border-slate-800 opacity-55'
                    }`}
                  >
                    <div>
                      <div className="font-mono text-xs text-slate-100">{m.decl}</div>
                      <div className="text-[11px] text-slate-400 mt-1">{m.note[language]}</div>
                    </div>
                    <span
                      className={`shrink-0 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase ${
                        included
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {included ? 'EMITTED' : 'HIDDEN'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tags Reference Matrix */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-bold text-amber-300">
                {language === 'fr' ? 'Tags Blocs (En bas du commentaire)' : 'Block Tags (Standalone lines)'}
              </h3>
              <div className="space-y-2 text-xs">
                {[
                  { tag: '@param <T> / name', desc: language === 'fr' ? 'Documente un paramètre de méthode ou un paramètre générique <T>.' : 'Documents method parameter or generic type parameter <T>.' },
                  { tag: '@return', desc: language === 'fr' ? 'Décrit la valeur retournée (obligatoire si non-void sous -Xdoclint).' : 'Describes return value (required if non-void under -Xdoclint).' },
                  { tag: '@throws / @exception', desc: language === 'fr' ? 'Conditions d’échec : exceptions vérifiées ou RuntimeException clés.' : 'Failure conditions for checked or documented unchecked exceptions.' },
                  { tag: '@see', desc: language === 'fr' ? 'Ajoute une section "See Also" vers une classe, méthode ou URL.' : 'Adds a "See Also" cross-reference entry.' },
                  { tag: '@since / @deprecated', desc: language === 'fr' ? 'Version d’introduction et consigne d’obsolescence.' : 'API introduction version and deprecation migration note.' }
                ].map((item) => (
                  <div key={item.tag} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex gap-3">
                    <code className="font-mono text-amber-400 font-bold shrink-0">{item.tag}</code>
                    <span className="text-slate-300">{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-bold text-sky-300">
                {language === 'fr' ? 'Tags Inline ({@tag ...})' : 'Inline Tags ({@tag ...})'}
              </h3>
              <div className="space-y-2 text-xs">
                {[
                  { tag: '{@code ...}', desc: language === 'fr' ? 'Formate en <code> sans interpréter <, >, & comme du HTML.' : 'Renders <code> and escapes <, >, & from HTML parser.' },
                  { tag: '{@link Class#m()}', desc: language === 'fr' ? 'Hyperlien cliquable résolu et vérifié par javac contre le classpath.' : 'Clickable hyperlink checked by javac against classpath.' },
                  { tag: '{@literal ...}', desc: language === 'fr' ? 'Échappe les symboles HTML (<T>, @) sans police monospace.' : 'Escapes HTML characters without monospace <code> styling.' },
                  { tag: '{@value #CONST}', desc: language === 'fr' ? 'Injecte la valeur compilée d’une constante static final.' : 'Inlines compile-time value of a static final constant.' },
                  { tag: '{@inheritDoc}', desc: language === 'fr' ? 'Copie la Javadoc de la méthode surchargée (interface/superclasse).' : 'Inherits prose from overridden supertype method.' },
                  { tag: '{@return ...} (J16)', desc: language === 'fr' ? 'Fusionne la phrase d’intro "Returns ..." et le tag @return.' : 'Unifies summary "Returns..." sentence and @return tag.' }
                ].map((item) => (
                  <div key={item.tag} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex gap-3">
                    <code className="font-mono text-sky-400 font-bold shrink-0">{item.tag}</code>
                    <span className="text-slate-300">{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Java 18 {@snippet} & Java 23 Markdown /// */}
      {activeTab === 'modern' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-mono">
                Java 18 — JEP 413 ({'{@snippet}'})
              </div>
              <h3 className="text-base font-bold text-white">
                {language === 'fr'
                  ? 'Adieu <pre>{@code ...}</pre>, bonjour {@snippet}'
                  : 'Replacing Brittle <pre>{@code}</pre> with {@snippet}'}
              </h3>
              <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-sky-200 overflow-x-auto leading-relaxed">
{`/**
 * Validates token signatures:
 * {@snippet :
 *   var verifier = JwtVerifier.create(publicKey); // @highlight substring="create"
 *   verifier.verify(token);                      // @link substring="verify" target="#verify(String)"
 * }
 */`}
              </pre>
              <p className="text-xs text-slate-300 leading-relaxed">
                {language === 'fr'
                  ? 'Les snippets externes (class="OrderTest.java" region="demo") sont stockés dans snippet-files/, compilés et testés par JUnit afin que la documentation ne devienne jamais obsolète.'
                  : 'External snippets (file="OrderTest.java" region="demo") live in snippet-files/, allowing your CI test suite to compile and execute documentation examples.'}
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-mono">
                Java 23 — JEP 467 (/// Markdown)
              </div>
              <h3 className="text-base font-bold text-white">
                {language === 'fr'
                  ? 'Commentaires Markdown natifs avec ///'
                  : 'Native Markdown Documentation Comments with ///'}
              </h3>
              <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-200 overflow-x-auto leading-relaxed">
{`/// ### Transaction Rules
/// Uses \`BigDecimal\` precision and links directly to [Account#debit(Money)].
/// - Thread-safe via optimistic locking
/// - Throws [InsufficientFundsException] on negative balance
///
/// @param amount non-null positive monetary value`}
              </pre>
              <p className="text-xs text-slate-300 leading-relaxed">
                {language === 'fr'
                  ? "Plus besoin de balises <p>, <ul>, <li> ni de {@code} : CommonMark gère les blocs de code, les listes et les liens [Class#method] directement tout en restant 100% compatible avec @param et @return."
                  : 'Eliminates <p>, <ul>, <li>, and {@code} noise: CommonMark syntax handles headings, lists, and [Class#method] references alongside standard @param/@return tags.'}
              </p>
            </div>
          </div>

          {/* Evolution Timeline */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white">
              {language === 'fr' ? 'Évolution du moteur Javadoc (Java 1 -> Java 23)' : 'Javadoc Engine Evolution (Java 1 -> Java 23)'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {milestones.map((m) => (
                <div key={m.version} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-sky-400">{m.version}</span>
                    <span className="font-mono text-slate-500">{m.year}</span>
                  </div>
                  <div className="text-xs font-bold text-white">{m.feature}</div>
                  <div className="font-mono text-[11px] text-amber-300">{m.tagOrApi}</div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{m.technicalImpact}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Maven/Gradle Integration & C Doxygen Comparison */}
      {activeTab === 'build' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-base font-bold text-white">
              {language === 'fr'
                ? 'Maven & Gradle : Publication & Garde-fous CI/CD'
                : 'Maven & Gradle: Publishing & CI/CD Gates'}
            </h3>
            <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed">
{`<!-- pom.xml : Maven Central exige un -javadoc.jar signé ! -->
<plugin>
  <groupId>org.apache.maven.plugins</groupId>
  <artifactId>maven-javadoc-plugin</artifactId>
  <version>3.6.3</version>
  <configuration>
    <doclint>all</doclint>      <!-- Bloque si @param ou HTML cassé -->
    <failOnError>true</failOnError>
  </configuration>
</plugin>`}
            </pre>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  {language === 'fr'
                    ? 'Maven Central impose 3 artefacts par release : .jar (bytecode), -sources.jar et -javadoc.jar.'
                    : 'Maven Central requires 3 artifacts per release: .jar, -sources.jar, and -javadoc.jar.'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  {language === 'fr'
                    ? 'En Gradle, java { withJavadocJar(); withSourcesJar() } génère automatiquement les archives conformes.'
                    : 'In Gradle, java { withJavadocJar(); withSourcesJar() } configures compliant publishing artifacts.'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  {language === 'fr'
                    ? "Bonne pratique d'architecture : documentez les invariants, préconditions (nullability, thread-safety), unités et effets de bord — ne répétez jamais simplement le nom de la méthode."
                    : 'Best practice: document contracts, invariants, nullability, thread-safety, and side effects—never merely rephrase the method name.'}
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-base font-bold text-white">
              {language === 'fr'
                ? 'Comparaison C (Doxygen) vs Java (Javadoc)'
                : 'C (Doxygen) vs Java (Javadoc)'}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono">
                    <th className="py-2 pr-3">Critère</th>
                    <th className="py-2 pr-3">C / Doxygen</th>
                    <th className="py-2">Java / Javadoc</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  <tr>
                    <td className="py-2.5 pr-3 font-semibold text-white">Intégration</td>
                    <td className="py-2.5 pr-3">Outil tiers externe (Doxyfile)</td>
                    <td className="py-2.5">Outil officiel natif du JDK (bin/javadoc)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-3 font-semibold text-white">Analyseur</td>
                    <td className="py-2.5 pr-3">Parser C + préprocesseur (#ifdef)</td>
                    <td className="py-2.5">Compilateur javac réel (AST + classpath)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-3 font-semibold text-white">Vérification liens</td>
                    <td className="py-2.5 pr-3">Heuristique texte</td>
                    <td className="py-2.5">Résolution symbolique stricte ({'{@link}'})</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-3 font-semibold text-white">Fichiers cibles</td>
                    <td className="py-2.5 pr-3">Headers (.h) séparés des .c</td>
                    <td className="py-2.5">Directement sur classes/interfaces .java</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
