// ==UserScript==
// @name        Citi Utils
// @namespace   http://openuserjs.org/users/zarjay/scripts
// @author      zarjay
// @version     1.0.0
// @description Library of Citi-specific functions runnable from the browser console.
// @match       https://online.citibank.com/*
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
    }

    var u = {};
 
    /** Removes rows that don't fall within date range (endDate is optional). */
    u.filter = function(start, end) {
        start = Date.parse(start);
        end = (typeof end === undefined) ? Infinity : Date.parse(end);
        
        jQuery('#postedTansactionTable tbody tr').filter(function() {
            var date = Date.parse(this.querySelector('.cT-bodyTableColumn1 .cT-line1').textContent);
            console.log(date, start, end);
            return date < start || end < date;
        }).remove();
    };
    
    /** Returns an array of transaction values */
    u.values = function() {
        return jQuery('#postedTansactionTable .cM-numberCell').map(function() {
            return this.textContent.replace('–','-').replace(/[^\d.-]/g,'');
        }).get();
    };
    
    /** Returns the sum of transaction values */
    u.sum = function(values, formatResult) {
        values = values || this.values();
        var result = values.reduce(function(a, b) { return +a + +b; }, 0);
        
        if (typeof formatResult === 'undefined' || formatResult) {
            result = format(result);
        }
        
        return result;
    };
    
    /** Returns the average transaction value */
    u.average = function(values) {
        values = values || this.values();
        return format(this.sum(values, false) / values.length);
    };
    
    /** Returns the highest transaction value */
    u.max = function(values) {
        values = values || this.values();
        return format(Math.max.apply(null, values));
    };
    
    /** Returns the lowest transaction value */
    u.min = function(values) {
        values = values || this.values();
        return format(Math.min.apply(null, values));
    };
    
    /** */
    u.stats = function() {
        return {
            sum: u.sum(),
            average: u.average(),
            min: u.min(),
            max: u.max()
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
        window.u = u;
        console.log('Userscript: u is loaded.');
    }
 
}
 
 
function exec(fn) {
    var script = document.createElement('script');
    script.textContent = '(' + fn + ')();';
    document.head.appendChild(script);
}
 
// Inject function into the page.
exec(main);
