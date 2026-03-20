import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    console.log('Checking master_config...');
    const { data: masterData, error: masterError } = await supabase.from('master_config').select('*');
    console.log('Master config:', masterError ? masterError.message : masterData);

    console.log('Checking hospitals...');
    const { data: hospData, error: hospError } = await supabase.from('hospitals').select('*');
    console.log('Hospitals:', hospError ? hospError.message : hospData);
}

check().catch(console.error);
