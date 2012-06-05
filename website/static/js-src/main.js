requirejs.config({
    paths: {
        jquery: 'lib/jquery',
        //underscore: 'lib/lodash.min',
        underscore: 'lib/underscore',
        memphis: 'lib/memphis/memphis'
        //underscore: 'lib/underscore',
        //mediator: 'lib/aura/mediator',
        //text: 'lib/require/text'
    },
    //shim: {
    //    'lib/plugins/pjax': ['jquery'],
    //    'lib/plugins/waypoints': ['jquery']
    //}
});

define([
    'jquery',
    'memphis',
    'lib/plugins/pjax',
    'lib/plugins/waypoints'
], function($, core) {
    "use strict";

    var path, path_a, mode;
    var pageDiv;
    var pageHeadEl = $('.page-head');
    var pageContentsEl = $('#page-contents');
    var currentView;

    var init = function() {
        core.window.init([0, 480, 680, 980]);
        window.m = core;

        setupPjax();
        
        dispatchUrl();
    };

    var dispatchUrl = function() {
        path = window.location.pathname;
        path_a = path.split('/');
        mode = path_a[1] || 'home';

        switch (mode) {
            case 'home':
                require(["views/home"], onViewLoaded);
                break;
            case 'services':
                require(["views/services"], onViewLoaded);
                break;
            case 'contact':
                require(["views/contact"], onViewLoaded);
                break;
            default:
                break;
        }
    };

    var setupPjax = function() {
        var doc = $(document);
        if (!$.support.pjax) {
            return;
        }

        doc.on('pjax:start', onPjaxStart)
            .on('pjax:end', onPjaxEnd);

        $(window).on('click', '.lnk-a', onNavClick);
    };

    var onNavClick = function(ev) {
        var el, href, tmpDiv;

        ev.preventDefault();

        el = $(ev.target);

        if (el[0].nodeName !== 'A') {
            el = el.parent('a');
        }

        href = el.attr('href');

        tmpDiv = document.createElement("div");
        tmpDiv.id = 'pjax-cont-'+href.replace(/\//g,'');
        tmpDiv.className = 'pjax-cont';
        document.body.appendChild(tmpDiv);

        pageDiv = $(tmpDiv);

        $.pjax({
            url: href,
            container: tmpDiv,
            replaceHTML: true
        });
    };

    var onPjaxStart = function() {

        //console.log('start');
    };
    var onPjaxEnd = function(xhr, options) {
        var currBreakpoint, destHeight, def;

        document.body.className = pageDiv.find('.body_class').attr('data-class');

        if (pageHeadEl.hasClass('home-head')) {
            currBreakpoint = core.getViewport().currBreakpoint;

            if (currBreakpoint === 480) {
                destHeight = 255;
            } else {
                destHeight = 206;
            }

            pageHeadEl.height(pageHeadEl.height());
            pageHeadEl.addClass('in-transition');

            setTimeout(function() {
                currentView.hideSlideshow();
            }, 200);


            pageHeadEl.animate({
                height: destHeight
            }, 900, function() {
                pageHeadEl
                    .removeClass('home-head')
                    .removeClass('in-transition')
                    .addClass('active')
                    .empty()
                    .css({
                        height: ''
                    });
            });



            currentView.unregister();
        }

        //pageContentsEl.css({
        //    position: 'absolute',
        //    top: 'absolute',
        //});

        // 1. set pageContentsEl.height, overflow-y (and x) hidden
        // 2. set children to absolute pos
        // 3. create new el with content to right/left/top/bottom offscreen
        // 4. animate new and current children
        // 5. remove old child
        // 6. set other child to relative, remove top, left
        // 7. animate pageContentsEl.height to new height of child
        // 8. set pageContentsEl.height, overflow-y (and x) default


        pageContentsEl.fadeOut(400, function() {
            dispatchUrl();
            
            pageContentsEl.html(pageDiv.find('.page-content').html());
            pageContentsEl.fadeIn();
            pageDiv.remove();
        });
    };

    var onViewLoaded = function(view) {
        currentView = view;

        view.init();
    };

    init();
});