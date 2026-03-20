import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing env variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAllTables() {
    const tables = [
        'master_config',
        'hospitals',
        'call_logs',
        'message_templates',
        'patient_registrations',
        'skb_call_history'
    ];

    console.log('--- Supabase Backend Check ---');
    console.log(`URL: ${supabaseUrl}`);
    console.log(`Key Prefix: ${supabaseKey.substring(0, 15)}...`);
    console.log('------------------------------');

    let allGood = true;

    for (const table of tables) {
        const { data, error } = await supabase.from(table).select('*').limit(1);

        if (error) {
            console.error(`❌ Table '${table}' Error:`, error.message);
            allGood = false;
        } else {
            console.log(`✅ Table '${table}' OK (Rows found/empty: ${data.length})`);
        }
    }

    console.log('------------------------------');
    if (allGood) {
        console.log('🎉 All backend tables are correctly configured and accessible!');
    } else {
        console.log('⚠️ Some tables have issues. Please check the errors above.');
    }
}

checkAllTables().catch(console.error);
