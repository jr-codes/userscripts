JR's Utils
=============
Set of functions runnable in the [browser console](http://webmasters.stackexchange.com/questions/8525/how-to-open-the-javascript-console-in-different-browsers) (e.g., Chrome DevTools) for playing around with webpages.


API
---

### JR.autoscroll([speed], [increment])
Automatically scrolls down the page.

```js
JR.autoscroll()
```

### JR.css(content)
Injects CSS onto the page.

```js
JR.css('div.ads { display: none; }')
```

### JR.edit([canEdit])
Makes the page editable or non-editable. If `canEdit` is not specified, page editability toggles with each function call.

```js
JR.edit() 		// page is editable
JR.edit() 		// page is not editable
JR.edit(false); // page is not editable
```

### JR.hide([target])
Applies `display: none` to the given target.

```js
JR.hide('.overlay, .banner')
```

### JR.html(html[, position])
Appends HTML onto the `body` of the page. You can specify a `position` of `afterbegin` to prepend it onto the `body`. (This method uses [insertAdjacentHTML](https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML) internally.)

```js
JR.html('<div style="color: green">Hello</div>', 'afterbegin')

JR.html('<div>Goodbye</div>')
```

### JR.include(asset[, type])
Includes a CSS or JS file onto the page.

If `asset` is a URL, the file will be included directly. The file's extension (`.css` or `.js`) is used to determine what type of file it is. Otherwise, pass in `css` or `js` as the second parameter.

If `asset` is not a name, the script will search [cdnjs.com](https://cdnjs.com/) and use the first JS file that matches.

A promise is returned that resolves when the file has finished loading.

```js
JR.include('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css')

JR.include('https://code.jquery.com/jquery-3.1.0.min.js').then(() => console.log($('body').text()))

JR.include('http://example.com/myscript.php', 'js')

JR.include('moment').then(() => console.log(moment().format()))

// Instead of using the promise, you can include it and use the library
// directly after that. Unless the web server hosting your library is
// extremely slow, the file should be loaded by the time you enter
// your next command.
JR.include('d3')
d3.select('svg')
```

### JR.intercept([target], [events])
Blocks annoying event listeners on the page with a capture event listener. Here are some examples where this method is useful:

```js
// Many quotation and lyric websites hijack the copy event and inject
// extra text into whatever you copy. Use `intercept` on the whole page
// to prevent that from happening.
JR.intercept()

// Some websites prevent right-clicking on images. Use `intercept` to
// prevent right-click from being blocked.
JR.intercept()
// or
JR.intercept('img')

// Some websites prevent text from being pasted into forms
// (text fields, password fields, etc.). Use `intercept` to prevent
// your paste from being blocked.
JR.intercept('form')

// Specify an array as a second parameter to specify which events to intercept.
// If a second parameter isn't specified, these events will be intercepted:
// 'copy', 'keydown', 'keypress', 'keyup' 'mousedown', 'mouseup', 'paste', 'selectstart'
JR.intercept('div, span', ['click', 'mousemove'])
```

### JR.js(content[, isImmediate])
Injects JS onto the page. You can already add JS in the browser console, so this isn't very useful unless you have some text you want evaluated into JavaScript the page and you don't want to use `eval()`.

```js
JR.js('alert("hi")')
JR.js(`JR.js('alert("hi")')`)
```


### JR.pause([target])
Pauses all `video` and `audio` elements on the page. Use `target` to specify what to pause.

```js
JR.pause() // pause everything

JR.pause('video') // only pause videos

JR.pause('.ads') // pause specific elements
```

### JR.play([target])
Plays the first `video` or `audio` element found on a page. Use `target` to specify what to play.

```js
JR.play() // play the first <video> or <audio> found
JR.play('#video-247') // play a specific element
```

### JR.query(target)
Works kinda like jQuery's `$()`, but uses `querySelectorAll()` under the hood (and returns a true array, not a NodeList). Returns an array of DOM elements.

If `target` is a string selector, `querySelectorAll` is called and turned into an array.
If `target` is a Node element or NodeList or HTMLCollection, the input is transformed into an array of elements and returned.

```js
// Everything returns an array
JR.query('.article')
JR.query($0)
JR.query(myElement)
JR.query(document.body)
JR.query(document.querySelectorAll('div, span'))
JR.query(document.getElementById('test'))
```
### JR.watch(target, onChange)
Runs `onChange` when any changes to `target` occur. Uses mutation observers to watch the given target and its descendants.

```js
JR.watch('.overlay, .modal', () => JR.hide('.overlay, .modal'))
```
