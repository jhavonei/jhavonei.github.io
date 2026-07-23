type Dir = [number, number];
type DepartFn = (dir: Dir) => Promise<void>;

let departFn: DepartFn | null = null;
let lastDeparture: string | null = null;

export const transitions = {
  /** Hero registers its disintegration here. Returns unregister. */
  registerDepart(fn: DepartFn): () => void {
    departFn = fn;
    return () => { if (departFn === fn) departFn = null; };
  },
  async depart(dir: Dir): Promise<void> {
    if (departFn) await departFn(dir);
  },
  noteDeparture(path: string) { lastDeparture = path; },
  consumeLastDeparture(): string | null {
    const p = lastDeparture; lastDeparture = null; return p;
  }
};
