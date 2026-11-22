// Places on the website where a promotion can appear. Used by the site and by the dashboard.
export const PROMO_SLOTS = [
  { id: 'sitewide_top', label: 'Announcement bar under the menu (every page)', formats: ['top_bar'] },
  { id: 'popup', label: 'Pop-up (every page)', formats: ['popup'] },
  { id: 'above_footer', label: 'Above the footer (every page)', formats: ['banner', 'card', 'inline'] },
  { id: 'home_1', label: 'Home page — after the hero', formats: ['banner', 'card', 'inline'] },
  { id: 'home_2', label: 'Home page — after the articles', formats: ['banner', 'card', 'inline'] },
  { id: 'home_3', label: 'Home page — before the closing banner', formats: ['banner', 'card', 'inline'] },
  { id: 'blog_top', label: 'Blog page — above the article list', formats: ['banner', 'card', 'inline'] },
  { id: 'blog_bottom', label: 'Blog page — below the article list', formats: ['banner', 'card', 'inline'] },
  { id: 'article_top', label: 'Every article — above the text', formats: ['banner', 'card', 'inline'] },
  { id: 'article_bottom', label: 'Every article — after the text', formats: ['banner', 'card', 'inline'] },
  { id: 'shop_top', label: 'Shop page — top', formats: ['banner', 'card', 'inline'] },
  { id: 'about_bottom', label: 'About page — bottom', formats: ['banner', 'card', 'inline'] },
  { id: 'contact_top', label: 'Contact page — above the FAQ', formats: ['banner', 'card', 'inline'] },
];

export const PROMO_FORMATS = [
  ['top_bar', 'Announcement bar (thin strip)'],
  ['banner', 'Banner (wide, image + text)'],
  ['card', 'Card (compact box)'],
  ['inline', 'Text mention (light strip)'],
  ['popup', 'Pop-up window'],
];

export const PROMO_FREQUENCIES = [
  ['always', 'Every page view'],
  ['once_per_session', 'Once per visit (until the browser is closed)'],
  ['once_per_day', 'Once per day per visitor'],
  ['n_per_day', 'Up to N times per day per visitor'],
  ['every_n_views', 'Every Nth page view'],
];
