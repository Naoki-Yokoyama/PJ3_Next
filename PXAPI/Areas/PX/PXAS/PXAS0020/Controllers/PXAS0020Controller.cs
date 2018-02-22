using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Microsoft.Extensions.Options;
using static PXLIB.PXCL_stc;
using static PXAPI.StructureCW;
using System.Text;
using PXLIB;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace PXAPI.Areas.PXAS
{
    public class PXAS0020Controller : Controller
    {
        readonly IOptions<PXAS_AppSetCL> appSettings;
        /// <summary>
        /// コンストラクターを定義し、引数に構成情報を取得するクラスを定義する。
        /// </summary>
        /// <param name="userSettings"></param>
        public PXAS0020Controller(IOptions<PXAS_AppSetCL> _appSettings)
        {
            //ユーザー設定情報インスタンスをフィールドに保持
            this.appSettings = _appSettings;
        }

        #region PXAS0021
        /// <summary> メニューリスト情報の取得 </summary>
        /// <returns>メニューリスト</returns>
        public List<PXAS0021CW.MenuData> GetMenuList(PX_COMMON data)
        {
            var MenuDataList = new List<PXAS0021CW.MenuData>();
            try
            {
                MenuDataList = PXAS0021CW.GetMenuData(data);
            }
            catch (Exception ex)
            {
                var title = "";
                var message = "" + ex.Message;
                PXCL_log.writeDBLog(PXCL_log.ERR, PXCL_log.SELECT, title, message, System.Reflection.MethodBase.GetCurrentMethod(), data);
            }

            return MenuDataList;
        }

        #endregion
        #region PXAS0022

        /// <summary> メニューリスト情報の取得 </summary>
        /// <returns>メニューリスト</returns>
        public List<PXAS0022CW.GroupData> GetGroupList(PXAS0022CW.JsonGroupData data)
        {
            var GroupDataList = new List<PXAS0022CW.GroupData>();
            try
            {
                GroupDataList = PXAS0022CW.GetGroupData(data.MenuLv01, data);
            }
            catch (Exception ex)
            {
                var title = "";
                var message = "" + ex.Message;
                PXCL_log.writeDBLog(PXCL_log.ERR, PXCL_log.SELECT, title, message, System.Reflection.MethodBase.GetCurrentMethod(), data);
            }

            return GroupDataList;
        }

        /// <summary> メニューリストの更新 </summary>
        /// <returns>メニューリスト</returns>
        public string SaveGroupList(PXAS0022CW.GroupListData data)
        {
            var ErrMSG = "DBの登録に失敗しました。";
            try
            {
                ErrMSG = PXAS0022CW.SaveGroupData(data, data);
            }
            catch (Exception ex)
            {
                var title = "";
                var message = "" + ex.Message;
                PXCL_log.writeDBLog(PXCL_log.ERR, PXCL_log.SELECT, title, message, System.Reflection.MethodBase.GetCurrentMethod(), data);
            }

            return ErrMSG;
        }

        #endregion
    }
}
