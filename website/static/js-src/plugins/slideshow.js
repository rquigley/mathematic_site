/*!
* slideshow
* Basic slideshow
* Author: @rquigley
* Licensed under the MIT license
*/
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery', 'underscore', 'memphis'], factory);
    } else {
        root.slideshow = factory(root.jquery, root.underscore, root.memphis);
    }
}(this, function ($, _, memphis) {
    "use strict";

    var slideshow = function(parentEl, options) {
        var defaults = {
                autoPlay: false,
                autoPlayInterval: 4000,
                autoPlayTransitionDuration: 2000,
                transitionDuration: 400
            },

            settings = {},

            contEl,
            slides,
            numSlides,
            curIdx = 0,
            lastIdx = 0,
            counterContEl,

            autoPlayEnabledIntervalId = 0;

        var init = function() {
            settings = $.extend(defaults, options);

            contEl = parentEl.find('.ss__cont');
            slides = contEl.children();
            numSlides = slides.length;

            counterContEl = parentEl.find('.ss__counter');

            if (numSlides <= 1) {
                counterContEl.hide();
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
            transition(idx);
        };

        var startAutoPlay = function() {
            if (0 === autoPlayEnabledIntervalId) {
                autoPlayEnabledIntervalId = setInterval(onNextClickAuto, settings.autoPlayInterval);
                transition();

                memphis.publish('slideshow.onStartAutoplay', {
                    curIdx: curIdx,
                    parentEl: parentEl
                });
            }
        };

        var stopAutoPlay = function() {
            if (autoPlayEnabledIntervalId) {
                clearInterval(autoPlayEnabledIntervalId);
                autoPlayEnabledIntervalId = 0;

                memphis.publish('slideshow.onEndAutoplay', {
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

            memphis.publish('slideshow.onTransition.start', {
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
                    lastSlide.fadeOut(transitionTime);
                }

                curSlide
                    .css('display', 'none')
                    .fadeIn(transitionTime, function() {
                        memphis.publish('slideshow.onTransition.end', {
                            curIdx: curIdx,
                            curEl: curSlide,
                            lastIdx: lastIdx,
                            lastEl: lastSlide,
                            parentEl: parentEl
                        });
                    });
            } else {
                console.log('SHITTTTTT', curSlide);
                memphis.publish('slideshow.onTransition.end', {
                    curIdx: curIdx,
                    curEl: curSlide,
                    lastIdx: lastIdx,
                    lastEl: lastSlide,
                    parentEl: parentEl
                });
            }

            counterContEl.find('.active').removeClass('active');
            counterContEl.find(':nth-child('+(curIdx+1)+')').addClass('active');
        };

        return {
            init: init
        };
    };

    var onEndTransition = function() {
        memphis.publish('slideshow.onTransition.end', {
            curIdx: curIdx,
            lastIdx: lastIdx,
            parentEl: parentEl
        });
    };

    return slideshow;
}));
