import { describe, expect, it } from 'vitest';
import { transitions } from './transitions';

describe('transition orchestrator', () => {
  it('runs a registered depart handler and clears it on unregister', async () => {
    let called: [number, number] | null = null;
    const un = transitions.registerDepart(async (dir) => { called = dir; });
    await transitions.depart([1, 0]);
    expect(called).toEqual([1, 0]);
    un();
    called = null;
    await transitions.depart([0, 1]); // no handler — resolves immediately
    expect(called).toBeNull();
  });
  it('records the last departed path for arrival choreography', () => {
    transitions.noteDeparture('/work');
    expect(transitions.consumeLastDeparture()).toBe('/work');
    expect(transitions.consumeLastDeparture()).toBeNull();
  });
});
