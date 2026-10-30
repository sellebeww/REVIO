# Catatan Keputusan Arsitektur & Desain (DECISIONS.md)

Dokumen ini mencatat keputusan teknis, arsitektur, dan adaptasi merek yang dibuat dalam pengembangan platform **Revio** (Platform Transparansi Hak Revisi & Biaya Produksi Pesanan).

---

## 1. Penyesuaian Logo & Identitas Visual
- **Masukan Pengguna:** Mengunggah logo resmi Revio (`Revio_Folded_Refresh_Logo_37edf52e.png`).
- **Analisis Logo:** 
  - Ikon terdiri dari huruf kapital **R** bergaya geometris tebal berwarna *Navy Ink* (`#112A46`), loop/lengkung kiri menyerupai pita/daun terlipat (*folded ribbon*) gradasi hijau zamrud-toska (`#55C9A4` ke `#2E8B71`), dan sepasang panah siklus/refresh di sudut kanan bawah (`#4EBA97`) melambangkan siklus revisi dan pembaharuan.
  - Wordmark bertuliskan **"Revio"** tebal dengan titik pada huruf `i` bernuansa hijau jade/amber mengunci.
- **Implementasi:**
  - Asset resmi disimpan dan diintegrasikan langsung dari `/public/assets/aistudio/Revio_Folded_Refresh_Logo_37edf52e.png`.
  - Dibuatkan pula format SVG vektor murni yang setara di `/public/brand/revio-logo-mark.svg`, `revio-logo-full.svg`, dan `revio-logo-white.svg` untuk fleksibilitas tema terang/gelap dan cetak dokumen.

---

## 2. Rumus Biaya Perubahan & Skor Fleksibilitas
- **Rumus Biaya Perubahan:**
  $$\text{Biaya Perubahan} = (\text{Jam Kerja Terdampak} \times \text{Tarif}) + (\text{Bahan Terpakai Non-Reusable}) - (\text{Nilai Pakai Ulang/Salvage}) + \text{Biaya Penjadwalan Ulang}$$
- **Aturan Integritas:** Biaya perubahan wajib tertaut ke entri nyata pada `work_logs` dan `material_logs`. Tidak ada biaya revisi sepihak tanpa dasar bukti riil.
- **Skor Fleksibilitas:**
  $$\text{Skor} = \max\left(0, 100 - \left(\frac{\text{Nilai Pekerjaan Tergantung Keputusan}}{\text{Total Nilai Proyek}} \times 100\right)\right)$$
- Saat keputusan dikunci atau tahap melewati titik kunci, skor berubah menjadi 0 dan status terkunci.

---

## 3. Interaksi Tahan untuk Mengunci (Hold-to-Lock)
- Menggunakan durasi tekan dan tahan 1.000 ms (1 detik) dengan cincin progres radial SVG.
- Jika pengguna melepaskan sebelum 1 detik, animasi kembali ke 0 untuk mencegah penguncian tidak sengaja.
- Saat penguncian selesai, efek getar perangkat (jika didukung) dan semburan konfeti lembut menandai konfirmasi permanen.

---

## 4. Struktur Role-Based Access Control (RBAC) & Mode Switcher
- Platform menyediakan 5 peran yang dapat disimulasikan langsung lewat navigasi atas:
  1. **Publik / Company Profile**: Halaman pemasaran publik, fitur, harga, direktori vendor terverifikasi, dan formulir demo.
  2. **Pelanggan (Ruang Proyek)**: Peta Keputusan, interaksi Kunci/Tunda/Ubah, garis waktu produksi, faktur change order, dan penilaian kejelasan biaya.
  3. **Pemilik & Admin Vendor**: Dasbor operasional, peringatan mendekati kunci, pembuatan proyek baru dengan templat industri, dan kustomisasi profil publik `/v/:slug`.
  4. **Staf Produksi**: Pencatatan cepat jam kerja tukang dan pemakaian bahan terpakai per keputusan.
  5. **Admin Platform**: Log audit permanen dan pemantauan Lencana Kepastian (Platinum/Gold).

---

## 5. Aksesibilitas & Reduksi Animasi
- Disediakan tombol sakelar `"Kurangi Animasi"` di bagian footer untuk mematuhi preferensi `prefers-reduced-motion` dan standar aksesibilitas WCAG AA.
- Kontras warna teks memenuhi rasio minimal 4.5:1.
