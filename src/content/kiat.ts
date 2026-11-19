import type { Lesson } from './lessons';

/**
 * Kiat Kilat: short tips and tricks that stand on their own. Any of them can be opened at any
 * time, in any order, from the campaign map.
 */

export const cekKilat: Lesson = {
  id: 'k-cek',
  title: { id: 'Cek Tiga Detik', en: 'The Three-Second Check' },
  blurb: { id: 'Kebiasaan yang mencegah separuh kekalahanmu.', en: 'The habit that prevents half your losses.' },
  scenes: [
    {
      kind: 'say',
      text: {
        id: 'Kiat paling berharga di tingkat 800 sampai 1500 bukan pembukaan, bukan taktik. Ini kebiasaan: setiap kali lawan melangkah, tanyakan "apa yang ia inginkan?" sebelum memikirkan rencanamu sendiri.',
        en: 'The most valuable tip between 800 and 1500 is not an opening, nor a tactic. It is a habit: every time your opponent moves, ask "what do they want?" before you think about your own plan.',
      },
    },
    {
      kind: 'tap',
      fen: 'r1b1k1nr/pppp1ppp/2n2q2/2b1p3/2B1P3/2N5/PPPP1PPP/R1BQK1NR w KQkq - 4 4',
      answers: ['f2'],
      marks: { f6: 'danger' },
      text: { id: 'Menteri hitam baru saja keluar ke f6. Ketuk petak yang ia incar.', en: 'The black queen has just come out to f6. Tap the square she has her eye on.' },
      right: { id: 'f2. Menteri dan Gajah c5 sama-sama membidiknya, dan hanya Rajamu yang menjaga. Menteri memakan di f2 adalah skakmat.', en: 'f2. The queen and the c5 bishop both aim at it, and only your king guards it. Queen takes on f2 is checkmate.' },
      wrong: { id: 'Ikuti garis Menteri f6 lurus ke bawah, lalu periksa siapa lagi yang membidik petak yang sama.', en: 'Follow the f6 queen straight down the file, then see who else aims at the same square.' },
    },
    {
      kind: 'move',
      fen: 'r1b1k1nr/pppp1ppp/2n2q2/2b1p3/2B1P3/2N5/PPPP1PPP/R1BQK1NR w KQkq - 4 4',
      goal: { kind: 'stopMate' },
      hint: 'g1f3',
      text: { id: 'Tangkis ancamannya, sebaiknya sambil mengembangkan bidak.', en: 'Stop the threat, ideally while developing a piece.' },
      right: { id: 'Ancaman lenyap. Satu pertanyaan kecil tadi baru saja menyelamatkan satu partai.', en: 'The threat is gone. That one small question just saved a whole game.' },
      wrong: { id: 'Menteri masih bisa memakan di f2 dengan skakmat. Halangi garisnya, atau jaga f2 sekali lagi.', en: 'The queen can still take on f2 with mate. Block her line, or guard f2 once more.' },
    },
    {
      kind: 'say',
      mood: 'happy',
      text: {
        id: 'Lalu sebelum menekan langkahmu sendiri, tiga detik lagi: apakah langkah ini meninggalkan bidak yang gantung? Apakah ia membuka skak, makan, atau ancaman untuk lawan? Dua pemeriksaan ini, tiap langkah, bisa menaikkan ratingmu ratusan angka.',
        en: 'Then before you play your own move, three more seconds: does it leave a piece hanging? Does it hand your opponent a check, a capture or a threat? These two checks, every move, can lift your rating by hundreds of points.',
      },
    },
  ],
};

export const matKilat: Lesson = {
  id: 'k-mat-kilat',
  title: { id: 'Mat Dua Langkah', en: 'The Two-Move Mate' },
  blurb: { id: 'Partai tersingkat yang mungkin, dan pelajarannya.', en: 'The shortest possible game, and what it teaches.' },
  scenes: [
    {
      kind: 'say',
      fen: 'rnbqkbnr/pppp1ppp/8/4p3/6P1/5P2/PPPPP2P/RNBQKBNR b KQkq g3 0 2',
      orient: 'b',
      marks: { e1: 'danger', h4: 'target' },
      text: {
        id: 'Putih membuka dengan memajukan Pion f satu petak, lalu Pion g dua petak. Garis serong dari h4 ke Raja putih sekarang terbuka lebar. Kau memegang Hitam.',
        en: 'White opened by pushing the f pawn one square, then the g pawn two. The diagonal from h4 to the white king is now wide open. You hold the black pieces.',
      },
    },
    {
      kind: 'move',
      fen: 'rnbqkbnr/pppp1ppp/8/4p3/6P1/5P2/PPPPP2P/RNBQKBNR b KQkq g3 0 2',
      accept: ['d8h4'],
      hint: 'd8h4',
      mate: true,
      text: { id: 'Skakmat dalam satu langkah.', en: 'Checkmate in one move.' },
      right: { id: 'Skakmat di langkah kedua. Tak ada bidak putih yang bisa menghalangi, dan Raja terkurung bidaknya sendiri.', en: 'Checkmate on move two. No white piece can block, and the king is walled in by his own pieces.' },
      wrong: { id: 'Menterimu bisa sampai ke h4.', en: 'Your queen can reach h4.' },
    },
    {
      kind: 'move',
      fen: 'rnbqkbnr/ppppp2p/5p2/6p1/3PP3/8/PPP2PPP/RNBQKBNR w KQkq g6 0 3',
      accept: ['d1h5'],
      hint: 'd1h5',
      mate: true,
      text: { id: 'Lawan di Kelir sungguhan kadang melakukannya juga. Kali ini Hitam yang memajukan Pion f dan g. Hukum.', en: 'Real opponents sometimes do it too. This time Black has pushed the f and g pawns. Punish it.' },
      right: { id: 'Skakmat. Pion f dan g adalah dinding Raja. Di pembukaan, biarkan keduanya di tempat.', en: 'Checkmate. The f and g pawns are the king\'s wall. In the opening, leave them where they are.' },
      wrong: { id: 'Cari garis serong menuju Raja e8 yang sudah terbuka.', en: 'Find the open diagonal leading to the king on e8.' },
    },
    {
      kind: 'quiz',
      text: { id: 'Pion mana yang paling berbahaya dimajukan di awal partai?', en: 'Which pawn is the most dangerous to push early in the game?' },
      options: [
        { id: 'Pion e', en: 'The e pawn' },
        { id: 'Pion f', en: 'The f pawn' },
        { id: 'Pion d', en: 'The d pawn' },
      ],
      correct: 1,
      explain: { id: 'Pion f membuka garis serong langsung ke Raja yang belum rokade. Pion e dan d justru membuka jalan untuk bidakmu sendiri.', en: 'The f pawn opens a diagonal straight to a king that has not castled. The e and d pawns open lines for your own pieces instead.' },
    },
  ],
};

export const jebakanLegal: Lesson = {
  id: 'k-legal',
  title: { id: 'Jebakan Legal', en: 'Légal\'s Trap' },
  blurb: { id: 'Korbankan Menteri, skakmat dengan bidak ringan.', en: 'Give up the queen, mate with minor pieces.' },
  scenes: [
    {
      kind: 'say',
      fen: 'rn1qkbnr/ppp2p1p/3p2p1/4p3/2B1P1b1/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 0 5',
      marks: { g4: 'bad', f3: 'target', d1: 'target' },
      text: {
        id: 'Jebakan ini berumur lebih dari dua ratus tahun dan masih memakan korban tiap hari. Gajah hitam di g4 memaku Kudamu ke Menteri. Lawan mengira Kuda itu tidak bisa pergi.',
        en: 'This trap is over two hundred years old and still claims victims every day. The black bishop on g4 pins your knight to the queen. Your opponent thinks that knight cannot move.',
      },
    },
    {
      kind: 'move',
      fen: 'rn1qkbnr/ppp2p1p/3p2p1/4p3/2B1P1b1/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 0 5',
      accept: ['f3e5'],
      hint: 'f3e5',
      reply: 'g4d1',
      text: { id: 'Pin ke Menteri hanya pin nisbi. Lepaskan Kudamu dan makan Pion e5.', en: 'A pin to the queen is only a relative pin. Let your knight go and take the e5 pawn.' },
      right: { id: 'Lawan yang serakah memakan Menterimu.', en: 'A greedy opponent takes your queen.' },
      wrong: { id: 'Makan Pion e5 dengan Kuda f3, walaupun Kuda itu terpaku.', en: 'Take the e5 pawn with the f3 knight, even though it is pinned.' },
    },
    {
      kind: 'move',
      fen: 'rn1qkbnr/ppp2p1p/3p2p1/4N3/2B1P3/2N5/PPPP1PPP/R1BbK2R w KQkq - 0 6',
      accept: ['c4f7'],
      hint: 'c4f7',
      reply: 'e8e7',
      text: { id: 'Menterimu hilang, tapi bidak ringanmu semua mengarah ke Raja hitam. Skak.', en: 'Your queen is gone, but every minor piece you have points at the black king. Check.' },
      right: { id: 'Raja hanya punya satu petak, e7.', en: 'The king has only one square: e7.' },
      wrong: { id: 'Makan Pion f7 dengan Gajah, sambil memberi skak.', en: 'Take the f7 pawn with the bishop, giving check.' },
    },
    {
      kind: 'move',
      fen: 'rn1q1bnr/ppp1kB1p/3p2p1/4N3/4P3/2N5/PPPP1PPP/R1BbK2R w KQ - 1 7',
      accept: ['c3d5'],
      hint: 'c3d5',
      mate: true,
      text: { id: 'Tuntaskan dengan Kuda yang tersisa.', en: 'Finish it with the remaining knight.' },
      right: { id: 'Skakmat dengan tiga bidak ringan. Menteri yang tadi dikorbankan tak pernah dibutuhkan.', en: 'Checkmate with three minor pieces. The queen you gave away was never needed.' },
      wrong: { id: 'Lompatkan Kuda c3 ke petak yang menyerang e7.', en: 'Jump the c3 knight to the square that attacks e7.' },
    },
    {
      kind: 'quiz',
      text: { id: 'Bagaimana kalau lawan tidak serakah, dan memakan Kudamu di e5 dengan Pion?', en: 'What if your opponent is not greedy, and takes your knight on e5 with the pawn?' },
      options: [
        { id: 'Putih rugi satu Kuda', en: 'White is a knight down' },
        { id: 'Menteri putih memakan Gajah g4, dan Putih tetap untung satu Pion', en: 'The white queen takes the g4 bishop, and White stays a pawn up' },
      ],
      correct: 1,
      explain: { id: 'Gajah g4 kini tanpa pelindung, jadi Kuda ditukar Gajah plus satu Pion. Jebakan yang baik tetap untung walaupun lawan tidak masuk.', en: 'The g4 bishop is now unprotected, so it is a knight for a bishop plus a pawn. A good trap still pays when the opponent does not fall for it.' },
    },
  ],
};

export const matTercekik: Lesson = {
  id: 'k-tercekik',
  title: { id: 'Smothered Mate', en: 'Smothered Mate' },
  blurb: { id: 'Raja yang dikurung pasukannya sendiri.', en: 'A king imprisoned by his own army.' },
  scenes: [
    {
      kind: 'say',
      fen: '5rk1/5Npp/8/8/2Q5/8/6PP/6K1 w - - 0 1',
      marks: { f8: 'bad', g7: 'bad', h7: 'bad' },
      text: {
        id: 'Pola paling indah yang bisa dimainkan seekor Kuda. Raja hitam di g8 dikelilingi bidaknya sendiri. Rahasianya tiga langkah: double check, korban Menteri, lalu Kuda menutup.',
        en: 'The most beautiful pattern a knight can play. The black king on g8 is surrounded by his own pieces. The secret takes three moves: a double check, a queen sacrifice, then the knight closes the door.',
      },
    },
    {
      kind: 'move',
      fen: '5rk1/5Npp/8/8/2Q5/8/6PP/6K1 w - - 0 1',
      accept: ['f7h6'],
      hint: 'f7h6',
      reply: 'g8h8',
      text: { id: 'Double check: Kuda melompat dan membuka garis Menteri sekaligus.', en: 'Double check: the knight jumps and unveils the queen\'s line at the same time.' },
      right: { id: 'Kuda dan Menteri sama-sama memberi skak. Raja wajib melangkah, dan satu-satunya petak adalah sudut.', en: 'Knight and queen both give check. The king must move, and the only square is the corner.' },
      wrong: { id: 'Lompatkan Kuda ke h6: skak dari Kuda, dan skak dari Menteri c4 lewat garis serong.', en: 'Jump the knight to h6: check from the knight, and check from the c4 queen along the diagonal.' },
    },
    {
      kind: 'move',
      fen: '5r1k/6pp/7N/8/2Q5/8/6PP/6K1 w - - 2 2',
      accept: ['c4g8'],
      hint: 'c4g8',
      reply: 'f8g8',
      text: { id: 'Sekarang yang tak terpikirkan: tempatkan Menterimu tepat di sebelah Raja, di petak yang dijaga Benteng.', en: 'Now the unthinkable: put your queen right next to the king, on a square the rook guards.' },
      right: { id: 'Raja tidak boleh memakan, karena Kuda h6 menjaga g8. Benteng terpaksa memakan, dan dengan begitu menutup petak terakhir Rajanya sendiri.', en: 'The king may not take, because the h6 knight guards g8. The rook has to take, and in doing so it fills its own king\'s last square.' },
      wrong: { id: 'Menteri ke g8, skak.', en: 'Queen to g8, check.' },
    },
    {
      kind: 'move',
      fen: '6rk/6pp/7N/8/8/8/6PP/6K1 w - - 0 3',
      accept: ['h6f7'],
      hint: 'h6f7',
      mate: true,
      text: { id: 'Tutup pintunya.', en: 'Close the door.' },
      right: { id: 'Smothered mate. Raja tidak bisa bergerak karena semua petaknya diisi pasukannya sendiri.', en: 'Smothered mate. The king cannot move because every square around him is filled by his own army.' },
      wrong: { id: 'Kuda kembali ke f7.', en: 'The knight goes back to f7.' },
    },
    {
      kind: 'say',
      mood: 'happy',
      text: {
        id: 'Ingat bentuknya: Raja di sudut, Pion g dan h belum bergerak, Kuda lawan di dekatnya. Kalau Rajamu sendiri seperti itu, beri dia ruang dengan memajukan Pion h satu petak.',
        en: 'Remember the shape: king in the corner, g and h pawns unmoved, an enemy knight nearby. If your own king looks like that, give him air by pushing the h pawn one square.',
      },
    },
  ],
};

export const skakAbadi: Lesson = {
  id: 'k-abadi',
  title: { id: 'Perpetual Check', en: 'Perpetual Check' },
  blurb: { id: 'Menyelamatkan partai yang sudah kalah.', en: 'Saving a game that is already lost.' },
  scenes: [
    {
      kind: 'say',
      fen: '8/1p4pk/p7/8/8/8/1qr2PPP/3Q2K1 w - - 0 1',
      marks: { f2: 'danger' },
      text: {
        id: 'Kau tertinggal satu Benteng, dan Menteri serta Benteng hitam mengancam f2. Hampir semua langkah kalah. Tapi ada satu jalan keluar: skak terus-menerus, sampai posisinya berulang dan partai berakhir remis.',
        en: 'You are a rook down, and the black queen and rook are threatening f2. Almost every move loses. But there is one way out: check again and again, until the position repeats and the game is drawn.',
      },
    },
    {
      kind: 'move',
      fen: '8/1p4pk/p7/8/8/8/1qr2PPP/3Q2K1 w - - 0 1',
      accept: ['d1h5'],
      hint: 'd1h5',
      reply: 'h7g8',
      text: { id: 'Skak pertama. Cari skak yang membuat Raja hitam hanya punya satu petak.', en: 'The first check. Find the one that leaves the black king a single square.' },
      right: { id: 'Raja hanya bisa ke g8.', en: 'The king can only go to g8.' },
      wrong: { id: 'Menteri ke h5, skak di garis h.', en: 'Queen to h5, check along the h file.' },
      punish: {
        d1d3: { id: 'Skak memang, tapi Pion g bisa menghalanginya, dan skakmu habis. Cari skak yang tidak bisa dihalangi.', en: 'It is check, but the g pawn can block it and your checks run out. Find a check that cannot be blocked.' },
      },
    },
    {
      kind: 'move',
      fen: '6k1/1p4p1/p7/7Q/8/8/1qr2PPP/6K1 w - - 2 2',
      accept: ['h5e8'],
      hint: 'h5e8',
      reply: 'g8h7',
      text: { id: 'Skak lagi, dari baris terakhir.', en: 'Check again, from the back row.' },
      right: { id: 'Raja kembali ke h7, dan kau bisa skak di h5 lagi. Selamanya.', en: 'The king goes back to h7, and you can check on h5 again. Forever.' },
      wrong: { id: 'Menteri ke e8, skak di baris 8.', en: 'Queen to e8, check along row 8.' },
    },
    {
      kind: 'quiz',
      text: { id: 'Posisi yang sama terulang tiga kali. Apa hasilnya?', en: 'The same position occurs three times. What is the result?' },
      options: [
        { id: 'Hitam menang, karena unggul materi', en: 'Black wins, being ahead in material' },
        { id: 'Remis', en: 'A draw' },
      ],
      correct: 1,
      explain: { id: 'Remis, sebanyak apa pun keunggulan lawan. Saat kalah, jangan menyerah: cari skak yang tidak bisa dihalangi, terutama saat Raja lawan tidak punya Pion pelindung.', en: 'A draw, however far ahead your opponent is. When losing, do not resign: look for checks that cannot be blocked, especially when the enemy king has lost its pawn cover.' },
    },
  ],
};

export const kapanTukar: Lesson = {
  id: 'k-tukar',
  title: { id: 'Kapan Bertukar', en: 'When to Trade' },
  blurb: { id: 'Aturan sederhana saat unggul dan saat tertinggal.', en: 'A simple rule for when you are ahead or behind.' },
  scenes: [
    {
      kind: 'say',
      text: {
        id: 'Satu aturan yang langsung bisa kau pakai di partai berikutnya. Saat unggul materi, tukarlah bidak. Saat tertinggal, hindari tukar dan buat posisinya rumit.',
        en: 'One rule you can use in your very next game. When you are ahead in material, trade pieces. When you are behind, avoid trades and keep the position complicated.',
      },
    },
    {
      kind: 'quiz',
      text: { id: 'Kau unggul satu Benteng. Lawan menawarkan tukar Menteri. Terima?', en: 'You are a rook up. Your opponent offers a queen trade. Accept?' },
      options: [
        { id: 'Terima', en: 'Accept' },
        { id: 'Tolak', en: 'Decline' },
      ],
      correct: 0,
      explain: { id: 'Lima poin di antara tiga puluh bidak itu kecil, di antara sepuluh bidak itu besar. Makin sedikit bidak, makin terasa keunggulanmu, dan makin sedikit peluang lawan untuk menyerang.', en: 'Five points among thirty pieces is small; among ten it is huge. The fewer pieces left, the more your advantage tells, and the fewer chances your opponent has to attack.' },
    },
    {
      kind: 'quiz',
      text: { id: 'Kau tertinggal satu Kuda. Rencana yang paling baik?', en: 'You are a knight down. What is the best plan?' },
      options: [
        { id: 'Tukar semua bidak secepatnya', en: 'Trade every piece as fast as possible' },
        { id: 'Pertahankan bidak, cari serangan dan posisi yang rumit', en: 'Keep pieces on, look for attacks and complications' },
        { id: 'Menyerah', en: 'Resign' },
      ],
      correct: 1,
      explain: { id: 'Tiap tukar memperbesar arti keunggulan lawan. Dengan banyak bidak di papan, lawan masih bisa salah hitung. Di tingkat ini, banyak partai yang kalah berubah jadi menang karena satu blunder lawan.', en: 'Every trade magnifies your opponent\'s advantage. With many pieces on the board they can still miscalculate. At this level, many lost games turn into wins after a single enemy blunder.' },
    },
    {
      kind: 'quiz',
      text: { id: 'Kau unggul. Mana yang lebih baik untuk ditukar?', en: 'You are ahead. Which is better to trade?' },
      options: [
        { id: 'Bidak', en: 'Pieces' },
        { id: 'Pion', en: 'Pawns' },
      ],
      correct: 0,
      explain: { id: 'Tukar bidak, simpan Pion. Di endgame, Pion yang tersisa itulah yang naik pangkat menjadi Menteri. Pihak yang tertinggal justru ingin Pion habis, karena tanpa Pion banyak endgame berakhir remis.', en: 'Trade pieces, keep pawns. In the endgame those remaining pawns are what promote to queens. The side that is behind wants the pawns gone, because without pawns many endgames are drawn.' },
    },
  ],
};

export const rajaAktif: Lesson = {
  id: 'k-raja',
  title: { id: 'Raja yang Bangun', en: 'The King Wakes Up' },
  blurb: { id: 'Di endgame, Raja adalah petarung.', en: 'In the endgame, the king is a fighter.' },
  scenes: [
    {
      kind: 'say',
      text: {
        id: 'Sepanjang pembukaan dan babak tengah, Raja bersembunyi di balik Pion. Tapi begitu Menteri sudah ditukar dan bidak tinggal sedikit, ancaman skakmat hilang. Saat itu Raja berubah menjadi bidak yang kuat, bernilai sekitar empat poin.',
        en: 'Through the opening and middlegame the king hides behind his pawns. But once the queens are off and few pieces remain, the danger of mate is gone. From that moment the king becomes a strong piece, worth about four points.',
      },
    },
    {
      kind: 'quiz',
      fen: '6k1/5ppp/8/8/8/8/5PPP/6K1 w - - 0 1',
      text: { id: 'Tinggal Raja dan Pion. Apa langkah pertama yang paling baik untuk Putih?', en: 'Only kings and pawns are left. What is White\'s best first step?' },
      options: [
        { id: 'Majukan Pion h, mencari ruang', en: 'Push the h pawn for some room' },
        { id: 'Bawa Raja ke tengah, ke f1 lalu e2', en: 'Bring the king to the centre, via f1 and e2' },
        { id: 'Tunggu sampai lawan melangkah lebih dulu', en: 'Wait for the opponent to move first' },
      ],
      correct: 1,
      explain: { id: 'Dari tengah, Raja bisa pergi ke sisi mana pun yang membutuhkannya. Raja yang lebih dulu sampai ke tengah sering memenangkan endgame Pion.', en: 'From the centre the king can go to whichever side needs it. The king that reaches the centre first often wins the pawn endgame.' },
    },
    {
      kind: 'say',
      mood: 'happy',
      text: {
        id: 'Jadi, begitu Menteri ditukar, ucapkan dalam hati: "Raja, bangun." Bawa dia ke tengah sebelum lawan melakukannya.',
        en: 'So the moment the queens come off, say it to yourself: "King, wake up." Bring him to the centre before your opponent does.',
      },
    },
  ],
};

export const KIAT: Lesson[] = [cekKilat, matKilat, jebakanLegal, matTercekik, skakAbadi, kapanTukar, rajaAktif];
