define([
    'jquery',
    'memphis',
    'plugins/slideshow'
], function($, memphis, slideshow) {
    "use strict";

    var init = function() {
        var ss = slideshow($('.home-head')),
            curEl;

        memphis.subscribe('slideshow.onTransition.start', function(ss) {
            curEl = ss.curEl.find('.info');
            curEl.css({
                'opacity': 0,
                'left': 0
            });
        });
        memphis.subscribe('slideshow.onTransition.end', function(ss) {
            curEl.animate({
                'opacity': 1,
                'left': 200
            });
        });

        ss.init();
    };

    return {
        init: init
    };
});

