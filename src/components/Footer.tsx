import React from 'react';
import { useJavaStore } from '../store/useJavaStore';
import { Sparkles, Code2, ShieldCheck, SplitSquareVertical } from 'lucide-react';

export const Footer: React.FC = () => {
  const { language } = useJavaStore();

  return (
    <footer className="bg-slate-950 text-slate-400 py-6 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="font-bold text-white">JavaBabel Platform</span>
          <span className="text-slate-500">| {language === 'fr' ? 'Pédagogie Babel-IT & Visualiseur JVM' : 'Babel-IT Pedagogy & JVM Visualizer'}</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-400">
          <span className="flex items-center space-x-1">
            <SplitSquareVertical className="w-3.5 h-3.5 text-blue-400" />
            <span>C vs Java Rosetta Stone</span>
          </span>
          <span className="flex items-center space-x-1">
            <Code2 className="w-3.5 h-3.5 text-orange-400" />
            <span>Stack & Generational Heap</span>
          </span>
          <span className="flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>100% Tested Functional Suite</span>
          </span>
        </div>
      </div>
    </footer>
  );
};
