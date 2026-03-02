import { createClient } from '@supabase/supabase-js';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Supabase Configuration
const SUPABASE_URL = "https://yfuheulxcrtnoljbfrlm.supabase.co";
const SUPABASE_KEY = "sb_publishable_LqUBsWtp9H-taFMh4r6VgQ_hj3ULdk-";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const AGENT_EXE = path.join(__dirname, 'SKBAgent.exe');
const processes = new Map(); // hospitalId -> { process, apiKey }

async function syncHospitals() {
    console.log(`[${new Date().toLocaleTimeString()}] 병원 데이터 동기화 중...`);

    try {
        const { data: hospitals, error } = await supabase
            .from('hospitals')
            .select('id, name, carrier, carrier_api_key')
            .eq('carrier', 'STB');

        if (error) throw error;

        const activeIds = new Set();

        for (const h of hospitals) {
            const key = h.carrier_api_key;
            if (!key) continue;

            activeIds.add(h.id);

            const existing = processes.get(h.id);
            if (existing) {
                if (existing.apiKey !== key) {
                    console.log(`[${h.name}] API 키 변경됨. 재시작 중...`);
                    existing.process.kill();
                    processes.delete(h.id);
                    startAgent(h);
                }
            } else {
                startAgent(h);
            }
        }

        // 제거된 병원 처리
        for (const [id, info] of processes.entries()) {
            if (!activeIds.has(id)) {
                console.log(`[ID: ${id}] 병원이 비활성화되어 에이전트 종료.`);
                info.process.kill();
                processes.delete(id);
            }
        }

    } catch (err) {
        console.error('동기화 오류:', err.message);
    }
}

function startAgent(hospital) {
    console.log(`[${hospital.name}] 에이전트 실행 시도... (Key: ${hospital.carrier_api_key.substring(0, 8)}...)`);

    const child = spawn(AGENT_EXE, [hospital.carrier_api_key, hospital.id], {
        cwd: __dirname,
        shell: true
    });

    child.stdout.on('data', (data) => {
        process.stdout.write(`[${hospital.name}] ${data}`);
    });

    child.stderr.on('data', (data) => {
        process.stderr.write(`[${hospital.name} 오류] ${data}`);
    });

    child.on('close', (code) => {
        console.log(`[${hospital.name}] 에이전트 종료 (Code: ${code})`);
        if (processes.get(hospital.id)?.process === child) {
            processes.delete(hospital.id);
        }
    });

    processes.set(hospital.id, { process: child, apiKey: hospital.carrier_api_key });
}

// 30초마다 동기화
setInterval(syncHospitals, 30000);
syncHospitals();

console.log('-------------------------------------------');
console.log('   SKB 중앙 집중식 매니저 가동 중');
console.log('   (DB에서 병원을 등록하면 자동 실행됩니다)');
console.log('-------------------------------------------');
