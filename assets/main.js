command_mode = false;   // 标识命令模式

function suggest(posts) {
    var keyword = $("#keyword").val();
    var flag = false;   // 标识是否有搜索到数据
    $(".suggest").empty();
    $.each(posts, function(key, value) {
        var title = value.title;
        if (title.indexOf(keyword) != -1) {
            var li = $("<li><a href='" + value.url + "'>"
             + title.substring(0, title.indexOf('_')).replace(keyword, "<span class='hilight'>" + keyword + "</span>")
             + "</a></li>");
            $(".suggest").append(li);
            flag = true;
        }
    });
    if (!flag) {    // 没有搜索到文章
        var li = $("<li><span>Cannot find out anything article ......</span></li>");
        li.css("background-color", "rgb(0, 116, 54)");
        li.css("cursor", "crosshair");
        $(".suggest").append(li);
    }
    $(".suggest").children().first().addClass("hover");
    $(".suggest").show();
    $("body").addClass("hackmode");
}

$(function () {
    $(".clear").bind("click", function () {
        $("#keyword").val('');
        $(".suggest").empty();
        $(".suggest").hide();
        $("body").removeClass("hackmode");
    });

    $("#keyword").bind("input", function () {
        if (command_mode) {
            return;
        }

        var keyword = $("#keyword").val();
        if (keyword == null || keyword == "") {
            $(".suggest").empty();
            $(".suggest").hide();
            $("body").removeClass("hackmode");
            return;
        } else if (keyword.indexOf(":") != -1) {
            $(".searchform").addClass("searchcommand");
            $("#keyword").val('');
            $("#keyword").attr("placeholder", "");
            command_mode = true;
            return;
        } else {
            if (window.sessionStorage) {
                posts = sessionStorage.posts;
                if (posts != null && posts != "" && posts != "undefined") {
                    suggest(JSON.parse(posts));
                    return;
                }
            }

            $.getJSON("/data/index.html",function(result){
                var posts = result.data;
                if (posts.length != 0) {
                    if (window.sessionStorage) {
                        sessionStorage.posts = JSON.stringify(posts);
                        suggest(posts);
                    }
                }
            });
        }
    });

    $("#keyword").bind("keyup", function (evt) {
        var k = window.event ? evt.keyCode : evt.which;
        if (k == 38) {
            $(".suggest li.hover").prev().addClass("hover");
            $(".suggest li.hover").next().removeClass("hover");
            // if (isSearchData()) {
                $("#keyword").val($(".suggest li.hover").text());
            // }
        } else if (k == 40) {
            $(".suggest li.hover").next().addClass("hover");
            $(".suggest li.hover").prev().removeClass("hover");
            // if (isSearchData()) {
                $("#keyword").val($(".suggest li.hover").text());
            // }
        } else if (k == 13) {
            if (command_mode) {
                var keyword = $("#keyword").val();
                if (keyword == null || keyword == "")
                    return;
                command_process();
            // } else if (!isSearchData()) { // 没有检索到文章，回车事件忽略
            //    return;
            } else {
                var url = $(".suggest li.hover a").attr("href");
                $("#keyword").val('');
                location.href = url;
            }
        } else if (k == 8) {
            var keyword = $("#keyword").val();
            if (keyword.length == "") {
                $(".searchform").removeClass("searchcommand");
                command_mode = false
            }
        }
    });
});

function isSearchData() {
    return $(".hover span").length == 0;
}

function command_process() {
    var command = $("#keyword").val();
    switch (command) {
        case "getip":
            getip();
            break;
        default:
            $("#keyword").val('Unknown command');
            break;
    }
}

function getip() {

}
