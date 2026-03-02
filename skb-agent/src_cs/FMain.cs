using System;
using System.Drawing;
using System.Collections;
using System.ComponentModel;
using System.Windows.Forms;
using System.Data;
using System.Runtime.InteropServices;

namespace SKB_OpenAPI_IMS_Sample
{
	public class FMain : System.Windows.Forms.Form
	{
		private System.Windows.Forms.ListBox lstLog;
		private System.Windows.Forms.GroupBox groupBox1;
		private System.Windows.Forms.Button btnUnsetRest;
		private System.Windows.Forms.Button btnSetRest;
		private System.Windows.Forms.Button btnLogout;
		private System.Windows.Forms.Button btnLogin;
		private System.Windows.Forms.Button btnApiInit;
		private System.Windows.Forms.Label label3;
		private System.Windows.Forms.TextBox txtAppKey;
		private System.Windows.Forms.Label label2;
		private System.Windows.Forms.TextBox txtPasswd;
		private System.Windows.Forms.TextBox txtUserId;
		private System.Windows.Forms.Label label1;
		private System.Windows.Forms.TabPage tabPage1;
		private System.Windows.Forms.TabPage tabPage7;
		private System.Windows.Forms.TabPage tabPage2;
		private System.Windows.Forms.TabPage tabPage6;
		private System.Windows.Forms.TabPage tabPage5;
		private System.Windows.Forms.TabPage tabPage4;
		private System.Windows.Forms.TabPage tabPage8;
		private System.Windows.Forms.TabPage tabPage9;
		private System.Windows.Forms.TabPage tabPage10;
		private System.ComponentModel.IContainer components;
		private System.Windows.Forms.Label label4;
		private System.Windows.Forms.Label label5;
		private System.Windows.Forms.Label label6;
		private System.Windows.Forms.Label label7;
		private System.Windows.Forms.Button btnUserMng_ChgPasswd;
		private System.Windows.Forms.Button btnUserMng_CreateUser;
		private System.Windows.Forms.Button btnUserMng_TtsAuth;
		private System.Windows.Forms.Button btnUserMng_SmsAuth;
		private System.Windows.Forms.TextBox txtUserMng_Passwd;
		private System.Windows.Forms.TextBox txtUserMng_UserId;
		private System.Windows.Forms.TextBox txtUserMng_AuthNo;
		private System.Windows.Forms.TextBox txtUserMng_TelNum;
		private System.Windows.Forms.Timer tmrEvent;

		private System.Windows.Forms.TabControl tabMain;
		private System.Windows.Forms.TabPage tabPage11;
		private System.Windows.Forms.Label label8;
		private System.Windows.Forms.Label label9;
		private System.Windows.Forms.GroupBox groupBox2;
		private System.Windows.Forms.Label label10;
		private System.Windows.Forms.Label label11;
		private System.Windows.Forms.Label label12;
		private System.Windows.Forms.Label label14;
		private System.Windows.Forms.Label label15;
		private System.Windows.Forms.Label label16;
		private System.Windows.Forms.Label label17;
		private System.Windows.Forms.Label label18;
		private System.Windows.Forms.Label label19;
		private System.Windows.Forms.Label label20;
		private System.Windows.Forms.Label label21;
		private System.Windows.Forms.Label label24;
		private System.Windows.Forms.Label label25;
		private System.Windows.Forms.Label label26;
		private System.Windows.Forms.Label label27;
		private System.Windows.Forms.Label label22;
		private System.Windows.Forms.Label label29;
		private System.Windows.Forms.Label label23;
		private System.Windows.Forms.Label label28;
		private System.Windows.Forms.GroupBox groupBox3;
		private System.Windows.Forms.GroupBox groupBox4;
		private System.Windows.Forms.TextBox txtClickCall_TelNum;
		private System.Windows.Forms.RadioButton rdoClickCall_False;
		private System.Windows.Forms.RadioButton rdoClickCall_True;
		private System.Windows.Forms.RadioButton rdoClickCall_Ready;
		private System.Windows.Forms.CheckBox chkClickCall_EventF;
		private System.Windows.Forms.Button btnClickCall_Start;
		private System.Windows.Forms.Button btnClickCall_Stop;
		private System.Windows.Forms.Button btnClickCall_StartRec;
		private System.Windows.Forms.Button btnClickCall_StopRec;
		private System.Windows.Forms.Button btnClickCall_Profile;
		private System.Windows.Forms.Button btnClickCall_Status;
		private System.Windows.Forms.ComboBox cboClickCall_Profile;
		private System.Windows.Forms.ComboBox cboCnfr_Profile;
		private System.Windows.Forms.Button btnCnfr_Status;
		private System.Windows.Forms.Button btnCnfr_Profile;
		private System.Windows.Forms.Button btnCnfr_Del;
		private System.Windows.Forms.Button btnCnfr_Add;
		private System.Windows.Forms.Button btnCnfr_Stop;
		private System.Windows.Forms.Button btnCnfr_Start;
		private System.Windows.Forms.CheckBox chkCnfr_EventF;
		private System.Windows.Forms.TextBox txtCnfr_TelNum;
		private System.Windows.Forms.ComboBox cboSmsMT_Profile;
		private System.Windows.Forms.Button btnSmsMT_Profile;
		private System.Windows.Forms.Button btnSmsMT_Send;
		private System.Windows.Forms.TextBox txtSmsMT_TelNum;
		private System.Windows.Forms.TextBox txtSmsMT_Message;
		private System.Windows.Forms.TextBox txtTtsRs_Message;
		private System.Windows.Forms.TextBox txtTtsRs_TelNum;
		private System.Windows.Forms.ComboBox cboTtsRs_Profile;
		private System.Windows.Forms.Button btnTtsRs_Profile;
		private System.Windows.Forms.Button btnTtsRs_Send;
		private System.Windows.Forms.TextBox txtTtsRs_UserName;
		private System.Windows.Forms.TextBox txtTtsRs_Dtmf;
		private System.Windows.Forms.CheckBox chkTtsRs_EventF;
		private System.Windows.Forms.CheckBox chkTtsMsg_EventF;
		private System.Windows.Forms.TextBox txtTtsMsg_Message;
		private System.Windows.Forms.TextBox txtTtsMsg_TelNum;
		private System.Windows.Forms.ComboBox cboTtsMsg_Profile;
		private System.Windows.Forms.Button btnTtsMsg_Profile;
		private System.Windows.Forms.Button btnTtsMsg_Send;
		private System.Windows.Forms.TextBox txtTtsMsg_UserName;
		private System.Windows.Forms.CheckBox chkTtsMsg_ConfirmF;
		private System.Windows.Forms.TextBox txtTtsAuth_No;
		private System.Windows.Forms.Button btnTtsAuth_Send;
		private System.Windows.Forms.TextBox txtTtsAuth_TelNum;
		private System.Windows.Forms.TextBox txtCF_TelNum;
		private System.Windows.Forms.ComboBox cboCF_Type;
		private System.Windows.Forms.Button btnCF_Set;
		private System.Windows.Forms.Button btnCF_Query;
		private System.Windows.Forms.Button btnCF_Unset;
		private System.Windows.Forms.Button btnTermRec_Stop;
		private System.Windows.Forms.Button btnTermRec_Status;
		private System.Windows.Forms.Button btnTermRec_StopRec;
		private System.Windows.Forms.Button btnTermRec_StartRec;
		public  System.Windows.Forms.ListBox lstDnMng_SubsDn;
		public  System.Windows.Forms.ListBox lstDnMng_MonDn;
		private System.Windows.Forms.Button btnDnMng_Add;
		private System.Windows.Forms.Button btnDnMng_Del;
		private System.Windows.Forms.Button btnDnMng_Query;

		private CErrorCode	ERR = new CErrorCode();
		private CService	SVC = new CService();
		private CEvent		EVT;
		private System.Windows.Forms.CheckBox chkClickCall_AutoAnswerF;
		private System.Windows.Forms.TabPage tabPage3;
		private System.Windows.Forms.TabPage tabPage12;
		private System.Windows.Forms.TabPage tabPage13;
		private System.Windows.Forms.TextBox txtCallTf_TelNum;
		private System.Windows.Forms.Label label30;
		private System.Windows.Forms.Button btnCallTf_Query;
		private System.Windows.Forms.CheckBox chkCallPickup_AutoAnswerF;
		private System.Windows.Forms.Button btnCallPickup_Query;
		private System.Windows.Forms.TextBox txtMmsMT_Message;
		private System.Windows.Forms.Label label31;
		private System.Windows.Forms.TextBox txtMmsMT_TelNum;
		private System.Windows.Forms.Label label32;
		private System.Windows.Forms.Label label33;
		private System.Windows.Forms.ComboBox cboMmsMT_Profile;
		private System.Windows.Forms.Button btnMmsMT_Send;
		private System.Windows.Forms.Button btnMmsMT_Profile;
		private System.Windows.Forms.Label label13;
		private System.Windows.Forms.GroupBox groupBox5;
		private System.Windows.Forms.RadioButton rdoCallTransfer_True;
		private System.Windows.Forms.RadioButton rdoCallTransfer_False;
		private System.Windows.Forms.GroupBox groupBox6;
		private System.Windows.Forms.RadioButton rdoCallPickup_True;
		private System.Windows.Forms.RadioButton rdoCallPickup_False;
		private System.Windows.Forms.Button btnGetRest;
		private _EVTMSG		m_stEvtMsg  = new _EVTMSG();
		private System.Windows.Forms.Button button1;
		private _STREST	    m_stRest = new _STREST();
		private _STVERSION  m_stVersion = new _STVERSION();

		//-------------------------------------
		// 일반 및 사용자 관리 관련 API
		//-------------------------------------
		[DllImport("SKB_OpenAPI_IMS.dll")]
		public static extern int IMS_Init(string strAppKey);

		[DllImport("SKB_OpenAPI_IMS.dll")]
		public static extern int IMS_Close();

		[DllImport("SKB_OpenAPI_IMS.dll")]
		public static extern int IMS_Login(string strUserId, string strPasswd);

		[DllImport("SKB_OpenAPI_IMS.dll")]
		public static extern int IMS_Logout();

		[DllImport("SKB_OpenAPI_IMS.dll")]
		public static extern int IMS_CreateUser(string strUserId, string strPasswd, string strTelNum, string strAuthNo);

		[DllImport("SKB_OpenAPI_IMS.dll")]
		public static extern int IMS_ChgPasswd(string strUserId, string strPasswd, string strTelNum, string strAuthNo);

		[DllImport("SKB_OpenAPI_IMS.dll")]
		public static extern int IMS_GetEvent(ref _EVTMSG stEvtMsg);

		[DllImport("SKB_OpenAPI_IMS.dll")]
		public static extern int IMS_SetRest(int nFlag);

		[DllImport("SKB_OpenAPI_IMS.dll")]
		public static extern int IMS_GetProfile(string strServiceName, string strProfileName);

		[DllImport("SKB_OpenAPI_IMS.dll")]
		public static extern int IMS_AuthSms(string strTelNum);

		[DllImport("SKB_OpenAPI_IMS.dll")]
		public static extern int IMS_AuthTts(string strTelNum);

		[DllImport("SKB_OpenAPI_IMS.dll")]
		public static extern int IMS_GetRest(ref _STREST stRest);

		[DllImport("SKB_OpenAPI_IMS.dll")]
		public static extern int IMS_GetVersion(ref _STVERSION stVersion);

		//-------------------------------------
		// 클릭콜관련 API
		//-------------------------------------
		[DllImport("SKB_OpenAPI_IMS.dll")]
		public static extern int IMS_ClickCall_Start(string strDestDn, int nRecordF, int nEventF, int nAutoAnswerF);

		[DllImport("SKB_OpenAPI_IMS.dll")]
		public static extern int IMS_ClickCall_Stop();

		[DllImport("SKB_OpenAPI_IMS.dll")]
		public static extern int IMS_ClickCall_StartRecord();

		[DllImport("SKB_OpenAPI_IMS.dll")]
		public static extern int IMS_ClickCall_StopRecord();

		[DllImport("SKB_OpenAPI_IMS.dll")]
		public static extern int IMS_ClickCall_CallStatus();

		//-------------------------------------
		// 회의통화관련 API
		//-------------------------------------
		[DllImport("SKB_OpenAPI_IMS.dll")]
		public static extern int IMS_Cnfr_Start(string strCallee, int nEventF);

		[DllImport("SKB_OpenAPI_IMS.dll")]
		public static extern int IMS_Cnfr_Stop();

		[DllImport("SKB_OpenAPI_IMS.dll")]
		public static extern int IMS_Cnfr_CallStatus();

		[DllImport("SKB_OpenAPI_IMS.dll")]
		public static extern int IMS_Cnfr_Add(string strCallee);

		[DllImport("SKB_OpenAPI_IMS.dll")]
		public static extern int IMS_Cnfr_Del(string strCallee);

		//-------------------------------------
		// SMS MT 관련 API
		//-------------------------------------
		[DllImport("SKB_OpenAPI_IMS.dll")]
		public static extern int IMS_SendSms(string strCallee, string strMessage);

		//-------------------------------------
		// TTS 설문조사관련 API
		//-------------------------------------
		[DllImport("SKB_OpenAPI_IMS.dll")]
		public static extern int IMS_TtsRs(string strUserName, string strCallee, string strDtmf, int nEventF, string strMessage);

		//-------------------------------------
		// TTS메시지관련 API
		//-------------------------------------
		[DllImport("SKB_OpenAPI_IMS.dll")]
		public static extern int IMS_TtsMsg(string strUserName, string strCallee, int nEventF, string strMessage);

		//-------------------------------------
		// TTS인증관련 API
		//-------------------------------------
		[DllImport("SKB_OpenAPI_IMS.dll")]
		public static extern int IMS_TtsAuth(string strCallee, string strAuthNo);

		//-------------------------------------
		// 착신전환관련 API
		//-------------------------------------
		[DllImport("SKB_OpenAPI_IMS.dll")]
		public static extern int IMS_CallForward_Get();

		[DllImport("SKB_OpenAPI_IMS.dll")]
		public static extern int IMS_CallForward_Reg(string strCfType, string strCfDn);

		[DllImport("SKB_OpenAPI_IMS.dll")]
		public static extern int IMS_CallForward_Rel(string strCfType);

		//-------------------------------------
		// 착신녹취관련 API
		//-------------------------------------
		[DllImport("SKB_OpenAPI_IMS.dll")]
		public static extern int IMS_TermRec_Start();

		[DllImport("SKB_OpenAPI_IMS.dll")]
		public static extern int IMS_TermRec_Stop();

		[DllImport("SKB_OpenAPI_IMS.dll")]
		public static extern int IMS_TermRec_CallStatus();

		[DllImport("SKB_OpenAPI_IMS.dll")]
		public static extern int IMS_TermRec_StopService();

		//-------------------------------------
		// DN관리
		//-------------------------------------
		[DllImport("SKB_OpenAPI_IMS.dll")]
		public static extern int IMS_QrySubDnList();

		[DllImport("SKB_OpenAPI_IMS.dll")]
		public static extern int IMS_QryMonDnList();

		[DllImport("SKB_OpenAPI_IMS.dll")]
		public static extern int IMS_AddMonDn(string strDn);

		[DllImport("SKB_OpenAPI_IMS.dll")]
		public static extern int IMS_DelMonDn(string strDn);
		
		//-------------------------------------
		// 돌려주기
		//-------------------------------------
		[DllImport("SKB_OpenAPI_IMS.dll")]
		public static extern int IMS_CallTransfer_Start(string strDn, int nDisplayType);
		
		//-------------------------------------
		// 당겨받기
		//-------------------------------------
		[DllImport("SKB_OpenAPI_IMS.dll")]
		public static extern int IMS_CallPickup_Start(int nAutoAnswerF, int nDisplayType);
		
		//-------------------------------------
		// MMS MT 관련 API
		//-------------------------------------
		[DllImport("SKB_OpenAPI_IMS.dll")]
		public static extern int IMS_SendMms(string strCallee, string strMessage);

		public FMain()
		{
			InitializeComponent();
			EVT = new CEvent(this, ERR, SVC);

			cboCF_Type.SelectedIndex = 0;
			cboTtsMsg_Profile.SelectedIndex = 0;
			cboTtsRs_Profile.SelectedIndex = 0;
			cboClickCall_Profile.SelectedIndex = 0;
			cboSmsMT_Profile.SelectedIndex = 0;
			cboCnfr_Profile.SelectedIndex = 0;
			cboMmsMT_Profile.SelectedIndex = 0;
		}

		protected override void Dispose( bool disposing )
		{		
			IMS_Close();

			if( disposing )
			{
				if (components != null) 
				{
					components.Dispose();
				}	
			}
			base.Dispose( disposing );
		}

		#region Windows Form Designer generated code
		/// <summary>
		/// 디자이너 지원에 필요한 메서드입니다.
		/// 이 메서드의 내용을 코드 편집기로 수정하지 마십시오.
		/// </summary>
		private void InitializeComponent()
		{
			this.components = new System.ComponentModel.Container();
			this.lstLog = new System.Windows.Forms.ListBox();
			this.groupBox1 = new System.Windows.Forms.GroupBox();
			this.button1 = new System.Windows.Forms.Button();
			this.btnGetRest = new System.Windows.Forms.Button();
			this.btnUnsetRest = new System.Windows.Forms.Button();
			this.btnSetRest = new System.Windows.Forms.Button();
			this.btnLogout = new System.Windows.Forms.Button();
			this.btnLogin = new System.Windows.Forms.Button();
			this.btnApiInit = new System.Windows.Forms.Button();
			this.label3 = new System.Windows.Forms.Label();
			this.txtAppKey = new System.Windows.Forms.TextBox();
			this.label2 = new System.Windows.Forms.Label();
			this.txtPasswd = new System.Windows.Forms.TextBox();
			this.txtUserId = new System.Windows.Forms.TextBox();
			this.label1 = new System.Windows.Forms.Label();
			this.tabMain = new System.Windows.Forms.TabControl();
			this.tabPage1 = new System.Windows.Forms.TabPage();
			this.btnUserMng_ChgPasswd = new System.Windows.Forms.Button();
			this.btnUserMng_CreateUser = new System.Windows.Forms.Button();
			this.btnUserMng_TtsAuth = new System.Windows.Forms.Button();
			this.btnUserMng_SmsAuth = new System.Windows.Forms.Button();
			this.txtUserMng_Passwd = new System.Windows.Forms.TextBox();
			this.txtUserMng_UserId = new System.Windows.Forms.TextBox();
			this.txtUserMng_AuthNo = new System.Windows.Forms.TextBox();
			this.txtUserMng_TelNum = new System.Windows.Forms.TextBox();
			this.label7 = new System.Windows.Forms.Label();
			this.label6 = new System.Windows.Forms.Label();
			this.label5 = new System.Windows.Forms.Label();
			this.label4 = new System.Windows.Forms.Label();
			this.tabPage13 = new System.Windows.Forms.TabPage();
			this.txtMmsMT_Message = new System.Windows.Forms.TextBox();
			this.label31 = new System.Windows.Forms.Label();
			this.txtMmsMT_TelNum = new System.Windows.Forms.TextBox();
			this.label32 = new System.Windows.Forms.Label();
			this.cboMmsMT_Profile = new System.Windows.Forms.ComboBox();
			this.btnMmsMT_Profile = new System.Windows.Forms.Button();
			this.btnMmsMT_Send = new System.Windows.Forms.Button();
			this.label33 = new System.Windows.Forms.Label();
			this.tabPage4 = new System.Windows.Forms.TabPage();
			this.chkTtsRs_EventF = new System.Windows.Forms.CheckBox();
			this.label21 = new System.Windows.Forms.Label();
			this.txtTtsRs_Dtmf = new System.Windows.Forms.TextBox();
			this.label20 = new System.Windows.Forms.Label();
			this.txtTtsRs_Message = new System.Windows.Forms.TextBox();
			this.label16 = new System.Windows.Forms.Label();
			this.txtTtsRs_TelNum = new System.Windows.Forms.TextBox();
			this.label17 = new System.Windows.Forms.Label();
			this.cboTtsRs_Profile = new System.Windows.Forms.ComboBox();
			this.btnTtsRs_Profile = new System.Windows.Forms.Button();
			this.btnTtsRs_Send = new System.Windows.Forms.Button();
			this.label18 = new System.Windows.Forms.Label();
			this.txtTtsRs_UserName = new System.Windows.Forms.TextBox();
			this.label19 = new System.Windows.Forms.Label();
			this.tabPage11 = new System.Windows.Forms.TabPage();
			this.btnTermRec_StartRec = new System.Windows.Forms.Button();
			this.btnTermRec_Stop = new System.Windows.Forms.Button();
			this.btnTermRec_Status = new System.Windows.Forms.Button();
			this.btnTermRec_StopRec = new System.Windows.Forms.Button();
			this.tabPage12 = new System.Windows.Forms.TabPage();
			this.groupBox6 = new System.Windows.Forms.GroupBox();
			this.rdoCallPickup_True = new System.Windows.Forms.RadioButton();
			this.rdoCallPickup_False = new System.Windows.Forms.RadioButton();
			this.btnCallPickup_Query = new System.Windows.Forms.Button();
			this.chkCallPickup_AutoAnswerF = new System.Windows.Forms.CheckBox();
			this.tabPage10 = new System.Windows.Forms.TabPage();
			this.btnCF_Unset = new System.Windows.Forms.Button();
			this.txtCF_TelNum = new System.Windows.Forms.TextBox();
			this.label23 = new System.Windows.Forms.Label();
			this.cboCF_Type = new System.Windows.Forms.ComboBox();
			this.btnCF_Set = new System.Windows.Forms.Button();
			this.btnCF_Query = new System.Windows.Forms.Button();
			this.label28 = new System.Windows.Forms.Label();
			this.tabPage2 = new System.Windows.Forms.TabPage();
			this.chkClickCall_AutoAnswerF = new System.Windows.Forms.CheckBox();
			this.cboClickCall_Profile = new System.Windows.Forms.ComboBox();
			this.btnClickCall_Status = new System.Windows.Forms.Button();
			this.btnClickCall_Profile = new System.Windows.Forms.Button();
			this.btnClickCall_StopRec = new System.Windows.Forms.Button();
			this.btnClickCall_StartRec = new System.Windows.Forms.Button();
			this.btnClickCall_Stop = new System.Windows.Forms.Button();
			this.btnClickCall_Start = new System.Windows.Forms.Button();
			this.chkClickCall_EventF = new System.Windows.Forms.CheckBox();
			this.groupBox2 = new System.Windows.Forms.GroupBox();
			this.rdoClickCall_Ready = new System.Windows.Forms.RadioButton();
			this.rdoClickCall_True = new System.Windows.Forms.RadioButton();
			this.rdoClickCall_False = new System.Windows.Forms.RadioButton();
			this.label9 = new System.Windows.Forms.Label();
			this.txtClickCall_TelNum = new System.Windows.Forms.TextBox();
			this.label8 = new System.Windows.Forms.Label();
			this.tabPage5 = new System.Windows.Forms.TabPage();
			this.txtSmsMT_Message = new System.Windows.Forms.TextBox();
			this.label15 = new System.Windows.Forms.Label();
			this.txtSmsMT_TelNum = new System.Windows.Forms.TextBox();
			this.label14 = new System.Windows.Forms.Label();
			this.cboSmsMT_Profile = new System.Windows.Forms.ComboBox();
			this.btnSmsMT_Profile = new System.Windows.Forms.Button();
			this.btnSmsMT_Send = new System.Windows.Forms.Button();
			this.label12 = new System.Windows.Forms.Label();
			this.tabPage7 = new System.Windows.Forms.TabPage();
			this.btnDnMng_Query = new System.Windows.Forms.Button();
			this.btnDnMng_Del = new System.Windows.Forms.Button();
			this.btnDnMng_Add = new System.Windows.Forms.Button();
			this.groupBox4 = new System.Windows.Forms.GroupBox();
			this.lstDnMng_MonDn = new System.Windows.Forms.ListBox();
			this.groupBox3 = new System.Windows.Forms.GroupBox();
			this.lstDnMng_SubsDn = new System.Windows.Forms.ListBox();
			this.tabPage8 = new System.Windows.Forms.TabPage();
			this.chkTtsMsg_ConfirmF = new System.Windows.Forms.CheckBox();
			this.chkTtsMsg_EventF = new System.Windows.Forms.CheckBox();
			this.txtTtsMsg_Message = new System.Windows.Forms.TextBox();
			this.label24 = new System.Windows.Forms.Label();
			this.txtTtsMsg_TelNum = new System.Windows.Forms.TextBox();
			this.label25 = new System.Windows.Forms.Label();
			this.cboTtsMsg_Profile = new System.Windows.Forms.ComboBox();
			this.btnTtsMsg_Profile = new System.Windows.Forms.Button();
			this.btnTtsMsg_Send = new System.Windows.Forms.Button();
			this.label26 = new System.Windows.Forms.Label();
			this.txtTtsMsg_UserName = new System.Windows.Forms.TextBox();
			this.label27 = new System.Windows.Forms.Label();
			this.tabPage6 = new System.Windows.Forms.TabPage();
			this.label13 = new System.Windows.Forms.Label();
			this.cboCnfr_Profile = new System.Windows.Forms.ComboBox();
			this.btnCnfr_Status = new System.Windows.Forms.Button();
			this.btnCnfr_Profile = new System.Windows.Forms.Button();
			this.btnCnfr_Del = new System.Windows.Forms.Button();
			this.btnCnfr_Add = new System.Windows.Forms.Button();
			this.btnCnfr_Stop = new System.Windows.Forms.Button();
			this.btnCnfr_Start = new System.Windows.Forms.Button();
			this.chkCnfr_EventF = new System.Windows.Forms.CheckBox();
			this.label10 = new System.Windows.Forms.Label();
			this.txtCnfr_TelNum = new System.Windows.Forms.TextBox();
			this.label11 = new System.Windows.Forms.Label();
			this.tabPage9 = new System.Windows.Forms.TabPage();
			this.txtTtsAuth_No = new System.Windows.Forms.TextBox();
			this.label22 = new System.Windows.Forms.Label();
			this.btnTtsAuth_Send = new System.Windows.Forms.Button();
			this.txtTtsAuth_TelNum = new System.Windows.Forms.TextBox();
			this.label29 = new System.Windows.Forms.Label();
			this.tabPage3 = new System.Windows.Forms.TabPage();
			this.groupBox5 = new System.Windows.Forms.GroupBox();
			this.rdoCallTransfer_True = new System.Windows.Forms.RadioButton();
			this.rdoCallTransfer_False = new System.Windows.Forms.RadioButton();
			this.btnCallTf_Query = new System.Windows.Forms.Button();
			this.txtCallTf_TelNum = new System.Windows.Forms.TextBox();
			this.label30 = new System.Windows.Forms.Label();
			this.tmrEvent = new System.Windows.Forms.Timer(this.components);
			this.groupBox1.SuspendLayout();
			this.tabMain.SuspendLayout();
			this.tabPage1.SuspendLayout();
			this.tabPage13.SuspendLayout();
			this.tabPage4.SuspendLayout();
			this.tabPage11.SuspendLayout();
			this.tabPage12.SuspendLayout();
			this.groupBox6.SuspendLayout();
			this.tabPage10.SuspendLayout();
			this.tabPage2.SuspendLayout();
			this.groupBox2.SuspendLayout();
			this.tabPage5.SuspendLayout();
			this.tabPage7.SuspendLayout();
			this.groupBox4.SuspendLayout();
			this.groupBox3.SuspendLayout();
			this.tabPage8.SuspendLayout();
			this.tabPage6.SuspendLayout();
			this.tabPage9.SuspendLayout();
			this.tabPage3.SuspendLayout();
			this.groupBox5.SuspendLayout();
			this.SuspendLayout();
			// 
			// lstLog
			// 
			this.lstLog.Font = new System.Drawing.Font("굴림체", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((System.Byte)(129)));
			this.lstLog.IntegralHeight = false;
			this.lstLog.ItemHeight = 15;
			this.lstLog.Location = new System.Drawing.Point(0, 291);
			this.lstLog.Name = "lstLog";
			this.lstLog.Size = new System.Drawing.Size(1549, 594);
			this.lstLog.TabIndex = 4;
			this.lstLog.SelectedIndexChanged += new System.EventHandler(this.lstLog_SelectedIndexChanged);
			// 
			// groupBox1
			// 
			this.groupBox1.Controls.AddRange(new System.Windows.Forms.Control[] {
																					this.button1,
																					this.btnGetRest,
																					this.btnUnsetRest,
																					this.btnSetRest,
																					this.btnLogout,
																					this.btnLogin,
																					this.btnApiInit,
																					this.label3,
																					this.txtAppKey,
																					this.label2,
																					this.txtPasswd,
																					this.txtUserId,
																					this.label1});
			this.groupBox1.Location = new System.Drawing.Point(0, 11);
			this.groupBox1.Name = "groupBox1";
			this.groupBox1.Size = new System.Drawing.Size(1549, 72);
			this.groupBox1.TabIndex = 3;
			this.groupBox1.TabStop = false;
			this.groupBox1.Text = "로그인 정보";
			// 
			// button1
			// 
			this.button1.Font = new System.Drawing.Font("굴림", 7.8F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((System.Byte)(129)));
			this.button1.Location = new System.Drawing.Point(1328, 26);
			this.button1.Name = "button1";
			this.button1.Size = new System.Drawing.Size(100, 33);
			this.button1.TabIndex = 12;
			this.button1.Text = "API버전 조회";
			this.button1.Click += new System.EventHandler(this.button1_Click);
			// 
			// btnGetRest
			// 
			this.btnGetRest.Font = new System.Drawing.Font("굴림", 7.8F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((System.Byte)(129)));
			this.btnGetRest.Location = new System.Drawing.Point(1064, 26);
			this.btnGetRest.Name = "btnGetRest";
			this.btnGetRest.Size = new System.Drawing.Size(80, 33);
			this.btnGetRest.TabIndex = 11;
			this.btnGetRest.Text = "부재중조회";
			this.btnGetRest.Click += new System.EventHandler(this.btnGetRest_Click);
			// 
			// btnUnsetRest
			// 
			this.btnUnsetRest.Font = new System.Drawing.Font("굴림", 7.8F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((System.Byte)(129)));
			this.btnUnsetRest.Location = new System.Drawing.Point(1240, 26);
			this.btnUnsetRest.Name = "btnUnsetRest";
			this.btnUnsetRest.Size = new System.Drawing.Size(80, 33);
			this.btnUnsetRest.TabIndex = 10;
			this.btnUnsetRest.Text = "부재중해제";
			this.btnUnsetRest.Click += new System.EventHandler(this.btnUnsetRest_Click);
			// 
			// btnSetRest
			// 
			this.btnSetRest.Font = new System.Drawing.Font("굴림", 7.8F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((System.Byte)(129)));
			this.btnSetRest.Location = new System.Drawing.Point(1150, 26);
			this.btnSetRest.Name = "btnSetRest";
			this.btnSetRest.Size = new System.Drawing.Size(80, 33);
			this.btnSetRest.TabIndex = 9;
			this.btnSetRest.Text = "부재중설정";
			this.btnSetRest.Click += new System.EventHandler(this.btnSetRest_Click);
			// 
			// btnLogout
			// 
			this.btnLogout.Font = new System.Drawing.Font("굴림", 7.8F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((System.Byte)(129)));
			this.btnLogout.Location = new System.Drawing.Point(976, 26);
			this.btnLogout.Name = "btnLogout";
			this.btnLogout.Size = new System.Drawing.Size(80, 33);
			this.btnLogout.TabIndex = 8;
			this.btnLogout.Text = "로그아웃";
			this.btnLogout.Click += new System.EventHandler(this.btnLogout_Click);
			// 
			// btnLogin
			// 
			this.btnLogin.Font = new System.Drawing.Font("굴림", 7.8F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((System.Byte)(129)));
			this.btnLogin.Location = new System.Drawing.Point(888, 26);
			this.btnLogin.Name = "btnLogin";
			this.btnLogin.Size = new System.Drawing.Size(80, 33);
			this.btnLogin.TabIndex = 7;
			this.btnLogin.Text = "로그인";
			this.btnLogin.Click += new System.EventHandler(this.btnLogin_Click);
			// 
			// btnApiInit
			// 
			this.btnApiInit.Font = new System.Drawing.Font("굴림", 7.8F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((System.Byte)(129)));
			this.btnApiInit.Location = new System.Drawing.Point(800, 26);
			this.btnApiInit.Name = "btnApiInit";
			this.btnApiInit.Size = new System.Drawing.Size(80, 33);
			this.btnApiInit.TabIndex = 6;
			this.btnApiInit.Text = "API초기화";
			this.btnApiInit.Click += new System.EventHandler(this.btnApiInit_Click);
			// 
			// label3
			// 
			this.label3.AutoSize = true;
			this.label3.Location = new System.Drawing.Point(506, 33);
			this.label3.Name = "label3";
			this.label3.Size = new System.Drawing.Size(74, 18);
			this.label3.TabIndex = 5;
			this.label3.Text = "APP-KEY";
			// 
			// txtAppKey
			// 
			this.txtAppKey.Location = new System.Drawing.Point(598, 26);
			this.txtAppKey.MaxLength = 64;
			this.txtAppKey.Name = "txtAppKey";
			this.txtAppKey.Size = new System.Drawing.Size(193, 25);
			this.txtAppKey.TabIndex = 4;
			this.txtAppKey.Text = "";
			// 
			// label2
			// 
			this.label2.AutoSize = true;
			this.label2.Location = new System.Drawing.Point(261, 33);
			this.label2.Name = "label2";
			this.label2.Size = new System.Drawing.Size(67, 18);
			this.label2.TabIndex = 3;
			this.label2.Text = "비밀번호";
			// 
			// txtPasswd
			// 
			this.txtPasswd.Location = new System.Drawing.Point(341, 26);
			this.txtPasswd.MaxLength = 32;
			this.txtPasswd.Name = "txtPasswd";
			this.txtPasswd.Size = new System.Drawing.Size(130, 25);
			this.txtPasswd.TabIndex = 2;
			this.txtPasswd.Text = "";
			// 
			// txtUserId
			// 
			this.txtUserId.Location = new System.Drawing.Point(99, 26);
			this.txtUserId.MaxLength = 32;
			this.txtUserId.Name = "txtUserId";
			this.txtUserId.Size = new System.Drawing.Size(138, 25);
			this.txtUserId.TabIndex = 1;
			this.txtUserId.Text = "";
			// 
			// label1
			// 
			this.label1.AutoSize = true;
			this.label1.Location = new System.Drawing.Point(23, 33);
			this.label1.Name = "label1";
			this.label1.Size = new System.Drawing.Size(67, 18);
			this.label1.TabIndex = 0;
			this.label1.Text = "사용자ID";
			// 
			// tabMain
			// 
			this.tabMain.Controls.AddRange(new System.Windows.Forms.Control[] {
																				  this.tabPage1,
																				  this.tabPage13,
																				  this.tabPage4,
																				  this.tabPage11,
																				  this.tabPage12,
																				  this.tabPage10,
																				  this.tabPage2,
																				  this.tabPage5,
																				  this.tabPage7,
																				  this.tabPage8,
																				  this.tabPage6,
																				  this.tabPage9,
																				  this.tabPage3});
			this.tabMain.Location = new System.Drawing.Point(0, 89);
			this.tabMain.Name = "tabMain";
			this.tabMain.SelectedIndex = 0;
			this.tabMain.Size = new System.Drawing.Size(1549, 201);
			this.tabMain.TabIndex = 5;
			// 
			// tabPage1
			// 
			this.tabPage1.Controls.AddRange(new System.Windows.Forms.Control[] {
																				   this.btnUserMng_ChgPasswd,
																				   this.btnUserMng_CreateUser,
																				   this.btnUserMng_TtsAuth,
																				   this.btnUserMng_SmsAuth,
																				   this.txtUserMng_Passwd,
																				   this.txtUserMng_UserId,
																				   this.txtUserMng_AuthNo,
																				   this.txtUserMng_TelNum,
																				   this.label7,
																				   this.label6,
																				   this.label5,
																				   this.label4});
			this.tabPage1.Location = new System.Drawing.Point(4, 24);
			this.tabPage1.Name = "tabPage1";
			this.tabPage1.Size = new System.Drawing.Size(1541, 173);
			this.tabPage1.TabIndex = 0;
			this.tabPage1.Text = "사용자 관리";
			// 
			// btnUserMng_ChgPasswd
			// 
			this.btnUserMng_ChgPasswd.Location = new System.Drawing.Point(1261, 16);
			this.btnUserMng_ChgPasswd.Name = "btnUserMng_ChgPasswd";
			this.btnUserMng_ChgPasswd.Size = new System.Drawing.Size(147, 33);
			this.btnUserMng_ChgPasswd.TabIndex = 11;
			this.btnUserMng_ChgPasswd.Text = "비밀번호 변경";
			this.btnUserMng_ChgPasswd.Click += new System.EventHandler(this.btnUserMng_ChgPasswd_Click);
			// 
			// btnUserMng_CreateUser
			// 
			this.btnUserMng_CreateUser.Location = new System.Drawing.Point(1102, 16);
			this.btnUserMng_CreateUser.Name = "btnUserMng_CreateUser";
			this.btnUserMng_CreateUser.Size = new System.Drawing.Size(147, 33);
			this.btnUserMng_CreateUser.TabIndex = 10;
			this.btnUserMng_CreateUser.Text = "등록";
			this.btnUserMng_CreateUser.Click += new System.EventHandler(this.btnUserMng_CreateUser_Click);
			// 
			// btnUserMng_TtsAuth
			// 
			this.btnUserMng_TtsAuth.Location = new System.Drawing.Point(814, 16);
			this.btnUserMng_TtsAuth.Name = "btnUserMng_TtsAuth";
			this.btnUserMng_TtsAuth.Size = new System.Drawing.Size(175, 33);
			this.btnUserMng_TtsAuth.TabIndex = 9;
			this.btnUserMng_TtsAuth.Text = "TTS인증번호 요청";
			this.btnUserMng_TtsAuth.Click += new System.EventHandler(this.btnUserMng_TtsAuth_Click);
			// 
			// btnUserMng_SmsAuth
			// 
			this.btnUserMng_SmsAuth.Location = new System.Drawing.Point(628, 16);
			this.btnUserMng_SmsAuth.Name = "btnUserMng_SmsAuth";
			this.btnUserMng_SmsAuth.Size = new System.Drawing.Size(175, 33);
			this.btnUserMng_SmsAuth.TabIndex = 8;
			this.btnUserMng_SmsAuth.Text = "SMS인증번호 요청";
			this.btnUserMng_SmsAuth.Click += new System.EventHandler(this.btnUserMng_SmsAuth_Click);
			// 
			// txtUserMng_Passwd
			// 
			this.txtUserMng_Passwd.Location = new System.Drawing.Point(356, 60);
			this.txtUserMng_Passwd.Name = "txtUserMng_Passwd";
			this.txtUserMng_Passwd.Size = new System.Drawing.Size(153, 25);
			this.txtUserMng_Passwd.TabIndex = 7;
			this.txtUserMng_Passwd.Text = "";
			// 
			// txtUserMng_UserId
			// 
			this.txtUserMng_UserId.Location = new System.Drawing.Point(102, 60);
			this.txtUserMng_UserId.Name = "txtUserMng_UserId";
			this.txtUserMng_UserId.Size = new System.Drawing.Size(130, 25);
			this.txtUserMng_UserId.TabIndex = 6;
			this.txtUserMng_UserId.Text = "";
			// 
			// txtUserMng_AuthNo
			// 
			this.txtUserMng_AuthNo.Location = new System.Drawing.Point(356, 16);
			this.txtUserMng_AuthNo.Name = "txtUserMng_AuthNo";
			this.txtUserMng_AuthNo.Size = new System.Drawing.Size(153, 25);
			this.txtUserMng_AuthNo.TabIndex = 5;
			this.txtUserMng_AuthNo.Text = "";
			// 
			// txtUserMng_TelNum
			// 
			this.txtUserMng_TelNum.Location = new System.Drawing.Point(102, 16);
			this.txtUserMng_TelNum.Name = "txtUserMng_TelNum";
			this.txtUserMng_TelNum.Size = new System.Drawing.Size(130, 25);
			this.txtUserMng_TelNum.TabIndex = 4;
			this.txtUserMng_TelNum.Text = "";
			// 
			// label7
			// 
			this.label7.AutoSize = true;
			this.label7.Location = new System.Drawing.Point(277, 66);
			this.label7.Name = "label7";
			this.label7.Size = new System.Drawing.Size(67, 18);
			this.label7.TabIndex = 3;
			this.label7.Text = "비밀번호";
			// 
			// label6
			// 
			this.label6.AutoSize = true;
			this.label6.Location = new System.Drawing.Point(277, 22);
			this.label6.Name = "label6";
			this.label6.Size = new System.Drawing.Size(67, 18);
			this.label6.TabIndex = 2;
			this.label6.Text = "인증번호";
			// 
			// label5
			// 
			this.label5.AutoSize = true;
			this.label5.Location = new System.Drawing.Point(23, 66);
			this.label5.Name = "label5";
			this.label5.Size = new System.Drawing.Size(67, 18);
			this.label5.TabIndex = 1;
			this.label5.Text = "사용자ID";
			// 
			// label4
			// 
			this.label4.AutoSize = true;
			this.label4.Location = new System.Drawing.Point(23, 22);
			this.label4.Name = "label4";
			this.label4.Size = new System.Drawing.Size(67, 18);
			this.label4.TabIndex = 0;
			this.label4.Text = "전화번호";
			// 
			// tabPage13
			// 
			this.tabPage13.Controls.AddRange(new System.Windows.Forms.Control[] {
																					this.txtMmsMT_Message,
																					this.label31,
																					this.txtMmsMT_TelNum,
																					this.label32,
																					this.cboMmsMT_Profile,
																					this.btnMmsMT_Profile,
																					this.btnMmsMT_Send,
																					this.label33});
			this.tabPage13.Location = new System.Drawing.Point(4, 24);
			this.tabPage13.Name = "tabPage13";
			this.tabPage13.Size = new System.Drawing.Size(1541, 173);
			this.tabPage13.TabIndex = 13;
			this.tabPage13.Text = "MMS MT";
			// 
			// txtMmsMT_Message
			// 
			this.txtMmsMT_Message.Location = new System.Drawing.Point(112, 88);
			this.txtMmsMT_Message.Name = "txtMmsMT_Message";
			this.txtMmsMT_Message.Size = new System.Drawing.Size(605, 25);
			this.txtMmsMT_Message.TabIndex = 48;
			this.txtMmsMT_Message.Text = "";
			// 
			// label31
			// 
			this.label31.AutoSize = true;
			this.label31.Location = new System.Drawing.Point(32, 88);
			this.label31.Name = "label31";
			this.label31.Size = new System.Drawing.Size(52, 18);
			this.label31.TabIndex = 47;
			this.label31.Text = "메시지";
			// 
			// txtMmsMT_TelNum
			// 
			this.txtMmsMT_TelNum.Location = new System.Drawing.Point(368, 24);
			this.txtMmsMT_TelNum.Name = "txtMmsMT_TelNum";
			this.txtMmsMT_TelNum.Size = new System.Drawing.Size(351, 25);
			this.txtMmsMT_TelNum.TabIndex = 46;
			this.txtMmsMT_TelNum.Text = "";
			// 
			// label32
			// 
			this.label32.AutoSize = true;
			this.label32.Location = new System.Drawing.Point(288, 32);
			this.label32.Name = "label32";
			this.label32.Size = new System.Drawing.Size(67, 18);
			this.label32.TabIndex = 45;
			this.label32.Text = "착신번호";
			// 
			// cboMmsMT_Profile
			// 
			this.cboMmsMT_Profile.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
			this.cboMmsMT_Profile.Items.AddRange(new object[] {
																  "LIMIT_MAX_RECEIVERS"});
			this.cboMmsMT_Profile.Location = new System.Drawing.Point(920, 88);
			this.cboMmsMT_Profile.Name = "cboMmsMT_Profile";
			this.cboMmsMT_Profile.Size = new System.Drawing.Size(294, 23);
			this.cboMmsMT_Profile.TabIndex = 44;
			// 
			// btnMmsMT_Profile
			// 
			this.btnMmsMT_Profile.Location = new System.Drawing.Point(1224, 80);
			this.btnMmsMT_Profile.Name = "btnMmsMT_Profile";
			this.btnMmsMT_Profile.Size = new System.Drawing.Size(142, 33);
			this.btnMmsMT_Profile.TabIndex = 43;
			this.btnMmsMT_Profile.Text = "프로파일 조회";
			this.btnMmsMT_Profile.Click += new System.EventHandler(this.btnMmsMT_Profile_Click);
			// 
			// btnMmsMT_Send
			// 
			this.btnMmsMT_Send.Location = new System.Drawing.Point(1224, 24);
			this.btnMmsMT_Send.Name = "btnMmsMT_Send";
			this.btnMmsMT_Send.Size = new System.Drawing.Size(142, 33);
			this.btnMmsMT_Send.TabIndex = 42;
			this.btnMmsMT_Send.Text = "전송";
			this.btnMmsMT_Send.Click += new System.EventHandler(this.btnMmsMT_Send_Click);
			// 
			// label33
			// 
			this.label33.AutoSize = true;
			this.label33.ForeColor = System.Drawing.Color.Red;
			this.label33.Location = new System.Drawing.Point(368, 56);
			this.label33.Name = "label33";
			this.label33.Size = new System.Drawing.Size(156, 18);
			this.label33.TabIndex = 41;
			this.label33.Text = "전화번호는 \'|\'로 구분";
			// 
			// tabPage4
			// 
			this.tabPage4.Controls.AddRange(new System.Windows.Forms.Control[] {
																				   this.chkTtsRs_EventF,
																				   this.label21,
																				   this.txtTtsRs_Dtmf,
																				   this.label20,
																				   this.txtTtsRs_Message,
																				   this.label16,
																				   this.txtTtsRs_TelNum,
																				   this.label17,
																				   this.cboTtsRs_Profile,
																				   this.btnTtsRs_Profile,
																				   this.btnTtsRs_Send,
																				   this.label18,
																				   this.txtTtsRs_UserName,
																				   this.label19});
			this.tabPage4.Location = new System.Drawing.Point(4, 24);
			this.tabPage4.Name = "tabPage4";
			this.tabPage4.Size = new System.Drawing.Size(1541, 173);
			this.tabPage4.TabIndex = 3;
			this.tabPage4.Text = "TTS 설문";
			this.tabPage4.Visible = false;
			// 
			// chkTtsRs_EventF
			// 
			this.chkTtsRs_EventF.Checked = true;
			this.chkTtsRs_EventF.CheckState = System.Windows.Forms.CheckState.Checked;
			this.chkTtsRs_EventF.Location = new System.Drawing.Point(1001, 11);
			this.chkTtsRs_EventF.Name = "chkTtsRs_EventF";
			this.chkTtsRs_EventF.Size = new System.Drawing.Size(141, 38);
			this.chkTtsRs_EventF.TabIndex = 52;
			this.chkTtsRs_EventF.Text = "이벤트 수신";
			// 
			// label21
			// 
			this.label21.AutoSize = true;
			this.label21.ForeColor = System.Drawing.Color.Red;
			this.label21.Location = new System.Drawing.Point(831, 49);
			this.label21.Name = "label21";
			this.label21.Size = new System.Drawing.Size(136, 18);
			this.label21.TabIndex = 51;
			this.label21.Text = "DTMF는 \'|\'로 구분";
			// 
			// txtTtsRs_Dtmf
			// 
			this.txtTtsRs_Dtmf.Location = new System.Drawing.Point(837, 16);
			this.txtTtsRs_Dtmf.Name = "txtTtsRs_Dtmf";
			this.txtTtsRs_Dtmf.Size = new System.Drawing.Size(141, 25);
			this.txtTtsRs_Dtmf.TabIndex = 50;
			this.txtTtsRs_Dtmf.Text = "";
			// 
			// label20
			// 
			this.label20.AutoSize = true;
			this.label20.Location = new System.Drawing.Point(741, 22);
			this.label20.Name = "label20";
			this.label20.Size = new System.Drawing.Size(78, 18);
			this.label20.TabIndex = 49;
			this.label20.Text = "수집DTMF";
			// 
			// txtTtsRs_Message
			// 
			this.txtTtsRs_Message.Location = new System.Drawing.Point(102, 76);
			this.txtTtsRs_Message.Name = "txtTtsRs_Message";
			this.txtTtsRs_Message.Size = new System.Drawing.Size(605, 25);
			this.txtTtsRs_Message.TabIndex = 48;
			this.txtTtsRs_Message.Text = "";
			// 
			// label16
			// 
			this.label16.AutoSize = true;
			this.label16.Location = new System.Drawing.Point(23, 82);
			this.label16.Name = "label16";
			this.label16.Size = new System.Drawing.Size(52, 18);
			this.label16.TabIndex = 47;
			this.label16.Text = "메시지";
			// 
			// txtTtsRs_TelNum
			// 
			this.txtTtsRs_TelNum.Location = new System.Drawing.Point(356, 16);
			this.txtTtsRs_TelNum.Name = "txtTtsRs_TelNum";
			this.txtTtsRs_TelNum.Size = new System.Drawing.Size(351, 25);
			this.txtTtsRs_TelNum.TabIndex = 46;
			this.txtTtsRs_TelNum.Text = "";
			// 
			// label17
			// 
			this.label17.AutoSize = true;
			this.label17.Location = new System.Drawing.Point(277, 22);
			this.label17.Name = "label17";
			this.label17.Size = new System.Drawing.Size(67, 18);
			this.label17.TabIndex = 45;
			this.label17.Text = "착신번호";
			// 
			// cboTtsRs_Profile
			// 
			this.cboTtsRs_Profile.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
			this.cboTtsRs_Profile.Items.AddRange(new object[] {
																  "LIMIT_MAX_RECEIVERS",
																  "TTS_MENT_SIZE",
																  "TTS_MAX_MENT_SIZE"});
			this.cboTtsRs_Profile.Location = new System.Drawing.Point(910, 76);
			this.cboTtsRs_Profile.Name = "cboTtsRs_Profile";
			this.cboTtsRs_Profile.Size = new System.Drawing.Size(294, 23);
			this.cboTtsRs_Profile.TabIndex = 44;
			// 
			// btnTtsRs_Profile
			// 
			this.btnTtsRs_Profile.Location = new System.Drawing.Point(1215, 71);
			this.btnTtsRs_Profile.Name = "btnTtsRs_Profile";
			this.btnTtsRs_Profile.Size = new System.Drawing.Size(142, 33);
			this.btnTtsRs_Profile.TabIndex = 43;
			this.btnTtsRs_Profile.Text = "프로파일 조회";
			this.btnTtsRs_Profile.Click += new System.EventHandler(this.btnTtsRs_Profile_Click);
			// 
			// btnTtsRs_Send
			// 
			this.btnTtsRs_Send.Location = new System.Drawing.Point(1215, 16);
			this.btnTtsRs_Send.Name = "btnTtsRs_Send";
			this.btnTtsRs_Send.Size = new System.Drawing.Size(142, 33);
			this.btnTtsRs_Send.TabIndex = 42;
			this.btnTtsRs_Send.Text = "전송";
			this.btnTtsRs_Send.Click += new System.EventHandler(this.btnTtsRs_Send_Click);
			// 
			// label18
			// 
			this.label18.AutoSize = true;
			this.label18.ForeColor = System.Drawing.Color.Red;
			this.label18.Location = new System.Drawing.Point(356, 49);
			this.label18.Name = "label18";
			this.label18.Size = new System.Drawing.Size(156, 18);
			this.label18.TabIndex = 41;
			this.label18.Text = "전화번호는 \'|\'로 구분";
			// 
			// txtTtsRs_UserName
			// 
			this.txtTtsRs_UserName.Location = new System.Drawing.Point(102, 16);
			this.txtTtsRs_UserName.Name = "txtTtsRs_UserName";
			this.txtTtsRs_UserName.Size = new System.Drawing.Size(141, 25);
			this.txtTtsRs_UserName.TabIndex = 40;
			this.txtTtsRs_UserName.Text = "";
			// 
			// label19
			// 
			this.label19.AutoSize = true;
			this.label19.Location = new System.Drawing.Point(23, 22);
			this.label19.Name = "label19";
			this.label19.Size = new System.Drawing.Size(52, 18);
			this.label19.TabIndex = 39;
			this.label19.Text = "작성자";
			// 
			// tabPage11
			// 
			this.tabPage11.Controls.AddRange(new System.Windows.Forms.Control[] {
																					this.btnTermRec_StartRec,
																					this.btnTermRec_Stop,
																					this.btnTermRec_Status,
																					this.btnTermRec_StopRec});
			this.tabPage11.Location = new System.Drawing.Point(4, 24);
			this.tabPage11.Name = "tabPage11";
			this.tabPage11.Size = new System.Drawing.Size(1541, 173);
			this.tabPage11.TabIndex = 10;
			this.tabPage11.Text = "착신녹취";
			// 
			// btnTermRec_StartRec
			// 
			this.btnTermRec_StartRec.Location = new System.Drawing.Point(910, 11);
			this.btnTermRec_StartRec.Name = "btnTermRec_StartRec";
			this.btnTermRec_StartRec.Size = new System.Drawing.Size(142, 33);
			this.btnTermRec_StartRec.TabIndex = 89;
			this.btnTermRec_StartRec.Text = "녹음 시작";
			this.btnTermRec_StartRec.Click += new System.EventHandler(this.btnTermRec_StartRec_Click);
			// 
			// btnTermRec_Stop
			// 
			this.btnTermRec_Stop.Location = new System.Drawing.Point(1368, 11);
			this.btnTermRec_Stop.Name = "btnTermRec_Stop";
			this.btnTermRec_Stop.Size = new System.Drawing.Size(141, 33);
			this.btnTermRec_Stop.TabIndex = 88;
			this.btnTermRec_Stop.Text = "서비스 종료";
			this.btnTermRec_Stop.Click += new System.EventHandler(this.btnTermRec_Stop_Click);
			// 
			// btnTermRec_Status
			// 
			this.btnTermRec_Status.Location = new System.Drawing.Point(1215, 11);
			this.btnTermRec_Status.Name = "btnTermRec_Status";
			this.btnTermRec_Status.Size = new System.Drawing.Size(142, 33);
			this.btnTermRec_Status.TabIndex = 87;
			this.btnTermRec_Status.Text = "상태조회";
			this.btnTermRec_Status.Click += new System.EventHandler(this.btnTermRec_Status_Click);
			// 
			// btnTermRec_StopRec
			// 
			this.btnTermRec_StopRec.Location = new System.Drawing.Point(1063, 11);
			this.btnTermRec_StopRec.Name = "btnTermRec_StopRec";
			this.btnTermRec_StopRec.Size = new System.Drawing.Size(141, 33);
			this.btnTermRec_StopRec.TabIndex = 86;
			this.btnTermRec_StopRec.Text = "녹음 종료";
			this.btnTermRec_StopRec.Click += new System.EventHandler(this.btnTermRec_StopRec_Click);
			// 
			// tabPage12
			// 
			this.tabPage12.Controls.AddRange(new System.Windows.Forms.Control[] {
																					this.groupBox6,
																					this.btnCallPickup_Query,
																					this.chkCallPickup_AutoAnswerF});
			this.tabPage12.Location = new System.Drawing.Point(4, 24);
			this.tabPage12.Name = "tabPage12";
			this.tabPage12.Size = new System.Drawing.Size(1541, 173);
			this.tabPage12.TabIndex = 12;
			this.tabPage12.Text = "당겨받기";
			// 
			// groupBox6
			// 
			this.groupBox6.Controls.AddRange(new System.Windows.Forms.Control[] {
																					this.rdoCallPickup_True,
																					this.rdoCallPickup_False});
			this.groupBox6.Location = new System.Drawing.Point(632, 24);
			this.groupBox6.Name = "groupBox6";
			this.groupBox6.Size = new System.Drawing.Size(256, 88);
			this.groupBox6.TabIndex = 89;
			this.groupBox6.TabStop = false;
			this.groupBox6.Text = "번호 표시";
			// 
			// rdoCallPickup_True
			// 
			this.rdoCallPickup_True.Location = new System.Drawing.Point(124, 27);
			this.rdoCallPickup_True.Name = "rdoCallPickup_True";
			this.rdoCallPickup_True.Size = new System.Drawing.Size(116, 33);
			this.rdoCallPickup_True.TabIndex = 1;
			this.rdoCallPickup_True.Text = "발번번호";
			// 
			// rdoCallPickup_False
			// 
			this.rdoCallPickup_False.Checked = true;
			this.rdoCallPickup_False.Location = new System.Drawing.Point(17, 27);
			this.rdoCallPickup_False.Name = "rdoCallPickup_False";
			this.rdoCallPickup_False.Size = new System.Drawing.Size(96, 33);
			this.rdoCallPickup_False.TabIndex = 0;
			this.rdoCallPickup_False.TabStop = true;
			this.rdoCallPickup_False.Text = "원번호";
			// 
			// btnCallPickup_Query
			// 
			this.btnCallPickup_Query.Location = new System.Drawing.Point(1072, 24);
			this.btnCallPickup_Query.Name = "btnCallPickup_Query";
			this.btnCallPickup_Query.Size = new System.Drawing.Size(142, 33);
			this.btnCallPickup_Query.TabIndex = 88;
			this.btnCallPickup_Query.Text = "당겨받기 요청";
			this.btnCallPickup_Query.Click += new System.EventHandler(this.btnCallPickup_Query_Click);
			// 
			// chkCallPickup_AutoAnswerF
			// 
			this.chkCallPickup_AutoAnswerF.Location = new System.Drawing.Point(904, 24);
			this.chkCallPickup_AutoAnswerF.Name = "chkCallPickup_AutoAnswerF";
			this.chkCallPickup_AutoAnswerF.Size = new System.Drawing.Size(148, 38);
			this.chkCallPickup_AutoAnswerF.TabIndex = 13;
			this.chkCallPickup_AutoAnswerF.Text = "발신측 자동 응답";
			// 
			// tabPage10
			// 
			this.tabPage10.Controls.AddRange(new System.Windows.Forms.Control[] {
																					this.btnCF_Unset,
																					this.txtCF_TelNum,
																					this.label23,
																					this.cboCF_Type,
																					this.btnCF_Set,
																					this.btnCF_Query,
																					this.label28});
			this.tabPage10.Location = new System.Drawing.Point(4, 24);
			this.tabPage10.Name = "tabPage10";
			this.tabPage10.Size = new System.Drawing.Size(1541, 173);
			this.tabPage10.TabIndex = 9;
			this.tabPage10.Text = "착신전환설정";
			this.tabPage10.Visible = false;
			// 
			// btnCF_Unset
			// 
			this.btnCF_Unset.Location = new System.Drawing.Point(1368, 11);
			this.btnCF_Unset.Name = "btnCF_Unset";
			this.btnCF_Unset.Size = new System.Drawing.Size(141, 33);
			this.btnCF_Unset.TabIndex = 85;
			this.btnCF_Unset.Text = "해제";
			this.btnCF_Unset.Click += new System.EventHandler(this.btnCF_Unset_Click);
			// 
			// txtCF_TelNum
			// 
			this.txtCF_TelNum.Location = new System.Drawing.Point(102, 76);
			this.txtCF_TelNum.Name = "txtCF_TelNum";
			this.txtCF_TelNum.Size = new System.Drawing.Size(141, 25);
			this.txtCF_TelNum.TabIndex = 84;
			this.txtCF_TelNum.Text = "";
			// 
			// label23
			// 
			this.label23.AutoSize = true;
			this.label23.Location = new System.Drawing.Point(23, 82);
			this.label23.Name = "label23";
			this.label23.Size = new System.Drawing.Size(67, 18);
			this.label23.TabIndex = 83;
			this.label23.Text = "착신번호";
			// 
			// cboCF_Type
			// 
			this.cboCF_Type.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
			this.cboCF_Type.Items.AddRange(new object[] {
															"조건부 착신전환",
															"무조건 착신전환"});
			this.cboCF_Type.Location = new System.Drawing.Point(102, 16);
			this.cboCF_Type.Name = "cboCF_Type";
			this.cboCF_Type.Size = new System.Drawing.Size(294, 23);
			this.cboCF_Type.TabIndex = 82;
			// 
			// btnCF_Set
			// 
			this.btnCF_Set.Location = new System.Drawing.Point(1215, 11);
			this.btnCF_Set.Name = "btnCF_Set";
			this.btnCF_Set.Size = new System.Drawing.Size(142, 33);
			this.btnCF_Set.TabIndex = 81;
			this.btnCF_Set.Text = "설정";
			this.btnCF_Set.Click += new System.EventHandler(this.btnCF_Set_Click);
			// 
			// btnCF_Query
			// 
			this.btnCF_Query.Location = new System.Drawing.Point(1063, 11);
			this.btnCF_Query.Name = "btnCF_Query";
			this.btnCF_Query.Size = new System.Drawing.Size(141, 33);
			this.btnCF_Query.TabIndex = 80;
			this.btnCF_Query.Text = "조회";
			this.btnCF_Query.Click += new System.EventHandler(this.btnCF_Query_Click);
			// 
			// label28
			// 
			this.label28.AutoSize = true;
			this.label28.Location = new System.Drawing.Point(23, 22);
			this.label28.Name = "label28";
			this.label28.Size = new System.Drawing.Size(36, 18);
			this.label28.TabIndex = 78;
			this.label28.Text = "유형";
			// 
			// tabPage2
			// 
			this.tabPage2.Controls.AddRange(new System.Windows.Forms.Control[] {
																				   this.chkClickCall_AutoAnswerF,
																				   this.cboClickCall_Profile,
																				   this.btnClickCall_Status,
																				   this.btnClickCall_Profile,
																				   this.btnClickCall_StopRec,
																				   this.btnClickCall_StartRec,
																				   this.btnClickCall_Stop,
																				   this.btnClickCall_Start,
																				   this.chkClickCall_EventF,
																				   this.groupBox2,
																				   this.label9,
																				   this.txtClickCall_TelNum,
																				   this.label8});
			this.tabPage2.Location = new System.Drawing.Point(4, 24);
			this.tabPage2.Name = "tabPage2";
			this.tabPage2.Size = new System.Drawing.Size(1541, 173);
			this.tabPage2.TabIndex = 1;
			this.tabPage2.Text = "ClickCall";
			this.tabPage2.Visible = false;
			// 
			// chkClickCall_AutoAnswerF
			// 
			this.chkClickCall_AutoAnswerF.Location = new System.Drawing.Point(684, 64);
			this.chkClickCall_AutoAnswerF.Name = "chkClickCall_AutoAnswerF";
			this.chkClickCall_AutoAnswerF.Size = new System.Drawing.Size(148, 38);
			this.chkClickCall_AutoAnswerF.TabIndex = 12;
			this.chkClickCall_AutoAnswerF.Text = "발신측 자동 응답";
			// 
			// cboClickCall_Profile
			// 
			this.cboClickCall_Profile.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
			this.cboClickCall_Profile.Items.AddRange(new object[] {
																	  "CID_NUMBER"});
			this.cboClickCall_Profile.Location = new System.Drawing.Point(910, 76);
			this.cboClickCall_Profile.Name = "cboClickCall_Profile";
			this.cboClickCall_Profile.Size = new System.Drawing.Size(294, 23);
			this.cboClickCall_Profile.TabIndex = 11;
			// 
			// btnClickCall_Status
			// 
			this.btnClickCall_Status.Location = new System.Drawing.Point(1368, 71);
			this.btnClickCall_Status.Name = "btnClickCall_Status";
			this.btnClickCall_Status.Size = new System.Drawing.Size(141, 33);
			this.btnClickCall_Status.TabIndex = 10;
			this.btnClickCall_Status.Text = "상태 조회";
			this.btnClickCall_Status.Click += new System.EventHandler(this.btnClickCall_Status_Click);
			// 
			// btnClickCall_Profile
			// 
			this.btnClickCall_Profile.Location = new System.Drawing.Point(1215, 71);
			this.btnClickCall_Profile.Name = "btnClickCall_Profile";
			this.btnClickCall_Profile.Size = new System.Drawing.Size(142, 33);
			this.btnClickCall_Profile.TabIndex = 9;
			this.btnClickCall_Profile.Text = "프로파일 조회";
			this.btnClickCall_Profile.Click += new System.EventHandler(this.btnClickCall_Profile_Click);
			// 
			// btnClickCall_StopRec
			// 
			this.btnClickCall_StopRec.Location = new System.Drawing.Point(1368, 16);
			this.btnClickCall_StopRec.Name = "btnClickCall_StopRec";
			this.btnClickCall_StopRec.Size = new System.Drawing.Size(141, 33);
			this.btnClickCall_StopRec.TabIndex = 8;
			this.btnClickCall_StopRec.Text = "녹음종료";
			this.btnClickCall_StopRec.Click += new System.EventHandler(this.btnClickCall_StopRec_Click);
			// 
			// btnClickCall_StartRec
			// 
			this.btnClickCall_StartRec.Location = new System.Drawing.Point(1215, 16);
			this.btnClickCall_StartRec.Name = "btnClickCall_StartRec";
			this.btnClickCall_StartRec.Size = new System.Drawing.Size(142, 33);
			this.btnClickCall_StartRec.TabIndex = 7;
			this.btnClickCall_StartRec.Text = "녹음시작";
			this.btnClickCall_StartRec.Click += new System.EventHandler(this.btnClickCall_StartRec_Click);
			// 
			// btnClickCall_Stop
			// 
			this.btnClickCall_Stop.Location = new System.Drawing.Point(1063, 16);
			this.btnClickCall_Stop.Name = "btnClickCall_Stop";
			this.btnClickCall_Stop.Size = new System.Drawing.Size(141, 33);
			this.btnClickCall_Stop.TabIndex = 6;
			this.btnClickCall_Stop.Text = "종료";
			this.btnClickCall_Stop.Click += new System.EventHandler(this.btnClickCall_Stop_Click);
			// 
			// btnClickCall_Start
			// 
			this.btnClickCall_Start.Location = new System.Drawing.Point(910, 16);
			this.btnClickCall_Start.Name = "btnClickCall_Start";
			this.btnClickCall_Start.Size = new System.Drawing.Size(142, 33);
			this.btnClickCall_Start.TabIndex = 5;
			this.btnClickCall_Start.Text = "시작";
			this.btnClickCall_Start.Click += new System.EventHandler(this.btnClickCall_Start_Click);
			// 
			// chkClickCall_EventF
			// 
			this.chkClickCall_EventF.Checked = true;
			this.chkClickCall_EventF.CheckState = System.Windows.Forms.CheckState.Checked;
			this.chkClickCall_EventF.Location = new System.Drawing.Point(684, 11);
			this.chkClickCall_EventF.Name = "chkClickCall_EventF";
			this.chkClickCall_EventF.Size = new System.Drawing.Size(141, 38);
			this.chkClickCall_EventF.TabIndex = 4;
			this.chkClickCall_EventF.Text = "이벤트 수신";
			// 
			// groupBox2
			// 
			this.groupBox2.Controls.AddRange(new System.Windows.Forms.Control[] {
																					this.rdoClickCall_Ready,
																					this.rdoClickCall_True,
																					this.rdoClickCall_False});
			this.groupBox2.Location = new System.Drawing.Point(305, 11);
			this.groupBox2.Name = "groupBox2";
			this.groupBox2.Size = new System.Drawing.Size(351, 71);
			this.groupBox2.TabIndex = 3;
			this.groupBox2.TabStop = false;
			this.groupBox2.Text = "옵션";
			// 
			// rdoClickCall_Ready
			// 
			this.rdoClickCall_Ready.Location = new System.Drawing.Point(232, 27);
			this.rdoClickCall_Ready.Name = "rdoClickCall_Ready";
			this.rdoClickCall_Ready.Size = new System.Drawing.Size(107, 33);
			this.rdoClickCall_Ready.TabIndex = 2;
			this.rdoClickCall_Ready.Text = "부분녹취";
			// 
			// rdoClickCall_True
			// 
			this.rdoClickCall_True.Location = new System.Drawing.Point(124, 27);
			this.rdoClickCall_True.Name = "rdoClickCall_True";
			this.rdoClickCall_True.Size = new System.Drawing.Size(116, 33);
			this.rdoClickCall_True.TabIndex = 1;
			this.rdoClickCall_True.Text = "전수녹취";
			// 
			// rdoClickCall_False
			// 
			this.rdoClickCall_False.Checked = true;
			this.rdoClickCall_False.Location = new System.Drawing.Point(17, 27);
			this.rdoClickCall_False.Name = "rdoClickCall_False";
			this.rdoClickCall_False.Size = new System.Drawing.Size(96, 33);
			this.rdoClickCall_False.TabIndex = 0;
			this.rdoClickCall_False.TabStop = true;
			this.rdoClickCall_False.Text = "1:1통화";
			// 
			// label9
			// 
			this.label9.AutoSize = true;
			this.label9.ForeColor = System.Drawing.Color.Red;
			this.label9.Location = new System.Drawing.Point(102, 49);
			this.label9.Name = "label9";
			this.label9.Size = new System.Drawing.Size(156, 18);
			this.label9.TabIndex = 2;
			this.label9.Text = "전화번호는 \'|\'로 구분";
			// 
			// txtClickCall_TelNum
			// 
			this.txtClickCall_TelNum.Location = new System.Drawing.Point(102, 16);
			this.txtClickCall_TelNum.Name = "txtClickCall_TelNum";
			this.txtClickCall_TelNum.Size = new System.Drawing.Size(141, 25);
			this.txtClickCall_TelNum.TabIndex = 1;
			this.txtClickCall_TelNum.Text = "";
			// 
			// label8
			// 
			this.label8.AutoSize = true;
			this.label8.Location = new System.Drawing.Point(23, 22);
			this.label8.Name = "label8";
			this.label8.Size = new System.Drawing.Size(67, 18);
			this.label8.TabIndex = 0;
			this.label8.Text = "착신번호";
			// 
			// tabPage5
			// 
			this.tabPage5.Controls.AddRange(new System.Windows.Forms.Control[] {
																				   this.txtSmsMT_Message,
																				   this.label15,
																				   this.txtSmsMT_TelNum,
																				   this.label14,
																				   this.cboSmsMT_Profile,
																				   this.btnSmsMT_Profile,
																				   this.btnSmsMT_Send,
																				   this.label12});
			this.tabPage5.Location = new System.Drawing.Point(4, 24);
			this.tabPage5.Name = "tabPage5";
			this.tabPage5.Size = new System.Drawing.Size(1541, 173);
			this.tabPage5.TabIndex = 4;
			this.tabPage5.Text = "SMS MT";
			this.tabPage5.Visible = false;
			// 
			// txtSmsMT_Message
			// 
			this.txtSmsMT_Message.Location = new System.Drawing.Point(102, 76);
			this.txtSmsMT_Message.Name = "txtSmsMT_Message";
			this.txtSmsMT_Message.Size = new System.Drawing.Size(605, 25);
			this.txtSmsMT_Message.TabIndex = 38;
			this.txtSmsMT_Message.Text = "";
			// 
			// label15
			// 
			this.label15.AutoSize = true;
			this.label15.Location = new System.Drawing.Point(23, 82);
			this.label15.Name = "label15";
			this.label15.Size = new System.Drawing.Size(52, 18);
			this.label15.TabIndex = 37;
			this.label15.Text = "메시지";
			// 
			// txtSmsMT_TelNum
			// 
			this.txtSmsMT_TelNum.Location = new System.Drawing.Point(104, 16);
			this.txtSmsMT_TelNum.Name = "txtSmsMT_TelNum";
			this.txtSmsMT_TelNum.Size = new System.Drawing.Size(351, 25);
			this.txtSmsMT_TelNum.TabIndex = 36;
			this.txtSmsMT_TelNum.Text = "";
			// 
			// label14
			// 
			this.label14.AutoSize = true;
			this.label14.Location = new System.Drawing.Point(24, 24);
			this.label14.Name = "label14";
			this.label14.Size = new System.Drawing.Size(67, 18);
			this.label14.TabIndex = 35;
			this.label14.Text = "착신번호";
			// 
			// cboSmsMT_Profile
			// 
			this.cboSmsMT_Profile.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
			this.cboSmsMT_Profile.Items.AddRange(new object[] {
																  "LIMIT_MAX_RECEIVERS"});
			this.cboSmsMT_Profile.Location = new System.Drawing.Point(910, 76);
			this.cboSmsMT_Profile.Name = "cboSmsMT_Profile";
			this.cboSmsMT_Profile.Size = new System.Drawing.Size(294, 23);
			this.cboSmsMT_Profile.TabIndex = 34;
			// 
			// btnSmsMT_Profile
			// 
			this.btnSmsMT_Profile.Location = new System.Drawing.Point(1215, 71);
			this.btnSmsMT_Profile.Name = "btnSmsMT_Profile";
			this.btnSmsMT_Profile.Size = new System.Drawing.Size(142, 33);
			this.btnSmsMT_Profile.TabIndex = 32;
			this.btnSmsMT_Profile.Text = "프로파일 조회";
			this.btnSmsMT_Profile.Click += new System.EventHandler(this.btnSmsMT_Profile_Click);
			// 
			// btnSmsMT_Send
			// 
			this.btnSmsMT_Send.Location = new System.Drawing.Point(1215, 16);
			this.btnSmsMT_Send.Name = "btnSmsMT_Send";
			this.btnSmsMT_Send.Size = new System.Drawing.Size(142, 33);
			this.btnSmsMT_Send.TabIndex = 31;
			this.btnSmsMT_Send.Text = "전송";
			this.btnSmsMT_Send.Click += new System.EventHandler(this.btnSmsMT_Send_Click);
			// 
			// label12
			// 
			this.label12.AutoSize = true;
			this.label12.ForeColor = System.Drawing.Color.Red;
			this.label12.Location = new System.Drawing.Point(112, 48);
			this.label12.Name = "label12";
			this.label12.Size = new System.Drawing.Size(156, 18);
			this.label12.TabIndex = 26;
			this.label12.Text = "전화번호는 \'|\'로 구분";
			// 
			// tabPage7
			// 
			this.tabPage7.Controls.AddRange(new System.Windows.Forms.Control[] {
																				   this.btnDnMng_Query,
																				   this.btnDnMng_Del,
																				   this.btnDnMng_Add,
																				   this.groupBox4,
																				   this.groupBox3});
			this.tabPage7.Location = new System.Drawing.Point(4, 24);
			this.tabPage7.Name = "tabPage7";
			this.tabPage7.Size = new System.Drawing.Size(1541, 173);
			this.tabPage7.TabIndex = 6;
			this.tabPage7.Text = "모니터링DN관리";
			this.tabPage7.Visible = false;
			// 
			// btnDnMng_Query
			// 
			this.btnDnMng_Query.Location = new System.Drawing.Point(560, 16);
			this.btnDnMng_Query.Name = "btnDnMng_Query";
			this.btnDnMng_Query.Size = new System.Drawing.Size(124, 33);
			this.btnDnMng_Query.TabIndex = 4;
			this.btnDnMng_Query.Text = "다시조회";
			this.btnDnMng_Query.Click += new System.EventHandler(this.btnDnMng_Query_Click);
			// 
			// btnDnMng_Del
			// 
			this.btnDnMng_Del.Font = new System.Drawing.Font("굴림", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((System.Byte)(129)));
			this.btnDnMng_Del.Location = new System.Drawing.Point(254, 98);
			this.btnDnMng_Del.Name = "btnDnMng_Del";
			this.btnDnMng_Del.Size = new System.Drawing.Size(46, 28);
			this.btnDnMng_Del.TabIndex = 3;
			this.btnDnMng_Del.Text = "<<";
			this.btnDnMng_Del.Click += new System.EventHandler(this.btnDnMng_Del_Click);
			// 
			// btnDnMng_Add
			// 
			this.btnDnMng_Add.Font = new System.Drawing.Font("굴림", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((System.Byte)(129)));
			this.btnDnMng_Add.Location = new System.Drawing.Point(254, 55);
			this.btnDnMng_Add.Name = "btnDnMng_Add";
			this.btnDnMng_Add.Size = new System.Drawing.Size(46, 27);
			this.btnDnMng_Add.TabIndex = 2;
			this.btnDnMng_Add.Text = ">>";
			this.btnDnMng_Add.Click += new System.EventHandler(this.btnDnMng_Add_Click);
			// 
			// groupBox4
			// 
			this.groupBox4.Controls.AddRange(new System.Windows.Forms.Control[] {
																					this.lstDnMng_MonDn});
			this.groupBox4.Location = new System.Drawing.Point(311, 5);
			this.groupBox4.Name = "groupBox4";
			this.groupBox4.Size = new System.Drawing.Size(220, 159);
			this.groupBox4.TabIndex = 1;
			this.groupBox4.TabStop = false;
			this.groupBox4.Text = "모니터링 전화번호";
			// 
			// lstDnMng_MonDn
			// 
			this.lstDnMng_MonDn.IntegralHeight = false;
			this.lstDnMng_MonDn.ItemHeight = 15;
			this.lstDnMng_MonDn.Location = new System.Drawing.Point(11, 22);
			this.lstDnMng_MonDn.Name = "lstDnMng_MonDn";
			this.lstDnMng_MonDn.Size = new System.Drawing.Size(198, 131);
			this.lstDnMng_MonDn.Sorted = true;
			this.lstDnMng_MonDn.TabIndex = 1;
			// 
			// groupBox3
			// 
			this.groupBox3.Controls.AddRange(new System.Windows.Forms.Control[] {
																					this.lstDnMng_SubsDn});
			this.groupBox3.Location = new System.Drawing.Point(23, 5);
			this.groupBox3.Name = "groupBox3";
			this.groupBox3.Size = new System.Drawing.Size(220, 159);
			this.groupBox3.TabIndex = 0;
			this.groupBox3.TabStop = false;
			this.groupBox3.Text = "가입자 전화번호";
			// 
			// lstDnMng_SubsDn
			// 
			this.lstDnMng_SubsDn.IntegralHeight = false;
			this.lstDnMng_SubsDn.ItemHeight = 15;
			this.lstDnMng_SubsDn.Location = new System.Drawing.Point(11, 22);
			this.lstDnMng_SubsDn.Name = "lstDnMng_SubsDn";
			this.lstDnMng_SubsDn.Size = new System.Drawing.Size(198, 131);
			this.lstDnMng_SubsDn.Sorted = true;
			this.lstDnMng_SubsDn.TabIndex = 0;
			// 
			// tabPage8
			// 
			this.tabPage8.Controls.AddRange(new System.Windows.Forms.Control[] {
																				   this.chkTtsMsg_ConfirmF,
																				   this.chkTtsMsg_EventF,
																				   this.txtTtsMsg_Message,
																				   this.label24,
																				   this.txtTtsMsg_TelNum,
																				   this.label25,
																				   this.cboTtsMsg_Profile,
																				   this.btnTtsMsg_Profile,
																				   this.btnTtsMsg_Send,
																				   this.label26,
																				   this.txtTtsMsg_UserName,
																				   this.label27});
			this.tabPage8.Location = new System.Drawing.Point(4, 24);
			this.tabPage8.Name = "tabPage8";
			this.tabPage8.Size = new System.Drawing.Size(1541, 173);
			this.tabPage8.TabIndex = 7;
			this.tabPage8.Text = "TTS 메시지";
			this.tabPage8.Visible = false;
			// 
			// chkTtsMsg_ConfirmF
			// 
			this.chkTtsMsg_ConfirmF.Checked = true;
			this.chkTtsMsg_ConfirmF.CheckState = System.Windows.Forms.CheckState.Checked;
			this.chkTtsMsg_ConfirmF.Location = new System.Drawing.Point(820, 11);
			this.chkTtsMsg_ConfirmF.Name = "chkTtsMsg_ConfirmF";
			this.chkTtsMsg_ConfirmF.Size = new System.Drawing.Size(141, 38);
			this.chkTtsMsg_ConfirmF.TabIndex = 67;
			this.chkTtsMsg_ConfirmF.Text = "확인요청";
			this.chkTtsMsg_ConfirmF.Visible = false;
			// 
			// chkTtsMsg_EventF
			// 
			this.chkTtsMsg_EventF.Checked = true;
			this.chkTtsMsg_EventF.CheckState = System.Windows.Forms.CheckState.Checked;
			this.chkTtsMsg_EventF.Location = new System.Drawing.Point(1001, 11);
			this.chkTtsMsg_EventF.Name = "chkTtsMsg_EventF";
			this.chkTtsMsg_EventF.Size = new System.Drawing.Size(141, 38);
			this.chkTtsMsg_EventF.TabIndex = 66;
			this.chkTtsMsg_EventF.Text = "이벤트 수신";
			// 
			// txtTtsMsg_Message
			// 
			this.txtTtsMsg_Message.Location = new System.Drawing.Point(102, 76);
			this.txtTtsMsg_Message.Name = "txtTtsMsg_Message";
			this.txtTtsMsg_Message.Size = new System.Drawing.Size(605, 25);
			this.txtTtsMsg_Message.TabIndex = 62;
			this.txtTtsMsg_Message.Text = "";
			// 
			// label24
			// 
			this.label24.AutoSize = true;
			this.label24.Location = new System.Drawing.Point(23, 82);
			this.label24.Name = "label24";
			this.label24.Size = new System.Drawing.Size(52, 18);
			this.label24.TabIndex = 61;
			this.label24.Text = "메시지";
			// 
			// txtTtsMsg_TelNum
			// 
			this.txtTtsMsg_TelNum.Location = new System.Drawing.Point(356, 16);
			this.txtTtsMsg_TelNum.Name = "txtTtsMsg_TelNum";
			this.txtTtsMsg_TelNum.Size = new System.Drawing.Size(351, 25);
			this.txtTtsMsg_TelNum.TabIndex = 60;
			this.txtTtsMsg_TelNum.Text = "";
			// 
			// label25
			// 
			this.label25.AutoSize = true;
			this.label25.Location = new System.Drawing.Point(277, 22);
			this.label25.Name = "label25";
			this.label25.Size = new System.Drawing.Size(67, 18);
			this.label25.TabIndex = 59;
			this.label25.Text = "착신번호";
			// 
			// cboTtsMsg_Profile
			// 
			this.cboTtsMsg_Profile.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
			this.cboTtsMsg_Profile.Items.AddRange(new object[] {
																   "LIMIT_MAX_RECEIVERS",
																   "TTS_MENT_SIZE"});
			this.cboTtsMsg_Profile.Location = new System.Drawing.Point(910, 76);
			this.cboTtsMsg_Profile.Name = "cboTtsMsg_Profile";
			this.cboTtsMsg_Profile.Size = new System.Drawing.Size(294, 23);
			this.cboTtsMsg_Profile.TabIndex = 58;
			// 
			// btnTtsMsg_Profile
			// 
			this.btnTtsMsg_Profile.Location = new System.Drawing.Point(1215, 71);
			this.btnTtsMsg_Profile.Name = "btnTtsMsg_Profile";
			this.btnTtsMsg_Profile.Size = new System.Drawing.Size(142, 33);
			this.btnTtsMsg_Profile.TabIndex = 57;
			this.btnTtsMsg_Profile.Text = "프로파일 조회";
			this.btnTtsMsg_Profile.Click += new System.EventHandler(this.btnTtsMsg_Profile_Click);
			// 
			// btnTtsMsg_Send
			// 
			this.btnTtsMsg_Send.Location = new System.Drawing.Point(1215, 16);
			this.btnTtsMsg_Send.Name = "btnTtsMsg_Send";
			this.btnTtsMsg_Send.Size = new System.Drawing.Size(142, 33);
			this.btnTtsMsg_Send.TabIndex = 56;
			this.btnTtsMsg_Send.Text = "전송";
			this.btnTtsMsg_Send.Click += new System.EventHandler(this.btnTtsMsg_Send_Click);
			// 
			// label26
			// 
			this.label26.AutoSize = true;
			this.label26.ForeColor = System.Drawing.Color.Red;
			this.label26.Location = new System.Drawing.Point(356, 49);
			this.label26.Name = "label26";
			this.label26.Size = new System.Drawing.Size(156, 18);
			this.label26.TabIndex = 55;
			this.label26.Text = "전화번호는 \'|\'로 구분";
			// 
			// txtTtsMsg_UserName
			// 
			this.txtTtsMsg_UserName.Location = new System.Drawing.Point(102, 16);
			this.txtTtsMsg_UserName.Name = "txtTtsMsg_UserName";
			this.txtTtsMsg_UserName.Size = new System.Drawing.Size(141, 25);
			this.txtTtsMsg_UserName.TabIndex = 54;
			this.txtTtsMsg_UserName.Text = "";
			// 
			// label27
			// 
			this.label27.AutoSize = true;
			this.label27.Location = new System.Drawing.Point(23, 22);
			this.label27.Name = "label27";
			this.label27.Size = new System.Drawing.Size(52, 18);
			this.label27.TabIndex = 53;
			this.label27.Text = "작성자";
			// 
			// tabPage6
			// 
			this.tabPage6.Controls.AddRange(new System.Windows.Forms.Control[] {
																				   this.label13,
																				   this.cboCnfr_Profile,
																				   this.btnCnfr_Status,
																				   this.btnCnfr_Profile,
																				   this.btnCnfr_Del,
																				   this.btnCnfr_Add,
																				   this.btnCnfr_Stop,
																				   this.btnCnfr_Start,
																				   this.chkCnfr_EventF,
																				   this.label10,
																				   this.txtCnfr_TelNum,
																				   this.label11});
			this.tabPage6.Location = new System.Drawing.Point(4, 24);
			this.tabPage6.Name = "tabPage6";
			this.tabPage6.Size = new System.Drawing.Size(1541, 173);
			this.tabPage6.TabIndex = 5;
			this.tabPage6.Text = "회의통화";
			this.tabPage6.Visible = false;
			// 
			// label13
			// 
			this.label13.AutoSize = true;
			this.label13.ForeColor = System.Drawing.Color.Red;
			this.label13.Location = new System.Drawing.Point(104, 80);
			this.label13.Name = "label13";
			this.label13.Size = new System.Drawing.Size(215, 18);
			this.label13.TabIndex = 24;
			this.label13.Text = "참여자강퇴는 번호 1개만 가능";
			// 
			// cboCnfr_Profile
			// 
			this.cboCnfr_Profile.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
			this.cboCnfr_Profile.Items.AddRange(new object[] {
																 "CID_NUMBER",
																 "CREATE_MAX_USER",
																 "CONF_MAX_USER"});
			this.cboCnfr_Profile.Location = new System.Drawing.Point(910, 76);
			this.cboCnfr_Profile.Name = "cboCnfr_Profile";
			this.cboCnfr_Profile.Size = new System.Drawing.Size(294, 23);
			this.cboCnfr_Profile.TabIndex = 23;
			// 
			// btnCnfr_Status
			// 
			this.btnCnfr_Status.Location = new System.Drawing.Point(1368, 71);
			this.btnCnfr_Status.Name = "btnCnfr_Status";
			this.btnCnfr_Status.Size = new System.Drawing.Size(141, 33);
			this.btnCnfr_Status.TabIndex = 22;
			this.btnCnfr_Status.Text = "상태 조회";
			this.btnCnfr_Status.Click += new System.EventHandler(this.btnCnfr_Status_Click);
			// 
			// btnCnfr_Profile
			// 
			this.btnCnfr_Profile.Location = new System.Drawing.Point(1215, 71);
			this.btnCnfr_Profile.Name = "btnCnfr_Profile";
			this.btnCnfr_Profile.Size = new System.Drawing.Size(142, 33);
			this.btnCnfr_Profile.TabIndex = 21;
			this.btnCnfr_Profile.Text = "프로파일 조회";
			this.btnCnfr_Profile.Click += new System.EventHandler(this.btnCnfr_Profile_Click);
			// 
			// btnCnfr_Del
			// 
			this.btnCnfr_Del.Location = new System.Drawing.Point(1368, 16);
			this.btnCnfr_Del.Name = "btnCnfr_Del";
			this.btnCnfr_Del.Size = new System.Drawing.Size(141, 33);
			this.btnCnfr_Del.TabIndex = 20;
			this.btnCnfr_Del.Text = "참여자 강퇴";
			this.btnCnfr_Del.Click += new System.EventHandler(this.btnCnfr_Del_Click);
			// 
			// btnCnfr_Add
			// 
			this.btnCnfr_Add.Location = new System.Drawing.Point(1215, 16);
			this.btnCnfr_Add.Name = "btnCnfr_Add";
			this.btnCnfr_Add.Size = new System.Drawing.Size(142, 33);
			this.btnCnfr_Add.TabIndex = 19;
			this.btnCnfr_Add.Text = "참여자 추가";
			this.btnCnfr_Add.Click += new System.EventHandler(this.btnCnfr_Add_Click);
			// 
			// btnCnfr_Stop
			// 
			this.btnCnfr_Stop.Location = new System.Drawing.Point(1063, 16);
			this.btnCnfr_Stop.Name = "btnCnfr_Stop";
			this.btnCnfr_Stop.Size = new System.Drawing.Size(141, 33);
			this.btnCnfr_Stop.TabIndex = 18;
			this.btnCnfr_Stop.Text = "종료";
			this.btnCnfr_Stop.Click += new System.EventHandler(this.btnCnfr_Stop_Click);
			// 
			// btnCnfr_Start
			// 
			this.btnCnfr_Start.Location = new System.Drawing.Point(910, 16);
			this.btnCnfr_Start.Name = "btnCnfr_Start";
			this.btnCnfr_Start.Size = new System.Drawing.Size(142, 33);
			this.btnCnfr_Start.TabIndex = 17;
			this.btnCnfr_Start.Text = "시작";
			this.btnCnfr_Start.Click += new System.EventHandler(this.btnCnfr_Start_Click);
			// 
			// chkCnfr_EventF
			// 
			this.chkCnfr_EventF.Checked = true;
			this.chkCnfr_EventF.CheckState = System.Windows.Forms.CheckState.Checked;
			this.chkCnfr_EventF.Location = new System.Drawing.Point(266, 11);
			this.chkCnfr_EventF.Name = "chkCnfr_EventF";
			this.chkCnfr_EventF.Size = new System.Drawing.Size(141, 38);
			this.chkCnfr_EventF.TabIndex = 16;
			this.chkCnfr_EventF.Text = "이벤트 수신";
			// 
			// label10
			// 
			this.label10.AutoSize = true;
			this.label10.ForeColor = System.Drawing.Color.Red;
			this.label10.Location = new System.Drawing.Point(102, 49);
			this.label10.Name = "label10";
			this.label10.Size = new System.Drawing.Size(156, 18);
			this.label10.TabIndex = 14;
			this.label10.Text = "전화번호는 \'|\'로 구분";
			// 
			// txtCnfr_TelNum
			// 
			this.txtCnfr_TelNum.Location = new System.Drawing.Point(102, 16);
			this.txtCnfr_TelNum.Name = "txtCnfr_TelNum";
			this.txtCnfr_TelNum.Size = new System.Drawing.Size(141, 25);
			this.txtCnfr_TelNum.TabIndex = 13;
			this.txtCnfr_TelNum.Text = "";
			// 
			// label11
			// 
			this.label11.AutoSize = true;
			this.label11.Location = new System.Drawing.Point(23, 22);
			this.label11.Name = "label11";
			this.label11.Size = new System.Drawing.Size(67, 18);
			this.label11.TabIndex = 12;
			this.label11.Text = "착신번호";
			// 
			// tabPage9
			// 
			this.tabPage9.Controls.AddRange(new System.Windows.Forms.Control[] {
																				   this.txtTtsAuth_No,
																				   this.label22,
																				   this.btnTtsAuth_Send,
																				   this.txtTtsAuth_TelNum,
																				   this.label29});
			this.tabPage9.Location = new System.Drawing.Point(4, 24);
			this.tabPage9.Name = "tabPage9";
			this.tabPage9.Size = new System.Drawing.Size(1541, 173);
			this.tabPage9.TabIndex = 8;
			this.tabPage9.Text = "TTS인증";
			this.tabPage9.Visible = false;
			// 
			// txtTtsAuth_No
			// 
			this.txtTtsAuth_No.Location = new System.Drawing.Point(102, 76);
			this.txtTtsAuth_No.Name = "txtTtsAuth_No";
			this.txtTtsAuth_No.Size = new System.Drawing.Size(141, 25);
			this.txtTtsAuth_No.TabIndex = 77;
			this.txtTtsAuth_No.Text = "";
			// 
			// label22
			// 
			this.label22.AutoSize = true;
			this.label22.Location = new System.Drawing.Point(23, 82);
			this.label22.Name = "label22";
			this.label22.Size = new System.Drawing.Size(67, 18);
			this.label22.TabIndex = 76;
			this.label22.Text = "인증번호";
			// 
			// btnTtsAuth_Send
			// 
			this.btnTtsAuth_Send.Location = new System.Drawing.Point(1215, 16);
			this.btnTtsAuth_Send.Name = "btnTtsAuth_Send";
			this.btnTtsAuth_Send.Size = new System.Drawing.Size(142, 33);
			this.btnTtsAuth_Send.TabIndex = 71;
			this.btnTtsAuth_Send.Text = "전송";
			this.btnTtsAuth_Send.Click += new System.EventHandler(this.btnTtsAuth_Send_Click);
			// 
			// txtTtsAuth_TelNum
			// 
			this.txtTtsAuth_TelNum.Location = new System.Drawing.Point(102, 16);
			this.txtTtsAuth_TelNum.Name = "txtTtsAuth_TelNum";
			this.txtTtsAuth_TelNum.Size = new System.Drawing.Size(141, 25);
			this.txtTtsAuth_TelNum.TabIndex = 69;
			this.txtTtsAuth_TelNum.Text = "";
			// 
			// label29
			// 
			this.label29.AutoSize = true;
			this.label29.Location = new System.Drawing.Point(23, 22);
			this.label29.Name = "label29";
			this.label29.Size = new System.Drawing.Size(67, 18);
			this.label29.TabIndex = 68;
			this.label29.Text = "착신번호";
			// 
			// tabPage3
			// 
			this.tabPage3.Controls.AddRange(new System.Windows.Forms.Control[] {
																				   this.groupBox5,
																				   this.btnCallTf_Query,
																				   this.txtCallTf_TelNum,
																				   this.label30});
			this.tabPage3.Location = new System.Drawing.Point(4, 24);
			this.tabPage3.Name = "tabPage3";
			this.tabPage3.Size = new System.Drawing.Size(1541, 173);
			this.tabPage3.TabIndex = 11;
			this.tabPage3.Text = "돌려주기";
			// 
			// groupBox5
			// 
			this.groupBox5.Controls.AddRange(new System.Windows.Forms.Control[] {
																					this.rdoCallTransfer_True,
																					this.rdoCallTransfer_False});
			this.groupBox5.Location = new System.Drawing.Point(272, 16);
			this.groupBox5.Name = "groupBox5";
			this.groupBox5.Size = new System.Drawing.Size(256, 88);
			this.groupBox5.TabIndex = 88;
			this.groupBox5.TabStop = false;
			this.groupBox5.Text = "번호 표시";
			// 
			// rdoCallTransfer_True
			// 
			this.rdoCallTransfer_True.Location = new System.Drawing.Point(124, 27);
			this.rdoCallTransfer_True.Name = "rdoCallTransfer_True";
			this.rdoCallTransfer_True.Size = new System.Drawing.Size(116, 33);
			this.rdoCallTransfer_True.TabIndex = 1;
			this.rdoCallTransfer_True.Text = "발번번호";
			// 
			// rdoCallTransfer_False
			// 
			this.rdoCallTransfer_False.Checked = true;
			this.rdoCallTransfer_False.Location = new System.Drawing.Point(17, 27);
			this.rdoCallTransfer_False.Name = "rdoCallTransfer_False";
			this.rdoCallTransfer_False.Size = new System.Drawing.Size(96, 33);
			this.rdoCallTransfer_False.TabIndex = 0;
			this.rdoCallTransfer_False.TabStop = true;
			this.rdoCallTransfer_False.Text = "원번호";
			// 
			// btnCallTf_Query
			// 
			this.btnCallTf_Query.Location = new System.Drawing.Point(968, 24);
			this.btnCallTf_Query.Name = "btnCallTf_Query";
			this.btnCallTf_Query.Size = new System.Drawing.Size(142, 33);
			this.btnCallTf_Query.TabIndex = 87;
			this.btnCallTf_Query.Text = "돌려주기 요청";
			this.btnCallTf_Query.Click += new System.EventHandler(this.btnCallTf_Query_Click);
			// 
			// txtCallTf_TelNum
			// 
			this.txtCallTf_TelNum.Location = new System.Drawing.Point(112, 24);
			this.txtCallTf_TelNum.Name = "txtCallTf_TelNum";
			this.txtCallTf_TelNum.Size = new System.Drawing.Size(141, 25);
			this.txtCallTf_TelNum.TabIndex = 86;
			this.txtCallTf_TelNum.Text = "";
			// 
			// label30
			// 
			this.label30.AutoSize = true;
			this.label30.Location = new System.Drawing.Point(32, 24);
			this.label30.Name = "label30";
			this.label30.Size = new System.Drawing.Size(67, 18);
			this.label30.TabIndex = 85;
			this.label30.Text = "착신번호";
			// 
			// tmrEvent
			// 
			this.tmrEvent.Enabled = true;
			this.tmrEvent.Tick += new System.EventHandler(this.tmrEvent_Tick);
			// 
			// FMain
			// 
			this.AutoScaleBaseSize = new System.Drawing.Size(8, 18);
			this.ClientSize = new System.Drawing.Size(1549, 886);
			this.Controls.AddRange(new System.Windows.Forms.Control[] {
																		  this.lstLog,
																		  this.groupBox1,
																		  this.tabMain});
			this.MaximizeBox = false;
			this.MinimizeBox = false;
			this.Name = "FMain";
			this.Text = "SKbroadband OpenAPI Sample for C#";
			this.groupBox1.ResumeLayout(false);
			this.tabMain.ResumeLayout(false);
			this.tabPage1.ResumeLayout(false);
			this.tabPage13.ResumeLayout(false);
			this.tabPage4.ResumeLayout(false);
			this.tabPage11.ResumeLayout(false);
			this.tabPage12.ResumeLayout(false);
			this.groupBox6.ResumeLayout(false);
			this.tabPage10.ResumeLayout(false);
			this.tabPage2.ResumeLayout(false);
			this.groupBox2.ResumeLayout(false);
			this.tabPage5.ResumeLayout(false);
			this.tabPage7.ResumeLayout(false);
			this.groupBox4.ResumeLayout(false);
			this.groupBox3.ResumeLayout(false);
			this.tabPage8.ResumeLayout(false);
			this.tabPage6.ResumeLayout(false);
			this.tabPage9.ResumeLayout(false);
			this.tabPage3.ResumeLayout(false);
			this.groupBox5.ResumeLayout(false);
			this.ResumeLayout(false);

		}
		#endregion

		[STAThread]
		static void Main() 
		{
			Application.Run(new FMain());
		}

		/*
		 *  Log
		 */
		public void Log(string strMsg)
		{
			lstLog.Items.Add ("[" + DateTime.Now.ToString() + "] " + strMsg);
			lstLog.SelectedIndex = lstLog.Items.Count - 1;
		}

		/*
		 * Timer 이벤트 처리
		 */
		private void tmrEvent_Tick(object sender, System.EventArgs e)
		{
			int			nResult;

			tmrEvent.Enabled = false;

			nResult = IMS_GetEvent(ref m_stEvtMsg);

			if (nResult == (int)ERRCODE.SUCCESS)
			{
				EVT.Proc (m_stEvtMsg.nService, m_stEvtMsg.nEvtType, m_stEvtMsg.nResult, m_stEvtMsg.strDn1, m_stEvtMsg.strDn2, m_stEvtMsg.strExtInfo);
			}
		    
			
			tmrEvent.Enabled = true;
		}

		//===============================================================================
		//  일반 처리
		//===============================================================================
		private void btnApiInit_Click(object sender, System.EventArgs e)
		{
			int	nResult;

			nResult = IMS_Init(txtAppKey.Text);

			if (nResult == 0)	Log("**** API 초기화 성공");
			else				Log(">>>> API 초기화 실패 : Cause[" + nResult + "-" + ERR.StrFCause(nResult) + "]");		
		}

		private void btnLogin_Click(object sender, System.EventArgs e)
		{
			int	nResult;

			nResult = IMS_Login(txtUserId.Text, txtPasswd.Text);

			if (nResult == 0)	Log("**** 로그인 요청 성공");
			else				Log(">>>> 로그인 요청 실패 : Cause[" + nResult + "-" + ERR.StrFCause(nResult) + "]");		
		}

		private void btnLogout_Click(object sender, System.EventArgs e)
		{
			int	nResult;

			nResult = IMS_Logout();

			if (nResult == 0)	Log("**** 로그아웃 요청 성공");
			else				Log(">>>> 로그아웃 요청 실패 : Cause[" + nResult + "-" + ERR.StrFCause(nResult) + "]");				
		}

		private void btnSetRest_Click(object sender, System.EventArgs e)
		{
			int	nResult;

			nResult = IMS_SetRest(1);

			if (nResult == 0)	Log("**** 부재중 설정 요청 성공");
			else				Log(">>>> 부재중 설정 요청 실패 : Cause[" + nResult + "-" + ERR.StrFCause(nResult) + "]");				
		}

		private void btnUnsetRest_Click(object sender, System.EventArgs e)
		{
			int	nResult;

			nResult = IMS_SetRest(0);

			if (nResult == 0)	Log("**** 부재중 해제 요청 성공");
			else				Log(">>>> 부재중 해제 요청 실패 : Cause[" + nResult + "-" + ERR.StrFCause(nResult) + "]");			
		}

		//===============================================================================
		//  사용자 관리
		//===============================================================================
		private void btnUserMng_SmsAuth_Click(object sender, System.EventArgs e)
		{
			int	nResult;

			nResult = IMS_AuthSms(txtUserMng_TelNum.Text);

			if (nResult != 0)	Log(">>>> SMS 인증번호 전송요청 실패 : Cause[" + nResult + "-" + ERR.StrFCause(nResult) + "]");			
		}

		private void btnUserMng_TtsAuth_Click(object sender, System.EventArgs e)
		{
			int	nResult;

			nResult = IMS_AuthTts(txtUserMng_TelNum.Text);

			if (nResult != 0) Log(">>>> TTS 인증번호 전송요청 실패 : Cause[" + nResult + "-" + ERR.StrFCause(nResult) + "]");					
		}

		private void btnUserMng_CreateUser_Click(object sender, System.EventArgs e)
		{
			int	nResult;

			nResult = IMS_CreateUser(txtUserMng_UserId.Text, txtUserMng_Passwd.Text, txtUserMng_TelNum.Text, txtUserMng_AuthNo.Text);

			if (nResult != 0) Log(">>>> 사용자 등록 요청 실패 : Cause[" + nResult + "-" + ERR.StrFCause(nResult) + "]");					
		}

		private void btnUserMng_ChgPasswd_Click(object sender, System.EventArgs e)
		{
			int	nResult;

			nResult = IMS_ChgPasswd(txtUserMng_UserId.Text, txtUserMng_Passwd.Text, txtUserMng_TelNum.Text, txtUserMng_AuthNo.Text);

			if (nResult != 0) Log(">>>> 사용자 비밀번호 변경 요청 실패 : Cause[" + nResult + "-" + ERR.StrFCause(nResult) + "]");							
		}


		//===============================================================================
		//  ClickCall
		//===============================================================================
		private void btnClickCall_Start_Click(object sender, System.EventArgs e)
		{
			int	nResult;
			int	nRecordF;
			int	nEventF;
			int nAutoAnswerF;

			if      (rdoClickCall_False.Checked == true) nRecordF = 0;
			else if (rdoClickCall_True.Checked == true) nRecordF = 1;
			else nRecordF = 2;

			if (chkClickCall_EventF.Checked == true) nEventF = 1;
			else nEventF = 0;

			if (chkClickCall_AutoAnswerF.Checked == true) nAutoAnswerF = 1;
			else nAutoAnswerF = 0;
					
			nResult = IMS_ClickCall_Start(txtClickCall_TelNum.Text, nRecordF, nEventF, nAutoAnswerF);

			if (nResult != (int)ERRCODE.SUCCESS) Log(">>>> [ClickCall] 시작 요청 실패 : Cause[" + ERR.StrFCause(nResult) + "]");
		}

		private void btnClickCall_Stop_Click(object sender, System.EventArgs e)
		{
			int	nResult;

			nResult = IMS_ClickCall_Stop();

			if (nResult != 0) Log(">>>> [ClickCall] 종료 요청 실패 : Cause[" + nResult + "-" + ERR.StrFCause(nResult) + "]");			
		}

		private void btnClickCall_StartRec_Click(object sender, System.EventArgs e)
		{
			int	nResult;

			nResult = IMS_ClickCall_StartRecord();

			if (nResult != 0) Log(">>>> [ClickCall] 녹음 시작 요청 실패 : Cause[" + nResult + "-" + ERR.StrFCause(nResult) + "]");			
		}

		private void btnClickCall_StopRec_Click(object sender, System.EventArgs e)
		{
			int	nResult;

			nResult = IMS_ClickCall_StopRecord();

			if (nResult != 0) Log(">>>> [ClickCall] 녹음 종료 요청 실패 : Cause[" + nResult + "-" + ERR.StrFCause(nResult) + "]");		
		}

		private void btnClickCall_Profile_Click(object sender, System.EventArgs e)
		{
			int	nResult;

			nResult = IMS_GetProfile("ClickCall", cboClickCall_Profile.Text);

			if (nResult != 0) Log(">>>> [ClickCall] 프로파일 조회 요청 실패 : Cause[" + nResult + "-" + ERR.StrFCause(nResult) + "]");				
		}

		private void btnClickCall_Status_Click(object sender, System.EventArgs e)
		{
			int	nResult;

			nResult = IMS_ClickCall_CallStatus();

			if (nResult != 0) Log(">>>> [ClickCall] 호상태 조회 요청 실패 : Cause[" + nResult + "-" + ERR.StrFCause(nResult) + "]");			
		}

		//===============================================================================
		//  회의통화
		//===============================================================================
		private void btnCnfr_Start_Click(object sender, System.EventArgs e)
		{
			int		nResult;
			int		nEventF;

			if (chkCnfr_EventF.Checked == true) nEventF = 1;
			else nEventF = 0;

			nResult = IMS_Cnfr_Start(txtCnfr_TelNum.Text, nEventF);

			if (nResult != (int)ERRCODE.SUCCESS) Log (">>>> [CNFR] 회의 시작요청 실패 : Cause[" + ERR.StrFCause(nResult) + "]");
		}

		private void btnCnfr_Stop_Click(object sender, System.EventArgs e)
		{
			int	nResult;

			nResult = IMS_Cnfr_Stop();

			if (nResult != 0) Log(">>>> [CNFR] 회의 종료요청 실패 : Cause[" + nResult + "-" + ERR.StrFCause(nResult) + "]");		
		}

		private void btnCnfr_Add_Click(object sender, System.EventArgs e)
		{
			int	nResult;

			nResult = IMS_Cnfr_Add(txtCnfr_TelNum.Text);

			if (nResult != (int)ERRCODE.SUCCESS) Log (">>>> [CNFR] 참여자 추가 요청 실패 : Cause[" + ERR.StrFCause(nResult) + "]");		
		}

		private void btnCnfr_Del_Click(object sender, System.EventArgs e)
		{
			int	nResult;

			nResult = IMS_Cnfr_Del(txtCnfr_TelNum.Text);

			if (nResult != (int)ERRCODE.SUCCESS) Log (">>>> [CNFR] 참여자 강퇴 요청 실패 : Cause[" + ERR.StrFCause(nResult) + "]");			
		}

		private void btnCnfr_Profile_Click(object sender, System.EventArgs e)
		{
			int	nResult;

			nResult = IMS_GetProfile("Conference", cboCnfr_Profile.Text);

			if (nResult != 0) Log(">>>> [CNFR] 프로파일 조회 요청 실패 : Cause[" + nResult + "-" + ERR.StrFCause(nResult) + "]");			
		}

		private void btnCnfr_Status_Click(object sender, System.EventArgs e)
		{
			int	nResult;

			nResult = IMS_Cnfr_CallStatus();

			if (nResult != 0) Log(">>>> [CNFR] 호상태 조회 요청 실패 : Cause[" + nResult + "-" + ERR.StrFCause(nResult) + "]");		
		}


		//===============================================================================
		//  SMS MT
		//===============================================================================
		private void btnSmsMT_Send_Click(object sender, System.EventArgs e)
		{
			int	nResult;

			nResult = IMS_SendSms(txtSmsMT_TelNum.Text, txtSmsMT_Message.Text);

			if (nResult != (int)ERRCODE.SUCCESS) Log (">>>> [SMS_MT] SMS 전송 실패 : Cause[" + nResult + "-" + ERR.StrFCause(nResult) + "]");
		}

		private void btnSmsMT_Profile_Click(object sender, System.EventArgs e)
		{
			int	nResult;

			nResult = IMS_GetProfile("SendSms", cboSmsMT_Profile.Text);

			if (nResult != 0) Log(">>>> [SMS_MT] 프로파일 조회 요청 실패 : Cause[" + nResult + "-" + ERR.StrFCause(nResult) + "]");		
		}


		//===============================================================================
		//  TTS 설문조사
		//===============================================================================
		private void btnTtsRs_Send_Click(object sender, System.EventArgs e)
		{
			int	nResult;
			int	nEventF;

			if (chkTtsRs_EventF.Checked == true) nEventF = 1;
			else nEventF = 0;

			nResult = IMS_TtsRs(txtTtsRs_UserName.Text, txtTtsRs_TelNum.Text, txtTtsRs_Dtmf.Text, nEventF, txtTtsRs_Message.Text);

			if (nResult != (int)ERRCODE.SUCCESS) Log (">>>> [TTS_RS] 설문조사 전송 실패 : Cause[" + nResult + "-" + ERR.StrFCause(nResult) + "]");
		}

		private void btnTtsRs_Profile_Click(object sender, System.EventArgs e)
		{
			int	nResult;

			nResult = IMS_GetProfile("TTSRs", cboTtsRs_Profile.Text);

			if (nResult != 0) Log(">>>> [TTS_RS] 프로파일 조회 요청 실패 : Cause[" + nResult + "-" + ERR.StrFCause(nResult) + "]");			
		}

		//===============================================================================
		//  TTS 메시지
		//===============================================================================
		private void btnTtsMsg_Send_Click(object sender, System.EventArgs e)
		{
			int	nResult;
			int	nEventF;
			//int	nConfirmF;

			if (chkTtsMsg_EventF.Checked == true) nEventF = 1;
			else nEventF = 0;

			//if (chkTtsMsg_ConfirmF.Checked == true) nConfirmF = 1;
			//else nConfirmF = 0;

			nResult = IMS_TtsMsg(txtTtsMsg_UserName.Text, txtTtsMsg_TelNum.Text, nEventF, txtTtsMsg_Message.Text);

			if (nResult != (int)ERRCODE.SUCCESS) Log (">>>> [TTS_MSG] TTS메시지 전송 실패 : Cause[" + nResult + "-" + ERR.StrFCause(nResult) + "]");
		}

		private void btnTtsMsg_Profile_Click(object sender, System.EventArgs e)
		{
			int	nResult;

			nResult = IMS_GetProfile("TTSMsg", cboTtsMsg_Profile.Text);

			if (nResult != 0) Log(">>>> [TTS_MSG] 프로파일 조회 요청 실패 : Cause[" + nResult + "-" + ERR.StrFCause(nResult) + "]");			
		}

		//===============================================================================
		//  TTS 인증
		//===============================================================================
		private void btnTtsAuth_Send_Click(object sender, System.EventArgs e)
		{
			int nResult;

		    nResult = IMS_TtsAuth(txtTtsAuth_TelNum.Text, txtTtsAuth_No.Text);

			if (nResult != (int)ERRCODE.SUCCESS) Log (">>>> [TTS_AUTH] SMS 전송 실패 : Cause[" + nResult + "-" + ERR.StrFCause(nResult) + "]");
		}

		//===============================================================================
		//  착신전환 설정
		//===============================================================================
		private void btnCF_Query_Click(object sender, System.EventArgs e)
		{
			int nResult;
		    
			nResult = IMS_CallForward_Get();

			if (nResult != (int)ERRCODE.SUCCESS) Log (">>>> [CALL_FWD] 착신전환 설정조회 요청 실패 : Cause[" + nResult + "-" + ERR.StrFCause(nResult) + "]");
		}

		private void btnCF_Set_Click(object sender, System.EventArgs e)
		{
			int		nResult;
			string	strCfType;

			if (cboCF_Type.SelectedIndex ==0)	strCfType = "ccf";
			else strCfType = "ucf";

			nResult = IMS_CallForward_Reg(strCfType, txtCF_TelNum.Text);

			if (nResult != (int)ERRCODE.SUCCESS) Log (">>>> [CALL_FWD] 착신전환 설정 요청 실패 : Cause[" + nResult + "-" + ERR.StrFCause(nResult) + "]");
		}

		private void btnCF_Unset_Click(object sender, System.EventArgs e)
		{
			int		nResult;
			string	strCfType;

			if (cboCF_Type.SelectedIndex ==0)	strCfType = "ccf";
			else strCfType = "ucf";


			nResult = IMS_CallForward_Rel(strCfType);

			if (nResult != (int)ERRCODE.SUCCESS) Log (">>>> [CALL_FWD] 착신전환 해제 요청 실패 : Cause[" + nResult + "-" + ERR.StrFCause(nResult) + "]");
		}

		//===============================================================================
		//  착신 녹취
		//===============================================================================
		private void btnTermRec_StartRec_Click(object sender, System.EventArgs e)
		{
			int	nResult;

			nResult = IMS_TermRec_Start();

			if (nResult != (int)ERRCODE.SUCCESS) Log (">>>> [TERM_REC] 녹취 시작 요청 실패 : Cause[" + nResult + "-" + ERR.StrFCause(nResult) + "]");
		}

		private void btnTermRec_StopRec_Click(object sender, System.EventArgs e)
		{
			int	nResult;

			nResult = IMS_TermRec_Stop();

			if (nResult != (int)ERRCODE.SUCCESS) Log (">>>> [TERM_REC] 녹취 종료 요청 실패 : Cause[" + nResult + "-" + ERR.StrFCause(nResult) + "]");		
		}

		private void btnTermRec_Status_Click(object sender, System.EventArgs e)
		{
			int	nResult;

			nResult = IMS_TermRec_CallStatus();

			if (nResult != (int)ERRCODE.SUCCESS) Log (">>>> [TERM_REC] 서비스 상태조회 요청 실패 : Cause[" + nResult + "-" + ERR.StrFCause(nResult) + "]");		
		}

		private void btnTermRec_Stop_Click(object sender, System.EventArgs e)
		{
			int	nResult;

			nResult = IMS_TermRec_StopService();

			if (nResult != (int)ERRCODE.SUCCESS) Log (">>>> [TERM_REC] 서비스 종료 요청 실패 : Cause[" + nResult + "-" + ERR.StrFCause(nResult) + "]");			
		}

		//===============================================================================
		//  사용자 DN 관리
		//===============================================================================
		private void btnDnMng_Query_Click(object sender, System.EventArgs e)
		{
			int	nResult;

			lstDnMng_SubsDn.Items.Clear();
			lstDnMng_MonDn.Items.Clear();

			nResult = IMS_QryMonDnList();
		    
			if (nResult == (int)ERRCODE.SUCCESS)
			{
				nResult = IMS_QrySubDnList();
		        
				if (nResult != (int)ERRCODE.SUCCESS) Log (">>>> 가입자 전화번호리스트 조회 요청 실패 : Cause[" + nResult + "-" + ERR.StrFCause(nResult) + "]");
			}
			else
			{
				Log (">>>> 모니터링 전화번호리스트 조회 요청 실패 : Cause[" + nResult + "-" + ERR.StrFCause(nResult) + "]");
			}
		}

		private void btnDnMng_Add_Click(object sender, System.EventArgs e)
		{
			int	nResult;

		    if (lstDnMng_SubsDn.Items.Count == 0) return;

			nResult = IMS_AddMonDn(lstDnMng_SubsDn.SelectedItem.ToString());
		        
			if (nResult == (int)ERRCODE.SUCCESS) Log (">>>> 모니터링 전화번호 등록 요청 실패 : Cause[" + nResult + "-" + ERR.StrFCause(nResult) + "]");
		}

		private void btnDnMng_Del_Click(object sender, System.EventArgs e)
		{
			int	nResult;
		    		    
			if (lstDnMng_MonDn.Items.Count == 0) return;
		    
			nResult = IMS_DelMonDn(lstDnMng_MonDn.SelectedItem.ToString());
		    
			if (nResult == (int)ERRCODE.SUCCESS) Log (">>>> 모니터링 전화번호 삭제 요청 실패 : Cause[" + nResult + "-" + ERR.StrFCause(nResult) + "]");
		}

		private void btnCallTf_Query_Click(object sender, System.EventArgs e)
		{			
			int	nResult;			
			int nDisplayType;

			if      (rdoCallTransfer_False.Checked == true) nDisplayType = 0;
			else if (rdoCallTransfer_True.Checked == true) nDisplayType = 1;
			else nDisplayType = 0;
			
			nResult = IMS_CallTransfer_Start(txtCallTf_TelNum.Text, nDisplayType);
			if (nResult != (int)ERRCODE.SUCCESS) Log (">>>> 돌려주기 요청 실패 : Cause[" + nResult + "-" + ERR.StrFCause(nResult) + "]");
		}

		private void btnCallPickup_Query_Click(object sender, System.EventArgs e)
		{
			int		nAutoAnswerF;
			int nDisplayType;

			if      (rdoCallPickup_False.Checked == true) nDisplayType = 0;
			else if (rdoCallPickup_True.Checked == true) nDisplayType = 1;
			else nDisplayType = 0;

			if (chkCallPickup_AutoAnswerF.Checked == true) nAutoAnswerF = 1;
			else nAutoAnswerF = 0;

			int	nResult;
			nResult = IMS_CallPickup_Start(nAutoAnswerF, nDisplayType);

			if (nResult != (int)ERRCODE.SUCCESS) Log (">>>> 당겨받기 요청 실패 : Cause[" + nResult + "-" + ERR.StrFCause(nResult) + "]");

		}

		private void btnMmsMT_Send_Click(object sender, System.EventArgs e)
		{
			int	nResult;

			nResult = IMS_SendMms(txtMmsMT_TelNum.Text, txtMmsMT_Message.Text);

			if (nResult != (int)ERRCODE.SUCCESS) Log (">>>> [MMS_MT] MMS 전송 실패 : Cause[" + nResult + "-" + ERR.StrFCause(nResult) + "]");
		}

		private void btnMmsMT_Profile_Click(object sender, System.EventArgs e)
		{
			int	nResult;

			nResult = IMS_GetProfile("SendMms", cboMmsMT_Profile.Text);

			if (nResult != 0) Log(">>>> [MMS_MT] 프로파일 조회 요청 실패 : Cause[" + nResult + "-" + ERR.StrFCause(nResult) + "]");		
		}

		private void lstLog_SelectedIndexChanged(object sender, System.EventArgs e)
		{
		
		}

		private void btnGetRest_Click(object sender, System.EventArgs e)
		{	
            int nResult;
		
			nResult = IMS_GetRest(ref m_stRest);

			if (nResult == (int)ERRCODE.SUCCESS)
			{
				Log(">>>> 부재중 상태 조회 결과 : " + m_stRest.strRest);	
			}
			else
			{
				Log(">>>> 부재중 상태 조회 요청 실패 : Cause[" + nResult + "-" + ERR.StrFCause(nResult) + "]");	
			}
		}

		private void button1_Click(object sender, System.EventArgs e)
		{
			int nResult;
		
			nResult = IMS_GetVersion(ref m_stVersion);

			if (nResult == (int)ERRCODE.SUCCESS)
			{
				Log(">>>> API 버전 : " + m_stVersion.strVersion);	
			}
		}
		
	}
}

