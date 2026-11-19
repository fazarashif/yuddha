# Yuddha

Aplikasi belajar catur (web + HP, PWA) dengan dunia wayang/Nusantara berbalut fantasi.
Belajar lewat cerita, berlatih dari kesalahan sendiri, dan diuji oleh penantang berkarakter.

Lisensi: [GPL-3.0](LICENSE).

## Yang sudah ada

- Papan dan bidak rancangan sendiri (set Yuddha dan Klasik), empat tema papan, tema malam dan siang.
- Tanding melawan sembilan penantang berkarakter, dengan mode berpemandu (petunjuk, batal
  langkah, peringatan sebelum blunder) dan mode murni yang mengubah rating.
- Ulasan partai: kelas tiap langkah, grafik evaluasi, komentar Ki Sabda, dan "coba lagi".
- Kitab Luka: kesalahan dari partai sendiri diulang secara berkala.
- Lakon: dua puluh satu pelajaran interaktif. Babak 0 (empat pelajaran, aturan dasar sampai
  rokade, en passant, dan remis), Babak 1 (delapan pelajaran), Babak 2 (lima pelajaran:
  garpu, pin dan tusuk, serangan terbuka, menyingkirkan penjaga, akhir permainan Pion), dan
  Babak 3 (empat pelajaran: struktur Pion, bidak aktif, serangan Raja, akhir permainan
  Benteng) lengkap. Empat pelajaran akhir permainan ditutup dengan latihan melawan mesin.
- Puzzle adaptif: 12.304 puzzle dari basis data Lichess (CC0), rating 400 sampai 2200,
  dengan rating puzzle yang mengikuti kemampuan dan statistik per pola.
- Pemanasan: latihan 60 detik mencari bidak gantung.
- Laku Harian, streak, pangkat, dan Cermin (statistik dari partai sendiri).
- Bahasa Indonesia dan Inggris. Efek suara dan musik latar dibuat langsung di perangkat.
- Impor partai dari Chess.com lewat nama pengguna; partai impor bisa diulas seperti partai
  lain dan kesalahannya masuk Kitab Luka.
- Akun (masuk dengan Google) dan sinkron antar perangkat lewat Supabase. Data tiap pengguna
  ada di skema `yuddha` pada proyek `konco-mlayu`; lihat `supabase/migrations`.
- Bisa di-install sebagai PWA.

## Yang belum ada

- Impor partai dari Lichess.
- Pelajaran Babak 4.
- Pelatih pembukaan dan latihan akhir permainan yang lebih luas.
- Kalibrasi kekuatan penantang terhadap rating sungguhan.

## Menjalankan

```bash
npm install
```

```bash
npm run dev
```

```bash
npm test
```

```bash
npm run build
```

`npm install` menyalin mesin catur Stockfish (versi lite satu-thread) ke `public/engine`.

Data puzzle di `public/puzzles` dibuat oleh `scripts/build-puzzles.py` dari basis data
puzzle Lichess; petunjuknya ada di bagian atas skrip itu.

## Struktur

| Folder | Isi |
| --- | --- |
| `src/chess` | Mesin, bot, ulasan partai, penglihatan papan |
| `src/content` | Tokoh, penantang, pelajaran (dua bahasa) |
| `src/components` | Papan, potret tokoh, komponen antarmuka |
| `src/features` | Satu folder per layar |
| `src/pieces` | Gambar bidak (SVG) |
| `src/audio` | Efek suara dan musik sintetis |
| `src/i18n` | Teks antarmuka Indonesia dan Inggris |
| `src/state` | Penyimpanan progres |
| `docs` | Requirement, arahan visual, panduan Claude Design |

Halaman `/lab` menampilkan lembar uji bidak dan papan.
