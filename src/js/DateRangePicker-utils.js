/*global define*/
define(function () {

    'use strict';

    function debug() {
        if (window.console) {
            console.log(arguments);
        }
    }

    /* loop array, in both directions
     * @param {number} nr of loops
     * @param {function} callback function to call on each item
     * @param {number} direction [optional] defaults to 1, -1 will reverse direction
     * @return {array} with modified parts
     */
    function loop(nr, callback, direction) {
        var i,
            arr = [];

        direction = direction || 1;


        for (i = 0; i < nr; i += 1) {
            arr.push(callback(direction * i));
        }
        return (direction < 0 ? arr.reverse() : arr);
    }

    return {
        debug   : debug,
        loop    : loop
    };

});
