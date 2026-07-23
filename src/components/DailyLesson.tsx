import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/App';
import { dailyLessons, DailyLessonData } from '@/data/dailyLessons';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Play, Sparkles, BookOpen, Volume2, Award, ArrowRight, Hourglass, RefreshCw } from 'lucide-react';
import { AudioButton } from '@/components/AudioButton';

export function DailyLesson() {
  const { profile, updateLessonProgress } = useAuth();
  const lessonsCompleted = profile?.lessons_completed || {};

  // 1. Calculate today's day number based on days since signup
  const signupDateStr = profile?.createdAt || new Date().toISOString();
  const signupDate = new Date(signupDateStr);
  const today = new Date();
  
  // Calculate difference in full days
  const diffTime = today.getTime() - signupDate.getTime();
  const daysSinceSignup = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
  
  // Modulo 30 to cycle through 30 days of lessons, 1-indexed
  const dayNumber = (daysSinceSignup % 30) + 1;
  const currentLesson: DailyLessonData = dailyLessons.find(l => l.dayNumber === dayNumber) || dailyLessons[0];

  const lessonKey = `day_${dayNumber}`;
  const isCompletedToday = !!lessonsCompleted[lessonKey];

  // 2. Timer and active states
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(15 * 60); // 15:00
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Audio text speech synthesis helper
  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ru-RU';
      window.speechSynthesis.speak(utterance);
    } else {
      toast.error('Text-to-speech is not supported in this browser.');
    }
  };

  // Timer tick effect
  useEffect(() => {
    if (isTimerRunning && secondsRemaining > 0) {
      timerRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            handleTimerCompletion();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTimerRunning, secondsRemaining]);

  const startLesson = () => {
    setIsTimerRunning(true);
    toast.success("Let's go! Read through the material while the study timer is active.");
  };

  const handleTimerCompletion = () => {
    setIsTimerRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    updateLessonProgress(lessonKey);
    toast.success("Hooray! Today's lesson complete. +10 XP earned!");
  };

  // Skip feature for testing / convenient review
  const fastForwardLesson = () => {
    handleTimerCompletion();
  };

  // 3. Tomorrow's preview calculation
  const tomorrowDayNumber = (dayNumber % 30) + 1;
  const tomorrowLesson = dailyLessons.find(l => l.dayNumber === tomorrowDayNumber) || dailyLessons[0];

  // Helper to format remaining seconds into MM:SS
  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <Card className="border border-neutral-200 overflow-hidden rounded-2xl sm:rounded-3xl" id="daily-lesson-wrapper">
      <CardHeader className="bg-linear-to-r from-orange-50/70 to-neutral-50 border-b border-light-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="bg-orange-500 hover:bg-orange-600 text-white font-bold" id="badge-day-number">
                Day {dayNumber} of 30
              </Badge>
              <span className="text-xs text-neutral-400 font-medium">• Daily Structured Plan</span>
            </div>
            <CardTitle className="text-base sm:text-lg md:text-xl font-bold text-neutral-900 tracking-tight" id="lesson-card-title">
              {currentLesson.title}
            </CardTitle>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            {isCompletedToday ? (
              <Badge className="bg-green-100 text-green-700 border-green-200 border px-3 py-1 text-xs font-bold shrink-0">
                ✓ COMPLETED TODAY
              </Badge>
            ) : isTimerRunning ? (
              <div className="flex items-center gap-2 sm:gap-3 bg-orange-100 border border-orange-200 py-1.5 px-3 rounded-xl sm:rounded-2xl shrink-0 animate-pulse">
                <Hourglass className="w-4 h-4 text-orange-600 animate-spin" />
                <span className="font-mono text-sm sm:text-base font-bold text-orange-950" id="timer-display">
                  {formatTime(secondsRemaining)}
                </span>
              </div>
            ) : (
              <Button
                onClick={startLesson}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 sm:px-5 h-9 sm:h-10 rounded-xl hover:scale-[1.02] transition-all flex items-center gap-2 shrink-0 shadow-sm text-xs sm:text-sm"
                id="btn-start-lesson"
              >
                <Play className="w-4 h-4 fill-white text-white" />
                Start Today's Lesson
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-3.5 sm:p-6" id="daily-content-section">
        {isCompletedToday ? (
          <div className="space-y-6 pt-2">
            {/* Well Done Celebration Panel */}
            <div className="bg-green-50/50 border border-green-100 rounded-2xl p-4 sm:p-6 text-center space-y-3">
              <div className="w-12 h-12 bg-green-150 rounded-full flex items-center justify-center mx-auto text-xl">
                🎉
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-green-950 text-base">Today's Lesson is Complete!</h3>
                <p className="text-xs text-green-800 font-light max-w-md mx-auto">
                  Solid progress on your journey of moving to Russia. You have accrued +10 XP and extended your streak count.
                </p>
              </div>
            </div>

            {/* Tomorrow Preview Frame */}
            <div className="border border-neutral-100 bg-neutral-50/30 rounded-2xl p-4 sm:p-5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-neutral-400 uppercase tracking-widest">
                <ArrowRight className="w-3.5 h-3.5" />
                Tomorrow's Lesson Preview (Day {tomorrowDayNumber})
              </div>
              <div>
                <h4 className="font-semibold text-neutral-800 text-base">{tomorrowLesson.title}</h4>
                <p className="text-xs text-neutral-500 mt-1">
                  Tomorrow, you will expand your mastery specifically with the letters:{" "}
                  <strong className="text-neutral-700 bg-neutral-100 px-1 py-0.5 rounded text-[11px]">
                    {tomorrowLesson.alphabetSection.letters.join(", ")}
                  </strong>.
                </p>
              </div>
            </div>
          </div>
        ) : !isTimerRunning ? (
          <div className="py-6 sm:py-8 text-center space-y-4 max-w-lg mx-auto">
            <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center mx-auto">
              <BookOpen className="w-6 h-6 text-orange-500" />
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-bold text-neutral-800">Your Structured 15-Minute Study Routine</h3>
              <p className="text-xs text-neutral-500 font-light leading-relaxed px-2">
                Russia bound? This curriculum is specifically paced so you absorb letters, high-yield vocabulary, and essential dialogues before you arrive. Click "Start Today's Lesson" above to view material and start the timer countdown!
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 text-xs font-semibold text-neutral-400">
              <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-orange-500" /> Alphabet</span>
              <span>•</span>
              <span className="flex items-center gap-1.5"><Volume2 className="w-3.5 h-3.5 text-orange-500" /> Vocabulary</span>
              <span>•</span>
              <span className="flex items-center gap-1.5"><Award className="w-3.5 h-3.5 text-orange-500" /> Sentences</span>
            </div>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {/* QA bypass option */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-neutral-50 p-3 rounded-xl border border-neutral-100 text-xs">
              <span className="text-neutral-500 font-light text-center sm:text-left">Short on time? Use fast forward helper.</span>
              <button 
                onClick={fastForwardLesson}
                className="flex items-center justify-center gap-1 text-orange-600 hover:text-orange-700 font-bold tracking-tight hover:underline cursor-pointer shrink-0"
              >
                <RefreshCw className="w-3 h-3 animate-spin duration-3000" />
                Finish Lesson Now (QA Help)
              </button>
            </div>

            <Tabs defaultValue="vowels" className="w-full">
              <TabsList className="grid grid-cols-3 bg-neutral-100/80 border p-1 rounded-xl shadow-2xs w-full h-auto min-h-10 gap-1">
                <TabsTrigger value="vowels" className="text-xs sm:text-sm font-bold py-2 px-1 rounded-lg truncate text-center">
                  <span className="hidden sm:inline">Alphabet Letters</span>
                  <span className="sm:hidden">Alphabet</span>
                </TabsTrigger>
                <TabsTrigger value="words" className="text-xs sm:text-sm font-bold py-2 px-1 rounded-lg truncate text-center">
                  <span className="hidden sm:inline">Vocabulary List</span>
                  <span className="sm:hidden">Vocabulary</span>
                </TabsTrigger>
                <TabsTrigger value="sentences" className="text-xs sm:text-sm font-bold py-2 px-1 rounded-lg truncate text-center">
                  <span className="hidden sm:inline">High-yield Dialogues</span>
                  <span className="sm:hidden">Dialogues</span>
                </TabsTrigger>
              </TabsList>

              {/* 1. Alphabet Tab */}
              <TabsContent value="vowels" className="pt-3 sm:pt-4 space-y-4">
                <div className="bg-orange-50/20 border border-orange-100/50 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-orange-600 mb-1">Cyrillic Mastery</h4>
                  <p className="text-[11px] sm:text-xs text-neutral-500 leading-relaxed font-light">
                    {currentLesson.alphabetSection.audioHint}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
                  {currentLesson.alphabetSection.letters.map((letter, idx) => (
                    <div 
                      key={idx} 
                      className="border border-neutral-200 p-3 sm:p-4 rounded-xl sm:rounded-2xl text-center space-y-2 hover:border-neutral-300 transition-colors flex flex-col items-center justify-center bg-white shadow-2xs"
                    >
                      <div className="text-2xl sm:text-3xl font-bold font-serif text-neutral-800">{letter}</div>
                      <AudioButton text={letter} size="sm" label="Listen" className="mx-auto" />
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* 2. Vocabulary Tab */}
              <TabsContent value="words" className="pt-3 sm:pt-4 space-y-2.5 sm:space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                  {currentLesson.vocabularySection.words.map((word, index) => (
                    <div key={index} className="flex justify-between items-center p-3 sm:p-3.5 border border-neutral-200 rounded-xl sm:rounded-2xl bg-white gap-2">
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-neutral-900 text-sm sm:text-base tracking-tight">{word.russian}</span>
                          <span className="text-[10px] sm:text-xs text-neutral-400 font-mono">[{word.phonetic}]</span>
                        </div>
                        <p className="text-xs text-neutral-500 font-light truncate">{word.english}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <AudioButton text={word.russian} size="sm" />
                        <AudioButton text={word.russian} slow={true} size="sm" />
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* 3. Sentences Tab */}
              <TabsContent value="sentences" className="pt-3 sm:pt-4 space-y-3 sm:space-y-4">
                {currentLesson.sentenceSection.sentences.map((sent, index) => (
                  <div key={index} className="p-3.5 sm:p-4 border border-neutral-200 rounded-xl sm:rounded-2xl space-y-2.5 bg-white relative">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center flex-wrap gap-2">
                          <h4 className="text-sm sm:text-base font-bold text-neutral-900 leading-snug break-words">{sent.russian}</h4>
                          <div className="flex items-center gap-1 shrink-0">
                            <AudioButton text={sent.russian} size="sm" label="Normal" />
                            <AudioButton text={sent.russian} slow={true} size="sm" label="Slow" />
                          </div>
                        </div>
                        <p className="text-xs text-orange-600 font-mono">[{sent.phonetic}]</p>
                        <p className="text-xs text-neutral-700 font-medium">{sent.english}</p>
                      </div>
                      <span className="px-2 py-0.5 bg-neutral-100 text-neutral-500 text-[10px] rounded-md font-medium shrink-0 self-start">
                        Dialogue
                      </span>
                    </div>
                    <div className="text-[11px] text-neutral-500 font-light border-t pt-2 border-neutral-100">
                      💡 {sent.context}
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
