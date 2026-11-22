'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const isExternal = (h) => /^(https?:|mailto:|tel:)/.test(h || '');

function NavLink({ item, className, onClick }) {
  if (isExternal(item.href)) {
    return <a href={item.href} className={className} onClick={onClick} target={item.new_tab ? '_blank' : undefined} rel="noreferrer">{item.label}</a>;
  }
  return <Link href={item.href || '/'} className={className} onClick={onClick} target={item.new_tab ? '_blank' : undefined}>{item.label}</Link>;
}

export default function Nav({ items = [], cta = null, brand = {} }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href) => {
    if (!href || isExternal(href) || href.startsWith('#')) return false;
    const path = href.split(/[?#]/)[0];
    return path === '/' ? pathname === '/' : pathname.startsWith(path);
  };

  return (
    <>
      <nav className="nav">
        <div className="nav-wrap">
          <Link className="nav-logo" href="/">
            <img src={brand.logo_url || '/logo.jpg'} alt={brand.logo_alt || 'Organik Greens'} style={brand.logo_height ? { height: Number(brand.logo_height) } : undefined} />
          </Link>
          <div className="nav-links">
            {items.map((l) => (
              <NavLink key={l.id || l.href} item={l} className={isActive(l.href) ? 'on' : ''} />
            ))}
          </div>
          <div className="nav-right">
            {cta ? <NavLink item={cta} className="nav-btn" /> : null}
          </div>
          <button className="burger" onClick={() => setOpen(!open)} aria-label="Menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>
      <div className={`mob-menu${open ? ' open' : ''}`}>
        {items.map((l) => (
          <NavLink key={l.id || l.href} item={l} onClick={() => setOpen(false)} />
        ))}
        {cta ? <NavLink item={cta} onClick={() => setOpen(false)} /> : null}
      </div>
    </>
  );
}
