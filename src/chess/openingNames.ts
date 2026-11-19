/**
 * Names for common openings, matched by the longest prefix of the game's moves. The names follow the
 * usual English convention (as on Lichess and Chess.com); the part before the colon is the family.
 */
const TABLE: [name: string, moves: string][] = [
  ["King's Pawn Opening", 'e4'],
  ["Queen's Pawn Opening", 'd4'],
  ['English Opening', 'c4'],
  ['English Opening: Reversed Sicilian', 'c4 e5'],
  ['Réti Opening', 'Nf3'],
  ['Bird Opening', 'f4'],

  ["King's Pawn Game", 'e4 e5'],
  ["King's Knight Opening", 'e4 e5 Nf3'],
  ['Italian Game', 'e4 e5 Nf3 Nc6 Bc4'],
  ['Italian Game: Giuoco Piano', 'e4 e5 Nf3 Nc6 Bc4 Bc5'],
  ['Italian Game: Giuoco Pianissimo', 'e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d3'],
  ['Italian Game: Evans Gambit', 'e4 e5 Nf3 Nc6 Bc4 Bc5 b4'],
  ['Italian Game: Two Knights Defense', 'e4 e5 Nf3 Nc6 Bc4 Nf6'],
  ['Italian Game: Two Knights Defense, Knight Attack', 'e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5'],
  ['Italian Game: Two Knights Defense, Fried Liver Attack', 'e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5 Nxd5 Nxf7'],
  ['Italian Game: Hungarian Defense', 'e4 e5 Nf3 Nc6 Bc4 Be7'],
  ['Ruy Lopez', 'e4 e5 Nf3 Nc6 Bb5'],
  ['Ruy Lopez: Morphy Defense', 'e4 e5 Nf3 Nc6 Bb5 a6'],
  ['Ruy Lopez: Exchange Variation', 'e4 e5 Nf3 Nc6 Bb5 a6 Bxc6'],
  ['Ruy Lopez: Closed', 'e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7'],
  ['Ruy Lopez: Berlin Defense', 'e4 e5 Nf3 Nc6 Bb5 Nf6'],
  ['Ruy Lopez: Classical Defense', 'e4 e5 Nf3 Nc6 Bb5 Bc5'],
  ['Scotch Game', 'e4 e5 Nf3 Nc6 d4'],
  ['Ponziani Opening', 'e4 e5 Nf3 Nc6 c3'],
  ['Four Knights Game', 'e4 e5 Nf3 Nc6 Nc3 Nf6'],
  ['Three Knights Opening', 'e4 e5 Nf3 Nc6 Nc3'],
  ["Petrov's Defense", 'e4 e5 Nf3 Nf6'],
  ['Philidor Defense', 'e4 e5 Nf3 d6'],
  ['Damiano Defense', 'e4 e5 Nf3 f6'],
  ['Vienna Game', 'e4 e5 Nc3'],
  ["King's Gambit", 'e4 e5 f4'],
  ["Bishop's Opening", 'e4 e5 Bc4'],
  ['Center Game', 'e4 e5 d4 exd4 Qxd4'],
  ['Danish Gambit', 'e4 e5 d4 exd4 c3'],
  ['Wayward Queen Attack', 'e4 e5 Qh5'],

  ['Sicilian Defense', 'e4 c5'],
  ['Sicilian Defense: Alapin Variation', 'e4 c5 c3'],
  ['Sicilian Defense: Smith-Morra Gambit', 'e4 c5 d4 cxd4 c3'],
  ['Sicilian Defense: Closed', 'e4 c5 Nc3'],
  ['Sicilian Defense: Grand Prix Attack', 'e4 c5 Nc3 Nc6 f4'],
  ['Sicilian Defense: Bowdler Attack', 'e4 c5 Bc4'],
  ['Sicilian Defense: Open', 'e4 c5 Nf3 d6 d4'],
  ['Sicilian Defense: Open', 'e4 c5 Nf3 Nc6 d4'],
  ['Sicilian Defense: Open', 'e4 c5 Nf3 e6 d4'],
  ['Sicilian Defense: Dragon Variation', 'e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 g6'],
  ['Sicilian Defense: Dragon Variation, Yugoslav Attack', 'e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 g6 Be3 Bg7 f3'],
  ['Sicilian Defense: Najdorf Variation', 'e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6'],

  ['French Defense', 'e4 e6'],
  ['French Defense: Advance Variation', 'e4 e6 d4 d5 e5'],
  ['French Defense: Exchange Variation', 'e4 e6 d4 d5 exd5'],
  ['French Defense: Winawer Variation', 'e4 e6 d4 d5 Nc3 Bb4'],
  ['French Defense: Tarrasch Variation', 'e4 e6 d4 d5 Nd2'],
  ['Caro-Kann Defense', 'e4 c6'],
  ['Caro-Kann Defense: Advance Variation', 'e4 c6 d4 d5 e5'],
  ['Caro-Kann Defense: Exchange Variation', 'e4 c6 d4 d5 exd5 cxd5'],
  ['Caro-Kann Defense: Classical Variation', 'e4 c6 d4 d5 Nc3 dxe4 Nxe4 Bf5'],
  ['Scandinavian Defense', 'e4 d5'],
  ['Scandinavian Defense: Main Line', 'e4 d5 exd5 Qxd5 Nc3 Qa5'],
  ['Scandinavian Defense: Modern Variation', 'e4 d5 exd5 Nf6'],
  ['Pirc Defense', 'e4 d6 d4 Nf6 Nc3 g6'],
  ['Modern Defense', 'e4 g6'],
  ['Alekhine Defense', 'e4 Nf6'],
  ['Owen Defense', 'e4 b6'],
  ['Nimzowitsch Defense', 'e4 Nc6'],

  ["Queen's Pawn Game", 'd4 d5'],
  ["Queen's Gambit", 'd4 d5 c4'],
  ["Queen's Gambit Declined", 'd4 d5 c4 e6'],
  ["Queen's Gambit Accepted", 'd4 d5 c4 dxc4'],
  ['Slav Defense', 'd4 d5 c4 c6'],
  ['London System', 'd4 d5 Bf4'],
  ['London System', 'd4 Nf6 Bf4'],
  ['London System', 'd4 d5 Nf3 Nf6 Bf4'],
  ['Colle System', 'd4 d5 Nf3 Nf6 e3'],
  ['Indian Defense', 'd4 Nf6'],
  ['Trompowsky Attack', 'd4 Nf6 Bg5'],
  ["King's Indian Defense", 'd4 Nf6 c4 g6'],
  ['Grünfeld Defense', 'd4 Nf6 c4 g6 Nc3 d5'],
  ['Nimzo-Indian Defense', 'd4 Nf6 c4 e6 Nc3 Bb4'],
  ["Queen's Indian Defense", 'd4 Nf6 c4 e6 Nf3 b6'],
  ['Catalan Opening', 'd4 Nf6 c4 e6 g3'],
  ['Benoni Defense', 'd4 Nf6 c4 c5 d5'],
  ['Dutch Defense', 'd4 f5'],
  ['Englund Gambit', 'd4 e5'],
];

const ENTRIES = TABLE.map(([name, moves]) => ({ name, moves: moves.split(' ') }));

/** Every move sequence in the table, for the tests. */
export const OPENING_TABLE = ENTRIES;

/** The name of the opening played, or null when not even the first move is known. */
export function nameOpening(sans: string[]): string | null {
  let best: { name: string; length: number } | null = null;
  for (const e of ENTRIES) {
    if (e.moves.length > sans.length || (best && e.moves.length <= best.length)) continue;
    if (e.moves.every((san, i) => sans[i] === san)) best = { name: e.name, length: e.moves.length };
  }
  return best?.name ?? null;
}

/** The family is the part before the colon: "Sicilian Defense: Dragon Variation" -> "Sicilian Defense". */
export const familyOf = (name: string) => name.split(':')[0];
