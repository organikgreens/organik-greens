'use client';

import { createContext, useContext, useEffect, useId, useRef, useState } from 'react';
import { uploadImage, rpc, uid, clone } from './api';

export const AdminCtx = createContext({ posts: [], paths: [], toast: () => {} });

const get = (obj, k) => (obj ? obj[k] : undefined);

export function Help({ children }) {
  return children ? <div className="adm-help">{children}</div> : null;
}

function Label({ f }) {
  return <div className="adm-label">{f.label}{f.required ? ' *' : ''}</div>;
}

export function Toggle({ checked, onChange, label }) {
  return (
    <label className="adm-toggle">
      <input type="checkbox" checked={!!checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="adm-switch" />
      {label ? <span>{label}</span> : null}
    </label>
  );
}

function ImageLibrary({ onPick, onClose }) {
  const [list, setList] = useState(null);
  const [err, setErr] = useState('');
  useEffect(() => {
    rpc('admin_list_images').then((d) => setList(d || []), (e) => setErr(e.message));
  }, []);
  return (
    <div className="adm-modal" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="adm-modal-box">
        <div className="adm-modal-head"><strong>Your uploaded images</strong><button className="adm-btn ghost" onClick={onClose}>Close</button></div>
        {err ? <p className="adm-err">{err}</p> : null}
        {list === null && !err ? <p>Loading…</p> : null}
        <div className="adm-lib">
          {(list || []).map((x) => (
            <button key={x.public_url} className="adm-lib-item" onClick={() => { onPick(x.public_url); onClose(); }} title={x.path}>
              <img src={x.public_url} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ImageInput({ value, onChange, compact = false }) {
  const ref = useRef(null);
  const [busy, setBusy] = useState(false);
  const [lib, setLib] = useState(false);
  const { toast } = useContext(AdminCtx);
  async function onFile(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setBusy(true);
    try { onChange(await uploadImage(file)); toast('Image uploaded'); } catch (er) { toast(er.message, 'error'); }
    setBusy(false);
  }
  return (
    <div className={`adm-image${compact ? ' compact' : ''}`}>
      {value ? <img src={value} alt="" className="adm-image-prev" /> : <div className="adm-image-prev empty">No image</div>}
      <div className="adm-image-ctl">
        <input className="adm-input" value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder="Paste an image link, or upload" />
        <div className="adm-row">
          <button type="button" className="adm-btn small" onClick={() => ref.current?.click()} disabled={busy}>{busy ? 'Uploading…' : 'Upload'}</button>
          <button type="button" className="adm-btn small ghost" onClick={() => setLib(true)}>Library</button>
          {value ? <button type="button" className="adm-btn small ghost danger" onClick={() => onChange('')}>Remove</button> : null}
        </div>
        <input ref={ref} type="file" accept="image/*" hidden onChange={onFile} />
      </div>
      {lib ? <ImageLibrary onPick={onChange} onClose={() => setLib(false)} /> : null}
    </div>
  );
}

function LinkInput({ value, onChange, placeholder }) {
  const { paths } = useContext(AdminCtx);
  const id = `dl${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  return (
    <>
      <input className="adm-input" list={id} value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder || '/blog, /about, https://… or #ask'} />
      <datalist id={id}>{paths.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}</datalist>
    </>
  );
}

function PostSelect({ value, onChange, allowEmpty = true }) {
  const { posts } = useContext(AdminCtx);
  return (
    <select className="adm-input" value={value || ''} onChange={(e) => onChange(e.target.value)}>
      {allowEmpty ? <option value="">— choose an article —</option> : null}
      {posts.map((p) => <option key={p.slug} value={p.slug}>{p.published ? '' : '[draft] '}{p.title}</option>)}
    </select>
  );
}

function PostMulti({ value, onChange }) {
  const { posts } = useContext(AdminCtx);
  const list = value || [];
  const bySlug = Object.fromEntries(posts.map((p) => [p.slug, p]));
  const move = (i, d) => { const n = [...list]; const j = i + d; if (j < 0 || j >= n.length) return; [n[i], n[j]] = [n[j], n[i]]; onChange(n); };
  return (
    <div className="adm-postmulti">
      {list.length === 0 ? <div className="adm-muted">Nothing picked yet.</div> : null}
      {list.map((s, i) => (
        <div className="adm-pm-row" key={s}>
          <span className="adm-pm-n">{i + 1}</span>
          <span className="adm-pm-t">{bySlug[s]?.title || s}{bySlug[s] && !bySlug[s].published ? ' (draft — not shown)' : ''}</span>
          <button type="button" className="adm-icon" onClick={() => move(i, -1)} title="Move up">↑</button>
          <button type="button" className="adm-icon" onClick={() => move(i, 1)} title="Move down">↓</button>
          <button type="button" className="adm-icon danger" onClick={() => onChange(list.filter((x) => x !== s))} title="Remove">×</button>
        </div>
      ))}
      <select className="adm-input" value="" onChange={(e) => e.target.value && onChange([...list, e.target.value])}>
        <option value="">+ Add an article…</option>
        {posts.filter((p) => !list.includes(p.slug)).map((p) => <option key={p.slug} value={p.slug}>{p.published ? '' : '[draft] '}{p.title}</option>)}
      </select>
    </div>
  );
}

function TagsInput({ value, onChange, placeholder }) {
  const [text, setText] = useState((value || []).join('\n'));
  return (
    <textarea className="adm-input" rows={Math.min(10, Math.max(3, (value || []).length + 1))} value={text} placeholder={placeholder || 'One per line'}
      onChange={(e) => { setText(e.target.value); onChange(e.target.value.split('\n').map((x) => x.trim()).filter(Boolean)); }} />
  );
}

export function ListField({ f, value, onChange }) {
  const list = value || [];
  const [open, setOpen] = useState(() => (list.length <= 1 ? 0 : -1));
  const set = (i, v) => { const n = [...list]; n[i] = v; onChange(n); };
  const move = (i, d) => { const n = [...list]; const j = i + d; if (j < 0 || j >= n.length) return; [n[i], n[j]] = [n[j], n[i]]; onChange(n); if (open === i) setOpen(j); };
  const add = () => { const it = f.newItem ? f.newItem() : {}; onChange([...list, { id: uid('i'), enabled: true, ...it }]); setOpen(list.length); };
  const dup = (i) => { const c = { ...clone(list[i]), id: uid('i') }; const n = [...list]; n.splice(i + 1, 0, c); onChange(n); setOpen(i + 1); };
  const del = (i) => { if (!confirm('Remove this item?')) return; onChange(list.filter((_, j) => j !== i)); setOpen(-1); };
  return (
    <div className="adm-list">
      {list.map((it, i) => {
        const title = (f.itemTitle ? f.itemTitle(it, i) : it.title || it.label || it.name) || `Item ${i + 1}`;
        const hasToggle = f.item.some((x) => x.k === 'enabled') || 'enabled' in (it || {});
        return (
          <div key={it.id || i} className={`adm-li${open === i ? ' open' : ''}${it.enabled === false ? ' off' : ''}`}>
            <div className="adm-li-head">
              <button type="button" className="adm-li-title" onClick={() => setOpen(open === i ? -1 : i)}>
                <span className="adm-li-caret">{open === i ? '▾' : '▸'}</span>
                <span>{title}</span>
                {it.enabled === false ? <span className="adm-chip muted">hidden</span> : null}
              </button>
              {hasToggle && !f.noToggle ? <Toggle checked={it.enabled !== false} onChange={(v) => set(i, { ...it, enabled: v })} /> : null}
              <button type="button" className="adm-icon" onClick={() => move(i, -1)} title="Move up">↑</button>
              <button type="button" className="adm-icon" onClick={() => move(i, 1)} title="Move down">↓</button>
              {!f.fixed ? <button type="button" className="adm-icon" onClick={() => dup(i)} title="Duplicate">⧉</button> : null}
              {!f.fixed ? <button type="button" className="adm-icon danger" onClick={() => del(i)} title="Remove">×</button> : null}
            </div>
            {open === i ? (
              <div className="adm-li-body">
                <Fields fields={f.item.filter((x) => x.k !== 'enabled')} value={it} onChange={(v) => set(i, v)} />
              </div>
            ) : null}
          </div>
        );
      })}
      {!f.fixed ? <button type="button" className="adm-btn small" onClick={add}>+ {f.addLabel || 'Add item'}</button> : null}
    </div>
  );
}

export function Field({ f, value, onChange, whole }) {
  if (f.show && !f.show(whole)) return null;
  if (f.type === 'heading') return <div className="adm-subhead">{f.label}{f.help ? <Help>{f.help}</Help> : null}</div>;
  if (f.type === 'note') return <div className="adm-note">{f.label}</div>;
  let input;
  switch (f.type) {
    case 'textarea':
    case 'rich':
      input = <textarea className="adm-input" rows={f.rows || 3} value={value ?? ''} placeholder={f.placeholder} onChange={(e) => onChange(e.target.value)} />;
      break;
    case 'code':
      input = <textarea className="adm-input mono" rows={f.rows || 10} value={value ?? ''} placeholder={f.placeholder} onChange={(e) => onChange(e.target.value)} spellCheck={false} />;
      break;
    case 'number':
      input = <input className="adm-input short" type="number" min={f.min} max={f.max} step={f.step || 1} value={value ?? ''} onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))} />;
      break;
    case 'toggle':
      return <div className="adm-field inline"><Toggle checked={value} onChange={onChange} label={f.label} />{f.help ? <Help>{f.help}</Help> : null}</div>;
    case 'select':
      input = (
        <select className="adm-input" value={value ?? ''} onChange={(e) => onChange(f.numeric ? Number(e.target.value) : e.target.value)}>
          {f.options.map(([v, l]) => <option key={String(v)} value={v}>{l}</option>)}
        </select>
      );
      break;
    case 'color':
      input = (
        <div className="adm-row">
          <input type="color" className="adm-color" value={/^#[0-9a-f]{6}$/i.test(value || '') ? value : '#ffffff'} onChange={(e) => onChange(e.target.value)} />
          <input className="adm-input short" value={value || ''} placeholder={f.placeholder || 'default'} onChange={(e) => onChange(e.target.value)} />
          {value ? <button type="button" className="adm-btn small ghost" onClick={() => onChange('')}>Use default</button> : null}
        </div>
      );
      break;
    case 'image': input = <ImageInput value={value} onChange={onChange} />; break;
    case 'link': input = <LinkInput value={value} onChange={onChange} placeholder={f.placeholder} />; break;
    case 'post': input = <PostSelect value={value} onChange={onChange} />; break;
    case 'posts': input = <PostMulti value={value} onChange={onChange} />; break;
    case 'tags': input = <TagsInput value={value} onChange={onChange} placeholder={f.placeholder} />; break;
    case 'list': input = <ListField f={f} value={value} onChange={onChange} />; break;
    case 'object': input = <div className="adm-obj"><Fields fields={f.fields} value={value || {}} onChange={onChange} /></div>; break;
    case 'checks':
      input = (
        <div className="adm-checks">
          {f.options.map(([v, l]) => (
            <label key={String(v)}><input type="checkbox" checked={(value || []).includes(v)} onChange={(e) => onChange(e.target.checked ? [...(value || []), v] : (value || []).filter((x) => x !== v))} /> {l}</label>
          ))}
        </div>
      );
      break;
    default:
      input = <input className="adm-input" value={value ?? ''} placeholder={f.placeholder} onChange={(e) => onChange(e.target.value)} />;
  }
  return (
    <div className={`adm-field${f.half ? ' half' : ''}`}>
      <Label f={f} />
      {input}
      {f.type === 'rich' ? <Help>{f.help || 'Formatting: *accent* for the green italic look, **bold**, [link text](/url), Enter for a new line.'}</Help> : <Help>{f.help}</Help>}
    </div>
  );
}

export function Fields({ fields, value, onChange }) {
  return (
    <div className="adm-fields">
      {fields.map((f, i) => (
        <Field key={f.k || `${f.type}-${i}`} f={f} whole={value} value={f.k ? get(value, f.k) : undefined}
          onChange={(v) => onChange({ ...(value || {}), [f.k]: v })} />
      ))}
    </div>
  );
}
