import React from 'react';
import { motion } from 'framer-motion';

interface FlexibilityBarProps {
  score: number; // 0 to 100
  showLabel?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const FlexibilityBar: React.FC<FlexibilityBarProps> = ({
  score,
  showLabel = true,
  className = '',
  size = 'md',
}) => {
  const clampedScore = Math.max(0, Math.min(100, score));

  // Determine color palette based on flexibility score
  let barGradient = 'from-emerald-500 to-teal-500';
  let badgeBg = 'bg-emerald-50 text-emerald-800 border-emerald-200';
  let statusText = 'Fleksibilitas Tinggi';

  if (clampedScore === 0) {
    barGradient = 'from-slate-400 to-slate-500';
    badgeBg = 'bg-slate-100 text-slate-700 border-slate-200';
    statusText = 'Terkunci di Produksi';
  } else if (clampedScore < 40) {
    barGradient = 'from-amber-500 to-rose-500';
    badgeBg = 'bg-amber-50 text-amber-800 border-amber-200';
    statusText = 'Mendekati Kunci';
  } else if (clampedScore < 70) {
    barGradient = 'from-teal-500 to-amber-500';
    badgeBg = 'bg-teal-50 text-teal-800 border-teal-200';
    statusText = 'Fleksibel Bersyarat';
  }

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  }[size];

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
          <div className="flex items-center gap-1.5 text-slate-700">
            <span>Pita Fleksibilitas:</span>
            <span className="text-slate-500 text-xs font-normal">{statusText}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-mono font-bold text-slate-900 tabular-nums">
              {Math.round(clampedScore)}%
            </span>
            <span className="text-xs text-slate-400">skor</span>
          </div>
        </div>
      )}

      {/* Outer track */}
      <div className={`w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/80 shadow-inner ${heightClasses}`}>
        {/* Animated shrinking/expanding bar */}
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${barGradient} shadow-sm`}
          initial={{ width: 0 }}
          animate={{ width: `${clampedScore}%` }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
};

export default FlexibilityBar;
