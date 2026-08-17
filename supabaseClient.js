const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('WARNING: Supabase credentials are not set in .env');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
