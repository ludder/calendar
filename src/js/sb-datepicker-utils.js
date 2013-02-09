/*global define*/
define(function () {
    function debug() {
        if (window.console) {
            console.log(arguments);
        }
    }

    return {
        debug : debug
    };
});
