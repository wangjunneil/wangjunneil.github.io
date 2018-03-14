---
title: Angular应用国际化工具angular-translate使用说明
name: angular-translate-i18n
date: 2016-02-15
tags: [angular,angular-translate]
categories: [Web]
---

# Angular应用国际化工具angular-translate使用说明

## 安装

克隆`git clone https://github.com/angular-translate/angular-translate.git`进入angular-translate模块的git地址，点击下载然后引入工程。
如果工程使用bower进行依赖管理，则使用`bower install angular-translate –save`进行安装引入

## 使用

```html
<!DOCTYPE html>
<html ng-app="translateApp">
<head>
    <meta charset="UTF-8">
    <title>Angular-Translate</title>
    <script src="../../bower_components/angular/angular.js"></script>
    <script src="../../bower_components/angular-translate/angular-translate.js"></script>
    <script src="../script/angular-translate-01.js"></script>
</head>
<body ng-controller="translateController">
    <span>{{ 'MESSAGE' | translate }}</span>
</body>
</html>
```

```js
var translateApp = angular.module('translateApp', ['pascalprecht.translate']);
translateApp.config(['$translateProvider', function ($translateProvider) {
    $translateProvider.translations('en', {
        'MESSAGE': 'message'
    });
    $translateProvider.translations('zh', {
        'MESSAGE': '消息'
    });
    $translateProvider.preferredLanguage('en');
}]);
 
translateApp.controller("translateController", function($scope) {
    console.log("....");
});
```

上述代码中，语音定义在config函数中，只需要改变"**$translateProvider.preferredLanguage('en');"中的语言key即可切换不同语言。那么如何在运行时切换不同的语言环境，只需要在translateController稍加改动即可简单实现，如下：

```js
translateApp.controller("translateController", function($translate, $scope) {
    // 改变语言环境
    $scope.changeLanguage = function(langKey) {
        $translate.use(langKey);
    }
});
```