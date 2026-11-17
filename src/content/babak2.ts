import type { Lesson, SceneMark } from './lessons';

/** Chapter 2 (Senjata): the basic tactical weapons, and pawn endgames. */

export const garpu: Lesson = {
  id: 'b2-1',
  title: { id: 'Garpu', en: 'Forks' },
  blurb: { id: 'Satu bidak, dua sasaran.', en: 'One piece, two targets.' },
  scenes: [
    {
      kind: 'say',
      text: {
        id: 'Selamat datang di Babak Senjata. Mata Ksatria mengajarimu melihat. Sekarang kau belajar memukul. Senjata pertama bernama garpu: satu bidak menyerang dua sasaran sekaligus, dan lawan hanya sempat menyelamatkan satu.',
        en: 'Welcome to the chapter of Weapons. The Warrior\'s Eye taught you to see. Now you learn to strike. The first weapon is the fork: one piece attacks two targets at once, and your opponent has time to save only one.',
      },
    },
    {
      kind: 'say',
      fen: 'r3k3/2N5/8/8/8/8/8/4K3 b - - 0 1',
      orient: 'w',
      marks: { c7: 'good', a8: 'target', e8: 'target' },
      text: {
        id: 'Lihat Kuda di c7. Ia menyerang Raja di e8 dan Benteng di a8 sekaligus. Raja wajib lolos dari skak, jadi Benteng tertinggal. Kuda adalah pemegang garpu terbaik, karena lompatannya tidak bisa dihalangi.',
        en: 'Look at the knight on c7. It attacks the king on e8 and the rook on a8 together. The king must answer the check, so the rook is left behind. The knight is the best forker of all, because its jump cannot be blocked.',
      },
    },
    {
      kind: 'move',
      fen: 'r3k2r/ppp2ppp/5n2/3N4/8/8/PPP2PPP/R3K2R w KQkq - 0 1',
      accept: ['d5c7'],
      hint: 'd5c7',
      reply: 'e8d7',
      text: { id: 'Kudamu bisa memakan Kuda di f6, tapi itu hanya tukar impas. Cari garpu.', en: 'Your knight could take the knight on f6, but that is only an even trade. Look for a fork.' },
      right: { id: 'Skak! Raja harus menyingkir, dan Benteng di a8 tidak bisa ikut.', en: 'Check! The king must step aside, and the rook on a8 cannot come along.' },
      wrong: { id: 'Cari petak tempat Kuda memberi skak sambil membidik Benteng a8.', en: 'Find the square where the knight gives check while aiming at the rook on a8.' },
      punish: {
        d5f6: { id: 'Kuda ditukar Kuda, impas. Ada yang jauh lebih baik: skak yang sekaligus membidik Benteng.', en: 'Knight for knight, an even trade. There is far better: a check that also aims at a rook.' },
      },
    },
    {
      kind: 'move',
      fen: 'r6r/ppNk1ppp/5n2/8/8/8/PPP2PPP/R3K2R w KQ - 1 2',
      accept: ['c7a8'],
      hint: 'c7a8',
      text: { id: 'Raja sudah menyingkir. Ambil hadiahmu.', en: 'The king has stepped aside. Collect your prize.' },
      right: { id: 'Benteng dan satu Pion untukmu. Kalaupun Kudamu nanti tertangkap di sudut, kau tetap untung tiga poin.', en: 'A rook and a pawn for you. Even if your knight is later caught in the corner, you are still three points up.' },
      wrong: { id: 'Benteng di a8 sudah menunggu.', en: 'The rook on a8 is waiting.' },
    },
    {
      kind: 'move',
      fen: '6k1/3q1p1p/6p1/3N4/8/8/5PPP/6K1 w - - 0 1',
      accept: ['d5f6'],
      hint: 'd5f6',
      reply: 'g8g7',
      text: { id: 'Kau tertinggal jauh: Kuda melawan Menteri. Tapi Raja dan Menteri hitam berdiri dalam jangkauan satu lompatan. Temukan garpunya.', en: 'You are far behind: a knight against a queen. But the black king and queen both stand within one jump. Find the fork.' },
      right: { id: 'Garpu Raja dan Menteri, hadiah terbesar bagi seekor Kuda. Pada langkah berikutnya Menteri itu milikmu.', en: 'A fork of king and queen, the greatest prize a knight can win. On the next move that queen is yours.' },
      wrong: { id: 'Cari petak tempat Kuda memberi skak sekaligus membidik Menteri d7.', en: 'Find the square where the knight gives check and aims at the queen on d7.' },
    },
    {
      kind: 'move',
      fen: 'r4rk1/ppp2ppp/2n1b3/8/3PP3/5N2/PP3PPP/R1B2RK1 w - - 0 1',
      accept: ['d4d5'],
      hint: 'd4d5',
      marks: { c6: 'target', e6: 'target' },
      text: { id: 'Garpu termurah dipegang Pion. Kuda di c6 dan Gajah di e6 berdiri dengan satu petak di antaranya. Tusuk tepat di tengah.', en: 'The cheapest fork belongs to the pawn. The knight on c6 and the bishop on e6 stand with one square between them. Stab right into the middle.' },
      right: { id: 'Pion bernilai 1 menyerang dua bidak bernilai 3. Salah satunya pasti jatuh, dan Pion e4 menjaga temannya.', en: 'A pawn worth 1 attacks two pieces worth 3. One of them must fall, and the e4 pawn guards its friend.' },
      wrong: { id: 'Majukan Pion ke petak yang menyerang c6 dan e6 sekaligus.', en: 'Push a pawn to the square that attacks both c6 and e6.' },
    },
    {
      kind: 'move',
      fen: 'r4rk1/ppp1q1pp/8/b7/8/5N2/PPP2PPP/R2Q1RK1 w - - 0 1',
      accept: ['d1d5'],
      hint: 'd1d5',
      reply: 'g8h8',
      marks: { a5: 'target' },
      text: { id: 'Menteri memegang garpu jarak jauh. Gajah hitam di a5 tidak dijaga, dan Raja hitam berdiri di garis serong yang terbuka. Satu langkah Menteri menyerang keduanya.', en: 'The queen forks from a distance. The black bishop on a5 is unguarded, and the black king stands on an open diagonal. One queen move attacks both.' },
      right: { id: 'Skak, dan Gajah a5 ikut terbidik. Setelah Raja menyingkir, Gajah itu gratis.', en: 'Check, with the bishop on a5 in your sights as well. Once the king steps aside, that bishop is free.' },
      wrong: { id: 'Cari skak yang juga membidik Gajah a5.', en: 'Find a check that also aims at the bishop on a5.' },
    },
    {
      kind: 'tap',
      fen: 'r1bqkb1r/ppp2ppp/3p1n2/4p3/1n2P3/2N2N2/PPPBQPPP/R3KB1R w KQkq - 0 1',
      answers: ['c2'],
      text: { id: 'Senjata ini juga dipegang lawan. Kuda hitam di b4 mengincar satu petak untuk garpu Raja dan Benteng. Ketuk petak itu.', en: 'Your opponent carries this weapon too. The black knight on b4 has its eye on one square to fork king and rook. Tap that square.' },
      right: { id: 'Kuda memakan Pion c2 dengan skak, lalu Benteng a1 hilang. Tak satu pun bidakmu menjaga c2, karena Gajah d2 menghalangi Menterimu.', en: 'The knight takes the pawn on c2 with check, then the rook on a1 is lost. Not one of your pieces guards c2, because the bishop on d2 blocks your queen.' },
      wrong: { id: 'Dari b4, Kuda bisa melompat ke petak yang menyerang e1 dan a1 sekaligus.', en: 'From b4 the knight can jump to a square that attacks both e1 and a1.' },
    },
    {
      kind: 'quiz',
      fen: 'r1bqkb1r/ppp2ppp/3p1n2/4p3/1n2P3/2N2N2/PPPBQPPP/R3KB1R w KQkq - 0 1',
      marks: { c2: 'danger' },
      text: { id: 'Bagaimana cara terbaik menangkisnya?', en: 'What is the best way to meet it?' },
      options: [
        { id: 'Pion ke a3, mengusir Kuda', en: 'Pawn to a3, chasing the knight' },
        { id: 'Rokade panjang, supaya Raja menjaga c2', en: 'Castle long, so the king guards c2' },
        { id: 'Pion ke h3, menunggu', en: 'Pawn to h3, waiting' },
      ],
      correct: 1,
      explain: {
        id: 'Setelah a3, Kuda tetap melompat ke c2 dengan skak. Rokade panjang membawa Raja ke c1, tepat di sebelah c2, dan sekaligus membangunkan Benteng. Sebelum melangkah, selalu tanya: ke mana Kuda lawan bisa melompat?',
        en: 'After a3 the knight jumps to c2 with check anyway. Castling long brings the king to c1, right beside c2, and wakes a rook as well. Before you move, always ask: where can the enemy knight jump?',
      },
    },
    {
      kind: 'say',
      mood: 'happy',
      text: {
        id: 'Garpu lahir dari bidak yang tidak dijaga dan Raja yang terbuka. Di tiap giliran, periksa dulu semua skak dan semua lompatan Kuda, milikmu dan milik lawan.',
        en: 'Forks are born from unguarded pieces and an exposed king. On every turn, first look at every check and every knight jump, yours and your opponent\'s.',
      },
    },
  ],
};

export const paku: Lesson = {
  id: 'b2-2',
  title: { id: 'Pin dan Tusuk', en: 'Pins and Skewers' },
  blurb: { id: 'Bidak yang berdiri segaris adalah sasaran.', en: 'Pieces standing in a line are targets.' },
  scenes: [
    {
      kind: 'say',
      text: {
        id: 'Senjata kedua tidak memukul, ia memaku. Para pecatur menyebutnya pin. Bidak yang terpaku tidak bisa pergi, karena di belakangnya berdiri sesuatu yang lebih berharga.',
        en: 'The second weapon does not strike, it nails down. Chess players call it a pin. A pinned piece cannot leave, because something more valuable stands behind it.',
      },
    },
    {
      kind: 'say',
      fen: '4k3/8/2n5/1B6/8/8/8/4K3 b - - 0 1',
      orient: 'w',
      marks: { b5: 'good', c6: 'target', e8: 'danger' },
      text: {
        id: 'Gajah di b5, Kuda di c6, Raja di e8: satu garis. Kalau Kuda melangkah, Rajanya sendiri terkena skak, maka aturan melarangnya. Ini pin mutlak. Hanya bidak garis yang bisa memaku: Gajah, Benteng, dan Menteri.',
        en: 'Bishop on b5, knight on c6, king on e8: one line. If the knight moved, its own king would be in check, so the rules forbid it. This is an absolute pin. Only line pieces can pin: bishop, rook and queen.',
      },
    },
    {
      kind: 'quiz',
      fen: 'rnbqkb1r/ppp2ppp/4pn2/3p2B1/3P4/2N5/PPP1PPPP/R2QKB1R b KQkq - 0 1',
      orient: 'w',
      marks: { g5: 'good', f6: 'target', d8: 'danger' },
      text: { id: 'Di sini Kuda f6 dipaku ke Menteri, bukan ke Raja. Bolehkah Kuda itu melangkah?', en: 'Here the knight on f6 is pinned to the queen, not the king. May that knight move?' },
      options: [
        { id: 'Tidak boleh, langkahnya terlarang', en: 'No, the move is illegal' },
        { id: 'Boleh, tapi Menterinya akan dimakan', en: 'Yes, but the queen will be taken' },
      ],
      correct: 1,
      explain: { id: 'Ini pin nisbi. Aturan mengizinkan, tapi harganya sembilan poin. Bidak yang terpaku ke Menteri hampir sama lumpuhnya.', en: 'This is a relative pin. The rules allow it, but the price is nine points. A piece pinned to its queen is very nearly as helpless.' },
    },
    {
      kind: 'move',
      fen: '4k3/ppp2ppp/2q5/8/8/2N5/PPP2PPP/4KB2 w - - 0 1',
      accept: ['f1b5'],
      hint: 'f1b5',
      reply: 'c6b5',
      text: { id: 'Pin yang paling menguntungkan memaku bidak mahal dengan bidak murah. Menteri dan Raja hitam berdiri di satu garis serong. Paku Menteri itu.', en: 'The most profitable pin nails an expensive piece with a cheap one. The black queen and king stand on one diagonal. Pin that queen.' },
      right: { id: 'Menteri tidak bisa keluar dari garisnya. Ia hanya bisa memakan Gajahmu, lalu Kudamu memakan balik: Menteri ditukar Gajah.', en: 'The queen cannot leave the line. All she can do is take your bishop, and your knight takes back: a queen for a bishop.' },
      wrong: { id: 'Tempatkan Gajah di garis antara Menteri c6 dan Raja e8, di petak yang dijaga Kudamu.', en: 'Put the bishop on the line running through the queen on c6 to the king on e8, on a square your knight guards.' },
    },
    {
      kind: 'move',
      fen: 'r3k3/ppp2ppp/3p4/4n3/8/3B4/PPP2PPP/4R1K1 w - - 0 1',
      accept: ['f2f4'],
      hint: 'f2f4',
      marks: { e1: 'good', e5: 'target', e8: 'danger' },
      text: { id: 'Bidak yang terpaku adalah sasaran empuk, karena ia tidak bisa lari. Kuda e5 dipaku Bentengmu ke Raja. Serang dia dengan bidak termurah yang kau punya.', en: 'A pinned piece is an easy target, because it cannot run. The knight on e5 is pinned to the king by your rook. Attack it with the cheapest piece you have.' },
      right: { id: 'Kuda itu dijaga Pion d6, tapi itu tidak menolong: Pionmu memakan Kuda, dan kalaupun dimakan balik kau untung dua poin. Perhatikan juga bahwa Kuda itu tampak mengancam Gajahmu, tapi ancaman bidak yang terpaku itu palsu.', en: 'The knight is guarded by the d6 pawn, but that does not help: your pawn takes the knight, and even if it is taken back you are two points up. Notice too that the knight seems to threaten your bishop, but the threats of a pinned piece are empty.' },
      wrong: { id: 'Majukan Pion yang bisa menyerang Kuda e5.', en: 'Push the pawn that can attack the knight on e5.' },
    },
    {
      kind: 'tap',
      fen: 'r2qkb1r/ppp2ppp/2np1n2/1B2p3/4P1b1/2NP1N2/PPP2PPP/R1BQK2R w KQkq - 0 1',
      answers: ['c6'],
      text: { id: 'Sekarang di medan yang ramai. Ketuk bidak HITAM yang terpaku.', en: 'Now on a crowded field. Tap the BLACK piece that is pinned.' },
      right: { id: 'Kuda c6 dipaku Gajah b5 ke Raja. Ia tidak boleh melangkah sama sekali.', en: 'The knight on c6 is pinned to the king by the bishop on b5. It may not move at all.' },
      wrong: { id: 'Cari bidak hitam yang berdiri segaris di antara bidak garismu dan Rajanya.', en: 'Look for a black piece standing in line between one of your line pieces and its king.' },
    },
    {
      kind: 'tap',
      fen: 'r2qkb1r/ppp2ppp/2np1n2/1B2p3/4P1b1/2NP1N2/PPP2PPP/R1BQK2R w KQkq - 0 1',
      answers: ['f3'],
      text: { id: 'Dan bidak PUTIH yang terpaku?', en: 'And the WHITE piece that is pinned?' },
      right: { id: 'Kuda f3 dipaku Gajah g4 ke Menterimu. Kalau Kuda itu pergi, Menteri d1 dimakan.', en: 'The knight on f3 is pinned to your queen by the bishop on g4. If that knight leaves, the queen on d1 is taken.' },
      wrong: { id: 'Cari bidak putih yang berdiri di antara bidak garis hitam dan Menterimu.', en: 'Look for a white piece standing between a black line piece and your queen.' },
    },
    {
      kind: 'say',
      text: {
        id: 'Tusuk adalah pin yang dibalik: bidak yang lebih berharga berdiri di depan. Ia terpaksa menyingkir, dan yang di belakangnya jatuh.',
        en: 'A skewer is a pin turned around: the more valuable piece stands in front. It is forced to step aside, and the one behind it falls.',
      },
    },
    {
      kind: 'move',
      fen: '3q4/pp4pp/8/3k4/8/8/PP4PP/R5K1 w - - 0 1',
      accept: ['a1d1'],
      hint: 'a1d1',
      reply: 'd5e6',
      text: { id: 'Raja hitam berjalan-jalan di tengah papan, dan Menterinya berdiri tepat di belakangnya. Tusuk.', en: 'The black king is strolling in the middle of the board, and his queen stands right behind him. Skewer them.' },
      right: { id: 'Skak! Raja terpaksa keluar dari garis d, dan Menteri di belakangnya tak terlindung.', en: 'Check! The king is forced off the d file, and the queen behind him is left bare.' },
      wrong: { id: 'Beri skak dengan Benteng di garis d.', en: 'Give check with the rook on the d file.' },
    },
    {
      kind: 'move',
      fen: '7r/pp6/8/4k3/8/8/6PP/2B3K1 w - - 0 1',
      accept: ['c1b2'],
      hint: 'c1b2',
      reply: 'e5e6',
      text: { id: 'Gajah juga bisa menusuk. Raja di e5 dan Benteng di h8 berdiri di satu garis serong.', en: 'A bishop can skewer too. The king on e5 and the rook on h8 stand on one diagonal.' },
      right: { id: 'Raja menyingkir, Benteng di sudut jatuh. Tiga poin menangkap lima.', en: 'The king steps aside and the rook in the corner falls. Three points catch five.' },
      wrong: { id: 'Cari skak Gajah di garis serong panjang, dari a1 ke h8.', en: 'Look for a bishop check on the long diagonal, from a1 to h8.' },
    },
    {
      kind: 'say',
      mood: 'happy',
      text: {
        id: 'Pin melumpuhkan, tusuk memaksa. Keduanya lahir dari bidak yang berdiri segaris. Sebelum melangkah, lihat garis-garis menuju Raja dan Menterimu: adakah bidakmu yang berbaris di sana?',
        en: 'A pin paralyses, a skewer forces. Both are born from pieces standing in a line. Before you move, look along the lines to your king and queen: are any of your pieces lined up there?',
      },
    },
  ],
};

export const terbuka: Lesson = {
  id: 'b2-3',
  title: { id: 'Serangan Terbuka', en: 'Discovered Attacks' },
  blurb: { id: 'Satu bidak menyingkir, yang di belakangnya menyerang.', en: 'One piece steps aside, the one behind it attacks.' },
  scenes: [
    {
      kind: 'say',
      text: {
        id: 'Senjata ketiga adalah yang paling licik. Satu bidak menyingkir, dan bidak di belakangnya ternyata sudah membidik. Seperti dalang di balik kelir: yang berbahaya bukan tangan yang kau lihat bergerak.',
        en: 'The third weapon is the slyest. One piece steps aside, and the piece behind it turns out to have been aiming all along. Like the puppeteer behind the screen: the danger is not the hand you see moving.',
      },
    },
    {
      kind: 'say',
      fen: '4k3/ppq2ppp/8/8/8/4N3/PPP2PPP/4R1K1 w - - 0 1',
      marks: { e1: 'good', e8: 'danger' },
      text: {
        id: 'Benteng e1 membidik Raja e8, tapi Kudamu sendiri menghalangi. Begitu Kuda melompat, Benteng memberi skak. Itu skak terbuka. Dan Kuda bebas melompat ke mana saja, sebab lawan sibuk mengurus skak.',
        en: 'The rook on e1 aims at the king on e8, but your own knight is in the way. The moment the knight jumps, the rook gives check. That is a discovered check. And the knight may jump anywhere it likes, because your opponent is busy with the check.',
      },
    },
    {
      kind: 'move',
      fen: '4k3/ppq2ppp/8/8/8/4N3/PPP2PPP/4R1K1 w - - 0 1',
      accept: ['e3d5'],
      hint: 'e3d5',
      reply: 'e8d8',
      text: { id: 'Lompatkan Kuda ke petak yang menyerang Menteri.', en: 'Jump the knight to a square that attacks the queen.' },
      right: { id: 'Skak dari Benteng, ancaman dari Kuda. Lawan punya satu langkah untuk dua masalah, dan Menterinya jatuh.', en: 'Check from the rook, a threat from the knight. Your opponent has one move for two problems, and the queen falls.' },
      wrong: { id: 'Ke mana pun Kuda melompat, Benteng memberi skak. Pilih petak yang juga menyerang Menteri c7.', en: 'Wherever the knight jumps, the rook gives check. Choose the square that also attacks the queen on c7.' },
      punish: {
        e3f5: { id: 'Skaknya dapat, tapi dari f5 Kuda tidak mengancam apa-apa. Cari petak yang menyerang Menteri.', en: 'You get the check, but from f5 the knight threatens nothing. Find the square that attacks the queen.' },
      },
    },
    {
      kind: 'move',
      fen: '3q2k1/pp3ppp/8/8/8/3B4/PP3PPP/3R2K1 w - - 0 1',
      accept: ['d3h7'],
      hint: 'd3h7',
      reply: 'g8h7',
      marks: { d1: 'good', d8: 'target' },
      text: { id: 'Sekarang terbalik: yang menyingkir memberi skak, yang di belakang membidik Menteri. Bentengmu menatap Menteri d8, terhalang Gajahmu sendiri. Singkirkan Gajah dengan cara yang tidak bisa diabaikan.', en: 'Now the other way round: the piece that leaves gives the check, and the one behind aims at the queen. Your rook stares at the queen on d8, blocked by your own bishop. Move the bishop away in a manner that cannot be ignored.' },
      right: { id: 'Raja harus memakan Gajah, lalu Bentengmu memakan Menteri. Gajah ditukar Menteri.', en: 'The king has to take the bishop, then your rook takes the queen. A bishop for a queen.' },
      wrong: { id: 'Gajah harus pergi sambil memberi skak, supaya lawan tak sempat menyelamatkan Menterinya.', en: 'The bishop must leave with check, so your opponent has no time to save the queen.' },
      punish: {
        d3c4: { id: 'Lawan tidak diskak, jadi ia bebas. Menterinya memakan Bentengmu di d1 dengan skak.', en: 'Your opponent is not in check and so is free to act. The queen takes your rook on d1 with check.' },
      },
    },
    {
      kind: 'move',
      fen: 'r1bqkb1r/pppp1ppp/8/8/4N3/8/PPPP1PPP/R1BQR1K1 w kq - 0 1',
      accept: ['e4d6', 'e4f6'],
      hint: 'e4d6',
      mate: true,
      text: {
        id: 'Yang paling dahsyat: skak ganda. Bidak yang menyingkir ikut memberi skak, jadi Raja diserang dari dua arah. Dua penyerang tidak bisa dimakan atau dihalangi sekaligus, maka Raja wajib melangkah. Di sini Raja hitam tidak punya petak. Tuntaskan.',
        en: 'The most terrible of all: double check. The piece that leaves gives check as well, so the king is attacked from two sides. Two attackers cannot both be taken or blocked, so the king has to move. Here the black king has no square. Finish it.',
      },
      right: { id: 'Skakmat. Kudamu sebenarnya bisa dimakan, tapi itu tidak menghentikan skak dari Benteng. Dalam skak ganda, hanya Raja yang boleh bergerak.', en: 'Checkmate. Your knight could in fact be taken, but that would not stop the check from the rook. In a double check, only the king may move.' },
      wrong: { id: 'Lompatkan Kuda ke petak yang menyerang Raja e8. Benteng di belakangnya ikut memberi skak.', en: 'Jump the knight to a square that attacks the king on e8. The rook behind it gives check too.' },
    },
    {
      kind: 'quiz',
      text: { id: 'Rajamu terkena skak ganda. Apa yang bisa kau lakukan?', en: 'Your king is in double check. What can you do?' },
      options: [
        { id: 'Memakan salah satu penyerang', en: 'Take one of the attackers' },
        { id: 'Menghalangi salah satu garis', en: 'Block one of the lines' },
        { id: 'Melangkahkan Raja', en: 'Move the king' },
      ],
      correct: 2,
      explain: { id: 'Memakan atau menghalangi satu penyerang masih menyisakan penyerang kedua. Hanya langkah Raja yang menjawab keduanya.', en: 'Taking or blocking one attacker still leaves the second. Only a king move answers both.' },
    },
    {
      kind: 'tap',
      fen: 'r1bqr1k1/ppp2ppp/2nb4/3p4/3Pn3/2N2N2/PPP2PPP/R1BQKB1R w KQ - 0 1',
      answers: ['e4'],
      text: { id: 'Lawan juga memegang senjata ini. Rajamu masih di e1, dan Benteng hitam di e8 menatap garis yang sama. Ketuk bidak hitam yang, kalau melompat, membuka skak.', en: 'Your opponent holds this weapon too. Your king is still on e1, and the black rook on e8 stares down the same file. Tap the black piece that would unveil a check by jumping.' },
      right: { id: 'Kuda e4. Kalau ia memakan Kuda c3, Benteng memberi skak, dan pada langkah berikutnya Kuda itu memakan Menterimu.', en: 'The knight on e4. If it takes the knight on c3, the rook gives check, and on the next move that knight takes your queen.' },
      wrong: { id: 'Cari bidak hitam yang berdiri di garis e, di antara Benteng hitam dan Rajamu.', en: 'Look for the black piece standing on the e file, between the black rook and your king.' },
    },
    {
      kind: 'quiz',
      fen: 'r1bqr1k1/ppp2ppp/2nb4/3p4/3Pn3/2N2N2/PPP2PPP/R1BQKB1R w KQ - 0 1',
      marks: { e4: 'danger', e8: 'bad' },
      text: { id: 'Apa langkah paling sehat untuk Putih?', en: 'What is the healthiest move for White?' },
      options: [
        { id: 'Gajah ke e2, menutup garis e dan bersiap rokade', en: 'Bishop to e2, closing the e file and preparing to castle' },
        { id: 'Pion ke a3, mencegah Gajah hitam ke b4', en: 'Pawn to a3, keeping the black bishop out of b4' },
        { id: 'Pion ke h3, memberi Raja ruang', en: 'Pawn to h3, giving the king some air' },
      ],
      correct: 0,
      explain: { id: 'Selama Rajamu segaris dengan Benteng lawan, tiap lompatan Kuda itu adalah skak. Tutup garisnya atau keluarkan Raja dari sana sebelum melakukan hal lain.', en: 'As long as your king shares a file with the enemy rook, every jump of that knight is a check. Close the file or take the king off it before you do anything else.' },
    },
    {
      kind: 'say',
      mood: 'happy',
      text: {
        id: 'Serangan terbuka lahir saat dua bidak berdiri segaris dengan sebuah sasaran. Cari barisan seperti itu di tiap posisi. Kalau milikmu, pakailah. Kalau milik lawan, bubarkan.',
        en: 'A discovered attack is born when two pieces stand in line with a target. Look for such a line in every position. If it is yours, use it. If it is your opponent\'s, break it up.',
      },
    },
  ],
};

export const penjaga: Lesson = {
  id: 'b2-4',
  title: { id: 'Menyingkirkan Penjaga', en: 'Removing the Guard' },
  blurb: { id: 'Bidak yang dijaga hanya aman selama penjaganya ada.', en: 'A guarded piece is safe only while its guard remains.' },
  scenes: [
    {
      kind: 'say',
      text: {
        id: 'Di Babak Mata Ksatria kau belajar menghitung penjaga. Sekarang kau belajar menyingkirkannya. Ada tiga cara: makan penjaganya, usir penjaganya, atau beri dia tugas terlalu banyak.',
        en: 'In The Warrior\'s Eye you learned to count the guards. Now you learn to remove them. There are three ways: take the guard, chase the guard away, or give it too many jobs.',
      },
    },
    {
      kind: 'tap',
      fen: 'r5k1/ppp2ppp/5n2/3b2B1/8/8/PPP2PPP/3R1BK1 w - - 0 1',
      answers: ['f6'],
      marks: { d5: 'target' },
      text: { id: 'Bentengmu membidik Gajah d5, tapi Gajah itu dijaga. Ketuk penjaganya.', en: 'Your rook aims at the bishop on d5, but that bishop is guarded. Tap its guard.' },
      right: { id: 'Kuda f6 satu-satunya penjaga. Kalau Benteng memakan Gajah sekarang, Kuda memakan balik dan kau rugi.', en: 'The knight on f6 is the only guard. If the rook took the bishop now, the knight would take back and you would lose out.' },
      wrong: { id: 'Cari bidak hitam yang bisa memakan balik di d5.', en: 'Look for the black piece that could take back on d5.' },
    },
    {
      kind: 'move',
      fen: 'r5k1/ppp2ppp/5n2/3b2B1/8/8/PPP2PPP/3R1BK1 w - - 0 1',
      accept: ['g5f6'],
      hint: 'g5f6',
      reply: 'g7f6',
      text: { id: 'Cara pertama: makan penjaganya.', en: 'The first way: take the guard.' },
      right: { id: 'Penjaga sudah tiada. Pion memakan balik Gajahmu, tapi sekarang Gajah d5 berdiri sendirian.', en: 'The guard is gone. A pawn takes your bishop back, but now the bishop on d5 stands alone.' },
      wrong: { id: 'Gajahmu di g5 sudah membidik si penjaga.', en: 'Your bishop on g5 is already aiming at the guard.' },
      punish: {
        d1d5: { id: 'Terburu-buru. Kuda f6 memakan balik, dan Bentengmu tertukar dengan Gajah.', en: 'Too hasty. The knight on f6 takes back, and you have swapped a rook for a bishop.' },
      },
    },
    {
      kind: 'move',
      fen: 'r5k1/ppp2p1p/5p2/3b4/8/8/PPP2PPP/3R1BK1 w - - 0 2',
      accept: ['d1d5'],
      hint: 'd1d5',
      text: { id: 'Sekarang ambil yang ditinggalkan.', en: 'Now take what was left behind.' },
      right: { id: 'Hitung hasilnya: kau memberi satu Gajah, mendapat Kuda dan Gajah. Untung satu bidak penuh.', en: 'Count it up: you gave one bishop and got a knight and a bishop. A whole piece ahead.' },
      wrong: { id: 'Gajah d5 kini tanpa penjaga.', en: 'The bishop on d5 has no guard now.' },
    },
    {
      kind: 'move',
      fen: '6k1/ppp2ppp/2n5/8/PP1n4/8/5PPP/3R3K w - - 0 1',
      accept: ['b4b5'],
      hint: 'b4b5',
      marks: { d4: 'target' },
      text: { id: 'Cara kedua: usir penjaganya. Kuda d4 dijaga Kuda c6, dan Bentengmu sudah membidik. Paksa si penjaga pergi dengan bidak termurah.', en: 'The second way: chase the guard away. The knight on d4 is guarded by the knight on c6, and your rook is already aiming. Force the guard to leave with your cheapest piece.' },
      right: { id: 'Kuda c6 terancam Pion. Kalau ia pergi, Kuda d4 jatuh. Kalau ia bertahan, ia sendiri yang dimakan. Dan kalau Kuda d4 memakan Pionmu, Pion a4 memakan balik.', en: 'The knight on c6 is attacked by a pawn. If it leaves, the knight on d4 falls. If it stays, it is taken itself. And if the d4 knight takes your pawn, the a4 pawn takes back.' },
      wrong: { id: 'Majukan Pion untuk menyerang Kuda c6.', en: 'Push a pawn to attack the knight on c6.' },
      punish: {
        d1d4: { id: 'Kuda c6 memakan balik. Benteng ditukar Kuda, rugi dua poin.', en: 'The knight on c6 takes back. A rook for a knight, two points lost.' },
      },
    },
    {
      kind: 'move',
      fen: '3r2k1/pp3ppp/2n5/3b4/8/8/PP3PPP/3RR1K1 w - - 0 1',
      accept: ['d1d5'],
      hint: 'd1d5',
      reply: 'd8d5',
      marks: { d8: 'danger', d5: 'target' },
      text: {
        id: 'Cara ketiga: penjaga yang kelebihan beban. Benteng d8 punya dua tugas: menjaga Gajah d5 dan menjaga baris belakang dari skakmat. Ia tidak bisa mengerjakan keduanya. Makan Gajah itu.',
        en: 'The third way: the overloaded guard. The rook on d8 has two jobs: guarding the bishop on d5, and guarding the back row against mate. It cannot do both. Take that bishop.',
      },
      right: { id: 'Benteng hitam memakan balik, dan dengan begitu ia meninggalkan baris belakang.', en: 'The black rook takes back, and in doing so it leaves the back row.' },
      wrong: { id: 'Ambil Gajah d5 dengan Benteng yang berdiri di garis d.', en: 'Take the bishop on d5 with the rook standing on the d file.' },
    },
    {
      kind: 'move',
      fen: '6k1/pp3ppp/2n5/3r4/8/8/PP3PPP/4R1K1 w - - 0 2',
      accept: ['e1e8'],
      hint: 'e1e8',
      mate: true,
      text: { id: 'Baris belakang kosong. Hukum dia.', en: 'The back row is empty. Punish it.' },
      right: { id: 'Skakmat. Seandainya Benteng hitam tidak memakan balik, kau tetap untung satu Gajah. Penjaga dengan dua tugas selalu gagal di salah satunya.', en: 'Checkmate. Had the black rook not taken back, you would still be a bishop up. A guard with two jobs always fails at one of them.' },
      wrong: { id: 'Beri skak di baris paling atas.', en: 'Give check on the top row.' },
    },
    {
      kind: 'quiz',
      text: { id: 'Menterimu menyerang sebuah Benteng yang dijaga satu Kuda. Apa yang pertama kau cari?', en: 'Your queen attacks a rook that is guarded by one knight. What do you look for first?' },
      options: [
        { id: 'Langsung memakan Benteng itu', en: 'Taking the rook at once' },
        { id: 'Cara memakan, mengusir, atau mengalihkan Kuda penjaganya', en: 'A way to take, chase or distract the knight that guards it' },
        { id: 'Sasaran lain di sisi papan yang berbeda', en: 'Another target on the other side of the board' },
      ],
      correct: 1,
      explain: { id: 'Menteri ditukar Benteng itu rugi. Tapi begitu penjaganya hilang, Benteng itu gratis. Tiap kali sasaranmu dijaga, tanyakan: siapa penjaganya, dan bisakah ia disingkirkan?', en: 'A queen for a rook is a loss. But once the guard is gone, that rook is free. Whenever your target is guarded, ask: who guards it, and can that guard be removed?' },
    },
    {
      kind: 'say',
      mood: 'happy',
      text: {
        id: 'Makan, usir, atau bebani. Lawan di tingkat ini jarang meninggalkan bidak tanpa penjaga, tapi penjaga mereka sering hanya satu. Satu penjaga bisa disingkirkan.',
        en: 'Take, chase, or overload. Opponents at this level rarely leave a piece unguarded, but their guard is often only one. One guard can be removed.',
      },
    },
  ],
};

/** The square of the c5 pawn: every square from the pawn to its promotion row, four files wide. */
const SQUARE: Record<string, SceneMark> = Object.fromEntries(
  ['c', 'd', 'e', 'f'].flatMap((f) => [5, 6, 7, 8].map((r) => [`${f}${r}`, 'target' as SceneMark])),
);

export const pionAkhir: Lesson = {
  id: 'b2-5',
  title: { id: 'Akhir Permainan Pion', en: 'Pawn Endgames' },
  blurb: { id: 'Bujur sangkar, oposisi, dan Raja di depan Pion.', en: 'The square, the opposition, and the king in front of the pawn.' },
  scenes: [
    {
      kind: 'say',
      text: {
        id: 'Senjata terakhir babak ini bukan pukulan, melainkan hitungan. Saat bidak-bidak besar sudah habis, satu Pion yang sampai di baris terakhir memutuskan segalanya. Dan Raja, yang selama ini bersembunyi, menjadi petarung utama.',
        en: 'The last weapon of this chapter is not a blow but a calculation. When the big pieces are gone, one pawn reaching the last row decides everything. And the king, who has been hiding all this time, becomes the chief fighter.',
      },
    },
    {
      kind: 'say',
      fen: '8/8/8/2P5/6k1/8/8/K7 b - - 0 1',
      orient: 'w',
      marks: SQUARE,
      text: {
        id: 'Bisakah Raja mengejar Pion yang lari? Tidak perlu menghitung langkah satu per satu. Bayangkan bujur sangkar dari Pion sampai baris terakhir. Kalau Raja bisa masuk ke dalamnya pada gilirannya, Pion tertangkap.',
        en: 'Can a king catch a running pawn? There is no need to count move by move. Picture a square reaching from the pawn to the last row. If the king can step inside it on his turn, the pawn is caught.',
      },
    },
    {
      kind: 'move',
      fen: '8/8/8/2P5/6k1/8/8/K7 b - - 0 1',
      orient: 'w',
      marks: SQUARE,
      accept: ['g4f5'],
      hint: 'g4f5',
      text: { id: 'Kali ini kau memegang Hitam. Masuklah ke bujur sangkar.', en: 'This time you hold the black pieces. Step into the square.' },
      right: { id: 'Dari sini Rajamu selalu tiba tepat waktu dan menangkap Pion di c8.', en: 'From here your king always arrives in time and catches the pawn on c8.' },
      wrong: { id: 'Petak itu di luar bujur sangkar. Pion akan lebih dulu sampai.', en: 'That square is outside the square. The pawn will get there first.' },
    },
    {
      kind: 'quiz',
      fen: '8/8/8/2P5/7k/8/8/K7 b - - 0 1',
      orient: 'w',
      marks: SQUARE,
      text: { id: 'Raja hitam berdiri satu petak lebih jauh. Giliran Hitam. Masih bisakah ia mengejar?', en: 'The black king stands one square further away. It is Black\'s move. Can he still catch the pawn?' },
      options: [
        { id: 'Bisa', en: 'Yes' },
        { id: 'Tidak bisa', en: 'No' },
      ],
      correct: 1,
      explain: { id: 'Ia tidak bisa masuk ke bujur sangkar dalam satu langkah. Pion menjadi Menteri.', en: 'He cannot step into the square in one move. The pawn becomes a queen.' },
    },
    {
      kind: 'say',
      fen: '8/8/4k3/8/4K3/4P3/8/8 b - - 0 1',
      orient: 'w',
      marks: { e5: 'danger' },
      text: {
        id: 'Kalau Raja lawan sudah berdiri di depan Pion, kau butuh Rajamu sendiri sebagai pembuka jalan. Kuncinya oposisi: dua Raja berhadapan dengan satu petak di antaranya. Siapa yang harus melangkah, dialah yang rugi, karena ia terpaksa minggir.',
        en: 'If the enemy king already stands in front of the pawn, you need your own king to clear the way. The key is the opposition: two kings facing each other with one square between. Whoever has to move loses out, because that king is forced to give way.',
      },
    },
    {
      kind: 'quiz',
      fen: '8/8/4k3/8/4K3/4P3/8/8 b - - 0 1',
      orient: 'w',
      text: { id: 'Di posisi ini giliran Hitam. Siapa yang diuntungkan?', en: 'In this position it is Black\'s move. Who benefits?' },
      options: [
        { id: 'Putih', en: 'White' },
        { id: 'Hitam', en: 'Black' },
      ],
      correct: 0,
      explain: {
        id: 'Raja hitam harus minggir, dan Rajamu maju melewatinya. Seandainya giliran Putih, justru Putih yang harus minggir dan hasilnya remis. Posisi sama, hasil berbeda, hanya karena giliran.',
        en: 'The black king must give way, and yours walks past him. Were it White\'s move, White would have to give way and the game would be drawn. The same position, a different result, only because of whose move it is.',
      },
    },
    {
      kind: 'move',
      fen: '8/8/4k3/8/3K4/4P3/8/8 w - - 0 1',
      accept: ['d4e4'],
      hint: 'd4e4',
      text: { id: 'Giliranmu. Rebut oposisi.', en: 'Your move. Seize the opposition.' },
      right: { id: 'Dua Raja berhadapan dan giliran lawan. Ia harus minggir, lalu Rajamu maju.', en: 'The kings face each other and it is the other side\'s move. That king must give way, then yours advances.' },
      wrong: { id: 'Tempatkan Rajamu tepat berhadapan dengan Raja lawan, satu petak di antaranya.', en: 'Place your king directly opposite the enemy king, with one square between.' },
      punish: {
        e3e4: { id: 'Jangan buru-buru memajukan Pion. Raja dulu, Pion belakangan. Sekarang Raja lawan yang merebut oposisi, dan hasilnya remis.', en: 'Do not hurry the pawn forward. King first, pawn later. Now the enemy king takes the opposition, and the game is a draw.' },
      },
    },
    {
      kind: 'move',
      fen: '4k3/8/4K3/4P3/8/8/8/8 w - - 0 1',
      accept: ['e6d6', 'e6f6'],
      hint: 'e6d6',
      text: { id: 'Rajamu sudah di baris keenam, di depan Pionnya. Posisi ini selalu menang. Buka jalan untuk Pion tanpa mundur.', en: 'Your king has reached the sixth row, in front of his pawn. This position always wins. Clear the way for the pawn without retreating.' },
      right: { id: 'Raja membuka jalan dan Pion mengikuti. Ingat aturannya: Raja berjalan di depan Pion, bukan di belakangnya.', en: 'The king clears the way and the pawn follows. Remember the rule: the king walks in front of the pawn, not behind it.' },
      wrong: { id: 'Langkahkan Raja ke samping, ke d6 atau f6. Mundur membuang kemenangan.', en: 'Step the king sideways, to d6 or f6. Retreating throws the win away.' },
    },
    {
      kind: 'move',
      fen: '8/4k3/4P3/3K4/8/8/8/8 b - - 0 1',
      accept: ['e7e8'],
      hint: 'e7e8',
      text: { id: 'Sekarang kau yang bertahan, memegang Hitam. Pion putih sudah di baris keenam. Hanya satu langkah yang menyelamatkan.', en: 'Now you are the defender, holding the black pieces. The white pawn is on the sixth row. Only one move saves the game.' },
      right: { id: 'Mundur lurus. Ke mana pun Raja putih melangkah, kau melangkah berhadapan dengannya dan merebut oposisi. Hasilnya remis.', en: 'Straight back. Wherever the white king steps, you step opposite him and take the opposition. The game is drawn.' },
      wrong: { id: 'Mundur serong menyerahkan oposisi kepada lawan. Mundurlah lurus, tetap di garis Pion.', en: 'Stepping back diagonally hands the opposition to your opponent. Go straight back, staying on the pawn\'s file.' },
    },
    {
      kind: 'say',
      fen: '7k/8/7P/6K1/8/8/8/8 b - - 0 1',
      orient: 'w',
      marks: { h8: 'bad' },
      text: {
        id: 'Satu pengecualian: Pion tepi, di garis a atau h. Kalau Raja yang bertahan sampai di sudut promosi, hasilnya selalu remis. Ia tidak bisa diusir dari sana, hanya bisa dibuat pat.',
        en: 'One exception: the edge pawn, on the a or h file. If the defending king reaches the promotion corner, the game is always drawn. He cannot be driven out, only stalemated.',
      },
    },
    {
      kind: 'play',
      goal: 'promote',
      // Promotes in nine moves with best play; the limit leaves room for detours.
      fen: '4k3/8/8/8/3K4/3P4/8/8 w - - 0 1',
      maxMoves: 20,
      text: {
        id: 'Sekarang antarkan Pionmu sampai menjadi Menteri. Raja di depan, rebut oposisi, Pion mengikuti. Lawan akan bertahan sebaik mungkin, dan Nyala siap membantu.',
        en: 'Now escort your pawn until it becomes a queen. King in front, seize the opposition, pawn behind. Your opponent will defend as well as possible, and Nyala is ready to help.',
      },
      right: { id: 'Menteri baru lahir. Sisanya sudah kau kuasai sejak Babak Mata Ksatria.', en: 'A new queen is born. The rest you have known since The Warrior\'s Eye.' },
      stalemate: { id: 'Pat! Raja lawan tidak punya langkah. Sebelum Pion maju ke baris ketujuh, pastikan Rajamu sudah menguasai petak promosi.', en: 'Stalemate! The enemy king has no move. Before the pawn steps to the seventh row, make sure your king already controls the promotion square.' },
      tooLong: { id: 'Terlalu lama. Bawa Raja ke depan Pion lebih dulu, rebut oposisi, baru majukan Pion.', en: 'Too slow. Bring the king in front of the pawn first, seize the opposition, and only then push the pawn.' },
      lost: { id: 'Pionmu hilang, dan tanpa dia tidak ada kemenangan. Jangan biarkan ia berjalan sendirian, jauh dari Rajamu.', en: 'Your pawn is gone, and without it there is no win. Do not let it walk alone, far from your king.' },
    },
    {
      kind: 'say',
      mood: 'happy',
      text: {
        id: 'Garpu, pin, tusuk, serangan terbuka, cara menyingkirkan penjaga, dan hitungan Pion: senjatamu lengkap. Asahlah tiap hari di ruang puzzle, sampai tanganmu mengenalinya sebelum pikiranmu.',
        en: 'Forks, pins, skewers, discovered attacks, removing the guard, and counting with pawns: your weapons are complete. Sharpen them every day in the puzzle room, until your hand knows them before your mind does.',
      },
    },
  ],
};
