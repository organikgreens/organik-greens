'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Thumb from '@/components/Thumb';

const CATEGORIES = [
  ['all', 'All Topics'],
  ['organic-farming', 'Organic Farming'],
  ['urban-farming', 'Urban Farming'],
  ['hydroponics', 'Hydroponics'],
  ['soil-seeds', 'Soil & Seeds'],
  ['health-food', 'Health & Food'],
  ['agri-business', 'Agri Business'],
];

const CATEGORY_LABELS = Object.fromEntries(CATEGORIES);

function BlogContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('slug, title, excerpt, category, emoji, read_time, thumbnail, cover_image')
        .eq('published', true)
        .order('published_at', { ascending: false });
      if (!cancelled) {
        if (error) setError(error.message);
        else setPosts(data || []);
        setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const filtered = activeCategory === 'all' ? posts : posts.filter((p) => p.category === activeCategory);

  return (
    <div id="pg-blog" className="pg on">
      <div className="blog-header">
        <div className="blog-header-inner">
          <div className="eyebrow">All Articles</div>
          <h1 className="section-title" style={{ fontSize: 'clamp(2rem,3.5vw,3rem)' }}>The Organik Greens <em>Blog</em></h1>
          <p style={{ color: 'var(--ink-3)', maxWidth: 500, marginTop: 8, fontSize: '.97rem', lineHeight: 1.7 }}>Practical, honest, India-first knowledge on organic farming, urban growing, hydroponics, and more.</p>
          <div className="filter-pills">
            {CATEGORIES.map(([slug, label]) => (
              <button
                key={slug}
                className={`pill${activeCategory === slug ? ' on' : ''}`}
                onClick={() => setActiveCategory(slug)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <section className="section" style={{ background: 'var(--surface)', paddingTop: 40 }}>
        <div className="section-inner">
          {loading && <p style={{ color: 'var(--ink-3)' }}>Loading articles…</p>}
          {error && <p style={{ color: 'var(--amber)' }}>Couldn't load articles: {error}</p>}
          {!loading && !error && filtered.length === 0 && (
            <p style={{ color: 'var(--ink-3)' }}>No articles published yet in this category — check back soon.</p>
          )}
          <div className="blog-grid">
            {filtered.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="blog-card">
                <Thumb post={p} />
                <div className="blog-body">
                  <span className="post-cat">{CATEGORY_LABELS[p.category] || p.category}</span>
                  <h3>{p.title}</h3>
                  <p>{p.excerpt}</p>
                  <div className="blog-meta">
                    <span>Organik Greens</span>
                    <span className="read-time">{p.read_time}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default function BlogPage() {
  return (
    <Suspense fallback={<div className="section-inner" style={{ padding: '140px 24px' }} />}>
      <BlogContent />
    </Suspense>
  );
}
