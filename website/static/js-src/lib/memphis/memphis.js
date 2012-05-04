
define([
], function() {
    "use strict";

    //var root = this;

    //root.memphis = memphis;

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
            installTo: function(obj) {
                obj.subscribe = subscribe;
                obj.unsubscribe = unsubscribe;
                obj.publish = publish;
            }
        };
    }());

    memphis.mediator.installTo(memphis);

    return memphis;
});
