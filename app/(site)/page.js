import { getSettings, getPosts } from '@/lib/site';
import PromoSlot from '@/components/PromoSlot';
import { Hero, Ticker, Pillars, Latest, Philosophy, Testimonials, Store, Ask, Cta, Block } from '@/components/Sections';

export default async function HomePage() {
  const s = await getSettings();
  const sections = (s.home_layout.sections || []).filter((x) => x.enabled !== false);
  let featuredPost = null;
  if (s.hero.featured?.mode === 'post' && s.hero.featured.post_slug) {
    const posts = await getPosts();
    featuredPost = posts.find((p) => p.slug === s.hero.featured.post_slug) || null;
  }
  return (
    <div id="pg-home" className="pg on">
      {sections.map((sec) => {
        switch (sec.type) {
          case 'hero': return <Hero key={sec.id} c={s.hero} s={s} featuredPost={featuredPost} />;
          case 'ticker': return <Ticker key={sec.id} c={s.ticker} />;
          case 'pillars': return <Pillars key={sec.id} c={s.pillars} s={s} />;
          case 'latest': return s.pages.blog?.enabled === false ? null : <Latest key={sec.id} c={s.latest} s={s} />;
          case 'philosophy': return <Philosophy key={sec.id} c={s.philosophy} />;
          case 'testimonials': return <Testimonials key={sec.id} c={s.testimonials} />;
          case 'store': return <Store key={sec.id} c={s.store} s={s} />;
          case 'ask': return <Ask key={sec.id} c={s.ask} />;
          case 'cta': return <Cta key={sec.id} c={s.cta} s={s} />;
          case 'promo': return <PromoSlot key={sec.id} slot={sec.slot || 'home_1'} />;
          case 'custom': return <Block key={sec.id} b={{ ...(sec.block || {}), enabled: true }} s={s} page="/" />;
          default: return null;
        }
      })}
    </div>
  );
}
