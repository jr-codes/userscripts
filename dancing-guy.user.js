// ==UserScript==
// @name         Dancing Guy
// @namespace   http://openuserjs.org/users/zarjay/scripts
// @author       zarjay
// @version      1.0.0
// @description  Make a dancing guy appear on every page
// @match        http://*/*
// @match        https://*/*
// @license     MIT License; https://github.com/zarjay/userscripts/blob/master/LICENSE
// ==/UserScript==

function init() {
    var src = '//simpl.info/videoalpha/video/dancer1.webm';
    var style = 'position: fixed; bottom: 0; right: 0; pointer-events: none; background: transparent; z-index: 100';

    document.body.insertAdjacentHTML('beforeend', '<video src="' + src + '" autoplay loop style="' + style + '"></video>');
}

init();
