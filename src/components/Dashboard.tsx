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
  BookText
} from 'lucide-react';
import { ALPHABET, SCENARIOS, CITY_IMAGES } from '@/constants';
import { AlphabetView } from '@/components/AlphabetView';
import { ScenarioChat } from '@/components/ScenarioChat';
import { VocabularyView } from '@/components/VocabularyView';
import { ProfileView } from '@/components/ProfileView';
import { LecturesView } from '@/components/LecturesView';
import { GrammarView } from '@/components/GrammarView';
import { format, differenceInDays, addDays } from 'date-fns';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export function Dashboard() {
  const { user, profile, signOut, isTrialValid, isPremium, updateProfileState, updateLessonProgress } = useAuth();
  const [activeTab, setActiveTab] = useState('home');

  const intakeDate = new Date('2026-09-01T00:00:00Z');
  const daysRemaining = Math.max(0, differenceInDays(intakeDate, new Date()));

  // 1. Dynamic calculations from profile context (No extra DB reads)
  const lessonsCompleted = profile?.lessons_completed || {};

  const alphabetLessons = ['alphabet_vocals', 'alphabet_consonants', 'alphabet_modifiers', 'alphabet_reading', 'alphabet_review'];
  const alphabetCompletedCount = alphabetLessons.filter(id => lessonsCompleted[id]).length;
  const alphabetPercentage = Math.round((alphabetCompletedCount / alphabetLessons.length) * 100);

  const grammarLessons = ['grammar_sentence_logic', 'grammar_pronouns', 'grammar_six_cases', 'grammar_verbs_aspects'];
  const grammarCompletedCount = grammarLessons.filter(id => lessonsCompleted[id]).length;
  const grammarPercentage = Math.round((grammarCompletedCount / grammarLessons.length) * 100);

  const scenarioLessons = ['scenario_taxi', 'scenario_directions', 'scenario_food', 'scenario_hotel', 'scenario_emergency'];
  const scenarioCompletedCount = scenarioLessons.filter(id => lessonsCompleted[id]).length;
  const scenarioPercentage = Math.round((scenarioCompletedCount / scenarioLessons.length) * 100);

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
    
    { id: 'scenario_taxi', title: 'Booking a Taxi Dialogue', section: 'Voice Scenarios', tab: 'scenarios', progress: scenarioPercentage },
    { id: 'scenario_directions', title: 'Asking for Directions Dialogue', section: 'Voice Scenarios', tab: 'scenarios', progress: scenarioPercentage },
    { id: 'scenario_food', title: 'Ordering Russian Dishes', section: 'Voice Scenarios', tab: 'scenarios', progress: scenarioPercentage },
    { id: 'scenario_hotel', title: 'HSE/RUDN Dormitory Check-in', section: 'Voice Scenarios', tab: 'scenarios', progress: scenarioPercentage },
    { id: 'scenario_emergency', title: 'Emergency Service 112 Dial', section: 'Voice Scenarios', tab: 'scenarios', progress: scenarioPercentage },
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

  // Streak remains active if user's last activity is today or yesterday
  const isStreakActive = lastActiveDateOnly === todayStr || lastActiveDateOnly === yesterdayStr;
  const activeStreakVal = isStreakActive ? streakCount : 0;

  const currentDayOfWeek = (new Date().getDay() + 6) % 7; // 0 = Mon, 1 = Tue, ..., 6 = Sun
  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  const displayName = user?.displayName || profile?.displayName || user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'Scholar';
  const firstName = displayName.split(' ')[0];
  const avatarFallback = displayName.charAt(0).toUpperCase();

  const trialDaysLeft = 7 - differenceInDays(new Date(), new Date(profile?.trialStartDate || new Date()));
  const showTrialWarning = !isPremium && trialDaysLeft <= 2;

  const handleUpgrade = async () => {
    if (!user) return;
    const invoiceId = `inv_${Math.random().toString(36).substr(2, 9)}`;
    const currentBilling = profile?.billingHistory || [];
    const updatedBilling = [
      ...currentBilling,
      {
        id: invoiceId,
        date: new Date().toISOString(),
        amount: 1.00,
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

      toast.success('Welcome to Premium Scholar! Your $1 payment was successful.');
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
          {!isPremium && (
            <Badge variant="secondary" className="flex items-center gap-1 py-0.5 md:py-1 text-[10px] md:text-xs px-2">
              <Star className="w-2.5 h-2.5 md:w-3 md:h-3 text-orange-500 fill-orange-500" />
              {trialDaysLeft > 0 ? (
                <span className="whitespace-nowrap">{trialDaysLeft}d left</span>
              ) : (
                <span>Expired</span>
              )}
            </Badge>
          )}
          {isPremium && (
            <Badge className="bg-orange-500 text-white flex items-center gap-1 py-0.5 md:py-1 text-[10px] md:text-xs px-2">
              <Crown className="w-2.5 h-2.5 md:w-3 md:h-3 fill-white" />
              PREMIUM
            </Badge>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger className="relative h-8 w-8 rounded-full ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 overflow-hidden hover:bg-neutral-100">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.photoURL || ''} alt={displayName || ''} />
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
              <DropdownMenuItem onClick={signOut} className="text-red-600 focus:text-red-700 focus:bg-red-50">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
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
              <TabsTrigger value="premium" className="w-full justify-start gap-3 h-12 bg-transparent data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-xl transition-all text-orange-600 font-bold hover:text-orange-700">
                <Star className="w-4 h-4 text-orange-500 fill-orange-400 animate-pulse" /> Premium Plan
              </TabsTrigger>
              <TabsTrigger value="profile" className="w-full justify-start gap-3 h-12 bg-transparent data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-xl transition-all">
                <User className="w-4 h-4" /> Profile & Billing
              </TabsTrigger>
            </TabsList>

            <div className="mt-auto p-4 bg-orange-50 rounded-2xl border border-orange-100">
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
                 <Star className="w-5 h-5 text-orange-500 fill-orange-400" /> Premium
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
                  
                  {/* Streak & Countdown Widget */}
                  <div className="flex flex-col md:flex-row md:items-center gap-4 mt-6">
                    {/* Daily Streak Row */}
                    <div className="flex items-center gap-3 bg-orange-50/50 border border-orange-100 p-4 rounded-2xl flex-1 max-w-lg shadow-xs">
                      <div className="flex flex-col shrink-0">
                        <span className="text-sm font-bold text-orange-600 flex items-center gap-1">
                          🔥 {activeStreakVal}-Day Streak
                        </span>
                        <span className="text-[10px] text-orange-850 font-bold flex items-center gap-1 bg-orange-100/50 px-1.5 py-0.5 rounded-md mt-0.5">
                          🏆 {profile?.xp_points || 0} XP
                        </span>
                      </div>
                      <div className="h-8 w-[1px] bg-neutral-200 mx-2 hidden min-[360px]:block" />
                      <div className="flex justify-between items-center flex-1 gap-1.5 min-w-[150px]">
                        {weekDays.map((day, idx) => {
                          const isCompleted = isStreakActive && (
                            idx <= currentDayOfWeek && (currentDayOfWeek - idx) < activeStreakVal
                          );
                          const isToday = idx === currentDayOfWeek;
                          return (
                            <div key={idx} className="flex flex-col items-center gap-1">
                              <span className="text-[9px] text-neutral-400 font-semibold">{day}</span>
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all relative ${
                                isCompleted 
                                  ? 'bg-orange-500 text-white shadow-xs' 
                                  : isToday 
                                    ? 'bg-orange-100 border border-orange-300 text-orange-700 animate-pulse' 
                                    : 'bg-neutral-100 text-neutral-400'
                              }`}>
                                {isCompleted ? '✓' : ''}
                                {isToday && !isCompleted && '•'}
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
                </div>

                {!isPremium && !isTrialValid && (
                  <Card className="border-orange-200 bg-orange-50/80 backdrop-blur-sm shadow-lg shadow-orange-500/10">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-orange-900">
                        <AlertCircle className="w-5 h-5 text-orange-600" />
                        Trial Period Ended
                      </CardTitle>
                      <CardDescription className="text-orange-800 font-medium">
                        Your 7-day free trial has expired. To continue practicing voice scenarios and AI tutoring, please upgrade to the $1 Premium Scholar plan.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button onClick={() => setActiveTab('premium')} className="bg-orange-600 hover:bg-orange-700 text-white px-8 h-12 rounded-xl font-bold shadow-lg shadow-orange-600/20">
                        Upgrade for $1/month
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Continue Learning progress card */}
                <Card className="border border-neutral-200 shadow-xs relative overflow-hidden bg-gradient-to-r from-neutral-50 to-white hover:border-neutral-300 transition-colors">
                  <div className="absolute top-0 left-0 w-1 h-full bg-orange-500" />
                  <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px] text-orange-600 border-orange-200 bg-orange-50 font-semibold uppercase tracking-wider">
                          {currentActiveLesson.section}
                        </Badge>
                        <span className="text-[11px] text-neutral-400">• Current lesson</span>
                      </div>
                      <h3 className="text-base md:text-lg font-medium text-neutral-900 tracking-tight">
                        {currentActiveLesson.title}
                      </h3>
                      <div className="flex items-center gap-4 w-full sm:w-64 pt-2">
                        <div className="flex-1 bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-orange-500 h-full rounded-full transition-all duration-500" style={{ width: `${currentActiveLesson.progress}%` }} />
                        </div>
                        <span className="text-xs font-semibold text-neutral-500">{currentActiveLesson.progress}% Section Completed</span>
                      </div>
                    </div>
                    <Button 
                      onClick={() => setActiveTab(currentActiveLesson.tab)} 
                      className="bg-orange-500 hover:bg-orange-600 text-white px-6 h-10 rounded-xl font-bold transition-all hover:scale-[1.02] shrink-0"
                    >
                      Continue Lesson
                    </Button>
                  </CardContent>
                </Card>

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
                        Voice Scenarios
                       </CardTitle>
                       <CardDescription>Practice real conversations for taxi, hotel, and dining.</CardDescription>
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
                  <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-neutral-400 mb-6">Discover Russia</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {CITY_IMAGES.map((city) => (
                      <div key={city.name} className="relative aspect-square rounded-2xl overflow-hidden group">
                        <img src={city.url} alt={city.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent flex flex-col justify-end p-4">
                          <h4 className="text-white font-bold text-lg">{city.name}</h4>
                          <p className="text-white/60 text-[10px] uppercase tracking-widest">{city.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Word of the Day Card */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-neutral-400">Word of the Day</h3>
                    <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200">Bonus XP</Badge>
                  </div>
                  <Card className="border border-neutral-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="space-y-1">
                          <div className="text-xs text-neutral-400 font-mono tracking-wider">DAILY SELECTION</div>
                          <div className="flex items-baseline gap-3 flex-wrap">
                            <h4 className="text-3xl font-bold font-serif text-neutral-900 tracking-tight">Спасибо</h4>
                            <span className="text-xs font-mono text-orange-500 bg-orange-50 px-2 py-0.5 rounded">[spah-see-bah]</span>
                          </div>
                          <p className="text-sm text-neutral-600 font-medium pt-1">
                            "Thank you" — <span className="text-neutral-500 font-light">The most essential word you will use at Pyaterochka supermarkets, Yandex taxis, and in your HSE/RUDN dormitory.</span>
                          </p>
                        </div>
                        <Button 
                          onClick={() => {
                            setActiveTab('scenarios');
                            toast.success("AI Scenario Tutor started! Try saying 'Спасибо' (Thank you) to practice pronunciation.");
                          }}
                          className="bg-neutral-900 hover:bg-black text-white px-5 h-10 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5 transition-all"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-orange-400" />
                          Practice in Chat
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="alphabet" className="flex-1 m-0 h-full overflow-hidden">
               <AlphabetView />
            </TabsContent>

            <TabsContent value="vocabulary" className="flex-1 m-0 h-full overflow-hidden">
               <VocabularyView />
            </TabsContent>

            <TabsContent value="grammar" className="flex-1 m-0 h-full overflow-hidden">
               <GrammarView />
            </TabsContent>

            <TabsContent value="scenarios" className="flex-1 m-0 h-full overflow-hidden">
               {(isPremium || isTrialValid) ? (
                 <ScenarioChat />
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
                        <span className="text-6xl font-bold">$1</span>
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
                         <Button onClick={handleUpgrade} className="w-full h-16 bg-neutral-900 hover:bg-black rounded-2xl text-xl font-bold transition-transform hover:scale-[1.02]">
                           Activate Plan for $1
                         </Button>
                       )}
                       <p className="text-center text-[10px] text-neutral-400">Secure payment. Cancel subscription anytime from this panel.</p>
                    </CardContent>
                 </Card>
               </div>
             </TabsContent>

             <TabsContent value="profile" className="flex-1 m-0 h-full overflow-hidden">
                <ProfileView onNavigate={setActiveTab} />
             </TabsContent>

             <TabsContent value="lectures" className="flex-1 m-0 h-full overflow-hidden">
                <LecturesView />
             </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  );
}
