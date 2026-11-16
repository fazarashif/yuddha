# Yuddha — Requirement Produk

Versi 0.1 (draf untuk didiskusikan). Bagian bertanda **[PUTUSKAN]** masih menunggu keputusan pemilik.

## 1. Ringkasan

Yuddha adalah aplikasi belajar catur untuk web dan HP. Pengguna belajar lewat kampanye
cerita yang dipandu seorang dalang, berlatih dengan puzzle yang menyesuaikan kemampuan,
bertanding melawan penantang berkarakter, lalu mendapat ulasan atas kesalahannya sendiri.

Keputusan yang sudah diambil:

| Hal | Keputusan |
| --- | --- |
| Pengguna | Dibangun untuk pemilik dulu (Chess.com ±800), desain siap publik |
| Tema | Wayang/Nusantara berbalut fantasi |
| Coach | Naskah tertulis (bukan AI), sekreatif dan seseru mungkin |
| Bahasa | Indonesia dan Inggris, bisa dipilih |
| Akun | Login dan sinkron antar perangkat |
| Lawan manusia | Tidak ada, untuk sementara |
| Perangkat utama | HP (mobile-first), tetap nyaman di web |
| Impor partai | Ya, dari Chess.com dan Lichess |
| Aset visual | Dibuat lewat Claude Code memakai prompt di `ART-DIRECTION.md` |
| Biaya | Gratis, tanpa monetisasi |

## 2. Pelajaran dari aplikasi lain

| Referensi | Yang ditiru | Yang dihindari |
| --- | --- | --- |
| Duolingo Chess | Pelajaran pendek, jalur belajar yang jelas, tes penempatan, karakter coach | Terlalu dangkal untuk non-pemula; puzzle tanpa ulasan |
| Dr. Wolf | Coach berkomentar *selama* partai; kesalahan dicatat lalu diulang berkala | Penjelasan "kenapa" yang tidak konsisten |
| Chessable | Pengulangan berjarak (spaced repetition) | Hafalan tanpa pemahaman |
| Noctie / Maia | Bot yang bermain seperti manusia di level tertentu; kartu latihan dari partai sendiri | — |
| Chessiverse / bot Chess.com | Bot bernama, punya gaya main, seni karakter, dan celetukan | Bot yang kepribadiannya hanya tempelan |
| Story Time Chess, ChessKid Adventure | Tiap bidak adalah tokoh; belajar lewat cerita dan boss | Nuansa terlalu kekanak-kanakan |
| Ulasan partai Chess.com | Klasifikasi langkah, momen kunci | Angka tanpa tindak lanjut latihan |

Kesimpulan untuk Yuddha: aplikasi lain biasanya kuat di satu sisi saja. Nilai Yuddha ada
pada **satu lingkaran utuh**: cerita → latihan → tanding → ulasan → kesalahan kembali
sebagai latihan.

Untuk level 800–1200, saran para pelatih konsisten: bidak gantung adalah masalah utama,
diikuti kebiasaan cek blunder, taktik dasar (garpu, pin, tusuk), dan ulasan partai sendiri.
Sumbernya blog dan forum pelatih, bukan penelitian formal, tetapi isinya seragam.
Kurikulum awal Yuddha disusun mengikuti prioritas ini.

## 3. Dunia dan cerita

### 3.1 Latar

**Mandala Caturangga**, negeri 64 petak. Dua kerajaan, **Rembulan** (gading-emas) dan
**Bara** (arang-tembaga), mengulang perang kuno bernama *Yuddha* di atas **Kelir**, layar
pusaka tempat bayangan menjadi nyata. Pemain adalah **senapati muda** yang dipilih Kelir.

Ini dunia orisinal yang *terinspirasi* wayang, bukan penceritaan ulang Mahabharata.
Dengan begitu cerita bebas dibentuk mengikuti kebutuhan pelajaran.

### 3.2 Tokoh pemandu

| Tokoh | Peran dalam cerita | Fungsi di aplikasi |
| --- | --- | --- |
| **Ki Sabda** | Dalang tua pengembara, bijak dan jenaka (arketipe punakawan) | Narator dan coach: membuka bab, menjelaskan konsep, mengulas partai |
| **Nyala** | Roh api lampu *blencong* milik Ki Sabda | Sistem petunjuk: menyorot petak, memberi isyarat bertahap |
| **Para Penantang** | Tokoh-tokoh yang dijumpai di perjalanan | Bot lawan, lihat bagian 6 |

**[PUTUSKAN]** Nama dan tokoh di atas adalah usulan; boleh diganti.

### 3.3 Bidak

Istilah catur Indonesia sudah dekat dengan *chaturanga*, jadi pemetaan terasa alami.

| Bidak | Nama di Yuddha | Wujud |
| --- | --- | --- |
| Raja | Prabu | Raja bermahkota |
| Menteri | Mahapatih | Patih bersenjata keris |
| Benteng | Ratha | Menara gapura candi |
| Gajah | Gajah | Gajah perang berhias |
| Kuda | Turangga | Kuda perang |
| Pion | Bala | Prajurit kecil |

Aturan terpenting: **siluet tetap terbaca sebagai bidak catur standar**. Pemilik bermain di
Chess.com, jadi pengenalan pola harus berpindah ke sana. Tersedia juga set **Klasik**
sebagai pilihan.

### 3.4 Prinsip penulisan naskah

- Cerita melayani pelajaran. Tiap adegan memuat satu gagasan catur.
- Singkat: maksimal 2–3 kalimat per layar, selalu diikuti interaksi di papan.
- Ki Sabda menjelaskan *kenapa*, memakai perumpamaan (contoh: bidak gantung adalah
  "prajurit yang tertidur di luar benteng").
- Kalah tidak dihukum. Ki Sabda menanggapi kekalahan dengan humor dan satu pelajaran.
- Naskah ditulis dalam Indonesia dan Inggris sebagai dua naskah setara, bukan terjemahan kaku.

## 4. Lingkaran belajar

**Laku Harian** (5–10 menit, dirancang untuk HP):

1. **Pemanasan** (1 menit): latihan penglihatan papan.
2. **Lakon** (3 menit): satu adegan kampanye.
3. **Puzzle** (3 menit): campuran puzzle baru dan ulangan kesalahan lama.
4. **Tanding** (opsional): partai melawan penantang.

Motivasi:

- **Nyala Blencong** sebagai streak: api tetap hidup bila berlatih hari itu. Ada "minyak
  cadangan" agar satu hari terlewat tidak memutus streak.
- **Pangkat**: Cantrik → Prajurit → Lurah → Tumenggung → Senapati → Patih.
- Tanpa sistem nyawa dan tanpa batas energi.
- Hadiah berupa skin papan dan bidak, serta potongan cerita.

## 5. Fitur

### 5.1 Wajib (inti)

| # | Fitur | Keterangan |
| --- | --- | --- |
| F1 | Papan dan bidak | Sentuh dan seret, sorotan langkah sah, animasi, suara, beberapa tema |
| F2 | Tes penempatan | ±10 posisi untuk menentukan titik mulai dan rating awal |
| F3 | Kampanye "Lakon" | Peta dunia; tiap bab berisi cerita, pelajaran interaktif, latihan, dan boss |
| F4 | Puzzle adaptif | Rating pemain per tema, tingkat kesulitan menyesuaikan |
| F5 | Tanding lawan penantang | Bot berkarakter; mode berpemandu (petunjuk, batal langkah, peringatan blunder) dan mode murni |
| F6 | Ulasan partai | Klasifikasi langkah, momen kunci, tombol "coba lagi" di posisi salah |
| F7 | Kitab Luka | Kesalahan dari partai dan puzzle menjadi kartu yang diulang berkala |
| F8 | Latihan penglihatan papan | Cari bidak gantung, hitung penyerang dan pembela, koordinat |
| F9 | Impor partai | Tarik partai dari Chess.com dan Lichess berdasarkan nama pengguna |
| F10 | Cermin (profil kelemahan) | Ringkasan kesalahan per fase, per motif, per pembukaan |
| F11 | Kemajuan | Peta skill, rating per area, perkiraan rating keseluruhan, riwayat |
| F12 | Akun dan sinkron | Login, progres sama di HP dan web |
| F13 | Dua bahasa | Indonesia dan Inggris |
| F14 | PWA | Bisa di-install; pelajaran dan puzzle tersimpan untuk dipakai offline |

### 5.2 Lanjutan

| # | Fitur | Keterangan |
| --- | --- | --- |
| L1 | Pelatih pembukaan | Repertoar kecil sesuai level, dilatih dengan pengulangan berjarak |
| L2 | Latihan akhir permainan | Posisi teori dimainkan melawan mesin sampai menang atau remis |
| L3 | Tebak langkah | Partai legendaris dengan cerita; pemain menebak langkah sang maestro |
| L4 | Audio | Musik dan efek bernuansa gamelan |
| L5 | Suara narator | **[PUTUSKAN]** teks saja, atau ditambah suara di kemudian hari |

### 5.3 Catatan tentang coach bernaskah

Karena coach tidak memakai AI, komentar ulasan partai berasal dari **templat naskah** yang
dipilih berdasarkan motif yang dideteksi mesin (contoh: bidak gantung, garpu terlewat, mat
terlewat). Komentar akan tepat dan berkarakter untuk motif yang dikenali, tetapi tidak
bisa menjelaskan gagasan strategis yang halus. Pintu untuk menambah AI di kemudian hari
tetap terbuka tanpa mengubah struktur.

## 6. Para Penantang (bot)

| Penantang | Perkiraan rating | Gaya main | Yang diuji |
| --- | --- | --- | --- |
| Buta Cilik | 400 | Rakus, memakan apa saja | Menghukum bidak gantung |
| Cantrik Lugu | 600 | Polos, mudah dijebak | Pola mat dasar |
| Gandarwa Si Gegabah | 800 | Menyerang dini dengan Mahapatih | Bertahan dan mengembangkan bidak |
| Nyi Rara Jerat | 1000 | Suka garpu dan jebakan | Kewaspadaan taktik |
| Senapati Wesi | 1200 | Kokoh, menghukum kecerobohan | Disiplin cek blunder |
| Resi Wening | 1400 | Posisional, sabar | Rencana dan akhir permainan |
| Ratu Bayang | 1600 | Penyerang tajam | Kalkulasi dan pertahanan raja |
| Prabu Kala | 1800 | Lengkap | Boss saga pertama |
| Sang Hyang Kelir | 2000+ | Mendekati kekuatan penuh | Tantangan puncak |

Cara kerja:

- **Kekuatan dan kemanusiawian**: pilihan utama adalah Maia-2, model yang meniru langkah
  manusia pada rating 600–2600 dan bisa berjalan di peramban. Lisensinya harus diperiksa
  di repo resminya sebelum dipakai. Cadangan: Stockfish dengan model kesalahan buatan
  sendiri (memilih dari beberapa langkah kandidat dengan peluang salah sesuai rating).
- **Kepribadian**: buku pembukaan khas, kecenderungan gaya (agresif, rakus, sabar), dan
  celetukan bernaskah pada momen tertentu.
- Rating di tabel adalah target desain dan perlu dikalibrasi lewat uji main.

## 7. Kurikulum

| Babak | Rentang | Isi utama |
| --- | --- | --- |
| 0 — Wiwitan | Pemula total | Gerak bidak, skak, skakmat, rokade, en passant, promosi, nilai bidak |
| 1 — Mata Ksatria | 600–1000 | Bidak gantung, hitung penyerang-pembela, tukar untung, mat 1–2 langkah, pola mat dasar, prinsip pembukaan, mat Raja+Menteri dan Raja+Benteng, kebiasaan "Tiga Tanya" |
| 2 — Senjata | 1000–1400 | Garpu, pin, tusuk, serangan terbuka, skak ganda, menyingkirkan pembela, pengalihan; akhir permainan pion (oposisi, aturan kuadrat); rencana sederhana; repertoar pembukaan |
| 3 — Siasat | 1400–1800 | Struktur pion, bidak aktif, pos terdepan, lajur terbuka, serangan raja, kalkulasi langkah kandidat, akhir permainan benteng (Lucena, Philidor) |
| 4 — Mahayuddha | 1800+ | Profilaksis, pengorbanan posisional, akhir permainan lanjut, persiapan pembukaan mendalam |

**Tiga Tanya** adalah kebiasaan cek blunder sebelum melangkah: *Skak? Makan? Ancaman?*
Kebiasaan ini dilatih sebagai mekanik permainan, bukan sekadar nasihat.

Pemilik berada di awal Babak 1. **[PUTUSKAN]** target rating yang ingin dicapai (usulan:
1200 Chess.com sebagai tonggak pertama).

## 8. Penilaian skill

- **Rating puzzle** per tema dengan Glicko-2: tiap puzzle dianggap pertandingan melawan
  rating puzzle tersebut.
- **Rating tanding** dari hasil melawan penantang.
- **Peta skill** dengan empat area: taktik, pembukaan, strategi, akhir permainan.
- **Ulasan partai**: mesin menilai tiap langkah; kehilangan evaluasi diterjemahkan menjadi
  kelas langkah (terbaik, baik, kurang tepat, salah, blunder).
- **Cermin**: dari partai impor dan partai di aplikasi, menampilkan jumlah blunder per
  partai, fase tempat kesalahan terjadi, motif yang paling sering terlewat, dan hasil per
  pembukaan. Jumlah blunder per partai menjadi ukuran kemajuan utama.

## 9. Konten dan data

| Kebutuhan | Sumber | Catatan |
| --- | --- | --- |
| Puzzle | Basis data puzzle Lichess | ±6 juta puzzle dengan rating dan tema. Disebut CC0/domain publik; konfirmasi di halaman unduhannya. Yuddha memakai subset terkurasi (±50–100 ribu), dipilih menurut rating, tema, dan popularitas |
| Partai pemilik | API publik Chess.com dan API Lichess | Hanya membaca partai publik berdasarkan nama pengguna |
| Mesin analisis | Stockfish (WASM, versi lite satu-thread ±1,7 MB) | Berjalan di perangkat pengguna |
| Naskah cerita dan pelajaran | Ditulis khusus untuk Yuddha | Disimpan sebagai data terstruktur dua bahasa |

## 10. Teknologi

| Lapisan | Pilihan | Alasan |
| --- | --- | --- |
| Aplikasi | Vite + React + TypeScript, sebagai PWA | Aplikasi berat di sisi klien dan harus bisa offline |
| Aturan catur | chess.js | Lisensi longgar, matang |
| Papan | Komponen SVG buatan sendiri | Desain unik membutuhkan kendali penuh |
| Mesin | Stockfish WASM di Web Worker; Maia-2 (ONNX) bila lisensi sesuai | Tidak perlu server, tanpa biaya per pemakaian |
| Akun dan data | Supabase (Auth + Postgres dengan RLS) | Sinkron antar perangkat, gratis untuk skala pribadi |
| Hosting | Vercel | Gratis untuk skala pribadi |
| Bahasa | Pustaka i18n dengan berkas ID dan EN | Bahasa bisa ditambah |
| Uji | Vitest (logika) dan Playwright (alur di HP dan desktop) | — |

**Lisensi**: Stockfish berlisensi GPL-3.0. Karena Yuddha gratis dan tanpa monetisasi,
usulan paling sederhana adalah melisensikan repo ini dengan **GPL-3.0** juga.
**[PUTUSKAN]** setuju GPL-3.0, dan apakah repo publik atau privat.

## 11. Tahapan

Pemilik menginginkan versi terbaik secara langsung. Seluruh fitur wajib masuk ke rilis
pertama; tahapan di bawah adalah **urutan pengerjaan**, dan tiap tahap sudah bisa dicoba.
Bagian yang paling lama adalah naskah cerita, karena kualitasnya menentukan rasa aplikasi.

| Tahap | Isi | Hasil yang bisa dicoba |
| --- | --- | --- |
| 0 — Fondasi | Kerangka aplikasi, sistem desain, papan dan bidak, PWA, dua bahasa, akun | Papan Yuddha bisa dimainkan di HP |
| 1 — Tanding dan Nilai | Penantang, mode berpemandu, ulasan partai, puzzle adaptif, Kitab Luka, latihan penglihatan papan | Bisa bertanding, diulas, dan berlatih dari kesalahan sendiri |
| 2 — Lakon | Mesin kampanye, tes penempatan, Babak 1 lengkap, Laku Harian, streak, pangkat | Pengalaman belajar utuh untuk level pemilik |
| 3 — Cermin | Impor partai, profil kelemahan, Babak 0 dan Babak 2, pelatih pembukaan | Aplikasi mengenali kelemahan nyata pemilik |
| 4 — Kedalaman | Babak 3–4, akhir permainan, tebak langkah, audio, skin tambahan | Cakupan sampai level lanjut |

**[PUTUSKAN]** urutan ini memulai dari Babak 1 (level pemilik), dengan Babak 0 untuk
pemula total menyusul di tahap 3. Setuju?

## 12. Di luar cakupan

- Bermain melawan manusia secara online.
- Coach berbasis AI.
- Monetisasi, iklan, pembelian dalam aplikasi.
- Aplikasi native di toko aplikasi (PWA sudah bisa di-install dari peramban).

## 13. Sumber

- [Duolingo — chess course](https://blog.duolingo.com/chess-course)
- [Duolingo — chess game review](https://blog.duolingo.com/chess-game-review/)
- [Ulasan independen Duolingo Chess](https://davidwilliamrosales.com/2025/08/18/duolingo-chess-review/)
- [Learn Chess with Dr. Wolf (App Store)](https://apps.apple.com/app/id1353041020)
- [Chessiverse — best chess training app](https://chessiverse.com/compare/best-chess-training-app) (situs pesaing; dipakai untuk deskripsi fitur saja)
- [Chessiverse — bot personalities](https://chessiverse.com/compare/best-chess-bot-personalities)
- [Story Time Chess — pendekatan pelajaran](https://storytimechess.com/blog/why-our-chess-lessons-are-like-nothing-youve-ever-seen-before)
- [Basis data Lichess](https://database.lichess.org/)
- [Maia Chess](https://maiachess.com/) dan [maia-platform-frontend](https://github.com/CSSLab/maia-platform-frontend)
- [Makalah Maia-2](https://arxiv.org/pdf/2409.20553v2)
- [Stockfish.js](https://github.com/nmrugg/stockfish.js)
- [Chess.com — 7 kesalahan pemain 800–1200](https://www.chess.com/blog/IM-HAKUJI/7-mistakes-800-1200-rated-players-make-every-game-and-how-to-fix-them)
- [Noël Studer — the simple path to 1500](https://lichess.org/@/NoelStuder/blog/the-simple-path-to-1500-lessons-from-my-dads-chess-journey/XRTykDxJ)
