import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X } from 'lucide-react';

interface ToastNotificationProps {
  uid: string;
  isTodayEarned: boolean;
  onClose?: () => void;
}

export const StreakNoticeToast: React.FC<ToastNotificationProps> = ({
  uid,
  isTodayEarned,
  onClose
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isTodayEarned) {
      setVisible(false);
      return;
    }

    try {
      const getLocalDateString = () => {
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const todayStr = getLocalDateString();
      const storageKey = `streak_toast_shown_${uid}_${todayStr}`;
      const alreadyShown = localStorage.getItem(storageKey);

      if (!alreadyShown) {
        // Show after a tiny delay so the portal loading feels natural
        const timer = setTimeout(() => {
          setVisible(true);
          // Mutate storage immediately to avoid repeated show events
          localStorage.setItem(storageKey, 'true');
        }, 1500);

        // Auto-dismiss after 6 seconds
        const autoDismiss = setTimeout(() => {
          setVisible(false);
          if (onClose) onClose();
        }, 7500); // 1.5s delay + 6s duration

        return () => {
          clearTimeout(timer);
          clearTimeout(autoDismiss);
        };
      }
    } catch (err) {
      console.error('Error handling streak toast storage logic:', err);
    }
  }, [uid, isTodayEarned]);

  const handleDismiss = () => {
    setVisible(false);
    if (onClose) onClose();
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          id="streak-toast-con"
          initial={{ opacity: 0, y: -50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] w-[92%] sm:w-auto max-w-md bg-white border border-orange-200/80 shadow-lg rounded-xl p-4 flex items-start gap-3 transform -translate-x-1/2"
        >
          {/* Flame Icon */}
          <div className="w-9 h-9 shrink-0 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>

          {/* Toast Message Body */}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-neutral-800 flex items-center gap-1.5 leading-none mb-1">
              Streak Challenge! 🔥
            </h4>
            <p className="text-xs text-neutral-500 leading-relaxed font-sans">
              Explore any module for 10 minutes today to keep your streak alive!
            </p>
          </div>

          {/* Dismiss Button */}
          <button
            id="streak-toast-dismiss-btn"
            onClick={handleDismiss}
            className="text-neutral-400 hover:text-neutral-600 p-1 hover:bg-neutral-50 rounded-lg transition-colors cursor-pointer shrink-0"
            aria-label="Dismiss Notification"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default StreakNoticeToast;
