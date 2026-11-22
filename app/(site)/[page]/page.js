import { notFound } from 'next/navigation';
import { getSettings } from '@/lib/site';
import { Block } from '@/components/Sections';
import { rich } from '@/lib/rich';

// Pages created in the dashboard (Pages → Custom pages), e.g. /privacy-policy or /partners.
async function find(slug) {
  const s = await getSettings();
  const p = (s.custom_pages.pages || []).find((x) => x.slug === slug && x.enabled !== false);
  return { s, p };
}

export async function generateMetadata({ params }) {
  const { page } = await params;
  const { p } = await find(page);
  if (!p) return { title: 'Page not found — Organik Greens' };
  return { title: p.seo_title || `${p.title} — Organik Greens`, description: p.seo_description || undefined, robots: p.noindex ? { index: false } : undefined };
}

export default async function CustomPage({ params }) {
  const { page } = await params;
  const { s, p } = await find(page);
  if (!p) notFound();
  return (
    <div className="pg on">
      {p.show_header !== false ? (
        <div className="blog-header">
          <div className="blog-header-inner">
            {p.eyebrow ? <div className="eyebrow">{p.eyebrow}</div> : null}
            <h1 className="section-title" style={{ fontSize: 'clamp(2rem,3.5vw,3rem)' }}>{rich(p.title)}</h1>
            {p.subtitle ? <p style={{ color: 'var(--ink-3)', maxWidth: 600, marginTop: 8, fontSize: '.97rem', lineHeight: 1.7 }}>{rich(p.subtitle)}</p> : null}
          </div>
        </div>
      ) : <div style={{ height: 64 }} />}
      {(p.blocks || []).map((b, i) => <Block key={b.id || i} b={b} s={s} page={`/${p.slug}`} />)}
    </div>
  );
}
