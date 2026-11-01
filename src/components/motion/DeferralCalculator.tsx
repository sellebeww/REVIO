import React, { useState } from 'react';

import { Calculator, Clock, AlertTriangle, ArrowRight } from 'lucide-react';
import { Decision, ProductionStage } from '../../types/revio';
import FlexibilityBar from './FlexibilityBar';

interface DeferralCalculatorProps {
  decision: Decision;
  stages: ProductionStage[];
  onConfirmDeferral?: (deferToStageId: string, fee: number, days: number) => void;
}

export const DeferralCalculator: React.FC<DeferralCalculatorProps> = ({
  decision,
  stages,
  onConfirmDeferral,
}) => {
  // Available future stages for deferral
  const futureStages = stages.filter((s) => s.status !== 'completed');
  const [selectedStageIndex, setSelectedStageIndex] = useState(0);

  const targetStage = futureStages[selectedStageIndex] || futureStages[0];

  // Calculation parameters
  const stepsAhead = selectedStageIndex + 1;
  const simulatedFlexibilityScore = Math.max(
    5,
    Math.round(decision.flexibilityScore - stepsAhead * 22)
  );

  // Fee calculation: holding buffer materials + reschedule overhead
  const baseHoldingFee = decision.rescheduleFee;
  const addedBufferCost = stepsAhead * 250000;
  const totalSimulatedFee = baseHoldingFee + addedBufferCost;
  const simulatedScheduleImpactDays = stepsAhead * 3;

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-teal-50 text-[#0E9F8E]">
            <Calculator size={18} />
          </div>
          <div>
            <h4 className="font-display font-bold text-slate-900 text-sm">
              Kalkulator Biaya Fleksibilitas & Tunda
            </h4>
            <p className="text-xs text-slate-500">
              Simulasikan dampak biaya dan jadwal bila keputusan ini ditunda
            </p>
          </div>
        </div>
      </div>

      {/* Slider selector */}
      <div className="space-y-3">
        <div className="flex justify-between items-center text-xs">
          <span className="font-medium text-slate-700">Tunda pilihan sampai:</span>
          <span className="font-semibold text-[#0E9F8E] bg-teal-50 px-2 py-0.5 rounded-md">
            {targetStage?.name || 'Tahap Berikutnya'}
          </span>
        </div>

        <input
          type="range"
          min={0}
          max={Math.max(0, futureStages.length - 1)}
          value={selectedStageIndex}
          onChange={(e) => setSelectedStageIndex(Number(e.target.value))}
          className="w-full accent-[#0E9F8E] cursor-pointer"
        />

        <div className="flex justify-between text-xs text-slate-400">
          <span>Tahap Aktif</span>
          <span>Tahap Akhir</span>
        </div>
      </div>

      {/* Simulated Live Impact Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200/70">
        <div>
          <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
            Estimasi Biaya Fleksibilitas
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="font-mono text-xl font-bold text-slate-900 tabular-nums">
              {formatIDR(totalSimulatedFee)}
            </span>
          </div>
          <span className="text-xs text-slate-500">
            Penahanan jadwal & alokasi bahan cadangan
          </span>
        </div>

        <div>
          <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
            Dampak Mundur Jadwal
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Clock size={16} className="text-amber-600" />
            <span className="font-mono text-lg font-bold text-slate-900 tabular-nums">
              +{simulatedScheduleImpactDays} Hari Kalender
            </span>
          </div>
          <span className="text-xs text-slate-500">
            Antrean workshop & slot produksi baru
          </span>
        </div>
      </div>

      {/* Simulated Flexibility Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-slate-600">
          <span>Proyeksi Sisa Fleksibilitas:</span>
          <span className="font-mono font-semibold tabular-nums text-slate-800">
            {simulatedFlexibilityScore}%
          </span>
        </div>
        <FlexibilityBar score={simulatedFlexibilityScore} showLabel={false} size="sm" />
      </div>

      {/* Transparent Formula Note */}
      <div className="rounded-xl bg-amber-50/70 border border-amber-200/60 p-3 text-xs text-amber-900 flex items-start gap-2.5">
        <AlertTriangle size={16} className="shrink-0 text-amber-700 mt-0.5" />
        <div className="space-y-1">
          <p className="font-medium text-amber-950">
            Keterbukaan Rumus Revio:
          </p>
          <p className="text-xs text-amber-800 leading-relaxed">
            Biaya Fleksibilitas = Biaya slot jadwal ({formatIDR(baseHoldingFee)}) + komitmen penahanan bahan cadangan ({formatIDR(addedBufferCost)}). Tidak ada biaya tersembunyi.
          </p>
        </div>
      </div>

      {onConfirmDeferral && (
        <button
          type="button"
          onClick={() =>
            onConfirmDeferral(
              targetStage.id,
              totalSimulatedFee,
              simulatedScheduleImpactDays
            )
          }
          className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          <span>Konfirmasi Penundaan Sampai Tahap Ini</span>
          <ArrowRight size={14} />
        </button>
      )}
    </div>
  );
};

export default DeferralCalculator;
