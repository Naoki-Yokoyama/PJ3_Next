var data = {};
$(document).ready(function () {
    $('html, body').animate({ scrollTop: 0 }, 500, 'swing');
    SetRibbonList(["システム管理", "メニュー管理"]);

    data = GetLoginData();

    CreateMenuTable();

});

function StepIn() {
    $('html, body').animate({ scrollTop: 0 }, 500, 'swing');
    SetRibbonList(["システム管理", "メニュー管理"]);

    data = GetLoginData();
    data.DB = "KN";

    CreateMenuTable();
}
function CreateMenuTable() {
    //var url = localStorage.getItem("LOGINEXT_WMSAPI_URL") + "api/LNAS0210/GetMenuList";
    var url =  "http://kanda/KANDANET/API/" + "api/LNAS0210/GetMenuList";

    $.ajax(url, { type: "POST", data: data }).then(function (r) {
        if (r) {
            $("#MenuTableList").empty();
            for (var i = 0; i < r.length; i++) {
                $("#MenuTableList").append("<tr>" +
                    "<td style='text-align:center;'>" + (i + 1) + "</td>" +
                    "<td>" + r[i].TitleNm + "</td>" +
                    "<td style='text-align:right;'>" + r[i].GrpCnt + "</td>" +
                    "<td style='text-align:right;'>" + r[i].ProCnt + "</td>" +
                    "<td></td>" +
                    "<td style='text-align:center;'><button type='button' class='btn btn-default' onclick='EditBtn_Click(\"" + r[i].MenuLv1 + "\",\"" + r[i].TitleNm + "\");'>編 集</button></td>" +
                    "</tr>");
            }

            $("#MenuDisplay").fadeIn();


            //Datatablesの設定
            SetTableQuery();
        }
    }, function (e) {
        createDialog("asideDialog", "1,0,システム環境,ALM,通信エラーが発生しました,ＯＫ,ALM000-01,OK");
    });
}

function EditBtn_Click(level, title) {
    $("#content").load("http://" + window.location.host + "/PXFRONT/PXAS/PXAS0020/PXAS0022VW?MENULV01=" + level + "&TITLENM=" + title);
    return false;
}

function OpenDialog(msg) {
    var di = $("#dialog");
    if (di != null) {
        createDialog("dialog", msg);
        di.dialog("open");
        di.focus();
    }
}

//DataTablesのQuery設定
function SetTableQuery() {
    var responsiveHelper_datatable_fixed_column = undefined;


    var breakpointDefinition = {
        tablet: 1024,
        phone: 480
    };

    /* COLUMN FILTER  */
    var otable = $('#datatable_fixed_column').DataTable({
        "sDom": "<'dt-toolbar'<'col-xs-12 col-sm-6'f><'col-sm-6 col-xs-6 hidden-xs'T>r>" +
        "t" +
        "<'dt-toolbar-footer'<'col-sm-6 col-xs-12 hidden-xs'i><'col-sm-6 col-xs-12'p>>",
        "autoWidth": true,
        "preDrawCallback": function () {
            // Initialize the responsive datatables helper once.
            if (!responsiveHelper_datatable_fixed_column) {
                responsiveHelper_datatable_fixed_column = new ResponsiveDatatablesHelper($('#datatable_fixed_column'), breakpointDefinition);
            }
        },
        "rowCallback": function (nRow) {
            responsiveHelper_datatable_fixed_column.createExpandIcon(nRow);
        },
        "drawCallback": function (oSettings) {
            responsiveHelper_datatable_fixed_column.respond();
        },
        retrieve: true,
        "pageLength": 10,
    });

    // Apply the filter
    $("#datatable_fixed_column thead th input[type=text]").on('keyup change', function () {
        otable
            .column($(this).parent().index() + ':visible')
            .search(this.value)
            .draw();
    });
}