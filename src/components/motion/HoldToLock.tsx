import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface HoldToLockProps {
  onLocked: () => void;
  disabled?: boolean;
  isAlreadyLocked?: boolean;
  className?: string;
}

export const HoldToLock: React.FC<HoldToLockProps> = ({
  onLocked,
  disabled = false,
  isAlreadyLocked = false,
  className = '',
}) => {
  const [progress, setProgress] = useState(0); // 0 to 100
  const [isHolding, setIsHolding] = useState(false);
  const [isSuccess, setIsSuccess] = useState(isAlreadyLocked);
  const requestRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const HOLD_DURATION_MS = 1000; // 1 second

  useEffect(() => {
    setIsSuccess(isAlreadyLocked);
  }, [isAlreadyLocked]);

  // Batalkan animasi bila komponen ditutup di tengah tahan (mis. dialog ditutup).
  useEffect(() => () => {
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
  }, []);

  const handleStart = () => {
    if (disabled || isSuccess || startTimeRef.current) return;
    setIsHolding(true);
    startTimeRef.current = performance.now();

    const updateProgress = (now: number) => {
      if (!startTimeRef.current) return;
      const elapsed = now - startTimeRef.current;
      const newProgress = Math.min(100, (elapsed / HOLD_DURATION_MS) * 100);
      setProgress(newProgress);

      if (newProgress >= 100) {
        // Complete!
        setIsHolding(false);
        setIsSuccess(true);
        triggerSuccessCelebration();
        onLocked();
        return;
      }

      requestRef.current = requestAnimationFrame(updateProgress);
    };

    requestRef.current = requestAnimationFrame(updateProgress);
  };

  const handleEnd = () => {
    if (isSuccess) return;
    setIsHolding(false);
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = null;
    }
    startTimeRef.current = null;
    setProgress(0);
  };

  const triggerSuccessCelebration = () => {
    // Gentle confetti burst
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#0E9F8E', '#FFB020', '#12203A'],
    });

    // Device vibration if supported
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([40, 60, 100]);
    }
  };

  if (isSuccess) {
    return (
      <div className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 border border-slate-300 text-slate-700 text-sm font-semibold select-none shadow-sm ${className}`}>
        <Check size={18} className="text-emerald-600" />
        <span>Keputusan Terkunci</span>
      </div>
    );
  }


  return (
    <div className={`flex flex-col items-start gap-1 select-none ${className}`}>
      <motion.button
        type="button"
        disabled={disabled}
        onMouseDown={handleStart}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchEnd={handleEnd}
        onKeyDown={(e) => {
          if (e.key !== 'Enter' && e.key !== ' ') return;
          e.preventDefault();
          if (!e.repeat) handleStart();
        }}
        onKeyUp={(e) => (e.key === 'Enter' || e.key === ' ') && handleEnd()}
        onBlur={handleEnd}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        className={`relative inline-flex items-center gap-3 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm ${
          disabled
            ? 'bg-slate-100 text-slate-500 border border-slate-200 cursor-not-allowed'
            : isHolding
            ? 'bg-[#0A7A6D] text-white shadow-md'
            : 'bg-[#0E9F8E] hover:bg-[#0A7A6D] text-white active:bg-[#086157]'
        }`}
      >
        {/* Radial progress ring */}
        <div className="relative w-7 h-7 flex items-center justify-center shrink-0">
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="14"
              cy="14"
              r="11"
              stroke="currentColor"
              strokeWidth="2.5"
              fill="transparent"
              className="text-white/25"
            />
            <circle
              cx="14"
              cy="14"
              r="11"
              stroke="white"
              strokeWidth="2.8"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 11}
              strokeDashoffset={2 * Math.PI * 11 - (progress / 100) * (2 * Math.PI * 11)}
              strokeLinecap="round"
              className="transition-all duration-75"
            />
          </svg>
          <Lock size={13} className="absolute text-white" />
        </div>

        <div className="flex flex-col text-left">
          <span>{isHolding ? 'Tahan 1 Detik...' : 'Tahan untuk Kunci'}</span>
        </div>
      </motion.button>
      <span className="text-xs text-slate-500 pl-1">
        Tekan & tahan 1 detik untuk mengunci pilihan secara permanen
      </span>
    </div>
  );
};

export default HoldToLock;
