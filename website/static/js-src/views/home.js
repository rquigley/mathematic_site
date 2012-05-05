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
            if (ss.lastIdx !== ss.curIdx) {
                console.log('HA');
                ss.lastEl.find('.info').animate({
                    'opacity': 0,
                    'top': 320
                });
            }
            
            curEl = ss.curEl.find('.info');
            curEl.css({
                'opacity': 0,
                'left': 270,
                'top': 320
            });
        });
        memphis.subscribe('slideshow.onTransition.end', function(ss) {
            curEl.animate({
                'opacity': 1,
                'left': 300,
                'top': 300
            });
        });

        ss.init();
    };

    return {
        init: init
    };
});

