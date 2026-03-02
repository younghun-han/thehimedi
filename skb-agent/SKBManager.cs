using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Net;
using System.Threading;
using System.Text.RegularExpressions;

namespace SKBManager
{
    class Program
    {
        private const string SUPABASE_URL = "https://yfuheulxcrtnoljbfrlm.supabase.co/rest/v1/hospitals?select=id,name,carrier,carrier_api_key&carrier=eq.STB";
        private const string SUPABASE_KEY = "sb_publishable_LqUBsWtp9H-taFMh4r6VgQ_hj3ULdk-";
        private static Dictionary<string, Process> processes = new Dictionary<string, Process>();
        private static Dictionary<string, string> apiKeys = new Dictionary<string, string>();

        static void Main(string[] args)
        {
            Console.Title = "더하이메디 SKB 중앙 매니저 v2.0";
            Console.WriteLine("===========================================");
            Console.WriteLine("   더하이메디 SKB 중앙 매니저 (v2.0)");
            Console.WriteLine("   No Java, No Node.js - 설치 불필요");
            Console.WriteLine("===========================================");
            Console.WriteLine(">>> DB 감시를 시작합니다. (30초 주기)");
            Console.WriteLine("");

            while (true)
            {
                SyncHospitals();
                Thread.Sleep(30000);
            }
        }

        static void SyncHospitals()
        {
            Console.WriteLine("[" + DateTime.Now.ToString("HH:mm:ss") + "] 동기화 중...");
            try
            {
                ServicePointManager.SecurityProtocol = (SecurityProtocolType)3072; // TLS 1.2
                string json;
                using (WebClient client = new WebClient())
                {
                    client.Headers.Add("apikey", SUPABASE_KEY);
                    client.Headers.Add("Authorization", "Bearer " + SUPABASE_KEY);
                    client.Encoding = System.Text.Encoding.UTF8;
                    json = client.DownloadString(SUPABASE_URL);
                }

                // 더 유연한 Regex: 필드 순서 무관하게 각 키를 개별 추출
                var activeIds = new HashSet<string>();
                // JSON 배열의 각 객체를 순회
                var objects = Regex.Matches(json, @"\{([^}]+)\}");
                foreach (Match obj in objects)
                {
                    string block = obj.Value;
                    var idMatch  = Regex.Match(block, "\"id\":\"([^\"]+)\"");
                    var nameMatch = Regex.Match(block, "\"name\":\"([^\"]+)\"");
                    var keyMatch = Regex.Match(block, "\"carrier_api_key\":\"([^\"]+)\"");

                    if (!idMatch.Success || !keyMatch.Success) continue;

                    string id   = idMatch.Groups[1].Value;
                    string name = nameMatch.Success ? nameMatch.Groups[1].Value : id;
                    string key  = keyMatch.Groups[1].Value;

                    if (string.IsNullOrEmpty(key)) continue;
                    activeIds.Add(id);

                    if (processes.ContainsKey(id))
                    {
                        bool isDead = processes[id].HasExited;
                        bool keyChanged = apiKeys.ContainsKey(id) && apiKeys[id] != key;

                        if (isDead || keyChanged)
                        {
                            string reason = isDead ? "에이전트 종료됨" : "API 키 변경";
                            Console.WriteLine("[" + name + "] " + reason + " → 재시작 중...");
                            try { processes[id].Kill(); } catch { }
                            processes.Remove(id);
                            apiKeys.Remove(id);
                            StartAgent(id, name, key);
                        }
                    }
                    else
                    {
                        StartAgent(id, name, key);
                    }
                }

                // 등록 해제된 병원 종료
                var toRemove = new List<string>();
                foreach (var pair in processes)
                {
                    if (!activeIds.Contains(pair.Key))
                    {
                        Console.WriteLine("[매니저] 병원 비활성화됨 → 에이전트 종료: " + pair.Key);
                        try { pair.Value.Kill(); } catch { }
                        toRemove.Add(pair.Key);
                    }
                }
                foreach (var rid in toRemove) { processes.Remove(rid); apiKeys.Remove(rid); }

                Console.WriteLine("[" + DateTime.Now.ToString("HH:mm:ss") + "] 활성 에이전트: " + processes.Count + "개");
            }
            catch (Exception ex)
            {
                Console.WriteLine("[오류] 동기화 실패: " + ex.Message);
            }
        }

        static void StartAgent(string id, string name, string key)
        {
            Console.WriteLine("[" + name + "] 에이전트 가동 시도...");
            try
            {
                ProcessStartInfo startInfo = new ProcessStartInfo(
                    "SKBAgent.exe",
                    "\"" + key + "\" \"" + id + "\""
                );
                startInfo.UseShellExecute = true;
                startInfo.WindowStyle = ProcessWindowStyle.Normal;

                Process p = Process.Start(startInfo);
                processes[id] = p;
                apiKeys[id] = key;
                Console.WriteLine("[" + name + "] 에이전트 실행 완료 (PID: " + p.Id + ")");
            }
            catch (Exception ex)
            {
                Console.WriteLine("[" + name + "] 에이전트 실행 실패: " + ex.Message);
            }
        }
    }
}
