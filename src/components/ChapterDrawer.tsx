import React, { useState, useMemo } from 'react';
import { JAVA_CHAPTERS } from '../data/javaChapters';
import { useJavaStore } from '../store/useJavaStore';
import {
  ChapterCategoryFilter,
  filterChapters,
  getAdjacentChapterId
} from '../utils/navigationEngine';
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Search,
  X,
  CheckCircle2,
  Bookmark,
  Layers
} from 'lucide-react';

interface ChapterNavigatorBarProps {
  onChapterSelect?: (chapterId: string) => void;
  contextLabel?: { fr: string; en: string };
}

/**
 * Replaces clunky <select> dropdowns and tall sidebars with a compact
 * single-row Chapter Context Bar + responsive Searchable Drawer/Sheet.
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
  const [categoryFilter, setCategoryFilter] = useState<ChapterCategoryFilter>('All');

  const currentIndex = Math.max(
    0,
    JAVA_CHAPTERS.findIndex((c) => c.id === selectedChapterId)
  );
  const currentChapter = JAVA_CHAPTERS[currentIndex] || JAVA_CHAPTERS[0];

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
    () => filterChapters(JAVA_CHAPTERS, searchQuery, categoryFilter, language),
    [searchQuery, categoryFilter, language]
  );

  const categories: ChapterCategoryFilter[] = [
    'All',
    'Fundamentals',
    'Memory & JVM',
    'OOP',
    'Advanced'
  ];

  return (
    <>
      {/* Compact Single-Row Chapter Bar */}
      <div className="bg-[#0F1623] border border-slate-800/90 rounded-2xl p-3 sm:px-4 sm:py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: Current Chapter Context */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="min-h-[44px] sm:min-h-[40px] px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-amber-400 flex items-center gap-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            aria-label={language === 'fr' ? 'Ouvrir le catalogue des chapitres' : 'Open chapter catalog'}
          >
            <Layers className="w-4 h-4 shrink-0" />
            <span className="tabular-nums">
              {String(currentIndex + 1).padStart(2, '0')} / {JAVA_CHAPTERS.length}
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
              <span>{currentChapter.category}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{currentChapter.estimatedTime}</span>
            </div>
            <div className="text-sm sm:text-base font-semibold text-white truncate">
              {currentChapter.title[language]}
            </div>
          </div>
        </div>

        {/* Right: Prev / Catalog Trigger / Next */}
        <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
          <button
            onClick={handlePrev}
            className="min-h-[44px] sm:min-h-[40px] min-w-[44px] sm:min-w-[40px] px-2.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            title={language === 'fr' ? 'Chapitre précédent' : 'Previous chapter'}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsDrawerOpen(true)}
            className="flex-1 sm:flex-initial min-h-[44px] sm:min-h-[40px] px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
          >
            <BookOpen className="w-3.5 h-3.5 shrink-0" />
            <span>
              {language === 'fr' ? 'Changer de chapitre' : 'Browse chapters'}
            </span>
          </button>

          <button
            onClick={handleNext}
            className="min-h-[44px] sm:min-h-[40px] min-w-[44px] sm:min-w-[40px] px-2.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            title={language === 'fr' ? 'Chapitre suivant' : 'Next chapter'}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Responsive Bottom Sheet (Mobile) / Modal Catalog (Desktop) */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6"
          onClick={() => setIsDrawerOpen(false)}
        >
          <div
            className="w-full sm:max-w-3xl bg-[#0F1623] border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[85vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile drag handle */}
            <div className="sm:hidden w-10 h-1 bg-slate-700 rounded-full mx-auto mt-3" />

            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white">
                  {language === 'fr' ? 'Programme Java & JVM' : 'Java & JVM Curriculum'}
                </h2>
                <p className="text-xs text-slate-400 tabular-nums mt-0.5">
                  {completedChapters.length} / {JAVA_CHAPTERS.length}{' '}
                  {language === 'fr' ? 'chapitres complétés' : 'chapters completed'}
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

            {/* Search & Segmented Category Filter */}
            <div className="p-4 border-b border-slate-800/80 space-y-3 bg-[#0B101B]">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    language === 'fr'
                      ? 'Rechercher un chapitre (Spring, JUnit, Javadoc, VTable, GC...)'
                      : 'Search chapters (Spring, JUnit, Javadoc, VTable, GC...)'
                  }
                  className="w-full min-h-[44px] pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 focus:border-amber-500 focus:outline-none text-sm text-white placeholder:text-slate-500"
                  autoFocus
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {categories.map((cat) => {
                  const active = categoryFilter === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                        active
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {cat === 'All' ? (language === 'fr' ? 'Tous' : 'All') : cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Chapter Grid */}
            <div className="p-4 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {filteredChapters.length === 0 ? (
                <div className="col-span-full py-10 text-center text-sm text-slate-400">
                  {language === 'fr'
                    ? 'Aucun chapitre ne correspond à votre recherche.'
                    : 'No chapters match your search.'}
                </div>
              ) : (
                filteredChapters.map((ch) => {
                  const idx = JAVA_CHAPTERS.findIndex((c) => c.id === ch.id);
                  const isActive = ch.id === currentChapter.id;
                  const isDone = completedChapters.includes(ch.id);
                  const isBook = bookmarkedChapters.includes(ch.id);

                  return (
                    <button
                      key={ch.id}
                      onClick={() => selectChapter(ch.id)}
                      className={`min-h-[60px] text-left p-3.5 rounded-xl border transition-colors flex items-start justify-between gap-3 ${
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
                          <span>{ch.category}</span>
                          <span aria-hidden="true">·</span>
                          <span>{ch.estimatedTime}</span>
                        </div>
                        <div className="text-xs sm:text-sm font-semibold leading-snug line-clamp-2">
                          {ch.title[language].replace(/^\d+\.\s*/, '')}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
                        {isBook && <Bookmark className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
                        {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                      </div>
                    </button>
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
