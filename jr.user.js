// ==UserScript==
// @name        JR's Utils
// @namespace   http://openuserjs.org/users/zarjay/scripts
// @author      zarjay
// @version     1.2.0
// @description Library of functions runnable in the browser console.
// @match       http://*/*
// @match       https://*/*
// @license     MIT License; https://github.com/zarjay/userscripts/blob/master/LICENSE
// @updateURL   https://openuserjs.org/meta/zarjay/JRs_Utils.meta.js
// ==/UserScript==

const exec = fn => {
    const script = document.createElement('script');
    script.textContent = `(${fn})()`;
    document.head.appendChild(script);
};

const main = () => {
    // add CSS to the page
    function css(content) {
        const element = document.createElement('style');
        element.textContent = content;
        document.head.appendChild(element);
    }

    // copy JavaScript to the clipboard
    function copyJS(js) {
        copy(stringifyJS(js));
    }

    // copy JSON to the clipboard
    function copyJSON(js) {
        copy(stringifyJSON(js));
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
    function html(content, position = 'beforeend') {
        document.body.insertAdjacentHTML(position, content);
    }

    // include JS/CSS from URL or CDN
    function include(asset, type = asset.split('.').pop().toLowerCase()) {
        if (!asset.includes('/')) return includeFromCDN(asset);
        return includeFromURL(asset, type);
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
    function intercept(target = document.documentElement) {
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
    function js(content, isImmediate = false) {
        const script = document.createElement('script');
        script.textContent = isImmediate ? `(${content})()` : content;
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
    function query(target) {
        if (typeof target === 'string') return [...document.querySelectorAll(target)];
        if (target instanceof Node) return [target];
        return Array.from(target); // hopefully a NodeList, HTMLCollection, or Array
    }

    // format JS into a string
    function stringifyJS(js) {
        if (typeof js === 'function') {
            return js.toString();
        } else if (typeof js === 'object') {
            return stringifyJSON(js).replace(/"(\w+)":/g, '$1:').replace(/"/g, '\'');
        } else {
            return js;
        }
    }

    // format JSON into a string
    function stringifyJSON(js) {
        return JSON.stringify(js, null, '\t');
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
        copyJS,
        copyJSON,
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
