(function() {
    'use strict';

    var app = {
        registration : null, // 注册Service Worker是赋值
        search_input : document.getElementById('keyword'),
        search_clear_btn : document.querySelector('.clear'),
        suggest_div : document.querySelector('.suggest')
    }

    app.suggest = (posts) => {
        let keyword = app.search_input.value;
        let suggest = app.suggest_div;

        while (suggest.firstChild)
            suggest.removeChild(suggest.firstChild);

        let suggest_posts = posts.filter((post) => post.title.indexOf(keyword) != -1);

        // 没有检索到数据
        if (suggest_posts.length == 0) {
            var li = $("<li><span>Cannot find out anything article ......</span></li>");
            li.css("background-color", "rgb(0, 116, 54)");
            li.css("cursor", "crosshair");
            $(".suggest").append(li);            
        }

        // 检索到数据
        suggest_posts.forEach((post) => {
            var li = $("<li><a href='" + post.url + "'>"
                 + post.title.substring(0, post.title.indexOf('_')).replace(keyword, "<span class='hilight'>" + keyword + "</span>")
                 + "</a></li>");
            $(".suggest").append(li);
        });

        $(".suggest").children().first().addClass("hover");
        $(".suggest").show();
        $("body").addClass("hackmode");
    }

    app.clearSuggest = () => {
        $("#keyword").val('');
        $(".suggest").empty();
        $(".suggest").hide();
        $("body").removeClass("hackmode");
    }

    app.toggleSearch = async () => {
        let keyword = app.search_input.value;
        
        if (keyword === null || keyword === '') {
            $(".suggest").empty();
            $(".suggest").hide();
            $("body").removeClass("hackmode");
            return;
        }

        const response = await fetch('/data/index.html', { headers : { 'Content-type' : 'application/json' } });
        const posts = await response.json();
        if (posts.length != 0) {
            app.suggest(posts);
        }
    }

    // 注册通知
    app.notification = (registration) => {
        registration.pushManager.getSubscription().then(subscription => {
            console.log(subscription);
        });
    }

    /**********************************************
    *
    * Event listeners for UI elements
    *
    **********************************************/

    app.search_clear_btn.addEventListener('click', () => {
        app.clearSuggest();
    });

    // 搜索框关键字模糊搜索
    app.search_input.addEventListener('input', () => {
        app.toggleSearch();
    });

    app.search_input.addEventListener('keyup', (evt) => {
        let k = window.event ? evt.keyCode : evt.which;
        switch (k) {
            case 40: // 上键
                $(".suggest li.hover").next().addClass("hover");
                $(".suggest li.hover").prev().removeClass("hover");
                $("#keyword").val($(".suggest li.hover").text());
                break;
            case 38: // 下键
                $(".suggest li.hover").prev().addClass("hover");
                $(".suggest li.hover").next().removeClass("hover");
                $("#keyword").val($(".suggest li.hover").text());
                break;
            case 13: // 回车键
                // 没有检索到文章，回车事件忽略
                if ($(".hover span").length == 0) { 
                    return;
                }

                var url = $(".suggest li.hover a").attr("href");
                $("#keyword").val('');
                location.href = url;
                break;
            default:
                break;
        }
    });


    
    // 移动端头固定
    window.addEventListener('scroll', () => {
        let header_nav = document.querySelector('.header-nav');
        let sticky = header_nav.offsetTop;         
        if (window.pageYOffset >= sticky) {
            header_nav.classList.add("sticky");
        } else {
            header_nav.classList.remove("sticky");
        }
    });

    // 注册service-worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', (e) => {
            navigator.serviceWorker.register('/service-worker.js').then(registration => {
                console.log('Service Worker registration success with scope: ', registration.scope);                

                if ('PushManager' in window) {  // 订阅通知
                    app.notification(registration);
                }
            })
            .catch(err => {
                console.log('Service Worker registration failed: ', err);
            });
        });
    }    

})();


