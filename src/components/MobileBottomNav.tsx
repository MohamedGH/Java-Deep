import React from 'react';
import { useJavaStore } from '../store/useJavaStore';
import { RouteType } from '../types';
import { BookOpen, PlayCircle, Cpu, SplitSquareVertical, Award, Binary } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { currentRoute, setRoute, language } = useJavaStore();

  const tabs: Array<{ id: RouteType; label: { fr: string; en: string }; icon: React.ReactNode }> = [
    { id: 'chapters', label: { fr: 'Cours', en: 'Lessons' }, icon: <BookOpen className="w-4 h-4" /> },
    { id: 'stepper', label: { fr: 'Pas-à-Pas', en: 'Stepper' }, icon: <PlayCircle className="w-4 h-4" /> },
    { id: 'bytecode', label: { fr: 'Bytecode', en: 'Bytecode' }, icon: <Binary className="w-4 h-4" /> },
    { id: 'visualizer', label: { fr: 'Mémoire', en: 'Memory' }, icon: <Cpu className="w-4 h-4" /> },
    { id: 'cvsjava', label: { fr: 'C vs Java', en: 'C vs Java' }, icon: <SplitSquareVertical className="w-4 h-4" /> }
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800 px-2 py-1 flex items-center justify-around shadow-2xl safe-area-pb">
      {tabs.map((tab) => {
        const active = currentRoute === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setRoute(tab.id)}
            className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all ${
              active
                ? 'text-amber-400 font-bold scale-105'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-lg ${active ? 'bg-amber-500/20' : ''}`}>
              {tab.icon}
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">{tab.label[language]}</span>
          </button>
        );
      })}
    </nav>
  );
};
