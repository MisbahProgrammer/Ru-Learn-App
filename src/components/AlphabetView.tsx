import React from 'react';
import { ALPHABET } from '@/constants';
import { speakNative } from '@/lib/gemini';
import { Button } from '@/components/ui/button';
import { Volume2, Search } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useAuth } from '@/App';

export function AlphabetView() {
  const { profile, updateLessonProgress, isPremium } = useAuth();
  const lessonsCompleted = profile?.lessons_completed || {};
  const [search, setSearch] = React.useState('');

  const handleSpeak = async (text: string) => {
    try {
      await speakNative(text);
    } catch (error) {
      console.warn('Native TTS failure', error);
    }
  };

  const filteredAlphabet = ALPHABET.filter(item => 
    item.letter.toLowerCase().includes(search.toLowerCase()) || 
    item.sound.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-full bg-neutral-50/50">
      <ScrollArea className="h-full">
        <div className="p-4 md:p-8 md:pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 md:mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-light tracking-tight">Cyrillic <span className="font-serif italic font-medium text-orange-600">Alphabet</span></h2>
              <p className="text-neutral-500 font-light max-w-lg text-sm md:text-base">
                Mastering the alphabet is your first step. Each letter below includes clear pronunciation.
              </p>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input 
                placeholder="Filter letters..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-10 md:h-11 rounded-xl bg-white border-neutral-200 w-full"
              />
            </div>
          </div>

          {/* Duolingo Quiz / Lesson Trackers */}
          <div className="mt-6 bg-white border border-neutral-200 p-6 rounded-3xl shadow-xs space-y-4 max-w-5xl mb-8">
            <div>
              <h3 className="text-sm font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-2">
                🎯 Alphabet Learning Path
              </h3>
              <p className="text-neutral-500 text-xs font-light">Complete all 5 core modules to fully master Cyrillic reading logic.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {[
                { id: 'alphabet_vocals', title: '1. Vowels & Sounds' },
                { id: 'alphabet_consonants', title: '2. Consonants Mastery' },
                { id: 'alphabet_modifiers', title: '3. Hard & Soft Signs' },
                { id: 'alphabet_reading', title: '4. Syllables & Stress' },
                { id: 'alphabet_review', title: '5. Alphabet Review' },
              ].map((lesson) => {
                const isCompleted = !!lessonsCompleted[lesson.id];
                return (
                  <button
                    key={lesson.id}
                    onClick={() => {
                      updateLessonProgress(lesson.id);
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

          {/* YouTube Video Tutorial Embed for Free Users */}
          {!isPremium && (
            <div id="alphabet-videos-section" className="mb-10 max-w-5xl">
              <div className="flex items-center gap-2 mb-4">
                <span className="p-1 bg-red-50 text-red-600 rounded-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                <div>
                  <h3 className="text-md font-bold text-neutral-800">Free Video Tutorials</h3>
                  <p className="text-xs text-neutral-500 font-light">Interactive masterclasses to accelerate your Cyrillic reading and pronunciation.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Video 1 (Ultimate Cyrillic Pronunciation Guide) */}
                <div 
                  id="alphabet-video-card-1" 
                  className="bg-white border border-neutral-200 rounded-3xl shadow-xs overflow-hidden flex flex-col hover:border-neutral-300 transition-colors"
                >
                  <div className="relative w-full aspect-video bg-neutral-950 border-b border-neutral-100">
                    <iframe
                      id="alphabet-youtube-iframe-1"
                      src="https://www.youtube-nocookie.com/embed/FcmsH_qdmO0?rel=0"
                      title="Ultimate Cyrillic Pronunciation Guide"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="absolute top-0 left-0 w-full h-full"
                    ></iframe>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-red-50 text-red-600 border border-red-100 text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full">
                          Ultimate Guide
                        </span>
                        <span className="text-neutral-400 text-xs font-medium">• Practice Workshop</span>
                      </div>
                      <h4 className="text-base font-bold text-neutral-800 leading-tight mb-2">
                        Ultimate Cyrillic Pronunciation Guide
                      </h4>
                      <p className="text-neutral-500 text-xs font-light leading-relaxed mb-4">
                        Deepen your comprehension with this interactive acoustic workshop. Learn vowel reduction, hard & soft qualities, and master how to sound like a native.
                      </p>
                    </div>
                    <div className="space-y-3 pt-2">
                      <div className="space-y-1.5">
                        <div className="flex items-start gap-2 text-xs text-neutral-600">
                          <span className="text-red-500 font-bold shrink-0 mt-0.5">●</span>
                          <span>Practice along with real examples of hard and soft signs</span>
                        </div>
                        <div className="flex items-start gap-2 text-xs text-neutral-600">
                          <span className="text-red-500 font-bold shrink-0 mt-0.5">●</span>
                          <span>Speed up your reading accuracy through syllable drills</span>
                        </div>
                      </div>
                      <div className="pt-2">
                        <button
                          onClick={() => {
                            const isCompleted = !!lessonsCompleted['alphabet_video_1'];
                            updateLessonProgress('alphabet_video_1');
                            if (!isCompleted) {
                              toast.success("🎉 Success! Congratulations! You have completed the Ultimate Cyrillic Pronunciation Guide! +10 XP earned, progress updated! 🔥");
                            }
                          }}
                          className={`w-full inline-flex items-center justify-center gap-1.5 text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer ${
                            lessonsCompleted['alphabet_video_1']
                              ? 'bg-green-50 hover:bg-green-100 text-green-700 border border-green-200'
                              : 'bg-red-600 hover:bg-red-700 text-white border border-transparent'
                          }`}
                        >
                          {lessonsCompleted['alphabet_video_1'] ? (
                            <>
                              <svg className="w-4 h-4 text-green-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                              <span>Completed ✓</span>
                            </>
                          ) : (
                            <span>Mark as Completed</span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Video 2 (Learn the Russian Alphabet Instantly - Part 1) */}
                <div 
                  id="alphabet-video-card-2" 
                  className="bg-white border border-neutral-200 rounded-3xl shadow-xs overflow-hidden flex flex-col hover:border-neutral-300 transition-colors"
                >
                  <div className="relative w-full aspect-video bg-neutral-950 border-b border-neutral-100">
                    <iframe
                      id="alphabet-youtube-iframe-2"
                      src="https://www.youtube-nocookie.com/embed/mg0HstYg5wA?rel=0"
                      title="Learn Russian Alphabet Instantly - Part 1"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="absolute top-0 left-0 w-full h-full"
                    ></iframe>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-red-50 text-red-600 border border-red-100 text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full">
                          Part 1
                        </span>
                        <span className="text-neutral-400 text-xs font-medium">• Masterclass</span>
                      </div>
                      <h4 className="text-base font-bold text-neutral-800 leading-tight mb-2">
                        Learn the Russian Alphabet Instantly
                      </h4>
                      <p className="text-neutral-500 text-xs font-light leading-relaxed mb-4">
                        New to Cyrillic script? Start learning Russian from scratch! This step-by-step video workshop will guide you through the first letters, vowel/consonant pairs, and standard pronunciation.
                      </p>
                    </div>
                    <div className="space-y-3 pt-2">
                      <div className="space-y-1.5">
                        <div className="flex items-start gap-2 text-xs text-neutral-600">
                          <span className="text-red-500 font-bold shrink-0 mt-0.5">●</span>
                          <span>Listen to standard pronunciation for core vowels and consonants</span>
                        </div>
                        <div className="flex items-start gap-2 text-xs text-neutral-600">
                          <span className="text-red-500 font-bold shrink-0 mt-0.5">●</span>
                          <span>Avoid common phonetic pitfalls made by English-speaking learners</span>
                        </div>
                      </div>
                      <div className="pt-2">
                        <button
                          onClick={() => {
                            const isCompleted = !!lessonsCompleted['alphabet_video_2'];
                            updateLessonProgress('alphabet_video_2');
                            if (!isCompleted) {
                              toast.success("🎉 Success! Congratulations! You have completed Part 1: Learn Russian Alphabet Instantly! +10 XP earned, progress updated on the main dashboard! 🔥");
                            }
                          }}
                          className={`w-full inline-flex items-center justify-center gap-1.5 text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer ${
                            lessonsCompleted['alphabet_video_2']
                              ? 'bg-green-50 hover:bg-green-100 text-green-700 border border-green-200'
                              : 'bg-red-600 hover:bg-red-700 text-white border border-transparent'
                          }`}
                        >
                          {lessonsCompleted['alphabet_video_2'] ? (
                            <>
                              <svg className="w-4 h-4 text-green-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                              <span>Completed ✓</span>
                            </>
                          ) : (
                            <span>Mark as Completed</span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Video 3 (Learn Russian Alphabet Instantly - Part 2) */}
                <div 
                  id="alphabet-video-card-3" 
                  className="bg-white border border-neutral-200 rounded-3xl shadow-xs overflow-hidden flex flex-col hover:border-neutral-300 transition-colors"
                >
                  <div className="relative w-full aspect-video bg-neutral-950 border-b border-neutral-100">
                    <iframe
                      id="alphabet-youtube-iframe-3"
                      src="https://www.youtube-nocookie.com/embed/DpWW8Nut9Ik?rel=0"
                      title="Learn Russian Alphabet Part 2"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="absolute top-0 left-0 w-full h-full"
                    ></iframe>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-red-50 text-red-600 border border-red-100 text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full">
                          Part 2
                        </span>
                        <span className="text-neutral-400 text-xs font-medium">• Masterclass</span>
                      </div>
                      <h4 className="text-base font-bold text-neutral-800 leading-tight mb-2">
                        Learn Russian Alphabet - Part 2
                      </h4>
                      <p className="text-neutral-500 text-xs font-light leading-relaxed mb-4">
                        Advance to the next stage of your Russian alphabet masterclass. Deepen your understanding of letters and pronunciation, and write simple words with native tips.
                      </p>
                    </div>
                    <div className="space-y-3 pt-2">
                      <div className="space-y-1.5">
                        <div className="flex items-start gap-2 text-xs text-neutral-600">
                          <span className="text-red-500 font-bold shrink-0 mt-0.5">●</span>
                          <span>Explore the next set of Cyrillic letters and pronunciation</span>
                        </div>
                        <div className="flex items-start gap-2 text-xs text-neutral-600">
                          <span className="text-red-500 font-bold shrink-0 mt-0.5">●</span>
                          <span>Practice simple syllables and write your first conversational phrases</span>
                        </div>
                      </div>
                      <div className="pt-2">
                        <button
                          onClick={() => {
                            const isCompleted = !!lessonsCompleted['alphabet_video_3'];
                            updateLessonProgress('alphabet_video_3');
                            if (!isCompleted) {
                              toast.success("🎉 Success! Congratulations! You have completed Part 2: Russian Alphabet! +10 XP earned, progress updated on the main dashboard! 🔥");
                            }
                          }}
                          className={`w-full inline-flex items-center justify-center gap-1.5 text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer ${
                            lessonsCompleted['alphabet_video_3']
                              ? 'bg-green-50 hover:bg-green-100 text-green-700 border border-green-200'
                              : 'bg-red-600 hover:bg-red-700 text-white border border-transparent'
                          }`}
                        >
                          {lessonsCompleted['alphabet_video_3'] ? (
                            <>
                              <svg className="w-4 h-4 text-green-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                              <span>Completed ✓</span>
                            </>
                          ) : (
                            <span>Mark as Completed</span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Video 4 (Super Simple Reading Drills - Part 3) */}
                <div 
                  id="alphabet-video-card-4" 
                  className="bg-white border border-neutral-200 rounded-3xl shadow-xs overflow-hidden flex flex-col hover:border-neutral-300 transition-colors"
                >
                  <div className="relative w-full aspect-video bg-neutral-950 border-b border-neutral-100">
                    <iframe
                      id="alphabet-youtube-iframe-4"
                      src="https://www.youtube-nocookie.com/embed/lEj_yvc1mLQ?rel=0"
                      title="Super Simple Reading Drills"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="absolute top-0 left-0 w-full h-full"
                    ></iframe>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-red-50 text-red-600 border border-red-100 text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full">
                          Part 3
                        </span>
                        <span className="text-neutral-400 text-xs font-medium">• Letter Reading</span>
                      </div>
                      <h4 className="text-base font-bold text-neutral-800 leading-tight mb-2">
                        Super Simple Reading Drills
                      </h4>
                      <p className="text-neutral-500 text-xs font-light leading-relaxed mb-4">
                        Master the sound linkages of the Cyrillic alphabet. Practice visual letter recognition, pair consonants with vowels smoothly, and start spelling real words like a pro!
                      </p>
                    </div>
                    <div className="space-y-3 pt-2">
                      <div className="space-y-1.5">
                        <div className="flex items-start gap-2 text-xs text-neutral-600">
                          <span className="text-red-500 font-bold shrink-0 mt-0.5">●</span>
                          <span>Practice standard orthography rules & spelling principles</span>
                        </div>
                        <div className="flex items-start gap-2 text-xs text-neutral-600">
                          <span className="text-red-500 font-bold shrink-0 mt-0.5">●</span>
                          <span>Understand the exact visual forms and phonetic mappings</span>
                        </div>
                      </div>
                      <div className="pt-2">
                        <button
                          onClick={() => {
                            const isCompleted = !!lessonsCompleted['alphabet_video_4'];
                            updateLessonProgress('alphabet_video_4');
                            if (!isCompleted) {
                              toast.success("🎉 Success! Congratulations! You have completed Part 4: Cyrillic Reading Drills! +10 XP earned, progress updated on the main dashboard! 🔥");
                            }
                          }}
                          className={`w-full inline-flex items-center justify-center gap-1.5 text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer ${
                            lessonsCompleted['alphabet_video_4']
                              ? 'bg-green-50 hover:bg-green-100 text-green-700 border border-green-200'
                              : 'bg-red-600 hover:bg-red-700 text-white border border-transparent'
                          }`}
                        >
                          {lessonsCompleted['alphabet_video_4'] ? (
                            <>
                              <svg className="w-4 h-4 text-green-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                              <span>Completed ✓</span>
                            </>
                          ) : (
                            <span>Mark as Completed</span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-4 md:px-8 pb-32">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 h-max">
            {filteredAlphabet.map((item) => (
              <div 
                key={item.letter}
                className="bg-white border border-neutral-200 p-6 rounded-3xl hover:shadow-lg transition-all group flex flex-col items-center gap-2 hover:border-orange-200 group relative"
              >
                <button 
                  className="text-5xl font-bold font-serif mb-4 group-hover:text-orange-600 transition-colors cursor-pointer focus:outline-none"
                  onClick={() => handleSpeak(item.letter)}
                >
                  {item.letter}
                </button>
                <div className="text-xs uppercase tracking-widest text-neutral-400 font-bold mb-4">
                  SOUND: {item.sound}
                </div>
                
                <div className="w-full h-[1px] bg-neutral-100 my-2" />
                
                <div className="text-center relative group/example">
                  <p className="text-neutral-500 text-[10px] uppercase font-bold tracking-tight">Example Word</p>
                  <div className="flex items-center justify-center gap-1">
                    <p className="font-medium text-neutral-900 group-hover:text-orange-600 transition-colors">{item.example}</p>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-6 w-6 text-neutral-300 hover:text-orange-600 hover:bg-orange-50 rounded-full"
                      onClick={() => handleSpeak(item.example)}
                    >
                      <Volume2 className="w-3 h-3" />
                    </Button>
                  </div>
                  <p className="text-xs italic text-neutral-400">({item.transcription})</p>
                </div>

                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="rounded-full h-8 w-8 text-neutral-400 hover:text-orange-600 hover:bg-orange-50"
                    onClick={() => handleSpeak(item.letter)}
                  >
                    <Volume2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
