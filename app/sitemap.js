import { getSettings, getPosts } from '@/lib/site';

// Lists every public page and every published article for search engines.
// Pages switched off in the dashboard are left out. Rebuilt at most every 10 minutes.
export const revalidate = 600;

const SITE = 'https://www.organikgreens.com';

export default async function sitemap() {
  const s = await getSettings();
  const on = (k) => s.pages?.[k]?.enabled !== false;
  const pages = [
    { url: `${SITE}/`, changeFrequency: 'weekly', priority: 1 },
    on('blog') && { url: `${SITE}/blog`, changeFrequency: 'daily', priority: 0.9 },
    on('about') && { url: `${SITE}/about`, changeFrequency: 'monthly', priority: 0.5 },
    on('contact') && { url: `${SITE}/contact`, changeFrequency: 'yearly', priority: 0.4 },
    on('shop') && { url: `${SITE}/shop`, changeFrequency: 'monthly', priority: 0.4 },
    ...(s.custom_pages.pages || []).filter((p) => p.enabled !== false && !p.noindex && p.slug)
      .map((p) => ({ url: `${SITE}/${p.slug}`, changeFrequency: 'monthly', priority: 0.4 })),
  ].filter(Boolean);
  if (!on('blog')) return pages;
  const posts = (await getPosts('slug,updated_at,published_at')).map((p) => ({
    url: `${SITE}/blog/${p.slug}`,
    lastModified: new Date(p.updated_at || p.published_at || Date.now()),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));
  return [...pages, ...posts];
}
