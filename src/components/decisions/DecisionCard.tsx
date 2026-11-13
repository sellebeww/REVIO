import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Clock, CheckCircle2, FileEdit, ChevronDown, ChevronUp, ShieldCheck, Wrench, Package } from 'lucide-react';
import { Decision, ProductionStage, WorkLog, MaterialLog } from '../../types/revio';
import FlexibilityBar from '../motion/FlexibilityBar';
import LivingLock from '../motion/LivingLock';
import HoldToLock from '../motion/HoldToLock';
import DeferralCalculator from '../motion/DeferralCalculator';
import { formatIDR } from '../../lib/money';

interface DecisionCardProps {
  decision: Decision;
  stages: ProductionStage[];
  workLogs?: WorkLog[];
  materialLogs?: MaterialLog[];
  onLock: (decisionId: string) => void;
  onDefer: (decisionId: string, stageId: string, fee: number, days: number) => void;
  onRequestChange: (decision: Decision) => void;
  isCustomerView?: boolean;
}

export const DecisionCard: React.FC<DecisionCardProps> = ({
  decision,
  stages,
  workLogs = [],
  materialLogs = [],
  onLock,
  onDefer,
  onRequestChange,
  isCustomerView = true,
}) => {
  const [showCalculator, setShowCalculator] = useState(false);
  const [showEvidence, setShowEvidence] = useState(false);


  const isLocked = decision.status === 'terkunci';
  const isNearLock = decision.status === 'mendekati_kunci';
  const isDeferred = decision.status === 'ditunda';

  // Filter logs for this decision
  const decisionWorkLogs = workLogs.filter((w) => w.decisionId === decision.id);
  const decisionMaterialLogs = materialLogs.filter((m) => m.decisionId === decision.id);

  const totalLoggedHours = decisionWorkLogs.reduce((acc, curr) => acc + curr.hours, 0);
  const totalMaterialCost = decisionMaterialLogs.reduce(
    (acc, curr) => acc + curr.quantity * curr.unitPrice,
    0
  );

  return (
    <div
      className={`rounded-2xl border transition-all overflow-hidden bg-white shadow-xs ${
        isNearLock
          ? 'border-amber-300 ring-2 ring-amber-100'
          : isLocked
          ? 'border-slate-200 bg-slate-50/40'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      {/* Top Banner for Near Lock or Deferred */}
      {isNearLock && (
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-1.5 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <AlertTriangle size={14} />
            <span>Peringatan Titik Kunci: Tahap berikutnya akan menutup jendela revisi gratis!</span>
          </div>
          <span className="text-xs font-mono bg-white/20 px-2 py-0.5 rounded">
            Tenggat: {decision.deadlineAt}
          </span>
        </div>
      )}

      {isDeferred && (
        <div className="bg-blue-600 text-white px-4 py-1.5 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Clock size={14} />
            <span>Ditunda sampai: {decision.deferredUntilStageName || decision.deferredUntilDate}</span>
          </div>
          <span className="text-xs bg-white/20 px-2 py-0.5 rounded">
            Menjaga Fleksibilitas
          </span>
        </div>
      )}

      <div className="p-5 sm:p-6 space-y-5">
        {/* Header: Title, Lock Status, and Deadline */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Keputusan Penting
              </span>
              <LivingLock status={decision.status} size="sm" showLabel />
            </div>
            <h3 className="font-display font-bold text-lg text-slate-900">
              {decision.title}
            </h3>
            <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
              {decision.description}
            </p>
          </div>

          {/* Current Cost to change badge */}
          <div className="flex flex-col sm:items-end p-3 rounded-xl bg-slate-50 border border-slate-200/80 shrink-0">
            <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
              Biaya Perubahan Saat Ini
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="font-mono text-xl font-bold text-slate-900 tabular-nums">
                {formatIDR(decision.currentChangeCost)}
              </span>
            </div>
            <span className="text-xs text-slate-500">
              {decision.currentChangeCost === 0
                ? 'Gratis / Masih dalam Jendela Revisi'
                : 'Berdasarkan catatan jam & bahan nyata'}
            </span>
          </div>
        </div>

        {/* Options list */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-700">Pilihan Tersedia:</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {decision.options.map((opt) => {
              const isSelected = opt.id === decision.chosenOption;
              return (
                <div
                  key={opt.id}
                  className={`p-3 rounded-xl border transition-all text-left ${
                    isSelected
                      ? 'border-[#0E9F8E] bg-teal-50/50 ring-1 ring-[#0E9F8E]'
                      : 'border-slate-200 bg-white opacity-80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900">
                      {opt.label}
                    </span>
                    {isSelected && (
                      <CheckCircle2 size={16} className="text-[#0E9F8E]" />
                    )}
                  </div>
                  {opt.description && (
                    <p className="text-xs text-slate-600 leading-tight">
                      {opt.description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Flexibility Bar */}
        <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/60">
          <FlexibilityBar score={decision.flexibilityScore} size="md" />
        </div>

        {/* Titik Kunci Notice / Why Expensive */}
        <div className="rounded-xl bg-amber-50/60 border border-amber-200/60 p-3.5 text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-amber-950">
            <AlertTriangle size={15} className="text-amber-700 shrink-0" />
            <span>Titik Kunci: {decision.lockStageName}</span>
          </div>
          <p className="text-amber-900 leading-relaxed text-xs pl-5">
            <strong>Mengapa mahal jika diubah melewati tahap ini?</strong> {decision.whyExpensive}
          </p>
        </div>

        {/* Work & Material Logs Accordion (Evidence Package) */}
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => setShowEvidence(!showEvidence)}
            className="w-full px-4 py-2.5 bg-slate-50 flex items-center justify-between text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck size={15} className="text-[#0E9F8E]" />
              <span>Transparansi Bukti: Catatan Jam Kerja & Bahan Nyata ({decisionWorkLogs.length + decisionMaterialLogs.length} entri)</span>
            </div>
            {showEvidence ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          <AnimatePresence>
            {showEvidence && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="p-4 bg-white space-y-4 text-xs divide-y divide-slate-100"
              >
                {/* Work logs */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between font-semibold text-slate-800">
                    <span className="flex items-center gap-1.5">
                      <Wrench size={13} className="text-slate-500" />
                      Jam Kerja Terdampak: {totalLoggedHours} Jam
                    </span>
                    <span className="font-mono tabular-nums">
                      Tarif: {formatIDR(decision.hourlyRate)}/jam
                    </span>
                  </div>
                  {decisionWorkLogs.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">Belum ada jam kerja yang terdampak langsung.</p>
                  ) : (
                    <div className="space-y-1.5">
                      {decisionWorkLogs.map((log) => (
                        <div
                          key={log.id}
                          className="flex justify-between items-center p-2 rounded-lg bg-slate-50 text-xs"
                        >
                          <div>
                            <span className="font-medium text-slate-800">{log.description}</span>
                            <div className="text-slate-400 text-xs">
                              Oleh {log.loggedBy} · {log.loggedAt}
                            </div>
                          </div>
                          <span className="font-mono font-semibold text-slate-700">
                            {log.hours} Jam ({formatIDR(log.hours * log.rate)})
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Material logs */}
                <div className="space-y-2 pt-3">
                  <div className="flex items-center justify-between font-semibold text-slate-800">
                    <span className="flex items-center gap-1.5">
                      <Package size={13} className="text-slate-500" />
                      Bahan Terkait: {formatIDR(totalMaterialCost)}
                    </span>
                    <span className="text-xs text-slate-400 font-normal">
                      Hanya bahan terbuang yang dibebankan
                    </span>
                  </div>
                  {decisionMaterialLogs.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">Belum ada bahan spesifik yang disiapkan.</p>
                  ) : (
                    <div className="space-y-1.5">
                      {decisionMaterialLogs.map((mat) => (
                        <div
                          key={mat.id}
                          className="flex justify-between items-center p-2 rounded-lg bg-slate-50 text-xs"
                        >
                          <div>
                            <span className="font-medium text-slate-800">{mat.material}</span>
                            <div className="text-slate-400 text-xs">
                              {mat.quantity} {mat.unit} @ {formatIDR(mat.unitPrice)} · Daur Ulang: {mat.reusablePct}%
                            </div>
                          </div>
                          <span className="font-mono font-semibold text-slate-700">
                            {formatIDR(mat.quantity * mat.unitPrice * (1 - mat.reusablePct / 100))}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Calculator toggle preview */}
        {showCalculator && (
          <DeferralCalculator
            decision={decision}
            stages={stages}
            onConfirmDeferral={(stageId, fee, days) => {
              onDefer(decision.id, stageId, fee, days);
              setShowCalculator(false);
            }}
          />
        )}

        {/* 3 Core Actions for Customer */}
        {isCustomerView && (
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            {isLocked ? (
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <CheckCircle2 size={16} className="text-emerald-600" />
                <span>
                  Terkunci oleh <strong>{decision.lockedBy || 'Pelanggan'}</strong> pada {decision.lockedAt || 'tahap sebelumnya'}
                </span>
              </div>
            ) : (
              <HoldToLock
                onLocked={() => onLock(decision.id)}
                isAlreadyLocked={isLocked}
              />
            )}

            {!isLocked && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowCalculator(!showCalculator)}
                  className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  {showCalculator ? 'Tutup Simulasi' : 'Tunda Keputusan...'}
                </button>

                <button
                  type="button"
                  onClick={() => onRequestChange(decision)}
                  className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors flex items-center gap-1.5"
                >
                  <FileEdit size={13} />
                  <span>Ajukan Perubahan (Change Order)</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DecisionCard;
