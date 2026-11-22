import { notFound } from 'next/navigation';
import { getSettings } from '@/lib/site';
import BlogClient from './BlogClient';

export async function generateMetadata() {
  const s = await getSettings();
  return { title: s.blog_page.seo_title, description: s.blog_page.seo_description, alternates: { canonical: 'https://www.organikgreens.com/blog' } };
}

export default async function BlogPage() {
  const s = await getSettings();
  if (s.pages.blog?.enabled === false) notFound();
  return <BlogClient c={s.blog_page} categories={s.categories.items || []} allLabel={s.categories.all_label} />;
}
