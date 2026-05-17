import React from 'react';
import { ALPHABET } from '@/constants';
import { speakRussian } from '@/lib/gemini';
import { Button } from '@/components/ui/button';
import { Volume2, Search } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';

export function AlphabetView() {
  const [search, setSearch] = React.useState('');

  const filteredAlphabet = ALPHABET.filter(item => 
    item.letter.toLowerCase().includes(search.toLowerCase()) || 
    item.sound.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-neutral-50/50">
      <div className="p-8 pb-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-light tracking-tight">Cyrillic <span className="font-serif italic font-medium text-orange-600">Alphabet</span></h2>
            <p className="text-neutral-500 font-light max-w-lg">
              Mastering the alphabet is your first step. Each letter below includes clear pronunciation and an example word.
            </p>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <Input 
              placeholder="Filter letters..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-10 rounded-xl bg-white border-neutral-200"
            />
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-8 pt-0">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 h-max pb-8">
          {filteredAlphabet.map((item) => (
            <div 
              key={item.letter}
              className="bg-white border border-neutral-200 p-6 rounded-3xl hover:shadow-lg transition-all group flex flex-col items-center gap-2 hover:border-orange-200 group relative"
            >
              <div className="text-5xl font-bold font-serif mb-4 group-hover:text-orange-600 transition-colors">
                {item.letter}
              </div>
              <div className="text-xs uppercase tracking-widest text-neutral-400 font-bold mb-4">
                SOUND: {item.sound}
              </div>
              
              <div className="w-full h-[1px] bg-neutral-100 my-2" />
              
              <div className="text-center">
                <p className="text-neutral-500 text-[10px] uppercase font-bold tracking-tight">Example Word</p>
                <p className="font-medium text-neutral-900 group-hover:text-orange-600 transition-colors">{item.example}</p>
                <p className="text-xs italic text-neutral-400">({item.transcription})</p>
              </div>

              <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="rounded-full h-8 w-8 text-neutral-400 hover:text-orange-600 hover:bg-orange-50"
                  onClick={() => speakRussian(`${item.letter} like in ${item.example}`)}
                >
                  <Volume2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
