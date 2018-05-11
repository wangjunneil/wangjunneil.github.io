/** 获取 H1~H6 所有元素 */
function getHeadlineTags() {
    var arrays = [];
    $("*[id]").each(function(){
        var tagName = $(this).prop("tagName");
        if ($.inArray(tagName, hs) >= 0) {
            // console.log(tagName)
            arrays.push($(this));
        }
    });
    return arrays;
}

/** 判断元素标题等级H1~H6，返回0~5，如果不是H1~H6，则返回-1 */
function getHeadlineLevel(h) {
    var tagName = $(h).prop("tagName");
    return $.inArray(tagName, hs);
}

/** 生成目录列表 */
function generateContentList(array) {
    if (array.length > 1) {
        var dom =  '<ul class="post_nav">'
        for (var i = 0; i < array.length; i++) {
            var $h1 = $(array[i]);
            var level = getHeadlineLevel( $h1 );
            var li_style = level <= 0 ? '': ' style="margin-left:'+(level*12)+'px"';
            dom += '<li'+li_style+'><a href="#'+ $h1.attr("id") +'">'+ $h1.text() +'</a></li>';
        }
        dom += '</ul> ';

        // 边栏root [Published, Tags]
        var $sideBar = $(".w-catalog");

        // append dom
        $sideBar.append('<h4>章节目录<span>X</span></h4>');
        $sideBar.append(dom);
    }
}

// H1~H6 标签名数组
var hs = ["H1", "H2", "H3", "H4", "H5", "H6"];
// 找到所有 H1~H6 
var array = getHeadlineTags();
// 生成 Content List
generateContentList(array);

// 书签层随滑动而滑动
function getOffsetTop() {
    if (document.documentElement && document.documentElement.scrollTop) {
        return document.documentElement.scrollTop;
    } else if (document.body) {
        return document.body.scrollTop;
    }
}

var catalog = document.querySelector('.w-catalog'); 
var catalog_btn = document.querySelector('.w-catalog-btn'); 

var advInitTop = 10; 
function move() { 
    catalog.style.top = advInitTop + getOffsetTop();
    catalog_btn.style.top = advInitTop + getOffsetTop();

    advInitTop = advInitTop + getOffsetTop();
} 
window.onscroll = move ;

document.querySelector('.w-catalog-btn').addEventListener('click', () => {
    catalog.style.display = 'block';
    catalog_btn.style.display = 'none';
});

document.querySelector('.w-catalog h4 span').addEventListener('click', () => {
    catalog.style.display = 'none';
    catalog_btn.style.display = 'block'; 
});