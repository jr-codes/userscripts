JR's Utils
=============
Set of functions runnable in the [browser console](http://webmasters.stackexchange.com/questions/8525/how-to-open-the-javascript-console-in-different-browsers) (e.g., Chrome DevTools) for playing around with webpages.


API
---

### jr.copyJS(js)
Copies JavaScript to the clipboard.

```js
const obj = {
	name: 'Joe',
	value: 30
};

jr.copyJS(obj);

/* returns
{
	name: 'Joe',
	value: 30
}
*/


function func(a, b) {
	return a + b;
}

jr.copyJS(func);

/* returns
function func(a, b) {
	return a + b;
}
*/
```

### jr.copyJSON(js)
Copies JSON to the clipboard.

```js
const obj = {
	name: 'Joe',
	value: 30
};

jr.copyJSON(obj);

/* returns
{
	"name": "Joe",
	"value": 30
}
*/
```

### jr.css(content)
Injects CSS onto the page.

```js
jr.css('div.ads { display: none; }');
```

### jr.edit([canEdit])
Makes the page editable. Set `canEdit` to false to make it non-editable.

```js
jr.edit(); // page is now editable
jr.edit(false); // revert back
```

### jr.frequency(...values)
Returns a count of how often values appear from the specified values.

```js
jr.frequency('apple', 'apple', 'orange', 'banana', 'orange', 'grapefruit');
// returns {apple: 2, orange: 2, banana: 1, grapefruit: 1}

const numbers = [4, 7, 7, 3, 4, 8];
jr.frequency(...numbers);
// returns {3: 1, 4: 2, 7: 2, 8: 1}
```

### jr.html(html[, position])
Appends HTML onto the `body` of the page. You can specify a `position` of `afterbegin` to prepend it onto the `body`. (This method uses [insertAdjacentHTML](https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML) internally.)

```js
jr.html('<div style="color: green">Hello</div>', 'afterbegin');

jr.html('<div>Goodbye</div>');
```

### jr.include(asset[, type])
Includes a CSS or JS file onto the page.

If `asset` is a URL, the file will be included directly. The file's extension (`.css` or `.js`) is used to determine what type of file it is. Otherwise, pass in `css` or `js` as the second parameter.

If `asset` is not a name, the script will search [cdnjs.com](https://cdnjs.com/) and use the first JS file that matches.

A promise is returned that resolves when the file has finished loading.

```js
jr.include('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css');

jr.include('https://code.jquery.com/jquery-3.1.0.min.js').then(() => console.log($('body').text()));

jr.include('http://example.com/myscript.php', 'js');

jr.include('moment').then(() => console.log(moment().format()));

// Instead of using the promise, you can include it and use the library
// directly after that. Unless the web server hosting your library is
// extremely slow, the file should be loaded by the time you enter
// your next command.
jr.include('d3');
d3.select('svg');
```

### jr.intercept([target], [events])
Block annoying event listeners on the page with a capture event listener. Here are some examples where this method is useful:

```js
// Many quotation and lyric websites hijack the copy event and inject
// extra text into whatever you copy. Use `intercept` on the whole page
// to prevent that from happening.
jr.intercept();

// Some websites prevent right-clicking on images. Use `intercept` to
// prevent right-click from being blocked.
jr.intercept(); // or jr.intercept('img');

// Some websites prevent text from being pasted into forms
// (text fields, password fields, etc.). Use `intercept` to prevent
// your paste from being blocked.
jr.intercept('form');

// Specify an array as a second parameter to specify which events to intercept.
// If a second parameter isn't specified, these events will be intercepted:
// ['contextmenu', 'copy', 'keydown', 'keypress', 'keyup', 'mousedown', 'mouseup', 'paste', 'selectstart']
jr.intercept('div, span', ['click', 'mousemove'])
```

### jr.js(content[, isImmediate])
Injects JS onto the page. You can already add JS in the browser console, so this isn't very useful unless you have some text you want evaluated into JavaScript the page and you don't want to use `eval()`.

```js
jr.js('alert("hi")');
jr.js(`jr.js('alert("hi")')`);
```

### jr.mean(...values)
Returns the [average](https://en.wikipedia.org/wiki/Arithmetic_mean) of `values`.

```js
jr.mean(90, 95, 98, 97, 94); // returns 94.8

const numbers = [4, 7, 7, 3, 4, 8];
jr.mean(...numbers); // returns 5.5
```

### jr.median(...values)
Returns the [median](https://en.wikipedia.org/wiki/Median) of `values`.

```js
jr.median(90, 95, 98, 97, 94); // returns 95

const numbers = [1, 2, 3, 4, 5, 6, 8, 9];
jr.median(...numbers); // returns 4.5
```

### jr.mode(...values)
Returns the [mode](https://en.wikipedia.org/wiki/Mode_(statistics)) of `values`. An array is always returned, since a set of values can have multiple modes.

```js
jr.mode(1, 3, 6, 6, 6, 6, 7, 7, 12, 12, 17); // returns [6]

const numbers = [1, 1, 2, 4, 4];
jr.mode(...numbers); // returns [1, 4]

jr.mode(1, 2, 3); // return [], since there is no mode
```

### jr.pause([target])
Pauses all `video` and `audio` elements on the page. Use `target` to specify what to pause.

```js
jr.pause(); // pause everything

jr.pause('video'); // only pause videos

jr.pause('.ads'); // pause specific elements
```

### jr.play([target])
Plays the first `video` or `audio` element found on a page. Use `target` to specify what to play.

```js
jr.play(); // play the first <video> or <audio> found
jr.play('#video-247'); // play a specific element
```

### jr.query(target)
Works kinda like jQuery's `$()`, but uses `querySelectorAll()` under the hood (and returns a true array, not a NodeList). Returns an array of DOM elements.

If `target` is a string selector, `querySelectorAll` is called and turned into an array.
If `target` is a Node element or NodeList or HTMLCollection, the input is transformed into an array of elements and returned.

```js
// Everything returns an array
jr.query('.article');
jr.query($0);
jr.query(myElement);
jr.query(document.body);
jr.query(document.querySelectorAll('div, span'));
jr.query(document.getElementById('test'));
```

### jr.sum(...values)
Returns the sum of `values`.

```js
jr.sum(90, 95, 98, 97, 94); // returns 474

const numbers = [4, 7, 7, 3, 4, 8];
jr.sum(...numbers); // returns 33
```
### jr.unique(...values)
Returns an array with duplicate values removed.

```js
jr.unique(1, 1, 2, 1, 7, 4, 4, 3); // returns [1, 2, 7, 4, 3]

const numbers = [4, 7, 7, 3, 4, 8];
jr.unique(...numbers); // [4, 7, 3, 8]
```

