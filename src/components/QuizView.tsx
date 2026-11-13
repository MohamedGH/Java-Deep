import React, { useState } from 'react';
import { JAVA_CHAPTERS } from '../data/javaChapters';
import { useJavaStore } from '../store/useJavaStore';
import { ChapterNavigatorBar } from './ChapterDrawer';
import confetti from 'canvas-confetti';
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

export const QuizView: React.FC = () => {
  const {
    selectedChapterId,
    setSelectedChapterId,
    quizScores,
    setQuizScore,
    language
  } = useJavaStore();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const currentIndex = Math.max(
    0,
    JAVA_CHAPTERS.findIndex((c) => c.id === selectedChapterId)
  );
  const currentChapter = JAVA_CHAPTERS[currentIndex] || JAVA_CHAPTERS[0];
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
        particleCount: 80,
        spread: 75,
        origin: { y: 0.6 }
      });
    } else {
      setQuizScore(currentChapter.id, 0);
    }
  };

  const handleNextQuiz = () => {
    const nextIdx = (currentIndex + 1) % JAVA_CHAPTERS.length;
    setSelectedChapterId(JAVA_CHAPTERS[nextIdx].id);
    setSelectedOption(null);
    setIsSubmitted(false);
  };

  const currentScore = quizScores[currentChapter.id];
  const passedTotal = Object.values(quizScores).filter((s) => s === 100).length;
  const pct = Math.round((passedTotal / JAVA_CHAPTERS.length) * 100);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Chapter Picker Bar (Replaces 18 pill buttons) */}
      <ChapterNavigatorBar
        onChapterSelect={() => {
          setSelectedOption(null);
          setIsSubmitted(false);
        }}
        contextLabel={{ fr: 'Quiz de Maîtrise', en: 'Mastery Quiz' }}
      />

      {/* Mastery Summary Strip */}
      <section className="bg-[#0F1623] rounded-2xl p-5 sm:p-6 border border-slate-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            {language === 'fr' ? 'Quiz Java & JVM' : 'Java & JVM Mastery Quiz'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {language === 'fr'
              ? 'Validez votre compréhension des mécanismes JVM chapitre par chapitre.'
              : 'Validate your understanding of JVM internals chapter by chapter.'}
          </p>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="text-right">
            <div className="text-xs text-slate-400">
              {language === 'fr' ? 'Progression globale' : 'Overall mastery'}
            </div>
            <div className="text-base font-bold text-emerald-400 font-mono tabular-nums">
              {passedTotal} / {JAVA_CHAPTERS.length} ({pct}%)
            </div>
          </div>
        </div>
      </section>

      {/* Active Quiz Card */}
      <section className="bg-[#0F1623] rounded-2xl p-6 sm:p-8 border border-slate-800/90 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="text-xs text-slate-400">
            <span className="text-amber-400 font-semibold">{currentChapter.category}</span>
            <span aria-hidden="true" className="mx-2">·</span>
            <span>{currentChapter.title[language]}</span>
          </div>

          {currentScore !== undefined && (
            <span
              className={`text-xs font-semibold flex items-center gap-1.5 ${
                currentScore === 100 ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {currentScore === 100 ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{language === 'fr' ? 'Validé (100%)' : 'Passed (100%)'}</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4" />
                  <span>{language === 'fr' ? 'À revoir (0%)' : 'Review (0%)'}</span>
                </>
              )}
            </span>
          )}
        </div>

        <h2 className="text-lg sm:text-xl font-bold text-white leading-snug text-balance">
          {quiz.question[language]}
        </h2>

        <div className="space-y-3">
          {quiz.options[language].map((option, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx === quiz.correctIndex;

            let btnStyle = 'bg-[#090D16] border-slate-800 text-slate-200 hover:border-slate-700';

            if (isSelected) {
              btnStyle = 'bg-amber-500/15 border-amber-500/50 text-amber-200';
            }

            if (isSubmitted) {
              if (isCorrect) {
                btnStyle = 'bg-emerald-500/15 border-emerald-500/50 text-emerald-200 font-semibold';
              } else if (isSelected && !isCorrect) {
                btnStyle = 'bg-red-500/15 border-red-500/50 text-red-200';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                disabled={isSubmitted}
                className={`w-full min-h-[48px] text-left p-4 rounded-xl border transition-colors flex items-center justify-between gap-3 ${btnStyle}`}
              >
                <div className="flex items-center gap-3.5">
                  <span className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center font-mono text-xs text-slate-400 border border-slate-800 shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-xs sm:text-sm">{option}</span>
                </div>

                {isSubmitted && isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                )}
                {isSubmitted && isSelected && !isCorrect && (
                  <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {isSubmitted && (
          <div className="bg-[#090D16] p-5 rounded-xl border border-slate-800 space-y-2">
            <h3 className="text-xs font-semibold text-amber-400">
              {language === 'fr' ? 'Explication pédagogique' : 'Explanation'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {quiz.explanation[language]}
            </p>
          </div>
        )}

        <div className="flex items-center justify-end pt-4 border-t border-slate-800">
          {!isSubmitted ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={selectedOption === null}
              className="min-h-[44px] px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors disabled:opacity-40"
            >
              {language === 'fr' ? 'Valider ma réponse' : 'Submit answer'}
            </button>
          ) : (
            <button
              onClick={handleNextQuiz}
              className="min-h-[44px] flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
            >
              <span>{language === 'fr' ? 'Chapitre suivant' : 'Next chapter'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </section>
    </div>
  );
};
