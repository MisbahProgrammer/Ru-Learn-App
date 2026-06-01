import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SCENARIOS } from "@/constants";
import { chatWithTutor, chatWithTutorStream, speakRussian } from "@/lib/gemini";
import { AudioButton } from "@/components/AudioButton";
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
  MessageSquare,
  Lock,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/App";

interface Message {
  role: "user" | "model" | "assistant";
  parts?: [{ text: string }];
  translation?: string;
  russian?: string;
  phonetic?: string;
  isOpening?: boolean;
  content?: string;
  english?: string;
  isHidden?: boolean;
}

const PREMIUM_SCENARIOS = [
  {
    id: "grocery",
    title: "🛒 grocery at Pyaterochka",
    description: "Shop at Pyaterochka supermarket and understand cashier questions.",
    icon: "ShoppingBag",
    culturalTip: 'Cashiers will always ask if you have a loyalty card ("Karta est\'?").',
    openingMessage: {
      russian: "Здравствуйте! Вам помочь? Что вы ищете?",
      phonetic: "Zdra-STVOOY-teh! Vam pa-MOCH? Shto vih ee-SHCHE-teh?",
      english: "Hello! Can I help you? What are you looking for?",
      suggestion: "Try: Где хлеб? (Where is the bread?)"
    },
    hiddenInitPrompt: `You are now a shop assistant at Pyaterochka supermarket Moscow.
I am playing the role of a student who is shopping at dynamic Russian grocery stores for the first time.
I am a complete beginner in Russian.

CRITICAL OFF-TOPIC RULES:
- You are ONLY a grocery store assistant/cashier in this scenario
- You do NOT discuss university fees, general admissions, politics, news, other countries, or anything unrelated to grocery shopping
- If user asks something off-topic, ALWAYS respond with:
  "Я только кассир, не знаю! 😄
  (I'm just a cashier, I don't know! 😄)
  Вам нужен пакет? (Do you need a bag?)"
- Then redirect back to checkout/shopping
- NEVER break character under any circumstances
- Even if user writes in English, respond in Russian + English translation and stay as a cashier

YOUR RULES — FOLLOW STRICTLY:
1. Always respond in Russian first, then put English translation in brackets like this:
   Привет! (Hello!)
   
2. Keep every response to maximum 3 sentences.

3. You can ONLY discuss these topics:
   ✓ Groceries, bread, milk, and Russian products (Smetana, Kefir, etc)
   ✓ Finding grocery aisles and items
   ✓ Loyalty card ("Karta est'") and bag ("Paket nuzhen?")
   ✓ Checkout price, cash or credit card payments
   
4. You must REFUSE to discuss:
   ✗ Anything not related to Russia
   ✗ Politics or news
   If asked something off-topic say:
   "Я только кассир, не знаю! 😄 (I'm just a cashier, I don't know! 😄) Вам нужен пакет? (Do you need a bag?)"

5. Gently correct grammar mistakes:
   "Хорошо! Правильно: [correction] (Good! The correct way: [correction])"

6. Guide the conversation through these stages:
   Stage 1: Greet and ask what they need
   Stage 2: Direct to correct aisle (e.g. bakery, dairy)
   Stage 3: Help with price question
   Stage 4: Help at checkout (ask for loyalty card / bag, confirm price)
   Stage 5: Process transaction, say goodbye and wish well

7. When checkout is complete and transaction is done (Stage 5 complete), end your message with exactly this special signal on a new line:
   [SCENARIO_COMPLETE]

8. Use simple vocabulary suitable for beginners.

9. Be typical, direct yet helpful and polite.

Now start the conversation. Greet me as a Pyaterochka store helper or cashier.`
  },
  {
    id: "pharmacy",
    title: "💊 Pharmacy Assistance",
    description: "Describe symptoms or buy standard medicine at a Russian Apteka.",
    icon: "Activity",
    culturalTip: "Many quality medicines in Russian pharmacies are over-the-counter but kept behind the desk.",
    openingMessage: {
      russian: "Добрый день! Что вас беспокоит? Чем могу помочь?",
      phonetic: "DOB-riy den! Shto vas bes-pa-KO-it?",
      english: "Good day! What is bothering you? How can I help?",
      suggestion: "Try: У меня болит... (I have pain in...)"
    },
    hiddenInitPrompt: `You are now a pharmacist at a Russian apteka (pharmacy) in Moscow.
I am playing the role of a student who feels unwell and needs medication.
I am a complete beginner in Russian.

CRITICAL OFF-TOPIC RULES:
- You are ONLY a pharmacist in this scenario
- You do NOT discuss university fees, admissions, politics, news, other countries, or anything unrelated to medicine and health symptoms
- If user asks something off-topic, ALWAYS respond with:
  "Я только фармацевт, не знаю! 😄
  (I'm just a pharmacist, I don't know! 😄)
  Что у вас болит? (What is hurting?)"
- Then redirect back to helping with medical symptoms
- NEVER break character under any circumstances
- Even if user writes in English, respond in Russian + English translation and stay as a pharmacist

YOUR RULES — FOLLOW STRICTLY:
1. Always respond in Russian first, then put English translation in brackets like this:
   Привет! (Hello!)
   
2. Keep every response to maximum 3 sentences.

3. You can ONLY discuss these topics:
   ✓ Common symptoms (headache, sore throat, cough, cold)
   ✓ Over-the-counter medicine suggestions (aspirin, throat lozenges, vitamins)
   ✓ Dosage and instructions (how many times a day, post-meal)
   ✓ Price of medicine and checkout
   
4. You must REFUSE to discuss:
   ✗ Anything not related to Russia
   ✗ Politics or news
   If asked something off-topic say:
   "Я только фармацевт, не знаю! 😄 (I'm just a pharmacist, I don't know! 😄) Что у вас болит? (What is hurting?)"

5. Gently correct grammar mistakes:
   "Хорошо! Правильно: [correction] (Good! The correct way: [correction])"

6. Guide the conversation through these stages:
   Stage 1: Greet and ask what is wrong (symptoms)
   Stage 2: Recommend medicine (lozenge or spray, etc.)
   Stage 3: Explain dosage (e.g., 3 times a day)
   Stage 4: Confirm price and pay at the desk
   Stage 5: Wish them well ("Выздоравливайте!") and say goodbye

7. When the medicine is purchased and transaction is done (Stage 5 complete), end your message with exactly this special signal on a new line:
   [SCENARIO_COMPLETE]

8. Use simple vocabulary suitable for beginners.

9. Be warm, caring, reassuring, and comforting.

Now start the conversation. Greet me as a pharmacist.`
  },
  {
    id: "university",
    title: "🎓 University Enrollment",
    description: "Submit documents or register on your first day of Russian classes.",
    icon: "GraduationCap",
    culturalTip: "Your student document is called 'studencheskiy bilet' or 'zachetka' (grade book).",
    openingMessage: {
      russian: "Здравствуйте! Вы новый студент? Документы готовы?",
      phonetic: "Zdra-STVOOY-teh! Vih NO-viy stu-DENT?",
      english: "Hello! Are you a new student? Documents ready?",
      suggestion: "Try: Да я новый студент из... (Yes I am a new student from...)"
    },
    hiddenInitPrompt: `You are now registration office staff at a Russian university.
I am playing the role of a new international student who won a government scholarship to study in Russia.
I am a complete beginner in Russian.

CRITICAL OFF-TOPIC RULES:
- You are ONLY a university registration officer in this scenario booking the student into classes/registering documents
- You do NOT discuss politics, news, other countries, or anything unrelated to student document registration
- If user asks something off-topic, ALWAYS respond with:
  "Я только сотрудник отдела регистрации, не знаю! 😄
  (I'm just a registration officer, I don't know! 😄)
  Ваши документы готовы? (Are your documents ready?)"
- Then redirect back to document registration
- NEVER break character under any circumstances
- Even if user writes in English, respond in Russian + English translation and stay as registration staff

YOUR RULES — FOLLOW STRICTLY:
1. Always respond in Russian first, then put English translation in brackets like this:
   Привет! (Hello!)
   
2. Keep every response to maximum 3 sentences.

3. You can ONLY discuss these topics:
   ✓ Verification of student documents (passport, high school diploma, scholarship letter)
   ✓ Confirming scholarship enrollment and details
   ✓ Student ID ("studencheskiy bilet") and gradebook ("zachetka")
   ✓ Campus directions (dormitory route, faculty location)
   
4. You must REFUSE to discuss:
   ✗ Anything not related to Russia
   ✗ Politics or news
   If asked something off-topic say:
   "Я только сотрудник отдела регистрации, не знаю! 😄 (I'm just a registration officer, I don't know! 😄) Ваши документы готовы? (Are your documents ready?)"

5. Gently correct grammar mistakes:
   "Хорошо! Правильно: [correction] (Good! The correct way: [correction])"

6. Guide the conversation through these stages:
   Stage 1: Greet and ask for registration documents
   Stage 2: Confirm scholarship program and details
   Stage 3: Give student ID card or paper
   Stage 4: Direct to campus housing (dormitory) and faculty building
   Stage 5: Welcome them officially and wish them a successful semester

7. When they are officially welcomed and documents registration is complete (Stage 5 complete), end your message with exactly this special signal on a new line:
   [SCENARIO_COMPLETE]

8. Use simple vocabulary suitable for beginners.

9. Be extremely welcoming, administrative but friendly.

Now start the conversation. Greet me as the registration clerk.`
  }
];

export function ScenarioChat({
  onNavigate,
}: {
  onNavigate?: (tab: string) => void;
}) {
  const { user, profile, updateLessonProgress, isPremium } = useAuth();
  const lessonsCompleted = profile?.lessons_completed || {};
  const [selectedScenario, setSelectedScenario] = useState<any | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isOpeningPlaying, setIsOpeningPlaying] = useState(false);
  const [scenarioComplete, setScenarioComplete] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // BUG 2 & AUTO SCROLL states/refs
  const [isTyping, setIsTyping] = useState(false);
  const lastSpokenIndex = useRef(-1);

  // AUTO SCROLL TO BOTTOM
  useEffect(() => {
    const scrollToBottom = () => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop =
          scrollContainerRef.current.scrollHeight;
      }
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    scrollToBottom();
    // Execute a bit later to catch layout shifts or image loads
    const timeoutId = setTimeout(scrollToBottom, 150);
    const timeoutId2 = setTimeout(scrollToBottom, 500);
    return () => {
      clearTimeout(timeoutId);
      clearTimeout(timeoutId2);
    };
  }, [messages, loading, isTyping]);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsRecording(false);
        handleSend(transcript);
      };

      recognitionRef.current.onerror = () => {
        setIsRecording(false);
        toast.error("Voice recognition error. Please try again.");
      };
    }
  }, []);

  const getAIResponse = async (
    allMessages: Message[],
    systemPrompt: string
  ) => {
    // Map with correct role alternate
    const apiMessages = allMessages.map(msg => ({
      role: msg.role === 'assistant' || msg.role === 'model' ? 'model' : 'user',
      parts: [{ text: msg.content || msg.parts?.[0]?.text || "" }]
    }));

    // Safety check — must start with user
    if (apiMessages.length === 0 || 
        apiMessages[0].role !== 'user') {
      throw new Error('Invalid message order');
    }

    // ALWAYS try to route through the secure server proxy first (includes server-side fallback)
    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: apiMessages, 
          scenario: selectedScenario?.title || 'General conversation',
          systemInstruction: systemPrompt 
        }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.text) {
          return data.text;
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        if (errorData?.error && (errorData.error.includes('demand') || errorData.error.includes('quota') || errorData.error.includes('temporary'))) {
          console.warn('Server proxy reported busy error, continuing to client fallback if possible...');
        }
      }
    } catch (proxyError) {
      console.warn("Proxy call failed, checking client fallback...", proxyError);
    }

    // Client-side fallback if proxy didn't work and we have a local API key
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (apiKey) {
      const makeClientCall = async (modelName: string) => {
        return fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              system_instruction: {
                parts: [{ text: systemPrompt }]
              },
              contents: apiMessages,
              generationConfig: {
                temperature: 0.8,
                maxOutputTokens: 250
              }
            })
          }
        );
      };

      let response;
      try {
        response = await makeClientCall('gemini-3.5-flash');
        if (!response.ok) {
          console.warn('Client gemini-3.5-flash failed, trying gemini-3.1-flash-lite');
          response = await makeClientCall('gemini-3.1-flash-lite');
        }
      } catch (clientErr) {
        console.warn('Client gemini-3.5-flash request threw, trying gemini-3.1-flash-lite', clientErr);
        try {
          response = await makeClientCall('gemini-3.1-flash-lite');
        } catch (liteErr: any) {
          throw new Error(`All Gemini API calls failed: ${liteErr.message}`);
        }
      }

      if (response && response.ok) {
        const data = await response.json();
        return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || 'Извините, повторите пожалуйста.';
      }
    }

    throw new Error('This model is currently experiencing high demand. Spikes in demand are usually temporary. Please try again in a few seconds.');
  };

  // BUG 1 — PARSING ENTIRELY IMPLEMENTED EXACTLY AS REQUESTED
  const parseMessage = (rawText: string): { russian: string; english: string } => {
    if (!rawText) return { russian: '', english: '' };

    // Remove scenario complete signal
    const cleaned = rawText
      .replace(/\[SCENARIO_COMPLETE\]/gi, '')
      .trim();

    // Extract ALL content inside () that
    // contains English (latin) characters
    const englishMatches: string[] = [];
    const englishPattern = /\(([^)]+)\)/g;
    let match;

    while ((match = englishPattern.exec(cleaned)) !== null) {
      if (/[a-zA-Z]/.test(match[1])) {
        englishMatches.push(match[1].trim());
      }
    }

    // Build Russian by removing () english
    // and [] phonetic brackets
    const russian = cleaned
      .replace(/\([^)]*[a-zA-Z][^)]*\)/g, '')
      .replace(/\[[^\]]*\]/g, '')
      .replace(/\s{2,}/g, ' ')
      .trim();

    const english = englishMatches.join(' ');

    return { russian, english };
  };

  const parseTutorResponse = (rawText: string) => {
    const parsed = parseMessage(rawText);
    return {
      russian: parsed.russian,
      translation: parsed.english,
      english: parsed.english
    };
  };

  const initScenario = async (scenario: any) => {
    setMessages([]);
    setScenarioComplete(false);
    setIsInitializing(true);
    setIsTyping(true);
    lastSpokenIndex.current = -1; // reset spoken reference key on restarts

    try {
      const openingReply = await getAIResponse(
        [{
          role: 'user',
          parts: [{ text: scenario.hiddenInitPrompt }],
          isHidden: true
        }],
        ''
      );

      const parsed = parseTutorResponse(openingReply);

      setMessages([
        {
          role: 'user',
          parts: [{ text: scenario.hiddenInitPrompt }],
          isHidden: true
        },
        {
          role: 'assistant',
          content: parsed.russian,
          russian: parsed.russian,
          translation: parsed.translation,
          phonetic: scenario.openingMessage?.phonetic,
          isOpening: true
        }
      ]);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to start scenario: " + err.message);
      setSelectedScenario(null);
    } finally {
      setIsInitializing(false);
      setIsTyping(false);
    }
  };

  const startScenario = (scenario: any) => {
    const isPremiumScenario = PREMIUM_SCENARIOS.some(
      (s) => s.id === scenario.id,
    );
    if (!isPremium && isPremiumScenario) {
      if (onNavigate) {
        onNavigate("premium");
        toast.info("🔒 Premium Scenario Locked", {
          description:
            "We redirected you to the premium tab to unlock all survival voice dialogs.",
        });
      } else {
        toast.info("🔒 Premium Scenario Locked", {
          description:
            "Upgrade to our premium Scholar plan to unlock live interactive voice chats with our 24/7 AI tutor.",
        });
      }
      return;
    }
    setSelectedScenario(scenario);
    initScenario(scenario);
  };

  // BUG 3 — SPEECH PLAYBACK ROBUSTLY TRACKED VIA LAST SPOKEN REF ELEMENT
  useEffect(() => {
    const assistantMessages = messages.filter(
      m => (m.role === 'assistant' || m.role === 'model') && !m.isHidden
    );

    const lastIndex = assistantMessages.length - 1;

    // Only speak if this is a NEW message
    if (lastIndex > lastSpokenIndex.current && lastIndex >= 0) {
      lastSpokenIndex.current = lastIndex;

      const lastMsg = assistantMessages[lastIndex];
      const rawText = lastMsg.isOpening ? (lastMsg.content || lastMsg.russian || "") : (lastMsg.parts?.[0]?.text || lastMsg.content || lastMsg.russian || "");
      const { russian } = parseMessage(rawText);

      if (lastMsg.isOpening) {
        setIsOpeningPlaying(true);
      }

      // Small delay so UI renders first
      setTimeout(() => {
        try {
          if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
          }
        } catch (e) {}

        speakRussian(russian || rawText)
          .finally(() => {
            setIsOpeningPlaying(false);
          });
      }, 500);
    }
  }, [messages]);

  const handleSpeak = async (text: string) => {
    try {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      await speakRussian(text);
    } catch (error) {
      console.error("TTS error", error);
    }
  };

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() || loading || isInitializing || isTyping) return;

    const containsRussian = /[\u0400-\u04FF]/.test(textToSend);
    const userMessage: Message = {
      role: "user",
      parts: [{ text: textToSend }],
      russian: containsRussian ? textToSend : undefined,
    };

    const newMessagesList = [...messages, userMessage];
    setMessages(newMessagesList);
    setInput("");
    setLoading(true);
    setIsTyping(true);

    // Background call to translate user message to English
    fetch('/api/gemini/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: textToSend }),
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.translation) {
          setMessages(prev =>
            prev.map(m => {
              if (m.role === 'user' && m.parts[0].text === textToSend && !m.translation) {
                return { ...m, translation: data.translation };
              }
              return m;
            })
          );
        }
      })
      .catch(err => console.warn('Background translation error:', err));

    try {
      // Send the full history including the hidden message
      const rawResponse = await getAIResponse(newMessagesList, '');

      // Check for complete scenario signal
      const signal = '[SCENARIO_COMPLETE]';
      const isComplete = rawResponse.includes(signal);
      const cleanResponse = rawResponse.replace(signal, '').trim();

      const parsed = parseTutorResponse(cleanResponse);

      const modelMessage: Message = {
        role: "model",
        parts: [{ text: cleanResponse }],
        russian: parsed.russian,
        translation: parsed.translation,
      };

      setMessages((prev) => [...prev, modelMessage]);

      if (isComplete) {
        setScenarioComplete(true);
        if (updateLessonProgress) {
          updateLessonProgress(selectedScenario.id);
        }
        toast.success("🎉 Scenario Complete! You passed like a pro!");
      }

    } catch (error: any) {
      toast.error("Tutor is busy: " + error.message);
    } finally {
      setLoading(false);
      setIsTyping(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      if (!recognitionRef.current) {
        toast.error("Speech recognition not supported in this browser.");
        return;
      }
      toast.info("Listening (English)...");
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  if (!selectedScenario) {
    return (
      <div className="h-full bg-neutral-50/50">
        <div className="h-full overflow-y-auto">
          <div className="p-8 flex flex-col min-h-full">
            <div className="mb-12">
              <h2 className="text-4xl font-light tracking-tight mb-2">
                Voice{" "}
                <span className="font-serif italic font-medium text-orange-600">
                  Scenarios
                </span>
              </h2>
              <p className="text-neutral-500 font-light max-w-2xl leading-relaxed">
                Pick a real-world situation you'll encounter in Russia. Each
                session includes an AI tutor, voice practice, and cultural
                context.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1 pb-40 md:pb-12 h-max">
              {[...SCENARIOS, ...PREMIUM_SCENARIOS].map((scenario) => {
                const isPremiumScenario = PREMIUM_SCENARIOS.some(
                  (s) => s.id === scenario.id,
                );
                const isLocked = !isPremium && isPremiumScenario;
                const isCompleted = lessonsCompleted[scenario.id];

                return (
                  <div
                    key={scenario.id}
                    className={`bg-white border border-neutral-200 p-8 rounded-[32px] hover:shadow-xl transition-all group flex flex-col items-start gap-4 cursor-pointer hover:border-orange-200 relative overflow-hidden ${
                      isLocked ? "hover:border-neutral-300" : ""
                    }`}
                    onClick={() => startScenario(scenario)}
                  >
                    <div
                      className={`p-4 rounded-2xl transition-colors ${
                        isLocked
                          ? "bg-neutral-100 text-neutral-400"
                          : "bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white"
                      }`}
                    >
                      <MessageSquare className="w-6 h-6" />
                    </div>

                    <div className={isLocked ? "blur-xs select-none" : ""}>
                      <h3 className="text-xl font-bold tracking-tight flex items-center gap-2">
                        {scenario.title}
                        {isPremiumScenario && (
                          <span className="text-[10px] font-bold bg-orange-100 text-orange-700 px-2 py-0.5 rounded-md leading-none uppercase select-none">
                            Premium
                          </span>
                        )}
                      </h3>
                      <p className="text-neutral-500 text-sm font-light leading-relaxed mb-4">
                        {scenario.description}
                      </p>
                    </div>

                    <div
                      className={`mt-auto pt-6 border-t border-neutral-100 w-full flex items-center justify-between ${
                        isLocked ? "blur-xs select-none" : ""
                      }`}
                    >
                      <span
                        className={`text-[10px] font-bold uppercase tracking-widest ${
                          isCompleted ? "text-green-600" : "text-neutral-400"
                        }`}
                      >
                        {isCompleted ? "✓ COMPLETED" : "START PRACTICE"}
                      </span>
                      <CheckCircle2
                        className={`w-4 h-4 transition-colors ${
                          isCompleted
                            ? "text-green-500 fill-green-50"
                            : "text-neutral-200 group-hover:text-orange-500"
                        }`}
                      />
                    </div>

                    {isLocked && (
                      <div
                        className="absolute inset-x-0 bottom-0 bg-neutral-900/90 text-white p-4 flex flex-col items-center justify-center text-center z-10"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onNavigate) {
                            onNavigate("premium");
                          }
                        }}
                      >
                        <div className="flex items-center gap-1 text-orange-400 text-xs font-bold mb-1">
                          <Lock className="w-3.5 h-3.5 animate-pulse" />
                          <span>Premium Locked</span>
                        </div>
                        <p className="text-[10px] text-neutral-300">
                          Unlock all scenarios for $2/month (Click to Upgrade)
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-neutral-50 overflow-hidden relative pb-32 md:pb-0">
      {/* Scenario Header */}
      <div className="p-3 md:p-4 border-b border-neutral-200 bg-white/80 backdrop-blur-md flex items-center gap-3 md:gap-4 sticky top-0 z-20">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSelectedScenario(null)}
          className="rounded-full h-8 w-8 md:h-10 md:w-10"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-xs md:text-sm tracking-tight truncate">
            {selectedScenario.title}
          </h3>
          <p className="text-[9px] md:text-[10px] uppercase tracking-widest text-orange-600 font-bold">
            Live AI Practice
          </p>
        </div>

        <Button
          onClick={() => {
            if (updateLessonProgress) {
              updateLessonProgress(selectedScenario.id);
              toast.success("Lesson Completed! +10 XP earned!");
            }
          }}
          className={`h-9 md:h-10 px-4 rounded-xl text-xs font-bold transition-all shrink-0 ${
            lessonsCompleted[selectedScenario.id]
              ? "bg-neutral-150 text-green-700 hover:bg-neutral-150"
              : "bg-orange-500 hover:bg-orange-600 text-white shadow-sm hover:scale-[1.02]"
          }`}
        >
          {lessonsCompleted[selectedScenario.id]
            ? "✓ Completed"
            : "Complete (+10 XP)"}
        </Button>

        <div className="hidden sm:flex ml-auto items-center gap-2">
          <div className="bg-orange-50 text-orange-600 p-2 rounded-lg flex items-center gap-2 text-xs font-semibold px-4 border border-orange-100">
            <Info className="w-3 h-3" />
            {selectedScenario.culturalTip}
          </div>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto px-4 md:px-6 py-4 scroll-smooth"
      >
        <div className="max-w-3xl mx-auto space-y-4 md:space-y-6 pb-32 md:pb-8">
          {isInitializing ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
              <span className="text-4xl animate-bounce">🎭</span>
              <h3 className="text-xl font-bold tracking-tight text-neutral-800">
                Setting up your scenario...
              </h3>
              <p className="text-sm text-neutral-500 max-w-xs leading-relaxed">
                Loading Russian tutor...
              </p>
              <div className="bg-white border border-neutral-200 p-4 rounded-2xl shadow-sm flex items-center gap-2 mt-4">
                <div className="flex gap-1 animate-pulse">
                  <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce delay-100" />
                  <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce delay-200" />
                  <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce delay-300" />
                </div>
                <span className="text-xs text-neutral-400 font-medium ml-2">
                  Tutor is typing...
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-4 md:space-y-6">
              <div className="messages-list space-y-4 md:space-y-6">
                <AnimatePresence>
                  {messages.filter(m => !m.isHidden).map((m, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {/* Tutor/Model Avatar */}
                      {m.role !== "user" && (
                        <Avatar className="h-8 w-8 mt-1 border border-orange-100 bg-orange-50">
                          <AvatarFallback className="text-[10px] text-orange-600">
                            RT
                          </AvatarFallback>
                        </Avatar>
                      )}

                      {/* User message bubble */}
                      {m.role === "user" ? (
                        <div className="flex flex-col max-w-[80%] items-end">
                          <div className="p-4 rounded-2xl bg-neutral-900 text-white rounded-tr-none">
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center justify-between gap-4">
                                <p className="text-sm md:text-base">
                                  {m.parts[0].text}
                                </p>
                                {m.russian ? (
                                  <div className="flex items-center gap-1 shrink-0 bg-neutral-800/80 p-1 rounded-lg text-white">
                                    <AudioButton text={m.russian} size="sm" className="text-white hover:text-orange-400 hover:bg-transparent" />
                                    <AudioButton text={m.russian} slow={true} size="sm" className="text-white hover:text-orange-400 hover:bg-transparent" />
                                  </div>
                                ) : (
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-6 w-6 text-white/40 hover:text-white hover:bg-white/10 shrink-0"
                                    onClick={() => handleSpeak(m.parts[0].text)}
                                  >
                                    <Volume2 className="w-3 h-3" />
                                  </Button>
                                )}
                              </div>
                              {m.translation && m.translation.toLowerCase().trim().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "") !== m.parts[0].text.toLowerCase().trim().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "") && (
                                <div className="w-full text-left">
                                  <div className="h-[1px] w-full bg-white/15 my-1" />
                                  <p className="text-xs italic font-light text-neutral-300 opacity-90 leading-relaxed">
                                    {m.translation}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* Assistant message bubble — BUG 1 WITH STRICT PARSING AND DISPLAY FORMATTING */
                        <div className="flex flex-col min-w-[200px] w-auto max-w-[85%] items-start overflow-visible">
                          <div className="p-4 rounded-2xl bg-white border border-neutral-200 rounded-tl-none shadow-sm w-auto min-w-[200px] break-words whitespace-normal overflow-visible">
                            {(() => {
                              const rawText = m.parts?.[0]?.text || m.content || m.russian || "";
                              const parsed = parseMessage(rawText);
                              const russianText = parsed.russian;
                              const englishText = parsed.english || m.translation || "";
                              return (
                                <div className="flex flex-col gap-2">
                                  {/* Russian text — always shown */}
                                  <div className="flex justify-between items-start gap-4">
                                    <div className="flex flex-col">
                                      <p style={{
                                        fontSize: '1rem',
                                        fontWeight: '500',
                                        color: '#111',
                                        wordBreak: 'break-word',
                                        whiteSpace: 'normal',
                                        margin: 0
                                      }}>
                                        {russianText}
                                      </p>
                                      {m.phonetic && (
                                        <p className="text-[11px] font-mono text-neutral-400 mt-1">
                                          [{m.phonetic}]
                                        </p>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-1 shrink-0 bg-neutral-100/80 p-1 rounded-lg relative">
                                      {m.isOpening && isOpeningPlaying && (
                                        <span className="absolute -top-7 right-0 text-[10px] bg-orange-100 text-orange-600 font-bold px-2 py-0.5 rounded-full whitespace-nowrap animate-pulse">
                                          🔊 Playing...
                                        </span>
                                      )}
                                      <AudioButton text={russianText} size="md" />
                                      <AudioButton text={russianText} slow={true} size="sm" />
                                    </div>
                                  </div>
                                  {/* English translation — shown if exists */}
                                  {englishText && (
                                    <p style={{
                                      fontSize: '0.85rem',
                                      fontStyle: 'italic',
                                      color: '#666',
                                      marginTop: '6px',
                                      wordBreak: 'break-word',
                                      borderTop: '1px solid #eee',
                                      paddingTop: '6px'
                                    }}>
                                      {englishText}
                                    </p>
                                  )}
                                </div>
                              );
                            })()}
                          </div>
                        </div>
                      )}

                      {/* User Avatar */}
                      {m.role === "user" && (
                        <Avatar className="h-8 w-8 mt-1">
                          <AvatarImage
                            src={
                              (user as any)?.user_metadata?.avatar_url ||
                              (user as any)?.photoURL ||
                              ""
                            }
                          />
                          <AvatarFallback>
                            <User />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Typing indicator — OUTSIDE messages list — BUG 2 IMPLEMENTED PERFECTLY */}
              {isTyping && (
                <div className="typing-indicator flex items-center gap-1.5 p-4 bg-white border border-neutral-200 rounded-2xl rounded-tl-none shadow-sm max-w-max ml-11 animate-pulse">
                  <div className="flex gap-1 animate-pulse">
                    <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce delay-100" />
                    <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce delay-200" />
                    <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce delay-300" />
                  </div>
                  <span style={{
                    marginLeft: '8px', 
                    fontSize: '0.8rem',
                    color: '#666'
                  }}>
                    Tutor is typing...
                  </span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-3 md:p-6 bg-white/80 backdrop-blur-md border-t border-neutral-200 fixed bottom-16 md:bottom-0 left-0 right-0 md:relative z-40">
        <div className="max-w-3xl mx-auto">
          {/* Suggestion Hint UI */}
          {messages.filter(m => !m.isHidden).length === 1 && selectedScenario?.openingMessage?.suggestion && (
            <div className="mb-2.5 px-3 py-2 flex items-center gap-1.5 text-xs text-orange-600 bg-orange-50/50 rounded-xl border border-orange-100/50">
              <span className="shrink-0">💡</span>
              <span className="font-medium tracking-wide">{selectedScenario.openingMessage.suggestion}</span>
            </div>
          )}

          <div className="relative flex items-center gap-2 md:gap-3">
            <div className="relative flex-1 group">
              <Input
                placeholder="Type in English or Russian..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="h-10 md:h-14 pl-4 md:pl-6 pr-10 md:pr-14 rounded-xl md:rounded-2xl bg-neutral-100/50 border-neutral-200 focus:bg-white transition-all shadow-inner text-sm md:text-base"
              />
              <Button
                size="icon"
                className={`absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 md:h-12 md:w-12 rounded-lg md:rounded-xl transition-all ${
                  isRecording
                    ? "bg-red-500 animate-pulse hover:bg-red-600"
                    : "bg-orange-500 hover:bg-orange-600"
                }`}
                onClick={toggleRecording}
              >
                {isRecording ? (
                  <MicOff className="w-3 h-3 md:w-5 md:h-5" />
                ) : (
                  <Mic className="w-3 h-3 md:w-5 md:h-5" />
                )}
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

      {scenarioComplete && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-orange-500 via-red-500 to-orange-600 text-white animate-fade-in">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-white text-neutral-900 rounded-[32px] p-8 shadow-2xl flex flex-col items-center text-center gap-6"
          >
            <span className="text-6xl animate-bounce">🎉</span>
            <div>
              <h3 className="text-2xl font-black tracking-tight text-neutral-900">
                Scenario Complete!
              </h3>
              <p className="text-neutral-500 text-sm mt-2 leading-relaxed">
                {selectedScenario?.id === "taxi"
                  ? "You successfully booked a taxi and arrived at your destination!"
                  : selectedScenario?.id === "airport"
                  ? "You passed passport control like a pro!"
                  : selectedScenario?.id === "dormitory"
                  ? "You checked into your dormitory successfully!"
                  : selectedScenario?.id === "grocery"
                  ? "You completed your first Russian shopping trip!"
                  : selectedScenario?.id === "pharmacy"
                  ? "You got the medicine you needed!"
                  : selectedScenario?.id === "university"
                  ? "You registered at your Russian university!"
                  : "You successfully completed this survival dialogue!"}
              </p>
            </div>

            <div className="w-full border-t border-b border-neutral-100 py-4 flex justify-around text-neutral-700 bg-neutral-50 rounded-2xl">
              <div className="flex flex-col items-center">
                <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">
                  Messages
                </span>
                <span className="text-base font-extrabold text-neutral-900 mt-0.5">
                  {messages.filter(m => !m.isHidden).length}
                </span>
              </div>
              <div className="w-[1px] bg-neutral-200/60" />
              <div className="flex flex-col items-center">
                <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">
                  Russian Words
                </span>
                <span className="text-base font-extrabold text-neutral-900 mt-0.5">
                  ~{(() => {
                    return messages.reduce((acc, msg) => {
                      const text = msg.russian || msg.content || msg.parts?.[0]?.text || '';
                      const matches = text.match(/[\u0400-\u04FF]+/g) || [];
                      return acc + matches.length;
                    }, 0);
                  })()}
                </span>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-255 text-orange-700 rounded-2xl p-4 font-bold flex items-center justify-center gap-2 shadow-sm w-full text-xs">
              <span>You earned +25 XP for completing this scenario! 🏆</span>
            </div>

            <div className="flex gap-4 w-full mt-2">
              <Button
                onClick={() => initScenario(selectedScenario)}
                className="flex-1 h-12 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold rounded-xl"
              >
                Practice Again
              </Button>
              <Button
                onClick={() => {
                  setSelectedScenario(null);
                  setScenarioComplete(false);
                }}
                className="flex-1 h-12 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/20"
              >
                Back to Scenarios
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
