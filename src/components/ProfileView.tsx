import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/App';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  User, 
  Mail, 
  Calendar, 
  CreditCard, 
  History, 
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Crown,
  Camera,
  Loader2,
  Globe,
  Phone,
  Award,
  BookOpen,
  MessageSquare,
  Send,
  Sparkles
} from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'motion/react';

const COUNTRIES = [
  { name: 'Australia', flag: '🇦🇺', code: '+61' },
  { name: 'Belarus', flag: '🇧🇾', code: '+375' },
  { name: 'Brazil', flag: '🇧🇷', code: '+55' },
  { name: 'Canada', flag: '🇨🇦', code: '+1' },
  { name: 'China', flag: '🇨🇳', code: '+86' },
  { name: 'France', flag: '🇫🇷', code: '+33' },
  { name: 'Germany', flag: '🇩🇪', code: '+49' },
  { name: 'India', flag: '🇮🇳', code: '+91' },
  { name: 'Iran', flag: '🇮🇷', code: '+98' },
  { name: 'Kazakhstan', flag: '🇰🇿', code: '+7' },
  { name: 'Pakistan', flag: '🇵🇰', code: '+92' },
  { name: 'Russia', flag: '🇷🇺', code: '+7' },
  { name: 'Saudi Arabia', flag: '🇸🇦', code: '+966' },
  { name: 'South Africa', flag: '🇿🇦', code: '+27' },
  { name: 'Turkey', flag: '🇹🇷', code: '+90' },
  { name: 'United Kingdom', flag: '🇬🇧', code: '+44' },
  { name: 'United States', flag: '🇺🇸', code: '+1' },
  { name: 'Uzbekistan', flag: '🇺🇿', code: '+998' }
];

const REASONS = [
  "🎓 Open Doors Scholarship",
  "🎓 Rossotrudnichestvo Scholarship",
  "🎓 MGIMO University Scholarship",
  "🎓 HSE University Scholarship",
  "🎓 Peoples Friendship University (RUDN)",
  "🎓 St. Petersburg State University",
  "🎓 Novosibirsk State University",
  "💼 Work/Career in Russia",
  "🌍 Travel to Russia",
  "❤️ Russian Culture & Literature",
  "💬 Learning for Fun",
  "🤝 Russian Friends/Partner",
  "📚 Academic Research",
  "🏥 Medical Studies in Russia",
  "⚙️ Engineering Studies in Russia",
  "Other (specify)"
];

const PREDEFINED_AVATARS = [
  {
    id: 'sofia_linguist',
    name: '👩‍🏫 Prof. Sofia (Linguist)',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g_sofia" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ec4899"/><stop offset="100%" stop-color="#be123c"/></linearGradient></defs><circle cx="50" cy="50" r="50" fill="url(#g_sofia)"/><text x="50" y="52" font-family="system-ui" font-size="42" text-anchor="middle" dominant-baseline="middle">👩‍🏫</text></svg>`
  },
  {
    id: 'dmitry_historian',
    name: '👨‍🏫 Prof. Dmitry (Historian)',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g_dmitry" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#3b82f6"/><stop offset="100%" stop-color="#1d4ed8"/></linearGradient></defs><circle cx="50" cy="50" r="50" fill="url(#g_dmitry)"/><text x="50" y="52" font-family="system-ui" font-size="42" text-anchor="middle" dominant-baseline="middle">👨‍🏫</text></svg>`
  },
  {
    id: 'anna_scholar',
    name: '👩‍🎓 Scholar Anna',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g_anna" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#06b6d4"/><stop offset="100%" stop-color="#0891b2"/></linearGradient></defs><circle cx="50" cy="50" r="50" fill="url(#g_anna)"/><text x="50" y="52" font-family="system-ui" font-size="42" text-anchor="middle" dominant-baseline="middle">👩‍🎓</text></svg>`
  },
  {
    id: 'ivan_scholar',
    name: '👨‍🎓 Scholar Ivan',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g_ivan" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#6366f1"/><stop offset="100%" stop-color="#4338ca"/></linearGradient></defs><circle cx="50" cy="50" r="50" fill="url(#g_ivan)"/><text x="50" y="52" font-family="system-ui" font-size="42" text-anchor="middle" dominant-baseline="middle">👨‍🎓</text></svg>`
  },
  {
    id: 'elena_hostess',
    name: '👩‍🍳 Hostess Elena',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g_elena" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#f59e0b"/><stop offset="100%" stop-color="#b45309"/></linearGradient></defs><circle cx="50" cy="50" r="50" fill="url(#g_elena)"/><text x="50" y="52" font-family="system-ui" font-size="42" text-anchor="middle" dominant-baseline="middle">👩‍🍳</text></svg>`
  },
  {
    id: 'alex_explorer',
    name: '👨‍🌾 Explorer Alex',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g_alex" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#10b981"/><stop offset="100%" stop-color="#047857"/></linearGradient></defs><circle cx="50" cy="50" r="50" fill="url(#g_alex)"/><text x="50" y="52" font-family="system-ui" font-size="42" text-anchor="middle" dominant-baseline="middle">👨‍🌾</text></svg>`
  },
  {
    id: 'maria_cosmonaut',
    name: '👩‍🚀 Pioneer Maria',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g_maria" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#a855f7"/><stop offset="100%" stop-color="#7e22ce"/></linearGradient></defs><circle cx="50" cy="50" r="50" fill="url(#g_maria)"/><text x="50" y="52" font-family="system-ui" font-size="42" text-anchor="middle" dominant-baseline="middle">👩‍🚀</text></svg>`
  },
  {
    id: 'pavel_cosmonaut',
    name: '👨‍🚀 Pioneer Pavel',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g_pavel" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#14b8a6"/><stop offset="100%" stop-color="#0f766e"/></linearGradient></defs><circle cx="50" cy="50" r="50" fill="url(#g_pavel)"/><text x="50" y="52" font-family="system-ui" font-size="42" text-anchor="middle" dominant-baseline="middle">👨‍🚀</text></svg>`
  },
  {
    id: 'siberian_bear',
    name: '🐻 Siberian Bear (Misha)',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g_bear" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#fb923c"/><stop offset="100%" stop-color="#c2410c"/></linearGradient></defs><circle cx="50" cy="50" r="50" fill="url(#g_bear)"/><text x="50" y="52" font-family="system-ui" font-size="42" text-anchor="middle" dominant-baseline="middle">🐻</text></svg>`
  },
  {
    id: 'matryoshka',
    name: '🪆 Matryoshka Doll',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g_doll" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#f43f5e"/><stop offset="100%" stop-color="#be123c"/></linearGradient></defs><circle cx="50" cy="50" r="50" fill="url(#g_doll)"/><text x="50" y="52" font-family="system-ui" font-size="42" text-anchor="middle" dominant-baseline="middle">🪆</text></svg>`
  },
  {
    id: 'academic_firebird',
    name: '🔥 Academic Firebird',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g_fire" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#f97316"/><stop offset="100%" stop-color="#ea580c"/></linearGradient></defs><circle cx="50" cy="50" r="50" fill="url(#g_fire)"/><text x="50" y="52" font-family="system-ui" font-size="42" text-anchor="middle" dominant-baseline="middle">🔥</text></svg>`
  },
  {
    id: 'smart_owl',
    name: '🦉 Wise Owl (Umnitsa)',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g_owl" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#64748b"/><stop offset="100%" stop-color="#334155"/></linearGradient></defs><circle cx="50" cy="50" r="50" fill="url(#g_owl)"/><text x="50" y="52" font-family="system-ui" font-size="42" text-anchor="middle" dominant-baseline="middle">🦉</text></svg>`
  }
];

export function ProfileView({ onNavigate }: { onNavigate?: (tab: string) => void }) {
  const { user, profile, isPremium, updateProfileState } = useAuth();

  // Profile fields state values
  const [displayName, setDisplayName] = useState('');
  const [country, setCountry] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [phoneInput, setPhoneInput] = useState('');
  const [learningReason, setLearningReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [bio, setBio] = useState('');

  // UI operation states
  const [savingProfile, setSavingProfile] = useState(false);
  const [isAvatarSelectorOpen, setIsAvatarSelectorOpen] = useState(false);

  const selectPredefinedAvatar = async (avatarSvg: string) => {
    const dataUrl = 'data:image/svg+xml;utf8,' + encodeURIComponent(avatarSvg);
    
    // Update local state first for immediate visual response
    updateProfileState({
      ...profile,
      avatar_url: dataUrl,
      avatarUrl: dataUrl
    });

    if (user && !user.isGuest && supabase) {
      try {
        const { error: dbError } = await supabase
          .from('users')
          .update({
            avatar_url: dataUrl
          })
          .eq('uid', user.id);
        
        if (dbError) {
          console.warn("Could not save predefined avatar to database:", dbError);
        } else {
          toast.success('Scholar avatar updated successfully!');
        }
      } catch (err) {
        console.error("Failed to sync predefined avatar to database:", err);
      }
    } else if (user?.isGuest) {
      toast.success('Scholar avatar updated locally (Guest Mode).');
    }
  };

  // Feedback form states
  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  // Admin feedbacks state
  const [adminFeedbacks, setAdminFeedbacks] = useState<any[]>([]);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(false);

  const isAdmin = user?.email === 'misbahrehman891@gmail.com';

  const fetchFeedbacks = async () => {
    if (!isAdmin || !supabase) return;
    setLoadingFeedbacks(true);
    try {
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setAdminFeedbacks(data || []);
    } catch (err) {
      console.error('Error fetching feedbacks:', err);
    } finally {
      setLoadingFeedbacks(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchFeedbacks();
    }
  }, [user, isAdmin]);

  // Initialize fields from profile context
  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || '');
      setCountry(profile.country || '');
      setBio(profile.bio || '');

      // Pre-fill feedback details
      setFeedbackName((prev) => prev || profile.displayName || '');
      setFeedbackEmail((prev) => prev || user?.email || '');

      // Parse phone number to extract country code split
      const phoneFull = profile.phone_number || '';
      if (phoneFull) {
        const parts = phoneFull.split(' ');
        if (parts.length > 1 && parts[0].startsWith('+')) {
          setCountryCode(parts[0]);
          setPhoneInput(parts.slice(1).join(' '));
        } else {
          setPhoneInput(phoneFull);
        }
      } else {
        setPhoneInput('');
      }

      // Parse learning reason split
      const reasonVal = profile.learning_reason || '';
      if (reasonVal) {
        if (reasonVal.startsWith('Other:')) {
          setLearningReason('Other (specify)');
          setCustomReason(reasonVal.replace('Other:', '').trim());
        } else if (REASONS.includes(reasonVal)) {
          setLearningReason(reasonVal);
          setCustomReason('');
        } else {
          setLearningReason('Other (specify)');
          setCustomReason(reasonVal);
        }
      } else {
        setLearningReason('');
        setCustomReason('');
      }
    }
  }, [profile]);

  // If country changes, sync dial code
  useEffect(() => {
    if (country) {
      const selected = COUNTRIES.find(c => c.name === country);
      if (selected) {
        setCountryCode(selected.code);
      }
    }
  }, [country]);

  const handleAvatarClick = () => {
    setIsAvatarSelectorOpen(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSavingProfile(true);
    const phoneNumberFull = phoneInput ? `${countryCode} ${phoneInput}`.trim() : '';
    const finalReason = learningReason === 'Other (specify)' ? `Other: ${customReason}` : learningReason;

    try {
      if (user.isGuest) {
        updateProfileState({
          ...profile,
          displayName,
          country,
          phone_number: phoneNumberFull,
          learning_reason: finalReason,
          bio
        });
        toast.success('Profile updated locally (Guest Mode).');
        setSavingProfile(false);
        return;
      }

      if (!supabase) throw new Error('Supabase client is not initialized.');

      // Race the actual Supabase update with an 8-second timeout to prevent infinite freezing/hanging
      const updatePromise = supabase
        .from('users')
        .update({
          displayName,
          country,
          phone_number: phoneNumberFull,
          learning_reason: finalReason,
          bio
        })
        .eq('uid', user.id);

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Connection timed out. Please check your internet or Supabase project status.')), 8000)
      );

      const { error } = (await Promise.race([updatePromise, timeoutPromise])) as any;

      if (error) {
        // Interpret missing column errors explicitly to guide the user on running migrations
        const errMsg = error.message || String(error);
        if (
          errMsg.includes('column') || 
          errMsg.includes('relation') || 
          error.code === '42703'
        ) {
          throw new Error(
            'Missing columns in your database table. Your Supabase "users" table does not have columns like "country", "phone_number", "learning_reason", or "bio". To fix this, please run the ALTER TABLE sql queries listed inside of "/supabase_schema.sql" in your Supabase SQL Editor.'
          );
        }
        throw error;
      }

      updateProfileState({
        ...profile,
        displayName,
        country,
        phone_number: phoneNumberFull,
        learning_reason: finalReason,
        bio
      });

      toast.success('Profile saved successfully!');
    } catch (err: any) {
      console.error(err);
      const friendlyMessage = err.message || String(err);
      toast.error('Failed to save profile: ' + friendlyMessage, {
        duration: 8000
      });
      
      // Fallback to local update so the UI operates correctly for the current tab state
      updateProfileState({
        ...profile,
        displayName,
        country,
        phone_number: phoneNumberFull,
        learning_reason: finalReason,
        bio
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!user) return;
    
    const confirmCancel = window.confirm('Are you sure you want to cancel your premium subscription? You will lose access to premium features immediately.');
    
    if (!confirmCancel) return;

    const currentBilling = profile?.billingHistory || [];
    const updatedBilling = [
      ...currentBilling,
      {
        id: `inv_${Math.random().toString(36).substr(2, 9)}`,
        date: new Date().toISOString(),
        amount: 0,
        description: 'Subscription Cancelled',
        status: 'cancelled'
      }
    ];

    try {
      if (user.isGuest) {
        updateProfileState({
          ...profile,
          isPremium: false,
          cancelledAt: new Date().toISOString(),
          billingHistory: updatedBilling
        });
        toast.success('Your subscription has been cancelled (Guest Mode).');
        return;
      }

      if (!supabase) throw new Error('Supabase client is not initialized.');

      const { error } = await supabase
        .from('users')
        .update({
          isPremium: false,
          premiumUntil: null,
          billingHistory: updatedBilling
        })
        .eq('uid', user.id);

      if (error) throw error;

      updateProfileState({
        ...profile,
        isPremium: false,
        premiumUntil: null,
        billingHistory: updatedBilling
      });

      toast.success('Your subscription has been cancelled.');
    } catch (e: any) {
      toast.error('Failed to cancel subscription: ' + e.message);
    }
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    setSubmittingFeedback(true);

    try {
      if (user?.isGuest) {
        // Guest mode fallback: Save to localStorage
        const localFeedbacks = JSON.parse(localStorage.getItem('scholar_feedback_fallback') || '[]');
        localFeedbacks.push({
          id: `feed_${Math.random().toString(36).substr(2, 9)}`,
          name: feedbackName,
          email: feedbackEmail,
          feedback: feedbackText,
          created_at: new Date().toISOString(),
          is_guest: true
        });
        localStorage.setItem('scholar_feedback_fallback', JSON.stringify(localFeedbacks));
        
        toast.success('Thank you! Feedback saved locally (Guest Mode).');
        setFeedbackSuccess(true);
        setSubmittingFeedback(false);
        return;
      }

      if (!supabase) throw new Error('Supabase client is not initialized.');

      // Try inserting into public.feedback
      const { error } = await supabase
        .from('feedback')
        .insert([
          {
            user_id: user?.id || null,
            name: feedbackName,
            email: feedbackEmail,
            feedback: feedbackText
          }
        ]);

      if (error) {
        console.warn('Feedback submit to Supabase failed, trying schema fallback:', error);
        // If it's a missing table/column error, let's notify the user that they should run the schema SQL,
        // but save it locally so they don't lose their input.
        if (error.message?.includes('relation "public.feedback" does not exist') || error.code === '42P01') {
          // Save to localStorage as fallback
          const localFeedbacks = JSON.parse(localStorage.getItem('scholar_feedback_fallback') || '[]');
          localFeedbacks.push({
            id: `feed_${Math.random().toString(36).substr(2, 9)}`,
            name: feedbackName,
            email: feedbackEmail,
            feedback: feedbackText,
            created_at: new Date().toISOString(),
            pending_sync: true
          });
          localStorage.setItem('scholar_feedback_fallback', JSON.stringify(localFeedbacks));

          toast.warning('Feedback saved locally! The "feedback" table is missing in Supabase. Please run the feedback SQL schema in "/supabase_schema.sql" to enable server-side feedback storage!');
          setFeedbackSuccess(true);
          return;
        }
        throw error;
      }

      toast.success('Feedback submitted successfully!');
      setFeedbackSuccess(true);
    } catch (err: any) {
      console.error('Error submitting feedback:', err);
      toast.error('Failed to send feedback: ' + (err.message || String(err)));
      
      // Absolute fallback to local storage
      const localFeedbacks = JSON.parse(localStorage.getItem('scholar_feedback_fallback') || '[]');
      localFeedbacks.push({
        id: `feed_${Math.random().toString(36).substr(2, 9)}`,
        name: feedbackName,
        email: feedbackEmail,
        feedback: feedbackText,
        created_at: new Date().toISOString(),
        error_saved: true
      });
      localStorage.setItem('scholar_feedback_fallback', JSON.stringify(localFeedbacks));
      toast.info('Saved feedback locally to prevent data loss.');
      setFeedbackSuccess(true);
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const billingHistory = profile?.billingHistory || [];

  // Active user's flag
  const userCountryObj = COUNTRIES.find(c => c.name === country);
  const activeUserFlag = userCountryObj ? userCountryObj.flag : '';

  return (
    <div className="h-full bg-white">
      <ScrollArea className="h-full">
        <div className="p-4 md:p-8 pb-32 md:pb-16 text-neutral-900">
          <div className="max-w-4xl mx-auto space-y-8">
            <div>
              <h2 className="text-3xl font-light tracking-tight mb-2">User <span className="font-serif italic text-orange-600">Profile</span></h2>
              <p className="text-neutral-500 text-sm">Manage your profile details, avatar, and billing credentials.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Profile Card left panel */}
              <div className="md:col-span-1 space-y-6">
                <Card className="overflow-hidden border border-neutral-100 shadow-md">
                  <div className="p-6 flex flex-col items-center text-center space-y-4">
                    {/* Circle Avatar with Interactive Selection Overlay */}
                    <div className="relative group cursor-pointer" onClick={handleAvatarClick} title="Select Scholar Avatar">
                      <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-neutral-100 bg-neutral-50 shadow-md relative flex items-center justify-center transition-all duration-300 group-hover:border-orange-500/50 group-hover:shadow-lg">
                        {profile?.avatarUrl || profile?.avatar_url ? (
                          <img 
                            src={profile.avatarUrl || profile.avatar_url} 
                            alt={profile.displayName || displayName} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-orange-100 flex items-center justify-center text-orange-600 text-2xl font-serif font-bold select-none">
                            {displayName?.slice(0, 1).toUpperCase() || 'S'}
                          </div>
                        )}
                        
                        {/* Elegant Selection Overlay on Hover */}
                        <div className="absolute inset-0 bg-neutral-900/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <Sparkles className="w-5 h-5 text-white animate-pulse" />
                          <span className="text-[9px] text-white font-medium tracking-wider mt-1 uppercase">Choose</span>
                        </div>
                      </div>
                      
                      {/* Flag Badge Overlay */}
                      {activeUserFlag && (
                        <div className="absolute -bottom-1 -right-1 bg-white border border-neutral-100 rounded-full w-8 h-8 flex items-center justify-center shadow-md text-base select-none">
                          {activeUserFlag}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 flex flex-col items-center">
                      <div>
                        <h3 className="text-lg font-bold truncate max-w-[200px]">{displayName || 'Scholar'}</h3>
                        <p className="text-xs text-neutral-400 font-light truncate max-w-[200px]">{user?.email}</p>
                      </div>

                      <Dialog open={isAvatarSelectorOpen} onOpenChange={setIsAvatarSelectorOpen}>
                        <DialogTrigger 
                          render={
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-[11px] h-7 px-3 rounded-xl border-neutral-200 hover:bg-neutral-50 flex items-center gap-1.5 font-medium text-neutral-600 transition-all shadow-3xs"
                            >
                              <Crown className="w-3.5 h-3.5 text-orange-500" /> Choose Scholar Avatar
                            </Button>
                          }
                        />
                        <DialogContent className="sm:max-w-[420px] rounded-3xl p-6 overflow-hidden bg-white border border-neutral-100 shadow-xl">
                          <DialogHeader className="pb-3 border-b border-neutral-100">
                            <DialogTitle className="text-base font-serif italic text-neutral-900 flex items-center gap-2">
                              🎓 Scholar Avatar Collection
                            </DialogTitle>
                            <DialogDescription className="text-neutral-500 text-xs">
                              Select an exclusive lightweight avatar. These are fast, high-quality, and completely bypass standard file uploads!
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="grid grid-cols-4 gap-3 pt-4">
                            {PREDEFINED_AVATARS.map((avatar) => {
                              const avatarDataUrl = 'data:image/svg+xml;utf8,' + encodeURIComponent(avatar.svg);
                              const isSelected = profile?.avatar_url === avatarDataUrl || profile?.avatarUrl === avatarDataUrl;
                              return (
                                <button
                                  key={avatar.id}
                                  onClick={() => {
                                    selectPredefinedAvatar(avatar.svg);
                                    setIsAvatarSelectorOpen(false);
                                  }}
                                  className={`group relative aspect-square rounded-2xl p-1.5 flex flex-col items-center justify-center border transition-all ${
                                    isSelected 
                                      ? 'border-orange-500 bg-orange-50/50 ring-2 ring-orange-500/20' 
                                      : 'border-neutral-100 hover:border-neutral-200 hover:bg-neutral-50/50'
                                  }`}
                                >
                                  <div 
                                    className="w-12 h-12 rounded-full overflow-hidden shadow-xs group-hover:scale-105 transition-transform duration-200"
                                    dangerouslySetInnerHTML={{ __html: avatar.svg }}
                                  />
                                  <span className="text-[9px] font-medium text-neutral-500 mt-1.5 text-center truncate w-full group-hover:text-neutral-700 transition-colors">
                                    {avatar.name.split(' ').slice(1).join(' ') || avatar.name}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>

                    <div className="w-full pt-4 border-t border-neutral-100 space-y-2.5 text-left">
                      <div className="flex items-center gap-2 text-xs text-neutral-600">
                        <Calendar className="w-4 h-4 text-neutral-400" />
                        <span>Member: <b>{profile?.createdAt ? format(new Date(profile.createdAt), 'MMM d, yyyy') : 'N/A'}</b></span>
                      </div>
                      
                      {profile?.streak_count !== undefined && (
                        <div className="flex items-center gap-2 text-xs text-neutral-600">
                          <span className="text-sm select-none">🔥</span>
                          <span>Streak: <b>{profile.streak_count} Days</b></span>
                        </div>
                      )}

                      {profile?.lessons_completed && (
                        <div className="flex items-center gap-2 text-xs text-neutral-600">
                          <BookOpen className="w-4 h-4 text-neutral-400" />
                          <span>Lessons: <b>{Object.keys(profile.lessons_completed).length} Done</b></span>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>

                {/* Sub Plan details */}
                <Card className="overflow-hidden relative border border-neutral-100 shadow-md">
                  {isPremium && (
                    <div className="absolute top-0 right-0 p-3">
                      <Crown className="w-10 h-10 text-orange-500/10 rotate-12" />
                    </div>
                  )}
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-bold flex items-center gap-2 uppercase tracking-wide text-neutral-400">
                      <CreditCard className="w-4 h-4" />
                      Plan Info
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-base">{isPremium ? 'Scholar Elite' : 'Free Trial'}</span>
                      {isPremium ? (
                        <Badge className="bg-orange-500 text-white font-bold text-[10px]">PREMIUM</Badge>
                      ) : (
                        <Badge variant="secondary" className="font-bold text-[10px]">BASIC</Badge>
                      )}
                    </div>
                    <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                      {isPremium 
                        ? 'Unlimited access active. Enjoy advanced speaking sessions.' 
                        : 'On a 7-day trial of base Russian practice tools.'}
                    </p>

                    <div className="pt-3 border-t border-neutral-100 flex flex-col gap-2">
                      {isPremium ? (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleCancelSubscription}
                          className="text-red-500 border-red-150 hover:bg-red-50 hover:text-red-600 w-full h-9 rounded-xl font-bold text-xs"
                        >
                          Cancel Subscription
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          className="bg-neutral-900 hover:bg-black text-white w-full h-9 rounded-xl font-bold text-xs"
                          onClick={() => onNavigate?.('premium')}
                        >
                          Upgrade Now
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Edit Fields right panel */}
              <div className="md:col-span-2">
                <Card className="border border-neutral-100 shadow-md">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="w-5 h-5 text-orange-600" />
                      Edit Profile Credentials
                    </CardTitle>
                    <CardDescription>Keep your scholarship and personal information up to date.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSaveProfile} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Display Name */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-neutral-500">Display Name</label>
                          <input 
                            type="text"
                            required
                            className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-white text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                            placeholder="John Doe"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                          />
                        </div>

                        {/* Country Selection */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-neutral-500">Country</label>
                          <div className="relative">
                            <select
                              value={country}
                              onChange={(e) => setCountry(e.target.value)}
                              required
                              className="w-full pl-3.5 pr-8 py-2.5 rounded-xl border border-neutral-200 bg-white text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none pointer-events-auto cursor-pointer"
                            >
                              <option value="" disabled>Select Country</option>
                              {COUNTRIES.map((c) => (
                                <option key={c.name} value={c.name}>
                                  {c.flag} {c.name}
                                </option>
                              ))}
                            </select>
                            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400 text-xs">▼</div>
                          </div>
                        </div>
                      </div>

                      {/* Phone Number Field */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-neutral-500">Phone Number (Optional)</label>
                        <div className="flex gap-2">
                          <div className="relative w-20 sm:w-24 shrink-0">
                            <select
                              value={countryCode}
                              onChange={(e) => setCountryCode(e.target.value)}
                              className="w-full pl-2 pr-5 py-2.5 rounded-xl border border-neutral-200 bg-white text-xs sm:text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none cursor-pointer"
                            >
                              {COUNTRIES.map((c) => (
                                <option key={`${c.name}-profile`} value={c.code}>
                                  {c.flag} {c.code}
                                </option>
                              ))}
                            </select>
                            <div className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400 text-[10px]">▼</div>
                          </div>
                          <input 
                            type="tel"
                            className="flex-1 min-w-0 px-3 py-2.5 rounded-xl border border-neutral-200 bg-white text-xs sm:text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                            placeholder="300 1234567"
                            value={phoneInput}
                            onChange={(e) => setPhoneInput(e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Learning Reason */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-neutral-500">Reason for Learning Russian</label>
                        <div className="relative">
                          <select
                            value={learningReason}
                            onChange={(e) => setLearningReason(e.target.value)}
                            required
                            className="w-full pl-3.5 pr-8 py-2.5 rounded-xl border border-neutral-200 bg-white text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none cursor-pointer"
                          >
                            <option value="" disabled>Select Reason</option>
                            {REASONS.map((r) => (
                              <option key={r} value={r}>
                                {r}
                              </option>
                            ))}
                          </select>
                          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400 text-xs">▼</div>
                        </div>
                      </div>

                      {/* Other Custom Reason Input */}
                      {learningReason === 'Other (specify)' && (
                        <div className="space-y-1.5 animate-in slide-in-from-top-1 duration-200">
                          <label className="text-xs font-bold text-neutral-500">Please specify</label>
                          <input 
                            type="text"
                            required
                            className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-white text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                            placeholder="Specify details..."
                            value={customReason}
                            onChange={(e) => setCustomReason(e.target.value)}
                          />
                        </div>
                      )}

                      {/* Bio with 150 Limit */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <label className="text-xs font-bold text-neutral-500">Short Bio</label>
                          <span className={`text-[10px] font-semibold ${bio.length > 150 ? 'text-red-500' : 'text-neutral-400'}`}>
                            {bio.length} / 150 Characters
                          </span>
                        </div>
                        <textarea
                          maxLength={150}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-white text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all min-h-[90px] resize-none"
                          placeholder="Tell the community about yourself (your scholarship, major, cities you plans to study in, etc...)"
                          value={bio}
                          onChange={(e) => setBio(e.target.value.substring(0, 150))}
                        />
                      </div>

                      <Button 
                        type="submit" 
                        disabled={savingProfile || bio.length > 150}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold h-11 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                      >
                        {savingProfile && <Loader2 className="w-4 h-4 animate-spin" />}
                        {savingProfile ? 'Saving Changes...' : 'Save Profile Details'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Billing History Card */}
            <Card className="border border-neutral-100 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <History className="w-5 h-5 text-neutral-400" />
                  Billing Invoice History
                </CardTitle>
                <CardDescription>Record of previous payments and transactions on the Scholar Elite plan.</CardDescription>
              </CardHeader>
              <CardContent>
                {billingHistory.length > 0 ? (
                  <div className="relative overflow-x-auto border border-neutral-150 rounded-2xl">
                    <table className="w-full text-sm text-left">
                      <thead className="text-[10px] uppercase font-bold text-neutral-400 bg-neutral-50">
                        <tr>
                          <th className="px-6 py-3">Date</th>
                          <th className="px-6 py-3">Description</th>
                          <th className="px-6 py-3">Amount</th>
                          <th className="px-6 py-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100">
                        {billingHistory.slice().reverse().map((item: any) => (
                          <tr key={item.id} className="hover:bg-neutral-50/50 transition-colors">
                            <td className="px-6 py-4 font-medium text-neutral-600">
                              {format(new Date(item.date), 'MMM d, yyyy')}
                            </td>
                            <td className="px-6 py-4 text-neutral-950 font-medium">
                              {item.description}
                            </td>
                            <td className="px-6 py-4 font-bold text-neutral-900">
                              ${(item.amount || 0).toFixed(2)}
                            </td>
                            <td className="px-6 py-4">
                              <Badge 
                                variant="secondary" 
                                className={`
                                  ${item.status === 'succeeded' ? 'bg-green-55 text-green-700 hover:bg-green-55 border border-green-200' : ''}
                                  ${item.status === 'cancelled' ? 'bg-red-50 text-red-700 hover:bg-red-50' : ''}
                                  capitalize font-bold text-[10px] px-2.5 py-0.5 rounded-full
                                `}
                              >
                                {item.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-neutral-50 rounded-2xl border border-dashed border-neutral-200">
                    <History className="w-8 h-8 text-neutral-300 mx-auto mb-3" />
                    <p className="text-neutral-500 text-sm">No transactions on this account.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Feedback Section */}
            <Card className="border border-neutral-100 shadow-md overflow-hidden">
              <CardHeader className="bg-neutral-50/50 border-b border-neutral-100/80">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-orange-600" />
                  Share Your Feedback
                </CardTitle>
                <CardDescription>
                  Tell us what you want to see next and how you are interacting with the platform. We read every submission!
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {feedbackSuccess ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center text-center py-10 space-y-3"
                  >
                    <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center border border-green-200">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-lg text-neutral-900">Thank you for your feedback!</h3>
                    <p className="text-neutral-500 text-xs max-w-md">
                      Your response has been stored successfully. We appreciate you taking the time to help us improve Russian Scholar!
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setFeedbackSuccess(false);
                        setFeedbackText('');
                      }}
                      className="mt-2 rounded-xl text-xs font-semibold"
                    >
                      Submit Another Response
                    </Button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-neutral-500">Your Name</label>
                        <input 
                          type="text"
                          required
                          className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-white text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                          placeholder="Your full name"
                          value={feedbackName}
                          onChange={(e) => setFeedbackName(e.target.value)}
                        />
                      </div>

                      {/* Email */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-neutral-500">Your Email</label>
                        <input 
                          type="email"
                          required
                          className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-white text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                          placeholder="you@example.com"
                          value={feedbackEmail}
                          onChange={(e) => setFeedbackEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Feedback Message */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-neutral-500">Feedback or Feature Suggestion</label>
                        <span className="text-[10px] font-semibold text-neutral-400">
                          {feedbackText.length} / 1000 Characters
                        </span>
                      </div>
                      <textarea
                        required
                        maxLength={1000}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-white text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all min-h-[120px] resize-none"
                        placeholder="Tell us what you like, what bugs you've encountered, or what features you would love to have next..."
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value.substring(0, 1000))}
                      />
                    </div>

                    <Button 
                      type="submit"
                      disabled={submittingFeedback || !feedbackText.trim()}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold h-11 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      {submittingFeedback ? (
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
              </CardContent>
            </Card>

            {/* Admin Feedback Submissions List */}
            {isAdmin && (
              <Card className="border border-neutral-100 shadow-md overflow-hidden mt-6">
                <CardHeader className="bg-neutral-50/50 border-b border-neutral-100/80 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-orange-600" />
                      Feedback Submissions (Admin View)
                    </CardTitle>
                    <CardDescription>
                      View and read all feedback submitted by students and scholars.
                    </CardDescription>
                  </div>
                  <Button 
                    type="button"
                    variant="outline" 
                    size="sm" 
                    disabled={loadingFeedbacks}
                    onClick={fetchFeedbacks}
                    className="rounded-xl font-bold text-xs"
                  >
                    {loadingFeedbacks ? 'Refreshing...' : 'Refresh'}
                  </Button>
                </CardHeader>
                <CardContent className="pt-6">
                  {loadingFeedbacks ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
                    </div>
                  ) : adminFeedbacks.length === 0 ? (
                    <div className="text-center py-10 text-neutral-400 text-sm">
                      No feedback submitted yet.
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                      {adminFeedbacks.map((f, idx) => (
                        <div 
                          key={f.id || idx} 
                          className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-2 hover:bg-neutral-100/40 transition-colors"
                        >
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <p className="font-bold text-neutral-900 text-sm">{f.name}</p>
                              <p className="text-neutral-500 text-xs">{f.email}</p>
                            </div>
                            <span className="text-[10px] text-neutral-400 shrink-0 font-medium bg-neutral-100 px-2.5 py-1 rounded-full">
                              {f.created_at ? new Date(f.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                            </span>
                          </div>
                          <p className="text-neutral-700 text-sm font-light leading-relaxed whitespace-pre-wrap">
                            {f.feedback}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>

  );
}
