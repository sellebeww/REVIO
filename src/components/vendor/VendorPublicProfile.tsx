import React, { useState } from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  Clock, 
  Phone, 
  Mail, 
  CheckCircle, 
  Star, 
  ArrowRight, 
  Layers,
  Wrench,
  Sparkles,
  MessageSquare,
  Award,
  ChevronRight
} from 'lucide-react';
import { VendorProfile, VendorPortfolioItem } from '../../types/revio';
import RevioLogo from '../brand/RevioLogo';

interface VendorPublicProfileProps {
  vendor: VendorProfile;
  onRequestQuote?: () => void;
  onBackToDirectory?: () => void;
}

export const VendorPublicProfile: React.FC<VendorPublicProfileProps> = ({
  vendor,
  onRequestQuote,
  onBackToDirectory,
}) => {
  const [selectedPortfolio, setSelectedPortfolio] = useState<VendorPortfolioItem | null>(null);

  const waUrl = `https://wa.me/${vendor.whatsappPhone}?text=${encodeURIComponent(
    `Halo ${vendor.name}, saya tertarik dengan layanan ${vendor.category} via profil Revio Anda. Bolehkah konsultasi seputar spesifikasi dan tahapan pengerjaan?`
  )}`;

  return (
    <div className="space-y-10 pb-16">
      {/* Top Breadcrumb & Badge */}
      {onBackToDirectory && (
        <button
          onClick={onBackToDirectory}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <span>← Kembali ke Direktori Vendor Terverifikasi</span>
        </button>
      )}

      {/* Hero Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-xs relative overflow-hidden">
        {/* Subtle decorative mesh background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-teal-50 via-emerald-50/20 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0E9F8E] bg-teal-50 px-3 py-1 rounded-lg border border-teal-200">
              {vendor.category}
            </span>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
              <ShieldCheck size={14} className="text-emerald-600" />
              <span>Lencana Kepastian {vendor.certifiedBadgeLevel.toUpperCase()}</span>
            </div>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <MapPin size={13} className="text-slate-400" />
              {vendor.city}
            </span>
          </div>

          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 leading-tight">
            {vendor.name}
          </h1>

          <p className="text-base text-slate-600 leading-relaxed font-medium">
            "{vendor.tagline}"
          </p>

          {/* Quick Metrics Strip */}
          <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs border-t border-slate-100">
            <div>
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Berdiri Sejak</span>
              <p className="font-bold text-slate-900 mt-0.5">{vendor.foundedYear}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Kunci Tepat Waktu</span>
              <p className="font-mono font-bold text-slate-900 mt-0.5">{vendor.onTimeLockRate}%</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Bebas Sengketa</span>
              <p className="font-mono font-bold text-slate-900 mt-0.5">{vendor.lowDisputeRate}%</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Rata-rata Waktu</span>
              <p className="font-bold text-slate-900 mt-0.5">{vendor.leadDaysAvg} Hari Kerja</p>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-xl bg-[#0E9F8E] hover:bg-[#0A7A6D] text-white text-xs font-bold inline-flex items-center gap-2 shadow-xs transition-colors"
            >
              <MessageSquare size={16} />
              <span>Hubungi via WhatsApp</span>
            </a>
            {onRequestQuote && (
              <button
                onClick={onRequestQuote}
                className="px-5 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold inline-flex items-center gap-2 transition-colors"
              >
                <span>Minta Penawaran Kustom</span>
                <ChevronRight size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4">
          <h2 className="font-display font-bold text-xl text-slate-900">
            Tentang Bengkel & Komitmen Kualitas
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            {vendor.about}
          </p>

          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h3 className="font-display font-bold text-sm text-slate-900">
              Kebijakan Transparansi Revisi Bersama Revio
            </h3>
            <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside">
              <li>Peta Keputusan disepakati di awal kontrak sebelum produksi berjalan.</li>
              <li>Jendela revisi gratis berlaku penuh sebelum material dipotong atau finishing disemprot.</li>
              <li>Perubahan setelah titik kunci dihitung otomatis dan wajib mereferensikan catatan jam kerja & bahan nyata.</li>
            </ul>
          </div>
        </div>

        {/* Contact card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 text-xs">
          <h3 className="font-display font-bold text-base text-slate-900">
            Kontak & Jam Kerja
          </h3>
          <div className="space-y-3 text-slate-600">
            <div className="flex items-start gap-2.5">
              <MapPin size={16} className="text-[#0E9F8E] shrink-0 mt-0.5" />
              <span>{vendor.address}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Clock size={16} className="text-[#0E9F8E] shrink-0" />
              <span>{vendor.workingHours}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail size={16} className="text-[#0E9F8E] shrink-0" />
              <span>{vendor.email}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone size={16} className="text-[#0E9F8E] shrink-0" />
              <span>+{vendor.whatsappPhone}</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Jangkauan Layanan</span>
            <p className="font-medium text-slate-800 mt-0.5">{vendor.coverageArea}</p>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="space-y-4">
        <h2 className="font-display font-bold text-xl text-slate-900">
          Layanan & Spesifikasi Bahan
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {vendor.services.map((srv, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 hover:border-slate-300 transition-all"
            >
              <h3 className="font-display font-bold text-base text-slate-900">
                {srv.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {srv.description}
              </p>
              <div className="pt-3 border-t border-slate-100 space-y-1 text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400">
                  Bahan Utama
                </span>
                <p className="font-medium text-slate-800">{srv.materials}</p>
                <span className="text-[11px] text-slate-500 block pt-1">
                  Estimasi pengerjaan: {srv.avgDays} hari kerja
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Portfolio Gallery */}
      <div className="space-y-4">
        <h2 className="font-display font-bold text-xl text-slate-900">
          Galeri Portofolio Proyek
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {vendor.portfolio.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedPortfolio(item)}
              className="group bg-white rounded-2xl border border-slate-200 overflow-hidden cursor-pointer hover:shadow-md transition-all flex flex-col"
            >
              <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-2 left-2 text-[10px] font-bold bg-slate-900/80 text-white px-2 py-0.5 rounded backdrop-blur-xs">
                  {item.category}
                </span>
              </div>
              <div className="p-4 space-y-1.5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-display font-bold text-xs text-slate-900 group-hover:text-[#0E9F8E] transition-colors line-clamp-1">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                    {item.description}
                  </p>
                </div>
                <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-100">
                  {item.durationDays} hari pengerjaan
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Portfolio Lightbox Modal */}
      {selectedPortfolio && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="relative aspect-16/9 bg-slate-900">
              <img
                src={selectedPortfolio.imageUrl}
                alt={selectedPortfolio.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <button
                onClick={() => setSelectedPortfolio(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-900/70 text-white flex items-center justify-center font-bold hover:bg-slate-900 transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-3">
              <span className="text-xs font-semibold text-[#0E9F8E] uppercase tracking-wider">
                {selectedPortfolio.category} · {selectedPortfolio.durationDays} Hari Produksi
              </span>
              <h3 className="font-display font-bold text-xl text-slate-900">
                {selectedPortfolio.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {selectedPortfolio.description}
              </p>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <strong>Spesifikasi Bahan:</strong> {selectedPortfolio.materials}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorPublicProfile;
