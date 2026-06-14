import React, { useState, useEffect } from 'react';
import { useAuth } from '@/App';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  BookOpen, 
  MessageSquare, 
  BookOpenCheck, 
  User, 
  Video, 
  BookText,
  Smartphone,
  CheckCircle2,
  Lock,
  Trophy,
  Plane,
  Star,
  Sparkles,
  Wifi,
  Battery,
  Signal,
  SmartphoneIcon,
  Globe,
  QrCode,
  Info,
  Copy,
  ExternalLink,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { AlphabetView } from '@/components/AlphabetView';
import { ScenarioChat } from '@/components/ScenarioChat';
import { VocabularyView } from '@/components/VocabularyView';
import { ProfileView } from '@/components/ProfileView';
import { LecturesView } from '@/components/LecturesView';
import { GrammarView } from '@/components/GrammarView';
import { DailyLesson } from '@/components/DailyLesson';
import { WordOfTheDay } from '@/components/WordOfTheDay';
import { format, differenceInDays } from 'date-fns';
import { toast } from 'sonner';

export function MobileAppView({ onBackToWeb }: { onBackToWeb?: () => void }) {
  const { user, profile, isPremium } = useAuth();
  
  // Track active state of the simulated phone
  const [isPowerOn, setIsPowerOn] = useState(true);
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [mobileTab, setMobileTab] = useState<'home' | 'learn' | 'ai-tutor' | 'vocab' | 'profile'>('home');
  const [subLearnSection, setSubLearnSection] = useState<'none' | 'alphabet' | 'grammar' | 'lectures'>('none');
  const [showNotification, setShowNotification] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currentTime, setCurrentTime] = useState('09:41');

  // Trigger clock update
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1005);
    return () => clearInterval(interval);
  }, []);

  // Trigger random notification to simulate app alert
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNotification(true);
      // Play a subtle beep if allowed
      try {
        const audio = new Audio("data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAAAn");
        audio.volume = 0.15;
        audio.play().catch(() => {});
      } catch (e) {}
    }, 4500);

    return () => clearTimeout(timer);
  }, []);

  // Set battery drain timer
  useEffect(() => {
    const interval = setInterval(() => {
      setBatteryLevel(prev => Math.max(15, prev - 1));
    }, 120000);
    return () => clearInterval(interval);
  }, []);

  const copyUrlToClipboard = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      toast.success("Mobile Access URL copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const displayName = user?.displayName || profile?.displayName || 'Scholar';
  const firstName = displayName.split(' ')[0];
  const activeStreakVal = profile?.streak_count || 0;

  const intakeDate = new Date('2026-09-01T00:00:00Z');
  const daysRemaining = Math.max(0, differenceInDays(intakeDate, new Date()));

  // Render sub sections beautifully inside sub viewports
  const renderLearnSubSection = () => {
    switch (subLearnSection) {
      case 'alphabet':
        return (
          <div className="h-full flex flex-col">
            <div className="bg-neutral-50 px-3 py-2 border-b border-neutral-200 flex items-center justify-between sticky top-0 z-10 shrink-0">
              <button 
                onClick={() => setSubLearnSection('none')} 
                className="flex items-center text-xs font-semibold text-orange-600 gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Back to Sections
              </button>
              <span className="text-xs font-bold text-neutral-800">Cyrillic Alphabet</span>
            </div>
            <div className="flex-1 overflow-auto bg-white">
              <AlphabetView />
            </div>
          </div>
        );
      case 'grammar':
        return (
          <div className="h-full flex flex-col">
            <div className="bg-neutral-50 px-3 py-2 border-b border-neutral-200 flex items-center justify-between sticky top-0 z-10 shrink-0">
              <button 
                onClick={() => setSubLearnSection('none')} 
                className="flex items-center text-xs font-semibold text-orange-600 gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Back to Sections
              </button>
              <span className="text-xs font-bold text-neutral-800">Grammar Rules</span>
            </div>
            <div className="flex-1 overflow-auto bg-white">
              <GrammarView />
            </div>
          </div>
        );
      case 'lectures':
        return (
          <div className="h-full flex flex-col">
            <div className="bg-neutral-50 px-3 py-2 border-b border-neutral-200 flex items-center justify-between sticky top-0 z-10 shrink-0">
              <button 
                onClick={() => setSubLearnSection('none')} 
                className="flex items-center text-xs font-semibold text-orange-600 gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Back to Sections
              </button>
              <span className="text-xs font-bold text-neutral-800">Video Seminars</span>
            </div>
            <div className="flex-1 overflow-auto relative">
              <div className={`h-full ${!isPremium ? 'blur-xs select-none pointer-events-none' : ''}`}>
                <LecturesView />
              </div>
              {!isPremium && (
                <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center z-10">
                  <div className="bg-white/95 p-4 rounded-2xl max-w-[240px] shadow-lg border border-neutral-200">
                    <Lock className="w-5 h-5 text-orange-500 mx-auto mb-2" />
                    <h4 className="text-sm font-bold text-neutral-800">Lectures Locked</h4>
                    <p className="text-[10px] text-neutral-500 mb-3 font-light">
                      Subscribers can view special embassy-vetted university lectures.
                    </p>
                    <button 
                      onClick={() => setMobileTab('profile')}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-lg py-1.5 text-xs font-semibold transition-all"
                    >
                      Unlock for $2/mo
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      default:
        // Render learning main topics
        return (
          <div className="p-4 space-y-6 overflow-auto h-full pb-24">
            <div>
              <span className="text-[10px] font-bold text-orange-600 uppercase tracking-widest block mb-0.5">Structured Path</span>
              <h2 className="text-xl font-bold font-serif text-neutral-850">Learn Russian</h2>
              <p className="text-neutral-500 text-xs font-light">Engage with university topics curated for international candidates.</p>
            </div>

            {/* Topics layout */}
            <div className="space-y-3">
              <div 
                onClick={() => setSubLearnSection('alphabet')}
                className="bg-neutral-50 p-4 border border-neutral-200/80 rounded-2xl hover:border-orange-200 transition-all flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-orange-100 flex items-center justify-center rounded-xl text-orange-600 font-bold text-sm shrink-0">
                    Аб
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-neutral-850">1. Alphabet Master</h3>
                    <p className="text-[10px] text-neutral-400 font-light">Cyrillic scripts & phonetics</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-orange-500 transition-colors" />
              </div>

              <div 
                onClick={() => setSubLearnSection('grammar')}
                className="bg-neutral-50 p-4 border border-neutral-200/80 rounded-2xl hover:border-orange-200 transition-all flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-orange-100 flex items-center justify-center rounded-xl text-orange-600 shrink-0">
                    <BookText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-neutral-850">2. Grammar Essentials</h3>
                    <p className="text-[10px] text-neutral-400 font-light">Cases, objects & suffix rules</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-orange-500 transition-colors" />
              </div>

              <div 
                onClick={() => setSubLearnSection('lectures')}
                className="bg-neutral-50 p-4 border border-neutral-200/80 rounded-2xl hover:border-orange-200 transition-all flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3 relative">
                  <div className="w-9 h-9 bg-orange-100 flex items-center justify-center rounded-xl text-orange-600 shrink-0">
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-neutral-850 flex items-center gap-1">
                      3. University Lectures {!isPremium && <Lock className="w-2.5 h-2.5 text-neutral-400" />}
                    </h3>
                    <p className="text-[10px] text-neutral-400 font-light">HSE & RUDN lecture series</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-orange-500 transition-colors" />
              </div>
            </div>

            {/* Travel tips widget */}
            <div className="bg-orange-50/50 p-4 border border-orange-100 rounded-2xl">
              <span className="text-[9px] font-bold text-orange-600 uppercase tracking-widest block mb-1">✈️ Russian Travel Tip</span>
              <p className="text-[11px] text-orange-850 font-light leading-relaxed">
                When flying, you can download local offline Russian dictionaries to translate subway signage easily step by step. Try using standard translator lenses!
              </p>
            </div>
          </div>
        );
    }
  };

  const renderActiveTab = () => {
    switch (mobileTab) {
      case 'home':
        return (
          <div className="p-4 space-y-5 overflow-auto h-full pb-24">
            {/* Greeting */}
            <header className="flex items-center justify-between">
              <div>
                <span className="text-[9px] font-semibold text-neutral-400 uppercase tracking-widest block">Welcome back</span>
                <h3 className="text-lg font-serif italic text-neutral-850">Привет, {firstName}!</h3>
              </div>
              <Badge className="bg-orange-50 border border-orange-200 text-orange-600 text-[10px] font-bold px-2 py-0.5">
                {profile?.scholarshipType || 'Scholar'} Candidate
              </Badge>
            </header>

            {/* Streak & Coins */}
            <div className="bg-neutral-900 text-white p-4 rounded-2xl space-y-3 shadow-md border border-neutral-850">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-orange-400 flex items-center gap-1">
                    🔥 {activeStreakVal}-Day Streak
                  </div>
                  <div className="text-[10px] text-neutral-400">Target: {profile?.daily_goal_minutes || 10}m daily learning</div>
                </div>
                <div className="bg-neutral-800 text-neutral-200 rounded-xl px-2.5 py-1 text-xs font-bold border border-neutral-700 flex items-center gap-1 leading-none shrink-0">
                  🏆 {profile?.xp_points || 0} XP
                </div>
              </div>
              {/* Simple daily progress bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[9px] text-neutral-400 font-semibold">
                  <span>Weekly Streak Goal</span>
                  <span>{activeStreakVal}/7 Complete</span>
                </div>
                <div className="w-full bg-neutral-800 h-1 rounded-full overflow-hidden">
                  <div 
                    className="bg-orange-500 h-full rounded-full transition-all"
                    style={{ width: `${Math.min(100, (activeStreakVal / 7) * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Countdown Widget */}
            <div className="bg-orange-50/60 p-3.5 border border-orange-100 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
                <Plane className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <div className="text-sm font-bold text-neutral-800">{daysRemaining} Days</div>
                <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest leading-none">Sept University Intake</div>
              </div>
            </div>

            {/* Daily Lesson Card */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Today's Mission</h4>
                <button 
                  onClick={() => setMobileTab('learn')}
                  className="text-[10px] font-semibold text-orange-600 hover:underline"
                >
                  See All
                </button>
              </div>
              <div className="bg-white rounded-2xl border border-neutral-250 p-1">
                <DailyLesson />
              </div>
            </div>

            {/* Word of the Day */}
            <div>
              <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">Word Of the Day</h4>
              <div className="bg-white rounded-2xl border border-neutral-250">
                <WordOfTheDay />
              </div>
            </div>
          </div>
        );
      case 'learn':
        return renderLearnSubSection();
      case 'ai-tutor':
        // Reuse direct scenario speech chat
        return (
          <div className="h-full flex flex-col bg-white">
            <div className="bg-orange-50 px-3/5 py-2.5 border-b border-orange-100/50 flex items-center gap-2 sticky top-0 z-10 shrink-0">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-orange-950 flex items-center gap-1">
                  AI Voice Scholar Tutor <Sparkles className="w-3 h-3 text-orange-500 fill-orange-400 shrink-0" />
                </h4>
                <p className="text-[9px] text-orange-800 leading-none">Simulating real-world voice conversations</p>
              </div>
            </div>
            <div className="flex-1 overflow-hidden relative">
              <ScenarioChat onNavigate={(tab) => {
                if (tab === 'premium') setMobileTab('profile');
              }} />
            </div>
          </div>
        );
      case 'vocab':
        return (
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-hidden relative">
              <VocabularyView onNavigate={(tab) => {
                if (tab === 'premium') setMobileTab('profile');
              }} />
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="h-full overflow-auto bg-neutral-50 flex flex-col">
            <div className="flex-1">
              <ProfileView onNavigate={(tab) => {
                // Handle tab redirect triggers
                if (tab === 'home') setMobileTab('home');
              }} />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 w-full flex flex-col">
      {/* Top Banner Swapper Panel */}
      <div className="bg-white border-b border-neutral-200/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-50 rounded-xl text-orange-600">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm md:text-base font-bold text-neutral-850">
                Russian Scholar Mobile Native Environment
              </h2>
              <p className="text-[11px] md:text-xs text-neutral-400 font-light mt-0.5">
                Testing app components directly in standard mobile viewport layouts.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              id="mobile-back-to-web"
              variant="outline"
              onClick={onBackToWeb}
              className="border-neutral-200 rounded-xl text-xs h-9 cursor-pointer hover:bg-neutral-50 flex items-center gap-1.5"
            >
              <Globe className="w-3.5 h-3.5 text-neutral-500" /> Switch to Large Web Portal
            </Button>
            <Button
              onClick={copyUrlToClipboard}
              className="bg-neutral-900 text-white border-none rounded-xl text-xs h-9 font-semibold hover:bg-black cursor-pointer flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" />
              {copied ? "Copied!" : "Get Phone Link QR"}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Container: Sandbox layout */}
      <div className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start justify-center">
        
        {/* Left Aspect: Device Instructions Sheet */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-neutral-250 shadow-xs bg-white rounded-3xl overflow-hidden">
            <CardHeader className="bg-neutral-50/50 border-b border-neutral-150 p-5">
              <CardTitle className="text-base font-bold flex items-center gap-2 text-neutral-800">
                <Info className="w-4 h-4 text-orange-600" /> Installation & Phone Access
              </CardTitle>
              <CardDescription className="text-xs">
                Run this platform directly as a progressive mobile application.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-5">
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center font-bold text-xs text-orange-600 shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-800">Scan or Load on your Phone</h4>
                    <p className="text-[11px] text-neutral-400 font-light leading-relaxed mt-0.5">
                      Open this development link on your real mobile phone browser to experience the raw interface with touch gestures.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center font-bold text-xs text-orange-600 shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-800">Add to Home Screen (PWA)</h4>
                    <p className="text-[11px] text-neutral-400 font-light leading-relaxed mt-0.5">
                      On iOS, tap the <span className="font-bold font-sans">Share icon</span> then select <span className="font-bold font-sans">"Add to Home Screen"</span>. On Android, tap the three dots then select <span className="font-semibold">"Install App"</span>.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center font-bold text-xs text-orange-600 shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-800">Reusable Components Shared</h4>
                    <p className="text-[11px] text-neutral-400 font-light leading-relaxed mt-0.5">
                      Both architectures are completely integrated. Lesson state, XP rewards, scholarship tags, and streak trackers synchronize instantaneously!
                    </p>
                  </div>
                </div>
              </div>

              {/* QR Code Graphic & Sandbox link */}
              <div className="border border-neutral-200/60 rounded-2xl bg-neutral-50/50 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">Live Scan</span>
                  <p className="text-xs font-bold text-neutral-800">Open on actual Device</p>
                  <p className="text-[10px] text-neutral-500 font-light leading-normal">
                    Scanning navigates dynamically to the responsive view built directly inside this project repository.
                  </p>
                  <button 
                    onClick={copyUrlToClipboard}
                    className="text-[10px] text-orange-600 hover:underline font-bold mt-1.5 flex items-center gap-1 cursor-pointer"
                  >
                    Copy Address <ExternalLink className="w-2.5 h-2.5" />
                  </button>
                </div>
                {/* QR Symbol representation */}
                <div className="bg-white p-3 border border-neutral-200 rounded-xl shrink-0 shadow-2xs flex flex-col items-center">
                  <QrCode className="w-18 h-18 text-neutral-800" />
                  <span className="text-[8px] text-neutral-400 font-bold uppercase tracking-widest mt-1">Dev Router</span>
                </div>
              </div>

              {/* Status information */}
              <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 flex gap-3 text-orange-800">
                <CheckCircle2 className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold">100% Component Unified</h4>
                  <p className="text-[10px] text-orange-850 font-light leading-relaxed">
                    Unlike writing separate code projects (forcing redundant API endpoints, duplicate assets, and double databases), we've written modular components that instantly render for both large web browsers and small touch screens.
                  </p>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>


        {/* Right Aspect: Fully functioning Mobile Smartphone Frame Simulator */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center p-2 relative">
          
          {/* Simulated hardware power button and volume buttons */}
          <div className="absolute top-[160px] -left-1 w-1.5 h-10 bg-neutral-400 rounded-l-md z-0 shadow-xs transition-all active:scale-95 cursor-pointer hover:bg-neutral-500" title="Vol Up" />
          <div className="absolute top-[210px] -left-1 w-1.5 h-10 bg-neutral-400 rounded-l-md z-0 shadow-xs transition-all active:scale-95 cursor-pointer hover:bg-neutral-500" title="Vol Down" />
          <div className="absolute top-[180px] -right-1 w-1.5 h-14 bg-neutral-500 rounded-r-md z-0 shadow-xs transition-all active:bg-orange-500 cursor-pointer" title="Sleep / Power Toggle" onClick={() => setIsPowerOn(!isPowerOn)} />

          <div className="relative w-full max-w-[365px] h-[720px] rounded-[48px] border-[10px] border-neutral-900 shadow-2xl bg-neutral-950 overflow-hidden flex flex-col select-none transition-all">
            
            {/* Dynamic Island Pill */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-5.5 bg-neutral-900 rounded-full z-50 flex items-center justify-between px-3 p-[3px] shadow-inner">
              <div className="w-2.5 h-2.5 rounded-full bg-neutral-800 flex items-center justify-center overflow-hidden border border-neutral-950/40">
                <div className="w-1 h-1 rounded-full bg-blue-900 animate-pulse" />
              </div>
              {/* Decorative green point active trigger */}
              <span className="w-1 h-1 bg-emerald-500 rounded-full animate-ping" />
            </div>

            {isPowerOn ? (
              /* ACTIVE PHONE STATE */
              <div className="bg-white flex-1 flex flex-col h-full overflow-hidden relative">
                
                {/* Simulated Notification Banner Overlay */}
                {showNotification && (
                  <div className="absolute top-10 left-3 right-3 bg-neutral-900/95 backdrop-blur-md text-white px-3.5 py-3 rounded-2xl z-50 shadow-lg border border-neutral-800 flex items-start gap-2.5 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                      РШ
                    </div>
                    <div className="flex-1 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-orange-400">Streak Reminder!</span>
                        <span className="text-[8px] text-neutral-400">Just now</span>
                      </div>
                      <p className="text-[10px] font-semibold text-neutral-100">Daily Cyrillic Review</p>
                      <p className="text-[9px] text-neutral-400 font-light leading-normal">
                        Ready for your next step candidate? Don't break your {activeStreakVal}-day target!
                      </p>
                    </div>
                    <button 
                      onClick={() => setShowNotification(false)}
                      className="text-neutral-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* SIMULATED STATUS BAR */}
                <div className="bg-white text-neutral-800 px-6 pt-1.5 pb-1 flex items-center justify-between shrink-0 text-[10px] font-semibold tracking-tight leading-none z-30 select-none">
                  {/* Local Simulated Time */}
                  <span className="pl-1 text-[11px]">{currentTime}</span>
                  {/* Simulated Connections indicators */}
                  <div className="flex items-center gap-1.5 pr-1">
                    <Signal className="w-3 h-3 text-neutral-800" />
                    <span className="text-[8px] uppercase">LTE</span>
                    <Wifi className="w-3.5 h-3.5 text-neutral-800" />
                    <div className="flex items-center gap-1 ml-0.5">
                      <span className="text-[9px] font-bold">{batteryLevel}%</span>
                      <Battery className="w-4 h-4 text-neutral-800 shrink-0" />
                    </div>
                  </div>
                </div>

                {/* SIMULATED RAW MOBILE LAYOUT ROOT */}
                <div className="flex-1 bg-white overflow-hidden relative z-20">
                  {renderActiveTab()}
                </div>

                {/* SIMULATED BOTTOM TAB BAR */}
                <div className="bg-white/95 border-t border-neutral-200 px-1 py-1 pb-4 flex justify-around items-center sticky bottom-0 z-35 shrink-0 select-none">
                  <button
                    onClick={() => { setMobileTab('home'); setSubLearnSection('none'); }}
                    className={`flex flex-col items-center justify-center py-1 flex-1 transition-colors ${
                      mobileTab === 'home' ? 'text-orange-600' : 'text-neutral-400 hover:text-neutral-600'
                    }`}
                  >
                    <Home className="w-4.5 h-4.5" />
                    <span className="text-[8px] font-bold mt-1 uppercase tracking-tight">Home</span>
                  </button>

                  <button
                    onClick={() => { setMobileTab('learn'); setSubLearnSection('none'); }}
                    className={`flex flex-col items-center justify-center py-1 flex-1 transition-colors ${
                      mobileTab === 'learn' ? 'text-orange-600' : 'text-neutral-400 hover:text-neutral-600'
                    }`}
                  >
                    <BookOpen className="w-4.5 h-4.5" />
                    <span className="text-[8px] font-bold mt-1 uppercase tracking-tight">Learn</span>
                  </button>

                  <button
                    onClick={() => { setMobileTab('ai-tutor'); setSubLearnSection('none'); }}
                    className={`flex flex-col items-center justify-center py-1 flex-1 transition-colors ${
                      mobileTab === 'ai-tutor' ? 'text-orange-600' : 'text-neutral-400 hover:text-neutral-600'
                    }`}
                  >
                    <MessageSquare className="w-4.5 h-4.5 animate-bounce-subtle" />
                    <span className="text-[8px] font-bold mt-1 uppercase tracking-tight">AI Tutor</span>
                  </button>

                  <button
                    onClick={() => { setMobileTab('vocab'); setSubLearnSection('none'); }}
                    className={`flex flex-col items-center justify-center py-1 flex-1 transition-colors ${
                      mobileTab === 'vocab' ? 'text-orange-600' : 'text-neutral-400 hover:text-neutral-600'
                    }`}
                  >
                    <BookOpenCheck className="w-4.5 h-4.5" />
                    <span className="text-[8px] font-bold mt-1 uppercase tracking-tight">Vocab</span>
                  </button>

                  <button
                    onClick={() => { setMobileTab('profile'); setSubLearnSection('none'); }}
                    className={`flex flex-col items-center justify-center py-1 flex-1 transition-colors ${
                      mobileTab === 'profile' ? 'text-orange-600' : 'text-neutral-400 hover:text-neutral-600'
                    }`}
                  >
                    <User className="w-4.5 h-4.5" />
                    <span className="text-[8px] font-bold mt-1 uppercase tracking-tight">Profile</span>
                  </button>
                </div>

                {/* iPhone Home Screen Bar indicator */}
                <div className="absolute bottom-[4px] left-1/2 -translate-x-1/2 w-28 h-1 bg-neutral-900/80 rounded-full z-40" />

              </div>
            ) : (
              /* POWER OFF PHONE STATE */
              <div 
                className="flex-1 flex flex-col items-center justify-center bg-black cursor-pointer"
                onClick={() => setIsPowerOn(true)}
              >
                <div className="w-12 h-12 rounded-full border border-neutral-800 flex items-center justify-center hover:bg-neutral-900 transition-colors">
                  <span className="text-white text-xs font-bold font-sans">ON</span>
                </div>
                <p className="text-neutral-500 text-[9px] uppercase tracking-widest mt-2">Click button/screen to turn on</p>
              </div>
            )}

          </div>

          {/* Helper caption bottom */}
          <span className="text-neutral-400 text-[10px] mt-2 font-mono flex items-center gap-1.5 justify-center">
            <Badge className="bg-neutral-800 text-neutral-300 font-bold border-none text-[9px] px-1.5 py-0.5">DEV SIMULATOR V1.2</Badge> IPX6 Curved Hardware Frame
          </span>

        </div>

      </div>
    </div>
  );
}

// Inline decorative close icon
function X(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
