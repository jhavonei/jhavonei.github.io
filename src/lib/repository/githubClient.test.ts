import { beforeEach, describe, expect, it, vi } from 'vitest';
import { cachedJson, getProfile, getRepos, getContributions, contributionLevels } from './githubClient';

const ok = (data: unknown) => Promise.resolve(new Response(JSON.stringify(data), { status: 200 }));

describe('githubClient', () => {
  beforeEach(() => sessionStorage.clear());

  it('cachedJson caches by key with TTL', async () => {
    const fetcher = vi.fn(() => ok({ a: 1 }));
    expect(await cachedJson('k1', 'https://x', fetcher)).toEqual({ a: 1 });
    expect(await cachedJson('k1', 'https://x', fetcher)).toEqual({ a: 1 });
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it('cachedJson throws on http error without caching', async () => {
    const bad = vi.fn(() => Promise.resolve(new Response('nope', { status: 500 })));
    await expect(cachedJson('k2', 'https://x', bad)).rejects.toThrow();
    expect(sessionStorage.getItem('jhv:gh:k2')).toBeNull();
  });

  it('getProfile/getRepos/getContributions map fields', async () => {
    const profile = await getProfile('jhavonei', () =>
      ok({ login: 'jhavonei', avatar_url: 'a', created_at: '2026-01-01T00:00:00Z', followers: 2, public_repos: 3 }));
    expect(profile.login).toBe('jhavonei');
    const repos = await getRepos('jhavonei', () =>
      ok([{ name: 'r', language: 'TypeScript', stargazers_count: 1, pushed_at: '2026-07-01T00:00:00Z', html_url: 'u', fork: false }]));
    expect(repos[0].name).toBe('r');
    const days = await getContributions('jhavonei', () =>
      ok({ total: { '2026': 9 }, contributions: [{ date: '2026-07-01', count: 3, level: 2 }] }));
    expect(days[0]).toEqual({ date: '2026-07-01', count: 3, level: 2 });
  });

  it('contributionLevels maps counts to radius steps 0..4', () => {
    expect(contributionLevels(0)).toBe(0);
    expect(contributionLevels(1)).toBe(1);
    expect(contributionLevels(4)).toBe(2);
    expect(contributionLevels(9)).toBe(3);
    expect(contributionLevels(20)).toBe(4);
  });
});
