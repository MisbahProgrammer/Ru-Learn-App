import React from 'react';
import { VOCABULARY, PHRASES } from '@/constants';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, FileText, Lock, Sparkles, HelpCircle, X, CheckCircle2, XCircle, RotateCcw, Trophy, ArrowRight, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuth } from '@/App';
import { AudioButton } from '@/components/AudioButton';
import { motion, AnimatePresence } from 'motion/react';
import { STUDY_GUIDE_CHAPTERS, StudyItem } from '@/data/studyGuide';

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

// Keep a few interactive premium categories
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

  const [activeTab, setActiveTabState] = React.useState<'guide' | 'native'>('guide');
  const [selectedChapterId, setSelectedChapterId] = React.useState<number>(1);
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [isQuizActive, setIsQuizActive] = React.useState(false);
  const [questions, setQuestions] = React.useState<QuizQuestion[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = React.useState(0);
  const [score, setScore] = React.useState(0);

  const allVocabulary = [...VOCABULARY, ...PREMIUM_VOCABULARY];
  const availableItems = allVocabulary
    .filter(cat => isPremium || !PREMIUM_VOCABULARY.some(p => p.category === cat.category))
    .flatMap(cat => cat.items);

  const startQuiz = () => {
    // Collect possible quiz items from both native vocab (if unlocked) and PDF study guide (for chapters 1-4 or all if premium)
    const activeGuideItems = STUDY_GUIDE_CHAPTERS
      .filter(ch => isPremium || ch.id <= 4)
      .flatMap(ch => ch.items.map(item => ({ ru: item.ru, en: item.en, pr: item.pr })));

    const nativeItems = availableItems.map(item => ({ ru: item.ru, en: item.en, pr: item.pr }));
    const totalQuizPool = [...nativeItems, ...activeGuideItems];

    if (totalQuizPool.length < 5) {
      toast.error("Not enough vocabulary words to start a quiz.");
      return;
    }

    // Shuffle and pick 5 unique items
    const shuffledAvailable = [...totalQuizPool].sort(() => Math.random() - 0.5);
    const selectedWords = shuffledAvailable.slice(0, 5);

    const generatedQuestions: QuizQuestion[] = selectedWords.map((targetWord) => {
      // Find 3 incorrect answers from other words' English translations
      const incorrectPool = totalQuizPool
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

  // Get active chapter
  const currentChapter = STUDY_GUIDE_CHAPTERS.find(ch => ch.id === selectedChapterId) || STUDY_GUIDE_CHAPTERS[0];
  const isChapterLocked = !isPremium && currentChapter.id > 4;

  // Filter study guide items across all chapters if search query is entered
  const filteredGuideItems = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    
    const results: { item: StudyItem; chapterTitle: string; chapterId: number; isLocked: boolean }[] = [];
    STUDY_GUIDE_CHAPTERS.forEach(ch => {
      const isLocked = !isPremium && ch.id > 4;
      ch.items.forEach(item => {
        if (
          item.ru.toLowerCase().includes(query) ||
          item.en.toLowerCase().includes(query) ||
          item.pr.toLowerCase().includes(query)
        ) {
          results.push({
            item,
            chapterTitle: ch.title,
            chapterId: ch.id,
            isLocked
          });
        }
      });
    });
    return results;
  }, [searchQuery, isPremium]);

  return (
    <div className="h-full bg-neutral-50/50">
      <ScrollArea className="h-full">
        <div className="p-4 md:p-8 space-y-8 pb-32">
          {/* Header */}
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/65 pb-6">
            <div>
              <span className="text-xs font-semibold text-orange-600 uppercase tracking-widest block mb-1">
                Student Language Essentials
              </span>
              <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-2">
                Vocabulary & <span className="font-serif italic font-medium text-orange-600">Phrases</span>
              </h2>
              <p className="text-neutral-500 font-light max-w-lg text-sm md:text-base leading-relaxed">
                Study and master custom vocabulary, common dialogues, and survival terms imported directly from our Student Study Guide.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                id="vocab-start-quiz-btn"
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

          {/* Top-Level Tabs Container */}
          <div className="flex items-center justify-start border-b border-neutral-200">
            <button
              id="sub-tab-study-guide"
              onClick={() => { setActiveTabState('guide'); setSearchQuery(''); }}
              className={`py-3 px-6 text-sm font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'guide'
                  ? 'border-orange-500 text-orange-600 font-bold'
                  : 'border-transparent text-neutral-500 hover:text-neutral-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Study Guide PDF</span>
              <Badge variant="secondary" className="text-[10px] w-5 h-5 flex items-center justify-center p-0 rounded-full font-bold">13</Badge>
            </button>
            <button
              id="sub-tab-survival-categories"
              onClick={() => { setActiveTabState('native'); setSearchQuery(''); }}
              className={`py-3 px-6 text-sm font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'native'
                  ? 'border-orange-500 text-orange-600 font-bold'
                  : 'border-transparent text-neutral-500 hover:text-neutral-800'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Survival Topics</span>
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5 rounded-full font-bold">Quiz Included</Badge>
            </button>
          </div>

          {/* Tab Content 1: PDF Study Guide */}
          {activeTab === 'guide' && (
            <div className="space-y-6">
              {/* Search bar inside study guide */}
              <div className="relative max-w-md w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  id="vocab-search-input"
                  type="text"
                  placeholder="Search over 250+ study guide words and phrases..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-white shadow-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm placeholder-neutral-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {searchQuery.trim() ? (
                /* Search Results View */
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-wider">
                      Search Results ({filteredGuideItems.length})
                    </h3>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-xs text-orange-600 hover:underline font-medium"
                    >
                      Clear Search
                    </button>
                  </div>

                  {filteredGuideItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredGuideItems.map(({ item, chapterTitle, chapterId, isLocked }, idx) => (
                        <div key={idx} className="relative group/phrase">
                          <div className={`bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs hover:border-orange-200 transition-all flex items-start justify-between ${
                            isLocked ? 'blur-xs select-none pointer-events-all opacity-75' : ''
                          }`}>
                            <div className="space-y-1.5 flex-1 pr-2">
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-medium">{item.ru}</span>
                                <span className="text-neutral-400 text-xs font-light">[{item.pr}]</span>
                              </div>
                              <p className="text-sm text-neutral-500 font-light">{item.en}</p>
                              <Badge variant="outline" className="text-[10px] bg-neutral-50 text-neutral-500 border-neutral-200">
                                {chapterTitle}
                              </Badge>
                            </div>
                            {!isLocked && (
                              <div className="flex items-center gap-1 shrink-0 bg-neutral-50/50 p-1 rounded-lg">
                                <AudioButton text={item.ru} size="sm" />
                                <AudioButton text={item.ru} slow={true} size="sm" />
                              </div>
                            )}
                          </div>

                          {isLocked && (
                            <div className="absolute inset-0 bg-transparent flex flex-col items-center justify-center p-2 text-center z-10">
                              <div className="bg-neutral-900/95 text-white rounded-2xl p-3 shadow-lg border border-neutral-800 max-w-[200px]">
                                <Lock className="w-4 h-4 text-orange-400 mx-auto mb-1" />
                                <p className="text-[10px] font-bold">Chapter {chapterId} Locked</p>
                                <button
                                  onClick={() => {
                                    if (onNavigate) onNavigate('premium');
                                  }}
                                  className="text-[9px] text-orange-400 hover:underline mt-1 block w-full text-center font-bold"
                                >
                                  Unlock with Scholar Elite
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-white rounded-3xl border border-neutral-200/60 p-6 max-w-md mx-auto">
                      <HelpCircle className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
                      <h4 className="text-sm font-semibold text-neutral-700">No results found</h4>
                      <p className="text-xs text-neutral-400 mt-1 font-light">
                        Try searching for words like 'Airport', 'Taxi', 'Breakfast', or their Russian equivalents.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                /* Primary Category Exploration View */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Left Column: Chapters Sidebar Picker */}
                  <div className="lg:col-span-4 space-y-2">
                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest pl-2 block mb-3">
                      Chapters List
                    </span>
                    <div className="flex flex-row overflow-x-auto lg:flex-col gap-2 pb-3 lg:pb-0 scrollbar-none">
                      {STUDY_GUIDE_CHAPTERS.map((ch) => {
                        const isThisChapterLocked = !isPremium && ch.id > 4;
                        const isSelected = selectedChapterId === ch.id;

                        return (
                          <button
                            key={ch.id}
                            id={`chapter-tab-${ch.id}`}
                            onClick={() => setSelectedChapterId(ch.id)}
                            className={`flex items-center justify-between text-left px-4 py-3 rounded-xl transition-all border shrink-0 text-sm font-medium cursor-pointer ${
                              isSelected
                                ? 'bg-orange-50 border-orange-200 text-orange-800 shadow-2xs font-semibold'
                                : 'bg-white hover:bg-neutral-50/70 border-neutral-200/70 text-neutral-600'
                            }`}
                          >
                            <span className="truncate max-w-[240px]">{ch.title.split('. ')[1] || ch.title}</span>
                            <div className="flex items-center gap-1.5 pl-2">
                              {isThisChapterLocked && (
                                <Lock className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                              )}
                              <Badge className="bg-neutral-100 text-neutral-600 hover:bg-neutral-100 text-[10px] h-5 w-7 flex items-center justify-center p-0 rounded-full font-bold">
                                {ch.items.length}
                              </Badge>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Column: Displaying Active Chapter Items */}
                  <div className="lg:col-span-8 space-y-4">
                    <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm p-6 relative overflow-hidden">
                      {/* Decorative elements */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50/40 rounded-full blur-2xl pointer-events-none" />
                      
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-neutral-100 pb-5 mb-5">
                        <div>
                          <Badge variant="outline" className="border-orange-200 bg-orange-50 text-orange-600 text-[10px] font-bold uppercase tracking-widest mb-2 px-2 py-0.5">
                            Chapter {currentChapter.id} {isChapterLocked && '🔒'}
                          </Badge>
                          <h3 className="text-xl md:text-2xl font-serif text-neutral-800 font-semibold">
                            {currentChapter.title}
                          </h3>
                          <p className="text-neutral-500 text-xs md:text-sm font-light mt-1.5 leading-relaxed">
                            {currentChapter.subtitle}
                          </p>
                        </div>
                        {isChapterLocked && (
                          <Badge className="bg-orange-500 text-white font-bold text-xs h-7 self-start rounded-full shadow-sm py-1.5 px-3">
                            PREMIUM
                          </Badge>
                        )}
                      </div>

                      {isChapterLocked ? (
                        /* Gated Chapter View */
                        <div className="py-12 px-6 text-center max-w-sm mx-auto flex flex-col items-center">
                          <div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center mb-4 border border-orange-100">
                            <Lock className="w-6 h-6 text-orange-500" />
                          </div>
                          <h4 className="text-lg font-bold text-neutral-800 mb-1">
                            {currentChapter.title.split('. ')[1] || currentChapter.title} Is Locked
                          </h4>
                          <p className="text-xs text-neutral-500 font-light mb-6 leading-relaxed">
                            Chapters 5 through 13 of the Study Guide contain specialized vocabulary details for Academic life, Transportation guides, Canteen dining, Dorm checks, Internet connections, and Emergency assistance.
                          </p>
                          <Button
                            onClick={() => {
                              if (onNavigate) onNavigate('premium');
                            }}
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold h-11 rounded-xl shadow-md cursor-pointer transition-transform hover:scale-[1.01]"
                          >
                            <Sparkles className="w-4 h-4 mr-2" />
                            Unlock All chapters for $2/month
                          </Button>
                        </div>
                      ) : (
                        /* Unlocked Table of Items view */
                        <div className="divide-y divide-neutral-100">
                          {currentChapter.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between py-3.5 hover:bg-neutral-50/40 px-2 rounded-lg transition-colors group/item"
                            >
                              <div className="flex-1 pr-2">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-lg font-semibold text-neutral-850">{item.ru}</span>
                                  <span className="text-neutral-400 text-xs font-light bg-neutral-100/70 px-1.5 py-0.5 rounded">[{item.pr}]</span>
                                </div>
                                <p className="text-sm text-neutral-500 font-light mt-0.5">{item.en}</p>
                              </div>
                              <div className="flex items-center gap-1 shrink-0 bg-neutral-50/50 p-1 rounded-lg">
                                <AudioButton text={item.ru} size="sm" />
                                <AudioButton text={item.ru} slow={true} size="sm" />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab Content 2: Standard Visual Categories */}
          {activeTab === 'native' && (
            <div className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {allVocabulary.map((cat) => {
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
                              className="w-full h-9 bg-orange-500 hover:bg-orange-600 text-xs font-bold rounded-xl border-none"
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
          )}
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
                              <XCircle className="w-5 h-5 text-rose-550 shrink-0" />
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
