import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import Newsletter from '@/components/Newsletter';

// Private draft preview. Shows a post (published or not) only when ?key= matches the
// post's secret preview_token. Never indexed by search engines.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export const dynamic = 'force-dynamic';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function getDraft(slug, key) {
  if (!key || !UUID.test(key)) return null;
  const { data } = await supabase.rpc('get_post_preview', { p_slug: slug, p_token: key });
  return Array.isArray(data) ? data[0] || null : data || null;
}

export async function generateMetadata({ params, searchParams }) {
  const { slug } = await params;
  const { key } = await searchParams;
  const post = await getDraft(slug, key);
  return {
    title: post ? `Preview: ${post.meta_title || post.title} — Organik Greens` : 'Preview not found — Organik Greens',
    description: post?.excerpt || '',
    robots: { index: false, follow: false, nocache: true },
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

export default async function PreviewPage({ params, searchParams }) {
  const { slug } = await params;
  const { key } = await searchParams;
  const post = await getDraft(slug, key);
  if (!post) notFound();

  const year = post.published_at ? new Date(post.published_at).getFullYear() : new Date().getFullYear();

  return (
    <div id="pg-article" className="pg on">
      <div className="preview-bar">
        <strong>{post.published ? 'Preview of a live article' : 'Draft preview'}</strong>
        <span>Only people with this link can see this page. It is not listed on the blog or in Google.</span>
      </div>
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
          {post.excerpt ? (
            <div className="art-summary">
              <strong>Summary</strong>
              <p>{post.excerpt}</p>
            </div>
          ) : null}
          <div className="art-body" dangerouslySetInnerHTML={{ __html: post.body }} />
          <div className="art-cta">
            <h3>Enjoyed this article?</h3>
            <p>Get practical growing tips every Monday — free in your inbox.</p>
            <Newsletter heading="" eyebrow="" description="" buttonLabel="Subscribe" note="" source={`preview:${post.slug}`} />
          </div>
        </div>
      </div>
    </div>
  );
}
