// ==UserScript==
// @name        Dancing Guy
// @namespace	  https://jr.codes
// @author      JR
// @version     1.0.1
// @description Make a dancing guy appear on every page
// @match       http://*/*
// @match       https://*/*
// @license     MIT License; https://github.com/jr-codes/userscripts/blob/main/LICENSE
// ==/UserScript==

function init() {
  var src = '//simpl.info/videoalpha/video/dancer1.webm'
  var style =
    'position: fixed; bottom: 0; right: 0; pointer-events: none; background: transparent; z-index: 100'

  document.body.insertAdjacentHTML(
    'beforeend',
    '<video src="' + src + '" autoplay loop style="' + style + '"></video>'
  )
}

init()
