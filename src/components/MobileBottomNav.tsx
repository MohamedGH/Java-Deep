import React from 'react';
import { useJavaStore } from '../store/useJavaStore';
import { RouteType } from '../types';
import { BookOpen, PlayCircle, LayoutGrid, Award, CheckSquare } from 'lucide-react';

interface MobileBottomNavProps {
  onOpenModules: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onOpenModules }) => {
  const { currentRoute, setRoute, language } = useJavaStore();

  const isLabActive = !['chapters', 'stepper', 'quizzes', 'tests'].includes(currentRoute);

  const items: Array<{
    key: string;
    route?: RouteType;
    label: { fr: string; en: string };
    icon: React.ReactNode;
    active: boolean;
    onClick: () => void;
  }> = [
    {
      key: 'chapters',
      route: 'chapters',
      label: { fr: 'Cours', en: 'Lessons' },
      icon: <BookOpen className="w-5 h-5" />,
      active: currentRoute === 'chapters',
      onClick: () => setRoute('chapters')
    },
    {
      key: 'stepper',
      route: 'stepper',
      label: { fr: 'Stepper', en: 'Stepper' },
      icon: <PlayCircle className="w-5 h-5" />,
      active: currentRoute === 'stepper',
      onClick: () => setRoute('stepper')
    },
    {
      key: 'labs',
      label: { fr: 'Ateliers', en: 'Labs' },
      icon: <LayoutGrid className="w-5 h-5" />,
      active: isLabActive,
      onClick: onOpenModules
    },
    {
      key: 'quizzes',
      route: 'quizzes',
      label: { fr: 'Quiz', en: 'Quizzes' },
      icon: <Award className="w-5 h-5" />,
      active: currentRoute === 'quizzes',
      onClick: () => setRoute('quizzes')
    },
    {
      key: 'tests',
      route: 'tests',
      label: { fr: 'Tests', en: 'Tests' },
      icon: <CheckSquare className="w-5 h-5" />,
      active: currentRoute === 'tests',
      onClick: () => setRoute('tests')
    }
  ];

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 h-14 bg-[#090d16]/95 backdrop-blur-md border-t border-slate-800/90 grid grid-cols-5 items-center"
      aria-label="Navigation mobile"
    >
      {items.map((item) => (
        <button
          key={item.key}
          onClick={item.onClick}
          className={`h-full min-h-[44px] flex flex-col items-center justify-center gap-0.5 transition-colors ${
            item.active ? 'text-amber-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {item.icon}
          <span className="text-[10px] tracking-tight whitespace-nowrap">{item.label[language]}</span>
        </button>
      ))}
    </nav>
  );
};
