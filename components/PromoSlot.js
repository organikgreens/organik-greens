'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';

// One shared fetch of every live promotion per page load.
let livePromise = null;
function loadLive() {
  if (!livePromise) {
    livePromise = supabase.from('promotions').select('*').then(({ data }) => data || [], () => []);
  }
  return livePromise;
}

function istNow() {
  const d = new Date(Date.now() + (5.5 * 60 + new Date().getTimezoneOffset()) * 60000);
  return { dow: d.getDay(), minutes: d.getHours() * 60 + d.getMinutes(), day: `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}` };
}
const toMin = (t) => { if (!t) return null; const [h, m] = String(t).split(':').map(Number); return h * 60 + (m || 0); };

function patMatch(pat, path) {
  if (pat.endsWith('*')) return path.startsWith(pat.slice(0, -1));
  return path === pat || path === pat.replace(/\/$/, '');
}
// pages: empty = everywhere; "/blog*" = blog and everything under it; "!/shop" = never on /shop.
function pageMatches(pages, path) {
  const list = (pages || []).map((p) => String(p).trim()).filter(Boolean);
  const yes = list.filter((p) => !p.startsWith('!'));
  const no = list.filter((p) => p.startsWith('!')).map((p) => p.slice(1));
  if (no.some((p) => patMatch(p, path))) return false;
  return !yes.length || yes.some((p) => patMatch(p, path));
}

function store(kind) {
  try { return kind === 'session' ? window.sessionStorage : window.localStorage; } catch { return null; }
}
function readJSON(st, k) { try { return JSON.parse(st?.getItem(k) || 'null'); } catch { return null; } }
function writeJSON(st, k, v) { try { st?.setItem(k, JSON.stringify(v)); } catch { /* storage unavailable */ } }

function frequencyAllows(p) {
  const now = istNow();
  const key = `og-promo-${p.id}`;
  if (readJSON(store('session'), `${key}-x`)) return false; // dismissed this visit
  switch (p.frequency) {
    case 'once_per_session': return !readJSON(store('session'), key);
    case 'once_per_day': { const v = readJSON(store('local'), key); return !v || v.day !== now.day; }
    case 'n_per_day': { const v = readJSON(store('local'), key); return !v || v.day !== now.day || (v.n || 0) < Math.max(1, p.frequency_n || 1); }
    case 'every_n_views': { const v = readJSON(store('local'), `${key}-views`) || 0; return (v + 1) % Math.max(1, p.frequency_n || 1) === 0; }
    default: return true;
  }
}

function recordShown(p) {
  const now = istNow();
  const key = `og-promo-${p.id}`;
  if (p.frequency === 'once_per_session') writeJSON(store('session'), key, 1);
  if (p.frequency === 'once_per_day') writeJSON(store('local'), key, { day: now.day });
  if (p.frequency === 'n_per_day') { const v = readJSON(store('local'), key); writeJSON(store('local'), key, { day: now.day, n: v && v.day === now.day ? (v.n || 0) + 1 : 1 }); }
}
function countView(p) {
  if (p.frequency !== 'every_n_views') return;
  const k = `og-promo-${p.id}-views`;
  writeJSON(store('local'), k, (readJSON(store('local'), k) || 0) + 1);
}

function eligible(p, slot, path) {
  if (!(p.placements || []).includes(slot)) return false;
  if (!pageMatches(p.pages, path)) return false;
  const now = istNow();
  if (p.days_of_week?.length && !p.days_of_week.includes(now.dow)) return false;
  const a = toMin(p.time_from), b = toMin(p.time_to);
  if (a !== null && b !== null) {
    if (a <= b ? (now.minutes < a || now.minutes >= b) : (now.minutes < a && now.minutes >= b)) return false;
  } else if (a !== null && now.minutes < a) return false;
  else if (b !== null && now.minutes >= b) return false;
  return true;
}

function pick(list) {
  if (!list.length) return null;
  const top = Math.max(...list.map((p) => p.priority || 0));
  const group = list.filter((p) => (p.priority || 0) === top);
  const total = group.reduce((t, p) => t + Math.max(1, p.weight || 1), 0);
  let r = Math.random() * total;
  for (const p of group) { r -= Math.max(1, p.weight || 1); if (r <= 0) return p; }
  return group[0];
}

const track = (id, kind) => { supabase.rpc('promo_track', { p_id: id, p_kind: kind }).then(() => {}, () => {}); };

export function PromoView({ p, onClose, preview = false }) {
  const style = { ...(p.bg_color ? { background: p.bg_color } : {}), ...(p.text_color ? { color: p.text_color } : {}) };
  const btnStyle = p.accent_color ? { background: p.accent_color } : undefined;
  const ext = /^https?:/.test(p.cta_url || '');
  const click = () => { if (!preview) track(p.id, 'click'); };
  const linkProps = { href: p.cta_url || undefined, onClick: click, target: ext ? '_blank' : undefined, rel: ext ? 'sponsored noopener' : undefined };
  const tag = p.disclosure ? <span className="promo-tag">{p.disclosure}</span> : null;
  const x = p.dismissible && onClose ? <button className="promo-x" aria-label="Close" onClick={onClose}>×</button> : null;
  const img = p.image_url ? (
    <picture>
      {p.image_mobile_url ? <source media="(max-width:640px)" srcSet={p.image_mobile_url} /> : null}
      <img src={p.image_url} alt={p.title || p.sponsor || 'Promotion'} />
    </picture>
  ) : null;
  const cta = p.cta_label && p.cta_url ? <a className="promo-btn" style={btnStyle} {...linkProps}>{p.cta_label}</a> : null;

  if (p.format === 'top_bar') {
    return (
      <div className="promo-topbar" style={style} data-promo-bar>
        {tag}<span>{p.title}{p.body ? <> — {p.body}</> : null}</span>
        {p.cta_label && p.cta_url ? <a className="promo-cta" {...linkProps}>{p.cta_label}</a> : null}
        {x}
      </div>
    );
  }
  if (p.format === 'popup') {
    return (
      <div className="promo-overlay" onClick={(e) => { if (e.target === e.currentTarget && onClose) onClose(); }}>
        <div className="promo-popup" style={style} role="dialog" aria-modal="true">
          {x}
          {img ? (p.cta_url ? <a {...linkProps}>{img}</a> : img) : null}
          <div className="pp-text">{tag}{p.title ? <h4 style={{ margin: '8px 0 6px', fontSize: '1.4rem', color: 'inherit' }}>{p.title}</h4> : null}{p.body ? <p style={{ opacity: 0.85, lineHeight: 1.6 }}>{p.body}</p> : null}{cta}</div>
        </div>
      </div>
    );
  }
  if (p.format === 'inline') {
    return (
      <div className="promo-wrap" style={{ paddingTop: 12, paddingBottom: 12 }}>
        <div className="promo-inline" style={style}>
          {tag} {p.title ? <strong>{p.title}</strong> : null} {p.body} {p.cta_label && p.cta_url ? <a {...linkProps} style={{ fontWeight: 700, textDecoration: 'underline' }}>{p.cta_label}</a> : null}
        </div>
      </div>
    );
  }
  if (p.format === 'card') {
    return (
      <div className="promo-wrap">
        <div className="promo-card" style={style}>
          {tag}
          {img ? (p.cta_url ? <a {...linkProps}>{img}</a> : img) : null}
          <div className="pc-text">{p.title ? <h4 style={{ fontSize: '1.15rem', marginBottom: 6, color: 'inherit' }}>{p.title}</h4> : null}{p.body ? <p style={{ fontSize: '.88rem', opacity: 0.85, lineHeight: 1.6 }}>{p.body}</p> : null}{cta}</div>
        </div>
      </div>
    );
  }
  // banner
  const imageOnly = img && !p.title && !p.body;
  return (
    <div className="promo-wrap">
      <div className={`promo-banner${imageOnly ? ' img-only' : ''}`} style={imageOnly ? undefined : style}>
        {imageOnly ? <>{p.cta_url ? <a {...linkProps}>{img}</a> : img}{tag}</> : (
          <>
            {img ? <div className="pb-img">{p.cta_url ? <a {...linkProps}>{img}</a> : img}</div> : null}
            <div className="pb-text">{p.sponsor ? <div className="eyebrow" style={{ marginBottom: 0 }}>{p.sponsor}</div> : null}{p.title ? <h4>{p.title}</h4> : null}{p.body ? <p>{p.body}</p> : null}{cta}</div>
            {tag}
          </>
        )}
      </div>
    </div>
  );
}

export default function PromoSlot({ slot }) {
  const pathname = usePathname() || '/';
  const [promo, setPromo] = useState(null);
  const [visible, setVisible] = useState(false);
  const seen = useRef(null);

  useEffect(() => {
    let cancelled = false;
    setPromo(null); setVisible(false);
    loadLive().then((all) => {
      if (cancelled) return;
      const candidates = all.filter((p) => eligible(p, slot, pathname));
      candidates.forEach(countView);
      const chosen = pick(candidates.filter(frequencyAllows));
      if (!chosen) return;
      setPromo(chosen);
      const delay = Math.max(0, Number(chosen.delay_seconds) || 0) * 1000;
      const t = setTimeout(() => { if (!cancelled) setVisible(true); }, delay);
      return () => clearTimeout(t);
    });
    return () => { cancelled = true; };
  }, [slot, pathname]);

  useEffect(() => {
    if (!promo || !visible) return;
    if (seen.current !== `${promo.id}${pathname}`) {
      seen.current = `${promo.id}${pathname}`;
      recordShown(promo);
      track(promo.id, 'view');
    }
    if (promo.format === 'top_bar') {
      const el = document.querySelector('[data-promo-bar]');
      const h = el ? el.offsetHeight : 36;
      document.documentElement.style.setProperty('--promo-bar', `${h}px`);
      return () => document.documentElement.style.removeProperty('--promo-bar');
    }
  }, [promo, visible, pathname]);

  if (!promo || !visible) return null;
  const close = () => {
    writeJSON(store('session'), `og-promo-${promo.id}-x`, 1);
    setVisible(false);
  };
  return <PromoView p={promo} onClose={close} />;
}
