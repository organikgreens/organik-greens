import { notFound } from 'next/navigation';
import ReaderMessage from '@/components/ReaderMessage';
import PromoSlot from '@/components/PromoSlot';
import { getSettings, isHrefDisabled } from '@/lib/site';
import { rich, paragraphs, SmartLink, on } from '@/lib/rich';

export async function generateMetadata() {
  const s = await getSettings();
  return { title: s.about.seo_title, description: s.about.seo_description };
}

const valueBox = { display: 'flex', gap: 14, background: 'var(--surface)', border: '1px solid var(--rule)', borderRadius: 'var(--r-sm)', padding: 16 };

export default async function AboutPage() {
  const s = await getSettings();
  if (s.pages.about?.enabled === false) notFound();
  const c = s.about;
  const why = paragraphs(c.why_text);
  return (
    <div id="pg-about" className="pg on">
      <div className="about-hero">
        <div className="about-hero-inner">
          <div className="appear">
            {c.eyebrow ? <div className="eyebrow">{c.eyebrow}</div> : null}
            <h1>{rich(c.title)}</h1>
            {c.lead ? <p style={{ fontSize: '1.05rem', color: 'var(--ink-3)', lineHeight: 1.8, maxWidth: 480, marginTop: 16 }}>{rich(c.lead)}</p> : null}
            {c.button_label && c.button_href && !isHrefDisabled(c.button_href, s) ? <SmartLink href={c.button_href} className="btn btn-dark" style={{ marginTop: 24 }}>{c.button_label}</SmartLink> : null}
          </div>
          <div className="appear d2">
            <div className="about-img" style={c.hero_image ? { backgroundImage: `url(${c.hero_image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}>
              {c.hero_image ? null : c.hero_icon}
              {c.badge_value || c.badge_label ? <div className="about-badge"><span className="about-badge-n">{c.badge_value}</span><span className="about-badge-l">{c.badge_label}</span></div> : null}
            </div>
          </div>
        </div>
      </div>

      <section className="section" style={{ background: 'var(--white)' }}>
        <div className="section-inner">
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            {c.quote ? (
              <div style={{ background: 'var(--g-faint)', borderLeft: '3px solid var(--g-base)', borderRadius: '0 var(--r-sm) var(--r-sm) 0', padding: '20px 24px', marginBottom: 40 }}>
                <p style={{ fontFamily: "'DM Serif Display',serif", fontSize: '1.3rem', color: 'var(--ink)', lineHeight: 1.5, fontStyle: 'italic', margin: 0 }}>{rich(c.quote)}</p>
              </div>
            ) : null}
            {c.why_title ? <h2 style={{ fontSize: '1.8rem', marginBottom: 12 }}>{rich(c.why_title)}</h2> : null}
            {why.map((p, i) => <p key={i} style={{ color: 'var(--ink-3)', lineHeight: 1.8, marginBottom: i === why.length - 1 ? '2.5rem' : '1rem' }}>{rich(p)}</p>)}

            {c.vision || c.mission ? (
              <>
                {c.vm_title ? <h2 style={{ fontSize: '1.8rem', marginBottom: 24 }}>{rich(c.vm_title)}</h2> : null}
                <div style={{ display: 'grid', gridTemplateColumns: c.vision && c.mission ? '1fr 1fr' : '1fr', gap: 16, marginBottom: 40 }}>
                  {c.vision ? (
                    <div style={{ background: 'var(--g-dark)', color: '#fff', padding: 24, borderRadius: 'var(--r)' }}>
                      <div style={{ fontSize: '.72rem', fontWeight: 700, color: 'rgba(255,255,255,.4)', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 8 }}>Vision</div>
                      <p style={{ fontSize: '.9rem', lineHeight: 1.7, color: 'rgba(255,255,255,.8)', margin: 0 }}>{rich(c.vision)}</p>
                    </div>
                  ) : null}
                  {c.mission ? (
                    <div style={{ background: 'var(--g-faint)', border: '1px solid var(--g-light)', padding: 24, borderRadius: 'var(--r)' }}>
                      <div style={{ fontSize: '.72rem', fontWeight: 700, color: 'var(--g-mid)', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 8 }}>Mission</div>
                      <p style={{ fontSize: '.9rem', lineHeight: 1.7, color: 'var(--ink-3)', margin: 0 }}>{rich(c.mission)}</p>
                    </div>
                  ) : null}
                </div>
              </>
            ) : null}

            {c.timeline_enabled && on(c.timeline).length ? (
              <>
                {c.timeline_title ? <h2 style={{ fontSize: '1.8rem', marginBottom: 20 }}>{rich(c.timeline_title)}</h2> : null}
                <div className="timeline">
                  {on(c.timeline).map((t) => <div className="tl-item" key={t.id}><div className="tl-year">{t.when}</div><h4>{t.title}</h4><p>{rich(t.text)}</p></div>)}
                </div>
              </>
            ) : null}

            {on(c.values).length ? (
              <>
                {c.values_title ? <h2 style={{ fontSize: '1.8rem', margin: '40px 0 20px' }}>{rich(c.values_title)}</h2> : null}
                <div style={{ display: 'grid', gap: 12 }}>
                  {on(c.values).map((v) => (
                    <div key={v.id} style={valueBox}><div style={{ fontSize: '1.25rem', minWidth: 24 }}>{v.icon}</div><div><strong style={{ color: 'var(--ink)', display: 'block', marginBottom: 3 }}>{v.title}</strong><p style={{ fontSize: '.88rem', color: 'var(--ink-3)', margin: 0, lineHeight: 1.65 }}>{rich(v.text)}</p></div></div>
                  ))}
                </div>
              </>
            ) : null}
          </div>
        </div>
      </section>

      {c.featured_enabled && (c.featured_logos || []).length ? (
        <div className="logo-strip">
          <div className="logo-strip-inner">
            {c.featured_label ? <p>{c.featured_label}</p> : null}
            <div className="partner-logos">
              {c.featured_logos.map((l) => {
                const inner = l.image_url ? <img src={l.image_url} alt={l.name} style={{ height: 28, width: 'auto' }} /> : l.name;
                return l.href ? <SmartLink key={l.id} href={l.href} className="partner-logo">{inner}</SmartLink> : <span key={l.id} className="partner-logo">{inner}</span>;
              })}
            </div>
          </div>
        </div>
      ) : null}

      <PromoSlot slot="about_bottom" />

      {c.ask_enabled ? (
        <ReaderMessage variant="section" id="ask" eyebrow={c.ask_eyebrow} heading={c.ask_heading} page="/about" intro={c.ask_intro ? <>{rich(c.ask_intro)}</> : null} />
      ) : null}
    </div>
  );
}
