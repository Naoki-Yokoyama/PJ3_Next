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

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace PXAPI.Areas.PXAS
{
    public class PXAS0010Controller : Controller
    {
        readonly IOptions<PXAS_AppSetCL> appSettings;
        /// <summary>
        /// コンストラクターを定義し、引数に構成情報を取得するクラスを定義する。
        /// </summary>
        /// <param name="userSettings"></param>
        public PXAS0010Controller(IOptions<PXAS_AppSetCL> _appSettings)
        {
            //ユーザー設定情報インスタンスをフィールドに保持
            this.appSettings = _appSettings;
        }
        
        public List<RowData> CreateMenu(PX_COMMON data)
        {
            System.IO.Path.GetTempPath();
            // log設定
            //String logPass = HttpContext.Current.Server.MapPath("~/App_Data/log4net.xml");
            //log4net.Config.XmlConfigurator.Configure(new System.IO.FileInfo(logPass));

            StringBuilder LogMsg = new StringBuilder();
            log4net.ILog Lg4nLogger = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

            
            PXAS0010CW PXAS0010Data = new PXAS0010CW();
            PXAS0010Data.PX_COMMONData = data;

            JsonData loadData = new JsonData();
            loadData.RowData = new List<RowDataJson>();

            try
            {
                loadData = PXAS0010Data.GetMenuList();

                #region
                //RowDataJson jsonData = new RowDataJson();
                //RowChildDataJson jsonDataChild = new RowChildDataJson();
                //jsonData.ChildData = new List<RowChildDataJson>();
                //jsonData.ChildRowURL = "#";
                //jsonData.ChildRowURLType = "";
                //jsonData.ChildRowTitle = "入荷";
                //jsonData.ChildRowCSS = "fa-cube";
                //jsonData.ChildRowContent = "入荷";
                //jsonData.ChildRowAfterCSS = "";
                //jsonData.ChildRowAfterTxt = "";
                //jsonData.ParentClass = "";

                //jsonDataChild = new RowChildDataJson();
                //jsonDataChild.ChildRowURL = "LNAS/LNAS0000/Test1";
                //jsonDataChild.ChildRowURLType = "0";
                //jsonDataChild.ChildRowTitle = "入荷予定入力"; 
                //jsonDataChild.ChildRowCSS = "";
                //jsonDataChild.ChildRowContent = "入荷予定入力";
                //jsonDataChild.ChildRowAfterCSS = "";
                //jsonDataChild.ChildRowAfterTxt = "";
                //jsonDataChild.ParentClass = "";
                //jsonDataChild.ChildRowImage = "icon_01.png";
                //jsonDataChild.ChildRowComment = "入荷予定情報の登録";
                //jsonData.ChildData.Add(jsonDataChild);
                //jsonDataChild = new RowChildDataJson();
                //jsonDataChild.ChildRowURL = "http://localhost:8088/HBM";
                //jsonDataChild.ChildRowURLType = "1";
                //jsonDataChild.ChildRowTitle = "入荷予定問合せ";
                //jsonDataChild.ChildRowCSS = "";
                //jsonDataChild.ChildRowContent = "入荷予定問合せ";
                //jsonDataChild.ChildRowAfterCSS = "";
                //jsonDataChild.ChildRowAfterTxt = "";
                //jsonDataChild.ParentClass = "";
                //jsonDataChild.ChildRowImage = "icon_02.png";
                //jsonDataChild.ChildRowComment = "入荷予定情報の検索・参照・進捗表";
                //jsonData.ChildData.Add(jsonDataChild);

                //loadData.RowData.Add(jsonData);


                //jsonData = new RowDataJson();
                //jsonData.ChildData = new List<RowChildDataJson>();
                //jsonData.ChildRowURL = "#";
                //jsonData.ChildRowURLType = "";
                //jsonData.ChildRowTitle = "マスタ";
                //jsonData.ChildRowCSS = "fa-cubes";
                //jsonData.ChildRowContent = "マスタ";
                //jsonData.ChildRowAfterCSS = "";
                //jsonData.ChildRowAfterTxt = "";
                //jsonData.ParentClass = "";

                //jsonDataChild = new RowChildDataJson();
                //jsonDataChild.ChildRowURL = "LNMS/LNMS0140/LNMS0140VW";
                //jsonDataChild.ChildRowURLType = "0";
                //jsonDataChild.ChildRowTitle = "商品マスタ";
                //jsonDataChild.ChildRowCSS = "";
                //jsonDataChild.ChildRowContent = "商品マスタ";
                //jsonDataChild.ChildRowAfterCSS = "";
                //jsonDataChild.ChildRowAfterTxt = "";
                //jsonDataChild.ParentClass = "";
                //jsonDataChild.ChildRowImage = "icon_16.png";
                //jsonDataChild.ChildRowComment = "商品の管理（検索・商品情報編集）";
                //jsonData.ChildData.Add(jsonDataChild);
                //jsonDataChild = new RowChildDataJson();
                //jsonDataChild.ChildRowURL = "#";
                //jsonDataChild.ChildRowURLType = "";
                //jsonDataChild.ChildRowTitle = "ロケ在庫移動";
                //jsonDataChild.ChildRowCSS = "";
                //jsonDataChild.ChildRowContent = "ロケ在庫移動";
                //jsonDataChild.ChildRowAfterCSS = "";
                //jsonDataChild.ChildRowAfterTxt = "";
                //jsonDataChild.ParentClass = "";
                //jsonDataChild.ChildRowImage = "icon_17.png";
                //jsonDataChild.ChildRowComment = "ロケーション在庫の移動";
                //jsonData.ChildData.Add(jsonDataChild);

                //loadData.RowData.Add(jsonData);

                #endregion
            }
            catch (Exception ex)
            {
                Lg4nLogger.Info("エラー：" + ex.Message);
            }


            List<RowData> row = new List<RowData>();
            RowData rowData = new RowData();
            List<String[]> childData = new List<String[]>();
            int menyuCount = 0;
            foreach (RowDataJson dataJson in loadData.RowData)
            {
                rowData = new RowData();
                // 左リストメニュー部分
                String id = dataJson.ChildRowID;
                String url = dataJson.ChildRowURL;
                String type = dataJson.ChildRowURLType;
                String title = dataJson.SUBCMM;
                String image = "";
                String status = "\"" + url + "\", \"" + type + "\",  \"" + id + "\", 0, \"" + title
                                     + "\", \"\", \"" + image + "\"";

                rowData.ChildRow = "<a href='#' id='" + id + "' title='" + title + "' class='ListLink'";
                rowData.ChildRow += " onclick='MenuLink(\"" + url + "\", \"" + type + "\", \"" + id + "\", 0)' >";
                rowData.ChildRow += " <i class='fa fa-lg fa-fw " + dataJson.MENUICON1 + "'></i>";
                rowData.ChildRow += " <span class='menu-item-parent'>" + dataJson.MENUNM + "</span>";
                if (dataJson.MENUICON2 != null && dataJson.MENUICON2 != "")
                {
                    rowData.ChildRow += " <span class='" + dataJson.MENUICON2 + "'>" + dataJson.ChildRowAfterTxt + "</span>";
                }
                rowData.ChildRow += "</a>";
                rowData.ParentClass = "" + dataJson.ParentClass;
                
                childData = new List<String[]>();
                foreach (RowChildDataJson ChildDataJson in dataJson.ChildData)
                {
                    String[] childRow = { "", "", "" };
                    // 左リストメニュー部分
                    id = ChildDataJson.ChildRowID;
                    childRow[0] = "<a href='#' id='" + ChildDataJson.ChildRowID + "' title='" + ChildDataJson.SUBCMM + "'";
                    childRow[0] += " onclick='MenuLink(\"" + ChildDataJson.ChildRowURL + "\", \"" + ChildDataJson.ChildRowURLType + "\",  \"" + id + "\", 1)' >";
                    if (ChildDataJson.MENUICON1 != null && ChildDataJson.MENUICON1 != "")
                    {
                        childRow[0] += "<i class='fa fa-lg fa-fw " + ChildDataJson.MENUICON1 + "'></i>";
                    }
                    if (dataJson.ParentClass == "active")
                    {
                        childRow[0] += "<span class='menu-item-parent'>" + ChildDataJson.MENUNM + "</span>";
                    }
                    else
                    {
                        childRow[0] += "" + ChildDataJson.MENUNM;
                    }
                    if (ChildDataJson.MENUICON2 != null && ChildDataJson.MENUICON2 != "")
                    {
                        childRow[0] += " <span class='" + ChildDataJson.MENUICON2 + "'>" + ChildDataJson.ChildRowAfterTxt + "</span>";
                    }
                    childRow[0] += "</a>";
                    childRow[1] = "" + ChildDataJson.ParentClass;
                    
                    childData.Add(childRow);
                }
                rowData.ChildData = childData;
                row.Add(rowData);
                menyuCount++;
            }

            return row;
        }

    }
}
