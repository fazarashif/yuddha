import type { Lesson } from './lessons';

/** Second half of chapter 1 (Mata Ksatria): trades, mating patterns, openings, basic mates. */

export const tukar: Lesson = {
  id: 'b1-4',
  title: { id: 'Tukar yang Menguntungkan', en: 'Trades That Pay' },
  blurb: { id: 'Menimbang apa yang diberi dan apa yang diterima.', en: 'Weighing what you give against what you get.' },
  scenes: [
    {
      kind: 'say',
      text: {
        id: 'Bertukar bidak itu seperti berdagang di pasar. Yang kau berikan dan yang kau terima harus ditimbang. Timbangannya sudah kau hafal: Pion 1, Kuda 3, Gajah 3, Benteng 5, Menteri 9.',
        en: 'Trading pieces is like trading at the market. What you give and what you get must be weighed. You know the scale already: pawn 1, knight 3, bishop 3, rook 5, queen 9.',
      },
    },
    {
      kind: 'quiz',
      fen: '4k3/6p1/5n2/6B1/8/8/8/4K3 w - - 0 1',
      marks: { f6: 'target' },
      text: { id: 'Gajah memakan Kuda di f6, lalu Pion memakan Gajah. Hasilnya untuk Putih?', en: 'The bishop takes the knight on f6, then the pawn takes the bishop. The result for White?' },
      options: [
        { id: 'Untung', en: 'A gain' },
        { id: 'Impas', en: 'Even' },
        { id: 'Rugi', en: 'A loss' },
      ],
      correct: 1,
      explain: { id: 'Tiga ditukar tiga. Tukar impas tidak salah, tapi juga belum menguntungkan. Lakukan kalau ada alasannya.', en: 'Three for three. An even trade is not wrong, but not yet a gain either. Make it when you have a reason.' },
    },
    {
      kind: 'quiz',
      fen: '4k3/8/4p3/3r4/8/8/8/3QK3 w - - 0 1',
      marks: { d5: 'target', e6: 'good' },
      text: { id: 'Menteri memakan Benteng di d5, lalu Pion memakan Menteri. Hasilnya untuk Putih?', en: 'The queen takes the rook on d5, then the pawn takes the queen. The result for White?' },
      options: [
        { id: 'Untung 5', en: 'Up 5' },
        { id: 'Rugi 4', en: 'Down 4' },
        { id: 'Impas', en: 'Even' },
      ],
      correct: 1,
      explain: { id: 'Dapat 5, kehilangan 9. Bidak mahal jangan dipakai memakan bidak yang dijaga.', en: 'You gain 5 and lose 9. Never use an expensive piece to take something that is guarded.' },
    },
    {
      kind: 'move',
      fen: '3qk3/2r5/8/3N4/8/8/8/4K3 w - - 0 1',
      accept: ['d5c7'],
      hint: 'd5c7',
      text: { id: 'Sekarang sebaliknya. Kudamu (3) bisa memakan Benteng (5) yang dijaga Menteri. Lakukan.', en: 'Now the other way round. Your knight (3) can take a rook (5) guarded by the queen. Do it.' },
      right: { id: 'Kuda hilang, Benteng didapat. Untung dua. Ini namanya menang kualitas.', en: 'A knight lost, a rook won. Up two. This is called winning the exchange.' },
      wrong: { id: 'Makan Benteng di c7 dengan Kuda.', en: 'Take the rook on c7 with the knight.' },
    },
    {
      kind: 'move',
      fen: '4k3/8/2p5/3n4/4P3/8/8/3QK3 w - - 0 1',
      accept: ['e4d5'],
      hint: 'e4d5',
      text: { id: 'Kuda hitam di d5 dijaga Pion. Dua bidakmu bisa memakannya. Pilih pemakan yang tepat.', en: 'The black knight on d5 is guarded by a pawn. Two of your pieces can take it. Choose the right capturer.' },
      right: { id: 'Pion ditukar Kuda: untung dua. Selalu makan dengan bidak yang paling murah.', en: 'A pawn for a knight: up two. Always capture with the cheapest piece.' },
      wrong: { id: 'Makan Kuda di d5.', en: 'Capture the knight on d5.' },
      punish: {
        d1d5: { id: 'Pion akan memakan balik Menterimu. Sembilan ditukar tiga. Pakai yang lebih murah.', en: 'The pawn will take your queen back. Nine for three. Use something cheaper.' },
      },
    },
    {
      kind: 'say',
      text: {
        id: 'Satu aturan lagi dari para dalang tua: saat unggul bidak, bertukarlah. Semakin sedikit bidak di Kelir, semakin terasa keunggulanmu. Saat tertinggal, hindari tukar.',
        en: 'One more rule from the old puppeteers: when you are ahead in material, trade. The fewer pieces on the screen, the more your extra one matters. When you are behind, avoid trades.',
      },
    },
    {
      kind: 'quiz',
      fen: '3q1rk1/5ppp/8/8/8/8/5PPP/R2Q1RK1 w - - 0 1',
      text: { id: 'Kau punya dua Benteng, lawan hanya satu. Menterimu bisa ditukar dengan Menteri lawan. Tukar atau hindari?', en: 'You have two rooks, your opponent only one. Your queen can be traded for theirs. Trade or avoid?' },
      options: [
        { id: 'Tukar', en: 'Trade' },
        { id: 'Hindari', en: 'Avoid' },
      ],
      correct: 0,
      explain: { id: 'Kau unggul satu Benteng. Tanpa Menteri, lawan kehilangan senjata terbaiknya untuk membalas.', en: 'You are a rook up. Without queens, your opponent loses the best weapon for fighting back.' },
    },
    {
      kind: 'move',
      fen: '3q1rk1/5ppp/8/8/8/8/5PPP/R2Q1RK1 w - - 0 1',
      accept: ['d1d8'],
      hint: 'd1d8',
      text: { id: 'Tukarkan Menterinya.', en: 'Trade the queens.' },
      right: { id: 'Sekarang dua Benteng melawan satu. Lakon ini tinggal menunggu tamat.', en: 'Now it is two rooks against one. This story only waits for its ending.' },
      wrong: { id: 'Makan Menteri lawan di d8.', en: 'Take the enemy queen on d8.' },
    },
    {
      kind: 'move',
      fen: '4k3/8/8/8/3b4/8/8/R3K3 w Q - 0 1',
      goal: { kind: 'safe' },
      hint: 'a1d1',
      text: { id: 'Gajah lawan (3) membidik Bentengmu (5) dari jauh. Jangan biarkan tukar yang merugikan itu terjadi.', en: 'The enemy bishop (3) is aiming at your rook (5) from afar. Do not let that losing trade happen.' },
      right: { id: 'Benteng selamat. Menghindari tukar rugi sama pentingnya dengan mencari tukar untung.', en: 'The rook is safe. Dodging a bad trade matters as much as finding a good one.' },
      wrong: { id: 'Bentengmu masih bisa dimakan Gajah. Pindahkan ke petak yang aman.', en: 'The bishop can still take your rook. Move it to a safe square.' },
    },
    {
      kind: 'say',
      mood: 'happy',
      text: {
        id: 'Timbang sebelum bertukar, makan dengan yang paling murah, dan sederhanakan saat unggul. Pedagang yang cermat jarang pulang rugi.',
        en: 'Weigh before you trade, capture with the cheapest piece, and simplify when ahead. A careful trader seldom goes home poorer.',
      },
    },
  ],
};

export const polaMat: Lesson = {
  id: 'b1-5',
  title: { id: 'Pola Mat Dasar', en: 'Basic Mating Patterns' },
  blurb: { id: 'Wajah-wajah skakmat yang paling sering muncul.', en: 'The faces of checkmate you will meet most often.' },
  scenes: [
    {
      kind: 'say',
      text: {
        id: 'Skakmat punya wajah-wajah yang berulang. Dalang hafal wajah wayangnya; kau perlu hafal wajah mat. Kalau wajahnya kau kenal, kau akan melihatnya dari jauh.',
        en: 'Checkmate has faces that keep returning. A puppeteer knows every puppet by its face; you need to know the faces of mate. Once you know a face, you will spot it from afar.',
      },
    },
    {
      kind: 'move',
      fen: '6k1/5ppp/8/8/8/8/5PPP/4Q1K1 w - - 0 1',
      accept: ['e1e8'],
      hint: 'e1e8',
      mate: true,
      text: { id: 'Wajah pertama: mat baris belakang. Raja terkurung Pionnya sendiri. Tuntaskan.', en: 'The first face: the back-rank mate. The king is boxed in by his own pawns. Finish it.' },
      right: { id: 'Skakmat. Tiga Pion yang seharusnya melindungi justru menjadi dinding penjara.', en: 'Checkmate. The three pawns meant to protect him became the walls of his cell.' },
      wrong: { id: 'Cari skak di baris paling atas.', en: 'Look for a check on the top row.' },
    },
    {
      kind: 'quiz',
      fen: '6k1/5pp1/7p/8/8/8/5PPP/4Q1K1 w - - 0 1',
      marks: { h7: 'good' },
      text: { id: 'Posisi yang mirip, tapi Pion h sudah maju. Apakah Menteri ke e8 masih skakmat?', en: 'A similar position, but the h-pawn has stepped forward. Is queen to e8 still checkmate?' },
      options: [
        { id: 'Ya, tetap skakmat', en: 'Yes, still checkmate' },
        { id: 'Tidak, Raja lolos ke h7', en: 'No, the king escapes to h7' },
      ],
      correct: 1,
      explain: { id: 'Satu langkah Pion membuka jendela bagi Raja. Buat jendela seperti itu untuk Rajamu sendiri sebelum terlambat.', en: 'One pawn step opened a window for the king. Make a window like that for your own king before it is too late.' },
    },
    {
      kind: 'move',
      fen: '8/7k/R7/8/8/8/8/1R4K1 w - - 0 1',
      accept: ['b1b7'],
      hint: 'b1b7',
      text: {
        id: 'Wajah kedua: mat tangga. Dua Benteng bergantian menutup baris, mendorong Raja ke tepi. Benteng di a6 sudah menutup baris 6. Beri skak di baris 7.',
        en: 'The second face: the ladder mate. Two rooks take turns closing rows, pushing the king to the edge. The rook on a6 already closes row 6. Give check on row 7.',
      },
      right: { id: 'Raja terpaksa mundur ke baris terakhir. Satu anak tangga lagi.', en: 'The king has to step back to the last row. One more rung.' },
      wrong: { id: 'Pindahkan Benteng dari b1 ke b7.', en: 'Move the rook from b1 to b7.' },
    },
    {
      kind: 'move',
      fen: '6k1/1R6/R7/8/8/8/8/6K1 w - - 0 1',
      accept: ['a6a8'],
      hint: 'a6a8',
      mate: true,
      text: { id: 'Benteng yang satu menjaga baris 7. Benteng yang lain menutup tangga.', en: 'One rook guards row 7. The other closes the ladder.' },
      right: { id: 'Skakmat. Kanan, kiri, kanan, kiri, seperti orang menaiki tangga.', en: 'Checkmate. Right, left, right, left, like someone climbing a ladder.' },
      wrong: { id: 'Benteng di a6 naik ke baris terakhir.', en: 'The rook on a6 goes up to the last row.' },
    },
    {
      kind: 'move',
      fen: '7k/8/5K2/8/8/8/8/6Q1 w - - 0 1',
      accept: ['g1g7'],
      hint: 'g1g7',
      mate: true,
      text: {
        id: 'Wajah ketiga: Menteri yang dijaga. Menteri menempel pada Raja lawan, dan kawannya menjaga dari belakang supaya ia tidak bisa dimakan.',
        en: 'The third face: the guarded queen. The queen lands right next to the enemy king, with a friend guarding her from behind so she cannot be taken.',
      },
      right: { id: 'Skakmat. Raja tidak bisa memakan Menteri karena Rajamu menjaganya.', en: 'Checkmate. The king cannot take the queen because your own king guards her.' },
      wrong: { id: 'Tempatkan Menteri di g7, tepat di samping Raja lawan.', en: 'Put the queen on g7, right beside the enemy king.' },
    },
    {
      kind: 'move',
      fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 0 1',
      accept: ['h5f7'],
      hint: 'h5f7',
      mate: true,
      text: { id: 'Wajah yang sama muncul di pembukaan dengan nama Mat Sarjana. Gajah di c4 menjaga petak f7. Tuntaskan.', en: 'The same face shows up in the opening as the Scholar\'s Mate. The bishop on c4 guards the f7 square. Finish it.' },
      right: { id: 'Skakmat dalam empat langkah. Banyak pemula jatuh di sini. Sebentar lagi kau tidak.', en: 'Checkmate in four moves. Many beginners fall for this. Soon you will not.' },
      wrong: { id: 'Petak f7 hanya dijaga Raja. Serang dengan Menteri.', en: 'The f7 square is guarded only by the king. Strike there with the queen.' },
    },
    {
      kind: 'move',
      fen: 'r1bqkbnr/pppp1ppp/2n5/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 0 1',
      orient: 'b',
      goal: { kind: 'stopMate' },
      hint: 'g7g6',
      marks: { f7: 'danger' },
      text: { id: 'Sekarang kau Hitam, selangkah sebelum bencana. Putih mengancam skakmat di f7. Cegah.', en: 'Now you are Black, one move before disaster. White threatens mate on f7. Stop it.' },
      right: { id: 'Ancaman padam. Begitu kau kenal wajahnya, Mat Sarjana hanya gertakan.', en: 'The threat is out. Once you know its face, the Scholar\'s Mate is only a bluff.' },
      wrong: { id: 'Putih masih bisa skakmat di f7. Halangi jalan Menteri atau jaga petak f7.', en: 'White can still mate on f7. Block the queen\'s path or guard f7.' },
      punish: {
        g8f6: { id: 'Kuda memang menyerang Menteri, tapi f7 tetap terbuka: Menteri memakan f7, skakmat.', en: 'The knight does attack the queen, but f7 stays open: queen takes f7, checkmate.' },
      },
    },
    {
      kind: 'move',
      fen: 'k7/8/1K6/8/8/8/8/7R w - - 0 1',
      accept: ['h1h8'],
      hint: 'h1h8',
      mate: true,
      text: { id: 'Wajah terakhir hari ini: Benteng dan Raja di tepi papan. Rajamu menutup jalan keluar, Benteng memberi skak.', en: 'The last face for today: rook and king at the edge of the board. Your king blocks the exits, the rook gives the check.' },
      right: { id: 'Skakmat. Rajamu ikut bertarung. Di akhir permainan, Raja adalah bidak penyerang.', en: 'Checkmate. Your king joined the fight. In the endgame, the king is an attacking piece.' },
      wrong: { id: 'Beri skak dengan Benteng di baris paling atas.', en: 'Give check with the rook on the top row.' },
    },
    {
      kind: 'say',
      mood: 'happy',
      text: {
        id: 'Baris belakang, tangga, Menteri yang dijaga, dan Benteng bersama Raja. Empat wajah. Setiap kali Raja lawan terkurung, tanyakan: wajah mana yang sedang kulihat?',
        en: 'Back rank, ladder, guarded queen, and rook with king. Four faces. Whenever the enemy king is hemmed in, ask yourself: which face am I looking at?',
      },
    },
  ],
};

export const pembukaan: Lesson = {
  id: 'b1-6',
  title: { id: 'Prinsip Pembukaan', en: 'Opening Principles' },
  blurb: { id: 'Pusat, kembangkan, rokade.', en: 'Centre, develop, castle.' },
  scenes: [
    {
      kind: 'say',
      text: {
        id: 'Sebelum lakon dimulai, dalang menata wayangnya dulu. Pembukaan catur sama: tiga tugas, selalu dalam urutan ini. Rebut pusat. Kembangkan bidak. Amankan Raja dengan rokade.',
        en: 'Before the story begins, the puppeteer sets out his puppets. A chess opening is the same: three jobs, always in this order. Take the centre. Develop your pieces. Make the king safe by castling.',
      },
    },
    {
      kind: 'move',
      fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      accept: ['e2e4', 'd2d4'],
      hint: 'e2e4',
      marks: { d4: 'target', e4: 'target', d5: 'target', e5: 'target' },
      text: { id: 'Empat petak di tengah adalah pusat. Bidak di pusat menjangkau ke mana-mana. Rebut pusat dengan Pion.', en: 'The four squares in the middle are the centre. A piece in the centre reaches everywhere. Take the centre with a pawn.' },
      right: { id: 'Pion di pusat, dan jalan untuk Gajah serta Menteri ikut terbuka.', en: 'A pawn in the centre, and the roads for bishop and queen open too.' },
      wrong: { id: 'Majukan Pion di depan Raja atau Menteri dua petak.', en: 'Push the pawn in front of the king or queen two squares.' },
      punish: {
        a2a4: { id: 'Pion pinggir tidak menyentuh pusat. Pakai Pion e atau d.', en: 'An edge pawn does not touch the centre. Use the e- or d-pawn.' },
        h2h4: { id: 'Pion pinggir tidak menyentuh pusat. Pakai Pion e atau d.', en: 'An edge pawn does not touch the centre. Use the e- or d-pawn.' },
      },
    },
    {
      kind: 'move',
      fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
      accept: ['g1f3', 'b1c3'],
      hint: 'g1f3',
      text: { id: 'Tugas kedua: kembangkan bidak. Mulailah dengan Kuda, ke arah pusat.', en: 'The second job: develop your pieces. Start with a knight, towards the centre.' },
      right: { id: 'Kuda di sana menjangkau pusat. Kuda dulu, baru Gajah: begitu kebiasaan yang baik.', en: 'From there the knight reaches the centre. Knights first, then bishops: a good habit.' },
      wrong: { id: 'Keluarkan salah satu Kuda ke baris ketiga, ke arah tengah.', en: 'Bring one of the knights out to the third row, towards the middle.' },
      punish: {
        d1h5: { id: 'Menteri keluar terlalu dini akan dikejar-kejar bidak kecil, dan kau kehilangan waktu. Kuda dulu.', en: 'A queen out too early gets chased by small pieces, and you lose time. Knights first.' },
        g1h3: { id: 'Kuda di pinggir itu redup: jangkauannya hanya separuh. Arahkan ke tengah.', en: 'A knight on the rim is dim: it reaches half as far. Aim it at the middle.' },
        b1a3: { id: 'Kuda di pinggir itu redup: jangkauannya hanya separuh. Arahkan ke tengah.', en: 'A knight on the rim is dim: it reaches half as far. Aim it at the middle.' },
      },
    },
    {
      kind: 'move',
      fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3',
      accept: ['f1c4', 'f1b5'],
      hint: 'f1c4',
      text: { id: 'Sekarang Gajah di sisi Raja. Bawa ke petak yang aktif.', en: 'Now the bishop on the king\'s side. Take it to an active square.' },
      right: { id: 'Gajah aktif, dan jalan untuk rokade tinggal selangkah lagi.', en: 'The bishop is active, and castling is now one step away.' },
      wrong: { id: 'Kembangkan Gajah dari f1 ke c4 atau b5.', en: 'Develop the bishop from f1 to c4 or b5.' },
      punish: {
        f1d3: { id: 'Di d3 Gajah menghalangi Pion d-mu sendiri. Cari petak yang lebih jauh.', en: 'On d3 the bishop blocks your own d-pawn. Find a square further out.' },
      },
    },
    {
      kind: 'say',
      fen: 'r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4',
      marks: { e1: 'target', g1: 'target', h1: 'target', f1: 'target' },
      text: {
        id: 'Tugas ketiga: rokade. Raja melangkah dua petak ke arah Benteng, dan Benteng melompat ke sisi lain Raja. Syaratnya: Raja dan Benteng itu belum pernah bergerak, petak di antaranya kosong, dan Raja tidak sedang atau melewati skak.',
        en: 'The third job: castling. The king steps two squares towards a rook, and the rook hops to his other side. The conditions: that king and rook have never moved, the squares between them are empty, and the king is not in check or passing through one.',
      },
    },
    {
      kind: 'move',
      fen: 'r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4',
      accept: ['e1g1'],
      hint: 'e1g1',
      text: { id: 'Lakukan rokade: geser Raja dua petak ke kanan.', en: 'Castle: slide the king two squares to the right.' },
      right: { id: 'Raja aman di balik Pion, dan Benteng masuk ke permainan. Dua tugas dalam satu langkah.', en: 'The king is safe behind his pawns, and the rook joins the game. Two jobs in one move.' },
      wrong: { id: 'Ketuk Raja, lalu petak g1.', en: 'Tap the king, then the g1 square.' },
    },
    {
      kind: 'move',
      fen: 'r1bq1rk1/pppp1ppp/2n2n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQ1RK1 w - - 0 7',
      accept: ['c1g5', 'c1e3', 'c1d2'],
      hint: 'c1g5',
      marks: { c1: 'target' },
      text: { id: 'Hampir semua bidakmu sudah keluar. Tinggal satu yang masih tidur di petak asalnya. Kembangkan.', en: 'Nearly all your pieces are out. One is still asleep on its home square. Develop it.' },
      right: { id: 'Semua bidak ringan sudah bekerja. Pembukaanmu selesai dengan rapi.', en: 'Every minor piece is at work. Your opening is neatly done.' },
      wrong: { id: 'Gajah di c1 belum bergerak. Bawa ke petak yang aman.', en: 'The bishop on c1 has not moved. Take it to a safe square.' },
      punish: {
        c1f4: { id: 'Petak itu dijaga Pion e5. Gajahmu akan dimakan gratis.', en: 'That square is guarded by the e5 pawn. Your bishop would be taken for free.' },
        c1h6: { id: 'Petak itu dijaga Pion g7. Gajahmu akan dimakan gratis.', en: 'That square is guarded by the g7 pawn. Your bishop would be taken for free.' },
      },
    },
    {
      kind: 'quiz',
      text: { id: 'Di pembukaan, mana kebiasaan yang paling merugikan?', en: 'In the opening, which habit costs you most?' },
      options: [
        { id: 'Mengembangkan Kuda sebelum Gajah', en: 'Developing knights before bishops' },
        { id: 'Menggerakkan bidak yang sama berkali-kali sementara yang lain masih tidur', en: 'Moving the same piece again and again while the others sleep' },
        { id: 'Rokade sebelum langkah kesepuluh', en: 'Castling before move ten' },
      ],
      correct: 1,
      explain: { id: 'Tiap langkah di pembukaan sebaiknya membangunkan bidak baru. Satu bidak yang mondar-mandir berarti pasukanmu datang terlambat.', en: 'Each opening move should wake a new piece. One piece pacing back and forth means your army arrives late.' },
    },
    {
      kind: 'say',
      mood: 'happy',
      text: {
        id: 'Pusat, kembangkan, rokade. Lawan yang melanggar urutan ini, seperti Gandarwa yang gegabah dengan Menterinya, akan kehabisan napas sebelum pertempuran dimulai.',
        en: 'Centre, develop, castle. An opponent who breaks this order, like reckless Gandarwa with his queen, runs out of breath before the battle begins.',
      },
    },
  ],
};

export const matMenteri: Lesson = {
  id: 'b1-7',
  title: { id: 'Mat Raja dan Menteri', en: 'King and Queen Mate' },
  blurb: { id: 'Menutup lakon saat tinggal Menteri melawan Raja.', en: 'Closing the story with queen against lone king.' },
  scenes: [
    {
      kind: 'say',
      text: {
        id: 'Unggul satu Menteri belum berarti menang, kalau kau tidak tahu cara menutup lakon. Caranya tiga babak: kurung Raja lawan, dekatkan Rajamu, lalu skakmat di tepi papan.',
        en: 'Being a queen up is not yet a win if you cannot close the story. It takes three acts: fence the enemy king in, bring your own king closer, then mate at the edge of the board.',
      },
    },
    {
      kind: 'move',
      fen: '8/8/8/4k3/8/8/8/1Q2K3 w - - 0 1',
      accept: ['b1d3', 'b1g6'],
      hint: 'b1d3',
      text: {
        id: 'Babak pertama: kurung. Rahasianya, tempatkan Menteri sejarak satu langkah Kuda dari Raja lawan. Di sana ia memagari tanpa bisa disentuh.',
        en: 'Act one: the fence. The secret is to place the queen a knight\'s move away from the enemy king. There she fences him in without ever being touched.',
      },
      right: { id: 'Raja lawan kehilangan separuh ruangnya. Tiap kali ia bergerak, ikuti dengan jarak yang sama.', en: 'The enemy king has lost half his room. Each time he moves, follow at the same distance.' },
      wrong: { id: 'Cari petak yang sejarak langkah Kuda dari Raja di e5, yang bisa dicapai Menteri.', en: 'Find a square a knight\'s move from the king on e5 that the queen can reach.' },
      punish: {
        b1e4: { id: 'Terlalu dekat dan tanpa penjaga: Raja memakan Menterimu.', en: 'Too close and unguarded: the king takes your queen.' },
        b1b5: { id: 'Skak dari jauh tidak memagari apa-apa. Raja tinggal melangkah pergi.', en: 'A check from afar fences nothing. The king simply walks away.' },
      },
    },
    {
      kind: 'quiz',
      fen: 'k7/2Q5/8/8/8/8/8/4K3 b - - 0 1',
      orient: 'w',
      marks: { a7: 'bad', b7: 'bad', b8: 'bad' },
      text: { id: 'Awas jebakan. Giliran Hitam. Rajanya tidak sedang diskak, tapi semua petak di sekitarnya dijaga Menteri. Apa hasil partainya?', en: 'Beware the trap. It is Black\'s move. His king is not in check, but every square around him is guarded by the queen. What is the result?' },
      options: [
        { id: 'Putih menang', en: 'White wins' },
        { id: 'Remis', en: 'A draw' },
      ],
      correct: 1,
      explain: {
        id: 'Ini pat: tidak diskak, tapi tidak punya langkah sah. Hasilnya remis, dan Menterimu sia-sia. Selalu sisakan satu petak untuk Raja lawan sampai kau siap skakmat.',
        en: 'This is stalemate: not in check, yet no legal move. The game is drawn and your queen was for nothing. Always leave the enemy king one square until you are ready to mate.',
      },
    },
    {
      kind: 'move',
      fen: 'k7/8/1K6/8/8/8/8/3Q4 w - - 0 1',
      accept: ['d1d8'],
      hint: 'd1d8',
      mate: true,
      text: { id: 'Babak terakhir. Raja lawan sudah di sudut dan Rajamu sudah dekat. Skakmat dalam satu langkah.', en: 'The final act. The enemy king is in the corner and yours is close. Mate in one move.' },
      right: { id: 'Skakmat. Rajamu menutup dua petak, Menteri menutup sisanya.', en: 'Checkmate. Your king covers two squares, the queen covers the rest.' },
      wrong: { id: 'Beri skak di baris paling atas.', en: 'Give check on the top row.' },
    },
    {
      kind: 'play',
      fen: '8/8/8/3k4/8/8/8/Q3K3 w - - 0 1',
      maxMoves: 20,
      text: {
        id: 'Sekarang lakukan sendiri dari awal. Kurung, dekatkan Raja, skakmat. Lawan akan bertahan sebaik mungkin. Nyala siap membantu kalau kau buntu.',
        en: 'Now do it yourself from the start. Fence, bring the king, mate. Your opponent will defend as well as possible. Nyala will help if you get stuck.',
      },
      right: { id: 'Skakmat. Mulai sekarang, unggul satu Menteri berarti menang.', en: 'Checkmate. From now on, a queen up means a win.' },
      stalemate: { id: 'Pat! Raja lawan tidak diskak tapi tidak punya langkah. Sisakan satu petak untuknya sampai kau siap skakmat.', en: 'Stalemate! The enemy king is not in check but has no move. Leave him one square until you are ready to mate.' },
      tooLong: { id: 'Terlalu lama. Ingat urutannya: kurung dengan Menteri, dekatkan Raja, baru skakmat. Jangan memberi skak tanpa tujuan.', en: 'Too slow. Remember the order: fence with the queen, bring the king, then mate. Do not give aimless checks.' },
      lost: { id: 'Menterimu hilang, dan tanpa dia tidak ada skakmat. Jaga jaraknya dari Raja lawan.', en: 'Your queen is gone, and without her there is no mate. Keep her distance from the enemy king.' },
    },
    {
      kind: 'say',
      mood: 'happy',
      text: {
        id: 'Kurung, dekatkan, skakmat, dan jangan lupa pat. Banyak partai yang sudah dimenangkan berakhir remis karena satu langkah terburu-buru.',
        en: 'Fence, approach, mate, and never forget stalemate. Many a won game has ended drawn because of one hasty move.',
      },
    },
  ],
};

export const matBenteng: Lesson = {
  id: 'b1-8',
  title: { id: 'Mat Raja dan Benteng', en: 'King and Rook Mate' },
  blurb: { id: 'Benteng dan Raja bekerja sama di tepi papan.', en: 'Rook and king working together at the edge.' },
  scenes: [
    {
      kind: 'say',
      text: {
        id: 'Benteng tidak bisa skakmat sendirian. Ia butuh Rajamu. Polanya selalu sama: Raja lawan di tepi, Rajamu tepat berhadapan dengannya, lalu Benteng memberi skak di baris tepi itu.',
        en: 'A rook cannot mate alone. It needs your king. The pattern never changes: the enemy king on the edge, your king directly facing him, then the rook checks along that edge.',
      },
    },
    {
      kind: 'move',
      fen: '4k3/8/4K3/8/8/8/8/R7 w - - 0 1',
      accept: ['a1a8'],
      hint: 'a1a8',
      mate: true,
      marks: { e6: 'good', e8: 'danger' },
      text: { id: 'Inilah pola akhirnya. Dua Raja berhadapan, dan Rajamu menutup tiga petak di depannya. Tuntaskan.', en: 'This is the final pattern. The two kings face each other, and yours covers the three squares in front of his. Finish it.' },
      right: { id: 'Skakmat. Ingat gambarnya: Raja berhadapan, Benteng di baris tepi.', en: 'Checkmate. Remember the picture: kings face to face, rook on the edge row.' },
      wrong: { id: 'Beri skak dengan Benteng di baris paling atas.', en: 'Give check with the rook on the top row.' },
    },
    {
      kind: 'say',
      fen: '2k5/R7/4K3/8/8/8/8/8 w - - 0 1',
      marks: { b7: 'bad', c7: 'bad', d7: 'bad', e7: 'bad', f7: 'bad', g7: 'bad', h7: 'bad' },
      text: {
        id: 'Untuk sampai ke gambar itu, Benteng lebih dulu mengurung Raja lawan di baris tepi. Di sini Benteng di a7 menutup seluruh baris 7. Raja hitam hanya bisa mondar-mandir di baris terakhir.',
        en: 'To reach that picture, the rook first shuts the enemy king on the edge row. Here the rook on a7 closes all of row 7. The black king can only pace along the last row.',
      },
    },
    {
      kind: 'move',
      fen: '2k5/R7/4K3/8/8/8/8/8 w - - 0 1',
      accept: ['e6d6'],
      hint: 'e6d6',
      text: { id: 'Sekarang dekatkan Rajamu ke arah Raja lawan.', en: 'Now bring your king towards the enemy king.' },
      right: { id: 'Rajamu mengejar. Ia ingin berdiri tepat berhadapan.', en: 'Your king gives chase. He wants to stand directly opposite.' },
      wrong: { id: 'Langkahkan Raja ke d6, mendekati Raja lawan.', en: 'Step the king to d6, closer to the enemy king.' },
    },
    {
      kind: 'move',
      fen: '1k6/R7/2K5/8/8/8/8/8 w - - 0 1',
      accept: ['a7h7', 'a7g7', 'a7f7', 'a7e7', 'a7d7', 'a7c7'],
      hint: 'a7h7',
      marks: { a7: 'danger' },
      text: { id: 'Raja lawan melawan balik dan menyerang Bentengmu. Selamatkan Benteng, tapi jangan tinggalkan baris 7.', en: 'The enemy king fights back and attacks your rook. Save the rook, but do not leave row 7.' },
      right: { id: 'Benteng aman dan pagar tetap berdiri. Menjauh sepanjang baris yang sama: itu kuncinya.', en: 'The rook is safe and the fence still stands. Moving away along the same row: that is the key.' },
      wrong: { id: 'Geser Benteng menjauh di sepanjang baris 7, supaya Raja lawan tetap terkurung.', en: 'Slide the rook away along row 7, so the enemy king stays shut in.' },
    },
    {
      kind: 'move',
      fen: 'k7/7R/2K5/8/8/8/8/8 w - - 0 1',
      accept: ['c6b6'],
      hint: 'c6b6',
      text: { id: 'Raja lawan lari ke sudut. Tempatkan Rajamu supaya langkah berikutnya memaksanya berhadapan denganmu.', en: 'The enemy king runs to the corner. Place your king so that his next move forces him to face you.' },
      right: { id: 'Sekarang ia hanya punya satu langkah, dan langkah itu membawanya tepat ke depan Rajamu.', en: 'Now he has only one move, and it brings him right in front of your king.' },
      wrong: { id: 'Langkahkan Raja ke b6.', en: 'Step the king to b6.' },
    },
    {
      kind: 'move',
      fen: '1k6/7R/1K6/8/8/8/8/8 w - - 0 1',
      accept: ['h7h8'],
      hint: 'h7h8',
      mate: true,
      text: { id: 'Raja berhadapan. Gambar yang tadi sudah lengkap.', en: 'The kings face each other. The picture from before is complete.' },
      right: { id: 'Skakmat. Kurung, dekatkan, hadapkan, lalu skak di tepi.', en: 'Checkmate. Fence, approach, face him, then check along the edge.' },
      wrong: { id: 'Beri skak dengan Benteng di baris paling atas.', en: 'Give check with the rook on the top row.' },
    },
    {
      kind: 'play',
      // Mate in seven with best play, and the best line is the method taught above.
      fen: '2k5/8/8/4K3/8/8/8/R7 w - - 0 1',
      maxMoves: 20,
      text: {
        id: 'Giliranmu, dari sedikit lebih jauh. Kurung Raja lawan di baris terakhir, dekatkan Rajamu, lalu skakmat. Kadang kau perlu satu langkah tunggu dengan Benteng.',
        en: 'Your turn, from a little further back. Shut the enemy king on the last row, bring your king, then mate. Sometimes you will need one waiting move with the rook.',
      },
      right: { id: 'Skakmat. Ini akhir permainan yang paling sering muncul, dan sekarang kau menguasainya.', en: 'Checkmate. This is the endgame you will meet most often, and now it is yours.' },
      stalemate: { id: 'Pat! Raja lawan tidak punya langkah padahal tidak diskak. Beri dia ruang satu petak sampai saatnya skakmat.', en: 'Stalemate! The enemy king has no move though he is not in check. Leave him one square until it is time to mate.' },
      tooLong: { id: 'Terlalu lama. Kurung dulu Raja lawan di baris terakhir dengan Benteng, baru dekatkan Rajamu.', en: 'Too slow. First shut the enemy king on the last row with the rook, then bring your king.' },
      lost: { id: 'Bentengmu hilang. Jauhkan ia dari Raja lawan, di sepanjang baris yang sama.', en: 'Your rook is gone. Keep it away from the enemy king, along the same row.' },
    },
    {
      kind: 'say',
      mood: 'happy',
      text: {
        id: 'Dengan ini Mata Ksatria-mu lengkap: kau melihat bidak gantung, menghitung penjaga, menimbang tukar, mengenali wajah mat, membuka dengan benar, dan menutup lakon. Para penantang sudah menunggu.',
        en: 'With this your Warrior\'s Eye is complete: you see loose pieces, count guards, weigh trades, know the faces of mate, open properly, and close the story. The challengers are waiting.',
      },
    },
  ],
};
