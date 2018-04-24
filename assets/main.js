(function() {
    'use strict';

    var app = {
        applicationServerPublicKey : 'BJPZgjlU6dpFwaFEDzjNLPaMG5Zs-3R1fnem7tlrQufKkNXPfmJFXkDOiXYcVJBDVqVM50jJfGLPHR6DqfkQfRE',
        search_input : document.getElementById('keyword'),
        search_clear_btn : document.querySelector('.clear'),
        suggest_div : document.querySelector('.suggest')
    }

    app.urlB64ToUint8Array = (base64String) => {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
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
        // 获取用户订阅状态
        registration.pushManager.getSubscription().then(status => {
            if (status === null) {
                console.log('User is NOT subscribed.');

                // 解码 https://web-push-codelab.glitch.me/
                const applicationServerKey = app.urlB64ToUint8Array(app.applicationServerPublicKey);
                // 订阅
                registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: applicationServerKey
                })
                .then(subscription => {
                    console.log('User is subscribed:', subscription);

                    // 实际会将此json发送给后端，测试时也用
                    let subscription_json = JSON.stringify(subscription);
                    console.log(subscription_json);
                })
                .catch(err => {
                    console.log('Failed to subscribe the user: ', err);
                });
            } else {
                // 已经订阅的忽略                
                console.log('User IS subscribed.');
            }
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


