import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import ReaderMessage from '@/components/ReaderMessage';

// Server-side Supabase client (safe to use anon key here too; RLS still applies)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function getPost(slug) {
  const { data } = await supabase
    .from('posts')
    .select('slug, title, meta_title, excerpt, category, emoji, read_time, body, cover_image, published, published_at')
    .eq('slug', slug)
    .eq('published', true)
    .single();
  return data;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: 'Article not found — Organik Greens' };
  return {
    title: `${post.meta_title || post.title} — Organik Greens`,
    description: post.excerpt,
    alternates: { canonical: `https://www.organikgreens.com/blog/${post.slug}` },
    openGraph: {
      title: post.meta_title || post.title,
      description: post.excerpt,
      type: 'article',
      url: `https://www.organikgreens.com/blog/${post.slug}`,
      images: post.cover_image ? [{ url: post.cover_image }] : undefined,
    },
  };
}

const CATEGORY_LABELS = {
  'organic-farming': 'Organic Farming',
  'urban-farming': 'Urban Farming',
  'hydroponics': 'Hydroponics',
  'soil-seeds': 'Soil & Seeds',
  'health-food': 'Health & Food',
  'agri-business': 'Agri Business',
};

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  const year = post.published_at ? new Date(post.published_at).getFullYear() : new Date().getFullYear();

  return (
    <div id="pg-article" className="pg on">
      <div id="artContent">
        <div className="art-hero">
          <div className="art-hero-inner">
            <Link href="/blog" className="art-back">← Back to Blog</Link>
            <span className="post-cat">{CATEGORY_LABELS[post.category] || post.category}</span>
            <h1>{post.title}</h1>
            <div className="art-meta">
              <span>Organik Greens</span>
              <span className="art-meta-dot"></span>
              <span>{post.read_time} read</span>
              <span className="art-meta-dot"></span>
              <span>{year}</span>
            </div>
          </div>
        </div>
        <div className="art-body-wrap">
          <div className="art-summary">
            <strong>Summary</strong>
            <p>{post.excerpt}</p>
          </div>
          <div className="art-body" dangerouslySetInnerHTML={{ __html: post.body }} />
          <ReaderMessage slug={post.slug} title={post.title} />
        </div>
      </div>
    </div>
  );
}
