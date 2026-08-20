'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Newsletter({
  eyebrow = 'Free Weekly Newsletter',
  heading = 'The Green Monday Brief',
  description = 'Every Monday morning — one practical growing tip, one new article, and one honest product recommendation. Zero spam. Unsubscribe anytime.',
  buttonLabel = 'Subscribe',
  note = '🌱 Join 1,000+ growers reading every week across India.',
  source = 'unknown',
  id,
}) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [message, setMessage] = useState(note);

  async function handleSubmit(e) {
    e.preventDefault();
    const value = email.trim();
    if (!value || !value.includes('@')) {
      setMessage('Please enter a valid email address.');
      return;
    }
    setStatus('loading');
    const { error } = await supabase.from('subscribers').insert({ email: value, source });
    if (error) {
      // Duplicate email is fine — treat as success from the user's perspective
      if (error.code === '23505') {
        setStatus('success');
        setMessage("You're already subscribed. Thanks for being here!");
      } else {
        setStatus('error');
        setMessage('Something went wrong — please try again in a moment.');
      }
    } else {
      setStatus('success');
      setEmail('');
      setMessage("You're subscribed! Check your inbox for a welcome message.");
    }
  }

  return (
    <div id={id} className="nl-section">
      <div className="nl-inner appear">
        <div className="eyebrow">{eyebrow}</div>
        <h2>{heading}</h2>
        <p>{description}</p>
        <form className="nl-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? 'Please wait…' : buttonLabel}
          </button>
        </form>
        <div className="nl-note" style={status === 'success' ? { color: 'var(--g-mid)' } : undefined}>
          {message}
        </div>
      </div>
    </div>
  );
}
