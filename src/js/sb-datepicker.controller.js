/*global define */
define([
    'lib/jquery',
    'js/sb-datepicker.utils',
    'js/sb-datepicker.model',
    'js/sb-datepicker.view'
], function ($, $utils, Model, View) {

    "use strict";

    /* @Constructor Controller
     * @param {object} options
     */
    function Controller(options) {

        this.options = options;

        this.model = new Model(this.options);

        this.view = new View(this.options);

        this.days= [];
    }

    Controller.prototype = {

        init    : function () {
            this.createMonths();
            this.render();

            this.initEvents();
        },

        createMonths : function () {
            this.days = this.model.createMonthRange();
        },

        render : function () {
            this.view.render(this.days);
        },

        addMonth : function () {},

        refresh : function () {},

        destroy : function () {},

        initEvents : function () {
            this.view.initEvents();
        }

    };

    // create datepicker instance
    function init(options) {

        // check required start options object
        if (!$.isPlainObject(options)) {
            $utils.debug('invalid options object', options);
            return;
        }

        return new Controller(options).init();
    }

    return {
        init : init
    };

});
