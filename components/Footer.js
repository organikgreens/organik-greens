import { isHrefDisabled } from '@/lib/site';
import { on, rich, SmartLink } from '@/lib/rich';

export default function Footer({ s }) {
  const f = s.footer;
  const cols = on(f.columns).map((c) => {
    const links = c.source === 'categories'
      ? (s.categories.items || []).map((x) => ({ id: x.slug, label: x.label, href: `/blog?category=${x.slug}` }))
      : (c.links || []);
    return { ...c, links: links.filter((l) => !isHrefDisabled(l.href, s)) };
  }).filter((c) => s.pages.blog?.enabled !== false || c.source !== 'categories');
  const socials = on(f.socials);
  const logo = s.brand.footer_logo_url || s.brand.logo_url || '/logo.jpg';
  const year = new Date().getFullYear();
  const lastIndex = cols.length - 1;
  const style = {
    '--fcols': `2.2fr ${cols.map(() => '1fr').join(' ')}`.trim(),
    ...(f.background ? { background: f.background } : {}),
    ...(f.text_color ? { color: f.text_color } : {}),
  };

  const contact = f.contact?.enabled ? (
    <>
      <h5 style={{ marginTop: lastIndex >= 0 ? 20 : 0 }}>{f.contact.title || 'Contact'}</h5>
      {f.contact.email ? <a href={`mailto:${f.contact.email}`} style={{ fontSize: '.78rem' }}>{f.contact.email}</a> : null}
      {f.contact.phone ? <a href={`tel:${String(f.contact.phone).replace(/[^+0-9]/g, '')}`} style={{ fontSize: '.78rem' }}>{f.contact.phone}</a> : null}
    </>
  ) : null;

  return (
    <footer id="main-footer" style={style}>
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            {f.show_logo ? <img src={logo} alt={s.brand.logo_alt || 'Organik Greens'} style={{ height: Number(s.brand.footer_logo_height) || 36 }} /> : null}
            {f.description ? <p>{rich(f.description)}</p> : null}
            {socials.length ? (
              <div className="footer-socials">
                {socials.map((x) => x.url
                  ? <a key={x.id} href={x.url} className="fsoc" title={x.label} target="_blank" rel="noreferrer">{x.icon}</a>
                  : <div key={x.id} className="fsoc" title={x.label}>{x.icon}</div>)}
              </div>
            ) : null}
          </div>
          {cols.map((c, i) => (
            <div className="footer-col" key={c.id}>
              <h5>{c.title}</h5>
              {c.links.map((l) => (l.href ? <SmartLink key={l.id || l.label} href={l.href}>{l.label}</SmartLink> : <a key={l.id || l.label}>{l.label}</a>))}
              {i === lastIndex ? contact : null}
            </div>
          ))}
          {cols.length === 0 && contact ? <div className="footer-col">{contact}</div> : null}
        </div>
        <div className="footer-bottom">
          <p>{String(f.copyright || '').replace('{year}', year)}</p>
          {f.tagline ? <p>{f.tagline}</p> : null}
        </div>
      </div>
    </footer>
  );
}
