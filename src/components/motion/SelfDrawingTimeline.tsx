import React from 'react';
import { motion } from 'framer-motion';
import { Check, Clock, AlertCircle, Camera, Lock } from 'lucide-react';
import { ProductionStage } from '../../types/revio';

interface SelfDrawingTimelineProps {
  stages: ProductionStage[];
  onSelectStage?: (stage: ProductionStage) => void;
  selectedStageId?: string;
  className?: string;
}

export const SelfDrawingTimeline: React.FC<SelfDrawingTimelineProps> = ({
  stages,
  onSelectStage,
  selectedStageId,
  className = '',
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-emerald-500 before:via-[#0E9F8E] before:to-slate-200">
        {stages.map((stage, idx) => {
          const isCompleted = stage.status === 'completed';
          const isInProgress = stage.status === 'in_progress';
          const isPending = stage.status === 'pending';
          const isSelected = selectedStageId === stage.id;
          const hasLockPoint = stage.lockPointForTitles && stage.lockPointForTitles.length > 0;

          return (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.3 }}
              className={`relative rounded-xl border p-4 transition-all cursor-pointer ${
                isSelected
                  ? 'border-[#0E9F8E] bg-white ring-2 ring-[#0E9F8E]/20 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
              onClick={() => onSelectStage && onSelectStage(stage)}
            >
              {/* Timeline Node Indicator */}
              <div
                className={`absolute -left-[30px] sm:-left-[38px] top-4 w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shadow-xs border-2 transition-transform ${
                  isCompleted
                    ? 'bg-emerald-500 border-white text-white'
                    : isInProgress
                    ? 'bg-amber-400 border-white text-amber-950 ring-4 ring-amber-100 animate-pulse'
                    : 'bg-white border-slate-300 text-slate-400'
                }`}
              >
                {isCompleted ? (
                  <Check size={14} strokeWidth={3} />
                ) : isInProgress ? (
                  <Clock size={14} />
                ) : (
                  <span>{stage.order}</span>
                )}
              </div>

              {/* Stage Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500">
                    Tahap {stage.order}
                  </span>
                  <h4 className="font-display font-bold text-sm text-slate-900">
                    {stage.name}
                  </h4>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  {hasLockPoint && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-medium text-xs">
                      <Lock size={11} className="text-amber-600" />
                      Titik Kunci
                    </span>
                  )}
                  <span
                    className={`px-2 py-0.5 rounded-md font-medium text-xs ${
                      isCompleted
                        ? 'bg-emerald-50 text-emerald-800'
                        : isInProgress
                        ? 'bg-amber-50 text-amber-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {isCompleted ? 'Selesai' : isInProgress ? 'Sedang Dikerjakan' : 'Menunggu'}
                  </span>
                </div>
              </div>

              {/* Notes & Lock Point Details */}
              {stage.notes && (
                <p className="text-xs text-slate-600 leading-relaxed mt-1">
                  {stage.notes}
                </p>
              )}

              {/* Lock Point alert */}
              {hasLockPoint && (
                <div className="mt-2.5 p-2 rounded-lg bg-amber-50/70 border border-amber-200/50 flex items-center gap-2 text-xs text-amber-900">
                  <AlertCircle size={14} className="text-amber-600 shrink-0" />
                  <span className="text-xs">
                    <strong>Titik Kunci untuk:</strong> {stage.lockPointForTitles?.join(', ')}
                  </span>
                </div>
              )}

              {/* Photos & meta */}
              <div className="mt-3 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <span>Pembaruan: {stage.lastUpdatedAt}</span>
                  {stage.updatedBy && <span>Oleh: {stage.updatedBy}</span>}
                </div>
                {stage.photos && stage.photos.length > 0 && (
                  <span className="inline-flex items-center gap-1 text-[#0E9F8E] font-medium">
                    <Camera size={12} />
                    {stage.photos.length} Foto Bukti
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default SelfDrawingTimeline;
