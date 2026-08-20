import Newsletter from '@/components/Newsletter';

export const metadata = {
  title: 'Shop — Organik Greens',
  description: 'Curated digital products, guides, and upcoming courses — everything India-tested and honestly recommended.',
};

export default function ShopPage() {
  return (
    <div id="pg-shop" className="pg on">
      <div className="blog-header">
        <div className="blog-header-inner">
          <div className="eyebrow">Organik Greens Store</div>
          <h1 className="section-title" style={{ fontSize: 'clamp(2rem,3.5vw,3rem)' }}>Products & <em>Courses</em></h1>
          <p style={{ color: 'var(--ink-3)', maxWidth: 540, marginTop: 8, fontSize: '.97rem', lineHeight: 1.7 }}>Curated digital products, guides, and upcoming courses — everything India-tested and honestly recommended.</p>
        </div>
      </div>
      <section className="section" style={{ background: 'var(--surface)', paddingTop: 40 }}>
        <div className="section-inner">
          <div className="eyebrow" style={{ marginBottom: 20 }}>Coming Soon — Products, Courses & Physical Kits</div>
          <p style={{ color: 'var(--ink-3)', maxWidth: 600, marginBottom: 32 }}>
            We're launching the blog first. The shop — digital guides, the crop calendar, and eventually courses and seed kits — opens in Phase 2. Join the waitlist below to get early access and launch pricing.
          </p>
          <div className="shop-grid">
            <div className="coming-soon-card"><span>📗</span><h4>Home Hydroponic Setup Guide</h4><p>Complete PDF + video walkthrough. Build an NFT system under ₹5,000.</p></div>
            <div className="coming-soon-card"><span>🌿</span><h4>Indian Crop Calendar</h4><p>Month-by-month planting guide for 40+ crops across Indian climate zones.</p></div>
            <div className="coming-soon-card"><span>🎓</span><h4>Organic Farming Masterclass</h4><p>8-week self-paced course covering everything from soil to sale.</p></div>
            <div className="coming-soon-card"><span>💧</span><h4>Hydroponic Starter Kit</h4><p>Everything you need to build a 20-plant NFT system.</p></div>
          </div>
        </div>
      </section>
      <Newsletter
        id="nl-anchor"
        eyebrow="Product Waitlist"
        heading="Be first to know"
        description="Join our newsletter to get early access to new products, pre-launch discounts, and exclusive member pricing on all courses and physical kits."
        buttonLabel="Join Waitlist"
        note="No spam. Unsubscribe anytime."
        source="shop"
      />
    </div>
  );
}
