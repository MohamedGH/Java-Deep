import React from 'react';
import { useJavaStore } from '../store/useJavaStore';

export const Footer: React.FC = () => {
  const { language, setRoute } = useJavaStore();

  return (
    <footer className="bg-[#090d16] text-slate-400 py-5 border-t border-slate-800/80 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-200">JavaBabel</span>
          <span aria-hidden="true">·</span>
          <span>
            {language === 'fr'
              ? 'Pédagogie Babel-IT & Visualiseur JVM'
              : 'Babel-IT Pedagogy & JVM Visualizer'}
          </span>
        </div>

        <div className="flex items-center gap-5 text-xs">
          <button
            onClick={() => setRoute('chapters')}
            className="hover:text-white transition-colors"
          >
            {language === 'fr' ? 'Cours' : 'Lessons'}
          </button>
          <button
            onClick={() => setRoute('stepper')}
            className="hover:text-white transition-colors"
          >
            {language === 'fr' ? 'Simulateur' : 'Stepper'}
          </button>
          <button
            onClick={() => setRoute('quizzes')}
            className="hover:text-white transition-colors"
          >
            {language === 'fr' ? 'Quiz' : 'Quizzes'}
          </button>
          <button
            onClick={() => setRoute('tests')}
            className="hover:text-white transition-colors"
          >
            {language === 'fr' ? 'Tests' : 'Tests'}
          </button>
        </div>
      </div>
    </footer>
  );
};
