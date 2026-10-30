# Yang harus dilakukan manusia

1. **[Memblokir verifikasi] Jalankan install dan pemeriksaan di mesin Anda**: `npm install && npm run lint && npm run build && npm audit`. Beri tahu hasilnya; sandbox tidak bisa menjangkau registry npm. Tanpa ini perbaikan di AUDIT_REPORT belum terbukti.
2. **[Memblokir rilis] Putuskan klaim marketing**: "Rp 420 Juta+", "-88%", "0 sengketa", Lencana Platinum, "Standar UU PDP", "log permanen". Beri data/bukti, atau setujui label "contoh ilustrasi" / penghapusan.
3. **[Memblokir rilis, bila produk nyata] Putuskan backend**: auth, RBAC server-side, DB, dan log audit yang benar-benar permanen. Saat ini hanya demo in-memory.
4. **Kirim ulang prompt yang terpotong** (berhenti di Fase 4.10) bila Fase 5-13 dan modul M1-M13 ingin dijalankan.
5. Putuskan pembersihan dependensi tak terpakai (`express`, `dotenv`, `@google/genai`, `autoprefixer`, `pngjs`, `esbuild`, salah satu dari `framer-motion`/`motion`) setelah build terverifikasi.
6. Hosting font sendiri bila ingin menghindari Google Fonts (privasi/CSP).
