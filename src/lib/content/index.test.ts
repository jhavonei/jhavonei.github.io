import { describe, expect, it } from 'vitest';
import { workEntries, noteEntries, sealedAfter } from './index';

describe('content collections', () => {
  it('loads work entries sorted by index', () => {
    expect(workEntries.length).toBeGreaterThanOrEqual(4);
    const idx = workEntries.map((w) => w.index);
    expect(idx).toEqual([...idx].sort());
    expect(workEntries[0].title).toBe('Nocturne Engine');
  });
  it('loads notes with slugs derived from filenames', () => {
    expect(noteEntries.length).toBeGreaterThanOrEqual(1);
    expect(noteEntries[0].slug).toBe('n001-building-the-specimen');
    expect(noteEntries[0].index).toBe('N.001');
  });
  it('sealedAfter continues the numbering', () => {
    expect(sealedAfter('V.04', 2)).toEqual(['V.05', 'V.06']);
    expect(sealedAfter('N.001', 2)).toEqual(['N.002', 'N.003']);
  });
});
