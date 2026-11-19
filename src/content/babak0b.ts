import type { Lesson } from './lessons';

/** Second half of chapter 0 (Wiwitan): the two special moves, and games nobody wins. */

export const langkahRahasia: Lesson = {
  id: 'b0-3',
  title: { id: 'Dua Langkah Rahasia', en: 'Two Secret Moves' },
  blurb: { id: 'Rokade dan en passant.', en: 'Castling and en passant.' },
  scenes: [
    {
      kind: 'say',
      text: {
        id: 'Ada dua langkah yang tidak mengikuti aturan biasa. Yang pertama rokade: satu-satunya langkah di mana dua bidakmu bergerak sekaligus. Gunanya menyembunyikan Raja dan membangunkan Benteng.',
        en: 'Two moves do not follow the usual rules. The first is castling: the only move in which two of your pieces move at once. It hides the king and wakes a rook.',
      },
    },
    {
      kind: 'say',
      fen: '4k3/8/8/8/8/8/8/4K2R w K - 0 1',
      marks: { g1: 'good', f1: 'good' },
      text: {
        id: 'Caranya: Raja melangkah dua petak ke arah Benteng, lalu Benteng melompati Raja dan mendarat tepat di sebelahnya. Di papan ini kau cukup menggeser Raja dua petak, Benteng akan menyusul sendiri.',
        en: 'Here is how: the king steps two squares towards the rook, then the rook hops over him and lands right beside him. On this board you simply move the king two squares and the rook follows by itself.',
      },
    },
    {
      kind: 'move',
      fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4',
      accept: ['e1g1'],
      hint: 'e1g1',
      marks: { g1: 'target' },
      text: { id: 'Kuda dan Gajahmu sudah keluar, jalannya kosong. Lakukan rokade: geser Raja dua petak ke kanan.', en: 'Your knight and bishop are out and the way is clear. Castle: move the king two squares to the right.' },
      right: { id: 'Raja aman di balik tiga Pion, dan Benteng pindah ke tengah. Ini rokade pendek.', en: 'The king is safe behind three pawns and the rook has moved to the middle. This is castling short.' },
      wrong: { id: 'Geser Raja dari e1 langsung ke g1.', en: 'Move the king from e1 straight to g1.' },
    },
    {
      kind: 'move',
      fen: 'r1bqkb1r/ppp2ppp/2np1n2/4p3/4P3/2NPB3/PPPQ1PPP/R3KBNR w KQkq - 0 1',
      accept: ['e1c1'],
      hint: 'e1c1',
      marks: { c1: 'target' },
      text: { id: 'Rokade juga bisa ke sisi Menteri. Raja tetap melangkah dua petak, kali ini ke kiri.', en: 'You can also castle on the queen\'s side. The king still steps two squares, this time to the left.' },
      right: { id: 'Ini rokade panjang. Benteng menempuh jarak lebih jauh dan langsung berdiri di garis tengah.', en: 'This is castling long. The rook travels further and stands on a central file at once.' },
      wrong: { id: 'Geser Raja dari e1 ke c1.', en: 'Move the king from e1 to c1.' },
    },
    {
      kind: 'say',
      text: {
        id: 'Rokade punya syarat. Raja dan Benteng itu belum pernah bergerak. Petak di antara mereka kosong. Dan Raja tidak sedang diskak, tidak melewati, dan tidak mendarat di petak yang diserang lawan.',
        en: 'Castling has conditions. That king and that rook have never moved. The squares between them are empty. And the king is not in check, does not pass through, and does not land on a square the enemy attacks.',
      },
    },
    {
      kind: 'quiz',
      fen: '4k3/8/b7/8/8/8/8/4K2R w K - 0 1',
      marks: { f1: 'danger', a6: 'bad' },
      text: { id: 'Gajah hitam di a6 membidik petak f1. Bolehkah Putih rokade pendek?', en: 'The black bishop on a6 is aiming at f1. May White castle short?' },
      options: [
        { id: 'Boleh', en: 'Yes' },
        { id: 'Tidak boleh', en: 'No' },
      ],
      correct: 1,
      explain: { id: 'Raja harus melewati f1, dan petak itu diserang. Raja tidak boleh melewati bahaya, bahkan sekejap.', en: 'The king would have to pass over f1, and that square is attacked. A king may not pass through danger, not even for a moment.' },
    },
    {
      kind: 'quiz',
      fen: '4k3/8/8/8/1b6/8/8/4K2R w K - 0 1',
      marks: { e1: 'danger', b4: 'bad' },
      text: { id: 'Sekarang Rajamu sedang diskak Gajah di b4. Bolehkah lolos dengan rokade?', en: 'Now your king is in check from the bishop on b4. May he escape by castling?' },
      options: [
        { id: 'Boleh', en: 'Yes' },
        { id: 'Tidak boleh', en: 'No' },
      ],
      correct: 1,
      explain: { id: 'Raja yang sedang diskak tidak boleh rokade. Karena itu, rokadelah lebih awal, sebelum lawan sempat mengganggu.', en: 'A king in check may not castle. So castle early, before your opponent has time to interfere.' },
    },
    {
      kind: 'say',
      fen: '4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 2',
      marks: { d6: 'target', d5: 'bad' },
      text: {
        id: 'Langkah rahasia kedua bernama en passant, bahasa Prancis untuk "sambil lewat". Pion hitam baru saja melompat dua petak dari d7 dan mendarat di sebelah Pionmu. Kau boleh memakannya seolah ia hanya maju satu petak.',
        en: 'The second secret move is called en passant, French for "in passing". The black pawn has just jumped two squares from d7 and landed beside your pawn. You may capture it as if it had moved only one.',
      },
    },
    {
      kind: 'move',
      fen: '4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 2',
      accept: ['e5d6'],
      hint: 'e5d6',
      marks: { d6: 'target' },
      text: { id: 'Pionmu melangkah serong ke d6, petak di belakang Pion hitam. Coba.', en: 'Your pawn steps diagonally to d6, the square behind the black pawn. Try it.' },
      right: { id: 'Pion hitam di d5 lenyap, padahal Pionmu tidak pernah mendarat di petaknya. Hanya Pion yang bisa melakukan ini, dan hanya kepada Pion.', en: 'The black pawn on d5 is gone, though your pawn never landed on its square. Only a pawn can do this, and only to a pawn.' },
      wrong: { id: 'Pindahkan Pion e5 ke d6.', en: 'Move the e5 pawn to d6.' },
    },
    {
      kind: 'quiz',
      fen: '4k3/8/8/3pP3/8/8/8/4K3 w - - 0 3',
      text: { id: 'Posisinya tampak sama, tapi Pion hitam sudah berdiri di d5 sejak beberapa langkah lalu. Masih bolehkah en passant?', en: 'The position looks the same, but the black pawn has stood on d5 for several moves. Is en passant still allowed?' },
      options: [
        { id: 'Masih boleh', en: 'Still allowed' },
        { id: 'Sudah hangus', en: 'The chance is gone' },
      ],
      correct: 1,
      explain: { id: 'Hak en passant hanya berlaku satu kali: tepat pada langkah setelah Pion lawan melompat dua petak. Ditunda sekali, hangus selamanya.', en: 'The right lasts for one move only: the move right after the enemy pawn makes its double step. Wait once and it is gone for good.' },
    },
    {
      kind: 'move',
      fen: 'rnbqkbnr/ppp1p1pp/8/3pPp2/8/8/PPPP1PPP/RNBQKBNR w KQkq f6 0 3',
      accept: ['e5f6'],
      hint: 'e5f6',
      text: { id: 'Di partai sungguhan. Hitam baru saja melangkah f7 ke f5. Ambil Pion itu sambil lewat.', en: 'In a real game. Black has just played f7 to f5. Take that pawn in passing.' },
      right: { id: 'Tepat. Pion d5 juga berdiri di sebelah Pionmu, tapi ia sudah lama di sana. Yang boleh dimakan hanya yang baru melompat.', en: 'Right. The d5 pawn also stands beside yours, but it has been there a while. Only the one that just jumped can be taken.' },
      wrong: { id: 'Yang baru melompat dua petak adalah Pion f. Pionmu memakannya dengan melangkah ke f6.', en: 'The pawn that just jumped two squares is the f pawn. Yours captures it by stepping to f6.' },
    },
    {
      kind: 'say',
      mood: 'happy',
      text: {
        id: 'Rokade akan kau pakai di hampir setiap partai. En passant jarang muncul, tapi kalau lawan melakukannya, kau tidak akan lagi mengira ia curang.',
        en: 'You will castle in nearly every game. En passant turns up rarely, but when your opponent plays it, you will no longer think they are cheating.',
      },
    },
  ],
};

export const remis: Lesson = {
  id: 'b0-4',
  title: { id: 'Lakon Tanpa Pemenang', en: 'A Story with No Winner' },
  blurb: { id: 'Remis, pat, dan cara partai berakhir seri.', en: 'Draws, stalemate, and how a game ends level.' },
  scenes: [
    {
      kind: 'say',
      text: {
        id: 'Tidak semua lakon berakhir dengan pemenang. Partai yang seri disebut remis, dan kedua pihak pulang membawa setengah angka. Cara yang paling sering mengejutkan pemula bernama pat.',
        en: 'Not every story ends with a winner. A level game is called a draw, and each side goes home with half a point. The way that most often surprises a beginner is called stalemate.',
      },
    },
    {
      kind: 'say',
      fen: 'k7/8/1Q6/8/8/8/8/4K3 b - - 0 1',
      orient: 'w',
      marks: { a7: 'bad', b7: 'bad', b8: 'bad' },
      text: {
        id: 'Giliran Hitam. Rajanya tidak sedang diskak, tapi ketiga petak di sekitarnya dijaga Menteri putih, dan ia tidak punya bidak lain. Tidak ada langkah sah. Itu pat, dan hasilnya remis, sebanyak apa pun keunggulan Putih.',
        en: 'It is Black\'s move. His king is not in check, but all three squares around him are guarded by the white queen, and he has no other piece. There is no legal move. That is stalemate, and the game is drawn, however far ahead White may be.',
      },
    },
    {
      kind: 'quiz',
      fen: '7k/6Q1/6K1/8/8/8/8/8 b - - 0 1',
      orient: 'w',
      text: { id: 'Tiga posisi yang mirip. Giliran Hitam. Yang pertama ini apa?', en: 'Three positions that look alike. It is Black\'s move. What is this first one?' },
      options: [
        { id: 'Skakmat', en: 'Checkmate' },
        { id: 'Pat', en: 'Stalemate' },
        { id: 'Hanya skak', en: 'Only a check' },
      ],
      correct: 0,
      explain: { id: 'Raja diskak Menteri, tidak bisa lari, dan tidak bisa memakan Menteri karena dijaga Raja putih. Skakmat.', en: 'The king is in check from the queen, cannot run, and cannot take her because the white king guards her. Checkmate.' },
    },
    {
      kind: 'quiz',
      fen: '7k/5Q2/6K1/8/8/8/8/8 b - - 0 1',
      orient: 'w',
      text: { id: 'Menteri bergeser satu petak. Sekarang?', en: 'The queen has shifted one square. And now?' },
      options: [
        { id: 'Skakmat', en: 'Checkmate' },
        { id: 'Pat', en: 'Stalemate' },
        { id: 'Hanya skak', en: 'Only a check' },
      ],
      correct: 1,
      explain: { id: 'Raja tidak diskak, tapi semua petaknya dijaga. Pat, remis. Satu petak memisahkan menang dari seri.', en: 'The king is not in check, yet every square is guarded. Stalemate, a draw. One square separates a win from a draw.' },
    },
    {
      kind: 'quiz',
      fen: '7k/8/5QK1/8/8/8/8/8 b - - 0 1',
      orient: 'w',
      text: { id: 'Dan yang ini?', en: 'And this one?' },
      options: [
        { id: 'Skakmat', en: 'Checkmate' },
        { id: 'Pat', en: 'Stalemate' },
        { id: 'Hanya skak', en: 'Only a check' },
      ],
      correct: 2,
      explain: { id: 'Raja diskak dari garis serong, tapi masih bisa melangkah ke g8. Lakon berlanjut.', en: 'The king is in check along the diagonal, but he can still step to g8. The story goes on.' },
    },
    {
      kind: 'move',
      fen: 'k7/8/1K6/8/8/8/8/2Q5 w - - 0 1',
      accept: ['c1c8'],
      hint: 'c1c8',
      mate: true,
      text: { id: 'Giliranmu. Ada satu langkah yang menang dan satu langkah yang tampak mirip tapi membuang kemenangan. Pilih dengan teliti.', en: 'Your move. One move wins, and another that looks much the same throws the win away. Choose with care.' },
      right: { id: 'Skakmat. Sebelum melangkah saat unggul besar, selalu periksa: apakah Raja lawan masih punya langkah?', en: 'Checkmate. Before you move when far ahead, always check: does the enemy king still have a move?' },
      wrong: { id: 'Cari skak di baris paling atas.', en: 'Look for a check on the top row.' },
      punish: {
        c1c7: { id: 'Pat! Raja hitam tidak diskak dan tidak punya langkah. Kemenanganmu berubah jadi remis. Coba lagi.', en: 'Stalemate! The black king is not in check and has no move. Your win has turned into a draw. Try again.' },
      },
    },
    {
      kind: 'say',
      fen: '8/8/4k3/8/8/3K4/4B3/8 w - - 0 1',
      text: {
        id: 'Cara remis kedua: bidak yang tersisa tidak cukup untuk skakmat. Raja melawan Raja, atau Raja dengan satu Gajah saja, atau satu Kuda saja. Sekeras apa pun berusaha, skakmat mustahil, jadi partai langsung dihentikan.',
        en: 'A second kind of draw: the pieces left cannot give mate. King against king, or a king with a single bishop, or a single knight. However hard you try, mate is impossible, so the game simply stops.',
      },
    },
    {
      kind: 'quiz',
      text: { id: 'Mana yang masih bisa menang melawan Raja sendirian?', en: 'Which of these can still win against a lone king?' },
      options: [
        { id: 'Raja dan satu Gajah', en: 'King and one bishop' },
        { id: 'Raja dan satu Kuda', en: 'King and one knight' },
        { id: 'Raja dan satu Pion', en: 'King and one pawn' },
      ],
      correct: 2,
      explain: { id: 'Pion bisa naik pangkat menjadi Menteri. Itu sebabnya satu Pion kadang lebih berharga daripada satu Gajah di endgame.', en: 'A pawn can be promoted to a queen. That is why a single pawn is sometimes worth more than a bishop in the endgame.' },
    },
    {
      kind: 'say',
      text: {
        id: 'Masih ada tiga cara lagi. Posisi yang sama terulang tiga kali. Lima puluh langkah berlalu tanpa ada yang dimakan dan tanpa Pion bergerak. Atau kedua pemain sepakat berdamai.',
        en: 'Three more ways remain. The same position occurs three times. Fifty moves pass with nothing captured and no pawn moved. Or the two players simply agree to peace.',
      },
    },
    {
      kind: 'quiz',
      text: { id: 'Kau sedang kalah telak. Giliranmu, Rajamu tidak diskak, dan tak satu pun bidakmu punya langkah sah. Apa hasilnya?', en: 'You are losing badly. It is your move, your king is not in check, and none of your pieces has a legal move. What is the result?' },
      options: [
        { id: 'Kau kalah', en: 'You lose' },
        { id: 'Remis', en: 'A draw' },
      ],
      correct: 1,
      explain: { id: 'Pat menyelamatkan pihak yang kalah. Jangan menyerah terlalu cepat: lawan yang ceroboh sering menghadiahkan setengah angka.', en: 'Stalemate rescues the losing side. Do not resign too soon: a careless opponent often hands over half a point.' },
    },
    {
      kind: 'say',
      mood: 'happy',
      text: {
        id: 'Sekarang kau tahu semua aturan Kelir: cara bidak berjalan, dua langkah rahasia, dan semua cara lakon berakhir. Babak Wiwitan selesai. Di Babak Mata Ksatria, kau belajar melihat.',
        en: 'Now you know every rule of the screen: how the pieces move, the two secret moves, and every way a story can end. The Beginnings are complete. In The Warrior\'s Eye, you learn to see.',
      },
    },
  ],
};
