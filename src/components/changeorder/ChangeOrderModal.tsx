import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, FileText, AlertTriangle, Check, ShieldCheck } from 'lucide-react';
import { Decision, ChangeOrder, WorkLog, MaterialLog } from '../../types/revio';
import Modal from '../ui/Modal';

interface ChangeOrderModalProps {
  decision: Decision | null;
  workLogs: WorkLog[];
  materialLogs: MaterialLog[];
  isOpen: boolean;
  onClose: () => void;
  onSubmitChangeOrder: (newOrder: Partial<ChangeOrder>) => void;
}

export const ChangeOrderModal: React.FC<ChangeOrderModalProps> = ({ decision, isOpen, ...rest }) => {
  // Hooks hidup di ChangeOrderForm agar tidak dipanggil setelah early return.
  if (!isOpen || !decision) return null;
  return <ChangeOrderForm key={decision.id} decision={decision} isOpen={isOpen} {...rest} />;
};

const ChangeOrderForm: React.FC<ChangeOrderModalProps & { decision: Decision }> = ({
  decision,
  workLogs,
  materialLogs,
  onClose,
  onSubmitChangeOrder,
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string>(
    decision.options.find((o) => o.id !== decision.chosenOption)?.id || decision.options[0].id
  );
  const [customerNotes, setCustomerNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedOptionObj = decision.options.find((o) => o.id === selectedOptionId);
  const currentOptionObj = decision.options.find((o) => o.id === decision.chosenOption);

  // Biaya hanya berasal dari catatan kerja/bahan nyata (aturan integritas DECISIONS.md #2).
  const relevantWork = workLogs.filter((w) => w.decisionId === decision.id);
  const relevantMaterials = materialLogs.filter((m) => m.decisionId === decision.id);
  const hasEvidence = relevantWork.length > 0 || relevantMaterials.length > 0;

  const affectedWorkHours = relevantWork.reduce((acc, curr) => acc + curr.hours, 0);
  const affectedWorkCost = affectedWorkHours * decision.hourlyRate;

  const rawMaterialValue = relevantMaterials.reduce((acc, m) => acc + m.quantity * m.unitPrice, 0);
  const wastedMaterialValue = Math.round(
    relevantMaterials.reduce((acc, m) => acc + (m.quantity * m.unitPrice * (100 - m.reusablePct)) / 100, 0)
  );
  const reuseDeduction = rawMaterialValue - wastedMaterialValue;
  const rescheduleFee = hasEvidence ? decision.rescheduleFee : 0;
  const totalCost = affectedWorkCost + wastedMaterialValue + rescheduleFee;
  const scheduleImpactDays = Math.ceil(affectedWorkHours / 8);

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const handleConfirm = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      onSubmitChangeOrder({
        projectId: decision.projectId,
        decisionId: decision.id,
        decisionTitle: decision.title,
        fromOption: currentOptionObj?.label || 'Pilihan Semula',
        toOption: selectedOptionObj?.label || 'Pilihan Baru',
        affectedWorkHours,
        affectedWorkCost,
        wastedMaterialValue,
        reuseDeduction,
        rescheduleFee,
        totalCost,
        scheduleImpactDays,
        status: 'disetujui',
        requestedAt: new Date().toLocaleString('id-ID'),
        approvedAt: new Date().toLocaleString('id-ID'),
        approvedBy: 'Pelanggan (Konfirmasi Mandiri via Revio)',
        expiresAt: new Date(Date.now() + 86400000 * 2).toLocaleString('id-ID'),
        notes: customerNotes || 'Pengajuan perubahan disetujui dengan rincian biaya transparan.',
      });
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <Modal onClose={onClose} labelledBy="co-title">
      <motion.div
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-100/80 text-[#0E9F8E]">
              <FileText size={20} />
            </div>
            <div>
              <h3 id="co-title" className="font-display font-bold text-slate-900 text-base">
                Formulir Perubahan (Change Order)
              </h3>
              <p className="text-xs text-slate-500">{decision.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup formulir"
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/50 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs text-slate-700">
          {/* Comparison */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs uppercase font-bold text-slate-400">
                Pilihan Saat Ini
              </span>
              <p className="font-semibold text-slate-800 text-xs mt-1">
                {currentOptionObj?.label}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-teal-50 border border-teal-200">
              <span className="text-xs uppercase font-bold text-teal-700">
                Ganti Menjadi
              </span>
              <select
                aria-label="Ganti menjadi"
                value={selectedOptionId}
                onChange={(e) => setSelectedOptionId(e.target.value)}
                className="w-full mt-1 bg-white border border-teal-300 rounded-lg p-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0E9F8E]"
              >
                {decision.options.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Transparent Itemized Breakdown */}
          <div className="rounded-xl border border-slate-200 p-4 space-y-3 bg-white">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-[#0E9F8E]" />
                Rincian Biaya Transparan Revio
              </span>
              <span className="text-xs text-slate-500">Standar Adil & Terbuka</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-600">
                <span>Jam kerja terdampak ({affectedWorkHours} jam @ {formatIDR(decision.hourlyRate)}):</span>
                <span className="font-mono tabular-nums text-slate-900">{formatIDR(affectedWorkCost)}</span>
              </div>

              <div className="flex justify-between items-center text-slate-600">
                <span>Bahan terpakai non-reusable:</span>
                <span className="font-mono tabular-nums text-slate-900">{formatIDR(rawMaterialValue)}</span>
              </div>

              <div className="flex justify-between items-center text-emerald-700 font-medium">
                <span>Deduksi nilai bahan yang bisa dipakai ulang:</span>
                <span className="font-mono tabular-nums">-{formatIDR(reuseDeduction)}</span>
              </div>

              <div className="flex justify-between items-center text-slate-600">
                <span>Biaya kalibrasi & penjadwalan ulang:</span>
                <span className="font-mono tabular-nums text-slate-900">{formatIDR(rescheduleFee)}</span>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline font-bold">
                <span className="text-slate-900">Total Biaya Perubahan:</span>
                <span className="font-mono text-base text-[#0E9F8E] tabular-nums">
                  {formatIDR(totalCost)}
                </span>
              </div>
            </div>

            {!hasEvidence && (
              <p role="alert" className="p-2.5 rounded-lg bg-slate-100 text-slate-700 text-xs">
                Belum ada catatan jam kerja atau bahan untuk keputusan ini, sehingga belum ada dasar biaya perubahan.
                Change order baru bisa diterbitkan setelah vendor mencatat pekerjaan nyata.
              </p>
            )}
            <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200/60 text-amber-900 text-xs flex items-center gap-2">
              <AlertTriangle size={14} className="shrink-0 text-amber-700" />
              <span>
                Dampak jadwal: Produksi bertambah <strong>+{scheduleImpactDays} hari kalender</strong> untuk pengerjaan ulang.
              </span>
            </div>
          </div>

          {/* Customer Note */}
          <div className="space-y-1.5">
            <label htmlFor="co-notes" className="text-xs font-semibold text-slate-700">
              Catatan Pelanggan (Opsional)
            </label>
            <textarea
              id="co-notes"
              rows={2}
              value={customerNotes}
              onChange={(e) => setCustomerNotes(e.target.value)}
              placeholder="Contoh: Mohon pastikan warna baru disesuaikan dengan lantai kamar tidur..."
              className="w-full border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0E9F8E]"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            Batal
          </button>

          <button
            type="button"
            disabled={isSubmitting || !hasEvidence}
            onClick={handleConfirm}
            className="px-5 py-2.5 text-xs font-semibold rounded-xl bg-[#0E9F8E] hover:bg-[#0A7A6D] text-white flex items-center gap-2 shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check size={15} />
            <span>Setujui Perubahan & Terbitkan Change Order</span>
          </button>
        </div>
      </motion.div>
    </Modal>
  );
};

export default ChangeOrderModal;
