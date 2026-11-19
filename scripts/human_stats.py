"""Per-move blunder rate and accuracy of human players by rating, from Lichess games with engine evals.

The challengers are calibrated against these numbers (see docs/KALIBRASI.md). To reproduce:

    curl -r 0-150000000 -o head.pgn.zst https://database.lichess.org/standard/lichess_db_standard_rated_2025-09.pgn.zst
    python3 -I scripts/human_stats.py head.pgn.zst

Only rapid and classical games with engine evals are used, and only moves from undecided positions
(|eval| < 400 cp) count, the same rule scripts/calibrate.ts applies to the challengers. A blunder is a
move losing 22 or more winning-chance points and accuracy is the Lichess per-move formula, both as in
the app's Review."""
import io, json, math, re, sys
import zstandard

def win(cp):
    c = max(-1500, min(1500, cp))
    return 50 + 50 * (2 / (1 + math.exp(-0.00368208 * c)) - 1)

def acc(loss):
    return max(0.0, min(100.0, 103.1668 * math.exp(-0.04354 * loss) - 3.1669))

EVAL = re.compile(r'\[%eval (#?-?[\d.]+)\]')
def cp_of(tok):
    if tok.startswith('#'):
        n = int(tok[1:])
        return 100000 - abs(n) * 100 if n > 0 else -(100000 - abs(n) * 100)
    return round(float(tok) * 100)

bands = {}
def add(rating, losses):
    if not losses: return
    b = rating // 100 * 100
    st = bands.setdefault(b, {'games': 0, 'moves': 0, 'blunders': 0, 'acc': 0.0})
    st['games'] += 1
    st['moves'] += len(losses)
    st['blunders'] += sum(1 for l in losses if l >= 22)
    st['acc'] += sum(acc(l) for l in losses)

reader = zstandard.ZstdDecompressor().stream_reader(open(sys.argv[1], 'rb'))
text = io.TextIOWrapper(reader, encoding='utf-8', errors='replace')
headers, games, used = {}, 0, 0
try:
    for line in text:
        if line.startswith('['):
            m = re.match(r'\[(\w+) "(.*)"\]', line)
            if m: headers[m.group(1)] = m.group(2)
            continue
        if not line.strip() or '%eval' not in line:
            if line.strip() and not line.startswith('['):
                headers = {}
            continue
        games += 1
        event = headers.get('Event', '')
        if 'Rapid' not in event and 'Classical' not in event:
            headers = {}; continue
        try:
            we, be = int(headers['WhiteElo']), int(headers['BlackElo'])
        except (KeyError, ValueError):
            headers = {}; continue
        evals = [cp_of(t) for t in EVAL.findall(line)]
        prev = 20  # the start position, roughly
        lw, lb = [], []
        for i, ev in enumerate(evals):
            white_moved = i % 2 == 0
            if abs(prev) < 400:
                if white_moved: lw.append(max(0, win(prev) - win(ev)))
                else: lb.append(max(0, win(-prev) - win(-ev)))
            prev = ev
        add(we, lw); add(be, lb)
        used += 1
        headers = {}
except zstandard.ZstdError:
    pass  # the file is only the first part of the month
out = {b: {'games': s['games'], 'blunderRate': round(s['blunders'] / s['moves'], 4), 'accuracy': round(s['acc'] / s['moves'], 1)} for b, s in sorted(bands.items()) if s['games'] >= 30}
print(json.dumps({'gamesWithEval': games, 'used': used, 'bands': out}, indent=1))
