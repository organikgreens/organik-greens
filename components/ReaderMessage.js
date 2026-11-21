'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export const CONTACT_EMAIL = 'deals.rajat@gmail.com';

const KINDS = [
  ['question', 'A question'],
  ['suggestion', 'A suggestion'],
  ['topic', 'A topic you should cover'],
  ['correction', 'Something to correct'],
  ['other', 'Something else'],
];

// End-of-article box: invites readers to write in, with a form that saves to reader_messages.
export default function ReaderMessage({ slug = null, title = '' }) {
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState('question');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [note, setNote] = useState('');

  async function submit(e) {
    e.preventDefault();
    const text = message.trim();
    const mail = email.trim();
    if (text.length < 3) { setNote('Please write your message.'); return; }
    if (mail && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(mail)) { setNote('Please check your email address.'); return; }
    setStatus('sending'); setNote('');
    const { error } = await supabase.from('reader_messages').insert({
      kind, name: name.trim() || null, email: mail || null, message: text.slice(0, 4000),
      article_slug: slug, page: typeof window !== 'undefined' ? window.location.pathname.slice(0, 300) : null,
    });
    if (error) { setStatus('error'); setNote(`That did not go through. Please try again, or email us at ${CONTACT_EMAIL}.`); return; }
    setStatus('sent');
  }

  return (
    <div className="art-cta reader-cta">
      <h3>Questions, suggestions or a topic idea?</h3>
      <p>
        Please write to us at <a href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(title ? `About: ${title}` : 'Organik Greens')}`}>{CONTACT_EMAIL}</a>.
        We read every message and reply within 48 hours.
      </p>
      {status === 'sent' ? (
        <p className="reader-done" role="status">Thank you. Your message has reached us{email.trim() ? ' and we will reply by email' : ''}.</p>
      ) : !open ? (
        <button type="button" className="reader-open" onClick={() => setOpen(true)}>Send us your question or suggestion</button>
      ) : (
        <form className="reader-form" onSubmit={submit}>
          <label className="rf-full">
            <span>What is it about?</span>
            <select value={kind} onChange={(e) => setKind(e.target.value)}>
              {KINDS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </label>
          <label className="rf-full">
            <span>Your message</span>
            <textarea required rows={4} maxLength={4000} value={message} onChange={(e) => setMessage(e.target.value)}
              placeholder="For example: my tomato leaves are curling upwards in Pune. What should I check first?" />
          </label>
          <label>
            <span>Name (optional)</span>
            <input type="text" maxLength={120} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
          </label>
          <label>
            <span>Email, if you would like a reply</span>
            <input type="email" maxLength={200} value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          </label>
          <div className="rf-full rf-actions">
            <button type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : 'Send message'}</button>
            {note ? <span className="rf-note" role="alert">{note}</span> : null}
          </div>
        </form>
      )}
    </div>
  );
}
