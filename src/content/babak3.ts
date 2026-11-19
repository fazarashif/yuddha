import type { Lesson, SceneMark } from './lessons';

/** Chapter 3 (Siasat): pawn structure, active pieces, attacking the king, rook endgames. */

const row = (rank: number, mark: SceneMark, skip: string[] = []): Record<string, SceneMark> =>
  Object.fromEntries([...'abcdefgh'].map((f) => `${f}${rank}`).filter((sq) => !skip.includes(sq)).map((sq) => [sq, mark]));

export const strukturPion: Lesson = {
  id: 'b3-1',
  title: { id: 'Struktur Pion', en: 'Pawn Structure' },
  blurb: { id: 'Pion terisolasi, dobel, pulau Pion, dan passed pawn.', en: 'Isolated and doubled pawns, islands, and passed pawns.' },
  scenes: [
    {
      kind: 'say',
      text: {
        id: 'Selamat datang di Babak Siasat. Di sini kita jarang menang dalam satu pukulan. Kita menang karena posisi kita lebih sehat. Dan kesehatan posisi dimulai dari Pion. Pion tidak bisa mundur, jadi tiap langkah Pion meninggalkan bekas yang tidak bisa dihapus.',
        en: 'Welcome to the chapter of Strategy. Here we rarely win with a single blow. We win because our position is healthier. And the health of a position starts with the pawns. A pawn cannot move back, so every pawn move leaves a mark that can never be undone.',
      },
    },
    {
      kind: 'tap',
      fen: '4k3/pp3ppp/4p3/8/3P4/8/PP3PPP/4K3 w - - 0 1',
      answers: ['d4'],
      text: { id: 'Pion terisolasi adalah Pion tanpa kawan di garis sebelahnya. Ketuk Pion putih yang terisolasi.', en: 'An isolated pawn has no friend on the files beside it. Tap the white pawn that is isolated.' },
      right: { id: 'Tidak ada Pion putih di garis c maupun e. Tak satu Pion pun bisa menjaga d4.', en: 'There is no white pawn on the c or e file. No pawn can ever guard d4.' },
      wrong: { id: 'Cari Pion putih yang garis kiri dan kanannya kosong dari Pion putih.', en: 'Look for the white pawn whose neighbouring files hold no white pawn.' },
    },
    {
      kind: 'say',
      fen: '4k3/pp3ppp/4p3/8/3P4/8/PP3PPP/4K3 w - - 0 1',
      marks: { d4: 'danger', d5: 'target' },
      text: {
        id: 'Kelemahannya dua. Pion itu sendiri harus dijaga oleh bidak, yang semestinya bisa bekerja di tempat lain. Dan petak di depannya, d5, tidak akan pernah diusir Pion. Lawan akan menaruh bidaknya di sana dengan tenang.',
        en: 'It has two weaknesses. The pawn itself must be guarded by pieces that could be working elsewhere. And the square in front of it, d5, can never be chased by a pawn. Your opponent will park a piece there in peace.',
      },
    },
    {
      kind: 'tap',
      fen: '4k3/pp3ppp/8/8/8/2P5/PPP2PPP/4K3 w - - 0 1',
      answers: ['c2', 'c3'],
      text: { id: 'Pion dobel adalah dua Pion yang berdiri di garis yang sama. Ketuk keduanya.', en: 'Doubled pawns are two pawns standing on the same file. Tap both of them.' },
      right: { id: 'Yang belakang terhalang yang depan, dan keduanya tidak bisa saling menjaga. Pion dobel lahir dari memakan ke arah tengah, kadang itu harga yang pantas, kadang tidak.', en: 'The back one is blocked by the front one, and they cannot guard each other. Doubled pawns come from capturing towards the centre: sometimes a fair price, sometimes not.' },
      wrong: { id: 'Cari dua Pion putih di satu garis.', en: 'Look for two white pawns on one file.' },
    },
    {
      kind: 'quiz',
      fen: '4k3/8/8/8/3P4/8/PP3PPP/4K3 w - - 0 1',
      text: { id: 'Pion yang bersebelahan membentuk satu pulau. Berapa pulau Pion yang dimiliki Putih?', en: 'Pawns standing on neighbouring files form an island. How many pawn islands does White have?' },
      options: [
        { id: 'Dua', en: 'Two' },
        { id: 'Tiga', en: 'Three' },
        { id: 'Empat', en: 'Four' },
      ],
      correct: 1,
      explain: { id: 'a dan b, lalu d sendirian, lalu f, g, dan h. Tiap pulau punya ujung yang tak terjaga Pion. Makin sedikit pulau, makin sedikit kelemahan.', en: 'a and b, then d on its own, then f, g and h. Every island has an end that no pawn guards. Fewer islands, fewer weaknesses.' },
    },
    {
      kind: 'say',
      text: {
        id: 'Sekarang kabar baiknya. Passed pawn adalah Pion yang tidak bisa dihentikan Pion lawan: tidak ada Pion lawan di depannya, di garisnya sendiri maupun di garis sebelahnya. Di endgame, passed pawn sering bernilai seperti bidak penuh.',
        en: 'Now the good news. A passed pawn is one that no enemy pawn can stop: there is no enemy pawn ahead of it, on its own file or the files beside it. In the endgame a passed pawn is often worth as much as a whole piece.',
      },
    },
    {
      kind: 'tap',
      fen: '4k3/5p1p/6p1/p2P4/1P6/6P1/7P/4K3 w - - 0 1',
      answers: ['d5'],
      text: { id: 'Ketuk Pion putih yang lolos.', en: 'Tap the white pawn that is passed.' },
      right: { id: 'Di garis c, d, dan e di depan d5 tidak ada satu pun Pion hitam. Jalannya ke d8 bebas.', en: 'On the c, d and e files ahead of d5 there is not a single black pawn. Its road to d8 is open.' },
      wrong: { id: 'Periksa tiga garis untuk tiap Pion: garisnya sendiri dan dua di sebelahnya. Adakah Pion hitam di depannya?', en: 'Check three files for each pawn: its own and the two beside it. Is there a black pawn ahead?' },
    },
    {
      kind: 'say',
      fen: '6k1/ppp5/8/PPP5/8/8/8/7K w - - 0 1',
      marks: { a5: 'good', b5: 'good', c5: 'good' },
      text: {
        id: 'Passed pawn juga bisa diciptakan. Di sini tiga Pion berhadapan dengan tiga Pion, dan tak satu pun lolos. Tapi Raja hitam terlalu jauh, dan ada satu terobosan yang membuat salah satu Pionmu tak terbendung.',
        en: 'A passed pawn can also be created. Here three pawns face three pawns and none of them is passed. But the black king is too far away, and there is one breakthrough that makes one of your pawns unstoppable.',
      },
    },
    {
      kind: 'move',
      fen: '6k1/ppp5/8/PPP5/8/8/8/7K w - - 0 1',
      accept: ['b5b6'],
      hint: 'b5b6',
      reply: 'a7b6',
      text: { id: 'Mulailah dari tengah. Korbankan Pion yang di tengah.', en: 'Start in the middle. Sacrifice the middle pawn.' },
      right: { id: 'Pion itu menyerang a7 dan c7 sekaligus. Apa pun yang memakannya, satu garis terbuka.', en: 'That pawn attacks a7 and c7 at once. Whichever pawn takes it, a file opens.' },
      wrong: { id: 'Majukan Pion b. Ia tidak dijaga, dan memang itu maksudnya.', en: 'Push the b pawn. It is not guarded, and that is the point.' },
    },
    {
      kind: 'move',
      fen: '6k1/1pp5/1p6/P1P5/8/8/8/7K w - - 0 2',
      accept: ['c5c6'],
      hint: 'c5c6',
      reply: 'b7c6',
      text: { id: 'Hitam memakan dengan Pion a. Sekarang korbankan yang kedua, dari sisi yang lain.', en: 'Black took with the a pawn. Now sacrifice the second one, from the other side.' },
      right: { id: 'Pion b7 terpaksa memakan, kalau tidak, Pionmu memakannya dan berjalan ke b8.', en: 'The b7 pawn has to take, or else your pawn takes it and walks to b8.' },
      wrong: { id: 'Majukan Pion c ke c6, menyerang Pion b7.', en: 'Push the c pawn to c6, attacking the b7 pawn.' },
    },
    {
      kind: 'move',
      fen: '6k1/2p5/1pp5/P7/8/8/8/7K w - - 0 3',
      accept: ['a5a6'],
      hint: 'a5a6',
      text: { id: 'Dua Pion sudah dikorbankan. Panen hasilnya.', en: 'Two pawns have been given. Reap the reward.' },
      right: { id: 'Garis a bersih. Tiga langkah lagi Pion ini menjadi Menteri, dan Raja hitam masih di sisi lain papan.', en: 'The a file is clear. Three more moves and this pawn is a queen, while the black king is still across the board.' },
      wrong: { id: 'Pion a sekarang lolos. Majukan.', en: 'The a pawn is passed now. Push it.' },
      punish: {
        a5b6: { id: 'Memakan membuat Pion c7 memakan balik, dan kesempatan hilang. Majukan saja Pion a, tak ada yang bisa menghentikannya.', en: 'Capturing lets the c7 pawn take back and the chance is gone. Just push the a pawn: nothing can stop it.' },
      },
    },
    {
      kind: 'say',
      mood: 'happy',
      text: {
        id: 'Sebelum memajukan Pion, tanyakan: Pion mana yang akan terisolasi, petak mana yang tak akan lagi terjaga, dan bisakah langkah ini memberiku passed pawn? Pion yang dimajukan tanpa pikir tidak bisa ditarik kembali.',
        en: 'Before you push a pawn, ask: which pawn will be isolated, which square will never be guarded again, and could this move give me a passed pawn? A pawn pushed without thought can never be taken back.',
      },
    },
  ],
};

export const aktif: Lesson = {
  id: 'b3-2',
  title: { id: 'Bidak Aktif', en: 'Active Pieces' },
  blurb: { id: 'Benteng di open file, Kuda di outpost, Gajah yang baik.', en: 'Rooks on open files, knights on outposts, good bishops.' },
  scenes: [
    {
      kind: 'say',
      text: {
        id: 'Daftar nilai bidak yang kau hafal itu rata-rata. Kuda yang menguasai pusat bisa lebih kuat dari Benteng yang masih tidur di sudut. Nilai sebuah bidak tergantung pada apa yang bisa ia kerjakan.',
        en: 'The piece values you learned are averages. A knight ruling the centre can be stronger than a rook still asleep in the corner. A piece is worth what it can do.',
      },
    },
    {
      kind: 'move',
      fen: 'r4rk1/pp3ppp/2p2n2/8/8/2P2N2/PP3PPP/R4RK1 w - - 0 1',
      accept: ['f1d1', 'a1d1', 'f1e1', 'a1e1'],
      hint: 'f1d1',
      marks: { d1: 'target', e1: 'target' },
      text: { id: 'Benteng butuh garis terbuka, garis tanpa Pion. Di sini ada dua. Bawa salah satu Bentengmu ke sana.', en: 'A rook needs an open file, a file with no pawns. There are two here. Bring one of your rooks to one of them.' },
      right: { id: 'Benteng di garis terbuka menembus sampai ke barisan lawan. Benteng yang terhalang Pionnya sendiri hanyalah penonton.', en: 'A rook on an open file reaches all the way into the enemy camp. A rook behind its own pawns is just a spectator.' },
      wrong: { id: 'Garis d dan e tidak berisi Pion. Pindahkan Benteng ke salah satunya.', en: 'The d and e files hold no pawns. Move a rook onto one of them.' },
    },
    {
      kind: 'say',
      fen: '4r1k1/pp3ppp/2p5/8/8/2P4P/PP3PP1/3R2K1 w - - 0 1',
      marks: row(7, 'target', ['c7', 'd7', 'e7']),
      text: {
        id: 'Tujuan garis terbuka biasanya baris ketujuh. Di sana Pion-Pion lawan yang belum bergerak berbaris tanpa perlindungan Pion lain, dan Raja lawan terkurung di baris terakhir.',
        en: 'The open file usually leads to the seventh row. There the enemy pawns that have not moved stand in a line with no pawn to guard them, and the enemy king is shut on the last row.',
      },
    },
    {
      kind: 'move',
      fen: '4r1k1/pp3ppp/2p5/8/8/2P4P/PP3PP1/3R2K1 w - - 0 1',
      accept: ['d1d7'],
      hint: 'd1d7',
      reply: 'e8b8',
      text: { id: 'Bentengmu sudah di garis terbuka. Masuklah ke baris ketujuh.', en: 'Your rook is already on the open file. Enter the seventh row.' },
      right: { id: 'Pion b7 diserang, dan Benteng hitam terpaksa turun menjaganya. Sekarang lawan yang bermain pasif. Pion h3 yang kau majukan tadi juga penting: Rajamu tidak bisa terkena back rank mate.', en: 'The b7 pawn is attacked, and the black rook has to come down to guard it. Now your opponent is the one playing passively. The h3 pawn matters too: your king cannot be mated on the back row.' },
      wrong: { id: 'Bawa Benteng menyusuri garis d sampai baris ketujuh.', en: 'Take the rook down the d file to the seventh row.' },
    },
    {
      kind: 'say',
      fen: '3r1rk1/pp2bppp/3p4/4p3/4P3/2N5/PPP2PPP/3R1RK1 w - - 0 1',
      marks: { d5: 'target', e4: 'good' },
      text: {
        id: 'Kuda paling kuat di outpost: petak di wilayah lawan yang dijaga Pionmu dan tidak bisa diusir Pion lawan. Lihat d5. Pion e4 menjaganya, dan Hitam tidak punya Pion c atau e yang bisa menyerangnya.',
        en: 'A knight is strongest on an outpost: a square in enemy territory that your pawn guards and no enemy pawn can attack. Look at d5. The e4 pawn guards it, and Black has no c or e pawn that could ever attack it.',
      },
    },
    {
      kind: 'move',
      fen: '3r1rk1/pp2bppp/3p4/4p3/4P3/2N5/PPP2PPP/3R1RK1 w - - 0 1',
      accept: ['c3d5'],
      hint: 'c3d5',
      text: { id: 'Tempatkan Kudamu di outpost itu.', en: 'Put your knight on that outpost.' },
      right: { id: 'Dari d5, Kuda menyerang Gajah e7 dan petak-petak sampai c7 dan f6. Gajah hitam berjalan di petak gelap, jadi ia pun tidak bisa menantangnya.', en: 'From d5 the knight hits the bishop on e7 and squares as far as c7 and f6. The black bishop moves on dark squares, so it cannot challenge the knight either.' },
      wrong: { id: 'Lompatkan Kuda ke d5.', en: 'Jump the knight to d5.' },
    },
    {
      kind: 'quiz',
      fen: '6k1/pp1n1ppp/3p4/2pPp3/2P1P3/5P2/PP2B1PP/6K1 w - - 0 1',
      marks: { e2: 'target', c4: 'bad', d5: 'bad', e4: 'bad', f3: 'bad' },
      text: { id: 'Gajah putih di e2 berjalan di petak terang, dan Pion-Pion putih juga berdiri di petak terang. Gajah seperti ini disebut apa?', en: 'The white bishop on e2 moves on light squares, and the white pawns also stand on light squares. What is such a bishop called?' },
      options: [
        { id: 'Gajah baik', en: 'A good bishop' },
        { id: 'Gajah buruk', en: 'A bad bishop' },
      ],
      correct: 1,
      explain: { id: 'Pionnya sendiri menutup jalannya. Taruh Pion di petak yang berlawanan warna dengan Gajahmu, supaya keduanya saling melengkapi.', en: 'Its own pawns block its way. Put your pawns on the opposite colour to your bishop, so the two complement each other.' },
    },
    {
      kind: 'quiz',
      fen: '4k3/8/8/8/3N4/8/8/N3K3 w - - 0 1',
      text: { id: 'Kuda di sudut a1 menguasai berapa petak? Dan Kuda di d4?', en: 'How many squares does the knight in the a1 corner control? And the knight on d4?' },
      options: [
        { id: '2 dan 8', en: '2 and 8' },
        { id: '4 dan 6', en: '4 and 6' },
        { id: '3 dan 8', en: '3 and 8' },
      ],
      correct: 0,
      explain: { id: 'Empat kali lipat. Kuda di tepi papan kehilangan separuh kekuatannya, apalagi di sudut. Bawa Kudamu ke tengah.', en: 'Four times as many. A knight on the edge loses half its power, and in the corner even more. Bring your knights to the centre.' },
    },
    {
      kind: 'say',
      mood: 'happy',
      text: {
        id: 'Saat tidak ada taktik di papan, tanyakan satu hal: bidakku mana yang paling malas? Benteng yang tertutup, Kuda di tepi, Gajah yang terhalang Pionnya. Bangunkan dia. Partai di tingkat ini sering dimenangkan oleh pihak yang bidaknya lebih banyak bekerja.',
        en: 'When there is no tactic on the board, ask one thing: which of my pieces is the laziest? A shut-in rook, a knight on the edge, a bishop blocked by its pawns. Wake it up. Games at this level are often won by the side with more pieces at work.',
      },
    },
  ],
};

export const seranganRaja: Lesson = {
  id: 'b3-3',
  title: { id: 'Serangan Raja', en: 'Attacking the King' },
  blurb: { id: 'Penyerang melawan pembela, dan petak-petak yang lemah.', en: 'Attackers against defenders, and weakened squares.' },
  scenes: [
    {
      kind: 'say',
      text: {
        id: 'Serangan ke Raja yang berhasil bukan soal keberanian, melainkan hitungan. Seranglah saat bidakmu di dekat Raja lawan lebih banyak daripada pembelanya. Dan seranglah lebih dulu titik yang paling sedikit penjaganya.',
        en: 'A successful attack on the king is not a matter of courage but of counting. Attack when you have more pieces near the enemy king than it has defenders. And go first for the point with the fewest guards.',
      },
    },
    {
      kind: 'say',
      fen: 'r1bq1rk1/ppp2ppp/5n2/3p2B1/8/2PQ4/PPB2PPP/R4RK1 w - - 0 1',
      marks: { c2: 'good', d3: 'good', h7: 'target' },
      text: {
        id: 'Lihat garis serong dari c2 ke h7. Gajah dan Menterimu berbaris di sana, seperti dua prajurit yang saling menopang. Para pecatur menyebutnya battery. Sasarannya Pion h7.',
        en: 'Look at the diagonal from c2 to h7. Your bishop and queen stand lined up on it, two soldiers backing each other. Chess players call this a battery. Its target is the h7 pawn.',
      },
    },
    {
      kind: 'tap',
      fen: 'r1bq1rk1/ppp2ppp/5n2/3p2B1/8/2PQ4/PPB2PPP/R4RK1 w - - 0 1',
      answers: ['f6'],
      text: { id: 'Selain Rajanya sendiri, hanya satu bidak hitam yang menjaga h7. Ketuk dia.', en: 'Apart from the king himself, only one black piece guards h7. Tap it.' },
      right: { id: 'Kuda f6. Kalau Menterimu memakan di h7 sekarang, Kuda itu memakannya. Jadi singkirkan dulu penjaganya.', en: 'The knight on f6. If your queen took on h7 now, that knight would take her. So remove the guard first.' },
      wrong: { id: 'Cari bidak hitam yang bisa memakan di h7.', en: 'Look for the black piece that could capture on h7.' },
    },
    {
      kind: 'move',
      fen: 'r1bq1rk1/ppp2ppp/5n2/3p2B1/8/2PQ4/PPB2PPP/R4RK1 w - - 0 1',
      accept: ['g5f6'],
      hint: 'g5f6',
      reply: 'g7f6',
      text: { id: 'Singkirkan penjaganya.', en: 'Remove the guard.' },
      right: { id: 'Penjaga h7 tiada. Hitam memakan balik dengan Pion g.', en: 'The guard of h7 is gone. Black takes back with the g pawn.' },
      wrong: { id: 'Gajahmu di g5 sudah membidik Kuda f6.', en: 'Your bishop on g5 is already aiming at the knight on f6.' },
      punish: {
        d3h7: { id: 'Terlalu cepat. Kuda f6 memakan Menterimu.', en: 'Too soon. The knight on f6 takes your queen.' },
      },
    },
    {
      kind: 'move',
      fen: 'r1bq1rk1/ppp2p1p/5p2/3p4/8/2PQ4/PPB2PPP/R4RK1 w - - 0 2',
      accept: ['d3h7'],
      hint: 'd3h7',
      mate: true,
      text: { id: 'Sekarang battery-nya menembak.', en: 'Now the battery fires.' },
      right: { id: 'Skakmat. Raja tidak bisa memakan Menteri karena Gajah di c2 menjaganya dari jauh.', en: 'Checkmate. The king cannot take the queen, because the bishop on c2 guards her from afar.' },
      wrong: { id: 'Makan Pion h7 dengan Menteri.', en: 'Take the h7 pawn with the queen.' },
    },
    {
      kind: 'quiz',
      fen: 'r1bq1rk1/ppp2p1p/5Bp1/3p4/8/2PQ4/PPB2PPP/R4RK1 w - - 0 2',
      orient: 'w',
      marks: { f6: 'good', d8: 'target' },
      text: { id: 'Bagaimana kalau Hitam tidak memakan balik, tapi memajukan Pion ke g6 untuk menutup garis serong?', en: 'What if Black does not take back, but pushes the pawn to g6 to close the diagonal?' },
      options: [
        { id: 'Serangannya gagal, posisinya seimbang', en: 'The attack fails and the game is level' },
        { id: 'Putih menang Menteri', en: 'White wins the queen' },
      ],
      correct: 1,
      explain: { id: 'Gajah di f6 masih hidup dan menyerang Menteri d8. Serangan yang baik membuat lawan memilih di antara beberapa kerugian.', en: 'The bishop on f6 is still alive and attacks the queen on d8. A good attack leaves your opponent choosing between losses.' },
    },
    {
      kind: 'say',
      fen: 'r4rk1/pp3p1p/2p3pQ/q7/8/2P2N2/PP3PPP/R5K1 w - - 0 1',
      marks: { f6: 'danger', g7: 'danger', h6: 'good' },
      text: {
        id: 'Pion di depan Raja yang sudah maju meninggalkan lubang. Di sini Hitam memajukan Pion ke g6 dan sudah tidak punya Gajah petak gelap. Petak f6, g7, dan h6 tak terjaga lagi, dan Menterimu sudah duduk di h6.',
        en: 'Pawns pushed in front of a king leave holes behind. Here Black has pushed the g pawn and no longer has a dark-squared bishop. The squares f6, g7 and h6 are unguarded, and your queen is already sitting on h6.',
      },
    },
    {
      kind: 'move',
      fen: 'r4rk1/pp3p1p/2p3pQ/q7/8/2P2N2/PP3PPP/R5K1 w - - 0 1',
      accept: ['f3g5'],
      hint: 'f3g5',
      reply: 'a5g5',
      text: { id: 'Menteri sendirian tidak bisa skakmat. Tambahkan satu penyerang ke h7.', en: 'The queen alone cannot mate. Add one more attacker on h7.' },
      right: { id: 'Ancaman Menteri ke h7 dengan skakmat tidak bisa ditangkis. Hitam terpaksa menyerahkan Menterinya untuk Kudamu.', en: 'The threat of queen to h7 with mate cannot be parried. Black has to give up the queen for your knight.' },
      wrong: { id: 'Bawa Kuda ke petak yang ikut menyerang h7.', en: 'Bring the knight to a square that also attacks h7.' },
    },
    {
      kind: 'quiz',
      text: { id: 'Rajamu rokade panjang, Raja lawan rokade pendek. Rencana apa yang paling umum?', en: 'Your king has castled long and the enemy king has castled short. Which plan is most common?' },
      options: [
        { id: 'Menyerbu dengan Pion g dan h ke arah Raja lawan', en: 'Storming with the g and h pawns towards the enemy king' },
        { id: 'Memajukan Pion a dan b di depan Rajamu sendiri', en: 'Pushing the a and b pawns in front of your own king' },
        { id: 'Menukar semua bidak secepat mungkin', en: 'Trading every piece as quickly as possible' },
      ],
      correct: 0,
      explain: {
        id: 'Pion yang maju di depan Raja lawan membuka garis untuk Bentengmu. Pion di depan Rajamu sendiri sebaiknya diam, karena yang terbuka nanti justru rumahmu. Dalam serangan seperti ini, yang lebih cepat biasanya menang.',
        en: 'Pawns advancing on the enemy king open files for your rooks. The pawns in front of your own king should stay put, or the house that opens up is yours. In such races the faster side usually wins.',
      },
    },
    {
      kind: 'say',
      mood: 'happy',
      text: {
        id: 'Hitung penyerang dan pembela. Cari petak yang penjaganya paling sedikit, lalu singkirkan penjaga itu. Dan perhatikan Pion di depan Raja: tiap Pion yang maju meninggalkan lubang, baik di depan Raja lawan maupun Rajamu sendiri.',
        en: 'Count attackers and defenders. Find the square with the fewest guards, then remove those guards. And watch the pawns in front of the king: each one that advances leaves a hole, in front of your opponent\'s king or your own.',
      },
    },
  ],
};

export const bentengAkhir: Lesson = {
  id: 'b3-4',
  title: { id: 'Endgame Benteng', en: 'Rook Endgames' },
  blurb: { id: 'Pertahanan Philidor dan jembatan Lucena.', en: 'The Philidor defence and the Lucena bridge.' },
  scenes: [
    {
      kind: 'say',
      text: {
        id: 'Endgame Benteng adalah yang paling sering muncul di papan. Dua posisi di dalamnya wajib kau kenal, karena hampir semua endgame Benteng dengan satu Pion berujung ke salah satunya: Philidor untuk bertahan, Lucena untuk menang.',
        en: 'Rook endgames are the most common endgames on the board. Two positions inside them you must know, because almost every rook endgame with one pawn ends up in one of them: Philidor to defend, Lucena to win.',
      },
    },
    {
      kind: 'quiz',
      text: { id: 'Pertama, satu aturan umum. Di mana tempat terbaik Benteng untuk mendukung passed pawn?', en: 'First, one general rule. Where is the best place for a rook to support a passed pawn?' },
      options: [
        { id: 'Di depan Pion', en: 'In front of the pawn' },
        { id: 'Di belakang Pion', en: 'Behind the pawn' },
        { id: 'Di samping Pion', en: 'Beside the pawn' },
      ],
      correct: 1,
      explain: { id: 'Dari belakang, makin jauh Pion maju, makin luas jangkauan Benteng. Di depan, Benteng justru menghalangi jalan Pionnya sendiri. Aturan ini juga berlaku untuk menghentikan Pion lawan: Benteng di belakangnya.', en: 'From behind, the further the pawn advances, the more room the rook has. In front, the rook blocks its own pawn. The rule works for stopping enemy pawns too: put your rook behind them.' },
    },
    {
      kind: 'say',
      fen: '4k3/R7/8/4PK2/8/8/8/1r6 b - - 0 1',
      marks: { e8: 'good' },
      text: {
        id: 'Kau memegang Hitam dan kurang satu Pion. Kabar baiknya, Rajamu berdiri di depan Pion lawan. Dengan cara yang tepat, ini remis. Caranya ditemukan Philidor dua setengah abad lalu, dan sampai sekarang tidak berubah.',
        en: 'You hold the black pieces and are a pawn down. The good news is that your king stands in front of the enemy pawn. Played correctly, this is a draw. Philidor found the method two and a half centuries ago, and it has not changed since.',
      },
    },
    {
      kind: 'move',
      fen: '4k3/R7/8/4PK2/8/8/8/1r6 b - - 0 1',
      accept: ['b1b6'],
      hint: 'b1b6',
      reply: 'e5e6',
      marks: row(6, 'target'),
      text: { id: 'Langkah pertama: bawa Bentengmu ke baris 6, supaya Raja putih tidak bisa maju ke sana.', en: 'Step one: bring your rook to row 6, so the white king cannot advance onto it.' },
      right: { id: 'Raja putih terhalang. Untuk maju, Putih terpaksa mendorong Pionnya lebih dulu. Dan itulah yang kita tunggu.', en: 'The white king is held back. To make progress, White has to push the pawn first. That is exactly what we are waiting for.' },
      wrong: { id: 'Bentengmu di b1. Naikkan dia ke b6.', en: 'Your rook is on b1. Lift it to b6.' },
    },
    {
      kind: 'move',
      fen: '4k3/R7/1r2P3/5K2/8/8/8/8 b - - 0 2',
      accept: ['b6b1', 'b6b2', 'b6b3', 'b6b4'],
      hint: 'b6b1',
      text: { id: 'Pion maju ke e6. Sekarang Raja putih tidak punya tempat berlindung di depan Pionnya. Turunkan Bentengmu jauh ke belakang, lalu skak terus dari belakang.', en: 'The pawn has moved to e6. Now the white king has no shelter in front of the pawn. Drop your rook far back and keep checking from behind.' },
      right: { id: 'Ke mana pun Raja putih pergi, Bentengmu memberi skak. Ia tidak bisa sekaligus lolos dari skak dan menjaga Pionnya. Remis. Itulah metode Philidor: baris 6 dulu, lalu ke belakang begitu Pion maju.', en: 'Wherever the white king goes, your rook gives check. He cannot both escape the checks and guard the pawn. A draw. That is the Philidor method: row 6 first, then go far back once the pawn advances.' },
      wrong: { id: 'Gerakkan Benteng turun di garis b, sejauh mungkin dari Raja putih.', en: 'Move the rook down the b file, as far from the white king as you can.' },
    },
    {
      kind: 'say',
      fen: '1K6/1P1k4/8/8/8/8/r7/5R2 w - - 0 1',
      marks: { b8: 'danger', b7: 'good' },
      text: {
        id: 'Sekarang kau Putih, dan Pionmu sudah di baris 7. Rajamu berdiri di depannya, di b8, dan justru di situ masalahnya: ia harus keluar dulu agar Pion bisa promosi. Tapi begitu ia keluar, Benteng hitam memberi skak dari samping. Inilah posisi Lucena.',
        en: 'Now you are White, and your pawn is on row 7. Your king stands in front of it on b8, and that is the problem: he must step out before the pawn can promote. But as soon as he does, the black rook checks him from the side. This is the Lucena position.',
      },
    },
    {
      kind: 'move',
      fen: '1K6/1P1k4/8/8/8/8/r7/5R2 w - - 0 1',
      accept: ['f1d1'],
      hint: 'f1d1',
      reply: 'd7e7',
      text: { id: 'Langkah pertama: usir Raja hitam satu garis lebih jauh dengan skak.', en: 'Step one: drive the black king one file further away with a check.' },
      right: { id: 'Raja hitam terdorong ke garis e. Sekarang ia terlalu jauh untuk membantu di sekitar Pionmu.', en: 'The black king is pushed to the e file. Now he is too far away to help near your pawn.' },
      wrong: { id: 'Beri skak dengan Benteng di garis d.', en: 'Give check with the rook on the d file.' },
    },
    {
      kind: 'move',
      fen: '1K6/1P2k3/8/8/8/8/r7/3R4 w - - 2 2',
      accept: ['d1d4'],
      hint: 'd1d4',
      marks: { d4: 'target' },
      text: { id: 'Langkah kedua, yang paling terkenal: bangun jembatan, building a bridge. Naikkan Bentengmu ke baris 4.', en: 'Step two, the famous one: build the bridge. Lift your rook to row 4.' },
      right: { id: 'Jembatan siap. Rajamu akan berjalan keluar menuju b5, menghindari skak-skak dari samping, lalu Bentengmu menutup skak terakhir di b4. Begitu skaknya habis, Pion promosi.', en: 'The bridge is ready. Your king will walk out towards b5, dodging the checks from the side, then your rook blocks the last check on b4. Once the checks run out, the pawn promotes.' },
      wrong: { id: 'Naikkan Benteng dari d1 ke d4.', en: 'Lift the rook from d1 to d4.' },
    },
    {
      kind: 'play',
      goal: 'promote',
      fen: '1K6/1P1k4/8/8/8/8/r7/5R2 w - - 0 1',
      maxMoves: 20,
      text: {
        id: 'Sekarang mainkan seluruhnya dari awal. Skak untuk menjauhkan Raja hitam, bangun jembatan di baris 4, keluarkan Rajamu, tutup skak dengan Benteng, lalu promosikan. Nyala siap membantu.',
        en: 'Now play it all from the start. Check to push the black king away, build the bridge on row 4, walk your king out, block the check with the rook, then promote. Nyala is ready to help.',
      },
      right: { id: 'Pertahanan Hitam runtuh, dan kemenanganmu tak terbendung lagi. Lucena dan Philidor: dua posisi yang akan menyelamatkan dan memenangkan banyak partaimu.', en: 'Black\'s defence has collapsed, and nothing can stop your win now. Lucena and Philidor: two positions that will save and win you many games.' },
      stalemate: { id: 'Pat! Raja hitam tidak punya langkah. Periksa dulu sebelum promosi.', en: 'Stalemate! The black king has no move. Check before you promote.' },
      tooLong: { id: 'Terlalu lama. Ingat urutannya: skak untuk menjauhkan Raja, Benteng ke baris 4, Raja keluar, Benteng menutup skak.', en: 'Too slow. Remember the order: check the king away, rook to row 4, king walks out, rook blocks the check.' },
      lost: { id: 'Kau kehilangan bidak. Tanpa Benteng atau Pion, tidak ada kemenangan. Jangan biarkan Benteng hitam memakan apa pun.', en: 'You lost material. Without the rook or the pawn there is no win. Do not let the black rook take anything.' },
    },
    {
      kind: 'say',
      mood: 'happy',
      text: {
        id: 'Dengan ini Babak Siasat selesai. Kau tahu Pion mana yang sehat, bidak mana yang malas, kapan Raja lawan siap diserang, dan cara menutup endgame Benteng. Yang tersisa hanyalah memainkannya, berkali-kali.',
        en: 'With this the chapter of Strategy is complete. You know which pawns are healthy, which pieces are lazy, when the enemy king is ripe for attack, and how to close a rook endgame. All that is left is to play it, again and again.',
      },
    },
  ],
};
