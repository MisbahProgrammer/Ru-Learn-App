import React, { useState } from 'react';
import { useAuth } from '@/App';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  BookOpen, 
  MessageSquare, 
  Star, 
  LogOut, 
  AlertCircle, 
  CheckCircle2, 
  Crown,
  Plane,
  Home,
  User,
  BookOpenCheck,
  Video,
  BookText,
  Smartphone,
  Globe,
  Target,
  Send,
  Loader2
} from 'lucide-react';
import { ALPHABET, SCENARIOS, CITY_IMAGES } from '@/constants';
import { CITIES_GUIDE, CityBlog } from '@/data/cities';
import { 
  MapPin, 
  Users, 
  CloudSnow, 
  Sun, 
  GraduationCap, 
  Compass, 
  Train, 
  Coins, 
  Utensils, 
  Lightbulb, 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink 
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { AlphabetView } from '@/components/AlphabetView';
import { CityBlogModal } from '@/components/CityBlogModal';
import { ScenarioChat } from '@/components/ScenarioChat';
import { VocabularyView } from '@/components/VocabularyView';
import { ProfileView } from '@/components/ProfileView';
import { CommunityView } from '@/components/CommunityView';
import { LecturesView } from '@/components/LecturesView';
import { GrammarView } from '@/components/GrammarView';
import { DailyLesson } from '@/components/DailyLesson';
import { WordOfTheDay } from '@/components/WordOfTheDay';
import { DailyGoalModal } from '@/components/DailyGoalModal';
import { format, differenceInDays, addDays } from 'date-fns';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { StreakNoticeToast } from './ToastNotification';

import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export function Dashboard({ initialTab = 'home' }: { initialTab?: string }) {
  const { user, profile, signOut, isPremium, updateProfileState, updateLessonProgress, saveDailyGoal } = useAuth();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [communityMemberCount, setCommunityMemberCount] = useState(0);
  const [signingOut, setSigningOut] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState<CityBlog | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  // Feedback Modal states
  const [isSidebarFeedbackOpen, setIsSidebarFeedbackOpen] = useState(false);
  const [sidebarFeedbackName, setSidebarFeedbackName] = useState('');
  const [sidebarFeedbackEmail, setSidebarFeedbackEmail] = useState('');
  const [sidebarFeedbackText, setSidebarFeedbackText] = useState('');
  const [isSubmittingSidebarFeedback, setIsSubmittingSidebarFeedback] = useState(false);
  const [sidebarFeedbackSuccess, setSidebarFeedbackSuccess] = useState(false);

  React.useEffect(() => {
    if (profile) {
      setSidebarFeedbackName((prev) => prev || profile.displayName || '');
    }
    if (user?.email) {
      setSidebarFeedbackEmail((prev) => prev || user.email);
    }
  }, [profile, user]);

  const handleSidebarFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sidebarFeedbackText.trim()) return;

    setIsSubmittingSidebarFeedback(true);

    try {
      if (user?.isGuest) {
        const localFeedbacks = JSON.parse(localStorage.getItem('scholar_feedback_fallback') || '[]');
        localFeedbacks.push({
          id: `feed_${Math.random().toString(36).substr(2, 9)}`,
          name: sidebarFeedbackName,
          email: sidebarFeedbackEmail,
          feedback: sidebarFeedbackText,
          created_at: new Date().toISOString(),
          is_guest: true
        });
        localStorage.setItem('scholar_feedback_fallback', JSON.stringify(localFeedbacks));
        
        toast.success('Thank you! Feedback saved locally (Guest Mode).');
        setSidebarFeedbackSuccess(true);
        setIsSubmittingSidebarFeedback(false);
        return;
      }

      if (!supabase) throw new Error('Supabase client is not initialized.');

      const { error } = await supabase
        .from('feedback')
        .insert([
          {
            user_id: user?.id || null,
            name: sidebarFeedbackName,
            email: sidebarFeedbackEmail,
            feedback: sidebarFeedbackText
          }
        ]);

      if (error) {
        console.warn('Feedback submit to Supabase failed, trying schema fallback:', error);
        if (error.message?.includes('relation "public.feedback" does not exist') || error.code === '42P01') {
          const localFeedbacks = JSON.parse(localStorage.getItem('scholar_feedback_fallback') || '[]');
          localFeedbacks.push({
            id: `feed_${Math.random().toString(36).substr(2, 9)}`,
            name: sidebarFeedbackName,
            email: sidebarFeedbackEmail,
            feedback: sidebarFeedbackText,
            created_at: new Date().toISOString(),
            pending_sync: true
          });
          localStorage.setItem('scholar_feedback_fallback', JSON.stringify(localFeedbacks));

          toast.warning('Feedback saved locally! The "feedback" table is missing in Supabase. Please run the feedback SQL schema in "/supabase_schema.sql" to enable server-side feedback storage!');
          setSidebarFeedbackSuccess(true);
          return;
        }
        throw error;
      }

      toast.success('Feedback submitted successfully!');
      setSidebarFeedbackSuccess(true);
    } catch (err: any) {
      console.error('Error submitting feedback:', err);
      toast.error('Failed to send feedback: ' + (err.message || String(err)));
      
      const localFeedbacks = JSON.parse(localStorage.getItem('scholar_feedback_fallback') || '[]');
      localFeedbacks.push({
        id: `feed_${Math.random().toString(36).substr(2, 9)}`,
        name: sidebarFeedbackName,
        email: sidebarFeedbackEmail,
        feedback: sidebarFeedbackText,
        created_at: new Date().toISOString(),
        error_saved: true
      });
      localStorage.setItem('scholar_feedback_fallback', JSON.stringify(localFeedbacks));
      toast.info('Saved feedback locally to prevent data loss.');
      setSidebarFeedbackSuccess(true);
    } finally {
      setIsSubmittingSidebarFeedback(false);
    }
  };

  React.useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const handleLogout = async () => {
    if (signingOut) return; // prevent double click
    setSigningOut(true);
    try {
      await signOut();
    } finally {
      setSigningOut(false);
    }
  };

  const intakeDate = new Date('2026-09-01T00:00:00Z');
  const daysRemaining = Math.max(0, differenceInDays(intakeDate, new Date()));

  // 1. Dynamic calculations from profile context (No extra DB reads)
  const lessonsCompleted = profile?.lessons_completed || {};

  const completedDailyDays = Array.from({ length: 30 }, (_, i) => `day_${i + 1}`).filter(id => lessonsCompleted[id]).length;
  const dailyLessonsPercentage = Math.round((completedDailyDays / 30) * 100);

  const alphabetLessons = [
    'alphabet_vocals', 'alphabet_consonants', 'alphabet_modifiers', 'alphabet_reading', 'alphabet_review',
    'alphabet_video_1', 'alphabet_video_2', 'alphabet_video_3', 'alphabet_video_4', 'alphabet_video_5', 'alphabet_video_6', 'alphabet_video_7', 'alphabet_video_8', 'alphabet_video_9', 'alphabet_video_10', 'alphabet_video_11'
  ];
  const alphabetCompletedCount = alphabetLessons.filter(id => lessonsCompleted[id]).length;
  const alphabetPercentage = Math.round((alphabetCompletedCount / alphabetLessons.length) * 100);

  const grammarLessons = ['grammar_sentence_logic', 'grammar_pronouns', 'grammar_six_cases', 'grammar_verbs_aspects', 'grammar_adjectives_lesson22', 'grammar_lesson30'];
  const grammarCompletedCount = grammarLessons.filter(id => lessonsCompleted[id]).length;
  const grammarPercentage = Math.round((grammarCompletedCount / grammarLessons.length) * 100);

  const scenarioLessons = ['taxi', 'airport', 'dormitory', 'restaurant', 'grocery', 'pharmacy', 'university'];
  const scenarioCompletedCount = scenarioLessons.filter(id => lessonsCompleted[id]).length;
  const scenarioPercentage = Math.round((scenarioCompletedCount / scenarioLessons.length) * 105 / 100); // safety cap

  // Define learning path to automatically identify current lesson
  const ALL_LESSONS = [
    { id: 'alphabet_vocals', title: 'Cyrillic Vowels & Pronunciation', section: 'Alphabet Master', tab: 'alphabet', progress: alphabetPercentage },
    { id: 'alphabet_consonants', title: 'Consonants & Palatalization', section: 'Alphabet Master', tab: 'alphabet', progress: alphabetPercentage },
    { id: 'alphabet_modifiers', title: 'Hard & Soft Signs', section: 'Alphabet Master', tab: 'alphabet', progress: alphabetPercentage },
    { id: 'alphabet_reading', title: 'Basic Syllables & Stress', section: 'Alphabet Master', tab: 'alphabet', progress: alphabetPercentage },
    { id: 'alphabet_review', title: 'Cyrillic Alphabet Review', section: 'Alphabet Master', tab: 'alphabet', progress: alphabetPercentage },
    
    { id: 'grammar_sentence_logic', title: 'Sentence Logic & Flex Order', section: 'Grammar Essentials', tab: 'grammar', progress: grammarPercentage },
    { id: 'grammar_pronouns', title: 'Personal Pronouns & Objects', section: 'Grammar Essentials', tab: 'grammar', progress: grammarPercentage },
    { id: 'grammar_six_cases', title: 'Introduction to the 6 Cases', section: 'Grammar Essentials', tab: 'grammar', progress: grammarPercentage },
    { id: 'grammar_verbs_aspects', title: 'Verb Conjugations & Aspect Pairs', section: 'Grammar Essentials', tab: 'grammar', progress: grammarPercentage },
    { id: 'grammar_adjectives_lesson22', title: 'Lesson 22 Adjectives', section: 'Grammar Essentials', tab: 'grammar', progress: grammarPercentage },
    { id: 'grammar_lesson30', title: 'Lesson 30 Verbs of Motion Past Tense', section: 'Grammar Essentials', tab: 'grammar', progress: grammarPercentage },
    
    { id: 'taxi', title: 'Booking a Taxi Dialogue', section: 'Voice Scenarios', tab: 'scenarios', progress: scenarioPercentage },
    { id: 'airport', title: 'Airport Arrivals Custom Check', section: 'Voice Scenarios', tab: 'scenarios', progress: scenarioPercentage },
    { id: 'dormitory', title: 'HSE/RUDN Dormitory Check-in', section: 'Voice Scenarios', tab: 'scenarios', progress: scenarioPercentage },
    { id: 'restaurant', title: 'Ordering Russian Dishes', section: 'Voice Scenarios', tab: 'scenarios', progress: scenarioPercentage },
    { id: 'grocery', title: 'Grocery Shopping Dialogue', section: 'Voice Scenarios', tab: 'scenarios', progress: scenarioPercentage },
    { id: 'pharmacy', title: 'Pharmacy Medical Assistance', section: 'Voice Scenarios', tab: 'scenarios', progress: scenarioPercentage },
    { id: 'university', title: 'University Academic Enrollment', section: 'Voice Scenarios', tab: 'scenarios', progress: scenarioPercentage }
  ];

  const currentActiveLesson = ALL_LESSONS.find(l => !lessonsCompleted[l.id]) || ALL_LESSONS[0];

  // Streak calculations
  const streakCount = profile?.streak_count || 0;
  const lastActive = profile?.last_activity_date;
  const lastActiveDateOnly = lastActive ? lastActive.split('T')[0] : null;

  const getLocalDateString = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const todayStr = getLocalDateString(new Date());

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = getLocalDateString(yesterday);

  // Streak remains active if user's last activity is today or yesterday, or is at risk
  const isStreakActive = lastActiveDateOnly === todayStr || lastActiveDateOnly === yesterdayStr || !!profile?.streakAtRisk;
  const activeStreakVal = isStreakActive ? streakCount : 0;

  const currentDayOfWeek = (new Date().getDay() + 6) % 7; // 0 = Mon, 1 = Tue, ..., 6 = Sun
  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  const getWeekDayDateString = (idx: number) => {
    const today = new Date();
    const dayOffset = idx - currentDayOfWeek;
    today.setDate(today.getDate() + dayOffset);
    return getLocalDateString(today);
  };

  const displayName = user?.displayName || profile?.displayName || user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'Scholar';
  const firstName = displayName.split(' ')[0];
  const avatarFallback = displayName.charAt(0).toUpperCase();

  const handleUpgrade = async () => {
    if (!user) return;
    const invoiceId = `inv_${Math.random().toString(36).substr(2, 9)}`;
    const currentBilling = profile?.billingHistory || [];
    const updatedBilling = [
      ...currentBilling,
      {
        id: invoiceId,
        date: new Date().toISOString(),
        amount: 2.00,
        description: 'Premium Scholar Plan - Monthly',
        status: 'succeeded'
      }
    ];

    try {
      if (user.isGuest) {
        updateProfileState({
          ...profile,
          isPremium: true,
          premiumUntil: addDays(new Date(), 30).toISOString(),
          billingHistory: updatedBilling
        });
        toast.success('Welcome to Premium Scholar! (Guest Mode active)');
        return;
      }

      if (!supabase) throw new Error('Supabase client is not initialized.');

      const { error } = await supabase
        .from('users')
        .update({
          isPremium: true,
          premiumUntil: addDays(new Date(), 30).toISOString(),
          billingHistory: updatedBilling
        })
        .eq('uid', user.id);

      if (error) throw error;

      updateProfileState({
        ...profile,
        isPremium: true,
        premiumUntil: addDays(new Date(), 30).toISOString(),
        billingHistory: updatedBilling
      });

      toast.success('Welcome to Premium Scholar! Your $2 payment was successful.');
    } catch (e: any) {
      toast.error('Failed to upgrade: ' + e.message);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b border-neutral-200 bg-white sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200 px-2 md:px-3 py-0.5 md:py-1 font-bold text-[10px] md:text-xs">
            MASTER RUSSIAN
          </Badge>
          <div className="hidden sm:block h-4 w-[1px] bg-neutral-200 mx-2" />
          <span className="hidden sm:block text-[10px] md:text-sm font-medium text-neutral-500 uppercase tracking-widest leading-none">
            Scholar Portal
          </span>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {isPremium ? (
            <div className="flex items-center gap-1.5 md:gap-2">
              <span className="hidden sm:inline-block text-xs md:text-sm font-semibold text-neutral-800">
                {displayName}
              </span>
              <Badge className="bg-orange-500 hover:bg-orange-600 border-none text-white flex items-center gap-1 py-0.5 md:py-1 text-[10px] md:text-xs px-2.5 rounded-full font-bold select-none animate-pulse">
                Scholar ⭐
              </Badge>
            </div>
          ) : (
            <span className="hidden sm:inline-block text-xs md:text-sm font-medium text-neutral-600">
              {displayName}
            </span>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger className="relative h-8 w-8 rounded-full ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 overflow-hidden hover:bg-neutral-100">
              <Avatar className="h-8 w-8">
                <AvatarImage src={profile?.avatar_url || profile?.avatarUrl || user?.photoURL || ''} alt={displayName || ''} />
                <AvatarFallback className="bg-neutral-100 text-neutral-600">{avatarFallback || <User />}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" sideOffset={8}>
              <div className="flex flex-col space-y-1 p-2">
                <p className="text-sm font-medium leading-none truncate">{displayName}</p>
                <p className="text-xs leading-none text-neutral-500 truncate">{user?.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setActiveTab('profile')}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile & Billing</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                disabled={signingOut}
                onClick={async (e) => {
                  e.preventDefault();
                  await handleLogout();
                }} 
                className={`text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer ${signingOut ? 'opacity-50 pointer-events-none' : ''}`}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>{signingOut ? 'Signing out...' : 'Log out'}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Navigation Sidebar / Mobile Nav */}
      <main className="flex flex-col md:flex-row flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col md:flex-row h-full">
          {/* Desktop Sidebar */}
          <div className="hidden md:flex w-64 border-r border-neutral-200 p-4 flex-col gap-2 bg-neutral-50/50">
            <TabsList className="bg-transparent flex-col justify-start h-auto w-full p-0">
              <TabsTrigger value="home" className="w-full justify-start gap-3 h-12 bg-transparent data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-xl transition-all">
                <Home className="w-4 h-4" /> Home
              </TabsTrigger>
              <TabsTrigger value="community" className="w-full justify-start gap-3 h-12 bg-transparent data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-xl transition-all font-medium">
                <Globe className="w-4 h-4" /> Community {communityMemberCount > 0 ? `(${communityMemberCount})` : ''}
              </TabsTrigger>
              <TabsTrigger value="alphabet" className="w-full justify-start gap-3 h-12 bg-transparent data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-xl transition-all">
                <BookOpen className="w-4 h-4" /> Alphabet
              </TabsTrigger>
              <TabsTrigger value="vocabulary" className="w-full justify-start gap-3 h-12 bg-transparent data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-xl transition-all">
                <BookOpenCheck className="w-4 h-4" /> Vocabulary
              </TabsTrigger>
              <TabsTrigger value="grammar" className="w-full justify-start gap-3 h-12 bg-transparent data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-xl transition-all">
                <BookText className="w-4 h-4" /> Grammar
              </TabsTrigger>
              <TabsTrigger value="scenarios" className="w-full justify-start gap-3 h-12 bg-transparent data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-xl transition-all">
                <MessageSquare className="w-4 h-4" /> Scenarios
              </TabsTrigger>
              <TabsTrigger value="lectures" className="w-full justify-start gap-3 h-12 bg-transparent data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-xl transition-all">
                <Video className="w-4 h-4" /> Lectures
              </TabsTrigger>
              {isPremium ? (
                <TabsTrigger value="premium" className="w-full justify-start gap-3 h-12 bg-transparent data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-xl transition-all text-green-600 font-bold hover:text-green-700 hover:bg-green-50/20">
                  <span className="w-4 h-4 flex items-center justify-center text-xs">✓</span> Scholar Plan
                </TabsTrigger>
              ) : (
                <TabsTrigger value="premium" className="w-full justify-start gap-3 h-12 bg-transparent data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-xl transition-all text-orange-600 font-bold hover:text-orange-700 hover:bg-orange-50/20">
                  <Star className="w-4 h-4 text-orange-500 fill-orange-400 animate-pulse" /> ⭐ Upgrade to Premium
                </TabsTrigger>
              )}
              <TabsTrigger value="profile" className="w-full justify-start gap-3 h-12 bg-transparent data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-xl transition-all">
                <User className="w-4 h-4" /> Profile & Billing
              </TabsTrigger>
            </TabsList>

            {/* Sidebar Feedback Section */}
            <div className="mt-auto p-4 bg-neutral-50 border border-neutral-150/80 rounded-2xl">
              <h4 className="text-xs font-bold text-neutral-800 mb-1 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-orange-600" /> Share Feedback
              </h4>
              <p className="text-[10px] text-neutral-550 leading-normal mb-3">
                Tell us what you think or what features you want next!
              </p>
              <Button 
                onClick={() => setIsSidebarFeedbackOpen(true)}
                variant="outline" 
                size="sm"
                className="w-full text-[10px] font-bold h-8 rounded-xl bg-white hover:bg-orange-50 hover:text-orange-600 border-neutral-200 hover:border-orange-200 transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <Send className="w-3 h-3 text-orange-500" /> Write Feedback
              </Button>
            </div>

            <div className="mt-3 p-4 bg-orange-50 rounded-2xl border border-orange-100">
              <h4 className="text-xs font-bold text-orange-900 mb-1 flex items-center gap-1">
                <Plane className="w-3 h-3" /> TRAVEL TIP
              </h4>
              <p className="text-[10px] text-orange-800 leading-tight">
                Don't forget to install the "Yandex" app for maps and taxis when you land in Moscow.
              </p>
            </div>
          </div>

          {/* Mobile Bottom Navigation */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 px-2 py-3 flex justify-around z-50">
            <TabsList className="bg-transparent h-auto p-0 flex flex-row w-full justify-around">
               <TabsTrigger value="home" className="flex-col gap-1 text-[10px] bg-transparent data-[state=active]:text-orange-600 transition-all font-bold uppercase tracking-tighter">
                 <Home className="w-5 h-5" /> Home
               </TabsTrigger>
               <TabsTrigger value="community" className="flex-col gap-1 text-[10px] bg-transparent data-[state=active]:text-orange-600 transition-all font-bold uppercase tracking-tighter">
                 <Globe className="w-5 h-5" /> Community
               </TabsTrigger>
               <TabsTrigger value="alphabet" className="flex-col gap-1 text-[10px] bg-transparent data-[state=active]:text-orange-600 transition-all font-bold uppercase tracking-tighter">
                 <BookOpen className="w-5 h-5" /> Alphabet
               </TabsTrigger>
               <TabsTrigger value="vocabulary" className="flex-col gap-1 text-[10px] bg-transparent data-[state=active]:text-orange-600 transition-all font-bold uppercase tracking-tighter">
                 <BookOpenCheck className="w-5 h-5" /> Vocab
               </TabsTrigger>
               <TabsTrigger value="grammar" className="flex-col gap-1 text-[10px] bg-transparent data-[state=active]:text-orange-600 transition-all font-bold uppercase tracking-tighter">
                 <BookText className="w-5 h-5" /> Grammar
               </TabsTrigger>
               <TabsTrigger value="scenarios" className="flex-col gap-1 text-[10px] bg-transparent data-[state=active]:text-orange-600 transition-all font-bold uppercase tracking-tighter">
                 <MessageSquare className="w-5 h-5" /> Chat
               </TabsTrigger>
               <TabsTrigger value="lectures" className="flex-col gap-1 text-[10px] bg-transparent data-[state=active]:text-orange-600 transition-all font-bold uppercase tracking-tighter">
                 <Video className="w-5 h-5" /> Lectures
               </TabsTrigger>
               <TabsTrigger value="premium" className="flex-col gap-1 text-[10px] bg-transparent data-[state=active]:text-orange-600 transition-all font-bold uppercase tracking-tighter">
                 <Star className={`w-5 h-5 ${isPremium ? 'text-green-500 fill-green-400' : 'text-orange-500 fill-orange-400'}`} /> {isPremium ? "Scholar" : "Upgrade"}
               </TabsTrigger>
               <TabsTrigger value="profile" className="flex-col gap-1 text-[10px] bg-transparent data-[state=active]:text-orange-600 transition-all font-bold uppercase tracking-tighter">
                 <User className="w-5 h-5" /> Profile
               </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Contents */}
          <div className="flex-1 h-full overflow-hidden flex flex-col bg-white">
            <TabsContent value="home" className="flex-1 p-4 md:p-8 m-0 pb-24 md:pb-8 overflow-auto">
              <div className="max-w-4xl mx-auto space-y-8 md:space-y-12">
                <div>
                  <h1 className="text-2xl md:text-3xl font-light tracking-tight mb-2">Welcome back, <span className="font-serif italic">{firstName}</span>.</h1>
                  <p className="text-neutral-500 text-sm md:text-base">Your journey to Russia starts here. You're part of the {profile?.scholarshipType || 'Scholar'} class.</p>
                  
                  {profile?.streakAtRisk && (
                    <div className="flex items-center gap-3 bg-red-50/80 border border-red-100 text-red-800 p-4 rounded-2xl text-sm mt-6 shadow-xs animate-pulse">
                      <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                      <div>
                        <span className="font-bold text-red-700">Streak At Risk!</span> You missed yesterday. Complete {profile?.daily_goal_minutes || 10} minutes of active learning today to save your streak! 🔥
                      </div>
                    </div>
                  )}

                  {/* Alert: Free Video Lectures available in Alphabet section */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 mt-6 bg-gradient-to-r from-orange-50 to-amber-50/50 border border-orange-100 rounded-2xl shadow-xs">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-orange-100 border border-orange-200 text-orange-600 rounded-xl mt-0.5 shrink-0">
                        <Video className="w-5 h-5 text-orange-500" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-neutral-800">🎓 Free Cyrillic Alphabet Lectures!</h4>
                        <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                          Complete our intensive step-by-step masterclasses (Parts 1 to 9) in the <span className="font-semibold text-neutral-700">Alphabet</span> tab to master Russian reading rules and earn extra XP.
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => setActiveTab('alphabet')}
                      className="rounded-xl border-orange-200 bg-white text-orange-600 hover:bg-orange-100 hover:text-orange-700 font-bold text-xs shrink-0 px-4 py-2 h-9 transition-all cursor-pointer shadow-xs"
                    >
                      Go to Alphabet
                    </Button>
                  </div>

                  {/* Streak & Countdown Widget */}
                  <div className="flex flex-col md:flex-row md:items-center gap-4 mt-6">
                    {/* Daily Streak Row */}
                    <div className="flex items-center gap-3 bg-orange-50/50 border border-orange-100 p-4 rounded-2xl flex-1 max-w-lg shadow-xs">
                      <div className="flex flex-col shrink-0">
                        <span className="text-sm font-bold text-orange-600 flex items-center gap-1">
                          🔥 {activeStreakVal}-Day Streak
                        </span>
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                          <span className="text-[10px] text-orange-850 font-bold flex items-center gap-1 bg-orange-100/50 px-1.5 py-0.5 rounded-md">
                            🏆 {profile?.xp_points || 0} XP
                          </span>
                          <button
                            onClick={() => setIsGoalModalOpen(true)}
                            className="text-[10px] text-orange-700 hover:text-orange-950 font-bold flex items-center gap-1 bg-orange-100/30 hover:bg-orange-100/70 px-1.5 py-0.5 rounded-md transition-all cursor-pointer border border-orange-200/30"
                            title="Adjust Daily Learning Goal"
                          >
                            <Target className="w-2.5 h-2.5 shrink-0 text-orange-500" /> Goal: {profile?.daily_goal_minutes || 10}m
                          </button>
                        </div>
                      </div>
                      <div className="h-8 w-[1px] bg-neutral-200 mx-2 hidden min-[360px]:block" />
                      <div className="flex justify-between items-center flex-1 gap-1.5 min-w-[150px]">
                        {weekDays.map((day, idx) => {
                          const dateStr = getWeekDayDateString(idx);
                          const isCompleted = !!(profile?.week_activity?.[dateStr]);
                          const isToday = idx === currentDayOfWeek;
                          const isTodayActiveButNotEarned = isToday && !isCompleted;

                          return (
                            <div key={idx} className="flex flex-col items-center gap-1">
                              <span className="text-[9px] text-neutral-400 font-semibold">{day}</span>
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all relative ${
                                isCompleted 
                                  ? 'bg-emerald-500 text-white shadow-xs border border-emerald-600' 
                                  : isTodayActiveButNotEarned 
                                    ? 'bg-orange-100 border-2 border-orange-400 text-orange-700 animate-pulse outline outline-4 outline-orange-100/50' 
                                    : 'bg-neutral-100 text-neutral-400'
                              }`}>
                                {isCompleted ? '✓' : ''}
                                {isTodayActiveButNotEarned && '•'}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Countdown Widget */}
                    <div className="flex items-center gap-3 bg-neutral-50 border border-neutral-200 px-4 py-3.5 rounded-2xl md:w-64 shadow-xs shrink-0">
                      <div className="p-2 bg-neutral-100 rounded-xl text-neutral-600">
                        <Plane className="w-5 h-5 text-orange-500" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-neutral-900">
                          {daysRemaining} Days
                        </div>
                        <div className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest">
                          Until Sept Intake
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Word of the Day Widget */}
                  <div className="mt-6 max-w-lg">
                    <WordOfTheDay />
                  </div>
                </div>



                {/* Daily Structured Plan Lesson Component */}
                <DailyLesson />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   <Card className="hover:border-neutral-300 transition-colors cursor-pointer group flex flex-col justify-between" onClick={() => {
                     setActiveTab('alphabet');
                   }}>
                     <CardHeader className="pb-4">
                       <CardTitle className="flex items-center gap-2">
                        <div className="p-2 bg-neutral-100 rounded-lg group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
                          <BookOpen className="w-5 h-5" />
                        </div>
                        Alphabet Master
                       </CardTitle>
                       <CardDescription>Learn the sounds and letters of the Cyrillic alphabet.</CardDescription>
                     </CardHeader>
                     <CardContent className="pt-0">
                       <div className="flex justify-between items-center text-xs text-neutral-400 mb-1">
                         <span className="font-light">Completed</span>
                         <span className="font-semibold text-neutral-600">{alphabetPercentage}%</span>
                       </div>
                       <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                         <div className="bg-orange-500 h-full rounded-full transition-all duration-500" style={{ width: `${alphabetPercentage}%` }} />
                       </div>
                     </CardContent>
                   </Card>

                   <Card className="hover:border-neutral-300 transition-colors cursor-pointer group flex flex-col justify-between" onClick={() => {
                     setActiveTab('grammar');
                   }}>
                     <CardHeader className="pb-4">
                       <CardTitle className="flex items-center gap-2">
                        <div className="p-2 bg-neutral-100 rounded-lg group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
                          <BookText className="w-5 h-5" />
                        </div>
                        Grammar Essentials
                       </CardTitle>
                       <CardDescription>Master cases, pronouns, and sentence structure.</CardDescription>
                     </CardHeader>
                     <CardContent className="pt-0">
                       <div className="flex justify-between items-center text-xs text-neutral-400 mb-1">
                         <span className="font-light">Completed</span>
                         <span className="font-semibold text-neutral-600">{grammarPercentage}%</span>
                       </div>
                       <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                         <div className="bg-orange-500 h-full rounded-full transition-all duration-500" style={{ width: `${grammarPercentage}%` }} />
                       </div>
                     </CardContent>
                   </Card>
                   
                   <Card className="hover:border-neutral-300 transition-colors cursor-pointer group flex flex-col justify-between" onClick={() => {
                     setActiveTab('scenarios');
                   }}>
                     <CardHeader className="pb-4">
                       <CardTitle className="flex items-center gap-2">
                        <div className="p-2 bg-neutral-100 rounded-lg group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
                          <MessageSquare className="w-5 h-5" />
                        </div>
                        <div className="flex items-center justify-between w-full gap-2">
                          <span>Voice Scenarios</span>
                          <Badge variant="outline" className="text-[9px] bg-amber-50 text-amber-800 border-amber-200/60 uppercase font-bold shrink-0">
                            Beta
                          </Badge>
                        </div>
                       </CardTitle>
                       <CardDescription>Practice real conversations. Still in development and testing (expect errors).</CardDescription>
                     </CardHeader>
                     <CardContent className="pt-0">
                       <div className="flex justify-between items-center text-xs text-neutral-400 mb-1">
                         <span className="font-light">Completed</span>
                         <span className="font-semibold text-neutral-600">{scenarioPercentage}%</span>
                       </div>
                       <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                         <div className="bg-orange-500 h-full rounded-full transition-all duration-500" style={{ width: `${scenarioPercentage}%` }} />
                       </div>
                     </CardContent>
                   </Card>
                </div>

                <div>
                  <div className="flex justify-between items-baseline mb-6">
                    <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-neutral-400">Discover Russia</h3>
                    <span className="text-neutral-400 text-xs font-mono">{CITIES_GUIDE.length} Cities Guide</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {CITIES_GUIDE.map((city) => (
                      <div 
                        key={city.id} 
                        onClick={() => {
                          setSelectedCity(city);
                        }}
                        className="relative aspect-[4/5] sm:aspect-square md:aspect-[4/5] rounded-3xl overflow-hidden group cursor-pointer border border-neutral-100/50 shadow-sm hover:shadow-xl transition-all duration-300"
                      >
                        <img 
                          src={city.coverImage} 
                          alt={city.name} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-5" />
                        
                        {/* Overlaid Badge */}
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border-none font-bold tracking-wider uppercase text-[8px] px-2 py-0.5">
                            {city.category}
                          </Badge>
                        </div>

                        {/* Text details */}
                        <div className="absolute bottom-5 left-5 right-5 text-white transition-transform duration-300 group-hover:-translate-y-1">
                          <div className="flex items-baseline gap-1.5 mb-1">
                            <h4 className="font-bold text-xl tracking-tight">{city.name}</h4>
                            <span className="text-orange-400 font-serif italic text-sm">{city.russianName}</span>
                          </div>
                          <p className="text-white/70 text-[10px] uppercase tracking-widest leading-relaxed mb-3 line-clamp-1">{city.description}</p>
                          <div className="flex justify-between items-center pt-2 border-t border-white/10 text-[10px] text-white/50 font-medium">
                            <span className="flex items-center gap-1">🏫 {city.universities.length} Universities</span>
                            <span className="text-orange-400 font-bold group-hover:underline flex items-center gap-0.5">Explore Guide →</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Render the detailed interactive blog modal */}
                  <CityBlogModal 
                    isOpen={!!selectedCity} 
                    onClose={() => setSelectedCity(null)} 
                    city={selectedCity} 
                  />
                </div>


              </div>
            </TabsContent>

            <TabsContent value="alphabet" className="flex-1 m-0 h-full overflow-hidden">
               <AlphabetView />
            </TabsContent>

            <TabsContent value="vocabulary" className="flex-1 m-0 h-full overflow-hidden">
               <VocabularyView onNavigate={setActiveTab} />
            </TabsContent>

            <TabsContent value="grammar" className="flex-1 m-0 h-full overflow-hidden">
               <GrammarView />
            </TabsContent>

            <TabsContent value="scenarios" className="flex-1 m-0 h-full overflow-hidden">
               {true ? (
                 <ScenarioChat onNavigate={setActiveTab} />
               ) : (
                 <div className="flex flex-col items-center justify-center h-full p-8 text-center max-w-sm mx-auto">
                    <Crown className="w-12 h-12 text-orange-500 mb-6" />
                    <h2 className="text-2xl font-bold mb-4">Premium Access Required</h2>
                    <p className="text-neutral-500 mb-8 leading-relaxed">
                      Interactive AI scenarios and real-time voice practice are restricted to Premium Scholar members after the trial ends.
                    </p>
                    <Button onClick={() => setActiveTab('premium')} className="bg-orange-600 hover:bg-orange-700 w-full rounded-xl">Subscribe for $1</Button>
                 </div>
               )}
            </TabsContent>

             <TabsContent value="premium" className="flex-1 p-4 md:p-8 m-0 pb-24 md:pb-8 overflow-auto">
               <div className="max-w-2xl mx-auto space-y-8 md:space-y-12">
                 <div className="text-center">
                   <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Premium Scholar Plan</h1>
                   <p className="text-neutral-500 text-sm">Supporting your education journey with affordable access.</p>
                 </div>

                 <Card className="border-2 border-orange-500 shadow-xl overflow-hidden relative">
                    <div className="absolute top-4 right-4 animate-bounce">
                       <Crown className="text-orange-500 w-8 h-8" />
                    </div>
                    <CardHeader className="text-center pb-10 pt-16">
                      <CardTitle className="text-3xl mb-2 font-serif">Scholar Elite</CardTitle>
                      <CardDescription>One simple price for everything.</CardDescription>
                      <div className="mt-8 flex items-baseline justify-center gap-1">
                        <span className="text-6xl font-bold">$2</span>
                        <span className="text-neutral-400 text-xl">/month</span>
                      </div>
                    </CardHeader>
                    <CardContent className="px-10 pb-16 space-y-6">
                       <div className="space-y-4">
                         <div className="flex items-center gap-3">
                           <CheckCircle2 className="w-5 h-5 text-green-500" />
                           <span className="font-light">Unlimited AI Voice Tutor Chat</span>
                         </div>
                         <div className="flex items-center gap-3">
                           <CheckCircle2 className="w-5 h-5 text-green-500" />
                           <span className="font-light">All Current & Future Scenarios</span>
                         </div>
                         <div className="flex items-center gap-3">
                           <CheckCircle2 className="w-5 h-5 text-green-500" />
                           <span className="font-light">High Quality Voice Pronunciation</span>
                         </div>
                         <div className="flex items-center gap-3">
                           <CheckCircle2 className="w-5 h-5 text-green-500" />
                           <span className="font-light">Detailed Cultural & Context Guides</span>
                         </div>
                       </div>

                       {isPremium ? (
                         <div className="p-4 bg-green-50 text-green-800 rounded-xl flex items-center gap-3 justify-center font-bold">
                           <CheckCircle2 className="w-5 h-5" />
                           YOU ARE ENROLLED
                         </div>
                       ) : (
                         <Button onClick={handleUpgrade} className="w-full h-auto min-h-[3.5rem] py-3.5 px-4 bg-neutral-900 hover:bg-black rounded-2xl text-xs min-[360px]:text-sm sm:text-base md:text-lg lg:text-xl font-bold transition-transform hover:scale-[1.02] flex items-center justify-center text-center whitespace-normal leading-tight">
                           Activate Plan for $2/month
                         </Button>
                       )}
                       <p className="text-center text-[10px] text-neutral-400">Secure payment. Cancel subscription anytime from this panel.</p>
                    </CardContent>
                 </Card>
               </div>
             </TabsContent>

             <TabsContent value="community" className="flex-1 m-0 h-full overflow-hidden">
                <CommunityView onTotalCountLoaded={setCommunityMemberCount} />
             </TabsContent>

             <TabsContent value="profile" className="flex-1 m-0 h-full overflow-hidden">
                <ProfileView onNavigate={setActiveTab} />
             </TabsContent>

             <TabsContent value="lectures" className="flex-1 m-0 h-full overflow-hidden">
                <div className="relative h-full w-full">
                  <div className={`h-full w-full ${!isPremium ? "blur-xs pointer-events-none select-none" : ""}`}>
                    <LecturesView />
                  </div>
                  {!isPremium && (
                    <div className="absolute inset-0 bg-neutral-900/10 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center z-10">
                      <div className="bg-white/95 border border-neutral-200 p-8 rounded-3xl max-w-sm shadow-xl flex flex-col items-center">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                          <Crown className="w-6 h-6 text-orange-500 animate-bounce" />
                        </div>
                        <h3 className="text-xl font-bold text-neutral-900 mb-2">🔒 This is a Premium feature</h3>
                        <p className="text-sm text-neutral-500 mb-6 leading-relaxed">
                          Unlock all scenarios for $2/month to continue learning.
                        </p>
                        <Button onClick={() => setActiveTab('premium')} className="w-full h-11 bg-orange-500 hover:bg-orange-600 font-bold rounded-xl text-sm transition-all shadow-md shadow-orange-500/20">
                          Upgrade Now
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
             </TabsContent>
          </div>
        </Tabs>
      </main>
      {profile?.uid && (
        <>
          <StreakNoticeToast 
            uid={profile.uid} 
            isTodayEarned={!!profile.week_activity?.[todayStr]} 
          />
          <DailyGoalModal
            isOpen={isGoalModalOpen}
            onClose={() => setIsGoalModalOpen(false)}
            currentGoal={profile.daily_goal_minutes ?? 10}
            onSave={saveDailyGoal}
          />
        </>
      )}

      {/* Sidebar Feedback Dialog */}
      <Dialog open={isSidebarFeedbackOpen} onOpenChange={setIsSidebarFeedbackOpen}>
        <DialogContent className="sm:max-w-[480px] rounded-3xl p-6 overflow-hidden">
          <DialogHeader className="pb-4 border-b border-neutral-100">
            <DialogTitle className="text-lg font-serif italic text-neutral-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-orange-600" /> Share Your Feedback
            </DialogTitle>
            <DialogDescription className="text-neutral-500 text-xs mt-1">
              Tell us what you want to see next and how you are interacting with the platform. We read every submission!
            </DialogDescription>
          </DialogHeader>

          {sidebarFeedbackSuccess ? (
            <div className="flex flex-col items-center text-center py-8 space-y-3">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center border border-green-200">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-neutral-900">Thank you for your feedback!</h3>
              <p className="text-neutral-500 text-xs max-w-sm leading-relaxed">
                Your response has been stored successfully. We appreciate you taking the time to help us improve Russian Scholar!
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setSidebarFeedbackSuccess(false);
                  setSidebarFeedbackText('');
                }}
                className="mt-2 rounded-xl text-xs font-semibold"
              >
                Submit Another Response
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSidebarFeedbackSubmit} className="space-y-4 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-500">Your Name</label>
                  <input 
                    type="text"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-white text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                    placeholder="Your full name"
                    value={sidebarFeedbackName}
                    onChange={(e) => setSidebarFeedbackName(e.target.value)}
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-500">Your Email</label>
                  <input 
                    type="email"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-white text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                    placeholder="you@example.com"
                    value={sidebarFeedbackEmail}
                    onChange={(e) => setSidebarFeedbackEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Feedback Message */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-neutral-500">Feedback or Feature Suggestion</label>
                  <span className="text-[10px] font-semibold text-neutral-400">
                    {sidebarFeedbackText.length} / 1000
                  </span>
                </div>
                <textarea
                  required
                  maxLength={1000}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-white text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all min-h-[120px] resize-none"
                  placeholder="Tell us what you like, what bugs you've encountered, or what features you would love to have next..."
                  value={sidebarFeedbackText}
                  onChange={(e) => setSidebarFeedbackText(e.target.value.substring(0, 1000))}
                />
              </div>

              <Button 
                type="submit"
                disabled={isSubmittingSidebarFeedback || !sidebarFeedbackText.trim()}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold h-11 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {isSubmittingSidebarFeedback ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending Feedback...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Feedback</span>
                  </>
                )}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
