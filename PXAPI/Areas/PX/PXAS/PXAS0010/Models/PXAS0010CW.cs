using Newtonsoft.Json;
using PXLIB;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static PXLIB.PXCL_stc;

namespace PXAPI.Areas.PXAS
{
    public class PXAS0010CW
    {
        #region PXAS0010CW_Declarations

        /// <summary> 共通データ </summary>
        public PX_COMMON PX_COMMONData { get; set; }

        #endregion

        /// <summary>
        /// メニュー一覧取得
        /// </summary>
        public JsonData GetMenuList()
        {
            JsonData loadData = new JsonData();
            StringBuilder cmdTxt = new StringBuilder();
            PXCL_dba dbAccess = new PXCL_dba(PXCL_dba.ConnectionSystem, PX_COMMONData);
            RowChildDataJson jsonDataChild = new RowChildDataJson();
            int setLv01 = 0;
            int setLv03 = 0;

            try
            {
                loadData.RowData = new List<RowDataJson>();

                //  データベース接続
                dbAccess.DBConect();

                //  ◆SELECT文の設定
                cmdTxt.AppendLine("SELECT");
                cmdTxt.AppendLine("    WEB.MENULV01");
                cmdTxt.AppendLine("   ,WEB.MENULV02");
                cmdTxt.AppendLine("   ,WEB.MENULV03");
                cmdTxt.AppendLine("   ,WEB.CALLTP");
                cmdTxt.AppendLine("   ,WEB.CALLWEB");
                cmdTxt.AppendLine("   ,PRG.LIBNM");
                cmdTxt.AppendLine("   ,WEB.WEBCMM");
                cmdTxt.AppendLine("   ,PRG.MGCMM");
                cmdTxt.AppendLine("   ,WEB.SUBCMM");
                cmdTxt.AppendLine("   ,PRG.PRGCMM");
                cmdTxt.AppendLine("   ,WEB.MENUNM");
                cmdTxt.AppendLine("   ,PRG.PRGNM");
                cmdTxt.AppendLine("   ,WEB.MENUICON1");
                cmdTxt.AppendLine("   ,PRG.PRGSUBKBN1");
                cmdTxt.AppendLine("   ,WEB.MENUICON2");
                cmdTxt.AppendLine("   ,PRG.PRGSUBKBN2");
                cmdTxt.AppendLine("   ,WEB.MENUICON3");
                cmdTxt.AppendLine("   ,PRG.PRGSUBKBN3");
                cmdTxt.AppendLine("FROM P3AS_MENU_WEB AS WEB");
                cmdTxt.AppendLine("LEFT JOIN P3AS_PROGRAM AS PRG ON PRG.PRGID = WEB.PROGRAMID");
                cmdTxt.AppendLine("WHERE WEB.MENUID = @MENUID");
                cmdTxt.AppendLine("  AND WEB.MENULV02 = -1");
                cmdTxt.AppendLine("ORDER BY WEB.MENUID, WEB.MENULV01, WEB.MENULV02, WEB.MENULV03");
                //  ◆パラメータ設定
                using (SqlCommand sqlCmd = new SqlCommand())
                {
                    sqlCmd.Parameters.Add("@MENUID", SqlDbType.VarChar).Value = PX_COMMONData.MENUID;
                    //  ◆SELECT文実行
                    using (SqlDataReader res = dbAccess.SQLSelectParameter(cmdTxt.ToString(), sqlCmd))
                    {
                        if (res != null && res.HasRows)
                        {
                            while (res.Read())
                            {
                                int menuLv01 = (Int16)res["MENULV01"];
                                int menuLv02 = (Int16)res["MENULV02"];
                                int menuLv03 = (Int16)res["MENULV03"];
                                string callTp = res["CALLTP"] as string;
                                string libNm = res["CALLWEB"] as string;
                                if (libNm != null || libNm != "") { libNm = res["LIBNM"] as string; }
                                string subCmm = res["SUBCMM"] as string;
                                if (subCmm != null || subCmm != "") { libNm = res["PRGCMM"] as string; }
                                string webCmm = res["WEBCMM"] as string;
                                if (webCmm != null || webCmm != "") { webCmm = res["MGCMM"] as string; }
                                string menuNm = res["MENUNM"] as string;
                                if (menuNm != null || menuNm != "") { menuNm = res["PRGNM"] as string; }
                                string menuIcon1 = res["MENUICON1"] as string;
                                if (menuIcon1 != null || menuIcon1 != "") { menuIcon1 = res["PRGSUBKBN1"] as string; }
                                string menuIcon2 = res["MENUICON2"] as string;
                                if (menuIcon2 != null || menuIcon2 != "") { menuIcon2 = res["PRGSUBKBN2"] as string; }
                                string menuIcon3 = res["MENUICON3"] as string;
                                if (menuIcon3 != null || menuIcon3 != "") { menuIcon3 = res["PRGSUBKBN3"] as string; }

                                if (setLv01 != menuLv01)
                                {
                                    RowDataJson jsonData = new RowDataJson();
                                    setLv01 = menuLv01;
                                    setLv03 = 0;

                                    jsonData.ChildData = new List<RowChildDataJson>();
                                    jsonData.ChildRowID = setLv01.ToString();
                                    jsonData.ChildRowURL = libNm;
                                    switch (callTp)
                                    {
                                        case "URL":
                                            jsonData.ChildRowURLType = "0";
                                            break;
                                        case "OUT":
                                            jsonData.ChildRowURLType = "1";
                                            break;
                                        default:
                                            jsonData.ChildRowURLType = "";
                                            break;
                                    }
                                    jsonData.SUBCMM = subCmm;
                                    jsonData.MENUICON1 = menuIcon1;
                                    jsonData.MENUNM = menuNm;
                                    jsonData.MENUICON2 = menuIcon2;
                                    jsonData.ChildRowAfterTxt = "";
                                    jsonData.ParentClass = "";

                                    loadData.RowData.Add(jsonData);
                                }
                                else if (setLv03 != menuLv03)
                                {
                                    jsonDataChild = new RowChildDataJson();
                                    setLv03 = menuLv03;

                                    jsonDataChild.ChildRowID = setLv01 + "_" + setLv03;
                                    jsonDataChild.ChildRowURL = libNm;
                                    switch (callTp)
                                    {
                                        case "URL":
                                            jsonDataChild.ChildRowURLType = "0";
                                            break;
                                        case "OUT":
                                            jsonDataChild.ChildRowURLType = "1";
                                            break;
                                        default:
                                            jsonDataChild.ChildRowURLType = "";
                                            break;
                                    }
                                    jsonDataChild.SUBCMM = subCmm;
                                    jsonDataChild.MENUICON1 = menuIcon1;
                                    jsonDataChild.MENUNM = menuNm;
                                    jsonDataChild.MENUICON2 = menuIcon2;
                                    jsonDataChild.ChildRowAfterTxt = "";
                                    jsonDataChild.ParentClass = "";
                                    jsonDataChild.MENUICON3 = menuIcon3;
                                    jsonDataChild.WEBCMM = webCmm;

                                    RowDataJson jsonData = loadData.RowData[(loadData.RowData.Count() - 1)];
                                    jsonData.ChildData.Add(jsonDataChild);
                                    loadData.RowData[(loadData.RowData.Count() - 1)] = jsonData;
                                }
                            }
                        }
                    }
                }
            }
            catch (Exception Exc)
            {
                string logTitle = "メニュー一覧取得";
                string logMsg = "エラー「" + Exc.Message + "」";
                PXCL_log.writeLog(PXCL_log.ERR, PXCL_log.LOGIN, logTitle, logMsg, System.Reflection.MethodBase.GetCurrentMethod(), PX_COMMONData);
            }
            finally
            {
                if (dbAccess != null)
                {
                    //  データベースの接続解除
                    dbAccess.DBClose();
                }
            }

            return loadData;
        }
    }

    #region LNAS0000MD_Class

    /// <summary> メニュー一覧 </summary>
    public class JsonData
    {
        /// <summary> メニュー一覧 </summary>
        public List<RowDataJson> RowData { get; set; }
    }

    /// <summary> メニュー内容 </summary>
    public class RowDataJson
    {
        /// <summary>  </summary>
        public string ChildRowID { get; set; }
        /// <summary>  </summary>
        public string ParentClass { get; set; }
        /// <summary>  </summary>
        public string SUBCMM { get; set; }
        /// <summary>  </summary>
        public string MENUNM { get; set; }
        /// <summary>  </summary>
        public string MENUICON1 { get; set; }
        /// <summary>  </summary>
        public string ChildRowURL { get; set; }
        /// <summary>  </summary>
        public string ChildRowURLType { get; set; }
        /// <summary>  </summary>
        public string MENUICON2 { get; set; }
        /// <summary>  </summary>
        public string ChildRowAfterTxt { get; set; }
        /// <summary>  </summary>
        public List<RowChildDataJson> ChildData { get; set; }
    }

    /// <summary>  </summary>
    public class RowChildDataJson
    {
        /// <summary>  </summary>
        public string ChildRowID { get; set; }
        /// <summary>  </summary>
        public string ParentClass { get; set; }
        /// <summary>  </summary>
        public string SUBCMM { get; set; }
        /// <summary>  </summary>
        public string MENUNM { get; set; }
        /// <summary>  </summary>
        public string MENUICON1 { get; set; }
        /// <summary>  </summary>
        public string ChildRowURL { get; set; }
        /// <summary>  </summary>
        public string ChildRowURLType { get; set; }
        /// <summary>  </summary>
        public string MENUICON2 { get; set; }
        /// <summary>  </summary>
        public string ChildRowAfterTxt { get; set; }
        /// <summary>  </summary>
        public string MENUICON3 { get; set; }
        /// <summary>  </summary>
        public string WEBCMM { get; set; }
    }

    /// <summary>  </summary>
    public class RowData
    {
        /// <summary>  </summary>
        [JsonProperty(PropertyName = "ChildRow")]
        public string ChildRow { get; set; }
        /// <summary>  </summary>
        [JsonProperty(PropertyName = "ParentClass")]
        public string ParentClass { get; set; }
        /// <summary>  </summary>
        [JsonProperty(PropertyName = "ChildRowMain")]
        public string ChildRowMain { get; set; }
        /// <summary>  </summary>
        [JsonProperty(PropertyName = "ChildRowMainFlag")]
        public string ChildRowMainFlag { get; set; }
        /// <summary>  </summary>
        [JsonProperty(PropertyName = "ChildData")]
        public List<string[]> ChildData { get; set; }
    }

    #endregion
}
