define([
    'jquery',
    'memphis',
    'plugins/slideshow',
    'imagesloaded',
], function($, core, slideshow) {
    "use strict";

    var workSlideshow;
    var hasSlideshow = false;
    var pageEl = $('#page-contents');
    var ssParent;
    var ssCont;

    function init() {
        ssParent = pageEl.find('.proj_images');

        if (ssParent.length) {
            hasSlideshow = true;
            ssCont = ssParent.find('.ss__cont');

            setupSlideshow();
        }
    }

    function setupSlideshow() {
        var slide1 = ssCont.find('.ss__slide1');
        var dfd = slide1.imagesLoaded();
        var nav = ssParent.find('.ss__prev,.ss__next');

        if (ssCont.children().length === 1) {
            dfd.done(function() {
                ssCont.transit({
                    height: ssCont.find('.ss__slide1').height() + 3
                }, 700);
            });

            return;
        }

        core.subscribe('slideshow.onTransition.start', function(ss) {
            ssCont.transit({
                height: ss.curEl.height() + 3
            }, 700);
        });

        //core.subscribe('slideshow.onTransition.end', function(ss) {
        //
        //});

        workSlideshow = slideshow(ssParent);

        ssCont.on('mousemove', function(ev) {
            nav.css('top', ev.offsetY - 60);
        });

        dfd.done(function() {
            workSlideshow.init();
        });
    }

    function unregister() {
        ssCont.off('mousemove');

        $.removeData(ssCont.find('.ss__slide1'), 'imagesLoaded');

        if (hasSlideshow) {
            workSlideshow.remove();
        }
    }

    return {
        init: init,
        unregister: unregister
    };
});


