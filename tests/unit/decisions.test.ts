import { describe, expect, it } from 'vitest';
import {
  addDaysISO,
  applyMaterialLog,
  applyWorkLog,
  deferDecision,
  flexibilityLevel,
  lockByChangeOrder,
  lockDecision,
  revisionWindow,
  wastedMaterialPortion,
} from '../../src/lib/decisions';
import { decision } from './fixtures';

// Waktu tetap (bukan jam nyata): 2026-10-31T23:30:00Z
const NOW = Date.UTC(2026, 9, 31, 23, 30, 0);

describe('addDaysISO', () => {
  it('menambah hari dan memberi tanggal UTC', () => {
    expect(addDaysISO(NOW, 0)).toBe('2026-10-31');
    expect(addDaysISO(NOW, 1)).toBe('2026-11-01');
    expect(addDaysISO(NOW, 3)).toBe('2026-11-03');
  });

  it('melewati batas bulan dan tahun', () => {
    expect(addDaysISO(Date.UTC(2026, 11, 31, 12), 1)).toBe('2027-01-01');
  });

  it('tahun kabisat', () => {
    expect(addDaysISO(Date.UTC(2028, 1, 28, 12), 1)).toBe('2028-02-29');
    expect(addDaysISO(Date.UTC(2027, 1, 28, 12), 1)).toBe('2027-03-01');
  });

  it('nol dan hari negatif', () => {
    expect(addDaysISO(Date.UTC(2026, 0, 1, 0, 0, 0), -1)).toBe('2025-12-31');
  });
});

describe('lockDecision', () => {
  it('mengunci: status terkunci, skor 0, mencatat waktu dan pengunci', () => {
    const d = lockDecision(decision({ flexibilityScore: 35 }), '10.15', 'Budi (Hold-to-Lock)');
    expect(d.status).toBe('terkunci');
    expect(d.flexibilityScore).toBe(0);
    expect(d.lockedAt).toBe('10.15');
    expect(d.lockedBy).toBe('Budi (Hold-to-Lock)');
  });

  it('tidak mengubah objek asal dan tidak menyentuh biaya', () => {
    const before = decision();
    const snapshot = structuredClone(before);
    const after = lockDecision(before, 't', 'x');
    expect(before).toEqual(snapshot);
    expect(after.currentChangeCost).toBe(before.currentChangeCost);
  });

  it('mengunci ulang keputusan yang sudah terkunci tetap terkunci (idempoten pada status)', () => {
    const once = lockDecision(decision(), 't1', 'a');
    const twice = lockDecision(once, 't2', 'b');
    expect(twice.status).toBe('terkunci');
    expect(twice.flexibilityScore).toBe(0);
  });
});

describe('lockByChangeOrder', () => {
  it('mengunci dengan rujukan change order', () => {
    const d = lockByChangeOrder(decision(), 'co-9');
    expect(d.status).toBe('terkunci');
    expect(d.lockedBy).toBe('Change Order #co-9');
  });

  it('karakterisasi: tidak menyetel skor fleksibilitas ke 0 (berbeda dari kunci biasa)', () => {
    expect(lockByChangeOrder(decision({ flexibilityScore: 80 }), 'x').flexibilityScore).toBe(80);
  });
});

describe('deferDecision', () => {
  it('menunda: status, skor -20, biaya + komitmen, tahap dan tanggal tujuan', () => {
    const d = deferDecision(decision({ flexibilityScore: 80, currentChangeCost: 1_000_000 }), 's3', 'Perakitan', 450_000, 3, NOW);
    expect(d.status).toBe('ditunda');
    expect(d.flexibilityScore).toBe(60);
    expect(d.currentChangeCost).toBe(1_450_000);
    expect(d.deferredUntilStageId).toBe('s3');
    expect(d.deferredUntilStageName).toBe('Perakitan');
    expect(d.deferredUntilDate).toBe('2026-11-03');
  });

  it('skor tidak turun di bawah 10', () => {
    expect(deferDecision(decision({ flexibilityScore: 25 }), 's', 'x', 0, 1, NOW).flexibilityScore).toBe(10);
    expect(deferDecision(decision({ flexibilityScore: 0 }), 's', 'x', 0, 1, NOW).flexibilityScore).toBe(10);
  });

  it('nama tahap kosong memakai teks cadangan', () => {
    expect(deferDecision(decision(), 's', undefined, 0, 1, NOW).deferredUntilStageName).toBe('Tahap Berikutnya');
    expect(deferDecision(decision(), 's', '', 0, 1, NOW).deferredUntilStageName).toBe('Tahap Berikutnya');
  });

  it('biaya komitmen nol tidak mengubah biaya perubahan', () => {
    expect(deferDecision(decision({ currentChangeCost: 5 }), 's', 'x', 0, 1, NOW).currentChangeCost).toBe(5);
  });
});

describe('applyWorkLog', () => {
  it('menambah jam x tarif dan menurunkan skor 8', () => {
    const d = applyWorkLog(decision({ currentChangeCost: 1_000_000, flexibilityScore: 80 }), { hours: 2.5, rate: 85_000 });
    expect(d.currentChangeCost).toBe(1_212_500);
    expect(d.flexibilityScore).toBe(72);
  });

  it('skor tidak turun di bawah 5', () => {
    expect(applyWorkLog(decision({ flexibilityScore: 10 }), { hours: 1, rate: 1 }).flexibilityScore).toBe(5);
    expect(applyWorkLog(decision({ flexibilityScore: 0 }), { hours: 1, rate: 1 }).flexibilityScore).toBe(5);
  });

  it('jam nol tidak menambah biaya', () => {
    expect(applyWorkLog(decision({ currentChangeCost: 7 }), { hours: 0, rate: 85_000 }).currentChangeCost).toBe(7);
  });
});

describe('wastedMaterialPortion / applyMaterialLog', () => {
  it('bagian terbuang = jumlah x harga x (100 - pakai ulang) / 100', () => {
    expect(wastedMaterialPortion({ quantity: 4, unitPrice: 50_000, reusablePct: 25 })).toBe(150_000);
    expect(wastedMaterialPortion({ quantity: 4, unitPrice: 50_000, reusablePct: 100 })).toBe(0);
    expect(wastedMaterialPortion({ quantity: 0, unitPrice: 50_000, reusablePct: 0 })).toBe(0);
  });

  it('menambah bagian terbuang ke biaya dan membulatkan, skor -12', () => {
    const d = applyMaterialLog(decision({ currentChangeCost: 1000, flexibilityScore: 50 }), {
      quantity: 1,
      unitPrice: 333,
      reusablePct: 50,
    }); // 166,5 -> 1166,5 -> 1167
    expect(d.currentChangeCost).toBe(1167);
    expect(d.flexibilityScore).toBe(38);
  });

  it('skor tidak turun di bawah 0', () => {
    expect(applyMaterialLog(decision({ flexibilityScore: 5 }), { quantity: 1, unitPrice: 1, reusablePct: 0 }).flexibilityScore).toBe(0);
  });
});

describe('flexibilityLevel', () => {
  it.each([
    [0, 'terkunci'],
    [1, 'mendekati_kunci'],
    [39, 'mendekati_kunci'],
    [40, 'bersyarat'],
    [69, 'bersyarat'],
    [70, 'tinggi'],
    [100, 'tinggi'],
  ])('skor %i -> %s', (score, level) => {
    expect(flexibilityLevel(score)).toBe(level);
  });

  it('skor di luar rentang dijepit ke 0..100', () => {
    expect(flexibilityLevel(-10)).toBe('terkunci');
    expect(flexibilityLevel(250)).toBe('tinggi');
  });
});

describe('revisionWindow', () => {
  it('celah = 100 - kemajuan; terkunci pada celah <= 5%', () => {
    expect(revisionWindow(35)).toEqual({ aperturePct: 65, isLocked: false, isWarning: false });
    expect(revisionWindow(95)).toEqual({ aperturePct: 5, isLocked: true, isWarning: false });
    expect(revisionWindow(94.9).isLocked).toBe(false);
    expect(revisionWindow(100)).toEqual({ aperturePct: 0, isLocked: true, isWarning: false });
  });

  it('peringatan hanya pada celah di atas 5% dan di bawah 40%', () => {
    expect(revisionWindow(60).isWarning).toBe(false); // celah tepat 40
    expect(revisionWindow(60.1).isWarning).toBe(true);
    expect(revisionWindow(94).isWarning).toBe(true);
  });

  it('kemajuan lebih dari 100 tidak membuat celah negatif', () => {
    expect(revisionWindow(130).aperturePct).toBe(0);
  });
});
