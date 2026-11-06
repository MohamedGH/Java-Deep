import React from 'react';
import { useJavaStore } from '../store/useJavaStore';
import { RouteType } from '../types';
import { BookOpen, Cpu, PlayCircle, SplitSquareVertical, Terminal, Award, CheckSquare, Sparkles, Globe, Menu, X, Binary } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentRoute, setRoute, language, setLanguage } = useJavaStore();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems: Array<{ id: RouteType; label: { fr: string; en: string }; icon: React.ReactNode }> = [
    { id: 'chapters', label: { fr: 'Curriculum', en: 'Curriculum' }, icon: <BookOpen className="w-4 h-4" /> },
    { id: 'stepper', label: { fr: 'Pas-à-Pas', en: 'Step Debugger' }, icon: <PlayCircle className="w-4 h-4" /> },
    { id: 'bytecode', label: { fr: 'Modifier Bytecode', en: 'Bytecode Studio' }, icon: <Binary className="w-4 h-4" /> },
    { id: 'visualizer', label: { fr: 'Mémoire JVM', en: 'JVM Memory' }, icon: <Cpu className="w-4 h-4" /> },
    { id: 'cvsjava', label: { fr: 'C vs Java', en: 'C vs Java' }, icon: <SplitSquareVertical className="w-4 h-4" /> },
    { id: 'playground', label: { fr: 'Labo IA', en: 'AI Lab' }, icon: <Terminal className="w-4 h-4" /> },
    { id: 'quizzes', label: { fr: 'Quiz', en: 'Quizzes' }, icon: <Award className="w-4 h-4" /> },
    { id: 'tests', label: { fr: 'Tests', en: 'Test Suite' }, icon: <CheckSquare className="w-4 h-4" /> }
  ];

  const handleNavClick = (route: RouteType) => {
    setRoute(route);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer select-none" onClick={() => handleNavClick('chapters')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Sparkles className="w-5 h-5 text-slate-950 animate-pulse font-bold" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-black bg-gradient-to-r from-amber-400 via-orange-400 to-red-500 bg-clip-text text-transparent">
                  JavaBabel
                </span>
                <span className="hidden sm:inline-block text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  JVM & C Rosetta
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono hidden sm:block">Pédagogie Babel-IT appliquée au Java</p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const active = currentRoute === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {item.icon}
                  <span>{item.label[language]}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Language switch & Mobile toggle */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-500/50 text-xs font-semibold text-slate-200 transition-all"
              title="Changer de langue / Switch Language"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'fr' ? '🇫🇷 FR' : '🇬🇧 EN'}</span>
            </button>

            {/* Mobile menu trigger */}
            <div className="flex lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none"
                aria-label="Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-b border-slate-800 px-4 pt-2 pb-4 space-y-1 animate-fadeIn">
          {navItems.map((item) => {
            const active = currentRoute === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  active
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                {item.icon}
                <span>{item.label[language]}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
