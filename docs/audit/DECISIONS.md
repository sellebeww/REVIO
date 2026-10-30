# Keputusan audit

- Repo Git lokal dibuat (tanpa remote) untuk baseline; tidak ada push/tag/merge.
- Bila log kerja/bahan kosong, change order dinonaktifkan, bukan diisi angka default. Alternatif ditolak: tetap mengisi estimasi (melanggar DECISIONS.md #2 proyek).
- Durasi dampak jadwal = ceil(jam terdampak / 8), turunan dari data nyata; ganti bila ada sumber durasi resmi.
- Tidak menghapus dependensi tak terpakai karena build belum dapat diuji.
