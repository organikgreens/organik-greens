import Link from 'next/link';
import ReaderMessage from '@/components/ReaderMessage';

export const metadata = {
  title: 'About — Organik Greens',
  description: "The story behind Organik Greens — why it was built, what it stands for, and why we believe organic farming is India's most important future.",
};

export default function AboutPage() {
  return (
    <div id="pg-about" className="pg on">
      <div className="about-hero">
        <div className="about-hero-inner">
          <div className="appear">
            <div className="eyebrow">Our Story</div>
            <h1>Growing awareness.<br /><em>Cultivating change.</em></h1>
            <p style={{ fontSize: '1.05rem', color: 'var(--ink-3)', lineHeight: 1.8, maxWidth: 480, marginTop: 16 }}>The story behind Organik Greens — why it was built, what it stands for, and why we believe organic farming is India's most important future.</p>
            <Link href="/contact" className="btn btn-dark" style={{ marginTop: 24 }}>Work With Us →</Link>
          </div>
          <div className="appear d2">
            <div className="about-img">🌿
              <div className="about-badge"><span className="about-badge-n">100%</span><span className="about-badge-l">Organic Focus</span></div>
            </div>
          </div>
        </div>
      </div>

      <section className="section" style={{ background: 'var(--white)' }}>
        <div className="section-inner">
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <div style={{ background: 'var(--g-faint)', borderLeft: '3px solid var(--g-base)', borderRadius: '0 var(--r-sm) var(--r-sm) 0', padding: '20px 24px', marginBottom: 40 }}>
              <p style={{ fontFamily: "'DM Serif Display',serif", fontSize: '1.3rem', color: 'var(--ink)', lineHeight: 1.5, fontStyle: 'italic', margin: 0 }}>"Organic farming is not a trend. It is India's oldest tradition — and its most important future."</p>
            </div>
            <h2 style={{ fontSize: '1.8rem', marginBottom: 12 }}>Why Organik Greens exists</h2>
            <p style={{ color: 'var(--ink-3)', lineHeight: 1.8, marginBottom: '1rem' }}>India has over 140 million farmers. Millions more city dwellers long to grow their own food on terraces, balconies, and kitchen windowsills. Yet the practical, honest, India-specific knowledge they need is buried behind jargon, outdated government pamphlets, or generic Western advice that doesn't understand our soil, our crops, or our climate.</p>
            <p style={{ color: 'var(--ink-3)', lineHeight: 1.8, marginBottom: '2.5rem' }}>Organik Greens was built to change that. To be the resource that a progressive farmer in Punjab, an urban home-grower in Hyderabad, and a curious student in Delhi can all rely on — equally, practically, honestly.</p>

            <h2 style={{ fontSize: '1.8rem', marginBottom: 24 }}>Vision & Mission</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 40 }}>
              <div style={{ background: 'var(--g-dark)', color: '#fff', padding: 24, borderRadius: 'var(--r)' }}>
                <div style={{ fontSize: '.72rem', fontWeight: 700, color: 'rgba(255,255,255,.4)', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 8 }}>Vision</div>
                <p style={{ fontSize: '.9rem', lineHeight: 1.7, color: 'rgba(255,255,255,.8)', margin: 0 }}>To be India's most trusted digital destination for organic and sustainable agriculture — inspiring a generation of growers to reconnect with the earth.</p>
              </div>
              <div style={{ background: 'var(--g-faint)', border: '1px solid var(--g-light)', padding: 24, borderRadius: 'var(--r)' }}>
                <div style={{ fontSize: '.72rem', fontWeight: 700, color: 'var(--g-mid)', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 8 }}>Mission</div>
                <p style={{ fontSize: '.9rem', lineHeight: 1.7, color: 'var(--ink-3)', margin: 0 }}>To educate, inspire, and guide individuals and farming communities so that every person can grow, eat, and live more sustainably.</p>
              </div>
            </div>

            <h2 style={{ fontSize: '1.8rem', marginBottom: 20 }}>The journey so far</h2>
            <div className="timeline">
              <div className="tl-item"><div className="tl-year">2025 — Month 1</div><h4>Launch</h4><p>Organik Greens goes live with our first articles on organic farming and urban gardening in India.</p></div>
              <div className="tl-item"><div className="tl-year">2025 — Month 3</div><h4>First Digital Products</h4><p>The Hydroponic Setup Guide and Crop Calendar launch — our first step toward a full product ecosystem.</p></div>
              <div className="tl-item"><div className="tl-year">2025 — Month 6</div><h4>Community & Courses</h4><p>First online course launch, an active community of readers writing in with questions, and growing towards 50,000 monthly readers.</p></div>
              <div className="tl-item"><div className="tl-year">2026 — Year 2</div><h4>Full Ecosystem</h4><p>Physical product lines, consulting services, partnerships with organic farms and agritech companies across India.</p></div>
            </div>

            <h2 style={{ fontSize: '1.8rem', margin: '40px 0 20px' }}>What we stand for</h2>
            <div style={{ display: 'grid', gap: 12 }}>
              <div style={{ display: 'flex', gap: 14, background: 'var(--surface)', border: '1px solid var(--rule)', borderRadius: 'var(--r-sm)', padding: 16 }}><div style={{ fontSize: '1.25rem', minWidth: 24 }}>🌱</div><div><strong style={{ color: 'var(--ink)', display: 'block', marginBottom: 3 }}>Integrity</strong><p style={{ fontSize: '.88rem', color: 'var(--ink-3)', margin: 0, lineHeight: 1.65 }}>Every claim is sourced. Every recommendation is genuine. Sponsorships are clearly disclosed — always.</p></div></div>
              <div style={{ display: 'flex', gap: 14, background: 'var(--surface)', border: '1px solid var(--rule)', borderRadius: 'var(--r-sm)', padding: 16 }}><div style={{ fontSize: '1.25rem', minWidth: 24 }}>🌍</div><div><strong style={{ color: 'var(--ink)', display: 'block', marginBottom: 3 }}>Accessibility</strong><p style={{ fontSize: '.88rem', color: 'var(--ink-3)', margin: 0, lineHeight: 1.65 }}>Knowledge about sustainable agriculture belongs to everyone — from a farmer in Bihar to a startup grower in Bangalore.</p></div></div>
              <div style={{ display: 'flex', gap: 14, background: 'var(--surface)', border: '1px solid var(--rule)', borderRadius: 'var(--r-sm)', padding: 16 }}><div style={{ fontSize: '1.25rem', minWidth: 24 }}>♻️</div><div><strong style={{ color: 'var(--ink)', display: 'block', marginBottom: 3 }}>Sustainability</strong><p style={{ fontSize: '.88rem', color: 'var(--ink-3)', margin: 0, lineHeight: 1.65 }}>We practice what we preach. The brands we partner with, the products we recommend — sustainability is a filter, not a tagline.</p></div></div>
              <div style={{ display: 'flex', gap: 14, background: 'var(--surface)', border: '1px solid var(--rule)', borderRadius: 'var(--r-sm)', padding: 16 }}><div style={{ fontSize: '1.25rem', minWidth: 24 }}>👥</div><div><strong style={{ color: 'var(--ink)', display: 'block', marginBottom: 3 }}>Community First</strong><p style={{ fontSize: '.88rem', color: 'var(--ink-3)', margin: 0, lineHeight: 1.65 }}>Our readers are not an audience to sell to. They are a community to serve, celebrate, and learn from every single day.</p></div></div>
            </div>
          </div>
        </div>
      </section>

      <div className="logo-strip">
        <div className="logo-strip-inner">
          <p>As featured in</p>
          <div className="partner-logos">
            <span className="partner-logo">Krishi Jagran</span>
            <span className="partner-logo">Down To Earth</span>
            <span className="partner-logo">The Hindu AgriTech</span>
            <span className="partner-logo">Farmer's Weekly</span>
            <span className="partner-logo">AgriBusiness Global</span>
          </div>
        </div>
      </div>

      <ReaderMessage
        variant="section"
        id="ask"
        eyebrow="Stay in touch"
        heading="Write to us"
        page="/about"
        intro={<>Questions, suggestions, a topic you want covered or a correction: we read every message and reply by email or WhatsApp within 48 hours.</>}
      />
    </div>
  );
}
