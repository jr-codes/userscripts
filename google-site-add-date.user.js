// ==UserScript==
// @name        Google Sites - Add Date to New Posts
// @namespace   http://openuserjs.org/users/zarjay/scripts
// @version     1.0.0
// @description When a new Google Site post is created, "Untitled Post" is replaced with today's date.
// @match       https://sites.google.com/*
// @require     https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.8.2/moment.min.js
// @license     MIT License; https://github.com/zarjay/userscripts/blob/master/LICENSE
// ==/UserScript==

function updateTitle() {
    var input = document.querySelector('#sites-page-title-header input');
    if (!input) return;
    
    if (input.value === 'Untitled Post') {
        input.value = moment().format('MM/DD/YY') + ' - ';
        input.focus();
    }
}

// Takes a while for Google to load the input tag
setTimeout(updateTitle, 1000);
