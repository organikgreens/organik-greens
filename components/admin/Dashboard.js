'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { mergeAll } from '@/lib/site';
import { AdminCtx } from './fields';
import { login, logout, checkSession, setExpiredHandler, loadSettingsRows, rpc } from './api';
import SettingsEditor, { HomeLayoutEditor, PagesEditor } from './SettingsEditor';
import { PostsManager, PromotionsManager, RequestsManager, Inbox, Account } from './Managers';
import { EDITORS } from './editors';

const NAV = [
  ['Start', [['overview', '🏠 Overview']]],
  ['Brand', [['brand', '🖼️ Logo & brand'], ['theme', '🎨 Colours & fonts']]],
  ['Website structure', [['nav', '📑 Top menu (tabs)'], ['pages', '🔌 Pages on / off'], ['custom_pages', '➕ Custom pages'], ['footer', '⬇️ Footer']]],
  ['Home page', [['home_layout', '🧩 Layout & order'], ['hero', '⭐ Hero'], ['latest', '📰 Featured articles'], ['ticker', '〰️ Scrolling strip'], ['pillars', '🌾 Six pillars'], ['philosophy', '💡 Our Philosophy'], ['testimonials', '💬 What Our Readers Say'], ['store', '🛒 Store section'], ['ask', '❓ Ask section'], ['cta', '📣 Closing banner']]],
  ['Other pages', [['posts', '📝 Articles'], ['blog_page', '📚 Blog page'], ['categories', '🏷️ Blog categories'], ['article', '📄 Article pages'], ['shop_page', '🛍️ Shop page'], ['about', '🌿 About page'], ['contact', '✉️ Contact page']]],
  ['Growth', [['promotions', '🤝 Promotions & partners'], ['seo', '🔎 Google & sharing']]],
  ['Workspace', [['inbox', '📥 Reader messages'], ['requests', '🛠️ Structure requests'], ['account', '🔐 Account & backup']]],
];
const LABEL = Object.fromEntries(NAV.flatMap(([, items]) => items));

function Login({ onIn }) {
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault(); setBusy(true); setErr('');
    try { await login(pass); onIn(); } catch (er) { setErr(er.message); }
    setBusy(false);
  }
  return (
    <div className="adm-login">
      <form onSubmit={submit} className="adm-login-box">
        <img src="/logo.jpg" alt="Organik Greens" style={{ height: 40, margin: '0 auto 16px' }} />
        <h1>Website dashboard</h1>
        <p className="adm-muted">Enter your passcode to manage organikgreens.com</p>
        <input className="adm-input" type="password" autoFocus value={pass} onChange={(e) => setPass(e.target.value)} placeholder="Passcode" autoComplete="current-password" />
        {err ? <p className="adm-err">{err}</p> : null}
        <button className="adm-btn primary" disabled={busy || !pass}>{busy ? 'Checking…' : 'Sign in'}</button>
      </form>
    </div>
  );
}

function Overview({ settings, posts, go }) {
  const [promos, setPromos] = useState(null);
  const [msgs, setMsgs] = useState(null);
  const [reqs, setReqs] = useState(null);
  useEffect(() => {
    rpc('admin_list_promotions').then(setPromos, () => setPromos([]));
    rpc('admin_list_messages').then(setMsgs, () => setMsgs([]));
    rpc('admin_list_change_requests').then(setReqs, () => setReqs([]));
  }, []);
  const [now] = useState(() => Date.now());
  const live = (promos || []).filter((p) => p.active && (!p.starts_at || new Date(p.starts_at) <= now) && (!p.ends_at || new Date(p.ends_at) > now));
  const pages = Object.entries(settings.pages);
  const tiles = [
    ['Articles live', posts.filter((p) => p.published).length, 'posts'],
    ['Drafts', posts.filter((p) => !p.published).length, 'posts'],
    ['Promotions live', promos ? live.length : '…', 'promotions'],
    ['New messages', msgs ? msgs.filter((m) => m.status === 'new').length : '…', 'inbox'],
    ['Open structure requests', reqs ? reqs.filter((r) => r.status === 'open' || r.status === 'in_progress').length : '…', 'requests'],
  ];
  return (
    <div className="adm-editor wide">
      <h1>Hello Rajat 👋</h1>
      <p className="adm-intro">Everything on organikgreens.com can be changed from here. Pick a section on the left, edit, and press <strong>Save &amp; publish</strong> — the website updates straight away. Every save keeps the previous version, so you can always go back.</p>
      <div className="adm-tiles">
        {tiles.map(([l, n, to]) => <button key={l} className="adm-tile" onClick={() => go(to)}><span className="adm-tile-n">{n}</span><span>{l}</span></button>)}
      </div>
      <h2 className="adm-h2">Pages</h2>
      <div className="adm-row wrap">
        {pages.map(([k, v]) => <span key={k} className={`adm-chip ${v.enabled === false ? 'muted' : 'ok'}`}>{k}: {v.enabled === false ? 'off' : 'on'}</span>)}
        {(settings.custom_pages.pages || []).map((p) => <span key={p.id} className={`adm-chip ${p.enabled === false ? 'muted' : 'ok'}`}>/{p.slug}: {p.enabled === false ? 'off' : 'on'}</span>)}
        <button className="adm-btn small ghost" onClick={() => go('pages')}>Change →</button>
      </div>
      <h2 className="adm-h2">Quick actions</h2>
      <div className="adm-row wrap">
        <button className="adm-btn" onClick={() => go('brand')}>Change the logo</button>
        <button className="adm-btn" onClick={() => go('latest')}>Choose featured articles</button>
        <button className="adm-btn" onClick={() => go('home_layout')}>Reorder the home page</button>
        <button className="adm-btn" onClick={() => go('promotions')}>Add a sponsored banner</button>
        <button className="adm-btn" onClick={() => go('nav')}>Edit menu tabs</button>
        <button className="adm-btn" onClick={() => go('footer')}>Edit the footer</button>
      </div>
      {live.length ? (<><h2 className="adm-h2">Running now</h2>{live.map((p) => <div key={p.id} className="adm-card"><strong>{p.name}</strong> <span className="adm-muted">· {p.sponsor || ''} · {p.impressions} views · {p.clicks} clicks</span></div>)}</>) : null}
    </div>
  );
}

export default function Dashboard() {
  const [state, setState] = useState('checking'); // checking | out | in
  const [rows, setRows] = useState([]);
  const [posts, setPosts] = useState([]);
  const [view, setView] = useState('overview');
  const [toasts, setToasts] = useState([]);
  const [version, setVersion] = useState(1);
  const [menu, setMenu] = useState(false);

  const toast = useCallback((msg, kind = 'ok') => {
    const id = Math.random();
    setToasts((t) => [...t, { id, msg, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), kind === 'error' ? 7000 : 3500);
  }, []);

  const reloadPosts = useCallback(async () => { try { setPosts((await rpc('admin_list_posts')) || []); } catch { /* handled by toast elsewhere */ } }, []);
  const reloadSettings = useCallback(async () => { try { setRows(await loadSettingsRows()); } catch (e) { toast(e.message, 'error'); } }, [toast]);

  useEffect(() => {
    setExpiredHandler(() => setState('out'));
    checkSession().then((ok) => setState(ok ? 'in' : 'out'), () => setState('out'));
    try { const h = window.location.hash.slice(1); if (h) setView(h); } catch { /* ignore */ }
  }, []);
  useEffect(() => { if (state === 'in') { reloadSettings(); reloadPosts(); } }, [state, reloadSettings, reloadPosts]);

  const settings = useMemo(() => mergeAll(rows), [rows]);
  const onSaved = useCallback((k, v) => {
    setRows((r) => [...r.filter((x) => x.key !== k), { key: k, value: v }]);
    setVersion((n) => n + 1);
  }, []);
  const go = (v) => { setView(v); setMenu(false); try { window.history.replaceState(null, '', `#${v}`); } catch { /* ignore */ } window.scrollTo(0, 0); };

  const paths = useMemo(() => [
    { value: '/', label: 'Home' }, { value: '/blog', label: 'Blog' }, { value: '/shop', label: 'Shop' }, { value: '/about', label: 'About' }, { value: '/contact', label: 'Contact' },
    { value: '#ask', label: 'Question form on this page' },
    ...(settings.categories.items || []).map((c) => ({ value: `/blog?category=${c.slug}`, label: `Blog: ${c.label}` })),
    ...(settings.custom_pages.pages || []).map((p) => ({ value: `/${p.slug}`, label: p.title })),
    ...posts.map((p) => ({ value: `/blog/${p.slug}`, label: p.title })),
  ], [settings, posts]);

  if (state === 'checking') return <div className="adm-login"><p>Loading…</p></div>;
  if (state === 'out') return <AdminCtx.Provider value={{ posts, paths, toast }}><Login onIn={() => setState('in')} />{toastsEl(toasts)}</AdminCtx.Provider>;

  let body;
  if (view === 'overview') body = <Overview settings={settings} posts={posts} go={go} />;
  else if (view === 'home_layout') body = <HomeLayoutEditor settings={settings} onSaved={onSaved} version={version} go={go} />;
  else if (view === 'pages') body = <PagesEditor settings={settings} onSaved={onSaved} version={version} go={go} />;
  else if (view === 'posts') body = <PostsManager settings={settings} onSaved={onSaved} posts={posts} reloadPosts={reloadPosts} />;
  else if (view === 'promotions') body = <PromotionsManager />;
  else if (view === 'requests') body = <RequestsManager />;
  else if (view === 'inbox') body = <Inbox />;
  else if (view === 'account') body = <Account onImported={() => { reloadSettings(); setVersion((n) => n + 1); }} />;
  else if (EDITORS[view]) body = <SettingsEditor key={view} k={view} settings={settings} onSaved={onSaved} version={version} />;
  else body = <Overview settings={settings} posts={posts} go={go} />;

  return (
    <AdminCtx.Provider value={{ posts, paths, toast }}>
      <div className="adm-shell">
        <header className="adm-top">
          <button className="adm-burger" onClick={() => setMenu(!menu)} aria-label="Menu">☰</button>
          <img src={settings.brand.logo_url || '/logo.jpg'} alt="" style={{ height: 28 }} />
          <strong>Dashboard</strong>
          <span className="adm-muted adm-hide-sm">· {LABEL[view] || ''}</span>
          <span style={{ flex: 1 }} />
          <a className="adm-btn small ghost" href="/" target="_blank" rel="noreferrer">View website ↗</a>
          <button className="adm-btn small ghost" onClick={async () => { await logout(); setState('out'); }}>Sign out</button>
        </header>
        <nav className={`adm-side${menu ? ' open' : ''}`}>
          {NAV.map(([group, items]) => (
            <div key={group} className="adm-side-group">
              <div className="adm-side-h">{group}</div>
              {items.map(([k, l]) => <button key={k} className={view === k ? 'on' : ''} onClick={() => go(k)}>{l}</button>)}
            </div>
          ))}
        </nav>
        <main className="adm-main">{body}</main>
      </div>
      {toastsEl(toasts)}
    </AdminCtx.Provider>
  );
}

function toastsEl(toasts) {
  return <div className="adm-toasts">{toasts.map((t) => <div key={t.id} className={`adm-toast ${t.kind}`}>{t.msg}</div>)}</div>;
}
