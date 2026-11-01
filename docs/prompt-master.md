Prompt Master Pembuatan Aplikasi Revio
Salin seluruh isi dokumen ini ke AI pembuat aplikasi (Claude Code, Cursor, Lovable, Bolt, dan sejenisnya). Dokumen ini mencakup konsep, merek, sistem animasi, peran pengguna, fitur, profil perusahaan, basis data, API, tampilan, keamanan, dan urutan pengerjaan.
Catatan asumsi: nama yang dipakai adalah Revio (pilihan dari daftar nama). Belum ada logo yang diunggah, jadi dokumen ini memuat arahan agar AI pembuat membuat logo SVG sendiri (Bagian 3). Jika nama atau logo diganti, cukup ubah Bagian 3.
1. PERAN DAN TUJUAN
Kamu adalah tim senior full-stack (product engineer, backend engineer, UI/UX dan motion engineer, QA). Bangun aplikasi web lengkap bernama Revio, platform yang menghubungkan hak revisi pelanggan dengan tahap produksi yang masih dapat diubah, sehingga pelanggan tahu kapan sebuah keputusan harus dikunci dan berapa biayanya jika ditunda.
Aturan kerja:
• Tulis kode produksi yang rapi, bertipe (TypeScript), bisa dijalankan, dan diberi komentar seperlunya.
• Semua data contoh masuk ke file seed dan ditandai sebagai contoh.
• Semua teks antarmuka berbahasa Indonesia yang jelas, jujur, dan ramah. Siapkan struktur i18n agar bahasa Inggris bisa ditambah kelak.
• Tampilan tidak boleh polos: ikuti sistem animasi di Bagian 4 pada setiap halaman penting.
• Kerjakan bertahap sesuai Bagian 17, dan setelah tiap tahap pastikan aplikasi berjalan sebelum lanjut.
• Jika ada keputusan yang belum ditentukan di dokumen ini, pilih opsi paling sederhana yang aman, lalu catat di DECISIONS.md.
2. MASALAH DAN KONSEP INTI
Masalah: pelanggan sering belum siap memutuskan (warna, ukuran, bahan, desain), sementara vendor harus mulai bekerja. Perubahan setelah tahap tertentu membuat bahan dan pekerjaan terbuang, lalu berujung sengketa biaya.
Alternatif yang ada: batas jumlah revisi, persetujuan desain, dan change order. Semuanya berbasis jumlah revisi atau tanggal, bukan pada pekerjaan yang benar-benar sudah dikerjakan.
Solusi: vendor menandai keputusan penting, tahap yang membuatnya mahal diubah, dan biaya mempertahankan fleksibilitas. Pelanggan memilih mengunci atau menunda keputusan dalam batas yang disepakati. Hak revisi mengikuti pekerjaan yang benar-benar telah dilakukan.
Istilah inti (pakai konsisten di kode dan antarmuka):
• Keputusan Penting: pilihan pelanggan yang memengaruhi produksi (contoh: warna finishing, dimensi, jenis bahan, naskah cetak).
• Tahap Produksi: urutan pekerjaan vendor (contoh: desain, potong bahan, rakit, finishing, kemas).
• Titik Kunci: tahap tempat sebuah keputusan menjadi mahal atau tidak mungkin diubah.
• Jendela Revisi: rentang waktu atau tahap saat keputusan masih bisa diubah dengan biaya rendah.
• Biaya Fleksibilitas: biaya menjaga pilihan tetap terbuka (menahan bahan cadangan, memesan ulang jadwal, pekerjaan paralel).
• Pekerjaan Terdampak: pekerjaan dan bahan yang sudah terpakai dan bergantung pada keputusan itu.
• Skor Fleksibilitas (0 sampai 100): seberapa mudah keputusan masih diubah saat ini.
Rumus dasar (dapat dikonfigurasi per vendor):
• Biaya Perubahan = (jam kerja terdampak x tarif) + (bahan terpakai yang tidak dapat dipakai ulang) - (nilai pakai ulang) + biaya penjadwalan ulang.
• Skor Fleksibilitas = 100 dikurangi persentase nilai pekerjaan proyek yang sudah bergantung pada keputusan tersebut.
• Revisi ringan (gratis atau murah) berlaku selama Pekerjaan Terdampak berada di bawah ambang yang disepakati (default 5 persen nilai proyek).
Pembeda: transparan, adil, dan berbasis bukti pekerjaan nyata. Risiko utama: vendor melebih-lebihkan biaya perubahan atau tidak memperbarui tahap. Produk harus punya pengaman nyata (Bagian 8.7 dan 13).
Pengguna:
1. Vendor produksi pesanan: pembuat furnitur, percetakan khusus, dekorator, konveksi, dan sejenisnya
2. Pelanggan vendor
3. Staf produksi dan admin vendor
4. Admin platform
3. IDENTITAS MEREK (WAJIB DIIKUTI)
Belum ada berkas logo, jadi buat sendiri logo Revio dalam format SVG dan simpan di /public/brand/: revio-logo-full.svg (ikon + wordmark), revio-logo-mark.svg (ikon saja), revio-logo-white.svg (satu warna putih), dan favicon.
Arahan logo: wordmark "Revio" dengan huruf sans-serif geometris membulat, tebal, warna brand-ink. Titik pada huruf i berwarna amber (melambangkan Titik Kunci). Ikon berupa huruf R membulat yang lubang dalamnya berupa lingkaran amber, dengan satu garis lengkung tipis di sisi kanan yang melambangkan Jendela Revisi yang perlahan menutup. Kesan: tegas, tepercaya, hangat, dan modern.
Palet warna (jadikan design token Tailwind):
• brand-ink: #12203A (teks utama, judul, ikon)
• brand-teal: #0E9F8E (primer, tombol utama, status aman)
• brand-amber: #FFB020 (aksen, Titik Kunci, sorotan penting)
• brand-teal-dark: #0A7A6D (hover)
• Netral: krem hangat #FBF9F5 (latar), putih #FFFFFF, garis #E7E2D9, teks sekunder #5E6678
• Status: fleksibel hijau #16A34A, mendekati kunci kuning #F59E0B, terkunci #64748B, bahaya #DC2626
Tipografi: Sora (judul, angka besar) dan Inter (isi), JetBrains Mono untuk angka biaya. Sudut membulat (radius 14 sampai 24 px), bayangan lembut berlapis, dan banyak ruang putih.
Gaya antarmuka: profesional namun hidup. Gunakan kartu bergaris halus, gradasi teal ke krem yang lembut, ikon garis (lucide-react), ilustrasi vektor sederhana bertema bengkel dan produksi, serta mode gelap. Kontras memenuhi WCAG AA dan tampilan mobile-first.
Nada tulisan: jelas, jujur soal biaya, tidak menekan. Contoh: "Keputusan ini masih fleksibel. Tahap berikutnya akan membuat perubahan lebih mahal."
4. SISTEM ANIMASI DAN GERAK (WAJIB)
Tampilan harus hidup, halus, dan bermakna. Setiap gerak harus menjelaskan sesuatu (perubahan status, urutan, sebab-akibat), bukan sekadar hiasan.
Alat: Framer Motion (transisi UI, layout, gestur), GSAP + ScrollTrigger (cerita gulir di situs company profile), Lottie (ilustrasi dan keadaan kosong), CSS untuk mikro-interaksi ringan.
Token gerak (jadikan konstanta bersama):
• Durasi: cepat 150 ms, standar 250 ms, lambat 400 ms, ekspresif 700 ms
• Easing: cubic-bezier(0.22, 1, 0.36, 1) untuk masuk, cubic-bezier(0.4, 0, 1, 1) untuk keluar
• Spring: kekakuan 260, redaman 24 untuk elemen interaktif
• Stagger antar-item: 60 ms
Animasi signature Revio:
1. Titik Amber: pada logo dan pemuatan awal, titik amber jatuh, memantul sekali, lalu "mengunci" ke tempatnya dengan efek klik halus.
2. Pita Fleksibilitas: bilah di bawah setiap keputusan yang menyusut halus saat tahap produksi maju, berubah warna hijau, kuning, abu-abu, dengan label Skor Fleksibilitas yang berhitung naik atau turun.
3. Jendela Revisi menutup: di dasbor dan situs, jendela bergaya garis yang menyempit seiring kemajuan tahap.
4. Gembok hidup: ikon gembok terbuka, setengah, lalu terkunci dengan animasi spring dan getar tipis (mikro) saat keputusan dikunci.
5. Tahan untuk Mengunci: tombol Kunci memakai interaksi tekan dan tahan 1 detik dengan cincin progres yang mengisi, agar keputusan penting tidak terkunci tidak sengaja.
6. Garis waktu menggambar diri: jalur SVG tahap produksi tergambar saat muncul, tahap aktif berdenyut lembut, tahap selesai mendapat centang yang tergambar.
7. Angka yang hidup: biaya, skor, dan statistik memakai count-up, dan grafik tergambar bertahap.
8. Kalkulator biaya interaktif: saat penggeser (slider) tunda digeser, angka biaya dan pita fleksibilitas berubah secara real-time dengan transisi mulus.
Animasi umum:
• Transisi halaman: fade dan geser 250 ms, elemen bersama (shared element) untuk kartu proyek ke detail proyek.
• Kartu muncul berurutan (stagger) saat masuk layar, hover mengangkat kartu 4 px dengan bayangan lebih dalam.
• Skeleton shimmer saat memuat, toast bergeser masuk, lonceng notifikasi bergetar saat ada pesan baru.
• Keadaan kosong memakai ilustrasi Lottie ringan, tombol utama punya efek magnetik halus (desktop).
• Situs company profile: hero dengan parallax berlapis, teks muncul per kata, bagian cerita yang disematkan (pinned) saat gulir, penghitung angka, marquee logo vendor, dan cahaya lembut yang mengikuti kursor (desktop saja).
Aturan wajib (aksesibilitas dan performa):
• Hormati prefers-reduced-motion: matikan parallax, pinning, dan gerak berulang, ganti dengan fade sederhana. Sediakan juga sakelar "Kurangi animasi" di pengaturan.
• Tidak ada kedipan lebih dari 3 kali per detik. Animasi tidak boleh menghalangi tugas (bisa dilewati).
• Animasi hanya memakai transform dan opacity agar tetap 60 fps. Hentikan animasi saat di luar layar dan di tab latar.
• Lottie dan GSAP dimuat malas (lazy). Anggaran JS animasi maksimal sekitar 150 KB setelah kompresi, dan skor Lighthouse performa tetap di atas 90 pada halaman publik.
• Semua animasi yang menyampaikan makna (status kunci, perubahan skor) harus punya padanan teks atau ikon untuk pembaca layar.
5. TEKNOLOGI (STACK)
Frontend
• Next.js 14+ (App Router) dengan TypeScript ketat
• Tailwind CSS + shadcn/ui + lucide-react
• Framer Motion, GSAP + ScrollTrigger, Lottie (lottie-react)
• TanStack Query untuk data server, Zustand untuk status UI lokal
• React Hook Form + Zod untuk formulir dan validasi
• Recharts untuk grafik, next-intl untuk i18n
• PWA (pelanggan bisa memasang di ponsel dan menerima pengingat)
Backend
• NestJS (Node.js, TypeScript) modular, REST API, dokumentasi OpenAPI/Swagger
• PostgreSQL 15+ dengan Prisma ORM dan migrasi
• Redis untuk sesi, antrean, dan rate limiting; BullMQ untuk pekerjaan terjadwal (pengingat tahap, tenggat keputusan, PDF)
• Penyimpanan berkas kompatibel S3 (MinIO untuk lokal) untuk foto progres, desain, dan lampiran
• Socket.io untuk pembaruan status tahap secara waktu nyata
• Autentikasi JWT (access 15 menit + refresh token dalam cookie httpOnly), hash kata sandi argon2; pelanggan bisa masuk lewat tautan ajaib dari email atau WhatsApp tanpa membuat kata sandi
• Email via SMTP (Nodemailer) dan tautan berbagi WhatsApp dengan templat berlogo Revio
Infrastruktur
• Docker Compose (web, api, postgres, redis, minio, mailhog), .env.example lengkap
• GitHub Actions: lint, tes, build
• Monorepo (pnpm workspace): apps/web, apps/api, packages/shared (tipe, skema Zod, konstanta, token gerak)
6. PERAN DAN HAK AKSES (RBAC)
Peran
Dapat melakukan
Pemilik Vendor
Mengelola perusahaan, profil, langganan, tarif, templat, semua proyek, dan laporan
Admin Vendor
Mengelola proyek, keputusan, tahap, pelanggan, dan penagihan
Staf Produksi
Memperbarui tahap, mencatat pekerjaan dan bahan, mengunggah foto progres
Pelanggan
Melihat proyek sendiri, memilih Kunci atau Tunda, menyetujui perubahan, membayar, memberi ulasan
Admin Platform
Mengelola vendor, templat industri global, langganan, dan audit
Pengecekan hak akses di backend (guard) dan frontend. Setiap data terikat ke vendor_id (multi-tenant) dan pelanggan hanya melihat proyeknya sendiri.
7. ALUR UTAMA SATU PROYEK
1. Proyek dibuat. Vendor membuat proyek dari templat industri (furnitur, percetakan, dekorasi) atau dari nol, memilih pelanggan, nilai proyek, dan jadwal.
2. Pemetaan keputusan. Vendor menandai Keputusan Penting, tiap keputusan dihubungkan ke Titik Kunci (tahap) dan Biaya Fleksibilitas.
3. Kesepakatan awal. Pelanggan membaca Peta Keputusan dan menyetujui aturan: ambang revisi ringan, biaya menunda, dan tenggat tiap keputusan.
4. Produksi berjalan. Staf memperbarui tahap dan mencatat pekerjaan nyata (jam, bahan, foto). Sistem menghitung ulang Skor Fleksibilitas dan Biaya Perubahan setiap keputusan.
5. Pilihan pelanggan. Untuk tiap keputusan, pelanggan memilih Kunci Sekarang, Tunda (sampai tahap atau tanggal tertentu, dengan biaya fleksibilitas yang jelas), atau Ubah (dengan estimasi biaya).
6. Peringatan menjelang kunci. Sistem mengingatkan sebelum tahap yang menutup Jendela Revisi.
7. Perubahan (change order). Bila pelanggan mengubah keputusan, sistem membuat rincian biaya dari data pekerjaan nyata, pelanggan menyetujui, lalu tahap dan jadwal diperbarui.
8. Selesai dan evaluasi. Proyek ditutup, dicatat pengerjaan ulang, bahan terbuang, dan sengketa, lalu pelanggan memberi penilaian kejelasan biaya.
8. FITUR DETAIL PER MODUL
8.1 Autentikasi dan Akun
• Vendor: daftar, verifikasi email, masuk, atur ulang kata sandi, undang staf lewat tautan.
• Pelanggan: masuk dengan tautan ajaib (email atau WhatsApp) langsung ke proyeknya.
• Sesi perangkat, keluar dari semua perangkat, dan pembatasan percobaan masuk.
8.2 Profil Perusahaan Vendor (Company Profile)
Setiap vendor mendapat halaman profil publik di revio.id/v/{slug-vendor}:
• Hero dengan logo vendor, nama, kategori usaha, kota, tagline, dan tombol "Minta Penawaran" atau "Hubungi via WhatsApp".
• Tentang usaha: cerita singkat, tahun berdiri, foto bengkel atau tim, nilai dan keunggulan.
• Layanan dan kapasitas: jenis produk, bahan yang dipakai, waktu pengerjaan rata-rata, dan jangkauan wilayah.
• Portofolio: galeri proyek dengan foto, keterangan, bahan, dan durasi, tampil dengan animasi grid dan lightbox.
• Lencana Kepastian (unik Revio): peringkat transparansi biaya vendor berdasarkan data nyata (persentase keputusan yang dikunci tepat waktu, sengketa rendah, kejelasan biaya). Lencana hanya muncul bila memenuhi ambang dan datanya dapat diverifikasi.
• Ulasan pelanggan yang terverifikasi dari proyek nyata di platform.
• Alur kerja vendor: ringkasan tahap produksi, kebijakan revisi, dan contoh Peta Keputusan.
• Kontak, jam kerja, peta lokasi (tanpa memuat skrip pihak ketiga yang melacak), dan tautan media sosial.
• Editor profil di dasbor dengan pratinjau langsung, unggah foto (kompresi otomatis), pengaturan SEO (judul, deskripsi, gambar berbagi), dan sakelar tampil atau sembunyi per bagian.
• Vendor memilih templat tampilan (tiga pilihan) dan warna aksen dari palet yang diizinkan.
8.3 Proyek dan Pesanan
• Buat proyek: pelanggan, judul, deskripsi, nilai, uang muka, jadwal, lampiran desain.
• Templat industri (furnitur, percetakan, dekorasi) berisi tahap dan keputusan umum yang bisa diubah.
• Daftar proyek dengan filter, pencarian, dan indikator "keputusan mendekati kunci".
• Pelanggan memiliki ruang proyek: ringkasan, Peta Keputusan, garis waktu, percakapan, dan dokumen.
8.4 Peta Keputusan
• Tampilan visual semua Keputusan Penting dengan status: Fleksibel, Mendekati Kunci, Terkunci, Ditunda.
• Setiap kartu menampilkan: keputusan, pilihan yang tersedia, Titik Kunci, Skor Fleksibilitas, Biaya Perubahan saat ini, dan tenggat.
• Kartu terbuka menjelaskan mengapa mahal dalam bahasa awam, dengan rincian pekerjaan terdampak dan foto bukti.
• Pita Fleksibilitas dan gembok hidup (Bagian 4) menjadi elemen utama.
8.5 Tahap Produksi dan Garis Waktu
• Vendor mengatur urutan tahap, estimasi durasi, dan keputusan mana yang terkunci di tahap mana.
• Staf memperbarui tahap dengan satu ketukan, menambahkan foto dan catatan, dan sistem mencatat waktu serta pelakunya.
• Pengingat kebaruan: bila tahap tidak diperbarui lebih dari batas waktu (default 24 jam saat jam kerja), vendor dan admin diingatkan, dan pelanggan melihat tanda "terakhir diperbarui". Ini mengurangi risiko vendor tidak memperbarui tahap.
• Garis waktu publik untuk pelanggan, dengan animasi jalur yang tergambar.
8.6 Jejak Pekerjaan dan Bahan
• Pencatatan jam kerja, bahan terpakai (jumlah, satuan, harga), dan bahan yang bisa dipakai ulang per keputusan.
• Tiap catatan terhubung ke keputusan yang terdampak sehingga Pekerjaan Terdampak dihitung dari data nyata, bukan perkiraan sepihak.
• Foto bertanda waktu sebagai bukti, dan catatan tidak bisa dihapus (hanya dikoreksi dengan riwayat).
8.7 Biaya Fleksibilitas dan Transparansi Biaya
• Vendor mengisi, per keputusan: dasar perhitungan Biaya Fleksibilitas dan Biaya Perubahan (tarif per jam, harga bahan, biaya penjadwalan ulang).
• Kalkulator pelanggan: geser "tunda sampai tahap..." untuk melihat biaya fleksibilitas dan sisa Skor Fleksibilitas secara langsung.
• Pengaman anti-pelebihan biaya: setiap biaya wajib mereferensikan catatan pekerjaan nyata, ada batas wajar relatif terhadap nilai proyek, penanda "di atas rata-rata proyek sejenis", pelanggan dapat menantang rincian, dan semua perubahan angka tercatat di log audit.
• Ringkasan biaya satu halaman yang bisa dicetak atau dibagikan.
8.7a Pilihan Kunci, Tunda, atau Ubah
• Untuk setiap keputusan, tiga tindakan jelas dengan ringkasan akibat dan biaya.
• Kunci Sekarang: tahan untuk mengonfirmasi, dicap waktu, dan tahap terkait dibuka.
• Tunda: pilih batas (tahap atau tanggal). Sistem menampilkan biaya fleksibilitas dan konsekuensi jadwal. Setelah batas, keputusan terkunci otomatis dengan pemberitahuan beberapa kali sebelumnya.
• Ubah: lihat estimasi, ajukan perubahan, dan masuk ke alur persetujuan.
8.8 Perubahan dan Persetujuan (Change Order)
• Dokumen perubahan berisi: keputusan lama dan baru, pekerjaan terdampak, bahan terbuang, biaya, dampak jadwal, dan batas persetujuan.
• Persetujuan pelanggan lewat tanda tangan sederhana (ketuk dan tahan) dengan cap waktu, dan vendor menerima notifikasi.
• Riwayat semua perubahan per proyek dan unduhan PDF berlogo Revio dan logo vendor.
8.9 Pembayaran
• Rencana pembayaran: uang muka, termin sesuai tahap, pelunasan. Tagihan perubahan otomatis tersambung ke change order yang disetujui.
• Faktur PDF dan status pembayaran. Untuk MVP pembayaran dicatat manual oleh vendor, dengan antarmuka siap dihubungkan ke Midtrans atau Xendit.
8.10 Percakapan dan Notifikasi
• Percakapan per proyek dan per keputusan (dengan lampiran foto), tanpa perlu pelanggan membuka banyak kanal.
• Notifikasi dalam aplikasi, email, dan tautan WhatsApp: tahap diperbarui, keputusan mendekati kunci, tenggat tunda, change order baru, pembayaran.
• Preferensi notifikasi dan jam tenang per pengguna.
8.11 Sengketa dan Penyelesaian
• Pelanggan atau vendor dapat membuka sengketa pada keputusan atau change order tertentu. Sistem menyusun paket bukti otomatis (catatan pekerjaan, foto, log persetujuan, riwayat biaya).
• Alur: tanggapan, usulan penyelesaian, dan pencatatan hasil. Admin vendor dapat menambahkan mediator internal.
8.12 Analitik dan Validasi Dampak
• Pengerjaan ulang: jam dan biaya pengerjaan ulang per proyek dan per kategori keputusan.
• Bahan terbuang: nilai dan jumlah bahan terbuang akibat perubahan.
• Sengketa: jumlah, durasi penyelesaian, dan nilai yang disengketakan.
• Kejelasan biaya pelanggan: survei singkat pascaproyek (skala 1 sampai 5) tentang seberapa jelas biaya perubahan dijelaskan.
• Perbandingan dengan proyek sejenis sebelumnya: vendor mengimpor data proyek lama (CSV) untuk membandingkan kerugian sebelum dan sesudah memakai Revio.
• Uji transparansi biaya: laporan yang menandai vendor atau keputusan dengan biaya perubahan jauh di atas rata-rata, serta keputusan yang tahapnya jarang diperbarui.
• Ekspor CSV dan PDF.
8.13 Langganan Vendor
• Paket bertingkat: Mulai (hingga 5 proyek aktif), Tumbuh (proyek tidak terbatas, profil perusahaan lengkap, analitik), dan Pro (multi-cabang, templat khusus, akses API).
• Halaman paket, penggunaan kuota, faktur, dan masa percobaan gratis. Untuk MVP status langganan dikelola manual oleh Admin Platform.
8.14 Log Audit
• Catat siapa mengubah apa dan kapan: tahap, biaya, keputusan, persetujuan, dan pengaturan. Log tidak dapat diedit dan ikut dilampirkan pada paket bukti sengketa.
9. SITUS COMPANY PROFILE REVIO (HALAMAN PEMASARAN PERUSAHAAN)
Bangun situs perusahaan Revio sebagai bagian dari aplikasi yang sama (rute publik, dirender di server untuk SEO). Tampilan harus bergaya, hidup, dan penuh gerak sesuai Bagian 4, bukan halaman statis polos.
Halaman dan isi:
1. Beranda: hero dengan logo animasi (Titik Amber jatuh dan mengunci), judul besar, subjudul, dua tombol ("Coba Gratis" dan "Lihat Cara Kerja"), dan mockup dasbor yang bergerak. Di bawahnya: bilah angka dampak (count-up), marquee logo vendor mitra, dan ringkasan masalah yang menyentuh (cerita pelanggan yang berubah pikiran di tengah produksi).
2. Cara Kerja (cerita gulir): bagian yang disematkan saat gulir. Garis waktu produksi tergambar, Jendela Revisi menyempit, Pita Fleksibilitas menyusut, dan keputusan berganti dari Fleksibel ke Terkunci langkah demi langkah.
3. Fitur: kartu bergerak untuk Peta Keputusan, Kalkulator Biaya Fleksibilitas, Tahan untuk Mengunci, Change Order, Profil Vendor, dan Analitik. Setiap kartu punya demo mini yang bisa dicoba.
4. Untuk Siapa: tab animasi untuk furnitur, percetakan khusus, dekorasi, dan produksi lain, dengan contoh keputusan mahal di masing-masing industri.
5. Tentang Kami: visi dan misi, cerita pendirian, nilai perusahaan (transparan, adil, tepat waktu), dan tim (foto, nama, peran) dengan animasi kartu.
6. Harga: tiga paket (Mulai, Tumbuh, Pro) dengan sakelar bulanan atau tahunan yang menganimasikan perubahan angka, tabel perbandingan, dan FAQ akordeon.
7. Studi Kasus dan Testimoni: cerita vendor, angka sebelum dan sesudah (pengerjaan ulang, bahan terbuang, sengketa), dan karusel testimoni.
8. Direktori Vendor: daftar vendor publik dengan filter kategori, kota, dan Lencana Kepastian, tiap kartu membuka profil vendor (Bagian 8.2).
9. Blog dan Sumber Belajar: artikel tentang mengelola revisi dan biaya produksi, kategori, dan pencarian.
10. Kontak dan Demo: formulir permintaan demo, WhatsApp, peta, dan jam layanan.
11. Halaman hukum: Syarat Penggunaan, Kebijakan Privasi (sesuai UU PDP), dan Kebijakan Transparansi Biaya.
Komponen bersama: navigasi lengket yang mengecil saat gulir, footer lengkap, banner persetujuan kuki yang ringan, sakelar mode gelap, pengalih bahasa, dan tombol WhatsApp mengambang.
Kualitas: SEO lengkap (metadata, Open Graph, peta situs, data terstruktur LocalBusiness untuk profil vendor), gambar teroptimasi dengan pemuatan malas, skor Lighthouse di atas 90, aksesibel, dan semua animasi mematuhi aturan Bagian 4.
Semua isi situs (teks, tim, studi kasus) disimpan sebagai data yang bisa diubah Admin Platform lewat panel manajemen konten sederhana, bukan ditulis mati di dalam kode.
10. MODEL DATA (PostgreSQL, Prisma)
Semua tabel punya id (UUID), created_at, updated_at, dan vendor_id bila relevan. Gunakan soft delete (deleted_at) untuk data proyek dan keuangan.
• vendors: name, slug, category, city, logo_url, plan_id, status, certified_badge_level
• vendor_profiles: vendor_id, tagline, about, founded_year, hero_image, template, accent_color, seo (JSON), sections_visibility (JSON), contact (JSON), social (JSON)
• vendor_services: vendor_id, name, description, materials, avg_lead_days, coverage_area
• portfolio_items: vendor_id, title, description, materials, duration_days, images (JSON), order
• users: name, email, phone, password_hash, avatar_url, locale; memberships: user_id, vendor_id, role
• customers: vendor_id, user_id, name, phone, email, notes
• project_templates: vendor_id (null = global), industry, title, stages (JSON), decisions (JSON)
• projects: vendor_id, customer_id, title, description, value_amount, deposit_amount, status, starts_on, due_on, flexibility_threshold_pct
• stages: project_id, name, order, planned_start, planned_end, actual_start, actual_end, status, last_updated_at, updated_by
• stage_updates: stage_id, note, photo_keys (JSON), created_by
• decisions: project_id, title, description, options (JSON), lock_stage_id, status (fleksibel, mendekati_kunci, terkunci, ditunda), chosen_option, flexibility_score, current_change_cost, deadline_at, locked_at, locked_by, deferred_until_stage_id, deferred_until_date
• cost_bases: decision_id, hourly_rate, reschedule_fee, flexibility_fee_formula (JSON), notes, set_by
• work_logs: project_id, stage_id, decision_id, hours, rate, description, photo_key, logged_by, logged_at
• material_logs: project_id, decision_id, material, quantity, unit, unit_price, reusable_pct, logged_at
• flex_choices: decision_id, user_id, action (kunci, tunda, ubah), defer_until (JSON), fee_amount, schedule_impact_days, confirmed_at
• change_orders: project_id, decision_id, from_option, to_option, affected_work (JSON), wasted_material_value, cost_amount, schedule_impact_days, status (diajukan, disetujui, ditolak, dibatalkan), approved_by, approved_at, expires_at
• cost_challenges: change_order_id, raised_by, reason, status, resolved_note
• payment_plans: project_id, items (JSON); invoices: project_id, change_order_id, amount, status, pdf_key; payments: invoice_id, amount, method, paid_at
• messages: project_id, decision_id, user_id, body, attachments (JSON)
• disputes: project_id, decision_id, change_order_id, opened_by, status, evidence_package_key, resolution
• reviews: project_id, customer_id, rating, cost_clarity_score (1 sampai 5), comment, verified
• rework_records: project_id, decision_id, hours, material_value, cause
• historical_projects: vendor_id, data (JSON; impor proyek sebelumnya untuk pembanding)
• site_content: key, locale, data (JSON; isi situs company profile); team_members, case_studies, blog_posts, demo_requests
• notifications, audit_logs, plans, subscriptions, vendor_invoices
Buat indeks pada vendor_id, project_id, decision_id, stage_id, dan kolom filter yang sering dipakai.
11. API (REST, prefiks /api/v1)
Semua respons memakai format { data, meta, error }. Validasi dengan Zod atau class-validator, paginasi ?page=&limit=, urutan ?sort=, dan kode galat yang konsisten.
• Auth: POST /auth/register, /auth/login, /auth/magic-link, /auth/refresh, /auth/logout, /auth/forgot, /auth/reset, GET /auth/me
• Vendor dan profil: GET/PATCH /vendors/me, GET/PUT /vendors/me/profile, CRUD /vendors/me/services, CRUD /vendors/me/portfolio, POST /vendors/me/uploads/presign, GET /public/vendors, GET /public/vendors/:slug
• Proyek: GET/POST/PATCH /projects, GET /projects/:id, POST /projects/from-template, GET /templates
• Tahap: GET/POST/PATCH /projects/:id/stages, POST /stages/:id/updates, POST /stages/:id/advance
• Keputusan: GET/POST/PATCH /projects/:id/decisions, PUT /decisions/:id/cost-basis, GET /decisions/:id/flexibility (skor, biaya perubahan saat ini, penjelasan), GET /decisions/:id/simulate?deferTo= (kalkulator biaya)
• Pilihan pelanggan: POST /decisions/:id/lock, POST /decisions/:id/defer, POST /decisions/:id/change-request
• Jejak pekerjaan: POST /projects/:id/work-logs, POST /projects/:id/material-logs, GET /projects/:id/impact-summary
• Change order: GET /projects/:id/change-orders, POST /change-orders/:id/approve, /reject, POST /change-orders/:id/challenge, GET /change-orders/:id/pdf
• Pembayaran: GET/PUT /projects/:id/payment-plan, POST /invoices, POST /invoices/:id/payments, GET /invoices/:id/pdf
• Percakapan: GET/POST /projects/:id/messages, GET /notifications, PATCH /notifications/:id/read
• Sengketa dan ulasan: POST /disputes, GET /disputes/:id/evidence, POST /disputes/:id/resolve, POST /projects/:id/review
• Analitik: GET /analytics/overview, /analytics/rework, /analytics/waste, /analytics/disputes, /analytics/cost-clarity, POST /analytics/historical/import, GET /analytics/benchmark, GET /analytics/cost-transparency, GET /analytics/export
• Situs perusahaan: GET /public/site/:key, POST /public/demo-requests, GET /public/blog, GET /public/case-studies; admin: CRUD /admin/site-content
• Langganan dan audit: GET /billing/plan, GET /billing/invoices, GET /audit-logs
Socket.io (namespace /projects): kejadian stage:updated, decision:status, flexibility:recalculated, changeorder:created, message:new. Hanya pihak pada proyek itu yang dapat bergabung.
Logika bisnis penting (wajib diuji):
• Skor Fleksibilitas dan Biaya Perubahan dihitung ulang otomatis setiap kali tahap maju atau catatan pekerjaan atau bahan bertambah.
• Biaya Perubahan hanya boleh bersumber dari catatan pekerjaan dan bahan yang tertaut ke keputusan tersebut. Angka tanpa catatan ditolak.
• Keputusan yang melewati Titik Kunci tidak bisa diubah tanpa change order yang disetujui.
• Tunda hanya boleh sampai batas yang disepakati, lalu keputusan terkunci otomatis dan pelanggan diberi tahu beberapa kali sebelumnya.
• Pengingat kebaruan: tahap yang tidak diperbarui melewati batas membuat tanda peringatan, dan biaya perubahan yang bergantung pada tahap itu ditandai "menunggu pembaruan".
• Change order kedaluwarsa bila tidak ditanggapi sampai batas waktu, dan jadwal tidak berubah.
• Biaya perubahan di atas batas wajar proyek otomatis ditandai untuk tinjauan pemilik vendor.
12. DAFTAR HALAMAN DAN TAMPILAN
Publik: seluruh halaman situs company profile (Bagian 9), profil vendor revio.id/v/{slug}, Masuk, Daftar, dan tautan ajaib pelanggan.
Pelanggan: Beranda proyek, Ruang Proyek (ringkasan, garis waktu, Peta Keputusan, percakapan, dokumen), Detail Keputusan (kalkulator, tombol Kunci, Tunda, Ubah), Persetujuan Change Order, Pembayaran, Ulasan.
Vendor (Admin dan Staf): Dasbor (keputusan mendekati kunci, tahap tertinggal, perubahan menunggu), Daftar Proyek, Buat Proyek dan Templat, Editor Peta Keputusan, Papan Tahap Produksi, Catatan Pekerjaan dan Bahan, Change Order, Pembayaran, Sengketa, Analitik, Editor Profil Perusahaan (pratinjau langsung), Pengaturan Tarif dan Dasar Biaya, Tim, Langganan, Log Audit.
Admin Platform: Vendor, Templat Industri Global, Manajemen Konten Situs, Langganan, Pemantauan Sistem.
Komponen UI khusus: kartu keputusan dengan Pita Fleksibilitas, gembok hidup, tombol tahan-untuk-mengunci, kalkulator geser, garis waktu menggambar diri, papan tahap (kanban dengan seret dan lepas), pembanding sebelum dan sesudah, lightbox portofolio, editor profil dengan pratinjau, dan keadaan kosong beranimasi.
Aksesibilitas dan performa: navigasi keyboard, label ARIA, ukuran sentuh minimal 44 px, tampilan nyaman di ponsel 360 px, dan skor Lighthouse di atas 90 pada halaman publik.
13. VALIDASI DAN KUALITAS
Bangun cara mengukur apakah Revio benar-benar bermanfaat dan jujur:
• Ukur pengerjaan ulang, bahan terbuang, sengketa, dan kejelasan biaya pelanggan (Bagian 8.12).
• Bandingkan kerugian proyek di Pasti dengan proyek sejenis sebelumnya (impor CSV), per kategori keputusan.
• Uji transparansi biaya: laporan yang menandai biaya perubahan jauh di atas rata-rata proyek sejenis, catatan pekerjaan yang tidak masuk akal, dan tahap yang jarang diperbarui.
• Kendalikan risiko vendor yang melebih-lebihkan biaya: kewajiban catatan nyata, batas wajar, tantangan pelanggan, log audit, dan Lencana Kepastian yang hanya diberikan pada vendor dengan data terverifikasi.
• Survei singkat setelah proyek dan ekspor data untuk analisis.
14. KEAMANAN DAN PRIVASI
• Patuhi UU Pelindungan Data Pribadi (UU PDP). Kumpulkan data seperlunya dan tampilkan persetujuan yang jelas.
• Validasi masukan di server, sanitasi teks, batasi tipe dan ukuran berkas, simpan berkas di penyimpanan privat dengan URL bertanda tangan yang kedaluwarsa.
• Rate limiting, proteksi CSRF, header keamanan (Helmet), CORS ketat, dan log galat tanpa data pribadi.
• Enkripsi saat transit (HTTPS), cadangan basis data harian, serta ekspor dan penghapusan data pribadi atas permintaan.
• Isolasi data antar-vendor diuji otomatis. Pelanggan tidak boleh melihat data proyek lain.
• Tautan ajaib berumur pendek, sekali pakai, dan dibatasi per proyek.
• Catatan keuangan, persetujuan, dan perubahan biaya tidak dapat dihapus, hanya dikoreksi dengan riwayat.
15. PENGUJIAN
• Tes unit untuk rumus Skor Fleksibilitas, Biaya Perubahan, aturan tunda dan kunci otomatis, serta hak akses.
• Tes integrasi API (Jest + Supertest) untuk alur penuh satu proyek dari pembuatan sampai penutupan, termasuk satu change order.
• Tes end-to-end (Playwright): vendor membuat proyek dan memetakan keputusan, pelanggan masuk lewat tautan ajaib, memakai kalkulator, memilih Tunda lalu Kunci, vendor memperbarui tahap, pelanggan mengajukan perubahan, lalu persetujuan.
• Tes visual dan animasi: pastikan prefers-reduced-motion mematikan gerak berat dan tidak ada galat layout.
• Tes performa (Lighthouse CI) dan aksesibilitas (axe).
• Cakupan minimal 70 persen pada modul inti (perhitungan biaya, kunci, change order).
16. DATA CONTOH (SEED) UNTUK MVP
MVP hanya memuat lima proyek dan satu keputusan mahal per proyek.
• Vendor contoh: "Bengkel Kayu Nusantara" (furnitur), lengkap dengan profil perusahaan, layanan, dan 6 item portofolio. Tambahkan satu vendor percetakan dan satu dekorator sebagai pembanding tampilan profil.
• Lima proyek dan keputusan mahalnya:
    1. Meja makan jati kustom: warna finishing (titik kunci: sebelum tahap pengecatan)
    2. Lemari pakaian built-in: ukuran dan posisi pintu (titik kunci: sebelum potong bahan)
    3. Cetak buku tamu pernikahan 300 eksemplar: naskah dan ukuran halaman (titik kunci: sebelum cetak plat)
    4. Dekorasi panggung acara: tema warna kain (titik kunci: sebelum jahit)
    5. Kitchen set: material permukaan meja (titik kunci: sebelum pemesanan material)
• Untuk tiap proyek isi tahap, tarif, catatan pekerjaan dan bahan yang tertaut ke keputusan, serta dasar biaya fleksibilitas.
• Satu proyek berstatus mendekati kunci, satu ditunda, satu sudah punya change order disetujui, satu terkunci, dan satu selesai (lengkap dengan ulasan) agar semua keadaan terlihat di dasbor.
• Data pembanding: 10 proyek lama (impor) dengan angka pengerjaan ulang dan bahan terbuang.
• Isi situs company profile: teks beranda, 3 studi kasus, 4 anggota tim contoh, 3 paket harga, dan 3 artikel blog.
Susun kode agar industri baru cukup ditambah sebagai templat data.
17. URUTAN PENGERJAAN (MILESTONE)
1. Fondasi: monorepo, Docker Compose, tema merek (token warna, font, logo SVG), token gerak, autentikasi, vendor, RBAC, multi-tenant.
2. Proyek dan tahap: proyek, templat industri, tahap produksi, pembaruan tahap, pengingat kebaruan.
3. Keputusan dan perhitungan: Peta Keputusan, dasar biaya, Skor Fleksibilitas, Biaya Perubahan, kalkulator simulasi.
4. Jejak pekerjaan: catatan jam dan bahan, foto, ringkasan dampak.
5. Pilihan pelanggan: Kunci (tahan), Tunda, Ubah, kunci otomatis, notifikasi menjelang kunci.
6. Change order dan pembayaran: dokumen, persetujuan, tantangan biaya, faktur, PDF.
7. Animasi signature: Titik Amber, Pita Fleksibilitas, gembok hidup, garis waktu menggambar diri, count-up, transisi halaman, dan pengaturan kurangi animasi.
8. Profil perusahaan vendor: editor, pratinjau, halaman publik, galeri, ulasan, Lencana Kepastian, SEO.
9. Situs company profile Revio: semua halaman Bagian 9 dengan cerita gulir dan panel konten.
10. Analitik dan validasi: pengerjaan ulang, bahan terbuang, sengketa, kejelasan biaya, impor pembanding, laporan transparansi.
11. Pelengkap: percakapan, sengketa, langganan, log audit, PWA, notifikasi WhatsApp.
12. Penyelesaian: pengujian, optimasi performa dan aksesibilitas, dokumentasi.
18. KRITERIA SELESAI
• Satu proyek penuh bisa dijalankan dari pembuatan sampai penutupan tanpa galat, termasuk satu change order yang disetujui.
• Skor Fleksibilitas dan Biaya Perubahan berubah otomatis dan dapat ditelusuri ke catatan pekerjaan nyata.
• Animasi signature (Bagian 4) berjalan mulus 60 fps, mematuhi prefers-reduced-motion, dan Lighthouse publik tetap di atas 90.
• Profil vendor publik dan situs company profile tampil lengkap, responsif, dan SEO-friendly.
• Hak akses dan isolasi antar-vendor lolos pengujian.
• docker compose up menjalankan seluruh sistem, dengan seed yang bisa dimuat satu perintah.
• Tersedia README.md (cara menjalankan, struktur, variabel lingkungan), DECISIONS.md, dokumentasi OpenAPI, dan panduan singkat untuk vendor, staf, dan pelanggan.
19. HASIL AKHIR YANG DIMINTA
Serahkan: seluruh kode sumber (web, api, shared), logo SVG buatan sendiri, skema Prisma dan migrasi, file seed, Docker Compose, .env.example, tes, dokumentasi, dan ringkasan singkat di akhir tiap milestone yang menjelaskan apa yang sudah selesai, cara mencobanya, dan apa yang belum. Mulai dari Milestone 1 dan lanjutkan berurutan.