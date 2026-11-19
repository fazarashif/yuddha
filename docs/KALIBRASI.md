# Kalibrasi kekuatan penantang

Angka di samping nama penantang adalah perkiraan rating **rapid Chess.com**. Dokumen ini
menjelaskan dari mana angka itu berasal dan seberapa bisa dipercaya.

## Ringkasan

| Penantang | Rating (label) | Blunder per langkah | Akurasi | Langkah diukur |
| --- | --- | --- | --- | --- |
| Buta Cilik | 500 | 9,2% | 77,9 | 488 |
| Cantrik Lugu | 650 | 7,6% * | 81,0 | 3.867 |
| Gandarwa Si Gegabah | 850 | 6,1% * | 83,5 | 4.306 |
| Nyi Rara Jerat | 1000 | 5,0% | 85,5 | 498 |
| Senapati Wesi | 1100 | 4,8% | 86,0 | 966 |
| Resi Wening | 1450 | 3,8% | 86,3 | 504 |
| Ratu Bayang | 1600 | 3,3% | 88,6 | 874 |
| Prabu Kala | 1950 | 2,5% | 88,8 | 809 |
| Sang Hyang Kelir | 2000 | 2,3% | 92,2 | 782 |

\* Nilai prediksi dari regresi atas empat putaran pengukuran (lihat *Cara mengukur*).

Ketelitian yang realistis: sekitar **±150 poin**. Lihat *Keterbatasan*.

## Patokan: partai manusia

Sumber: 150 MB pertama berkas partai Lichess September 2025
(`lichess_db_standard_rated_2025-09.pgn.zst` dari database.lichess.org). Dari 40.550 partai
yang punya evaluasi mesin, dipakai 12.152 partai rapid dan klasik. Hasilnya ada di
`scripts/human-stats-2025-09.json`, dibuat oleh `scripts/human_stats.py`.

Ukuran yang dipakai sama persis dengan Ulasan di aplikasi:

- **Blunder**: langkah yang menurunkan peluang menang 22 poin persen atau lebih (model Lichess).
- **Akurasi**: rata-rata akurasi per langkah (rumus Lichess).
- Hanya langkah dari posisi yang **belum jelas** (evaluasi di bawah ±4 Pion) yang dihitung,
  supaya partai yang diteruskan sampai skakmat tidak tampak lebih rapi daripada partai yang
  berakhir dengan menyerah.

| Rating Lichess | 600 | 800 | 1000 | 1200 | 1400 | 1600 | 1800 | 2000 | 2200 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Blunder per langkah | 12,9% | 9,4% | 7,3% | 5,8% | 4,7% | 3,9% | 3,3% | 2,7% | 2,2% |
| Akurasi | 76 | 80 | 82 | 84 | 85 | 87 | 88 | 89 | 90 |

## Dari Lichess ke Chess.com

Rating Lichess dan Chess.com memakai skala berbeda. Tidak ada konversi resmi; tulisan
berbasis data di blog Lichess menyebut Chess.com umumnya lebih rendah, dengan selisih
300 sampai 400 poin di level bawah yang menyempit di level atas. Yuddha memakai konversi
hati-hati: Chess.com ≈ Lichess − 350 sampai Lichess 1350, lalu selisihnya menyempit ke 150
di Lichess 2150. Bagian inilah yang paling tidak pasti.

## Cara mengukur penantang

`scripts/calibrate.ts` (`npm run calibrate -- stats <penantang> <jumlah partai>`) memainkan
penantang melawan dirinya sendiri, lalu menilai setiap langkah dengan Stockfish kedalaman 12
memakai ukuran yang sama dengan partai manusia di atas. Frekuensi blunder yang terukur
dicocokkan ke tabel manusia, lalu dikonversi ke skala Chess.com.

Model kesalahan penantang (`src/chess/bot.ts`):

- `blunder`: peluang per langkah untuk blunder sungguhan, dipilih dari daftar langkah yang
  luas, dengan kerugian dalam rentang `blunderLoss` (dalam poin peluang menang, misalnya 24
  sampai 60, jadi memang terhitung blunder di Ulasan).
- `temp`: seberapa sering penantang memilih langkah yang sedikit kurang baik (ketidaktepatan
  kecil). Ini yang terutama mengatur akurasi.
- `depth` dan `multipv`: seberapa dalam dan seberapa banyak langkah yang ditimbang.
- `greed`, `aggression`, `queenRush`: watak (rakus, suka skak, Menteri keluar dini).

Penyetelan berjalan delapan putaran. Untuk Cantrik Lugu dan Gandarwa, hasil antarputaran
cukup berisik, jadi setelan akhirnya diambil dari regresi berbobot atas empat pengukuran
masing-masing.

## Keterbatasan

- **Acak.** Dengan 500 sampai 1.000 langkah, frekuensi blunder bisa meleset sekitar ±0,5
  sampai 0,9 poin persen, kira-kira ±100 poin rating.
- **Konversi Lichess ke Chess.com** adalah perkiraan, bukan pengukuran.
- **Blunder bukan segalanya.** Manusia dan mesin membuat kesalahan dengan cara berbeda.
  Penantang tidak pernah kehabisan waktu, tidak lelah, dan polanya bisa terasa lain.
- **Patokan Stockfish ditinggalkan.** Percobaan pertama memakai Stockfish yang dibatasi
  `UCI_Elo`. Penantang yang dirancang 1000 menang 10-0 melawan Stockfish "1320", bahkan dengan
  satu detik per langkah. Skala `UCI_Elo` mengikuti daftar rating mesin, bukan rating manusia,
  sehingga tidak cocok untuk level bawah.

## Mengulang kalibrasi

```bash
curl -r 0-150000000 -o head.pgn.zst https://database.lichess.org/standard/lichess_db_standard_rated_2025-09.pgn.zst
```

```bash
python3 -I scripts/human_stats.py head.pgn.zst
```

```bash
npm run calibrate -- stats gandarwa 24
```

Variabel `BRAINS` (JSON, misalnya `{"gandarwa":{"blunder":0.05}}`) mencoba setelan lain
tanpa mengubah kode aplikasi.
