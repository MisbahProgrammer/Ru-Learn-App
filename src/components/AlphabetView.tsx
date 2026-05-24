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
  const { profile, updateLessonProgress } = useAuth();
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
