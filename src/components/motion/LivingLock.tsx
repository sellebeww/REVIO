import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Unlock, AlertCircle } from 'lucide-react';
import { DecisionStatus } from '../../types/revio';

interface LivingLockProps {
  status: DecisionStatus;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const LivingLock: React.FC<LivingLockProps> = ({
  status,
  size = 'md',
  showLabel = false,
}) => {
  const isLocked = status === 'terkunci';
  const isWarning = status === 'mendekati_kunci';

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 28,
  }[size];

  const statusConfig = {
    fleksibel: {
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      label: 'Fleksibel',
      icon: Unlock,
    },
    mendekati_kunci: {
      color: 'text-amber-700 bg-amber-50 border-amber-200',
      label: 'Mendekati Kunci',
      icon: AlertCircle,
    },
    ditunda: {
      color: 'text-blue-700 bg-blue-50 border-blue-200',
      label: 'Ditunda',
      icon: Unlock,
    },
    terkunci: {
      color: 'text-slate-700 bg-slate-100 border-slate-300',
      label: 'Terkunci',
      icon: Lock,
    },
  }[status];

  const IconComponent = statusConfig.icon;

  return (
    <div className="inline-flex items-center gap-1.5">
      <motion.div
        className={`inline-flex items-center justify-center rounded-lg border p-1.5 transition-colors ${statusConfig.color}`}
        initial={{ scale: 0.95 }}
        animate={
          isLocked
            ? { scale: [1, 1.15, 0.95, 1], rotate: [0, -3, 3, 0] }
            : isWarning
            ? { scale: [1, 1.05, 1] }
            : { scale: 1 }
        }
        transition={{
          duration: isLocked ? 0.45 : isWarning ? 2 : 0.2,
          repeat: isWarning ? Infinity : 0,
          repeatType: 'reverse',
          ease: 'easeInOut',
        }}
      >
        <IconComponent size={iconSizes} className="shrink-0" />
      </motion.div>
      {showLabel && (
        <span className="text-xs font-medium text-slate-700">
          {statusConfig.label}
        </span>
      )}
    </div>
  );
};

export default LivingLock;
