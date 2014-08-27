// ==UserScript==
// @name        Trello Card Styler
// @namespace   http://openuserjs.org/users/zarjay/scripts
// @author      zarjay
// @version     1.0.4
// @description Uses textual markers to style Trello cards
// @match       https://trello.com/*
// @license     MIT License; https://github.com/zarjay/userscripts/blob/master/LICENSE
// ==/UserScript==

function headerStyle(o) {
    var style = {
        'color': '#fff',
        'font-weight': 'bold',
        'font-size': '1.2em',
        'letter-spacing': '1px',
        'line-height': '1.2em',
        'padding-left': '0.5em',
        'text-shadow': '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
        'text-align': 'center'
    };
    
    o.title.css(style);
}

function boldStyle(o) {
    var style = {
        'color': '#fff',
        'font-weight': 'bold',
        'text-shadow': '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
	};
    
    o.title.css(style);
    
    var percent = (o.matches && o.matches.length > 1 ? o.matches[1] : '100') + '%';
    
    o.card.css('background-image', 'linear-gradient(to right, ' + o.colors[0] + ' ' + percent + ', #ddd ' + percent + ')');
}

function styleCards(marker, removeMarker, fn) {
    var cards = $('.list-card').filter(function() { return marker.test(this.innerHTML); });
    
    cards.each(function() {
        var card = $(this);
        var title = card.find('.list-card-title');
        var matches = title.html().match(marker);
        
        if (removeMarker) {
            title.html(title.html().replace(marker, ''));
        }
        
        var colors = card.find('.card-label').css('visibility','hidden').map(function() {
            return $(this).css('background-color');
        }).get();
        
        card.css('background-color', colors[0]);
        
        fn({
            card: card,
            title: title,
            colors: colors,
            matches: matches
        });
    });    
}

function init() {
    // Add styling to cards with "::"
    styleCards(/::/m, true, headerStyle);
    // Add styling to cards with "Epic ##"
    styleCards(/Epic\s?(\d*):\s?/m, true, boldStyle);
}

// Wait a while so Trello can load
// TODO: Consider using Mutation Observers instead
setTimeout(init, 2000);
