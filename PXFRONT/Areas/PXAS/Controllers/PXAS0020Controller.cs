using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using static PXLIB.PXCL_stc;

namespace PXFRONT.Areas.PXAS.Controllers
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

        [Area("PXAS")]
        public IActionResult PXAS0021VW()
        {
            PXAS0010CW PXAS0010Data = new PXAS0010CW();

            //  ◆パラメータ情報取得
            //string p_ProgramId = (Request.QueryString["PRGID"] != null) ? Request.QueryString["PRGID"].ToString() : "";

            //if (p_ProgramId != "")
            //{
            //    PXAS0010Data.LinkURL = p_ProgramId;
            //}

            return View("PXAS0021VW", PXAS0010Data);
        }
        [Area("PXAS")]
        public IActionResult PXAS0022VW(string MENULV01 = null, string TITLENM = null)
        {
            ViewBag.MENULV01 = MENULV01;
            ViewBag.TITLENM = TITLENM;
            PXAS0010CW PXAS0010Data = new PXAS0010CW();

            //  ◆パラメータ情報取得
            //string p_ProgramId = (Request.QueryString["PRGID"] != null) ? Request.QueryString["PRGID"].ToString() : "";

            //if (p_ProgramId != "")
            //{
            //    PXAS0010Data.LinkURL = p_ProgramId;
            //}

            return View("PXAS0022VW", PXAS0010Data);
        }
        [Area("PXAS")]
        public ActionResult _PXAS0022VW()
        {
            return View("_PXAS0022VW");
        }

    }
}