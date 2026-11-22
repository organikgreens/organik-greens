'use client';

import { useContext, useEffect, useMemo, useState } from 'react';
import { Fields, AdminCtx, Toggle } from './fields';
import { rpc, refresh, saveSetting, clone, fmtIst, isoToIstInput, istInputToIso, loadSettingsRows } from './api';
import { PROMO_SLOTS, PROMO_FORMATS, PROMO_FREQUENCIES } from '@/lib/promoSlots';
import { PromoView } from '@/components/PromoSlot';
import { Preview } from './SettingsEditor';
import { DEFAULTS } from '@/lib/defaults';

// ================= Articles =================
export function PostsManager({ settings, onSaved, posts, reloadPosts }) {
  const { toast } = useContext(AdminCtx);
  const [edit, setEdit] = useState(null);
  const [q, setQ] = useState('');
  const [busy, setBusy] = useState(false);
  const [ver, setVer] = useState(1);
  const featured = settings.latest.featured_slugs || [];
  const pinned = settings.blog_page.pinned_slugs || [];
  const cats = settings.categories.items || [];
  const list = posts.filter((p) => !q || `${p.title} ${p.slug} ${p.category}`.toLowerCase().includes(q.toLowerCase()));

  async function patch(slug, p, msg = 'Saved') {
    setBusy(true);
    try { await rpc('admin_update_post', { p_slug: slug, p_patch: p }); await refresh(); await reloadPosts(); setVer((v) => v + 1); toast(msg); } catch (e) { toast(e.message, 'error'); }
    setBusy(false);
  }
  async function toggleIn(key, field, slug) {
    const cur = settings[key][field] || [];
    const next = cur.includes(slug) ? cur.filter((x) => x !== slug) : [...cur, slug];
    const value = { ...settings[key], [field]: next, ...(key === 'latest' && next.length ? { mode: 'manual' } : {}) };
    try { await saveSetting(key, value); onSaved(key, value); toast(cur.includes(slug) ? 'Removed' : 'Added'); } catch (e) { toast(e.message, 'error'); }
  }

  const fields = [
    { k: 'title', label: 'Title' },
    { k: 'meta_title', label: 'Title in Google (optional, if different)' },
    { k: 'excerpt', type: 'textarea', label: 'Summary (shown on cards and in the summary box)' },
    { k: 'category', type: 'select', label: 'Category', options: cats.map((c) => [c.slug, c.label]), half: true },
    { k: 'read_time', label: 'Read time (e.g. 8 min)', half: true },
    { k: 'emoji', label: 'Emoji (used when there is no picture)', half: true },
    { k: 'published', type: 'toggle', label: 'Published (visible on the website)' },
    { k: 'thumbnail', type: 'image', label: 'Card picture (thumbnail)' },
    { k: 'cover_image', type: 'image', label: 'Cover picture' },
    { k: 'body', type: 'code', rows: 18, label: 'Article text (HTML)', help: 'The full article. Headings use <h2>/<h3>, paragraphs <p>. For bigger rewrites, ask Claude to do it for you.' },
  ];

  if (edit) {
    return (
      <div className="adm-split">
        <div className="adm-editor">
          <button className="adm-btn small ghost" onClick={() => setEdit(null)}>← All articles</button>
          <h1>{edit.title}</h1>
          <div className="adm-savebar">
            <button className="adm-btn primary" disabled={busy} onClick={async () => { const { slug, ...rest } = edit; const p = Object.fromEntries(['title', 'meta_title', 'excerpt', 'category', 'read_time', 'emoji', 'published', 'thumbnail', 'cover_image', 'body'].map((k) => [k, rest[k] ?? ''])); await patch(slug, p, 'Article saved'); }}>{busy ? 'Saving…' : 'Save article'}</button>
            <a className="adm-btn small ghost" href={`/blog/${edit.slug}`} target="_blank" rel="noreferrer">View ↗</a>
          </div>
          <Fields fields={fields} value={edit} onChange={setEdit} />
        </div>
        <Preview path={`/blog/${edit.slug}`} version={ver} />
      </div>
    );
  }

  return (
    <div className="adm-editor wide">
      <h1>Articles</h1>
      <p className="adm-intro">Publish or unpublish articles, edit their titles, summaries and pictures, choose which appear first on the home page (★ Home) and which are pinned to the top of the blog (📌 Blog).</p>
      <input className="adm-input" placeholder="Search articles…" value={q} onChange={(e) => setQ(e.target.value)} style={{ maxWidth: 360, marginBottom: 14 }} />
      <div className="adm-table">
        <div className="adm-tr head"><span>Article</span><span>Category</span><span>Status</span><span>Home</span><span>Blog</span><span></span></div>
        {list.map((p) => (
          <div className="adm-tr" key={p.slug}>
            <span><strong>{p.title}</strong><br /><span className="adm-muted">/blog/{p.slug} · {fmtIst(p.published_at)}</span></span>
            <span>{cats.find((c) => c.slug === p.category)?.label || p.category}</span>
            <span><Toggle checked={p.published} onChange={(v) => patch(p.slug, { published: v }, v ? 'Published' : 'Unpublished')} label={p.published ? 'Live' : 'Draft'} /></span>
            <span><button className={`adm-btn small ${featured.includes(p.slug) ? 'on' : 'ghost'}`} onClick={() => toggleIn('latest', 'featured_slugs', p.slug)} title="Feature on the home page">★ {featured.includes(p.slug) ? `#${featured.indexOf(p.slug) + 1}` : ''}</button></span>
            <span><button className={`adm-btn small ${pinned.includes(p.slug) ? 'on' : 'ghost'}`} onClick={() => toggleIn('blog_page', 'pinned_slugs', p.slug)} title="Pin to the top of the blog">📌</button></span>
            <span><button className="adm-btn small" onClick={() => setEdit(clone(p))}>Edit</button></span>
          </div>
        ))}
      </div>
      <p className="adm-help" style={{ marginTop: 12 }}>The order of ★ articles can be changed under Home page → Featured articles.</p>
    </div>
  );
}

// ================= Promotions =================
const DOW = [[1, 'Mon'], [2, 'Tue'], [3, 'Wed'], [4, 'Thu'], [5, 'Fri'], [6, 'Sat'], [0, 'Sun']];

function promoStatus(p) {
  const now = Date.now();
  if (!p.active) return ['Paused', 'muted'];
  if (p.starts_at && new Date(p.starts_at).getTime() > now) return ['Scheduled', 'info'];
  if (p.ends_at && new Date(p.ends_at).getTime() <= now) return ['Ended', 'muted'];
  if (p.max_impressions && p.impressions >= p.max_impressions) return ['View limit reached', 'warn'];
  if (p.max_clicks && p.clicks >= p.max_clicks) return ['Click limit reached', 'warn'];
  return ['Live', 'ok'];
}

const blankPromo = () => ({
  id: '', name: 'New promotion', sponsor: '', format: 'banner', placements: ['home_1'], pages: [], title: '', body: '', image_url: '', image_mobile_url: '',
  cta_label: 'Learn more', cta_url: '', bg_color: '', text_color: '', accent_color: '', disclosure: 'Sponsored', starts_at: null, ends_at: null,
  days_of_week: [], time_from: null, time_to: null, frequency: 'always', frequency_n: 1, dismissible: true, delay_seconds: 0,
  max_impressions: null, max_clicks: null, priority: 0, weight: 1, active: false, notes: '',
});

function Stats({ id }) {
  const [rows, setRows] = useState(null);
  useEffect(() => { rpc('admin_promotion_stats', { p_id: id }).then((d) => setRows(d || []), () => setRows([])); }, [id]);
  if (!rows) return <p className="adm-muted">Loading…</p>;
  if (!rows.length) return <p className="adm-muted">No views yet.</p>;
  return (
    <div className="adm-table small">
      <div className="adm-tr head"><span>Day</span><span>Views</span><span>Clicks</span><span>Click rate</span></div>
      {rows.slice(0, 30).map((r) => <div className="adm-tr" key={r.day}><span>{r.day}</span><span>{r.impressions}</span><span>{r.clicks}</span><span>{r.impressions ? `${((r.clicks / r.impressions) * 100).toFixed(1)}%` : '—'}</span></div>)}
    </div>
  );
}

export function PromotionsManager() {
  const { toast } = useContext(AdminCtx);
  const [list, setList] = useState(null);
  const [edit, setEdit] = useState(null);
  const [busy, setBusy] = useState(false);
  const load = () => rpc('admin_list_promotions').then((d) => setList(d || []), (e) => { toast(e.message, 'error'); setList([]); });
  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function save(p = edit) {
    if (!p.placements?.length) { alert('Choose at least one place where it should appear.'); return; }
    if (p.starts_at && p.ends_at && new Date(p.ends_at) <= new Date(p.starts_at)) { alert('The end date must be after the start date.'); return; }
    setBusy(true);
    try {
      const id = await rpc('admin_save_promotion', { p: { ...p, id: p.id || null } });
      await load();
      setEdit((e) => (e ? { ...e, id } : e));
      toast(p.active ? 'Saved — it will show according to its schedule' : 'Saved (paused)');
    } catch (e) { toast(e.message, 'error'); }
    setBusy(false);
  }
  async function del(p) {
    if (!confirm(`Delete “${p.name}” permanently? Its statistics will be deleted too.`)) return;
    try { await rpc('admin_delete_promotion', { p_id: p.id }); setEdit(null); await load(); toast('Deleted'); } catch (e) { toast(e.message, 'error'); }
  }

  const slotOptions = useMemo(() => [...PROMO_SLOTS.map((s) => [s.id, s.label]), ['custom_1', 'Custom slot 1 (place it via Home layout or a custom page)'], ['custom_2', 'Custom slot 2'], ['custom_3', 'Custom slot 3']], []);

  if (edit) {
    const fields = [
      { type: 'heading', label: '1. Basics' },
      { k: 'name', label: 'Internal name (only you see this)', half: true },
      { k: 'sponsor', label: 'Brand / sponsor name', half: true },
      { k: 'notes', type: 'textarea', rows: 2, label: 'Notes (deal terms, contact, invoice…)' },
      { type: 'heading', label: '2. Format & where it appears' },
      { k: 'format', type: 'select', label: 'Format', options: PROMO_FORMATS },
      { k: 'placements', type: 'checks', label: 'Where on the website', options: slotOptions.filter(([id]) => { const s = PROMO_SLOTS.find((x) => x.id === id); return !s || s.formats.includes(edit.format); }), help: 'Only places that suit the chosen format are listed.' },
      { k: 'pages', type: 'tags', label: 'Only on these pages (optional — one per line)', placeholder: 'Leave empty for all pages.\nExamples:\n/\n/blog*   (blog and all articles)\n/blog/hydro-guide\n!/shop   (never on the shop)' },
      { type: 'heading', label: '3. Content' },
      { k: 'title', label: 'Headline' },
      { k: 'body', type: 'textarea', rows: 3, label: 'Text' },
      { k: 'image_url', type: 'image', label: 'Image / banner artwork', help: 'For an image-only banner, upload the artwork and leave the headline and text empty.' },
      { k: 'image_mobile_url', type: 'image', label: 'Mobile version of the image (optional)' },
      { k: 'cta_label', label: 'Button text', half: true },
      { k: 'cta_url', type: 'link', label: 'Button / image link (the brand’s page)', half: true },
      { k: 'disclosure', label: 'Disclosure label (e.g. Sponsored, Partner, Ad)', help: 'Indian advertising rules (ASCI) expect paid promotions to be clearly labelled. Keep this filled in for paid placements.' },
      { k: 'bg_color', type: 'color', label: 'Background colour' },
      { k: 'text_color', type: 'color', label: 'Text colour' },
      { k: 'accent_color', type: 'color', label: 'Button colour' },
      { type: 'heading', label: '4. Schedule (India time)' },
      { type: 'note', label: 'Use the date boxes below. Leave empty to start now / run until you stop it.' },
    ];
    const fields2 = [
      { k: 'days_of_week', type: 'checks', label: 'Only on these days (none ticked = every day)', options: DOW },
      { k: 'time_from', label: 'Daily from (HH:MM, optional)', half: true, placeholder: '09:00' },
      { k: 'time_to', label: 'Daily until (HH:MM, optional)', half: true, placeholder: '21:00' },
      { type: 'heading', label: '5. How often & limits' },
      { k: 'frequency', type: 'select', label: 'How often a visitor sees it', options: PROMO_FREQUENCIES },
      { k: 'frequency_n', type: 'number', label: 'N', min: 1, max: 100, half: true, show: (v) => ['n_per_day', 'every_n_views'].includes(v.frequency) },
      { k: 'delay_seconds', type: 'number', label: 'Wait before showing (seconds)', min: 0, max: 120, half: true },
      { k: 'dismissible', type: 'toggle', label: 'Visitors can close it (×)' },
      { k: 'max_impressions', type: 'number', label: 'Stop after this many views (optional)', half: true },
      { k: 'max_clicks', type: 'number', label: 'Stop after this many clicks (optional)', half: true },
      { k: 'priority', type: 'number', label: 'Priority (higher wins the slot)', half: true, help: 'When several promotions want the same place, the highest priority is shown.' },
      { k: 'weight', type: 'number', label: 'Rotation weight', min: 1, max: 100, half: true, help: 'Same priority? They rotate; weight 3 shows three times as often as weight 1.' },
    ];
    const [label, tone] = promoStatus(edit);
    return (
      <div className="adm-split">
        <div className="adm-editor">
          <button className="adm-btn small ghost" onClick={() => setEdit(null)}>← All promotions</button>
          <h1>{edit.name} <span className={`adm-chip ${tone}`}>{label}</span></h1>
          <div className="adm-savebar">
            <Toggle checked={edit.active} onChange={(v) => setEdit({ ...edit, active: v })} label={edit.active ? 'Active' : 'Paused'} />
            <button className="adm-btn primary" disabled={busy} onClick={() => save()}>{busy ? 'Saving…' : 'Save'}</button>
            {edit.id ? <button className="adm-btn small ghost" onClick={() => setEdit({ ...clone(edit), id: '', name: `${edit.name} (copy)`, active: false })}>Duplicate</button> : null}
            <span style={{ flex: 1 }} />
            {edit.id ? <button className="adm-btn small ghost danger" onClick={() => del(edit)}>Delete</button> : null}
          </div>
          <Fields fields={fields} value={edit} onChange={setEdit} />
          <div className="adm-fields">
            <div className="adm-field half"><div className="adm-label">Starts</div><input className="adm-input" type="datetime-local" value={isoToIstInput(edit.starts_at)} onChange={(e) => setEdit({ ...edit, starts_at: istInputToIso(e.target.value) })} /></div>
            <div className="adm-field half"><div className="adm-label">Ends</div><input className="adm-input" type="datetime-local" value={isoToIstInput(edit.ends_at)} onChange={(e) => setEdit({ ...edit, ends_at: istInputToIso(e.target.value) })} /></div>
          </div>
          <Fields fields={fields2} value={edit} onChange={(v) => setEdit({ ...v, time_from: v.time_from || null, time_to: v.time_to || null })} />
          {edit.id ? (<><h2 className="adm-h2">Results</h2><p>Total: <strong>{edit.impressions}</strong> views · <strong>{edit.clicks}</strong> clicks{edit.impressions ? ` · ${((edit.clicks / edit.impressions) * 100).toFixed(2)}% click rate` : ''}</p><Stats id={edit.id} /></>) : null}
        </div>
        <aside className="adm-preview">
          <div className="adm-preview-bar"><strong>Preview</strong></div>
          <div className="adm-promo-prev">
            {edit.format === 'popup' ? <div style={{ position: 'relative', height: 460 }}><div style={{ position: 'absolute', inset: 0 }}><PromoView p={{ ...edit, dismissible: false }} preview /></div></div>
              : edit.format === 'top_bar' ? <div style={{ position: 'relative', height: 60 }}><div style={{ position: 'absolute', inset: 0 }}><PromoView p={{ ...edit, dismissible: false }} preview /></div></div>
              : <PromoView p={edit} preview />}
          </div>
          <p className="adm-help" style={{ padding: 10 }}>Approximate preview. Activate and save, then open the page to see it in place.</p>
        </aside>
      </div>
    );
  }

  return (
    <div className="adm-editor wide">
      <h1>Promotions & brand partnerships</h1>
      <p className="adm-intro">Add banners, announcement bars, pop-ups and sponsored cards for brands you partner with. Set when they run (dates, days, hours), how often visitors see them, and limits on views or clicks. Views and clicks are counted for your reports to the brand.</p>
      <button className="adm-btn primary" onClick={() => setEdit(blankPromo())}>+ New promotion</button>
      {list === null ? <p>Loading…</p> : null}
      {list && !list.length ? <p className="adm-muted" style={{ marginTop: 16 }}>No promotions yet.</p> : null}
      {list && list.length ? (
        <div className="adm-table" style={{ marginTop: 16 }}>
          <div className="adm-tr head"><span>Promotion</span><span>Status</span><span>Runs</span><span>Views</span><span>Clicks</span><span></span></div>
          {list.map((p) => {
            const [label, tone] = promoStatus(p);
            return (
              <div className="adm-tr" key={p.id}>
                <span><strong>{p.name}</strong><br /><span className="adm-muted">{p.sponsor || '—'} · {PROMO_FORMATS.find((f) => f[0] === p.format)?.[1]}</span></span>
                <span><span className={`adm-chip ${tone}`}>{label}</span></span>
                <span className="adm-muted">{p.starts_at ? fmtIst(p.starts_at) : 'now'} → {p.ends_at ? fmtIst(p.ends_at) : 'no end'}</span>
                <span>{p.impressions}</span>
                <span>{p.clicks}</span>
                <span className="adm-row"><Toggle checked={p.active} onChange={(v) => save({ ...p, active: v })} /><button className="adm-btn small" onClick={() => setEdit(clone(p))}>Edit</button></span>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

// ================= Structure / change requests =================
export function RequestsManager() {
  const { toast } = useContext(AdminCtx);
  const [list, setList] = useState(null);
  const [text, setText] = useState('');
  const [area, setArea] = useState('Home page');
  const load = () => rpc('admin_list_change_requests').then((d) => setList(d || []), (e) => toast(e.message, 'error'));
  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  async function add() {
    if (text.trim().length < 3) return;
    try { await rpc('admin_save_change_request', { p: { instruction: text.trim(), area } }); setText(''); await load(); toast('Request saved'); } catch (e) { toast(e.message, 'error'); }
  }
  async function upd(r, patch) { try { await rpc('admin_save_change_request', { p: { id: r.id, ...patch } }); await load(); } catch (e) { toast(e.message, 'error'); } }
  return (
    <div className="adm-editor wide">
      <h1>Structure changes (instructions)</h1>
      <p className="adm-intro">Most changes — order, hiding, text, images, new sections and new pages — you can make directly in this dashboard. For bigger changes to how the website is built (a new kind of section, a new page design, new features), write the instruction here. Then open Claude in this project and say <strong>“Carry out my open website structure requests”</strong>: Claude reads this list, makes the changes, and marks each one done with a note.</p>
      <div className="adm-card">
        <div className="adm-fields">
          <div className="adm-field half"><div className="adm-label">Area</div>
            <select className="adm-input" value={area} onChange={(e) => setArea(e.target.value)}>{['Home page', 'Menu / tabs', 'Blog & articles', 'Shop', 'About', 'Contact', 'Footer', 'Whole website', 'New page', 'Other'].map((a) => <option key={a}>{a}</option>)}</select>
          </div>
          <div className="adm-field"><div className="adm-label">What should change?</div>
            <textarea className="adm-input" rows={4} value={text} onChange={(e) => setText(e.target.value)} placeholder="Example: On the home page, show the six pillars as a horizontal scrolling carousel on mobile, with a photo on each card." />
          </div>
        </div>
        <button className="adm-btn primary" onClick={add}>Save request</button>
      </div>
      {(list || []).map((r) => (
        <div className="adm-card" key={r.id}>
          <div className="adm-row between">
            <span className="adm-muted">{r.area} · {fmtIst(r.created_at)}</span>
            <select className="adm-input short" value={r.status} onChange={(e) => upd(r, { status: e.target.value })}>
              <option value="open">Open</option><option value="in_progress">In progress</option><option value="done">Done</option><option value="dropped">Dropped</option>
            </select>
          </div>
          <p style={{ whiteSpace: 'pre-wrap', margin: '8px 0' }}>{r.instruction}</p>
          {r.response ? <div className="adm-note">Note: {r.response}</div> : null}
          <button className="adm-btn small ghost danger" onClick={() => confirm('Delete this request?') && rpc('admin_delete_change_request', { p_id: r.id }).then(load)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

// ================= Inbox =================
export function Inbox() {
  const { toast } = useContext(AdminCtx);
  const [list, setList] = useState(null);
  const [filter, setFilter] = useState('new');
  const load = () => rpc('admin_list_messages').then((d) => setList(d || []), (e) => toast(e.message, 'error'));
  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const shown = (list || []).filter((m) => filter === 'all' || m.status === filter);
  return (
    <div className="adm-editor wide">
      <h1>Reader messages</h1>
      <p className="adm-intro">Questions and enquiries sent through the forms on your website.</p>
      <div className="adm-row" style={{ marginBottom: 12 }}>
        {[['new', 'New'], ['in_progress', 'In progress'], ['answered', 'Answered'], ['archived', 'Archived'], ['all', 'All']].map(([v, l]) => (
          <button key={v} className={`adm-btn small ${filter === v ? 'on' : 'ghost'}`} onClick={() => setFilter(v)}>{l} ({(list || []).filter((m) => v === 'all' || m.status === v).length})</button>
        ))}
      </div>
      {list === null ? <p>Loading…</p> : null}
      {list && !shown.length ? <p className="adm-muted">Nothing here.</p> : null}
      {shown.map((m) => {
        const contact = m.contact_method === 'whatsapp' ? `https://wa.me/${m.whatsapp}` : `mailto:${m.email}`;
        return (
          <div className="adm-card" key={m.id}>
            <div className="adm-row between">
              <span><strong>{m.name || 'Reader'}</strong> <span className="adm-muted">· {m.kind} · {fmtIst(m.created_at)} · {m.page || m.article_slug || ''}</span></span>
              <select className="adm-input short" value={m.status} onChange={(e) => rpc('admin_update_message', { p_id: m.id, p_status: e.target.value, p_notes: null }).then(load)}>
                <option value="new">New</option><option value="in_progress">In progress</option><option value="answered">Answered</option><option value="archived">Archived</option>
              </select>
            </div>
            <p style={{ whiteSpace: 'pre-wrap', margin: '8px 0' }}>{m.message}</p>
            <a className="adm-btn small" href={contact} target="_blank" rel="noreferrer">Reply by {m.contact_method === 'whatsapp' ? `WhatsApp (+${m.whatsapp})` : `email (${m.email})`}</a>
          </div>
        );
      })}
    </div>
  );
}

// ================= Account & backup =================
export function Account({ onImported }) {
  const { toast } = useContext(AdminCtx);
  const [o, setO] = useState(''); const [n, setN] = useState(''); const [n2, setN2] = useState('');
  async function change() {
    if (n !== n2) { toast('The two new passcodes do not match', 'error'); return; }
    try { await rpc('admin_change_passcode', { p_old: o, p_new: n }); setO(''); setN(''); setN2(''); toast('Passcode changed. Other devices have been signed out.'); } catch (e) { toast(e.message, 'error'); }
  }
  async function exportAll() {
    const rows = await loadSettingsRows();
    const blob = new Blob([JSON.stringify({ exported_at: new Date().toISOString(), settings: rows }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `organikgreens-site-backup-${new Date().toISOString().slice(0, 10)}.json`; a.click();
  }
  async function importAll(file) {
    try {
      const data = JSON.parse(await file.text());
      const rows = (data.settings || []).filter((r) => r.key in DEFAULTS);
      if (!rows.length) throw new Error('No website settings found in that file.');
      if (!confirm(`Restore ${rows.length} sections from this backup? The current versions are kept in “Earlier versions”.`)) return;
      for (const r of rows) await rpc('admin_save_setting', { p_key: r.key, p_value: r.value });
      await refresh();
      onImported();
      toast('Backup restored');
    } catch (e) { toast(e.message, 'error'); }
  }
  return (
    <div className="adm-editor">
      <h1>Account & backup</h1>
      <div className="adm-card">
        <h2 className="adm-h2" style={{ marginTop: 0 }}>Change passcode</h2>
        <div className="adm-fields">
          <div className="adm-field"><div className="adm-label">Current passcode</div><input className="adm-input" type="password" value={o} onChange={(e) => setO(e.target.value)} /></div>
          <div className="adm-field half"><div className="adm-label">New passcode (at least 10 characters)</div><input className="adm-input" type="password" value={n} onChange={(e) => setN(e.target.value)} /></div>
          <div className="adm-field half"><div className="adm-label">New passcode again</div><input className="adm-input" type="password" value={n2} onChange={(e) => setN2(e.target.value)} /></div>
        </div>
        <button className="adm-btn primary" onClick={change}>Change passcode</button>
      </div>
      <div className="adm-card">
        <h2 className="adm-h2" style={{ marginTop: 0 }}>Backup</h2>
        <p className="adm-help">Download every website setting as one file, or restore from such a file. (Articles and promotions are stored separately and are not part of this file.)</p>
        <div className="adm-row">
          <button className="adm-btn" onClick={exportAll}>Download backup</button>
          <label className="adm-btn ghost">Restore from file<input type="file" accept="application/json" hidden onChange={(e) => e.target.files?.[0] && importAll(e.target.files[0])} /></label>
        </div>
      </div>
    </div>
  );
}
