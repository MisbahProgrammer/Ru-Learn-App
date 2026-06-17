import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/App';
import { AudioButton } from '@/components/AudioButton';
import { toast } from 'sonner';
import { 
  BookText, 
  ArrowRightLeft, 
  CircleUser, 
  Activity, 
  Sparkles,
  Info,
  Lightbulb,
  CheckCircle2,
  Video,
  MapPin,
  Compass,
  CheckCircle,
  HelpCircle,
  AlertCircle
} from 'lucide-react';

interface GlossWord {
  ru: string;
  en: string;
  highlight?: boolean;
}

export function WordGloss({ words, audioText }: { words: GlossWord[]; audioText?: string }) {
  return (
    <div className="flex flex-col gap-2 p-3.5 bg-neutral-50/50 hover:bg-neutral-50/90 rounded-2xl border border-neutral-100 transition-all duration-200">
      <div className="flex flex-wrap items-end gap-x-4 gap-y-2.5">
        {words.map((w, index) => (
          <div key={index} className="flex flex-col items-center min-w-[36px] py-1">
            <span className={`text-base font-bold tracking-tight ${w.highlight ? 'text-orange-600 font-extrabold underline decoration-wavy decoration-orange-300' : 'text-neutral-900'}`}>
              {w.ru}
            </span>
            <span className={`text-[10px] select-none font-mono tracking-tight mt-1 max-w-[100px] text-center leading-tight ${w.highlight ? 'text-orange-500 font-bold' : 'text-neutral-400'}`}>
              {w.en}
            </span>
          </div>
        ))}
      </div>
      {audioText && (
        <div className="flex items-center gap-1.5 mt-1 self-end">
          <AudioButton text={audioText} size="sm" label="Pronounce" />
        </div>
      )}
    </div>
  );
}

const PRONOUNS = [
  { ru: 'Я', en: 'I', phonetic: 'Ya' },
  { ru: 'Ты', en: 'You (informal)', phonetic: 'Ty' },
  { ru: 'Он / Она / Оно', en: 'He / She / It', phonetic: 'On / Ona / Ono' },
  { ru: 'Мы', en: 'We', phonetic: 'My' },
  { ru: 'Вы', en: 'You (formal/plural)', phonetic: 'Vy' },
  { ru: 'Они', en: 'They', phonetic: 'Oni' },
];

const COMMON_SENTENCES = [
  { ru: 'Я тебя люблю', en: 'I love you', structure: 'Subject + Object + Verb' },
  { ru: 'Как дела?', en: 'How are things? (How are you?)', structure: 'Question word + Noun' },
  { ru: 'Меня зовут...', en: 'My name is...', structure: 'Reflexive construction' },
  { ru: 'Я хочу пить', en: 'I want to drink', structure: 'Verb + Infinitive' },
  { ru: 'Где metro?', en: 'Where is the metro?', structure: 'Where + Subject' },
];

export function GrammarView() {
  const { profile, updateLessonProgress } = useAuth();
  const lessonsCompleted = profile?.lessons_completed || {};

  return (
    <div className="w-full h-full bg-neutral-50/30 overflow-y-auto overflow-x-hidden">
      <div className="w-full p-4 md:p-8 lg:p-12 pb-32">
        <div className="w-full max-w-5xl mx-auto space-y-10 md:space-y-14">
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-light tracking-tight text-neutral-900">
              Grammar <span className="font-serif italic font-medium text-orange-600">Essentials</span>
            </h2>
            <p className="text-neutral-500 font-light max-w-2xl leading-relaxed text-base md:text-lg">
              Russian grammar is like a puzzle. Once you understand the pieces (cases, genders, and aspects), you can build anything.
            </p>
          </div>

          {/* Universal Grammar Module learning path */}
          <div className="bg-white border border-neutral-200 p-6 rounded-3xl shadow-xs space-y-4 max-w-5xl">
            <div>
              <h3 className="text-sm font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-2">
                🎯 Grammar Learning Path
              </h3>
              <p className="text-neutral-500 text-xs font-light">Complete all 6 essentials to fully master basic sentence construction logic.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { id: 'grammar_sentence_logic', title: '1. Sentence Logic' },
                { id: 'grammar_pronouns', title: '2. Personal Pronouns' },
                { id: 'grammar_six_cases', title: '3. Noun Cases' },
                { id: 'grammar_verbs_aspects', title: '4. Verbs & Adverbs' },
                { id: 'grammar_adjectives_lesson22', title: '5. Adjectives (L22)' },
                { id: 'grammar_lesson30', title: '6. Past Tense (L30)' },
              ].map((lesson) => {
                const isCompleted = !!lessonsCompleted[lesson.id];
                return (
                  <button
                    key={lesson.id}
                    onClick={() => {
                      updateLessonProgress(lesson.id);
                      if (!isCompleted) {
                        toast.success(`🎉 Completed: ${lesson.title}! +10 XP earned!`);
                      }
                    }}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left text-xs cursor-pointer ${
                      isCompleted 
                        ? 'bg-orange-50/50 border-orange-200 text-orange-950 font-bold' 
                        : 'bg-white hover:bg-neutral-50 border-neutral-200 text-neutral-600'
                    }`}
                  >
                    <span>{lesson.title}</span>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 ml-2 ${
                      isCompleted ? 'bg-orange-500 text-white font-bold' : 'border border-neutral-300 text-neutral-300'
                    }`}>
                      {isCompleted ? '✓' : ''}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <Tabs defaultValue="lesson30" className="flex flex-col w-full space-y-8 md:space-y-12">
            <div className="w-full">
              <TabsList className="bg-white border p-1 rounded-2xl h-auto flex flex-wrap md:flex-nowrap w-full md:w-auto shadow-sm">
                <TabsTrigger value="lesson30" className="flex-1 md:flex-none rounded-xl px-4 md:px-8 py-3.5 data-[state=active]:bg-orange-600 data-[state=active]:text-white transition-all text-sm font-semibold border-2 border-orange-500/10 data-[state=active]:border-transparent bg-amber-50/30">
                  <Sparkles className="w-4 h-4 mr-2" /> Lesson 30 Progress
                </TabsTrigger>
                <TabsTrigger value="basics" className="flex-1 md:flex-none rounded-xl px-4 md:px-8 py-3.5 data-[state=active]:bg-orange-600 data-[state=active]:text-white transition-all text-sm font-semibold">
                  <Sparkles className="w-4 h-4 mr-2" /> Sentence Logic
                </TabsTrigger>
                <TabsTrigger value="pronouns" className="flex-1 md:flex-none rounded-xl px-4 md:px-8 py-3.5 data-[state=active]:bg-orange-600 data-[state=active]:text-white transition-all text-sm font-semibold">
                  <CircleUser className="w-4 h-4 mr-2" /> Pronouns
                </TabsTrigger>
                <TabsTrigger value="cases" className="flex-1 md:flex-none rounded-xl px-4 md:px-8 py-3.5 data-[state=active]:bg-orange-600 data-[state=active]:text-white transition-all text-sm font-semibold">
                  <ArrowRightLeft className="w-4 h-4 mr-2" /> The 6 Cases
                </TabsTrigger>
                <TabsTrigger value="verbs" className="flex-1 md:flex-none rounded-xl px-4 md:px-8 py-3.5 data-[state=active]:bg-orange-600 data-[state=active]:text-white transition-all text-sm font-semibold">
                  <Activity className="w-4 h-4 mr-2" /> Verbs & Adverbs
                </TabsTrigger>
                <TabsTrigger value="lesson22" className="flex-1 md:flex-none rounded-xl px-4 md:px-8 py-3.5 data-[state=active]:bg-orange-600 data-[state=active]:text-white transition-all text-sm font-semibold">
                  <BookText className="w-4 h-4 mr-2" /> Lesson 22 Adjectives
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="lesson30" className="w-full space-y-8 slide-in-from-bottom-2 animate-in duration-300">
              {/* Premium Lesson Header/Banner */}
              <div className="bg-gradient-to-br from-orange-500 to-amber-600 text-white rounded-[2.5rem] p-8 md:p-12 mb-8 relative overflow-hidden shadow-lg shadow-orange-500/10">
                <div className="absolute right-0 top-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider">
                      🎓 Lesson 30 Mastery
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-none text-white">
                      LESSON 30 – GRAMMAR NOTES
                    </h2>
                    <p className="text-orange-50/90 text-sm md:text-base font-medium max-w-2xl leading-relaxed">
                      Focus topic: <span className="font-bold underline decoration-wavy decoration-orange-300">Past Tense of ХОДИТЬ and ЕЗДИТЬ</span>. Under each Russian sentence, we have placed word-for-word English alignment with spelling transitions to let you instantly visualize grammar shifts!
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-2 bg-white/10 p-4 rounded-3xl border border-white/10 max-w-xs shrink-0 self-start md:self-auto">
                    <div className="text-xs text-orange-200 uppercase font-mono tracking-widest text-center">Your Lesson Status</div>
                    <button 
                      onClick={() => {
                        updateLessonProgress('grammar_lesson30');
                        toast.success("🎉 Success! Lesson 30: Past Motility completed! +10 XP earned, progress updated! 🔥");
                      }}
                      className={`w-full font-bold text-xs py-2.5 px-5 rounded-2xl transition-all shadow-xs cursor-pointer ${
                        lessonsCompleted['grammar_lesson30']
                          ? 'bg-transparent border border-white text-white hover:bg-white/10 animate-pulse'
                          : 'bg-white text-orange-600 hover:bg-orange-50'
                      }`}
                    >
                      {lessonsCompleted['grammar_lesson30'] ? '✓ Completed' : 'Complete Lesson (+10 XP)'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Main Content Sections: Grid for Desktop optimization */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* 1. ХОДИТЬ in the Past Tense */}
                <Card className="rounded-[2rem] border-none shadow-sm overflow-hidden bg-white">
                  <CardHeader className="bg-orange-50/40 p-6 md:p-8 border-b border-orange-100">
                    <CardTitle className="text-xl flex items-center gap-3 text-orange-950 font-bold">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-700 text-sm font-bold font-mono">1</span>
                      ХОДИТЬ in the Past Tense
                    </CardTitle>
                    <p className="text-xs text-neutral-500">ходить / to go regularly (on foot)</p>
                  </CardHeader>
                  <CardContent className="p-6 md:p-8 space-y-6">
                    <div className="p-4 bg-orange-50/20 rounded-2xl border border-orange-100/40 grid grid-cols-3 gap-2 text-center text-xs">
                      <div>
                        <div className="font-mono text-neutral-400">он (he)</div>
                        <div className="font-bold text-base text-neutral-800">ходил</div>
                      </div>
                      <div>
                        <div className="font-mono text-neutral-400">она (she)</div>
                        <div className="font-bold text-base text-neutral-800">ходила</div>
                      </div>
                      <div>
                        <div className="font-mono text-neutral-400">они/мы (they)</div>
                        <div className="font-bold text-base text-neutral-800">ходили</div>
                      </div>
                    </div>
                    <div className="space-y-3.5">
                      <div className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Example Sentences</div>
                      <WordGloss 
                        words={[
                          { ru: 'Вчера', en: 'Yesterday' },
                          { ru: 'я', en: 'I' },
                          { ru: 'ходил', en: 'went (foot)', highlight: true },
                          { ru: 'в', en: 'to' },
                          { ru: 'университет.', en: 'university' }
                        ]} 
                        audioText="Вчера я ходил в университет."
                      />
                      <WordGloss 
                        words={[
                          { ru: 'Она', en: 'She' },
                          { ru: 'ходила', en: 'went (foot)', highlight: true },
                          { ru: 'в', en: 'to' },
                          { ru: 'магазин.', en: 'shop' }
                        ]} 
                        audioText="Она ходила в магазин."
                      />
                      <WordGloss 
                        words={[
                          { ru: 'Мы', en: 'We' },
                          { ru: 'ходили', en: 'went (foot)', highlight: true },
                          { ru: 'в', en: 'to' },
                          { ru: 'театр.', en: 'theatre' }
                        ]} 
                        audioText="Мы ходили в театр."
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* 2. ЕЗДИТЬ in the Past Tense */}
                <Card className="rounded-[2rem] border-none shadow-sm overflow-hidden bg-white">
                  <CardHeader className="bg-orange-50/40 p-6 md:p-8 border-b border-orange-100">
                    <CardTitle className="text-xl flex items-center gap-3 text-orange-950 font-bold">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-700 text-sm font-bold font-mono">2</span>
                      ЕЗДИТЬ in the Past Tense
                    </CardTitle>
                    <p className="text-xs text-neutral-500 font-light">ездить / to go regularly (by transport)</p>
                  </CardHeader>
                  <CardContent className="p-6 md:p-8 space-y-6">
                    <div className="p-4 bg-orange-50/20 rounded-2xl border border-orange-100/40 grid grid-cols-3 gap-2 text-center text-xs">
                      <div>
                        <div className="font-mono text-neutral-400">он (he)</div>
                        <div className="font-bold text-base text-neutral-800">ездил</div>
                      </div>
                      <div>
                        <div className="font-mono text-neutral-400">она (she)</div>
                        <div className="font-bold text-base text-neutral-800">ездила</div>
                      </div>
                      <div>
                        <div className="font-mono text-neutral-400">они/мы (they)</div>
                        <div className="font-bold text-base text-neutral-800">ездили</div>
                      </div>
                    </div>
                    <div className="space-y-3.5">
                      <div className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Example Sentences</div>
                      <WordGloss 
                        words={[
                          { ru: 'Я', en: 'I' },
                          { ru: 'ездил', en: 'went (veh)', highlight: true },
                          { ru: 'в', en: 'to' },
                          { ru: 'Москву.', en: 'Moscow' }
                        ]} 
                        audioText="Я ездил в Москву."
                      />
                      <WordGloss 
                        words={[
                          { ru: 'Она', en: 'She' },
                          { ru: 'ездила', en: 'went (veh)', highlight: true },
                          { ru: 'на', en: 'to' },
                          { ru: 'море.', en: 'sea' }
                        ]} 
                        audioText="Она ездила на море."
                      />
                      <WordGloss 
                        words={[
                          { ru: 'Мы', en: 'We' },
                          { ru: 'ездили', en: 'went (veh)', highlight: true },
                          { ru: 'в', en: 'to' },
                          { ru: 'аэропорт.', en: 'airport' }
                        ]} 
                        audioText="Мы ездили в аэропорт."
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* 3. ГДЕ? vs КУДА? */}
                <Card className="rounded-[2rem] border-none shadow-sm overflow-hidden bg-white">
                  <CardHeader className="bg-amber-50/40 p-6 md:p-8 border-b border-amber-100">
                    <CardTitle className="text-xl flex items-center gap-3 text-neutral-900 font-bold">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-800 text-sm font-bold font-mono">3</span>
                      ГДЕ? (Where?) vs КУДА? (Where to?)
                    </CardTitle>
                    <p className="text-xs text-neutral-500 font-light">The fundamental difference between Static Locations and Destination Targets</p>
                  </CardHeader>
                  <CardContent className="p-6 md:p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2.5 p-4 rounded-2xl bg-teal-50/30 border border-teal-100/40">
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-teal-100 text-teal-800 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                          ГДЕ? ➔ Location
                        </div>
                        <p className="text-[11px] text-neutral-500 leading-snug">Requires any form of <strong>БЫТЬ</strong> (was/were) and the <strong>Prepositional Case</strong>.</p>
                        <WordGloss 
                          words={[
                            { ru: 'Я', en: 'I' },
                            { ru: 'был', en: 'was', highlight: true },
                            { ru: 'в', en: 'at/in' },
                            { ru: 'университете.', en: 'university (Loc)' }
                          ]} 
                          audioText="Я был в университете."
                        />
                      </div>
                      <div className="space-y-2.5 p-4 rounded-2xl bg-orange-50/30 border border-orange-100/40">
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-orange-100 text-orange-850 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                          КУДА? ➔ Direction
                        </div>
                        <p className="text-[11px] text-neutral-500 leading-snug">Requires verbs of motion (e.g. <strong>ХОДИТЬ</strong>) and the <strong>Accusative Case</strong>.</p>
                        <WordGloss 
                          words={[
                            { ru: 'Я', en: 'I' },
                            { ru: 'ходил', en: 'went', highlight: true },
                            { ru: 'в', en: 'to' },
                            { ru: 'университет.', en: 'university (Acc)' }
                          ]} 
                          audioText="Я ходил в университет."
                        />
                      </div>
                    </div>
                    <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200/50 flex gap-3.5 items-start">
                      <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-xs text-amber-900 uppercase tracking-widest">Easy Rule</div>
                        <p className="text-xs text-amber-850 leading-relaxed mt-0.5">
                          If you ask <strong>Где?</strong>, use forms of <strong>был/была/были</strong>. If you ask <strong>Куда?</strong>, use motion forms of <strong>ходил/ходила/ходили</strong>!
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 4. БЫЛ vs ХОДИЛ */}
                <Card className="rounded-[2rem] border-none shadow-sm overflow-hidden bg-white">
                  <CardHeader className="bg-orange-50/40 p-6 md:p-8 border-b border-orange-100">
                    <CardTitle className="text-xl flex items-center gap-3 text-orange-950 font-bold">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-700 text-sm font-bold font-mono">4</span>
                      БЫЛ vs ХОДИЛ (On Foot Comparison)
                    </CardTitle>
                    <p className="text-xs text-neutral-500">Comparing active motion against passive status (on foot, local scope)</p>
                  </CardHeader>
                  <CardContent className="p-6 md:p-8 space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-center text-xs font-bold font-mono text-neutral-500 bg-neutral-50 py-2 rounded-xl">
                      <div>БЫЛ (Location - Где?)</div>
                      <div>ХОДИЛ (Motion - Куда?)</div>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-3 border-b border-neutral-100/50">
                        <WordGloss 
                          words={[
                            { ru: 'Максим', en: 'Maxim' },
                            { ru: 'был', en: 'was', highlight: true },
                            { ru: 'в', en: 'at' },
                            { ru: 'университете.', en: 'university (Loc)' }
                          ]} 
                          audioText="Максим был в университете."
                        />
                        <WordGloss 
                          words={[
                            { ru: 'Максим', en: 'Maxim' },
                            { ru: 'ходил', en: 'went', highlight: true },
                            { ru: 'в', en: 'to' },
                            { ru: 'университет.', en: 'university (Acc)' }
                          ]} 
                          audioText="Максим ходил в университет."
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <WordGloss 
                          words={[
                            { ru: 'Таня', en: 'Tanya' },
                            { ru: 'была', en: 'was', highlight: true },
                            { ru: 'в', en: 'in' },
                            { ru: 'библиотеке.', en: 'library (Loc)' }
                          ]} 
                          audioText="Таня была в библиотеке."
                        />
                        <WordGloss 
                          words={[
                            { ru: 'Таня', en: 'Tanya' },
                            { ru: 'ходила', en: 'went', highlight: true },
                            { ru: 'в', en: 'to' },
                            { ru: 'библиотеку.', en: 'library (Acc)' }
                          ]} 
                          audioText="Таня ходила в библиотеку."
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 5. БЫЛ vs ЕЗДИЛ */}
                <Card className="rounded-[2rem] border-none shadow-sm overflow-hidden bg-white">
                  <CardHeader className="bg-orange-50/40 p-6 md:p-8 border-b border-orange-100">
                    <CardTitle className="text-xl flex items-center gap-3 text-orange-950 font-bold">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-700 text-sm font-bold font-mono">5</span>
                      БЫЛ vs ЕЗДИЛ (Transport Comparison)
                    </CardTitle>
                    <p className="text-xs text-neutral-500">Comparing passive status against distance vehicle transit</p>
                  </CardHeader>
                  <CardContent className="p-6 md:p-8 space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-center text-xs font-bold font-mono text-neutral-500 bg-neutral-50 py-2 rounded-xl">
                      <div>БЫЛ (Location - Где?)</div>
                      <div>ЕЗДИЛ (Motion - Куда?)</div>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-3 border-b border-neutral-100/50">
                        <WordGloss 
                          words={[
                            { ru: 'Джон', en: 'John' },
                            { ru: 'был', en: 'was', highlight: true },
                            { ru: 'в', en: 'at' },
                            { ru: 'банке.', en: 'bank (Loc)' }
                          ]} 
                          audioText="Джон был в банке."
                        />
                        <WordGloss 
                          words={[
                            { ru: 'Джон', en: 'John' },
                            { ru: 'ездил', en: 'went (veh)', highlight: true },
                            { ru: 'в', en: 'to' },
                            { ru: 'банк.', en: 'bank (Acc)' }
                          ]} 
                          audioText="Джон ездил в банк."
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <WordGloss 
                          words={[
                            { ru: 'Джулия', en: 'Julia' },
                            { ru: 'была', en: 'was', highlight: true },
                            { ru: 'на', en: 'at' },
                            { ru: 'конференции.', en: 'conference (Loc)' }
                          ]} 
                          audioText="Джулия была на конференции."
                        />
                        <WordGloss 
                          words={[
                            { ru: 'Джулия', en: 'Julia' },
                            { ru: 'ездила', en: 'went (veh)', highlight: true },
                            { ru: 'на', en: 'to' },
                            { ru: 'конференцию.', en: 'conference (Acc)' }
                          ]} 
                          audioText="Джулия ездила на конференцию."
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 6. Past Forms Summary Table */}
                <Card className="rounded-[2rem] border-none shadow-sm overflow-hidden bg-white">
                  <CardHeader className="bg-amber-50/40 p-6 md:p-8 border-b border-amber-100">
                    <CardTitle className="text-xl flex items-center gap-3 text-neutral-900 font-bold">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-800 text-sm font-bold font-mono">6</span>
                      Past Forms Conjugations Summary
                    </CardTitle>
                    <p className="text-xs text-neutral-500">Gender based suffix shifts for past motion & action</p>
                  </CardHeader>
                  <CardContent className="p-6 md:p-8">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs md:text-sm">
                        <thead>
                          <tr className="border-b border-neutral-100 font-mono text-neutral-400">
                            <th className="pb-3 pr-2">Subject / Gender</th>
                            <th className="pb-3 px-2">ХОДИТЬ (on foot)</th>
                            <th className="pb-3 px-2">ЕЗДИТЬ (transport)</th>
                            <th className="pb-3 pl-2">БЫТЬ (status)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                          <tr className="hover:bg-neutral-50/50">
                            <td className="py-3 font-semibold text-neutral-800">Мужской род (Masculine)<br/><span className="text-[10px] text-neutral-400 font-mono">он (he)</span></td>
                            <td className="py-3 px-2 font-mono text-orange-600 font-extrabold">ходил</td>
                            <td className="py-3 px-2 font-mono text-orange-600 font-extrabold">ездил</td>
                            <td className="py-3 pl-2 font-mono text-teal-600 font-extrabold">был</td>
                          </tr>
                          <tr className="hover:bg-neutral-50/50">
                            <td className="py-3 font-semibold text-neutral-800">Женский род (Feminine)<br/><span className="text-[10px] text-neutral-400 font-mono">она (she)</span></td>
                            <td className="py-3 px-2 font-mono text-orange-600 font-extrabold">ходила</td>
                            <td className="py-3 px-2 font-mono text-orange-600 font-extrabold">ездила</td>
                            <td className="py-3 pl-2 font-mono text-teal-600 font-extrabold">была</td>
                          </tr>
                          <tr className="hover:bg-neutral-50/50">
                            <td className="py-3 font-semibold text-neutral-800">Множ. число (Plural)<br/><span className="text-[10px] text-neutral-400 font-mono">они/мы/вы (they)</span></td>
                            <td className="py-3 px-2 font-mono text-orange-600 font-extrabold">ходили</td>
                            <td className="py-3 px-2 font-mono text-orange-600 font-extrabold">ездили</td>
                            <td className="py-3 pl-2 font-mono text-teal-600 font-extrabold">были</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                {/* 7. Common Place Patterns */}
                <Card className="rounded-[2rem] border-none shadow-sm overflow-hidden bg-white">
                  <CardHeader className="bg-orange-50/40 p-6 md:p-8 border-b border-orange-100">
                    <CardTitle className="text-xl flex items-center gap-3 text-orange-950 font-bold">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-700 text-sm font-bold font-mono">7</span>
                      Common Place Patterns (On Foot)
                    </CardTitle>
                    <p className="text-xs text-neutral-500">Combining target events and local walking destinations</p>
                  </CardHeader>
                  <CardContent className="p-6 md:p-8 space-y-3.5">
                    <WordGloss 
                      words={[
                        { ru: 'Я', en: 'I' },
                        { ru: 'ходил', en: 'went', highlight: true },
                        { ru: 'в', en: 'to' },
                        { ru: 'гости.', en: 'visit' }
                      ]} 
                      audioText="Я ходил в гости."
                    />
                    <WordGloss 
                      words={[
                        { ru: 'Мы', en: 'We' },
                        { ru: 'ходили', en: 'went', highlight: true },
                        { ru: 'в', en: 'to' },
                        { ru: 'клуб', en: 'club' },
                        { ru: 'на', en: 'for' },
                        { ru: 'дискотеку.', en: 'disco' }
                      ]} 
                      audioText="Мы ходили в клуб на дискотеку."
                    />
                    <WordGloss 
                      words={[
                        { ru: 'Она', en: 'She' },
                        { ru: 'ходила', en: 'went', highlight: true },
                        { ru: 'в', en: 'to' },
                        { ru: 'ресторан', en: 'restaurant' },
                        { ru: 'на', en: 'for' },
                        { ru: 'свадьбу.', en: 'wedding' }
                      ]} 
                      audioText="Она ходила в ресторан на свадьбу."
                    />
                    <WordGloss 
                      words={[
                        { ru: 'Они', en: 'They' },
                        { ru: 'ходили', en: 'went', highlight: true },
                        { ru: 'в', en: 'to' },
                        { ru: 'театр', en: 'theatre' },
                        { ru: 'на', en: 'for' },
                        { ru: 'балет.', en: 'ballet' }
                      ]} 
                      audioText="Они ходили в театр на балет."
                    />
                  </CardContent>
                </Card>

                {/* 8. Using ЕЗДИЛ */}
                <Card className="rounded-[2rem] border-none shadow-sm overflow-hidden bg-white">
                  <CardHeader className="bg-orange-50/40 p-6 md:p-8 border-b border-orange-100">
                    <CardTitle className="text-xl flex items-center gap-3 text-orange-950 font-bold">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-700 text-sm font-bold font-mono">8</span>
                      Using ЕЗДИЛ (Long Distance Transit)
                    </CardTitle>
                    <p className="text-xs text-neutral-500">Form constructions featuring vehicular travels or transitions</p>
                  </CardHeader>
                  <CardContent className="p-6 md:p-8 space-y-3.5">
                    <WordGloss 
                      words={[
                        { ru: 'Летом', en: 'Summer' },
                        { ru: 'она', en: 'she' },
                        { ru: 'ездила', en: 'went (veh)', highlight: true },
                        { ru: 'на', en: 'to' },
                        { ru: 'море.', en: 'sea' }
                      ]} 
                      audioText="Летом она ездила на море."
                    />
                    <WordGloss 
                      words={[
                        { ru: 'Они', en: 'They' },
                        { ru: 'ездили', en: 'went (veh)', highlight: true },
                        { ru: 'в', en: 'to' },
                        { ru: 'Москву.', en: 'Moscow' }
                      ]} 
                      audioText="Они ездили в Москву."
                    />
                    <WordGloss 
                      words={[
                        { ru: 'Мы', en: 'We' },
                        { ru: 'ездили', en: 'went (veh)', highlight: true },
                        { ru: 'в', en: 'to' },
                        { ru: 'аэропорт.', en: 'airport' }
                      ]} 
                      audioText="Мы ездили в аэропорт."
                    />
                    <WordGloss 
                      words={[
                        { ru: 'Он', en: 'He' },
                        { ru: 'ездил', en: 'went (veh)', highlight: true },
                        { ru: 'на', en: 'to' },
                        { ru: 'стадион', en: 'stadium' },
                        { ru: 'на', en: 'for' },
                        { ru: 'футбольный', en: 'football' },
                        { ru: 'матч.', en: 'match' }
                      ]} 
                      audioText="Он ездил на стадион на футбольный матч."
                    />
                    <WordGloss 
                      words={[
                        { ru: 'Она', en: 'She' },
                        { ru: 'ездила', en: 'went (veh)', highlight: true },
                        { ru: 'в', en: 'to' },
                        { ru: 'командировку.', en: 'business-trip' }
                      ]} 
                      audioText="Она ездила в командировку."
                    />
                  </CardContent>
                </Card>

                {/* 9. В ГОСТЯХ vs В ГОСТИ */}
                <Card className="rounded-[2rem] border-none shadow-sm overflow-hidden bg-white">
                  <CardHeader className="bg-amber-50/40 p-6 md:p-8 border-b border-amber-100">
                    <CardTitle className="text-xl flex items-center gap-3 text-neutral-900 font-bold">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-800 text-sm font-bold font-mono">9</span>
                      В ГОСТЯХ vs В ГОСТИ
                    </CardTitle>
                    <p className="text-xs text-neutral-500 font-light">Crucial difference between being a guest and going to visit</p>
                  </CardHeader>
                  <CardContent className="p-6 md:p-8 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2.5 p-4 rounded-2xl bg-teal-50/20 border border-teal-100/40">
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-teal-100 text-teal-800 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                          В ГОСТЯХ ➔ Location (Где?)
                        </div>
                        <p className="text-xs text-neutral-500">To be currently visiting or hanging out at friends' home.</p>
                        <WordGloss 
                          words={[
                            { ru: 'Я', en: 'I' },
                            { ru: 'был', en: 'was' },
                            { ru: 'в', en: 'at' },
                            { ru: 'гостях.', en: "guests' (Loc)", highlight: true }
                          ]} 
                          audioText="Я был в гостях."
                        />
                      </div>
                      <div className="space-y-2.5 p-4 rounded-2xl bg-orange-50/20 border border-orange-100/40">
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-orange-100 text-orange-850 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                          В ГОСТИ ➔ Destination (Куда?)
                        </div>
                        <p className="text-xs text-neutral-500">To head over towards friends' place as a destination.</p>
                        <WordGloss 
                          words={[
                            { ru: 'Вечером', en: 'In-evening' },
                            { ru: 'я', en: 'I' },
                            { ru: 'иду', en: 'go' },
                            { ru: 'в', en: 'to' },
                            { ru: 'гости.', en: 'guests (Acc)', highlight: true }
                          ]} 
                          audioText="Вечером я иду в гости."
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 10. Most Common Mistakes */}
                <Card className="rounded-[1.8rem] border-2 border-red-500/10 shadow-sm overflow-hidden bg-red-50/10">
                  <CardHeader className="bg-red-50/40 p-6 md:p-8 border-b border-red-100 flex items-start gap-4">
                    <div className="bg-red-100 p-2 rounded-xl text-red-600 mt-0.5 shrink-0 animate-pulse">
                      <AlertCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl flex items-center gap-3 text-red-950 font-black">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-800 text-sm font-bold font-mono">10</span>
                        Most Common Mistakes
                      </CardTitle>
                      <p className="text-xs text-red-900/75 mt-0.5 font-medium">Verify you do not blend location nouns with active motility vectors!</p>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 md:p-8 space-y-6">
                    <div className="space-y-4">
                      {/* Mistake 1 */}
                      <div className="space-y-2 p-4 bg-white rounded-2xl border border-red-100 shadow-2xs">
                        <div className="flex items-center gap-2 text-xs font-bold text-red-600">
                          <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 flex items-center justify-center">✗</span>
                          Incorrect blending (Mixing Locative)
                        </div>
                        <div className="font-mono text-xs text-neutral-400">❌ Я был в университет. / ❌ Я ходил в университете.</div>
                        <div className="flex items-center gap-2 text-xs font-bold text-green-600 pt-1">
                          <span className="w-5 h-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center">✓</span>
                          Corrected:
                        </div>
                        <WordGloss 
                          words={[
                            { ru: 'Я', en: 'I' },
                            { ru: 'был', en: 'was' },
                            { ru: 'в', en: 'at' },
                            { ru: 'университете.', en: 'university (Loc)', highlight: true }
                          ]} 
                          audioText="Я был в университете."
                        />
                        <WordGloss 
                          words={[
                            { ru: 'Я', en: 'I' },
                            { ru: 'ходил', en: 'went' },
                            { ru: 'в', en: 'to' },
                            { ru: 'университет.', en: 'university (Acc)', highlight: true }
                          ]} 
                          audioText="Я ходил в университет."
                        />
                      </div>

                      {/* Mistake 2 */}
                      <div className="space-y-2 p-4 bg-white rounded-2xl border border-red-100 shadow-2xs">
                        <div className="flex items-center gap-2 text-xs font-bold text-red-600">
                          <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 flex items-center justify-center">✗</span>
                          Incorrect tracking (Mixing Accusative)
                        </div>
                        <div className="font-mono text-xs text-neutral-400">❌ Она была на конференцию. / ❌ Она ездила на конференции.</div>
                        <div className="flex items-center gap-2 text-xs font-bold text-green-600 pt-1">
                          <span className="w-5 h-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center">✓</span>
                          Corrected:
                        </div>
                        <WordGloss 
                          words={[
                            { ru: 'Она', en: 'She' },
                            { ru: 'была', en: 'was' },
                            { ru: 'на', en: 'at' },
                            { ru: 'конференции.', en: 'conference (Loc)', highlight: true }
                          ]} 
                          audioText="Она была на конференции."
                        />
                        <WordGloss 
                          words={[
                            { ru: 'Она', en: 'She' },
                            { ru: 'ездила', en: 'went (veh)' },
                            { ru: 'на', en: 'to' },
                            { ru: 'конференцию.', en: 'conference (Acc)', highlight: true }
                          ]} 
                          audioText="Она ездила на конференцию."
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

              </div>
            </TabsContent>

            <TabsContent value="basics" className="w-full space-y-8 slide-in-from-bottom-2 animate-in duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Card className="rounded-[2rem] border-none shadow-sm overflow-hidden bg-white">
                    <CardHeader className="bg-orange-50/50 p-6 md:p-8 border-b border-orange-100">
                      <CardTitle className="text-xl flex items-center gap-3 text-orange-900">
                        <div className="bg-orange-100 p-2 rounded-xl">
                          <Lightbulb className="w-6 h-6 text-orange-600" />
                        </div>
                        Building Sentences
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 md:p-8 space-y-6">
                      <p className="text-neutral-600 leading-relaxed">
                        Unlike English, Russian word order is very flexible because <strong>Cases</strong> tell you who is doing what to whom. Even if you swap words, the meaning remains clear.
                      </p>
                      <div className="space-y-4">
                        <div className="bg-neutral-50 p-6 rounded-3xl border border-neutral-100">
                          <div className="text-[10px] font-bold text-orange-600 uppercase mb-2 tracking-widest">Natural Word Order</div>
                          <div className="flex items-center flex-wrap gap-2 mb-1">
                            <span className="text-2xl font-bold tracking-tight">Я читаю книгу</span>
                            <div className="flex items-center gap-1">
                              <AudioButton text="Я читаю книгу" size="md" label="Normal" />
                              <AudioButton text="Я читаю книгу" slow={true} size="sm" label="Slow" />
                            </div>
                          </div>
                          <div className="text-sm text-neutral-500">I (Subject) + read (Verb) + book (Object)</div>
                        </div>
                        <div className="flex flex-col gap-2 p-4 bg-blue-50/50 rounded-2xl border border-blue-100 text-sm text-blue-800">
                          <div className="flex gap-3 items-start">
                            <Info className="w-5 h-5 shrink-0 mt-0.5" />
                            <div>
                              You can say <span className="font-semibold italic">'Книгу я читаю'</span> <AudioButton text="Книгу я читаю" size="sm" /> for emphasis on the book, or <span className="font-semibold italic">'Читаю я книгу'</span> <AudioButton text="Читаю я книгу" size="sm" /> to sound more dramatic!
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="rounded-[2rem] border-none shadow-sm overflow-hidden bg-white">
                    <CardHeader className="bg-neutral-900 p-6 md:p-8">
                      <CardTitle className="text-xl flex items-center gap-3 text-white">
                        <div className="bg-neutral-800 p-2 rounded-xl">
                           <CheckCircle2 className="w-6 h-6 text-orange-400" />
                        </div>
                        Common Patterns
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 md:p-8">
                      <div className="space-y-5">
                        {COMMON_SENTENCES.map((s, i) => (
                          <div key={i} className="group border-b border-neutral-100 pb-4 last:border-0 last:pb-0">
                            <div className="flex justify-between items-start gap-4 mb-1">
                              <div>
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                  <span className="font-bold text-lg text-neutral-900">{s.ru}</span>
                                  <div className="flex items-center gap-1">
                                    <AudioButton text={s.ru} size="md" label="Normal" />
                                    <AudioButton text={s.ru} slow={true} size="sm" label="Slow" />
                                  </div>
                                </div>
                                <div className="text-sm text-neutral-500 font-medium">{s.en}</div>
                              </div>
                              <Badge variant="outline" className="text-[10px] bg-neutral-50 border-neutral-200 mt-1 shrink-0">{s.structure}</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="pronouns" className="slide-in-from-bottom-2 animate-in duration-300">
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {PRONOUNS.map((p, i) => (
                    <Card key={i} className="rounded-[2rem] border-none shadow-sm text-center p-6 md:p-10 bg-white group hover:shadow-xl hover:shadow-orange-100 transition-all duration-300">
                      <div className="text-4xl md:text-6xl font-bold text-orange-600 mb-3 group-hover:scale-110 transition-transform">{p.ru}</div>
                      <div className="text-lg font-medium text-neutral-800">{p.en}</div>
                      <div className="inline-flex items-center gap-1.5 mt-4 px-4 py-1.5 bg-neutral-50 rounded-full text-xs text-neutral-400 font-mono tracking-wider italic">
                        <span>Pronounced: {p.phonetic}</span>
                        <AudioButton text={p.ru.replace(/\//g, ' ')} size="sm" />
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="cases" className="space-y-8 slide-in-from-bottom-2 animate-in duration-300">
                <Card className="rounded-[2rem] border-none shadow-sm overflow-hidden bg-white">
                  <CardHeader className="bg-neutral-900 text-white p-6 md:p-8">
                    <CardTitle className="flex items-center gap-3 text-xl">
                       <div className="bg-neutral-800 p-2 rounded-xl">
                        <BookText className="w-6 h-6 text-orange-400" />
                       </div>
                       The 6 Russian Cases
                    </CardTitle>
                    <p className="text-neutral-400 text-sm mt-2 font-light">Cases change the endings of nouns to show their function in a sentence.</p>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-neutral-50">
                      {[
                        { title: 'Nominative', use: 'Subject (The "Do-er")', ex: 'Дом', phonetic: 'Dom' },
                        { title: 'Genitive', use: 'Possession / Absence ("Of", "No...")', ex: 'Дома', phonetic: 'Do-ma' },
                        { title: 'Dative', use: 'Indirect Object ("To / For")', ex: 'Дому', phonetic: 'Do-mu' },
                        { title: 'Accusative', use: 'Direct Object (Target of action)', ex: 'Дом', phonetic: 'Dom' },
                        { title: 'Instrumental', use: 'Means / With ("By means of")', ex: 'Домом', phonetic: 'Do-mom' },
                        { title: 'Prepositional', use: 'Location / About', ex: 'О доме', phonetic: 'O do-me' },
                      ].map((c, i) => (
                        <div key={i} className="p-5 md:p-6 hover:bg-neutral-50/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="space-y-1">
                            <span className="font-bold text-neutral-900 text-lg">{c.title}</span>
                            <p className="text-sm text-neutral-500">{c.use}</p>
                          </div>
                          <div className="flex items-center gap-4 bg-neutral-50 sm:bg-transparent p-3 sm:p-0 rounded-2xl">
                            <div className="text-right hidden sm:block">
                              <div className="text-xs text-neutral-400 font-mono italic">Example</div>
                            </div>
                            <div className="flex flex-col items-end">
                              <div className="flex items-center gap-1.5">
                                <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-none text-base px-4 py-1 rounded-xl">{c.ex}</Badge>
                                <AudioButton text={c.ex} size="sm" />
                              </div>
                              <span className="text-[10px] text-neutral-400 mt-1 font-mono">[{c.phonetic}]</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="verbs" className="grid grid-cols-1 lg:grid-cols-2 gap-8 slide-in-from-bottom-2 animate-in duration-300">
                <Card className="rounded-[2.5rem] border-none shadow-sm overflow-hidden bg-white">
                  <div className="p-8 md:p-10 bg-orange-600 text-white relative overflow-hidden">
                    <Activity className="absolute -right-4 -top-4 w-32 h-32 text-orange-500/20" />
                    <h3 className="text-2xl font-bold relative z-10">Verbs: The Engine</h3>
                    <p className="text-orange-100 text-sm mt-2 relative z-10 leading-relaxed">Russian verbs focus on <strong>Aspect</strong> - whether an action is completed or ongoing.</p>
                  </div>
                  <CardContent className="p-8 md:p-10 space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-3 p-6 bg-blue-50 rounded-[2rem] border border-blue-100/50">
                        <Badge className="bg-blue-200 text-blue-700 hover:bg-blue-200 border-none px-3 py-1">Imperfective</Badge>
                        <p className="text-sm text-neutral-600 leading-relaxed italic">For process, habit, or repeated actions without a specific result.</p>
                      </div>
                      <div className="space-y-3 p-6 bg-green-50 rounded-[2rem] border border-green-100/50">
                        <Badge className="bg-green-200 text-green-700 hover:bg-green-200 border-none px-3 py-1">Perfective</Badge>
                        <p className="text-sm text-neutral-600 leading-relaxed italic">For completed actions, one-time events, or actions with a result.</p>
                      </div>
                    </div>
                    <div className="p-6 bg-neutral-50 rounded-[2rem] border border-neutral-100 flex gap-4 items-start">
                      <Sparkles className="w-5 h-5 text-orange-500 shrink-0 mt-1" />
                      <p className="text-sm text-neutral-600 leading-relaxed italic">
                        Pro Tip: Most Russian verbs come in pairs. When you learn 'to read' (<span className="font-semibold text-neutral-900 border-b border-dotted border-neutral-300">читать</span> <AudioButton text="читать" size="sm" />), you also learn its completed version (<span className="font-semibold text-neutral-900 border-b border-dotted border-neutral-300">прочитать</span> <AudioButton text="прочитать" size="sm" />).
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-[2.5rem] border-none shadow-sm overflow-hidden bg-white">
                  <div className="p-8 md:p-10 bg-neutral-800 text-white relative overflow-hidden">
                    <Sparkles className="absolute -right-4 -top-4 w-32 h-32 text-white/5" />
                    <h3 className="text-2xl font-bold relative z-10">Adverbs: The Spice</h3>
                    <p className="text-neutral-400 text-sm mt-2 relative z-10 leading-relaxed">Modify your actions to sound more like a native speaker.</p>
                  </div>
                  <CardContent className="p-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-neutral-100">
                      <div className="p-8 space-y-6">
                         <div className="flex justify-between items-center group">
                            <div>
                                <div className="flex items-center gap-2">
                                  <div className="font-bold text-xl text-neutral-900 group-hover:text-orange-600 transition-colors">Быстро</div>
                                  <AudioButton text="Быстро" size="sm" />
                                </div>
                                <div className="text-xs text-neutral-400 uppercase tracking-widest mt-1">Bystro</div>
                            </div>
                            <span className="text-sm text-neutral-500 italic">Fast</span>
                         </div>
                         <div className="flex justify-between items-center group">
                            <div>
                                <div className="flex items-center gap-2">
                                  <div className="font-bold text-xl text-neutral-900 group-hover:text-orange-600 transition-colors">Медленно</div>
                                  <AudioButton text="Медленно" size="sm" />
                                </div>
                                <div className="text-xs text-neutral-400 uppercase tracking-widest mt-1">Medlenno</div>
                            </div>
                            <span className="text-sm text-neutral-500 italic">Slowly</span>
                         </div>
                      </div>
                      <div className="p-8 space-y-6">
                         <div className="flex justify-between items-center group">
                            <div>
                                <div className="flex items-center gap-2">
                                  <div className="font-bold text-xl text-neutral-900 group-hover:text-orange-600 transition-colors">Хорошо</div>
                                  <AudioButton text="Хорошо" size="sm" />
                                </div>
                                <div className="text-xs text-neutral-400 uppercase tracking-widest mt-1">Khorosho</div>
                            </div>
                            <span className="text-sm text-neutral-500 italic">Well</span>
                         </div>
                         <div className="flex justify-between items-center group">
                            <div>
                                <div className="flex items-center gap-2">
                                  <div className="font-bold text-xl text-neutral-900 group-hover:text-orange-600 transition-colors">Плохо</div>
                                  <AudioButton text="Плохо" size="sm" />
                                </div>
                                <div className="text-xs text-neutral-400 uppercase tracking-widest mt-1">Plokho</div>
                            </div>
                            <span className="text-sm text-neutral-500 italic">Badly</span>
                         </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="lesson22" className="grid grid-cols-1 lg:grid-cols-2 gap-8 slide-in-from-bottom-2 animate-in duration-300">
                {/* Section 1: Gender Agreement */}
                <Card className="rounded-[2.5rem] border-none shadow-sm overflow-hidden bg-white">
                  <div className="p-8 md:p-10 bg-orange-600 text-white relative overflow-hidden">
                    <BookText className="absolute -right-4 -top-4 w-32 h-32 text-orange-500/20" />
                    <h3 className="text-2xl font-bold relative z-10">Adjectives Agreement</h3>
                    <p className="text-orange-100 text-sm mt-2 relative z-10 leading-relaxed">In Russian, adjectives <strong>MUST matches the gender and number</strong> of the noun they describe.</p>
                  </div>
                  <CardContent className="p-8 md:p-10 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100/30">
                        <Badge className="bg-blue-600 text-white mb-2">👨 Masculine</Badge>
                        <p className="text-xs text-neutral-400 font-mono">Endings: -ый / -ий</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="font-bold text-neutral-900">русский космонавт</span>
                          <AudioButton text="русский космонавт" size="sm" />
                        </div>
                        <span className="text-xs text-neutral-500 italic">Russian astronaut</span>
                      </div>

                      <div className="p-5 bg-rose-50/50 rounded-2xl border border-rose-100/30">
                        <Badge className="bg-rose-600 text-white mb-2">👩 Feminine</Badge>
                        <p className="text-xs text-neutral-400 font-mono">Endings: -ая</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="font-bold text-neutral-900">русская певица</span>
                          <AudioButton text="русская певица" size="sm" />
                        </div>
                        <span className="text-xs text-neutral-500 italic">Russian singer</span>
                      </div>

                      <div className="p-5 bg-amber-50/50 rounded-2xl border border-amber-100/30">
                        <Badge className="bg-amber-600 text-white mb-2">📦 Neuter</Badge>
                        <p className="text-xs text-neutral-400 font-mono">Endings: -ое</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="font-bold text-neutral-900">интересное задание</span>
                          <AudioButton text="интересное задание" size="sm" />
                        </div>
                        <span className="text-xs text-neutral-500 italic">interesting task</span>
                      </div>

                      <div className="p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100/30">
                        <Badge className="bg-emerald-600 text-white mb-2">👥 Plural</Badge>
                        <p className="text-xs text-neutral-400 font-mono">Endings: -ые / -ие</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="font-bold text-neutral-900">красивые цветы</span>
                          <AudioButton text="красивые цветы" size="sm" />
                        </div>
                        <span className="text-xs text-neutral-500 italic">beautiful flowers</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Section 2: "What Kind of?" */}
                <Card className="rounded-[2.5rem] border-none shadow-sm overflow-hidden bg-white">
                  <div className="p-8 md:p-10 bg-neutral-800 text-white relative overflow-hidden">
                    <Sparkles className="absolute -right-4 -top-4 w-32 h-32 text-white/5" />
                    <h3 className="text-2xl font-bold relative z-10">Asking &quot;What kind?&quot;</h3>
                    <p className="text-neutral-400 text-sm mt-2 relative z-10 leading-relaxed">The word for &quot;which/what kind of&quot; changes based on gender as well!</p>
                  </div>
                  <CardContent className="p-8 md:p-10 space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-orange-600 font-mono font-bold text-base">М:</span>
                            <span className="font-bold text-neutral-900">Какой это фильм?</span>
                            <AudioButton text="Какой это фильм" size="sm" />
                          </div>
                          <span className="text-xs text-neutral-400 font-mono block">Kakoy eto fil\'m?</span>
                        </div>
                        <span className="text-sm text-neutral-500 italic">What movie is this?</span>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-orange-600 font-mono font-bold text-base">F:</span>
                            <span className="font-bold text-neutral-900">Какая это книга?</span>
                            <AudioButton text="Какая это книга" size="sm" />
                          </div>
                          <span className="text-xs text-neutral-400 font-mono block">Kakaya eta kniga?</span>
                        </div>
                        <span className="text-sm text-neutral-500 italic">What book is this?</span>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-orange-600 font-mono font-bold text-base">N:</span>
                            <span className="font-bold text-neutral-900">Какое это задание?</span>
                            <AudioButton text="Какое это задание" size="sm" />
                          </div>
                          <span className="text-xs text-neutral-400 font-mono block">Kakoye eto zadaniye?</span>
                        </div>
                        <span className="text-sm text-neutral-500 italic">What task is this?</span>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-orange-600 font-mono font-bold text-base">PL:</span>
                            <span className="font-bold text-neutral-900">Какие это цветы?</span>
                            <AudioButton text="Какие это цветы" size="sm" />
                          </div>
                          <span className="text-xs text-neutral-400 font-mono block">Kakiye eti tsvety?</span>
                        </div>
                        <span className="text-sm text-neutral-500 italic">What flowers are these?</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Section 3: Color Transitions */}
                <Card className="rounded-[2.5rem] border-none shadow-sm overflow-hidden bg-white lg:col-span-2">
                  <div className="p-8 md:p-10 bg-slate-100 border-b border-neutral-200/50 relative overflow-hidden">
                    <h3 className="text-2xl font-bold text-neutral-900">Colors Also Agree by Gender! 🎨</h3>
                    <p className="text-neutral-500 text-sm mt-1 leading-relaxed">Colors act as standard adjectives, meaning they match their target noun perfectly.</p>
                  </div>
                  <CardContent className="p-8 md:p-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Dark Blue Example */}
                      <div className="space-y-4 p-6 bg-blue-50/20 rounded-3xl border border-blue-100">
                        <h4 className="font-bold text-blue-900 flex items-center gap-2">
                          <span className="inline-block w-4 h-4 bg-blue-600 rounded-full" />
                          синий (dark blue)
                        </h4>
                        <div className="space-y-2.5">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium text-neutral-700">👦 Masc: <strong className="text-neutral-900">синий</strong> костюм</span>
                            <span className="italic text-neutral-500">blue suit</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="font-medium text-neutral-700">👩 Fem: <strong className="text-neutral-900">синяя</strong> ручка</span>
                            <span className="italic text-neutral-500">blue pen</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="font-medium text-neutral-700">📦 Neut: <strong className="text-neutral-900">синее</strong> море</span>
                            <span className="italic text-neutral-500">blue sea</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="font-medium text-neutral-700">👥 Plur: <strong className="text-neutral-900">синие</strong> яблоки</span>
                            <span className="italic text-neutral-500">blue apples</span>
                          </div>
                        </div>
                      </div>

                      {/* Red Example */}
                      <div className="space-y-4 p-6 bg-red-50/20 rounded-3xl border border-red-100">
                        <h4 className="font-bold text-red-900 flex items-center gap-2">
                          <span className="inline-block w-4 h-4 bg-red-600 rounded-full" />
                          красный (red)
                        </h4>
                        <div className="space-y-2.5">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium text-neutral-700">👦 Masc: <strong className="text-neutral-900">красный</strong> помидор</span>
                            <span className="italic text-neutral-500">red tomato</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="font-medium text-neutral-700">👩 Fem: <strong className="text-neutral-900">красная</strong> площадь</span>
                            <span className="italic text-neutral-500">Red Square</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="font-medium text-neutral-700">📦 Neut: <strong className="text-neutral-900">красное</strong> яблоко</span>
                            <span className="italic text-neutral-500">red apple</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="font-medium text-neutral-700">👥 Plur: <strong className="text-neutral-900">красные</strong> цветы</span>
                            <span className="italic text-neutral-500">red flowers</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Section 4: играть на vs играть в */}
                <Card className="rounded-[2.5rem] border-none shadow-sm overflow-hidden bg-white">
                  <div className="p-8 md:p-10 bg-orange-50/50 border-b border-orange-100 relative overflow-hidden">
                    <h3 className="text-xl font-bold text-neural-900">The Power of &quot;Играть&quot; 🎹⚽</h3>
                    <p className="text-neutral-500 text-xs mt-1">Russian sets strict grammatic prepositions when playing instruments versus sports.</p>
                  </div>
                  <CardContent className="p-8 md:p-10 space-y-6">
                    <div className="space-y-4">
                      <div className="p-4 bg-orange-50/25 rounded-2xl border border-orange-100/50">
                        <Badge className="bg-orange-600 text-white mb-2">🎹 играть на + Prepositional</Badge>
                        <p className="text-sm text-neutral-600">Used strictly for <strong>musical instruments</strong>.</p>
                        <div className="mt-3 space-y-1.5">
                          <div className="flex items-center gap-2 text-sm">
                            <span className="font-semibold text-neutral-900">играть на пианино</span>
                            <AudioButton text="играть на пианино" size="sm" />
                            <span className="text-neutral-400">—</span>
                            <span className="text-neutral-500 italic">play piano</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="font-semibold text-neutral-900">играть на гитаре</span>
                            <AudioButton text="играть на гитаре" size="sm" />
                            <span className="text-neutral-400">—</span>
                            <span className="text-neutral-500 italic">play guitar</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-emerald-50/25 rounded-2xl border border-emerald-100/50">
                        <Badge className="bg-emerald-600 text-white mb-2">⚽ играть в + Accusative</Badge>
                        <p className="text-sm text-neutral-600">Used strictly for <strong>games or sports</strong>.</p>
                        <div className="mt-3">
                          <div className="flex items-center gap-2 text-sm">
                            <span className="font-semibold text-neutral-900">играть в футбол</span>
                            <AudioButton text="играть в футбол" size="sm" />
                            <span className="text-neutral-400">—</span>
                            <span className="text-neutral-500 italic">play football</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Section 5: Adjective vs Adverb Comparison */}
                <Card className="rounded-[2.5rem] border-none shadow-sm overflow-hidden bg-white">
                  <div className="p-8 md:p-10 bg-neutral-900 text-white relative overflow-hidden">
                    <h3 className="text-xl font-bold">Good vs. Well & Easy vs. Easily ✨</h3>
                    <p className="text-sm text-neutral-400 mt-1">Make sure not to confuse adjectives (describing nouns) with adverbs (describing actions)!</p>
                  </div>
                  <CardContent className="p-0">
                    <div className="divide-y divide-neutral-100">
                      <div className="p-6 md:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-none shrink-0">Adjective</Badge>
                            <span className="font-bold text-neutral-900">Это лёгкий урок.</span>
                            <AudioButton text="Это лёгкий урок" size="sm" />
                          </div>
                          <span className="text-xs text-neutral-400 italic block">This is an easy lesson.</span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none shrink-0">Adverb</Badge>
                            <span className="font-bold text-neutral-900">Это легко сделать.</span>
                            <AudioButton text="Это легко сделать" size="sm" />
                          </div>
                          <span className="text-xs text-neutral-400 italic block">It is easy to do.</span>
                        </div>
                      </div>

                      <div className="p-6 md:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-none shrink-0">Adjective</Badge>
                            <span className="font-bold text-neutral-900">хороший друг</span>
                            <AudioButton text="хороший друг" size="sm" />
                          </div>
                          <span className="text-xs text-neutral-400 italic block">good friend</span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none shrink-0">Adverb</Badge>
                            <span className="font-bold text-neutral-900">Здесь хорошо гулять.</span>
                            <AudioButton text="Здесь хорошо гулять" size="sm" />
                          </div>
                          <span className="text-xs text-neutral-400 italic block">It is nice to walk here.</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="bg-white rounded-[3rem] p-8 md:p-12 border border-neutral-100 shadow-xl shadow-neutral-200/20 relative overflow-hidden group">
               <div className="absolute right-0 top-0 w-64 h-64 bg-orange-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-orange-100/50 transition-colors duration-500" />
               <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
                  <div className="bg-orange-600 p-5 rounded-[2rem] shadow-xl shadow-orange-200 shrink-0">
                    <Info className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-neutral-900 mb-3">Key Strategy for Scholars</h3>
                    <p className="text-neutral-600 leading-relaxed text-lg font-light">
                      Don't worry about perfect grammar on day 1. Even if you get the case ending wrong, native speakers will understand your intent. Focus on <strong>roots</strong> and <strong>high-frequency verbs</strong>. The Russian language is forgiving to beginners who try!
                    </p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
