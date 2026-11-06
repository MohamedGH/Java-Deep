import React from 'react';
import { Sparkles, Code2, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 py-8 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span className="font-bold text-white">JavaBabel Platform</span>
          <span className="text-xs text-slate-500">| Inspired by Babel-IT pedagogy</span>
        </div>
        <div className="flex items-center space-x-6 text-xs text-slate-400">
          <span className="flex items-center space-x-1">
            <Code2 className="w-4 h-4 text-orange-400" />
            <span>JVM & Stack/Heap Visualizer</span>
          </span>
          <span className="flex items-center space-x-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Tested Functional Architecture</span>
          </span>
        </div>
      </div>
    </footer>
  );
};
