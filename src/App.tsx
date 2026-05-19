import React, { useState, useEffect, createContext, useContext } from 'react';
import { auth, db } from './lib/firebase';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signInWithRedirect, 
  getRedirectResult,
  GoogleAuthProvider, 
  User as FirebaseUser 
} from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { Toaster } from '@/components/ui/sonner-toaster';
import { LandingPage } from '@/components/LandingPage';
import { Dashboard } from '@/components/Dashboard';
import { addDays, isAfter } from 'date-fns';
import { toast } from 'sonner';

interface AuthContextType {
  user: FirebaseUser | null;
  profile: any | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signUp: () => Promise<void>;
  signInAsGuest: () => void;
  signOut: () => Promise<void>;
  isTrialValid: boolean;
  isPremium: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Handle redirect result
    getRedirectResult(auth).catch((error) => {
      console.error('Redirect result error:', error);
    });

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        setUser(user);
        if (user) {
          const userPath = `users/${user.uid}`;
          try {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (!userDoc.exists()) {
              const newProfile = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || '',
                trialStartDate: new Date().toISOString(),
                isPremium: false,
                createdAt: new Date().toISOString(),
              };
              await setDoc(doc(db, 'users', user.uid), newProfile);
              setProfile(newProfile);
            } else {
              setProfile(userDoc.data());
            }

            // Sync profile
            onSnapshot(doc(db, 'users', user.uid), (doc) => {
              if (doc.exists()) setProfile(doc.data());
            }, (error) => {
              console.error('Profile snapshot error:', error);
            });
          } catch (error) {
            console.error('Error fetching profile:', error);
          }
        } else {
          setProfile(null);
        }
      } finally {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error('Sign in popup error:', error);
      
      if (error.code === 'auth/unauthorized-domain') {
        toast.error(
          'This domain is not authorized in Firebase. Please use the AI Studio Development/Shared URL, or use "Continue as Guest".',
          { duration: 8000 }
        );
        return;
      }
      
      // Fallback to redirect if popup is blocked
      if (error.code === 'auth/popup-blocked' || error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
        try {
          await signInWithRedirect(auth, provider);
        } catch (redirectError: any) {
          toast.error('Authentication failed. Please check your browser settings.');
        }
      } else {
        toast.error('Sign in failed: ' + error.message);
      }
    }
  };

  const signInAsGuest = () => {
    // Mock user for guest mode
    const guestUser: any = {
      uid: 'guest-' + Math.random().toString(36).substr(2, 9),
      displayName: 'Guest Scholar',
      email: 'guest@scholar.com',
      isGuest: true
    };
    setUser(guestUser);
    setProfile({
      uid: guestUser.uid,
      displayName: 'Guest Scholar',
      isPremium: true, // Let guests try everything
      trialStartDate: new Date().toISOString(),
      isGuest: true
    });
    toast.success('Continuing as Guest. Progress will not be saved across sessions.');
  };

  const signUp = async () => {
    // For Google Auth, Sign Up and Sign In are essentially the same flow,
    // but we provide a separate function to reflect UI intent.
    return signIn();
  };

  const signOut = () => auth.signOut();

  const isPremium = profile?.isPremium || false;
  const trialValid = profile 
    ? isAfter(addDays(new Date(profile.trialStartDate), 7), new Date()) 
    : true; // Default to true if profile is still loading to avoid flash

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signUp, signInAsGuest, signOut, isTrialValid: trialValid, isPremium }}>
      <div className="min-h-screen bg-neutral-50 font-sans text-neutral-900 overflow-x-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div>
          </div>
        ) : !user ? (
          <LandingPage />
        ) : (
          <Dashboard />
        )}
        <Toaster />
      </div>
    </AuthContext.Provider>
  );
}
