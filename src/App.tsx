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
import { LoadingScreen } from './components/LoadingScreen';
import { ActiveTimeTracker } from './utils/activeTimeTracker';
import { 
  processStreakOnLoad, 
  earnStreakToday, 
  syncStreakWithDatabase, 
  getLocalDateString, 
  StreakData 
} from './utils/streakService';

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
  updateLessonProgress: (lessonId: string, forceValue?: boolean) => void;
  saveDailyGoal: (minutes: number) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

const safeParseJSON = (val: any): Record<string, boolean> => {
  if (!val) return {};
  if (typeof val === 'object') return val;
  try {
    return JSON.parse(val);
  } catch (e) {
    console.error('Error parsing JSON field:', e);
    return {};
  }
};

const safeParseWeekActivity = (val: any): Record<string, any> => {
  if (!val) return {};
  if (typeof val === 'object') return val;
  try {
    return JSON.parse(val);
  } catch (e) {
    console.error('Error parsing week activity:', e);
    return {};
  }
};

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
          longest_streak: 0,
          week_activity: {},
          lessons_completed: {},
          xp_points: 0,
          country: currentUser?.user_metadata?.country || '',
          phone_number: currentUser?.user_metadata?.phone_number || '',
          learning_reason: currentUser?.user_metadata?.learning_reason || '',
          bio: currentUser?.user_metadata?.bio || '',
          avatar_url: currentUser?.user_metadata?.avatar_url || '',
          is_premium: false,
          daily_goal_minutes: 10
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
            const { streakData, atRisk } = processStreakOnLoad(secondRetry);
            const streakBroke = (secondRetry.streak_count || 0) > 0 && streakData.currentStreak === 0;
            let finalXp = secondRetry.xp_points ?? 0;
            if (streakBroke) {
              finalXp = 0;
              try {
                supabase
                  .from('users')
                  .update({ xp_points: 0 })
                  .eq('uid', uid)
                  .then(({ error }) => {
                    if (error) console.error('Error resetting XP on broken streak fallback:', error);
                  });
              } catch (e) {
                console.error('Failed to reset fallback XP:', e);
              }
              toast.error("Oh no! Your learning streak has broken. Your active XP has reset to 0 block. Keep studying daily to maintain your streak! 🔥");
            }

            const goalBackupStr = localStorage.getItem(`daily_goal_backup_${uid}`);
            const goalBackup = goalBackupStr ? parseInt(goalBackupStr, 10) : 10;

            const parsedProfile = {
              ...secondRetry,
              streak_count: streakData.currentStreak,
              last_activity_date: streakData.lastActiveDate ? `${streakData.lastActiveDate}T00:00:00.000Z` : null,
              longest_streak: streakData.longestStreak,
              week_activity: safeParseWeekActivity(streakData.weekActivity),
              streakAtRisk: atRisk,
              lessons_completed: safeParseJSON(secondRetry.lessons_completed),
              xp_points: finalXp,
              daily_goal_minutes: secondRetry.daily_goal_minutes ?? goalBackup
            };
            setProfile(parsedProfile);
            localStorage.setItem(`profile_backup_${uid}`, JSON.stringify(parsedProfile));
          }
        } else {
          const parsedProfile = {
            ...insertedData,
            streak_count: 0,
            last_activity_date: null,
            longest_streak: 0,
            week_activity: {},
            lessons_completed: safeParseJSON(insertedData.lessons_completed),
            xp_points: insertedData.xp_points ?? 0,
            daily_goal_minutes: 10
          };
          setProfile(parsedProfile);
          localStorage.setItem(`profile_backup_${uid}`, JSON.stringify(parsedProfile));
        }
      } else {
        // 3. Process existing user profile streak calculation on load
        const { streakData, atRisk } = processStreakOnLoad(data);
        const streakBroke = (data.streak_count || 0) > 0 && streakData.currentStreak === 0;
        let finalXp = data.xp_points ?? 0;
        
        if (streakBroke) {
          finalXp = 0;
          try {
            supabase
              .from('users')
              .update({ xp_points: 0 })
              .eq('uid', uid)
              .then(({ error }) => {
                if (error) console.error('Error resetting XP in DB on broken streak:', error);
              });
          } catch (e) {
            console.error('Failed to reset XP in DB during fetch:', e);
          }
          toast.error("Oh no! Your daily learning streak has broken. Your active XP has been reset to 0! Study today to rebuild your streak! 🔥");
        }

        if (streakData.currentStreak !== data.streak_count || data.longest_streak === undefined || streakBroke) {
          syncStreakWithDatabase(uid, false, streakData);
        }

        const goalBackupStr = localStorage.getItem(`daily_goal_backup_${uid}`);
        const goalBackup = goalBackupStr ? parseInt(goalBackupStr, 10) : 10;

        const parsedProfile = {
          ...data,
          streak_count: streakData.currentStreak,
          last_activity_date: streakData.lastActiveDate ? `${streakData.lastActiveDate}T00:00:00.000Z` : null,
          longest_streak: streakData.longestStreak,
          week_activity: safeParseWeekActivity(streakData.weekActivity),
          streakAtRisk: atRisk,
          lessons_completed: safeParseJSON(data.lessons_completed),
          xp_points: finalXp,
          daily_goal_minutes: data.daily_goal_minutes ?? goalBackup
        };
        setProfile(parsedProfile);
        localStorage.setItem(`profile_backup_${uid}`, JSON.stringify(parsedProfile));
      }
    } catch (error) {
      console.error('Exception fetching profile, loading local backup:', error);
      const backupStr = localStorage.getItem(`profile_backup_${uid}`);
      if (backupStr) {
        try {
          const cachedProfile = JSON.parse(backupStr);
          const { streakData, atRisk } = processStreakOnLoad(cachedProfile);
          const streakBroke = (cachedProfile.streak_count || 0) > 0 && streakData.currentStreak === 0;
          
          const updatedCachedProfile = {
            ...cachedProfile,
            streak_count: streakData.currentStreak,
            last_activity_date: streakData.lastActiveDate ? `${streakData.lastActiveDate}T00:00:00.000Z` : null,
            longest_streak: streakData.longestStreak,
            week_activity: safeParseWeekActivity(streakData.weekActivity),
            streakAtRisk: atRisk,
            xp_points: streakBroke ? 0 : (cachedProfile.xp_points ?? 0)
          };

          if (streakBroke) {
            toast.error("Oh no! Your daily learning streak has broken. Your active XP has been reset to 0! Study today to rebuild your streak! 🔥");
            try {
              supabase
                .from('users')
                .update({ xp_points: 0 })
                .eq('uid', uid)
                .then(({ error }) => {
                  if (error) console.error('Error resetting XP in DB on backup load:', error);
                });
            } catch (err) {
              console.error(err);
            }
          }

          setProfile(updatedCachedProfile);
          localStorage.setItem(`profile_backup_${uid}`, JSON.stringify(updatedCachedProfile));
        } catch (e) {
          console.error('Failed to parse backup profile:', e);
        }
      }
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
    setProfile(curr => {
      const merged = curr ? { ...curr, ...updatedProfile } : updatedProfile;
      if (merged) {
        if (merged.isGuest) {
          localStorage.setItem('guest_profile', JSON.stringify(merged));
        } else {
          localStorage.setItem(`profile_backup_${merged.uid}`, JSON.stringify(merged));
        }
      }
      return merged;
    });
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
        setUser(null);      // ADD THIS
        setProfile(null);   // ADD THIS  
        setLoading(false);
        navigate('/', { replace: true });
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
        localStorage.removeItem('guest_user');
        localStorage.removeItem('guest_profile');
        setLoading(false);
        navigate('/', { replace: true });
        markResolved();
        return; // Stop here, don't run rest of function
      }

      const activeUser = session?.user || null;
      if (activeUser) {
        setEnhancedUser(activeUser);
        if (event === 'SIGNED_IN') {
          navigate('/dashboard');
        }
        await fetchProfile(activeUser.id);
      } else {
        // No active Supabase user - check if we have a persistent guest session in localStorage
        const savedUserStr = localStorage.getItem('guest_user');
        const savedProfileStr = localStorage.getItem('guest_profile');
        if (savedUserStr && savedProfileStr) {
          try {
            const guestUserObj = JSON.parse(savedUserStr);
            const guestProfileObj = JSON.parse(savedProfileStr);
            
            // Validate guest's streak
            const { streakData, atRisk } = processStreakOnLoad(guestProfileObj);
            const streakBroke = (guestProfileObj.streak_count || 0) > 0 && streakData.currentStreak === 0;
            
            const updatedGuestProfile = {
              ...guestProfileObj,
              streak_count: streakData.currentStreak,
              last_activity_date: streakData.lastActiveDate ? `${streakData.lastActiveDate}T00:00:00.000Z` : null,
              longest_streak: streakData.longestStreak,
              week_activity: safeParseWeekActivity(streakData.weekActivity),
              streakAtRisk: atRisk,
              xp_points: streakBroke ? 0 : (guestProfileObj.xp_points ?? 0)
            };

            if (streakBroke) {
              toast.error("Oh no! Your daily learning streak has broken. Your active XP has been reset to 0! 🔥");
            }
            
            localStorage.setItem('guest_profile', JSON.stringify(updatedGuestProfile));
            setEnhancedUser(guestUserObj);
            setProfile(updatedGuestProfile);
            
            // If they are on the landing page/login root page, auto redirect to dashboard
            const path = window.location.pathname;
            if (path === '/' || path === '' || path === '/login') {
              navigate('/dashboard');
            }
          } catch (e) {
            console.error('Error reloading persistent guest profile:', e);
            setUser(null);
            setProfile(null);
          }
        } else {
          setUser(null);
          setProfile(null);
        }
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
    const savedUserStr = localStorage.getItem('guest_user');
    const savedProfileStr = localStorage.getItem('guest_profile');
    
    let guestUser: any = null;
    let guestProfile: any = null;
    
    if (savedUserStr && savedProfileStr) {
      try {
        guestUser = JSON.parse(savedUserStr);
        guestProfile = JSON.parse(savedProfileStr);
      } catch (e) {
        console.error('Failed to parse guest storage:', e);
      }
    }
    
    if (!guestUser || !guestProfile) {
      guestUser = {
        id: 'guest-' + Math.random().toString(36).substr(2, 9),
        email: 'guest@scholar.com',
        user_metadata: {
          full_name: 'Guest Scholar',
          name: 'Guest Scholar'
        },
        isGuest: true
      };
      
      guestProfile = {
        uid: guestUser.id,
        displayName: 'Guest Scholar',
        isPremium: true, // Let guests try everything
        isGuest: true,
        billingHistory: [],
        streak_count: 0,
        last_activity_date: null,
        longest_streak: 0,
        week_activity: {},
        lessons_completed: {},
        xp_points: 0,
        daily_goal_minutes: 10
      };
      
      localStorage.setItem('guest_user', JSON.stringify(guestUser));
      localStorage.setItem('guest_profile', JSON.stringify(guestProfile));
    } else {
      // Validate guest's streak if they are logging/signing back in
      const { streakData, atRisk } = processStreakOnLoad(guestProfile);
      const streakBroke = (guestProfile.streak_count || 0) > 0 && streakData.currentStreak === 0;
      
      guestProfile = {
        ...guestProfile,
        streak_count: streakData.currentStreak,
        last_activity_date: streakData.lastActiveDate ? `${streakData.lastActiveDate}T00:00:00.000Z` : null,
        longest_streak: streakData.longestStreak,
        week_activity: safeParseWeekActivity(guestProfile.week_activity),
        streakAtRisk: atRisk,
        xp_points: streakBroke ? 0 : (guestProfile.xp_points ?? 0)
      };

      if (streakBroke) {
        toast.error("Oh no! Your daily learning streak has broken. Your active XP has been reset to 0! 🔥");
      }
      
      localStorage.setItem('guest_profile', JSON.stringify(guestProfile));
    }
    
    setEnhancedUser(guestUser);
    setProfile(guestProfile);
    toast.success('Successfully logged in as Guest Scholar! Your progress is saved! 🎉');
    navigate('/dashboard');
  };

  const signOut = async () => {
    try {
      // Handle guest users immediately
      if (user?.isGuest) {
        setUser(null);
        setProfile(null);
        localStorage.removeItem('guest_user');
        localStorage.removeItem('guest_profile');
        navigate('/', { replace: true });
        return;
      }

      // 1. Clear local state FIRST so UI updates instantly
      setUser(null);
      setProfile(null);

      // 2. Tell Supabase to sign out
      // Do NOT clear localStorage before this
      // Supabase needs its tokens to process signOut
      await supabase.auth.signOut();

      // 3. NOW clear localStorage AFTER Supabase is done
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('sb-') || 
            key.startsWith('supabase')) {
          localStorage.removeItem(key);
        }
      });

      // 4. Navigate to landing page
      navigate('/', { replace: true });

    } catch (err) {
      console.error('Sign out exception:', err);
      // Force logout even if everything fails
      setUser(null);
      setProfile(null);
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('sb-') || 
            key.startsWith('supabase')) {
          localStorage.removeItem(key);
        }
      });
      navigate('/', { replace: true });
    }
  };

  const updateLessonProgress = (lessonId: string, forceValue?: boolean) => {
    if (!profile) return;

    const lessonsCompleted = safeParseJSON(profile.lessons_completed);
    const alreadyCompleted = !!lessonsCompleted[lessonId];
    
    const targetState = forceValue !== undefined ? forceValue : !alreadyCompleted;
    
    if (targetState === alreadyCompleted) {
      return;
    }

    if (targetState) {
      lessonsCompleted[lessonId] = true;
      toast.success("Module completed! +10 XP earned 🔥");
    } else {
      delete lessonsCompleted[lessonId];
      toast.info("Module marked as incomplete");
    }

    // 2. Add or subtract 10 XP
    const oldXp = profile.xp_points || 0;
    const updatedXp = targetState ? oldXp + 10 : Math.max(0, oldXp - 10);

    // 3. Keep existing streak parameters intact! ActiveTimeTracker handles streak extension when 10 active mins are earned.
    const lastActive = profile.last_activity_date;
    const streakCount = profile.streak_count ?? 0;
    const longestStreak = profile.longest_streak ?? 0;
    const weekActivity = safeParseWeekActivity(profile.week_activity);

    const updatedProfile = {
      ...profile,
      lessons_completed: lessonsCompleted,
      xp_points: updatedXp,
      streak_count: streakCount,
      last_activity_date: lastActive,
      longest_streak: longestStreak,
      week_activity: weekActivity
    };
    setProfile(updatedProfile);

    // Save to appropriate localStorage cache
    if (profile.isGuest) {
      localStorage.setItem('guest_profile', JSON.stringify(updatedProfile));
    } else {
      localStorage.setItem(`profile_backup_${profile.uid}`, JSON.stringify(updatedProfile));
    }

    // Saves progress to Supabase in background
    if (!profile.isGuest && user?.id) {
      try {
        supabase
          .from('users')
          .update({
            lessons_completed: lessonsCompleted,
            xp_points: updatedXp
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

  const saveDailyGoal = async (minutes: number): Promise<boolean> => {
    if (!profile) return false;

    // 1. Update local state
    setProfile((curr: any) => {
      if (!curr) return null;
      const updated = {
        ...curr,
        daily_goal_minutes: minutes
      };
      if (curr.isGuest) {
        localStorage.setItem('guest_profile', JSON.stringify(updated));
      } else {
        localStorage.setItem(`profile_backup_${curr.uid}`, JSON.stringify(updated));
      }
      return updated;
    });

    // 2. Save in local backup key
    localStorage.setItem(`daily_goal_backup_${profile.uid}`, minutes.toString());

    // 3. Save to database if not guest
    if (!profile.isGuest && user?.id) {
      try {
        const { error } = await supabase
          .from('users')
          .update({
            daily_goal_minutes: minutes
          })
          .eq('uid', user.id);

        if (error) {
          // If the column does not exist on Supabase yet, ignore the error and use backup
          if (error.message && error.message.includes('daily_goal_minutes')) {
            console.warn('daily_goal_minutes column does not exist yet database level, saved to localStorage and state.');
            return true;
          }
          throw error;
        }
        return true;
      } catch (err: any) {
        console.error('Failed to sync daily goal to database:', err);
        return false;
      }
    }
    return true;
  };

  // Track active time and earn streak
  useEffect(() => {
    if (!profile?.uid) return;

    const todayStr = getLocalDateString();
    const isTodayEarned = profile.last_activity_date 
      ? (profile.last_activity_date.split('T')[0] === todayStr) 
      : false;

    const currentGoal = profile.daily_goal_minutes ?? 10;

    const tracker = new ActiveTimeTracker(
      profile.uid,
      async () => {
        const currentData: StreakData = {
          currentStreak: profile.streak_count ?? 0,
          lastActiveDate: profile.last_activity_date ? profile.last_activity_date.split('T')[0] : null,
          longestStreak: profile.longest_streak ?? 0,
          weekActivity: profile.week_activity ?? {}
        };

        const updated = earnStreakToday(currentData, todayStr);

        setProfile((curr: any) => {
          if (!curr) return null;
          const updatedVal = {
            ...curr,
            streak_count: updated.currentStreak,
            last_activity_date: `${updated.lastActiveDate}T00:00:00.000Z`,
            longest_streak: updated.longestStreak,
            week_activity: updated.weekActivity,
            streakAtRisk: false // completed today, so not at risk
          };
          if (curr.isGuest) {
            localStorage.setItem('guest_profile', JSON.stringify(updatedVal));
          } else {
            localStorage.setItem(`profile_backup_${curr.uid}`, JSON.stringify(updatedVal));
          }
          return updatedVal;
        });

        const success = await syncStreakWithDatabase(profile.uid, !!profile.isGuest, updated);
        if (success) {
          toast.success(`Streak extended! ${currentGoal} active minutes completed today! 🔥 ${updated.currentStreak}-Day Streak`);
        } else {
          toast.warning('Offline backup saved, but failed to sync online.');
        }
      },
      isTodayEarned,
      currentGoal
    );

    return () => {
      tracker.destroy();
    };
  }, [profile?.uid, profile?.last_activity_date ? profile.last_activity_date.split('T')[0] : null, profile?.daily_goal_minutes]);

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
      updateLessonProgress,
      saveDailyGoal
    }}>
      <div className="min-h-screen bg-neutral-50 font-sans text-neutral-900 overflow-x-hidden">
        {loading ? (
          <LoadingScreen />
        ) : (
          <Routes>
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
            <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" replace />} />
            <Route path="/community" element={user ? <Dashboard initialTab="community" /> : <Navigate to="/" replace />} />
            <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
            <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} replace />} />
          </Routes>
        )}
        <Toaster />
      </div>
    </AuthContext.Provider>
  );
}
