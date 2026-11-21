'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import Thumb from '@/components/Thumb';

const CATEGORY_LABELS = {
  'organic-farming': 'Organic Farming',
  'urban-farming': 'Urban Farming',
  'hydroponics': 'Hydroponics',
  'soil-seeds': 'Soil & Seeds',
  'health-food': 'Health & Food',
  'agri-business': 'Agri Business',
};

// Homepage "Latest Articles": the six most recent published articles, with their thumbnails.
export default function LatestArticles() {
  const [posts, setPosts] = useState(null);
  useEffect(() => {
    let off = false;
    supabase
      .from('posts')
      .select('slug, title, excerpt, category, emoji, read_time, thumbnail, cover_image')
      .eq('published', true)
      .order('published_at', { ascending: false })
      .limit(6)
      .then(({ data }) => { if (!off) setPosts(data || []); });
    return () => { off = true; };
  }, []);

  if (posts === null) return <div className="posts-loading" style={{ marginTop: 32 }}>Loading the latest articles…</div>;
  if (!posts.length) return null;
  const [first, ...rest] = posts;
  const side = rest.slice(0, 2);
  const row = rest.slice(2, 5);
  const Card = ({ p, large = false, delay = 1 }) => (
    <Link href={`/blog/${p.slug}`} className={`post ${large ? 'large' : ''} appear d${delay}`}>
      <Thumb post={p} className={`post-thumb ${large ? 'tall' : ''}`} eager={large} />
      <div className="post-body">
        <span className="post-cat">{CATEGORY_LABELS[p.category] || p.category}</span>
        <h3>{p.title}</h3>
        {p.excerpt ? <p>{p.excerpt}</p> : null}
        <div className="post-meta"><span>Organik Greens</span><span className="post-read">{p.read_time}</span></div>
      </div>
    </Link>
  );
  return (
    <>
      <div className="posts-hero" style={{ marginTop: 32 }}>
        <Card p={first} large />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {side.map((p, i) => <Card key={p.slug} p={p} delay={i + 2} />)}
        </div>
      </div>
      {row.length ? (
        <div className="posts-row" style={{ marginTop: 20 }}>
          {row.map((p, i) => <Card key={p.slug} p={p} delay={i + 1} />)}
        </div>
      ) : null}
    </>
  );
}
