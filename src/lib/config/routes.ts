import { STAMEN_DIRS } from '$lib/three/anatomy';

export interface RouteDef {
  path: string;
  doc: string;      // "DOC.002"
  fig: number;      // 1..5
  title: string;    // display title
  short: string;    // callout label text
  plant: string;    // plants/ registry key
  latin: string;
  openingKey: keyof typeof import('./copy').openingLines;
}

export const ROUTES: RouteDef[] = [
  { path: '/work', doc: 'DOC.002', fig: 1, title: 'Work', short: 'Work', plant: 'datura', latin: 'Datura stramonium', openingKey: 'work' },
  { path: '/notes', doc: 'DOC.003', fig: 2, title: 'Field Notes', short: 'Field Notes', plant: 'digitalis', latin: 'Digitalis purpurea', openingKey: 'notes' },
  { path: '/author', doc: 'DOC.004', fig: 3, title: 'The Author', short: 'The Author', plant: 'belladonna', latin: 'Atropa belladonna', openingKey: 'author' },
  { path: '/correspondence', doc: 'DOC.005', fig: 4, title: 'Correspondence', short: 'Correspondence', plant: 'oleander', latin: 'Nerium oleander', openingKey: 'correspondence' },
  { path: '/repository', doc: 'DOC.006', fig: 5, title: 'Repository', short: 'Repository', plant: 'aconitum', latin: 'Aconitum napellus', openingKey: 'repository' }
];

export const routeByPath = (p: string): RouteDef | undefined =>
  ROUTES.find((r) => r.path === p || p.startsWith(r.path + '/'));

/** Departure direction for a route (its stamen's unit vector). */
export const directionFor = (p: string): [number, number] => {
  const r = routeByPath(p);
  return r ? [...STAMEN_DIRS[r.fig]] as [number, number] : [0, 1];
};
