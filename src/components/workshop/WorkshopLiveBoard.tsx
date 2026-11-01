import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  Camera, 
  User, 
  ArrowRight, 
  ChevronRight,
  Sparkles,
  ShieldAlert,
  Plus
} from 'lucide-react';
import { Project, ProductionStage } from '../../types/revio';
import { playLockClick, playSuccessChime } from '../../lib/soundEffects';
import Modal from '../ui/Modal';

interface WorkshopLiveBoardProps {
  project: Project;
  onAdvanceStage: (projectId: string, note: string) => void;
}

export const WorkshopLiveBoard: React.FC<WorkshopLiveBoardProps> = ({
  project,
  onAdvanceStage,
}) => {
  const [activePhotoModal, setActivePhotoModal] = useState<string | null>(null);
  const [advancingNote, setAdvancingNote] = useState('');
  const [showAdvancePrompt, setShowAdvancePrompt] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(3840); // simulated running stage timer

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSec: number) => {
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const currentStage = project.stages.find((s) => s.id === project.currentStageId) || project.stages[0];
  const isFreshnessWarning = project.lastStageUpdatedHoursAgo > 24;

  const handleConfirmAdvance = () => {
    playLockClick();
    onAdvanceStage(project.id, advancingNote || 'Tahap produksi selesai dan divalidasi oleh mandor.');
    setShowAdvancePrompt(false);
    setAdvancingNote('');
    playSuccessChime();
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0E9F8E] bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
              Papan Produksi Bengkel (Workshop Live Board)
            </span>
            {isFreshnessWarning ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200 animate-pulse">
                <ShieldAlert size={13} />
                Peringatan: Tahap Belum Diperbarui &gt;24 Jam!
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                <CheckCircle2 size={13} className="text-emerald-600" />
                Data Tahap Segar & Terkini
              </span>
            )}
          </div>
          <h2 className="font-display font-extrabold text-xl text-slate-900 mt-1">
            {project.title}
          </h2>
          <p className="text-xs text-slate-500">
            Mandor & tukang memperbarui progres nyata dengan stempel waktu terverifikasi.
          </p>
        </div>

        {/* Live Timer Pill */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-slate-900 text-white flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <div>
              <span className="text-xs text-slate-400 block font-semibold uppercase">Waktu Tahap Aktif</span>
              <span className="font-mono text-base font-bold text-teal-300 tabular-nums">
                {formatTimer(elapsedSeconds)}
              </span>
            </div>
          </div>

          <button
            onClick={() => setShowAdvancePrompt(true)}
            className="px-4 py-3 rounded-2xl bg-[#0E9F8E] hover:bg-[#0A7A6D] text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 shrink-0"
          >
            <span>Majukan Tahap</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Interactive Stage Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Column 1: Selesai */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-600" />
              Tahap Selesai ({project.stages.filter((s) => s.status === 'completed').length})
            </span>
          </div>
          <div className="space-y-2.5">
            {project.stages
              .filter((s) => s.status === 'completed')
              .map((stg) => (
                <div
                  key={stg.id}
                  className="bg-white p-3.5 rounded-xl border border-slate-200/80 text-xs space-y-2 shadow-2xs"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-xs font-bold text-slate-400">
                      Tahap #{stg.order}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      Selesai
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900">{stg.name}</h4>
                  {stg.notes && <p className="text-xs text-slate-500 leading-tight">{stg.notes}</p>}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs text-slate-400">
                    <span>Oleh: {stg.updatedBy || 'Mandor'}</span>
                    <span>{stg.lastUpdatedAt}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Column 2: Sedang Dikerjakan (In Progress) */}
        <div className="bg-amber-50/50 rounded-2xl p-4 border-2 border-amber-300 space-y-3 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-amber-200">
            <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
              <Clock size={14} className="text-amber-600 animate-spin" />
              Sedang Berjalan di Bengkel
            </span>
            <span className="text-xs bg-amber-400/20 text-amber-800 font-bold px-2 py-0.5 rounded">
              Aktif
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-amber-200 text-xs space-y-3 shadow-xs">
            <div className="flex justify-between items-center">
              <span className="font-mono text-xs font-bold text-amber-700">
                Tahap #{currentStage.order}
              </span>
              <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Dalam Pengerjaan
              </span>
            </div>

            <h4 className="font-display font-bold text-sm text-slate-900">
              {currentStage.name}
            </h4>

            {currentStage.lockPointForTitles && (
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-950 text-xs space-y-1">
                <span className="font-bold flex items-center gap-1 text-amber-800">
                  <Lock size={12} />
                  Titik Kunci Aktif
                </span>
                <p>Keputusan "{currentStage.lockPointForTitles.join(', ')}" akan terkunci permanen setelah tahap ini berakhir.</p>
              </div>
            )}

            {currentStage.photos && currentStage.photos.length > 0 && (
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-400 uppercase">Foto Bukti Terakhir</span>
                <div className="relative aspect-video rounded-lg overflow-hidden border border-slate-200 group cursor-pointer" onClick={() => setActivePhotoModal(currentStage.photos![0])}>
                  <img loading="lazy" decoding="async"
                    src={currentStage.photos[0]}
                    alt="Foto Progres"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                    <Camera size={14} />
                    <span>Perbesar Bukti</span>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Mandor: <strong>{currentStage.updatedBy || 'Tukang Produksi'}</strong></span>
              <span>Update: {currentStage.lastUpdatedAt}</span>
            </div>
          </div>
        </div>

        {/* Column 3: Tahap Menunggu (Pending) */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="text-xs font-bold text-slate-600">
              Menunggu Antrean ({project.stages.filter((s) => s.status === 'pending').length})
            </span>
          </div>

          <div className="space-y-2.5">
            {project.stages
              .filter((s) => s.status === 'pending')
              .map((stg) => (
                <div
                  key={stg.id}
                  className="bg-white/80 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1.5 opacity-90"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-xs text-slate-400">
                      Tahap #{stg.order}
                    </span>
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      Antre
                    </span>
                  </div>
                  <h4 className="font-semibold text-slate-800">{stg.name}</h4>
                  {stg.lockPointForTitles && (
                    <span className="inline-flex items-center gap-1 text-xs text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                      <Lock size={10} />
                      Kunci: {stg.lockPointForTitles[0]}
                    </span>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Advance Stage Modal Prompt */}
      {showAdvancePrompt && (
        <Modal onClose={() => setShowAdvancePrompt(false)} label="Konfirmasi penyelesaian tahap">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h4 className="font-display font-bold text-sm text-slate-900">
                Konfirmasi Penyelesaian Tahap: {currentStage.name}
              </h4>
              <button onClick={() => setShowAdvancePrompt(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Memajukan tahap akan memperbarui stempel waktu real-time dan menutup jendela revisi untuk keputusan yang terhubung ke titik kunci ini.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Catatan Pekerjaan Mandor
              </label>
              <textarea
                rows={3}
                value={advancingNote}
                onChange={(e) => setAdvancingNote(e.target.value)}
                placeholder="Contoh: Kayu selesai diamplas grid 240, siap masuk bilik semprot..."
                className="w-full border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-[#0E9F8E] focus:outline-none"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setShowAdvancePrompt(false)}
                className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-xl"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmAdvance}
                className="px-5 py-2 bg-[#0E9F8E] hover:bg-[#0A7A6D] text-white font-bold rounded-xl flex items-center gap-1.5"
              >
                <CheckCircle2 size={14} />
                <span>Simpan & Buka Tahap Selanjutnya</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Photo Lightbox */}
      {activePhotoModal && (
        <Modal onClose={() => setActivePhotoModal(null)} label="Foto bukti">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="relative aspect-video bg-black">
              <img loading="lazy" decoding="async"
                src={activePhotoModal}
                alt="Bukti Foto"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <button
                onClick={() => setActivePhotoModal(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-900/80 text-white font-bold flex items-center justify-center"
              >
                ✕
              </button>
            </div>
            <div className="p-4 text-xs flex justify-between items-center text-slate-600">
              <div className="flex items-center gap-1.5">
                <Camera size={14} className="text-[#0E9F8E]" />
                <span>Foto Inspeksi Lapangan Terverifikasi Stempel Waktu Revio</span>
              </div>
              <span className="font-mono text-slate-400">UUID: {project.id}-IMG</span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default WorkshopLiveBoard;
