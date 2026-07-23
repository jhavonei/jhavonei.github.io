import { error } from '@sveltejs/kit';
import { noteEntries } from '$lib/content';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => noteEntries.map((n) => ({ slug: n.slug }));

export const load: PageLoad = async ({ params }) => {
  const meta = noteEntries.find((n) => n.slug === params.slug);
  if (!meta) throw error(404, 'Entry not found');
  const mod = await import(`../../../content/notes/${params.slug}.md`);
  return { meta, content: mod.default };
};
