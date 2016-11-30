command_mode = false;

/*function suggest(posts) {
    $(".suggest").empty();
    var keyword = $("#keyword").val();
    
    $.each(posts, function(key, value) {
        var title = value.title;
        if (title.indexOf(keyword) != -1) {

            var li = $("<li><a href='" + value.url + "'>"
             + title.substring(0, title.indexOf('_'))
             + "</a></li>");
            $(".suggest").append(li);
        }
    });
    $(".suggest").children().first().addClass("hover");
    $(".suggest").show();
    $("body").addClass("hackmode");
}*/

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
            /*if (window.localStorage) {
            posts = localStorage.wangjunneil_posts;
            suggest(JSON.parse(posts));
            return;
            }*/
            
            $.getJSON("/data/index.html",function(result){
                var posts = result.data;
                if (posts.length != 0) {
                    /*if (window.localStorage) {
                        localStorage.wangjunneil_posts = JSON.stringify(posts);
                        suggest(posts);
                    }*/
                    
                    $(".suggest").empty();
                    $.each(posts, function(key, value) {
                        var title = value.title;
                        if (title.indexOf(keyword) != -1) {
                            var li = $("<li><a href='" + value.url + "'>"
                             + title.substring(0, title.indexOf('_'))
                             + "</a></li>");
                            $(".suggest").append(li);
                        }
                    });
                    $(".suggest").children().first().addClass("hover");
                    $(".suggest").show();
                    $("body").addClass("hackmode");
                }
            });
        }
    });
    
    $("#keyword").bind("keyup", function (evt) {
        var k = window.event ? evt.keyCode : evt.which;
        if (k == 38) {
            $(".suggest li.hover").prev().addClass("hover");
            $(".suggest li.hover").next().removeClass("hover");
            $("#keyword").val($(".suggest li.hover").text());
        } else if (k == 40) {
            $(".suggest li.hover").next().addClass("hover");
            $(".suggest li.hover").prev().removeClass("hover");
            $("#keyword").val($(".suggest li.hover").text());
        } else if (k == 13) {
            if (command_mode) {
                var keyword = $("#keyword").val();
                if (keyword == null || keyword == "") 
                    return;
                command_process();
            } else {
                var url = $(".suggest li.hover a").attr("href");
                location.href = url;
            }
        } else if (k == 8) {
            var keyword = $("#keyword").val();
            if (keyword.length == "") {
                $(".searchform").removeClass("searchcommand");
                $("#keyword").attr("placeholder", "Simple Search");
                command_mode = false
            } 
        }
    });
});

function command_process() {
    var command = $("#keyword").val();
    switch (command) {
        case "getip":
            break;
        default:
            console.log('Unknown command [' + command + "]");
            break;
    }
}
