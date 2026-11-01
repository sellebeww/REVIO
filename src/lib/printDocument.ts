/**
 * Cetak hanya dokumen yang memuat `from` (elemen terdekat ber-atribut data-print-area).
 * Aturan CSS cetak ada di index.css. `title` jadi nama berkas default saat
 * pengguna memilih "Simpan sebagai PDF".
 */
export function printDocument(title: string, from: Element | null) {
  const target = from?.closest('[data-print-area]');
  if (!target) return window.print();

  const prevTitle = document.title;
  target.setAttribute('data-printing', '');
  document.title = title;
  const restore = () => {
    target.removeAttribute('data-printing');
    document.title = prevTitle;
    window.removeEventListener('afterprint', restore);
  };
  window.addEventListener('afterprint', restore);
  window.print();
}
