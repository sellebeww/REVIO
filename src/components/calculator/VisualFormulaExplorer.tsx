import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calculator, 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles, 
  Layers, 
  RotateCcw,
  Sliders,
  DollarSign,
  Wrench,
  Package,
  Calendar
} from 'lucide-react';
import { playSliderTick } from '../../lib/soundEffects';

interface Preset {
  name: string;
  category: string;
  projectValue: number;
  hours: number;
  rate: number;
  materialCost: number;
  reusePct: number;
  rescheduleFee: number;
}

const PRESETS: Preset[] = [
  {
    name: 'Warna Finishing Kayu Jati (Meja Makan)',
    category: 'Furnitur Kayu',
    projectValue: 32500000,
    hours: 18,
    rate: 85000,
    materialCost: 650000,
    reusePct: 30,
    rescheduleFee: 200000,
  },
  {
    name: 'Naskah Final Setelah Plat CTP (Buku Tahunan)',
    category: 'Percetakan Khusus',
    projectValue: 28500000,
    hours: 14,
    rate: 110000,
    materialCost: 3500000,
    reusePct: 0,
    rescheduleFee: 500000,
  },
  {
    name: 'Ganti Warna Tirai Velvet (Dekorasi Panggung)',
    category: 'Dekorasi Event',
    projectValue: 42000000,
    hours: 12,
    rate: 75000,
    materialCost: 2100000,
    reusePct: 35,
    rescheduleFee: 185000,
  },
  {
    name: 'Peralihan Top Table Solid Surface ke Granit',
    category: 'Kitchen Set',
    projectValue: 56000000,
    hours: 16,
    rate: 95000,
    materialCost: 4800000,
    reusePct: 15,
    rescheduleFee: 400000,
  },
];

export const VisualFormulaExplorer: React.FC = () => {
  const [activePreset, setActivePreset] = useState<Preset>(PRESETS[0]);
  const [hours, setHours] = useState(activePreset.hours);
  const [rate, setRate] = useState(activePreset.rate);
  const [materialCost, setMaterialCost] = useState(activePreset.materialCost);
  const [reusePct, setReusePct] = useState(activePreset.reusePct);
  const [rescheduleFee, setRescheduleFee] = useState(activePreset.rescheduleFee);
  const [projectValue, setProjectValue] = useState(activePreset.projectValue);

  const selectPreset = (p: Preset) => {
    setActivePreset(p);
    setHours(p.hours);
    setRate(p.rate);
    setMaterialCost(p.materialCost);
    setReusePct(p.reusePct);
    setRescheduleFee(p.rescheduleFee);
    setProjectValue(p.projectValue);
  };

  // Math components
  const workCost = hours * rate;
  const salvageValue = Math.round((materialCost * reusePct) / 100);
  const netMaterialCost = materialCost - salvageValue;
  const totalChangeCost = workCost + netMaterialCost + rescheduleFee;

  // Percentage of project value
  const impactPct = ((totalChangeCost / projectValue) * 100).toFixed(1);
  const isHighImpact = Number(impactPct) > 15;

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#0E9F8E] bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
            Kalkulator Rumus & Biaya Adil
          </span>
          <h2 className="font-display font-extrabold text-xl text-slate-900 mt-1">
            Eksplorasi Transparansi Rumus Revio
          </h2>
          <p className="text-xs text-slate-500">
            Ketahui persis bagaimana setiap rupiah biaya perubahan dihitung dari data jam dan bahan nyata.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-slate-400 mr-1">Studi Kasus:</span>
          {PRESETS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => selectPreset(p)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                activePreset.name === p.name
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {p.name.split(' ')[0]} {p.name.split(' ')[1]}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Dynamic Formula Ribbon */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-[#12203A] text-white space-y-3 shadow-md">
        <div className="text-xs text-teal-300 font-mono font-semibold flex items-center gap-1.5">
          <Sparkles size={13} className="text-amber-400" />
          <span>Formula Matematis Terverifikasi:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/30">
            Jam ({hours}j) × Tarif ({formatIDR(rate)})
          </span>
          <span className="text-slate-400 font-bold">+</span>
          <span className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30">
            Bahan ({formatIDR(materialCost)})
          </span>
          <span className="text-slate-400 font-bold">-</span>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Daur Ulang ({reusePct}% = {formatIDR(salvageValue)})
          </span>
          <span className="text-slate-400 font-bold">+</span>
          <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30">
            Slot Jadwal ({formatIDR(rescheduleFee)})
          </span>
          <span className="text-slate-400 font-bold">=</span>
          <span className="px-3 py-1 rounded-lg bg-[#0E9F8E] text-white font-bold text-sm shadow-xs">
            {formatIDR(totalChangeCost)}
          </span>
        </div>

        {/* Stacked Visual Bar Representation */}
        <div className="space-y-1 pt-1">
          <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden flex p-0.5 gap-0.5">
            <motion.div
              style={{ width: `${Math.max(5, (workCost / totalChangeCost) * 100)}%` }}
              className="bg-teal-400 h-full rounded-sm"
              title="Biaya Jam Kerja"
            />
            <motion.div
              style={{ width: `${Math.max(5, (netMaterialCost / totalChangeCost) * 100)}%` }}
              className="bg-rose-400 h-full rounded-sm"
              title="Bahan Terbuang Bersih"
            />
            <motion.div
              style={{ width: `${Math.max(5, (rescheduleFee / totalChangeCost) * 100)}%` }}
              className="bg-amber-400 h-full rounded-sm"
              title="Biaya Penjadwalan"
            />
          </div>
          <div className="flex justify-between text-xs text-slate-400 px-1">
            <span className="text-teal-300">● Jam Tukang ({Math.round((workCost / totalChangeCost) * 100)}%)</span>
            <span className="text-rose-300">● Bahan Bersih ({Math.round((netMaterialCost / totalChangeCost) * 100)}%)</span>
            <span className="text-amber-300">● Slot Jadwal ({Math.round((rescheduleFee / totalChangeCost) * 100)}%)</span>
          </div>
        </div>
      </div>

      {/* Interactive Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Work Hours Slider */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <Wrench size={14} className="text-[#0E9F8E]" />
              Jam Kerja Pembongkaran Ulang
            </span>
            <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
              {hours} Jam ({formatIDR(workCost)})
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="40"
            value={hours}
            onChange={(e) => {
              setHours(Number(e.target.value));
              playSliderTick();
            }}
            className="w-full accent-[#0E9F8E] cursor-pointer"
          />
          <div className="flex justify-between text-xs text-slate-400">
            <span>0 Jam (Ringan)</span>
            <span>Tarif: {formatIDR(rate)}/jam</span>
            <span>40 Jam (Bongkar Total)</span>
          </div>
        </div>

        {/* Material Cost Slider */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <Package size={14} className="text-[#0E9F8E]" />
              Nilai Material Terlanjur Dipakai
            </span>
            <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
              {formatIDR(materialCost)}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="8000000"
            step="100000"
            value={materialCost}
            onChange={(e) => {
              setMaterialCost(Number(e.target.value));
              playSliderTick();
            }}
            className="w-full accent-[#0E9F8E] cursor-pointer"
          />
          <div className="flex justify-between text-xs text-slate-400">
            <span>Rp 0</span>
            <span>Kayu / Kertas / Kain / Granit</span>
            <span>Rp 8.000.000</span>
          </div>
        </div>

        {/* Salvage / Reuse Percentage Slider */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-emerald-800 flex items-center gap-1.5">
              <RotateCcw size={14} className="text-emerald-600" />
              Persentase Bahan Dapat Dipakai Ulang (Deduksi Klien)
            </span>
            <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {reusePct}% (-{formatIDR(salvageValue)})
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={reusePct}
            onChange={(e) => {
              setReusePct(Number(e.target.value));
              playSliderTick();
            }}
            className="w-full accent-emerald-600 cursor-pointer"
          />
          <div className="flex justify-between text-xs text-slate-400">
            <span>0% (Terbuang Mutlak)</span>
            <span>Potongan kayu kecil / sisa kain</span>
            <span>100% (Dapat Dipakai Kembali)</span>
          </div>
        </div>

        {/* Rescheduling Overhead Slider */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <Calendar size={14} className="text-amber-600" />
              Biaya Slot & Kalibrasi Penjadwalan
            </span>
            <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
              {formatIDR(rescheduleFee)}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1000000"
            step="50000"
            value={rescheduleFee}
            onChange={(e) => {
              setRescheduleFee(Number(e.target.value));
              playSliderTick();
            }}
            className="w-full accent-amber-500 cursor-pointer"
          />
          <div className="flex justify-between text-xs text-slate-400">
            <span>Rp 0 (Jadwal Fleksibel)</span>
            <span>Kompensasi antrean bengkel</span>
            <span>Rp 1.000.000</span>
          </div>
        </div>
      </div>

      {/* Anti-Markup Safety Check & Summary */}
      <div className="p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/80 border-slate-200">
        <div className="flex items-center gap-3">
          <div
            className={`p-2.5 rounded-2xl ${
              isHighImpact ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
            }`}
          >
            {isHighImpact ? <AlertTriangle size={22} /> : <ShieldCheck size={22} />}
          </div>
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-slate-900">
              Dampak Terhadap Nilai Kontrak Proyek: {impactPct}%
            </span>
            <p className="text-xs text-slate-500">
              {isHighImpact
                ? 'Peringatan: Biaya perubahan di atas 15% proyek, memicu audit otomatis dan persetujuan ganda pemilik bengkel.'
                : 'Aman: Biaya berada dalam rentang wajar dan bersumber dari catatan nyata.'}
            </p>
          </div>
        </div>

        <div className="text-left sm:text-right shrink-0">
          <span className="text-xs uppercase font-bold text-slate-400 block">Total Akhir Biaya Revisi</span>
          <span className="font-mono text-2xl font-extrabold text-[#0E9F8E] tabular-nums">
            {formatIDR(totalChangeCost)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default VisualFormulaExplorer;
