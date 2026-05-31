import React from 'react';
import { VOCABULARY, PHRASES } from '@/constants';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lock, Sparkles, HelpCircle, X, CheckCircle2, XCircle, RotateCcw, Trophy, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuth } from '@/App';
import { AudioButton } from '@/components/AudioButton';
import { motion, AnimatePresence } from 'motion/react';

interface WordItem {
  ru: string;
  en: string;
  pr: string;
}

interface QuizQuestion {
  word: WordItem;
  options: string[];
  correctIdx: number;
  selectedIdx: number | null;
  isCorrect: boolean | null;
}

const PREMIUM_VOCABULARY = [
  {
    category: '⭐ Campus Life (Жизнь в кампусе)',
    items: [
      { ru: 'Общежитие', en: 'Dormitory', pr: 'Obshchezhitiye' },
      { ru: 'Деканат', en: "Dean's office", pr: 'Dekanat' },
      { ru: 'Пропуск', en: 'Student ID/Pass', pr: 'Propusk' },
      { ru: 'Стипендия', en: 'Scholarship stipend', pr: 'Stipendiya' },
      { ru: 'Лекция', en: 'Lecture', pr: 'Lektsiya' }
    ]
  },
  {
    category: '⭐ Academic Russian (Академический)',
    items: [
      { ru: 'Преподаватель', en: 'University Lecturer', pr: 'Prepoda-vatel\'' },
      { ru: 'Экзамен', en: 'Examination', pr: 'Ekzamen' },
      { ru: 'Зачёт', en: 'Pass/Fail test', pr: 'Zachyot' },
      { ru: 'Расписание', en: 'Schedule', pr: 'Raspisaniye' },
      { ru: 'Кафедра', en: 'Department/Faculty', pr: 'Kafedra' }
    ]
  }
];

export function VocabularyView({ onNavigate }: { onNavigate?: (tab: string) => void }) {
  const { isPremium } = useAuth();

  const [isQuizActive, setIsQuizActive] = React.useState(false);
  const [questions, setQuestions] = React.useState<QuizQuestion[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = React.useState(0);
  const [score, setScore] = React.useState(0);

  const allVocabulary = [...VOCABULARY, ...PREMIUM_VOCABULARY];
  const availableItems = allVocabulary
    .filter(cat => isPremium || !PREMIUM_VOCABULARY.some(p => p.category === cat.category))
    .flatMap(cat => cat.items);

  const startQuiz = () => {
    if (availableItems.length < 5) {
      toast.error("Not enough vocabulary words to start a quiz.");
      return;
    }

    // Shuffle and pick 5 unique items
    const shuffledAvailable = [...availableItems].sort(() => Math.random() - 0.5);
    const selectedWords = shuffledAvailable.slice(0, 5);

    const generatedQuestions: QuizQuestion[] = selectedWords.map((targetWord) => {
      // Find 3 incorrect answers from other words' English translations
      const incorrectPool = availableItems
        .filter(item => item.en !== targetWord.en)
        .map(item => item.en);
      
      const uniqueIncorrect = Array.from(new Set(incorrectPool));
      const selectedIncorrect = [...uniqueIncorrect].sort(() => Math.random() - 0.5).slice(0, 3);
      
      // Merge and shuffle
      const options = [targetWord.en, ...selectedIncorrect];
      const shuffledOptions = [...options].sort(() => Math.random() - 0.5);
      const correctIdx = shuffledOptions.indexOf(targetWord.en);

      return {
        word: targetWord,
        options: shuffledOptions,
        correctIdx,
        selectedIdx: null,
        isCorrect: null
      };
    });

    setQuestions(generatedQuestions);
    setCurrentQuestionIdx(0);
    setScore(0);
    setIsQuizActive(true);
  };

  const handleOptionSelect = (optionIdx: number) => {
    if (questions[currentQuestionIdx].selectedIdx !== null) return; // already answered

    const updatedQuestions = [...questions];
    const currentQ = updatedQuestions[currentQuestionIdx];
    currentQ.selectedIdx = optionIdx;
    
    const isCorrect = optionIdx === currentQ.correctIdx;
    currentQ.isCorrect = isCorrect;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      toast.success("Correct! Well done.");
    } else {
      toast.error("Incorrect!");
    }
    
    setQuestions(updatedQuestions);
  };

  return (
    <div className="h-full bg-neutral-50/50">
      <ScrollArea className="h-full">
        <div className="p-4 md:p-8 space-y-12 pb-32">
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-light tracking-tight mb-2">
                Essential <span className="font-serif italic font-medium text-orange-600">Vocabulary</span>
              </h2>
              <p className="text-neutral-500 font-light max-w-lg text-sm md:text-base">
                Categorized words to help you navigate daily life in Russia. {!isPremium && "Previewing first 50 words."}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                onClick={startQuiz}
                className="bg-orange-500 hover:bg-orange-600 border-none text-white font-semibold rounded-xl px-5 h-10 flex items-center gap-2 shadow-xs transition-all text-sm cursor-pointer"
              >
                <HelpCircle className="w-4 h-4" /> Quick Quiz
              </Button>
              {!isPremium && (
                <Badge className="bg-orange-500 hover:bg-orange-600 border-none text-white flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-bold leading-none h-6">
                  <Sparkles className="w-3" /> FREE PREVIEW
                </Badge>
              )}
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {allVocabulary.map((cat, catIdx) => {
              // Gate categories beyond standard ones or let free preview up to 50 words
              // There are 5 items per category. Beyond 10 categories (50 items) is gated.
              // We currently have 7 standard categories (35 items) + 2 premium (10 items) = 9 categories.
              // So all categories fit within 50 words except the last sections if we scale, but we can specifically gate the "PREMIUM_VOCABULARY" categories.
              const isCategoryPremium = PREMIUM_VOCABULARY.some(p => p.category === cat.category);
              const isLockedCategory = !isPremium && isCategoryPremium;

              return (
                <div key={cat.category} className="relative group">
                  <Card className={`border-neutral-200 shadow-xs overflow-hidden bg-white/50 backdrop-blur-xs transition-all ${
                    isLockedCategory ? 'blur-xs select-none pointer-events-all opacity-85 hover:border-orange-200' : ''
                  }`}>
                    <CardHeader className="bg-neutral-50/50 border-b border-neutral-100 py-3 flex flex-row items-center justify-between">
                      <CardTitle className="text-lg font-medium text-neutral-800 flex items-center gap-2">
                        {cat.category}
                      </CardTitle>
                      {isLockedCategory && (
                        <Badge variant="outline" className="border-orange-200 bg-orange-50 text-orange-600 text-[10px] font-bold">
                          PREMIUM
                        </Badge>
                      )}
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="divide-y divide-neutral-100">
                        {cat.items.map((item) => (
                          <div key={item.ru} className="flex items-center justify-between p-3 hover:bg-neutral-50/80 transition-colors group/item">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-medium">{item.ru}</span>
                                <span className="text-neutral-400 text-xs font-light">[{item.pr}]</span>
                              </div>
                              <p className="text-sm text-neutral-500 font-light">{item.en}</p>
                            </div>
                            {(!isLockedCategory) && (
                              <AudioButton 
                                text={item.ru} 
                                size="sm" 
                                className="opacity-0 group-hover/item:opacity-100 transition-opacity"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {isLockedCategory && (
                    <div className="absolute inset-0 bg-transparent flex flex-col items-center justify-center p-4 text-center z-10">
                      <div className="bg-neutral-900/95 border border-neutral-800 p-6 rounded-2xl max-w-[280px] shadow-xl text-white">
                        <Lock className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                        <h4 className="text-sm font-bold mb-1">Dormitory & Campus Vocab</h4>
                        <p className="text-[11px] text-neutral-400 mb-4 font-light">
                          Get university-specific words and dorm check-in phrases for $2/month.
                        </p>
                        <Button 
                          onClick={() => {
                            if (onNavigate) {
                              onNavigate('premium');
                              toast.info("Navigated to upgrade section.");
                            } else {
                              toast.info("Please upgrade to the Scholar Plan from the sidebar menu to unlock.");
                            }
                          }} 
                          className="w-full h-9 bg-orange-500 hover:bg-orange-600 text-xs font-bold rounded-xl"
                        >
                          Unlock All 200+ Words
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <section className="pt-8">
            <header className="mb-8">
              <h2 className="text-2xl md:text-3xl font-light tracking-tight mb-2">
                Common <span className="font-serif italic font-medium text-orange-600">Phrases</span>
              </h2>
              <p className="text-neutral-500 font-light max-w-lg text-sm md:text-base">
                Handy sentences for quick communication. {!isPremium && "Previewing first 3 phrases."}
              </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {PHRASES.map((phrase, idx) => {
                const isPhraseLocked = !isPremium && idx >= 3;

                return (
                  <div key={phrase.ru} className="relative group/phrase">
                    <div className={`bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs hover:border-orange-200 transition-all flex items-start justify-between ${
                      isPhraseLocked ? 'blur-xs select-none pointer-events-all opacity-75' : ''
                    }`}>
                      <div>
                        <p className="text-lg font-medium mb-1">{phrase.ru}</p>
                        <p className="text-sm text-neutral-400 font-light mb-2">[{phrase.pr}]</p>
                        <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-100 font-normal">
                          {phrase.en}
                        </Badge>
                      </div>
                      {!isPhraseLocked && (
                        <div className="flex items-center gap-1 shrink-0 bg-neutral-50/50 p-1 rounded-lg">
                          <AudioButton text={phrase.ru} size="md" />
                          <AudioButton text={phrase.ru} slow={true} size="sm" />
                        </div>
                      )}
                    </div>

                    {isPhraseLocked && (
                      <div className="absolute inset-0 bg-transparent flex items-center justify-center p-2 text-center z-10">
                        <div className="bg-neutral-900/90 text-white rounded-xl py-2 px-4 shadow-lg flex items-center gap-2 border border-neutral-800">
                          <Lock className="w-3.5 h-3.5 text-orange-400" />
                          <span className="text-[10px] font-bold">Premium Phrase</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </ScrollArea>

      {/* Quiz Modal Overlay */}
      <AnimatePresence>
        {isQuizActive && questions.length > 0 && (
          <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-xl border border-neutral-100 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200"
            >
              {currentQuestionIdx < questions.length ? (
                <>
                  <div className="p-6 pb-2 border-b border-neutral-100 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-neutral-800 flex items-center gap-2 animate-pulse">
                        <HelpCircle className="w-5 h-5 text-orange-500" />
                        Vocabulary Quiz
                      </h3>
                      <p className="text-xs text-neutral-400 font-light mt-0.5">
                        Test your Russian translation memory
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsQuizActive(false)}
                      className="rounded-full hover:bg-neutral-100 h-8 w-8 text-neutral-400 hover:text-neutral-600"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>

                  {/* Progress Indicator */}
                  <div className="w-full bg-neutral-150 h-1">
                    <motion.div 
                      className="bg-orange-500 h-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${((currentQuestionIdx + 1) / questions.length) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>

                  <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                    {/* Display Word */}
                    <div className="text-center py-6">
                      <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5 block">
                        Question {currentQuestionIdx + 1} of {questions.length}
                      </span>
                      <h3 className="text-3xl md:text-4xl font-bold font-sans text-neutral-855 tracking-tight">
                        {questions[currentQuestionIdx].word.ru}
                      </h3>
                      <div className="text-neutral-400 text-sm font-light mt-1.5 flex items-center justify-center gap-1.5">
                        <span>[{questions[currentQuestionIdx].word.pr}]</span>
                        <AudioButton text={questions[currentQuestionIdx].word.ru} size="sm" className="bg-neutral-50 border border-neutral-200" />
                      </div>
                    </div>

                    {/* Options Stack */}
                    <div className="space-y-2.5 my-4">
                      {questions[currentQuestionIdx].options.map((option, idx) => {
                        const isAnswered = questions[currentQuestionIdx].selectedIdx !== null;
                        const isSelected = questions[currentQuestionIdx].selectedIdx === idx;
                        const isCorrectOption = idx === questions[currentQuestionIdx].correctIdx;

                        let btnStyle = "border-neutral-200 hover:border-orange-300 hover:bg-orange-50/10";
                        let iconNode = null;

                        if (isAnswered) {
                          if (isCorrectOption) {
                            btnStyle = "border-emerald-500 bg-emerald-50 text-emerald-800 font-medium shadow-xs";
                            iconNode = <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />;
                          } else if (isSelected) {
                            btnStyle = "border-rose-400 bg-rose-50 text-rose-800 font-medium shadow-xs";
                            iconNode = <XCircle className="w-5 h-5 text-rose-600 shrink-0" />;
                          } else {
                            btnStyle = "opacity-50 border-neutral-100 bg-neutral-50/50 cursor-not-allowed";
                          }
                        }

                        return (
                          <button
                            key={idx}
                            id={`quiz-option-${idx}`}
                            disabled={isAnswered}
                            onClick={() => handleOptionSelect(idx)}
                            className={`w-full text-left p-4 rounded-xl border ${btnStyle} transition-all duration-250 flex items-center justify-between text-sm md:text-base font-normal cursor-pointer`}
                          >
                            <span className="flex-1 pr-4">{option}</span>
                            {iconNode}
                          </button>
                        );
                      })}
                    </div>

                    {/* Feedback block / Next button */}
                    <div className="mt-6 flex items-center justify-between gap-4">
                      <div className="text-sm font-medium">
                        {questions[currentQuestionIdx].selectedIdx !== null && (
                          <span className={questions[currentQuestionIdx].isCorrect ? "text-emerald-700 font-semibold" : "text-rose-700 font-semibold"}>
                            {questions[currentQuestionIdx].isCorrect ? "✨ Correct!" : "❌ Incorrect"}
                          </span>
                        )}
                      </div>
                      <Button
                        disabled={questions[currentQuestionIdx].selectedIdx === null}
                        onClick={() => setCurrentQuestionIdx(prev => prev + 1)}
                        className="bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40 text-white rounded-xl h-11 px-5 flex items-center gap-1.5 font-semibold text-sm cursor-pointer ml-auto"
                      >
                        {currentQuestionIdx === questions.length - 1 ? "Finish Quiz" : "Next Question"}
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                /* Results View */
                <>
                  <div className="p-6 pb-2 text-center relative border-b border-neutral-100">
                    <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
                    <h3 className="text-xl font-bold text-neutral-800">Quiz Completed!</h3>
                    <p className="text-xs text-neutral-400 font-light mt-0.5">Here is how you performed</p>
                  </div>

                  <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                    <div className="text-center py-4">
                      <div className="inline-flex items-baseline justify-center gap-1">
                        <span className="text-5xl font-extrabold text-neutral-800">{score}</span>
                        <span className="text-neutral-400 text-lg font-medium">/ {questions.length}</span>
                      </div>
                      <p className="text-neutral-500 text-sm mt-3 font-medium">
                        {score === 5 && "🏆 Absolute Perfection! Master of vocabulary."}
                        {score === 4 && "✨ Fantastic job! You've got these down."}
                        {score === 3 && "👍 Good effort! Just a little more practice."}
                        {score < 3 && "📚 Keep practicing! You will master Russian in no time."}
                      </p>
                    </div>

                    {/* Word review list */}
                    <div className="my-4">
                      <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2 text-left">Word Review</h4>
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {questions.map((q, idx) => (
                          <div key={idx} className="flex justify-between items-center bg-neutral-50 p-3 rounded-xl border border-neutral-100 text-sm">
                            <div className="flex flex-col text-left">
                              <span className="font-semibold text-neutral-800">{q.word.ru}</span>
                              <span className="text-xs text-neutral-400 font-light">
                                Correct: {q.word.en}
                              </span>
                              {!q.isCorrect && q.selectedIdx !== null && (
                                <span className="text-xs text-rose-500 font-light">
                                  Your answer: {q.options[q.selectedIdx]}
                                </span>
                              )}
                            </div>
                            {q.isCorrect ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                            ) : (
                              <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mt-6">
                      <Button
                        variant="outline"
                        onClick={() => setIsQuizActive(false)}
                        className="flex-1 rounded-xl h-11 border-neutral-200 text-neutral-700 hover:bg-neutral-50 font-medium text-sm cursor-pointer"
                      >
                        Close
                      </Button>
                      <Button
                        onClick={startQuiz}
                        className="flex-1 bg-orange-500 hover:bg-orange-600 text-white rounded-xl h-11 font-semibold text-sm flex items-center justify-center gap-1.5 cursor-pointer border-none"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Play Again
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
