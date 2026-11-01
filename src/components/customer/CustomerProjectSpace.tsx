import React, { useState } from 'react';

import { Clock, ShieldCheck, FileText, CheckCircle2, MessageSquare, Layers, Star } from 'lucide-react';
import { Project, Decision, ChangeOrder } from '../../types/revio';
import DecisionCard from '../decisions/DecisionCard';
import SelfDrawingTimeline from '../motion/SelfDrawingTimeline';
import ChangeOrderModal from '../changeorder/ChangeOrderModal';
import ChangeOrderDocument from '../changeorder/ChangeOrderDocument';

interface CustomerProjectSpaceProps {
  project: Project;
  onLockDecision: (decisionId: string) => void;
  onDeferDecision: (decisionId: string, stageId: string, fee: number, days: number) => void;
  onSubmitChangeOrder: (newOrder: Partial<ChangeOrder>) => void;
  onSubmitReview?: (rating: number, clarity: number, comment: string) => void;
}

export const CustomerProjectSpace: React.FC<CustomerProjectSpaceProps> = ({
  project,
  onLockDecision,
  onDeferDecision,
  onSubmitChangeOrder,
  onSubmitReview,
}) => {
  const [activeTab, setActiveTab] = useState<'decisions' | 'timeline' | 'change_orders' | 'review'>('decisions');
  const [selectedDecisionForChange, setSelectedDecisionForChange] = useState<Decision | null>(null);
  const [viewingChangeOrder, setViewingChangeOrder] = useState<ChangeOrder | null>(null);

  // Review state
  const [rating, setRating] = useState(5);
  const [clarityScore, setClarityScore] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmitReview) {
      onSubmitReview(rating, clarityScore, reviewComment);
    }
    setReviewSubmitted(true);
  };

  const completedStagesCount = project.stages.filter((s) => s.status === 'completed').length;
  const progressPct = Math.round((completedStagesCount / project.stages.length) * 100);

  // WhatsApp link template
  const waMessage = encodeURIComponent(
    `Halo ${project.vendorName}, saya ${project.customerName} terkait proyek "${project.title}" di Revio (ID: ${project.id}). Mohon update mengenai tahap ${project.currentStageName}.`
  );
  const waUrl = `https://wa.me/6281234567890?text=${waMessage}`;

  return (
    <div className="space-y-6">
      {/* Project Banner & Status */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Ruang Proyek Pelanggan
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-[#0E9F8E] font-medium">
                Vendor: {project.vendorName}
              </span>
            </div>
            <h1 className="font-display font-extrabold text-2xl text-slate-900">
              {project.title}
            </h1>
            <p className="text-xs text-slate-600 max-w-2xl">
              {project.description}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors"
            >
              <MessageSquare size={14} />
              <span>WhatsApp Vendor</span>
            </a>
          </div>
        </div>

        {/* Progress & Freshness Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
            <span className="text-xs uppercase font-bold text-slate-400">Tahap Berjalan</span>
            <p className="text-xs font-bold text-slate-800 mt-0.5 truncate">
              {project.currentStageName}
            </p>
            <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
              <Clock size={12} className="text-amber-500" />
              <span>Diperbarui {project.lastStageUpdatedHoursAgo} jam lalu</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
            <span className="text-xs uppercase font-bold text-slate-400">Progres Keseluruhan</span>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#0E9F8E] h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <span className="text-xs font-bold font-mono text-slate-800">{progressPct}%</span>
            </div>
            <span className="text-xs text-slate-400 mt-1 block">
              {completedStagesCount} dari {project.stages.length} tahap selesai
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
            <span className="text-xs uppercase font-bold text-slate-400">Nilai Kontrak Proyek</span>
            <p className="text-xs font-mono font-bold text-slate-900 mt-0.5 tabular-nums">
              {formatIDR(project.valueAmount)}
            </p>
            <span className="text-xs text-emerald-700 font-medium">
              DP Terbayar: {formatIDR(project.paidAmount)}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200 pb-px overflow-x-auto">
        <button
          onClick={() => setActiveTab('decisions')}
          className={`px-4 py-2 text-xs font-semibold rounded-t-xl transition-colors shrink-0 flex items-center gap-1.5 ${
            activeTab === 'decisions'
              ? 'bg-white border-t border-x border-slate-200 text-[#0E9F8E] -mb-px'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers size={14} />
          <span>Peta Keputusan & Fleksibilitas ({project.decisions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('timeline')}
          className={`px-4 py-2 text-xs font-semibold rounded-t-xl transition-colors shrink-0 flex items-center gap-1.5 ${
            activeTab === 'timeline'
              ? 'bg-white border-t border-x border-slate-200 text-[#0E9F8E] -mb-px'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock size={14} />
          <span>Garis Waktu Tahap ({project.stages.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('change_orders')}
          className={`px-4 py-2 text-xs font-semibold rounded-t-xl transition-colors shrink-0 flex items-center gap-1.5 ${
            activeTab === 'change_orders'
              ? 'bg-white border-t border-x border-slate-200 text-[#0E9F8E] -mb-px'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText size={14} />
          <span>Change Orders ({project.changeOrders.length})</span>
        </button>

        {project.status === 'selesai' && (
          <button
            onClick={() => setActiveTab('review')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-xl transition-colors shrink-0 flex items-center gap-1.5 ${
              activeTab === 'review'
                ? 'bg-white border-t border-x border-slate-200 text-[#0E9F8E] -mb-px'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Star size={14} />
            <span>Penilaian Kejelasan Biaya</span>
          </button>
        )}
      </div>

      {/* Tab 1: Decision Map */}
      {activeTab === 'decisions' && (
        <div className="space-y-4">
          <div className="bg-emerald-50/70 border border-emerald-200/60 p-4 rounded-xl flex items-start gap-2.5 text-xs text-emerald-900">
            <ShieldCheck size={18} className="text-[#0E9F8E] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Prinsip Keadilan Revio:</strong> Anda bebas mengubah keputusan selama tahap produksi belum melewati Titik Kunci. Setelah melewati titik kunci, biaya perubahan hanya dihitung dari jam kerja dan bahan yang terlanjur terpakai berdasarkan bukti nyata.
            </p>
          </div>

          <div className="space-y-4">
            {project.decisions.map((decision) => (
              <DecisionCard
                key={decision.id}
                decision={decision}
                stages={project.stages}
                workLogs={project.workLogs}
                materialLogs={project.materialLogs}
                onLock={onLockDecision}
                onDefer={onDeferDecision}
                onRequestChange={(d) => setSelectedDecisionForChange(d)}
                isCustomerView={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Stages Timeline */}
      {activeTab === 'timeline' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-display font-bold text-base text-slate-900">
                Garis Waktu Tahap Pengerjaan
              </h3>
              <p className="text-xs text-slate-500">
                Lacak setiap tahap produksi dari bengkel secara transparan
              </p>
            </div>
          </div>
          <SelfDrawingTimeline stages={project.stages} />
        </div>
      )}

      {/* Tab 3: Change Orders */}
      {activeTab === 'change_orders' && (
        <div className="space-y-4">
          {viewingChangeOrder ? (
            <ChangeOrderDocument
              changeOrder={viewingChangeOrder}
              project={project}
              onClose={() => setViewingChangeOrder(null)}
            />
          ) : project.changeOrders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <FileText size={22} />
              </div>
              <h4 className="font-display font-bold text-slate-800 text-sm">
                Belum Ada Change Order
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Semua keputusan masih berjalan sesuai rencana awal tanpa penambahan atau pembongkaran pekerjaan.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {project.changeOrders.map((co) => (
                <div
                  key={co.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-800 uppercase">
                        {co.id}
                      </span>
                      <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-800">
                        {co.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-900">
                      {co.decisionTitle}: {co.fromOption} → {co.toOption}
                    </p>
                    <p className="text-xs text-slate-500">{co.notes}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="font-mono text-sm font-bold text-slate-900 block tabular-nums">
                        {formatIDR(co.totalCost)}
                      </span>
                      <span className="text-xs text-slate-500">
                        Jadwal +{co.scheduleImpactDays} hari
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setViewingChangeOrder(co)}
                      className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
                    >
                      Buka Dokumen
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Review */}
      {activeTab === 'review' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-xl mx-auto space-y-5">
          <div className="text-center space-y-1">
            <h3 className="font-display font-bold text-lg text-slate-900">
              Evaluasi & Kejelasan Biaya Pelanggan
            </h3>
            <p className="text-xs text-slate-500">
              Bagaimana pengalaman transparansi biaya dan revisi Anda di proyek ini?
            </p>
          </div>

          {project.review || reviewSubmitted ? (
            <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
              <CheckCircle2 size={28} className="text-emerald-600 mx-auto" />
              <h4 className="font-bold text-emerald-950 text-sm">Terima Kasih Atas Ulasan Anda!</h4>
              <p className="text-xs text-emerald-800">
                Ulasan Anda memperkuat <strong>Lencana Kepastian</strong> untuk {project.vendorName}.
              </p>
            </div>
          ) : (
            <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1.5">
                  Seberapa Jelas & Terbuka Biaya Revisi Dijelaskan? (Skor 1 - 5)
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setClarityScore(val)}
                      className={`w-10 h-10 rounded-xl font-bold flex items-center justify-center transition-all ${
                        clarityScore === val
                          ? 'bg-[#0E9F8E] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1.5">
                  Rating Kepuasan Hasil Pekerjaan (Bintang 1 - 5)
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Star
                        size={24}
                        fill={star <= rating ? 'currentColor' : 'none'}
                        stroke="currentColor"
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Testimoni & Pengalaman Anda
                </label>
                <textarea
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Ceritakan bagaimana kejelasan titik kunci dan transparansi Revio membantu Anda..."
                  className="w-full border border-slate-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-[#0E9F8E] focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#0E9F8E] hover:bg-[#0A7A6D] text-white font-bold text-xs shadow-xs transition-colors"
              >
                Kirim Ulasan Terverifikasi
              </button>
            </form>
          )}
        </div>
      )}

      {/* Change Order Creation Modal */}
      <ChangeOrderModal
        decision={selectedDecisionForChange}
        workLogs={project.workLogs}
        materialLogs={project.materialLogs}
        isOpen={!!selectedDecisionForChange}
        onClose={() => setSelectedDecisionForChange(null)}
        onSubmitChangeOrder={onSubmitChangeOrder}
      />
    </div>
  );
};

export default CustomerProjectSpace;
