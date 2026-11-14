import React, { useState, useMemo } from 'react';
import { useJavaStore } from '../store/useJavaStore';
import { RouteType } from '../types';
import { CHAPTER_GROUPS, ChapterGroupId, LAB_ROUTE_TO_CHAPTER } from '../utils/navigationEngine';
import {
  X,
  Search,
  Cpu,
  Layers,
  Binary,
  Shield,
  Box,
  Hammer,
  Leaf,
  FlaskConical,
  FileText,
  History,
  SplitSquareVertical,
  Terminal,
  BookOpen,
  PlayCircle,
  Award,
  CheckSquare,
  Code2
} from 'lucide-react';

export interface ModuleItem {
  id: RouteType;
  group: ChapterGroupId | 'tools';
  title: { fr: string; en: string };
  subtitle: { fr: string; en: string };
  icon: React.ReactNode;
}

export const ALL_MODULES: ModuleItem[] = [
  // Chapitre I · Mémoire JVM & Bases C
  {
    id: 'visualizer',
    group: 'group-1',
    title: { fr: 'Mémoire JVM & GC', en: 'JVM Memory & GC' },
    subtitle: { fr: 'Eden, Survivor, Old Gen, Stack & String Pool', en: 'Eden, Survivor, Old Gen, Stack & String Pool' },
    icon: <Cpu className="w-4 h-4" />
  },
  {
    id: 'cvsjava',
    group: 'group-1',
    title: { fr: 'C vs Java (Rosetta)', en: 'C vs Java (Rosetta)' },
    subtitle: { fr: 'Pointeurs, malloc/free, structs & sécurité RAM', en: 'Pointers, malloc/free, structs & memory safety' },
    icon: <SplitSquareVertical className="w-4 h-4" />
  },
  {
    id: 'history',
    group: 'group-1',
    title: { fr: 'Versions & Histoire Java', en: 'Java Versions & History' },
    subtitle: { fr: 'Chronologie Java 1.0 à Java 23, LTS & Loom', en: 'Timeline Java 1.0 to Java 23, LTS & Loom' },
    icon: <History className="w-4 h-4" />
  },

  // Chapitre II · POO, VTable & Modèle Domaine
  {
    id: 'vtable',
    group: 'group-2',
    title: { fr: 'VTable & Dispatch', en: 'VTable & Dispatch' },
    subtitle: { fr: 'Résolution O(1) et pointeur Klass en mémoire', en: 'O(1) method lookup & Klass pointer' },
    icon: <Layers className="w-4 h-4" />
  },
  {
    id: 'modifiers',
    group: 'group-2',
    title: { fr: 'Static & Visibilité', en: 'Static & Visibility' },
    subtitle: { fr: 'Metaspace vs Heap, access_flags & opcodes invoke*', en: 'Metaspace vs Heap, access_flags & opcodes' },
    icon: <Shield className="w-4 h-4" />
  },
  {
    id: 'domain',
    group: 'group-2',
    title: { fr: 'Record, DDD & Enum', en: 'Record, DDD & Enum' },
    subtitle: { fr: 'Records Java 21, Modèle Riche vs Anémique, EnumSet', en: 'Java 21 Records, Rich vs Anemic DDD, EnumSet' },
    icon: <Box className="w-4 h-4" />
  },

  // Chapitre III · Collections, Streams & Bytecode
  {
    id: 'bytecode',
    group: 'group-3',
    title: { fr: 'Modificateur Bytecode', en: 'Bytecode Modifier' },
    subtitle: { fr: 'Injection d’opcodes ASM, instrumentation & pile', en: 'ASM opcode injection, instrumentation & stack' },
    icon: <Binary className="w-4 h-4" />
  },
  {
    id: 'playground',
    group: 'group-3',
    title: { fr: 'Playground & Inspecteur', en: 'Code Playground' },
    subtitle: { fr: 'Éditeur interactif avec templates JVM', en: 'Interactive editor with JVM templates' },
    icon: <Terminal className="w-4 h-4" />
  },

  // Chapitre IV · Build, Spring, JUnit & Javadoc
  {
    id: 'buildtools',
    group: 'group-4',
    title: { fr: 'Maven, Gradle & Ant', en: 'Maven, Gradle & Ant' },
    subtitle: { fr: 'Cycles de build, DAG incrémental & conflits transitifs', en: 'Build lifecycles, incremental DAG & dependency mediation' },
    icon: <Hammer className="w-4 h-4" />
  },
  {
    id: 'spring',
    group: 'group-4',
    title: { fr: 'Spring Boot & IoC', en: 'Spring Boot & IoC' },
    subtitle: { fr: 'Conteneur IoC, Scopes, Proxies CGLIB & @Transactional', en: 'IoC container, Scopes, CGLIB proxies & @Transactional' },
    icon: <Leaf className="w-4 h-4" />
  },
  {
    id: 'junit',
    group: 'group-4',
    title: { fr: 'JUnit 5 & Mockito', en: 'JUnit 5 & Mockito' },
    subtitle: { fr: 'PER_METHOD vs PER_CLASS, assertAll, ByteBuddy @Mock/@Spy', en: 'Lifecycle isolation, assertAll, ByteBuddy @Mock/@Spy' },
    icon: <FlaskConical className="w-4 h-4" />
  },
  {
    id: 'javadoc',
    group: 'group-4',
    title: { fr: 'Javadoc & Doclets', en: 'Javadoc & Doclets' },
    subtitle: { fr: 'DocTree AST, -Xdoclint, {@snippet} & Markdown ///', en: 'DocTree AST, -Xdoclint, {@snippet} & Markdown ///' },
    icon: <FileText className="w-4 h-4" />
  },

  // Chapitre V · Kotlin sur la JVM
  {
    id: 'kotlin',
    group: 'group-5',
    title: { fr: 'Kotlin & Bytecode JVM', en: 'Kotlin on the JVM' },
    subtitle: { fr: 'Null-safety, Int? boxing, inline/reified & Coroutines CPS', en: 'Null-safety, Int? boxing, inline/reified & CPS Coroutines' },
    icon: <Code2 className="w-4 h-4" />
  },

  // Outils transverses
  {
    id: 'chapters',
    group: 'tools',
    title: { fr: 'Cours Java & Dissection', en: 'Java Lessons & Dissector' },
    subtitle: { fr: '19 leçons regroupées en 5 chapitres', en: '19 lessons grouped into 5 chapters' },
    icon: <BookOpen className="w-4 h-4" />
  },
  {
    id: 'stepper',
    group: 'tools',
    title: { fr: 'Débogueur Pas-à-Pas', en: 'Step Debugger' },
    subtitle: { fr: 'Inspection temps réel Stack, Heap & Program Counter', en: 'Real-time Stack, Heap & PC inspection' },
    icon: <PlayCircle className="w-4 h-4" />
  },
  {
    id: 'quizzes',
    group: 'tools',
    title: { fr: 'Quiz de Maîtrise', en: 'Mastery Quizzes' },
    subtitle: { fr: 'Validation des connaissances sur 19 leçons', en: 'Knowledge validation across 19 lessons' },
    icon: <Award className="w-4 h-4" />
  },
  {
    id: 'tests',
    group: 'tools',
    title: { fr: 'Suite de Tests', en: 'Test Suite' },
    subtitle: { fr: 'Assertions unitaires exécutées en direct', en: 'Live functional unit assertions' },
    icon: <CheckSquare className="w-4 h-4" />
  }
];

interface ModuleExplorerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModuleExplorerDrawer: React.FC<ModuleExplorerDrawerProps> = ({ isOpen, onClose }) => {
  const { currentRoute, setRoute, setSelectedChapterId, language } = useJavaStore();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ALL_MODULES;
    return ALL_MODULES.filter(
      (m) =>
        m.title[language].toLowerCase().includes(q) ||
        m.subtitle[language].toLowerCase().includes(q)
    );
  }, [query, language]);

  if (!isOpen) return null;

  const sections: Array<{ key: ModuleItem['group']; label: string }> = [
    ...CHAPTER_GROUPS.map((g) => ({ key: g.id as ModuleItem['group'], label: g.title[language] })),
    {
      key: 'tools',
      label: language === 'fr' ? 'Parcours, Pratique & Validation' : 'Curriculum, Practice & Validation'
    }
  ];

  const handleSelect = (id: RouteType) => {
    const linkedChapter = LAB_ROUTE_TO_CHAPTER[id];
    if (linkedChapter) {
      setSelectedChapterId(linkedChapter);
    }
    setRoute(id);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-4xl bg-[#0F1623] border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[88vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sm:hidden w-10 h-1 bg-slate-700 rounded-full mx-auto mt-3" />

        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">
              {language === 'fr'
                ? 'Ateliers regroupés par Chapitre'
                : 'Workbenches Grouped by Chapter'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {language === 'fr'
                ? 'Chaque laboratoire interactif est rattaché à son chapitre pédagogique.'
                : 'Every interactive simulator is grouped directly under its learning chapter.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 border-b border-slate-800/80 bg-[#0B101B]">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                language === 'fr'
                  ? 'Filtrer par chapitre ou atelier (Kotlin, Spring, JUnit, Javadoc, VTable...)'
                  : 'Filter by chapter or workbench (Kotlin, Spring, JUnit, Javadoc, VTable...)'
              }
              className="w-full min-h-[44px] pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 focus:border-amber-500 focus:outline-none text-sm text-white placeholder:text-slate-500"
              autoFocus
            />
          </div>
        </div>

        <div className="p-5 overflow-y-auto space-y-6">
          {sections.map((section) => {
            const items = filtered.filter((m) => m.group === section.key);
            if (items.length === 0) return null;
            return (
              <div key={section.key} className="space-y-2.5">
                <h3 className="text-xs font-semibold text-amber-400 border-b border-slate-800/70 pb-1.5">
                  {section.label}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {items.map((item) => {
                    const active = currentRoute === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelect(item.id)}
                        className={`min-h-[64px] text-left p-3.5 rounded-xl border transition-colors flex items-start gap-3 ${
                          active
                            ? 'bg-amber-500/12 border-amber-500/50 text-white'
                            : 'bg-slate-900/70 border-slate-800/80 text-slate-200 hover:border-slate-700 hover:bg-slate-900'
                        }`}
                      >
                        <div
                          className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                            active
                              ? 'bg-amber-500 text-slate-950'
                              : 'bg-slate-800 text-amber-400'
                          }`}
                        >
                          {item.icon}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm font-semibold text-white truncate">
                            {item.title[language]}
                          </div>
                          <div className="text-[11px] text-slate-400 leading-snug mt-0.5 line-clamp-2">
                            {item.subtitle[language]}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
