import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RotateCcw } from 'lucide-react';

interface AmberDotAnimationProps {
  onComplete?: () => void;
  replayKey?: number;
}

export const AmberDotAnimation: React.FC<AmberDotAnimationProps> = ({
  onComplete,
  replayKey = 0,
}) => {
  const [isLocked, setIsLocked] = useState(false);
  const [internalKey, setInternalKey] = useState(0);

  const key = replayKey + internalKey;

  const handleReplay = () => {
    setIsLocked(false);
    setInternalKey((k) => k + 1);
  };

  return (
    <div className="relative flex flex-col items-center justify-center p-6 bg-gradient-to-b from-slate-900 via-slate-900 to-[#12203A] text-white rounded-3xl border border-slate-800 shadow-2xl overflow-hidden select-none">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-radial from-[#0E9F8E]/20 via-transparent to-transparent pointer-events-none" />

      {/* Badge */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/30">
          Animasi Signature #1: Titik Amber Jatuh & Mengunci
        </span>
      </div>

      {/* Main Logo Target Box */}
      <div className="relative h-28 flex items-center justify-center">
        {/* Wordmark base: "Rev" [dot slot] "o" */}
        <div className="flex items-baseline text-5xl sm:text-6xl font-extrabold tracking-tight font-display text-white">
          <span>Rev</span>
          
          {/* Slot for letter 'i' with the animated falling dot */}
          <div className="relative inline-flex flex-col items-center justify-end w-8 mx-0.5">
            {/* The Falling Amber/Jade Dot */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`dot-${key}`}
                initial={{ y: -90, scale: 0.6, opacity: 0 }}
                animate={{
                  y: [ -90, 0, -22, 0, -8, 0 ],
                  scale: [ 0.6, 1.25, 1, 1.15, 1, 1 ],
                  opacity: 1,
                }}
                transition={{
                  duration: 0.95,
                  times: [ 0, 0.45, 0.65, 0.8, 0.9, 1 ],
                  ease: [0.22, 1, 0.36, 1],
                }}
                onAnimationComplete={() => {
                  setIsLocked(true);
                  if (onComplete) onComplete();
                }}
                className="w-4 h-4 rounded-full bg-[#FFB020] shadow-[0_0_16px_#FFB020] relative z-20"
              >
                {/* Lock Ring Ripple Effect when landed */}
                {isLocked && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 1 }}
                    animate={{ scale: 3.2, opacity: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="absolute inset-0 rounded-full border-2 border-[#FFB020]"
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {/* Stem of letter 'i' */}
            <div className="w-3.5 h-8 bg-white rounded-t-sm rounded-b-md mt-2" />
          </div>

          <span>o</span>
        </div>
      </div>

      {/* Status indicator */}
      <motion.div
        animate={isLocked ? { scale: [1, 1.05, 1], opacity: 1 } : { opacity: 0.6 }}
        className="mt-4 flex items-center gap-2 text-xs font-semibold"
      >
        <span
          className={`w-2 h-2 rounded-full ${
            isLocked ? 'bg-amber-400 shadow-[0_0_8px_#FFB020]' : 'bg-slate-500'
          }`}
        />
        <span className={isLocked ? 'text-amber-300 font-bold' : 'text-slate-400'}>
          {isLocked ? 'Titik Kunci Terkunci di Tempatnya! (Snap Lock 60fps)' : 'Menjatuhkan Titik Amber...'}
        </span>
      </motion.div>

      {/* Replay Button */}
      <div className="mt-5">
        <button
          type="button"
          onClick={handleReplay}
          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-xs font-bold text-white transition-all flex items-center gap-1.5 border border-white/15"
        >
          <RotateCcw size={13} />
          <span>Ulangi Animasi Jatuh</span>
        </button>
      </div>
    </div>
  );
};

export default AmberDotAnimation;
