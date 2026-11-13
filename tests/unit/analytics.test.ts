import { describe, expect, it } from 'vitest';
import { summarizeImpact } from '../../src/lib/analytics';
import type { HistoricalBenchmark } from '../../src/types/revio';

const bench = (over: Partial<HistoricalBenchmark> = {}): HistoricalBenchmark => ({
  id: 'b',
  projectName: 'x',
  category: 'y',
  projectValue: 1,
  reworkHoursWithoutRevio: 40,
  reworkHoursWithRevio: 10,
  wastedMaterialCostWithoutRevio: 1_000_000,
  wastedMaterialCostWithRevio: 250_000,
  disputesWithoutRevio: 2,
  disputesWithRevio: 0,
  costClarityScore: 4,
  ...over,
});

describe('summarizeImpact', () => {
  it('menjumlah beberapa proyek', () => {
    const r = summarizeImpact([bench(), bench({ reworkHoursWithoutRevio: 20, reworkHoursWithRevio: 10 })]);
    expect(r.totalReworkHoursOld).toBe(60);
    expect(r.totalReworkHoursNew).toBe(20);
    expect(r.reworkReductionPct).toBe(67); // 40/60 = 66,67 -> 67
    expect(r.wasteSavedIDR).toBe(1_500_000);
    expect(r.totalDisputesOld).toBe(4);
    expect(r.totalDisputesNew).toBe(0);
  });

  it('tanpa penghematan: 0%', () => {
    expect(summarizeImpact([bench({ reworkHoursWithRevio: 40 })]).reworkReductionPct).toBe(0);
  });

  it('daftar kosong atau jam lama nol tidak menghasilkan NaN', () => {
    expect(Number.isFinite(summarizeImpact([]).reworkReductionPct)).toBe(true);
    expect(Number.isFinite(summarizeImpact([bench({ reworkHoursWithoutRevio: 0, reworkHoursWithRevio: 0 })]).reworkReductionPct)).toBe(true);
  });
});
