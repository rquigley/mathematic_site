import $ from 'jquery';

const _scriptLoadPromises = [];

function scriptLoad(src) {
    if (!_scriptLoadPromises[src]) {
        _scriptLoadPromises[src] = new Promise((resolve, reject) => {
            let script = document.createElement('script');
            script.type = 'text/javascript';
            script.async = true;

            if (script.readyState) {
                script.onreadystatechange = function() {
                    if (script.readyState === 'loaded' || script.readyState === 'complete') {
                        script.onreadystatechange = null;
                        resolve();
                    }
                };
            } else {
                script.onload = resolve;
            }
            script.onerror = reject;

            script.src = src;

            let s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(script, s);
        });
    }
    return _scriptLoadPromises[src];
}

function imagesLoaded(imgEls) {
    return $.when(Array.from(imgEls).forEach((imgEl) => {
        let dfd = new $.Deferred();
        $(imgEl).on('load', () => dfd.resolve());
        return dfd;
    }));
}

export default {
    scriptLoad,
    imagesLoaded,
};

