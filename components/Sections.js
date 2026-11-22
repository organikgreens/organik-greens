import ReaderMessage from '@/components/ReaderMessage';
import LatestArticles from '@/components/LatestArticles';
import PromoSlot from '@/components/PromoSlot';
import FaqList from '@/components/FaqList';
import { rich, paragraphs, SmartLink, on } from '@/lib/rich';
import { isHrefDisabled, categoryLabels } from '@/lib/site';

const PAD = { compact: '18px 16px', normal: '28px 24px', roomy: '40px 32px' };
const bg = (c) => (c ? { background: c } : {});
const btnClass = { dark: 'btn btn-dark', outline: 'btn btn-outline', green: 'btn btn-green', white: 'btn-white', ghost: 'btn-ghost' };

function Buttons({ list, s, style }) {
  const items = on(list).filter((b) => !isHrefDisabled(b.href, s));
  if (!items.length) return null;
  return items.map((b) => <SmartLink key={b.id || b.label} href={b.href} className={btnClass[b.style] || 'btn btn-dark'} newTab={b.new_tab} style={style}>{b.label}</SmartLink>);
}

function Header({ eyebrow, title, subtitle, align = 'left', eyebrowStyle, titleStyle, subStyle, emStyle }) {
  if (!eyebrow && !title && !subtitle) return null;
  return (
    <div className={`section-header appear${align === 'center' ? ' center' : ''}`} style={align === 'right' ? { textAlign: 'right' } : undefined}>
      {eyebrow ? <div className="eyebrow" style={eyebrowStyle}>{eyebrow}</div> : null}
      {title ? <h2 className="section-title" style={titleStyle}>{rich(title, { emStyle })}</h2> : null}
      {subtitle ? <p className="section-sub" style={subStyle}>{rich(subtitle)}</p> : null}
    </div>
  );
}

export function Hero({ c, s, featuredPost }) {
  const f = c.featured || {};
  const usePost = f.mode === 'post' && featuredPost;
  const fTitle = usePost ? featuredPost.title : f.title;
  const fText = usePost ? featuredPost.excerpt : f.text;
  const fHref = usePost ? `/blog/${featuredPost.slug}` : f.href;
  const fImg = f.image_url || (usePost ? featuredPost.thumbnail || featuredPost.cover_image : '');
  const cards = on(c.small_cards);
  const wrapStyle = c.background_image
    ? { backgroundImage: `url(${c.background_image})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : bg(c.background);
  const showVisual = f.enabled || (c.small_cards_enabled && cards.length);
  return (
    <div style={wrapStyle}>
      <div className="hero appear" style={{ ...(showVisual ? {} : { gridTemplateColumns: '1fr' }), textAlign: c.text_align || 'left' }}>
        <div>
          {c.eyebrow ? <div className="hero-eyebrow"><span className="hero-dot"></span>{c.eyebrow}</div> : null}
          <h1>{rich(c.title)}</h1>
          {c.lead ? <p className="hero-lead">{rich(c.lead)}</p> : null}
          <div className="hero-actions" style={c.text_align === 'center' ? { justifyContent: 'center' } : undefined}><Buttons list={c.buttons} s={s} /></div>
          {c.stats_enabled && c.stats?.length ? (
            <div className="hero-stats" style={c.text_align === 'center' ? { justifyContent: 'center' } : undefined}>
              {c.stats.map((x) => <div key={x.id || x.label}><span className="hero-stat-n">{x.value}</span><span className="hero-stat-l">{x.label}</span></div>)}
            </div>
          ) : null}
        </div>
        {showVisual ? (
          <div className="hero-visual" style={{ textAlign: 'left' }}>
            {f.enabled ? (
              <div className="hero-card-main">
                {fImg ? <img src={fImg} alt="" style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 'var(--r-sm)', marginBottom: 12 }} /> : null}
                {f.chip ? <div className="hero-tag-chip">{f.chip}</div> : null}
                <h4>{fTitle}</h4>
                {fText ? <p>{fText}</p> : null}
                {f.button_label && fHref ? <SmartLink href={fHref} className="btn btn-dark" style={{ marginTop: 16, fontSize: '.8rem', padding: '9px 18px' }}>{f.button_label}</SmartLink> : null}
              </div>
            ) : null}
            {c.small_cards_enabled && cards.length ? (
              <div className="hero-cards-row">
                {cards.map((k) => {
                  const chipStyle = k.chip_style === 'amber' ? { background: 'var(--amber-bg)', color: 'var(--amber)' } : {};
                  const inner = (
                    <>
                      {k.chip ? <div className="hero-tag-chip" style={{ fontSize: '.65rem', padding: '2px 8px', ...chipStyle }}>{k.chip}</div> : null}
                      <div className="hero-card-sm-row" style={{ marginTop: 8 }}>
                        <div><div style={{ fontSize: '.82rem', fontWeight: 600, color: 'var(--ink)' }}>{k.title}</div><div style={{ fontSize: '.75rem', color: 'var(--ink-4)' }}>{k.sub}</div></div>
                        <span style={{ fontSize: '1.5rem' }}>{k.icon}</span>
                      </div>
                    </>
                  );
                  return k.href && !isHrefDisabled(k.href, s)
                    ? <SmartLink key={k.id} href={k.href} className="hero-card-sm" style={{ display: 'block' }}>{inner}</SmartLink>
                    : <div key={k.id} className="hero-card-sm">{inner}</div>;
                })}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function Ticker({ c }) {
  const items = (c.items || []).filter(Boolean);
  if (!items.length) return null;
  const doubled = [...items, ...items];
  return (
    <div className="ticker" style={bg(c.background)}>
      <div className="ticker-inner" style={c.speed_seconds ? { animationDuration: `${Number(c.speed_seconds)}s` } : undefined}>
        {doubled.map((t, i) => <span className="ticker-item" key={i}><span className="ticker-dot"></span>{t}</span>)}
      </div>
    </div>
  );
}

export function Pillars({ c, s }) {
  const items = on(c.items).filter((p) => !isHrefDisabled(p.href, s));
  const media = c.media || 'icon';
  const cardStyle = {
    padding: PAD[c.padding] || PAD.normal,
    textAlign: c.text_align || 'left',
    ...(c.indent ? { paddingLeft: `calc(${(PAD[c.padding] || PAD.normal).split(' ')[1]} + ${Number(c.indent)}px)` } : {}),
    ...bg(c.card_background),
  };
  return (
    <section className="section" style={{ background: c.background || 'var(--surface)' }}>
      <div className="section-inner">
        <Header eyebrow={c.eyebrow} title={c.title} subtitle={c.subtitle} align={c.header_align} />
        <div className={`pillars-grid${c.layout === 'cards' ? ' cards' : ''}`} style={{ '--cols': Number(c.columns) || 3 }}>
          {items.map((p, i) => {
            const body = (
              <>
                {(media === 'image' || media === 'both') && p.image_url ? <img className="pillar-img" src={p.image_url} alt="" style={{ height: Number(c.image_height) || 140 }} loading="lazy" /> : null}
                {(media === 'icon' || media === 'both' || (media === 'image' && !p.image_url)) && p.icon ? <div className="pillar-icon" style={{ fontSize: `${Number(c.icon_size) || 1.6}rem` }}>{p.icon}</div> : null}
                <h3>{p.title}</h3>
                {p.desc ? <p>{rich(p.desc)}</p> : null}
                {c.show_link && p.href ? <span className="pillar-link">{p.link_label || 'Explore'} <span className="pillar-arrow">→</span></span> : null}
              </>
            );
            return p.href
              ? <SmartLink key={p.id} href={p.href} className={`pillar appear d${(i % 6) + 1}`} style={{ ...cardStyle, display: 'block' }}>{body}</SmartLink>
              : <div key={p.id} className={`pillar appear d${(i % 6) + 1}`} style={cardStyle}>{body}</div>;
          })}
        </div>
      </div>
    </section>
  );
}

export function Latest({ c, s }) {
  return (
    <section className="section" style={{ background: c.background || 'var(--white)' }}>
      <div className="section-inner">
        <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12 }}>
          <div className="appear">
            {c.eyebrow ? <div className="eyebrow">{c.eyebrow}</div> : null}
            {c.title ? <h2 className="section-title" style={{ marginBottom: 0 }}>{rich(c.title)}</h2> : null}
          </div>
          {c.button_label && !isHrefDisabled(c.button_href, s) ? <SmartLink href={c.button_href || '/blog'} className="btn btn-outline appear">{c.button_label}</SmartLink> : null}
        </div>
        <LatestArticles config={c} labels={categoryLabels(s)} />
      </div>
    </section>
  );
}

export function Philosophy({ c }) {
  const items = on(c.items);
  return (
    <section className="section" style={{ background: c.background || 'var(--surface)' }}>
      <div className="section-inner">
        <Header eyebrow={c.eyebrow} title={c.title} subtitle={c.subtitle} align={c.header_align} />
        <div className="values-grid" style={{ marginTop: 40, '--cols': Number(c.columns) || 2 }}>
          {items.map((v, i) => (
            <div key={v.id} className={`value-card appear d${(i % 6) + 1}`} style={{ textAlign: c.text_align || 'left', ...bg(c.card_background) }}>
              {v.icon ? <div className="value-icon">{v.icon}</div> : null}
              {c.show_numbers ? <div className="value-num">{v.num || String(i + 1).padStart(2, '0')}</div> : null}
              <h4>{v.title}</h4>
              <p>{rich(v.text)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Testimonials({ c }) {
  const items = on(c.items);
  const tc = c.text_color || '';
  return (
    <div className="proof-strip appear" style={bg(c.background)}>
      <div className="proof-strip-inner">
        {c.eyebrow ? <div className="eyebrow" style={{ color: tc || 'rgba(255,255,255,.45)' }}>{c.eyebrow}</div> : null}
        {c.title ? <h2 className="section-title" style={{ color: tc || '#fff', fontSize: '2rem', marginTop: 8 }}>{rich(c.title, { emStyle: { color: tc || 'rgba(255,255,255,.55)', opacity: tc ? 0.7 : 1 } })}</h2> : null}
        <div className="proof-grid" style={{ '--cols': Number(c.columns) || 3 }}>
          {items.map((t) => (
            <div className="proof-card" key={t.id}>
              {c.show_stars && t.stars ? <div className="proof-stars">{'★'.repeat(Math.min(5, Number(t.stars) || 0))}{'☆'.repeat(Math.max(0, 5 - (Number(t.stars) || 0)))}</div> : null}
              <p className="proof-text">&quot;{String(t.text || '').replace(/^["“]|["”]$/g, '')}&quot;</p>
              <div className="proof-author">
                <div className="proof-avatar">{t.photo_url ? <img src={t.photo_url} alt="" /> : String(t.name || '?').trim().charAt(0).toUpperCase()}</div>
                <div><div className="proof-name">{t.name}</div><div className="proof-role">{t.role}</div></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProductGrid({ items, s, linkFallback }) {
  return (
    <div className="shop-grid">
      {on(items).map((p, i) => {
        const d = `appear d${(i % 6) + 1}`;
        if (p.kind === 'product') {
          const href = p.href && !isHrefDisabled(p.href, s) ? p.href : linkFallback;
          return (
            <div className={`product-card ${d}`} key={p.id}>
              <div className="product-img">{p.image_url ? <img src={p.image_url} alt="" /> : p.icon}{p.badge ? <span className="product-badge">{p.badge}</span> : null}</div>
              <div className="product-body">
                <div className="product-name">{p.name}</div>
                <div className="product-desc">{rich(p.desc)}</div>
                <div className="product-footer"><span className="product-price">{p.price}</span>{href ? <SmartLink href={href} className="add-btn">+</SmartLink> : null}</div>
              </div>
            </div>
          );
        }
        return (
          <div className={`coming-soon-card ${d}`} key={p.id}>
            {p.image_url ? <img src={p.image_url} alt="" style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 12, marginBottom: 12 }} /> : <span>{p.icon}</span>}
            <h4>{p.name}</h4>
            <p>{rich(p.desc)}</p>
            {p.price ? <p style={{ fontWeight: 700, color: 'var(--g-mid)', marginTop: 6 }}>{p.price}</p> : null}
          </div>
        );
      })}
    </div>
  );
}

export function Store({ c, s }) {
  if (c.follow_shop_page && s.pages.shop?.enabled === false) return null;
  const btn = c.button_label && c.button_href && !isHrefDisabled(c.button_href, s);
  return (
    <section className="section shop-section">
      <div className="section-inner">
        {c.show_banner ? (
          <div className="shop-banner appear" style={bg(c.banner_background)}>
            <div>
              {c.eyebrow ? <div className="eyebrow" style={{ color: 'rgba(255,255,255,.5)', marginBottom: 8 }}>{c.eyebrow}</div> : null}
              {c.title ? <h3>{rich(c.title)}</h3> : null}
              {c.text ? <p>{rich(c.text)}</p> : null}
            </div>
            {btn ? <SmartLink href={c.button_href} className="btn-white">{c.button_label}</SmartLink> : null}
          </div>
        ) : null}
        {c.show_items ? <ProductGrid items={c.items} s={s} /> : null}
      </div>
    </section>
  );
}

export function Ask({ c, page = '/#ask' }) {
  return <ReaderMessage variant="section" id="ask" eyebrow={c.eyebrow} heading={c.heading} page={page} intro={c.intro ? <>{rich(c.intro)}</> : null} />;
}

export function Cta({ c, s }) {
  return (
    <div className="cta-banner appear" style={bg(c.background)}>
      <div className="cta-banner-inner">
        {c.eyebrow ? <div className="eyebrow" style={{ color: 'rgba(255,255,255,.4)' }}>{c.eyebrow}</div> : null}
        {c.heading ? <h2>{rich(c.heading)}</h2> : null}
        {c.text ? <p>{rich(c.text)}</p> : null}
        <div className="cta-banner-btns"><Buttons list={c.buttons} s={s} /></div>
      </div>
    </div>
  );
}

// Free-form blocks used by custom home sections and custom pages.
export function Block({ b, s, page }) {
  if (!b || b.enabled === false) return null;
  const align = b.align || 'left';
  const wrap = { ...bg(b.background), ...(b.text_color ? { color: b.text_color } : {}), ...(b.padding === 'compact' ? { padding: '32px 24px' } : b.padding === 'roomy' ? { padding: '96px 24px' } : {}) };
  const inner = b.width === 'narrow' ? 'cb-narrow' : 'cb-inner';
  switch (b.type) {
    case 'text':
      return (
        <section className="custom-block" style={wrap}>
          <div className={inner} style={{ textAlign: align }}>
            {b.eyebrow ? <div className="eyebrow">{b.eyebrow}</div> : null}
            {b.heading ? <h2 className="section-title">{rich(b.heading)}</h2> : null}
            {b.body ? <div className="cb-body">{paragraphs(b.body).map((p, i) => <p key={i}>{rich(p)}</p>)}</div> : null}
            {b.buttons?.length ? <div className="cb-buttons" style={{ justifyContent: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start' }}><Buttons list={b.buttons} s={s} /></div> : null}
          </div>
        </section>
      );
    case 'image':
      if (!b.image_url) return null;
      return (
        <section className="custom-block" style={wrap}>
          <div className={inner} style={{ textAlign: align }}>
            {b.heading ? <h2 className="section-title" style={{ marginBottom: 20 }}>{rich(b.heading)}</h2> : null}
            {b.href ? <SmartLink href={b.href}><img src={b.image_url} alt={b.alt || ''} style={{ width: '100%', borderRadius: 'var(--r)', display: 'inline-block' }} /></SmartLink>
              : <img src={b.image_url} alt={b.alt || ''} style={{ width: '100%', borderRadius: 'var(--r)', display: 'inline-block' }} />}
            {b.caption ? <p style={{ fontSize: '.85rem', color: 'var(--ink-4)', marginTop: 10 }}>{rich(b.caption)}</p> : null}
          </div>
        </section>
      );
    case 'cards':
      return (
        <section className="custom-block" style={wrap}>
          <div className={inner}>
            <Header eyebrow={b.eyebrow} title={b.heading} subtitle={b.body} align={align} />
            <div className="cb-cards" style={{ '--cols': Number(b.columns) || 3 }}>
              {on(b.items).map((it) => {
                const content = (<>{it.image_url ? <img src={it.image_url} alt="" /> : null}{it.icon ? <div style={{ fontSize: '1.6rem', marginBottom: 10 }}>{it.icon}</div> : null}<h4>{it.title}</h4>{it.text ? <p>{rich(it.text)}</p> : null}</>);
                return it.href ? <SmartLink key={it.id} href={it.href} className="cb-card" style={{ textAlign: align }}>{content}</SmartLink> : <div key={it.id} className="cb-card" style={{ textAlign: align }}>{content}</div>;
              })}
            </div>
          </div>
        </section>
      );
    case 'cta':
      return <Cta c={{ eyebrow: b.eyebrow, heading: b.heading, text: b.body, buttons: b.buttons, background: b.background }} s={s} />;
    case 'faq':
      return (
        <div className="faq-section" style={wrap}>
          <div className="faq-inner">
            {b.eyebrow ? <div className="eyebrow" style={{ textAlign: 'center', marginBottom: 8 }}>{b.eyebrow}</div> : null}
            {b.heading ? <h2 className="section-title" style={{ textAlign: 'center', marginBottom: 32 }}>{rich(b.heading)}</h2> : null}
            <FaqList items={on(b.items).map((x) => ({ id: x.id, q: x.title, a: x.text }))} />
          </div>
        </div>
      );
    case 'html':
      return <section style={wrap}><div className={inner} dangerouslySetInnerHTML={{ __html: b.html || '' }} /></section>;
    case 'promo':
      return <PromoSlot slot={b.slot || 'custom'} />;
    case 'ask':
      return <ReaderMessage variant="section" id={b.anchor || 'ask'} eyebrow={b.eyebrow} heading={b.heading} page={page} intro={b.body ? <>{rich(b.body)}</> : null} />;
    case 'spacer':
      return <div style={{ height: Number(b.height) || 48, ...bg(b.background) }} />;
    default:
      return null;
  }
}
