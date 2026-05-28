import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://hauyteunyskthkirvsxa.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_cFyNaoVX8122N-bjvnoJIw_uiX8D9t2';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Admin credentials (SHA256 hashed)
export const ADMIN_LOGIN = 'admin';
export const ADMIN_PASSWORD_HASH = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9'; // admin123 SHA256

export async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
