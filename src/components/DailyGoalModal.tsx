import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target, X, Clock, Zap, BookOpen, Award, Check } from 'lucide-react';

interface DailyGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentGoal: number; // in minutes
  onSave: (minutes: number) => Promise<any>;
}

export const DailyGoalModal: React.FC<DailyGoalModalProps> = ({
  isOpen,
  onClose,
  currentGoal,
  onSave
}) => {
  const [selectedGoal, setSelectedGoal] = useState<number>(currentGoal || 10);
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [customValue, setCustomValue] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      const isPreset = [10, 20, 30].includes(currentGoal);
      setSelectedGoal(currentGoal || 10);
      setIsCustom(!isPreset);
      if (!isPreset) {
        setCustomValue((currentGoal || 10).toString());
      } else {
        setCustomValue('');
      }
    }
  }, [isOpen, currentGoal]);

  const presets = [
    {
      value: 10,
      label: 'Casual Progress',
      desc: 'Ideal for busy days. Keep the momentum going.',
      icon: Clock,
      color: 'text-sky-500 bg-sky-50 border-sky-100',
      activeBorder: 'border-sky-500 ring-2 ring-sky-500/20'
    },
    {
      value: 20,
      label: 'Regular Scholar',
      desc: 'Balanced. Deepen your understanding of Russian.',
      icon: BookOpen,
      color: 'text-orange-500 bg-orange-50 border-orange-100',
      activeBorder: 'border-orange-500 ring-2 ring-orange-500/20'
    },
    {
      value: 30,
      label: 'Serious Target',
      desc: 'High concentration. Perfect for ambitious applicants.',
      icon: Award,
      color: 'text-emerald-500 bg-emerald-50 border-emerald-100',
      activeBorder: 'border-emerald-500 ring-2 ring-emerald-500/20'
    }
  ];

  const handlePresetSelect = (val: number) => {
    setSelectedGoal(val);
    setIsCustom(false);
  };

  const handleCustomSelect = () => {
    setIsCustom(true);
    if (customValue) {
      setSelectedGoal(parseInt(customValue, 10) || 10);
    }
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setCustomValue(val);
    if (val) {
      setSelectedGoal(parseInt(val, 10) || 10);
    }
  };

  const handleSave = async () => {
    let finalGoal = selectedGoal;
    if (isCustom) {
      const parsed = parseInt(customValue, 10);
      if (!parsed || parsed <= 0) {
        finalGoal = 10;
      } else if (parsed > 300) {
        finalGoal = 300; // Cap at 5 hours of daily learning goal
      } else {
        finalGoal = parsed;
      }
    }

    try {
      setIsSaving(true);
      await onSave(finalGoal);
      onClose();
    } catch (err) {
      console.error('Failed to save daily learning goal:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-neutral-900/40 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-xl border border-neutral-100 overflow-hidden z-10 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neutral-800 leading-tight">Daily Learning Target</h3>
                  <p className="text-xs text-neutral-400">Keep your streak active with focused daily learning</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-neutral-100 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-200 transition-all flex items-center justify-center cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              {/* Presets Grid */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest block">Select a Target Goal</label>
                
                <div className="grid grid-cols-1 gap-3">
                  {presets.map((preset) => {
                    const PresetIcon = preset.icon;
                    const isSelected = !isCustom && selectedGoal === preset.value;

                    return (
                      <button
                        key={preset.value}
                        onClick={() => handlePresetSelect(preset.value)}
                        className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-start gap-4 cursor-pointer relative ${
                          isSelected 
                            ? `${preset.activeBorder} bg-neutral-50/40` 
                            : 'border-neutral-200/85 hover:border-neutral-300 bg-white'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${preset.color}`}>
                          <PresetIcon className="w-5 h-5" />
                        </div>
                        
                        <div className="flex-1 min-w-0 pr-6">
                          <div className="flex items-center gap-1.5 font-bold text-neutral-800 text-sm">
                            {preset.label}
                            <span className="text-xs font-medium text-neutral-400">({preset.value} min/day)</span>
                          </div>
                          <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed">{preset.desc}</p>
                        </div>

                        {isSelected && (
                          <div className="absolute top-4 right-4 text-emerald-600 bg-emerald-50 rounded-full p-1 border border-emerald-100">
                            <Check className="w-3.5 h-3.5 stroke-[3px]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Input */}
              <div className="space-y-3 pt-1">
                <button
                  type="button"
                  onClick={handleCustomSelect}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-center gap-4 cursor-pointer relative ${
                    isCustom 
                      ? 'border-orange-500 ring-2 ring-orange-500/20 bg-neutral-50/40' 
                      : 'border-neutral-200/85 hover:border-neutral-300 bg-white'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                    isCustom ? 'text-orange-500 bg-orange-50 border-orange-100' : 'text-neutral-400 bg-neutral-50 border-neutral-100'
                  }`}>
                    <Zap className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-neutral-800 text-sm">Custom Motivation</span>
                    <p className="text-xs text-neutral-500 mt-0.5">Specify a custom target for active sessions.</p>
                  </div>

                  {isCustom && (
                    <div className="absolute top-4 right-4 text-emerald-600 bg-emerald-50 rounded-full p-1 border border-emerald-100">
                      <Check className="w-3.5 h-3.5 stroke-[3px]" />
                    </div>
                  )}
                </button>

                {isCustom && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pl-14 pr-2"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          inputMode="numeric"
                          value={customValue}
                          onChange={handleCustomChange}
                          placeholder="e.g., 15, 45, 60"
                          className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm font-semibold focus:outline-hidden focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                          autoFocus
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-neutral-400">minutes</span>
                      </div>
                    </div>
                    {customValue && (parseInt(customValue, 10) > 300) && (
                      <p className="text-[10px] text-orange-600 mt-1">Goal is capped at 300 minutes (5 hours) to ensure balance.</p>
                    )}
                  </motion.div>
                )}
              </div>

              {/* Informative advice */}
              <div className="bg-neutral-50 border border-neutral-150 rounded-2xl p-4 text-xs text-neutral-500 leading-relaxed flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-neutral-700">How streaks work</span>
                  <br />
                  A active learning clock runs in the background while you are actively reading lessons, practicing scenarios, or reading lectures. Accumulating your daily learning goal will instantly extend your streak target!
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-neutral-100 bg-neutral-50/50 flex gap-3 justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-xl transition-all cursor-pointer"
                disabled={isSaving}
              >
                Cancel
              </button>
              
              <button
                onClick={handleSave}
                disabled={isSaving || (isCustom && !customValue)}
                className="px-5 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all shadow-xs hover:shadow-md cursor-pointer flex items-center gap-1.5"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Apply Goal'
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
export default DailyGoalModal;
