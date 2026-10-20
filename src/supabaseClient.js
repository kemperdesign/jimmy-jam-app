import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://tkjyejioryexljcdqrmo.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'sb_publishable_eR45P7lZUubXiMs_TObmWw_yAMC3ryB';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
