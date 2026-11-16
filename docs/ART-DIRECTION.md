# Yuddha — Arahan Visual dan Prompt Aset

Dokumen ini punya dua bagian:

- **Bagian A — Arahan**: aturan visual yang berlaku untuk semua rancangan dan aset. Bagian
  ini dilampirkan ke Claude Design; langkah dan prompt-nya ada di `CLAUDE-DESIGN.md`.
- **Bagian B — Prompt Claude Code**: cadangan untuk membuat aset produksi (SVG) di repo
  ini, dipakai setelah arah visual dikunci dan hanya bila aset dari Claude Design belum
  cukup.

Bidak, papan, ikon, dan tokoh berupa **SVG**: ringan, tajam di semua ukuran, dan bisa
diwarnai ulang lewat CSS.

## Bagian A — Arahan

### A1. Rasa

Wayang kulit bertemu fantasi: siluet tegas dan ukiran berlubang khas wayang, ditambah
cahaya magis seolah bayangan di Kelir hidup. Anggun dan sedikit misterius, tidak
kekanak-kanakan, tidak menyeramkan.

Tiga kata kunci: **siluet**, **ukiran**, **cahaya**.

### A2. Warna

| Peran | Nama | Hex |
| --- | --- | --- |
| Latar utama | Malam Nila | `#121826` |
| Permukaan | Nila Muda | `#1C2437` |
| Teks utama | Gading | `#F2E6CF` |
| Aksen utama | Emas Prada | `#C9A24B` |
| Aksen magis (petunjuk, sorotan) | Sukma | `#4FD1C5` |
| Bahaya (blunder, ancaman) | Bara | `#D2553A` |
| Kerajaan Rembulan (bidak terang) | Gading / Emas | `#F2E6CF` / `#C9A24B` |
| Kerajaan Bara (bidak gelap) | Arang / Tembaga | `#1E1A1D` / `#B5552F` |
| Cokelat batik | Soga | `#7A3B1E` |

Aplikasi berlatar gelap secara bawaan. Tema terang ("Kelir siang") memakai Gading sebagai
latar dan Malam Nila sebagai teks.

### A3. Huruf

- Judul: serif berkarakter, misalnya **Marcellus**.
- Isi: **Plus Jakarta Sans** (buatan perancang huruf Indonesia), mudah dibaca di HP.

### A4. Bidak

Aturan wajib:

1. **Siluet mengikuti bidak Staunton.** Dalam ukuran 32 px dan tanpa warna, tiap bidak
   harus langsung dikenali sebagai bidak caturnya. Hiasan wayang berada *di dalam* siluet.
2. Hiasan berupa ukiran berlubang (*tatah*) dan garis emas/tembaga, bukan gambar rumit.
3. Dua kerajaan memakai bentuk yang sama, berbeda warna dan aksen.
4. Enam bidak harus mudah dibedakan satu sama lain, terutama Gajah dengan Pion, dan Raja
   dengan Menteri.

| Bidak | Siluet dasar | Sentuhan wayang |
| --- | --- | --- |
| Raja | Raja Staunton, puncak tertinggi | Mahkota bertingkat, puncak berbentuk gunungan kecil |
| Menteri | Menteri Staunton, mahkota bergerigi | Lekuk keris pada badan |
| Benteng | Menara bergerigi | Gapura candi bentar bertingkat |
| Gajah | Gajah Staunton dengan celah miring | Sepasang gading di kerah |
| Kuda | Kepala kuda menghadap kiri | Surai berlekuk seperti ukiran wayang |
| Pion | Pion Staunton, paling pendek | Kepala bulat dengan ikat kepala |

Bidak memakai nama catur yang umum; nuansa wayang hanya pada wujudnya.

Set kedua, **Klasik**, adalah bidak Staunton polos dengan palet Yuddha.

### A5. Papan

| Tema | Petak terang / gelap | Ciri |
| --- | --- | --- |
| Kelir (bawaan) | Gading hangat / nila kusam | Cahaya blencong samar dari tepi atas |
| Batik Kawung | Krem / soga | Motif kawung sangat halus pada petak gelap |
| Candi | Abu batu muda / abu andesit | Tekstur batu, bingkai relief |
| Jati Ukir | Kayu muda / kayu tua | Bingkai ukiran |

Aturan: motif pada petak harus sangat halus (kontras rendah) agar bidak tetap menonjol.
Kontras petak terang dan gelap cukup untuk dibaca di bawah sinar matahari di HP.

Penanda di papan: langkah terakhir (emas tembus pandang), langkah sah (titik Sukma), skak
(pendar Bara di bawah Raja), petunjuk Nyala (pendar Sukma).

### A6. Tokoh

Potret setengah badan bergaya wayang kulit yang disederhanakan: tampak samping, garis
tegas, warna datar dengan aksen emas, sedikit pendar. Tiap tokoh punya tiga ekspresi:
netral, senang, dan terkejut.

- **Ki Sabda**: dalang tua, blangkon, kumis putih, mata menyipit ramah, membawa cempala.
- **Nyala**: api kecil berwajah, warna Sukma dan emas.
- **Para Penantang**: lihat tabel di `PRD.md` bagian 6. Wujud mencerminkan gaya main
  (contoh: Buta Cilik bermulut besar; Resi Wening tenang dan berjanggut panjang).

### A7. Gerak dan suara

- Bidak bergeser 150–200 ms. Saat memakan, bidak yang kalah pudar menjadi serpihan cahaya.
- Skakmat: Kelir berpendar, gunungan menutup layar.
- Hormati pengaturan "kurangi gerakan" di perangkat.
- Suara: ketukan kayu untuk langkah, denting saron untuk memakan, gong untuk skakmat.

### A8. Daftar layar

Rancangan dibuat untuk HP lebih dulu (390 × 844), lalu disesuaikan untuk layar lebar
(1280 × 800). Navigasi bawah di HP berisi empat tab: **Laku**, **Lakon**, **Tanding**,
**Cermin**.

| # | Layar | Isi pokok |
| --- | --- | --- |
| 1 | Sambutan dan pilih level | Perkenalan Ki Sabda; pilihan "pemula total", perkiraan rating, atau tes penempatan; pilih bahasa |
| 2 | Laku (beranda) | Laku Harian empat langkah, Nyala Blencong (streak), pangkat, tombol lanjut |
| 3 | Lakon (peta kampanye) | Peta digulir ke bawah, simpul bab terkunci / terbuka / selesai, babak aktif |
| 4 | Adegan pelajaran | Papan di atas, dialog Ki Sabda di bawah, tugas interaktif, petunjuk Nyala |
| 5 | Puzzle | Papan, tema dan rating puzzle, umpan balik benar / salah, penjelasan singkat |
| 6 | Latihan penglihatan papan | Papan dengan tugas "cari bidak gantung", hitung waktu, skor |
| 7 | Pilih penantang | Kartu tokoh: potret, rating, gaya main, status terbuka |
| 8 | Tanding | Papan, bidak tertangkap, celetukan penantang, tombol petunjuk dan batal langkah, peringatan blunder |
| 9 | Hasil partai | Menang / kalah / remis, komentar Ki Sabda, perubahan rating, tombol ulasan |
| 10 | Ulasan partai | Papan, daftar langkah berkelas, grafik evaluasi, momen kunci, tombol "coba lagi" |
| 11 | Kitab Luka | Kartu kesalahan yang jatuh tempo hari ini, jumlah tersisa |
| 12 | Cermin | Peta skill empat area, blunder per partai dari waktu ke waktu, motif yang sering terlewat, impor partai |
| 13 | Profil dan pengaturan | Pangkat, riwayat, tema papan dan bidak, bahasa, volume musik dan efek |

Keadaan yang juga perlu dirancang: kosong (belum ada data), memuat, offline, dan galat.

## Bagian B — Prompt cadangan untuk Claude Code

Jalankan satu prompt per sesi, berurutan. Tiap prompt meminta lembar pratinjau agar hasil
bisa dinilai lewat gambar sebelum diterima.

### B1. Set bidak Yuddha

```text
Baca docs/ART-DIRECTION.md bagian A1, A2, dan A4.

Buat set bidak catur "Yuddha" sebagai SVG tulisan tangan di assets/pieces/yuddha/.
Dua belas berkas: wK wQ wR wB wN wP dan bK bQ bR bB bN bP (.svg).

Ketentuan:
- viewBox "0 0 100 100", tanpa raster, tanpa font, tanpa filter berat.
- Siluet mengikuti bidak Staunton sesuai A4; hiasan wayang berada di dalam siluet.
- Warna memakai CSS custom property dengan nilai cadangan dari A2, supaya bisa ditema ulang.
- Bentuk putih dan hitam sama; hanya warna dan aksen yang berbeda.
- Tiap berkas di bawah 6 KB.

Verifikasi yang wajib kamu lakukan sendiri:
1. Buat assets/pieces/yuddha/preview.html yang menampilkan keduabelas bidak pada petak
   terang dan gelap dalam ukuran 32, 48, 64, dan 128 px, ditambah satu baris siluet hitam polos.
2. Ambil tangkapan layar dengan Playwright dan lihat hasilnya.
3. Nilai dengan jujur: apakah tiap bidak dikenali pada 32 px? Apakah Gajah dan Pion,
   juga Raja dan Menteri, mudah dibedakan? Perbaiki dan ulangi sampai lolos,
   minimal tiga putaran perbaikan.

Akhiri dengan tangkapan layar terakhir dan daftar kelemahan yang masih tersisa.
```

### B2. Set bidak Klasik

```text
Baca docs/ART-DIRECTION.md bagian A2 dan A4.

Buat set bidak "Klasik" di assets/pieces/klasik/: dua belas SVG bidak Staunton polos
dengan palet Yuddha. Ketentuan teknis dan cara verifikasi sama dengan set Yuddha
(viewBox 0 0 100 100, CSS custom property, preview.html, tangkapan layar Playwright
pada 32–128 px). Utamakan keterbacaan di atas gaya.
```

### B3. Tema papan

```text
Baca docs/ART-DIRECTION.md bagian A2 dan A5.

Buat empat tema papan: kelir, batik-kawung, candi, jati-ukir. Tiap tema berupa satu
berkas di assets/boards/<nama>.css yang mendefinisikan CSS custom property: warna petak
terang dan gelap, motif petak sebagai SVG data-URI bila ada, bingkai, warna koordinat,
serta empat penanda (langkah terakhir, langkah sah, skak, petunjuk).

Buat assets/boards/preview.html yang menampilkan keempat tema berdampingan dengan posisi
awal memakai bidak di assets/pieces/yuddha/, pada lebar 360 px (HP) dan 720 px.

Verifikasi dengan tangkapan layar Playwright. Periksa: bidak kedua warna menonjol di
kedua jenis petak, motif tidak mengganggu, keempat penanda terlihat jelas. Hitung rasio
kontras petak terang terhadap gelap dan laporkan. Perbaiki sampai lolos.
```

### B4. Potret tokoh

```text
Baca docs/ART-DIRECTION.md bagian A1, A2, A6, dan docs/PRD.md bagian 3 dan 6.

Buat potret SVG tulisan tangan di assets/characters/<nama>/ untuk: ki-sabda, nyala,
dan sembilan penantang di PRD bagian 6. Tiap tokoh punya tiga berkas: netral.svg,
senang.svg, terkejut.svg.

Ketentuan:
- viewBox "0 0 200 200", gaya wayang kulit yang disederhanakan, tampak samping.
- Warna datar dari palet A2 dengan aksen emas; tanpa raster.
- Tiap tokoh dikenali dari siluetnya saja, dan wujudnya mencerminkan gaya main.
- Ketiga ekspresi berbagi bentuk dasar; yang berubah hanya mata, alis, dan mulut.

Mulai dari Ki Sabda saja. Buat preview.html, ambil tangkapan layar pada 64 px dan 200 px,
nilai, lalu perbaiki. Setelah gaya Ki Sabda mantap, tulis aturan gayanya dalam lima butir
di assets/characters/STYLE.md, baru kerjakan tokoh lain mengikuti aturan itu.
Akhiri dengan satu lembar pratinjau berisi semua tokoh.
```

### B5. Logo dan ikon aplikasi

```text
Baca docs/ART-DIRECTION.md bagian A1 sampai A3.

Rancang logo Yuddha: lambang berupa gunungan yang memuat siluet bidak catur, ditambah
tulisan "Yuddha". Buat tiga usulan lambang yang berbeda di assets/brand/usulan/, tampilkan
berdampingan di preview.html pada 24, 48, dan 192 px di latar gelap dan terang, ambil
tangkapan layar, lalu berhenti dan minta saya memilih.

Setelah saya memilih, hasilkan: logo.svg, mark.svg, ikon PWA 192 dan 512 px (termasuk
versi maskable dengan area aman), dan favicon.svg.
```

### B6. Peta dunia kampanye

```text
Baca docs/ART-DIRECTION.md bagian A1, A2, dan docs/PRD.md bagian 3 dan 7.

Buat peta dunia Mandala Caturangga untuk layar kampanye sebagai SVG tulisan tangan di
assets/map/. Peta memanjang ke bawah untuk digulir di HP (lebar 360, tinggi bebas),
bergaya peta kuno di atas lontar dengan sentuhan cahaya magis. Lima wilayah sesuai lima
babak kurikulum, dihubungkan satu jalur. Tiap simpul bab adalah elemen dengan id
tersendiri supaya bisa diberi status terkunci, terbuka, dan selesai lewat CSS.

Buat preview.html yang memperlihatkan ketiga status, ambil tangkapan layar pada lebar
360 px, nilai keterbacaan jalur dan simpul, lalu perbaiki.
```

## Catatan pemakaian

- Bagian B hanya dipakai bila aset dari Claude Design belum cukup untuk produksi.
- Bila dipakai, kerjakan **B1 lebih dulu**; set bidak menentukan rasa seluruh aplikasi.
- Bila hasil kurang memuaskan, minta perbaikan dengan menunjuk hal spesifik pada tangkapan
  layar (contoh: "Gajah terlalu mirip Pion pada 32 px, pertegas celah miringnya").
- Bila ilustrasi SVG tulisan tangan terasa kurang kaya untuk potret tokoh, alternatifnya
  adalah gambar dari generator gambar AI atau ilustrator, dengan bagian A sebagai brief.
