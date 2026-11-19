import { describe, expect, it } from 'vitest';
import { bookMoves, isFinished, openLines, pickReply } from './drill';

const LINES = ['e4 e5 Nf3 Nc6 Bc4 Bc5', 'e4 e5 Nf3 Nc6 Bc4 Nf6 d3', 'e4 c6 d4 d5'].map((l) => l.split(' '));

describe('opening drill', () => {
  it('knows the book moves in each position', () => {
    expect(bookMoves(LINES, [])).toEqual(['e4']);
    expect(bookMoves(LINES, ['e4']).sort()).toEqual(['c6', 'e5']);
    expect(bookMoves(LINES, ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4']).sort()).toEqual(['Bc5', 'Nf6']);
    expect(bookMoves(LINES, ['d4'])).toEqual([]);
  });

  it('keeps only the lines still in play', () => {
    expect(openLines(LINES, ['e4', 'c6'])).toHaveLength(1);
    expect(openLines(LINES, ['e4', 'e5'])).toHaveLength(2);
  });

  it('finishes when every remaining line has run out', () => {
    expect(isFinished(LINES, ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5'])).toBe(true);
    expect(isFinished(LINES, ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Nf6'])).toBe(false);
    expect(isFinished(LINES, ['e4', 'c6', 'd4', 'd5'])).toBe(true);
  });

  it('picks replies from the lines in play', () => {
    expect(pickReply(LINES, ['e4'], () => 0)).toBe('e5');
    expect(pickReply(LINES, ['e4'], () => 0.99)).toBe('c6');
    expect(pickReply(LINES, ['e4', 'c6', 'd4', 'd5'], () => 0.5)).toBeUndefined();
  });
});
