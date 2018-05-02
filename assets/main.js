(function() {
    'use strict';

    var app = {
        applicationServerPublicKey : 'BJPZgjlU6dpFwaFEDzjNLPaMG5Zs-3R1fnem7tlrQufKkNXPfmJFXkDOiXYcVJBDVqVM50jJfGLPHR6DqfkQfRE',
        search_input : document.getElementById('keyword'),
        search_clear_btn : document.querySelector('.clear'),
        suggest_div : document.querySelector('.suggest')
    }

    // 定位用户位置
    app.geolocation = () => {
        navigator.geolocation.getCurrentPosition((position) => {
            let latitude = position.coords.latitude;    // 维度
            let longitude = position.coords.longitude;  // 经度

            console.log(`current position: ${latitude}, ${longitude}`);

            // http://lbsyun.baidu.com/index.php?title=webapi/guide/webservice-geocoding-abroad
        }, (error) => { // 错误处理
            let errorMessage;

            switch (error.code) {
                case 0:
                    errorMessage = 'unknown error';
                    break;
                case 1:
                    errorMessage = 'permission denied';
                    break;
                case 2:
                    errorMessage = 'position unavailable';
                    break;
                case 3:
                    errorMessage = 'timed out';
                    break;
                default:
                    break;
            }

            console.log(`Error occurred. Error code: ${errorMessage}`);
        });
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

        let suggest_posts = posts.filter((post) => post.title.indexOf(keyword.toLowerCase()) != -1);

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
        /*
        Notification.permission
        "default"

        Notification.permission
        "granted"

        Notification.permission
        "denied"
        */


        // 获取用户订阅状态
        registration.pushManager.getSubscription().then(subscription => {
            // "subscription"为空，表示用户还没有订阅此网站的通知
            if (subscription === null) {
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

                    // 实际会将此json发送给后端，测试时也用，这个值每次都会有变化
                    let subscription_json = JSON.stringify(subscription);
                    console.log(subscription_json);
                })
                .catch(err => {
                    // 用户拒绝订阅通知
                    // err = DOMException: Registration failed - permission denied
                    console.log('Failed to subscribe the user: ', err);
                });
            } else {
                // "subscription"不为空，用户订阅了此网站
                /**
                    {
                      "endpoint": "https://fcm.googleapis.com/fcm/send/feF6jNioNGM:APA91bGyYsIllhaiixGFVGKE0mOW290UZEmPNHnjfRcmr9dQeQYKScxIHJWV6cXgtDOASZK46atOf7hop1YB9T9EADeHl_OxpoZykj3KGtyhf8qikLrYGaC7ob89dgdotEo4G2yw9UMd",
                      "expirationTime": null,
                      "keys": {
                        "p256dh": "BI08L7Cft99rUwCGRq0P8DKQlzSETE4BIohzlwCa96-0sebDk4TGAqQGtGeJ4uKNW32i6NLyzYWHcNolhZUrC48=",
                        "auth": "vF5wFnZPMoDLfpuAN3o2UQ=="
                      }
                    }
                **/
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

    // 加载完关闭loading
    // 获取定位
    window.addEventListener('load', () => {
        let loading = document.querySelector('.loading');
        loading.style.display = 'none';

        // GeoLocation
        if (navigator.geolocation) {    // 判断当前浏览器是否支持定位服务
            console.log('Geolocation is supported!');

            app.geolocation();
        } else {
            console.log('Geolocation is not supported for this Browser/OS.');
        }
    });

    // 注册service-worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', (e) => {
            navigator.serviceWorker.register('/service-worker.js').then(registration => {
                console.log('Service Worker registration success with scope: ', registration.scope);                

                // 有新的更新
                registration.onupdatefound = () => {
                    const installWorker = registration.installing;
                    installWorker.onstatechange = () => {
                        switch (installWorker.state) {
                            case 'installed':
                                if (navigator.serviceWorker.controller) {
                                    console.log('new update available');
                                    resolve(true);
                                } else {
                                    console.log('no update available');
                                    resolve(false);
                                }

                                break;
                            default:
                                break;
                        }
                    }
                }

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


