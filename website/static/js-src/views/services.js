define([
    'jquery',
    'memphis'
], function($, core) {
    "use strict";

    var win = $(window);
    var waypointSelParentEl;
    var submenuEl;
    var submenuTop;
    var isSubmenuFixed = false;
    var waypointSel = '.content-back-end-development,.content-front-end-development,.content-performance,.content-hosting,.content-rapid-response';

    function init() {
        setTimeout(function() {
            setupSubmenu();
        }, 600);
    }

    function setupSubmenu() {
        submenuEl = $('.submenu');
        waypointSelParentEl = $('.scrolling-contents');

        var options = {
            offset: 100
        };

        waypointSelParentEl.find(waypointSel).waypoint(onWaypoint, options);

        core.subscribe('window.resize', recomputeSubmenuHeight);
        recomputeSubmenuHeight();
        win.scroll(onPageScroll).scroll();
    }

    function onPageScroll() {
        if ((document.documentElement.scrollTop || document.body.scrollTop) >= submenuTop) {
            if (isSubmenuFixed === true) {
                return;
            }
            isSubmenuFixed = true;
            submenuEl.addClass('fixed');
        } else {
            if (isSubmenuFixed === false) {
                return;
            }
            isSubmenuFixed = false;
            submenuEl.removeClass('fixed');
        }
    }

    function recomputeSubmenuHeight() {
        submenuTop = submenuEl.offset().top + 10;
        onPageScroll();
    }

    function onWaypoint(ev) {
        var el = $(ev.target);
        var target = el.find('.target')[0].name;
        console.log(target);
        submenuEl.find('.active').removeClass('active');
        submenuEl.find('[href=#'+target+']').addClass('active');
        //console.log(ev.target);
    }

    function unregister() {
        waypointSelParentEl.find(waypointSel).waypoint('destroy');
    }

    return {
        init: init,
        unregister: unregister
    };
});


