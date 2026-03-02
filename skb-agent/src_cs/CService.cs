using System;
using System.Runtime.InteropServices;

namespace SKB_OpenAPI_IMS_Sample
{
	public enum SVCCODE
	{
		IMS_SVC_CONFERENCE,				// 회의통화
		IMS_SVC_CLICK_CALL,				// ClickCall
		IMS_SVC_SEND_SMS,				// SMS 전송
		IMS_SVC_RECV_SMS,				// SMS 수신
		IMS_SVC_TTS_RS,					// TTS 설문
		IMS_SVC_TTS_MSG,				// TTS 메시지
		IMS_SVC_TTS_AUTH,				// TTS 인증
		IMS_SVC_CID,					// CID
		IMS_SVC_TERM_REC,				// 착신 녹취
		IMS_SVC_ABS_NOTI,				// 부재중 알림
		IMS_SVC_CALL_FWD,				// 착신전환 설정
		IMS_SVC_ORIGCALL_START_NOTI,	// 발신통화 시작 통보
		IMS_SVC_ORIGCALL_END_NOTI,		// 발신통화 종료 통보
		IMS_SVC_TERMCALL_START_NOTI,	// 착신통화 시작 통보 
		IMS_SVC_TERMCALL_END_NOTI,		// 착신통화 종료 통보
		IMS_SVC_CALL_TRANSFER,			// 돌려주기
		IMS_SVC_CALL_PICKUP,			// 당겨받기
		IMS_SVC_SEND_MMS,				// MMS 전송
		IMS_SVC_RECV_MMS,				// MMS 수신
		IMS_SVC_CALLBUSYNOTI,			// 통화중 알림
		IMS_SVC_CTRNOTI,				// 돌려주기 알림 
		IMS_SVC_CPUNOTI,				// 당겨받기 알림 
		IMS_SVC_GET_SERVICE_INFO,		// 로그인시 가용 서비스 조회

		MAX_IMS_SVC = 30,
		IMS_SVC_NORMAL = MAX_IMS_SVC
	}

	public class CService
	{
		public CService()
		{
		}

		public string StrService(int nSvc)
		{
			switch (nSvc)
			{
				case (int)SVCCODE.IMS_SVC_CONFERENCE:				  return "IMS_SVC_CONFERENCE";
				case (int)SVCCODE.IMS_SVC_CLICK_CALL:				  return "IMS_SVC_CLICK_CALL";
				case (int)SVCCODE.IMS_SVC_SEND_SMS:					  return "IMS_SVC_SEND_SMS";
				case (int)SVCCODE.IMS_SVC_RECV_SMS:					  return "IMS_SVC_RECV_SMS";
				case (int)SVCCODE.IMS_SVC_TTS_RS:					  return "IMS_SVC_TTS_RS";
				case (int)SVCCODE.IMS_SVC_TTS_MSG:					  return "IMS_SVC_TTS_MSG";
				case (int)SVCCODE.IMS_SVC_TTS_AUTH:					  return "IMS_SVC_TTS_AUTH";
				case (int)SVCCODE.IMS_SVC_CID:						  return "IMS_SVC_CID";
				case (int)SVCCODE.IMS_SVC_TERM_REC:					  return "IMS_SVC_TERM_REC";
				case (int)SVCCODE.IMS_SVC_ABS_NOTI:					  return "IMS_SVC_ABS_NOTI";
				case (int)SVCCODE.IMS_SVC_CALL_FWD:					  return "IMS_SVC_CALL_FWD";
				case (int)SVCCODE.IMS_SVC_ORIGCALL_START_NOTI:        return "IMS_SVC_ORIGCALL_START_NOTI";
				case (int)SVCCODE.IMS_SVC_ORIGCALL_END_NOTI:		  return "IMS_SVC_ORIGCALL_END_NOTI";
				case (int)SVCCODE.IMS_SVC_TERMCALL_START_NOTI:	      return "IMS_SVC_TERMCALL_START_NOTI";
				case (int)SVCCODE.IMS_SVC_TERMCALL_END_NOTI:		  return "IMS_SVC_TERMCALL_END_NOTI";
				case (int)SVCCODE.IMS_SVC_CALL_TRANSFER:			  return "IMS_SVC_CALL_TRANSFER";
				case (int)SVCCODE.IMS_SVC_CALL_PICKUP:				  return "IMS_SVC_CALL_PICKUP";
				case (int)SVCCODE.IMS_SVC_SEND_MMS:				      return "IMS_SVC_SEND_MMS";
				case (int)SVCCODE.IMS_SVC_RECV_MMS:				      return "IMS_SVC_RECV_MMS";
				case (int)SVCCODE.IMS_SVC_GET_SERVICE_INFO:			  return "IMS_SVC_GET_SERVICE_INFO";
				case (int)SVCCODE.IMS_SVC_CALLBUSYNOTI:				  return "IMS_SVC_CALLBUSYNOTI";
				case (int)SVCCODE.IMS_SVC_CTRNOTI:					  return "IMS_SVC_CTRNOTI";
				case (int)SVCCODE.IMS_SVC_CPUNOTI:					  return "IMS_SVC_CPUNOTI";
				case (int)SVCCODE.IMS_SVC_NORMAL:				      return "IMS_SVC_NORMAL";
			}

			return "Unknown";
		}
	}
}
