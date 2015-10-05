import $ from 'jquery';
import core from 'memphis';
import util from '../util';
import 'velocity-animate';

import slideshow from '../plugins/slideshow';

let workSlideshow;
let ssParent;
let ssCont;

function init() {
    ssParent = $('#page-contents .proj_images');

    if (ssParent.length) {
        ssCont = ssParent.find('.ss__cont');

        setupSlideshow();
    }
}

function setupSlideshow() {
    let dfd = util.imagesLoaded(ssCont.find('.ss__slide1'));
    let nav = ssParent.find('.ss__prev,.ss__next');

    if (ssCont.children().length === 1) {
        dfd.done(function() {
            ssCont.velocity({
                height: ssCont.find('.ss__slide1').height() + 3
            }, {
                duration: 700
            });
        });

        return;
    }

    core.subscribe('slideshow.onTransition.start', function(ss) {
        ssCont.velocity({
            height: ss.curEl.height() + 3
        }, {
            duration: 700
        });
    });

    workSlideshow = slideshow(ssParent);

    ssCont.on('mousemove', function(ev) {
        nav.css('top', ev.offsetY - 60);
    });

    dfd.done(function() {
        workSlideshow.init();
    });
}

function unregister() {
    ssCont.off('mousemove');

    $.removeData(ssCont.find('.ss__slide1'), 'imagesLoaded');

    if (workSlideshow) {
        workSlideshow.remove();
    }
}

export default {
    init,
    unregister,
};
