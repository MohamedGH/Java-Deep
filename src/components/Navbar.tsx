import React from 'react';
import { useJavaStore } from '../store/useJavaStore';
import { RouteType } from '../types';
import { Globe, LayoutGrid } from 'lucide-react';
import { ALL_MODULES } from './ModuleExplorerDrawer';

interface NavbarProps {
  onOpenModules: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenModules }) => {
  const { currentRoute, setRoute, language, setLanguage } = useJavaStore();

  const primaryRoutes: Array<{ id: RouteType; label: { fr: string; en: string } }> = [
    { id: 'chapters', label: { fr: 'Cours', en: 'Lessons' } },
    { id: 'stepper', label: { fr: 'Simulateur', en: 'Stepper' } },
    { id: 'quizzes', label: { fr: 'Quiz', en: 'Quizzes' } },
    { id: 'tests', label: { fr: 'Tests', en: 'Tests' } }
  ];

  const isLabActive = !['chapters', 'stepper', 'quizzes', 'tests'].includes(currentRoute);
  const activeLab = isLabActive ? ALL_MODULES.find((m) => m.id === currentRoute) : null;

  return (
    <header className="sticky top-0 z-40 bg-[#090d16]/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <button
          onClick={() => setRoute('chapters')}
          className="text-lg font-extrabold tracking-tight text-white hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-md"
        >
          JavaBabel
        </button>

        {/* Zone 2: Clean Single-Line Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
          {primaryRoutes.slice(0, 2).map((item) => {
            const active = currentRoute === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setRoute(item.id)}
                className={`py-1.5 whitespace-nowrap shrink-0 transition-colors border-b-2 ${
                  active
                    ? 'text-amber-400 border-amber-400 font-semibold'
                    : 'text-slate-300 border-transparent hover:text-white'
                }`}
              >
                {item.label[language]}
              </button>
            );
          })}

          <button
            onClick={onOpenModules}
            className={`py-1.5 whitespace-nowrap shrink-0 flex items-center gap-1.5 transition-colors border-b-2 ${
              isLabActive
                ? 'text-amber-400 border-amber-400 font-semibold'
                : 'text-slate-300 border-transparent hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5 shrink-0" />
            <span>
              {activeLab
                ? activeLab.title[language]
                : language === 'fr'
                ? 'Ateliers'
                : 'Workbenches'}
            </span>
          </button>

          {primaryRoutes.slice(2).map((item) => {
            const active = currentRoute === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setRoute(item.id)}
                className={`py-1.5 whitespace-nowrap shrink-0 transition-colors border-b-2 ${
                  active
                    ? 'text-amber-400 border-amber-400 font-semibold'
                    : 'text-slate-300 border-transparent hover:text-white'
                }`}
              >
                {item.label[language]}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Single Primary Action (Language Switch) */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenModules}
            className="lg:hidden min-h-[40px] px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200 hover:text-white flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-amber-400" />
            <span>{language === 'fr' ? 'Ateliers' : 'Labs'}</span>
          </button>

          <button
            onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
            className="min-h-[40px] px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            title={language === 'fr' ? 'Passer en anglais' : 'Switch to French'}
          >
            <Globe className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>{language === 'fr' ? 'FR' : 'EN'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
