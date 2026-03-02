using System;
using System.Runtime.InteropServices;

namespace SKB_OpenAPI_IMS_Sample
{
	//[StructLayout(LayoutKind.Sequential, CharSet=CharSet.Unicode, Pack=1), Serializable]
	[StructLayout(LayoutKind.Sequential, Pack=1), Serializable]
	public struct _EVTMSG
	{
		public int nService;
		public int nEvtType;
		public int nResult;
		[MarshalAs(UnmanagedType.ByValTStr, SizeConst=32)]
		public string	strDn1;
		[MarshalAs(UnmanagedType.ByValTStr, SizeConst=32)]
		public string	strDn2;
		[MarshalAs(UnmanagedType.ByValTStr, SizeConst=1024)]
		public string	strExtInfo;
	}
	
	[StructLayout(LayoutKind.Sequential, Pack=1), Serializable]
	public struct _STREST
	{		
		[MarshalAs(UnmanagedType.ByValTStr, SizeConst=8)]
		public string	strRest;
	}

	[StructLayout(LayoutKind.Sequential, Pack=1), Serializable]
	public struct _STVERSION
	{		
		[MarshalAs(UnmanagedType.ByValTStr, SizeConst=16)]
		public string	strVersion;
	}


	public enum EVTTYPE
	{
		//
		//	공용
		//
		EVT_TIMEOUT = 0,
		EVT_NORMAL,
		EVT_SYS_FAULT,

		//
		//	세션 연결 관련
		//
		EVT_CONNECTING = 0x0100,
		EVT_CONNECTED,
		EVT_DISCONNECTED,
		EVT_CONNECTION_FAIL,

		EVT_LOGIN,
		EVT_LOGOUT,

		EVT_SET_REST,

		EVT_SUBS_DN_QRY,
		EVT_MON_DN_QRY,
		EVT_MON_DN_ADD,
		EVT_MON_DN_DEL,

		//
		//	인증 서비스
		//
		EVT_AUTH_SMS = 0x0200,
		EVT_AUTH_TTS,

		//
		//	사용자 정보 관리
		//
		EVT_CREATE_USER = 0x0210,
		EVT_CHG_PASSWD,
		EVT_GET_SVCINFO,

		//	
		//	서비스 이벤트
		//
		EVT_SERVICE_INFO = 0x0300,
		EVT_CALL_STATUS,

		EVT_START_SERVICE,
		EVT_STOP_SERVICE,
		EVT_READY_SERVICE,

		EVT_ANSWER,

		EVT_INIT_RECORD,
		EVT_START_RECORD,
		EVT_STOP_RECORD,

		EVT_PTPNT_ADD,
		EVT_PTPNT_DEL,
		EVT_PTPNT_EXPEL,

		EVT_REQUEST_SERVICE,
	}

	public class CEvent
	{
		FMain		MAIN;
		CErrorCode	ERR;
		CService	SVC;

		public CEvent(FMain frmMain, CErrorCode clsErr, CService clsSvc)
		{
			MAIN = frmMain;
			ERR  = clsErr;
			SVC  = clsSvc;
		}

		public string StrEvtType (int nType)
		{
			switch (nType)
			{
				case (int)EVTTYPE.EVT_TIMEOUT:			return "EVT_TIMEOUT";
				case (int)EVTTYPE.EVT_NORMAL:			return "EVT_NORMAL";

				case (int)EVTTYPE.EVT_CONNECTING:		return "EVT_CONNECTING";
				case (int)EVTTYPE.EVT_CONNECTED:		return "EVT_CONNECTED";
				case (int)EVTTYPE.EVT_DISCONNECTED:		return "EVT_DISCONNECTED";
				case (int)EVTTYPE.EVT_CONNECTION_FAIL:	return "EVT_CONNECTION_FAIL";
	
				case (int)EVTTYPE.EVT_LOGIN:			return "EVT_LOGIN";
				case (int)EVTTYPE.EVT_LOGOUT:			return "EVT_LOGOUT";

				case (int)EVTTYPE.EVT_AUTH_SMS:			return "EVT_AUTH_SMS";
				case (int)EVTTYPE.EVT_AUTH_TTS:			return "EVT_AUTH_TTS";

				case (int)EVTTYPE.EVT_CREATE_USER:		return "EVT_CREATE_USER";
				case (int)EVTTYPE.EVT_CHG_PASSWD:		return "EVT_CHG_PASSWD";

				case (int)EVTTYPE.EVT_SET_REST:			return "EVT_SET_REST";
	
				case (int)EVTTYPE.EVT_SUBS_DN_QRY:		return "EVT_SUBS_DN_QRY";
				case (int)EVTTYPE.EVT_MON_DN_QRY:		return "EVT_MON_DN_QRY";
				case (int)EVTTYPE.EVT_MON_DN_ADD:		return "EVT_MON_DN_ADD";
				case (int)EVTTYPE.EVT_MON_DN_DEL:		return "EVT_MON_DN_DEL";

				case (int)EVTTYPE.EVT_SERVICE_INFO:		return "EVT_SERVICE_INFO";
				case (int)EVTTYPE.EVT_CALL_STATUS:		return "EVT_CALL_STATUS";

				case (int)EVTTYPE.EVT_START_SERVICE:	return "EVT_START_SERVICE";
				case (int)EVTTYPE.EVT_STOP_SERVICE:		return "EVT_STOP_SERVICE";

				case (int)EVTTYPE.EVT_ANSWER:			return "EVT_ANSWER";

				case (int)EVTTYPE.EVT_START_RECORD:		return "EVT_START_RECORD";
				case (int)EVTTYPE.EVT_STOP_RECORD:		return "EVT_STOP_RECORD";
				case (int)EVTTYPE.EVT_READY_SERVICE:	return "EVT_READY_SERVICE";

				case (int)EVTTYPE.EVT_PTPNT_ADD:		return "EVT_PTPNT_ADD";
				case (int)EVTTYPE.EVT_PTPNT_DEL:		return "EVT_PTPNT_DEL";
				case (int)EVTTYPE.EVT_PTPNT_EXPEL:		return "EVT_PTPNT_EXPEL";

				case (int)EVTTYPE.EVT_REQUEST_SERVICE:	return "EVT_REQUEST_SERVICE";
			}

			return "Unknown";
		}

		public void Proc(int nSvc, int nEvtType, int nResult, string strDn1, string strDn2, string strExtInfo)
		{
			MAIN.Log ("[이벤트] Service[" + nSvc + "-" + SVC.StrService(nSvc) 
					+ "] EvtType[" + nEvtType + "-" + StrEvtType(nEvtType) 
					+ "] Result[" + nResult + "-" + ERR.StrFCause(nResult) 
					+ "] Dn1[" + strDn1 + "] Dn2[" + strDn2 + "] ExtInfo[" + strExtInfo + "]");

			switch (nSvc)
			{
				//
				//   기본 이벤트 처리
				//
				case (int)SVCCODE.IMS_SVC_NORMAL:
				{
					switch (nEvtType)
					{
						case (int)EVTTYPE.EVT_TIMEOUT:			EvtProc_Timeout(nResult); break;
						case (int)EVTTYPE.EVT_CONNECTING:		EvtProc_Connecting(); break;
						case (int)EVTTYPE.EVT_CONNECTED:		EvtProc_Connected(); break;
						case (int)EVTTYPE.EVT_DISCONNECTED:		EvtProc_Disconnected(nResult); break;
						case (int)EVTTYPE.EVT_CONNECTION_FAIL:	EvtProc_ConnectionFail(nResult); break;

						case (int)EVTTYPE.EVT_LOGIN:			EvtProc_Login(nResult); break;
						case (int)EVTTYPE.EVT_LOGOUT:			EvtProc_Logout(nResult); break;
						case (int)EVTTYPE.EVT_SET_REST:         EvtProc_SetRest(nResult); break;

						case (int)EVTTYPE.EVT_SUBS_DN_QRY:		EvtProc_SubsDnQry(strExtInfo); break;
						case (int)EVTTYPE.EVT_MON_DN_QRY:		EvtProc_MonDnQry(strExtInfo); break;
						case (int)EVTTYPE.EVT_MON_DN_ADD:		EvtProc_MonDnAdd(nResult, strExtInfo); break;
						case (int)EVTTYPE.EVT_MON_DN_DEL:		EvtProc_MonDnDel(nResult, strExtInfo); break;

						case (int)EVTTYPE.EVT_AUTH_SMS:			EvtProc_AuthSms(nResult); break;
						case (int)EVTTYPE.EVT_AUTH_TTS:			EvtProc_AuthTts(nResult); break;
						case (int)EVTTYPE.EVT_CREATE_USER:		EvtProc_CreateUser(nResult); break;
						case (int)EVTTYPE.EVT_CHG_PASSWD:		EvtProc_ChgPasswd(nResult); break;
						case (int)EVTTYPE.EVT_SERVICE_INFO:		EvtProc_SvcInfo(strExtInfo); break;
					}
				}
				break;

				//
				//   서비스 이벤트 처리
				//
				case (int)SVCCODE.IMS_SVC_CLICK_CALL:				EvtProc_ClickCall(nEvtType, nResult, strDn1, strDn2, strExtInfo); break;

				case (int)SVCCODE.IMS_SVC_CID:						EvtProc_CIDN(strDn1, strDn2); break;
				case (int)SVCCODE.IMS_SVC_CONFERENCE:				EvtProc_Conference(nEvtType, nResult, strDn1, strDn2, strExtInfo); break;

				case (int)SVCCODE.IMS_SVC_ABS_NOTI:					EvtProc_AbsNoti(strDn1, strDn2, strExtInfo); break;
				case (int)SVCCODE.IMS_SVC_SEND_SMS:					EvtProc_SendSms(nResult, strExtInfo); break;
				case (int)SVCCODE.IMS_SVC_RECV_SMS:					EvtProc_RecvSms(strDn1, strDn2, strExtInfo); break;
				case (int)SVCCODE.IMS_SVC_TERM_REC:					EvtProc_TermRec(nEvtType, nResult, strDn1, strDn2, strExtInfo); break;

				case (int)SVCCODE.IMS_SVC_TTS_RS:					EvtProc_TtsRs(nEvtType, nResult, strDn1, strExtInfo); break;
				case (int)SVCCODE.IMS_SVC_TTS_MSG:					EvtProc_TtsMsg(nEvtType, nResult, strDn1, strExtInfo); break;
				case (int)SVCCODE.IMS_SVC_TTS_AUTH:					EvtProc_TtsAuth(nEvtType, nResult, strDn1, strExtInfo); break;
				case (int)SVCCODE.IMS_SVC_CALL_FWD:					EvtProc_CallForward(nResult, strDn1, strDn2, strExtInfo); break;
				
				case (int)SVCCODE.IMS_SVC_ORIGCALL_START_NOTI:      EvtProc_OrigcallStartNoti(strDn1, strDn2, strExtInfo); break;
				case (int)SVCCODE.IMS_SVC_ORIGCALL_END_NOTI:		EvtProc_OrigcallEndNoti(strDn1, strDn2, strExtInfo); break;

				case (int)SVCCODE.IMS_SVC_TERMCALL_START_NOTI:      EvtProc_TermcallStartNoti(strDn1, strDn2, strExtInfo); break;
				case (int)SVCCODE.IMS_SVC_TERMCALL_END_NOTI:	    EvtProc_TermcallEndNoti(strDn1, strDn2, strExtInfo); break;

				case (int)SVCCODE.IMS_SVC_CALL_TRANSFER:			EvtProc_CallTransfer(nEvtType, nResult, strDn1, strDn2, strExtInfo); break;
				case (int)SVCCODE.IMS_SVC_CALL_PICKUP:				EvtProc_CallPickup(nEvtType, nResult, strExtInfo); break;

				case (int)SVCCODE.IMS_SVC_SEND_MMS:                 EvtProc_SendMms(nResult, strExtInfo); break;
				case (int)SVCCODE.IMS_SVC_RECV_MMS:					EvtProc_RecvMms(strDn1, strDn2, strExtInfo); break;

				case (int)SVCCODE.IMS_SVC_CALLBUSYNOTI:				EvtProc_CallBusyNoti(strDn1, strDn2, strExtInfo); break;

				case (int)SVCCODE.IMS_SVC_CTRNOTI:				    EvtProc_CtrNoti(strDn2, strDn1); break;

				case (int)SVCCODE.IMS_SVC_CPUNOTI:				    EvtProc_CpuNoti(strDn1, strDn2); break;

				case (int)SVCCODE.IMS_SVC_GET_SERVICE_INFO:			EvtProc_GetSvcInfo(nResult); break;

				default: 
					MAIN.Log (">>>> Invalid service : Service[" + nSvc + "]");
					break;
			}
		}

		private void EvtProc_Timeout(int nResult)
		{
			MAIN.Log (">>>> 호스트 응답 없음");
		}

		private void EvtProc_Connecting()
		{
			MAIN.Log ("**** 호스트 연결 중");
		}

		private void EvtProc_Connected()
		{
			MAIN.Log ("**** 호스트 연결");
		}

		private void EvtProc_Disconnected(int nResult)
		{
			MAIN.Log (">>>> 호스트 연결 종료 : Cause[" + nResult + "-" + ERR.StrFCause(nResult) + "]");
		}

		private void EvtProc_ConnectionFail(int nResult)
		{
			MAIN.Log (">>>> 호스트 연결 실패 : Cause[" + nResult + "-" + ERR.StrFCause(nResult) + "]");
		}

		private void EvtProc_Login(int nResult)
		{
			if (nResult == (int)ERRCODE.SUCCESS)	MAIN.Log ("**** 로그인 성공");
			else									MAIN.Log (">>>> 로그인 실패 : Cause[" + nResult + "-" + ERR.StrFCause(nResult) + "]");
		}

		private void EvtProc_Logout(int nResult)
		{
			if (nResult == (int)ERRCODE.SUCCESS)	MAIN.Log ("**** 로그아웃 성공");
			else									MAIN.Log (">>>> 로그아웃 실패 : Cause[" + nResult + "-" + ERR.StrFCause(nResult) + "]");
		}

		private void EvtProc_SetRest(int nResult)
		{
			if (nResult == (int)ERRCODE.SUCCESS)	MAIN.Log ("**** 부재중 설정/해제 성공");
			else									MAIN.Log (">>>> 부재중 설정/해제 실패 : Cause[" + nResult + "-" + ERR.StrFCause(nResult) + "]");
		}

		private void EvtProc_SubsDnQry(string strExtInfo)
		{
			int			nListCnt;
			int			nItemCnt;
			int			nFlag;
			string[]	strDnList = strExtInfo.Split(new char[] {'^'}, 1024);
         
			for (nItemCnt=0; nItemCnt<strDnList.Length; nItemCnt++)
			{
				nFlag = 0;

				for (nListCnt=0; nListCnt<MAIN.lstDnMng_MonDn.Items.Count; nListCnt++)
				{
					//MAIN.Log (MAIN.lstDnMng_MonDn.Items[nListCnt].ToString());

					if (MAIN.lstDnMng_MonDn.Items[nListCnt].Equals(strDnList[nItemCnt]))
					{
						nFlag = 1;
						break;
					}
				}

				if (nFlag == 0) MAIN.lstDnMng_SubsDn.Items.Add(strDnList[nItemCnt]);
			}
		}

		private void EvtProc_MonDnQry(string strExtInfo)
		{
			int		 nCnt;
			string[] strDnList = strExtInfo.Split(new char[] {'^'}, 1024);
         
			for (nCnt=0; nCnt<strDnList.Length; nCnt++)
			{
				MAIN.lstDnMng_MonDn.Items.Add(strDnList[nCnt]);
			}
		}

		private void EvtProc_MonDnAdd(int nResult, string strExtInfo)
		{
			if (nResult == (int)ERRCODE.SUCCESS)
			{
				MAIN.Log ("**** 모니터링 전화번호 등록 성공 : Dn[" + strExtInfo + "]");
			}
			else
			{
				MAIN.Log (">>>> 모니터링 전화번호 등록 실패 : Dn[" + strExtInfo + "] Cause[" + nResult + "-" + ERR.StrFCause(nResult) + "]");
			}
		}

		private void EvtProc_MonDnDel(int nResult, string strExtInfo)
		{
			if (nResult == (int)ERRCODE.SUCCESS)
			{
				MAIN.Log ("**** 모니터링 전화번호 삭제 성공 : Dn[" + strExtInfo + "]");
			}
			else
			{
				MAIN.Log (">>>> 모니터링 전화번호 삭제 실패 : Dn[" + strExtInfo + "] Cause[" + nResult + "-" + ERR.StrFCause(nResult) + "]");
			}
		}
		
		private void EvtProc_AuthSms(int nResult)
		{
			if (nResult == (int)ERRCODE.SUCCESS)	MAIN.Log ("**** SMS 인증번호 전송 성공");
			else									MAIN.Log (">>>> SMS 인증번호 전송 실패 : Cause[" + nResult + "-" + ERR.StrFCause(nResult) + "]");
		}

		private void EvtProc_AuthTts(int nResult)
		{
			if (nResult == (int)ERRCODE.SUCCESS)	MAIN.Log ("**** TTS 인증번호 전송 성공");
			else									MAIN.Log (">>>> TTS 인증번호 전송 실패 : Cause[" + nResult + "-" + ERR.StrFCause(nResult) + "]");
		}

		private void EvtProc_CreateUser(int nResult)
		{
			if (nResult == (int)ERRCODE.SUCCESS)	MAIN.Log ("**** 사용자 등록 성공");
			else									MAIN.Log (">>>> 사용자 등록 실패 : Cause[" + nResult + "-" + ERR.StrFCause(nResult) + "]");
		}

		private void EvtProc_ChgPasswd(int nResult)
		{
			if (nResult == (int)ERRCODE.SUCCESS)	MAIN.Log ("**** 사용자 비밀번호 변경 성공");
			else									MAIN.Log (">>>> 사용자 비밀번호 변경 실패 : Cause[" + nResult + "-" + ERR.StrFCause(nResult) + "]");
		}

		private void EvtProc_SvcInfo(string strExtInfo)
		{
			MAIN.Log ("==== [SVC_INFO] " +  strExtInfo);
		}

		private void EvtProc_ClickCall(int nEvtType, int nResult, string strDn1, string strDn2, string strExtInfo)
		{
			switch (nEvtType)
			{
				case (int)EVTTYPE.EVT_NORMAL:
					MAIN.Log ("==== [ClickCall] Cause[" + nResult + "-" + ERR.StrFCause(nResult) + "]");
					break;

				case (int)EVTTYPE.EVT_CALL_STATUS:
					MAIN.Log ("**** [ClickCall] 서비스 상태 : " + strExtInfo);
					break;

				case (int)EVTTYPE.EVT_START_SERVICE:
					if (nResult == (int)ERRCODE.SUCCESS)
					{
						MAIN.Log ("**** [ClickCall] 서비스 시작 성공 [" + strDn1 + "->" + strDn2 + "]");
					}
					else
					{
						MAIN.Log (">>>> [ClickCall] 서비스 시작 실패. Cause[" + nResult + "-" + ERR.StrFCause(nResult) + "] 추가정보[" + strExtInfo + "]");
					}
					break;

				case (int)EVTTYPE.EVT_STOP_SERVICE:
					MAIN.Log ("**** [ClickCall] 서비스 종료 Cause[" + nResult + "-" + ERR.StrFCause(nResult) + "] 추가정보[" + strExtInfo + "]");
					break;
		            
				case (int)EVTTYPE.EVT_START_RECORD:
					if (nResult == (int)ERRCODE.SUCCESS)
					{
						MAIN.Log ("**** [ClickCall] 녹음 시작 성공");
					}
					else
					{
						MAIN.Log (">>>> [ClickCall] 녹음 시작 실패. Cause[" + nResult + "-" + ERR.StrFCause(nResult) + "] 추가정보[" + strExtInfo + "]");
					}
					break;
		            
				case (int)EVTTYPE. EVT_STOP_RECORD:
					if (nResult == (int)ERRCODE.SUCCESS)
					{
						MAIN.Log ("**** [ClickCall] 녹음 종료");
					}
					else
					{
						MAIN.Log (">>>> [ClickCall] 녹음 종료 실패. Cause[" + nResult + "-" + ERR.StrFCause(nResult) + "] 추가정보[" + strExtInfo + "]");
					}
					break;

				case (int)EVTTYPE. EVT_ANSWER:
					MAIN.Log ("**** [clickCall] <" + strDn1 + ">번이 전화를 받았습니다.");
					break;

				default:
					MAIN.Log (">>>> [ClickCall] 잘못된 이벤트 수신. EvtType[" + nEvtType + "-" + StrEvtType(nEvtType) + "]");
					break;
			}
		}

		private void EvtProc_Conference(int nEvtType, int nResult, string strDn1, string strDn2, string strExtInfo)
		{
			switch (nEvtType)
			{
				case (int)EVTTYPE.EVT_NORMAL:
					MAIN.Log (">>>> [CNFR] Cause[" + nResult + "-" + ERR.StrFCause(nResult) + "]");
					break;

				case (int)EVTTYPE.EVT_CALL_STATUS:
					MAIN.Log ("**** [CNFR] 서비스 상태. 전화번호[" + strDn1 + "] 상태[" + strExtInfo + "]");
					break;

				case (int)EVTTYPE.EVT_START_SERVICE:
					if (nResult == (int)ERRCODE.SUCCESS) 
					{
						MAIN.Log ("**** [CNFR] 서비스 시작 성공 [" + strDn1 + "->" + strDn2 + "]");
					}
					else
					{
						MAIN.Log (">>>> [CNFR] 서비스 시작 실패. [" + strDn1 + "->" + strDn2 + "] Cause[" + nResult + "-" + ERR.StrFCause(nResult) + "] 추가정보[" + strExtInfo + "]");
					}
					break;
	            
				case (int)EVTTYPE.EVT_STOP_SERVICE:
					MAIN.Log ("**** [CNFR] 서비스 종료. 종료원인[" + nResult + "-" + ERR.StrFCause(nResult) + "]" + " 추가정보[" + strExtInfo + "]");
					break;

				case (int)EVTTYPE.EVT_PTPNT_ADD:
					MAIN.Log ("**** [CNFR] 참여자 회의 참여. 전화번호[" + strDn1 + "] 결과" + nResult + "-" + ERR.StrFCause(nResult) + "]");
					break;

				case (int)EVTTYPE.EVT_PTPNT_DEL:
					MAIN.Log ("**** [CNFR] 참여자 회의 퇴장. 전화번호[" + strDn1 + "] 추가정보[" + strExtInfo + "]");
					break;

				case (int)EVTTYPE.EVT_PTPNT_EXPEL:
					MAIN.Log ("**** [CNFR] 참여자 강퇴. 전화번호[" + strDn1 + "] 추가정보[" + strExtInfo + "]");
					break;

				default:
					MAIN.Log (">>>> [CNFR] 잘못된 이벤트 수신. EvtType[" + nEvtType + "-" + StrEvtType(nEvtType) + "]");
					break;
			}
		}

		private void EvtProc_CIDN(string strDn1, string strDn2)
		{
			MAIN.Log ("==== [CIDN] 전화 수신 <" + strDn1 + "->" + strDn2 + ">");
		}

		private void EvtProc_SendSms(int nResult, string strExtInfo)
		{
			if (nResult == (int)ERRCODE.SUCCESS)
			{
				MAIN.Log ("**** [SMS_MT] SMS 전송 성공");
			}
			else
			{
				MAIN.Log (">>>> [SMS_MT] SMS 전송 실패 : Cause[" + nResult + "-" + ERR.StrFCause(nResult) + "] 추가정보[" + strExtInfo + "]");
			}
		}

		private void EvtProc_AbsNoti(string strCaller, string strCallee, string strCalledTime)
		{
			MAIN.Log ("==== [ABS_NOTI] 부재중 전화 수신 <" + strCaller + "->" + strCallee + "> 수신시간[" + strCalledTime + "]");
		}

		private void EvtProc_RecvSms(string strCaller, string strCallee, string strMessage)
		{
			MAIN.Log ("==== [SMS_RECV] SMS 수신 <" + strCaller + "->" + strCallee + "> 메시지[" + strMessage + "]");
		}

		private void EvtProc_TtsRs(int nEvtType, int nResult, string strSrcDn, string strExtInfo)
		{
			switch (nEvtType)
			{
				case (int)EVTTYPE.EVT_NORMAL:
					MAIN.Log (">>>> [TTS_RS] Cause[" + nResult + "-" + ERR.StrFCause(nResult) + "]");
					break;

				case (int)EVTTYPE.EVT_START_SERVICE:
					if (nResult == (int)ERRCODE.SUCCESS )
					{
						MAIN.Log ("**** [TTS_RS] 서비스 시작 성공");
					}
					else
					{
						MAIN.Log (">>>> [TTS_RS] 서비스 시작 실패. Cause[" + nResult + "-" + ERR.StrFCause(nResult) + "] 추가정보[" + strExtInfo + "]");
					}
					break;

				case (int)EVTTYPE.EVT_STOP_SERVICE:
					MAIN.Log ("**** [TTS_RS] 서비스 종료. 종료원인[" + nResult + "-" + ERR.StrFCause(nResult) + "] 추가정보[" + strExtInfo + "]");
					break;

				case (int)EVTTYPE.EVT_ANSWER:
					if (nResult == (int)ERRCODE.SUCCESS)
					{
						MAIN.Log ("**** [TTS_RS] 응답 결과 성공. Dn[" + strSrcDn + "] DTMF[" + strExtInfo + "]");
					}
					else
					{
						MAIN.Log ("**** [TTS_RS] 응답 결과 실패. Dn[" + strSrcDn + "] 오류원인[" + nResult + "-" + ERR.StrFCause(nResult) + "] 추가정보[" + strExtInfo + "]");
					}
					break;

				default:
					MAIN.Log (">>>> [TTS_RS] 잘못된 이벤트 수신. EvtType[" + nEvtType + "-" + StrEvtType(nEvtType) + "]");
					break;
			}
		}

		private void EvtProc_TtsMsg(int nEvtType, int nResult, string strSrcDn, string strExtInfo)
		{
			switch (nEvtType)
			{
				case (int)EVTTYPE.EVT_NORMAL:
					MAIN.Log (">>>> [TTS_MSG] Cause[" + nResult + "-" + ERR.StrFCause(nResult) + "]");
					break;

				case (int)EVTTYPE.EVT_START_SERVICE:
					if (nResult == (int)ERRCODE.SUCCESS)
					{
						MAIN.Log ("**** [TTS_MSG] 서비스 시작 성공");
					}
					else
					{
						MAIN.Log (">>>> [TTS_MSG] 서비스 시작 실패. Cause[" + nResult + "-" + ERR.StrFCause(nResult) + "] 추가정보[" + strExtInfo + "]");
					}
					break;

				case (int)EVTTYPE.EVT_STOP_SERVICE:
					MAIN.Log ("**** [TTS_MSG] 서비스 종료. 종료원인[" + nResult + "-" + ERR.StrFCause(nResult) + "] 추가정보[" + strExtInfo + "]");
					break;

				case (int)EVTTYPE.EVT_ANSWER:
					if (nResult == (int)ERRCODE.SUCCESS)
					{
						MAIN.Log ("**** [TTS_MSG] 응답 결과 성공. Dn[" + strSrcDn + "] DTMF[" + strExtInfo + "]");
					}
					else
					{
						MAIN.Log ("**** [TTS_MSG] 응답 결과 실패. Dn[" + strSrcDn + "] 오류원인[" + nResult + "-" + ERR.StrFCause(nResult) + "] 추가정보[" + strExtInfo + "]");
					}
					break;

				default:
					MAIN.Log (">>>> [TTS_RS] 잘못된 이벤트 수신. EvtType[" + nEvtType + "-" + StrEvtType(nEvtType) + "]");
					break;
			}
		}

		private void EvtProc_TtsAuth (int nEvtType, int nResult, string strSrcDn, string strExtInfo)
		{
			switch (nEvtType)
			{
				case (int)EVTTYPE.EVT_NORMAL:
					MAIN.Log (">>>> [TTS_AUTH] Cause[" + nResult + "-" + ERR.StrFCause(nResult) + "]");
					break;

				case (int)EVTTYPE.EVT_START_SERVICE:
					if (nResult == (int)ERRCODE.SUCCESS)
					{
						MAIN.Log ("**** [TTS_AUTH] 서비스 시작 성공");
					}
					else
					{
						MAIN.Log (">>>> [TTS_AUTH] 서비스 시작 실패. Cause[" + nResult + "-" + ERR.StrFCause(nResult) + "] 추가정보[" + strExtInfo + "]");
					}
					break;

				case (int)EVTTYPE. EVT_STOP_SERVICE:
					MAIN.Log ("**** [TTS_AUTH] 서비스 종료. 종료원인[" + nResult + "-" + ERR.StrFCause(nResult) + "] 추가정보[" + strExtInfo + "]");
					break;

				default:
					MAIN.Log (">>>> [TTS_RS] 잘못된 이벤트 수신. EvtType[" + nEvtType + "-" + StrEvtType(nEvtType) + "]");
					break;
			}
		}

		private void EvtProc_CallForward(int nResult, string strSrcDn1, string strSrcDn2, string strExtInfo)
		{
			MAIN.Log ("**** [CALL_FWD] 착신전환 설정 결과 Cause[" + nResult + "-" + ERR.StrFCause(nResult) + "] Dn[" + strSrcDn2 + "] Info[" + strExtInfo + "]");
		}
		
		private void EvtProc_TermRec(int nEvtType, int nResult, string strSrcDn, string strDestDn, string strExtInfo)
		{
			switch (nEvtType)
			{
				case (int)EVTTYPE.EVT_NORMAL:
					MAIN.Log (">>>> [TERM_REC] Cause[" + nResult + "-" + ERR.StrFCause(nResult) + "]");
					break;

				case (int)EVTTYPE.EVT_CALL_STATUS:
					MAIN.Log ("**** [TERM_REC] 서비스 상태 : " + strExtInfo);
					break;

				case (int)EVTTYPE.EVT_READY_SERVICE:
					MAIN.Log ("**** [TERM_REC] 착신녹취 준비");
					break;

				case (int)EVTTYPE.EVT_START_SERVICE:
					if (nResult == (int)ERRCODE.SUCCESS)
					{
						MAIN.Log ("**** [TERM_REC] 서비스 시작 성공 [" + strSrcDn + "->" + strDestDn + "]");
					}
					else
					{
						MAIN.Log (">>>> [TERM_REC] 서비스 시작 실패. [" + strSrcDn + "->" + strDestDn + "] Cause[" + nResult + "-" + ERR.StrFCause(nResult) + "] 추가정보[" + strExtInfo + "]");
					}
					break;

				case (int)EVTTYPE.EVT_STOP_SERVICE:
					MAIN.Log ("**** [TERM_REC] 서비스 종료. 종료원인[" + nResult + "-" + ERR.StrFCause(nResult) + "]" + " 추가정보[" + strExtInfo + "]");
					break;

				case (int)EVTTYPE.EVT_START_RECORD:
					if (nResult == (int)ERRCODE.SUCCESS)
					{
						MAIN.Log ("**** [TERM_REC] 녹음 시작. 파일명[" + strExtInfo + "]");
					}
					else
					{
						MAIN.Log ("**** [TERM_REC] 녹음 실패");
					}
					
					break;

				case (int)EVTTYPE.EVT_STOP_RECORD:
					MAIN.Log ("**** [TERM_REC] 녹음 종료. 파일명[" + strExtInfo + "]");
					break;

				default:
					MAIN.Log (">>>> [TERM_REC] 잘못된 이벤트 수신. EvtType[" + nEvtType + "-" + StrEvtType(nEvtType) + "]");
					break;
			}
		}

		private void EvtProc_OrigcallStartNoti(string strCaller, string strCallee, string strExtInfo)
		{
			MAIN.Log ("==== [ORIGCALL_START_NOTI] 발신통화시작 통보 수신 <" + strCaller + "->" + strCallee + "> 호 통화시간[" + strExtInfo + "]");
		}

		private void EvtProc_OrigcallEndNoti(string strCaller, string strCallee, string strExtInfo)
		{
			MAIN.Log ("==== [ORIGCALL_START_NOTI] 발신통화종료 통보 수신 <" + strCaller + "->" + strCallee + "> 호 종료시간[" + strExtInfo + "]");
		}

		private void EvtProc_TermcallStartNoti(string strCaller, string strCallee, string strExtInfo)
		{
			MAIN.Log ("==== [TERMCALL_START_NOTI] 착신통화시작 통보 수신 <" + strCaller + "->" + strCallee + "> 호 통화시간[" + strExtInfo + "]");
		}

		private void EvtProc_TermcallEndNoti(string strCaller, string strCallee, string strExtInfo)
		{
			MAIN.Log ("==== [TERMCALL_START_NOTI] 착신통화종료 통보 수신 <" + strCaller + "->" + strCallee + "> 호 종료시간[" + strExtInfo + "]");
		}
		
		private void EvtProc_CallTransfer(int nEvtType, int nResult, string strCaller, string strCallee, string strExtInfo)
		{
			switch (nEvtType)
			{
				case (int)EVTTYPE.EVT_NORMAL:
					MAIN.Log (">>>> [CALL_TRANSFER] Cause[" + nResult + "-" + ERR.StrFCause(nResult) + "]");
					break;

				case (int)EVTTYPE.EVT_REQUEST_SERVICE:
					if (nResult == (int)ERRCODE.SUCCESS)
					{
						MAIN.Log ("**** [CALL_TRANSFER] 돌려주기 요청에 대한 개시 성공");
					}
					else
					{
						MAIN.Log ("**** [CALL_TRANSFER] 돌려주기 요청에 대한 개시 실패");
					}
					break;
				case (int)EVTTYPE.EVT_START_SERVICE:
					if (nResult == (int)ERRCODE.SUCCESS)
					{
						MAIN.Log ("**** [CALL_TRANSFER] 돌려주기 성공 <" + strCaller + "->" + strCallee + ">");
					}
					else
					{
						MAIN.Log ("**** [CALL_TRANSFER] 돌려주기 실패 <" + strCaller + "->" + strCallee + ">");
					}
					break;
				case (int)EVTTYPE.EVT_STOP_SERVICE:
					if (nResult == (int)ERRCODE.SUCCESS)
					{
						MAIN.Log ("**** [CALL_TRANSFER] 돌려주기 종료 <" + strCaller + "->" + strCallee + ">");
					}
					else if (nResult == (int)ERRCODE.API_FC_FAIL)
					{
						MAIN.Log ("**** [CALL_TRANSFER] 돌려주기 종료 <" + strCaller + "->" + strCallee + "> Cause[" + nResult + "-" + ERR.StrFCause(nResult) + "]");
					}
					else
					{
						MAIN.Log ("**** [CALL_TRANSFER] 돌려주기 종료 <" + strCaller + "->" + strCallee + "> Cause[" + nResult + "-" + ERR.StrFCause(nResult) + "] 추가정보[" + strExtInfo + "]");
					}
					break;
				case (int)EVTTYPE.EVT_READY_SERVICE:
					MAIN.Log ("**** [CALL_TRANSFER] 돌려주기 준비");
					break;
				case (int)EVTTYPE.EVT_ANSWER:
					MAIN.Log ("**** [CALL_TRANSFER] 돌려주기 세션 변경[" + strCaller + "]");
					break;
				default:
					MAIN.Log (">>>> [CALL_TRANSFER] 잘못된 이벤트 수신. EvtType[" + nEvtType + "-" + StrEvtType(nEvtType) + "]");
					break;
			}
		}

		private void EvtProc_CallPickup(int nEvtType, int nResult, string strExtInfo)
		{
			switch (nEvtType)
			{
				case (int)EVTTYPE.EVT_NORMAL:
					MAIN.Log (">>>> [CALL_PICKUP] Cause[" + nResult + "-" + ERR.StrFCause(nResult) + "]");
					break;

				case (int)EVTTYPE.EVT_STOP_SERVICE:
					MAIN.Log ("**** [CALL_PICKUP] 서비스 종료. 종료원인[" + nResult + "-" + ERR.StrFCause(nResult) + "]" + " 추가정보[" + strExtInfo + "]");
					break;
				default:
					MAIN.Log (">>>> [CALL_PICKUP] 잘못된 이벤트 수신. EvtType[" + nEvtType + "-" + StrEvtType(nEvtType) + "]");
					break;
			}
		}
		
		private void EvtProc_SendMms(int nResult, string strExtInfo)
		{
			if (nResult == (int)ERRCODE.SUCCESS)
			{
				MAIN.Log ("**** [MMS_MT] MMS 전송 성공 : 추가정보[" + strExtInfo + "]");
			}
			else
			{
				MAIN.Log (">>>> [MMS_MT] MMS 전송 실패 : Cause[" + nResult + "-" + ERR.StrFCause(nResult) + "] 추가정보[" + strExtInfo + "]");
			}
		}

		private void EvtProc_RecvMms(string strCaller, string strCallee, string strMessage)
		{
			MAIN.Log ("==== [MMS_RECV] MMS 수신 <" + strCaller + "->" + strCallee + "> 다운로드 경로[" + strMessage + "]");
		}

		private void EvtProc_CallBusyNoti(string strCaller, string strCallee, string strStatus)
		{
			MAIN.Log ("==== [CALL_BUSY_NOTI] 통화중 알림 <" + strCaller + "->" + strCallee + "> 호 상태[" + strStatus + "]");
		}

		private void EvtProc_CtrNoti(string strCaller, string strCallee)
		{
			MAIN.Log ("==== [CTR_NOTI] 돌려주기 알림 <" + strCaller + "->" + strCallee + ">");
		}

		private void EvtProc_CpuNoti(string strCaller, string strCallee)
		{
			MAIN.Log ("==== [CPU_NOTI] 당겨받기 알림 <" + strCaller + "->" + strCallee + ">");
		}

		private void EvtProc_GetSvcInfo(int nResult)
		{
			if (nResult == (int)ERRCODE.SUCCESS)
			{
				MAIN.Log ("**** [IMS_SVC_GET_SERVICE_INFO] 가용 서비스 조회 성공");
			}
			else if (nResult == (int)ERRCODE.API_FC_FAIL)
			{
				MAIN.Log ("**** [IMS_SVC_GET_SERVICE_INFO] 가용 서비스 조회 실패");
			}
			else
			{
				MAIN.Log ("**** [IMS_SVC_GET_SERVICE_INFO] 가용 서비스 조회 실패");
			}
		}
	}
}
