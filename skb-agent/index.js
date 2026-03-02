require('dotenv').config();
const net = require('net');
const xml2js = require('xml2js');
const { createClient } = require('@supabase/supabase-js');

// 1. Supabase Initialization
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Check your .env for SUPABASE_URL and SUPABASE_ANON_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// 2. SKB CTI Server Configuration
const SKB_HOST = process.env.SKB_HOST || '127.0.0.1'; // Replace with actual SKB Server IP
const SKB_PORT = process.env.SKB_PORT || 2000;      // Replace with actual SKB Server Port
const HOSPITAL_ID = process.env.HOSPITAL_ID || 'H001_UUID'; // The UUID of the hospital in Supabase

console.log(`[skb-agent] Starting... Connecting to SKB XML server at ${SKB_HOST}:${SKB_PORT}`);

const client = new net.Socket();

client.connect(SKB_PORT, SKB_HOST, () => {
    console.log('[skb-agent] Connected to SKB CTI Server.');
    // Here, we might need to send a Login request to the SKB Server.
    // E.g., a specific XML packet as defined by the SKB OpenAPI.
    // const loginXml = `<Req...></Req...>`;
    // client.write(loginXml);
});

let buffer = '';

client.on('data', async (data) => {
    buffer += data.toString();

    // A naive approach assuming each complete XML payload ends with a specific tag or newline.
    // Depending on SKB protocol, we may need a specific framing (like reading lengths).
    // Assuming simple newline or checking for complete XML structure.

    if (buffer.includes('</')) {
        // Attempt parse
        try {
            const parsed = await xml2js.parseStringPromise(buffer);
            console.log('[skb-agent] Received XML:', JSON.stringify(parsed, null, 2));

            await handleSkbEvent(parsed);

            buffer = ''; // Clear buffer after successful parse (naive)
        } catch (e) {
            // Still buffering...
        }
    }
});

client.on('close', () => {
    console.log('[skb-agent] Connection closed. Attempting reconnect in 5s...');
    setTimeout(() => {
        client.connect(SKB_PORT, SKB_HOST);
    }, 5000);
});

client.on('error', (err) => {
    console.error('[skb-agent] Socket error:', err.message);
});

/**
 * Handle different SKB Events and map to Supabase
 */
async function handleSkbEvent(xmlObj) {
    // Determine event type based on the XML object structure.
    // SKB API usually sends <Noti>...</Noti> or similar containing properties.

    // This depends heavily on SKB's actual XML structure.
    // Example for an incoming call (TermcallStartNoti):
    if (xmlObj.TermcallStartNoti) {
        const noti = xmlObj.TermcallStartNoti;
        const callerNumber = noti.calling_dn?.[0] || 'Unknown';
        const receiverNumber = noti.called_dn?.[0] || 'Unknown';

        await logToSupabase('incoming', callerNumber, receiverNumber);
    }

    // Example for a missed call (AbsenceNoti):
    else if (xmlObj.AbsenceNoti) {
        const noti = xmlObj.AbsenceNoti;
        const callerNumber = noti.calling_dn?.[0] || 'Unknown';
        const receiverNumber = noti.called_dn?.[0] || 'Unknown';

        await logToSupabase('missed', callerNumber, receiverNumber);
    }

    // Example for call ended
    else if (xmlObj.TermcallEndNoti || xmlObj.OrigcallEndNoti) {
        const noti = xmlObj.TermcallEndNoti || xmlObj.OrigcallEndNoti;
        const callerNumber = noti.calling_dn?.[0] || 'Unknown';
        const receiverNumber = noti.called_dn?.[0] || 'Unknown';

        await logToSupabase('completed', callerNumber, receiverNumber);
    }
}

async function logToSupabase(callType, callerNumber, receiverNumber) {
    try {
        const { data, error } = await supabase
            .from('skb_call_history')
            .insert([
                {
                    hospital_id: HOSPITAL_ID,
                    call_type: callType,
                    caller_number: callerNumber,
                    receiver_number: receiverNumber,
                    started_at: new Date().toISOString(),
                }
            ]);

        if (error) {
            console.error('[skb-agent] Supabase insert error:', error);
        } else {
            console.log(`[skb-agent] Logged ${callType} call from ${callerNumber} to ${receiverNumber} in Supabase.`);
        }
    } catch (err) {
        console.error('[skb-agent] Database error:', err.message);
    }
}
