
import { createClient } from '@supabase/supabase-js';

/**
 * No Vite, as variáveis de ambiente DEVEM:
 * 1. Começar com o prefixo VITE_ (Ex: VITE_SUPABASE_URL)
 * 2. Ser acessadas via import.meta.env.VITE_...
 */

// Usamos uma abordagem segura para evitar erros de compilação
const env = (import.meta as any).env || {};

const supabaseUrl = env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || '';

// Log de diagnóstico para ajudar você no console do navegador
if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'https://placeholder-url.supabase.co') {
  console.warn("⚠️ Supabase: Variáveis não detectadas pelo Vite.");
  console.log("Verifique se no Vercel os nomes começam com VITE_ e se você fez um REDEPLOY.");
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder-url.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);
