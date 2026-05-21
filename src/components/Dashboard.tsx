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
  const { user, profile, signOut, isTrialValid, isPremium, updateProfileState } = useAuth();
  const [activeTab, setActiveTab] = useState('home');

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
                <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || ''} />
                <AvatarFallback className="bg-neutral-100 text-neutral-600">{user?.displayName?.charAt(0) || <User />}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" sideOffset={8}>
              <div className="flex flex-col space-y-1 p-2">
                <p className="text-sm font-medium leading-none truncate">{user?.displayName}</p>
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
              <TabsTrigger value="premium" className="w-full justify-start gap-3 h-12 bg-transparent data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-xl transition-all">
                <Crown className="w-4 h-4" /> Premium Plan
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
                 <Crown className="w-5 h-5" /> Premium
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
                  <h1 className="text-2xl md:text-3xl font-light tracking-tight mb-2">Welcome back, <span className="font-serif italic">{user?.displayName?.split(' ')[0]}</span>.</h1>
                  <p className="text-neutral-500 text-sm md:text-base">Your journey to Russia starts here. You're part of the {profile?.scholarshipType || 'Scholar'} class.</p>
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   <Card className="hover:border-neutral-300 transition-colors cursor-pointer group" onClick={() => setActiveTab('alphabet')}>
                     <CardHeader>
                       <CardTitle className="flex items-center gap-2">
                        <div className="p-2 bg-neutral-100 rounded-lg group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
                          <BookOpen className="w-5 h-5" />
                        </div>
                        Alphabet Master
                       </CardTitle>
                       <CardDescription>Learn the sounds and letters of the Cyrillic alphabet.</CardDescription>
                     </CardHeader>
                   </Card>

                   <Card className="hover:border-neutral-300 transition-colors cursor-pointer group" onClick={() => setActiveTab('grammar')}>
                     <CardHeader>
                       <CardTitle className="flex items-center gap-2">
                        <div className="p-2 bg-neutral-100 rounded-lg group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
                          <BookText className="w-5 h-5" />
                        </div>
                        Grammar Essentials
                       </CardTitle>
                       <CardDescription>Master cases, pronouns, and sentence structure.</CardDescription>
                     </CardHeader>
                   </Card>
                   
                   <Card className="hover:border-neutral-300 transition-colors cursor-pointer group" onClick={() => setActiveTab('scenarios')}>
                     <CardHeader>
                       <CardTitle className="flex items-center gap-2">
                        <div className="p-2 bg-neutral-100 rounded-lg group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
                          <MessageSquare className="w-5 h-5" />
                        </div>
                        Voice Scenarios
                       </CardTitle>
                       <CardDescription>Practice real conversations for taxi, hotel, and dining.</CardDescription>
                     </CardHeader>
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
