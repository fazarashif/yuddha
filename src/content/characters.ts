import type { BotBrain } from '../chess/bot';
import type { FaceSpec, L } from './types';

export const KI_SABDA: FaceSpec = {
  bg: '#27314f',
  skin: '#dba973',
  shape: 'round',
  eyes: 'narrow',
  brows: 'arched',
  mouth: 'smile',
  head: 'blangkon',
  headColor: '#5a3620',
  accent: '#c9a24b',
  hair: 'mustache',
};

export interface Bot {
  id: string;
  name: string;
  /** Design target, not a measured rating. */
  elo: number;
  epithet: L;
  style: L;
  tests: L;
  face: FaceSpec;
  brain: BotBrain;
  greet: L;
  onCapture: L;
  onLoss: L;
  onWin: L;
  onDefeat: L;
}

export const BOTS: Bot[] = [
  {
    id: 'buta-cilik',
    name: 'Buta Cilik',
    elo: 400,
    epithet: { id: 'Raksasa kecil yang rakus', en: 'The greedy little ogre' },
    style: { id: 'Memakan apa saja yang terlihat, tanpa menengok kiri-kanan.', en: 'Eats whatever he sees and never looks around.' },
    tests: { id: 'Menghukum bidak gantung', en: 'Punishing loose pieces' },
    face: { bg: '#3a2030', skin: '#c9574a', shape: 'wide', eyes: 'round', brows: 'fierce', mouth: 'fangs', head: 'tuft', headColor: '#2a1a14', accent: '#e9a23b' },
    brain: { depth: 6, multipv: 12, temp: 230, blunder: 0.32, greed: 160 },
    greet: { id: 'Hrrm! Bidakmu kelihatan enak. Aku makan semua!', en: 'Hrrm! Your pieces look tasty. I will eat them all!' },
    onCapture: { id: 'Nyam! Satu lagi masuk perut.', en: 'Yum! Another one down the hatch.' },
    onLoss: { id: 'Hei! Itu punyaku!', en: 'Hey! That was mine!' },
    onWin: { id: 'Hahaha! Kenyang aku hari ini.', en: 'Hahaha! I am full today.' },
    onDefeat: { id: 'Aduh. Perutku lapar, tapi rajaku habis.', en: 'Ouch. Still hungry, and my king is gone.' },
  },
  {
    id: 'cantrik-lugu',
    name: 'Cantrik Lugu',
    elo: 600,
    epithet: { id: 'Murid padepokan yang polos', en: 'The guileless novice' },
    style: { id: 'Baru belajar. Sering lupa menjaga rajanya.', en: 'Still learning. Often forgets to guard his king.' },
    tests: { id: 'Pola mat dasar', en: 'Basic mating patterns' },
    face: { bg: '#2c3a2c', skin: '#e2b98a', shape: 'round', eyes: 'round', brows: 'calm', mouth: 'smile', head: 'caping', headColor: '#b99655', accent: '#d9c27a' },
    brain: { depth: 6, multipv: 10, temp: 170, blunder: 0.24 },
    greet: { id: 'Salam, Kakang. Mohon bimbingannya, ya.', en: 'Greetings. Please go easy on me.' },
    onCapture: { id: 'Eh, boleh diambil? Terima kasih!', en: 'Oh, I can take that? Thank you!' },
    onLoss: { id: 'Wah, saya tidak lihat itu.', en: 'Oh my, I did not see that.' },
    onWin: { id: 'Lho, saya menang? Guru pasti tidak percaya.', en: 'Wait, I won? My teacher will never believe it.' },
    onDefeat: { id: 'Terima kasih pelajarannya, Kakang.', en: 'Thank you for the lesson.' },
  },
  {
    id: 'gandarwa',
    name: 'Gandarwa Si Gegabah',
    elo: 800,
    epithet: { id: 'Penyerbu yang tidak sabaran', en: 'The reckless raider' },
    style: { id: 'Mengeluarkan Menteri sejak awal dan menyerang membabi buta.', en: 'Brings the queen out early and attacks headlong.' },
    tests: { id: 'Bertahan dan mengembangkan bidak', en: 'Defending and developing' },
    face: { bg: '#3b2a1a', skin: '#b9763f', shape: 'long', eyes: 'round', brows: 'fierce', mouth: 'fangs', head: 'horns', headColor: '#2a1a14', accent: '#e0c58a' },
    brain: { depth: 7, multipv: 8, temp: 115, blunder: 0.16, aggression: 70, queenRush: 90 },
    greet: { id: 'Serbu! Aku tidak punya waktu untuk berpikir!', en: 'Charge! I have no time for thinking!' },
    onCapture: { id: 'Hancur! Siapa berikutnya?', en: 'Smashed! Who is next?' },
    onLoss: { id: 'Grr. Kebetulan saja itu.', en: 'Grr. That was pure luck.' },
    onWin: { id: 'Sudah kubilang, serang dulu, pikir belakangan!', en: 'Told you: attack first, think later!' },
    onDefeat: { id: 'Sial. Mungkin lain kali aku berpikir dulu.', en: 'Curses. Maybe next time I will think first.' },
  },
  {
    id: 'nyi-rara',
    name: 'Nyi Rara Jerat',
    elo: 1000,
    epithet: { id: 'Penenun jebakan', en: 'The weaver of snares' },
    style: { id: 'Tenang di luar, penuh fork dan jebakan di dalam.', en: 'Calm on the surface, full of forks and traps beneath.' },
    tests: { id: 'Kewaspadaan taktik', en: 'Tactical alertness' },
    face: { bg: '#1f3340', skin: '#e6c4a0', shape: 'long', eyes: 'narrow', brows: 'arched', mouth: 'smile', head: 'veil', headColor: '#1c5a5a', accent: '#e6c66f' },
    brain: { depth: 8, multipv: 6, temp: 82, blunder: 0.1, greed: 30, aggression: 30 },
    greet: { id: 'Silakan melangkah, Ksatria. Benangku sudah terpasang.', en: 'Do step forward, warrior. My threads are already strung.' },
    onCapture: { id: 'Terjerat juga akhirnya.', en: 'Caught in the web at last.' },
    onLoss: { id: 'Oh? Kau melihat benangnya.', en: 'Oh? You saw the thread.' },
    onWin: { id: 'Jaringku tidak pernah kosong.', en: 'My net never comes back empty.' },
    onDefeat: { id: 'Matamu tajam. Aku harus menenun lebih halus.', en: 'Sharp eyes. I must weave finer.' },
  },
  {
    id: 'senapati-wesi',
    name: 'Senapati Wesi',
    elo: 1200,
    epithet: { id: 'Panglima besi', en: 'The iron commander' },
    style: { id: 'Kokoh dan disiplin. Setiap kecerobohan dibalas.', en: 'Solid and disciplined. Every careless move is answered.' },
    tests: { id: 'Disiplin cek blunder', en: 'Blunder-check discipline' },
    face: { bg: '#2a2f38', skin: '#c99a6a', shape: 'wide', eyes: 'narrow', brows: 'fierce', mouth: 'flat', head: 'helm', headColor: '#6d7480', accent: '#c9a24b' },
    brain: { depth: 9, multipv: 5, temp: 56, blunder: 0.06 },
    greet: { id: 'Barisanku rapat. Tunjukkan celahnya kalau bisa.', en: 'My lines are tight. Find the gap if you can.' },
    onCapture: { id: 'Kecerobohan dibayar tunai.', en: 'Carelessness is paid in full.' },
    onLoss: { id: 'Dicatat. Tidak akan terulang.', en: 'Noted. It will not happen again.' },
    onWin: { id: 'Disiplin mengalahkan bakat.', en: 'Discipline beats talent.' },
    onDefeat: { id: 'Hormatku. Barisanmu lebih rapat.', en: 'My respect. Your lines were tighter.' },
  },
  {
    id: 'resi-wening',
    name: 'Resi Wening',
    elo: 1400,
    epithet: { id: 'Pertapa yang sabar', en: 'The patient hermit' },
    style: { id: 'Tidak terburu-buru. Menang perlahan lewat posisi dan endgame.', en: 'Never hurries. Wins slowly through position and endgame.' },
    tests: { id: 'Rencana dan endgame', en: 'Planning and endgames' },
    face: { bg: '#2d3440', skin: '#d9b48a', shape: 'long', eyes: 'narrow', brows: 'calm', mouth: 'flat', head: 'bun', headColor: '#e4e0d6', accent: '#c9a24b', hair: 'beard' },
    brain: { depth: 10, multipv: 4, temp: 40, blunder: 0.04 },
    greet: { id: 'Duduklah. Air yang tenang paling dalam.', en: 'Sit. Still water runs deepest.' },
    onCapture: { id: 'Buah jatuh saat sudah matang.', en: 'Fruit falls when it is ripe.' },
    onLoss: { id: 'Menarik. Aku akan merenungkannya.', en: 'Interesting. I shall reflect on that.' },
    onWin: { id: 'Sabar itu juga sebuah langkah.', en: 'Patience is also a move.' },
    onDefeat: { id: 'Muridku, kau sudah melampaui air tenangku.', en: 'You have outgrown my still water.' },
  },
  {
    id: 'ratu-bayang',
    name: 'Ratu Bayang',
    elo: 1600,
    epithet: { id: 'Ratu dari balik kelir', en: 'The queen behind the screen' },
    style: { id: 'Menyerang raja dengan tajam dan berani berkorban.', en: 'Attacks the king sharply and is not afraid to sacrifice.' },
    tests: { id: 'Kalkulasi dan pertahanan raja', en: 'Calculation and king safety' },
    face: { bg: '#2a1d3a', skin: '#d9c2c8', shape: 'long', eyes: 'narrow', brows: 'fierce', mouth: 'smile', head: 'tiara', headColor: '#1a1320', accent: '#c9a24b' },
    brain: { depth: 11, multipv: 4, temp: 28, blunder: 0.025, aggression: 35 },
    greet: { id: 'Rajamu terlihat kesepian. Biar kutemani.', en: 'Your king looks lonely. Let me keep him company.' },
    onCapture: { id: 'Bayangan selalu sampai lebih dulu.', en: 'The shadow always arrives first.' },
    onLoss: { id: 'Berani. Aku suka itu.', en: 'Bold. I like that.' },
    onWin: { id: 'Cahaya padam, bayangan tinggal.', en: 'The light goes out, the shadow remains.' },
    onDefeat: { id: 'Kau menyalakan lampu di tempat yang tepat.', en: 'You lit the lamp in exactly the right place.' },
  },
  {
    id: 'prabu-kala',
    name: 'Prabu Kala',
    elo: 1800,
    epithet: { id: 'Raja Kerajaan Bara', en: 'King of the Ember Realm' },
    style: { id: 'Lengkap. Sabar saat perlu, ganas saat ada peluang.', en: 'Complete. Patient when needed, ferocious when given a chance.' },
    tests: { id: 'Semua yang sudah kau pelajari', en: 'Everything you have learned' },
    face: { bg: '#3a1c18', skin: '#a8543c', shape: 'wide', eyes: 'round', brows: 'fierce', mouth: 'fangs', head: 'crown', headColor: '#d2553a', accent: '#e6c66f' },
    brain: { depth: 12, multipv: 3, temp: 18, blunder: 0.012 },
    greet: { id: 'Jadi kau senapati yang dipilih Kelir. Buktikan.', en: 'So you are the commander the Screen chose. Prove it.' },
    onCapture: { id: 'Waktu memakan segalanya.', en: 'Time devours everything.' },
    onLoss: { id: 'Hm. Kau memang bukan cantrik lagi.', en: 'Hm. You are no novice any more.' },
    onWin: { id: 'Belum waktumu. Kembalilah saat siap.', en: 'It is not your time yet. Return when you are ready.' },
    onDefeat: { id: 'Bara pun tunduk pada Rembulan malam ini.', en: 'Tonight even the Ember bows to the Moon.' },
  },
  {
    id: 'sang-hyang-kelir',
    name: 'Sang Hyang Kelir',
    elo: 2100,
    epithet: { id: 'Roh layar pusaka', en: 'Spirit of the sacred screen' },
    style: { id: 'Bermain nyaris tanpa cela.', en: 'Plays almost without flaw.' },
    tests: { id: 'Batas kemampuanmu', en: 'The edge of your ability' },
    face: { bg: '#10202a', skin: '#f2e6cf', shape: 'long', eyes: 'narrow', brows: 'calm', mouth: 'flat', head: 'rays', headColor: '#4fd1c5', accent: '#4fd1c5' },
    brain: { depth: 14, multipv: 2, temp: 8, blunder: 0 },
    greet: { id: 'Setiap bayangan di layar ini pernah kulihat.', en: 'I have seen every shadow that ever crossed this screen.' },
    onCapture: { id: 'Demikianlah lakonnya.', en: 'So the story goes.' },
    onLoss: { id: 'Bayangan baru. Menarik.', en: 'A new shadow. Interesting.' },
    onWin: { id: 'Lakon ini belum selesai untukmu.', en: 'This story is not finished for you.' },
    onDefeat: { id: 'Kelir memilih dengan benar.', en: 'The Screen chose well.' },
  },
];

export const botById = (id: string) => BOTS.find((b) => b.id === id);

/** Ranks earned through experience points. */
export const RANKS: { xp: number; name: L }[] = [
  { xp: 0, name: { id: 'Cantrik', en: 'Novice' } },
  { xp: 150, name: { id: 'Prajurit', en: 'Soldier' } },
  { xp: 500, name: { id: 'Lurah', en: 'Captain' } },
  { xp: 1200, name: { id: 'Tumenggung', en: 'Marshal' } },
  { xp: 2500, name: { id: 'Senapati', en: 'Commander' } },
  { xp: 5000, name: { id: 'Patih', en: 'Vizier' } },
];

export function rankFor(xp: number) {
  let i = 0;
  while (i + 1 < RANKS.length && RANKS[i + 1].xp <= xp) i++;
  return { index: i, rank: RANKS[i], next: RANKS[i + 1] ?? null };
}
