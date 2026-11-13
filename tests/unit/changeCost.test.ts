import { describe, expect, it } from 'vitest';
import {
  computeChangeOrderBreakdown,
  computeFormulaBreakdown,
  simulateDeferral,
} from '../../src/lib/changeCost';
import { decision, material, work } from './fixtures';

describe('computeChangeOrderBreakdown', () => {
  it('tanpa bukti kerja/bahan: biaya nol, biaya jadwal tidak dikenakan', () => {
    const r = computeChangeOrderBreakdown(decision(), [], []);
    expect(r).toEqual({
      hasEvidence: false,
      affectedWorkHours: 0,
      affectedWorkCost: 0,
      rawMaterialValue: 0,
      wastedMaterialValue: 0,
      reuseDeduction: 0,
      rescheduleFee: 0,
      totalCost: 0,
      scheduleImpactDays: 0,
    });
  });

  it('menghitung (jam x tarif) + bahan terbuang + biaya jadwal', () => {
    // 18 jam x 85.000 = 1.530.000
    // bahan 650.000, 30% dipakai ulang -> terbuang 455.000, deduksi 195.000
    // biaya jadwal 200.000 -> total 2.185.000
    const r = computeChangeOrderBreakdown(
      decision(),
      [work({ hours: 18 })],
      [material({ quantity: 1, unitPrice: 650_000, reusablePct: 30 })],
    );
    expect(r.affectedWorkHours).toBe(18);
    expect(r.affectedWorkCost).toBe(1_530_000);
    expect(r.rawMaterialValue).toBe(650_000);
    expect(r.wastedMaterialValue).toBe(455_000);
    expect(r.reuseDeduction).toBe(195_000);
    expect(r.rescheduleFee).toBe(200_000);
    expect(r.totalCost).toBe(2_185_000);
    expect(r.scheduleImpactDays).toBe(3); // ceil(18 / 8)
  });

  it('identitas: total = jam x tarif + bahan terpakai - deduksi + biaya jadwal', () => {
    const r = computeChangeOrderBreakdown(
      decision({ hourlyRate: 110_000, rescheduleFee: 500_000 }),
      [work({ hours: 3 }), work({ id: 'w2', hours: 11 })],
      [
        material({ quantity: 7, unitPrice: 333_333, reusablePct: 15 }),
        material({ id: 'm2', quantity: 3, unitPrice: 12_345, reusablePct: 100 }),
      ],
    );
    expect(r.totalCost).toBe(r.affectedWorkCost + r.rawMaterialValue - r.reuseDeduction + r.rescheduleFee);
  });

  it('hanya menghitung catatan milik keputusan ini', () => {
    const r = computeChangeOrderBreakdown(
      decision(),
      [work({ hours: 2 }), work({ id: 'w2', decisionId: 'dec-2', hours: 50 })],
      [material({ decisionId: 'dec-2', unitPrice: 9_999_999 })],
    );
    expect(r.affectedWorkHours).toBe(2);
    expect(r.rawMaterialValue).toBe(0);
    expect(r.totalCost).toBe(2 * 85_000 + 200_000);
  });

  it('bahan hanya (tanpa jam) tetap dianggap bukti dan mengenakan biaya jadwal', () => {
    const r = computeChangeOrderBreakdown(decision(), [], [material({ unitPrice: 100_000, reusablePct: 0 })]);
    expect(r.hasEvidence).toBe(true);
    expect(r.rescheduleFee).toBe(200_000);
    expect(r.totalCost).toBe(300_000);
    expect(r.scheduleImpactDays).toBe(0);
  });

  it('pembulatan: bahan terbuang dibulatkan sekali pada jumlah, bukan per baris', () => {
    // 3 x 100,5% sisa ... gunakan 33,33% terbuang: 100 x (100-66.67)/100
    const r = computeChangeOrderBreakdown(
      decision({ rescheduleFee: 0 }),
      [],
      [
        material({ id: 'a', quantity: 1, unitPrice: 1, reusablePct: 50 }), // 0,5
        material({ id: 'b', quantity: 1, unitPrice: 1, reusablePct: 50 }), // 0,5
      ],
    );
    // Dibulatkan per baris akan menghasilkan 2 (0,5 -> 1 tiap baris); dibulatkan di jumlah = 1.
    expect(r.wastedMaterialValue).toBe(1);
    expect(r.reuseDeduction).toBe(1);
  });

  it('batas pakai ulang: 0% semua terbuang, 100% tidak ada yang terbuang', () => {
    const base = { quantity: 2, unitPrice: 50_000 };
    expect(computeChangeOrderBreakdown(decision(), [], [material({ ...base, reusablePct: 0 })]).wastedMaterialValue).toBe(
      100_000,
    );
    const full = computeChangeOrderBreakdown(decision(), [], [material({ ...base, reusablePct: 100 })]);
    expect(full.wastedMaterialValue).toBe(0);
    expect(full.reuseDeduction).toBe(100_000);
  });

  it('dampak jadwal: pembulatan ke atas per 8 jam kerja', () => {
    const days = (h: number) => computeChangeOrderBreakdown(decision(), [work({ hours: h })], []).scheduleImpactDays;
    expect(days(0)).toBe(0);
    expect(days(0.5)).toBe(1);
    expect(days(8)).toBe(1);
    expect(days(8.01)).toBe(2);
    expect(days(16)).toBe(2);
  });

  it('memakai tarif keputusan (bukan tarif per catatan) untuk biaya kerja', () => {
    // Karakterisasi: tarif pada WorkLog diabaikan di change order. Lihat docs/AUDIT.md.
    const r = computeChangeOrderBreakdown(decision({ hourlyRate: 100_000 }), [work({ hours: 1, rate: 999_999 })], []);
    expect(r.affectedWorkCost).toBe(100_000);
  });
});

describe('computeFormulaBreakdown', () => {
  const base = { hours: 18, rate: 85_000, materialCost: 650_000, reusePct: 30, rescheduleFee: 200_000, projectValue: 32_500_000 };

  it('kasus studi "Warna Finishing Kayu Jati"', () => {
    const r = computeFormulaBreakdown(base);
    expect(r.workCost).toBe(1_530_000);
    expect(r.salvageValue).toBe(195_000);
    expect(r.netMaterialCost).toBe(455_000);
    expect(r.totalChangeCost).toBe(2_185_000);
    expect(r.impactPct).toBe('6.7'); // 2.185.000 / 32.500.000 = 6,723%
    expect(r.isHighImpact).toBe(false);
  });

  it('nilai pakai ulang dibulatkan ke rupiah penuh', () => {
    // 999 x 33% = 329,67 -> 330
    const r = computeFormulaBreakdown({ ...base, materialCost: 999, reusePct: 33 });
    expect(r.salvageValue).toBe(330);
    expect(r.netMaterialCost).toBe(669);
  });

  it('dampak tinggi hanya jika benar-benar di atas 15%', () => {
    const at = (total: number) =>
      computeFormulaBreakdown({ hours: 0, rate: 0, materialCost: 0, reusePct: 0, rescheduleFee: total, projectValue: 1000 });
    expect(at(150).impactPct).toBe('15.0');
    expect(at(150).isHighImpact).toBe(false);
    expect(at(151).impactPct).toBe('15.1');
    expect(at(151).isHighImpact).toBe(true);
  });

  it('semua masukan nol menghasilkan biaya nol', () => {
    const r = computeFormulaBreakdown({ ...base, hours: 0, materialCost: 0, rescheduleFee: 0 });
    expect(r.totalChangeCost).toBe(0);
    expect(r.impactPct).toBe('0.0');
  });

  it('nilai proyek nol tidak menghasilkan "Infinity"/"NaN" di antarmuka', () => {
    for (const total of [0, 500_000]) {
      const r = computeFormulaBreakdown({ ...base, hours: 0, materialCost: 0, rescheduleFee: total, projectValue: 0 });
      expect(Number.isFinite(Number(r.impactPct))).toBe(true);
    }
  });
});

describe('simulateDeferral', () => {
  it('tahap pertama: 22 poin fleksibilitas, +Rp250.000 penyangga, 3 hari', () => {
    const r = simulateDeferral(decision({ flexibilityScore: 80, rescheduleFee: 200_000 }), 0);
    expect(r).toEqual({
      stepsAhead: 1,
      baseHoldingFee: 200_000,
      addedBufferCost: 250_000,
      simulatedFlexibilityScore: 58,
      totalSimulatedFee: 450_000,
      simulatedScheduleImpactDays: 3,
    });
  });

  it('skor fleksibilitas tidak turun di bawah 5', () => {
    expect(simulateDeferral(decision({ flexibilityScore: 10 }), 4).simulatedFlexibilityScore).toBe(5);
    expect(simulateDeferral(decision({ flexibilityScore: 0 }), 0).simulatedFlexibilityScore).toBe(5);
  });

  it('biaya dan jadwal naik linear per tahap', () => {
    const r = simulateDeferral(decision({ rescheduleFee: 0 }), 2);
    expect(r.totalSimulatedFee).toBe(750_000);
    expect(r.simulatedScheduleImpactDays).toBe(9);
  });
});
