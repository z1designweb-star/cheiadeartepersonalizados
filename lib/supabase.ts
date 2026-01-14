
import { createClient } from '@supabase/supabase-js';

/**
 * ATENÇÃO: Em projetos sem build (ESM direto no browser), 
 * o Vercel nem sempre injeta process.env no lado do cliente automaticamente.
 * 
 * Se o erro "Failed to fetch" persistir, verifique se as variáveis 
 * SUPABASE_URL e SUPABASE_ANON_KEY estão acessíveis no console do navegador.
 */

// Acesso direto às variáveis injetadas pelo ambiente
const supabaseUrl = (typeof process !== 'undefined' && process.env?.SUPABASE_URL) || '';
const supabaseAnonKey = (typeof process !== 'undefined' && process.env?.SUPABASE_ANON_KEY) || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️ Supabase: Variáveis de ambiente não encontradas. Verifique as configurações no Vercel.");
}

export const supabase = createClient(
  supabaseUrl || 'https://sua-url-aqui.supabase.co', 
  supabaseAnonKey || 'sua-chave-aqui'
);
