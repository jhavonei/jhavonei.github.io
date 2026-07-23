export interface GhProfile { login: string; avatar_url: string; created_at: string; followers: number; public_repos: number; }
export interface GhRepo { name: string; language: string | null; stargazers_count: number; pushed_at: string; html_url: string; }
export interface ContribDay { date: string; count: number; level: number; }

type Fetcher = (url: string) => Promise<Response>;
const TTL = 60 * 60 * 1000;

export async function cachedJson<T>(key: string, url: string, fetcher: Fetcher = fetch): Promise<T> {
  const sk = `jhv:gh:${key}`;
  try {
    const hit = sessionStorage.getItem(sk);
    if (hit) {
      const { t, data } = JSON.parse(hit);
      if (Date.now() - t < TTL) return data as T;
    }
  } catch { /* storage unavailable — fall through to network */ }
  const res = await fetcher(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const data = (await res.json()) as T;
  try { sessionStorage.setItem(sk, JSON.stringify({ t: Date.now(), data })); } catch { /* ignore */ }
  return data;
}

export const getProfile = (handle: string, f?: Fetcher) =>
  cachedJson<GhProfile>(`profile:${handle}`, `https://api.github.com/users/${handle}`, f);

export const getRepos = async (handle: string, f?: Fetcher) => {
  const raw = await cachedJson<(GhRepo & { fork: boolean })[]>(
    `repos:${handle}`, `https://api.github.com/users/${handle}/repos?sort=pushed&per_page=30`, f);
  return raw.filter((r) => !r.fork);
};

export const getContributions = async (handle: string, f?: Fetcher) => {
  const raw = await cachedJson<{ contributions: ContribDay[] }>(
    `contrib:${handle}`, `https://github-contributions-api.jogruber.de/v4/${handle}?y=last`, f);
  return raw.contributions;
};

/** Count → dot radius step (0..4) for the dot-matrix. */
export const contributionLevels = (count: number): number =>
  count === 0 ? 0 : count < 3 ? 1 : count < 6 ? 2 : count < 12 ? 3 : 4;
