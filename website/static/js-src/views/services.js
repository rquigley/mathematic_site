import $ from 'jquery';
import core from 'memphis';
import 'velocity-animate';
import 'waypoints/lib/jquery.waypoints';

let win = $(window);
let waypointSelParentEl;
let submenuEl;
let submenuTop;
let isSubmenuFixed = false;
let waypointSel = '.content-back-end-development,.content-front-end-development,.content-performance,.content-hosting,.content-rapid-response';

function init() {
    core.subscribe('page_animation.complete', setupSubmenu);
}

function setupSubmenu() {
    submenuEl = $('.submenu');
    waypointSelParentEl = $('.scrolling-contents');

    waypointSelParentEl.find(waypointSel).waypoint({
        handler: onWaypoint,
        offset: 100
    });

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
    let target = this.element.querySelector('.target').name;

    submenuEl.find('.active').removeClass('active');
    submenuEl.find('[href=#'+target+']').addClass('active');
}

function unregister() {
    core.unsubscribe('window.resize', recomputeSubmenuHeight);
    core.unsubscribe('page_animation.complete', setupSubmenu);
    waypointSelParentEl.find(waypointSel).waypoint('destroy');
}

export default {
    init,
    unregister,
};
