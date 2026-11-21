// Search engines may crawl everything except private draft previews.
export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/preview/'] },
    sitemap: 'https://www.organikgreens.com/sitemap.xml',
    host: 'https://www.organikgreens.com',
  };
}
