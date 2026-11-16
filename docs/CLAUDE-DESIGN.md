# Yuddha — Panduan Claude Design

Panduan ini berisi langkah, lampiran, dan prompt untuk merancang Yuddha di Claude Design,
serta apa yang perlu dibawa kembali ke sesi pengembangan.

Catatan:

- Claude Design sekarang berada di dalam Claude (claude.ai, bagian **Design**). Situs
  terpisah claude.ai/design ditutup paling lambat 14 Desember 2026, jadi kerjakan dari
  dalam Claude.
- Nama tombol dan menu bisa berbeda dari yang tertulis di sini karena produknya masih
  sering berubah. Ikuti maksud langkahnya.

## Urutan kerja

| Langkah | Hasil | Keputusan Anda |
| --- | --- | --- |
| 0 | Lampiran siap | — |
| 1 | Tiga arah visual | Pilih satu arah |
| 2 | Bidak dan papan | Setujui set bidak dan tema papan bawaan |
| 3 | Sistem desain | Setujui warna, huruf, komponen |
| 4 | Layar HP | Setujui tiap layar |
| 5 | Layar lebar dan prototipe alur | Setujui |
| 6 | Tokoh | Setujui gaya tokoh |
| 7 | Serah terima | Kirim tautan dan catatan |

Kerjakan berurutan. Jangan lanjut sebelum langkah sebelumnya memuaskan, karena tiap
langkah menjadi dasar langkah berikutnya.

## Langkah 0 — Siapkan lampiran

Wajib, unduh dari repo ini (buka berkas di GitHub, lalu "Download raw file"):

1. `docs/PRD.md`
2. `docs/ART-DIRECTION.md`

Opsional tetapi sangat membantu: 5–8 gambar rujukan. Yang dicari:

- wayang kulit (tampak samping, terlihat ukiran berlubangnya),
- gunungan (kayon),
- batik kawung dan parang,
- gapura candi bentar,
- lampu blencong,
- satu set bidak catur Staunton sebagai rujukan siluet.

Pakai foto sendiri atau gambar berlisensi bebas (misalnya dari Wikimedia Commons).

Lampirkan kedua berkas dan gambar rujukan pada **pesan pertama** (Langkah 1). Pada
langkah berikutnya, lanjutkan di percakapan yang sama supaya konteksnya terbawa. Bila
memulai percakapan baru, lampirkan lagi kedua berkas.

## Langkah 1 — Arah visual

```text
Saya melampirkan PRD.md dan ART-DIRECTION.md untuk Yuddha, aplikasi belajar catur
bertema wayang/Nusantara berbalut fantasi. Baca keduanya dulu, terutama ART-DIRECTION
Bagian A. Gambar terlampir adalah rujukan rasa, bukan untuk disalin.

Buat tiga arah visual yang benar-benar berbeda, berdampingan di satu kanvas, masing-masing
untuk layar HP 390 x 844:

A. "Kelir Malam": mengikuti palet A2 apa adanya. Gelap, nila, emas, pendar halus.
B. "Lontar": tafsir hangat dan terang. Gading, soga, emas; terasa seperti naskah kuno.
C. "Sukma": tafsir paling fantasi. Kontras tinggi, pendar magis lebih berani.

Tiap arah memuat empat hal:
1. Layar Tanding: papan catur pada posisi tengah permainan dengan bidak rancanganmu
   sendiri, bidak tertangkap, dan satu celetukan penantang.
2. Layar Laku (beranda): Laku Harian empat langkah dan Nyala Blencong sebagai streak.
3. Gelembung dialog Ki Sabda dengan satu kalimat pelajaran.
4. Strip kecil berisi palet warna dan contoh huruf judul dan isi.

Aturan wajib:
- Siluet bidak mengikuti Staunton dan terbaca pada 32 px (ART-DIRECTION A4).
- Bidak dan papan digambar sebagai SVG, tanpa gambar raster.
- Semua teks antarmuka berbahasa Indonesia.
- Anggun dan sedikit misterius; tidak kekanak-kanakan, tidak menyeramkan.

Berhenti setelah tiga arah ini. Saya akan memilih satu sebelum lanjut.
```

Setelah hasil keluar, pilih satu arah. Boleh mencampur, misalnya "arah A, tetapi papan
dari arah B". Tulis pilihan itu sebagai pesan berikutnya.

## Langkah 2 — Bidak dan papan

```text
Saya memilih arah [A/B/C]. [Tambahkan catatan campuran bila ada.]

Sekarang dalami bidak dan papan pada arah itu, di kanvas baru.

Bidak:
- Rancang set "Yuddha": Prabu, Mahapatih, Ratha, Gajah, Turangga, Bala, untuk Kerajaan
  Rembulan (terang) dan Kerajaan Bara (gelap). Ikuti tabel ART-DIRECTION A4.
- Tiap bidak adalah SVG tersendiri dengan viewBox 0 0 100 100.
- Tampilkan lembar uji: keduabelas bidak pada petak terang dan gelap dalam ukuran 32, 48,
  64, dan 128 px, ditambah satu baris siluet hitam polos.
- Tampilkan juga set "Klasik": bidak Staunton polos dengan palet yang sama.

Papan:
- Empat tema sesuai ART-DIRECTION A5: Kelir, Batik Kawung, Candi, Jati Ukir.
- Tiap tema ditampilkan dengan posisi awal pada lebar 360 px.
- Tunjukkan empat penanda pada satu papan contoh: langkah terakhir, langkah sah, skak,
  dan petunjuk Nyala.

Periksa sendiri sebelum menyerahkan: apakah tiap bidak dikenali pada 32 px? Apakah Gajah
dan Bala, juga Prabu dan Mahapatih, mudah dibedakan? Apakah bidak kedua warna menonjol
di kedua jenis petak pada keempat tema? Perbaiki dulu bila belum.
```

Uji sendiri: kecilkan tampilan sampai bidak sekecil di HP, lalu lihat sekilas. Bila ada
bidak yang membuat Anda ragu, minta perbaikan untuk bidak itu saja.

## Langkah 3 — Sistem desain

Bila tersedia pilihan membuat **design system**, gunakan itu, supaya semua rancangan
berikutnya otomatis mengikuti aturan yang sama.

```text
Bidak dan papan sudah saya setujui. Sekarang kunci semuanya menjadi sistem desain bernama
"Yuddha", berdasarkan arah terpilih dan ART-DIRECTION Bagian A.

Isi sistem desain:
- Warna: token bernama (latar, permukaan, teks, aksen, magis, bahaya, dua kerajaan),
  untuk tema gelap (bawaan) dan tema terang.
- Huruf: judul dan isi, skala ukuran untuk HP.
- Jarak, sudut, bayangan, dan pendar.
- Gerak: durasi dan kurva untuk langkah bidak, memakan, dan perpindahan layar.
- Ikon: gaya dan set dasar (petunjuk, batal langkah, ulasan, pengaturan, streak, pangkat).
- Komponen, masing-masing dengan semua keadaannya:
  tombol (utama, sekunder, teks), kartu, navigasi bawah empat tab (Laku, Lakon, Tanding,
  Cermin), gelembung dialog Ki Sabda, kartu penantang, lencana pangkat, penunjuk streak
  Nyala Blencong, bilah kemajuan, umpan balik puzzle (benar, salah), kelas langkah
  (terbaik, baik, kurang tepat, salah, blunder), bingkai papan dengan koordinat,
  lembar bawah (bottom sheet), dan pesan singkat (toast).
- Bidak dan tema papan yang sudah disetujui dimasukkan sebagai bagian dari sistem.

Target sentuh minimal 44 px. Kontras teks memenuhi WCAG AA.
```

## Langkah 4 — Layar HP

Dua prompt, supaya tiap layar mendapat perhatian cukup.

```text
Dengan sistem desain Yuddha, rancang layar HP 390 x 844 untuk alur belajar, sesuai
ART-DIRECTION A8 nomor 1 sampai 6:

1. Sambutan dan pilih level
2. Laku (beranda)
3. Lakon (peta kampanye)
4. Adegan pelajaran
5. Puzzle, dengan keadaan: belum dijawab, benar, salah
6. Latihan penglihatan papan

Untuk naskah contoh, pakai bab pertama Babak 1 "Mata Ksatria" tentang bidak gantung,
dengan Ki Sabda yang bijak dan jenaka (PRD bagian 3.4). Maksimal 2-3 kalimat per layar.
Papan selalu mendapat ruang terbesar; kendali utama berada dalam jangkauan jempol.
Teks antarmuka berbahasa Indonesia.
```

```text
Lanjutkan dengan layar HP 390 x 844 untuk alur tanding dan penilaian, sesuai
ART-DIRECTION A8 nomor 7 sampai 13:

7. Pilih penantang
8. Tanding, dengan keadaan: giliran pemain, peringatan blunder, petunjuk Nyala aktif
9. Hasil partai: menang dan kalah
10. Ulasan partai
11. Kitab Luka
12. Cermin
13. Profil dan pengaturan

Tambahkan keadaan kosong, memuat, dan offline untuk layar Laku dan Cermin.
Pakai data contoh yang masuk akal untuk pemain berating 800.
```

## Langkah 5 — Layar lebar dan prototipe alur

```text
Sesuaikan empat layar untuk layar lebar 1280 x 800: Laku, Adegan pelajaran, Tanding, dan
Ulasan partai. Papan tetap menjadi pusat; ruang samping dipakai untuk dialog, daftar
langkah, dan grafik. Navigasi bawah berubah menjadi navigasi samping.

Lalu buat prototipe yang bisa diklik untuk alur inti di HP:
Laku -> Adegan pelajaran -> Puzzle (jawab benar) -> Tanding -> Hasil partai -> Ulasan.
```

## Langkah 6 — Tokoh

```text
Rancang potret tokoh sesuai ART-DIRECTION A6 dan PRD bagian 3 dan 6, memakai sistem
desain Yuddha.

Mulai dari Ki Sabda saja: tiga ekspresi (netral, senang, terkejut), ditampilkan pada
64 px dan 200 px. Berhenti dan tunggu persetujuan saya atas gayanya.
```

Setelah gaya Ki Sabda disetujui:

```text
Gaya Ki Sabda disetujui. Dengan gaya yang sama, rancang Nyala dan sembilan penantang di
PRD bagian 6, masing-masing tiga ekspresi. Tiap tokoh harus dikenali dari siluetnya saja,
dan wujudnya mencerminkan gaya mainnya. Akhiri dengan satu lembar berisi semua tokoh.
```

## Cara meminta perbaikan

- Tunjuk hal yang spesifik: "Gajah terlalu mirip Bala pada 32 px, pertegas celah
  miringnya", bukan "bidaknya kurang bagus".
- Satu jenis perubahan per pesan.
- Bila tersedia, beri komentar langsung pada elemen di kanvas.
- Sebut yang sudah bagus supaya tidak ikut berubah: "pertahankan papan, ubah hanya
  navigasi bawah".

## Langkah 7 — Serah terima ke pengembangan

Kirim ke sesi pengembangan (percakapan dengan Claude Code untuk repo ini):

1. **Tautan tiap hasil** (`claude.ai/artifact/...`): sistem desain, bidak dan papan, layar
   HP, layar lebar dan prototipe, tokoh. Tautan artifact milik Anda bisa dibaca langsung
   dari sesi pengembangan.
2. **Catatan keputusan**, cukup beberapa baris:
   - arah visual yang dipilih,
   - tema papan bawaan,
   - layar yang sudah final dan yang belum memuaskan,
   - hal yang sengaja berbeda dari PRD atau ART-DIRECTION.

Cadangan bila tautan tidak terbaca dari sesi pengembangan:

- pakai pilihan serah terima ke Claude Code di menu ekspor (bila ada), lalu tempel
  perintah atau tautan yang dihasilkannya; atau
- ekspor sebagai ZIP/HTML dan unggah isinya ke folder `design/` di repo ini.

Yang paling penting ikut terbawa: **12 berkas SVG bidak**, token warna dan huruf, dan
tangkapan tiap layar.
