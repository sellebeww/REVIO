import React, { useState } from 'react';
import { Save, Eye, CheckCircle2, ArrowLeft } from 'lucide-react';
import { VendorProfile } from '../../types/revio';
import VendorPublicProfile from './VendorPublicProfile';

interface VendorProfileEditorProps {
  initialVendor: VendorProfile;
  onSave: (updated: VendorProfile) => void;
  onClose: () => void;
}

export const VendorProfileEditor: React.FC<VendorProfileEditorProps> = ({
  initialVendor,
  onSave,
  onClose,
}) => {
  const [vendorData, setVendorData] = useState<VendorProfile>(initialVendor);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(vendorData);
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Editor top toolbar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
        <button
          onClick={onClose}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={14} />
          <span>Kembali ke Dasbor</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors flex items-center gap-1.5 ${
              isPreviewMode
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            <Eye size={14} />
            <span>{isPreviewMode ? 'Kembali ke Editor' : 'Pratinjau Langsung'}</span>
          </button>

          {!isPreviewMode && (
            <button
              onClick={handleSubmit}
              className="px-4 py-1.5 text-xs font-semibold rounded-xl bg-[#0E9F8E] hover:bg-[#0A7A6D] text-white flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Save size={14} />
              <span>Simpan Perubahan</span>
            </button>
          )}
        </div>
      </div>

      {showSavedToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 font-semibold">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>Profil perusahaan berhasil diperbarui dan disimpan!</span>
        </div>
      )}

      {isPreviewMode ? (
        <VendorPublicProfile vendor={vendorData} />
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <h2 className="font-display font-bold text-lg text-slate-900">
            Pengaturan Profil Publik Bengkel / Workshop
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Nama Perusahaan / Bengkel</label>
              <input
                type="text"
                value={vendorData.name}
                onChange={(e) => setVendorData({ ...vendorData, name: e.target.value })}
                className="w-full border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-[#0E9F8E] focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Kategori Usaha</label>
              <input
                type="text"
                value={vendorData.category}
                onChange={(e) => setVendorData({ ...vendorData, category: e.target.value })}
                className="w-full border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-[#0E9F8E] focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="font-semibold text-slate-700">Tagline Usaha</label>
              <input
                type="text"
                value={vendorData.tagline}
                onChange={(e) => setVendorData({ ...vendorData, tagline: e.target.value })}
                className="w-full border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-[#0E9F8E] focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="font-semibold text-slate-700">Cerita & Keunggulan Bengkel (About)</label>
              <textarea
                rows={4}
                value={vendorData.about}
                onChange={(e) => setVendorData({ ...vendorData, about: e.target.value })}
                className="w-full border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-[#0E9F8E] focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Kota Operasional</label>
              <input
                type="text"
                value={vendorData.city}
                onChange={(e) => setVendorData({ ...vendorData, city: e.target.value })}
                className="w-full border border-slate-200 rounded-xl p-2.5"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Nomor WhatsApp Resmi (Format: 628...)</label>
              <input
                type="text"
                value={vendorData.whatsappPhone}
                onChange={(e) => setVendorData({ ...vendorData, whatsappPhone: e.target.value })}
                className="w-full border border-slate-200 rounded-xl p-2.5"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Email Bisnis</label>
              <input
                type="email"
                value={vendorData.email}
                onChange={(e) => setVendorData({ ...vendorData, email: e.target.value })}
                className="w-full border border-slate-200 rounded-xl p-2.5"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Jam Layanan</label>
              <input
                type="text"
                value={vendorData.workingHours}
                onChange={(e) => setVendorData({ ...vendorData, workingHours: e.target.value })}
                className="w-full border border-slate-200 rounded-xl p-2.5"
                required
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="font-semibold text-slate-700">Alamat Lengkap Workshop</label>
              <input
                type="text"
                value={vendorData.address}
                onChange={(e) => setVendorData({ ...vendorData, address: e.target.value })}
                className="w-full border border-slate-200 rounded-xl p-2.5"
                required
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-100"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold rounded-xl bg-[#0E9F8E] hover:bg-[#0A7A6D] text-white"
            >
              Simpan Profil Publik
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default VendorProfileEditor;
