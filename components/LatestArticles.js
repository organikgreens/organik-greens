'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import Thumb from '@/components/Thumb';

// Homepage articles block. 'latest' = newest first; 'manual' = the articles picked in the dashboard, in that order
// (optionally topped up with the newest ones). Fetched in the browser so newly published articles appear instantly.
export default function LatestArticles({ config = {}, labels = {} }) {
  const [posts, setPosts] = useState(null);
  const count = Math.max(1, Math.min(24, Number(config.count) || 6));
  const mode = config.mode || 'latest';
  const picked = (config.featured_slugs || []).filter(Boolean);
  const fill = config.fill_with_latest !== false;
  const key = `${mode}|${picked.join(',')}|${count}|${fill}`;

  useEffect(() => {
    let off = false;
    supabase
      .from('posts')
      .select('slug, title, excerpt, category, emoji, read_time, thumbnail, cover_image')
      .eq('published', true)
      .order('published_at', { ascending: false })
      .limit(60)
      .then(({ data }) => {
        if (off) return;
        const all = data || [];
        let list;
        if (mode === 'manual' && picked.length) {
          const bySlug = Object.fromEntries(all.map((p) => [p.slug, p]));
          list = picked.map((s) => bySlug[s]).filter(Boolean);
          if (fill) list = [...list, ...all.filter((p) => !picked.includes(p.slug))];
        } else list = all;
        setPosts(list.slice(0, count));
      });
    return () => { off = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  if (posts === null) return <div className="posts-loading" style={{ marginTop: 32 }}>Loading the latest articles…</div>;
  if (!posts.length) return null;
  const author = config.author_label ?? 'Organik Greens';
  const Card = ({ p, large = false, delay = 1 }) => (
    <Link href={`/blog/${p.slug}`} className={`post ${large ? 'large' : ''} appear d${delay}`}>
      <Thumb post={p} className={`post-thumb ${large ? 'tall' : ''}`} eager={large} />
      <div className="post-body">
        <span className="post-cat">{labels[p.category] || p.category}</span>
        <h3>{p.title}</h3>
        {config.show_excerpt !== false && p.excerpt ? <p>{p.excerpt}</p> : null}
        <div className="post-meta"><span>{author}</span><span className="post-read">{p.read_time}</span></div>
      </div>
    </Link>
  );

  if (config.layout === 'grid') {
    return (
      <div className="posts-row" style={{ marginTop: 32 }}>
        {posts.map((p, i) => <Card key={p.slug} p={p} delay={(i % 6) + 1} />)}
      </div>
    );
  }
  const [first, ...rest] = posts;
  const side = rest.slice(0, 2);
  const row = rest.slice(2);
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
          {row.map((p, i) => <Card key={p.slug} p={p} delay={(i % 6) + 1} />)}
        </div>
      ) : null}
    </>
  );
}
