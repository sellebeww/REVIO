import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  Building2, 
  User, 
  ShieldCheck, 
  BarChart3, 
  Layers, 
  FolderKanban, 
  Eye, 
  FileText, 
  Sliders, 
  History, 
  Sparkles,
  ChevronDown,
  Volume2,
  VolumeX,
  Scale,
  Kanban
} from 'lucide-react';
import { SEED_PROJECTS, SEED_VENDORS, INITIAL_AUDIT_LOGS } from './data/mockSeedData';
import { Project, VendorProfile, ChangeOrder, WorkLog, MaterialLog, AuditLogItem } from './types/revio';
import RevioLogo from './components/brand/RevioLogo';
import CustomerProjectSpace from './components/customer/CustomerProjectSpace';
import VendorDashboard from './components/vendor/VendorDashboard';
import VendorPublicProfile from './components/vendor/VendorPublicProfile';
import VendorProfileEditor from './components/vendor/VendorProfileEditor';
import NewProjectModal from './components/vendor/NewProjectModal';
import AnalyticsView from './components/analytics/AnalyticsView';
import RevioCompanyProfile from './components/public/RevioCompanyProfile';
import NotificationBell from './components/notifications/NotificationBell';
import VisualFormulaExplorer from './components/calculator/VisualFormulaExplorer';
import WorkshopLiveBoard from './components/workshop/WorkshopLiveBoard';
import EvidencePackageModal from './components/dispute/EvidencePackageModal';
import { playLockClick, playSuccessChime, setSoundEnabled } from './lib/soundEffects';

export default function App() {
  const [projects, setProjects] = useState<Project[]>(SEED_PROJECTS);
  const [vendors, setVendors] = useState<VendorProfile[]>(SEED_VENDORS);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS);

  // Active view routing
  const [currentView, setCurrentView] = useState<
    'marketing' | 'customer_space' | 'vendor_dashboard' | 'vendor_public_profile' | 'analytics' | 'formula_explorer' | 'workshop_live'
  >('marketing');

  const [selectedProjectId, setSelectedProjectId] = useState<string>('proj-1');
  const [selectedVendorSlug, setSelectedVendorSlug] = useState<string>('bengkel-kayu-nusantara');
  
  // Editor & modal states
  const [isEditingVendorProfile, setIsEditingVendorProfile] = useState(false);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [soundActive, setSoundActive] = useState(true);

  // Toggle sound
  const toggleSound = () => {
    const next = !soundActive;
    setSoundActive(next);
    setSoundEnabled(next);
  };

  // Active items
  const currentProject = projects.find((p) => p.id === selectedProjectId) || projects[0];
  const currentVendor = vendors.find((v) => v.slug === selectedVendorSlug) || vendors[0];

  // Helper to add audit log
  const logAudit = (action: string, actor: string, actorRole: string, details: string, type: AuditLogItem['type']) => {
    const newLog: AuditLogItem = {
      id: `log-${Date.now().toString().slice(-4)}`,
      projectId: selectedProjectId,
      action,
      actor,
      actorRole,
      details,
      timestamp: new Date().toLocaleString('id-ID'),
      type,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Decision Lock action
  const handleLockDecision = (decisionId: string) => {
    playLockClick();
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== selectedProjectId) return proj;
        return {
          ...proj,
          decisions: proj.decisions.map((dec) => {
            if (dec.id !== decisionId) return dec;
            return {
              ...dec,
              status: 'terkunci',
              flexibilityScore: 0,
              lockedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              lockedBy: `${proj.customerName} (Hold-to-Lock)`,
            };
          }),
        };
      })
    );

    playSuccessChime();

    const targetDec = currentProject.decisions.find((d) => d.id === decisionId);
    logAudit(
      'Keputusan Dikunci',
      currentProject.customerName,
      'Pelanggan',
      `Menahan 1 detik untuk mengunci keputusan "${targetDec?.title}"`,
      'decision'
    );
  };

  // Decision Defer action
  const handleDeferDecision = (decisionId: string, stageId: string, fee: number, days: number) => {
    const targetStage = currentProject.stages.find((s) => s.id === stageId);

    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== selectedProjectId) return proj;
        return {
          ...proj,
          decisions: proj.decisions.map((dec) => {
            if (dec.id !== decisionId) return dec;
            return {
              ...dec,
              status: 'ditunda',
              flexibilityScore: Math.max(10, dec.flexibilityScore - 20),
              currentChangeCost: dec.currentChangeCost + fee,
              deferredUntilStageId: stageId,
              deferredUntilStageName: targetStage?.name || 'Tahap Berikutnya',
              deferredUntilDate: new Date(Date.now() + days * 86400000).toISOString().split('T')[0],
            };
          }),
        };
      })
    );

    logAudit(
      'Keputusan Ditunda',
      currentProject.customerName,
      'Pelanggan',
      `Menunda keputusan hingga tahap "${targetStage?.name}" dengan komitmen biaya fleksibilitas ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(fee)}`,
      'cost'
    );
  };

  // Submit Change Order
  const handleSubmitChangeOrder = (newOrderData: Partial<ChangeOrder>) => {
    const newId = `co-${Date.now().toString().slice(-3)}`;
    const completeOrder: ChangeOrder = {
      id: newId,
      projectId: selectedProjectId,
      decisionId: newOrderData.decisionId || 'dec-1',
      decisionTitle: newOrderData.decisionTitle || 'Keputusan',
      fromOption: newOrderData.fromOption || '',
      toOption: newOrderData.toOption || '',
      affectedWorkHours: newOrderData.affectedWorkHours || 4,
      affectedWorkCost: newOrderData.affectedWorkCost || 340000,
      wastedMaterialValue: newOrderData.wastedMaterialValue || 200000,
      reuseDeduction: newOrderData.reuseDeduction || 70000,
      rescheduleFee: newOrderData.rescheduleFee || 200000,
      totalCost: newOrderData.totalCost || 670000,
      scheduleImpactDays: newOrderData.scheduleImpactDays || 2,
      status: 'disetujui',
      requestedAt: new Date().toLocaleString('id-ID'),
      approvedAt: new Date().toLocaleString('id-ID'),
      approvedBy: `${currentProject.customerName} (Persetujuan Digital)`,
      expiresAt: new Date(Date.now() + 86400000 * 2).toLocaleString('id-ID'),
      notes: newOrderData.notes || 'Disetujui dengan rincian biaya transparan.',
    };

    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== selectedProjectId) return proj;
        return {
          ...proj,
          paidAmount: proj.paidAmount + completeOrder.totalCost,
          changeOrders: [completeOrder, ...proj.changeOrders],
          decisions: proj.decisions.map((dec) => {
            if (dec.id !== completeOrder.decisionId) return dec;
            return {
              ...dec,
              status: 'terkunci',
              lockedBy: `Change Order #${completeOrder.id}`,
            };
          }),
        };
      })
    );

    logAudit(
      'Change Order Disetujui',
      currentProject.customerName,
      'Pelanggan',
      `Persetujuan perubahan "${completeOrder.fromOption}" menjadi "${completeOrder.toOption}" senilai ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(completeOrder.totalCost)}`,
      'change_order'
    );
  };

  // Advance Stage in Vendor dashboard
  const handleAdvanceStage = (projectId: string, notes: string) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== projectId) return proj;
        const currentIdx = proj.stages.findIndex((s) => s.id === proj.currentStageId);
        if (currentIdx === -1 || currentIdx >= proj.stages.length - 1) return proj;

        const updatedStages = proj.stages.map((s, idx) => {
          if (idx === currentIdx) {
            return {
              ...s,
              status: 'completed' as const,
              actualEnd: new Date().toISOString().split('T')[0],
              lastUpdatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
          }
          if (idx === currentIdx + 1) {
            return {
              ...s,
              status: 'in_progress' as const,
              actualStart: new Date().toISOString().split('T')[0],
              lastUpdatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              notes: notes || s.notes,
            };
          }
          return s;
        });

        const nextStage = updatedStages[currentIdx + 1];

        return {
          ...proj,
          currentStageId: nextStage.id,
          currentStageName: nextStage.name,
          lastStageUpdatedHoursAgo: 0,
          stages: updatedStages,
        };
      })
    );

    logAudit(
      'Tahap Produksi Dimajukan',
      'Mandor Bengkel',
      'Staf Produksi',
      `Memajukan proyek "${currentProject.title}" ke tahap selanjutnya`,
      'stage'
    );
  };

  // Add Work Log
  const handleAddWorkLog = (projectId: string, log: Partial<WorkLog>) => {
    const newLogItem: WorkLog = {
      id: `wl-${Date.now().toString().slice(-4)}`,
      projectId,
      stageId: log.stageId || currentProject.currentStageId,
      stageName: log.stageName || currentProject.currentStageName,
      decisionId: log.decisionId || currentProject.decisions[0]?.id || 'dec-1',
      hours: log.hours || 2,
      rate: log.rate || 85000,
      description: log.description || 'Pekerjaan bengkel nyata',
      loggedBy: log.loggedBy || 'Tukang Produksi',
      loggedAt: new Date().toLocaleString('id-ID'),
    };

    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          workLogs: [newLogItem, ...p.workLogs],
          // Recalculate decision current change cost dynamically!
          decisions: p.decisions.map((dec) => {
            if (dec.id !== newLogItem.decisionId) return dec;
            return {
              ...dec,
              currentChangeCost: dec.currentChangeCost + newLogItem.hours * newLogItem.rate,
              flexibilityScore: Math.max(5, dec.flexibilityScore - 8),
            };
          }),
        };
      })
    );

    logAudit(
      'Catatan Jam Kerja Ditambahkan',
      newLogItem.loggedBy,
      'Staf Produksi',
      `${newLogItem.hours} jam kerja (${newLogItem.description}) dicatatkan pada keputusan terkait`,
      'cost'
    );
  };

  // Add Material Log
  const handleAddMaterialLog = (projectId: string, log: Partial<MaterialLog>) => {
    const newMatItem: MaterialLog = {
      id: `ml-${Date.now().toString().slice(-4)}`,
      projectId,
      decisionId: log.decisionId || currentProject.decisions[0]?.id || 'dec-1',
      material: log.material || 'Material Tambahan',
      quantity: log.quantity || 1,
      unit: log.unit || 'pcs',
      unitPrice: log.unitPrice || 150000,
      reusablePct: log.reusablePct || 0,
      loggedAt: new Date().toLocaleString('id-ID'),
    };

    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const wastedPortion = (newMatItem.quantity * newMatItem.unitPrice * (100 - newMatItem.reusablePct)) / 100;
        return {
          ...p,
          materialLogs: [newMatItem, ...p.materialLogs],
          decisions: p.decisions.map((dec) => {
            if (dec.id !== newMatItem.decisionId) return dec;
            return {
              ...dec,
              currentChangeCost: Math.round(dec.currentChangeCost + wastedPortion),
              flexibilityScore: Math.max(0, dec.flexibilityScore - 12),
            };
          }),
        };
      })
    );

    logAudit(
      'Catatan Bahan Terpakai Ditambahkan',
      'Mandor Bengkel',
      'Staf Produksi',
      `${newMatItem.quantity} ${newMatItem.unit} ${newMatItem.material} dicatat terhubung ke keputusan`,
      'cost'
    );
  };

  // Submit Review
  const handleSubmitReview = (rating: number, clarity: number, comment: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== selectedProjectId) return p;
        return {
          ...p,
          review: {
            id: `rev-${Date.now().toString().slice(-3)}`,
            projectId: p.id,
            customerName: p.customerName,
            rating,
            costClarityScore: clarity,
            comment,
            verified: true,
            createdAt: new Date().toISOString().split('T')[0],
          },
        };
      })
    );
  };

  // Create Project
  const handleCreateProject = (newProj: Project) => {
    setProjects([newProj, ...projects]);
    setSelectedProjectId(newProj.id);
    setCurrentView('customer_space');
    logAudit(
      'Proyek Baru Dibuat',
      'Bengkel Kayu Nusantara',
      'Pemilik Vendor',
      `Membuat proyek "${newProj.title}" dengan Peta Keputusan terintegrasi`,
      'stage'
    );
  };

  // Save Vendor Profile
  const handleSaveVendorProfile = (updated: VendorProfile) => {
    setVendors((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));
    setIsEditingVendorProfile(false);
  };

  return (
    <div className={`min-h-screen bg-[#FBF9F5] text-[#12203A] flex flex-col ${reducedMotion ? 'motion-reduce' : ''}`}>
      {/* Top Bar following Strict 3-Zone Contract:
          Zone 1: Single text element wordmark / brand mark
          Zone 2: 4-5 single-line clean text links with active underlines
          Zone 3: 1 primary CTA action or compact role switcher
      */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E7E2D9] px-4 sm:px-8 py-3.5 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
          {/* Zone 1: Brand Wordmark */}
          <div
            onClick={() => setCurrentView('marketing')}
            className="cursor-pointer shrink-0 flex items-center"
          >
            <RevioLogo size="sm" layout="horizontal" showTagline={false} />
          </div>

          {/* Zone 2: Navigation Links */}
          {currentView === 'marketing' ? (
            <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-[#5E6678]">
              <a
                href="#cara-kerja"
                className="hover:text-[#12203A] transition-colors whitespace-nowrap"
              >
                Cara Kerja
              </a>
              <a
                href="#fitur"
                className="hover:text-[#12203A] transition-colors whitespace-nowrap"
              >
                Fitur & Keputusan
              </a>
              <a
                href="#vendor"
                className="hover:text-[#12203A] transition-colors whitespace-nowrap"
              >
                Vendor Mitra
              </a>
              <a
                href="#harga"
                className="hover:text-[#12203A] transition-colors whitespace-nowrap"
              >
                Paket Harga
              </a>
            </nav>
          ) : (
            <nav className="hidden md:flex items-center gap-4 text-xs font-semibold text-[#5E6678]">
              <button
                onClick={() => setCurrentView('customer_space')}
                className={`px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                  currentView === 'customer_space'
                    ? 'bg-teal-50 text-[#0E9F8E] font-bold'
                    : 'hover:text-[#12203A]'
                }`}
              >
                Ruang Pelanggan
              </button>

              <button
                onClick={() => setCurrentView('vendor_dashboard')}
                className={`px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                  currentView === 'vendor_dashboard'
                    ? 'bg-teal-50 text-[#0E9F8E] font-bold'
                    : 'hover:text-[#12203A]'
                }`}
              >
                Dasbor Vendor
              </button>

              <button
                onClick={() => setCurrentView('workshop_live')}
                className={`px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1 ${
                  currentView === 'workshop_live'
                    ? 'bg-teal-50 text-[#0E9F8E] font-bold'
                    : 'hover:text-[#12203A]'
                }`}
              >
                <Kanban size={13} />
                <span>Papan Bengkel Live</span>
              </button>

              <button
                onClick={() => setCurrentView('formula_explorer')}
                className={`px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1 ${
                  currentView === 'formula_explorer'
                    ? 'bg-teal-50 text-[#0E9F8E] font-bold'
                    : 'hover:text-[#12203A]'
                }`}
              >
                <Sliders size={13} />
                <span>Kalkulator Rumus</span>
              </button>

              <button
                onClick={() => setCurrentView('analytics')}
                className={`px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                  currentView === 'analytics'
                    ? 'bg-teal-50 text-[#0E9F8E] font-bold'
                    : 'hover:text-[#12203A]'
                }`}
              >
                Validasi Dampak
              </button>

              <button
                onClick={() => {
                  setSelectedVendorSlug('bengkel-kayu-nusantara');
                  setCurrentView('vendor_public_profile');
                }}
                className={`px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                  currentView === 'vendor_public_profile'
                    ? 'bg-teal-50 text-[#0E9F8E] font-bold'
                    : 'hover:text-[#12203A]'
                }`}
              >
                Profil Bengkel (/v)
              </button>
            </nav>
          )}

          {/* Zone 3: Actions & Controls */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Audio Feedback Toggle */}
            <button
              onClick={toggleSound}
              title={soundActive ? 'Suara Taktil Aktif' : 'Suara Taktil Nonaktif'}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            >
              {soundActive ? <Volume2 size={16} className="text-[#0E9F8E]" /> : <VolumeX size={16} />}
            </button>

            {currentView === 'marketing' ? (
              <button
                onClick={() => setCurrentView('customer_space')}
                className="px-4 py-2 rounded-xl bg-[#0E9F8E] hover:bg-[#0A7A6D] text-white text-xs font-bold whitespace-nowrap transition-all shadow-xs flex items-center gap-1.5"
              >
                <span>Masuk ke Demo</span>
                <span className="text-white/80">→</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                {/* Notification Bell in demo mode */}
                <NotificationBell
                  onSelectProject={(id) => {
                    setSelectedProjectId(id);
                    setCurrentView('customer_space');
                  }}
                />

                {/* Project selector in demo mode */}
                <div className="relative">
                  <select
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                    className="bg-slate-100 hover:bg-slate-200 border-none text-[11px] font-semibold text-slate-800 rounded-lg px-2 py-1.5 focus:ring-1 focus:ring-[#0E9F8E] focus:outline-none cursor-pointer max-w-[140px] truncate"
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.id}: {p.title.split(' ')[0]} {p.title.split(' ')[1]}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Return to website */}
                <button
                  onClick={() => setCurrentView('marketing')}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold whitespace-nowrap transition-colors"
                >
                  ← Web Publik
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area with AnimatePresence Transitions */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView === 'vendor_public_profile' ? `${currentView}-${selectedVendorSlug}` : currentView}
            initial={{ opacity: 0, y: reducedMotion ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reducedMotion ? 0 : -10 }}
            transition={{
              duration: reducedMotion ? 0.01 : 0.22,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="w-full"
          >
            {/* View 1: Marketing / Revio Company Profile */}
            {currentView === 'marketing' && (
              <RevioCompanyProfile
                vendors={vendors}
                onOpenVendorProfile={(slug) => {
                  setSelectedVendorSlug(slug);
                  setCurrentView('vendor_public_profile');
                }}
                onOpenAppDemo={() => setCurrentView('vendor_dashboard')}
                onOpenCustomerSpace={(pId) => {
                  setSelectedProjectId(pId);
                  setCurrentView('customer_space');
                }}
              />
            )}

            {/* View 2: Customer Project Space */}
            {currentView === 'customer_space' && (
              <CustomerProjectSpace
                project={currentProject}
                onLockDecision={handleLockDecision}
                onDeferDecision={handleDeferDecision}
                onSubmitChangeOrder={handleSubmitChangeOrder}
                onSubmitReview={handleSubmitReview}
              />
            )}

            {/* View 3: Vendor Admin & Staff Dashboard */}
            {currentView === 'vendor_dashboard' && (
              <>
                {isEditingVendorProfile ? (
                  <VendorProfileEditor
                    initialVendor={currentVendor}
                    onSave={handleSaveVendorProfile}
                    onClose={() => setIsEditingVendorProfile(false)}
                  />
                ) : (
                  <VendorDashboard
                    vendor={currentVendor}
                    projects={projects}
                    onSelectProject={(id) => {
                      setSelectedProjectId(id);
                      setCurrentView('customer_space');
                    }}
                    onAdvanceStage={(id, notes) => handleAdvanceStage(id, notes)}
                    onAddWorkLog={(id, log) => handleAddWorkLog(id, log)}
                    onAddMaterialLog={(id, log) => handleAddMaterialLog(id, log)}
                    onOpenProfileEditor={() => setIsEditingVendorProfile(true)}
                    onOpenNewProject={() => setIsNewProjectModalOpen(true)}
                  />
                )}
              </>
            )}

            {/* View 4: Workshop Live Board */}
            {currentView === 'workshop_live' && (
              <WorkshopLiveBoard
                project={currentProject}
                onAdvanceStage={(id, notes) => handleAdvanceStage(id, notes)}
              />
            )}

            {/* View 5: Visual Formula Explorer */}
            {currentView === 'formula_explorer' && <VisualFormulaExplorer />}

            {/* View 6: Vendor Public Profile (/v/:slug) */}
            {currentView === 'vendor_public_profile' && (
              <VendorPublicProfile
                vendor={currentVendor}
                onRequestQuote={() => setCurrentView('customer_space')}
                onBackToDirectory={() => setCurrentView('marketing')}
              />
            )}

            {/* View 7: Analytics & Impact Validation */}
            {currentView === 'analytics' && <AnalyticsView />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Audit Log Modal */}
      {showAuditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <History size={18} className="text-[#0E9F8E]" />
                <h3 className="font-display font-bold text-base text-slate-900">
                  Log Audit & Stempel Waktu Permanen
                </h3>
              </div>
              <button
                onClick={() => setShowAuditModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Setiap perubahan status tahap, penguncian keputusan, persetujuan biaya, dan bukti foto dicatat dengan stempel waktu permanen dan tidak dapat dihapus.
            </p>

            <div className="overflow-y-auto space-y-2.5 divide-y divide-slate-100 pr-1 flex-1">
              {auditLogs.map((log) => (
                <div key={log.id} className="pt-2.5 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{log.action}</span>
                    <span className="font-mono text-[10px] text-slate-400">{log.timestamp}</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">{log.details}</p>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <span>Pelaku: <strong>{log.actor}</strong> ({log.actorRole})</span>
                    <span>·</span>
                    <span className="uppercase font-mono">{log.type}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowAuditModal(false)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
              >
                Tutup Log
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Forensic Evidence Package Dossier Modal */}
      <EvidencePackageModal
        project={currentProject}
        isOpen={showEvidenceModal}
        onClose={() => setShowEvidenceModal(false)}
      />

      {/* New Project Modal */}
      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
        onCreateProject={handleCreateProject}
      />

      {/* Quiet, Accessible Footer */}
      <footer className="border-t border-[#E7E2D9] bg-white py-8 px-4 sm:px-8 text-xs text-[#5E6678] mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <RevioLogo size="xs" layout="horizontal" showTagline={false} />
            <span className="text-slate-400">·</span>
            <span>Hak Revisi & Biaya Produksi Pesanan © 2026 Revio Indonesia.</span>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={() => setShowEvidenceModal(true)}
              className="hover:text-slate-900 transition-colors flex items-center gap-1 font-semibold text-[#0E9F8E]"
            >
              <Scale size={13} />
              <span>Berkas Bukti Sengketa ({currentProject.id.toUpperCase()})</span>
            </button>

            <button
              onClick={() => setShowAuditModal(true)}
              className="hover:text-slate-900 transition-colors flex items-center gap-1 font-medium"
            >
              <History size={13} />
              <span>Log Audit ({auditLogs.length})</span>
            </button>

            <button
              onClick={() => setReducedMotion(!reducedMotion)}
              className="hover:text-slate-900 transition-colors"
            >
              {reducedMotion ? 'Gerak Normal' : 'Kurangi Animasi'}
            </button>

            <span className="text-slate-300">|</span>
            <span className="text-slate-500">Standar UU PDP</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
