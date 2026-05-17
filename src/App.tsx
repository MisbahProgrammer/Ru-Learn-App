import React, { useState, useEffect, createContext, useContext } from 'react';
import { auth, db } from './lib/firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { Toaster } from './components/ui/sonner-toaster';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { addDays, isAfter } from 'date-fns';

interface AuthContextType {
  user: FirebaseUser | null;
  profile: any | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  isTrialValid: boolean;
  isPremium: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists()) {
          const newProfile = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            trialStartDate: new Date().toISOString(),
            isPremium: false,
          };
          await setDoc(doc(db, 'users', user.uid), newProfile);
          setProfile(newProfile);
        } else {
          setProfile(userDoc.data());
          // Sync profile
          onSnapshot(doc(db, 'users', user.uid), (doc) => {
            setProfile(doc.data());
          });
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const signOut = () => auth.signOut();

  const isPremium = profile?.isPremium || false;
  const trialValid = profile ? isAfter(addDays(new Date(profile.trialStartDate), 7), new Date()) : false;

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signOut, isTrialValid: trialValid, isPremium }}>
      <div className="min-h-screen bg-neutral-50 font-sans text-neutral-900 border-x border-neutral-200 max-w-7xl mx-auto shadow-sm">
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
