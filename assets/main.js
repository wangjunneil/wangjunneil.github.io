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
        var keyword = $("#keyword").val();
        
        if (keyword == null || keyword == "") {
            $(".suggest").empty();
            $(".suggest").hide();
            $("body").removeClass("hackmode");
            return;
        }
        
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
            var url = $(".suggest li.hover a").attr("href");
            location.href = url;
        }
    });
});
