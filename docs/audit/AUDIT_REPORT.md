# Audit Revio (2026-10-30)

Jenis: SPA demo frontend-only (React 19, Vite, Tailwind 4, data mock in-memory). Tanpa backend, auth, DB, atau tes.
Branch kerja: `chore/audit-20261030` (baseline: commit `f327f2f`).

**Batas verifikasi:** `npm install` tidak bisa jalan (registry tidak terjangkau dari sandbox, bypass ditolak). Lint, build, tes, screenshot, `npm audit` = **[TIDAK DIUJI]**. Semua perbaikan di bawah hanya hasil baca kode.

## Temuan dan status

| ID | Lokasi | Temuan | Berat | Status |
|---|---|---|---|---|
| BUG-001 | `ChangeOrderModal.tsx` | Hook (`useState`) dipanggil setelah `return null`; modal selalu ter-mount dengan `isOpen` berubah, jadi membuka modal memicu error "more hooks than previous render". Mengunci alur Change Order. | Tinggi | Diperbaiki (wrapper + `ChangeOrderForm`) **[TIDAK DIUJI]** |
| BIZ-001 | `ChangeOrderModal.tsx`, `App.tsx`, `VendorDashboard.tsx` | Biaya dikarang bila log kosong (`\|\| 450000`, `\|\| 6` jam, salvage tetap 35%, default 670.000, jam `\|\| 2`, tarif `\|\| 85000`). Melanggar aturan integritas DECISIONS.md #2 (biaya wajib tertaut bukti). | Tinggi | Diperbaiki: biaya dihitung dari log + `reusablePct` per bahan; tanpa bukti, tombol terbit dinonaktifkan dengan penjelasan **[TIDAK DIUJI]** |
| BUG-002 | `App.tsx` | Audit log/judul proyek memakai proyek terpilih, bukan proyek yang dioperasikan (dasbor vendor bisa memajukan proyek lain). | Sedang | Diperbaiki (`projectId` eksplisit) **[TIDAK DIUJI]** |
| BUG-003 | `App.tsx`, `NewProjectModal`, `AnalyticsView` | ID dari `Date.now().slice(-3/-4)` rawan tabrakan (key React ganda, log tertimpa). | Sedang | Diperbaiki (`crypto.randomUUID`) **[TIDAK DIUJI]** |
| VAL-001 | `VendorDashboard.tsx` | Input jam/jumlah/harga tanpa batas (negatif lolos), persen daur ulang tanpa rentang. | Sedang | Diperbaiki (`min`/`max`/`step`, klem persen) **[TIDAK DIUJI]** |
| UX-001 | `App.tsx` | Di bawah 768px mode demo tidak punya navigasi sama sekali (`hidden md:flex`). | Tinggi | Diperbaiki (select navigasi mobile) **[TIDAK DIUJI]** |
| A11Y-001 | `App.tsx`, modal | Logo klik berupa `div`; modal tanpa `role=dialog`, Esc, label tombol tutup; select/textarea tanpa label. | Sedang | Diperbaiki sebagian. Belum: focus trap penuh, pengembalian fokus **[TIDAK DIUJI]** |
| A11Y-002 | `App.tsx` | "Kurangi Animasi" tidak mengikuti `prefers-reduced-motion`. | Rendah | Diperbaiki (nilai awal dari media query) **[TIDAK DIUJI]** |
| CONTENT-001 | marketing, analitik, README | Klaim tak berdasar bukti: "Rp 420 Juta+", "-88%", "0 sengketa", "Lencana Platinum", "Standar UU PDP", "Log permanen/tidak dapat dihapus" (state hanya di memori, hilang saat refresh). | Tinggi (reputasi/hukum) | **Belum diubah**; butuh keputusan Anda (lihat MANUAL_ACTIONS) |
| ARCH-001 | seluruh app | Semua data in-memory; refresh menghapus semuanya. Tidak ada auth/RBAC; "peran" hanya pengalih tampilan. Aman sebagai demo, bukan produk. | Tinggi untuk produksi | Dicatat |
| DEP-001 | `package.json` | `express`, `dotenv`, `@google/genai`, `autoprefixer`, `pngjs`, `esbuild` tak diimpor di `src/`; dua library animasi (`framer-motion` dan `motion`); nama paket `react-example`; skrip `clean` merujuk `server.js`. | Rendah | Dicatat, tidak dihapus (belum bisa uji build) |
| SEC-001 | `index.html` | Font dari Google Fonts (kebocoran IP ke pihak ketiga, tanpa CSP). Tidak ditemukan `innerHTML`, `eval`, storage, atau secret di `src/`. `.env*` ter-ignore; `.env.example` hanya placeholder. | Rendah | Dicatat |
| TEST-001 | repo | Tidak ada tes; `lint` hanya `tsc --noEmit`. Logika biaya belum teruji. | Sedang | Dicatat |

Diperiksa untuk SEC: pola `innerHTML|dangerouslySetInnerHTML|eval|localStorage|process.env|api key|password` via grep di `src/` dan `index.html` (hanya 2 tautan `href={waUrl}` dengan `rel="noopener noreferrer"`). Pembentukan nomor pada tautan WA belum diperiksa **[ASUMSI: aman karena dari data seed]**. Riwayat Git baru dibuat oleh audit ini, jadi pemindaian rahasia riwayat tidak relevan.

## Tidak dikerjakan
Fase 2 (backend; tidak ada), Fase 4 penuh (token desain, kontras, responsif 320-1920, screenshot sebelum/sesudah, axe/Lighthouse), Fase 5-13. Prompt Anda terpotong di tengah Fase 4.10, jadi bagian setelahnya tidak saya terima. Dokumen THREAT_MODEL, DESIGN_SYSTEM, UI_INVENTORY, UX_FINDINGS, CAPABILITIES, PLACEHOLDERS, DATA_INVENTORY, CLEANUP_CANDIDATES belum ditulis. Red-team pass (Fase 13) belum dijalankan.
