require('dotenv').config({ path: '../.env' }); // Fetch from parent directory
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const HOSPITAL_ID = '9d73e090-10e3-43a7-b326-be685892e5ca'; // Based on previous user input

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials in .env");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createMockCallLogs() {
    console.log('Testing SKB Call History UI - Inserting mock data...');

    const mockLogs = [
        {
            hospital_id: HOSPITAL_ID,
            call_type: 'incoming',
            caller_number: '010-1234-5678',
            receiver_number: '1001',
            started_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
            ended_at: null,
            created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        },
        {
            hospital_id: HOSPITAL_ID,
            call_type: 'missed',
            caller_number: '010-9876-5432',
            receiver_number: '1002',
            started_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
            ended_at: new Date(Date.now() - 1000 * 60 * 59).toISOString(),
            created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        },
        {
            hospital_id: HOSPITAL_ID,
            call_type: 'completed',
            caller_number: '010-5555-7777',
            receiver_number: '1001',
            started_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
            ended_at: new Date(Date.now() - 1000 * 60 * 60 * 24 + 1000 * 120).toISOString(), // 2 minutes later
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        }
    ];

    const { data, error } = await supabase
        .from('skb_call_history')
        .insert(mockLogs);

    if (error) {
        console.error('Failed to insert mock data:', error.message);
        if (error.message.includes("relation \"skb_call_history\" does not exist")) {
            console.error("\n[오류] Supabase에 'skb_call_history' 테이블이 아직 생성되지 않았습니다.");
            console.error("먼저 더하이메디 폴더의 `supabase_schema.sql` 파일 맨 밑에 있는 테이블 생성 코드를 Supabase 웹에서 실행해야 합니다.");
        }
    } else {
        console.log('Successfully inserted 3 mock call logs!');
        console.log('You can now open the "SKB 전화내역" page in the web app to verify.');
    }
}

createMockCallLogs();
