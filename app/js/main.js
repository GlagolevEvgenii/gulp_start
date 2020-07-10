(function () {
    "use strict";
    let body = document.querySelector('body'),
        isMobile = false,
        scrollTopPosition,
        browserYou,
        _winWidth = $(window).outerWidth();
    let genFunc = {
        initialized: false,
        initialize: function () {
            if (this.initialized) return;
            this.initialized = true;
            this.build();
        },
        build: function () {
            // browser
            browserYou = this.getBrowser();
            if (browserYou.platform == 'mobile') {
                isMobile = true;
                document.documentElement.classList.add('mobile');
            } else {
                document.documentElement.classList.add('desktop');
            }
            if ((browserYou.browser == 'ie')) {
                document.documentElement.classList.add('ie');
            }
            if (navigator.userAgent.indexOf("Edge") > -1) {
                document.documentElement.classList.add('edge');
            }
            if (navigator.userAgent.search(/Macintosh/) > -1) {
                document.documentElement.classList.add('macintosh');
            }
            if ((browserYou.browser == 'ie' && browserYou.versionShort < 9) || ((browserYou.browser == 'opera' || browserYou.browser == 'operaWebkit') && browserYou.versionShort < 18) || (browserYou.browser == 'firefox' && browserYou.versionShort < 30)) {
                alert('Обновите браузер');
            }
            if (document.querySelector('.yearN') !== null) {
                this.copyright();
            }
        },
        copyright: function () {
            let yearBlock = document.querySelector('.yearN'),
                yearNow = new Date().getFullYear().toString();
            if (yearNow.length) {
                yearBlock.innerText = yearNow;
            }
        },
        getBrowser: function () {
            let ua = navigator.userAgent;
            let bName = function () {
                if (ua.search(/Edge/) > -1) return "edge";
                if (ua.search(/MSIE/) > -1) return "ie";
                if (ua.search(/Trident/) > -1) return "ie11";
                if (ua.search(/Firefox/) > -1) return "firefox";
                if (ua.search(/Opera/) > -1) return "opera";
                if (ua.search(/OPR/) > -1) return "operaWebkit";
                if (ua.search(/YaBrowser/) > -1) return "yabrowser";
                if (ua.search(/Chrome/) > -1) return "chrome";
                if (ua.search(/Safari/) > -1) return "safari";
                if (ua.search(/maxHhon/) > -1) return "maxHhon";
            }();

            let version;
            switch (bName) {
                case "edge":
                    version = (ua.split("Edge")[1]).split("/")[1];
                    break;
                case "ie":
                    version = (ua.split("MSIE ")[1]).split(";")[0];
                    break;
                case "ie11":
                    bName = "ie";
                    version = (ua.split("; rv:")[1]).split(")")[0];
                    break;
                case "firefox":
                    version = ua.split("Firefox/")[1];
                    break;
                case "opera":
                    version = ua.split("Version/")[1];
                    break;
                case "operaWebkit":
                    bName = "opera";
                    version = ua.split("OPR/")[1];
                    break;
                case "yabrowser":
                    version = (ua.split("YaBrowser/")[1]).split(" ")[0];
                    break;
                case "chrome":
                    version = (ua.split("Chrome/")[1]).split(" ")[0];
                    break;
                case "safari":
                    version = ua.split("Safari/")[1].split("")[0];
                    break;
                case "maxHhon":
                    version = ua.split("maxHhon/")[1];
                    break;
            }
            let platform = 'desktop';
            if (/iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase())) platform = 'mobile';
            let browsrObj;
            try {
                browsrObj = {
                    platform: platform,
                    browser: bName,
                    versionFull: version,
                    versionShort: version.split(".")[0]
                };
            } catch (err) {
                browsrObj = {
                    platform: platform,
                    browser: 'unknown',
                    versionFull: 'unknown',
                    versionShort: 'unknown'
                };
            }
            return browsrObj;
        },
    };
    genFunc.initialize();
})();
function heightBlock() {
    $('.js_height-block').each(function (i, e) {
            var elH = e.getElementsByClassName("height");
            var maxHeight = 0;
            for (var i = 0; i < elH.length; ++i) {
                elH[i].style.height = "";
                if (maxHeight < elH[i].clientHeight) {
                    maxHeight = elH[i].clientHeight;
                }
            }
            for (var i = 0; i < elH.length; ++i) {
                elH[i].style.height = maxHeight + "px";
            }
        }
    )
}