define([
    'jquery',
    'underscore',
    'mediator'
], function($, _, mediator) {
    "use strict";

    var win = $(window),
        winWidth,
        winHeight,
        currentBreakpoint,
        settings = {},
        defaults = {
            breakpoints: []
        };

    var init = function(options) {
        settings = $.extend(defaults, options);
        winWidth = win.width();
        winHeight = win.height();

        $(window).resize(_.debounce(onResizeHandler, 300));

        breakpointHandler();
    };

    var onResizeHandler = function() {
        var w = win.width(),
            h = win.height();

        if (w === winWidth && h === winHeight) {
            return;
        }
        winWidth = w;
        winHeight = h;

        mediator.publish('windowResize.resize');

        breakpointHandler();
    };

    var breakpointHandler = function() {
        var breakpoints = settings.breakpoints,
            bp,
            selBp = 1;

        if (!breakpoints.length) {
            return;
        }

        for (var n in breakpoints) {
            if (breakpoints[n] < winWidth) {
                selBp = breakpoints[n];
            }
        }

        if (selBp === currentBreakpoint) {
            return;
        }

        if (currentBreakpoint) {
            mediator.publish('windowResize.breakpoint.out'+currentBreakpoint);
        }

        currentBreakpoint = selBp;

        mediator.publish('windowResize.breakpoint.in'+selBp);
    };

    return {
        'init': init
    };
});
