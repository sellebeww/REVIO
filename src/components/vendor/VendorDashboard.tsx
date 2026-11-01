import React, { useState } from 'react';

import { Plus, AlertTriangle, ShieldCheck, CheckCircle, ChevronRight } from 'lucide-react';
import { Project, WorkLog, MaterialLog, VendorProfile } from '../../types/revio';
import FlexibilityBar from '../motion/FlexibilityBar';
import LivingLock from '../motion/LivingLock';
import Modal from '../ui/Modal';

interface VendorDashboardProps {
  vendor: VendorProfile;
  projects: Project[];
  onSelectProject: (projectId: string) => void;
  onAdvanceStage: (projectId: string, notes: string) => void;
  onAddWorkLog: (projectId: string, log: Partial<WorkLog>) => void;
  onAddMaterialLog: (projectId: string, log: Partial<MaterialLog>) => void;
  onOpenProfileEditor: () => void;
  onOpenNewProject: () => void;
}

export const VendorDashboard: React.FC<VendorDashboardProps> = ({
  vendor,
  projects,
  onSelectProject,
  onAdvanceStage,
  onAddWorkLog,
  onAddMaterialLog,
  onOpenProfileEditor,
  onOpenNewProject,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'logs' | 'badge'>('overview');
  const [logModalProjectId, setLogModalProjectId] = useState<string | null>(null);

  // Form states for quick work log entry
  const [logType, setLogType] = useState<'work' | 'material'>('work');
  const [workHours, setWorkHours] = useState('4');
  const [workDesc, setWorkDesc] = useState('');
  const [materialName, setMaterialName] = useState('');
  const [materialQty, setMaterialQty] = useState('1');
  const [materialPrice, setMaterialPrice] = useState('250000');
  const [reusablePct, setReusablePct] = useState('30');

  // Stats
  const activeProjects = projects.filter((p) => p.status === 'aktif');
  const nearLockDecisions = projects.flatMap((p) =>
    p.decisions.filter((d) => d.status === 'mendekati_kunci')
  );
  const totalValue = projects.reduce((acc, p) => acc + p.valueAmount, 0);

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const selectedLogProject = projects.find((p) => p.id === logModalProjectId);

  const handleSaveLog = (e: React.FormEvent) => {
    e.preventDefault();
    // Catatan kerja harus tertaut ke keputusan nyata.
    if (!selectedLogProject || selectedLogProject.decisions.length === 0) return;

    const firstDecision = selectedLogProject.decisions[0];

    if (logType === 'work') {
      onAddWorkLog(selectedLogProject.id, {
        stageId: selectedLogProject.currentStageId,
        stageName: selectedLogProject.currentStageName,
        decisionId: firstDecision.id,
        hours: Number(workHours),
        rate: firstDecision.hourlyRate,
        description: workDesc || 'Pengerjaan penyesuaian tahap produksi',
        loggedBy: 'Mandor Produksi',
        loggedAt: new Date().toLocaleString('id-ID'),
      });
    } else {
      onAddMaterialLog(selectedLogProject.id, {
        decisionId: firstDecision.id,
        material: materialName,
        quantity: Number(materialQty),
        unit: 'satuan',
        unitPrice: Number(materialPrice),
        reusablePct: Number(reusablePct) || 0,
        loggedAt: new Date().toLocaleString('id-ID'),
      });
    }

    setLogModalProjectId(null);
    setWorkDesc('');
    setMaterialName('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Metrics */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Dasbor Vendor Terverifikasi
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                <ShieldCheck size={13} className="text-emerald-600" />
                Lencana Kepastian {vendor.certifiedBadgeLevel.toUpperCase()}
              </span>
            </div>
            <h1 className="font-display font-extrabold text-2xl text-slate-900">
              {vendor.name}
            </h1>
            <p className="text-xs text-slate-500">
              {vendor.tagline} · {vendor.city}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenProfileEditor}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Edit Profil Perusahaan
            </button>
            <button
              onClick={onOpenNewProject}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#0E9F8E] hover:bg-[#0A7A6D] text-white flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Plus size={15} />
              <span>Buat Proyek Baru</span>
            </button>
          </div>
        </div>

        {/* 4 KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-xs text-slate-500 font-medium">Proyek Aktif</span>
            <div className="font-display text-2xl font-bold text-slate-900 mt-1">
              {activeProjects.length}
            </div>
            <span className="text-xs text-emerald-600 font-medium">Semua tahap tercatat</span>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/60">
            <span className="text-xs text-amber-800 font-medium flex items-center gap-1">
              <AlertTriangle size={13} className="text-amber-600" />
              Mendekati Kunci
            </span>
            <div className="font-display text-2xl font-bold text-amber-950 mt-1">
              {nearLockDecisions.length}
            </div>
            <span className="text-xs text-amber-700">Perlu pengingat klien</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-xs text-slate-500 font-medium">Skor Transparansi</span>
            <div className="font-display text-2xl font-bold text-[#0E9F8E] mt-1">
              {vendor.transparencyScore}%
            </div>
            <span className="text-xs text-slate-500">Kunci tepat waktu: {vendor.onTimeLockRate}%</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-xs text-slate-500 font-medium">Total Nilai Portofolio</span>
            <div className="font-mono text-lg font-bold text-slate-900 mt-1 tabular-nums">
              {formatIDR(totalValue)}
            </div>
            <span className="text-xs text-slate-500">5 Proyek seed terdaftar</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200 pb-px">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 text-xs font-semibold rounded-t-xl transition-colors ${
            activeTab === 'overview'
              ? 'bg-white border-t border-x border-slate-200 text-[#0E9F8E] -mb-px'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Daftar Proyek & Tahap Produksi
        </button>
        <button
          onClick={() => setActiveTab('badge')}
          className={`px-4 py-2 text-xs font-semibold rounded-t-xl transition-colors ${
            activeTab === 'badge'
              ? 'bg-white border-t border-x border-slate-200 text-[#0E9F8E] -mb-px'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Lencana Kepastian & Audit Transparansi
        </button>
      </div>

      {/* Tab 1: Projects list */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          {projects.map((project) => {
            const currentDec = project.decisions[0];

            return (
              <div
                key={project.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:border-slate-300 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono uppercase bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold">
                        {project.id}
                      </span>
                      <span className="text-xs text-slate-500">
                        Klien: <strong>{project.customerName}</strong>
                      </span>
                    </div>
                    <h3
                      onClick={() => onSelectProject(project.id)}
                      className="font-display font-bold text-base text-slate-900 hover:text-[#0E9F8E] cursor-pointer transition-colors"
                    >
                      {project.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setLogModalProjectId(project.id)}
                      className="px-3 py-2.5 text-xs font-semibold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1"
                    >
                      <Plus size={13} />
                      <span>Catat Jam/Bahan</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onAdvanceStage(project.id, 'Tahap dimajukan oleh mandor bengkel.')}
                      className="px-3 py-2.5 text-xs font-semibold rounded-lg bg-teal-50 text-[#0A7A6D] hover:bg-teal-100 transition-colors flex items-center gap-1"
                    >
                      <CheckCircle size={13} />
                      <span>Majukan Tahap</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onSelectProject(project.id)}
                      className="px-3 py-2.5 text-xs font-semibold rounded-lg bg-gradient-to-b from-[#12508F] to-[#0B3A66] text-white shadow-md shadow-[#0B3A66]/25 hover:brightness-110 transition-colors flex items-center gap-1"
                    >
                      <span>Buka Ruang</span>
                      <ChevronRight size={13} />
                    </button>
                  </div>
                </div>

                {/* Progress, Stage, and Decision Status */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs">
                  <div>
                    <span className="text-xs uppercase font-bold text-slate-400">
                      Tahap Produksi Saat Ini
                    </span>
                    <p className="font-semibold text-slate-800 mt-0.5 truncate">
                      {project.currentStageName}
                    </p>
                    <span className="text-xs text-slate-400">
                      Update {project.lastStageUpdatedHoursAgo} jam lalu
                    </span>
                  </div>

                  <div>
                    <span className="text-xs uppercase font-bold text-slate-400">
                      Keputusan Kunci Terkait
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <LivingLock status={currentDec?.status || 'fleksibel'} size="sm" />
                      <span className="font-semibold text-slate-800 truncate">
                        {currentDec?.title || 'Tidak ada'}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500">
                      Titik Kunci: {currentDec?.lockStageName}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs uppercase font-bold text-slate-400">
                      Sisa Fleksibilitas
                    </span>
                    <div className="mt-1">
                      <FlexibilityBar score={currentDec?.flexibilityScore || 0} size="sm" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Certified Badge & Transparency Audit */}
      {activeTab === 'badge' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900">
                Lencana Kepastian (Certified Transparency Badge)
              </h3>
              <p className="text-xs text-slate-500">
                Sertifikasi reputasi vendor berdasarkan bukti riil keputusan tepat waktu dan nihil sengketa sepihak
              </p>
            </div>
            <div className="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-900 font-bold text-xs">
              Status: Aktif (Platinum)
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <span className="text-xs text-slate-500">Tingkat Kunci Tepat Waktu</span>
              <p className="font-mono text-2xl font-bold text-slate-900 mt-1">97.0%</p>
              <p className="text-xs text-slate-500 mt-1">
                Klien mengunci keputusan sebelum bahan terlanjur dipotong/dikerjakan.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <span className="text-xs text-slate-500">Tingkat Bebas Sengketa</span>
              <p className="font-mono text-2xl font-bold text-slate-900 mt-1">99.4%</p>
              <p className="text-xs text-slate-500 mt-1">
                Tidak ada klaim biaya revisi sepihak tanpa bukti log pekerjaan nyata.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <span className="text-xs text-slate-500">Skor Kejelasan Pelanggan</span>
              <p className="font-mono text-2xl font-bold text-slate-900 mt-1">4.9 / 5.0</p>
              <p className="text-xs text-slate-500 mt-1">
                Berdasarkan survei verifikasi pascaproyek seluruh klien.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-900 space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-[#0E9F8E]" />
              Pengaman Anti-Pelebihan Biaya Aktif
            </p>
            <p className="leading-relaxed">
              Sistem Revio secara otomatis memblokir kenaikan biaya di atas ambang 5% proyek tanpa melampirkan foto bahan terbuang dan jam tukang nyata. Klien memiliki hak challenge langsung atas setiap change order.
            </p>
          </div>
        </div>
      )}

      {/* Modal Quick Log Jam/Bahan */}
      {logModalProjectId && (
        <Modal onClose={() => setLogModalProjectId(null)} label="Catat jejak pekerjaan">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full shadow-xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div>
                <h4 className="font-display font-bold text-sm text-slate-900">
                  Catat Jejak Pekerjaan / Bahan Nyata
                </h4>
                <p className="text-xs text-slate-500">{selectedLogProject?.title}</p>
              </div>
              <button
                onClick={() => setLogModalProjectId(null)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex border-b border-slate-200 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setLogType('work')}
                className={`flex-1 py-2 text-center border-b-2 ${
                  logType === 'work' ? 'border-[#0E9F8E] text-[#0E9F8E]' : 'border-transparent text-slate-500'
                }`}
              >
                Jam Kerja Tukang
              </button>
              <button
                type="button"
                onClick={() => setLogType('material')}
                className={`flex-1 py-2 text-center border-b-2 ${
                  logType === 'material' ? 'border-[#0E9F8E] text-[#0E9F8E]' : 'border-transparent text-slate-500'
                }`}
              >
                Bahan Terpakai
              </button>
            </div>

            <form onSubmit={handleSaveLog} className="space-y-3 text-xs">
              {logType === 'work' ? (
                <>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Deskripsi Pekerjaan Terdampak
                    </label>
                    <input
                      type="text"
                      value={workDesc}
                      onChange={(e) => setWorkDesc(e.target.value)}
                      placeholder="Contoh: Amplas halus permukaan meja penyesuaian stain"
                      className="w-full border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-[#0E9F8E] focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Jumlah Jam Kerja Nyata
                    </label>
                    <input
                      type="number"
                      min="0.5"
                      step="0.5"
                      value={workHours}
                      onChange={(e) => setWorkHours(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-[#0E9F8E] focus:outline-none"
                      required
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Nama Material Terpakai
                    </label>
                    <input
                      type="text"
                      value={materialName}
                      onChange={(e) => setMaterialName(e.target.value)}
                      placeholder="Contoh: Papan kayu jati sampel atau kaleng cat"
                      className="w-full border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-[#0E9F8E] focus:outline-none"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Jumlah</label>
                      <input
                        type="number"
                        min="0.01"
                        step="any"
                        value={materialQty}
                        onChange={(e) => setMaterialQty(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg p-2"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Harga Satuan (Rp)</label>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={materialPrice}
                        onChange={(e) => setMaterialPrice(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg p-2"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Estimasi Nilai Daur Ulang (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={reusablePct}
                      onChange={(e) => setReusablePct(e.target.value)}
                      placeholder="0 - 100%"
                      className="w-full border border-slate-200 rounded-lg p-2"
                    />
                  </div>
                </>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setLogModalProjectId(null)}
                  className="px-3 py-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#0E9F8E] text-white font-semibold"
                >
                  Simpan Catatan Nyata
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default VendorDashboard;
