import { createClient } from '@supabase/supabase-js';

// Lists every public page and every published article for search engines.
// Rebuilt at most every 10 minutes, so newly published articles appear quickly.
export const revalidate = 600;

const SITE = 'https://www.organikgreens.com';

export default async function sitemap() {
  const pages = [
    { url: `${SITE}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE}/blog`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE}/about`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE}/contact`, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${SITE}/shop`, changeFrequency: 'monthly', priority: 0.4 },
  ];
  let posts = [];
  try {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    const { data } = await supabase
      .from('posts')
      .select('slug, updated_at, published_at')
      .eq('published', true)
      .order('published_at', { ascending: false });
    posts = (data || []).map((p) => ({
      url: `${SITE}/blog/${p.slug}`,
      lastModified: new Date(p.updated_at || p.published_at || Date.now()),
      changeFrequency: 'monthly',
      priority: 0.8,
    }));
  } catch (e) {
    posts = [];
  }
  return [...pages, ...posts];
}
