// Search engines may crawl everything except private draft previews and the admin dashboard.
export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/preview/', '/admin'] },
    sitemap: 'https://www.organikgreens.com/sitemap.xml',
    host: 'https://www.organikgreens.com',
  };
}
