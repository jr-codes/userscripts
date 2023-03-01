// ==UserScript==
// @name        Jenkins Console Colors
// @namespace   http://jr.codes
// @author      JR
// @version     2.0.1
// @description Adds colors to the Jenkins console output
// @match       http://*/*/job/*/console*
// @match       https://*/*/job/*/console*
// @license     MIT License; https://github.com/jr-codes/userscripts/blob/main/LICENSE
// ==/UserScript==

function css(content) {
  const element = document.createElement('style')
  element.textContent = content
  document.head.appendChild(element)
}

function getType(line) {
  const markers = {
    error: [
      /\d Error/,
      /FAILED/,
      / error /,
      /^ERROR:/,
      /^Failed/,
      /[^0] failed/,
      /Finished: FAILURE/,
    ],

    warning: [/\d Warning/, /\[SKIP]/],

    success: [/^Passed/, / 0 failed/, /Build succeeded/, /Finished: SUCCESS/],

    important: [
      /xUnit\.net console test runner/,
      /Test Execution Command Line Tool/,
      /Build Engine/,
      / 0 (Warning|Error)/,
      /^Build started/,
    ],

    normal: [/^\s*\d+&gt;/],
  }

  for (const type in markers) {
    for (const pattern of markers[type]) {
      if (pattern.test(line)) {
        return type
      }
    }
  }

  return 'minor'
}

function include(url) {
  return new Promise((resolve, reject) => {
    const element = document.createElement('script')
    element.src = url
    element.async = false
    element.onload = resolve
    element.onerror = reject
    document.head.appendChild(element)
  })
}

function parseBlock(block) {
  console.log('Processing text block', block)
  block.classList.add('parsed')

  const lines = block.innerHTML.split('\n')
  const html = []
  let currentLine = 0

  ;(function parseChunk() {
    for (let i = 0; i < 20; ++i, ++currentLine) {
      if (currentLine >= lines.length) {
        block.innerHTML = html.join('')
        return
      }

      const line = lines[currentLine]
      const match = /^(\s*)(.*)/.exec(line)
      const className = `userscript-console-${getType(line)}`
      const spaces = '&nbsp'.repeat(match[1].length)
      const content = ansi_up.ansi_to_html(match[2])

      html.push(`<div class="${className}">${spaces}${content}</div>`)
    }

    setTimeout(parseChunk, 0)
  })()
}

function parseBlocks() {
  query('pre.console-output:not(.parsed), #out pre:not(.parsed)').forEach(
    parseBlock
  )
}

function query(selector) {
  return Array.from(document.querySelectorAll(selector))
}

css(`
    .userscript-console-minor { color: #666 }
    .userscript-console-normal { color: #000 }
    .userscript-console-important { color: #08C }
    .userscript-console-success { color: #080 }
    .userscript-console-warning { color: #F0F }
    .userscript-console-error { color: #F00 }
`)

include(
  'https://cdn.rawgit.com/drudru/ansi_up/32a3c2deb983579fe6149fba4938ce0f840d2afd/ansi_up.js'
).then(() => setInterval(parseBlocks, 200))
