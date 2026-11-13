import { describe, expect, it } from 'vitest';
import { formatIDR } from '../../src/lib/money';

// Intl memakai NBSP (U+00A0) antara "Rp" dan angka.
const NBSP = ' ';

describe('formatIDR', () => {
  it('memakai locale id-ID: titik pemisah ribuan, tanpa desimal', () => {
    expect(formatIDR(1_250_000)).toBe(`Rp${NBSP}1.250.000`);
    expect(formatIDR(0)).toBe(`Rp${NBSP}0`);
  });

  it('membulatkan pecahan ke rupiah terdekat (setengah naik)', () => {
    expect(formatIDR(1000.4)).toBe(`Rp${NBSP}1.000`);
    expect(formatIDR(1000.5)).toBe(`Rp${NBSP}1.001`);
  });

  it('menandai angka negatif dengan tanda minus', () => {
    expect(formatIDR(-5000)).toBe(`-Rp${NBSP}5.000`);
  });

  it('tidak bergantung pada locale bawaan proses', () => {
    // Hasil harus sama dengan Intl eksplisit id-ID, apa pun locale default mesin.
    const expected = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(32_500_000);
    expect(formatIDR(32_500_000)).toBe(expected);
    expect(expected).toBe(`Rp${NBSP}32.500.000`);
  });
});
