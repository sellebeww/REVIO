import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  ArrowRight, 
  Check, 
  Layers, 
  Clock, 
  Lock, 
  Calculator, 
  FileText, 
  Star, 
  Users, 
  Sparkles,
  ChevronRight,
  TrendingUp,
  MessageSquare,
  HelpCircle,
  Building2,
  CheckCircle2,
  Play
} from 'lucide-react';
import RevioLogo from '../brand/RevioLogo';
import { VendorProfile } from '../../types/revio';
import FlexibilityBar from '../motion/FlexibilityBar';
import LivingLock from '../motion/LivingLock';
import HoldToLock from '../motion/HoldToLock';
import CountUpNumber from '../motion/CountUpNumber';
import RevisionWindowVisualizer from '../motion/RevisionWindowVisualizer';

interface RevioCompanyProfileProps {
  vendors: VendorProfile[];
  onOpenVendorProfile: (slug: string) => void;
  onOpenAppDemo: () => void;
  onOpenCustomerSpace: (projectId: string) => void;
}

export const RevioCompanyProfile: React.FC<RevioCompanyProfileProps> = ({
  vendors,
  onOpenVendorProfile,
  onOpenAppDemo,
  onOpenCustomerSpace,
}) => {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('annual');
  const [selectedIndustry, setSelectedIndustry] = useState<'furnitur' | 'percetakan' | 'dekorasi'>('furnitur');
  const [demoLocked, setDemoLocked] = useState(false);
  const [sliderScore, setSliderScore] = useState(65);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [demoEmail, setDemoEmail] = useState('');
  const [demoSubmitted, setDemoSubmitted] = useState(false);

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const industries = {
    furnitur: {
      title: 'Pembuat Mebel & Interior Kustom',
      expensivePoint: 'Pewarnaan Wood Stain & Topcoat Melamik',
      why: 'Begitu stain meresap ke serat pori-pori kayu jati, revisi warna menuntut 18 jam pengerokan manual dan mengurangi ketebalan kayu.',
      exampleCost: 'Rp 450.000 vs Rp 3.200.000 jika terlambat',
    },
    percetakan: {
      title: 'Percetakan Khusus & Buku Hardcover',
      expensivePoint: 'Ekspos Plat CTP Termal & Pemotongan Plano',
      why: 'Plat aluminium CTP sekali pakai tidak bisa diedit. Ralat 1 huruf mewajibkan pembakaran plat baru dan kertas terbuang.',
      exampleCost: 'Rp 0 (Proofing) vs Rp 4.850.000 (Setelah CTP)',
    },
    dekorasi: {
      title: 'Dekorasi Panggung & Tata Acara',
      expensivePoint: 'Pemotongan & Jahit Panel Kain Tirai',
      why: 'Kain backdrop velvet selebar 18 meter yang sudah dipotong miring tidak bisa disambung tanpa sambungan terlihat lampu.',
      exampleCost: 'Rp 200.000 vs Rp 2.450.000 jika kain terbuang',
    },
  };

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDemoSubmitted(true);
    setTimeout(() => {
      setShowDemoModal(false);
      setDemoSubmitted(false);
      setDemoEmail('');
    }, 2000);
  };

  return (
    <div className="space-y-24 pb-20 overflow-hidden">
      {/* 1. Hero Section */}
      <section className="relative pt-6 sm:pt-12 pb-16">
        {/* Soft atmospheric gradient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[520px] bg-gradient-to-b from-[#0E9F8E]/10 via-[#FFB020]/5 to-transparent blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-6 px-4">
          {/* Logo showcase */}
          <div className="inline-flex flex-col items-center justify-center space-y-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="p-1 select-none"
            >
              <RevioLogo size="xl" showTagline={false} />
            </motion.div>
            <span className="text-xs font-semibold tracking-wide text-[#0E9F8E] uppercase bg-teal-50 px-3.5 py-1.5 rounded-full border border-teal-200/80 shadow-xs">
              Platform Transparansi Hak Revisi & Biaya Produksi Pesanan
            </span>
          </div>

          <h1 className="font-display font-extrabold text-3xl sm:text-5xl md:text-6xl text-slate-900 tracking-tight max-w-4xl mx-auto leading-[1.15]">
            Tahu Kapan Keputusan Harus Dikunci,{' '}
            <span className="text-[#0E9F8E]">Bebas Sengketa Biaya</span> Saat Ditunda.
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Revio menghubungkan hak revisi pelanggan dengan tahapan produksi nyata bengkel. Pelanggan punya kendali penuh, vendor terlindungi dari jam kerja dan bahan yang terbuang sia-sia.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onOpenAppDemo}
              className="px-6 py-3.5 rounded-2xl bg-[#0E9F8E] hover:bg-[#0A7A6D] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              <span>Buka Dasbor Vendor</span>
              <ArrowRight size={16} />
            </button>

            <button
              onClick={() => onOpenCustomerSpace('proj-1')}
              className="px-6 py-3.5 rounded-2xl bg-white border border-slate-300 hover:border-slate-400 text-slate-800 font-bold text-sm shadow-xs transition-all flex items-center gap-2"
            >
              <span>Simulasi Ruang Pelanggan</span>
              <Play size={14} className="text-[#0E9F8E]" />
            </button>
          </div>

          {/* Social Proof Strip */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-slate-500 text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-[#0E9F8E]" />
              <span>Lencana Kepastian Terverifikasi</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-[#0E9F8E]" />
              <span>Sesuai Standar UU PDP Indonesia</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-[#0E9F8E]" />
              <span>Pengingat Otomatis 24 Jam</span>
            </div>
          </div>
        </div>

        {/* Elegant Integrated Interactive Decision Mockup Card */}
        <div id="fitur" className="max-w-4xl mx-auto mt-12 px-4">
          <div className="rounded-3xl border border-slate-200 bg-white shadow-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
            {/* Top window chrome */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full bg-rose-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="text-xs text-slate-400 font-mono ml-2">
                  revio.id/project/meja-makan-jati-solid
                </span>
              </div>
              <span className="text-xs font-semibold text-[#0E9F8E] bg-teal-50 px-2.5 py-1 rounded-lg">
                Simulasi Interaktif Keputusan
              </span>
            </div>

            {/* Micro demo of Decision Card with Hold to lock and live flexibility bar */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase text-slate-400">Keputusan Penting</span>
                    <LivingLock status={demoLocked ? 'terkunci' : 'mendekati_kunci'} size="sm" showLabel />
                  </div>
                  <h3 className="font-display font-bold text-lg text-slate-900 mt-1">
                    Warna Finishing Melamik Kayu Jati
                  </h3>
                  <p className="text-xs text-slate-500">
                    Pilihan warna stain sebelum lapisan bening (clear coat) disemprot di bengkel.
                  </p>
                </div>

                <div className="text-left sm:text-right p-3 rounded-xl bg-slate-50 border border-slate-200/80 shrink-0">
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">Biaya Perubahan Saat Ini</span>
                  <span className="font-mono text-lg font-bold text-slate-900">
                    {demoLocked ? 'Rp 0 (Terkunci Permanen)' : 'Rp 450.000'}
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    {demoLocked ? 'Tahap berikutnya terbuka' : 'Berdasarkan jam amplas nyata'}
                  </span>
                </div>
              </div>

              {/* Dynamic Flexibility Bar with Slider */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                <FlexibilityBar score={demoLocked ? 0 : sliderScore} size="md" />
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 gap-2 pt-1">
                  <span className="text-[11px] text-slate-500">
                    Geser untuk mensimulasikan kemajuan tahap produksi:
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="5"
                      max="100"
                      disabled={demoLocked}
                      value={sliderScore}
                      onChange={(e) => setSliderScore(Number(e.target.value))}
                      className="accent-[#0E9F8E] cursor-pointer w-44"
                    />
                    <span className="font-mono text-xs font-bold text-slate-800 tabular-nums">
                      {demoLocked ? '0%' : `${sliderScore}%`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action: Hold to lock */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100">
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-slate-800 block">
                    {demoLocked ? 'Keputusan Telah Terkunci' : 'Coba Interaksi "Tahan untuk Mengunci"'}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {demoLocked
                      ? 'Pilihan warna terkunci aman tanpa risiko revisi sepihak.'
                      : 'Tekan dan tahan tombol selama 1 detik penuh untuk mengonfirmasi.'}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <HoldToLock
                    onLocked={() => setDemoLocked(true)}
                    isAlreadyLocked={demoLocked}
                    decisionTitle="Warna Finishing"
                  />

                  {demoLocked && (
                    <button
                      onClick={() => setDemoLocked(false)}
                      className="text-xs text-[#0E9F8E] hover:underline font-semibold"
                    >
                      Buka Kunci Kembali (Reset)
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Impact Stats Count-Up */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 sm:p-8 rounded-3xl bg-slate-900 text-white shadow-xl">
          <div className="space-y-1">
            <span className="text-slate-400 text-xs font-medium">Bahan Terselamatkan</span>
            <div className="font-mono text-2xl sm:text-3xl font-bold text-emerald-400 tabular-nums">
              Rp <CountUpNumber end={420} suffix=" Juta+" />
            </div>
            <p className="text-[11px] text-slate-400">Dari pemotongan tanpa konfirmasi</p>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 text-xs font-medium">Reduksi Jam Rework</span>
            <div className="font-mono text-2xl sm:text-3xl font-bold text-teal-300 tabular-nums">
              -<CountUpNumber end={88} suffix="% Jam Kerja" />
            </div>
            <p className="text-[11px] text-slate-400">Tukang fokus membuat produk baru</p>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 text-xs font-medium">Sengketa Biaya Sepihak</span>
            <div className="font-mono text-2xl sm:text-3xl font-bold text-amber-300 tabular-nums">
              <CountUpNumber end={0} suffix=" Kasus" />
            </div>
            <p className="text-[11px] text-slate-400">Bukti jam & bahan terverifikasi</p>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 text-xs font-medium">Skor Kejelasan Pelanggan</span>
            <div className="font-mono text-2xl sm:text-3xl font-bold text-white tabular-nums">
              <CountUpNumber end={4.9} decimals={1} suffix=" / 5.0" />
            </div>
            <p className="text-[11px] text-slate-400">Survei pascaproyek seluruh klien</p>
          </div>
        </div>
      </section>

      {/* 3. Cara Kerja (Cerita Alur Produksi & Revisi) */}
      <section id="cara-kerja" className="max-w-5xl mx-auto px-4 space-y-10">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0E9F8E]">
            Alur Terstruktur
          </span>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
            Bagaimana Revio Menghilangkan Sengketa Revisi
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Empat langkah sederhana dari pemetaan awal hingga serah terima tanpa selisih tagihan
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {
              step: '01',
              title: 'Pemetaan Titik Kunci',
              desc: 'Vendor menandai keputusan krusial dan tahap mana yang membuatnya mahal jika diubah.',
              icon: Layers,
            },
            {
              step: '02',
              title: 'Pantau Tahap & Bukti',
              desc: 'Staf mengunggah foto progres, jam tukang, dan pemakaian bahan nyata setiap hari.',
              icon: Clock,
            },
            {
              step: '03',
              title: 'Kunci atau Tunda',
              desc: 'Pelanggan menekan "Tahan untuk Kunci" atau memilih tunda dengan biaya fleksibilitas terbuka.',
              icon: Lock,
            },
            {
              step: '04',
              title: 'Change Order Adil',
              desc: 'Jika ada perubahan, biaya dihitung murni dari jam dan bahan terdampak, disetujui digital.',
              icon: ShieldCheck,
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 relative hover:border-[#0E9F8E] transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xl font-bold text-slate-300">
                  {item.step}
                </span>
                <div className="p-2 rounded-xl bg-teal-50 text-[#0E9F8E]">
                  <item.icon size={18} />
                </div>
              </div>
              <h3 className="font-display font-bold text-sm text-slate-900">
                {item.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Integrated Revision Window Visualizer as part of the process story */}
        <div className="pt-2">
          <RevisionWindowVisualizer initialProgress={35} />
        </div>
      </section>

      {/* 4. Industri Spesifik (Tabs) */}
      <section className="max-w-5xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0E9F8E]">
            Untuk Berbagai Bidang
          </span>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
            Dirancang Khusus untuk Produksi Pesanan Kustom
          </h2>
        </div>

        <div className="flex justify-center gap-2 border-b border-slate-200 pb-2">
          {(['furnitur', 'percetakan', 'dekorasi'] as const).map((ind) => (
            <button
              key={ind}
              onClick={() => setSelectedIndustry(ind)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                selectedIndustry === ind
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {ind}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold text-[#0E9F8E] uppercase tracking-wider">
              Kasus Industri: {industries[selectedIndustry].title}
            </span>
            <h3 className="font-display font-bold text-xl text-slate-900">
              Titik Kunci: {industries[selectedIndustry].expensivePoint}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {industries[selectedIndustry].why}
            </p>
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 font-semibold">
              Perbandingan Biaya Revisi: {industries[selectedIndustry].exampleCost}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400">
              Contoh Proyek Terdaftar di Revio
            </span>
            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-white border border-slate-200 flex justify-between items-center">
                <span className="font-semibold text-slate-800">Bengkel Kayu Nusantara (Jepara)</span>
                <span className="text-[#0E9F8E] font-bold">Lencana Platinum</span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200 flex justify-between items-center">
                <span className="font-semibold text-slate-800">Cetak Prima Grafika (Bandung)</span>
                <span className="text-[#0E9F8E] font-bold">Lencana Gold</span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200 flex justify-between items-center">
                <span className="font-semibold text-slate-800">Kreasi Panggung Lestari (Surabaya)</span>
                <span className="text-[#0E9F8E] font-bold">Lencana Gold</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Direktori Vendor Terverifikasi */}
      <section id="vendor" className="max-w-6xl mx-auto px-4 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#0E9F8E]">
              Direktori Publik
            </span>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 mt-1">
              Vendor Mitra Terverifikasi Revio
            </h2>
            <p className="text-xs text-slate-500">
              Pilih pengrajin dan vendor yang menjamin keterbukaan hak revisi Anda
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {vendors.map((v) => (
            <div
              key={v.id}
              onClick={() => onOpenVendorProfile(v.slug)}
              className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 hover:border-[#0E9F8E] hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#0E9F8E] bg-teal-50 px-2.5 py-1 rounded-lg">
                    {v.category}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <ShieldCheck size={13} className="text-emerald-600" />
                    {v.certifiedBadgeLevel.toUpperCase()}
                  </span>
                </div>

                <h3 className="font-display font-bold text-lg text-slate-900">
                  {v.name}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2">
                  {v.tagline}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-3 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Kota:</span>
                  <span className="font-semibold text-slate-800">{v.city}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Skor Transparansi:</span>
                  <span className="font-mono font-bold text-[#0E9F8E]">{v.transparencyScore}%</span>
                </div>
                <div className="pt-2 text-right">
                  <span className="text-xs font-bold text-[#0E9F8E] inline-flex items-center gap-1">
                    Lihat Profil & Portofolio <ChevronRight size={14} />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Pricing Plans */}
      <section id="harga" className="max-w-5xl mx-auto px-4 space-y-10">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0E9F8E]">
            Pilihan Paket Berlangganan
          </span>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
            Investasi Murah untuk Menyelamatkan Bahan & Waktu
          </h2>

          {/* Monthly / Annual Toggle */}
          <div className="inline-flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-4 py-1.5 rounded-lg transition-colors ${
                billingPeriod === 'monthly' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Bulanan
            </button>
            <button
              onClick={() => setBillingPeriod('annual')}
              className={`px-4 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                billingPeriod === 'annual' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              <span>Tahunan</span>
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.2 rounded">
                Hemat 20%
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Plan 1 */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-bold text-slate-400 uppercase">Paket Mulai</span>
              <h3 className="font-display font-bold text-xl text-slate-900">Mulai</h3>
              <div className="font-mono text-3xl font-bold text-slate-900">
                Gratis
              </div>
              <p className="text-xs text-slate-500">
                Cocok untuk bengkel mandiri yang ingin mencoba transparansi revisi.
              </p>
              <ul className="text-xs text-slate-600 space-y-2.5 pt-4 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-[#0E9F8E]" />
                  <span>Hingga 5 Proyek Aktif</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-[#0E9F8E]" />
                  <span>Peta Keputusan & Hold-to-Lock</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-[#0E9F8E]" />
                  <span>Kalkulator Fleksibilitas Standar</span>
                </li>
              </ul>
            </div>
            <button
              onClick={onOpenAppDemo}
              className="w-full py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
            >
              Coba Sekarang
            </button>
          </div>

          {/* Plan 2: Flagship Tumbuh */}
          <div className="bg-slate-900 text-white rounded-3xl border-2 border-[#0E9F8E] p-6 space-y-6 flex flex-col justify-between relative shadow-xl">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0E9F8E] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Paling Populer
            </span>
            <div className="space-y-4">
              <span className="text-xs font-bold text-teal-400 uppercase">Paket Tumbuh</span>
              <h3 className="font-display font-bold text-xl text-white">Tumbuh</h3>
              <div className="font-mono text-3xl font-bold text-white">
                {billingPeriod === 'annual' ? 'Rp 239.000' : 'Rp 299.000'}
                <span className="text-xs text-slate-400 font-normal"> /bulan</span>
              </div>
              <p className="text-xs text-slate-300">
                Untuk workshop dan vendor percetakan dengan volume pesanan rutin.
              </p>
              <ul className="text-xs text-slate-300 space-y-2.5 pt-4 border-t border-slate-800">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-400" />
                  <span>Proyek Aktif Tanpa Batas</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-400" />
                  <span>Profil Perusahaan Publik (revio.id/v/...)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-400" />
                  <span>Lencana Kepastian & Audit Transparansi</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-400" />
                  <span>Analitik Validasi Kerugian & Ekspor CSV</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => setShowDemoModal(true)}
              className="w-full py-2.5 rounded-xl bg-[#0E9F8E] hover:bg-[#0A7A6D] text-white font-bold text-xs shadow-md transition-colors"
            >
              Pilih Paket Tumbuh
            </button>
          </div>

          {/* Plan 3 */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-bold text-slate-400 uppercase">Paket Pro</span>
              <h3 className="font-display font-bold text-xl text-slate-900">Pro & Multi-Cabang</h3>
              <div className="font-mono text-3xl font-bold text-slate-900">
                {billingPeriod === 'annual' ? 'Rp 639.000' : 'Rp 799.000'}
                <span className="text-xs text-slate-400 font-normal"> /bulan</span>
              </div>
              <p className="text-xs text-slate-500">
                Pabrikasi skala menengah, multi-bengkel, dan manajemen cabang terintegrasi.
              </p>
              <ul className="text-xs text-slate-600 space-y-2.5 pt-4 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-[#0E9F8E]" />
                  <span>Multi-Cabang & Multi-Admin</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-[#0E9F8E]" />
                  <span>Integrasi WhatsApp Notifikasi Otomatis</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-[#0E9F8E]" />
                  <span>Dukungan Tim Sukses Prioritas 24/7</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => setShowDemoModal(true)}
              className="w-full py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
            >
              Hubungi Tim Sales
            </button>
          </div>
        </div>
      </section>

      {/* 7. CTA Bottom Banner */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="rounded-3xl bg-gradient-to-r from-[#12203A] to-[#0E9F8E] text-white p-8 sm:p-12 text-center space-y-6 shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="font-display font-extrabold text-2xl sm:text-4xl">
              Hentikan Kerugian Akibat Revisi Tak Bertanggung Jawab
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              Bergabung bersama puluhan bengkel dan vendor terpercaya di Indonesia yang memegang prinsip keadilan dan transparansi biaya.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={onOpenAppDemo}
                className="px-6 py-3 rounded-2xl bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 transition-colors"
              >
                Mulai Uji Coba Gratis
              </button>
              <button
                onClick={() => setShowDemoModal(true)}
                className="px-6 py-3 rounded-2xl bg-[#0A7A6D] text-white font-bold text-xs hover:bg-[#086157] transition-colors"
              >
                Jadwalkan Konsultasi Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h4 className="font-display font-bold text-sm text-slate-900">
                Jadwalkan Demo Langsung Revio
              </h4>
              <button onClick={() => setShowDemoModal(false)} className="text-slate-400 hover:text-slate-700">
                ✕
              </button>
            </div>

            {demoSubmitted ? (
              <div className="p-4 bg-emerald-50 rounded-xl text-center text-xs text-emerald-800 space-y-1">
                <CheckCircle2 size={24} className="text-emerald-600 mx-auto" />
                <p className="font-bold">Permintaan Demo Terkirim!</p>
                <p>Tim konsultan Revio akan menghubungi via WhatsApp/Email dalam 1 jam kerja.</p>
              </div>
            ) : (
              <form onSubmit={handleDemoSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Email Bisnis atau Nomor WhatsApp Anda
                  </label>
                  <input
                    type="text"
                    value={demoEmail}
                    onChange={(e) => setDemoEmail(e.target.value)}
                    placeholder="nama@bengkelanda.id atau 0812..."
                    className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0E9F8E] focus:outline-none"
                    required
                  />
                </div>
                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowDemoModal(false)}
                    className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#0E9F8E] hover:bg-[#0A7A6D] text-white font-bold rounded-lg"
                  >
                    Kirim Permintaan Demo
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RevioCompanyProfile;
