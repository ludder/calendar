/*global define*/
define(function () {

    'use strict';

    function debug() {
        if (window.console) {
            console.log(arguments);
        }
    }

    /* compose array after calling function x times, inserting x as argument, in both directions
     *
     * @param {number} nr of repeats
     * @param {function} callback function to call on each item
     * @param {number} direction [optional] defaults to 1, -1 will count backwards,
     *      but returning array in order from small to big
     * @return {array} with modified parts
     */
    function compose(nr, callback, direction) {
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
        compose : compose
    };

});
