// ==UserScript==
// @name        JR's Utils
// @version     2.0.0
// @description Library of functions runnable in the browser console.
// @author      JR
// @namespace   https://jr.codes
// @grant       none
// @match       http://*/*
// @match       https://*/*
// @license     MIT License; https://github.com/jr-codes/userscripts/blob/main/LICENSE
// @downloadURL https://github.com/jr-codes/userscripts/raw/main/jr.user.js
// @updateURL   https://github.com/jr-codes/userscripts/raw/main/jr.user.js
// ==/UserScript==

{
  // Automatically scroll down the page.
  function autoscroll(speed = 100, increment = 2) {
    const scroll = () => window.scrollBy({ top: increment, behavior: 'smooth' })
    setInterval(scroll, speed)
  }

  // Add CSS to the page.
  function css(content) {
    const element = document.createElement('style')
    element.textContent = content
    document.head.appendChild(element)
  }

  // Make the page editable or non-editable.
  function edit(canEdit = true) {
    document.designMode = canEdit ? 'on' : 'off'
  }

  function hide(target = document.documentElement) {
    query(target).forEach((element) =>
      element.style.setProperty('display', 'none')
    )
  }

  // Add HTML to the page.
  function html(content, position = 'beforeend') {
    document.body.insertAdjacentHTML(position, content)
  }

  // Include JS/CSS from a URL or CDN.
  function include(asset, type) {
    if (!asset.includes('/')) return includeFromCDN(asset)
    return includeFromURL(asset, type)
  }

  // Include JS/CSS file from a CDN.
  function includeFromCDN(library) {
    return fetch(`https://api.cdnjs.com/libraries?search=${library}`)
      .then((response) => response.json())
      .then((json) => json.results[0].latest)
      .then(includeFromURL)
      .catch((error) => console.error(`😿 Couldn't load ${library}`, error))
  }

  // Include JS/CSS file from a URL.
  function includeFromURL(url, type = url.split('.').pop().toLowerCase()) {
    return new Promise((resolve, reject) => {
      let element

      if (type === 'css') {
        element = document.createElement('link')
        element.rel = 'stylesheet'
        element.href = url
      } else if (type === 'js') {
        element = document.createElement('script')
        element.src = url
        element.async = false
      } else {
        throw new Error(`😿 Failed to include ${url} due to unknown file type`)
      }

      element.onload = resolve
      element.onerror = reject
      document.head.appendChild(element)
    }).then(() => console.log('😸 Loaded', url))
  }

  // Block bubble events with a capture event.
  function intercept(
    target = document.documentElement,
    events = [
      'contextmenu',
      'copy',
      'input',
      'keydown',
      'keypress',
      'keyup',
      'mousedown',
      'mouseup',
      'paste',
      'selectstart',
    ]
  ) {
    const stopEvent = (event) => event.stopPropagation()

    query(target).forEach((element) => {
      events.forEach((event) => {
        element.addEventListener(event, stopEvent, true)
      })
    })
  }

  // Add JS to the page.
  function js(content, isImmediate = false) {
    const script = document.createElement('script')
    script.textContent = isImmediate ? `(${content})()` : content
    document.head.appendChild(script)
  }

  // Pause audio/video (pause everything by default).
  function pause(target = 'audio, video') {
    const elements = query(target)
    elements.forEach((element) =>
      typeof element?.pause === 'function' ? element.pause() : null
    )
  }

  // Play audio/video (plays first found by default).
  function play(target = 'audio, video') {
    const element = query(target)[0]
    if (typeof element?.play === 'function') element.play()
  }

  // Kinda like jQuery's $().
  function query(target) {
    if (typeof target === 'string')
      return [...document.querySelectorAll(target)]
    if (target instanceof Node) return [target]
    return Array.from(target) // hopefully a NodeList, HTMLCollection, or Array
  }

  function watch(target, onChange) {
    query(target).forEach((element) => {
      const observer = new MutationObserver(onChange)
      observer.observe(element, { childList: true, subtree: true })
      console.log(`😼 Watching ${element} for changes`)
    })
  }

  const JR = {
    autoscroll,
    css,
    edit,
    html,
    include,
    intercept,
    js,
    pause,
    play,
    query,
    watch,
  }

  if (window.JR) {
    console.log('😾 JR variable is already taken')
    window['jr.codes'] = JR
    console.log("🐱 window['jr.codes'] is loaded")
  } else {
    window.JR = JR
    console.log('😺 JR is loaded')
  }
}
