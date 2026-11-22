import { notFound } from 'next/navigation';
import ReaderMessage from '@/components/ReaderMessage';
import PromoSlot from '@/components/PromoSlot';
import { ProductGrid } from '@/components/Sections';
import { getSettings } from '@/lib/site';
import { rich } from '@/lib/rich';

export async function generateMetadata() {
  const s = await getSettings();
  return { title: s.shop_page.seo_title, description: s.shop_page.seo_description };
}

export default async function ShopPage() {
  const s = await getSettings();
  if (s.pages.shop?.enabled === false) notFound();
  const c = s.shop_page;
  return (
    <div id="pg-shop" className="pg on">
      <div className="blog-header">
        <div className="blog-header-inner">
          {c.eyebrow ? <div className="eyebrow">{c.eyebrow}</div> : null}
          <h1 className="section-title" style={{ fontSize: 'clamp(2rem,3.5vw,3rem)' }}>{rich(c.title)}</h1>
          {c.subtitle ? <p style={{ color: 'var(--ink-3)', maxWidth: 540, marginTop: 8, fontSize: '.97rem', lineHeight: 1.7 }}>{rich(c.subtitle)}</p> : null}
        </div>
      </div>
      <PromoSlot slot="shop_top" />
      <section className="section" style={{ background: 'var(--surface)', paddingTop: 40 }}>
        <div className="section-inner">
          {c.notice_title ? <div className="eyebrow" style={{ marginBottom: 20 }}>{c.notice_title}</div> : null}
          {c.notice_text ? <p style={{ color: 'var(--ink-3)', maxWidth: 600, marginBottom: 32 }}>{rich(c.notice_text)}</p> : null}
          <ProductGrid items={c.items} s={s} />
        </div>
      </section>
      {c.ask_enabled ? (
        <ReaderMessage
          variant="section"
          id="ask"
          eyebrow={c.ask_eyebrow}
          heading={c.ask_heading}
          page="/shop"
          kinds={[['product', 'A product I am interested in'], ['question', 'A question'], ['suggestion', 'A suggestion'], ['other', 'Something else']]}
          placeholder={c.ask_placeholder}
          intro={c.ask_intro ? <>{rich(c.ask_intro)}</> : null}
        />
      ) : null}
    </div>
  );
}
