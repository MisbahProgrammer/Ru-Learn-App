import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SCENARIOS } from '@/constants';
import { chatWithTutor, speakRussian } from '@/lib/gemini';
import { 
  Volume2, 
  Mic, 
  MicOff, 
  Send, 
  Info, 
  CheckCircle2, 
  ArrowLeft,
  User,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { auth } from '@/lib/firebase';

interface Message {
  role: 'user' | 'model';
  parts: [{ text: string }];
  translation?: string;
  russian?: string;
}

export function ScenarioChat() {
  const [selectedScenario, setSelectedScenario] = useState<typeof SCENARIOS[0] | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsRecording(false);
        handleSend(transcript);
      };

      recognitionRef.current.onerror = () => {
        setIsRecording(false);
        toast.error('Voice recognition error. Please try again.');
      };
    }
  }, []);

  const startScenario = (scenario: typeof SCENARIOS[0]) => {
    setSelectedScenario(scenario);
    setMessages([
      { 
        role: 'model', 
        parts: [{ text: `Hello! Let's practice the scenario: ${scenario.title}.\n\nRussian: ${scenario.initialMessageRu}\nTranslation: ${scenario.initialMessage}` }],
        russian: scenario.initialMessageRu,
        translation: scenario.initialMessage
      }
    ]);
  };

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() || loading) return;

    const userMessage: Message = { role: 'user', parts: [{ text: textToSend }] };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, parts: m.parts }));
      const response = await chatWithTutor([...history, { role: 'user', parts: [{ text: textToSend }] }], selectedScenario?.title);
      
      const parts = response.text.split('\n');
      let russian = '';
      let translation = '';
      
      parts.forEach((p: string) => {
        if (p.startsWith('Russian:')) russian = p.replace('Russian:', '').trim();
        if (p.startsWith('Translation:')) translation = p.replace('Translation:', '').trim();
      });

      const modelMessage: Message = { 
        role: 'model', 
        parts: [{ text: response.text }],
        russian: russian || response.text,
        translation: translation
      };
      
      setMessages(prev => [...prev, modelMessage]);
      
      // Auto-play Russian audio
      if (russian) {
        speakRussian(russian);
      } else {
         speakRussian(response.text);
      }
    } catch (error: any) {
      toast.error('Tutor is busy: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      if (!recognitionRef.current) {
        toast.error('Speech recognition not supported in this browser.');
        return;
      }
      toast.info('Listening (English)...');
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  if (!selectedScenario) {
    return (
      <div className="p-8 h-full bg-neutral-50/50 flex flex-col">
        <div className="mb-12">
          <h2 className="text-4xl font-light tracking-tight mb-2">Voice <span className="font-serif italic font-medium text-orange-600">Scenarios</span></h2>
          <p className="text-neutral-500 font-light max-w-2xl leading-relaxed">
            Pick a real-world situation you'll encounter in Russia. Each session includes an AI tutor, voice practice, and cultural context.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
          {SCENARIOS.map((scenario) => (
            <div 
              key={scenario.id} 
              className="bg-white border border-neutral-200 p-8 rounded-[32px] hover:shadow-xl transition-all group flex flex-col items-start gap-4 cursor-pointer hover:border-orange-200"
              onClick={() => startScenario(scenario)}
            >
              <div className="p-4 bg-orange-50 text-orange-600 rounded-2xl group-hover:bg-orange-600 group-hover:text-white transition-colors">
                 {/* Lucide icon rendering needs to be dynamic or static */}
                 <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold tracking-tight">{scenario.title}</h3>
              <p className="text-neutral-500 text-sm font-light leading-relaxed mb-4">{scenario.description}</p>
              
              <div className="mt-auto pt-6 border-t border-neutral-100 w-full flex items-center justify-between">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">START PRACTICE</span>
                <CheckCircle2 className="w-4 h-4 text-neutral-200 group-hover:text-orange-500 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-neutral-50 overflow-hidden relative pb-32 md:pb-0">
      {/* Scenario Header */}
      <div className="p-3 md:p-4 border-b border-neutral-200 bg-white/80 backdrop-blur-md flex items-center gap-3 md:gap-4 sticky top-0 z-20">
        <Button variant="ghost" size="icon" onClick={() => setSelectedScenario(null)} className="rounded-full h-8 w-8 md:h-10 md:w-10">
           <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-xs md:text-sm tracking-tight truncate">{selectedScenario.title}</h3>
          <p className="text-[9px] md:text-[10px] uppercase tracking-widest text-orange-600 font-bold">Live AI Practice</p>
        </div>
        
        <div className="hidden sm:flex ml-auto items-center gap-2">
           <div className="bg-orange-50 text-orange-600 p-2 rounded-lg flex items-center gap-2 text-xs font-semibold px-4 border border-orange-100">
             <Info className="w-3 h-3" />
             {selectedScenario.culturalTip}
           </div>
        </div>
      </div>

      <ScrollArea className="flex-1 px-4 md:px-6 py-4">
        <div className="max-w-3xl mx-auto space-y-4 md:space-y-6">
          <AnimatePresence>
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'model' && (
                  <Avatar className="h-8 w-8 mt-1 border border-orange-100 bg-orange-50">
                    <AvatarFallback className="text-[10px] text-orange-600">RT</AvatarFallback>
                  </Avatar>
                )}
                
                <div className={`flex flex-col max-w-[80%] ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`p-4 rounded-2xl ${
                    m.role === 'user' 
                      ? 'bg-neutral-900 text-white rounded-tr-none' 
                      : 'bg-white border border-neutral-200 rounded-tl-none shadow-sm'
                  }`}>
                    {m.russian ? (
                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between items-start gap-4">
                            <p className={`text-2xl md:text-3xl font-medium tracking-wide leading-relaxed ${m.role === 'user' ? 'text-white' : 'text-neutral-900'}`}>{m.russian}</p>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="h-8 w-8 text-orange-500 hover:bg-orange-50 shrink-0"
                              onClick={() => speakRussian(m.russian!)}
                            >
                              <Volume2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className={`h-[1px] w-full my-1 ${m.role === 'user' ? 'bg-white/10' : 'bg-neutral-100'}`} />
                          <p className={`text-xs md:text-sm italic font-light opacity-80 ${m.role === 'user' ? 'text-white/70' : 'text-neutral-500'}`}>
                            {m.translation}
                          </p>
                        </div>
                    ) : (
                      <div className="prose prose-sm max-w-none prose-neutral">
                        <ReactMarkdown>{m.parts[0].text}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>

                {m.role === 'user' && (
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarImage src={auth.currentUser?.photoURL || ''} />
                    <AvatarFallback><User /></AvatarFallback>
                  </Avatar>
                )}
              </motion.div>
            ))}
            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                <Avatar className="h-8 w-8 bg-orange-50 border border-orange-100 animate-pulse">
                  <AvatarFallback className="text-[10px] text-orange-600">...</AvatarFallback>
                </Avatar>
                <div className="bg-white border border-neutral-200 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                   <div className="flex gap-1">
                     <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce delay-100" />
                     <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce delay-200" />
                     <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce delay-300" />
                   </div>
                   <span className="text-xs text-neutral-400 font-medium ml-2">Tutor is thinking...</span>
                </div>
              </motion.div>
            )}
            <div ref={scrollRef} />
          </AnimatePresence>
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-3 md:p-6 bg-white/80 backdrop-blur-md border-t border-neutral-200 fixed bottom-16 md:bottom-0 left-0 right-0 md:relative z-40">
        <div className="max-w-3xl mx-auto">
          <div className="relative flex items-center gap-2 md:gap-3">
             <div className="relative flex-1 group">
                <Input 
                  placeholder="Type in English..." 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  className="h-10 md:h-14 pl-4 md:pl-6 pr-10 md:pr-14 rounded-xl md:rounded-2xl bg-neutral-100/50 border-neutral-200 focus:bg-white transition-all shadow-inner text-sm md:text-base"
                />
                <Button 
                  size="icon" 
                  className={`absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 md:h-12 md:w-12 rounded-lg md:rounded-xl transition-all ${
                    isRecording 
                      ? 'bg-red-500 animate-pulse hover:bg-red-600' 
                      : 'bg-orange-500 hover:bg-orange-600'
                  }`}
                  onClick={toggleRecording}
                >
                  {isRecording ? <MicOff className="w-3 h-3 md:w-5 md:h-5" /> : <Mic className="w-3 h-3 md:w-5 md:h-5" />}
                </Button>
             </div>
             
             <Button 
               size="icon" 
               className="h-10 w-10 md:h-14 md:w-14 rounded-xl md:rounded-2xl bg-neutral-900 hover:bg-black text-white shrink-0 shadow-lg active:scale-95 transition-all"
               onClick={() => handleSend()}
               disabled={!input.trim() || loading}
             >
                <Send className="w-4 h-4 md:w-5 md:h-5" />
             </Button>
          </div>
          
          <div className="mt-2 hidden md:flex items-center justify-center gap-6">
            <p className="text-[10px] text-neutral-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-orange-500" />
              Practice everyday Russian for your scholarship journey.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
