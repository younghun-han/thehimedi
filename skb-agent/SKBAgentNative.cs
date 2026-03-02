using System;
using System.Runtime.InteropServices;
using System.Net;
using System.Text;
using System.Threading;

namespace SKBAgent
{
    [StructLayout(LayoutKind.Sequential, Pack = 1), Serializable]
    public struct _EVTMSG
    {
        public int nService;
        public int nEvtType;
        public int nResult;
        [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 32)]
        public string strDn1;
        [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 32)]
        public string strDn2;
        [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 1024)]
        public string strExtInfo;
    }

    class Program
    {
        private static string APP_KEY;
        private static string HOSPITAL_ID;
        private const string SUPABASE_URL = "https://yfuheulxcrtnoljbfrlm.supabase.co/rest/v1/skb_call_history";
        private const string SUPABASE_KEY = "sb_publishable_LqUBsWtp9H-taFMh4r6VgQ_hj3ULdk-";

        [DllImport("SKB_OpenAPI_IMS.dll", CallingConvention = CallingConvention.StdCall)]
        public static extern int IMS_Init(string strAppKey);

        [DllImport("SKB_OpenAPI_IMS.dll", CallingConvention = CallingConvention.StdCall)]
        public static extern int IMS_GetEvent(ref _EVTMSG stEvtMsg);

        static void Main(string[] args)
        {
            if (args.Length < 2)
            {
                Console.WriteLine("Usage: SKBAgent.exe <APP_KEY> <HOSPITAL_ID>");
                return;
            }

            APP_KEY = args[0];
            HOSPITAL_ID = args[1];

            Console.Title = "SKB 에이전트 [" + HOSPITAL_ID.Substring(0, 8) + "...]";
            Console.WriteLine("[에이전트] 시작됨 - Hospital: " + HOSPITAL_ID);

            try
            {
                int init = IMS_Init(APP_KEY);
                if (init != 0)
                {
                    Console.WriteLine("[오류] SKB 연결 실패. 코드: " + init);
                    Thread.Sleep(5000);
                    return;
                }
                Console.WriteLine(">>> SKB 서버 연결 성공!");
            }
            catch (Exception ex)
            {
                Console.WriteLine("[오류] DLL 로드 실패: " + ex.Message);
                Thread.Sleep(5000);
                return;
            }

            Console.WriteLine(">>> 실시간 통화 감시 중...");

            _EVTMSG evt = new _EVTMSG();
            while (true)
            {
                try
                {
                    if (IMS_GetEvent(ref evt) == 0)
                    {
                        string callType = "";
                        // serviceType 코드 (SKB API 문서 기준)
                        if (evt.nService == 13) callType = "incoming";
                        else if (evt.nService == 10) callType = "missed";
                        else if (evt.nService == 14) callType = "completed";

                        if (!string.IsNullOrEmpty(callType))
                        {
                            Console.WriteLine(
                                "[" + DateTime.Now.ToString("HH:mm:ss") + "] " +
                                callType + " / " + evt.strDn1 + " -> " + evt.strDn2
                            );
                            SendToSupabase(callType, evt.strDn1, evt.strDn2);
                        }
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine("[경고] 이벤트 처리 오류: " + ex.Message);
                }
                Thread.Sleep(200);
            }
        }

        static void SendToSupabase(string type, string caller, string receiver)
        {
            try
            {
                ServicePointManager.SecurityProtocol = (SecurityProtocolType)3072; // TLS 1.2
                using (WebClient client = new WebClient())
                {
                    client.Encoding = Encoding.UTF8;
                    client.Headers.Add("apikey", SUPABASE_KEY);
                    client.Headers.Add("Authorization", "Bearer " + SUPABASE_KEY);
                    client.Headers.Add("Content-Type", "application/json");

                    string json = "{\"hospital_id\":\"" + HOSPITAL_ID +
                                  "\",\"call_type\":\"" + type +
                                  "\",\"caller_number\":\"" + caller +
                                  "\",\"receiver_number\":\"" + receiver + "\"}";

                    client.UploadString(SUPABASE_URL, "POST", json);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("[경고] Supabase 전송 실패: " + ex.Message);
            }
        }
    }
}
