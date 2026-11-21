'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export const CONTACT_EMAIL = 'deals.rajat@gmail.com';

export const READER_KINDS = [
  ['question', 'A question'],
  ['suggestion', 'A suggestion'],
  ['topic', 'A topic you should cover'],
  ['correction', 'Something to correct'],
  ['other', 'Something else'],
];

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

// Turns what a reader types into digits with a country code; 10-digit Indian mobiles get +91.
function normaliseWhatsApp(raw) {
  const digits = String(raw || '').replace(/[^0-9]/g, '');
  if (/^[6-9][0-9]{9}$/.test(digits)) return `91${digits}`;
  if (/^0[6-9][0-9]{9}$/.test(digits)) return `91${digits.slice(1)}`;
  return digits;
}

/**
 * Reader enquiry box. Every message needs one way to reply: email or WhatsApp, chosen from a drop-down.
 * variant: 'article' (end of an article), 'section' (full-width page section), 'card' (inside an existing card)
 */
export default function ReaderMessage({
  slug = null,
  title = '',
  variant = 'article',
  id,
  eyebrow = '',
  heading = 'Questions, suggestions or a topic idea?',
  intro = null,
  kinds = READER_KINDS,
  page = null,
  startOpen = false,
  placeholder = 'For example: my tomato leaves are curling upwards in Pune. What should I check first?',
}) {
  const [open, setOpen] = useState(startOpen);
  const [kind, setKind] = useState(kinds[0][0]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [method, setMethod] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [note, setNote] = useState('');

  async function submit(e) {
    e.preventDefault();
    const text = message.trim();
    if (text.length < 3) { setNote('Please write your message.'); return; }
    if (!method) { setNote('Please choose how we should reply: email or WhatsApp.'); return; }
    const mail = email.trim();
    const wa = normaliseWhatsApp(whatsapp);
    if (method === 'email' && !EMAIL_RE.test(mail)) { setNote('Please enter a valid email address so we can reply.'); return; }
    if (method === 'whatsapp' && !/^[0-9]{10,15}$/.test(wa)) { setNote('Please enter your WhatsApp number, with the country code if you are outside India.'); return; }
    setStatus('sending'); setNote('');
    const { error } = await supabase.from('reader_messages').insert({
      kind,
      name: name.trim().slice(0, 120) || null,
      message: text.slice(0, 4000),
      contact_method: method,
      email: method === 'email' ? mail.slice(0, 200) : null,
      whatsapp: method === 'whatsapp' ? wa : null,
      article_slug: slug,
      page: page || (typeof window !== 'undefined' ? window.location.pathname.slice(0, 300) : null),
    });
    if (error) { setStatus('error'); setNote(`That did not go through. Please try again, or email us at ${CONTACT_EMAIL}.`); return; }
    setStatus('sent');
  }

  const body = (
    <>
      {eyebrow ? <div className="eyebrow">{eyebrow}</div> : null}
      {heading ? <h3>{heading}</h3> : null}
      <p>
        {intro || <>Please write to us at <a href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(title ? `About: ${title}` : 'Organik Greens')}`}>{CONTACT_EMAIL}</a>. We read every message and reply within 48 hours.</>}
      </p>
      {status === 'sent' ? (
        <p className="reader-done" role="status">
          Thank you. Your message has reached us, and we will reply on {method === 'whatsapp' ? 'WhatsApp' : 'email'} within 48 hours.
        </p>
      ) : !open ? (
        <button type="button" className="reader-open" onClick={() => setOpen(true)}>Send us your question or suggestion</button>
      ) : (
        <form className="reader-form" onSubmit={submit} noValidate>
          <label className="rf-full">
            <span>What is it about?</span>
            <select value={kind} onChange={(e) => setKind(e.target.value)}>
              {kinds.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </label>
          <label className="rf-full">
            <span>Your message *</span>
            <textarea required rows={4} maxLength={4000} value={message} onChange={(e) => setMessage(e.target.value)} placeholder={placeholder} />
          </label>
          <label>
            <span>Your name</span>
            <input type="text" maxLength={120} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
          </label>
          <label>
            <span>How should we reply? *</span>
            <select required value={method} onChange={(e) => { setMethod(e.target.value); setNote(''); }}>
              <option value="" disabled>Choose one</option>
              <option value="email">Email</option>
              <option value="whatsapp">WhatsApp</option>
            </select>
          </label>
          {method === 'email' ? (
            <label className="rf-full">
              <span>Your email address *</span>
              <input type="email" required maxLength={200} value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="name@example.com" />
            </label>
          ) : null}
          {method === 'whatsapp' ? (
            <label className="rf-full">
              <span>Your WhatsApp number *</span>
              <input type="tel" required maxLength={20} value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} autoComplete="tel" inputMode="tel" placeholder="98765 43210 (add the country code if outside India)" />
            </label>
          ) : null}
          <div className="rf-full rf-actions">
            <button type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : 'Send message'}</button>
            {note ? <span className="rf-note" role="alert">{note}</span> : null}
          </div>
          <p className="rf-privacy rf-full">We use your contact details only to reply to this message.</p>
        </form>
      )}
    </>
  );

  if (variant === 'section') {
    return (
      <section id={id} className="reader-section">
        <div className="reader-section-inner art-cta reader-cta">{body}</div>
      </section>
    );
  }
  if (variant === 'card') return <div id={id} className="reader-card">{body}</div>;
  return <div id={id} className="art-cta reader-cta">{body}</div>;
}
