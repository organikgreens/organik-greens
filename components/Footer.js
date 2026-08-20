import Link from 'next/link';

const TOPICS = [
  ['organic-farming', 'Organic Farming'],
  ['urban-farming', 'Urban Farming'],
  ['hydroponics', 'Hydroponics'],
  ['soil-seeds', 'Soil & Seeds'],
  ['health-food', 'Health & Food'],
  ['agri-business', 'Agri Business'],
];

export default function Footer() {
  return (
    <footer id="main-footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <img src="/logo.jpg" alt="Organik Greens" />
            <p>India's trusted guide to organic farming, urban gardening, hydroponics, and sustainable living. Practical knowledge for every grower.</p>
            <div className="footer-socials">
              <div className="fsoc" title="Instagram">📸</div>
              <div className="fsoc" title="YouTube">▶</div>
              <div className="fsoc" title="Pinterest">P</div>
              <a href="https://wa.me/919311053111" className="fsoc" title="WhatsApp" target="_blank" rel="noreferrer">💬</a>
            </div>
          </div>
          <div className="footer-col">
            <h5>Topics</h5>
            {TOPICS.map(([slug, label]) => (
              <Link key={slug} href={`/blog?category=${slug}`}>{label}</Link>
            ))}
          </div>
          <div className="footer-col">
            <h5>Navigation</h5>
            <Link href="/">Home</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/shop">Shop</Link>
            <Link href="/about">About Us</Link>
            <Link href="/contact">Contact</Link>
          </div>
          <div className="footer-col">
            <h5>Legal</h5>
            <a>Privacy Policy</a>
            <a>Terms & Conditions</a>
            <a>Affiliate Disclosure</a>
            <a>Cookie Policy</a>
            <h5 style={{ marginTop: 20 }}>Contact</h5>
            <a href="mailto:deals.rajat@gmail.com" style={{ fontSize: '.78rem' }}>deals.rajat@gmail.com</a>
            <a href="tel:+919311053111" style={{ fontSize: '.78rem' }}>+91 93110 53111</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 Organik Greens. All rights reserved. organikgreens.com</p>
          <p>Made with 🌱 in India</p>
        </div>
      </div>
    </footer>
  );
}
