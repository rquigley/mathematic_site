import $ from 'jquery';
import core from 'memphis';
import 'velocity-animate';

/*!
* slideshow
* Basic slideshow
* Author: @rquigley
* Licensed under the MIT license
*/
var slideshow = function(parentEl, options) {
    var defaults = {
        autoPlay: false,
        autoPlayInterval: 4000,
        autoPlayTransitionDuration: 2000,
        transitionDuration: 400
    };

    let settings = {};

    let contEl;
    let slides;
    let numSlides;
    let curIdx = 0;
    let lastIdx = 0;
    let counterContEl;

    let autoPlayEnabledIntervalId = 0;

    var init = function() {
        settings = $.extend(defaults, options);

        contEl = parentEl.find('.ss__cont');
        slides = contEl.children();
        numSlides = slides.length;

        counterContEl = parentEl.find('.ss__counter');

        if (numSlides <= 1) {
            counterContEl.hide();
            parentEl.find('.ss__next,.ss__prev').hide();
            parentEl.find('.ss__counter-cont').hide();
            return;
        }

        setupNav();
        setupCounter();

        if (true === settings.autoPlay) {
            startAutoPlay();
        } else {
            transition(0, true);
        }
    };

    var remove = function() {
        slides
            .filter('.active')
            .stop(true, true)
            .removeClass('active');

        parentEl.off('click');
        counterContEl.off('click');
    };

    var setupCounter = function() {
        var str = '';
        var i = numSlides;

        while (i--) {
            str += '<a class="ss__slot"></a>';
        }

        counterContEl.html(str);

        counterContEl.on('click', 'a', onCounterClick);
    };

    var setupNav = function() {
        parentEl.on('click', '.ss__next', onNextClick);
        parentEl.on('click', '.ss__prev', onPrevClick);
    };

    // Click handler for next selector
    var onNextClick = function() {
        stopAutoPlay();

        var idx = curIdx + 1;
        if (idx >= numSlides) {
            idx = 0;
        }
        transition(idx);
    };

    var onNextClickAuto = function() {
        var idx = curIdx + 1;
        if (idx >= numSlides) {
            idx = 0;
        }
        transition(idx);
    };

    // Click handler for previous selector
    var onPrevClick = function() {
        var idx = curIdx - 1;
        if (idx < 0) {
            idx = numSlides - 1;
        }
        transition(idx);
    };

    var onCounterClick = function(ev) {
        var idx;

        stopAutoPlay();

        idx = _.indexOf($(this).parent().children(), this);

        if (idx !== curIdx) {
            transition(idx);
        }
    };

    var startAutoPlay = function() {
        if (0 === autoPlayEnabledIntervalId) {
            autoPlayEnabledIntervalId = setInterval(onNextClickAuto, settings.autoPlayInterval);
            transition();

            core.publish('slideshow.onStartAutoplay', {
                curIdx: curIdx,
                parentEl: parentEl
            });
        }
    };

    var stopAutoPlay = function() {
        if (autoPlayEnabledIntervalId) {
            clearInterval(autoPlayEnabledIntervalId);
            autoPlayEnabledIntervalId = 0;

            core.publish('slideshow.onEndAutoplay', {
                curIdx: curIdx,
                parentEl: parentEl
            });
        }
    };

    var transition = function(idx, skipTransition) {
        var transitionTime,
            curSlide, lastSlide;

        if (undefined !== idx) {
            lastIdx = curIdx;
            curIdx = idx;
        }

        curSlide = $(slides[curIdx]);
        lastSlide = $(slides[lastIdx]);

        core.publish('slideshow.onTransition.start', {
            curIdx: curIdx,
            curEl: curSlide,
            lastIdx: lastIdx,
            lastEl: lastSlide,
            parentEl: parentEl
        });

        // cancel all animations for the current slide, then place behind all other slides
        slides
            .filter('.active')
            .stop(true, true)
            .removeClass('active');

        transitionTime = autoPlayEnabledIntervalId ? settings.autoPlayTransitionDuration : settings.transitionDuration;

        curSlide.addClass('active');

        if (!skipTransition) {
            if (undefined !== idx) {
                lastSlide.velocity({
                    opacity: 0
                }, {
                    duration: transitionTime,
                    complete: () => {
                        lastSlide.css({
                            display: 'none'
                        });
                    }
                });
            }

            curSlide
                .css({
                    display: 'block',
                    opacity:0
                })
                .velocity({
                    opacity: 1
                }, {
                    duration: transitionTime,
                    complete: () => {
                        core.publish('slideshow.onTransition.end', {
                            curIdx,
                            curEl: curSlide,
                            lastIdx,
                            lastEl: lastSlide,
                            parentEl
                        });
                    }
                });
        } else {
            core.publish('slideshow.onTransition.end', {
                curIdx,
                curEl: curSlide,
                lastIdx,
                lastEl: lastSlide,
                parentEl,
            });
        }

        counterContEl.find('.active').removeClass('active');
        counterContEl.find(':nth-child('+(curIdx+1)+')').addClass('active');
    };

    return {
        init,
        remove,
    };
};

export default slideshow;
