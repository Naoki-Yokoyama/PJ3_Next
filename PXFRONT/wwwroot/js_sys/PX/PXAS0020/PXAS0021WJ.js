var data = {};
var head_num;
var head_cnt = 1;
$(document).ready(function () {
    $('html, body').animate({ scrollTop: 0 }, 500, 'swing');
    SetRibbonList(["システム管理", "メニュー管理", $("#MenuTitle").val()]);

    data = GetLoginData();

    //グループウィンドウのドラッグ＆ソート設定
    $("#mainMenu").sortable({
        stop: function () {
            SetGroupFloat();
        },
        cancel: ".head_edit,input, .drag_hide, #FloatGroup", revert: 150
    });
    $('#mainMenu').disableSelection();

    CreateGroupList();

    //グループウィンドウの編集ボタン押下時
    $("#content").on("click", ".head_edit", function () {
        head_num = $(this).attr("id").replace(/\D/g, "");
        head_class = $("#head_icon" + head_num).attr("class").split(' ')[1];
        LoadDialogHtml("HeadEditDialog", function (html) {
            OpenDialog("3,2,メニュー編集ダイアログ,ALM," + html + ",変 更,Edit_OK,OK,グループの削除,Edit_NG,CA2,閉じる,ALM000-03,NG2");

            //ヘッダータイトルおよびアイコン選択リストの値セット
            $("#SelIconList ." + head_class).parent("div").addClass("sel_icon");
            $("#HeadTitleTxt").val($("#head_name" + head_num).text());
            //アイコン選択リストのアイコンクリック時(アイコンに枠線付与)
            $("#SelIconList div").click(function () {
                $("#SelIconList div").removeClass("sel_icon");
                $(this).addClass("sel_icon");
            });
        });
    });

    //メニュー編集ダイアログの登録ボタン押下時
    $("#Ins_OK").click(function () {
        head_cnt++;
        $("#mainMenu").append(
            '<article class="col-lg-6 article-sortable">' +
            '    <div class="jarviswidget jarviswidget-color-blueLight jarviswidget-sortable" id="" data-widget-editbutton="false" data-widget-colorbutton="false" data-widget-deletebutton="false" data-widget-fullscreenbutton="false" role="widget">' +
            '        <header role="heading">' +
            '            <div id="head' + head_cnt + '" class="jarviswidget-ctrls head_edit" role="menu">   <a class="button-icon jarviswidget-toggle-btn"><i class="fa fa-pencil-square-o"></i></a>  </div>' +
            '            <span class="widget-icon"> <i id="head_icon' + head_cnt + '" class=""></i> </span><h2 class="font-md"><strong id="head_name' + head_cnt + '"></strong></h2>' +
            '            <span class="jarviswidget-loader"><i class="fa fa-refresh fa-spin"></i></span>' +
            '        </header>' +
            '        <div role="content" class="drag_hide">' +
            '            <div class="widget-body flex">' +
            '                <ul id="MenuList' + head_cnt + '" class="jquery-ui-sortable">' +
            '                </ul>' +
            '            </div>' +
            '        </div>' +
            '    </div>' +
            '</article>');
        head_num = head_cnt;

        var icon = $(".sel_icon i").attr("class");
        $("#head_icon" + head_num).attr("class", icon);
        $("#head_name" + head_num).text(($("#HeadTitleTxt").val()) ? $("#HeadTitleTxt").val() : DefaultTitle);
        SetContextMenu();

        //グループおよびプログラムのドラッグ設定
        SetArticleDragOption();
        SetProgramDragOption();
    });

    //メニュー編集ダイアログの変更ボタン押下時
    $("#Edit_OK").click(function () {
        var icon = $(".sel_icon i").attr("class");
        $("#head_icon" + head_num).attr("class", icon);
        $("#head_name" + head_num).text($("#HeadTitleTxt").val());
        SetContextMenu();

        $("#dialog").dialog("close");
    });

    //メニュー編集ダイアログの削除ボタン押下時
    $("#Edit_NG").click(function () {
        $("#OtherGroup").append($("#MenuList" + head_num).html());
        $("#MenuList" + head_num).parents("article").remove();
        SetProgramDragOption();
        SetContextMenu();

        $("#dialog").dialog("close");
    });

    var DefaultTitle = "グループ１";
    //グループの追加ボタン押下時
    $("#AddGroupBtn").click(function () {
        LoadDialogHtml("HeadEditDialog", function (html) {
            OpenDialog("1,0,グループ登録ダイアログ,ALM," + html + ",登 録,Ins_OK,OK");

            var GroupNum = head_cnt.toString().replace(/[A-Za-z0-9]/g, function (s) {
                return String.fromCharCode(s.charCodeAt(0) + 65248);
            });
            DefaultTitle = "グループ" + GroupNum;

            //$("#HeadTitleTxt").val("グループ" + GroupNum);
            $("#HeadTitleTxt").attr("placeholder", DefaultTitle);
            $("#SelIconList div:first-child").addClass("sel_icon");
            $("#SelIconList div").click(function () {
                $("#SelIconList div").removeClass("sel_icon");
                $(this).addClass("sel_icon");
            });
        });

    });

    /*
        ↓フローティングウィンドウ関係↓
    */

    //下部のフローティングウィンドウ内の検索
    $("#SearchTxt").keyup(function () {
        $("#OtherGroup h3").each(function () {
            //プログラム名かプログラムIDに一致すれば動的に表示する
            if ($(this).text().indexOf($("#SearchTxt").val()) >= 0 || $(this).next().text().indexOf($("#SearchTxt").val()) >= 0) {
                $(this).parents("li").show();
            } else {
                $(this).parents("li").hide();
            }
        });
    });

    /*
        ↓ドラッグ＆ドロップ関係↓
    */

    //グループおよびプログラムのドラッグ機能の設定
    SetArticleDragOption();
    SetProgramDragOption();

    /*
        ↓その他ボタン関係↓
    */
    //左部メニューの矢印を押下したときの対応
    $(".minifyme").click(function () {
        if ($("#left-panel").width() < 100) {
            $("#FloatGroup").css("width", "calc(100% - 222px)");
        } else {
            $("#FloatGroup").css("width", "calc(100% - 47px)");
        }
    });

    //戻るボタン押下時
    $("#ReturnBtn").click(function () {
        $("#content").load("http://" + window.location.host + "/PXFRONT/PXAS/PXAS0020/PXAS0020VW");
    });

    //保存ボタン押下時
    $("#SaveBtn").click(function () {
        //未選択グループにて非表示にされている項目を全部表示
        $("#SearchTxt").val("").keyup();

        var GroupData = [];
        //未選択グループ内のプログラムをリスト化
        $("#FloatGroup .box").each(function () {
            GroupData.push({
                MenuSp: "CH1",
                GroupNo: "0",
                TitleNm: $(this)[0].innerText.split("\n")[1],
                ProgramId: $(this)[0].innerText.split("\n")[2],
                CallWeb: $(this).find(".HidCallWeb").val(),
                IconNm: $(this).find("img").attr("src").split("/")[$(this).find("img").attr("src").split("/").length - 1],
            });
        });
        //グループのヘッダー情報をリスト化
        $(".article-sortable header").each(function (index) {
            GroupData.push({
                MenuSp: "GRP",
                GroupNo: (index + 1).toString(),
                IconNm: $(this).find("[id^=head_icon]").attr("class").split(" ")[1],
                TitleNm: $(this).find("[id^=head_name]").text(),
            });
            //同じグループ内のプログラムをリスト化
            $(this).parents("article").find(".box").each(function () {
                GroupData.push({
                    MenuSp: "CH1",
                    GroupNo: (index + 1).toString(),
                    TitleNm: $(this)[0].innerText.split("\n")[1],
                    ProgramId: $(this)[0].innerText.split("\n")[2],
                    CallWeb: $(this).find(".HidCallWeb").val(),
                    IconNm: $(this).find("img").attr("src").split("/").pop(),
                    //IconNm: $(this).find("img").attr("src").split("/")[$(this).find("img").attr("src").split("/").length - 1],
                });
            });
        });

        data.GroupList = GroupData;
        //var url = localStorage.getItem("LOGINEXT_WMSAPI_URL") + "api/LNAS0210/SaveGroupList";
        var url = "http://kanda/KANDANET/API/api/LNAS0210/SaveGroupList";

        LoaderControl("open");
        $.ajax(url, { type: "post", data: data }).then(function (r) {
            OpenDialog("1,0,メニューDB登録,ALM," + r + ",閉じる,ALM000-01,OK");
        }, function (e) {
            OpenDialog("1,0,メニューDB登録,ALM,通信エラーが発生しました。<br/>少し時間を置いて再度登録をお願い致します。。,閉じる,ALM000-01,OK");
        }).always(function () {
            LoaderControl("close");
        });
    });

});

var timer = false;
$(window).resize(function () {
    //リサイズ時、500ミリ秒何もしなかった時にmainMenu部分リサイズ
    if (timer !== false) {
        clearTimeout(timer);
    }
    timer = setTimeout(function () {
        var other_size = $("#header").height() + $("#ribbon").height() + $("#ReturnBtn").height() + $("#FloatGroup").height() + $(".page-footer").height() + 80;
        $("#mainMenu").height(window.innerHeight - other_size);
    }, 500);
});

//グループ情報および機能項目の取得
function CreateGroupList() {
    //var url = localStorage.getItem("LOGINEXT_WMSAPI_URL") + "api/LNAS0210/GetGroupList";
    var url = "http://kanda/KANDANET/API/api/LNAS0210/GetGroupList";
    data.MenuLv01 = $("#MENULV01").val();

    $.ajax(url, { type: "POST", data: data }).then(function (r) {
        if (r) {
            for (var i = 0; i < r.length; i++) {
                if (r[i].MenuSp == "GRP") {
                    $("#mainMenu").append(
                        '<article class="col-lg-6 article-sortable">' +
                        '    <div class="jarviswidget jarviswidget-color-blueLight jarviswidget-sortable" id="" data-widget-editbutton="false" data-widget-colorbutton="false" data-widget-deletebutton="false" data-widget-fullscreenbutton="false" role="widget">' +
                        '        <header role="heading">' +
                        '            <div id="head' + head_cnt + '" class="jarviswidget-ctrls head_edit" role="menu">   <a class="button-icon jarviswidget-toggle-btn"><i class="fa fa-pencil-square-o"></i></a>  </div>' +
                        '            <span class="widget-icon"> <i id="head_icon' + head_cnt + '" class=""></i> </span><h2 class="font-md"><strong id="head_name' + head_cnt + '"></strong></h2>' +
                        '            <span class="jarviswidget-loader"><i class="fa fa-refresh fa-spin"></i></span>' +
                        '        </header>' +
                        '        <div role="content" class="drag_hide">' +
                        '            <div class="widget-body flex">' +
                        '                <ul id="MenuList' + head_cnt + '" class="jquery-ui-sortable">' +
                        '                </ul>' +
                        '            </div>' +
                        '        </div>' +
                        '    </div>' +
                        '</article>');
                    head_num = head_cnt;
                    $("#head_icon" + head_num).attr("class", "fa " + r[i].IconNm);
                    $("#head_name" + head_num).text(r[i].TitleNm);
                    head_cnt++;
                } else if (r[i].MenuSp == "CH1") {
                    //グループNoが0の場合、未選択グループに属する
                    var MenuListElement = (r[i].GroupNo == "0") ? $("#OtherGroup") : $("#MenuList" + r[i].GroupNo);
                    MenuListElement.append(
                        '<li class="drag box" title="' + r[i].TitleNm + '">' +
                        '   <div style="width:40px;height:40px;"><img src="../../img_sys/PX/' + r[i].IconNm + '" style="position: absolute;">' +
                        '       <h3 class="TitleNm">' + r[i].TitleNm + '</h3>' +
                        '       <p>' + r[i].ProgramId + '</p>' +
                        '       <p>' + r[i].ProgramId + '</p>' +
                        '   </div>' +
                        '   <input type="hidden" class="HidCallWeb" value="' + r[i].CallWeb + '" />' +
                        '</li>');
                }
            }

            //読み込みが完了し次第、画面を表示する
            $("#MenuDisplay").fadeIn();


            //グループおよびプログラムのドラッグ設定
            SetArticleDragOption();
            SetProgramDragOption();


            //コンテキストメニュー(右クリック)の設定
            SetContextMenu();


            //グループのフロート設定
            SetGroupFloat();
            
            var other_size = $("#header").height() + $("#ribbon").height() + $("#ReturnBtn").height() + $("#FloatGroup").height() + $(".page-footer").height() + 80;
            $("#mainMenu").height(window.innerHeight - other_size);
        }
    }, function (e) {
        createDialog("asideDialog", "1,0,システム環境,ALM,通信エラーが発生しました,ＯＫ,ALM000-01,OK");
    });
}

//グループのドラッグ機能設定
function SetArticleDragOption() {
    $(".article-sortable").draggable({
        start: function () {
            $(this).css('position', 'absolute !important');
            $(".drag_hide").hide();
            $("#mainMenu article").css("height", "10px !important").css("min-height", "0px");
        },
        stop: function () {
            $(".drag_hide").show();
            $("#mainMenu article").css("min-height", "");
        },
        cancel: ".head_edit, .drag_hide",
        containment: "window",
        connectToSortable: "#mainMenu",
        revert: "invalid",
        scroll: false
    });
}

//機能項目のドラッグ機能設定
function SetProgramDragOption() {
    $('.jquery-ui-sortable').sortable({
        stop: function () {
            $("[id^=MenuList]").css("height", "auto");
        }, revert: true
    });
    $(".drag").draggable({
        start: function () {
            $("[id^=MenuList]").each(function () {
                $(this).height($(this).height());
            });
        },
        stop: function () {
            $("[id^=MenuList]").css("height", "auto");
            SetGroupFloat();
        },
        connectToSortable: ".jquery-ui-sortable",
        revert: "invalid",
        scroll: false,
        zIndex: 9999,
        opacity: "0.5"
    });
    SetGroupFloat();
}

function SetGroupFloat() {
    var left_height = 0;
    var right_height = 0;
    $(".article-sortable").each(function () {
        if (left_height <= right_height) {
            $(this).css("float", "left"); LoadDialogHtml
            left_height += ($(this).height() > 0) ? $(this).height() : 1;
        } else {
            $(this).css("float", "right");
            right_height += ($(this).height() > 0) ? $(this).height() : 1;
        }
    });
}

//コンテキストメニューの設定
function SetContextMenu() {
    var ContextElement;
    var items = [];

    //グループの名称の取得およびメニューリストの生成
    $("[id^=head_name]").each(function () {
        var ClickNum = $(this).attr("id").replace(/\D/g, "");
        items.push({
            title: "⇒【" + $(this).text() + "】",
            onclick: function () {
                $("#MenuList" + ClickNum).append(ContextElement.currentTarget);
                SetGroupFloat();
            }
        });
    });
    //未選択グループ項目の追加
    items.push({
        title: '⇒【未選択グループ】',
        onclick: function () {
            $("#OtherGroup").append(ContextElement.currentTarget);
            SetGroupFloat();
        }
    });

    $(".cctx").remove();
    $('.drag').bind("contextmenu", function (e) {
        ContextElement = e;
    }).chromeContext({
        items: items
    });
    //未選択グループの手前のボーダー追加
    $(".cctx-item:last-child").before("<div style='width:85%;margin: 0 auto;border-bottom:1px solid;'></div>");
}

function LoadDialogHtml(id, callback) {
    LoaderControl("open");
    $("#dialog").load("http://" + window.location.host + "/PXFRONT/PXAS/PXAS0020/_PXAS0021VW", function () {
        LoaderControl("close");
        var html = $("#" + id).html().replace(/\n/g, "");
        callback(html);
    });
}

function OpenDialog(msg) {
    var di = $("#dialog");
    if (di != null) {
        createDialog("dialog", msg);
        di.dialog({ width: "500", height: "auto" });
        di.dialog("open");
        di.focus();
    }
}



