# Rollback

Kondisi awal = commit `f327f2f` (branch awal). Perubahan audit ada di branch `chore/audit-20261030`.

- Lihat semua perubahan: `git diff f327f2f`
- Batalkan satu commit audit: `git revert <sha>`
- Kembali ke awal: pindah ke branch awal (`git switch -`); branch audit dibiarkan sebagai arsip.
