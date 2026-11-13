import type { HistoricalBenchmark } from '../types/revio';

export interface ImpactSummary {
  totalReworkHoursOld: number;
  totalReworkHoursNew: number;
  reworkReductionPct: number;
  wasteSavedIDR: number;
  totalDisputesOld: number;
  totalDisputesNew: number;
}

const sum = (list: HistoricalBenchmark[], pick: (b: HistoricalBenchmark) => number) =>
  list.reduce((acc, b) => acc + pick(b), 0);

export function summarizeImpact(benchmarks: HistoricalBenchmark[]): ImpactSummary {
  const totalReworkHoursOld = sum(benchmarks, (b) => b.reworkHoursWithoutRevio);
  const totalReworkHoursNew = sum(benchmarks, (b) => b.reworkHoursWithRevio);
  const reworkReductionPct = Math.round(((totalReworkHoursOld - totalReworkHoursNew) / totalReworkHoursOld) * 100);
  const wasteSavedIDR =
    sum(benchmarks, (b) => b.wastedMaterialCostWithoutRevio) - sum(benchmarks, (b) => b.wastedMaterialCostWithRevio);
  return {
    totalReworkHoursOld,
    totalReworkHoursNew,
    reworkReductionPct,
    wasteSavedIDR,
    totalDisputesOld: sum(benchmarks, (b) => b.disputesWithoutRevio),
    totalDisputesNew: sum(benchmarks, (b) => b.disputesWithRevio),
  };
}
