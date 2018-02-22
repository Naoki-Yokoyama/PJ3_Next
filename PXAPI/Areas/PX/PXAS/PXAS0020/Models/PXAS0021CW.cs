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
    public class PXAS0021CW
    {
        /// <summary> メニューデータ </summary>
        public class MenuData
        {
            public string TitleNm { get; set; }
            public string MenuLv1 { get; set; }
            public string GrpCnt { get; set; }
            public string ProCnt { get; set; }
        }

        /// <summary> メニューデータ取得 </summary>
        /// <returns>メニュー</returns>
        public static List<MenuData> GetMenuData(PX_COMMON PX_COMMONData)
        {
            var MenuData = new List<MenuData>();
            PXCL_dba dbAccess = new PXCL_dba(PXCL_dba.ConnectionSystem, PX_COMMONData);

            var cmdTxt = new StringBuilder();
            try
            {
                //  データベースを開く
                dbAccess.DBConect();

                //  SELECT文作成

                cmdTxt.AppendLine("SELECT * FROM P3AS_MENU_WEB AS MENU ");
                cmdTxt.AppendLine(" LEFT JOIN (SELECT MENUID, MENULV01, COUNT(MENUSP) AS GRPCNT FROM P3AS_MENU_WEB WHERE MENUSP = 'GRP' GROUP BY MENUID, MENULV01) AS GRP ON MENU.MENUID = GRP.MENUID AND MENU.MENULV01 = GRP.MENULV01 ");
                cmdTxt.AppendLine(" LEFT JOIN (SELECT MENUID, MENULV01, COUNT(MENUSP) AS PROCNT FROM P3AS_MENU_WEB WHERE MENUSP = 'CH1' GROUP BY MENUID, MENULV01) AS PRO ON MENU.MENUID = PRO.MENUID AND MENU.MENULV01 = PRO.MENULV01 ");
                cmdTxt.AppendLine(" WHERE MENU.MENUID = @MENUID ");
                cmdTxt.AppendLine("   AND MENU.MENULV02 = '-1' ");
                cmdTxt.AppendLine("   AND MENU.MENULV03 = '-1' ");
                cmdTxt.AppendLine("   AND MENU.MENUSP = 'PAR' ");

                using (var sqlCmd = new SqlCommand())
                {
                    //◆条件の設定
                    sqlCmd.Parameters.Add("@MENUID", SqlDbType.VarChar).Value = PX_COMMONData.MENUID;
                    //◆SQL実行
                    using (var res = dbAccess.SQLSelectParameter(cmdTxt.ToString(), sqlCmd))
                    {
                        if (res.HasRows)
                        {
                            while (res.Read())
                            {
                                MenuData.Add(new MenuData
                                {
                                    TitleNm = res["MENUNM"].ToString(),
                                    MenuLv1 = res["MENULV01"].ToString(),
                                    GrpCnt = (!string.IsNullOrEmpty(res["GRPCNT"].ToString())) ? res["GRPCNT"].ToString() : "0",
                                    ProCnt = (!string.IsNullOrEmpty(res["PROCNT"].ToString())) ? res["PROCNT"].ToString() : "0"
                                });
                            }
                        }
                    }
                }
            }
            catch (Exception exc)
            {
                var logTitle = "ダイアログ表示情報取得";
                var logMsg = "エラー「" + exc.Message + "」";
                var callerFrame = new System.Diagnostics.StackFrame(1);
                PXCL_log.writeLog(PXCL_log.ERR, PXCL_log.SELECT, logTitle, logMsg, callerFrame.GetMethod(), PX_COMMONData);
            }
            finally
            {
                //データベースの接続解除
                dbAccess.DBClose();
            }

            return MenuData;
        }
    }
}
