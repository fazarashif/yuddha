import { Chess } from 'chess.js';
import type { Lesson, Scene } from './lessons';
import type { L } from './types';

/**
 * Pustaka Pembukaan: an opening library for White and for Black. Each opening explains its ideas,
 * strengths and weaknesses, walks through the main line move by move, shows tips and traps, and ends
 * with a drill that replays the lines from memory.
 */

/** A move of the learner, with the question asked before it and the reason given after it. */
type Own = [san: string, ask: L, why: L];
/** The other side's moves are plain SAN. */
type Step = string | Own;

const uciOf = (m: { from: string; to: string; promotion?: string }) => `${m.from}${m.to}${m.promotion ?? ''}`;

/**
 * Turns a line into move scenes. The learner plays their own moves, and the other side's next move
 * is shown on the board as the reply. Building it with chess.js means an illegal line fails loudly.
 */
function walk(steps: Step[]): Scene[] {
  const c = new Chess();
  const scenes: Scene[] = [];
  let last: string | undefined;
  steps.forEach((step, i) => {
    if (typeof step === 'string') {
      last = uciOf(c.move(step));
      return;
    }
    const [san, ask, why] = step;
    const fen = c.fen();
    const uci = uciOf(c.move(san));
    const next = steps[i + 1];
    const reply = typeof next === 'string' ? uciOf(new Chess(c.fen()).move(next)) : undefined;
    scenes.push({
      kind: 'move',
      fen,
      last,
      accept: [uci],
      hint: uci,
      reply,
      text: ask,
      right: why,
      wrong: { id: `Langkah buku di sini adalah ${san}. Coba lagi, atau minta petunjuk Nyala.`, en: `The book move here is ${san}. Try again, or ask Nyala for a hint.` },
    });
    last = undefined;
  });
  return scenes;
}

/** The position after a line of SAN moves. */
const after = (moves: string) => {
  const c = new Chess();
  for (const san of moves.split(/\s+/)) c.move(san);
  return c.fen();
};

export interface OpeningInfo {
  side: 'w' | 'b';
  /** One or two words on the character of the opening. */
  style: L;
}

/* Italian Game ------------------------------------------------------------------------------ */

const italian: Lesson = {
  id: 'p-italian',
  title: { id: 'Italian Game', en: 'Italian Game' },
  blurb: { id: '1.e4 untuk Putih: kembangkan cepat, bidik f7, siapkan d4.', en: '1.e4 for White: develop fast, aim at f7, prepare d4.' },
  scenes: [
    {
      kind: 'say',
      fen: after('e4 e5 Nf3 Nc6 Bc4'),
      marks: { c4: 'good', f7: 'target' },
      text: {
        id: 'Italian Game, salah satu pembukaan tertua yang masih dimainkan para juara dunia. Idenya sederhana: Kuda dan Gajah keluar secepat mungkin, Gajah c4 membidik f7, Raja rokade, lalu Pion d maju ke d4 saat waktunya tepat.',
        en: 'The Italian Game, one of the oldest openings still played by world champions. The idea is simple: knight and bishop come out as fast as possible, the c4 bishop aims at f7, the king castles, then the d pawn advances to d4 when the time is right.',
      },
    },
    {
      kind: 'say',
      text: {
        id: 'Kelebihan:\n• Rencananya alami dan mudah diingat: kembangkan, rokade, lalu d4.\n• Gajah c4 membidik f7, petak terlemah Hitam.\n• Dimainkan dari pemula sampai Grandmaster, jadi bahan belajarnya tak habis.',
        en: 'Strengths:\n• The plan is natural and easy to remember: develop, castle, then d4.\n• The c4 bishop aims at f7, Black\'s weakest square.\n• Played from beginners to Grandmasters, so there is always more to learn.',
      },
    },
    {
      kind: 'say',
      text: {
        id: 'Kekurangan:\n• Hitam yang tahu caranya bisa menyamakan posisi tanpa banyak risiko.\n• Versi tenang dengan d3 lambat dan butuh kesabaran.\n• Menyerang f7 terlalu cepat sering hanya membuang waktu.',
        en: 'Weaknesses:\n• A Black player who knows the ideas can equalise without much risk.\n• The quiet version with d3 is slow and needs patience.\n• Attacking f7 too early often just wastes time.',
      },
    },
    ...walk([
      ['e4', { id: 'Langkah pertama: rebut pusat dan buka jalan untuk Gajah dan Menteri.', en: 'Move one: take the centre and open lines for the bishop and queen.' }, { id: 'e4 menguasai d5 dan f5, dan membuka diagonal untuk Gajah f1 dan Menteri.', en: 'e4 controls d5 and f5 and opens diagonals for the f1 bishop and the queen.' }],
      'e5',
      ['Nf3', { id: 'Kembangkan Kuda sambil menyerang Pion e5.', en: 'Develop the knight while attacking the e5 pawn.' }, { id: 'Kuda f3 menyerang e5 dan membuka jalan untuk rokade.', en: 'The f3 knight attacks e5 and clears the way for castling.' }],
      'Nc6',
      ['Bc4', { id: 'Inilah langkah yang memberi nama Italian Game: Gajah ke petak yang membidik f7.', en: 'This is the move that names the Italian Game: the bishop goes to the square aiming at f7.' }, { id: 'Dari c4 Gajah membidik f7, yang hanya dijaga Raja hitam.', en: 'From c4 the bishop aims at f7, which only the black king guards.' }],
      'Bc5',
      ['c3', { id: 'Siapkan d4. Pion mana yang membantunya?', en: 'Prepare d4. Which pawn helps?' }, { id: 'c3 menyiapkan d4 untuk merebut pusat, dan memberi Gajah petak mundur di c2 kelak.', en: 'c3 prepares d4 to take the centre, and later gives the bishop a retreat on c2.' }],
      'Nf6',
      ['d3', { id: 'Kuda hitam menyerang e4. Jaga dengan tenang.', en: 'The black knight attacks e4. Guard it calmly.' }, { id: 'd3 menjaga e4. Versi tenang ini, Giuoco Pianissimo, adalah favorit para Grandmaster masa kini: d4 disimpan untuk nanti.', en: 'd3 guards e4. This quiet version, the Giuoco Pianissimo, is a favourite of today\'s Grandmasters: d4 is saved for later.' }],
      'd6',
      ['O-O', { id: 'Amankan Raja.', en: 'Make the king safe.' }, { id: 'Rokade. Raja aman, Benteng siap bergabung.', en: 'Castled. The king is safe and the rook is ready to join in.' }],
      'O-O',
      ['Re1', { id: 'Bawa Benteng ke garis e.', en: 'Bring the rook to the e file.' }, { id: 'Benteng e1 menjaga e4 dan mendukung d4 nanti.', en: 'The e1 rook guards e4 and will support d4 later.' }],
      'a6',
      ['Bb3', { id: 'Hitam bersiap mengusir Gajahmu dengan ...b5. Mundurlah lebih dulu.', en: 'Black is preparing to chase your bishop with ...b5. Step back first.' }, { id: 'Di b3 Gajah tetap membidik f7 dan aman dari Pion b hitam.', en: 'On b3 the bishop still aims at f7 and is safe from the black b pawn.' }],
      'Ba7',
      ['h3', { id: 'Satu langkah profilaksis: tutup petak g4 dari Gajah dan Kuda hitam.', en: 'One prophylactic move: keep the black bishop and knight off g4.' }, { id: 'h3 menutup g4. Rencana berikutnya: Kuda b1 ke d2, f1, lalu g3, Pion a ke a4 melawan ...b5, dan d4 saat semuanya siap.', en: 'h3 covers g4. Next: the b1 knight goes to d2, f1 and g3, the a pawn to a4 against ...b5, and d4 once everything is ready.' }],
    ]),
    {
      kind: 'quiz',
      fen: after('e4 e5 Nf3 Nc6 Bc4 Nf6'),
      marks: { f7: 'target', g5: 'good' },
      text: { id: 'Hitam kadang menjawab 3...Nf6 (Two Knights Defense). Bolehkah 4.Ng5 langsung menyerang f7?', en: 'Black sometimes answers 3...Nf6 (the Two Knights Defense). May White attack f7 at once with 4.Ng5?' },
      options: [
        { id: 'Tidak boleh, itu blunder', en: 'No, it is a blunder' },
        { id: 'Boleh, tapi Hitam yang tahu jawabannya mendapat permainan aktif', en: 'Yes, but a Black player who knows the answer gets active play' },
      ],
      correct: 1,
      explain: {
        id: 'Setelah 4...d5 5.exd5, jawaban terbaik Hitam adalah 5...Na5 dengan korban Pion untuk serangan. Tapi di tingkat ini banyak yang memakan 5...Nxd5?, dan di situlah Fried Liver menunggu.',
        en: 'After 4...d5 5.exd5 Black\'s best is 5...Na5, giving a pawn for activity. But at this level many players take 5...Nxd5?, and that is where the Fried Liver is waiting.',
      },
    },
    {
      kind: 'move',
      fen: after('e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5 Nxd5'),
      last: 'f6d5',
      accept: ['g5f7'],
      hint: 'g5f7',
      reply: 'e8f7',
      marks: { f7: 'target' },
      text: { id: 'Hitam memakan 5...Nxd5?. Korbankan Kudamu di f7: ini Fried Liver Attack.', en: 'Black has taken 5...Nxd5?. Sacrifice your knight on f7: the Fried Liver Attack.' },
      right: { id: 'Benteng dan Menteri hitam diserang, jadi Raja terpaksa memakan.', en: 'The black queen and rook are attacked, so the king has to take.' },
      wrong: { id: 'Kuda g5 memakan Pion f7.', en: 'The g5 knight takes the f7 pawn.' },
    },
    {
      kind: 'move',
      fen: after('e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5 Nxd5 Nxf7 Kxf7'),
      last: 'e8f7',
      accept: ['d1f3'],
      hint: 'd1f3',
      reply: 'f7e6',
      text: { id: 'Skak dengan Menteri, sekaligus menyerang Kuda d5.', en: 'Check with the queen, hitting the d5 knight at the same time.' },
      right: { id: 'Raja hitam terpaksa maju ke e6 untuk menjaga Kudanya, dan sekarang ia berjalan di tengah papan. Lanjutkan dengan Nc3 dan d4: serangannya berbahaya dan dalam partai cepat sering menang.', en: 'The black king has to step up to e6 to keep his knight, and now he is walking in the middle of the board. Continue with Nc3 and d4: the attack is dangerous and often wins in fast games.' },
      wrong: { id: 'Menteri ke f3, skak.', en: 'Queen to f3, check.' },
    },
    {
      kind: 'say',
      text: {
        id: 'Tips:\n• Jangan terburu-buru d4 sebelum c3, Re1, dan rokade siap. Pusat yang terbuka terlalu cepat menguntungkan Hitam.\n• Kalau Hitam memaku Kuda f3 dengan ...Bg4, h3 mengusirnya.\n• Lawan di level ini sering memakai Gajah hitam ke c5 lalu bermain ...Ng4: jaga f2 dengan rokade dan Re1.',
        en: 'Tips:\n• Do not rush d4 before c3, Re1 and castling are ready. A centre opened too early favours Black.\n• If Black pins the f3 knight with ...Bg4, h3 sends it away.\n• Opponents at this level often bring the bishop to c5 and play ...Ng4: castling and Re1 keep f2 safe.',
      },
    },
    {
      kind: 'drill',
      side: 'w',
      text: { id: 'Latihan hafalan. Mainkan langkah-langkah buku sebagai Putih. Hitam akan memilih salah satu variasi yang sudah kita pelajari.', en: 'Memory drill. Play the book moves as White. Black will choose one of the variations we covered.' },
      lines: [
        'e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d3 d6 O-O O-O Re1 a6 Bb3 Ba7 h3',
        'e4 e5 Nf3 Nc6 Bc4 Nf6 d3 Bc5 c3 d6 O-O O-O Re1 a6 Bb3 Ba7 h3',
        'e4 e5 Nf3 Nc6 Bc4 Nf6 d3 Be7 O-O O-O Re1 d6 c3',
      ],
      right: { id: 'Hafalanmu utuh. Ingat, yang terpenting idenya: kembangkan, rokade, Re1, h3, lalu d4.', en: 'Your memory holds. Remember, the ideas matter most: develop, castle, Re1, h3, then d4.' },
    },
  ],
};

/* London System ----------------------------------------------------------------------------- */

const london: Lesson = {
  id: 'p-london',
  title: { id: 'London System', en: 'London System' },
  blurb: { id: '1.d4 untuk Putih: satu susunan kokoh melawan hampir semua jawaban.', en: '1.d4 for White: one solid setup against almost anything.' },
  scenes: [
    {
      kind: 'say',
      fen: after('d4 d5 Bf4 Nf6 e3 e6 Nf3 c5 c3 Nc6 Nbd2 Bd6 Bg3 O-O Bd3'),
      marks: { d4: 'good', e3: 'good', c3: 'good', g3: 'good', d3: 'good' },
      text: {
        id: 'London System: 1.d4, lalu Gajah ke f4, Pion ke e3 dan c3, Kuda ke f3 dan d2, Gajah ke d3. Ini susunan akhirnya. Hampir sama melawan apa pun yang dimainkan Hitam.',
        en: 'The London System: 1.d4, then bishop to f4, pawns to e3 and c3, knights to f3 and d2, bishop to d3. This is the final setup, and it barely changes whatever Black plays.',
      },
    },
    {
      kind: 'say',
      text: {
        id: 'Kelebihan:\n• Satu susunan untuk hampir semua jawaban, jadi hafalannya sedikit.\n• Kokoh: rantai Pion c3, d4, e3 sulit diserang.\n• Gajah petak gelap keluar sebelum e3, jadi tidak terkurung.',
        en: 'Strengths:\n• One setup for almost every reply, so there is little to memorise.\n• Solid: the c3, d4, e3 pawn chain is hard to attack.\n• The dark-squared bishop comes out before e3, so it is never locked in.',
      },
    },
    {
      kind: 'say',
      text: {
        id: 'Kekurangan:\n• Kurang menekan; Hitam yang tahu caranya mudah menyamakan.\n• Pion b2 kadang jadi sasaran Menteri hitam dari b6.\n• Karena terasa otomatis, kau bisa lupa memperhatikan rencana lawan.',
        en: 'Weaknesses:\n• Not very ambitious; a Black player who knows the ideas equalises easily.\n• The b2 pawn is sometimes a target for a black queen on b6.\n• Because it feels automatic, you can forget to watch your opponent\'s plans.',
      },
    },
    ...walk([
      ['d4', { id: 'Rebut pusat dengan Pion d.', en: 'Take the centre with the d pawn.' }, { id: 'd4 sudah dijaga Menteri, jadi lebih aman daripada e4.', en: 'd4 is already guarded by the queen, so it is safer than e4.' }],
      'd5',
      ['Bf4', { id: 'Ciri khas London: Gajah petak gelap keluar lebih dulu.', en: 'The London trademark: the dark-squared bishop comes out first.' }, { id: 'Kalau e3 dimainkan dulu, Gajah ini terkurung di balik Pionnya sendiri.', en: 'If e3 came first, this bishop would be locked behind its own pawn.' }],
      'Nf6',
      ['e3', { id: 'Sekarang buka jalan untuk Gajah f1.', en: 'Now open the way for the f1 bishop.' }, { id: 'e3 menopang d4 dan membuka diagonal Gajah f1.', en: 'e3 supports d4 and opens the f1 bishop\'s diagonal.' }],
      'e6',
      ['Nf3', { id: 'Kembangkan Kuda raja.', en: 'Develop the king\'s knight.' }, { id: 'Kuda f3 menjaga d4 dan e5.', en: 'The f3 knight guards d4 and e5.' }],
      'c5',
      ['c3', { id: 'Hitam menyerang d4 dengan ...c5. Topang dengan Pion.', en: 'Black attacks d4 with ...c5. Support it with a pawn.' }, { id: 'c3 menyelesaikan rantai Pion. Kalau Hitam menukar di d4, Pion c memakan balik dan pusatmu tetap utuh.', en: 'c3 completes the pawn chain. If Black trades on d4, the c pawn takes back and your centre stays intact.' }],
      'Nc6',
      ['Nbd2', { id: 'Kuda yang lain keluar, tapi bukan ke c3.', en: 'The other knight comes out, but not to c3.' }, { id: 'Di c3 Kuda menghalangi Pion c. Dari d2 ia menjaga e4 dan bisa ke f3 atau e5.', en: 'On c3 the knight would block the c pawn. From d2 it guards e4 and can go to f3 or e5.' }],
      'Bd6',
      ['Bg3', { id: 'Gajahmu ditantang ...Bd6. Jangan tukar, mundur sedikit.', en: 'Your bishop is challenged by ...Bd6. Do not trade, step back a little.' }, { id: 'Di g3 Gajah tetap aktif. Kalau Hitam menukar di g3, Pion h memakan balik dan garis h terbuka untuk Bentengmu.', en: 'On g3 the bishop stays active. If Black trades on g3, the h pawn takes back and the h file opens for your rook.' }],
      'O-O',
      ['Bd3', { id: 'Gajah terakhir keluar, membidik h7.', en: 'The last bishop comes out, aiming at h7.' }, { id: 'Semua bidak ringan sudah keluar. Berikutnya rokade, lalu Kuda ke e5 dan Menteri ke f3 atau h5 untuk menekan Raja hitam.', en: 'All minor pieces are out. Next: castle, then knight to e5 and queen to f3 or h5 to press on the black king.' }],
    ]),
    {
      kind: 'move',
      fen: after('d4 d5 Bf4 c5 e3 Nc6 c3 Qb6'),
      last: 'd8b6',
      accept: ['d1b3'],
      hint: 'd1b3',
      marks: { b2: 'danger', b6: 'bad' },
      text: { id: 'Senjata Hitam yang paling sering: Menteri ke b6 menyerang b2. Jaga b2, dan tantang Menteri hitam sekaligus.', en: 'Black\'s most common weapon: the queen goes to b6 to hit b2. Guard b2 and challenge the black queen at the same time.' },
      right: { id: 'Menteri b3 menjaga b2 dan menawarkan tukar. Kalau Hitam menukar, Pion a memakan balik dan garis a terbuka untuk Bentengmu.', en: 'The b3 queen guards b2 and offers a trade. If Black trades, the a pawn takes back and the a file opens for your rook.' },
      wrong: { id: 'Menteri ke b3: menjaga b2 dan menghadang Menteri hitam.', en: 'Queen to b3: guarding b2 and facing the black queen.' },
    },
    {
      kind: 'say',
      fen: after('d4 d5 Bf4 c5 e3 Qb6 Nc3'),
      marks: { b2: 'target', c3: 'good' },
      text: {
        id: 'Sekarang jebakan. Di sini Hitam main ...Qb6 sebelum ...Nc6, dan Putih justru membiarkan b2 dengan Nc3. Kalau Menteri hitam serakah memakan b2, ia jauh dari rumah.',
        en: 'Now a trap. Here Black played ...Qb6 before ...Nc6, and White simply leaves b2 hanging with Nc3. If the greedy black queen takes on b2, she is far from home.',
      },
    },
    {
      kind: 'move',
      fen: after('d4 d5 Bf4 c5 e3 Qb6 Nc3 Qxb2'),
      last: 'b6b2',
      accept: ['c3d5', 'c3b5'],
      hint: 'c3d5',
      marks: { c7: 'target', a8: 'target', e8: 'target' },
      text: { id: 'Menteri hitam sudah memakan b2. Hukum: cari lompatan Kuda yang mengancam fork di c7.', en: 'The black queen has taken on b2. Punish it: find the knight jump that threatens a fork on c7.' },
      right: { id: 'Kuda mengancam masuk ke c7 dengan fork Raja dan Benteng, dan Menteri hitam terlalu jauh untuk membantu. Putih unggul besar.', en: 'The knight threatens to land on c7, forking king and rook, and the black queen is too far away to help. White is clearly winning.' },
      wrong: { id: 'Kuda c3 melompat ke d5 atau b5, dua-duanya membidik c7.', en: 'The c3 knight jumps to d5 or b5, both aiming at c7.' },
    },
    {
      kind: 'say',
      text: {
        id: 'Tips:\n• Urutannya penting: Bf4 sebelum e3.\n• Melawan Hitam yang memasang Gajah di g7, mainkan h3 supaya Gajah f4 punya petak mundur di h2.\n• Kuda ke e5 lalu f4 adalah rencana menyerang yang umum, setelah rokade.',
        en: 'Tips:\n• The order matters: Bf4 before e3.\n• Against a bishop on g7, play h3 so the f4 bishop can retreat to h2.\n• Knight to e5 followed by f4 is a common attacking plan once you have castled.',
      },
    },
    {
      kind: 'drill',
      side: 'w',
      text: { id: 'Latihan hafalan sebagai Putih. Hitam akan memilih salah satu jawaban yang sudah kita bahas.', en: 'Memory drill as White. Black will choose one of the answers we covered.' },
      lines: [
        'd4 d5 Bf4 Nf6 e3 e6 Nf3 c5 c3 Nc6 Nbd2 Bd6 Bg3 O-O Bd3',
        'd4 Nf6 Bf4 g6 e3 Bg7 Nf3 O-O Be2 d6 h3',
        'd4 d5 Bf4 c5 e3 Nc6 c3 Qb6 Qb3',
      ],
      right: { id: 'Susunan London sudah di tanganmu. Satu pola, banyak lawan.', en: 'The London setup is in your hands. One pattern, many opponents.' },
    },
  ],
};

/* 1...e5 for Black -------------------------------------------------------------------------- */

const openGame: Lesson = {
  id: 'p-e5',
  title: { id: '1...e5 untuk Hitam', en: '1...e5 for Black' },
  blurb: { id: 'Jawaban klasik untuk 1.e4: Italian, Ruy Lopez, Scotch, dan Fried Liver.', en: 'The classical answer to 1.e4: the Italian, Ruy Lopez, Scotch and Fried Liver.' },
  scenes: [
    {
      kind: 'say',
      fen: after('e4 e5'),
      orient: 'b',
      text: {
        id: 'Menjawab 1.e4 dengan 1...e5 adalah cara paling klasik: kau merebut bagian pusat yang sama. Setelah itu tugasmu sama dengan Putih: kembangkan bidak, rokade, dan jangan tinggalkan f7 tanpa penjaga.',
        en: 'Answering 1.e4 with 1...e5 is the most classical way: you claim the same share of the centre. After that your job is the same as White\'s: develop, castle, and never leave f7 unguarded.',
      },
    },
    {
      kind: 'say',
      text: {
        id: 'Kelebihan:\n• Prinsip murni: pusat, pengembangan, rokade.\n• Posisi terbuka mengasah mata taktikmu.\n• Kokoh di semua level, dari pemula sampai kejuaraan dunia.',
        en: 'Strengths:\n• Pure principles: centre, development, castling.\n• Open positions sharpen your tactical eye.\n• Sound at every level, from beginners to world championships.',
      },
    },
    {
      kind: 'say',
      text: {
        id: 'Kekurangan:\n• Putih punya banyak pilihan: Italian, Ruy Lopez, Scotch, dan berbagai gambit. Kau perlu jawaban untuk masing-masing.\n• Ada jebakan tajam, seperti Fried Liver, yang wajib kau kenal.',
        en: 'Weaknesses:\n• White has many choices: the Italian, the Ruy Lopez, the Scotch, and several gambits. You need an answer to each.\n• There are sharp traps, like the Fried Liver, that you must know.',
      },
    },
    ...walk([
      'e4',
      ['e5', { id: 'Balas dengan merebut pusat.', en: 'Reply by taking the centre.' }, { id: 'e5 menguasai d4 dan f4, dan membuka jalan untuk Gajah f8 dan Menteri.', en: 'e5 controls d4 and f4 and opens lines for the f8 bishop and the queen.' }],
      'Nf3',
      ['Nc6', { id: 'Pion e5 diserang. Jaga sambil mengembangkan.', en: 'The e5 pawn is attacked. Guard it while developing.' }, { id: 'Kuda c6 menjaga e5 dan menguasai d4.', en: 'The c6 knight guards e5 and controls d4.' }],
      'Bc4',
      ['Bc5', { id: 'Putih memilih Italian. Balas Gajah dengan Gajah: bidik f2.', en: 'White has chosen the Italian. Answer bishop with bishop: aim at f2.' }, { id: 'Giuoco Piano. Gajahmu membidik f2, titik lemah Putih.', en: 'The Giuoco Piano. Your bishop aims at f2, White\'s weak point.' }],
      'c3',
      ['Nf6', { id: 'Kembangkan Kuda sambil menyerang e4.', en: 'Develop the knight while attacking e4.' }, { id: 'Kuda f6 menyerang e4 dan menjaga Rajamu.', en: 'The f6 knight attacks e4 and guards your king.' }],
      'd3',
      ['d6', { id: 'Topang e5 dan buka jalan untuk Gajah c8.', en: 'Support e5 and open the way for the c8 bishop.' }, { id: 'd6 membuat e5 kokoh. Pusatmu tidak akan mudah runtuh.', en: 'd6 makes e5 solid. Your centre will not collapse easily.' }],
      'O-O',
      ['O-O', { id: 'Amankan Rajamu.', en: 'Make your king safe.' }, { id: 'Rokade. Sekarang kedua pihak siap untuk babak tengah.', en: 'Castled. Both sides are now ready for the middlegame.' }],
      'Re1',
      ['a6', { id: 'Siapkan tempat mundur untuk Gajahmu sebelum Putih mengusirnya dengan d4 atau b4.', en: 'Prepare a retreat for your bishop before White chases it with d4 or b4.' }, { id: 'Setelah ...a6, Gajah bisa mundur ke a7 dan tetap membidik f2.', en: 'After ...a6 the bishop can drop back to a7 and keep aiming at f2.' }],
      'Bb3',
      ['Ba7', { id: 'Pindahkan Gajah ke tempat aman yang sudah kau siapkan.', en: 'Move the bishop to the safe square you prepared.' }, { id: 'Di a7 Gajah aman dari d4 dan b4, dan masih membidik f2.', en: 'On a7 the bishop is safe from d4 and b4 and still aims at f2.' }],
      'h3',
      ['h6', { id: 'Putih menutup g4. Lakukan hal yang sama untuk g5.', en: 'White has covered g4. Do the same for g5.' }, { id: 'h6 mencegah Gajah putih ke g5. Posisinya seimbang dan sehat.', en: 'h6 keeps the white bishop off g5. The position is balanced and healthy.' }],
    ]),
    {
      kind: 'move',
      fen: after('e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5'),
      orient: 'b',
      last: 'e4d5',
      accept: ['c6a5'],
      hint: 'c6a5',
      marks: { f7: 'danger' },
      text: { id: 'Kalau kau memilih 3...Nf6 dan Putih menyerang dengan 4.Ng5, mainkan 4...d5. Setelah 5.exd5, jangan memakan balik dengan Kuda. Ada langkah yang lebih aman.', en: 'If you choose 3...Nf6 and White attacks with 4.Ng5, play 4...d5. After 5.exd5, do not take back with the knight. There is a safer move.' },
      right: { id: 'Kuda menyerang Gajah c4. Kau memberikan satu Pion, tapi bidakmu cepat aktif dan Putih harus membuang waktu.', en: 'The knight attacks the c4 bishop. You give a pawn, but your pieces get active quickly and White must spend time.' },
      wrong: { id: 'Kuda c6 ke a5, menyerang Gajah c4.', en: 'Knight from c6 to a5, attacking the c4 bishop.' },
      punish: {
        f6d5: { id: 'Inilah yang ditunggu Putih: Kuda memakan f7 (Fried Liver), dan Rajamu terseret ke tengah papan.', en: 'This is what White is waiting for: the knight takes on f7 (the Fried Liver), and your king is dragged into the middle.' },
      },
    },
    {
      kind: 'quiz',
      fen: after('e4 e5 Nf3'),
      orient: 'b',
      text: { id: 'Banyak pemula menjaga e5 dengan ...f6. Apa akibatnya?', en: 'Many beginners guard e5 with ...f6. What happens?' },
      options: [
        { id: 'Aman, Pion e5 terjaga', en: 'It is fine, e5 is guarded' },
        { id: 'Putih bisa korban Kuda di e5, lalu Menteri ke h5 dengan skak', en: 'White can sacrifice the knight on e5, then play queen to h5 with check' },
      ],
      correct: 1,
      explain: { id: 'Setelah 3.Nxe5 fxe5? 4.Qh5+, Raja hitam diserang dari segala arah. Pion f adalah dinding Raja; jaga e5 dengan ...Nc6 atau ...d6.', en: 'After 3.Nxe5 fxe5? 4.Qh5+ the black king is attacked from every side. The f pawn is the king\'s wall; guard e5 with ...Nc6 or ...d6.' },
    },
    {
      kind: 'say',
      text: {
        id: 'Tips melawan pilihan lain Putih:\n• Ruy Lopez (3.Bb5): 3...a6 4.Ba4 Nf6 5.O-O Be7, lalu ...b5 dan ...d6.\n• Scotch (3.d4): ambil Pionnya, 3...exd4, lalu kembangkan dengan ...Bc5 atau ...Nf6.\n• Ingat Scholar\'s Mate: kalau Menteri putih keluar cepat ke h5 atau f3, jaga f7 dulu.',
        en: 'Tips against White\'s other choices:\n• Ruy Lopez (3.Bb5): 3...a6 4.Ba4 Nf6 5.O-O Be7, then ...b5 and ...d6.\n• Scotch (3.d4): take the pawn, 3...exd4, then develop with ...Bc5 or ...Nf6.\n• Remember Scholar\'s Mate: if the white queen rushes to h5 or f3, guard f7 first.',
      },
    },
    {
      kind: 'drill',
      side: 'b',
      text: { id: 'Latihan hafalan sebagai Hitam. Putih akan memilih Italian, Ruy Lopez, Scotch, atau serangan Ng5.', en: 'Memory drill as Black. White will choose the Italian, the Ruy Lopez, the Scotch, or the Ng5 attack.' },
      lines: [
        'e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d3 d6 O-O O-O Re1 a6 Bb3 Ba7 h3 h6',
        'e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 d6 c3 O-O',
        'e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Bc5 Be3 Qf6 c3 Nge7',
        'e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5 Na5 Bb5+ c6 dxc6 bxc6 Be2 h6 Nf3 e4',
      ],
      right: { id: 'Bagus. Empat jalan Putih, empat jawabanmu.', en: 'Well done. Four roads for White, four answers from you.' },
    },
  ],
};

/* Caro-Kann ----------------------------------------------------------------------------------- */

const caroKann: Lesson = {
  id: 'p-caro',
  title: { id: 'Caro-Kann', en: 'Caro-Kann' },
  blurb: { id: 'Jawaban kokoh untuk 1.e4: Gajah keluar dulu, struktur tanpa kelemahan.', en: 'A solid answer to 1.e4: the bishop comes out first, a structure without weaknesses.' },
  scenes: [
    {
      kind: 'say',
      fen: after('e4 c6 d4 d5'),
      orient: 'b',
      marks: { c6: 'good', d5: 'good' },
      text: {
        id: 'Caro-Kann: 1...c6 lalu 2...d5. Pion c menopang d5 sehingga kau bisa menantang pusat Putih tanpa mengurung Gajah c8. Pilihan para pemain yang suka posisi sehat dan jarang kalah karena jebakan.',
        en: 'The Caro-Kann: 1...c6 then 2...d5. The c pawn supports d5, so you can challenge White\'s centre without locking in the c8 bishop. The choice of players who like healthy positions and rarely lose to traps.',
      },
    },
    {
      kind: 'say',
      text: {
        id: 'Kelebihan:\n• Gajah c8 keluar sebelum ...e6, jadi tidak terkurung seperti di French Defense.\n• Struktur Pion sehat, tanpa kelemahan.\n• Jebakan untuk Hitam sedikit, dan endgame-nya sering lebih enak untuk Hitam.',
        en: 'Strengths:\n• The c8 bishop comes out before ...e6, so it is not locked in as in the French Defense.\n• A healthy pawn structure with no weaknesses.\n• Few traps for Black, and the endgames are often pleasant for Black.',
      },
    },
    {
      kind: 'say',
      text: {
        id: 'Kekurangan:\n• Agak pasif; Putih mendapat sedikit lebih banyak ruang.\n• Peluang menang Hitam lebih kecil daripada pembukaan yang tajam.\n• Kau perlu jawaban untuk tiga sistem Putih: Classical, Advance, dan Exchange.',
        en: 'Weaknesses:\n• Somewhat passive; White gets a little more space.\n• Black\'s winning chances are smaller than in sharp openings.\n• You need answers to three White systems: the Classical, the Advance and the Exchange.',
      },
    },
    ...walk([
      'e4',
      ['c6', { id: 'Siapkan ...d5 dengan Pion c.', en: 'Prepare ...d5 with the c pawn.' }, { id: 'c6 menopang d5 tanpa menghalangi Gajah c8.', en: 'c6 supports d5 without blocking the c8 bishop.' }],
      'd4',
      ['d5', { id: 'Sekarang tantang pusat.', en: 'Now challenge the centre.' }, { id: 'd5 menyerang e4. Putih harus memilih: menjaga, maju, atau menukar.', en: 'd5 attacks e4. White must choose: defend it, push it, or trade it.' }],
      'Nc3',
      ['dxe4', { id: 'Putih menjaga e4 dengan Kuda. Tukar di e4.', en: 'White guards e4 with the knight. Trade on e4.' }, { id: 'Ini Classical Variation, sistem Putih yang paling umum.', en: 'This is the Classical Variation, White\'s most common system.' }],
      'Nxe4',
      ['Bf5', { id: 'Kembangkan Gajah c8 sambil mengusir Kuda.', en: 'Develop the c8 bishop while chasing the knight.' }, { id: 'Gajah keluar sebelum ...e6. Inilah keunggulan utama Caro-Kann.', en: 'The bishop comes out before ...e6. This is the Caro-Kann\'s main advantage.' }],
      'Ng3',
      ['Bg6', { id: 'Gajahmu diserang. Mundur di garis serong yang sama.', en: 'Your bishop is attacked. Step back along the same diagonal.' }, { id: 'Di g6 Gajah tetap membidik pusat dan sisi Raja putih.', en: 'On g6 the bishop still eyes the centre and White\'s kingside.' }],
      'h4',
      ['h6', { id: 'Putih mengancam h5 untuk mengusir Gajahmu ke tempat buruk. Siapkan petak h7.', en: 'White threatens h5 to push your bishop somewhere bad. Prepare the h7 square.' }, { id: 'Setelah ...h6, Gajah punya petak h7 dan tidak bisa terjebak.', en: 'After ...h6 the bishop has h7 and cannot be trapped.' }],
      'Nf3',
      ['Nd7', { id: 'Cegah Kuda putih bertengger di e5.', en: 'Stop the white knight from settling on e5.' }, { id: 'Kuda d7 menjaga e5. Kuda g8 akan menyusul ke f6.', en: 'The d7 knight guards e5. The g8 knight will follow to f6.' }],
      'h5',
      ['Bh7', { id: 'Gajah diusir. Ke mana?', en: 'The bishop is chased. Where to?' }, { id: 'Gajah aman di h7, petak yang kau siapkan dengan ...h6.', en: 'The bishop is safe on h7, the square you prepared with ...h6.' }],
      'Bd3',
      ['Bxd3', { id: 'Putih menantang Gajahmu. Tukar.', en: 'White challenges your bishop. Trade.' }, { id: 'Gajah yang aktif sudah menunaikan tugasnya; menukarnya juga menghilangkan Gajah terbaik Putih.', en: 'Your active bishop has done its job; trading it also removes White\'s best bishop.' }],
      'Qxd3',
      ['e6', { id: 'Baru sekarang Pion e maju.', en: 'Only now does the e pawn advance.' }, { id: 'Struktur kokoh tanpa kelemahan. Berikutnya ...Ngf6, ...Qc7, ...Be7 atau ...Bd6, dan sering rokade panjang.', en: 'A solid structure without weaknesses. Next: ...Ngf6, ...Qc7, ...Be7 or ...Bd6, and often castling long.' }],
    ]),
    {
      kind: 'tap',
      fen: after('e4 c6 d4 d5 Nc3 dxe4 Nxe4 Nd7 Qe2 Ngf6'),
      orient: 'b',
      answers: ['d6'],
      marks: { e2: 'bad', e7: 'danger' },
      text: { id: 'Jebakan terkenal yang wajib kau hindari. Hitam baru saja bermain ...Ngf6?? setelah Putih memasang Menteri di e2. Ketuk petak tempat Kuda putih memberi skakmat.', en: 'A famous trap you must avoid. Black has just played ...Ngf6?? after White put the queen on e2. Tap the square where the white knight gives checkmate.' },
      right: { id: 'Nd6#. Pion e7 terpaku oleh Menteri e2 dan tidak bisa memakan Kuda. Smothered mate di langkah keenam. Jangan main ...Ngf6 selama Menteri putih ada di e2; mainkan ...Ndf6 atau ...e6.', en: 'Nd6#. The e7 pawn is pinned by the e2 queen and cannot take the knight. Smothered mate on move six. Do not play ...Ngf6 while the white queen sits on e2; play ...Ndf6 or ...e6.' },
      wrong: { id: 'Cari petak yang diserang Kuda e4 dan bersebelahan dengan Raja e8.', en: 'Find a square the e4 knight attacks that is next to the king on e8.' },
    },
    {
      kind: 'say',
      text: {
        id: 'Tips untuk sistem lain:\n• Advance (3.e5): keluarkan Gajah dulu, 3...Bf5, lalu ...e6 dan pukul pusat dengan ...c5.\n• Exchange (3.exd5 cxd5): kembangkan dengan ...Nc6, ...Nf6, ...Bg4 atau ...Bf5.\n• Aturan emasnya: Gajah c8 keluar sebelum ...e6.',
        en: 'Tips for the other systems:\n• Advance (3.e5): get the bishop out first, 3...Bf5, then ...e6 and strike the centre with ...c5.\n• Exchange (3.exd5 cxd5): develop with ...Nc6, ...Nf6, ...Bg4 or ...Bf5.\n• The golden rule: the c8 bishop comes out before ...e6.',
      },
    },
    {
      kind: 'drill',
      side: 'b',
      text: { id: 'Latihan hafalan sebagai Hitam. Putih akan memilih Classical, Advance, atau Exchange.', en: 'Memory drill as Black. White will choose the Classical, the Advance or the Exchange.' },
      lines: [
        'e4 c6 d4 d5 Nc3 dxe4 Nxe4 Bf5 Ng3 Bg6 h4 h6 Nf3 Nd7 h5 Bh7 Bd3 Bxd3 Qxd3 e6',
        'e4 c6 d4 d5 e5 Bf5 Nf3 e6 Be2 c5 Be3 cxd4 Nxd4 Ne7',
        'e4 c6 d4 d5 exd5 cxd5 Bd3 Nc6 c3 Nf6 Bf4 Bg4 Qb3 Qd7 Nd2 e6',
      ],
      right: { id: 'Tiga sistem Putih, satu aturan: Gajah dulu, baru ...e6.', en: 'Three White systems, one rule: bishop first, then ...e6.' },
    },
  ],
};

/* Queen's Gambit Declined --------------------------------------------------------------------- */

const qgd: Lesson = {
  id: 'p-qgd',
  title: { id: "Queen's Gambit Declined", en: "Queen's Gambit Declined" },
  blurb: { id: 'Jawaban klasik untuk 1.d4: Pion d5 yang tak tergoyahkan.', en: 'The classical answer to 1.d4: an unshakeable pawn on d5.' },
  scenes: [
    {
      kind: 'say',
      fen: after('d4 d5 c4 e6'),
      orient: 'b',
      marks: { c4: 'bad', d5: 'good', e6: 'good' },
      text: {
        id: "Melawan 1.d4, jawab 1...d5. Kalau Putih menawarkan Pion c4 (Queen's Gambit), tolak dengan 2...e6. Pion d5 kini dijaga kokoh, dan kau mengembangkan bidak dengan tenang.",
        en: "Against 1.d4, answer 1...d5. If White offers the c4 pawn (the Queen's Gambit), decline it with 2...e6. Your d5 pawn is now firmly guarded, and you develop calmly.",
      },
    },
    {
      kind: 'say',
      text: {
        id: 'Kelebihan:\n• Sangat kokoh: Pion d5 sulit digoyang.\n• Rencananya klasik dan jelas: kembangkan, rokade, lalu bebaskan posisi dengan ...c5 atau ...e5.\n• Susunan yang sama juga bagus melawan London System.',
        en: 'Strengths:\n• Very solid: the d5 pawn is hard to shake.\n• Classical, clear plans: develop, castle, then free your game with ...c5 or ...e5.\n• The same setup also works well against the London System.',
      },
    },
    {
      kind: 'say',
      text: {
        id: 'Kekurangan:\n• Gajah c8 terkurung di balik ...e6. Ini masalah utama QGD.\n• Pasif; Putih punya sedikit lebih banyak ruang.\n• Kemenangan Hitam butuh kesabaran.',
        en: 'Weaknesses:\n• The c8 bishop is shut in behind ...e6. This is the QGD\'s main problem.\n• Passive; White has a little more space.\n• Winning as Black takes patience.',
      },
    },
    ...walk([
      'd4',
      ['d5', { id: 'Rebut bagian pusatmu.', en: 'Take your share of the centre.' }, { id: 'd5 menghentikan e4 dan menguasai c4 dan e4.', en: 'd5 stops e4 and controls c4 and e4.' }],
      'c4',
      ['e6', { id: 'Putih menawarkan Pion c4. Tolak dengan menopang d5.', en: 'White offers the c4 pawn. Decline by supporting d5.' }, { id: "Inilah Queen's Gambit Declined. Kalau Putih memakan di d5, Pion e memakan balik dan pusatmu tetap berdiri.", en: "This is the Queen's Gambit Declined. If White takes on d5, the e pawn takes back and your centre stays standing." }],
      'Nc3',
      ['Nf6', { id: 'Kembangkan, dan tambah penjagaan d5.', en: 'Develop, and add a guard to d5.' }, { id: 'Kuda f6 menjaga d5 dan e4.', en: 'The f6 knight guards d5 and e4.' }],
      'Bg5',
      ['Be7', { id: 'Gajah putih memberi pin pada Kudamu ke Menteri. Lepaskan pinnya.', en: 'The white bishop pins your knight to the queen. Break the pin.' }, { id: 'Gajah e7 berdiri di antara, jadi Kuda f6 bebas lagi.', en: 'The e7 bishop now stands in between, so the f6 knight is free again.' }],
      'e3',
      ['O-O', { id: 'Amankan Rajamu.', en: 'Make your king safe.' }, { id: 'Rokade. Raja aman sebelum babak tengah dimulai.', en: 'Castled. The king is safe before the middlegame begins.' }],
      'Nf3',
      ['h6', { id: 'Tanya Gajah g5: tukar, atau mundur?', en: 'Ask the g5 bishop: trade, or retreat?' }, { id: 'Kalau Gajah mundur ke h4, langkah ...g5 kadang bisa memutus garisnya. Kalau ditukar, kau mendapat sepasang Gajah.', en: 'If the bishop retreats to h4, ...g5 can sometimes cut it off later. If it trades, you get the bishop pair.' }],
      'Bh4',
      ['b6', { id: 'Sekarang selesaikan masalah terbesar QGD: beri Gajah c8 jalan keluar.', en: 'Now solve the QGD\'s biggest problem: give the c8 bishop a way out.' }, { id: 'Gajah akan keluar ke b7. Ini Tartakower Variation, dimainkan juara dunia dari Spassky sampai Carlsen.', en: 'The bishop will come out to b7. This is the Tartakower Variation, played by world champions from Spassky to Carlsen.' }],
    ]),
    {
      kind: 'say',
      fen: after('d4 d5 c4 e6 Nc3 Nf6 Bg5 Nbd7 cxd5 exd5'),
      orient: 'b',
      marks: { d5: 'target', c3: 'bad', d7: 'good' },
      text: {
        id: 'Sekarang jebakan yang bisa kau pasang: Elephant Trap. Di sini Hitam memainkan ...Nbd7, dan Pion d5 tampak hanya dijaga Kuda f6 yang terpaku. Putih yang serakah akan memakannya dengan Kuda.',
        en: 'Now a trap you can set: the Elephant Trap. Here Black played ...Nbd7, and the d5 pawn seems guarded only by the pinned f6 knight. A greedy White player will take it with the knight.',
      },
    },
    {
      kind: 'move',
      fen: after('d4 d5 c4 e6 Nc3 Nf6 Bg5 Nbd7 cxd5 exd5 Nxd5'),
      orient: 'b',
      last: 'c3d5',
      accept: ['f6d5'],
      hint: 'f6d5',
      reply: 'g5d8',
      text: { id: 'Putih memakan d5. Makan balik dengan Kuda, walaupun Menterimu akan dimakan.', en: 'White has taken on d5. Take back with the knight, even though your queen will be taken.' },
      right: { id: 'Putih memakan Menterimu. Tapi lihat apa yang terjadi berikutnya.', en: 'White takes your queen. But watch what happens next.' },
      wrong: { id: 'Kuda f6 memakan Kuda d5.', en: 'The f6 knight takes the d5 knight.' },
    },
    {
      kind: 'move',
      fen: after('d4 d5 c4 e6 Nc3 Nf6 Bg5 Nbd7 cxd5 exd5 Nxd5 Nxd5 Bxd8'),
      orient: 'b',
      last: 'g5d8',
      accept: ['f8b4'],
      hint: 'f8b4',
      reply: 'd1d2',
      text: { id: 'Skak dengan Gajah.', en: 'Check with the bishop.' },
      right: { id: 'Putih hanya bisa menutup skak dengan Menteri.', en: 'White can only block the check with the queen.' },
      wrong: { id: 'Gajah f8 ke b4, skak.', en: 'Bishop from f8 to b4, check.' },
    },
    {
      kind: 'move',
      fen: after('d4 d5 c4 e6 Nc3 Nf6 Bg5 Nbd7 cxd5 exd5 Nxd5 Nxd5 Bxd8 Bb4+ Qd2'),
      orient: 'b',
      last: 'd1d2',
      accept: ['b4d2'],
      hint: 'b4d2',
      reply: 'e1d2',
      text: { id: 'Ambil Menteri putih.', en: 'Take the white queen.' },
      right: { id: 'Raja putih memakan balik, lalu Rajamu memakan Gajah d8. Hasil akhirnya: kau unggul satu bidak penuh.', en: 'The white king takes back, then your king takes the d8 bishop. The final count: you are a whole piece up.' },
      wrong: { id: 'Gajah b4 memakan Menteri d2, skak.', en: 'The b4 bishop takes the queen on d2, with check.' },
    },
    {
      kind: 'quiz',
      fen: after('d4 d5 c4 dxc4 e3 b5'),
      orient: 'b',
      text: { id: 'Kalau suatu saat kau memilih memakan Pion c4 (Queen\'s Gambit Accepted), bolehkah menahannya dengan ...b5?', en: 'If you ever choose to take the c4 pawn (the Queen\'s Gambit Accepted), may you hold on to it with ...b5?' },
      options: [
        { id: 'Boleh, Pionnya aman', en: 'Yes, the pawn is safe' },
        { id: 'Jangan: a4 lalu Menteri ke f3 menyerang Benteng a8', en: 'No: a4 and then queen to f3 hits the a8 rook' },
      ],
      correct: 1,
      explain: { id: 'Setelah 4.a4 c6 5.axb5 cxb5 6.Qf3, Benteng a8 terancam dan Hitam kehilangan bidak. Di Queen\'s Gambit, Pion c4 hampir selalu bisa direbut kembali oleh Putih. Jangan memaksakan diri menahannya.', en: 'After 4.a4 c6 5.axb5 cxb5 6.Qf3 the a8 rook is attacked and Black loses material. In the Queen\'s Gambit White can almost always win the c4 pawn back. Do not force yourself to keep it.' },
    },
    {
      kind: 'say',
      text: {
        id: 'Tips:\n• Bebaskan posisimu dengan ...c5 atau ...e5 pada saat yang tepat.\n• Melawan London System, susunan yang sama bekerja: ...d5, ...Nf6, ...e6, ...c5, ...Nc6, ...Bd6.\n• Kalau Putih menukar di d5 (Exchange Variation), Gajah c8 justru mendapat jalan keluar ke f5 atau g4.',
        en: 'Tips:\n• Free your position with ...c5 or ...e5 at the right moment.\n• Against the London System the same setup works: ...d5, ...Nf6, ...e6, ...c5, ...Nc6, ...Bd6.\n• If White trades on d5 (the Exchange Variation), the c8 bishop actually gets a way out to f5 or g4.',
      },
    },
    {
      kind: 'drill',
      side: 'b',
      text: { id: 'Latihan hafalan sebagai Hitam. Putih akan memilih jalur utama, Exchange Variation, urutan dengan Nf3, atau London System.', en: 'Memory drill as Black. White will choose the main line, the Exchange Variation, a move order with Nf3, or the London System.' },
      lines: [
        'd4 d5 c4 e6 Nc3 Nf6 Bg5 Be7 e3 O-O Nf3 h6 Bh4 b6',
        'd4 d5 c4 e6 Nc3 Nf6 cxd5 exd5 Bg5 Be7 e3 O-O Bd3 Nbd7 Qc2 Re8 Nf3 Nf8',
        'd4 d5 c4 e6 Nf3 Nf6 Nc3 Be7 Bg5 h6 Bh4 O-O e3 b6',
        'd4 d5 Bf4 Nf6 e3 c5 c3 Nc6 Nd2 e6 Ngf3 Bd6 Bg3 O-O',
      ],
      right: { id: 'Pion d5-mu berdiri tegak di semua variasi.', en: 'Your d5 pawn stands firm in every variation.' },
    },
  ],
};

/* Choosing a repertoire ----------------------------------------------------------------------- */

const repertoire: Lesson = {
  id: 'p-intro',
  title: { id: 'Memilih Repertoar', en: 'Choosing a Repertoire' },
  blurb: { id: 'Pembukaan mana yang cocok untukmu, dan cara mempelajarinya.', en: 'Which openings suit you, and how to learn them.' },
  scenes: [
    {
      kind: 'say',
      text: {
        id: 'Repertoar adalah kumpulan pembukaan yang kau mainkan: satu untuk Putih, satu jawaban untuk 1.e4, dan satu jawaban untuk 1.d4. Tiga saja sudah cukup sampai rating 1500, bahkan lebih.',
        en: 'A repertoire is the set of openings you play: one for White, one answer to 1.e4, and one answer to 1.d4. Those three are enough to reach 1500, and well beyond.',
      },
    },
    {
      kind: 'quiz',
      text: { id: 'Di tingkat 800 sampai 1500, apa yang paling penting dari sebuah pembukaan?', en: 'Between 800 and 1500, what matters most about an opening?' },
      options: [
        { id: 'Hafal 20 langkah teori', en: 'Knowing 20 moves of theory' },
        { id: 'Mengerti idenya, sehingga tahu harus apa saat lawan keluar dari buku', en: 'Understanding its ideas, so you know what to do when your opponent leaves the book' },
        { id: 'Memilih pembukaan yang paling langka', en: 'Choosing the rarest opening' },
      ],
      correct: 1,
      explain: { id: 'Lawan di tingkat ini hampir selalu keluar dari buku sebelum langkah sepuluh. Yang menyelamatkanmu saat itu adalah ide dan prinsip, bukan hafalan.', en: 'Opponents at this level almost always leave the book before move ten. What saves you then is ideas and principles, not memory.' },
    },
    {
      kind: 'say',
      text: {
        id: 'Saran di Pustaka ini:\n• Putih: Italian Game kalau suka posisi terbuka, London System kalau suka susunan tetap yang kokoh.\n• Hitam melawan 1.e4: 1...e5 kalau suka permainan terbuka, Caro-Kann kalau suka posisi aman.\n• Hitam melawan 1.d4: Queen\'s Gambit Declined.',
        en: 'Suggestions in this library:\n• White: the Italian Game if you like open positions, the London System if you like a fixed, solid setup.\n• Black against 1.e4: 1...e5 if you like open play, the Caro-Kann if you like safe positions.\n• Black against 1.d4: the Queen\'s Gambit Declined.',
      },
    },
    {
      kind: 'say',
      text: {
        id: 'Cara belajar yang paling cepat:\n• Pelajari alur utama dan alasan tiap langkahnya.\n• Ulangi latihan hafalan sampai lancar.\n• Mainkan pembukaan itu di Tanding dan di Chess.com.\n• Setelah partai, buka Ulasan dan cek di langkah ke berapa kau atau lawan keluar dari buku.',
        en: 'The fastest way to learn:\n• Study the main line and the reason for each move.\n• Repeat the memory drill until it flows.\n• Play the opening in Tanding and on Chess.com.\n• After the game, open the Review and check on which move you or your opponent left the book.',
      },
    },
    {
      kind: 'quiz',
      text: { id: 'Lawan memainkan langkah yang tidak ada di bukumu. Apa yang kau lakukan?', en: 'Your opponent plays a move that is not in your book. What do you do?' },
      options: [
        { id: 'Panik, karena hafalan sudah habis', en: 'Panic, because the memorised moves have run out' },
        { id: 'Kembali ke prinsip: periksa ancamannya, lalu kembangkan, rebut pusat, rokade', en: 'Go back to principles: check the threat, then develop, take the centre, castle' },
      ],
      correct: 1,
      explain: { id: 'Langkah di luar buku sering justru lebih lemah. Periksa dulu apa ancamannya, lalu teruskan rencanamu dengan prinsip pembukaan.', en: 'A move outside the book is often weaker. First check what it threatens, then carry on with your plan using opening principles.' },
    },
  ],
};

export const OPENINGS: Lesson[] = [repertoire, italian, london, openGame, caroKann, qgd];

export const OPENING_INFO: Record<string, OpeningInfo> = {
  'p-italian': { side: 'w', style: { id: 'Klasik, terbuka', en: 'Classical, open' } },
  'p-london': { side: 'w', style: { id: 'Kokoh, sistematis', en: 'Solid, systematic' } },
  'p-e5': { side: 'b', style: { id: 'Klasik, terbuka', en: 'Classical, open' } },
  'p-caro': { side: 'b', style: { id: 'Kokoh', en: 'Solid' } },
  'p-qgd': { side: 'b', style: { id: 'Kokoh, klasik', en: 'Solid, classical' } },
};

/** How the library page groups the openings. */
export const OPENING_GROUPS: { title: L; ids: string[] }[] = [
  { title: { id: 'Mulai di sini', en: 'Start here' }, ids: ['p-intro'] },
  { title: { id: 'Untuk Putih', en: 'For White' }, ids: ['p-italian', 'p-london'] },
  { title: { id: 'Untuk Hitam melawan 1.e4', en: 'For Black against 1.e4' }, ids: ['p-e5', 'p-caro'] },
  { title: { id: 'Untuk Hitam melawan 1.d4', en: 'For Black against 1.d4' }, ids: ['p-qgd'] },
];
