import React, { useState } from 'react';
import { useAuth } from '@/App';
import { Button } from '@/components/ui/button';
import { CITY_IMAGES } from '@/constants';
import { motion } from 'motion/react';
import { GraduationCap, Plane, Languages, MessageSquare, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { AuthDialog } from '@/components/AuthDialog';

export function LandingPage() {
  const { signIn } = useAuth();
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | null>(null);

  const handleAuth = (action: 'signin' | 'signup') => {
    setAuthMode(action);
  };

  const handleGoogleSignIn = async () => {
    try {
      await signIn();
    } catch (error: any) {
      if (error.code !== 'auth/popup-closed-by-user') {
        toast.error('Authentication failed. Please try again.');
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="absolute top-0 left-0 right-0 z-20 px-4 sm:px-8 py-4 sm:py-6 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex items-center gap-1.5 sm:gap-2 text-white font-bold text-lg sm:text-xl uppercase tracking-widest">
          <GraduationCap className="text-orange-500 w-5 h-5 sm:w-6 sm:h-6" />
          <span className="truncate">Russian <span className="hidden min-[400px]:inline">Scholar</span></span>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <Button 
            onClick={() => handleAuth('signin')} 
            variant="ghost" 
            className="text-white hover:bg-white/10 rounded-full px-3 sm:px-6 text-sm sm:text-base font-medium"
          >
            Login
          </Button>
          <Button 
            onClick={() => handleAuth('signup')} 
            className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-4 sm:px-6 h-9 sm:h-10 text-sm sm:text-base font-bold shadow-lg shadow-orange-500/20"
          >
            Sign Up
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[100vh] flex items-center overflow-hidden bg-black text-white px-4 sm:px-8 md:px-16 pt-20">
        <div className="absolute inset-0 z-0">
          <img 
            src={CITY_IMAGES[0].url} 
            alt="Moscow" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-orange-500 w-2 h-2 rounded-full animate-pulse" />
                <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] font-semibold text-orange-400">
                  For Open Doors & Scholarship Winners
                </span>
              </div>
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tighter leading-[0.9] mb-6 drop-shadow-2xl">
                Master <span className="italic font-serif">Russian</span> <br className="hidden lg:block"/>
                Before You Land.
              </h1>
              <p className="text-base md:text-xl text-neutral-300 font-light max-w-lg mb-10 leading-relaxed">
                Tailored for scholar achievers heading to Russia this September. 1 week free, then just $1/month to master real-world scenarios.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                <Button 
                  onClick={() => handleAuth('signup')}
                  className="bg-orange-500 text-white hover:bg-orange-600 h-14 md:h-16 px-10 rounded-full text-lg md:text-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-xl shadow-orange-500/20 w-full sm:w-auto"
                >
                  Start Your Free Week
                </Button>
                <Button 
                  onClick={() => handleAuth('signin')}
                  variant="ghost"
                  className="border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white h-14 md:h-16 px-10 rounded-full text-lg md:text-xl font-bold backdrop-blur-sm w-full sm:w-auto transition-all"
                >
                  Learn More
                </Button>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-12 right-12 text-right hidden lg:block">
          <p className="text-[10px] uppercase tracking-[0.4em] text-neutral-400 mb-2">CURRENT LOCATION</p>
          <p className="text-3xl font-serif italic text-white tracking-tight">{CITY_IMAGES[0].name}</p>
        </div>
      </section>

      {/* Target Audience Bar */}
      <div className="bg-neutral-100 py-6 border-y border-neutral-200">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-12 px-4 opacity-70">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-widest">Open Doors Applicants</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-widest">Russian Government Scholars</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-widest">Global Talent Winners</span>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <section className="py-20 md:py-32 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 md:mb-24">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight mb-6">
              Why scholars choose <span className="font-serif italic underline underline-offset-8 decoration-orange-400">Master Russian</span>
            </h2>
            <p className="text-neutral-500 max-w-xl mx-auto text-sm md:text-lg font-light">
              Built specifically for high-achievers who need practical fluency, not just grammar drills.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            <FeatureCard 
              icon={<MessageSquare className="w-10 h-10 md:w-12 md:h-12 text-orange-500" />}
              title="Real-World Scenarios"
              description="Taxi apps, hotel check-ins, campus navigation—practice exactly what you'll do on day one in Moscow."
            />
            <FeatureCard 
              icon={<Languages className="w-10 h-10 md:w-12 md:h-12 text-orange-500" />}
              title="AI Russian Tutor"
              description="Ask anything in English. Get instant Russian translations, cultural tips, and voice pronunciation guide."
            />
            <FeatureCard 
              icon={<Plane className="w-10 h-10 md:w-12 md:h-12 text-orange-500" />}
              title="Travel Ready"
              description="Focus on high-frequency vocabulary and common phrases that actually matter for students and scholars."
            />
          </div>
        </div>
      </section>

      {/* Premium Plan Section */}
      <section className="bg-neutral-900 text-white py-20 md:py-32 px-4 sm:px-8 rounded-t-[40px] md:rounded-[60px] md:m-8 overflow-hidden relative shadow-2xl">
        <img 
          src={CITY_IMAGES[1].url} 
          className="absolute inset-0 w-full h-full object-cover opacity-15 pointer-events-none"
          alt="Saint Petersburg"
        />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-400 px-4 md:px-6 py-2 rounded-full mb-8 md:mb-12 border border-orange-500/30">
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em]">Limited Time Launch Offer</span>
          </div>
          <h2 className="text-4xl sm:text-6xl md:text-8xl font-bold tracking-tighter mb-8 leading-none">
            Master Russian for <br className="hidden md:block"/>
            <span className="text-orange-400 font-serif italic">$1 / month</span>
          </h2>
          <p className="text-base md:text-xl text-neutral-400 mb-12 max-w-3xl mx-auto leading-relaxed px-4 font-light">
            We know scholarship life. That's why we kept it simple. Get full access to all scenarios, AI voice practice, and cultural guides for the price of a single coffee.
          </p>
          <div className="bg-white/5 backdrop-blur-xl p-8 md:p-16 rounded-[40px] border border-white/10 max-w-lg mx-auto shadow-2xl">
            <h3 className="text-xl md:text-2xl font-semibold mb-2">Premium Scholar Plan</h3>
            <p className="text-neutral-400 mb-10 text-sm md:text-base font-light tracking-wide">Full Unrestricted Access</p>
            <div className="flex items-end justify-center gap-1 mb-12">
              <span className="text-6xl md:text-8xl font-bold tracking-tighter">$1</span>
              <span className="text-neutral-500 text-xl md:text-2xl font-light mb-2">/month</span>
            </div>
            <Button onClick={() => handleAuth('signup')} className="w-full h-14 md:h-16 bg-orange-500 hover:bg-orange-600 rounded-3xl text-lg md:text-xl font-bold transition-all hover:scale-[1.02] shadow-lg shadow-orange-500/20">
              Get Started for Free
            </Button>
            <p className="mt-6 text-[10px] md:text-xs text-neutral-500 tracking-wide">First 7 days are completely free. Cancel anytime.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-8 border-t border-neutral-200 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-neutral-500">
          <div className="flex items-center gap-2 text-black font-bold text-xl uppercase tracking-widest">
            <GraduationCap className="text-orange-500" />
            <span>Russian Scholar</span>
          </div>
          <div className="text-sm font-light">
            Built for Open Doors winners, by scholarship achievers. © 2026
          </div>
        </div>
      </footer>

      <AuthDialog 
        isOpen={authMode !== null} 
        onClose={() => setAuthMode(null)} 
        mode={authMode || 'signin'}
        onGoogleSignIn={handleGoogleSignIn}
      />
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="text-center p-8 rounded-3xl hover:bg-neutral-50 transition-colors border border-transparent hover:border-neutral-100 group">
      <div className="mb-6 flex justify-center group-hover:scale-110 transition-transform duration-300">{icon}</div>
      <h3 className="text-xl font-bold tracking-tight mb-4">{title}</h3>
      <p className="text-neutral-500 leading-relaxed font-light">{description}</p>
    </div>
  );
}
