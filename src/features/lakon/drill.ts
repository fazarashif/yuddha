/** Book logic for opening drills. Lines are arrays of SAN moves from the starting position. */

const follows = (line: string[], history: string[]) => history.every((san, i) => line[i] === san);

/** The lines still in play after these moves. */
export const openLines = (lines: string[][], history: string[]) => lines.filter((line) => follows(line, history));

/** Every book move in this position, without repeats. */
export function bookMoves(lines: string[][], history: string[]): string[] {
  const next = openLines(lines, history)
    .map((line) => line[history.length])
    .filter((san): san is string => Boolean(san));
  return [...new Set(next)];
}

/** The drill is over once no line that is still in play has a move left. */
export const isFinished = (lines: string[][], history: string[]) => bookMoves(lines, history).length === 0;

/** The other side's answer: one of the book moves, chosen evenly across the lines that remain. */
export function pickReply(lines: string[][], history: string[], random: () => number): string | undefined {
  const next = openLines(lines, history)
    .map((line) => line[history.length])
    .filter((san): san is string => Boolean(san));
  if (next.length === 0) return undefined;
  return next[Math.min(next.length - 1, Math.floor(random() * next.length))];
}
