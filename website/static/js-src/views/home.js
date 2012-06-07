define([
    'jquery',
    'memphis',
    'plugins/slideshow',
    'transit'
], function($, core, slideshow) {
    "use strict";

    var headEl;
    var bodyEl;
    var lastServiceEl;
    var currServiceEl;
    var serviceTitleEl;
    var defaultServiceTitle;

    function init() {
        var ss;

        headEl = $('.home-head');
        bodyEl = $('.home-body');

        setupSlideshow();

        setupContinueButton();

        setupIntro();
    }

    function setupSlideshow() {
        var homeSlideshow;
        var curEl;
        var slideshowLive = null;
        var onHomeSlideshowBreakpoint;

        core.subscribe('slideshow.onTransition.start', function(ss) {
            if (ss.lastIdx !== ss.curIdx) {
                ss.lastEl.find('.info').transit({
                    'opacity': 0,
                    'top': 320
                });
            }

            curEl = ss.curEl.find('.info');
            curEl.css({
                'opacity': 0,
                'left': '21%',
                'top': 320
            });
        });
        core.subscribe('slideshow.onTransition.end', function(ss) {
            curEl.transit({
                'opacity': 1,
                'left': '24%',
                'top': 300
            });
        });

        onHomeSlideshowBreakpoint = function(vp) {
            if (vp.currBreakpoint >= 600) {
                if (!slideshowLive || slideshowLive === null) {
                    slideshowLive = true;
                }
            } else {
                if (slideshowLive || slideshowLive === null) {
                    slideshowLive = false;
                }
            }
        };

        core.subscribe('window.breakpoint', onHomeSlideshowBreakpoint);

        homeSlideshow = slideshow(headEl);
        homeSlideshow.init();

        onHomeSlideshowBreakpoint(core.getViewport());
    }

    function setupContinueButton() {
        headEl.on('click', '.btn_continue', onButtonContinue);
    }

    function onButtonContinue() {
        $("html,body").animate(
            {
                scrollTop: bodyEl.position().top
            }
        );
    }

    function setupIntro() {
        defaultServiceTitle = "Our Promise";
        serviceTitleEl = $('.col2 h3');

        currServiceEl = $('.intro-cont[data-intro=0]');

        bodyEl.on('mouseover', '.services .intro_btn', onIntroButtonOver);
        bodyEl.on('mouseleave', '.services', onLeaveServices);
    }

    function onIntroButtonOver(ev) {
        var el = ev.target;

        lastServiceEl = currServiceEl;
        currServiceEl = $('.intro-cont[data-intro='+el.getAttribute('data-intro')+']');

        lastServiceEl.removeClass('active');
        currServiceEl.addClass('active');

        serviceTitleEl.text(el.innerHTML);

        //selectedEl = $('.intro-cont[data-intro='+el.attr('data-intro')+']');
        //
        //console.log($('.intro-cont[data-intro='+el.attr('data-intro')+']'));
        //$('.intro-cont.active').removeClass('active');
        //$('.intro-cont[data-intro='+el.attr('data-intro')+']').addClass('active');
    }

    function onLeaveServices(ev) {
        var el = $(ev.target);

        currServiceEl = $('.intro-cont[data-intro=0]');
        serviceTitleEl.text(defaultServiceTitle);
        $('.intro-cont.active').removeClass('active');
        currServiceEl.addClass('active');
    }

    function hideSlideshow() {
        $('.home-head').children().transit({opacity: 0}, 300);
    }

    function unregister() {
        bodyEl.off('mouseover', '.services .intro_btn', onIntroButtonOver);
        bodyEl.off('mouseleave', '.services', onLeaveServices);
        headEl.off('click', '.btn_continue', onButtonContinue);

        // TODO: unsubscribe/destroy slideshow
    }

    return {
        init: init,
        hideSlideshow: hideSlideshow,
        unregister: unregister
    };
});

