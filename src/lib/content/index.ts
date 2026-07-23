export interface WorkMeta {
  index: string; title: string; taxonomy: string; year: string;
  status: 'live' | 'archived'; stack: string[]; role: string;
  links?: { exhibit?: string; source?: string };
  placeholder?: boolean; blurb: string;
}
export interface NoteMeta {
  index: string; title: string; field: string; date: string; slug: string;
}

const workMods = import.meta.glob('/src/content/work/*.md', { eager: true }) as Record<
  string, { metadata: WorkMeta }
>;
export const workEntries: WorkMeta[] = Object.values(workMods)
  .map((m) => m.metadata)
  .sort((a, b) => a.index.localeCompare(b.index));

const noteMods = import.meta.glob('/src/content/notes/*.md', { eager: true }) as Record<
  string, { metadata: Omit<NoteMeta, 'slug'> }
>;
export const noteEntries: NoteMeta[] = Object.entries(noteMods)
  .map(([path, m]) => ({ ...m.metadata, slug: path.split('/').pop()!.replace(/\.md$/, '') }))
  .sort((a, b) => a.index.localeCompare(b.index));

/** "V.04" → ["V.05","V.06"]; zero-padding preserved ("N.001" → "N.002"). */
export function sealedAfter(lastIndex: string, slots: number): string[] {
  const m = lastIndex.match(/^([A-Z]+\.)(\d+)$/);
  if (!m) return [];
  const [, prefix, num] = m;
  return Array.from({ length: slots }, (_, i) =>
    `${prefix}${String(Number(num) + i + 1).padStart(num.length, '0')}`
  );
}
