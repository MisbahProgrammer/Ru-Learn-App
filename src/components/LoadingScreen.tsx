import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { GraduationCap } from 'lucide-react';

export function LoadingScreen() {
  const [statusText, setStatusText] = useState('Initializing Academy Platform...');

  useEffect(() => {
    const statuses = [
      'Initializing Academy Platform...',
      'Connecting Securely...',
      'Retrieving Academic Profile...',
      'Restoring Learning Streak...',
      'Preparing Custom Curriculum...',
      'Optimizing Lessons...'
    ];

    let currentIdx = 0;
    const interval = setInterval(() => {
      currentIdx = (currentIdx + 1) % statuses.length;
      setStatusText(statuses[currentIdx]);
    }, 900);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Warm Glowing Backdrops */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-orange-100/40 blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-red-100/30 blur-3xl" />

      <div className="relative flex flex-col items-center max-w-sm w-full space-y-8 z-10">
        {/* Animated Custom Logo Container */}
        <div className="relative w-28 h-28 flex items-center justify-center">
          {/* Pulsing/spinning outer warm rings */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-dashed border-orange-500/30"
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute -inset-2 rounded-full border border-orange-500/10"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
          
          {/* Inner solid circular background */}
          <motion.div 
            className="w-20 h-20 bg-gradient-to-tr from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-xl shadow-orange-500/20 z-10"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            {/* Animated Graduation Cap Icon */}
            <motion.div
              animate={{ 
                y: [0, -4, 0],
                rotate: [0, -3, 3, 0]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: 'easeInOut' 
              }}
            >
              <GraduationCap className="w-10 h-10 text-white stroke-[1.5]" />
            </motion.div>
          </motion.div>

          {/* Micro dots orbital spinner */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="w-24 h-24 rounded-full border-t-2 border-r-2 border-orange-500"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        </div>

        {/* Text branding with letter animations */}
        <div className="text-center space-y-2">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-xl font-bold uppercase tracking-[0.25em] text-neutral-900 font-sans flex items-center justify-center gap-1.5"
          >
            Russian <span className="text-orange-500">Scholar</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="text-[11px] font-mono font-bold uppercase tracking-[0.15em] text-neutral-400"
          >
            Academy & Research Platform
          </motion.p>
        </div>

        {/* Dynamic status loader bar & label */}
        <div className="w-full max-w-[240px] space-y-3 pt-4">
          <div className="w-full h-1 bg-neutral-200/80 rounded-full overflow-hidden relative">
            <motion.div 
              className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
              initial={{ left: '-100%', right: '100%' }}
              animate={{ left: ['-100%', '0%', '100%'], right: ['100%', '0%', '-100%'] }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: 'easeInOut' 
              }}
            />
          </div>
          <motion.div 
            key={statusText}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-center text-[11px] font-medium text-neutral-550 italic"
          >
            {statusText}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
