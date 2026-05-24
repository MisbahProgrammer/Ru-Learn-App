import React, { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from './lib/supabase';
import { Toaster } from '@/components/ui/sonner-toaster';
import { LandingPage } from '@/components/LandingPage';
import { Dashboard } from '@/components/Dashboard';
import { addDays, isAfter } from 'date-fns';
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
  isTrialValid: boolean;
  isPremium: boolean;
  updateProfileState: (data: any) => void;
  refreshProfile: () => Promise<void>;
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

  if (!supabase) {
    return <SetupWarning />;
  }

  const fetchProfile = async (uid: string) => {
    try {
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
          trialStartDate: new Date().toISOString(),
          isPremium: false,
          createdAt: new Date().toISOString(),
          billingHistory: []
        };

        const { data: insertedData, error: insertError } = await supabase
          .from('users')
          .insert([newProfile])
          .select()
          .single();

        if (insertError) {
          console.error('Error creating profile:', insertError);
          // If insert fails (for example trigger created it), try selecting again
          const { data: secondRetry } = await supabase
            .from('users')
            .select('*')
            .eq('uid', uid)
            .maybeSingle();
          if (secondRetry) {
            setProfile(secondRetry);
          }
        } else {
          setProfile(insertedData);
        }
      } else {
        setProfile(data);
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
      const activeUser = session?.user || null;
      setEnhancedUser(activeUser);
      if (activeUser) {
        await fetchProfile(activeUser.id);
        if (event === 'SIGNED_IN') {
          navigate('/dashboard');
        }
      } else {
        setProfile(null);
        if (event === 'SIGNED_OUT') {
          navigate('/');
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
      trialStartDate: new Date().toISOString(),
      isGuest: true,
      billingHistory: []
    });
    toast.success('Continuing as Guest. Progress will not be saved across sessions.');
  };

  const signOut = async () => {
    if (user?.isGuest) {
      setEnhancedUser(null);
      setProfile(null);
      return;
    }
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Sign out failed: ' + error.message);
    }
  };

  const isPremium = profile?.isPremium || false;
  const trialValid = profile 
    ? isAfter(addDays(new Date(profile.trialStartDate), 7), new Date()) 
    : true;

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      loading, 
      signIn, 
      signUp, 
      signInAsGuest, 
      signOut, 
      isTrialValid: trialValid, 
      isPremium,
      updateProfileState,
      refreshProfile
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
            <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" replace />} />
            <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
            <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} replace />} />
          </Routes>
        )}
        <Toaster />
      </div>
    </AuthContext.Provider>
  );
}
