import React, { useState } from 'react';
import { 
  TrendingDown, 
  TrendingUp, 
  ShieldCheck, 
  Download, 
  AlertCircle, 
  BarChart3, 
  Layers, 
  FileSpreadsheet,
  CheckCircle2
} from 'lucide-react';
import { HistoricalBenchmark } from '../../types/revio';
import { HISTORICAL_BENCHMARKS } from '../../data/mockSeedData';

export const AnalyticsView: React.FC = () => {
  const [benchmarks, setBenchmarks] = useState<HistoricalBenchmark[]>(HISTORICAL_BENCHMARKS);
  const [showImportSuccess, setShowImportSuccess] = useState(false);

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  // Cumulative math
  const totalReworkHoursOld = benchmarks.reduce((acc, b) => acc + b.reworkHoursWithoutRevio, 0);
  const totalReworkHoursNew = benchmarks.reduce((acc, b) => acc + b.reworkHoursWithRevio, 0);
  const reworkReductionPct = Math.round(((totalReworkHoursOld - totalReworkHoursNew) / totalReworkHoursOld) * 100);

  const totalWasteOld = benchmarks.reduce((acc, b) => acc + b.wastedMaterialCostWithoutRevio, 0);
  const totalWasteNew = benchmarks.reduce((acc, b) => acc + b.wastedMaterialCostWithRevio, 0);
  const wasteSavedIDR = totalWasteOld - totalWasteNew;

  const totalDisputesOld = benchmarks.reduce((acc, b) => acc + b.disputesWithoutRevio, 0);
  const totalDisputesNew = benchmarks.reduce((acc, b) => acc + b.disputesWithRevio, 0);

  const handleSimulateImport = () => {
    const importedSample: HistoricalBenchmark = {
      id: `hb-${Date.now().toString().slice(-3)}`,
      projectName: 'Booth Pameran Expo Medika (Proyek Lama)',
      category: 'Dekorasi Event',
      projectValue: 52000000,
      reworkHoursWithoutRevio: 36,
      reworkHoursWithRevio: 4,
      wastedMaterialCostWithoutRevio: 7400000,
      wastedMaterialCostWithRevio: 600000,
      disputesWithoutRevio: 2,
      disputesWithRevio: 0,
      costClarityScore: 4.8,
    };
    setBenchmarks([...benchmarks, importedSample]);
    setShowImportSuccess(true);
    setTimeout(() => setShowImportSuccess(false), 2500);
  };

  const handleExportCSV = () => {
    const headers = ['Proyek', 'Kategori', 'Nilai', 'Jam Bongkar Tanpa Revio', 'Jam Bongkar Revio', 'Bahan Terbuang Lama', 'Bahan Terbuang Revio'];
    const rows = benchmarks.map((b) => [
      `"${b.projectName}"`,
      b.category,
      b.projectValue,
      b.reworkHoursWithoutRevio,
      b.reworkHoursWithRevio,
      b.wastedMaterialCostWithoutRevio,
      b.wastedMaterialCostWithRevio,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'revio_analytics_validasi_dampak.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#0E9F8E]">
            Validasi Dampak Nyata
          </span>
          <h1 className="font-display font-extrabold text-2xl text-slate-900 mt-0.5">
            Analitik Efisiensi & Transparansi Biaya
          </h1>
          <p className="text-xs text-slate-500">
            Perbandingan kerugian revisi sebelum vs sesudah menerapkan protokol Titik Kunci Revio
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulateImport}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
          >
            <FileSpreadsheet size={14} />
            <span>Impor Data Lama (CSV)</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5"
          >
            <Download size={14} />
            <span>Ekspor Laporan CSV</span>
          </button>
        </div>
      </div>

      {showImportSuccess && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>Berhasil mengimpor 1 rekaman proyek historis untuk perbandingan benchmark!</span>
        </div>
      )}

      {/* 3 Impact Hero Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Bahan Terbuang Terselamatkan</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
              <TrendingDown size={16} />
            </div>
          </div>
          <div className="font-mono text-2xl font-bold text-emerald-800 tabular-nums">
            {formatIDR(wasteSavedIDR)}
          </div>
          <p className="text-[11px] text-slate-500">
            Terbebas dari kerugian potongan kayu, plat cetak, & kain yang terbuang sia-sia.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Reduksi Jam Bongkar Ulang</span>
            <div className="p-1.5 rounded-lg bg-teal-50 text-[#0E9F8E]">
              <TrendingDown size={16} />
            </div>
          </div>
          <div className="font-mono text-2xl font-bold text-[#0E9F8E] tabular-nums">
            -{reworkReductionPct}% ({totalReworkHoursOld - totalReworkHoursNew} Jam Hemat)
          </div>
          <p className="text-[11px] text-slate-500">
            Tukang tidak lagi membongkar hasil rakitan akibat klien berubah pikiran terlambat.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Sengketa Revisi Sepihak</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
              <ShieldCheck size={16} />
            </div>
          </div>
          <div className="font-mono text-2xl font-bold text-slate-900 tabular-nums">
            {totalDisputesNew} Kasus (Sebelumnya {totalDisputesOld})
          </div>
          <p className="text-[11px] text-slate-500">
            Paket bukti transparan mengeliminasi perdebatan nominal saat penagihan akhir.
          </p>
        </div>
      </div>

      {/* Benchmark Comparison Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-base text-slate-900">
              Tabel Komparasi Proyek Sejenis (Sebelum vs Bersama Revio)
            </h3>
            <p className="text-xs text-slate-500">
              Data historis nyata dari pengrajin mebel, percetakan khusus, dan dekorator panggung
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">Nama Proyek</th>
                <th className="p-3">Kategori</th>
                <th className="p-3 text-right">Nilai Kontrak</th>
                <th className="p-3 text-right">Jam Bongkar (Lama)</th>
                <th className="p-3 text-right">Jam Bongkar (Revio)</th>
                <th className="p-3 text-right">Bahan Terbuang (Lama)</th>
                <th className="p-3 text-right">Bahan Terbuang (Revio)</th>
                <th className="p-3 text-center">Kejelasan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {benchmarks.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-3 font-semibold text-slate-800">{b.projectName}</td>
                  <td className="p-3 text-slate-500">{b.category}</td>
                  <td className="p-3 text-right font-mono tabular-nums text-slate-800">
                    {formatIDR(b.projectValue)}
                  </td>
                  <td className="p-3 text-right font-mono tabular-nums text-rose-600 font-medium">
                    {b.reworkHoursWithoutRevio} jam
                  </td>
                  <td className="p-3 text-right font-mono tabular-nums text-emerald-700 font-bold">
                    {b.reworkHoursWithRevio} jam
                  </td>
                  <td className="p-3 text-right font-mono tabular-nums text-rose-600 font-medium">
                    {formatIDR(b.wastedMaterialCostWithoutRevio)}
                  </td>
                  <td className="p-3 text-right font-mono tabular-nums text-emerald-700 font-bold">
                    {formatIDR(b.wastedMaterialCostWithRevio)}
                  </td>
                  <td className="p-3 text-center">
                    <span className="font-mono font-bold text-slate-800 bg-teal-50 text-[#0E9F8E] px-2 py-0.5 rounded">
                      ★ {b.costClarityScore}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transparency Safety Audit Notice */}
      <div className="bg-amber-50/70 border border-amber-200/60 rounded-2xl p-5 text-xs text-amber-950 space-y-2">
        <div className="flex items-center gap-2 font-bold">
          <AlertCircle size={16} className="text-amber-700" />
          <span>Laporan Pengawasan Transparansi Biaya Platform</span>
        </div>
        <p className="leading-relaxed text-amber-900 text-[11px]">
          Revio mengaudit seluruh tarif per jam dan harga bahan setiap vendor terhadap rata-rata industri regional. Setiap perubahan yang melebihi ambang batas wajar (+15% dari median) secara otomatis memerlukan tinjauan pemilik vendor dan konfirmasi ganda pelanggan.
        </p>
      </div>
    </div>
  );
};

export default AnalyticsView;
