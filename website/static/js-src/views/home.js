define([
    'jquery',
    'memphis',
    'plugins/slideshow'
], function($, core, slideshow) {
    "use strict";

    var init = function() {
        var ss;

        setupSlideshow();
    };
    
    var setupSlideshow = function() {
        var homeSlideshow;
        var curEl;
        var slideshowLive = null;
        var onHomeSlideshowBreakpoint;

        core.subscribe('slideshow.onTransition.start', function(ss) {
            if (ss.lastIdx !== ss.curIdx) {
                ss.lastEl.find('.info').animate({
                    'opacity': 0,
                    'top': 320
                });
            }
            
            curEl = ss.curEl.find('.info');
            curEl.css({
                'opacity': 0,
  //              'left': '41%',
                'top': 320
            });
        });
        core.subscribe('slideshow.onTransition.end', function(ss) {
            curEl.animate({
                'opacity': 1,
//                'left': '44%',
                'top': 300
            });
        });

        var onHomeSlideshowBreakpoint = function(vp) {
            if (vp.currBreakpoint >= 600) {
                if (!slideshowLive || slideshowLive === null) {
                    slideshowLive = true;
                }
            } else {
                console.log(slideshowLive, 'haha');
                if (slideshowLive || slideshowLive === null) {
                    slideshowLive = false;
                }
            }
            //console.log(vp);
        }
        
        core.subscribe('core.window.breakpoint', onHomeSlideshowBreakpoint);
        
        homeSlideshow = slideshow($('.home-head'));
        homeSlideshow.init();
        
        onHomeSlideshowBreakpoint(core.getViewport());
    };

    return {
        init: init
    };
});

