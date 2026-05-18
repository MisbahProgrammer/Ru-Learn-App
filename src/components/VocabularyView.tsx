import React from 'react';
import { VOCABULARY, PHRASES } from '@/constants';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Volume2 } from 'lucide-react';
import { speakNative } from '@/lib/gemini';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function VocabularyView() {
  const handleSpeak = async (text: string) => {
    try {
      await speakNative(text);
    } catch (error) {
      console.warn('Native TTS failure', error);
    }
  };

  return (
    <div className="h-full bg-neutral-50/50">
      <ScrollArea className="h-full">
        <div className="p-4 md:p-8 space-y-12 pb-32">
        <header>
          <h2 className="text-2xl md:text-3xl font-light tracking-tight mb-2">Essential <span className="font-serif italic font-medium text-orange-600">Vocabulary</span></h2>
          <p className="text-neutral-500 font-light max-w-lg text-sm md:text-base">
            Categorized words to help you navigate daily life in Russia.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {VOCABULARY.map((cat) => (
            <Card key={cat.category} className="border-neutral-200 shadow-sm overflow-hidden bg-white/50 backdrop-blur-sm">
              <CardHeader className="bg-neutral-50/50 border-b border-neutral-100 py-3">
                <CardTitle className="text-lg font-medium text-neutral-800">{cat.category}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-neutral-100">
                  {cat.items.map((item) => (
                    <div key={item.ru} className="flex items-center justify-between p-3 hover:bg-neutral-50/80 transition-colors group">
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
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleSpeak(item.ru)}
                      >
                        <Volume2 className="w-4 h-4 text-orange-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <section className="pt-8">
          <header className="mb-8">
            <h2 className="text-2xl md:text-3xl font-light tracking-tight mb-2">Common <span className="font-serif italic font-medium text-orange-600">Phrases</span></h2>
            <p className="text-neutral-500 font-light max-w-lg text-sm md:text-base">
              Handy sentences for quick communication.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PHRASES.map((phrase) => (
              <div 
                key={phrase.ru}
                className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm hover:border-orange-200 transition-all group flex items-start justify-between"
              >
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
                  className="rounded-full hover:bg-orange-50"
                  onClick={() => handleSpeak(phrase.ru)}
                >
                  <Volume2 className="w-4 h-4 text-orange-500" />
                </Button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </ScrollArea>
  </div>
);
}
