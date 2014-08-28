// ==UserScript==
// @name        Mint Utils
// @namespace   http://openuserjs.org/users/zarjay/scripts
// @author      zarjay
// @version     1.0.1
// @description Library of Mint.com-specific functions runnable from the browser console.
// @match       https://wwws.mint.com/*
// @license     MIT License; https://github.com/zarjay/userscripts/blob/master/LICENSE
// ==/UserScript==


/**
    Injects u library onto the page so
    it can be run from the browser console.
*/
function main() {
    /** Formats value into money format. */
    function format(money) {
        money = money.toFixed(2);
        money = money.replace(/(\d)(?=(\d{3})+\.)/g,'$1,');
        money = '$' + money;
        return money;
    };
    
    
    var u = {};

    /** Returns an array of dates on the transaction page. */
    u.dates = function() {
        var mmmdd = /\w+\s+\d+/;
        var mmddyy = /\d+\/\d+\/\d+/;
        
        return jQuery('#transaction-list-body tr:not(.hide) .date').map(function() {
            var date = this.innerText;

            if (mmmdd.test(date)) {
                date = date.split(/\s+/);
                return moment().month(date[0]).date(date[1]);
            } else if (mmddyy.test(date)) {
                return moment(date);
            } else {
                throw new Error("Userscript: Can't parse date: " + date);
            }
        }).get();
    };

    u.values = function() {
        return jQuery('#transaction-list-body tr:not(.hide) .money').map(function() {
            return this.innerText.replace('–','-').replace(/[^\d.-]/g,'')
        }).get();
    };

    /** Returns the sum of the values on the transaction page. */
    u.sum = function(values, formatResult) {
        values = values || this.values();
        var result = values.reduce(function(a, b) { return +a + +b; }, 0);
        
        if (typeof formatResult === 'undefined' || formatResult) {
            result = format(result);
        }
        
        return result;
    };
    
    /** Returns the average of the values on the transaction page. */
    u.average = function(values) {
        values = values || this.values();
        return format(this.sum(values, false) / values.length);
    };
    
    /** Returns the max value on the transaction page. */
    u.max = function(values) {
        values = values || this.values();
        return format(Math.max.apply(null, values));
    };
    
    /** returns the min value on the transaction page. */
    u.min = function(values) {
        values = values || this.values();
        return format(Math.min.apply(null, values));
    };
    
    /** Returns an object of calculations from the transaction page. */
    u.stats = function() {
        return {
            sum: this.sum(),
            average: this.average(),
            min: this.min(),
            max: this.max()
        }
    };

    /**
        Adds a <link> or <script> to the page
        and returns a promise that resolves when loaded.
    */
    u.include = function(url, type) {
        // Get type or assume from file extension
        type = (type || url.split('.').pop()).toLowerCase();

        return new Promise(function(resolve, reject) {
            var elem;

            if (type === 'css') {
                elem = document.createElement('link');
                elem.rel = 'stylesheet';
                elem.onload = resolve;
                elem.href = url;
            } else if (type === 'js') {
                elem = document.createElement('script');
                elem.async = false;
                elem.onload = resolve;
                elem.src = url;
            } else {
                reject(new Error('Userscript: Failed to include ' + url + ' due to  unknown file type'));
            }

            document.head.appendChild(elem);
        });
    };

    if (window.u) {
        console.warn('Userscript: u variable is taken!');
    } else {
        // Load moment.js library
        u.include('//cdnjs.cloudflare.com/ajax/libs/moment.js/2.8.2/moment.min.js').then(function() {
            window.u = u;
            console.log('Userscript: u is loaded.');
        });
    }

}


function exec(fn) {
    var script = document.createElement('script');
    script.textContent = '(' + fn + ')();';
    document.head.appendChild(script);
}

// Inject function into the page.
exec(main);
