// Default content for every editable part of the website.
// The admin dashboard (/admin) saves changes to Supabase (table site_settings, one row per key below).
// Whatever is saved there replaces these defaults; anything not saved falls back to what is written here.
//
// Text fields understand a little formatting:  *italic accent*   **bold**   [link text](/url)   and line breaks.

export const DEFAULTS = {
  brand: {
    site_name: 'Organik Greens',
    logo_url: '/logo.jpg',
    logo_alt: 'Organik Greens',
    logo_height: 36,
    footer_logo_url: '',
    footer_logo_height: 36,
    favicon_url: '',
  },

  theme: {
    colors: {
      ink: '#0d1a0f', 'ink-2': '#2d3a2f', 'ink-3': '#5a6b5c', 'ink-4': '#8a9b8c',
      rule: '#e2e8e3', surface: '#f9faf8', white: '#ffffff',
      'g-dark': '#0e3d1e', 'g-mid': '#1a5c33', 'g-base': '#2d7a4a', 'g-light': '#d4e8d8', 'g-pale': '#edf5ee', 'g-faint': '#f4f8f4',
      lime: '#5a8a3c', 'lime-bg': '#eef5e8', amber: '#92600a', 'amber-bg': '#fdf4e3',
    },
    heading_font: 'DM Serif Display',
    body_font: 'Inter',
    radius: 20,
    custom_css: '',
  },

  seo: {
    title: "Organik Greens — India's Guide to Organic Farming & Sustainable Living",
    description: 'Expert guides on organic farming, urban gardening, hydroponics, and sustainable agriculture for India. Practical, honest, research-backed content.',
    og_image: '',
    google_verification: '',
  },

  pages: {
    blog: { enabled: true, label: 'Blog' },
    shop: { enabled: true, label: 'Shop' },
    about: { enabled: true, label: 'About' },
    contact: { enabled: true, label: 'Contact' },
  },

  nav: {
    items: [
      { id: 'n-home', label: 'Home', href: '/', enabled: true, new_tab: false },
      { id: 'n-blog', label: 'Blog', href: '/blog', enabled: true, new_tab: false },
      { id: 'n-shop', label: 'Shop', href: '/shop', enabled: true, new_tab: false },
      { id: 'n-about', label: 'About', href: '/about', enabled: true, new_tab: false },
      { id: 'n-contact', label: 'Contact', href: '/contact', enabled: true, new_tab: false },
    ],
    cta: { enabled: true, label: 'Start Reading', href: '/blog' },
    height: 64,
    transparent: false,
  },

  categories: {
    items: [
      { id: 'c1', slug: 'organic-farming', label: 'Organic Farming' },
      { id: 'c2', slug: 'urban-farming', label: 'Urban Farming' },
      { id: 'c3', slug: 'hydroponics', label: 'Hydroponics' },
      { id: 'c4', slug: 'soil-seeds', label: 'Soil & Seeds' },
      { id: 'c5', slug: 'health-food', label: 'Health & Food' },
      { id: 'c6', slug: 'agri-business', label: 'Agri Business' },
    ],
    all_label: 'All Topics',
  },

  home_layout: {
    sections: [
      { id: 'hero', type: 'hero', enabled: true, label: 'Hero (top banner)' },
      { id: 'promo-home-1', type: 'promo', enabled: true, label: 'Promotion slot: Home 1', slot: 'home_1' },
      { id: 'ticker', type: 'ticker', enabled: true, label: 'Scrolling topics strip' },
      { id: 'pillars', type: 'pillars', enabled: true, label: 'Six pillars' },
      { id: 'latest', type: 'latest', enabled: true, label: 'Featured / latest articles' },
      { id: 'promo-home-2', type: 'promo', enabled: true, label: 'Promotion slot: Home 2', slot: 'home_2' },
      { id: 'philosophy', type: 'philosophy', enabled: true, label: 'Our Philosophy' },
      { id: 'testimonials', type: 'testimonials', enabled: true, label: 'What Our Readers Say' },
      { id: 'store', type: 'store', enabled: true, label: 'Organik Greens Store' },
      { id: 'ask', type: 'ask', enabled: true, label: 'Ask a question form' },
      { id: 'promo-home-3', type: 'promo', enabled: true, label: 'Promotion slot: Home 3', slot: 'home_3' },
      { id: 'cta', type: 'cta', enabled: true, label: 'Closing banner' },
    ],
  },

  hero: {
    eyebrow: "India's Organic Farming Guide",
    title: 'Grow what\nyou *eat.* Eat what\nyou *trust.*',
    lead: 'Expert guides on organic farming, urban gardening, hydroponics, and sustainable living — written for India, by people who care about the soil beneath your feet.',
    buttons: [
      { id: 'hb1', label: 'Explore Articles →', href: '/blog', style: 'dark', enabled: true },
      { id: 'hb2', label: 'Ask a Question', href: '#ask', style: 'outline', enabled: true },
    ],
    stats_enabled: true,
    stats: [
      { id: 'hs1', value: '24+', label: 'Articles' },
      { id: 'hs2', value: '6', label: 'Topics' },
      { id: 'hs3', value: '1K+', label: 'Readers / month' },
    ],
    featured: {
      enabled: true,
      mode: 'custom', // 'custom' = use the text below; 'post' = pull title & summary from the article chosen in post_slug
      post_slug: 'organic-guide',
      chip: '🌱 Featured Guide',
      title: 'Complete Guide to Organic Farming in India (2025)',
      text: 'Soil preparation, seed selection, natural pest control, and PGS-India certification — all in one place.',
      button_label: 'Read Article →',
      href: '/blog/organic-guide',
      image_url: '',
    },
    small_cards_enabled: true,
    small_cards: [
      { id: 'sc1', chip: 'Trending', chip_style: 'green', title: 'Terrace Garden', sub: 'Urban Farming', icon: '🏙️', href: '', enabled: true },
      { id: 'sc2', chip: 'NEW', chip_style: 'amber', title: 'NFT Hydroponics', sub: 'under ₹5,000', icon: '💧', href: '', enabled: true },
    ],
    background: '',
    background_image: '',
    text_align: 'left',
  },

  ticker: {
    items: ['Organic Farming', 'Urban Gardening', 'Hydroponics', 'Soil Science', 'Healthy Food', 'Agri-Business', 'Sustainability'],
    speed_seconds: 30,
    background: '',
  },

  pillars: {
    eyebrow: 'What We Cover',
    title: 'Six pillars of *sustainable* knowledge',
    subtitle: 'Every article on Organik Greens maps to one of these themes — ensuring depth, authority, and practical use for every reader.',
    header_align: 'left',
    columns: 3,
    layout: 'joined', // 'joined' (one grid with hairlines) | 'cards' (separate cards with gaps)
    media: 'icon', // 'icon' | 'image' | 'both' | 'none'
    image_height: 140,
    icon_size: 1.6,
    text_align: 'left',
    padding: 'normal', // compact | normal | roomy
    indent: 0, // extra left indent for the card text, in pixels
    background: '',
    card_background: '',
    show_link: true,
    items: [
      { id: 'p1', enabled: true, icon: '🌾', image_url: '', title: 'Organic Farming', desc: 'Natural cultivation, composting, pest control, and PGS-India certification for Indian conditions.', href: '/blog?category=organic-farming', link_label: 'Explore' },
      { id: 'p2', enabled: true, icon: '🏙️', image_url: '', title: 'Urban Farming', desc: 'Terrace gardens, balcony containers, vertical farms, and kitchen gardens for city dwellers.', href: '/blog?category=urban-farming', link_label: 'Explore' },
      { id: 'p3', enabled: true, icon: '💧', image_url: '', title: 'Hydroponics', desc: 'NFT, DWC, and aeroponics — complete setup guides with real Indian cost breakdowns.', href: '/blog?category=hydroponics', link_label: 'Explore' },
      { id: 'p4', enabled: true, icon: '🌱', image_url: '', title: 'Soil, Seeds & Inputs', desc: 'Soil science, pH management, heirloom seeds, composting, and honest input reviews.', href: '/blog?category=soil-seeds', link_label: 'Explore' },
      { id: 'p5', enabled: true, icon: '🥗', image_url: '', title: 'Health, Food & Life', desc: 'Nutrition in organic produce, garden-to-table recipes, and sustainable food systems.', href: '/blog?category=health-food', link_label: 'Explore' },
      { id: 'p6', enabled: true, icon: '📈', image_url: '', title: 'Agri-Business & Policy', desc: 'Govt schemes, APMC reforms, organic export, farm-to-fork models, and agritech.', href: '/blog?category=agri-business', link_label: 'Explore' },
    ],
  },

  latest: {
    eyebrow: 'Latest Articles',
    title: 'From the *garden*',
    button_label: 'View all articles →',
    button_href: '/blog',
    mode: 'latest', // 'latest' = newest first; 'manual' = exactly the articles picked in featured_slugs, in that order
    featured_slugs: [],
    fill_with_latest: true,
    count: 6,
    layout: 'magazine', // 'magazine' (1 large + 2 side + row) | 'grid'
    show_excerpt: true,
    author_label: 'Organik Greens',
    background: '',
  },

  philosophy: {
    eyebrow: 'Our Philosophy',
    title: 'Knowledge that *actually helps* you grow',
    subtitle: 'We are not a generic farming portal. Every article is written with a real Indian grower in mind — practical, honest, and grounded.',
    header_align: 'center',
    columns: 2,
    show_numbers: true,
    text_align: 'left',
    background: '',
    card_background: '',
    items: [
      { id: 'v1', enabled: true, num: '01', icon: '', title: 'India-First Content', text: "Written for Indian soil, climate, crops, government schemes, and market realities — not translated from foreign sources that don't fit our context." },
      { id: 'v2', enabled: true, num: '02', icon: '', title: 'Research-Backed & Honest', text: 'Every claim is sourced. Every product recommendation is genuine. No paid puff pieces disguised as editorial. Affiliate disclosures are always clear.' },
      { id: 'v3', enabled: true, num: '03', icon: '', title: 'Beginner to Advanced', text: "Whether you're growing coriander on a windowsill or planning a 2-acre organic farm — there's something practical here for you at every stage." },
      { id: 'v4', enabled: true, num: '04', icon: '', title: 'Community-Driven', text: 'A real community of growers on WhatsApp and social media, sharing what actually works in their gardens and fields across India.' },
    ],
  },

  testimonials: {
    eyebrow: 'What Our Readers Say',
    title: 'Trusted by growers *across India*',
    columns: 3,
    show_stars: true,
    background: '',
    text_color: '',
    items: [
      { id: 't1', enabled: true, stars: 5, name: 'Priya Sharma', role: 'Terrace Gardener, Gurgaon', photo_url: '', text: "I started my terrace garden after reading the Organik Greens guide. Six months later I'm harvesting tomatoes, spinach, and methi every week. The instructions are so practical and India-specific — nothing generic." },
      { id: 't2', enabled: true, stars: 5, name: 'Arjun Mehta', role: 'Home Hydroponics, Delhi NCR', photo_url: '', text: "The NFT hydroponics guide saved me from making expensive mistakes. I set up my first system for under ₹4,500 and it's been running for 3 months. The cost breakdown was exactly right for Delhi." },
      { id: 't3', enabled: true, stars: 5, name: 'Ramesh Singh', role: 'Organic Farmer, Haryana', photo_url: '', text: "As a small organic farmer in Haryana, the PKVY scheme article was a revelation. I applied and got approval for ₹50,000 in support that I didn't even know existed. Organik Greens literally changed my income." },
    ],
  },

  store: {
    follow_shop_page: true, // hide this section automatically when the Shop page is switched off
    eyebrow: 'Organik Greens Store',
    title: 'Products & Courses — Coming Soon',
    text: 'We are building a curated shop of organic seeds, hydroponic kits, digital guides, and online courses. Everything hand-picked and India-tested.',
    button_label: 'Browse Store →',
    button_href: '/shop',
    show_banner: true,
    show_items: true,
    banner_background: '',
    items: [
      { id: 's1', enabled: true, kind: 'product', icon: '📗', image_url: '', badge: 'Digital', name: 'Home Hydroponic Setup Guide', desc: 'Step-by-step PDF + video guide. Build your first NFT system for under ₹5,000.', price: '₹299', href: '/shop' },
      { id: 's2', enabled: true, kind: 'product', icon: '🌿', image_url: '', badge: 'Digital', name: 'Indian Crop Calendar 2025', desc: 'Month-by-month planting guide for 40+ crops across Indian climate zones. PDF format.', price: '₹99', href: '/shop' },
      { id: 's3', enabled: true, kind: 'coming_soon', icon: '🎓', image_url: '', badge: '', name: 'Online Course', desc: 'Organic Farming Masterclass — launching Month 6. [Join the waitlist →](#ask)', price: '', href: '' },
      { id: 's4', enabled: true, kind: 'coming_soon', icon: '🛒', image_url: '', badge: '', name: 'Organic Seed Kits', desc: 'Curated seed bundles for terraces, kitchens, and balconies — coming soon.', price: '', href: '' },
    ],
  },

  ask: {
    eyebrow: 'Ask Organik Greens',
    heading: 'Stuck with a plant problem? Ask us.',
    intro: 'Send your question, a suggestion or a topic you want us to cover. We reply by email or WhatsApp within 48 hours.',
  },

  cta: {
    eyebrow: 'Questions welcome',
    heading: 'Have a question about your garden?',
    text: 'Tell us what you are growing and what you are seeing. We read every message and reply by email or WhatsApp within 48 hours.',
    buttons: [
      { id: 'cb1', label: 'Ask a question →', href: '#ask', style: 'white', enabled: true },
      { id: 'cb2', label: 'Contact us', href: '/contact', style: 'ghost', enabled: true },
    ],
    background: '',
  },

  footer: {
    show_logo: true,
    description: "India's trusted guide to organic farming, urban gardening, hydroponics, and sustainable living. Practical knowledge for every grower.",
    socials: [
      { id: 'so1', label: 'Instagram', icon: '📸', url: '', enabled: true },
      { id: 'so2', label: 'YouTube', icon: '▶', url: '', enabled: true },
      { id: 'so3', label: 'Pinterest', icon: 'P', url: '', enabled: true },
      { id: 'so4', label: 'WhatsApp', icon: '💬', url: 'https://wa.me/919311053111', enabled: true },
    ],
    columns: [
      { id: 'fc1', title: 'Topics', source: 'categories', enabled: true, links: [] },
      { id: 'fc2', title: 'Navigation', source: 'custom', enabled: true, links: [
        { id: 'fl1', label: 'Home', href: '/' },
        { id: 'fl2', label: 'Blog', href: '/blog' },
        { id: 'fl3', label: 'Shop', href: '/shop' },
        { id: 'fl4', label: 'About Us', href: '/about' },
        { id: 'fl5', label: 'Contact', href: '/contact' },
      ] },
      { id: 'fc3', title: 'Legal', source: 'custom', enabled: true, links: [
        { id: 'fl6', label: 'Privacy Policy', href: '' },
        { id: 'fl7', label: 'Terms & Conditions', href: '' },
        { id: 'fl8', label: 'Affiliate Disclosure', href: '' },
        { id: 'fl9', label: 'Cookie Policy', href: '' },
      ] },
    ],
    contact: { enabled: true, title: 'Contact', email: 'deals.rajat@gmail.com', phone: '+91 93110 53111' },
    copyright: '© {year} Organik Greens. All rights reserved. organikgreens.com',
    tagline: 'Made with 🌱 in India',
    background: '',
    text_color: '',
  },

  blog_page: {
    seo_title: 'Blog — Organik Greens',
    seo_description: 'Practical, honest, India-first knowledge on organic farming, urban growing, hydroponics, and more.',
    eyebrow: 'All Articles',
    title: 'The Organik Greens *Blog*',
    subtitle: 'Practical, honest, India-first knowledge on organic farming, urban growing, hydroponics, and more.',
    show_filters: true,
    pinned_slugs: [],
    empty_text: 'No articles published yet in this category — check back soon.',
    author_label: 'Organik Greens',
  },

  article: {
    show_summary: true,
    summary_label: 'Summary',
    author_label: 'Organik Greens',
    back_label: '← Back to Blog',
    show_year: true,
    show_ask_box: true,
  },

  shop_page: {
    seo_title: 'Shop — Organik Greens',
    seo_description: 'Curated digital products, guides, and upcoming courses — everything India-tested and honestly recommended.',
    eyebrow: 'Organik Greens Store',
    title: 'Products & *Courses*',
    subtitle: 'Curated digital products, guides, and upcoming courses — everything India-tested and honestly recommended.',
    notice_title: 'Coming Soon — Products, Courses & Physical Kits',
    notice_text: "We're launching the blog first. The shop — digital guides, the crop calendar, and eventually courses and seed kits — opens in Phase 2. Join the waitlist below to get early access and launch pricing.",
    items: [
      { id: 'sp1', enabled: true, kind: 'coming_soon', icon: '📗', image_url: '', badge: '', name: 'Home Hydroponic Setup Guide', desc: 'Complete PDF + video walkthrough. Build an NFT system under ₹5,000.', price: '', href: '' },
      { id: 'sp2', enabled: true, kind: 'coming_soon', icon: '🌿', image_url: '', badge: '', name: 'Indian Crop Calendar', desc: 'Month-by-month planting guide for 40+ crops across Indian climate zones.', price: '', href: '' },
      { id: 'sp3', enabled: true, kind: 'coming_soon', icon: '🎓', image_url: '', badge: '', name: 'Organic Farming Masterclass', desc: '8-week self-paced course covering everything from soil to sale.', price: '', href: '' },
      { id: 'sp4', enabled: true, kind: 'coming_soon', icon: '💧', image_url: '', badge: '', name: 'Hydroponic Starter Kit', desc: 'Everything you need to build a 20-plant NFT system.', price: '', href: '' },
    ],
    ask_enabled: true,
    ask_eyebrow: 'Interested in a product?',
    ask_heading: 'Tell us what you would like',
    ask_intro: 'Products are coming soon. Tell us which one you want, or ask us anything, and we will reply by email or WhatsApp.',
    ask_placeholder: 'For example: I would like the hydroponic starter kit for my balcony in Bengaluru. When will it be available?',
  },

  about: {
    seo_title: 'About — Organik Greens',
    seo_description: "The story behind Organik Greens — why it was built, what it stands for, and why we believe organic farming is India's most important future.",
    eyebrow: 'Our Story',
    title: 'Growing awareness.\n*Cultivating change.*',
    lead: "The story behind Organik Greens — why it was built, what it stands for, and why we believe organic farming is India's most important future.",
    button_label: 'Work With Us →',
    button_href: '/contact',
    hero_icon: '🌿',
    hero_image: '',
    badge_value: '100%',
    badge_label: 'Organic Focus',
    quote: '"Organic farming is not a trend. It is India\'s oldest tradition — and its most important future."',
    why_title: 'Why Organik Greens exists',
    why_text: "India has over 140 million farmers. Millions more city dwellers long to grow their own food on terraces, balconies, and kitchen windowsills. Yet the practical, honest, India-specific knowledge they need is buried behind jargon, outdated government pamphlets, or generic Western advice that doesn't understand our soil, our crops, or our climate.\n\nOrganik Greens was built to change that. To be the resource that a progressive farmer in Punjab, an urban home-grower in Hyderabad, and a curious student in Delhi can all rely on — equally, practically, honestly.",
    vm_title: 'Vision & Mission',
    vision: "To be India's most trusted digital destination for organic and sustainable agriculture — inspiring a generation of growers to reconnect with the earth.",
    mission: 'To educate, inspire, and guide individuals and farming communities so that every person can grow, eat, and live more sustainably.',
    timeline_enabled: true,
    timeline_title: 'The journey so far',
    timeline: [
      { id: 'tl1', enabled: true, when: '2025 — Month 1', title: 'Launch', text: 'Organik Greens goes live with our first articles on organic farming and urban gardening in India.' },
      { id: 'tl2', enabled: true, when: '2025 — Month 3', title: 'First Digital Products', text: 'The Hydroponic Setup Guide and Crop Calendar launch — our first step toward a full product ecosystem.' },
      { id: 'tl3', enabled: true, when: '2025 — Month 6', title: 'Community & Courses', text: 'First online course launch, an active community of readers writing in with questions, and growing towards 50,000 monthly readers.' },
      { id: 'tl4', enabled: true, when: '2026 — Year 2', title: 'Full Ecosystem', text: 'Physical product lines, consulting services, partnerships with organic farms and agritech companies across India.' },
    ],
    values_title: 'What we stand for',
    values: [
      { id: 'av1', enabled: true, icon: '🌱', title: 'Integrity', text: 'Every claim is sourced. Every recommendation is genuine. Sponsorships are clearly disclosed — always.' },
      { id: 'av2', enabled: true, icon: '🌍', title: 'Accessibility', text: 'Knowledge about sustainable agriculture belongs to everyone — from a farmer in Bihar to a startup grower in Bangalore.' },
      { id: 'av3', enabled: true, icon: '♻️', title: 'Sustainability', text: 'We practice what we preach. The brands we partner with, the products we recommend — sustainability is a filter, not a tagline.' },
      { id: 'av4', enabled: true, icon: '👥', title: 'Community First', text: 'Our readers are not an audience to sell to. They are a community to serve, celebrate, and learn from every single day.' },
    ],
    featured_enabled: true,
    featured_label: 'As featured in',
    featured_logos: [
      { id: 'fl1', name: 'Krishi Jagran', image_url: '', href: '' },
      { id: 'fl2', name: 'Down To Earth', image_url: '', href: '' },
      { id: 'fl3', name: 'The Hindu AgriTech', image_url: '', href: '' },
      { id: 'fl4', name: "Farmer's Weekly", image_url: '', href: '' },
      { id: 'fl5', name: 'AgriBusiness Global', image_url: '', href: '' },
    ],
    ask_enabled: true,
    ask_eyebrow: 'Stay in touch',
    ask_heading: 'Write to us',
    ask_intro: 'Questions, suggestions, a topic you want covered or a correction: we read every message and reply by email or WhatsApp within 48 hours.',
  },

  contact: {
    seo_title: 'Contact — Organik Greens',
    seo_description: 'Questions, collaborations, advertising or consulting — get in touch with Organik Greens by email or WhatsApp.',
    eyebrow: 'Get in Touch',
    title: "Let's grow\nsomething *together.*",
    lead: "Whether you have a question about an article, want to collaborate, advertise, or just share what you're growing — we'd love to hear from you.",
    methods: [
      { id: 'cm1', enabled: true, icon: '✉️', label: 'Email', value: 'deals.rajat@gmail.com', sub: 'Response within 24–48 hours', button_label: '', button_href: '' },
      { id: 'cm2', enabled: true, icon: '📞', label: 'Phone & WhatsApp', value: '+91 93110 53111', sub: 'Mon–Sat, 10am–6pm IST', button_label: 'Chat on WhatsApp', button_href: 'https://wa.me/919311053111' },
      { id: 'cm3', enabled: true, icon: '📍', label: 'Location', value: 'Delhi NCR, India', sub: 'Home office — virtual meetings available', button_label: '', button_href: '' },
    ],
    follow_enabled: true,
    follow_title: 'Follow Us',
    follow_links: [
      { id: 'fo1', label: '📸 Instagram', href: '' },
      { id: 'fo2', label: '▶️ YouTube', href: '' },
      { id: 'fo3', label: '📌 Pinterest', href: '' },
    ],
    form_title: 'Send us a message',
    form_intro: 'Fill in the form and we will get back to you within 24–48 hours, on email or WhatsApp, whichever you choose.',
    form_placeholder: 'Tell us about your question, project or idea. The more detail, the better.',
    form_kinds: [
      { id: 'k1', value: 'question', label: 'General enquiry or question' },
      { id: 'k2', value: 'suggestion', label: 'Suggestion or feedback' },
      { id: 'k3', value: 'topic', label: 'A topic you should cover' },
      { id: 'k4', value: 'collaboration', label: 'Content collaboration' },
      { id: 'k5', value: 'consulting', label: 'Consulting request' },
      { id: 'k6', value: 'advertising', label: 'Advertising or sponsorship' },
      { id: 'k7', value: 'product', label: 'Product or course enquiry' },
      { id: 'k8', value: 'press', label: 'Press or media' },
      { id: 'k9', value: 'internship', label: 'Internship' },
      { id: 'k10', value: 'other', label: 'Other' },
    ],
    faq_enabled: true,
    faq_eyebrow: 'FAQ',
    faq_title: 'Common questions',
    faqs: [
      { id: 'q1', enabled: true, q: 'How quickly do you reply to messages?', a: 'We aim to reply to all emails within 24–48 hours on working days. For urgent matters, WhatsApp is the fastest way to reach us — we typically respond within a few hours.' },
      { id: 'q2', enabled: true, q: 'Do you accept guest articles or expert contributions?', a: 'Yes! We welcome contributions from agronomists, organic farmers, nutritionists, and agritech professionals. Please use the contact form with "Content Collaboration" selected, and share a brief outline of your proposed article.' },
      { id: 'q3', enabled: true, q: 'Can you help me set up an organic farm or urban garden?', a: "We offer consulting sessions for farms, urban gardens, schools, and corporate green spaces. Select \"Consulting Request\" in the contact form and share your location and project scope — we'll get back to you with details and pricing." },
      { id: 'q4', enabled: true, q: 'How can brands advertise or collaborate with Organik Greens?', a: 'We work with organic brands, agritech companies, and sustainable food businesses on sponsored articles, social media collaborations, and product reviews. We maintain a strict editorial policy — all sponsorships are clearly disclosed. Use the form to get a media kit.' },
      { id: 'q5', enabled: true, q: 'Are the digital products available for immediate download?', a: "Yes — all digital products (PDF guides, crop calendars) are available for instant download after purchase. Our secure payment and delivery system is powered by Razorpay. If you have any issues with a download, email us and we'll resolve it immediately." },
    ],
  },

  custom_pages: {
    pages: [],
  },
};

export const SETTING_KEYS = Object.keys(DEFAULTS);

// Paths that belong to switchable pages.
export const PAGE_PATHS = { blog: '/blog', shop: '/shop', about: '/about', contact: '/contact' };
