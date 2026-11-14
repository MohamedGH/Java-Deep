import React, { useState, useMemo } from 'react';
import { JAVA_CHAPTERS } from '../data/javaChapters';
import { useJavaStore } from '../store/useJavaStore';
import {
  CHAPTER_GROUPS,
  CHAPTER_TO_LAB_ROUTE,
  ChapterGroupId,
  filterChapters,
  getAdjacentChapterId,
  getGroupForChapterId
} from '../utils/navigationEngine';
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Search,
  X,
  CheckCircle2,
  Bookmark,
  Layers,
  FlaskConical
} from 'lucide-react';

interface ChapterNavigatorBarProps {
  onChapterSelect?: (chapterId: string) => void;
  contextLabel?: { fr: string; en: string };
}

/**
 * Compact single-row Chapter Context Bar + Searchable Grouped Chapter Sheet/Modal.
 * Organizes all 19 lessons cleanly into 5 structured Chapters (I -> V).
 */
export const ChapterNavigatorBar: React.FC<ChapterNavigatorBarProps> = ({
  onChapterSelect,
  contextLabel
}) => {
  const {
    selectedChapterId,
    setSelectedChapterId,
    completedChapters,
    bookmarkedChapters,
    language
  } = useJavaStore();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [groupFilter, setGroupFilter] = useState<'All' | ChapterGroupId>('All');

  const currentIndex = Math.max(
    0,
    JAVA_CHAPTERS.findIndex((c) => c.id === selectedChapterId)
  );
  const currentChapter = JAVA_CHAPTERS[currentIndex] || JAVA_CHAPTERS[0];
  const currentGroup = getGroupForChapterId(currentChapter.id);

  const selectChapter = (chapterId: string) => {
    setSelectedChapterId(chapterId);
    onChapterSelect?.(chapterId);
    setIsDrawerOpen(false);
  };

  const handlePrev = () => {
    selectChapter(getAdjacentChapterId(JAVA_CHAPTERS, currentChapter.id, 'prev'));
  };

  const handleNext = () => {
    selectChapter(getAdjacentChapterId(JAVA_CHAPTERS, currentChapter.id, 'next'));
  };

  const filteredChapters = useMemo(
    () => filterChapters(JAVA_CHAPTERS, searchQuery, 'All', language, groupFilter),
    [searchQuery, groupFilter, language]
  );

  const visibleGroups = useMemo(
    () =>
      CHAPTER_GROUPS.map((group) => ({
        group,
        items: filteredChapters.filter((ch) => group.chapterIds.includes(ch.id))
      })).filter((entry) => entry.items.length > 0),
    [filteredChapters]
  );

  return (
    <>
      {/* Compact Single-Row Chapter Bar */}
      <div className="bg-[#0F1623] border border-slate-800/90 rounded-2xl p-3 sm:px-4 sm:py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="min-h-[44px] sm:min-h-[40px] px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-amber-400 flex items-center gap-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            aria-label={language === 'fr' ? 'Ouvrir le sommaire par chapitre' : 'Open chapter index'}
          >
            <Layers className="w-4 h-4 shrink-0" />
            <span className="tabular-nums">
              {currentGroup.roman} · {String(currentIndex + 1).padStart(2, '0')}/{JAVA_CHAPTERS.length}
            </span>
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[12px] text-slate-400 truncate">
              {contextLabel && (
                <>
                  <span className="text-amber-400 font-medium">{contextLabel[language]}</span>
                  <span aria-hidden="true">·</span>
                </>
              )}
              <span className="truncate">{currentGroup.title[language]}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums shrink-0">{currentChapter.estimatedTime}</span>
            </div>
            <div className="text-sm sm:text-base font-semibold text-white truncate">
              {currentChapter.title[language]}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
          <button
            onClick={handlePrev}
            className="min-h-[44px] sm:min-h-[40px] min-w-[44px] sm:min-w-[40px] px-2.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            title={language === 'fr' ? 'Leçon précédente' : 'Previous lesson'}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsDrawerOpen(true)}
            className="flex-1 sm:flex-initial min-h-[44px] sm:min-h-[40px] px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
          >
            <BookOpen className="w-3.5 h-3.5 shrink-0" />
            <span>
              {language === 'fr' ? 'Chapitres (5)' : 'Chapters (5)'}
            </span>
          </button>

          <button
            onClick={handleNext}
            className="min-h-[44px] sm:min-h-[40px] min-w-[44px] sm:min-w-[40px] px-2.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            title={language === 'fr' ? 'Leçon suivante' : 'Next lesson'}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grouped Chapter Drawer Modal */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6"
          onClick={() => setIsDrawerOpen(false)}
        >
          <div
            className="w-full sm:max-w-4xl bg-[#0F1623] border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[88vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sm:hidden w-10 h-1 bg-slate-700 rounded-full mx-auto mt-3" />

            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white">
                  {language === 'fr'
                    ? 'Programme regroupé par Chapitre'
                    : 'Curriculum Grouped by Chapter'}
                </h2>
                <p className="text-xs text-slate-400 tabular-nums mt-0.5">
                  {completedChapters.length} / {JAVA_CHAPTERS.length}{' '}
                  {language === 'fr' ? 'leçons complétées sur 5 chapitres' : 'lessons completed across 5 chapters'}
                </p>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="min-h-[44px] min-w-[44px] rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search & Chapter Group Tabs */}
            <div className="p-4 border-b border-slate-800/80 space-y-3 bg-[#0B101B]">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    language === 'fr'
                      ? 'Rechercher une leçon (Spring, Kotlin, JUnit, Javadoc, VTable, GC...)'
                      : 'Search lessons (Spring, Kotlin, JUnit, Javadoc, VTable, GC...)'
                  }
                  className="w-full min-h-[44px] pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 focus:border-amber-500 focus:outline-none text-sm text-white placeholder:text-slate-500"
                  autoFocus
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                <button
                  onClick={() => setGroupFilter('All')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                    groupFilter === 'All'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {language === 'fr' ? 'Tous (5)' : 'All (5)'}
                </button>
                {CHAPTER_GROUPS.map((grp) => {
                  const active = groupFilter === grp.id;
                  return (
                    <button
                      key={grp.id}
                      onClick={() => setGroupFilter(grp.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                        active
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      Ch. {grp.roman}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Grouped Chapter Sections */}
            <div className="p-5 overflow-y-auto space-y-6">
              {visibleGroups.length === 0 ? (
                <div className="py-10 text-center text-sm text-slate-400">
                  {language === 'fr'
                    ? 'Aucune leçon ne correspond à votre recherche.'
                    : 'No lessons match your search.'}
                </div>
              ) : (
                visibleGroups.map(({ group, items }) => {
                  const doneInGroup = items.filter((ch) => completedChapters.includes(ch.id)).length;
                  return (
                    <div key={group.id} className="space-y-2.5">
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b border-slate-800/80 pb-2">
                        <div>
                          <h3 className="text-sm font-bold text-white">
                            {group.title[language]}
                          </h3>
                          <p className="text-xs text-slate-400">{group.subtitle[language]}</p>
                        </div>
                        <span className="text-xs font-mono text-amber-400 tabular-nums shrink-0">
                          {doneInGroup}/{group.chapterIds.length}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {items.map((ch) => {
                          const idx = JAVA_CHAPTERS.findIndex((c) => c.id === ch.id);
                          const isActive = ch.id === currentChapter.id;
                          const isDone = completedChapters.includes(ch.id);
                          const isBook = bookmarkedChapters.includes(ch.id);
                          const hasLab = Boolean(CHAPTER_TO_LAB_ROUTE[ch.id]);

                          return (
                            <button
                              key={ch.id}
                              onClick={() => selectChapter(ch.id)}
                              className={`min-h-[62px] text-left p-3.5 rounded-xl border transition-colors flex items-start justify-between gap-3 ${
                                isActive
                                  ? 'bg-amber-500/12 border-amber-500/50 text-white'
                                  : 'bg-slate-900/70 border-slate-800/80 text-slate-200 hover:border-slate-700 hover:bg-slate-900'
                              }`}
                            >
                              <div className="min-w-0 space-y-1">
                                <div className="flex items-center gap-2 text-[11px] text-slate-400 tabular-nums">
                                  <span className="font-mono text-amber-400 font-semibold">
                                    {String(idx + 1).padStart(2, '0')}
                                  </span>
                                  <span aria-hidden="true">·</span>
                                  <span>{ch.estimatedTime}</span>
                                  {hasLab && (
                                    <>
                                      <span aria-hidden="true">·</span>
                                      <span className="text-sky-400 inline-flex items-center gap-1">
                                        <FlaskConical className="w-3 h-3" />
                                        <span>Atelier</span>
                                      </span>
                                    </>
                                  )}
                                </div>
                                <div className="text-xs sm:text-sm font-semibold leading-snug line-clamp-2">
                                  {ch.title[language].replace(/^\d+\.\s*/, '')}
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
                                {isBook && (
                                  <Bookmark className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                )}
                                {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
