import com.skbroadband.openapi.cs.java.Service;
import com.skbroadband.openapi.cs.java.model.enums.session.NetState;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

public class SKBAgent {

    // Configuration from User
    private static final String APP_KEY = "2K5BbEopr1wP6lo0sAjThYHMXhQhxzO86WlmQGAcCTam6Ae35/HMCkQ0qdNzLkZ4";
    private static final String HOSPITAL_ID = "9d73e090-10e3-43a7-b326-be685892e5ca";
    
    // Supabase Configuration
    private static final String SUPABASE_URL = "https://yfuheulxcrtnoljbfrlm.supabase.co"; // From .env
    private static final String SUPABASE_KEY = "sb_publishable_LqUBsWtp9H-taFMh4r6VgQ_hj3ULdk-"; // From .env

    public static void main(String[] args) {
        System.out.println("[SKB Agent] Starting SKB API Java Agent...");

        Service.shared().setReceiver(new Service.Receiver() {
            @Override
            public void onSessionConnected() {
                System.out.println("[SKB Agent] SUCCESS: Connected to SKB Server!");
                // Notice: In a real scenario, login() may be required here if the SKB line needs user/password authentication.
                // Assuming AppKey is enough to receive events for this line.
            }

            @Override
            public void onSessionDisconnected() {
                System.out.println("[SKB Agent] EVENT: Disconnected from SKB Server.");
            }

            @Override
            public void onEventResult(int serviceType, int eventType, int result, String dn1, String dn2, String extInfo) {
                System.out.println(String.format("[SKB Agent] EVENT received: type=%d, dn1=%s, dn2=%s", eventType, dn1, dn2));
                
                // SKB Event Types Mapping (pseudo logic based on typical SDKs)
                // 32 = TermcallStartNoti (Incoming ring)
                // 34 = AbsenceNoti (Missed call)
                // 33 = TermcallEndNoti (Completed)
                
                String callType = "unknown";
                if (eventType == 32) callType = "incoming";
                else if (eventType == 34) callType = "missed";
                else if (eventType == 33) callType = "completed";

                if (!callType.equals("unknown")) {
                    insertToSupabase(callType, dn1 != null ? dn1 : "Unknown", dn2 != null ? dn2 : "Unknown");
                }
            }
        });

        System.out.println("[SKB Agent] Connecting session using AppKey...");
        Service.shared().connectSession(APP_KEY);

        // Keep the main thread alive to listen for events
        while (true) {
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                break;
            }
        }
    }

    private static void insertToSupabase(String callType, String caller, String receiver) {
        try {
            URL url = new URL(SUPABASE_URL + "/rest/v1/skb_call_history");
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setRequestProperty("apikey", SUPABASE_KEY);
            conn.setRequestProperty("Authorization", "Bearer " + SUPABASE_KEY);
            conn.setDoOutput(true);

            String jsonInputString = String.format(
                "{\"hospital_id\": \"%s\", \"call_type\": \"%s\", \"caller_number\": \"%s\", \"receiver_number\": \"%s\"}",
                HOSPITAL_ID, callType, caller, receiver
            );

            try(OutputStream os = conn.getOutputStream()) {
                byte[] input = jsonInputString.getBytes("utf-8");
                os.write(input, 0, input.length);			
            }

            int code = conn.getResponseCode();
            System.out.println("[SKB Agent] Supabase Insert response code: " + code);

        } catch (Exception e) {
            System.err.println("[SKB Agent] Failed to insert to Supabase: " + e.getMessage());
        }
    }
}
