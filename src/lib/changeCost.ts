import type { Decision, MaterialLog, WorkLog } from '../types/revio';

/**
 * Rumus biaya perubahan (DECISIONS.md #2):
 * Biaya = (Jam x Tarif) + Bahan Terbuang + Biaya Jadwal
 * dengan Bahan Terbuang = Bahan Terpakai - Deduksi Pakai Ulang.
 */

export interface ChangeOrderBreakdown {
  hasEvidence: boolean;
  affectedWorkHours: number;
  affectedWorkCost: number;
  rawMaterialValue: number;
  wastedMaterialValue: number;
  reuseDeduction: number;
  rescheduleFee: number;
  totalCost: number;
  scheduleImpactDays: number;
}

/** Biaya change order dihitung hanya dari catatan kerja/bahan milik keputusan ini. */
export function computeChangeOrderBreakdown(
  decision: Pick<Decision, 'id' | 'hourlyRate' | 'rescheduleFee'>,
  workLogs: WorkLog[],
  materialLogs: MaterialLog[],
): ChangeOrderBreakdown {
  const relevantWork = workLogs.filter((w) => w.decisionId === decision.id);
  const relevantMaterials = materialLogs.filter((m) => m.decisionId === decision.id);
  const hasEvidence = relevantWork.length > 0 || relevantMaterials.length > 0;

  const affectedWorkHours = relevantWork.reduce((acc, curr) => acc + curr.hours, 0);
  const affectedWorkCost = affectedWorkHours * decision.hourlyRate;

  const rawMaterialValue = relevantMaterials.reduce((acc, m) => acc + m.quantity * m.unitPrice, 0);
  const wastedMaterialValue = Math.round(
    relevantMaterials.reduce((acc, m) => acc + (m.quantity * m.unitPrice * (100 - m.reusablePct)) / 100, 0),
  );
  const reuseDeduction = rawMaterialValue - wastedMaterialValue;
  const rescheduleFee = hasEvidence ? decision.rescheduleFee : 0;
  const totalCost = affectedWorkCost + wastedMaterialValue + rescheduleFee;
  const scheduleImpactDays = Math.ceil(affectedWorkHours / 8);

  return {
    hasEvidence,
    affectedWorkHours,
    affectedWorkCost,
    rawMaterialValue,
    wastedMaterialValue,
    reuseDeduction,
    rescheduleFee,
    totalCost,
    scheduleImpactDays,
  };
}

export interface FormulaInput {
  hours: number;
  rate: number;
  materialCost: number;
  reusePct: number;
  rescheduleFee: number;
  projectValue: number;
}

export interface FormulaBreakdown {
  workCost: number;
  salvageValue: number;
  netMaterialCost: number;
  totalChangeCost: number;
  /** Persentase dari nilai proyek, 1 desimal (string seperti toFixed). */
  impactPct: string;
  isHighImpact: boolean;
}

/** Kalkulator rumus (halaman Kalkulator Rumus). */
export function computeFormulaBreakdown(i: FormulaInput): FormulaBreakdown {
  const workCost = i.hours * i.rate;
  const salvageValue = Math.round((i.materialCost * i.reusePct) / 100);
  const netMaterialCost = i.materialCost - salvageValue;
  const totalChangeCost = workCost + netMaterialCost + i.rescheduleFee;

  // Nilai proyek 0 (atau tidak valid) membuat persentase tak terdefinisi: tampilkan 0,0
  // alih-alih "Infinity"/"NaN".
  const impactPct = (i.projectValue > 0 ? (totalChangeCost / i.projectValue) * 100 : 0).toFixed(1);
  const isHighImpact = Number(impactPct) > 15;

  return { workCost, salvageValue, netMaterialCost, totalChangeCost, impactPct, isHighImpact };
}

export interface DeferralSimulation {
  stepsAhead: number;
  baseHoldingFee: number;
  addedBufferCost: number;
  simulatedFlexibilityScore: number;
  totalSimulatedFee: number;
  simulatedScheduleImpactDays: number;
}

/** Simulasi tunda: tiap tahap ke depan menambah penyangga biaya dan jadwal. */
export function simulateDeferral(
  decision: Pick<Decision, 'flexibilityScore' | 'rescheduleFee'>,
  selectedStageIndex: number,
): DeferralSimulation {
  const stepsAhead = selectedStageIndex + 1;
  const simulatedFlexibilityScore = Math.max(5, Math.round(decision.flexibilityScore - stepsAhead * 22));
  const addedBufferCost = stepsAhead * 250000;
  const baseHoldingFee = decision.rescheduleFee;
  const totalSimulatedFee = baseHoldingFee + addedBufferCost;
  const simulatedScheduleImpactDays = stepsAhead * 3;
  return { stepsAhead, baseHoldingFee, addedBufferCost, simulatedFlexibilityScore, totalSimulatedFee, simulatedScheduleImpactDays };
}
