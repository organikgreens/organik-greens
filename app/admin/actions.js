'use server';

import { revalidatePath, updateTag } from 'next/cache';
import { SITE_TAG, POSTS_TAG } from '@/lib/site';

// Called by the dashboard after every save: checks the admin session, then refreshes every page right away.
export async function refreshSite(token) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  try {
    const res = await fetch(`${url}/rest/v1/rpc/admin_check`, {
      method: 'POST',
      headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ p_token: token }),
      cache: 'no-store',
    });
    const ok = res.ok && (await res.json()) === true;
    if (!ok) return { ok: false };
  } catch {
    return { ok: false };
  }
  updateTag(SITE_TAG);
  updateTag(POSTS_TAG);
  revalidatePath('/', 'layout');
  return { ok: true };
}
