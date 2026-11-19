import type { Lesson } from './lessons';

/** Chapter 4 (Mahayuddha): prophylaxis and sacrifices. */

const RUY = 'r1bq1rk1/2p1bppp/p1np1n2/1p2p3/4P3/1BP2N2/PP1P1PPP/RNBQR1K1 w - - 1 9';
const ITALIAN = 'r1bq1rk1/bpp2ppp/p1np1n2/4p3/4P3/1BPP1N2/PP1N1PPP/R1BQR1K1 b - - 3 9';
const GREEK = 'r1bq1rk1/pppn1ppp/2n1p3/3pP3/1b1P4/2NB1N2/PPP2PPP/R1BQK2R w KQ - 0 7';

export const profilaksis: Lesson = {
  id: 'b4-1',
  title: { id: 'Profilaksis', en: 'Prophylaxis' },
  blurb: { id: 'Mencegah rencana lawan sebelum ia sempat memulainya.', en: 'Stopping the opponent\'s plan before it starts.' },
  scenes: [
    {
      kind: 'say',
      text: {
        id: 'Selamat datang di Mahayuddha, perang besar. Di tingkat ini lawan jarang memberi bidak gratis, jadi kemenangan datang dari hal yang lebih halus. Salah satunya profilaksis: bertanya "apa yang ingin lawan lakukan?", lalu mencegahnya sebelum ia sempat.',
        en: 'Welcome to Mahayuddha, the great war. At this level opponents rarely give pieces away, so wins come from subtler things. One of them is prophylaxis: asking "what does my opponent want to do?", and preventing it before they can.',
      },
    },
    {
      kind: 'tap',
      fen: RUY,
      answers: ['g4'],
      marks: { c8: 'bad', f3: 'good', d4: 'target' },
      text: {
        id: 'Ruy Lopez. Putih ingin memajukan Pion ke d4, dan Kuda f3 ikut menjaga petak itu. Hitam punya satu petak untuk Gajah c8 yang akan mengganggu rencana ini. Ketuk petak itu.',
        en: 'The Ruy Lopez. White wants to push a pawn to d4, and the f3 knight helps guard that square. Black has one square for the c8 bishop that would spoil this plan. Tap it.',
      },
      right: { id: 'g4. Dari sana Gajah memberi pin pada Kuda f3 ke Menteri, dan Kuda itu tidak lagi bisa membantu menjaga d4.', en: 'g4. From there the bishop pins the f3 knight to the queen, and the knight can no longer help guard d4.' },
      wrong: { id: 'Ikuti garis serong Gajah c8 sampai ke petak yang membidik Kuda f3.', en: 'Follow the c8 bishop\'s diagonal to the square that aims at the f3 knight.' },
    },
    {
      kind: 'move',
      fen: RUY,
      accept: ['h2h3'],
      hint: 'h2h3',
      text: { id: 'Cegah Gajah itu sampai ke g4, baru jalankan rencanamu.', en: 'Keep the bishop off g4 first, then carry out your plan.' },
      right: { id: 'Langkah kecil yang dimainkan para Grandmaster di posisi ini sejak lebih dari seratus tahun. Sekarang d4 bisa menyusul tanpa gangguan.', en: 'A small move Grandmasters have played in this position for over a hundred years. Now d4 can follow undisturbed.' },
      wrong: { id: 'Majukan Pion h satu petak, supaya g4 dijaga.', en: 'Push the h pawn one square, so that g4 is covered.' },
      punish: {
        d2d4: { id: 'Terburu-buru. Gajah ke g4 memberi pin pada Kuda f3, dan tekanan ke d4 jadi tidak nyaman. Cegah dulu.', en: 'Too hasty. Bishop to g4 pins the f3 knight and the pressure on d4 gets uncomfortable. Prevent it first.' },
      },
    },
    {
      kind: 'move',
      fen: ITALIAN,
      accept: ['h7h6'],
      hint: 'h7h6',
      marks: { g5: 'target', f6: 'good' },
      text: {
        id: 'Sekarang kau Hitam, di Italian Game. Gajah putih di c1 sedang mencari petak yang bagus. Petak terbaiknya g5, untuk memberi pin pada Kudamu di f6. Tutup petak itu.',
        en: 'Now you are Black, in the Italian Game. The white bishop on c1 is looking for a good square. Its best is g5, pinning your f6 knight. Take that square away.',
      },
      right: { id: 'Gajah putih tidak lagi punya petak aktif. Langkah sekecil ini sering lebih berguna daripada langkah yang tampak agresif.', en: 'The white bishop has no active square left. A move this small is often worth more than one that looks aggressive.' },
      wrong: { id: 'Majukan Pion h satu petak, supaya g5 dijaga.', en: 'Push the h pawn one square, so that g5 is covered.' },
    },
    {
      kind: 'quiz',
      text: { id: 'Banyak Grandmaster memainkan Raja ke h1 atau Pion ke h3 tanpa ancaman apa pun di papan. Mengapa?', en: 'Many Grandmasters play king to h1 or pawn to h3 with no threat on the board at all. Why?' },
      options: [
        { id: 'Membuang waktu sambil menunggu lawan salah', en: 'Wasting time while waiting for a mistake' },
        { id: 'Menghapus skak dan ancaman back rank mate sebelum dibutuhkan', en: 'Removing checks and back rank mate threats before they matter' },
        { id: 'Menyiapkan serangan dengan Pion g', en: 'Preparing an attack with the g pawn' },
      ],
      correct: 1,
      explain: { id: 'Saat taktik meledak nanti, Raja yang sudah aman membuat semua hitunganmu lebih sederhana. Profilaksis adalah asuransi yang dibayar di muka.', en: 'When the tactics explode later, a king that is already safe makes every calculation simpler. Prophylaxis is insurance paid in advance.' },
    },
    {
      kind: 'quiz',
      text: { id: 'Kau tidak menemukan rencana yang jelas, dan lawan pun tidak mengancam apa-apa. Apa yang paling baik?', en: 'You cannot find a clear plan, and your opponent threatens nothing. What is best?' },
      options: [
        { id: 'Menyerang dengan apa saja supaya tidak pasif', en: 'Attack with anything, just to avoid being passive' },
        { id: 'Mencegah rencana terbaik lawan, atau memperbaiki bidakmu yang paling buruk', en: 'Prevent your opponent\'s best plan, or improve your worst piece' },
        { id: 'Menawarkan remis', en: 'Offer a draw' },
      ],
      correct: 1,
      explain: { id: 'Serangan tanpa dasar membuka posisimu sendiri. Dua pertanyaan ini selalu menghasilkan langkah yang berguna: apa yang lawan inginkan, dan bidakku mana yang paling malas?', en: 'An attack without a basis opens up your own position. These two questions always produce a useful move: what does my opponent want, and which of my pieces is the laziest?' },
    },
    {
      kind: 'say',
      mood: 'happy',
      text: {
        id: 'Pemain biasa bertanya "apa yang bisa kulakukan?". Pemain kuat bertanya dulu "apa yang ingin lawan lakukan?". Biasakan pertanyaan kedua, dan lawanmu akan merasa semua rencananya selalu sudah ditunggu.',
        en: 'An ordinary player asks "what can I do?". A strong player first asks "what does my opponent want to do?". Make the second question a habit, and your opponents will feel that every plan they make is already expected.',
      },
    },
  ],
};

export const berkorban: Lesson = {
  id: 'b4-2',
  title: { id: 'Seni Berkorban', en: 'The Art of Sacrifice' },
  blurb: { id: 'Greek gift, exchange sacrifice, dan kompensasi jangka panjang.', en: 'The Greek gift, the exchange sacrifice, and long-term compensation.' },
  scenes: [
    {
      kind: 'say',
      text: {
        id: 'Ada dua macam pengorbanan. Yang pertama bisa dihitung sampai habis: kau memberi bidak dan mendapat lebih banyak dalam beberapa langkah. Yang kedua tidak bisa dihitung sampai habis: kau memberi materi untuk keuntungan yang bertahan lama. Kita mulai dari yang pertama, yang paling terkenal.',
        en: 'There are two kinds of sacrifice. The first can be calculated to the end: you give material and win more back within a few moves. The second cannot: you give material for advantages that last. We start with the first, and the most famous.',
      },
    },
    {
      kind: 'say',
      fen: GREEK,
      marks: { d3: 'good', h7: 'target', f3: 'good', d1: 'good' },
      text: {
        id: 'Greek gift, hadiah dari Yunani. Syaratnya ada di papan ini: Gajah membidik h7, Kuda f3 siap melompat ke g5, Menteri bisa menyusul ke h5, Pion e5 mengusir Kuda hitam dari f6, dan tak ada bidak hitam yang bisa menjaga h7.',
        en: 'The Greek gift. Its conditions are all on this board: the bishop aims at h7, the f3 knight is ready to jump to g5, the queen can follow to h5, the e5 pawn keeps the black knight off f6, and no black piece can guard h7.',
      },
    },
    {
      kind: 'move',
      fen: GREEK,
      accept: ['d3h7'],
      hint: 'd3h7',
      reply: 'g8h7',
      text: { id: 'Berikan hadiahnya.', en: 'Give the gift.' },
      right: { id: 'Gajah dikorbankan dengan skak. Raja hitam menerimanya.', en: 'The bishop is sacrificed with check. The black king accepts.' },
      wrong: { id: 'Gajah d3 memakan Pion h7, skak.', en: 'The d3 bishop takes the h7 pawn, with check.' },
    },
    {
      kind: 'move',
      fen: 'r1bq1r2/pppn1ppk/2n1p3/3pP3/1b1P4/2N2N2/PPP2PPP/R1BQK2R w KQ - 0 8',
      accept: ['f3g5'],
      hint: 'f3g5',
      reply: 'h7g8',
      text: { id: 'Skak lagi, dengan Kuda.', en: 'Check again, with the knight.' },
      right: { id: 'Raja mundur ke g8. Kalau ia maju ke g6 atau h6, Menteri dan Kudamu akan memburunya di tengah papan.', en: 'The king retreats to g8. Had he come forward to g6 or h6, your queen and knight would hunt him in the open.' },
      wrong: { id: 'Lompatkan Kuda ke g5, skak.', en: 'Jump the knight to g5, check.' },
    },
    {
      kind: 'move',
      fen: 'r1bq1rk1/pppn1pp1/2n1p3/3pP1N1/1b1P4/2N5/PPP2PPP/R1BQK2R w KQ - 2 9',
      accept: ['d1h5', 'd1d3'],
      hint: 'd1h5',
      text: { id: 'Sekarang Menteri bergabung, dengan ancaman skakmat di h7.', en: 'Now the queen joins in, threatening mate on h7.' },
      right: { id: 'Ancaman Menteri ke h7 dengan skakmat. Untuk bertahan, Hitam harus mengembalikan materi, biasanya Menterinya sendiri untuk Kudamu.', en: 'The queen threatens mate on h7. To survive, Black has to give material back, usually the queen itself for your knight.' },
      wrong: { id: 'Bawa Menteri ke garis h, misalnya h5.', en: 'Bring the queen to the h file, for example h5.' },
    },
    {
      kind: 'quiz',
      fen: GREEK,
      text: { id: 'Di posisi awal tadi, Kuda hitam berdiri di f6, bukan d7. Masih bisakah Greek gift dimainkan?', en: 'Back in the starting position, suppose the black knight stood on f6 instead of d7. Would the Greek gift still work?' },
      options: [
        { id: 'Bisa, sama saja', en: 'Yes, nothing changes' },
        { id: 'Biasanya tidak, karena Kuda f6 menjaga h7 dan petak h5', en: 'Usually not, because the f6 knight guards h7 and h5' },
      ],
      correct: 1,
      explain: { id: 'Itulah sebabnya Pion e5 begitu penting: ia mengusir sang penjaga. Tanpa syarat-syaratnya, hadiah ini hanyalah satu Gajah yang hilang.', en: 'That is why the e5 pawn matters so much: it drives the defender away. Without its conditions, this gift is just a lost bishop.' },
    },
    {
      kind: 'say',
      fen: '3q1rk1/pp1bppbp/3p1np1/8/2rNP1P1/2N1BP2/PPPQ3P/1K1R3R b - - 0 14',
      orient: 'b',
      marks: { c4: 'good', c3: 'target', e4: 'target', g7: 'good' },
      text: {
        id: 'Sekarang pengorbanan jenis kedua. Di Sicilian Dragon, Hitam sering memberikan Benteng untuk Kuda c3. Ini exchange sacrifice: rugi dua poin di atas kertas, tapi Pion di depan Raja putih rusak, Pion e4 kehilangan penjaga, dan Gajah g7 tiba-tiba menatap Raja putih tanpa penghalang.',
        en: 'Now the second kind. In the Sicilian Dragon, Black often gives a rook for the c3 knight. This is an exchange sacrifice: two points down on paper, but the pawns in front of the white king are wrecked, the e4 pawn loses its guard, and the g7 bishop suddenly stares at the white king with nothing in the way.',
      },
    },
    {
      kind: 'quiz',
      text: { id: 'Kompensasi mana yang biasanya membenarkan pengorbanan posisional?', en: 'Which compensation usually justifies a positional sacrifice?' },
      options: [
        { id: 'Lawan terlihat bingung', en: 'Your opponent looks confused' },
        { id: 'Raja lawan terbuka, bidakmu jauh lebih aktif, atau kau mendapat passed pawn yang kuat', en: 'An exposed enemy king, much more active pieces, or a strong passed pawn' },
        { id: 'Kau bosan dengan posisi yang tenang', en: 'You are bored with a quiet position' },
      ],
      correct: 1,
      explain: { id: 'Kompensasi yang nyata bisa ditunjuk di papan dan tidak hilang dalam satu-dua langkah. Kalau kau tidak bisa menyebutkan apa yang kau dapat, jangan berkorban.', en: 'Real compensation can be pointed at on the board and does not vanish in a move or two. If you cannot say what you get, do not sacrifice.' },
    },
    {
      kind: 'say',
      mood: 'happy',
      text: {
        id: 'Dengan ini kelima babak Lakon sudah kau jalani, dari mengenal Kelir sampai Mahayuddha. Mulai sekarang guru terbaikmu adalah partai-partaimu sendiri. Bertandinglah, ulas, dan biarkan Kitab Luka mengingatkanmu.',
        en: 'With this you have walked all five chapters, from learning the screen to Mahayuddha. From now on your best teacher is your own games. Play, review, and let the Book of Scars remind you.',
      },
    },
  ],
};
