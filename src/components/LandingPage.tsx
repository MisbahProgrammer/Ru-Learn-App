import React, { useState, useEffect } from 'react';
import { useAuth } from '@/App';
import { Button } from '@/components/ui/button';
import { CITY_IMAGES } from '@/constants';
import { motion } from 'motion/react';
import { GraduationCap, Plane, Languages, MessageSquare, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { AuthDialog } from '@/components/AuthDialog';
import { useLocation } from 'react-router-dom';

export function LandingPage() {
  const { signIn, signInAsGuest } = useAuth();
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | null>(isLoginPage ? 'signin' : null);

  useEffect(() => {
    if (location.pathname === '/login') {
      setAuthMode('signin');
    }
  }, [location.pathname]);

  useEffect(() => {
    if (location.state && (location.state as any).error) {
      toast.error((location.state as any).error);
      // clear status state to prevent duplicate triggers
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

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
    <div className="flex flex-col min-h-screen relative">
      {/* Announcement Banner */}
      <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white text-xs sm:text-sm font-semibold py-2.5 px-4 text-center z-30 relative shadow-sm">
        ⏳ September 2026 intake is coming — Start your free week before it's too late
      </div>

      <header className="absolute top-[48px] sm:top-[38px] left-0 right-0 z-20 px-4 sm:px-8 py-4 sm:py-6 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent">
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
      <section className="relative min-h-[100vh] flex items-center overflow-hidden bg-black text-white px-4 sm:px-8 md:px-16 pt-28 pb-16 md:pb-24">
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
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-y-4 gap-x-8 md:gap-12 px-4 opacity-70">
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
      <section className="pt-20 pb-32 md:pt-32 md:pb-44 px-4 sm:px-8">
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
              description={
                <ul className="space-y-1.5 text-left text-neutral-500 text-sm font-light mt-2 inline-block">
                  <li className="flex items-start gap-1.5">
                    <span className="text-orange-500 font-bold">•</span>
                    <span>Booking Yandex Taxi from Sheremetyevo Airport</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-orange-500 font-bold">•</span>
                    <span>Checking into your university dormitory</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-orange-500 font-bold">•</span>
                    <span>Shopping at Pyaterochka supermarket</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-orange-500 font-bold">•</span>
                    <span>Asking for metro directions in Russian</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-orange-500 font-bold">•</span>
                    <span>Visiting a Russian pharmacy</span>
                  </li>
                </ul>
              }
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

      {/* Testimonials Section */}
      <section className="py-20 bg-neutral-50 px-4 sm:px-8 border-t border-b border-neutral-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-light tracking-tight mb-4">
              Loved by <span className="font-serif italic underline underline-offset-8 decoration-orange-400">Scholars</span> Globally
            </h2>
            <p className="text-neutral-500 max-w-xl mx-auto text-sm md:text-base font-light">
              See how scholarship winners prepared for their journey to Russia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pakistan Testimonial */}
            <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm flex flex-col justify-between hover:border-neutral-200 transition-colors">
              <p className="text-neutral-600 font-light italic leading-relaxed mb-6">
                "The Yandex Taxi and supermarket scenarios saved my life during my first week in Moscow. I knew exactly what to say to the driver and at checking out."
              </p>
              <div>
                <div className="font-bold text-neutral-900 flex items-center gap-2">
                  <span>Misbah Rehman</span>
                  <span>🇵🇰</span>
                </div>
                <p className="text-xs text-orange-500 uppercase tracking-widest font-semibold mt-1">
                  Open Doors Scholar
                </p>
              </div>
            </div>

            {/* Egypt Testimonial */}
            <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm flex flex-col justify-between hover:border-neutral-200 transition-colors">
              <p className="text-neutral-600 font-light italic leading-relaxed mb-6">
                "Checking into our HSE dormitory was so smooth because I practiced the check-in dialogue twenty times. The vocabulary learning tools work perfectly!"
              </p>
              <div>
                <div className="font-bold text-neutral-900 flex items-center gap-2">
                  <span>Mostafa El-Sayed</span>
                  <span>🇪🇬</span>
                </div>
                <p className="text-xs text-orange-500 uppercase tracking-widest font-semibold mt-1">
                  Russian Gov Scholar
                </p>
              </div>
            </div>

            {/* Nigeria Testimonial */}
            <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm flex flex-col justify-between hover:border-neutral-200 transition-colors">
              <p className="text-neutral-600 font-light italic leading-relaxed mb-6">
                "Learning cultural etiquette alongside actual phrases helped me avoid any awkward situations. 24/7 AI Tutor is like having a teacher in my pocket."
              </p>
              <div>
                <div className="font-bold text-neutral-900 flex items-center gap-2">
                  <span>Chidi Azikiwe</span>
                  <span>🇳🇬</span>
                </div>
                <p className="text-xs text-orange-500 uppercase tracking-widest font-semibold mt-1">
                  Global Talent Winner
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Plan Section */}
      <section className="bg-neutral-900 text-white py-20 md:py-32 px-4 sm:px-8 rounded-3xl md:rounded-[60px] mx-4 my-16 md:m-8 overflow-hidden relative shadow-2xl">
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
            We know scholarship life. That's why we kept it simple. Get full access to all scenarios, interactive AI tutoring, and cultural guides for the price of a single coffee.
          </p>
          <div className="bg-white/5 backdrop-blur-xl p-8 md:p-16 rounded-[40px] border border-white/10 max-w-lg mx-auto shadow-2xl">
            <h3 className="text-xl md:text-2xl font-semibold mb-2">Premium Scholar Plan</h3>
            <p className="text-neutral-400 mb-10 text-sm md:text-base font-light tracking-wide">Full Unrestricted Access</p>
            <div className="flex items-end justify-center gap-1 mb-8">
              <span className="text-6xl md:text-8xl font-bold tracking-tighter">$1</span>
              <span className="text-neutral-500 text-xl md:text-2xl font-light mb-2">/month</span>
            </div>

            {/* Checklist */}
            <ul className="space-y-3 text-left mb-10 bg-white/5 p-6 rounded-2xl border border-white/5 max-w-md mx-auto">
              {[
                "20+ Real-world survival scenarios",
                "AI Russian tutor available 24/7",
                "RUDN teacher video lectures",
                "Cultural etiquette guide"
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-sm text-neutral-200 font-light">
                  <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <Button onClick={() => handleAuth('signup')} className="w-full h-14 md:h-16 bg-orange-500 hover:bg-orange-600 rounded-3xl text-lg md:text-xl font-bold transition-all hover:scale-[1.02] shadow-lg shadow-orange-500/20">
              Get Started for Free
            </Button>
            <p className="mt-6 text-[10px] md:text-xs text-neutral-500 tracking-wide">First 7 days are completely free. Cancel anytime.</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 md:py-32 px-4 sm:px-8 max-w-4xl mx-auto border-t border-neutral-100">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-light tracking-tight mb-4">
            Frequently Asked <span className="font-serif italic underline underline-offset-8 decoration-orange-400">Questions</span>
          </h2>
          <p className="text-neutral-500 text-sm md:text-base font-light">
            Everything you need to know before you fly to Russia.
          </p>
        </div>

        <div className="space-y-4 max-w-3xl mx-auto">
          <FAQItem 
            question="When should I start preparing with this course?" 
            answer="Ideally, 1-3 months before your flight. Starting now gets you familiar with Cyrillic reading, basic survival phrases, and campus vocabulary so you can land with confidence on day one." 
          />
          <FAQItem 
            question="I am going on a full English-medium scholarship. Do I really need Russian?" 
            answer="Absolutely. While your lectures might be in English, daily transactions—ordering Yandex taxis, buying groceries at Pyaterochka, checking into your dormitory, and dealing with university registration offices—will be entirely in Russian. Basic survival Russian is a must." 
          />
          <FAQItem 
            question="How does the AI Russian Tutor help me?" 
            answer="Our 24/7 AI tutor allows you to ask questions in English, get instant context-accurate Russian translations, and explain complex Cyrillic reading or cultural etiquette on the go." 
          />
          <FAQItem 
            question="Do I need to know Cyrillic (the Russian alphabet) before I start?" 
            answer="No prior knowledge is needed! Our course starts with an interactive, easy-to-learn alphabet and reading guide so you can learn Cyrillic in your very first week." 
          />
          <FAQItem 
            question="Is there any hidden fee or automatic charge?" 
            answer="No hidden fees. You start with a 7-day free trial. If you choose to keep your premium scholar plan, it's just $1/month. You can cancel anytime with a single click inside your dashboard profile." 
          />
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
        onSignInAsGuest={signInAsGuest}
      />
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: React.ReactNode }) {
  return (
    <div className="text-center p-8 rounded-3xl hover:bg-neutral-50 transition-colors border border-transparent hover:border-neutral-100 group">
      <div className="mb-6 flex justify-center group-hover:scale-110 transition-transform duration-300">{icon}</div>
      <h3 className="text-xl font-bold tracking-tight mb-4">{title}</h3>
      <div className="text-neutral-500 leading-relaxed font-light">{description}</div>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-neutral-200 py-5 transition-colors">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full flex justify-between items-center text-left py-2 font-medium text-neutral-950 focus:outline-none hover:text-orange-500 transition-colors"
      >
        <span className="text-base md:text-lg font-normal tracking-tight">{question}</span>
        <span className="text-orange-500 text-xl font-light transform transition-transform duration-200">
          {isOpen ? '−' : '+'}
        </span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
        <p className="text-neutral-500 text-sm md:text-base font-light leading-relaxed pb-2">
          {answer}
        </p>
      </div>
    </div>
  );
}
