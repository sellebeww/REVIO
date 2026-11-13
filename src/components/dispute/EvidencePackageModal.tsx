import React from 'react';
import { printDocument } from '../../lib/printDocument';
import { ShieldCheck, X, Printer, FileCheck2, Clock, FileText, CheckCircle2, Scale } from 'lucide-react';
import { Project } from '../../types/revio';

import Modal from '../ui/Modal';
import { formatIDR } from '../../lib/money';

interface EvidencePackageModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

export const EvidencePackageModal: React.FC<EvidencePackageModalProps> = ({
  project,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;


  const handlePrint = (e: React.MouseEvent<HTMLElement>) => printDocument(`Revio-Bukti-${project.id}`, e.currentTarget);

  return (
    <Modal onClose={onClose} label="Berkas bukti sengketa">
      <div data-print-area className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-teal-50 text-[#0E9F8E] border border-teal-200">
              <Scale size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0E9F8E]">
                  Paket Bukti Otomatis Revio (Evidence Dossier)
                </span>
                <span className="px-2 py-0.5 rounded text-xs font-mono bg-slate-100 text-slate-700 font-bold">
                  UUID: {project.id.toUpperCase()}-EVD
                </span>
              </div>
              <h3 className="font-display font-extrabold text-xl text-slate-900">
                Berkas Bukti Transparansi & Audit Persetujuan
              </h3>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700 p-1">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto space-y-6 pr-1 text-xs text-slate-700">
          {/* Certificate banner */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShieldCheck size={20} className="text-emerald-600 shrink-0" />
              <div>
                <h4 className="font-bold text-emerald-950">Integritas Log Terjamin Tidak Dapat Diubah</h4>
                <p className="text-xs text-emerald-800">
                  Semua rekaman pekerjaan, foto kemajuan, dan penguncian dicatat otomatis dengan stempel waktu permanen.
                </p>
              </div>
            </div>
            <span className="text-xs font-mono text-emerald-900 font-bold bg-white px-2.5 py-1 rounded-md border border-emerald-300">
              SHA-256 VERIFIED
            </span>
          </div>

          {/* Project & Parties Summary */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div>
              <span className="text-xs uppercase font-bold text-slate-500">Pihak Vendor Manufaktur</span>
              <p className="font-bold text-slate-900 text-sm mt-0.5">{project.vendorName}</p>
              <p className="text-xs text-slate-500">{project.vendorSlug} · Kontak Vendor</p>
            </div>
            <div>
              <span className="text-xs uppercase font-bold text-slate-500">Pihak Pelanggan / Pemesan</span>
              <p className="font-bold text-slate-900 text-sm mt-0.5">{project.customerName}</p>
              <p className="text-xs text-slate-500">{project.customerPhone} · {project.customerEmail}</p>
            </div>
          </div>

          {/* Decisions Audit Trail */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <FileCheck2 size={16} className="text-[#0E9F8E]" />
              <span>Status Keputusan & Titik Kunci</span>
            </h4>
            <div className="space-y-2">
              {project.decisions.map((dec) => (
                <div key={dec.id} className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900">{dec.title}</span>
                    <span className="px-2 py-0.5 rounded text-xs font-bold uppercase bg-slate-100 text-slate-800">
                      {dec.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    <strong>Pilihan Aktif:</strong> {dec.options.find((o) => o.id === dec.chosenOption)?.label || dec.chosenOption}
                  </p>
                  <div className="p-2 rounded-lg bg-slate-50 text-xs text-slate-500 flex justify-between">
                    <span>Titik Kunci: <strong>{dec.lockStageName}</strong></span>
                    <span>Tenggat: {dec.deadlineAt}</span>
                  </div>
                  {dec.lockedAt && (
                    <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-semibold">
                      <CheckCircle2 size={13} />
                      <span>Dikunci resmi oleh {dec.lockedBy || 'Pelanggan'} pada {dec.lockedAt}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Change Orders History */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <FileText size={16} className="text-[#0E9F8E]" />
              <span>Riwayat Berita Acara Perubahan (Change Order)</span>
            </h4>
            {project.changeOrders.length === 0 ? (
              <p className="text-slate-500 italic">Tidak ada change order pada proyek ini.</p>
            ) : (
              <div className="space-y-2">
                {project.changeOrders.map((co) => (
                  <div key={co.id} className="p-3 rounded-xl border border-slate-200 bg-white space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-mono font-bold text-slate-800">{co.id.toUpperCase()}</span>
                      <span className="font-mono font-bold text-[#0E9F8E]">{formatIDR(co.totalCost)}</span>
                    </div>
                    <p className="text-xs text-slate-700">
                      Perubahan: <strong>{co.fromOption}</strong> → <strong>{co.toOption}</strong>
                    </p>
                    <div className="text-xs text-slate-500 pt-1 flex justify-between">
                      <span>Disetujui: {co.approvedAt}</span>
                      <span>Oleh: {co.approvedBy}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Work & Material Logs Audit */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <Clock size={16} className="text-[#0E9F8E]" />
              <span>Rekaman Jam Kerja & Bukti Material Terpakai ({project.workLogs.length + project.materialLogs.length} Entri)</span>
            </h4>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              {project.workLogs.map((w) => (
                <div key={w.id} className="flex justify-between items-center text-xs py-1 border-b border-slate-200/50 last:border-none">
                  <span>{w.loggedAt} · <strong>{w.description}</strong> ({w.hours} Jam)</span>
                  <span className="font-mono font-semibold">{formatIDR(w.hours * w.rate)}</span>
                </div>
              ))}
              {project.materialLogs.map((m) => (
                <div key={m.id} className="flex justify-between items-center text-xs py-1 border-b border-slate-200/50 last:border-none">
                  <span>{m.loggedAt} · <strong>{m.material}</strong> ({m.quantity} {m.unit})</span>
                  <span className="font-mono font-semibold">{formatIDR(m.quantity * m.unitPrice)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-100"
          >
            Tutup Berkas
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-b from-[#12508F] to-[#0B3A66] text-white shadow-md shadow-[#0B3A66]/25 hover:brightness-110 transition-colors flex items-center gap-1.5"
          >
            <Printer size={14} />
            <span>Cetak / Ekspor Paket Bukti PDF</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EvidencePackageModal;
