
var domainType = "";
$(document).ready(function () {
    domainType = localStorage.getItem("Local_PXAPI_DomainType");
    //var link = $("#LinkURL").val();
    //if (link == '') {
        $(".page-footer").show();
        $("#left-panel").show();
        $("#header").show();
        $("#ribbon").show();
        $("#breadcrumb").show();

        $("body").css("overflow-y", "scroll");
        //レイアウトオプションの日本語化
        LocalLayoutOption();

        var nm = localStorage.getItem("LOGINEXT_WMSAPI_USERNM");
        $("#userNm").text(nm);
        $("#userNm").attr("title", nm);
        $("#LogOut_usernm").text(nm);
        CreateMenu();

        /*
        *　タスク管理関連
        */
        //タスク管理ボタンクリック
        $("#TaskManager, #AlertBadge").click(function () {
            $("#TaskList").fadeToggle(200, function () {
                if ($("#TaskList").is(":hidden")) {
                    OutFrameClick.unbind("click");
                }
            });
            var OutFrameClick = $(document).click(function (e) {
                var TargetNum = $(e.target).closest("#TaskList").length
                    + $(e.target).closest("#TaskManager").length + $(e.target).closest("#AlertBadge").length;
                if (TargetNum == 0) {
                    $('#TaskList').fadeOut(200);
                    OutFrameClick.unbind("click");
                }
            });
        });

        /*
        *　ログアウト関連
        */
        //ログアウトボタンクリック
        $("#LogOutBtn").click(function () {
            $("#LogOutDisplay").show();
        });

        //ログアウトしないボタンクリック
        $("#bot1-Msg1").click(function () {
            $("#LogOutDisplay").hide();
        });

        //ログアウトするボタンクリック
        $("#bot2-Msg1").click(function () {
            $("#LogOutDisplay").hide();
            RemoveLocalStorage();
            window.location.href = "http://" + window.location.host + "/PXFRONT";
        });

    //} else {
    //    $(".demo").hide();

    //    $("#main").css("margin-left", "0px");
    //    link = "../../" + link;
    //    $("#content").load(link, function () {
            
    //    });
    //}
});

//レイアウトオプションの日本語化
function LocalLayoutOption() {
    $(".demo").width(200);
    $(".demo legend").text("レイアウト設定");
    $("#smart-fixed-header").next("span").text("ヘッダー固定");
    $("#smart-fixed-navigation").next("span").text("左部メニュー固定");
    $("#smart-fixed-ribbon").next("span").text("リボン固定");
    $("#smart-fixed-footer").next("span").text("フッター固定");
    $("#smart-fixed-container").next("span").text("コンテナサイズに縮小");
    $("#smart-rtl").next("span").text("左部メニューを右寄せ");
    $("#smart-topmenu").next("span").text("左部メニューを上寄せ");
    $("#colorblind-friendly").next("span").text("枠線の強調");
    $("#reset-smart-widget").prev("h6").text("ローカルストレージの消去");
    $("#reset-smart-widget").html("<i class='fa fa-refresh'></i> 初期化");
    $("#smart-styles").prev("h6").text("スキンの変更");

    $("#smart-fixed-container").click(function () {
        $("#smart-bgimages h6").text("背景の変更");
    });
}

var timer = false;
$(window).resize(function () {
    //リサイズ時、500ミリ秒何もしなかった時にmainMenu部分リサイズ
    if (timer !== false) {
        clearTimeout(timer);
    }
    timer = setTimeout(function () {
        var other_size = $("#header").height() + $("#ribbon").height() + $("#ReturnBtn").height() + $("#breadcrumb").height() + $("#FloatGroup").height() + $(".page-footer").height() + 80;
        $("#mainMenu").height(window.innerHeight - other_size);
    }, 500);
});

function TestStepIn() {
    TaskQue = 0;
    
    var url = "http://localhost/PXAPI2" + "/PXAS0010/CreateMenu";

    var data = GetLoginData();

    $.ajax(url, { type: "POST", data: data }).then(function (r) {
        data = r;
        if (data != "") {
            $('#listMenu').empty();
            $('#mainMenu').empty();
            var newDivDataLeft = "";
            var newDivDataRight = "";

            // Home作成
            //var homeRow = "<a href='LNAS0000VW' title='ホーム'><i class='fa fa-lg fa-fw fa-home'></i>";
            var para = '"PXAS/PXAS0010/PXAS0010VW", "0",  "home", 0';
            var homeRow = "<a href='#' id='home' title='ホーム' onclick='MenuLink(" + para + ")'><i class='fa fa-lg fa-fw fa-home'></i>";
            homeRow += "<span class='menu-item-parent'>ホーム</span></a>";
            var newLi = $('<li>').append(homeRow);
            newLi.addClass("active");
            newLi.addClass("MenuLinkLi");
            $('#listMenu').append(newLi);
            // liに追加する内容
            for (var i = 0; i < data.length; i++) {
                var rowData = data[i];
                var childRow = "";
                var parentClass = "";
                // 子要素を格納するulタグを生成
                var childRowUl = $('<ul>');
                // 親要素の中身[<a>タグ等]
                childRow = rowData.ChildRow;
                if (rowData.ParentClass != "") {
                    parentClass = rowData.ParentClass;
                }

                // 中央一覧メニュー部分
                var childDivData = "";
                var newDivData = "    <div class='jarviswidget jarviswidget-color-blueLight' id='' data-widget-editbutton='false'";
                newDivData += " data-widget-colorbutton='false' data-widget-deletebutton='false' data-widget-fullscreenbutton='false'>" + "\r\n";
                newDivData += "        <header>" + "\r\n";
                newDivData += "            " + rowData.ChildRowMain + "\r\n";
                newDivData += "        </header>" + "\r\n";
                newDivData += "        <div>" + "\r\n";
                newDivData += "            <div class='widget-body flex'>" + "\r\n";

                for (var j = 0; j < rowData.ChildData.length; j++) {
                    var childData = rowData.ChildData[j];
                    // 子要素の中身[<a>タグ等]
                    var childLi = $('<li>').html(childData[0]);
                    childLi.addClass("MenuLinkLi");
                    if (childData[1] == "active") {
                        childLi.addClass('active');
                    }
                    childRowUl.append(childLi);

                    // 中央一覧メニュー部分
                    childDivData += "                <div class='box'>" + "\r\n";
                    childDivData += "                    " + childData[2] + "\r\n";
                    childDivData += "                </div>" + "\r\n";
                }
                // liタグを生成してテキスト追加
                var newLi = $('<li>').append(childRow);
                if (rowData.ChildRow.split("MenuLink")[1].split(",")[1].trim() == "\"\"") {
                    newLi.append(childRowUl);
                }
                newLi.addClass("MenuLinkLi");
                if (parentClass != "") {
                    //newLi.addClass(parentClass);
                }

                // insertに生成したliタグを追加
                $('#listMenu').append(newLi);

                // 中央一覧メニュー部分
                if (childDivData != "") {
                    newDivData += childDivData;
                    newDivData += "            </div>" + "\r\n";
                    newDivData += "        </div>" + "\r\n";
                    newDivData += "    </div>" + "\r\n";
                    if (rowData.ChildRowMainFlag == "left") {
                        newDivDataLeft += newDivData;
                    } else {
                        newDivDataRight += newDivData;
                    }
                }
            }

            var newMenuLeft = $('<article>').append(newDivDataLeft);
            newMenuLeft.addClass("col-xs-12 col-sm-6 col-md-6 col-lg-6");
            $('#mainMenu').append(newMenuLeft);
            var newMenuRight = $('<article>').append(newDivDataRight);
            newMenuRight.addClass("col-xs-12 col-sm-6 col-md-6 col-lg-6");
            $('#mainMenu').append(newMenuRight);

            $("nav ul").jarvismenu({
                "accordion": menu_accordion || !0
                , "speed": menu_speed || !0
                , "closedSign": '<em class="fa fa-plus-square-o"></em>'
                , "openedSign": '<em class="fa fa-minus-square-o"></em>'
            });
        }
        pageReSetUp();
    }, function (e) {
        createDialog("dialog", "1,0,ログイン画面,ALM,error: " + e + ",ＯＫ,ALM000-01,OK");
        $("#dialog").dialog("open");
        Ladda.stopAll();
    });



    //StepIn();
}

function ReturnDialog(id, returnCd) {
    switch (id) {
        case "ALM000-01":
            switch (returnCd) {
                case "OK":
                    return "btn btn-primary";
                    break;
                case "OK2":
                    return "btn btn-primary";
                    break;
                case "DS":
                    return "btn btn-danger";
                    break;
                default:
                    return value;
                    break;
            }
            break;
        case "ALMKEYODR-02":
            return "btn btn-primary";
            break;
        case "ALMKEYODR-03":
            return value;
            break;
        default:
            break;
    }
}

var TaskQue = 0;
function LoaderControl(status) {
    if (status == "open") {
        if (TaskQue == 0) {
            $("#Mask").show();
            $('#load-parent').show();
        }
        TaskQue++;
    } else if (status == "close") {
        TaskQue = (TaskQue == 0) ? 0 : TaskQue - 1;
        if (TaskQue == 0) {
            $("#Mask").delay(10).fadeOut(300);
            $('#load-parent').delay(10).fadeOut(1000);
        }
    }
}

//  メニュー項目の再取得
var LogActivityIntval;
function MenuLink(Link, Type, ID, parent) {
    TaskQue = 0;
    if (Type == "0") {
        //Link = "../../" + Link;
        Link = "http://" + window.location.host + "/PXFRONT/" + Link;
    }
    if (Link != "" && Type != "") {
        LoaderControl("open");
        $('.MenuLinkLi').each(function () {
            $(this).removeClass('active');
        });
        
        var Obj = $("#" + ID);
        var liObj = Obj[0].parentElement;
        $(liObj).addClass("active");
        if (parent != 0) {
            var ulObj = liObj.parentElement;
            liObj = ulObj.parentElement;
            $(liObj).addClass("active");
        }

        //現在のページのタイトルおよびメニューリンク情報を記憶
        $("#CurrentPageTitle").val($("#" + ID).text());
        $("#CurrentPageLink").val(Link + "," + Type + "," + ID + "," + parent);
        //画面にHTMLを読み込み表示
        $("#content").load(Link, function () {

            //ウィンドウタブのタイトル変更
            var LinkArray = Link.split("/");
            TabTitle = LinkArray[LinkArray.length - 1];
            document.title = (AlertNum > 0) ? "(" + AlertNum + ")" + LinkArray[LinkArray.length - 1] : LinkArray[LinkArray.length - 1];

            LoaderControl("close");

            //作業時間の表示
            clearInterval(LogActivityIntval);
            var Cnt = 0;
            var Now = new Date();
            $("#LogTime").text(Cnt);
            $("#LogStartTime").text(("0" + Now.getHours()).slice(-2) + "時" + ("0" + Now.getMinutes()).slice(-2) + "分");
            $("#ActiveTime").show();
            LogActivityIntval = setInterval(function () {
                Cnt++;
                $("#LogTime").fadeOut(600, function () {
                    $("#LogTime").fadeIn();
                });
                $("#LogTime").text(Cnt);
            }, 60 * 1000);

        });

    }
}
function ChgMon(ClickDate) {
    $("#CLICKDATE").val(ClickDate);
    $("#SELECTMONTH").val(ClickDate.split('/')[1]);
    var elm = document.getElementById("frmP3TOD040");
    var aftActionVal = elm.getAttribute("action").replace("MultiAction", "ChgMonth");
    elm.setAttribute("action", aftActionVal);
    elm.submit();
}

//  メニュー項目の再取得
function CreateMenu() {
    //var url = localStorage.getItem("LOGINEXT_WMSAPI_URL") + "api/LNAS0000/CreateMenu";
    var url = "http://kanda/KANDANET/API/api/LNAS0000/CreateMenu";
    var data = {};
    //data.Id = localStorage.getItem("LOGINEXT_WMSAPI_USERID");
    data.Id = "pmt_admin";
    //data.DB = localStorage.getItem("LOGINEXT_WMSAPI_SYSTEMDB");
    data.DB = "KN";
    //data.MENUID = localStorage.getItem("LOGINEXT_WMSAPI_MENUID");
    data.MENUID = "PGE_WEB_MENU_ADMIN";

    $.ajax(url, { type: "POST", data: data }).then(function (r) {
        data = r;
        if (data != "") {
            $('#listMenu').empty();
            $('#mainMenu').empty();

            // Home作成
            //var homeRow = "<a href='LNAS0000VW' title='ホーム'><i class='fa fa-lg fa-fw fa-home'></i>";
            var para = '"PXAS/PXAS0010/_PXAS0010VW", "0",  "home", 0';
            var homeRow = "<a href='#' id='home' title='ホーム' onclick='MenuLink(" + para + ")'><i class='fa fa-lg fa-fw fa-home'></i>";
            homeRow += "<span class='menu-item-parent'>ホーム</span></a>";
            var newLi = $('<li>').append(homeRow);
            newLi.addClass("active");
            newLi.addClass("MenuLinkLi");
            $('#listMenu').append(newLi);
            // liに追加する内容
            for (var i = 0; i < data.length; i++) {
                var rowData = data[i];
                var childRow = "";
                var parentClass = "";
                // 子要素を格納するulタグを生成
                var childRowUl = $('<ul>');
                // 親要素の中身[<a>タグ等]
                childRow = rowData.ChildRow;
                if (rowData.ParentClass != "") {
                    parentClass = rowData.ParentClass;
                }
                
                for (var j = 0; j < rowData.ChildData.length; j++) {
                    var childData = rowData.ChildData[j];
                    // 子要素の中身[<a>タグ等]
                    var childLi = $('<li>').html(childData[0]);
                    childLi.addClass("MenuLinkLi");
                    if (childData[1] == "active") {
                        childLi.addClass('active');
                    }
                    childRowUl.append(childLi);
                    
                }
                // liタグを生成してテキスト追加
                var newLi = $('<li>').append(childRow);
                if (rowData.ChildRow.split("MenuLink")[1].split(",")[1].trim() == "\"\"") {
                    newLi.append(childRowUl);
                }
                newLi.addClass("MenuLinkLi");
                if (parentClass != "") {
                    //newLi.addClass(parentClass);
                }

                // insertに生成したliタグを追加
                $('#listMenu').append(newLi);
                
            }
            
            $("nav ul").jarvismenu({
                "accordion": menu_accordion || !0
                , "speed": menu_speed || !0
                , "closedSign": '<em class="fa fa-plus-square-o"></em>'
                , "openedSign": '<em class="fa fa-minus-square-o"></em>'
            });
        }
        pageReSetUp();
    }, function (e) {
        pageReSetUp();
        createDialog("asideDialog", "1,0,システム環境,ALM,通信エラーが発生しました,ＯＫ,ALM000-01,OK");
    });


    return false;
}

function SetGroupFloat() {
    var left_height = 0;
    var right_height = 0;
    $(".article-sortable").each(function () {
        if (left_height <= right_height) {
            $(this).css("float", "left");
            left_height += ($(this).height() > 0) ? $(this).height() : 1;
        } else {
            $(this).css("float", "right");
            right_height += ($(this).height() > 0) ? $(this).height() : 1;
        }
    });
}
var _gaq = _gaq || [];
//  メニュー項目の再取得
function pageReSetUp() {
    pageSetUp();
    drawBreadCrumb();
}

// 内部の機能からの呼び出し
var AlertNum = 0;
var TabTitle = document.title;
function SendAjax(url, data) {
    //タスク一覧への追加
    var TaskNum = SetTaskManager();

    $.ajax(url, { type: "POST", data: data }).then(function (r) {
        data = r;
        if (data != "") {
            AlertNum++;
            var dialog = $("#asideDialog");
            if (data.ErrorMsg && dialog) {
                createDialog("asideDialog", data.ErrorMsg);
                dialog.dialog("open");
                ErrorTask(TaskNum);
            } else {
                $("#AlertBadge").fadeIn().text(AlertNum);
                document.title = "(" + AlertNum + ")" + TabTitle;
                toastr.success(data.SuccessMsg);
                SuccessTask(TaskNum);
            }
        } else {
            ErrorTask(TaskNum);
        }
    }, function (e) {
        createDialog("asideDialog", "1,0,システム環境,ALM,通信エラーが発生しました,ＯＫ,ALM000-01,OK");
    });

    return false;
}

function SetTaskManager() {
    var TaskNum = ($("[id^=TaskTr]").length > 0) ? parseInt($("[id^=TaskTr]:last").attr("id").match(/[0-9]/g)) + 1 : 0; //0始まり
    var MenuLinkList = $("#CurrentPageLink").val().split(",");
    var para = "\"" + MenuLinkList[0] + "\", \"" + MenuLinkList[1] + "\", \"" + MenuLinkList[2] + "\", \"" + MenuLinkList[3] + "\"";
    $("#TaskList table").append("<tr id='TaskTr" + TaskNum + "'>" +
        "    <th><button class='btn btn-block btn-default' onclick='MenuLink(" + para + ")'>" + $("#CurrentPageTitle").val() + "</button></th>" +
        "    <td><div id='IconDiv" + TaskNum + "'>" +
        "    <img id='img" + TaskNum + "' src='../../img/task-loader.gif'/></div></td>" +
        "</tr>");
    return TaskNum;
}

function SuccessTask(TaskNum) {
    $("#IconDiv" + TaskNum).addClass("TaskDone");
    $("#IconDiv" + TaskNum).html("<i class='fa fa-check-circle-o'></i>");
    $("#AllDelAlert").fadeIn();
    $("#AllDelAlert").click(function () {
        $(".TaskDone").each(function () {
            RemoveTaskTr($(this));
        });
    });
    $(".TaskDone").mouseover(function () {
        $(this).children("i").attr("class", "fa fa-trash-o");
        $(this).children("i").attr("title", "通知を削除");
        $(".TaskDone").click(function () {
            RemoveTaskTr($(this));
        });
    }).mouseleave(function () {
        $(".TaskDone").unbind("click");
        $(this).children("i").attr("class", "fa fa-check-circle-o");
    });
}

function ErrorTask(TaskNum) {
    $("#IconDiv" + TaskNum).addClass("TaskError");
    $("#IconDiv" + TaskNum).html("<i class='fa fa-exclamation-triangle'></i>");
}

function RemoveTaskTr(id) {
    id.parents("tr").fadeOut(300, function () {
        $(this).remove();
        AlertNum--;
        var AlertStr = "";
        if (AlertNum == 0) {
            $("#AlertBadge").fadeOut().text(0);
        } else {
            $("#AlertBadge").fadeIn().text(AlertNum);
            AlertStr = "(" + AlertNum + ")";
        }
        document.title = AlertStr + TabTitle;

        if ($("#TaskList tr").length == 1) {
            $("#AllDelAlert").fadeOut();
        }
    });

}

