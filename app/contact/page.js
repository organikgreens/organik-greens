'use client';

import { useState } from 'react';
import ReaderMessage from '@/components/ReaderMessage';

const FAQS = [
  ['How quickly do you reply to messages?', 'We aim to reply to all emails within 24–48 hours on working days. For urgent matters, WhatsApp is the fastest way to reach us — we typically respond within a few hours.'],
  ['Do you accept guest articles or expert contributions?', 'Yes! We welcome contributions from agronomists, organic farmers, nutritionists, and agritech professionals. Please use the contact form with "Content Collaboration" selected, and share a brief outline of your proposed article.'],
  ['Can you help me set up an organic farm or urban garden?', 'We offer consulting sessions for farms, urban gardens, schools, and corporate green spaces. Select "Consulting Request" in the contact form and share your location and project scope — we\'ll get back to you with details and pricing.'],
  ['How can brands advertise or collaborate with Organik Greens?', 'We work with organic brands, agritech companies, and sustainable food businesses on sponsored articles, social media collaborations, and product reviews. We maintain a strict editorial policy — all sponsorships are clearly disclosed. Use the form to get a media kit.'],
  ['Are the digital products available for immediate download?', 'Yes — all digital products (PDF guides, crop calendars) are available for instant download after purchase. Our secure payment and delivery system is powered by Razorpay. If you have any issues with a download, email us and we\'ll resolve it immediately.'],
];

function Faq({ q, a, isOpen, onToggle }) {
  return (
    <div className={`faq-item${isOpen ? ' open' : ''}`} onClick={onToggle}>
      <div className="faq-q">{q} <span className="faq-arrow">▾</span></div>
      <div className={`faq-a${isOpen ? ' open' : ''}`}>{a}</div>
    </div>
  );
}

export default function ContactPage() {
  const [openFaq, setOpenFaq] = useState(null);
  return (
    <div id="pg-contact" className="pg on">
      <div className="contact-section">
        <div className="contact-inner">
          <div className="appear">
            <div className="eyebrow">Get in Touch</div>
            <h1 className="contact-info" style={{ fontFamily: "'DM Serif Display',serif", fontSize: 'clamp(2rem,3vw,2.8rem)', marginBottom: 12 }}>Let's grow<br />something <em>together.</em></h1>
            <p style={{ fontSize: '1rem', color: 'var(--ink-3)', lineHeight: 1.75, marginBottom: 32, maxWidth: 340 }}>Whether you have a question about an article, want to collaborate, advertise, or just share what you're growing — we'd love to hear from you.</p>

            <div className="contact-method">
              <div className="cm-icon">✉️</div>
              <div>
                <div className="cm-label">Email</div>
                <div className="cm-value">deals.rajat@gmail.com</div>
                <div className="cm-sub">Response within 24–48 hours</div>
              </div>
            </div>

            <div className="contact-method">
              <div className="cm-icon">📞</div>
              <div>
                <div className="cm-label">Phone & WhatsApp</div>
                <div className="cm-value">+91 93110 53111</div>
                <div className="cm-sub">Mon–Sat, 10am–6pm IST</div>
                <a href="https://wa.me/919311053111" target="_blank" rel="noreferrer" className="wa-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Chat on WhatsApp
                </a>
              </div>
            </div>

            <div className="contact-method">
              <div className="cm-icon">📍</div>
              <div>
                <div className="cm-label">Location</div>
                <div className="cm-value">Delhi NCR, India</div>
                <div className="cm-sub">Home office — virtual meetings available</div>
              </div>
            </div>

            <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid var(--rule)' }}>
              <div className="eyebrow" style={{ marginBottom: 12 }}>Follow Us</div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <a href="#" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '.8rem', fontWeight: 600, color: 'var(--ink-2)', background: 'var(--surface)', border: '1px solid var(--rule)', padding: '8px 14px', borderRadius: 50 }}>📸 Instagram</a>
                <a href="#" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '.8rem', fontWeight: 600, color: 'var(--ink-2)', background: 'var(--surface)', border: '1px solid var(--rule)', padding: '8px 14px', borderRadius: 50 }}>▶️ YouTube</a>
                <a href="#" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '.8rem', fontWeight: 600, color: 'var(--ink-2)', background: 'var(--surface)', border: '1px solid var(--rule)', padding: '8px 14px', borderRadius: 50 }}>📌 Pinterest</a>
              </div>
            </div>
          </div>

          <div className="appear d2">
            <div className="contact-form-card">
              <h2>Send us a message</h2>
              <ReaderMessage
                variant="card"
                heading=""
                page="/contact"
                startOpen
                intro={<>Fill in the form and we will get back to you within 24–48 hours, on email or WhatsApp, whichever you choose.</>}
                kinds={[['question', 'General enquiry or question'], ['suggestion', 'Suggestion or feedback'], ['topic', 'A topic you should cover'], ['collaboration', 'Content collaboration'], ['consulting', 'Consulting request'], ['advertising', 'Advertising or sponsorship'], ['product', 'Product or course enquiry'], ['press', 'Press or media'], ['internship', 'Internship'], ['other', 'Other']]}
                placeholder="Tell us about your question, project or idea. The more detail, the better."
              />
            </div>
          </div>
        </div>
      </div>

      <div className="faq-section">
        <div className="faq-inner">
          <div className="eyebrow" style={{ textAlign: 'center', marginBottom: 8 }}>FAQ</div>
          <h2 className="section-title" style={{ textAlign: 'center', marginBottom: 32 }}>Common questions</h2>
          {FAQS.map(([q, a], i) => (
            <Faq key={i} q={q} a={a} isOpen={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? null : i)} />
          ))}
        </div>
      </div>
    </div>
  );
}
