import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight, Play, ShieldCheck, CheckCircle2, BarChart3, Lock, Clock, RefreshCw,
  Box, Wrench, Star, ChevronDown, Download, Printer, ArrowUpRight, User, Briefcase, Settings, Shield,
  Youtube, Instagram, Linkedin, TrendingDown, Menu, X, Check, FileText,
} from 'lucide-react';
import RevioLogo from '../brand/RevioLogo';
import Modal from '../ui/Modal';
import HoldToLock from '../motion/HoldToLock';
import DeferralCalculator from '../motion/DeferralCalculator';
import ChangeOrderModal from '../changeorder/ChangeOrderModal';
import ChangeOrderDocument from '../changeorder/ChangeOrderDocument';
import { SEED_PROJECTS } from '../../data/mockSeedData';
import { printDocument } from '../../lib/printDocument';

export type DemoView =
  | 'customer_space' | 'vendor_dashboard' | 'workshop_live' | 'analytics'
  | 'vendor_public_profile' | 'formula_explorer';

interface Props {
  onOpenView: (view: DemoView) => void;
}

type Dlg = null | 'start' | 'login' | 'lock' | 'defer' | 'change' | 'doc' | 'contact';

const A = '/assets/landing';

const glass =
  'bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_10px_40px_-12px_rgba(18,40,90,0.18)]';

const Pill = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-block rounded-full bg-[#DDF3EE] text-[#0A7A6D] text-[11px] font-bold px-3 py-1">
    {children}
  </span>
);

const FEATURES = [
  { Icon: Box, t: 'Tugas Dasar', d: 'Kerjakan tugas awal.' },
  { Icon: RefreshCw, t: 'Kondisi Diubah', d: 'Satu kondisi berubah (misal: bahan).' },
  { Icon: ShieldCheck, t: 'Prediksi Terkunci', d: 'Tuliskan risiko & rencana sebelum bertindak.' },
  { Icon: Wrench, t: 'Penyesuaian Mandiri', d: 'Gunakan petunjuk bertingkat.' },
  { Icon: BarChart3, t: 'Evaluasi Diri', d: 'Bandingkan prediksi dengan hasil.' },
  { Icon: Star, t: 'Penilaian & Umpan Balik', d: 'Dapatkan hasil & tindakan lanjut.' },
];

const ROLES: { view: DemoView; Icon: typeof User; t: string; d: string; c: string }[] = [
  { view: 'customer_space', Icon: User, t: 'Pelanggan', d: 'Lihat & kelola revisi', c: 'text-[#16A34A] bg-[#E3F6EA]' },
  { view: 'vendor_dashboard', Icon: Briefcase, t: 'Vendor', d: 'Kelola proyek dengan jelas', c: 'text-[#2563EB] bg-[#E4EDFE]' },
  { view: 'workshop_live', Icon: Settings, t: 'Produksi', d: 'Pantau perubahan', c: 'text-[#7C3AED] bg-[#EEE6FD]' },
  { view: 'analytics', Icon: Shield, t: 'Platform Admin', d: 'Kelola sistem', c: 'text-[#F59E0B] bg-[#FEF1D6]' },
];

const PLANS = [
  {
    name: 'Pelanggan', price: 'Gratis', note: 'untuk pemesan',
    items: ['Peta Keputusan setiap pesanan', 'Hold-to-Lock & simulasi tunda', 'Persetujuan Change Order', 'Dokumen cetak / PDF'],
    cta: 'Coba Gratis', action: 'start' as const, featured: false,
  },
  {
    name: 'Vendor', price: 'Rp 199.000', note: 'per bulan (contoh)',
    items: ['Dasbor proyek & tahap produksi', 'Profil publik bengkel', 'Log kerja & bahan terhitung otomatis', 'Paket bukti sengketa'],
    cta: 'Buka Dasbor Vendor', action: 'vendor' as const, featured: true,
  },
  {
    name: 'Platform', price: 'Hubungi kami', note: 'multi-bengkel',
    items: ['Analitik dampak revisi', 'Impor data historis & ekspor CSV', 'Log audit permanen', 'Pendampingan implementasi'],
    cta: 'Hubungi Kami', action: 'contact' as const, featured: false,
  },
];

const FAQ = [
  ['Apa itu Revio?', 'Platform yang menghubungkan hak revisi pelanggan dengan tahap produksi nyata di bengkel pesanan custom (furnitur, percetakan khusus, dekorasi panggung, konveksi), sehingga biaya perubahan jelas sebelum keputusan diambil.'],
  ['Apa itu Hold-to-Lock?', 'Tombol yang harus ditahan 1 detik untuk mengunci sebuah keputusan. Jeda ini mencegah penguncian tidak sengaja. Anda bisa mencobanya langsung di bagian Demo di atas.'],
  ['Bagaimana biaya perubahan dihitung?', 'Biaya = (jam kerja × tarif) + bahan terpakai − deduksi pakai ulang + biaya jadwal. Semua angka berasal dari catatan kerja dan bahan yang tercatat, bukan perkiraan sepihak.'],
  ['Bisakah saya menunda keputusan?', 'Bisa. Simulasi tunda menghitung tambahan biaya dan dampak hari kalender untuk setiap tahap tujuan sebelum Anda mengonfirmasi.'],
  ['Apakah data di demo ini tersimpan?', 'Belum. Demo berjalan sepenuhnya di browser dengan data contoh. Perubahan hilang saat halaman dimuat ulang dan tidak dikirim ke server.'],
  ['Siapa saja yang bisa memakai Revio?', 'Pelanggan, vendor (pemilik dan admin), staf produksi, dan admin platform. Setiap peran punya tampilan sendiri; pilih lewat tombol Masuk.'],
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei'];

// Pola QR dekoratif: tiga kotak penanda sudut + isi pseudo-acak (bukan QR yang bisa dipindai).
const qrCell = (x: number, y: number) => {
  const corner = (cx: number, cy: number) => {
    const dx = x - cx, dy = y - cy;
    if (dx < 0 || dx > 6 || dy < 0 || dy > 6) return null;
    return dx === 0 || dx === 6 || dy === 0 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4);
  };
  const c = corner(0, 0) ?? corner(14, 0) ?? corner(0, 14);
  return c ?? (x * 7 + y * 13 + x * y) % 3 === 0;
};

// Data demo diambil dari seed yang sama dengan aplikasi, supaya angka di landing = angka di app.
const demoProject = SEED_PROJECTS.find((p) => p.decisions.some((d) => d.status === 'mendekati_kunci')) ?? SEED_PROJECTS[0];
const demoDecision = demoProject.decisions.find((d) => d.status === 'mendekati_kunci') ?? demoProject.decisions[0];
const docProject = SEED_PROJECTS.find((p) => p.changeOrders.length > 0);

function Dialog({ id, title, onClose, wide, children }: {
  id: string; title: string; onClose: () => void; wide?: boolean; children: React.ReactNode;
}) {
  return (
    <Modal onClose={onClose} labelledBy={id}>
      <div className={`bg-white rounded-3xl w-full ${wide ? 'max-w-2xl' : 'max-w-md'} p-6 shadow-2xl max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-start justify-between gap-4 mb-4">
          <h2 id={id} className="text-lg font-extrabold">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Tutup dialog" className="p-1.5 rounded-lg hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </Modal>
  );
}

export default function RevioLanding({ onOpenView }: Props) {
  const [dlg, setDlg] = useState<Dlg>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [audOpen, setAudOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [locked, setLocked] = useState(false);
  const [deferred, setDeferred] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [sentTo, setSentTo] = useState('');
  const audRef = useRef<HTMLDivElement>(null);

  const close = () => setDlg(null);
  const open = (d: Dlg) => { setMenuOpen(false); setDlg(d); };
  const go = (view: DemoView) => { close(); onOpenView(view); };
  const say = (msg: string) => setToast(msg);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    if (!audOpen) return;
    const onDown = (e: MouseEvent) => { if (!audRef.current?.contains(e.target as Node)) setAudOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setAudOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, [audOpen]);

  const idr = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
  const printDoc = (el: Element, msg?: string) => { printDocument('Revio-ChangeOrder-Custom-Furniture-1234', el); if (msg) say(msg); };

  const RoleList = () => (
    <ul className="grid grid-cols-2 gap-3">
      {ROLES.map(({ view, Icon, t, d, c }) => (
        <li key={view}>
          <button type="button" onClick={() => go(view)} className="w-full rounded-2xl border border-slate-200 hover:border-[#0E9F8E] hover:bg-[#F2FBF8] p-3 text-center transition-colors">
            <span className={`mx-auto size-10 rounded-full grid place-items-center ${c}`}><Icon size={20} /></span>
            <span className="block mt-2 text-xs font-extrabold">{t}</span>
            <span className="block text-[10px] text-[#5E6678] leading-snug">{d}</span>
          </button>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="-mx-4 sm:-mx-8 -my-6 bg-gradient-to-b from-[#EEF5FF] via-white to-[#F2FBF8] text-[#12203A]">
      {/* Header */}
      <header className="relative max-w-6xl mx-auto flex items-center justify-between gap-4 px-4 sm:px-8 pt-5">
        <button type="button" aria-label="Revio, kembali ke atas" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <RevioLogo size="sm" layout="horizontal" />
        </button>
        <nav aria-label="Navigasi utama" className="hidden md:flex items-center gap-7 text-xs font-semibold">
          <a href="#fitur" className="hover:text-[#0E9F8E]">Fitur</a>
          <a href="#cara-kerja" className="hover:text-[#0E9F8E]">Cara Kerja</a>
          <div ref={audRef} className="relative">
            <button type="button" aria-expanded={audOpen} aria-haspopup="menu" onClick={() => setAudOpen((v) => !v)} className="inline-flex items-center gap-1 hover:text-[#0E9F8E]">
              Untuk Siapa <ChevronDown size={12} className={audOpen ? 'rotate-180 transition-transform' : 'transition-transform'} />
            </button>
            {audOpen && (
              <ul role="menu" className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-52 rounded-2xl bg-white shadow-xl border border-slate-100 p-1.5 z-20">
                {ROLES.map(({ view, Icon, t, d }) => (
                  <li key={view} role="none">
                    <button type="button" role="menuitem" onClick={() => { setAudOpen(false); onOpenView(view); }} className="w-full flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-left hover:bg-slate-50">
                      <Icon size={16} className="text-[#0E9F8E] shrink-0" />
                      <span><b className="block text-xs">{t}</b><span className="text-[10px] font-normal text-[#5E6678]">{d}</span></span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <a href="#harga" className="hover:text-[#0E9F8E]">Harga</a>
          <a href="#faq" className="hover:text-[#0E9F8E]">FAQ</a>
        </nav>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => open('login')} className="px-4 py-1.5 rounded-full border border-[#12203A] text-[11px] font-bold hover:bg-white">
            Masuk
          </button>
          <button type="button" onClick={() => open('start')} className="hidden sm:inline-flex px-4 py-1.5 rounded-full bg-[#0B3A66] text-white text-[11px] font-bold items-center gap-1.5 hover:bg-[#12508F]">
            Mulai Sekarang <ArrowRight size={12} />
          </button>
          <button type="button" aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen((v) => !v)} className="md:hidden p-2 rounded-lg hover:bg-white">
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
        {menuOpen && (
          <nav aria-label="Menu mobile" className="md:hidden absolute left-4 right-4 top-full mt-2 rounded-2xl bg-white shadow-xl border border-slate-100 p-3 z-20 flex flex-col text-sm font-semibold">
            {[['#fitur', 'Fitur'], ['#cara-kerja', 'Cara Kerja'], ['#untuk-siapa', 'Untuk Siapa'], ['#harga', 'Harga'], ['#faq', 'FAQ']].map(([h, l]) => (
              <a key={h} href={h} onClick={() => setMenuOpen(false)} className="px-3 py-2.5 rounded-lg hover:bg-slate-50">{l}</a>
            ))}
            <button type="button" onClick={() => open('start')} className="mt-2 px-4 py-2.5 rounded-xl bg-[#0B3A66] text-white text-xs font-bold">Mulai Sekarang</button>
          </nav>
        )}
      </header>

      {/* Hero */}
      <section className="relative max-w-6xl mx-auto px-4 sm:px-8 pt-6 pb-10 grid md:grid-cols-2 gap-6 items-center overflow-hidden">
        <img
          src={`${A}/workshop-bg.png`}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 h-full w-3/5 object-cover opacity-40 [mask-image:linear-gradient(to_left,black,transparent)]"
        />
        <div className="relative z-10">
          <RevioLogo size="2xl" variant="full" layout="horizontal" className="-ml-2" />
          <h1 className="mt-2 text-4xl sm:text-5xl font-extrabold leading-[1.05]">
            Hak Revisi Jelas,
            <br />
            Biaya <span className="text-[#10A36B]">Transparan</span>
          </h1>
          <p className="mt-4 text-sm leading-relaxed max-w-sm">
            Platform untuk membuat hak revisi pelanggan dan biaya perubahan pesanan custom jadi transparan. Pesanan
            aman, komunikasi jelas, tanpa sengketa.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" onClick={() => open('start')} className="px-6 py-2.5 rounded-full bg-[#0B3A66] text-white text-xs font-bold inline-flex items-center gap-2 shadow-lg shadow-[#0B3A66]/25 hover:bg-[#12508F]">
              Mulai Sekarang <ArrowRight size={14} />
            </button>
            <a href="#demo" className="px-6 py-2.5 rounded-full border border-[#12203A]/30 bg-white/70 text-xs font-bold inline-flex items-center gap-2 hover:bg-white">
              <Play size={12} fill="currentColor" /> Lihat Demo
            </a>
          </div>
          <ul className="mt-6 flex flex-wrap gap-6 text-[11px] font-bold">
            <li className="flex items-center gap-2"><ShieldCheck className="text-[#16A34A]" size={22} />Transparansi<br />Penuh</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="text-[#16A34A]" size={22} />Keputusan<br />Tercatat</li>
            <li className="flex items-center gap-2"><BarChart3 className="text-[#16A34A]" size={22} />Hemat Biaya<br />Produksi</li>
          </ul>
        </div>

        <div className="relative z-10 min-h-[300px]">
          <img src={`${A}/hero-3d.png`} alt="Ilustrasi dokumen revisi berlogo R dengan perisai terverifikasi" className="no-outline w-full max-w-md mx-auto [mask-image:radial-gradient(ellipse_at_center,black_55%,transparent_78%)]" />
          <div className={`${glass} absolute top-0 right-0 w-44 rounded-2xl p-3 rotate-[-6deg]`}>
            <p className="text-xs font-extrabold mb-1.5">Peta Keputusan</p>
            {[
              ['Fleksibel', '#16A34A'],
              ['Mendekati Kunci', '#F5A623'],
              ['Terkunci', '#C27BA0'],
              ['Ditunda', '#7C83DB'],
            ].map(([l, c]) => (
              <p key={l} className="flex items-center gap-2 text-[11px] font-semibold py-0.5">
                <span className="size-2.5 rounded-full" style={{ background: c }} />{l}
              </p>
            ))}
          </div>
          <div className={`${glass} absolute bottom-2 right-0 rounded-2xl px-3 py-2.5 rotate-[-5deg] flex items-center gap-2`}>
            <CheckCircle2 className="text-white bg-[#16A34A] rounded-full p-0.5" size={30} />
            <p className="text-xs font-extrabold leading-tight">Change Order<br />Disetujui</p>
          </div>
        </div>
      </section>

      {/* Masalah & Solusi */}
      <section id="cara-kerja" className="max-w-6xl mx-auto px-4 sm:px-8 grid md:grid-cols-2 gap-4">
        <div className={`${glass} rounded-3xl p-5 flex items-end justify-between gap-3 overflow-hidden`}>
          <div className="pb-1">
            <Pill>Masalah yang Sering Terjadi</Pill>
            <h2 className="mt-3 text-xl font-extrabold leading-tight">Revisi di Tengah Produksi? Biayanya Bisa Membengkak!</h2>
            <p className="mt-2 text-xs text-[#5E6678] leading-relaxed">
              Perubahan desain setelah produksi berjalan sering menyebabkan bahan terbuang dan biaya tambahan yang tidak terduga.
            </p>
          </div>
          <img src={`${A}/man-thinking.png`} alt="Pemilik usaha bingung memikirkan biaya revisi" className="w-32 shrink-0 rounded-2xl self-end object-cover" />
        </div>
        <div className={`${glass} rounded-3xl p-5 flex items-center justify-between gap-3`}>
          <div>
            <Pill>Solusi dari Revio</Pill>
            <h2 className="mt-3 text-xl font-extrabold leading-tight">Peta Keputusan untuk Setiap Tahap Produksi</h2>
            <p className="mt-2 text-xs text-[#5E6678] leading-relaxed">
              Ketahui kapan keputusan harus dikunci, serta berapa biaya jika diubah atau ditunda.
            </p>
          </div>
          <div className="hidden sm:block shrink-0 w-44">
            <div className="flex items-center justify-between relative mb-3 px-1">
              <span className="absolute inset-x-3 top-1/2 h-px bg-[#B8C7E6]" />
              <span className="relative size-3 rounded-full border-2 border-[#2563EB] bg-white" />
              <Lock size={22} className="relative text-white bg-[#2563EB] rounded-full p-1" />
              <Lock size={22} className="relative text-white bg-[#0B3A66] rounded-full p-1" />
              <span className="relative size-3 rounded-full border-2 border-[#B8C7E6] bg-white" />
            </div>
            <div className="bg-white rounded-xl shadow-md px-3 py-2 flex items-center gap-2">
              <span className="size-6 rounded-full bg-[#F5A623] text-white text-xs font-black grid place-items-center">!</span>
              <p className="text-[11px] font-extrabold leading-tight">Mendekati Kunci<br />+ Rp250.000</p>
            </div>
          </div>
        </div>
      </section>

      {/* Fitur */}
      <section id="fitur" className="max-w-6xl mx-auto px-4 sm:px-8 pt-12 text-center">
        <Pill>Fitur Utama</Pill>
        <h2 className="mt-2 text-2xl font-extrabold">Kontrol Penuh di Setiap Keputusan</h2>
        <p className="text-xs mt-1">Pahami risiko, hitung biaya, dan kelola revisi dengan mudah.</p>
        <ol className="mt-5 grid grid-cols-2 md:grid-cols-6 gap-3">
          {FEATURES.map(({ Icon, t, d }, i) => (
            <li key={t} className={`${glass} rounded-2xl p-3 relative text-center`}>
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 size-5 rounded-full bg-[#2563EB] text-white text-[10px] font-bold grid place-items-center">
                {i + 1}
              </span>
              <Icon className="mx-auto mt-2 text-[#0B3A66]" size={20} />
              <p className="mt-1.5 text-[11px] font-extrabold leading-tight">{t}</p>
              <p className="mt-1 text-[10px] text-[#5E6678] leading-snug">{d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Tindakan + Dokumen + Analitik */}
      <section id="demo" className="max-w-6xl mx-auto px-4 sm:px-8 pt-10 grid lg:grid-cols-[1fr_1.15fr_1fr] gap-4 items-start">
        <div>
          <Pill>3 Tindakan Utama</Pill>
          <h2 className="mt-3 text-2xl font-extrabold leading-tight">Atur Keputusan,<br />Sesuai Kebutuhan</h2>
          <p className="mt-2 text-xs leading-relaxed">Ambil tindakan dengan aman dan jelas, langsung dari platform. Coba sekarang dengan data contoh.</p>
          <div className="mt-4 space-y-3">
            <button type="button" onClick={() => { setLocked(false); open('lock'); }} className="w-full text-left rounded-2xl bg-gradient-to-b from-[#12508F] to-[#0B3A66] text-white px-4 py-3 flex items-center gap-3 shadow-lg shadow-[#0B3A66]/30 hover:brightness-110">
              <Lock size={20} /><span><b className="block text-xs">Hold-to-Lock</b><span className="text-[10px] opacity-80">Tahan 1 detik untuk mengunci</span></span>
            </button>
            <button type="button" onClick={() => { setDeferred(null); open('defer'); }} className="w-full text-left rounded-2xl bg-white border border-[#12203A]/25 px-4 py-3 flex items-center gap-3 hover:bg-slate-50">
              <Clock size={20} /><span><b className="block text-xs">Tunda</b><span className="text-[10px] text-[#5E6678]">Simulasikan biaya & dampak</span></span>
            </button>
            <button type="button" onClick={() => open('change')} className="w-full text-left rounded-2xl bg-[#CDEFE3] border border-[#7ED3B5] px-4 py-3 flex items-center gap-3 text-[#0A5C4E] hover:brightness-95">
              <RefreshCw size={20} /><span><b className="block text-xs text-[#12203A]">Change Order</b><span className="text-[10px] text-[#12203A]">Ajukan perubahan</span></span>
            </button>
          </div>
        </div>

        <article className={`${glass} rounded-3xl p-4`} aria-label="Contoh dokumen Change Order">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-extrabold">Dokumen Change Order</h3>
            {docProject && (
              <button type="button" onClick={() => open('doc')} className="text-[10px] font-bold text-[#0A7A6D] inline-flex items-center gap-1 hover:underline">
                <FileText size={11} />Lihat contoh lengkap
              </button>
            )}
          </div>
          <div data-print-area className="mt-2 bg-white rounded-xl p-3 relative">
            <div className="flex items-start justify-between">
              <RevioLogo size="xs" layout="horizontal" />
              <svg viewBox="0 0 21 21" className="size-12" role="img" aria-label="Kode QR contoh">
                <rect width="21" height="21" fill="#fff" />
                {Array.from({ length: 21 * 21 }, (_, i) => {
                  const x = i % 21, y = Math.floor(i / 21);
                  return qrCell(x, y) ? <rect key={i} x={x} y={y} width="1" height="1" fill="#12203A" /> : null;
                })}
              </svg>
            </div>
            <p className="text-[11px] font-extrabold mt-1">Berita Acara Perubahan Pesanan</p>
            <dl className="mt-1.5 text-[10px] text-[#5E6678] space-y-0.5">
              {[['Proyek', 'Custom Furniture #1234'], ['Perubahan', 'Ukuran meja +10cm'], ['Biaya Tambahan', 'Rp 750.000']].map(([k, v]) => (
                <div key={k} className="flex gap-2"><dt className="w-24">{k}</dt><dd>: {v}</dd></div>
              ))}
            </dl>
            <span className="absolute right-2 top-1/2 rotate-[-8deg] border-2 border-[#16A34A] text-[#16A34A] rounded-md px-1.5 py-0.5 text-[11px] font-extrabold bg-white/80">
              TERVERIFIKASI
            </span>
            <div className="mt-3 border-t border-dashed pt-2 text-[10px] leading-snug">
              <b>Rumus Transparan:</b>
              <p className="mt-0.5 text-[#5E6678]">Biaya = (jam × tarif) + bahan terpakai<br />− deduksi pakai ulang + biaya jadwal</p>
            </div>
            <div className="mt-2 flex justify-end gap-2 print:hidden">
              <button type="button" onClick={(e) => printDoc(e.currentTarget, 'Di dialog cetak, pilih tujuan "Simpan sebagai PDF".')} className="px-3 py-1 rounded-lg border text-[10px] font-bold inline-flex items-center gap-1 hover:bg-slate-50"><Download size={11} />Unduh PDF</button>
              <button type="button" onClick={(e) => printDoc(e.currentTarget)} className="px-3 py-1 rounded-lg border text-[10px] font-bold inline-flex items-center gap-1 hover:bg-slate-50"><Printer size={11} />Cetak</button>
            </div>
          </div>
        </article>

        <article className={`${glass} rounded-3xl p-4`} aria-label="Contoh analitik revisi">
          <h3 className="text-sm font-extrabold">Analitik & Insight</h3>
          <div className="mt-1 flex items-start justify-between gap-2">
            <p className="text-[11px] leading-snug max-w-[9rem]">Lihat dampak revisi dan ukur penghematan.</p>
            <div className="bg-[#E3F6EA] rounded-lg px-2.5 py-1 text-center">
              <p className="text-xl font-extrabold text-[#16A34A] inline-flex items-center gap-1">-68%<TrendingDown size={14} /></p>
              <p className="text-[9px] text-[#5E6678]">Kerugian Revisi</p>
            </div>
          </div>
          <p className="mt-2 flex gap-3 text-[10px] font-semibold">
            <span className="inline-flex items-center gap-1"><i className="size-2 rounded-full bg-[#7C8AA5]" />Sebelum Revio</span>
            <span className="inline-flex items-center gap-1"><i className="size-2 rounded-full bg-[#16A34A]" />Sesudah Revio</span>
          </p>
          <svg viewBox="0 0 200 100" className="w-full mt-1" role="img" aria-label="Grafik kerugian revisi menurun setelah memakai Revio">
            <path d="M5 62 L55 52 L105 38 L155 36 L195 28 L195 80 L5 80Z" fill="#16A34A" opacity=".12" />
            <polyline points="5,62 55,52 105,38 155,36 195,28" fill="none" stroke="#16A34A" strokeWidth="2" />
            <polyline points="5,72 55,64 105,56 155,60 195,52" fill="none" stroke="#7C8AA5" strokeWidth="2" />
            {[[5, 62], [55, 52], [105, 38], [155, 36], [195, 28]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="2.5" fill="#16A34A" />)}
            {MONTHS.map((m, i) => (
              <text key={m} x={i === 0 ? 5 : i === 4 ? 195 : 5 + i * 47.5} y="95" fontSize="7" textAnchor={i === 0 ? 'start' : i === 4 ? 'end' : 'middle'} fill="#5E6678">{m}</text>
            ))}
          </svg>
          <button type="button" onClick={() => onOpenView('analytics')} className="mt-1 text-[11px] font-bold text-[#0A7A6D] inline-flex items-center gap-1 hover:underline">
            Buka analitik lengkap <ArrowRight size={11} />
          </button>
        </article>
      </section>

      {/* Untuk siapa */}
      <section id="untuk-siapa" className="max-w-6xl mx-auto px-4 sm:px-8 pt-10 grid lg:grid-cols-[1.4fr_1fr] gap-4">
        <div className={`${glass} rounded-3xl p-5`}>
          <Pill>Untuk Siapa?</Pill>
          <h2 className="mt-2 text-xl font-extrabold">Solusi untuk Semua Pihak</h2>
          <p className="text-xs mt-1">Dari pelanggan hingga vendor, semua lebih tenang dengan Revio.</p>
          <ul className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            {ROLES.map(({ view, Icon, t, d, c }) => (
              <li key={t}>
                <button type="button" onClick={() => onOpenView(view)} className="w-full h-full bg-white/80 rounded-2xl p-3 text-center border border-white hover:border-[#0E9F8E] hover:shadow-md transition-all">
                  <span className={`mx-auto size-10 rounded-full grid place-items-center ${c}`}><Icon size={20} /></span>
                  <span className="block mt-2 text-xs font-extrabold">{t}</span>
                  <span className="block text-[10px] text-[#5E6678] leading-snug">{d}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative rounded-3xl overflow-hidden min-h-[170px]">
          <img src={`${A}/carpenter.png`} alt="Tukang kayu memotong papan dengan gergaji" className="absolute inset-0 size-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-white" />
          <p className="relative ml-auto w-1/2 h-full flex items-center pr-10 text-sm font-extrabold leading-snug">
            Bersama Revio, proses produksi lebih terencana.
          </p>
          <button type="button" onClick={() => onOpenView('vendor_public_profile')} aria-label="Lihat contoh profil bengkel" className="absolute bottom-3 right-3 size-8 rounded-full bg-[#0B3A66] text-white grid place-items-center hover:bg-[#12508F]">
            <ArrowUpRight size={14} />
          </button>
        </div>
      </section>

      {/* Harga */}
      <section id="harga" className="max-w-6xl mx-auto px-4 sm:px-8 pt-12 text-center">
        <Pill>Harga</Pill>
        <h2 className="mt-2 text-2xl font-extrabold">Pilih Paket yang Sesuai</h2>
        <p className="text-xs mt-1 text-[#5E6678]">Harga di bawah hanya contoh ilustrasi untuk demo, bukan penawaran resmi.</p>
        <ul className="mt-5 grid md:grid-cols-3 gap-4 text-left">
          {PLANS.map((p) => (
            <li key={p.name} className={`${glass} rounded-3xl p-5 flex flex-col ${p.featured ? 'ring-2 ring-[#0E9F8E]' : ''}`}>
              <h3 className="text-sm font-extrabold">{p.name}</h3>
              <p className="mt-2 text-2xl font-extrabold">{p.price}</p>
              <p className="text-[11px] text-[#5E6678]">{p.note}</p>
              <ul className="mt-4 space-y-2 text-xs flex-1">
                {p.items.map((it) => (
                  <li key={it} className="flex items-start gap-2"><Check size={14} className="text-[#16A34A] mt-0.5 shrink-0" />{it}</li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => (p.action === 'vendor' ? onOpenView('vendor_dashboard') : open(p.action === 'contact' ? 'contact' : 'start'))}
                className={`mt-5 px-4 py-2.5 rounded-full text-xs font-bold ${p.featured ? 'bg-[#0B3A66] text-white hover:bg-[#12508F]' : 'border border-[#12203A]/30 hover:bg-white'}`}
              >
                {p.cta}
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-3xl mx-auto px-4 sm:px-8 pt-12">
        <div className="text-center">
          <Pill>FAQ</Pill>
          <h2 className="mt-2 text-2xl font-extrabold">Pertanyaan yang Sering Diajukan</h2>
        </div>
        <div className="mt-5 space-y-2">
          {FAQ.map(([q, a]) => (
            <details key={q} className={`${glass} group rounded-2xl px-4 py-3`}>
              <summary className="cursor-pointer list-none flex items-center justify-between gap-3 text-sm font-bold">
                {q}<ChevronDown size={16} className="shrink-0 transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-2 text-xs leading-relaxed text-[#5E6678]">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 pt-10">
        <div className="rounded-[2rem] bg-gradient-to-r from-[#0A2A4D] via-[#0B3F6B] to-[#0E9F6E] px-6 sm:px-10 py-7 flex flex-wrap items-center gap-6">
          <RevioLogo size="md" variant="white" layout="horizontal" />
          <span className="hidden sm:block h-12 w-px bg-white/40" />
          <div className="flex-1 min-w-[200px] text-white">
            <p className="text-lg font-extrabold">Mulai gunakan Revio sekarang!</p>
            <p className="text-xs opacity-90">Transparansi di setiap revisi, ketenangan di setiap pesanan.</p>
          </div>
          <button type="button" onClick={() => open('start')} className="px-6 py-2.5 rounded-full bg-white text-[#0B3A66] text-xs font-bold inline-flex items-center gap-2 hover:bg-slate-100">
            Mulai Sekarang <ArrowRight size={14} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-4 sm:px-8 py-6 flex flex-wrap items-center justify-between gap-4 text-xs">
        <RevioLogo size="sm" layout="horizontal" />
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 font-semibold">
          <a href="#cara-kerja" className="hover:text-[#0E9F8E]">Tentang</a>
          <a href="#fitur" className="hover:text-[#0E9F8E]">Fitur</a>
          <a href="#harga" className="hover:text-[#0E9F8E]">Harga</a>
          <a href="#faq" className="hover:text-[#0E9F8E]">FAQ</a>
          <button type="button" onClick={() => { setSubmitted(false); open('contact'); }} className="hover:text-[#0E9F8E]">Kontak</button>
        </nav>
        {/* Dekoratif: akun sosial Revio belum ada, jadi bukan tautan. */}
        <div className="flex items-center gap-3 text-[#5E6678]" aria-hidden="true">
          <Youtube size={16} /><Instagram size={16} /><Linkedin size={16} />
        </div>
        <p className="text-[#5E6678]">© 2026 Revio. All rights reserved.</p>
      </footer>

      {/* Toast */}
      <div role="status" aria-live="polite" className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[60] px-4 print:hidden">
        {toast && <p className="rounded-full bg-[#12203A] text-white text-xs font-semibold px-4 py-2.5 shadow-xl">{toast}</p>}
      </div>

      {/* Dialog: pilih peran (Mulai Sekarang / Masuk) */}
      {(dlg === 'start' || dlg === 'login') && (
        <Dialog id="dlg-peran" title={dlg === 'login' ? 'Masuk ke akun demo' : 'Mulai dengan peran apa?'} onClose={close}>
          <p className="text-xs text-[#5E6678] mb-4">
            {dlg === 'login'
              ? 'Ini demo tanpa kata sandi: pilih peran untuk masuk dengan data contoh.'
              : 'Pilih peran untuk mencoba Revio dengan data contoh.'}
          </p>
          <RoleList />
        </Dialog>
      )}

      {/* Dialog: Hold-to-Lock */}
      {dlg === 'lock' && (
        <Dialog id="dlg-lock" title="Kunci keputusan" onClose={close}>
          <p className="text-sm font-bold">{demoDecision.title}</p>
          <p className="text-xs text-[#5E6678] mt-1">{demoDecision.whyExpensive}</p>
          <div className="mt-5 flex justify-center">
            <HoldToLock decisionTitle={demoDecision.title} isAlreadyLocked={locked} onLocked={() => setLocked(true)} />
          </div>
          {locked && (
            <div className="mt-4 rounded-xl bg-[#E3F6EA] p-3 text-xs">
              <b className="text-[#16A34A]">Keputusan terkunci.</b> Di aplikasi, penguncian tercatat di log audit.
              <button type="button" onClick={() => go('customer_space')} className="block mt-2 font-bold text-[#0A7A6D] hover:underline">Lihat di Ruang Pelanggan →</button>
            </div>
          )}
        </Dialog>
      )}

      {/* Dialog: simulasi tunda */}
      {dlg === 'defer' && (
        <Dialog id="dlg-defer" title="Simulasi tunda keputusan" onClose={close} wide>
          <DeferralCalculator
            decision={demoDecision}
            stages={demoProject.stages}
            onConfirmDeferral={(stageId, fee, days) => {
              setDeferred(`Ditunda ke tahap "${demoProject.stages.find((s) => s.id === stageId)?.name ?? stageId}": biaya ${idr(fee)}, ${days} hari.`);
            }}
          />
          {deferred && (
            <div className="mt-4 rounded-xl bg-[#FFF7E6] p-3 text-xs">
              <b>{deferred}</b>
              <button type="button" onClick={() => go('customer_space')} className="block mt-2 font-bold text-[#0A7A6D] hover:underline">Lihat di Ruang Pelanggan →</button>
            </div>
          )}
        </Dialog>
      )}

      {/* Dialog: ajukan change order */}
      {dlg === 'change' && (
        <ChangeOrderModal
          decision={demoDecision}
          workLogs={demoProject.workLogs}
          materialLogs={demoProject.materialLogs}
          isOpen
          onClose={close}
          onSubmitChangeOrder={() => { close(); say('Change Order contoh diajukan. Di Ruang Pelanggan, pengajuan tercatat dan menunggu persetujuan vendor.'); }}
        />
      )}

      {/* Dialog: dokumen change order lengkap */}
      {dlg === 'doc' && docProject && (
        <Modal onClose={close} label="Contoh dokumen Change Order">
          <div className="max-h-[92vh] overflow-y-auto w-full max-w-2xl">
            <ChangeOrderDocument changeOrder={docProject.changeOrders[0]} project={docProject} onClose={close} />
          </div>
        </Modal>
      )}

      {/* Dialog: kontak */}
      {dlg === 'contact' && (
        <Dialog id="dlg-kontak" title="Hubungi Revio" onClose={close}>
          {submitted ? (
            <div className="text-xs space-y-3">
              <p className="rounded-xl bg-[#E3F6EA] p-3"><b>Terima kasih, {sentTo}.</b> Ini mode demo: pesan Anda belum dikirim ke server mana pun.</p>
              <button type="button" onClick={close} className="px-4 py-2 rounded-full bg-[#0B3A66] text-white font-bold">Tutup</button>
            </div>
          ) : (
            <form
              className="space-y-3 text-xs"
              onSubmit={(e) => {
                e.preventDefault();
                setSentTo(String(new FormData(e.currentTarget).get('nama') || ''));
                setSubmitted(true);
              }}
            >
              <label className="block font-semibold">Nama
                <input name="nama" required autoComplete="name" className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 font-normal" />
              </label>
              <label className="block font-semibold">Email
                <input name="email" type="email" required autoComplete="email" className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 font-normal" />
              </label>
              <label className="block font-semibold">Pesan
                <textarea name="pesan" required rows={4} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 font-normal" />
              </label>
              <button type="submit" className="px-5 py-2.5 rounded-full bg-[#0B3A66] text-white font-bold hover:bg-[#12508F]">Kirim Pesan</button>
            </form>
          )}
        </Dialog>
      )}
    </div>
  );
}
