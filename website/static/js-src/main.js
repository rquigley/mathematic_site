require.config({
    paths: {
        jquery: 'http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min',
        underscore: 'lib/lodash.min',
        memphis: 'lib/memphis/memphis'
        //underscore: 'lib/underscore',
        //mediator: 'lib/aura/mediator',
        //text: 'lib/require/text'
    }
});

define([
    'jquery',
    'memphis',
], function($, memphis) {
    "use strict";

    var path, path_a, mode;

    var init = function() {
        var view;

        path = window.location.pathname;
        path_a = path.split('/');
        mode = path_a[1] || 'home';
        
        switch (mode) {
            case 'home':
                view = require(["views/home"], onViewLoaded);
                break;
            default:
                break;
        }
    };

    var onViewLoaded = function(view) {
        view.init();
    }

    init();
});