//memphis = testr('memphis');
//QUnit.config.autostart = false;
module("Memphis");

require(['memphis'], function (memphis) {
    "use strict";

    test("Subscribe", function() {
        expect(7);

        memphis.mediator.subscribe('test', function() {});
        memphis.mediator.subscribe('test2', function() {});

        ok(memphis.mediator.channels.hasOwnProperty('test'), "1st channel exists");
        ok(memphis.mediator.channels.hasOwnProperty('test2'), "channel exists");
        equal(1, memphis.mediator.channels.test.length, "1st channel length");
        equal(1, memphis.mediator.channels.test2.length, "2nd channel length");

        memphis.mediator.clear('test');

        ok(!memphis.mediator.channels.hasOwnProperty('test'), "1st channel cleared");
        ok(memphis.mediator.channels.hasOwnProperty('test2'), "2nd channel exists");

        memphis.mediator.clear('test2');
        ok(!memphis.mediator.channels.hasOwnProperty('test2'), "2nd channel cleared");
    });

    test("Publish and Subscribe", function() {
        expect(2);

        var idx = 0;
        var f = function() {
            idx += 1;
        };

        memphis.mediator.subscribe('test', f);

        memphis.mediator.publish('test');

        equal(idx, 1, "Publish 1");

        memphis.mediator.publish('test');

        equal(idx, 2, "Publish 2");

        memphis.mediator.clear('test');
    });

    test("Unsubscribe", function() {
        expect(2);

        var idx = 0;
        var f = function() {
            idx += 1;
        };

        memphis.mediator.subscribe('test', f);

        memphis.mediator.publish('test');

        equal(idx, 1, "Publish 1");

        memphis.mediator.unsubscribe('test', f);
        memphis.mediator.publish('test');

        equal(idx, 1, "Publish 2");

        memphis.mediator.clear('test');
    });

    test("Install to", function() {
        expect(3);

        var obj = {};

        memphis.mediator.installTo(obj);

        ok(obj.hasOwnProperty('subscribe'), "has subscribe");
        ok(obj.hasOwnProperty('unsubscribe'), "has unsubscribe");
        ok(obj.hasOwnProperty('publish'), "has publish");
    });


});