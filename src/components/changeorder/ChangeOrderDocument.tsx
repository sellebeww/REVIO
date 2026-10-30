import React from 'react';
import { Printer, CheckCircle, FileText, Download, ShieldCheck } from 'lucide-react';
import { ChangeOrder, Project } from '../../types/revio';
import RevioLogo from '../brand/RevioLogo';

interface ChangeOrderDocumentProps {
  changeOrder: ChangeOrder;
  project: Project;
  onClose?: () => void;
}

export const ChangeOrderDocument: React.FC<ChangeOrderDocumentProps> = ({
  changeOrder,
  project,
  onClose,
}) => {
  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 max-w-2xl mx-auto shadow-sm print:border-none print:shadow-none">
      {/* Header bar with Revio & Vendor */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <RevioLogo size="sm" layout="horizontal" showTagline />
          <p className="text-[11px] text-slate-500 mt-1">
            Dokumen Berita Acara Perubahan Kerja (Change Order)
          </p>
        </div>
        <div className="text-left sm:text-right">
          <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded">
            NO: {changeOrder.id.toUpperCase()}
          </span>
          <div className="text-[11px] text-slate-500 mt-1">
            Vendor: <strong>{project.vendorName}</strong>
          </div>
        </div>
      </div>

      {/* Project & Client summary */}
      <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200/60">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400">Proyek</span>
          <p className="font-semibold text-slate-900">{project.title}</p>
          <p className="text-slate-500">Nilai Kontrak: {formatIDR(project.valueAmount)}</p>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400">Pelanggan</span>
          <p className="font-semibold text-slate-900">{project.customerName}</p>
          <p className="text-slate-500">{project.customerPhone}</p>
        </div>
      </div>

      {/* Decision Delta */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
          Uraian Perubahan Keputusan
        </h4>
        <div className="p-3.5 rounded-xl border border-slate-200 grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 font-medium">Sebelum (Semula):</span>
            <p className="font-semibold text-slate-700 line-through">{changeOrder.fromOption}</p>
          </div>
          <div>
            <span className="text-[10px] text-[#0E9F8E] font-medium">Menjadi (Disetujui):</span>
            <p className="font-bold text-slate-900">{changeOrder.toOption}</p>
          </div>
        </div>
      </div>

      {/* Itemized Calculation Table */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
          Rincian Beban Biaya & Dampak Jadwal
        </h4>
        <table className="w-full text-xs text-left border border-slate-200 rounded-xl overflow-hidden">
          <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
            <tr>
              <th className="p-2.5">Komponen Perhitungan</th>
              <th className="p-2.5 text-right">Nilai / Durasi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="p-2.5 text-slate-700">
                Jam kerja terdampak & bongkar ulang ({changeOrder.affectedWorkHours} Jam)
              </td>
              <td className="p-2.5 text-right font-mono tabular-nums text-slate-900">
                {formatIDR(changeOrder.affectedWorkCost)}
              </td>
            </tr>
            <tr>
              <td className="p-2.5 text-slate-700">Bahan terpakai tidak dapat digunakan ulang</td>
              <td className="p-2.5 text-right font-mono tabular-nums text-slate-900">
                {formatIDR(changeOrder.wastedMaterialValue)}
              </td>
            </tr>
            <tr>
              <td className="p-2.5 text-emerald-700">
                Deduksi nilai pakai ulang sisa potongan bahan (Salvage value)
              </td>
              <td className="p-2.5 text-right font-mono tabular-nums text-emerald-700">
                -{formatIDR(changeOrder.reuseDeduction)}
              </td>
            </tr>
            <tr>
              <td className="p-2.5 text-slate-700">Biaya slot penjadwalan & kalibrasi ulang</td>
              <td className="p-2.5 text-right font-mono tabular-nums text-slate-900">
                {formatIDR(changeOrder.rescheduleFee)}
              </td>
            </tr>
            <tr className="bg-slate-50 font-bold">
              <td className="p-3 text-slate-900">Total Tambahan Biaya Perubahan:</td>
              <td className="p-3 text-right font-mono text-sm text-[#0E9F8E] tabular-nums">
                {formatIDR(changeOrder.totalCost)}
              </td>
            </tr>
            <tr className="bg-slate-50 text-[11px] text-slate-600">
              <td className="p-2.5">Penyesuaian Jadwal Selesai:</td>
              <td className="p-2.5 text-right font-medium">
                Bertambah +{changeOrder.scheduleImpactDays} Hari Kerja
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Digital Signature & Verification */}
      <div className="pt-4 border-t border-slate-200 grid grid-cols-2 gap-4 text-xs">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
          <span className="text-[10px] text-slate-400 font-medium">Pihak Pembuat</span>
          <p className="font-semibold text-slate-800">{project.vendorName}</p>
          <div className="flex items-center gap-1 text-[11px] text-emerald-700 mt-1">
            <CheckCircle size={13} />
            <span>Terverifikasi Sistem</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-teal-50 border border-teal-200">
          <span className="text-[10px] text-teal-700 font-medium">Pihak Pelanggan</span>
          <p className="font-semibold text-slate-900">{changeOrder.approvedBy || project.customerName}</p>
          <div className="flex items-center gap-1 text-[11px] text-[#0E9F8E] mt-1">
            <ShieldCheck size={13} />
            <span>Disetujui: {changeOrder.approvedAt || 'Tervalidasi'}</span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100 print:hidden">
        {onClose && (
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Tutup Pratinjau
          </button>
        )}
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
          >
            <Printer size={14} />
            <span>Cetak Dokumen</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeOrderDocument;
