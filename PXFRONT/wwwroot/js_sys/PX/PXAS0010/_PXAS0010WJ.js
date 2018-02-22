var data = {};
$(document).ready(function () {
    $('html, body').animate({ scrollTop: 0 }, 500, 'swing');

    data = GetLoginData();

    var MenuLv01 = $("#CurrentPageLink").val().split(",")[2];
    if (MenuLv01 == "home") {
        SetRibbonList(["Home", "ホーム"]);

        $("#breadcrumb").show();
    } else {
        SetRibbonList([$("#CurrentPageTitle").val().trim(), "機能一覧"]);

        CreateGroupList(MenuLv01);
    }
});

//グループ情報および機能項目の取得
function CreateGroupList(level) {
    //var url = localStorage.getItem("LOGINEXT_WMSAPI_URL") + "api/LNAS0210/GetGroupList";
    var url = "http://kanda/KANDANET/API/api/LNAS0210/GetGroupList";
    data.MenuLv01 = level;

    $.ajax(url, { type: "POST", data: data }).then(function (r) {
        if (r) {
            var head_cnt = 1;
            for (var i = 0; i < r.length; i++) {
                if (r[i].MenuSp == "GRP") {
                    $("#mainMenu").append(
                        '<article class="col-lg-6 article-sortable">' +
                        '    <div class="jarviswidget jarviswidget-color-blueLight jarviswidget-sortable" id="" data-widget-editbutton="false" data-widget-colorbutton="false" data-widget-deletebutton="false" data-widget-fullscreenbutton="false" role="widget">' +
                        '        <header role="heading">' +
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
                    $("#head_icon" + head_cnt).attr("class", "fa " + r[i].IconNm);
                    $("#head_name" + head_cnt).text(r[i].TitleNm);
                    head_cnt++;
                } else if (r[i].MenuSp == "CH1") {
                    //グループNoが0の場合、未選択グループに属する
                    var MenuListElement = (r[i].GroupNo == "0") ? $("#OtherGroup") : $("#MenuList" + r[i].GroupNo);
                    MenuListElement.append(
                        '<li class="drag box" title="' + r[i].TitleNm + '" style="width: 330px !important;">' +
                        '   <div style="width:40px;height:40px;"><img src="../../img_sys/PX/' + r[i].IconNm + '" style="position: absolute;">' +
                        '       <h3 class="TitleNm">' + r[i].TitleNm + '</h3>' +
                        '       <p>' + r[i].ProgramId + '</p>' +
                        '       <p>' + r[i].ProgramId + '</p>' +
                        '   </div>' +
                        '   <input type="hidden" class="HidCallWeb" value="' + r[i].CallWeb + '" />' +
                        '</li>');
                }
            }

            //グループのフロート設定
            SetGroupFloat();

            var other_size = $("#header").height() + $("#ribbon").height() + $("#ReturnBtn").height() + $("#breadcrumb").height() + $("#FloatGroup").height() + $(".page-footer").height() + 80;
            $("#mainMenu").height(window.innerHeight - other_size);
        }
    }, function (e) {
        createDialog("asideDialog", "1,0,システム環境,ALM,通信エラーが発生しました,ＯＫ,ALM000-01,OK");
    });
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