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
- Lakon: lima pelajaran interaktif (dua di Babak 0, tiga di Babak 1).
- Puzzle adaptif: 12.304 puzzle dari basis data Lichess (CC0), rating 400 sampai 2200,
  dengan rating puzzle yang mengikuti kemampuan dan statistik per pola.
- Pemanasan: latihan 60 detik mencari bidak gantung.
- Laku Harian, streak, pangkat, dan Cermin (statistik dari partai sendiri).
- Bahasa Indonesia dan Inggris. Efek suara dan musik latar dibuat langsung di perangkat.
- Bisa di-install sebagai PWA.

## Yang belum ada

- Akun dan sinkron antar perangkat (progres masih tersimpan di perangkat).
- Impor partai dari Chess.com dan Lichess.
- Pelajaran lain di Babak 1 sampai 4, pelatih pembukaan, latihan akhir permainan.
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
