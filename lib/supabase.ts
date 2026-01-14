
import { createClient } from '@supabase/supabase-js';

/**
 * No Vite (usado pelo Vercel), variáveis de ambiente devem:
 * 1. Começar com VITE_ (ex: VITE_SUPABASE_URL)
 * 2. Ser acessadas via process.env
 */

// Fix: Using process.env instead of import.meta.env to resolve "Property 'env' does not exist on type 'ImportMeta'"
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️ Supabase: Variáveis VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY não encontradas.");
  console.log("Dica: No painel do Vercel, renomeie as variáveis para incluir o prefixo VITE_");
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder-url.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);
