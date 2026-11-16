import { matBenteng, matMenteri, pembukaan, polaMat, tukar } from './babak1b';
import type { L, Mood } from './types';

export type SceneMark = 'good' | 'bad' | 'target' | 'danger';

/** How a "move" scene decides that a move passes when no fixed answer fits. */
export type Goal =
  /** No piece of the mover is left hanging; optionally one square must be covered. */
  | { kind: 'safe'; square?: string }
  /** The opponent has no mate in one afterwards. */
  | { kind: 'stopMate' };

interface SceneBase {
  text: L;
  fen?: string;
  orient?: 'w' | 'b';
  marks?: Record<string, SceneMark>;
}

export type Scene =
  | (SceneBase & { kind: 'say'; who?: 'sabda' | 'nyala'; mood?: Mood })
  | (SceneBase & { kind: 'tap'; fen: string; answers: string[]; right: L; wrong: L })
  | (SceneBase & {
      kind: 'move';
      fen: string;
      accept?: string[];
      goal?: Goal;
      right: L;
      wrong: L;
      /** Specific feedback for tempting wrong moves, keyed by UCI. */
      punish?: Record<string, L>;
      hint?: string;
      /** The first accepted move delivers checkmate; checked by the tests. */
      mate?: true;
    })
  | (SceneBase & { kind: 'quiz'; options: L[]; correct: number; explain: L })
  /** Play the position out against the engine until checkmate. */
  | (SceneBase & {
      kind: 'play';
      fen: string;
      /** Moves allowed before the attempt is called off. */
      maxMoves: number;
      right: L;
      stalemate: L;
      tooLong: L;
      /** Shown when the winning material is lost. */
      lost: L;
    });

export interface Lesson {
  id: string;
  title: L;
  blurb: L;
  scenes: Scene[];
}

export interface Chapter {
  n: number;
  title: L;
  range: L;
  lessons: Lesson[];
  /** Lessons planned but not written yet. */
  upcoming: L[];
}

const EMPTY = '4k3/8/8/8/8/8/8/4K3 w - - 0 1';

const wiwitan1: Lesson = {
  id: 'b0-1',
  title: { id: 'Kelir dan Bidaknya', en: 'The Screen and Its Pieces' },
  blurb: { id: 'Papan, Benteng, Gajah, dan Menteri.', en: 'The board, rook, bishop and queen.' },
  scenes: [
    {
      kind: 'say',
      mood: 'happy',
      text: {
        id: 'Selamat datang, Senapati muda. Aku Ki Sabda, dalang tua yang kebanyakan bicara. Layar di depanmu ini Kelir: 64 petak tempat bayangan berperang.',
        en: 'Welcome, young commander. I am Ki Sabda, an old puppeteer who talks too much. The screen before you is the Kelir: 64 squares where shadows go to war.',
      },
    },
    {
      kind: 'say',
      fen: EMPTY,
      text: {
        id: 'Tiap petak punya nama. Huruf a sampai h dari kiri ke kanan, angka 1 sampai 8 dari bawah ke atas. Hurufnya dulu, baru angkanya.',
        en: 'Every square has a name. Letters a to h run left to right, numbers 1 to 8 run bottom to top. Letter first, then number.',
      },
    },
    {
      kind: 'tap',
      fen: EMPTY,
      answers: ['e4'],
      text: { id: 'Ketuk petak e4.', en: 'Tap the square e4.' },
      right: { id: 'Tepat. Petak e4 itu rebutan sejak zaman eyangku.', en: 'Exactly. People have been fighting over e4 since my grandfather was young.' },
      wrong: { id: 'Belum. Cari huruf e di bawah, lalu naik ke baris 4.', en: 'Not yet. Find the letter e at the bottom, then go up to row 4.' },
    },
    {
      kind: 'say',
      fen: '7k/8/8/8/3R4/8/8/K7 w - - 0 1',
      marks: { d1: 'target', d2: 'target', d3: 'target', d5: 'target', d6: 'target', d7: 'target', d8: 'target', a4: 'target', b4: 'target', c4: 'target', e4: 'target', f4: 'target', g4: 'target', h4: 'target' },
      text: {
        id: 'Ini Benteng. Jalannya lurus: maju, mundur, kiri, kanan, sejauh jalannya kosong.',
        en: 'This is the rook. It runs straight: forward, back, left, right, as far as the road is clear.',
      },
    },
    {
      kind: 'move',
      fen: '7k/8/8/8/3R4/8/8/K7 w - - 0 1',
      accept: ['d4d8'],
      hint: 'd4d8',
      text: { id: 'Bawa Benteng ke petak d8, di baris paling atas.', en: 'Drive the rook to d8, on the top row.' },
      right: { id: 'Skak! Benteng membidik Raja lawan. Itu namanya skak.', en: 'Check! The rook is aiming at the enemy king. That is called check.' },
      wrong: { id: 'Benteng memang bisa ke sana, tapi tujuan kita d8.', en: 'The rook can go there, but we are heading for d8.' },
    },
    {
      kind: 'say',
      fen: '7k/8/8/8/3B4/8/8/K7 w - - 0 1',
      marks: { a1: 'target', b2: 'target', c3: 'target', e5: 'target', f6: 'target', g7: 'target', h8: 'target', a7: 'target', b6: 'target', c5: 'target', e3: 'target', f2: 'target', g1: 'target' },
      text: {
        id: 'Ini Gajah. Jalannya serong. Gajah yang lahir di petak gelap akan hidup di petak gelap selamanya. Setia sekali.',
        en: 'This is the bishop. It moves on diagonals. A bishop born on a dark square stays on dark squares for life. Very loyal.',
      },
    },
    {
      kind: 'move',
      fen: '7k/8/5p2/8/3B4/8/8/K7 w - - 0 1',
      accept: ['d4f6'],
      hint: 'd4f6',
      text: { id: 'Ada Pion hitam di f6. Makan dengan Gajahmu.', en: 'There is a black pawn on f6. Take it with your bishop.' },
      right: { id: 'Nyam. Memakan berarti menempati petak lawan dan mengusirnya dari Kelir.', en: 'Tasty. To capture is to land on an enemy square and send its owner off the screen.' },
      wrong: { id: 'Gajah berjalan serong. Ikuti garis miring ke kanan atas.', en: 'The bishop moves diagonally. Follow the line up and to the right.' },
    },
    {
      kind: 'say',
      fen: '7k/8/8/8/3Q4/8/8/K7 w - - 0 1',
      text: {
        id: 'Dan ini Menteri, bidak terkuat. Ia berjalan lurus seperti Benteng dan serong seperti Gajah. Jaga dia baik-baik.',
        en: 'And this is the queen, your strongest piece. She moves straight like a rook and diagonally like a bishop. Guard her well.',
      },
    },
    {
      kind: 'move',
      fen: '7k/8/8/8/3Q4/8/K7/3r4 w - - 0 1',
      accept: ['d4d1'],
      hint: 'd4d1',
      text: { id: 'Benteng hitam di d1 tidak dijaga siapa pun. Ambil.', en: 'The black rook on d1 has no guard at all. Take it.' },
      right: { id: 'Bagus. Benteng gratis itu rezeki, jangan ditolak.', en: 'Good. A free rook is a gift. Never refuse one.' },
      wrong: { id: 'Lihat lurus ke bawah dari Menteri.', en: 'Look straight down from your queen.' },
    },
    {
      kind: 'quiz',
      text: { id: 'Gajah di petak gelap. Bisakah ia pindah ke petak terang?', en: 'A bishop stands on a dark square. Can it ever move to a light square?' },
      options: [
        { id: 'Bisa, kalau jalannya kosong', en: 'Yes, if the way is clear' },
        { id: 'Tidak pernah', en: 'Never' },
      ],
      correct: 1,
      explain: { id: 'Jalan serong selalu berakhir di warna yang sama. Karena itu punya dua Gajah itu berharga.', en: 'A diagonal always ends on the same colour. That is why owning both bishops is worth a lot.' },
    },
    {
      kind: 'say',
      mood: 'happy',
      text: { id: 'Tiga bidak sudah kau kenal. Berikutnya: Kuda yang suka melompat, Raja, dan para Pion.', en: 'You know three of your pieces now. Next: the leaping knight, the king, and the pawns.' },
    },
  ],
};

const wiwitan2: Lesson = {
  id: 'b0-2',
  title: { id: 'Kuda, Raja, dan Pion', en: 'Knight, King and Pawns' },
  blurb: { id: 'Tiga bidak terakhir, skak, dan skakmat.', en: 'The last three pieces, check and checkmate.' },
  scenes: [
    {
      kind: 'say',
      fen: '7k/8/8/8/3N4/8/8/K7 w - - 0 1',
      marks: { b3: 'target', b5: 'target', c2: 'target', c6: 'target', e2: 'target', e6: 'target', f3: 'target', f5: 'target' },
      text: {
        id: 'Ini Kuda. Langkahnya berbentuk huruf L: dua petak lurus, lalu satu ke samping. Hanya dia yang boleh melompati bidak lain.',
        en: 'This is the knight. It moves in an L: two squares straight, then one to the side. It alone may jump over other pieces.',
      },
    },
    {
      kind: 'move',
      fen: '7k/8/4p3/8/3N4/8/8/K7 w - - 0 1',
      accept: ['d4e6'],
      hint: 'd4e6',
      text: { id: 'Lompatkan Kuda untuk memakan Pion di e6.', en: 'Jump the knight to capture the pawn on e6.' },
      right: { id: 'Hop! Kuda memang tidak bisa diam.', en: 'Hop! A horse never could stand still.' },
      wrong: { id: 'Dua petak ke atas, satu ke kanan.', en: 'Two squares up, one to the right.' },
    },
    {
      kind: 'say',
      fen: '7k/8/8/8/3K4/8/8/8 w - - 0 1',
      marks: { c3: 'target', c4: 'target', c5: 'target', d3: 'target', d5: 'target', e3: 'target', e4: 'target', e5: 'target' },
      text: {
        id: 'Raja melangkah satu petak ke segala arah. Ia lambat, tapi tanpa dia semuanya selesai. Raja tidak boleh melangkah ke petak yang diserang lawan.',
        en: 'The king steps one square in any direction. He is slow, but without him everything ends. The king may never step onto a square the enemy attacks.',
      },
    },
    {
      kind: 'say',
      fen: '7k/8/8/8/8/4P3/2P5/K7 w - - 0 1',
      marks: { c3: 'target', c4: 'target', e4: 'target' },
      text: {
        id: 'Pion, prajurit kecil, hanya maju. Satu petak tiap langkah, atau dua petak pada langkah pertamanya. Ia tidak pernah mundur. Berani, atau keras kepala.',
        en: 'The pawn only marches forward. One square at a time, or two on its very first move. It never retreats. Brave, or stubborn.',
      },
    },
    {
      kind: 'move',
      fen: '7k/8/8/8/3p4/4P3/8/K7 w - - 0 1',
      accept: ['e3d4'],
      hint: 'e3d4',
      text: { id: 'Anehnya, Pion memakan secara serong, bukan lurus. Makan Pion hitam di d4.', en: 'Oddly, a pawn captures diagonally, not straight ahead. Take the black pawn on d4.' },
      right: { id: 'Betul. Maju lurus, makan serong.', en: 'Right. March straight, capture diagonally.' },
      wrong: { id: 'Pion memakan satu petak serong ke depan.', en: 'A pawn captures one square diagonally forward.' },
    },
    {
      kind: 'move',
      fen: '7k/4P3/8/8/8/8/8/K7 w - - 0 1',
      accept: ['e7e8q', 'e7e8r'],
      hint: 'e7e8q',
      text: {
        id: 'Pion yang sampai di baris terakhir naik pangkat menjadi bidak lain. Majukan Pion ini dan pilih Menteri.',
        en: 'A pawn that reaches the last row is promoted to another piece. Push this pawn and choose a queen.',
      },
      right: { id: 'Dari prajurit jadi Menteri. Itulah sebabnya Pion yang maju jauh itu berbahaya.', en: 'From foot soldier to queen. That is why a far-advanced pawn is dangerous.' },
      wrong: { id: 'Pilih Menteri, bidak terkuat.', en: 'Choose the queen, the strongest piece.' },
      punish: {
        e7e8b: { id: 'Gajah boleh, tapi Menteri jauh lebih kuat. Coba lagi.', en: 'A bishop is allowed, but a queen is far stronger. Try again.' },
        e7e8n: { id: 'Kuda boleh, tapi Menteri jauh lebih kuat. Coba lagi.', en: 'A knight is allowed, but a queen is far stronger. Try again.' },
      },
    },
    {
      kind: 'say',
      text: {
        id: 'Saat Raja diserang, itu skak. Ia harus lolos: pindah, menghalangi, atau memakan penyerangnya. Kalau tidak ada jalan lolos, itu skakmat, dan lakon selesai.',
        en: 'When a king is attacked, that is check. He must escape: move, block, or capture the attacker. If there is no escape, it is checkmate, and the story ends.',
      },
    },
    {
      kind: 'move',
      fen: '6k1/5ppp/8/8/8/8/8/R5K1 w - - 0 1',
      accept: ['a1a8'],
      hint: 'a1a8',
      text: { id: 'Raja hitam terkurung Pionnya sendiri. Beri skakmat dalam satu langkah.', en: 'The black king is boxed in by his own pawns. Deliver checkmate in one move.' },
      right: { id: 'Skakmat! Raja tidak bisa lari, tidak ada yang menghalangi, tidak ada yang memakan Benteng.', en: 'Checkmate! The king cannot run, nothing can block, nothing can take the rook.' },
      wrong: { id: 'Cari skak di baris paling atas.', en: 'Look for a check on the top row.' },
    },
    {
      kind: 'say',
      mood: 'happy',
      text: {
        id: 'Kau sudah mengenal semua bidak. Ada dua langkah khusus lagi, rokade dan en passant, yang kuceritakan lain waktu. Sekarang, cobalah bertanding melawan Buta Cilik.',
        en: 'You now know every piece. Two special moves remain, castling and en passant, which I will tell another day. For now, try a game against Buta Cilik.',
      },
    },
  ],
};

const mata1: Lesson = {
  id: 'b1-1',
  title: { id: 'Prajurit yang Tertidur', en: 'The Sleeping Soldier' },
  blurb: { id: 'Mengenali dan memakan bidak gantung.', en: 'Spotting and taking loose pieces.' },
  scenes: [
    {
      kind: 'say',
      text: {
        id: 'Di medan Yuddha, prajurit yang berdiri sendirian tanpa kawan adalah prajurit yang tertidur di luar benteng. Kita menyebutnya bidak gantung: diserang, tapi tak ada yang menjaga.',
        en: 'On the field of Yuddha, a soldier standing alone without friends is a soldier asleep outside the fort. We call it a loose piece: attacked, with nobody guarding it.',
      },
    },
    {
      kind: 'say',
      fen: '4k3/8/8/3n4/8/8/8/3RK3 w - - 0 1',
      marks: { d5: 'danger' },
      text: {
        id: 'Lihat Kuda hitam di d5. Benteng putih membidiknya dari d1, dan tak satu pun kawan menjaganya. Itu makanan gratis.',
        en: 'Look at the black knight on d5. The white rook is aiming at it from d1, and not one friend guards it. That is a free meal.',
      },
    },
    {
      kind: 'move',
      fen: '4k3/8/8/3n4/8/8/8/3RK3 w - - 0 1',
      accept: ['d1d5'],
      hint: 'd1d5',
      text: { id: 'Bangunkan dia dengan cara yang tidak sopan. Makan Kuda itu.', en: 'Wake him rudely. Take that knight.' },
      right: { id: 'Tiga poin gratis. Sebagian besar partai di levelmu diputuskan oleh hal sesederhana ini.', en: 'Three points for free. Most games at your level are decided by something this simple.' },
      wrong: { id: 'Benteng berjalan lurus. Lihat ke atas dari d1.', en: 'The rook moves straight. Look upward from d1.' },
    },
    {
      kind: 'say',
      fen: '4k3/8/4p3/3n4/8/8/8/3RK3 w - - 0 1',
      marks: { d5: 'target', e6: 'good' },
      text: {
        id: 'Tapi hati-hati. Di sini Kuda dijaga Pion di e6. Kalau Benteng memakannya, Pion memakan balik. Nilainya: Pion 1, Kuda 3, Gajah 3, Benteng 5, Menteri 9.',
        en: 'But be careful. Here the knight is guarded by the pawn on e6. If the rook takes, the pawn takes back. The values: pawn 1, knight 3, bishop 3, rook 5, queen 9.',
      },
    },
    {
      kind: 'quiz',
      fen: '4k3/8/4p3/3n4/8/8/8/3RK3 w - - 0 1',
      text: { id: 'Benteng (5) memakan Kuda (3), lalu Benteng dimakan Pion. Hasilnya untuk Putih?', en: 'The rook (5) takes the knight (3), then the pawn takes the rook. What is the result for White?' },
      options: [
        { id: 'Untung 3', en: 'Up 3' },
        { id: 'Rugi 2', en: 'Down 2' },
        { id: 'Impas', en: 'Even' },
      ],
      correct: 1,
      explain: { id: 'Dapat 3, kehilangan 5. Bidak yang dijaga bukan bidak gantung.', en: 'You gain 3 and lose 5. A guarded piece is not a loose piece.' },
    },
    {
      kind: 'tap',
      fen: 'r1b1kbnr/pppp1ppp/2n5/4p3/2B1P2q/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1',
      answers: ['h4'],
      text: { id: 'Sekarang di medan yang ramai. Ketuk bidak hitam yang gantung.', en: 'Now on a crowded field. Tap the black piece that is loose.' },
      right: { id: 'Menteri hitam keluar terlalu dini dan berdiri tepat di depan Kudamu.', en: 'The black queen came out too early and is standing right in front of your knight.' },
      wrong: { id: 'Cari bidak hitam yang diserang bidakmu dan tidak dijaga kawannya.', en: 'Look for a black piece that your pieces attack and its friends do not guard.' },
    },
    {
      kind: 'move',
      fen: 'r1b1kbnr/pppp1ppp/2n5/4p3/2B1P2q/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1',
      accept: ['f3h4'],
      hint: 'f3h4',
      text: { id: 'Ambil hadiahnya.', en: 'Collect your prize.' },
      right: { id: 'Sembilan poin. Lawan boleh pulang.', en: 'Nine points. Your opponent may go home.' },
      wrong: { id: 'Ada yang jauh lebih berharga untuk dimakan.', en: 'There is something far more valuable to take.' },
    },
    {
      kind: 'tap',
      fen: 'rnbqk1nr/pppp1ppp/8/4p3/1b2P3/2P2N2/PP1P1PPP/RNBQKB1R w KQkq - 0 1',
      answers: ['b4', 'e5'],
      text: { id: 'Di sini ada dua bidak hitam yang bisa dimakan gratis. Temukan keduanya.', en: 'Here two black pieces can be taken for free. Find both.' },
      right: { id: 'Gajah di b4 dibidik Pion, dan Pion di e5 dibidik Kuda.', en: 'The bishop on b4 is hit by a pawn, and the pawn on e5 is hit by your knight.' },
      wrong: { id: 'Bukan itu. Periksa apa saja yang dibidik Pion dan Kudamu.', en: 'Not that one. Check what your pawns and knight are aiming at.' },
    },
    {
      kind: 'move',
      fen: 'rnbqk1nr/pppp1ppp/8/4p3/1b2P3/2P2N2/PP1P1PPP/RNBQKB1R w KQkq - 0 1',
      accept: ['c3b4'],
      hint: 'c3b4',
      text: { id: 'Dua hidangan, satu langkah. Pilih yang paling mahal.', en: 'Two dishes, one move. Pick the more expensive one.' },
      right: { id: 'Gajah bernilai 3, Pion hanya 1. Selalu ambil yang paling mahal.', en: 'A bishop is worth 3, a pawn only 1. Always take the most valuable.' },
      wrong: { id: 'Itu bukan salah satu dari dua hidangan tadi.', en: 'That is not one of the two dishes.' },
      punish: {
        f3e5: { id: 'Pion memang gratis, tapi Gajah bernilai tiga kali lipat. Coba lagi.', en: 'The pawn is free, but the bishop is worth three times as much. Try again.' },
      },
    },
    {
      kind: 'tap',
      fen: 'r1bqkbnr/1ppp1ppp/p1n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1',
      answers: ['b5'],
      text: { id: 'Sekarang balik arah. Bidak PUTIH mana yang sedang dalam bahaya?', en: 'Now turn it around. Which WHITE piece is in danger?' },
      right: { id: 'Pion kecil di a6 mengancam Gajahmu. Dijaga atau tidak, ditukar dengan Pion tetap rugi.', en: 'The little pawn on a6 threatens your bishop. Guarded or not, trading it for a pawn is a loss.' },
      wrong: { id: 'Lihat langkah terakhir lawan: Pion maju ke a6. Apa yang dibidiknya?', en: 'Look at the last enemy move: a pawn went to a6. What does it aim at?' },
    },
    {
      kind: 'move',
      fen: 'r1bqkbnr/1ppp1ppp/p1n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1',
      goal: { kind: 'safe' },
      hint: 'b5a4',
      text: { id: 'Selamatkan Gajahmu.', en: 'Save your bishop.' },
      right: { id: 'Aman. Menyelamatkan bidak sendiri sama berharganya dengan memakan bidak lawan.', en: 'Safe. Saving your own piece is worth exactly as much as taking one of theirs.' },
      wrong: { id: 'Masih ada bidakmu yang bisa dimakan gratis. Coba lagi.', en: 'One of your pieces can still be taken for free. Try again.' },
    },
    {
      kind: 'say',
      mood: 'happy',
      text: {
        id: 'Mulai hari ini, sebelum melangkah, tanyakan dua hal. Adakah prajurit lawan yang tertidur? Adakah prajuritku yang tertidur? Itu saja sudah menaikkan derajatmu.',
        en: 'From today, before every move, ask two things. Is an enemy soldier asleep? Is one of mine asleep? That alone will raise your standing.',
      },
    },
  ],
};

const mata2: Lesson = {
  id: 'b1-2',
  title: { id: 'Tiga Tanya', en: 'The Three Questions' },
  blurb: { id: 'Skak? Makan? Ancaman? Kebiasaan sebelum melangkah.', en: 'Checks? Captures? Threats? The habit before every move.' },
  scenes: [
    {
      kind: 'say',
      text: {
        id: 'Dalang yang baik tidak asal menggerakkan wayang. Sebelum tiap langkah, aku mengajukan Tiga Tanya: Skak? Makan? Ancaman? Urutannya jangan ditukar.',
        en: 'A good puppeteer never moves a puppet carelessly. Before every move I ask the Three Questions: Checks? Captures? Threats? Keep them in that order.',
      },
    },
    {
      kind: 'move',
      fen: 'r5k1/8/8/8/8/8/8/3QK3 w - - 0 1',
      accept: ['d1d5'],
      hint: 'd1d5',
      text: { id: 'Tanya pertama: adakah skak? Temukan skak yang sekaligus membidik Benteng hitam.', en: 'First question: is there a check? Find the check that also aims at the black rook.' },
      right: { id: 'Raja harus menyingkir, lalu Benteng di a8 jatuh. Skak memaksa lawan, karena itu ia ditanyakan lebih dulu.', en: 'The king must step aside, and then the rook on a8 falls. A check forces the enemy, which is why it comes first.' },
      wrong: { id: 'Cari petak tempat Menteri menyerang Raja dan Benteng bersamaan.', en: 'Find the square where the queen attacks the king and the rook at once.' },
    },
    {
      kind: 'move',
      fen: 'rnbqkb1r/pppp1ppp/8/4p3/4n3/2N2N2/PPPPBPPP/R1BQK2R w KQkq - 0 1',
      accept: ['c3e4'],
      hint: 'c3e4',
      text: { id: 'Tanya kedua: adakah yang bisa dimakan? Di sini ada dua. Ambil yang paling mahal.', en: 'Second question: can I capture something? Here there are two. Take the more valuable.' },
      right: { id: 'Kuda 3 poin, bukan Pion 1 poin.', en: 'A knight for 3 points, not a pawn for 1.' },
      wrong: { id: 'Periksa lagi semua bidak hitam yang dibidik bidakmu.', en: 'Check again every black piece your pieces are aiming at.' },
      punish: {
        f3e5: { id: 'Pion itu gratis, tapi ada Kuda yang juga gratis. Coba lagi.', en: 'That pawn is free, but so is a knight. Try again.' },
      },
    },
    {
      kind: 'quiz',
      fen: '4r1k1/5ppp/8/8/8/1Q6/5PPP/6K1 w - - 0 1',
      marks: { e8: 'danger', e1: 'danger' },
      text: { id: 'Tanya ketiga: apa ancaman lawan? Giliranmu. Apa yang akan Hitam lakukan kalau kau lengah?', en: 'Third question: what does the enemy threaten? It is your move. What will Black do if you drift?' },
      options: [
        { id: 'Memakan Menteri', en: 'Capture the queen' },
        { id: 'Benteng ke e1, skakmat', en: 'Rook to e1, checkmate' },
        { id: 'Tidak ada ancaman', en: 'There is no threat' },
      ],
      correct: 1,
      explain: { id: 'Rajamu terkurung Pionnya sendiri. Ini namanya mat baris belakang, pembunuh nomor satu di level pemula.', en: 'Your king is boxed in by his own pawns. This is the back-rank mate, the number one killer among beginners.' },
    },
    {
      kind: 'move',
      fen: '4r1k1/5ppp/8/8/8/1Q6/5PPP/6K1 w - - 0 1',
      goal: { kind: 'stopMate' },
      hint: 'h2h3',
      text: { id: 'Cegah skakmat itu. Ada beberapa cara.', en: 'Stop that checkmate. There are several ways.' },
      right: { id: 'Selamat. Membuka jendela untuk Raja, atau menjaga petak e1, sama-sama menggagalkan ancaman.', en: 'Safe. Opening a window for the king, or guarding e1, both defuse the threat.' },
      wrong: { id: 'Hitam masih bisa skakmat di e1. Coba lagi.', en: 'Black can still mate on e1. Try again.' },
    },
    {
      kind: 'move',
      fen: 'rnbqkb1r/pppp1ppp/5n2/4p2Q/4P3/8/PPPP1PPP/RNB1KBNR w KQkq - 0 1',
      accept: ['h5e5'],
      hint: 'h5e5',
      text: {
        id: 'Gabungkan ketiganya. Menterimu diserang Kuda. Temukan satu langkah yang menjawab Skak dan Makan sekaligus.',
        en: 'Now all three together. Your queen is attacked by a knight. Find one move that answers Checks and Captures at the same time.',
      },
      right: { id: 'Skak, makan Pion, dan Menteri lolos. Satu langkah, tiga jawaban.', en: 'Check, a pawn captured, and the queen escapes. One move, three answers.' },
      wrong: { id: 'Mulai dari tanya pertama: adakah skak?', en: 'Start with the first question: is there a check?' },
    },
    {
      kind: 'move',
      fen: '6k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1',
      accept: ['d1d8'],
      hint: 'd1d8',
      text: { id: 'Sekali lagi. Skak?', en: 'Once more. Checks?' },
      right: { id: 'Skakmat. Kadang tanya pertama sudah menjawab segalanya.', en: 'Checkmate. Sometimes the first question answers everything.' },
      wrong: { id: 'Adakah skak di baris paling atas?', en: 'Is there a check on the top row?' },
    },
    {
      kind: 'say',
      mood: 'happy',
      text: {
        id: 'Skak, Makan, Ancaman. Ucapkan dalam hati sebelum tiap langkah, sampai jadi kebiasaan. Saat bertanding dengan pemandu, aku akan mengingatkanmu kalau kau lupa.',
        en: 'Checks, Captures, Threats. Say it silently before every move until it becomes habit. In guided games I will remind you whenever you forget.',
      },
    },
  ],
};

const mata3: Lesson = {
  id: 'b1-3',
  title: { id: 'Hitung Penjaga', en: 'Count the Guards' },
  blurb: { id: 'Penyerang lawan penjaga: siapa yang merebut petak.', en: 'Attackers against defenders: who wins the square.' },
  scenes: [
    {
      kind: 'say',
      text: {
        id: 'Tiap petak adalah gerbang. Pihak yang mengirim lebih banyak penyerang daripada jumlah penjaganya akan merebut gerbang itu. Maka belajarlah berhitung.',
        en: 'Every square is a gate. The side that sends more attackers than there are guards will take the gate. So learn to count.',
      },
    },
    {
      kind: 'quiz',
      fen: '4k3/8/4p3/3n4/8/8/6B1/3RK3 w - - 0 1',
      marks: { d5: 'target' },
      text: { id: 'Berapa bidak putih yang menyerang Kuda di d5?', en: 'How many white pieces attack the knight on d5?' },
      options: [
        { id: 'Satu', en: 'One' },
        { id: 'Dua', en: 'Two' },
        { id: 'Tiga', en: 'Three' },
      ],
      correct: 1,
      explain: { id: 'Benteng dari d1 dan Gajah dari g2. Gajah mengintip dari jauh, mudah terlewat.', en: 'The rook from d1 and the bishop from g2. The bishop peeks from afar and is easy to miss.' },
    },
    {
      kind: 'quiz',
      fen: '4k3/8/4p3/3n4/8/8/6B1/3RK3 w - - 0 1',
      marks: { d5: 'target' },
      text: { id: 'Dan berapa bidak hitam yang menjaganya?', en: 'And how many black pieces guard it?' },
      options: [
        { id: 'Satu', en: 'One' },
        { id: 'Dua', en: 'Two' },
        { id: 'Tidak ada', en: 'None' },
      ],
      correct: 0,
      explain: { id: 'Hanya Pion di e6. Dua penyerang lawan satu penjaga: gerbang bisa direbut.', en: 'Only the pawn on e6. Two attackers against one guard: the gate can be taken.' },
    },
    {
      kind: 'move',
      fen: '4k3/8/4p3/3n4/8/8/6B1/3RK3 w - - 0 1',
      accept: ['g2d5'],
      hint: 'g2d5',
      text: { id: 'Rebut gerbangnya. Kirim penyerang yang paling murah lebih dulu.', en: 'Take the gate. Send the cheapest attacker in first.' },
      right: {
        id: 'Gajah makan, Pion makan balik, Benteng makan lagi. Kau dapat Kuda dan Pion (4), kehilangan Gajah (3). Untung satu.',
        en: 'Bishop takes, pawn takes back, rook takes again. You win a knight and a pawn (4) and lose a bishop (3). Up one.',
      },
      wrong: { id: 'Makan Kuda di d5.', en: 'Capture the knight on d5.' },
      punish: {
        d1d5: { id: 'Benteng itu mahal. Kalau ia maju duluan, kau kehilangan 5 untuk dapat 4. Mulai dari yang murah.', en: 'The rook is expensive. If it goes first, you lose 5 to gain 4. Start with the cheap one.' },
      },
    },
    {
      kind: 'quiz',
      fen: '4k3/8/2p1p3/3n4/8/8/6B1/3RK3 w - - 0 1',
      marks: { d5: 'target' },
      text: { id: 'Sekarang Hitam menambah Pion di c6. Dua penyerang, dua penjaga. Makan atau tidak?', en: 'Now Black has added a pawn on c6. Two attackers, two guards. Capture or not?' },
      options: [
        { id: 'Makan', en: 'Capture' },
        { id: 'Jangan', en: 'Do not' },
      ],
      correct: 1,
      explain: { id: 'Penyerang harus lebih banyak daripada penjaga. Kalau sama, penyerang terakhirmu ikut hilang.', en: 'Attackers must outnumber guards. When the count is equal, your last attacker is lost too.' },
    },
    {
      kind: 'quiz',
      fen: 'r2qk2r/ppp2ppp/2nb4/4N3/3P4/8/PPP2PPP/RNBQK2R w KQkq - 0 1',
      marks: { e5: 'danger' },
      text: { id: 'Hitungan yang sama berlaku untuk bidakmu. Kuda di e5: berapa penyerang hitam, berapa penjaga putih?', en: 'The same count applies to your own pieces. The knight on e5: how many black attackers, how many white guards?' },
      options: [
        { id: 'Dua penyerang, satu penjaga', en: 'Two attackers, one guard' },
        { id: 'Satu penyerang, satu penjaga', en: 'One attacker, one guard' },
        { id: 'Dua penyerang, dua penjaga', en: 'Two attackers, two guards' },
      ],
      correct: 0,
      explain: { id: 'Kuda c6 dan Gajah d6 menyerang; hanya Pion d4 yang menjaga. Gerbangmu akan jebol.', en: 'The knight on c6 and bishop on d6 attack; only the pawn on d4 guards. Your gate is about to break.' },
    },
    {
      kind: 'move',
      fen: 'r2qk2r/ppp2ppp/2nb4/4N3/3P4/8/PPP2PPP/RNBQK2R w KQkq - 0 1',
      goal: { kind: 'safe', square: 'e5' },
      hint: 'f2f4',
      text: { id: 'Amankan gerbang e5. Tambah penjaga, tukar penyerang, atau mundur.', en: 'Secure the gate on e5. Add a guard, trade off an attacker, or retreat.' },
      right: { id: 'Hitungannya sekarang seimbang atau lebih baik. Gerbang aman.', en: 'The count is now level or better. The gate holds.' },
      wrong: { id: 'Hitung lagi. Gerbang e5 masih kalah jumlah, atau ada bidakmu yang gantung.', en: 'Count again. The gate on e5 is still outnumbered, or one of your pieces is loose.' },
    },
    {
      kind: 'say',
      mood: 'happy',
      text: {
        id: 'Hitung penyerang, hitung penjaga, mulai dari yang paling murah. Dengan Mata Ksatria seperti ini, Gandarwa Si Gegabah tidak akan menakutkan lagi.',
        en: 'Count the attackers, count the guards, start with the cheapest. With a warrior\'s eye like this, Gandarwa the Reckless will not frighten you any more.',
      },
    },
  ],
};

export const CHAPTERS: Chapter[] = [
  {
    n: 0,
    title: { id: 'Wiwitan', en: 'Beginnings' },
    range: { id: 'Pemula total', en: 'Complete beginner' },
    lessons: [wiwitan1, wiwitan2],
    upcoming: [
      { id: 'Rokade dan En Passant', en: 'Castling and En Passant' },
      { id: 'Remis dan Pat', en: 'Draws and Stalemate' },
    ],
  },
  {
    n: 1,
    title: { id: 'Mata Ksatria', en: 'The Warrior\'s Eye' },
    range: { id: '600 sampai 1000', en: '600 to 1000' },
    lessons: [mata1, mata2, mata3, tukar, polaMat, pembukaan, matMenteri, matBenteng],
    upcoming: [],
  },
  {
    n: 2,
    title: { id: 'Senjata', en: 'Weapons' },
    range: { id: '1000 sampai 1400', en: '1000 to 1400' },
    lessons: [],
    upcoming: [
      { id: 'Garpu', en: 'Forks' },
      { id: 'Pin dan Tusuk', en: 'Pins and Skewers' },
      { id: 'Serangan Terbuka', en: 'Discovered Attacks' },
      { id: 'Menyingkirkan Penjaga', en: 'Removing the Guard' },
      { id: 'Akhir Permainan Pion', en: 'Pawn Endgames' },
    ],
  },
  {
    n: 3,
    title: { id: 'Siasat', en: 'Strategy' },
    range: { id: '1400 sampai 1800', en: '1400 to 1800' },
    lessons: [],
    upcoming: [
      { id: 'Struktur Pion', en: 'Pawn Structure' },
      { id: 'Bidak Aktif', en: 'Active Pieces' },
      { id: 'Serangan Raja', en: 'Attacking the King' },
      { id: 'Akhir Permainan Benteng', en: 'Rook Endgames' },
    ],
  },
  {
    n: 4,
    title: { id: 'Mahayuddha', en: 'The Great War' },
    range: { id: '1800 ke atas', en: '1800 and above' },
    lessons: [],
    upcoming: [
      { id: 'Profilaksis', en: 'Prophylaxis' },
      { id: 'Pengorbanan Posisional', en: 'Positional Sacrifices' },
    ],
  },
];

export const ALL_LESSONS: Lesson[] = CHAPTERS.flatMap((c) => c.lessons);
export const lessonById = (id: string) => ALL_LESSONS.find((l) => l.id === id);

/** The next unfinished lesson at or after the chapter the player started in. */
export function nextLesson(done: Record<string, unknown>, startChapter: number): Lesson | null {
  const ordered = [...CHAPTERS.filter((c) => c.n >= startChapter), ...CHAPTERS.filter((c) => c.n < startChapter)];
  for (const c of ordered) for (const l of c.lessons) if (!done[l.id]) return l;
  return null;
}
