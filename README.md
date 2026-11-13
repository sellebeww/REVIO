<p align="center">
  <img src="docs/banner.png" alt="Revio: platform transparansi hak revisi dan biaya produksi pesanan kustom" width="100%">
</p>

<p align="center">
  Platform transparansi <em>hak revisi</em> dan biaya produksi untuk pesanan kustom (furnitur, percetakan, dekorasi panggung, konveksi): pelanggan tahu kapan sebuah keputusan harus dikunci dan berapa biayanya kalau diubah, bukan sekadar menerima tagihan tambahan di akhir.
</p>

<p align="center">
  <img alt="React 19" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white&labelColor=2D3139">
  <img alt="TypeScript 7" src="https://img.shields.io/badge/TypeScript-7-3178C6?logo=typescript&logoColor=white&labelColor=2D3139">
  <img alt="Vite 8" src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white&labelColor=2D3139">
  <img alt="Tailwind CSS 4" src="https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white&labelColor=2D3139">
</p>

![Beranda Revio](docs/screenshots/01-landing.png)

## Masalahnya

Pelanggan mengubah desain di tengah produksi, bahan sudah terpotong, dan biaya tambahan baru muncul belakangan tanpa dasar yang jelas. Revio mengikat setiap keputusan penting ke **titik kunci** tahap produksi, sehingga pelanggan tahu kapan sebuah keputusan harus dikunci dan berapa biayanya kalau diubah atau ditunda, lengkap dengan bukti kerja nyata.

## Fitur

### Ruang Proyek Pelanggan
Peta keputusan dengan status *Fleksibel*, *Mendekati Kunci*, *Terkunci*, dan *Ditunda*. Setiap keputusan menjelaskan kenapa perubahan jadi mahal setelah melewati sebuah tahap, dan menawarkan tiga tindakan: **Kunci Sekarang** (tahan 1 detik untuk mencegah salah klik), **Tunda** (simulasi biaya), atau **Ajukan Perubahan** (change order).

![Ruang Pelanggan](docs/screenshots/02-ruang-pelanggan.png)

### Dasbor Vendor
Vendor mengelola proyek, tahap produksi, catatan jam kerja dan bahan, serta persetujuan change order dari satu tempat.

![Dasbor Vendor](docs/screenshots/03-dasbor-vendor.png)

### Papan Bengkel Live
Papan kanban untuk memantau tahap produksi yang sedang berjalan di bengkel.

![Papan Bengkel Live](docs/screenshots/04-papan-bengkel.png)

### Kalkulator Rumus
Rumus biaya perubahan dibuat terlihat, bukan kotak hitam:

```
Biaya = (Jam Kerja × Tarif) + Bahan Terpakai − Deduksi Pakai Ulang + Biaya Jadwal
```

![Kalkulator Rumus](docs/screenshots/05-kalkulator-rumus.png)

### Validasi Dampak
Perbandingan sebelum dan sesudah memakai Revio (bahan terbuang, jam bongkar ulang, sengketa), dengan impor data historis dan ekspor CSV.

![Validasi Dampak](docs/screenshots/06-validasi-dampak.png)

### Profil Bengkel Publik
Halaman publik vendor berisi layanan, spesifikasi bahan, galeri portofolio, kontak WhatsApp, dan Lencana Kepastian, dengan editor profil yang punya pratinjau berdampingan.

![Profil Bengkel](docs/screenshots/07-profil-bengkel.png)

### Lainnya
- **Change Order & Paket Bukti**: Berita Acara Perubahan Kerja yang bisa dicetak atau diunduh, memakai logo Revio dan vendor.
- **Log Audit**: stempel waktu setiap perubahan tahap, persetujuan change order, dan penguncian keputusan.
- **Animasi khas Revio**: Hold-to-Lock dengan konfeti, Pita Fleksibilitas, Gembok Hidup, dan garis waktu yang menggambar diri. Menghormati pengaturan *reduced motion*.
- **Responsif & aksesibel**: tata letak dicek di desktop, tablet, dan ponsel tanpa overflow horizontal; kontrol punya label, status `aria-pressed`, dan target sentuh yang cukup besar.

## Menjalankan

Butuh Node.js 22 (versi yang dipakai CI).

```bash
npm ci           # pasang dependensi persis sesuai lockfile
npm run dev      # http://localhost:3000
npm run build    # hasil build di dist/
npm run preview  # menyajikan hasil build
```

Aplikasi ini murni frontend. Data demo (proyek, vendor, log audit) ada di [src/data/mockSeedData.ts](src/data/mockSeedData.ts), tanpa backend dan tanpa environment variable.

### Skrip

| Skrip | Fungsi |
| --- | --- |
| `npm run dev` | Server pengembangan di port 3000 |
| `npm run build` | Build produksi ke `dist/` |
| `npm run preview` | Menyajikan `dist/` |
| `npm run typecheck` | Pengecekan tipe (`tsc --noEmit`, mode `strict`) |
| `npm run lint` | Alias `typecheck`; belum ada linter terpisah |
| `npm test` | Tes unit (Vitest, zona waktu dikunci ke UTC) |
| `npm run test:e2e` | Tes e2e Playwright (membangun lalu menyajikan app sendiri) |
| `npm run test:all` | Typecheck, tes unit, lalu e2e |

## Tes

**Unit** (`tests/unit/`): logika murni di [src/lib](src/lib): rincian biaya change order, kalkulator rumus, simulasi tunda, transisi kunci/tunda/catatan kerja/catatan bahan, jendela revisi, ringkasan dampak, dan format Rupiah. Locale `id-ID` ditulis eksplisit, tanggal memakai waktu tetap yang diberikan sebagai argumen, tanpa jam nyata.

**E2E** (`tests/e2e/`, Chromium): tata letak 360px (tanpa gulir horizontal dan tanpa kontrol terpotong), pemindaian aksesibilitas axe (WCAG 2 A/AA) di semua halaman dan dialog pada 360px dan 1280px, fokus keyboard, dan alur smoke termasuk tahan-untuk-kunci dengan jam yang dikendalikan. Jaringan luar diblokir di tes agar hasil tidak bergantung pada koneksi.

Pertama kali menjalankan e2e, pasang browser: `npx playwright install chromium`. Bila Chromium sudah ada di mesin, arahkan dengan `PW_CHROMIUM_PATH=/jalur/ke/chromium npm run test:e2e`.

CI GitHub Actions ([.github/workflows/ci.yml](.github/workflows/ci.yml)) menjalankan `npm ci`, typecheck, tes unit, build, dan e2e di Node 22.

## Batasan

- Prototipe frontend: tidak ada backend, autentikasi, atau penyimpanan. Seluruh state hilang saat muat ulang.
- Status keputusan (`Fleksibel`, `Mendekati Kunci`, `Terkunci`, `Ditunda`) digerakkan aksi pemakai dan data seed, belum dihitung otomatis dari tenggat atau tahap produksi.
- Tarif, biaya penyangga tunda, dan angka demo adalah data contoh, bukan tarif atau aturan hukum.
- Warna merek teal `#0E9F8E` belum memenuhi kontras 4,5:1 untuk teks kecil.
- Temuan lengkap dan keputusan yang menunggu pemilik ada di [docs/AUDIT.md](docs/AUDIT.md).

## Deploy ke Vercel

Tidak perlu konfigurasi tambahan: Vercel mendeteksi Vite otomatis.

1. Import repo ini di [vercel.com/new](https://vercel.com/new).
2. Biarkan Framework Preset **Vite** (build `npm run build`, output `dist`).
3. Deploy.

Navigasi memakai hash URL (mis. `/#/customer_space`), jadi tombol Back/Forward browser, refresh, dan tautan langsung ke halaman demo berfungsi tanpa aturan rewrite.

## Struktur

```
src/
├── components/
│   ├── public/        # Landing page
│   ├── customer/      # Ruang Proyek Pelanggan
│   ├── vendor/        # Dasbor, profil publik, editor, proyek baru
│   ├── workshop/      # Papan Bengkel Live
│   ├── calculator/    # Kalkulator Rumus
│   ├── analytics/     # Validasi Dampak
│   ├── changeorder/   # Modal dan dokumen Berita Acara
│   ├── dispute/       # Paket bukti sengketa
│   ├── motion/        # Animasi khas Revio
│   └── ui/            # Komponen dasar
├── data/              # Data seed demo
├── lib/               # Logika murni (biaya, keputusan, analitik, Rupiah), suara, cetak dokumen
└── types/             # Tipe TypeScript
tests/
├── unit/              # Vitest untuk src/lib
└── e2e/               # Playwright (tata letak, aksesibilitas, smoke)
.github/workflows/     # CI
docs/
├── AUDIT.md           # Audit kualitas dan temuan
├── prompt-master.md   # Spesifikasi produk awal
└── screenshots/       # Gambar untuk README
```

Catatan keputusan arsitektur ada di [DECISIONS.md](DECISIONS.md).

## Kredit

Foto bengkel dan tukang kayu di landing berasal dari [Unsplash](https://unsplash.com) (Unsplash License). Ilustrasi hero dan ilustrasi masalah dibuat sebagai SVG di repo ini.

## Author & License

Created by Vassel Goleyu. Copyright (c) 2026 Vassel Goleyu. All rights reserved. Lihat [LICENSE](LICENSE).
