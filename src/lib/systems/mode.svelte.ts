export type Mode = 'black' | 'white';
const KEY = 'jhv:mode';
const inBrowser = () => typeof document !== 'undefined';

export function createMode() {
  let current = $state<Mode>('black');
  const apply = (m: Mode) => {
    if (inBrowser()) document.documentElement.classList.toggle('white', m === 'white');
  };
  return {
    get current() { return current; },
    init() {
      if (!inBrowser()) return;
      current = localStorage.getItem(KEY) === 'white' ? 'white' : 'black';
      apply(current);
    },
    toggle() {
      current = current === 'black' ? 'white' : 'black';
      if (inBrowser()) localStorage.setItem(KEY, current);
      apply(current);
    }
  };
}
/** App-wide singleton. */
export const mode = createMode();
