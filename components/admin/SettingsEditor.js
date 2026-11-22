'use client';

import { useContext, useEffect, useMemo, useState } from 'react';
import { DEFAULTS } from '@/lib/defaults';
import { mergeDefaults } from '@/lib/site';
import { Fields, AdminCtx, Toggle, Field } from './fields';
import { saveSetting, resetSetting, rpc, clone, uid, fmtIst } from './api';
import { EDITORS, RESERVED_SLUGS, blockFields, newBlock } from './editors';

export function Preview({ path, version }) {
  const [open, setOpen] = useState(true);
  const [width, setWidth] = useState('desktop');
  if (!path) return null;
  return (
    <aside className={`adm-preview${open ? '' : ' closed'}`}>
      <div className="adm-preview-bar">
        <button className="adm-btn small ghost" onClick={() => setOpen(!open)}>{open ? 'Hide preview ›' : '‹ Preview'}</button>
        {open ? (
          <>
            <select className="adm-input short" value={width} onChange={(e) => setWidth(e.target.value)}><option value="desktop">Desktop</option><option value="mobile">Mobile</option></select>
            <a className="adm-btn small ghost" href={path} target="_blank" rel="noreferrer">Open ↗</a>
          </>
        ) : null}
      </div>
      {open ? (
        <div className="adm-frame-wrap">
          <iframe key={`${path}-${version}`} src={`${path}${path.includes('?') ? '&' : '?'}v=${version}`} className={`adm-frame ${width}`} title="Live preview" />
        </div>
      ) : null}
      {open ? <div className="adm-help" style={{ padding: '6px 10px' }}>The preview shows the live site. It refreshes after you save.</div> : null}
    </aside>
  );
}

function History({ k, onRestore, onClose }) {
  const [rows, setRows] = useState(null);
  const [err, setErr] = useState('');
  useEffect(() => { rpc('admin_setting_history', { p_key: k }).then((d) => setRows(d || []), (e) => setErr(e.message)); }, [k]);
  return (
    <div className="adm-modal" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="adm-modal-box">
        <div className="adm-modal-head"><strong>Earlier versions</strong><button className="adm-btn ghost" onClick={onClose}>Close</button></div>
        <p className="adm-help">Every save keeps the previous version (the last 30). Restoring loads it into the editor; press Save to make it live.</p>
        {err ? <p className="adm-err">{err}</p> : null}
        {rows === null && !err ? <p>Loading…</p> : null}
        {rows && !rows.length ? <p className="adm-muted">No earlier versions yet.</p> : null}
        {(rows || []).map((r) => (
          <div key={r.id} className="adm-hist-row">
            <span>{fmtIst(r.saved_at)}</span>
            <button className="adm-btn small" onClick={() => { onRestore(r.value); onClose(); }}>Load this version</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function useSaver(k, current, onSaved) {
  const { toast } = useContext(AdminCtx);
  const [draft, setDraft] = useState(() => clone(current));
  const [busy, setBusy] = useState(false);
  const [base, setBase] = useState(() => JSON.stringify(current));
  const cur = JSON.stringify(current);
  const [seen, setSeen] = useState(cur);
  if (seen !== cur) { setSeen(cur); setBase(cur); setDraft(clone(current)); }
  const dirty = JSON.stringify(draft) !== base;
  async function save(value = draft) {
    setBusy(true);
    try {
      await saveSetting(k, value);
      setBase(JSON.stringify(value));
      onSaved(k, value);
      toast('Saved — live on the website now');
    } catch (e) { toast(e.message, 'error'); }
    setBusy(false);
  }
  async function reset() {
    if (!confirm('Go back to the original content for this section? Your current version is kept in “Earlier versions”.')) return;
    setBusy(true);
    try { await resetSetting(k); onSaved(k, clone(DEFAULTS[k])); toast('Back to the original content'); } catch (e) { toast(e.message, 'error'); }
    setBusy(false);
  }
  return { draft, setDraft, dirty, busy, save, reset };
}

export function SaveBar({ k, dirty, busy, save, reset, setDraft, extra, validate }) {
  const [hist, setHist] = useState(false);
  return (
    <div className="adm-savebar">
      <button className="adm-btn primary" disabled={!dirty || busy} onClick={() => { const err = validate?.(); if (err) { alert(err); return; } save(); }}>{busy ? 'Saving…' : dirty ? 'Save & publish' : 'Saved'}</button>
      {dirty ? <span className="adm-chip warn">Unsaved changes</span> : null}
      {extra}
      <span style={{ flex: 1 }} />
      <button className="adm-btn small ghost" onClick={() => setHist(true)}>Earlier versions</button>
      <button className="adm-btn small ghost" onClick={reset} disabled={busy}>Reset to original</button>
      {hist ? <History k={k} onRestore={(v) => setDraft(mergeDefaults(DEFAULTS[k], v))} onClose={() => setHist(false)} /> : null}
    </div>
  );
}

function useUnsavedGuard(dirty) {
  useEffect(() => {
    const h = (e) => { if (dirty) { e.preventDefault(); e.returnValue = ''; } };
    window.addEventListener('beforeunload', h);
    return () => window.removeEventListener('beforeunload', h);
  }, [dirty]);
}

export default function SettingsEditor({ k, settings, onSaved, version }) {
  const ed = EDITORS[k];
  const current = settings[k];
  const s = useSaver(k, current, onSaved);
  useUnsavedGuard(s.dirty);
  const validate = k === 'custom_pages' ? () => {
    const seen = new Set();
    for (const p of s.draft.pages || []) {
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug || '')) return `“${p.title}”: the address must use lowercase letters, numbers and dashes only.`;
      if (RESERVED_SLUGS.includes(p.slug)) return `“${p.slug}” is already used by the website. Choose another address.`;
      if (seen.has(p.slug)) return `Two pages use the address “${p.slug}”.`;
      seen.add(p.slug);
    }
    return null;
  } : undefined;
  return (
    <div className="adm-split">
      <div className="adm-editor">
        <h1>{ed.title}</h1>
        {ed.intro ? <p className="adm-intro">{ed.intro}</p> : null}
        <SaveBar k={k} {...s} validate={validate} />
        <Fields fields={ed.fields} value={s.draft} onChange={s.setDraft} />
        <SaveBar k={k} {...s} validate={validate} />
      </div>
      <Preview path={ed.preview} version={version} />
    </div>
  );
}

// ---------- Home page layout (order & visibility of sections) ----------
export function HomeLayoutEditor({ settings, onSaved, version, go }) {
  const s = useSaver('home_layout', settings.home_layout, onSaved);
  useUnsavedGuard(s.dirty);
  const [open, setOpen] = useState(null);
  const list = s.draft.sections || [];
  const set = (n) => s.setDraft({ ...s.draft, sections: n });
  const move = (i, d) => { const n = [...list]; const j = i + d; if (j < 0 || j >= n.length) return; [n[i], n[j]] = [n[j], n[i]]; set(n); };
  const editFor = { hero: 'hero', ticker: 'ticker', pillars: 'pillars', latest: 'latest', philosophy: 'philosophy', testimonials: 'testimonials', store: 'store', ask: 'ask', cta: 'cta', promo: 'promotions' };
  const shopOff = settings.pages.shop?.enabled === false;
  return (
    <div className="adm-split">
      <div className="adm-editor">
        <h1>Home page layout</h1>
        <p className="adm-intro">Change the order of the home page sections with ↑ ↓, hide any section with its switch, or add your own sections and extra promotion slots. Use “Edit content” to change what a section says.</p>
        <SaveBar k="home_layout" {...s} />
        <div className="adm-list">
          {list.map((sec, i) => (
            <div key={sec.id} className={`adm-li${sec.enabled === false ? ' off' : ''}${open === i ? ' open' : ''}`}>
              <div className="adm-li-head">
                <span className="adm-li-title static"><span className="adm-pm-n">{i + 1}</span>{sec.label || sec.type}
                  {sec.type === 'store' && shopOff && settings.store.follow_shop_page ? <span className="adm-chip muted">hidden: Shop is off</span> : null}
                  {sec.type === 'latest' && settings.pages.blog?.enabled === false ? <span className="adm-chip muted">hidden: Blog is off</span> : null}
                </span>
                <Toggle checked={sec.enabled !== false} onChange={(v) => { const n = [...list]; n[i] = { ...sec, enabled: v }; set(n); }} />
                <button className="adm-icon" onClick={() => move(i, -1)} title="Move up">↑</button>
                <button className="adm-icon" onClick={() => move(i, 1)} title="Move down">↓</button>
                {sec.type === 'custom' || sec.type === 'promo'
                  ? <button className="adm-btn small ghost" onClick={() => setOpen(open === i ? null : i)}>{open === i ? 'Close' : 'Edit'}</button>
                  : <button className="adm-btn small ghost" onClick={() => go(editFor[sec.type])}>Edit content</button>}
                {sec.type === 'custom' || (sec.type === 'promo' && !['promo-home-1', 'promo-home-2', 'promo-home-3'].includes(sec.id))
                  ? <button className="adm-icon danger" onClick={() => confirm('Remove this section?') && set(list.filter((_, j) => j !== i))}>×</button> : null}
              </div>
              {open === i ? (
                <div className="adm-li-body">
                  <Field f={{ k: 'label', label: 'Name in this list' }} value={sec.label} onChange={(v) => { const n = [...list]; n[i] = { ...sec, label: v }; set(n); }} />
                  {sec.type === 'promo' ? (
                    <Field f={{ type: 'select', label: 'Promotion slot', options: [['home_1', 'Home 1'], ['home_2', 'Home 2'], ['home_3', 'Home 3'], ['custom_1', 'Custom slot 1'], ['custom_2', 'Custom slot 2'], ['custom_3', 'Custom slot 3']] }}
                      value={sec.slot} onChange={(v) => { const n = [...list]; n[i] = { ...sec, slot: v }; set(n); }} />
                  ) : (
                    <Fields fields={blockFields} value={sec.block || {}} onChange={(v) => { const n = [...list]; n[i] = { ...sec, block: v }; set(n); }} />
                  )}
                </div>
              ) : null}
            </div>
          ))}
        </div>
        <div className="adm-row" style={{ marginTop: 12 }}>
          <button className="adm-btn small" onClick={() => { set([...list, { id: uid('sec'), type: 'custom', enabled: true, label: 'My new section', block: newBlock() }]); setOpen(list.length); }}>+ Add my own section</button>
          <button className="adm-btn small ghost" onClick={() => set([...list, { id: uid('promo'), type: 'promo', enabled: true, label: 'Promotion slot: Custom 1', slot: 'custom_1' }])}>+ Add a promotion slot</button>
        </div>
        <SaveBar k="home_layout" {...s} />
      </div>
      <Preview path="/" version={version} />
    </div>
  );
}

// ---------- Pages on / off ----------
export function PagesEditor({ settings, onSaved, version, go }) {
  const s = useSaver('pages', settings.pages, onSaved);
  useUnsavedGuard(s.dirty);
  const rows = [
    ['blog', 'Blog', 'Turning this off hides the Blog tab, every article page, the home page article section and the Topics footer column.'],
    ['shop', 'Shop', 'Turning this off hides the Shop tab and footer link, and (if it follows the Shop) the “Organik Greens Store” section on the home page. Buttons that point to /shop are hidden too.'],
    ['about', 'About', 'Hides the About tab, footer link and the page itself.'],
    ['contact', 'Contact', 'Hides the Contact tab, footer link and the page itself. The question forms on other pages keep working.'],
  ];
  const custom = settings.custom_pages.pages || [];
  return (
    <div className="adm-split">
      <div className="adm-editor">
        <h1>Pages on / off</h1>
        <p className="adm-intro">Switch whole pages on or off. Everything that links to a page that is off — menu tabs, footer links, buttons and home page sections — is hidden automatically, and the page is removed from Google’s sitemap.</p>
        <SaveBar k="pages" {...s} />
        {rows.map(([key, name, help]) => (
          <div className="adm-card" key={key}>
            <div className="adm-row between">
              <div><strong>{name}</strong> <span className="adm-muted">/{key}</span></div>
              <Toggle checked={s.draft[key]?.enabled !== false} onChange={(v) => s.setDraft({ ...s.draft, [key]: { ...(s.draft[key] || {}), enabled: v } })} label={s.draft[key]?.enabled !== false ? 'On' : 'Off'} />
            </div>
            <div className="adm-help">{help}</div>
          </div>
        ))}
        <SaveBar k="pages" {...s} />
        <h2 className="adm-h2">Custom pages</h2>
        {custom.length ? custom.map((p) => (
          <div className="adm-card" key={p.id}>
            <div className="adm-row between"><div><strong>{p.title}</strong> <span className="adm-muted">/{p.slug}</span></div><span className={`adm-chip ${p.enabled === false ? 'muted' : 'ok'}`}>{p.enabled === false ? 'Off' : 'On'}</span></div>
          </div>
        )) : <p className="adm-muted">No custom pages yet.</p>}
        <button className="adm-btn small" onClick={() => go('custom_pages')}>Manage custom pages →</button>
      </div>
      <Preview path="/" version={version} />
    </div>
  );
}

export function useKeyedEditor() { return useMemo(() => Object.keys(EDITORS), []); }
