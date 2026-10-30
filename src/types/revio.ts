export type UserRole = 
  | 'vendor_owner' 
  | 'vendor_admin' 
  | 'production_staff' 
  | 'customer' 
  | 'platform_admin';

export type DecisionStatus = 
  | 'fleksibel' 
  | 'mendekati_kunci' 
  | 'terkunci' 
  | 'ditunda';

export interface DecisionOption {
  id: string;
  label: string;
  description?: string;
  previewUrl?: string;
}

export interface Decision {
  id: string;
  projectId: string;
  title: string;
  description: string;
  options: DecisionOption[];
  chosenOption: string;
  lockStageId: string;
  lockStageName: string;
  status: DecisionStatus;
  flexibilityScore: number; // 0 to 100
  currentChangeCost: number; // in IDR
  deadlineAt: string;
  lockedAt?: string;
  lockedBy?: string;
  deferredUntilStageId?: string;
  deferredUntilStageName?: string;
  deferredUntilDate?: string;
  whyExpensive: string; // Explains what work/materials get wasted if changed past lock point
  hourlyRate: number;
  rescheduleFee: number;
}

export interface ProductionStage {
  id: string;
  projectId: string;
  name: string;
  order: number;
  status: 'pending' | 'in_progress' | 'completed';
  plannedStart: string;
  plannedEnd: string;
  actualStart?: string;
  actualEnd?: string;
  lastUpdatedAt: string;
  updatedBy: string;
  notes?: string;
  photos?: string[];
  lockPointForTitles?: string[];
}

export interface WorkLog {
  id: string;
  projectId: string;
  stageId: string;
  stageName: string;
  decisionId: string;
  hours: number;
  rate: number;
  description: string;
  loggedBy: string;
  loggedAt: string;
  photoUrl?: string;
}

export interface MaterialLog {
  id: string;
  projectId: string;
  decisionId: string;
  material: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  reusablePct: number; // 0-100%
  loggedAt: string;
}

export interface ChangeOrder {
  id: string;
  projectId: string;
  decisionId: string;
  decisionTitle: string;
  fromOption: string;
  toOption: string;
  affectedWorkHours: number;
  affectedWorkCost: number;
  wastedMaterialValue: number;
  reuseDeduction: number;
  rescheduleFee: number;
  totalCost: number;
  scheduleImpactDays: number;
  status: 'diajukan' | 'disetujui' | 'ditolak';
  requestedAt: string;
  approvedAt?: string;
  approvedBy?: string;
  expiresAt: string;
  notes: string;
}

export interface ProjectReview {
  id: string;
  projectId: string;
  customerName: string;
  rating: number; // 1-5
  costClarityScore: number; // 1-5
  comment: string;
  verified: boolean;
  createdAt: string;
}

export interface Project {
  id: string;
  vendorId: string;
  vendorName: string;
  vendorSlug: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  title: string;
  description: string;
  valueAmount: number; // IDR total value
  depositAmount: number;
  paidAmount: number;
  status: 'aktif' | 'selesai' | 'sengketa';
  category: 'furnitur' | 'percetakan' | 'dekorasi' | 'konveksi';
  startsOn: string;
  dueOn: string;
  flexibilityThresholdPct: number; // e.g., 5%
  currentStageId: string;
  currentStageName: string;
  lastStageUpdatedHoursAgo: number;
  stages: ProductionStage[];
  decisions: Decision[];
  workLogs: WorkLog[];
  materialLogs: MaterialLog[];
  changeOrders: ChangeOrder[];
  review?: ProjectReview;
}

export interface VendorPortfolioItem {
  id: string;
  title: string;
  description: string;
  category: string;
  materials: string;
  durationDays: number;
  imageUrl: string;
}

export interface VendorProfile {
  id: string;
  name: string;
  slug: string;
  category: string;
  city: string;
  logoUrl?: string;
  tagline: string;
  about: string;
  foundedYear: number;
  certifiedBadgeLevel: 'platinum' | 'gold' | 'silver';
  transparencyScore: number; // 0-100
  onTimeLockRate: number; // e.g. 96%
  lowDisputeRate: number; // e.g. 99%
  leadDaysAvg: number;
  coverageArea: string;
  whatsappPhone: string;
  email: string;
  address: string;
  workingHours: string;
  services: {
    title: string;
    description: string;
    materials: string;
    avgDays: number;
  }[];
  portfolio: VendorPortfolioItem[];
  accentColor: string;
  template: 'classic' | 'modern' | 'minimal';
}

export interface HistoricalBenchmark {
  id: string;
  projectName: string;
  category: string;
  projectValue: number;
  reworkHoursWithoutRevio: number;
  reworkHoursWithRevio: number;
  wastedMaterialCostWithoutRevio: number;
  wastedMaterialCostWithRevio: number;
  disputesWithoutRevio: number;
  disputesWithRevio: number;
  costClarityScore: number;
}

export interface AuditLogItem {
  id: string;
  projectId: string;
  action: string;
  actor: string;
  actorRole: string;
  details: string;
  timestamp: string;
  type: 'stage' | 'decision' | 'change_order' | 'cost' | 'dispute';
}
