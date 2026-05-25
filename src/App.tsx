import React, { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from './lib/supabase';
import { Toaster } from '@/components/ui/sonner-toaster';
import { LandingPage } from '@/components/LandingPage';
import { Dashboard } from '@/components/Dashboard';
import { toast } from 'sonner';
import { AlertCircle, Terminal } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import AuthCallback from './components/AuthCallback';

interface AuthContextType {
  user: any | null;
  profile: any | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signUp: () => Promise<void>;
  signInAsGuest: () => void;
  signOut: () => Promise<void>;
  isPremium: boolean;
  updateProfileState: (data: any) => void;
  refreshProfile: () => Promise<void>;
  updateLessonProgress: (lessonId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

function SetupWarning() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-neutral-50">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold font-serif mb-2 text-neutral-900 italic">Russian Scholar</h1>
          <p className="text-neutral-500">Service initialization required</p>
        </div>
        <Alert variant="destructive" className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Supabase Not Configured</AlertTitle>
          <AlertDescription>
            Secrets are missing. Please go to <strong>Settings &gt; Secrets</strong> and add your VITE_SUPABASE_* variables.
          </AlertDescription>
        </Alert>
        <div className="bg-neutral-900 text-neutral-400 p-4 rounded-xl font-mono text-xs space-y-2 border border-neutral-800">
          <div className="flex items-center gap-2 text-neutral-200 mb-2">
            <Terminal className="w-3 h-3" />
            <span>Required Environment Variables</span>
          </div>
          <div>VITE_SUPABASE_URL</div>
          <div>VITE_SUPABASE_ANON_KEY</div>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="w-full py-3 bg-neutral-900 text-white rounded-xl font-bold hover:bg-black transition-colors"
        >
          Check Again
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const setEnhancedUser = (rawUser: any) => {
    if (rawUser) {
      setUser({
        ...rawUser,
        displayName: rawUser.displayName || rawUser.user_metadata?.full_name || rawUser.user_metadata?.name || rawUser.email?.split('@')[0] || 'Scholar'
      });
    } else {
      setUser(null);
    }
  };

  const fetchProfile = async (uid: string) => {
    if (!supabase) return;
    try {
      // 1. Check if a row already exists with that uid first
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('uid', uid)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      if (!data) {
        // Create profile if it does not exist in our custom public.users table
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        
        const newProfile = {
          uid: uid,
          email: currentUser?.email || '',
          displayName: currentUser?.user_metadata?.full_name || currentUser?.user_metadata?.name || '',
          isPremium: false,
          createdAt: new Date().toISOString(),
          billingHistory: [],
          streak_count: 0,
          last_activity_date: null,
          lessons_completed: {},
          xp_points: 0
        };

        const { data: insertedData, error: insertError } = await supabase
          .from('users')
          .insert([newProfile])
          .select()
          .single();

        if (insertError) {
          console.error('Error creating profile:', insertError);
          // If insert fails (for example trigger or race condition created it), select the existing profile
          const { data: secondRetry } = await supabase
            .from('users')
            .select('*')
            .eq('uid', uid)
            .maybeSingle();
          if (secondRetry) {
            setProfile({
              ...secondRetry,
              streak_count: secondRetry.streak_count ?? 0,
              last_activity_date: secondRetry.last_activity_date ?? null,
              lessons_completed: secondRetry.lessons_completed ?? {},
              xp_points: secondRetry.xp_points ?? 0
            });
          }
        } else {
          setProfile({
            ...insertedData,
            streak_count: insertedData.streak_count ?? 0,
            last_activity_date: insertedData.last_activity_date ?? null,
            lessons_completed: insertedData.lessons_completed ?? {},
            xp_points: insertedData.xp_points ?? 0
          });
        }
      } else {
        // 3. When restoring or updating an existing profile, never touch or reset trialStartDate field
        setProfile({
          ...data,
          streak_count: data.streak_count ?? 0,
          last_activity_date: data.last_activity_date ?? null,
          lessons_completed: data.lessons_completed ?? {},
          xp_points: data.xp_points ?? 0
        });
      }
    } catch (error) {
      console.error('Exception fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (user?.id) {
      await fetchProfile(user.id);
    }
  };

  const updateProfileState = (updatedProfile: any) => {
    setProfile(curr => curr ? { ...curr, ...updatedProfile } : updatedProfile);
  };

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    console.log("Auth check started");
    let resolved = false;

    const timeoutId = setTimeout(() => {
      if (!resolved) {
        console.log("Auth timeout triggered");
        resolved = true;
        setLoading(false);
        navigate('/');
      }
    }, 5000);

    const markResolved = () => {
      if (!resolved) {
        resolved = true;
        clearTimeout(timeoutId);
        console.log("Auth check completed");
      }
    };

    // Set up auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Handle sign out FIRST before anything else
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
        setLoading(false);
        navigate('/', { replace: true });
        markResolved();
        return; // Stop here, don't run rest of function
      }

      const activeUser = session?.user || null;
      setEnhancedUser(activeUser);
      if (activeUser) {
        if (event === 'SIGNED_IN') {
          navigate('/dashboard');
        }
        await fetchProfile(activeUser.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
      markResolved();
    });

    return () => {
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async () => {
    try {
      // Connects to Supabase Google Auth
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (error: any) {
      console.error('Google Sign in error:', error);
      toast.error('Google login error: ' + error.message);
    }
  };

  const signUp = async () => {
    return signIn();
  };

  const signInAsGuest = () => {
    const guestUser: any = {
      id: 'guest-' + Math.random().toString(36).substr(2, 9),
      email: 'guest@scholar.com',
      user_metadata: {
        full_name: 'Guest Scholar',
        name: 'Guest Scholar'
      },
      isGuest: true
    };
    setEnhancedUser(guestUser);
    setProfile({
      uid: guestUser.id,
      displayName: 'Guest Scholar',
      isPremium: true, // Let guests try everything
      isGuest: true,
      billingHistory: [],
      streak_count: 0,
      last_activity_date: null,
      lessons_completed: {},
      xp_points: 0
    });
    toast.success('Continuing as Guest. Progress will not be saved across sessions.');
  };

  const signOut = async () => {
    try {
      if (user?.isGuest) {
        setUser(null);
        setProfile(null);
        navigate('/');
        return;
      }
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error);
        toast.error('Sign out failed: ' + error.message);
      }
      
      // Clear any cached Supabase auth tokens
      // that might auto-login the user again
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('sb-') || 
            key.startsWith('supabase')) {
          localStorage.removeItem(key);
        }
      });

      // Manually clear state immediately
      // Do not wait for onAuthStateChange
      setUser(null);
      setProfile(null);
      
      // Force navigate to landing page
      navigate('/', { replace: true });
      
    } catch (err) {
      console.error('Sign out exception:', err);
      // Even if Supabase fails, clear local state 
      // and redirect anyway
      setUser(null);
      setProfile(null);
      navigate('/', { replace: true });
    }
  };

  const updateLessonProgress = (lessonId: string) => {
    if (!profile) return;

    const lessonsCompleted = { ...(profile.lessons_completed || {}) };
    const alreadyCompleted = !!lessonsCompleted[lessonId];
    
    // 1. Mark lesson as complete in lessons_completed
    lessonsCompleted[lessonId] = true;

    // 2. Add 10 XP if not already completed
    const oldXp = profile.xp_points || 0;
    const updatedXp = alreadyCompleted ? oldXp : oldXp + 10;

    // 3. Streak check based on last_activity_date
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

    const lastActive = profile.last_activity_date;
    const lastActiveDateOnly = lastActive ? lastActive.split('T')[0] : null;

    let newStreak = profile.streak_count || 0;
    if (!lastActiveDateOnly) {
      newStreak = 1;
    } else if (lastActiveDateOnly === todayStr) {
      // If today -> no change
    } else if (lastActiveDateOnly === yesterdayStr) {
      // If yesterday -> streak_count + 1
      newStreak = (profile.streak_count || 0) + 1;
    } else {
      // If older -> reset to 1
      newStreak = 1;
    }

    const nowIso = new Date().toISOString();

    // 4. Update local profile context instantly (don't wait for DB)
    const updatedProfile = {
      ...profile,
      lessons_completed: lessonsCompleted,
      xp_points: updatedXp,
      streak_count: newStreak,
      last_activity_date: nowIso
    };
    setProfile(updatedProfile);

    // 5. Saves to Supabase users table in background
    if (!profile.isGuest && user?.id) {
      try {
        supabase
          .from('users')
          .update({
            lessons_completed: lessonsCompleted,
            xp_points: updatedXp,
            streak_count: newStreak,
            last_activity_date: nowIso
          })
          .eq('uid', user.id)
          .then(({ error }) => {
            if (error) {
              console.error('Error updating progress in Supabase:', error);
            }
          });
      } catch (err) {
        console.error('Exception updating Supabase:', err);
      }
    }
  };

  const isPremium = profile?.isPremium || false;

  if (!supabase) {
    return <SetupWarning />;
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      loading, 
      signIn, 
      signUp, 
      signInAsGuest, 
      signOut, 
      isPremium,
      updateProfileState,
      refreshProfile,
      updateLessonProgress
    }}>
      <div className="min-h-screen bg-neutral-50 font-sans text-neutral-900 overflow-x-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div>
          </div>
        ) : (
          <Routes>
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
            <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" replace />} />
            <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
            <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} replace />} />
          </Routes>
        )}
        <Toaster />
      </div>
    </AuthContext.Provider>
  );
}
