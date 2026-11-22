import { DEFAULTS, PAGE_PATHS } from '@/lib/defaults';

const URL_BASE = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const SITE_TAG = 'site-settings';
export const POSTS_TAG = 'posts';

// Fills in any field missing from a saved value with the default (one level deep, plus nested plain objects).
export function mergeDefaults(def, saved) {
  if (saved === undefined || saved === null) return def;
  if (Array.isArray(def) || typeof def !== 'object' || def === null) return saved;
  if (typeof saved !== 'object' || Array.isArray(saved)) return def;
  const out = { ...def };
  for (const k of Object.keys(saved)) {
    const d = def[k];
    const s = saved[k];
    out[k] = d && typeof d === 'object' && !Array.isArray(d) && s && typeof s === 'object' && !Array.isArray(s) ? { ...d, ...s } : s;
  }
  return out;
}

export function mergeAll(rows) {
  const saved = {};
  for (const r of rows || []) saved[r.key] = r.value;
  const out = {};
  for (const k of Object.keys(DEFAULTS)) out[k] = mergeDefaults(DEFAULTS[k], saved[k]);
  return out;
}

// All website settings, cached and refreshed instantly when the dashboard saves (and at most every 5 minutes otherwise).
export async function getSettings() {
  try {
    const res = await fetch(`${URL_BASE}/rest/v1/site_settings?select=key,value`, {
      headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
      next: { tags: [SITE_TAG], revalidate: 300 },
    });
    if (!res.ok) return mergeAll([]);
    return mergeAll(await res.json());
  } catch {
    return mergeAll([]);
  }
}

export async function getPosts(fields = 'slug,title,excerpt,category,emoji,read_time,thumbnail,cover_image,published_at') {
  try {
    const res = await fetch(`${URL_BASE}/rest/v1/posts?select=${fields}&published=eq.true&order=published_at.desc`, {
      headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
      next: { tags: [POSTS_TAG], revalidate: 300 },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

// Is a link pointing at a page that has been switched off?
export function isHrefDisabled(href, s) {
  if (!href || typeof href !== 'string') return false;
  const path = href.split(/[?#]/)[0].replace(/\/+$/, '') || '/';
  for (const [key, p] of Object.entries(PAGE_PATHS)) {
    if ((path === p || path.startsWith(p + '/')) && s.pages?.[key] && s.pages[key].enabled === false) return true;
  }
  const cp = (s.custom_pages?.pages || []).find((x) => `/${x.slug}` === path);
  if (cp && cp.enabled === false) return true;
  return false;
}

export function pageEnabled(key, s) {
  return s.pages?.[key]?.enabled !== false;
}

export function categoryLabels(s) {
  return Object.fromEntries((s.categories?.items || []).map((c) => [c.slug, c.label]));
}
