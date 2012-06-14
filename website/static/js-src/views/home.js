define([
    'jquery',
    'memphis',
    'plugins/slideshow',
    'transit'
], function($, core, slideshow) {
    "use strict";

    var win = $(window);
    var headEl;
    var bodyEl;
    var lastServiceEl;
    var currServiceEl;
    var serviceTitleEl;
    var defaultServiceTitle;
    var homeSlideshow;
    var isPageScrolled = false;
    var buttonEl;

    function init() {
        var ss;

        headEl = $('.home-head');
        bodyEl = $('.home-body');

        setupSlideshow();

        setupContinueButton();

        setupIntro();
    }

    function setupSlideshow() {
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
        buttonEl = headEl.find('.btn_continue');

        win.scroll(onContinueButtonPageScroll).scroll();

        headEl.on('click', '.btn_continue', onButtonContinue);
    }
    
    function onContinueButtonPageScroll() {
        if ((document.documentElement.scrollTop || document.body.scrollTop) > 0) {
            if (isPageScrolled === true) {
                return;
            }
            isPageScrolled = true;
            buttonEl.addClass('down');

        } else {
            if (isPageScrolled === false) {
                return;
            }
            isPageScrolled = false;
            buttonEl.removeClass('down');
        }
    }

    function onButtonContinue() {
        $("html,body").animate({
            scrollTop: isPageScrolled ? 0 : bodyEl.offset().top
        });
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
        bodyEl.off('mouseover');
        bodyEl.off('mouseleave');
        headEl.off('click');

        homeSlideshow.remove();
    }

    return {
        init: init,
        hideSlideshow: hideSlideshow,
        unregister: unregister
    };
});

