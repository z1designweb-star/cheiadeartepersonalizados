
import { createClient } from '@supabase/supabase-js';

// Função auxiliar para obter variáveis de ambiente com segurança no navegador
const getEnv = (key: string): string => {
  try {
    // Tenta acessar process.env (comum em builders como Vite/Webpack/Vercel)
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key] as string;
    }
    // Caso não encontre, retorna string vazia em vez de lançar erro
    return '';
  } catch (e) {
    return '';
  }
};

const supabaseUrl = getEnv('SUPABASE_URL');
const supabaseAnonKey = getEnv('SUPABASE_ANON_KEY');

// Só tenta criar o cliente se as chaves básicas existirem. 
// Caso contrário, exporta um objeto dummy ou null para evitar crash imediato no import.
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder.supabase.co', 'placeholder'); // URL placeholder para não quebrar o import
