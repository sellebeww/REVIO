# Audit singkat Revio

Cakupan: logika kunci keputusan dan biaya perubahan, pembulatan uang, aksesibilitas,
tata letak 360px, ukuran file, dan bug. Dibuat pada branch `improve/safe-quality`.
Setiap temuan ditandai **[diperbaiki]**, **[dicatat]** (sengaja tidak diubah, perlu
keputusan pemilik), atau **[diuji]** (perilaku saat ini dikunci oleh tes).

## Baseline sebelum perubahan

| Langkah | Hasil |
| --- | --- |
| `npm ci` | Sukses, tetapi binary native opsional (TypeScript 7, rolldown) tidak terpasang karena 65 entri lockfile menunjuk ke `registry.npmmirror.com` |
| `tsc --noEmit` (`npm run lint`) | Gagal di mesin tanpa akses ke mirror itu (`Unable to resolve @typescript/typescript-linux-x64`) |
| `vite build` | Gagal dengan alasan sama (`Cannot find native binding`) |
| Tes | Tidak ada (0 tes, 0 CI) |

Setelah host lockfile diganti ke `registry.npmjs.org` (hash `integrity` sama): typecheck
hijau, build hijau. Skrip `lint` hanya alias `tsc --noEmit`, belum ada linter.

## 1. Logika kunci keputusan dan biaya

Logika tadinya tertanam di komponen dan `App.tsx`. Kini dipindahkan apa adanya ke
`src/lib/` (`changeCost.ts`, `decisions.ts`, `analytics.ts`, `money.ts`) dan diuji.

Rumus biaya perubahan (sesuai `DECISIONS.md` #2) terbukti konsisten di tiga tempat
(`ChangeOrderModal`, `VisualFormulaExplorer`, `DeferralCalculator`): total = jam x tarif
+ bahan terpakai - deduksi pakai ulang + biaya jadwal. Identitas ini ada di tes.

Temuan:

1. **[dicatat] Status keputusan tidak pernah dihitung dari tenggat atau tahap.**
   `mendekati_kunci` hanya ada sebagai data seed (1 keputusan). `deadlineAt` berupa string
   bebas yang hanya ditampilkan. Satu-satunya jalur ke `terkunci` adalah aksi manual
   (tahan 1 detik atau change order). README menjanjikan "tahu kapan sebuah keputusan harus
   dikunci", jadi aturan "terkunci otomatis saat tahap melewati titik kunci" (DECISIONS.md #2)
   belum diimplementasikan. Tidak diubah: butuh aturan bisnis dari pemilik, tidak saya karang.
2. **[dicatat] `ChangeOrderModal` memakai `decision.hourlyRate`, sedangkan catatan kerja
   menyimpan `rate` sendiri.** `handleAddWorkLog` menambah `jam x log.rate` ke
   `currentChangeCost`, tetapi change order menghitung `total jam x decision.hourlyRate`.
   Bila tarif catatan berbeda dari tarif keputusan, dua angka itu berbeda. Dikunci sebagai
   karakterisasi di `changeCost.test.ts`.
3. **[dicatat] Menyetujui change order menambah `totalCost` ke `paidAmount`** (`App.tsx`),
   seolah pelanggan sudah membayar. Itu bisa disengaja (persetujuan digital) atau tidak;
   tidak ada dasar di DECISIONS.md.
4. **[dicatat] Kunci lewat change order tidak menyetel skor fleksibilitas ke 0**, sedangkan
   kunci biasa menyetelnya ke 0 (`lockByChangeOrder` vs `lockDecision`). Kartu bisa menampilkan
   "Terkunci" dengan pita fleksibilitas tidak nol. Dikunci di `decisions.test.ts`.
5. **[dicatat] Tidak ada penjaga status pada transisi.** `deferDecision` pada keputusan yang
   sudah `terkunci` akan mengubahnya menjadi `ditunda`. UI menyembunyikan tombolnya, tetapi
   fungsinya sendiri tidak menolak.
6. **[dicatat] Konstanta tak berdokumen di `simulateDeferral`**: 22 poin fleksibilitas,
   Rp250.000 penyangga, dan 3 hari per tahap ke depan. Dipertahankan; dikunci oleh tes.
   Perlu konfirmasi bahwa itu memang aturan produk.
7. **[diperbaiki] Pembagian nol.** `computeFormulaBreakdown` menghasilkan `"NaN"`/`"Infinity"`
   bila nilai proyek 0, dan `summarizeImpact` menghasilkan `NaN` bila total jam lama 0 atau
   daftar kosong. Kini 0 (`0.0` untuk persentase dampak). Keduanya tidak terjangkau dari UI
   saat ini (nilai proyek hanya dari preset, daftar benchmark tak pernah kosong), jadi bersifat
   laten. Bukti: dua tes yang awalnya gagal.
8. **[dicatat] `NewProjectModal`: `Number(x) || default`** mengubah nilai kontrak atau DP `0`/kosong
   diam-diam menjadi Rp20.000.000 / Rp10.000.000, dan `paidAmount` ikut DP itu. DP tidak
   divalidasi terhadap nilai kontrak. Selain itu `deadlineAt` proyek baru di-hardcode
   `'2026-10-29 18:00'`.

## 2. Uang, pembulatan, waktu

- **[diuji]** Format Rupiah dipusatkan di `formatIDR` (satu salinan menggantikan 10) dengan
  locale `id-ID` eksplisit, 0 desimal. Tes membandingkan hasil dengan string literal
  (spasi tak terputus U+00A0 setelah `Rp`) sehingga tidak bergantung pada locale mesin.
- **[diuji]** Bahan terbuang dibulatkan sekali pada jumlah seluruh baris (bukan per baris);
  deduksi pakai ulang = bahan terpakai - bahan terbuang, sehingga total selalu menutup.
  Biaya jam kerja tidak dibulatkan: jam pecahan x tarif bisa menghasilkan rupiah pecahan
  (ditampilkan dibulatkan oleh Intl, jumlah bagian bisa selisih Rp1 dari total). [dicatat]
- **[dicatat]** Cap waktu disimpan sebagai string lokal (`toLocaleString('id-ID')`,
  `toLocaleTimeString([])`) sehingga bergantung pada zona waktu dan locale peramban, tidak
  bisa dibandingkan, dan `expiresAt` (2 hari) tidak pernah ditegakkan di mana pun. Tanggal
  ISO memakai `toISOString()` (UTC), jadi di WIB sebelum 07.00 hari yang tersimpan mundur satu.
  `addDaysISO` di `src/lib/decisions.ts` menerima `now` sebagai argumen agar bisa diuji.
- **[dicatat]** Ekspor CSV Validasi Dampak membungkus nama proyek dengan `"` tanpa menggandakan
  tanda kutip, memakai `encodeURI` (karakter `#` dalam nama memotong data), dan tidak
  menetralkan sel yang diawali `=`/`+`/`-`/`@`.

## 3. Aksesibilitas

Dipindai dengan axe (WCAG 2 A/AA) pada 7 halaman dan 3 dialog, di 360px dan 1280px.

- **[diperbaiki]** Label tidak terhubung ke input di form Proyek Baru (7 kontrol), Profil
  Vendor (9), Catat Jam/Bahan (6), ulasan, dan catatan mandor: kini `htmlFor`/`id`. Kontrol
  tanpa label (judul keputusan, alasan, dua rentang geser) mendapat `aria-label`.
- **[diperbaiki]** Tombol tutup dialog tanpa nama; lonceng notifikasi bernama "Notifikasi"
  padahal teks terlihatnya adalah jumlah (WCAG 2.5.3): nama kini memuat jumlah.
- **[diperbaiki]** Wilayah gulir tabel Validasi Dampak tidak bisa difokus keyboard: kini
  `role="region"`, `aria-label`, `tabIndex=0`.
- **[diperbaiki]** Kontras teks netral: `text-slate-400` pada latar terang (2,5:1) menjadi
  `slate-500` (4,6:1) di 69 tempat, kecuali komponen gelap. Tab dan tombol di dialog translusen
  memakai `slate-600`; status "Semua tahap tercatat" memakai `emerald-700`.
- **[dicatat] Warna merek teal `#0E9F8E`** hanya 3,29:1 sebagai teks atau latar putih
  (tombol "Buat Proyek Baru", "Tahan untuk Kunci", label kecil teal). Memperbaikinya berarti
  mengubah warna merek, jadi tidak disentuh. Tes e2e mengizinkan pasangan warna ini secara
  eksplisit dan gagal bila ada pelanggaran kontras lain. Dua pelanggaran lain yang tersisa:
  angka hitung-naik di beranda (`#16a34a` pada hijau muda) dan kartu tahap "pending" yang
  bergaya translusen (`bg-white/80`, `opacity-90`).
- **[dicatat]** Kartu dialog memakai `bg-white`, yang oleh aturan
  `main :is(.rounded-xl, .rounded-2xl, .rounded-3xl).bg-white` di `src/index.css` menjadi
  `rgb(255 255 255 / 0.82)`, di atas overlay gelap, jadi latar efektifnya abu-abu (sekitar
  `#e5e6e8`), bukan putih. Teks `slate-500` di dalamnya hanya 3,8:1.
- Sudah baik: `lang="id"`, tautan lewati konten, `:focus-visible` global, dialog dengan
  perangkap fokus dan pengembalian fokus, tahan-untuk-kunci bisa lewat keyboard (Enter/Spasi),
  `prefers-reduced-motion` di CSS dan `MotionConfig`.
- **[dicatat]** `reducedMotion` di `App.tsx` dibaca sekali saat mount, jadi mengubah preferensi
  OS saat halaman terbuka baru berlaku setelah muat ulang.

## 4. Tata letak 360px

Tidak ada gulir horizontal tingkat halaman di 7 halaman dan 3 dialog (`scrollWidth` = 360).
Kontainer yang melebihi lebar (tab Ruang Pelanggan, tabel analitik) adalah wilayah gulir
lokal yang sah; tes memastikan tidak ada kontrol interaktif yang terpotong di luar viewport.

- **[dicatat] Akar masalah di Beranda yang ditutupi `overflow-x-clip`.** Gambar latar hero
  (`absolute left-1/2 w-screen -translate-x-1/2`) sebenarnya melebar 180px melewati viewport
  di 360px (tanpa klip `scrollWidth` menjadi 540). Penyebab: aturan CSS
  `main .grid > * { animation: item-in ... both }` menganimasikan properti `translate` dan
  fill-mode `both` mempertahankan keyframe akhir `translate: 0 0`, sehingga utilitas
  `-translate-x-1/2` pada gambar (anak langsung `section.grid`) tertimpa dan gambar bergeser
  setengah lebarnya. Perbaikan satu baris: `main .grid > :not(.absolute)`. Saya **tidak**
  menerapkannya karena itu menggeser foto hero ke posisi yang sebenarnya ditulis penulisnya
  dan mengubah tampilan beranda dibanding screenshot README (foto bengkel jadi tampak di
  seluruh lebar hero, bukan hanya separuh kanan). Silakan putuskan; klip yang ada tetap
  menjaga tidak ada gulir horizontal.

## 5. File besar dan struktur

| File | Baris | Catatan |
| --- | --- | --- |
| `src/data/mockSeedData.ts` | 1071 | Data seed, wajar; bisa dipecah per entitas |
| `src/App.tsx` | 737 | Semua state dan handler; logika transisi kini di `src/lib/decisions.ts`, komponen masih besar |
| `src/components/public/RevioLanding.tsx` | 650 | Satu file untuk seluruh landing |
| `src/components/vendor/VendorDashboard.tsx` | 507 | Dasbor dan dialog catatan dalam satu file |

Lainnya: `VendorPublicProfile` diimpor dinamis oleh `App` tetapi juga statis oleh
`VendorProfileEditor` (peringatan `INEFFECTIVE_DYNAMIC_IMPORT`, tidak ada pemecahan chunk);
`vite.config.ts` memakai `__dirname` (peringatan Vite, akan rusak di versi mayor berikutnya);
bundle utama 442 kB (138 kB gzip).

## 6. Rantai alat

- **[diperbaiki]** Lockfile menunjuk mirror pihak ketiga (lihat baseline).
- **[diperbaiki]** `tsconfig` tidak mengaktifkan `strict`; ternyata kode sudah lolos `--strict`
  dengan 0 galat, jadi diaktifkan.
- **[dicatat]** `npm run lint` hanyalah `tsc`; belum ada ESLint (menambahkan ESLint akan
  memunculkan banyak temuan gaya di luar cakupan mode aman ini).
