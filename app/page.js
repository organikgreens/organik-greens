import Link from 'next/link';
import Newsletter from '@/components/Newsletter';

export default function HomePage() {
  return (
    <div id="pg-home" className="pg on">

      {/* HERO */}
      <div className="hero appear">
        <div>
          <div className="hero-eyebrow"><span className="hero-dot"></span>India's Organic Farming Guide</div>
          <h1>Grow what<br />you <em>eat.</em> Eat what<br />you <em>trust.</em></h1>
          <p className="hero-lead">Expert guides on organic farming, urban gardening, hydroponics, and sustainable living — written for India, by people who care about the soil beneath your feet.</p>
          <div className="hero-actions">
            <Link href="/blog" className="btn btn-dark">Explore Articles →</Link>
            <a href="#nl-anchor" className="btn btn-outline">Free Newsletter</a>
          </div>
          <div className="hero-stats">
            <div><span className="hero-stat-n">24+</span><span className="hero-stat-l">Articles</span></div>
            <div><span className="hero-stat-n">6</span><span className="hero-stat-l">Topics</span></div>
            <div><span className="hero-stat-n">1K+</span><span className="hero-stat-l">Readers / month</span></div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card-main">
            <div className="hero-tag-chip">🌱 Featured Guide</div>
            <h4>Complete Guide to Organic Farming in India (2025)</h4>
            <p>Soil preparation, seed selection, natural pest control, and PGS-India certification — all in one place.</p>
            <Link href="/blog/organic-guide" className="btn btn-dark" style={{ marginTop: 16, fontSize: '.8rem', padding: '9px 18px' }}>Read Article →</Link>
          </div>
          <div className="hero-cards-row">
            <div className="hero-card-sm">
              <div className="hero-tag-chip" style={{ fontSize: '.65rem', padding: '2px 8px' }}>Trending</div>
              <div className="hero-card-sm-row" style={{ marginTop: 8 }}>
                <div><div style={{ fontSize: '.82rem', fontWeight: 600, color: 'var(--ink)' }}>Terrace Garden</div><div style={{ fontSize: '.75rem', color: 'var(--ink-4)' }}>Urban Farming</div></div>
                <span style={{ fontSize: '1.5rem' }}>🏙️</span>
              </div>
            </div>
            <div className="hero-card-sm">
              <div className="hero-tag-chip" style={{ fontSize: '.65rem', padding: '2px 8px', background: 'var(--amber-bg)', color: 'var(--amber)' }}>NEW</div>
              <div className="hero-card-sm-row" style={{ marginTop: 8 }}>
                <div><div style={{ fontSize: '.82rem', fontWeight: 600, color: 'var(--ink)' }}>NFT Hydroponics</div><div style={{ fontSize: '.75rem', color: 'var(--ink-4)' }}>under ₹5,000</div></div>
                <span style={{ fontSize: '1.5rem' }}>💧</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TICKER */}
      <div className="ticker">
        <div className="ticker-inner">
          {['Organic Farming', 'Urban Gardening', 'Hydroponics', 'Soil Science', 'Healthy Food', 'Agri-Business', 'Sustainability',
            'Organic Farming', 'Urban Gardening', 'Hydroponics', 'Soil Science', 'Healthy Food', 'Agri-Business', 'Sustainability'].map((t, i) => (
            <span className="ticker-item" key={i}><span className="ticker-dot"></span>{t}</span>
          ))}
        </div>
      </div>

      {/* PILLARS */}
      <section className="section" style={{ background: 'var(--surface)' }}>
        <div className="section-inner">
          <div className="section-header appear">
            <div className="eyebrow">What We Cover</div>
            <h2 className="section-title">Six pillars of <em>sustainable</em> knowledge</h2>
            <p className="section-sub">Every article on Organik Greens maps to one of these themes — ensuring depth, authority, and practical use for every reader.</p>
          </div>
          <div className="pillars-grid">
            {[
              ['organic-farming', '🌾', 'Organic Farming', 'Natural cultivation, composting, pest control, and PGS-India certification for Indian conditions.'],
              ['urban-farming', '🏙️', 'Urban Farming', 'Terrace gardens, balcony containers, vertical farms, and kitchen gardens for city dwellers.'],
              ['hydroponics', '💧', 'Hydroponics', 'NFT, DWC, and aeroponics — complete setup guides with real Indian cost breakdowns.'],
              ['soil-seeds', '🌱', 'Soil, Seeds & Inputs', 'Soil science, pH management, heirloom seeds, composting, and honest input reviews.'],
              ['health-food', '🥗', 'Health, Food & Life', 'Nutrition in organic produce, garden-to-table recipes, and sustainable food systems.'],
              ['agri-business', '📈', 'Agri-Business & Policy', 'Govt schemes, APMC reforms, organic export, farm-to-fork models, and agritech.'],
            ].map(([cat, icon, title, desc], i) => (
              <Link key={cat} href={`/blog?category=${cat}`} className={`pillar appear d${i + 1}`}>
                <div className="pillar-icon">{icon}</div>
                <h3>{title}</h3>
                <p>{desc}</p>
                <span className="pillar-link">Explore <span className="pillar-arrow">→</span></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED POSTS */}
      <section className="section" style={{ background: 'var(--white)' }}>
        <div className="section-inner">
          <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12 }}>
            <div className="appear">
              <div className="eyebrow">Latest Articles</div>
              <h2 className="section-title" style={{ marginBottom: 0 }}>From the <em>garden</em></h2>
            </div>
            <Link href="/blog" className="btn btn-outline appear">View all articles →</Link>
          </div>
          <div className="posts-hero" style={{ marginTop: 32 }}>
            <Link href="/blog/organic-guide" className="post large appear d1">
              <div className="post-thumb tall" style={{ fontSize: '4rem' }}>🌾</div>
              <div className="post-body">
                <span className="post-cat">Organic Farming</span>
                <h3>The Complete Guide to Organic Farming in India (2025) — Soil, Seeds, Certification & Profit</h3>
                <p>A beginner-friendly deep-dive into every aspect of chemical-free farming — from choosing your first crop to getting PGS-India certified and earning a premium from your harvest.</p>
                <div className="post-meta"><span>Organik Greens</span><span className="post-read">12 min read</span></div>
              </div>
            </Link>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <Link href="/blog/terrace-guide" className="post appear d2">
                <div className="post-thumb">🏙️</div>
                <div className="post-body">
                  <span className="post-cat">Urban Farming</span>
                  <h3>Top 10 Vegetables to Grow on Your Terrace in Delhi & Mumbai</h3>
                  <p>These crops thrive in Indian urban climates and need minimal space.</p>
                  <div className="post-meta"><span>Urban Farming</span><span className="post-read">8 min</span></div>
                </div>
              </Link>
              <Link href="/blog/hydro-guide" className="post appear d3">
                <div className="post-thumb">💧</div>
                <div className="post-body">
                  <span className="post-cat">Hydroponics</span>
                  <h3>Hydroponics at Home: What It Costs & How to Start in India</h3>
                  <p>Real cost breakdowns for an NFT system under ₹5,000.</p>
                  <div className="post-meta"><span>Hydroponics</span><span className="post-read">10 min</span></div>
                </div>
              </Link>
            </div>
          </div>
          <div className="posts-row" style={{ marginTop: 20 }}>
            <Link href="/blog/composting" className="post appear d1"><div className="post-thumb">🌿</div><div className="post-body"><span className="post-cat">Soil & Seeds</span><h3>5 Composting Methods That Work in Indian Climate</h3><p>Turn kitchen waste into black gold — with cost and time comparisons.</p><div className="post-meta"><span>Soil & Seeds</span><span className="post-read">9 min</span></div></div></Link>
            <Link href="/blog/pest-control" className="post appear d2"><div className="post-thumb">🍃</div><div className="post-body"><span className="post-cat">Organic Farming</span><h3>12 Natural Pest Control Methods That Work on Indian Crops</h3><p>From neem spray to companion planting — zero chemicals.</p><div className="post-meta"><span>Organic Farming</span><span className="post-read">11 min</span></div></div></Link>
            <Link href="/blog/govt-schemes" className="post appear d3"><div className="post-thumb">📋</div><div className="post-body"><span className="post-cat">Agri Business</span><h3>Government Schemes for Organic Farmers in India 2025</h3><p>PM-KISAN, PKVY, eNAM — every scheme you should be using.</p><div className="post-meta"><span>Agri Business</span><span className="post-read">13 min</span></div></div></Link>
          </div>
        </div>
      </section>

      {/* VALUES / PHILOSOPHY */}
      <section className="section" style={{ background: 'var(--surface)' }}>
        <div className="section-inner">
          <div className="section-header center appear">
            <div className="eyebrow">Our Philosophy</div>
            <h2 className="section-title">Knowledge that <em>actually helps</em> you grow</h2>
            <p className="section-sub">We are not a generic farming portal. Every article is written with a real Indian grower in mind — practical, honest, and grounded.</p>
          </div>
          <div className="values-grid" style={{ marginTop: 40 }}>
            <div className="value-card appear d1"><div className="value-num">01</div><h4>India-First Content</h4><p>Written for Indian soil, climate, crops, government schemes, and market realities — not translated from foreign sources that don't fit our context.</p></div>
            <div className="value-card appear d2"><div className="value-num">02</div><h4>Research-Backed & Honest</h4><p>Every claim is sourced. Every product recommendation is genuine. No paid puff pieces disguised as editorial. Affiliate disclosures are always clear.</p></div>
            <div className="value-card appear d3"><div className="value-num">03</div><h4>Beginner to Advanced</h4><p>Whether you're growing coriander on a windowsill or planning a 2-acre organic farm — there's something practical here for you at every stage.</p></div>
            <div className="value-card appear d4"><div className="value-num">04</div><h4>Community-Driven</h4><p>A real community of growers on WhatsApp and social media, sharing what actually works in their gardens and fields across India.</p></div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <div className="proof-strip appear">
        <div className="proof-strip-inner">
          <div className="eyebrow" style={{ color: 'rgba(255,255,255,.45)' }}>What Our Readers Say</div>
          <h2 className="section-title" style={{ color: '#fff', fontSize: '2rem', marginTop: 8 }}>Trusted by growers <em style={{ color: 'rgba(255,255,255,.55)' }}>across India</em></h2>
          <div className="proof-grid">
            <div className="proof-card">
              <div className="proof-stars">★★★★★</div>
              <p className="proof-text">"I started my terrace garden after reading the Organik Greens guide. Six months later I'm harvesting tomatoes, spinach, and methi every week. The instructions are so practical and India-specific — nothing generic."</p>
              <div className="proof-author"><div className="proof-avatar">P</div><div><div className="proof-name">Priya Sharma</div><div className="proof-role">Terrace Gardener, Gurgaon</div></div></div>
            </div>
            <div className="proof-card">
              <div className="proof-stars">★★★★★</div>
              <p className="proof-text">"The NFT hydroponics guide saved me from making expensive mistakes. I set up my first system for under ₹4,500 and it's been running for 3 months. The cost breakdown was exactly right for Delhi."</p>
              <div className="proof-author"><div className="proof-avatar">A</div><div><div className="proof-name">Arjun Mehta</div><div className="proof-role">Home Hydroponics, Delhi NCR</div></div></div>
            </div>
            <div className="proof-card">
              <div className="proof-stars">★★★★★</div>
              <p className="proof-text">"As a small organic farmer in Haryana, the PKVY scheme article was a revelation. I applied and got approval for ₹50,000 in support that I didn't even know existed. Organik Greens literally changed my income."</p>
              <div className="proof-author"><div className="proof-avatar">R</div><div><div className="proof-name">Ramesh Singh</div><div className="proof-role">Organic Farmer, Haryana</div></div></div>
            </div>
          </div>
        </div>
      </div>

      {/* SHOP PREVIEW */}
      <section className="section shop-section">
        <div className="section-inner">
          <div className="shop-banner appear">
            <div>
              <div className="eyebrow" style={{ color: 'rgba(255,255,255,.5)', marginBottom: 8 }}>Organik Greens Store</div>
              <h3>Products & Courses — Coming Soon</h3>
              <p>We are building a curated shop of organic seeds, hydroponic kits, digital guides, and online courses. Everything hand-picked and India-tested.</p>
            </div>
            <Link href="/shop" className="btn-white">Browse Store →</Link>
          </div>
          <div className="shop-grid">
            <div className="product-card appear d1">
              <div className="product-img">📗<span className="product-badge">Digital</span></div>
              <div className="product-body">
                <div className="product-name">Home Hydroponic Setup Guide</div>
                <div className="product-desc">Step-by-step PDF + video guide. Build your first NFT system for under ₹5,000.</div>
                <div className="product-footer"><span className="product-price">₹299</span><Link href="/shop" className="add-btn">+</Link></div>
              </div>
            </div>
            <div className="product-card appear d2">
              <div className="product-img">🌿<span className="product-badge">Digital</span></div>
              <div className="product-body">
                <div className="product-name">Indian Crop Calendar 2025</div>
                <div className="product-desc">Month-by-month planting guide for 40+ crops across Indian climate zones. PDF format.</div>
                <div className="product-footer"><span className="product-price">₹99</span><Link href="/shop" className="add-btn">+</Link></div>
              </div>
            </div>
            <div className="coming-soon-card appear d3">
              <span>🎓</span>
              <h4>Online Course</h4>
              <p>Organic Farming Masterclass — launching Month 6. <a href="#nl-anchor" style={{ color: 'var(--g-mid)', fontWeight: 600 }}>Join the waitlist →</a></p>
            </div>
            <div className="coming-soon-card appear d4">
              <span>🛒</span>
              <h4>Organic Seed Kits</h4>
              <p>Curated seed bundles for terraces, kitchens, and balconies — coming soon.</p>
            </div>
          </div>
        </div>
      </section>

      <Newsletter id="nl-anchor" source="homepage" />

      {/* CTA BANNER */}
      <div className="cta-banner appear">
        <div className="cta-banner-inner">
          <div className="eyebrow" style={{ color: 'rgba(255,255,255,.4)' }}>WhatsApp Community</div>
          <h2>Join 500+ growers on WhatsApp</h2>
          <p>Get weekly tips, ask farming questions, and connect with organic growers from Delhi to Bangalore — all in one friendly group.</p>
          <div className="cta-banner-btns">
            <a href="https://wa.me/919311053111" target="_blank" rel="noreferrer" className="btn-white">Join on WhatsApp →</a>
            <Link href="/contact" className="btn-ghost">Get in Touch</Link>
          </div>
        </div>
      </div>

    </div>
  );
}
