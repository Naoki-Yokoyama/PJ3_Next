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
    public class PXAS0022CW
    {
        public class GroupData
        {
            public string MenuSp { get; set; }
            public string GroupNo { get; set; }
            public string TitleNm { get; set; }
            public string ProgramId { get; set; }
            public string CallWeb { get; set; }
            public string IconNm { get; set; }
        }

        /// <summary> グループデータ(読み込み時) </summary>
        public class JsonGroupData : PX_COMMON
        {
            public string MenuLv01 { get; set; }
        }

        /// <summary> グループデータ </summary>
        public class GroupListData : PX_COMMON
        {
            public string MenuLv01 { get; set; }
            public List<GroupData> GroupList { get; set; }
        }

        /// <summary> グループデータおよび機能項目の取得 </summary>
        /// <returns>グループデータ</returns>
        public static List<GroupData> GetGroupData(string MENULV01, PX_COMMON PX_COMMONData)
        {
            var GroupData = new List<GroupData>();
            PXCL_dba dbAccess = new PXCL_dba(PXCL_dba.ConnectionSystem, PX_COMMONData);

            var cmdTxt = new StringBuilder();
            try
            {
                //  データベースを開く
                dbAccess.DBConect();

                //  SELECT文作成
                cmdTxt.AppendLine("SELECT * FROM P3AS_MENU_WEB ");
                cmdTxt.AppendLine(" WHERE MENUID = @MENUID ");
                cmdTxt.AppendLine("   AND MENULV01 = @MENULV01 ");
                cmdTxt.AppendLine("   AND (MENUSP = 'GRP' OR MENUSP = 'CH1') ");
                using (var sqlCmd = new SqlCommand())
                {
                    //◆条件の設定
                    sqlCmd.Parameters.Add("@MENUID", SqlDbType.VarChar).Value = PX_COMMONData.MENUID;
                    sqlCmd.Parameters.Add("@MENULV01", SqlDbType.SmallInt).Value = MENULV01;
                    //◆SQL実行
                    using (var res = dbAccess.SQLSelectParameter(cmdTxt.ToString(), sqlCmd))
                    {
                        if (res.HasRows)
                        {
                            while (res.Read())
                            {
                                var MenuIcon = (res["MENUSP"].ToString() == "GRP") ? res["MENUICON1"].ToString() : res["MENUICON3"].ToString();
                                GroupData.Add(new GroupData
                                {
                                    MenuSp = res["MENUSP"].ToString(),
                                    GroupNo = res["MENULV02"].ToString(),
                                    TitleNm = res["MENUNM"].ToString(),
                                    ProgramId = res["PROGRAMID"].ToString(),
                                    CallWeb = res["CALLWEB"].ToString(),
                                    IconNm = MenuIcon
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

            return GroupData;
        }
        /// <summary> グループデータおよび機能項目の更新処理 </summary>
        /// <returns>エラーメッセージ</returns>
        public static string SaveGroupData(GroupListData data, PX_COMMON PX_COMMONData)
        {
            var ErrMSG = "";
            var res = -1;
            PXCL_dba dbAccess = new PXCL_dba(PXCL_dba.ConnectionSystem, PX_COMMONData);

            var GrpCmdTxt = new StringBuilder();
            var ProCmdTxt = new StringBuilder();
            try
            {
                //  データベースを開く
                dbAccess.DBConect();
                dbAccess.Tran(1);

                // グループのグループ情報を全削除
                res = DelGroupData(data.MenuLv01, PX_COMMONData, dbAccess);

                // 全削除が成功した場合、画面上で並び替えられたヘッダー情報を新規登録
                if (res >= 0 && data.GroupList != null)
                {
                    //  ヘッダー情報のINSERT文作成
                    GrpCmdTxt.AppendLine("INSERT INTO P3AS_MENU_WEB ( ");
                    GrpCmdTxt.AppendLine(" MENUID, MENULV01, MENULV02, MENULV03, MENUSP, MENUNM, CALLTP, CALLWEB, FONTTP, MENUICON1 ");
                    GrpCmdTxt.AppendLine(" ) VALUES ( ");
                    GrpCmdTxt.AppendLine(" @MENUID, @MENULV01, @MENULV02, '-1', 'GRP', @MENUNM, 'MNU', '#', 'STN', @MENUICON1 ");
                    GrpCmdTxt.AppendLine(" ) ");

                    //  プログラム情報のINSERT文作成
                    ProCmdTxt.AppendLine("INSERT INTO P3AS_MENU_WEB ( ");
                    ProCmdTxt.AppendLine(" MENUID, MENULV01, MENULV02, MENULV03, MENUSP, MENUNM, PROGRAMID, CALLTP, CALLWEB, FONTTP, MENUICON3 ");
                    ProCmdTxt.AppendLine(" ) VALUES ( ");
                    ProCmdTxt.AppendLine(" @MENUID, @MENULV01, @MENULV02, @MENULV03, 'CH1', @MENUNM, @PROGRAMID, 'URL', @CALLWEB, 'STN', @MENUICON3 ");
                    ProCmdTxt.AppendLine(" ) ");

                    var Program_Cnt = 1;
                    for (var i = 0; i < data.GroupList.Count; i++)
                    {
                        var list = data.GroupList[i];
                        using (var sqlCmd = new SqlCommand())
                        {
                            //◆条件の設定
                            sqlCmd.Parameters.Add("@MENUID", SqlDbType.VarChar).Value = PX_COMMONData.MENUID;
                            sqlCmd.Parameters.Add("@MENULV01", SqlDbType.SmallInt).Value = data.MenuLv01;
                            sqlCmd.Parameters.Add("@MENULV02", SqlDbType.SmallInt).Value = list.GroupNo;
                            sqlCmd.Parameters.Add("@MENUNM", SqlDbType.NVarChar).Value = (!string.IsNullOrEmpty(list.TitleNm)) ? data.GroupList[i].TitleNm : System.Data.SqlTypes.SqlString.Null;
                            if (data.GroupList[i].MenuSp == "GRP")
                            {
                                Program_Cnt = 1;
                                sqlCmd.Parameters.Add("@MENUICON1", SqlDbType.VarChar).Value = (!string.IsNullOrEmpty(list.IconNm)) ? list.IconNm : System.Data.SqlTypes.SqlString.Null;

                                //◆SQL実行
                                res = dbAccess.SQLUpdateParameter(GrpCmdTxt.ToString(), sqlCmd);
                            }
                            else
                            {
                                sqlCmd.Parameters.Add("@MENULV03", SqlDbType.SmallInt).Value = Program_Cnt.ToString();
                                sqlCmd.Parameters.Add("@PROGRAMID", SqlDbType.VarChar).Value = (!string.IsNullOrEmpty(list.ProgramId)) ? list.ProgramId : System.Data.SqlTypes.SqlString.Null;
                                sqlCmd.Parameters.Add("@CALLWEB", SqlDbType.VarChar).Value = (!string.IsNullOrEmpty(list.CallWeb)) ? list.CallWeb : System.Data.SqlTypes.SqlString.Null;
                                sqlCmd.Parameters.Add("@MENUICON3", SqlDbType.VarChar).Value = (!string.IsNullOrEmpty(list.IconNm)) ? list.IconNm : System.Data.SqlTypes.SqlString.Null;

                                //◆SQL実行
                                res = dbAccess.SQLUpdateParameter(ProCmdTxt.ToString(), sqlCmd);
                                Program_Cnt++;
                            }
                        }
                    }
                }

                if (res >= 0)
                {
                    ErrMSG = "DBの登録が完了しました。";
                    dbAccess.Tran(2);
                }
                else
                {
                    ErrMSG = "DBの登録に失敗しました。";
                    dbAccess.Tran(3);
                }
            }
            catch (Exception exc)
            {
                ErrMSG = "Res:" + res + ",Count:" + data.GroupList.Count;
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

            return ErrMSG;
        }

        public static int DelGroupData(string MENULV01, PX_COMMON PX_COMMONData, PXCL_dba dbAccess)
        {
            var res = -1;
            var cmdTxt = new StringBuilder();

            //  DELETE文作成
            cmdTxt.AppendLine("DELETE FROM P3AS_MENU_WEB ");
            cmdTxt.AppendLine(" WHERE MENUID = @MENUID ");
            cmdTxt.AppendLine("   AND MENULV01 = @MENULV01 ");
            cmdTxt.AppendLine("   AND (MENUSP = 'GRP' OR MENUSP = 'CH1')");

            using (var sqlCmd = new SqlCommand())
            {
                //◆条件の設定
                sqlCmd.Parameters.Add("@MENUID", SqlDbType.VarChar).Value = PX_COMMONData.MENUID;
                sqlCmd.Parameters.Add("@MENULV01", SqlDbType.SmallInt).Value = MENULV01;

                //◆SQL実行
                res = dbAccess.SQLDeleteParameter(cmdTxt.ToString(), sqlCmd);

            }

            return res;
        }
    }
}
