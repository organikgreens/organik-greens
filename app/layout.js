import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { getSettings } from "@/lib/site";
import { DEFAULTS } from "@/lib/defaults";

export async function generateMetadata() {
  const s = await getSettings();
  const icon = s.brand.favicon_url || undefined;
  return {
    metadataBase: new URL('https://www.organikgreens.com'),
    title: s.seo.title,
    description: s.seo.description,
    openGraph: s.seo.og_image ? { images: [{ url: s.seo.og_image }] } : undefined,
    icons: icon ? { icon } : undefined,
    verification: s.seo.google_verification ? { google: s.seo.google_verification } : undefined,
  };
}

const cssSafe = (v) => String(v || '').replace(/[<>{};]/g, '');

function themeCss(theme) {
  const def = DEFAULTS.theme;
  const vars = Object.entries(theme.colors || {})
    .filter(([k, v]) => v && v !== def.colors[k])
    .map(([k, v]) => `--${k}:${cssSafe(v)}`);
  if (Number(theme.radius) && Number(theme.radius) !== def.radius) {
    vars.push(`--r:${Number(theme.radius)}px`, `--r-sm:${Math.round(Number(theme.radius) / 2)}px`);
  }
  let css = vars.length ? `:root{${vars.join(';')}}` : '';
  if (theme.heading_font && theme.heading_font !== def.heading_font) {
    css += `h1,h2,h3,h4,h5,.serif,.section-title,.pillar h3,.hero-card-main h4,.value-card h4,.proof-text,.promo-banner h4{font-family:'${cssSafe(theme.heading_font)}',serif !important}`;
  }
  if (theme.body_font && theme.body_font !== def.body_font) {
    css += `body,button,input,textarea,select{font-family:'${cssSafe(theme.body_font)}',sans-serif !important}`;
  }
  return css;
}

function fontHref(theme) {
  const fams = new Set(['DM+Serif+Display:ital@0;1', 'Inter:wght@300;400;500;600']);
  for (const f of [theme.heading_font, theme.body_font]) {
    if (f && f !== 'DM Serif Display' && f !== 'Inter') fams.add(`${encodeURIComponent(f).replace(/%20/g, '+')}:wght@400;600;700`);
  }
  return `https://fonts.googleapis.com/css2?${[...fams].map((f) => `family=${f}`).join('&')}&display=swap`;
}

export default async function RootLayout({ children }) {
  const s = await getSettings();
  const css = themeCss(s.theme);
  const custom = String(s.theme.custom_css || '').replace(/<\/style/gi, '');
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href={fontHref(s.theme)} rel="stylesheet" />
        {css ? <style dangerouslySetInnerHTML={{ __html: css }} /> : null}
        {custom ? <style dangerouslySetInnerHTML={{ __html: custom }} /> : null}
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
