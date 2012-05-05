define([
    'jquery',
    'underscore'
], function($, _) {
    "use strict";

    var memphis = {};

    memphis.mediator = (function() {
        var channels = {};

        var subscribe = function(channel, fn) {
            if (!channels[channel]) {
                channels[channel] = [];
            }

            channels[channel].push({
                context: this,
                callback: fn
            });
        };

        var unsubscribe = function(channel, fn) {
            var i, l,
                ch;

            if (!channels[channel]) {
                return;
            }
            ch = channels[channel];

            for (i = 0, l = ch.length; i < l; i++) {
                if (fn === ch[i].callback) {
                    channels[channel] = ch.slice(0,i).concat(ch.slice(i+1));
                    return;
                }
            }
        };

        var clear = function(channel) {
            if (!channels[channel]) {
                return;
            }

            delete channels[channel];
        };

        var publish = function(channel) {
            var args,
                i, l,
                subscription;

            if (!channels[channel]) {
                return;
            }

            args = Array.prototype.slice.call(arguments, 1);

            for (i = 0, l = channels[channel].length; i < l; i++) {
                subscription = channels[channel][i];
                subscription.callback.apply(subscription.context, args);
            }
        };

        return {
            channels: channels,
            publish: publish,
            subscribe: subscribe,
            unsubscribe: unsubscribe,
            clear: clear,
            installTo: function(obj) {
                obj.subscribe = subscribe;
                obj.unsubscribe = unsubscribe;
                obj.publish = publish;
            }
        };
    }());

    memphis.mediator.installTo(memphis);

    memphis.window = (function() {
        var win = $(window),
            viewport = {
                currBreakpoint: null,
                lastBreakpoint: null,
                width: 0,
                height: 0
            },
            breakpoints = [];

        var init = function(uBreakpoints) {
            if (uBreakpoints) {
                breakpoints = uBreakpoints;
            }

            viewport.width = win.width();
            viewport.height = win.height();

            win.resize(_.debounce(onResizeHandler, 300, true));

            breakpointHandler();
        };

        var getViewport = function() {
            return viewport;
        };

        var onResizeHandler = function() {
            var w = win.width(),
                h = win.height();

            if (w === viewport.width && h === viewport.height) {
                return;
            }
            viewport.width = w;
            viewport.height = h;

            memphis.publish('memphis.window.resize', viewport);

            breakpointHandler();
        };

        var breakpointHandler = function() {
            var bp,
                selBp = 1;

            if (!breakpoints.length) {
                return;
            }

            for (var n in breakpoints) {
                if (breakpoints[n] < viewport.width) {
                    selBp = breakpoints[n];
                }
            }

            if (selBp === viewport.currBreakpoint) {
                return;
            }

            if (viewport.currBreakpoint) {
                viewport.lastBreakpoint = viewport.currBreakpoint;
            }
            viewport.currBreakpoint = selBp;

            if (viewport.lastBreakpoint) {
                memphis.publish('memphis.window.breakpoint.out'+viewport.lastBreakpoint, viewport);
            }
            memphis.publish('memphis.window.breakpoint.in'+viewport.currBreakpoint, viewport);
        };

        return {
            init: init,
            getViewport: getViewport
        }
    }());

    memphis.getViewport = memphis.window.getViewport;

    return memphis;
});
