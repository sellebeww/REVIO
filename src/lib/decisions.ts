import type { Decision, MaterialLog, WorkLog } from '../types/revio';

const DAY_MS = 86400000;

/** Tanggal ISO (YYYY-MM-DD, UTC) untuk `now` + `days` hari. */
export function addDaysISO(now: number, days: number): string {
  return new Date(now + days * DAY_MS).toISOString().split('T')[0];
}

/** Kunci keputusan: status terkunci dan skor fleksibilitas 0. */
export function lockDecision(dec: Decision, lockedAt: string, lockedBy: string): Decision {
  return { ...dec, status: 'terkunci', flexibilityScore: 0, lockedAt, lockedBy };
}

/** Tunda keputusan ke tahap tertentu dengan biaya komitmen `fee`. */
export function deferDecision(
  dec: Decision,
  stageId: string,
  stageName: string | undefined,
  fee: number,
  days: number,
  now: number,
): Decision {
  return {
    ...dec,
    status: 'ditunda',
    flexibilityScore: Math.max(10, dec.flexibilityScore - 20),
    currentChangeCost: dec.currentChangeCost + fee,
    deferredUntilStageId: stageId,
    deferredUntilStageName: stageName || 'Tahap Berikutnya',
    deferredUntilDate: addDaysISO(now, days),
  };
}

/** Keputusan ikut terkunci saat change order disetujui. */
export function lockByChangeOrder(dec: Decision, changeOrderId: string): Decision {
  return { ...dec, status: 'terkunci', lockedBy: `Change Order #${changeOrderId}` };
}

/** Catatan jam kerja menambah biaya perubahan dan menyempitkan fleksibilitas. */
export function applyWorkLog(dec: Decision, log: Pick<WorkLog, 'hours' | 'rate'>): Decision {
  return {
    ...dec,
    currentChangeCost: dec.currentChangeCost + log.hours * log.rate,
    flexibilityScore: Math.max(5, dec.flexibilityScore - 8),
  };
}

/** Bagian bahan yang tidak bisa dipakai ulang (rupiah, belum dibulatkan). */
export function wastedMaterialPortion(log: Pick<MaterialLog, 'quantity' | 'unitPrice' | 'reusablePct'>): number {
  return (log.quantity * log.unitPrice * (100 - log.reusablePct)) / 100;
}

/** Catatan bahan menambah biaya sebesar bagian yang terbuang. */
export function applyMaterialLog(
  dec: Decision,
  log: Pick<MaterialLog, 'quantity' | 'unitPrice' | 'reusablePct'>,
): Decision {
  return {
    ...dec,
    currentChangeCost: Math.round(dec.currentChangeCost + wastedMaterialPortion(log)),
    flexibilityScore: Math.max(0, dec.flexibilityScore - 12),
  };
}

export type FlexibilityLevel = 'terkunci' | 'mendekati_kunci' | 'bersyarat' | 'tinggi';

/** Klasifikasi skor fleksibilitas (0..100) untuk FlexibilityBar. */
export function flexibilityLevel(score: number): FlexibilityLevel {
  const s = Math.max(0, Math.min(100, score));
  if (s === 0) return 'terkunci';
  if (s < 40) return 'mendekati_kunci';
  if (s < 70) return 'bersyarat';
  return 'tinggi';
}

export interface RevisionWindow {
  aperturePct: number;
  isLocked: boolean;
  isWarning: boolean;
}

/** Jendela revisi: makin maju tahap, makin sempit celahnya. */
export function revisionWindow(stageProgress: number): RevisionWindow {
  const aperturePct = Math.max(0, 100 - stageProgress);
  return {
    aperturePct,
    isLocked: aperturePct <= 5,
    isWarning: aperturePct > 5 && aperturePct < 40,
  };
}
