import React, { useState, useMemo } from 'react';
import { useJavaStore } from '../store/useJavaStore';
import { JAVA_HISTORY_RELEASES } from '../data/javaHistory';
import { JavaVersionRelease } from '../types';
import { 
  History, 
  Sparkles, 
  CheckCircle2, 
  Calendar, 
  Cpu, 
  Code2, 
  Filter, 
  Search, 
  Layers, 
  Zap, 
  ArrowRight,
  ShieldCheck,
  SplitSquareVertical
} from 'lucide-react';

export const JavaHistoryView: React.FC = () => {
  const { language } = useJavaStore();

  const [selectedEra, setSelectedEra] = useState<string>('All');
  const [onlyLts, setOnlyLts] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRelease, setSelectedRelease] = useState<JavaVersionRelease>(JAVA_HISTORY_RELEASES[JAVA_HISTORY_RELEASES.length - 2]); // default Java 21

  const eras = [
    { id: 'All', label: { fr: 'Toutes les Époques', en: 'All Eras' } },
    { id: 'Foundation', label: { fr: 'Fondations (1.0 - 1.4)', en: 'Foundation (1.0 - 1.4)' } },
    { id: 'Generics & Concurrency', label: { fr: 'Génériques & Concurrence (5 - 7)', en: 'Generics & Concurrency (5 - 7)' } },
    { id: 'Functional Revolution', label: { fr: 'Révolution Fonctionnelle (Java 8)', en: 'Functional (Java 8)' } },
    { id: 'Modular & Rapid Cadence', label: { fr: 'Modulaire & Cadence Rapide (9 - 17)', en: 'Modular & Cadence (9 - 17)' } },
    { id: 'Modern Loom & Panama', label: { fr: 'Ère Moderne Loom & Panama (21 - 25)', en: 'Modern Loom & Panama (21 - 25)' } }
  ];

  // Pure functional filtering pipeline
  const filteredReleases = useMemo(() => {
    return JAVA_HISTORY_RELEASES
      .filter((rel) => (selectedEra === 'All' ? true : rel.era === selectedEra))
      .filter((rel) => (!onlyLts ? true : rel.isLts))
      .filter((rel) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        const matchesVersion = rel.version.toLowerCase().includes(q);
        const matchesDesc = rel.description[language].toLowerCase().includes(q);
        const matchesFeatures = rel.features.some((f) =>
          f.name.toLowerCase().includes(q) || f.description[language].toLowerCase().includes(q)
        );
        return matchesVersion || matchesDesc || matchesFeatures;
      });
  }, [selectedEra, onlyLts, searchQuery, language]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-amber-400 font-semibold text-xs uppercase tracking-wider mb-2">
              <History className="w-4 h-4" />
              <span>{language === 'fr' ? 'Chronologie & Histoire de Java' : 'Java History & Version Timeline'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              {language === 'fr' ? 'L\'Épopée de Java : De Oak (1995) à Java 21+ LTS' : 'The Evolution of Java: From Oak (1995) to Java 21+ LTS'}
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              {language === 'fr'
                ? 'Explorez le classement historique de toutes les fonctionnalités de Java, les changements de modèle mémoire de la JVM (PermGen, Metaspace, ZGC, Loom) et la transition des paradigmes (POO, Génériques, Lambdas, Threads Virtuels).'
                : 'Explore Java’s historical feature classification, JVM memory architecture milestones (Metaspace, G1, ZGC, Loom), and paradigm shifts (OOP, Generics, Lambdas, Virtual Threads).'}
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/95 p-4 rounded-2xl border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'fr' ? 'Rechercher une fonctionnalité (ex: lambda, record, var, loom, zgc)...' : 'Search feature (e.g. lambda, record, var, loom)...'}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-sans"
          />
        </div>

        {/* LTS Toggle Button */}
        <button
          onClick={() => setOnlyLts(!onlyLts)}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
            onlyLts
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-md'
              : 'bg-slate-950 text-slate-400 border-slate-700 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>{language === 'fr' ? 'Versions LTS Uniquement' : 'LTS Versions Only'}</span>
        </button>
      </div>

      {/* Era Selector Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {eras.map((era) => {
          const active = era.id === selectedEra;
          return (
            <button
              key={era.id}
              onClick={() => setSelectedEra(era.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                active
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              {era.label[language]}
            </button>
          );
        })}
      </div>

      {/* 2-Column Split: Timeline List on Left (5 cols) | Detailed Release Inspector on Right (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Release Cards Timeline (5 cols) */}
        <div className="lg:col-span-5 space-y-3 max-h-[750px] overflow-y-auto pr-1">
          {filteredReleases.map((rel) => {
            const isSelected = rel.version === selectedRelease.version;
            return (
              <div
                key={rel.version}
                onClick={() => setSelectedRelease(rel)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? 'bg-slate-900 border-amber-500/60 shadow-xl ring-1 ring-amber-500/30'
                    : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <span className="text-base font-black text-white">{rel.version}</span>
                    {rel.isLts && (
                      <span className="text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        LTS
                      </span>
                    )}
                    {rel.codename && (
                      <span className="text-[10px] font-mono text-slate-400">
                        ({rel.codename})
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-mono text-amber-400 font-bold">
                    {rel.year}
                  </span>
                </div>

                <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                  {rel.description[language]}
                </p>

                <div className="flex flex-wrap gap-1.5 mt-3 pt-2 border-t border-slate-800/80">
                  {rel.features.slice(0, 3).map((f, fIdx) => (
                    <span
                      key={fIdx}
                      className="text-[10px] font-mono bg-slate-950 text-slate-300 px-2 py-0.5 rounded-md border border-slate-800"
                    >
                      {f.name}
                    </span>
                  ))}
                  {rel.features.length > 3 && (
                    <span className="text-[10px] text-slate-500 font-mono self-center">
                      +{rel.features.length - 3} autres
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Release Deep-Dive Inspector (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6">
          <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-4 gap-2">
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-2xl font-black text-white">{selectedRelease.version}</h2>
                {selectedRelease.isLts && (
                  <span className="text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full">
                    Long Term Support (LTS)
                  </span>
                )}
              </div>
              <span className="text-xs text-amber-400 font-mono mt-0.5 block">
                Année de sortie: {selectedRelease.year} {selectedRelease.codename ? `• Nom de code: ${selectedRelease.codename}` : ''}
              </span>
            </div>

            <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full font-mono border border-slate-700">
              {selectedRelease.era}
            </span>
          </div>

          {/* Description summary */}
          <p className="text-sm text-slate-200 leading-relaxed font-sans">
            {selectedRelease.description[language]}
          </p>

          {/* JVM Architecture Impact */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-2">
              <Cpu className="w-4 h-4" />
              <span>{language === 'fr' ? 'Impact & Évolution Architecture JVM' : 'JVM Architecture Impact'}</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {selectedRelease.jvmChanges[language]}
            </p>
          </div>

          {/* Major Features Showcase with Code Snippets */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <Code2 className="w-4 h-4 text-emerald-400" />
              <span>{language === 'fr' ? 'Fonctionnalités Clés & Syntaxe Introduite' : 'Key Features & Syntax Introduced'}</span>
            </h3>

            <div className="space-y-3">
              {selectedRelease.features.map((feat, idx) => (
                <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-amber-300">{feat.name}</h5>
                    <span className="text-[10px] text-slate-500 font-mono">JDK {selectedRelease.version.replace('Java ', '')}</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {feat.description[language]}
                  </p>

                  {feat.codeSnippet && (
                    <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800 font-mono text-xs text-slate-200 overflow-x-auto">
                      <pre>{feat.codeSnippet}</pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
