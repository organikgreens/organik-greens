import { notFound } from 'next/navigation';
import ReaderMessage from '@/components/ReaderMessage';
import PromoSlot from '@/components/PromoSlot';
import FaqList from '@/components/FaqList';
import { getSettings } from '@/lib/site';
import { rich, on } from '@/lib/rich';

export async function generateMetadata() {
  const s = await getSettings();
  return { title: s.contact.seo_title, description: s.contact.seo_description };
}

const WA_ICON = <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>;

const pill = { display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '.8rem', fontWeight: 600, color: 'var(--ink-2)', background: 'var(--surface)', border: '1px solid var(--rule)', padding: '8px 14px', borderRadius: 50 };

export default async function ContactPage() {
  const s = await getSettings();
  if (s.pages.contact?.enabled === false) notFound();
  const c = s.contact;
  const kinds = (c.form_kinds || []).filter((k) => k.value && k.label).map((k) => [k.value, k.label]);
  return (
    <div id="pg-contact" className="pg on">
      <div className="contact-section">
        <div className="contact-inner">
          <div className="appear">
            {c.eyebrow ? <div className="eyebrow">{c.eyebrow}</div> : null}
            <h1 className="contact-info" style={{ fontFamily: "'DM Serif Display',serif", fontSize: 'clamp(2rem,3vw,2.8rem)', marginBottom: 12 }}>{rich(c.title)}</h1>
            {c.lead ? <p style={{ fontSize: '1rem', color: 'var(--ink-3)', lineHeight: 1.75, marginBottom: 32, maxWidth: 340 }}>{rich(c.lead)}</p> : null}

            {on(c.methods).map((m) => (
              <div className="contact-method" key={m.id}>
                <div className="cm-icon">{m.icon}</div>
                <div>
                  <div className="cm-label">{m.label}</div>
                  <div className="cm-value">{m.value}</div>
                  {m.sub ? <div className="cm-sub">{m.sub}</div> : null}
                  {m.button_label && m.button_href ? (
                    <a href={m.button_href} target="_blank" rel="noreferrer" className="wa-btn">{/wa\.me|whatsapp/i.test(m.button_href) ? WA_ICON : null}{m.button_label}</a>
                  ) : null}
                </div>
              </div>
            ))}

            {c.follow_enabled && (c.follow_links || []).length ? (
              <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid var(--rule)' }}>
                {c.follow_title ? <div className="eyebrow" style={{ marginBottom: 12 }}>{c.follow_title}</div> : null}
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {c.follow_links.map((l) => <a key={l.id} href={l.href || '#'} target={l.href ? '_blank' : undefined} rel="noreferrer" style={pill}>{l.label}</a>)}
                </div>
              </div>
            ) : null}
          </div>

          <div className="appear d2">
            <div className="contact-form-card">
              {c.form_title ? <h2>{c.form_title}</h2> : null}
              <ReaderMessage
                variant="card"
                heading=""
                page="/contact"
                startOpen
                intro={c.form_intro ? <>{rich(c.form_intro)}</> : null}
                kinds={kinds.length ? kinds : undefined}
                placeholder={c.form_placeholder}
              />
            </div>
          </div>
        </div>
      </div>

      <PromoSlot slot="contact_top" />

      {c.faq_enabled && on(c.faqs).length ? (
        <div className="faq-section">
          <div className="faq-inner">
            {c.faq_eyebrow ? <div className="eyebrow" style={{ textAlign: 'center', marginBottom: 8 }}>{c.faq_eyebrow}</div> : null}
            {c.faq_title ? <h2 className="section-title" style={{ textAlign: 'center', marginBottom: 32 }}>{rich(c.faq_title)}</h2> : null}
            <FaqList items={on(c.faqs)} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
