
import { createClient } from '@supabase/supabase-js';

// No ambiente do desenvolvedor, estas variáveis estarão disponíveis em process.env
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
