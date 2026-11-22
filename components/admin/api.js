'use client';

import { supabase } from '@/lib/supabase';
import { refreshSite } from '@/app/admin/actions';

const TOKEN_KEY = 'og-admin-token';

export function getToken() {
  try { return window.localStorage.getItem(TOKEN_KEY); } catch { return null; }
}
export function setToken(t) {
  try { if (t) window.localStorage.setItem(TOKEN_KEY, t); else window.localStorage.removeItem(TOKEN_KEY); } catch { /* ignore */ }
}

let onExpired = () => {};
export function setExpiredHandler(fn) { onExpired = fn; }

export async function rpc(name, args = {}) {
  const { data, error } = await supabase.rpc(name, { p_token: getToken(), ...args });
  if (error) {
    if (error.code === '28000' || /session has expired|Not signed in/i.test(error.message)) onExpired();
    throw new Error(error.message);
  }
  return data;
}

export async function login(pass) {
  const { data, error } = await supabase.rpc('admin_login', { p_pass: pass });
  if (error) throw new Error(error.message);
  if (!data) throw new Error('Wrong passcode.');
  setToken(data);
  return data;
}

export async function logout() {
  try { await supabase.rpc('admin_logout', { p_token: getToken() }); } catch { /* ignore */ }
  setToken(null);
}

export async function checkSession() {
  const t = getToken();
  if (!t) return false;
  const { data } = await supabase.rpc('admin_check', { p_token: t });
  return data === true;
}

export async function loadSettingsRows() {
  const { data, error } = await supabase.from('site_settings').select('key,value,updated_at');
  if (error) throw new Error(error.message);
  return data || [];
}

export async function saveSetting(key, value) {
  const ts = await rpc('admin_save_setting', { p_key: key, p_value: value });
  await refresh();
  return ts;
}

export async function resetSetting(key) {
  await rpc('admin_reset_setting', { p_key: key });
  await refresh();
}

export async function refresh() {
  try { await refreshSite(getToken()); } catch { /* the site still refreshes within 5 minutes */ }
}

// ---------- images ----------
async function shrink(file) {
  if (/svg|gif|x-icon/.test(file.type)) return { blob: file, type: file.type };
  const bmp = await createImageBitmap(file).catch(() => null);
  if (!bmp) return { blob: file, type: file.type };
  const max = 2000;
  const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
  if (scale === 1 && file.size < 900_000) return { blob: file, type: file.type };
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bmp.width * scale);
  canvas.height = Math.round(bmp.height * scale);
  canvas.getContext('2d').drawImage(bmp, 0, 0, canvas.width, canvas.height);
  const type = file.type === 'image/png' ? 'image/png' : file.type === 'image/webp' ? 'image/webp' : 'image/jpeg';
  const blob = await new Promise((r) => canvas.toBlob(r, type, 0.88));
  return { blob: blob || file, type: blob ? type : file.type };
}

function toBase64(blob) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(',')[1]);
    r.onerror = reject;
    r.readAsDataURL(blob);
  });
}

export async function uploadImage(file) {
  const { blob, type } = await shrink(file);
  const ext = { 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif', 'image/svg+xml': 'svg', 'image/x-icon': 'ico' }[type] || 'jpg';
  const base = (file.name || 'image').replace(/\.[^.]+$/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 50) || 'image';
  const path = `site/${new Date().toISOString().slice(0, 10)}/${base}-${Math.random().toString(36).slice(2, 7)}.${ext}`;
  const id = await rpc('admin_stage_image', { p_path: path, p_type: type, p_b64: await toBase64(blob) });
  const fnUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/store-images`;
  for (let i = 0; i < 12; i++) {
    try { await fetch(fnUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' }); } catch { /* retry */ }
    const rows = await rpc('admin_image_status', { p_id: id });
    const row = Array.isArray(rows) ? rows[0] : rows;
    if (row?.status === 'done' && row.public_url) return row.public_url;
    if (row?.status === 'error') throw new Error(row.error || 'Upload failed');
    await new Promise((r) => setTimeout(r, 1200));
  }
  throw new Error('Upload is taking too long. Please try again.');
}

// IST helpers for date-time inputs
export function isoToIstInput(iso) {
  if (!iso) return '';
  const d = new Date(new Date(iso).getTime() + 330 * 60000);
  return d.toISOString().slice(0, 16);
}
export function istInputToIso(v) {
  if (!v) return null;
  return new Date(`${v}:00+05:30`).toISOString();
}
export function fmtIst(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export const uid = (p = 'x') => `${p}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
export const clone = (v) => JSON.parse(JSON.stringify(v ?? null));
