import React, { useState } from 'react';
import { X, Sparkles, FolderPlus, Check } from 'lucide-react';
import { Project } from '../../types/revio';
import Modal from '../ui/Modal';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (project: Project) => void;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({
  isOpen,
  onClose,
  onCreateProject,
}) => {
  const [category, setCategory] = useState<'furnitur' | 'percetakan' | 'dekorasi'>('furnitur');
  const [title, setTitle] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [valueAmount, setValueAmount] = useState('25000000');
  const [depositAmount, setDepositAmount] = useState('12500000');
  const [decisionTitle, setDecisionTitle] = useState('Pilihan Warna Finishing');
  const [whyExpensive, setWhyExpensive] = useState(
    'Setelah proses pewarnaan disemprotkan, pigmen menyerap ke pori-pori dan memerlukan 14 jam pengerokan manual jika diubah.'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `proj-${crypto.randomUUID().slice(0, 8)}`;

    const newProject: Project = {
      id: newId,
      vendorId: 'v-bkn',
      vendorName: 'Bengkel Kayu Nusantara',
      vendorSlug: 'bengkel-kayu-nusantara',
      customerId: `cust-${crypto.randomUUID().slice(0, 8)}`,
      customerName: customerName || 'Klien Baru',
      customerPhone: customerPhone || '08123456789',
      customerEmail: 'klien@example.com',
      title: title || 'Pesanan Kustom Baru',
      description: `Proyek pengerjaan pesanan ${category} dengan pengawasan titik kunci revisi.`,
      valueAmount: Number(valueAmount) || 20000000,
      depositAmount: Number(depositAmount) || 10000000,
      paidAmount: Number(depositAmount) || 10000000,
      status: 'aktif',
      category: category as any,
      startsOn: new Date().toISOString().split('T')[0],
      dueOn: new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0],
      flexibilityThresholdPct: 5,
      currentStageId: `stg-${newId}-1`,
      currentStageName: 'Persetujuan Desain & Dimensi',
      lastStageUpdatedHoursAgo: 1,
      stages: [
        {
          id: `stg-${newId}-1`,
          projectId: newId,
          name: 'Persetujuan Desain & Dimensi',
          order: 1,
          status: 'in_progress',
          plannedStart: '2026-10-22',
          plannedEnd: '2026-10-28',
          lastUpdatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          updatedBy: 'Admin Workshop',
          notes: 'Tahap awal penyesuaian detail teknis.',
        },
        {
          id: `stg-${newId}-2`,
          projectId: newId,
          name: 'Pemotongan & Pembentukan Material Utama',
          order: 2,
          status: 'pending',
          plannedStart: '2026-10-29',
          plannedEnd: '2026-11-08',
          lastUpdatedAt: '2026-10-22',
          updatedBy: 'Sistem',
          lockPointForTitles: [decisionTitle],
        },
        {
          id: `stg-${newId}-3`,
          projectId: newId,
          name: 'Finishing & Perakitan Akhir',
          order: 3,
          status: 'pending',
          plannedStart: '2026-11-09',
          plannedEnd: '2026-11-20',
          lastUpdatedAt: '2026-10-22',
          updatedBy: 'Sistem',
        },
      ],
      decisions: [
        {
          id: `dec-${newId}-1`,
          projectId: newId,
          title: decisionTitle || 'Keputusan Spesifikasi Material',
          description: 'Keputusan yang harus dikunci sebelum material dipotong.',
          options: [
            { id: 'opt-a', label: 'Pilihan Standar Premium A', description: 'Pilihan default sesuai spesifikasi' },
            { id: 'opt-b', label: 'Pilihan Alternatif B', description: 'Varian corak kedua' },
          ],
          chosenOption: 'opt-a',
          lockStageId: `stg-${newId}-2`,
          lockStageName: 'Pemotongan & Pembentukan Material Utama',
          status: 'fleksibel',
          flexibilityScore: 85,
          currentChangeCost: 0,
          deadlineAt: '2026-10-29 18:00',
          whyExpensive: whyExpensive,
          hourlyRate: 85000,
          rescheduleFee: 200000,
        },
      ],
      workLogs: [],
      materialLogs: [],
      changeOrders: [],
    };

    onCreateProject(newProject);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal onClose={onClose} label="Proyek baru">
      <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-teal-50 text-[#0E9F8E]">
              <FolderPlus size={18} />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-slate-900">
                Buat Proyek Baru & Petakan Keputusan
              </h3>
              <p className="text-xs text-slate-500">
                Tentukan titik kunci sejak hari pertama agar revisi terkontrol
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Pilih Templat Industri</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'furnitur', label: 'Furnitur Kustom' },
                { id: 'percetakan', label: 'Percetakan' },
                { id: 'dekorasi', label: 'Dekorasi Event' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id as any)}
                  className={`py-2 px-3 rounded-xl border text-center font-semibold transition-all ${
                    category === cat.id
                      ? 'border-[#0E9F8E] bg-teal-50 text-[#0E9F8E]'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Judul Proyek</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Meja Resepsionis Lengkung Kayu Sungkai"
              className="w-full border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-[#0E9F8E] focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Nama Pelanggan</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Nama Klien"
                className="w-full border border-slate-200 rounded-xl p-2.5"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Nomor WhatsApp Pelanggan</label>
              <input
                type="text"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="0812..."
                className="w-full border border-slate-200 rounded-xl p-2.5"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Nilai Kontrak (Rp)</label>
              <input
                type="number"
                value={valueAmount}
                onChange={(e) => setValueAmount(e.target.value)}
                className="w-full border border-slate-200 rounded-xl p-2.5"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Uang Muka / DP (Rp)</label>
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="w-full border border-slate-200 rounded-xl p-2.5"
                required
              />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/60 space-y-2">
            <span className="font-bold text-amber-950 block">Keputusan Mahal Pertama (Titik Kunci):</span>
            <input
              type="text"
              value={decisionTitle}
              onChange={(e) => setDecisionTitle(e.target.value)}
              placeholder="Nama keputusan krusial..."
              className="w-full border border-amber-200 rounded-lg p-2 bg-white text-slate-900"
              required
            />
            <textarea
              rows={2}
              value={whyExpensive}
              onChange={(e) => setWhyExpensive(e.target.value)}
              placeholder="Jelaskan dalam bahasa awam mengapa mahal jika diubah melewati titik kunci..."
              className="w-full border border-amber-200 rounded-lg p-2 bg-white text-slate-900 text-xs"
              required
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#0E9F8E] hover:bg-[#0A7A6D] text-white font-semibold flex items-center gap-1.5"
            >
              <Check size={14} />
              <span>Simpan & Buat Peta Keputusan</span>
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default NewProjectModal;
