// ==UserScript==
// @name        JR's Utils
// @namespace   http://openuserjs.org/users/zarjay/scripts
// @author      zarjay
// @version     1.0.0
// @description Library of functions runnable in the browser console.
// @match       http://*/*
// @match       https://*/*
// @license     MIT License; https://github.com/zarjay/userscripts/blob/master/LICENSE
// ==/UserScript==

const exec = fn => {
    const script = document.createElement('script');
    script.textContent = `(${fn})()`;
    document.head.appendChild(script);
};

const main = () => {
    // add CSS to the page
    function css(css) {
        const element = document.createElement('style');
        element.textContent = css;
        document.head.appendChild(element);
    }

    // make the page editable or non-editable
    function edit(canEdit = true) {
        document.designMode = canEdit ? 'on' : 'off';
    }

    // count occurrences of each value
    function frequency(...values) {
        return values.reduce((obj, val) => Object.assign(obj, { [val]: (obj[val] || 0) + 1 }), {});
    }

    // add HTML to the page
    function html(html, position = 'beforeend') {
        document.body.insertAdjacentHTML(position, html);
    }

    // include JS/CSS from URL or CDN
    function include(url, type = url.split('.').pop().toLowerCase()) {
        if (!url.includes('/')) return includeFromCDN(url);
        return includeFromURL(url, type);
    }

    // include JS/CSS file from CDN
    function includeFromCDN(library) {
        return fetch(`https://api.cdnjs.com/libraries?search=${library}`)
            .then(response => response.json())
            .then(json => json.results[0].latest)
            .then(include)
            .catch(error => console.error(`Couldn't find ${library}`))
    }

    // include JS/CSS file from URL
    function includeFromURL(url, type) {
        return new Promise((resolve, reject) => {
            let element;

            if (type === 'css') {
                element = document.createElement('link');
                element.rel = 'stylesheet';
                element.href = url;
            } else if (type === 'js') {
                element = document.createElement('script');
                element.src = url;
                element.async = false;
            } else {
                throw new Error(`Failed to include ${url} due to unknown file type.`);
            }

            element.onload = resolve;
            element.onerror = reject;
            document.head.appendChild(element);
        });
    }

    // block bubble events with a capture event
    function intercept(target) {
        const events = [
            'contextmenu',
            'copy',
            'keydown',
            'keypress',
            'keyup',
            'mousedown',
            'mouseup',
            'selectstart'
        ];
        const stopEvents = event => event.stopPropagation();
        query(target).forEach(element =>
            events.forEach(event => element.addEventListener(event, stopEvents, true)));
    }

    // add JS to the page
    function js(js, isImmediate = false) {
        const script = document.createElement('script');
        script.textContent = isImmediate ? `(${js})()` : js;
        document.head.appendChild(script);
    }

    // calculate the mean
    function mean(...values) {
        return sum(...values) / values.length;
    }

    // calculate the median
    function median(...values) {
        values.sort((a, b) => a - b);
        const low = (values.length - 1) >> 1;
        const high = values.length >> 1;
        return (values[low] + values[high]) / 2;
    }

    // calculate the mode
    function mode(...values) {
        const counted = frequency(...values);
        const keys = unique(...values);
        const vals = keys.map(x => counted[x]);
        if (vals.every(x => x < 2)) return [];
        const max = Math.max(...vals);
        return keys.reduce((array, key) => counted[key] === max ? [...array, key] : array, []);
    }

    // pauses audio/video (pause everything by default)
    function pause(target = 'audio, video') {
        const elements = query(target);
        elements.forEach(element => typeof element.pause === 'function' ? element.pause() : null);
    }

    // plays audio/video (plays first found by default)
    function play(target = 'audio, video') {
        const element = query(target)[0];
        if (element && typeof element.play === 'function') element.play();
    }

    // kinda like jQuery's $()
    function query(target = [document.documentElement]) {
        if (typeof target === 'string') return [...document.querySelectorAll(target)];
        if (target instanceof Node) return [target];
        return Array.from(target); // hopefully a NodeList, HTMLCollection, or Array
    }

    // calculate the sum
    function sum(...values) {
        return values.reduce((a, b) => a + b);
    }

    // filter out duplicate values
    function unique(...values){
        return values.filter((x, i) => values.indexOf(x) === i)
    }

    const jr = {
        css,
        edit,
        frequency,
        html,
        include,
        intercept,
        js,
        mean,
        median,
        mode,
        pause,
        play,
        query,
        sum,
        unique
    };

    if (window.jr) {
        console.warn('Userscript: jr variable is taken.');
    } else {
        window.jr = jr;
        console.log('Userscript: jr is loaded.');
    }
};

exec(main);
