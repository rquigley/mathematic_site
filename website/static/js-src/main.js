import $ from 'jquery';
import './lib/plugins/pjax';
import core from 'memphis';
import 'velocity-animate';

import viewHome from './views/home';
import viewServices from './views/services';
import viewWorkIndividual from './views/workIndividual';
import viewContact from './views/contact';

let pjaxDiv;
let pageHeadEl = $('.page-head');
let pageContentsEl = $('#page-contents');
let currentView;

function init() {
    core.window.init([0, 480, 680, 980]);

    setupPjax();

    dispatchUrl();

    // No transition on initial load
    core.publish('page_animation.complete');
}

function dispatchUrl() {
    let path = window.location.pathname;
    let pathA = path.split('/');
    let mode = pathA[1] || 'home';

    currentView = undefined;
    switch (mode) {
        case 'home':
            currentView = viewHome;
            break;
        case 'services':
            currentView = viewServices;
            break;
        case 'contact':
            currentView = viewContact;
            break;
        case 'work':
            if (pathA[2]) {
                currentView = viewWorkIndividual;
            }
            break;
        default:
            break;
    }
    if (currentView) {
        currentView.init();
    }
}

function setupPjax() {
    if (!$.support.pjax) {
        return;
    }

    $(document)
        .on('pjax:end', () => window.requestAnimationFrame(onPjaxEnd))
        .on('click', '.lnk-a', onNavClick);
}

function onNavClick(ev) {
    // If a modifier is used, use existing behavior
    if (ev.which > 1 || ev.metaKey || ev.ctrlKey) {
        return;
    }
    ev.preventDefault();

    let el = $(this);

    if (el[0].nodeName !== 'A') {
        el = el.parent('a');
    }

    let href = el.attr('href');

    let tmpDiv = document.createElement('div');
    tmpDiv.id = 'pjax-cont-' + href.replace(/\//g, '');
    tmpDiv.className = 'pjax-cont';
    document.body.appendChild(tmpDiv);

    pjaxDiv = tmpDiv;

    $.pjax({
        url: href,
        container: tmpDiv,
        replaceHTML: true
    });
}

function onPjaxEnd(xhr, options) {
    pjaxDiv.id = null;
    let $pageDiv = $(pjaxDiv);

    document.body.className = $pageDiv.find('.body_class').attr('data-class');

    let contents = $pageDiv.find('.page-content').html();
    setTimeout($pageDiv.remove, 100);

    let currBreakpoint = core.getViewport().currBreakpoint;

    let destHeight;

    // Slideshow isn't visible at smallest breakpoint
    if (pageHeadEl.hasClass('home-head') && currBreakpoint >= 480) {
        if (currBreakpoint === 480) {
            destHeight = 255;
        } else {
            destHeight = 206;
        }

        pageHeadEl.height(pageHeadEl.height());
        pageHeadEl.addClass('in-transition');

        setTimeout(currentView.hideSlideshow, 200);

        pageHeadEl.velocity({
            height: destHeight
        }, {
            duration: 900,
            complete: () => {
                pageHeadEl
                    .removeClass('home-head')
                    .removeClass('in-transition')
                    .addClass('active')
                    .empty()
                    .css({
                        height: ''
                    });
            }
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

    pageContentsEl.height(pageContentsEl.height());
    pageContentsEl.velocity({
        opacity: 0
    }, {
        duration: 400,
        complete: () => {
            pageContentsEl.html(contents);
            pageContentsEl.velocity({
                opacity: 1
            }, {
                duration: 400,
                complete: () => {
                    core.publish('page_animation.complete');
                },
            });
            dispatchUrl();
            pageContentsEl.height('');
        }
    });

    //$("html,body").animate({
    //    scrollTop: 100
    //});
}

init();
