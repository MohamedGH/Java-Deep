import React, { useState } from 'react';
import { JAVA_CHAPTERS } from '../data/javaChapters';
import { useJavaStore } from '../store/useJavaStore';
import confetti from 'canvas-confetti';
import { Award, CheckCircle2, XCircle, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';

export const QuizView: React.FC = () => {
  const { quizScores, setQuizScore, language } = useJavaStore();
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const currentChapter = JAVA_CHAPTERS[selectedChapterIndex];
  const quiz = currentChapter.quiz;

  const handleSelectOption = (index: number) => {
    if (isSubmitted) return;
    setSelectedOption(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    setIsSubmitted(true);

    const isCorrect = selectedOption === quiz.correctIndex;
    if (isCorrect) {
      setQuizScore(currentChapter.id, 100);
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 }
      });
    } else {
      setQuizScore(currentChapter.id, 0);
    }
  };

  const handleNextQuiz = () => {
    setSelectedOption(null);
    setIsSubmitted(false);
    setSelectedChapterIndex((prev) => (prev + 1) % JAVA_CHAPTERS.length);
  };

  const currentScore = quizScores[currentChapter.id];
  const passedTotal = Object.values(quizScores).filter((s) => s === 100).length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden text-center">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="inline-flex items-center space-x-2 text-amber-400 font-semibold text-xs uppercase tracking-wider mb-2">
          <Award className="w-4 h-4" />
          <span>{language === 'fr' ? 'Validation des Connaissances' : 'Knowledge Mastery Quizzes'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          {language === 'fr' ? 'Quiz de Maîtrise Java & JVM' : 'Java & JVM Mastery Quizzes'}
        </h1>
        <p className="text-slate-300 text-sm mt-1 max-w-xl mx-auto">
          {language === 'fr'
            ? 'Évaluez votre compréhension des mécanismes JVM, de la pile, du tas, du Garbage Collector et du C vs Java avec explications instantanées.'
            : 'Validate your understanding of JVM internals, stack, heap, garbage collection, and C vs Java with immediate feedback.'}
        </p>

        {/* Global Score Progress */}
        <div className="mt-4 inline-flex items-center space-x-2 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-xs font-mono">
          <span className="text-slate-400">{language === 'fr' ? 'Score Global :' : 'Overall Score:'}</span>
          <span className="text-emerald-400 font-bold">{passedTotal} / {JAVA_CHAPTERS.length} Validés</span>
        </div>

        {/* Chapter Quiz Selector Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
          {JAVA_CHAPTERS.map((ch, idx) => {
            const active = idx === selectedChapterIndex;
            const scored = quizScores[ch.id] !== undefined;
            const passed = quizScores[ch.id] === 100;

            return (
              <button
                key={ch.id}
                onClick={() => {
                  setSelectedChapterIndex(idx);
                  setSelectedOption(null);
                  setIsSubmitted(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                  active
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20'
                    : scored
                    ? passed
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <span>Q{idx + 1}</span>
                {passed && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quiz Card */}
      <div className="bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
            {currentChapter.title[language]}
          </span>
          {currentScore !== undefined && (
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${
              currentScore === 100 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}>
              {currentScore === 100 ? '✅ Réussi (100%)' : '❌ Incorrect (0%)'}
            </span>
          )}
        </div>

        <h2 className="text-lg sm:text-xl font-bold text-white leading-snug">
          {quiz.question[language]}
        </h2>

        <div className="space-y-3">
          {quiz.options[language].map((option, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx === quiz.correctIndex;

            let btnStyle = 'bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700';

            if (isSelected) {
              btnStyle = 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-sm';
            }

            if (isSubmitted) {
              if (isCorrect) {
                btnStyle = 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-bold';
              } else if (isSelected && !isCorrect) {
                btnStyle = 'bg-red-500/20 border-red-500/50 text-red-300';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                disabled={isSubmitted}
                className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${btnStyle}`}
              >
                <div className="flex items-center space-x-3">
                  <span className="w-6 h-6 rounded-lg bg-slate-900 flex items-center justify-center font-mono text-xs text-slate-400 border border-slate-700">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-xs sm:text-sm font-medium">{option}</span>
                </div>

                {isSubmitted && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                {isSubmitted && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-400 shrink-0" />}
              </button>
            );
          })}
        </div>

        {isSubmitted && (
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-2 animate-fadeIn">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              {language === 'fr' ? 'Explication Pédagogique' : 'Explanation'}
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              {quiz.explanation[language]}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          {!isSubmitted ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={selectedOption === null}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
            >
              {language === 'fr' ? 'Valider ma Réponse' : 'Submit Answer'}
            </button>
          ) : (
            <button
              onClick={handleNextQuiz}
              className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-amber-500/20 ml-auto"
            >
              <span>{language === 'fr' ? 'Question Suivante' : 'Next Question'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
