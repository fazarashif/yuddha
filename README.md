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
- Lakon: dua puluh tiga pelajaran interaktif di lima babak (Babak 0 sampai 4), semuanya
  terbuka dan bisa diambil dalam urutan apa pun; yang berikutnya menurut urutan ditandai
  "disarankan". Empat pelajaran endgame ditutup dengan latihan melawan mesin.
- Pustaka Pembukaan: Italian Game, Ruy Lopez, dan London System untuk Putih; 1...e5,
  Caro-Kann, dan Sicilian Dragon (dengan Alapin, Smith-Morra, Grand Prix) untuk Hitam melawan
  1.e4; Queen's Gambit Declined melawan 1.d4; plus pengantar memilih repertoar.
  Tiap pembukaan berisi ide, kelebihan dan kekurangan, alur langkah utama dengan alasan tiap
  langkah, jebakan, tips, dan latihan hafalan dengan variasi acak.
- Pembukaan di partai sendiri: pilih repertoar di Pustaka; Ulasan menyebut nama pembukaan dan
  langkah pertama tempat kau atau lawan keluar dari buku (langkah yang juga dinilai kurang tepat
  oleh mesin masuk Kitab Luka), dan Cermin menampilkan hasil per pembukaan.
- Kiat Kilat: tujuh tips dan trik singkat yang berdiri sendiri (cek tiga detik, mat dua
  langkah, jebakan Legal, smothered mate, perpetual check, kapan bertukar, Raja di endgame).
- Istilah catur yang lazim dipakai dalam bahasa Inggris (fork, skewer, passed pawn, endgame,
  dan seterusnya) dibiarkan dalam bahasa Inggris di teks Indonesia.
- Puzzle adaptif: 12.304 puzzle dari basis data Lichess (CC0), rating 400 sampai 2200,
  dengan rating puzzle yang mengikuti kemampuan dan statistik per pola.
- Saran Ki Sabda: dari jenis kesalahan di partai sendiri, pola puzzle yang paling sering gagal,
  dan pembukaan dengan skor rendah, aplikasi menyarankan pelajaran dan puzzle yang tepat. Puzzle
  bisa dilatih per pola, dan puzzle harian di Laku diarahkan ke pola terlemah.
- Pemanasan: latihan 60 detik mencari bidak gantung.
- Laku Harian, streak, pangkat, dan Cermin (statistik dari partai sendiri).
- Bahasa Indonesia dan Inggris. Efek suara dan musik latar dibuat langsung di perangkat.
- Impor partai dari Chess.com lewat nama pengguna; partai impor langsung diulas otomatis di
  latar belakang, dan kesalahannya masuk Kitab Luka. Partai yang belum diulas bisa diulas
  sekaligus dari Cermin.
- Akun (masuk dengan Google) dan sinkron antar perangkat lewat Supabase. Data tiap pengguna
  ada di skema `yuddha` pada proyek `konco-mlayu`; lihat `supabase/migrations`.
- Bisa di-install sebagai PWA.

## Yang belum ada

- Impor partai dari Lichess.
- Pembukaan lain (misalnya King's Indian, French) dan latihan endgame yang lebih luas.
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
