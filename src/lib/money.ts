/**
 * Format Rupiah. Locale dipatok eksplisit ('id-ID') agar hasil tidak
 * bergantung pada locale peramban/OS pemakai.
 */
const IDR = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
});

export const formatIDR = (num: number): string => IDR.format(num);
