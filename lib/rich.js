import { Fragment } from 'react';
import Link from 'next/link';

// Turns simple dashboard formatting into React elements (never raw HTML):
//   *accent*  → <em>   **bold** → <strong>   [text](url) → link   new line → <br/>
const TOKEN = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)\s]+\))/g;

function inline(text, keyBase, emStyle) {
  const parts = String(text).split(TOKEN);
  return parts.map((p, i) => {
    const k = `${keyBase}-${i}`;
    if (!p) return null;
    if (p.startsWith('**') && p.endsWith('**') && p.length > 4) return <strong key={k}>{p.slice(2, -2)}</strong>;
    if (p.startsWith('*') && p.endsWith('*') && p.length > 2) return <em key={k} style={emStyle}>{p.slice(1, -1)}</em>;
    const m = p.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
    if (m) {
      const href = m[2];
      if (/^(https?:|mailto:|tel:)/.test(href)) return <a key={k} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" style={{ color: 'var(--g-mid)', fontWeight: 600 }}>{m[1]}</a>;
      return <Link key={k} href={href} style={{ color: 'var(--g-mid)', fontWeight: 600 }}>{m[1]}</Link>;
    }
    return <Fragment key={k}>{p}</Fragment>;
  });
}

export function rich(text, { emStyle } = {}) {
  if (text === null || text === undefined || text === '') return null;
  const lines = String(text).split('\n');
  return lines.map((line, i) => (
    <Fragment key={i}>
      {i > 0 ? <br /> : null}
      {inline(line, i, emStyle)}
    </Fragment>
  ));
}

// Splits text into paragraphs on blank lines.
export function paragraphs(text) {
  return String(text || '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
}

export function SmartLink({ href, children, newTab, ...rest }) {
  if (!href) return <span {...rest}>{children}</span>;
  if (/^(https?:|mailto:|tel:)/.test(href) || href.startsWith('#')) {
    return <a href={href} target={newTab || href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noreferrer' : undefined} {...rest}>{children}</a>;
  }
  return <Link href={href} target={newTab ? '_blank' : undefined} {...rest}>{children}</Link>;
}

export const on = (list) => (list || []).filter((x) => x && x.enabled !== false);
