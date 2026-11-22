'use client';

import { useState } from 'react';

export default function FaqList({ items = [] }) {
  const [open, setOpen] = useState(null);
  return items.map((f, i) => (
    <div key={f.id || i} className={`faq-item${open === i ? ' open' : ''}`} onClick={() => setOpen(open === i ? null : i)}>
      <div className="faq-q">{f.q} <span className="faq-arrow">▾</span></div>
      <div className={`faq-a${open === i ? ' open' : ''}`}>{f.a}</div>
    </div>
  ));
}
