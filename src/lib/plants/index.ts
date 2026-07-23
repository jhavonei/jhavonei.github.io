import type { Component } from 'svelte';
import Datura from './Datura.svelte';
import Digitalis from './Digitalis.svelte';
import Belladonna from './Belladonna.svelte';
import Oleander from './Oleander.svelte';
import Aconitum from './Aconitum.svelte';

export const plants: Record<string, Component<{ size?: number }>> = {
  datura: Datura,
  digitalis: Digitalis,
  belladonna: Belladonna,
  oleander: Oleander,
  aconitum: Aconitum
};
