// ==UserScript==
// @name        YouTube Utils
// @namespace   http://jr.codes
// @author      JR
// @version     1.1.0
// @description Library of Youtube-specific functions runnable from the browser console. The functions only work if the YouTube video is rendered in  HTML5, not Flash.
// @match       https://www.youtube.com/watch?v=*
// @license     MIT License; https://github.com/zarjay/userscripts/blob/master/LICENSE
// ==/UserScript==

/** Injects u library onto the page so it can be run from the browser console. */
function main() {
  var u = {}

  /** Reference to the YouTube video */
  u.video = document.querySelector('video')

  /** Flips the video on an axis. Defaults to the y axis. */
  u.flip = function (axis) {
    axis = (axis || 'y').toUpperCase()

    var style = this.video.style
    var value = style.transform.indexOf('180deg') === -1 ? '180' : '0'

    style.transition = '1s all ease-in'
    style.transform = 'rotate' + axis + '(' + value + 'deg)'
  }

  /** Pauses the video. */
  u.pause = u.stop = function () {
    this.video.pause()
  }

  /** Plays the video. */
  u.play = u.go = function () {
    this.video.play()
  }

  /** Get/set video's loop property. */
  Object.defineProperty(u, 'loop', {
    get: function () {
      return this.video.loop
    },
    set: function (value) {
      this.video.loop = value
    },
  })

  /** Get/set video's playbackRate property */
  Object.defineProperty(u, 'speed', {
    get: function () {
      return this.video.playbackRate
    },
    set: function (value) {
      this.video.playbackRate = value
    },
  })

  /**
        Adds a <link> or <script> to the page
        and returns a promise that resolves when loaded.
    */
  u.include = function (url, type) {
    // Get type or assume from file extension
    type = (type || url.split('.').pop()).toLowerCase()

    return new Promise(function (resolve, reject) {
      var elem

      if (type === 'css') {
        elem = document.createElement('link')
        elem.rel = 'stylesheet'
        elem.onload = resolve
        elem.href = url
      } else if (type === 'js') {
        elem = document.createElement('script')
        elem.async = false
        elem.onload = resolve
        elem.src = url
      } else {
        reject(
          new Error(
            'Userscript: Failed to include ' +
              url +
              ' due to  unknown file type'
          )
        )
      }

      document.head.appendChild(elem)
    })
  }

  if (window.u) {
    console.warn('Userscript: u variable is taken!')
  } else {
    window.u = u
    console.log('Userscript: u is loaded.')
  }
}

function exec(fn) {
  var script = document.createElement('script')
  script.textContent = '(' + fn + ')();'
  document.head.appendChild(script)
}

// Inject function into the page.
exec(main)
