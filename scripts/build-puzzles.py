"""Builds the puzzle set shipped with Yuddha from the Lichess puzzle database.

The database (CC0) is at https://database.lichess.org/#puzzles. Usage:

    pip install zstandard
    python3 scripts/build-puzzles.py lichess_db_puzzle.csv.zst public/puzzles

Output: one JSON file per 100-point rating band, each a list of
[id, fen, moves, rating, [theme indexes]]. The theme order below must match
PUZZLE_THEMES in src/features/puzzle/themes.ts.
"""
import collections
import csv
import io
import json
import os
import sys

import zstandard

THEMES = [
    'mateIn1', 'mateIn2', 'mateIn3', 'backRankMate', 'smotheredMate', 'hangingPiece', 'fork', 'pin',
    'skewer', 'discoveredAttack', 'doubleCheck', 'deflection', 'attraction', 'capturingDefender',
    'trappedPiece', 'promotion', 'sacrifice', 'defensiveMove', 'quietMove', 'intermezzo',
    'endgame', 'middlegame', 'opening',
]
# The first of these found on a puzzle decides which quota it counts against.
PRIMARY = THEMES[:20]
INDEX = {t: i for i, t in enumerate(THEMES)}
BANDS = range(400, 2200, 100)
PER_BAND = 700
PER_THEME = 90


def primary(tags):
    for t in PRIMARY:
        if t in tags:
            return t
    return 'other'


def main(src, out):
    pools = collections.defaultdict(list)
    with open(src, 'rb') as f:
        rows = csv.reader(io.TextIOWrapper(zstandard.ZstdDecompressor().stream_reader(f), encoding='utf-8'))
        next(rows)
        for pid, fen, moves, rating, rd, pop, plays, tags, *_ in rows:
            rating, rd, pop, plays = int(rating), int(rd), int(pop), int(plays)
            band = rating // 100 * 100
            if band not in BANDS:
                continue
            tags = tags.split()
            easy = band < 700
            if pop < (80 if easy else 90) or plays < (150 if easy else 1500) or rd > 90:
                continue
            n_moves = moves.count(' ') + 1
            if 'veryLong' in tags or n_moves > 8 or (band < 1200 and n_moves > 6):
                continue
            pools[band].append((pop, plays, pid, fen, moves, rating, tags))

    os.makedirs(out, exist_ok=True)
    total = 0
    for band in BANDS:
        pool = sorted(pools[band], key=lambda p: (-p[0], -p[1], p[2]))
        used = collections.Counter()
        picked = []
        for pop, plays, pid, fen, moves, rating, tags in pool:
            key = primary(tags)
            if used[key] >= PER_THEME:
                continue
            used[key] += 1
            picked.append([pid, fen, moves, rating, sorted(INDEX[t] for t in tags if t in INDEX)])
            if len(picked) >= PER_BAND:
                break
        picked.sort(key=lambda p: p[3])
        with open(os.path.join(out, f'b{band}.json'), 'w', encoding='utf-8') as f:
            json.dump(picked, f, separators=(',', ':'))
        total += len(picked)
        print(band, len(picked), dict(used.most_common(6)))
    print('total', total)


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
