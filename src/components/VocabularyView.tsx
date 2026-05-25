import React from 'react';
import { VOCABULARY, PHRASES } from '@/constants';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Volume2, Lock, Sparkles } from 'lucide-react';
import { speakNative } from '@/lib/gemini';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuth } from '@/App';

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

  const handleSpeak = async (text: string) => {
    if (!isPremium) {
      toast.info("🔊 Pronunciation audio is a Premium feature.", {
        description: "Upgrade to the Scholar plan to unlock full TTS audio pronunciation helper.",
      });
      return;
    }
    try {
      await speakNative(text);
    } catch (error) {
      console.warn('Native TTS failure', error);
    }
  };

  const allVocabulary = [...VOCABULARY, ...PREMIUM_VOCABULARY];

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
            {!isPremium && (
              <Badge className="bg-orange-500 hover:bg-orange-600 border-none text-white flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs self-start sm:self-center font-bold">
                <Sparkles className="w-3.5 h-3.5" /> FREE PREVIEW
              </Badge>
            )}
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
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="opacity-0 group-hover/item:opacity-100 transition-opacity"
                              onClick={() => handleSpeak(item.ru)}
                              disabled={isLockedCategory}
                            >
                              <Volume2 className="w-4 h-4 text-orange-500" />
                            </Button>
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
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="rounded-full hover:bg-orange-50 shrink-0"
                        onClick={() => handleSpeak(phrase.ru)}
                        disabled={isPhraseLocked}
                      >
                        <Volume2 className="w-4 h-4 text-orange-500" />
                      </Button>
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
    </div>
  );
}
