# Revio — Platform Transparansi Hak Revisi & Biaya Produksi Pesanan

Revio adalah platform yang menghubungkan hak revisi pelanggan dengan tahapan produksi nyata bengkel manufaktur kustom (furnitur, percetakan khusus, dekorasi panggung, konveksi). Revio memastikan pelanggan memahami kapan sebuah keputusan harus dikunci dan berapa biayanya jika ditunda secara transparan.

---

## 🚀 Fitur Utama

1. **Logo & Identitas Merek Revio**
   - Menggunakan logo resmi Revio dengan ikon huruf R geometris, pita lengkung hijau zamrud terlipat (*folded ribbon*), serta sepasang panah refresh yang melambangkan siklus revisi yang terkendali.
   - Dilengkapi file SVG resmi di `/public/brand/` untuk resolusi tajam di berbagai ukuran.

2. **Peta Keputusan (Decision Map)**
   - Status visual: *Fleksibel*, *Mendekati Kunci*, *Terkunci*, dan *Ditunda*.
   - Rincian transparan: *"Mengapa mahal jika diubah melewati tahap ini?"*
   - Tiga tindakan jelas untuk pelanggan: **Kunci Sekarang (Hold-to-Lock)**, **Tunda (Simulasi Biaya)**, atau **Ajukan Perubahan (Change Order)**.

3. **Sistem Animasi Signature Revio**
   - **Tahan untuk Mengunci (Hold-to-Lock)**: Cincin progres melingkar 1 detik untuk mencegah penguncian tidak sengaja, diiringi efek konfeti saat terkunci.
   - **Pita Fleksibilitas**: Bar visual yang menyusut dan bermutasi warna (hijau → kuning → abu-abu) seiring kemajuan tahap.
   - **Gembok Hidup**: Animasi status gembok terbuka, berdenyut waspada, dan terkunci kokoh.
   - **Kalkulator Biaya Fleksibilitas Interaktif**: Slider geser tunda dengan kalkulasi biaya dan dampak hari kalender secara langsung.
   - **Garis Waktu Menggambar Diri**: Menampilkan simpul tahap produksi aktif yang berdenyut lembut dan penanda Titik Kunci.

4. **Change Order & Paket Bukti Nyata**
   - Dokumen Berita Acara Perubahan Kerja dengan rumus transparan:
     $$\text{Biaya} = (\text{Jam Kerja} \times \text{Tarif}) + \text{Bahan Terpakai} - \text{Deduksi Pakai Ulang} + \text{Biaya Jadwal}$$
   - Fitur pratinjau cetak dan unduhan formal berlogo Revio dan vendor.

5. **Profil Perusahaan Vendor Publik (`/v/:slug`) & Editor Langsung**
   - Halaman publik lengkap: layanan, spesifikasi bahan, galeri portofolio lightbox, kontak WhatsApp, dan **Lencana Kepastian** (Sertifikasi Transparansi Platinum).
   - Editor profil dengan mode pratinjau berdampingan.

6. **Analitik & Validasi Dampak**
   - Komparasi kerugian sebelum vs sesudah memakai Revio:
     - Hemat bahan terbuang: **Rp 420 Juta+**
     - Reduksi jam bongkar ulang tukang: **-88%**
     - Kasus sengketa sepihak: **0 Kasus**
   - Fitur impor data historis proyek lama dan ekspor laporan format CSV.

7. **Log Audit Permanen**
   - Catatan stempel waktu setiap perubahan status tahap, persetujuan change order, dan penguncian keputusan untuk paket pembuktian sengketa.

---

## 🛠️ Menjalankan Aplikasi

Aplikasi dibangun dengan Vite, React 19, TypeScript, Tailwind CSS v4, dan Motion.

```bash
# Menjalankan development server
npm run dev

# Kompilasi build produksi
npm run build

# Pengecekan tipe dan linting
npm run lint
```

---

## 📁 Struktur Direktori

```
/
├── public/
│   ├── assets/aistudio/                 # Logo resmi Revio yang diunggah
│   └── brand/                           # Vector brand mark SVG (mark, full, white)
├── src/
│   ├── components/
│   │   ├── brand/RevioLogo.tsx          # Komponen logo responsif
│   │   ├── motion/                      # Komponen animasi signature Revio
│   │   ├── decisions/DecisionCard.tsx   # Kartu Keputusan Penting
│   │   ├── customer/                    # Ruang Proyek Pelanggan
│   │   ├── vendor/                      # Dasbor Vendor, Editor, & Profil /v
│   │   ├── changeorder/                 # Modal & Dokumen Berita Acara
│   │   ├── analytics/                   # Analitik & Komparasi Benchmark
│   │   └── public/                      # Situs Marketing Revio
│   ├── data/mockSeedData.ts             # 5 Proyek seed komprehensif & 3 vendor
│   ├── types/revio.ts                   # Definisi tipe TypeScript
│   ├── App.tsx                          # Router utama & state orchestrator
│   └── index.css                        # Design token Tailwind v4 & font
├── DECISIONS.md                         # Catatan pertimbangan arsitektur
├── metadata.json                        # Metadata resmi AI Studio
└── package.json
```
