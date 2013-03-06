/*! daterangepicker - v0.1.0 - 2013-03-06 */define(function () {
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

define([
    'lib/jquery', 
    'js/sb-datepicker.utils', 
    'js/sb-datepicker.model', 
    'js/sb-datepicker.view'
], function ($, $utils, Model, View) {

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

define(function() {

    // returns date of tomorrow
    function nextDayDate(date) {
        return new Date(date.getYear(), date.getMonth(), date.getDate() + 1);
    }

    // get first date of month
    function firstOfMonthDate(date) {
        return new Date(date.setDate(1));
    }

    /* find first day index in week
     * @param {Date} date
     * @return {number} index [0-6] of day in week
     */
    function firstOfMonthWeekday(date) {
        return firstOfMonthDate(date).getDay();
    }

    /* find last day in month and weekindex of last date
     * @param {date} date in month
     * @return {object}
     *      {number} date last day of month [0-30]
     *      {number} weekindex of last day [0-6]
     */
    function lastOfMonth(date) {
        var last = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        return {
            date    : last.getDate(),
            weekday : last.getDay()
        };
    }

    function yesterday(date) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1);
    }

    return {
        nextDayDate         : nextDayDate,
        firstOfMonthDate    : firstOfMonthDate,
        firstOfMonthWeekday : firstOfMonthWeekday,
        lastOfMonth         : lastOfMonth,
        yesterday           : yesterday
    };

});

define(['js/sb-datepicker.controller'], function (Controller) {
    return {
        init : function (options) {
            return Controller.init(options);
        }
    };
});

define([
    'lib/jquery', 
    'js/sb-datepicker.utils',
    'js/sb-datepicker.date'
], function ($, $utils, $date) {

    // constants
    var AY_MS = 1000 * 60 * 60 * 24,
        today = new Date().setHours(0),
        defaults = {
            range           : 1,
            startDate       : today,
            minDate         : today,
            maxDate         : new Date(2100, 1, 1)
        },
        // local reference to util functions
        compose = $utils.compose,

        // local reference to date functions
        nextDayDate = $date.nextDayDate,
        firstOfMonthWeekday = $date.firstOfMonthWeekday,
        lastOfMonth = $date.lastOfMonth,
        yesterday = $date.yesterday;


    /* @constructor
     * @param {date} date of calendar start date
     */
    function Model(options) {

        // update user options in default object
        this.options = $.extend({}, defaults, options);

        this.today = today;

        // holds array of current days
        this.days = [];

    }

    // is date in last month
    function isInLastMonth(newDate, formerDate) {
        return (new Date(formerDate.getYear(), formerDate.getMonth()) < new Date(newDate.getYear(), newDate.getMonth()));
    }


    Model.prototype = {

        // get last day of this.days array
        getLastDay : function () {
            var len = this.days.length;
            return (len && this.days[len - 1]);
        },

        // find out if date is in range of optional min and max
        isInRange : function (date) {
            return (date > this.options.minDate && date < this.options.maxDate);
        },

        isDisabled : function (date) {
            return (date < this.today || date > this.maxDate);
        },

        isFirstWeek : function (date) {
            return (date.getDate() <= 7);
        },

        /* create day model
        * @param {date} date object
        */
        addDay : function (date) {
            return {
                "date"          : date,
                "selectable"    : this.isInRange(date),
                "disabled"      : this.isDisabled(date),
                "firstweek"     : this.isFirstWeek(date)
            };
        },

        // partial day model
        createAddDay : function (date) {
            var self = this,
                year = date.getFullYear(),
                month = date.getMonth(),
                mDate = date.getDate();
            return function (index) {
                return self.addDay(new Date(year, month, mDate + index));            
            };
        },

        /* fill up month in grid after current month
        * @param {date} date of month
        * @return {array} array of days after this month to fill up grid
        */
        getPostMonth : function (date) {
            var lastdate = lastOfMonth(date),
                last = lastdate.weektday,
                postFillDays = 6 - last,
                nextMonth = new Date(date.getFullYear(), date.getMonth() + 1);

            return (compose(postFillDays, this.createAddDay(nextMonth)));
        },

        /* fill up month in grid before current month
        * @param {date} date of month
        * @return {array} array of days before this month to fill up grid
        */
        getPreMonth : function (date) {
            var prefillDays = firstOfMonthWeekday(date); // number of days this week in last month
            return (compose(prefillDays, this.createAddDay(yesterday(date)), -1));
        },

        /* push previous month days in first week to this.days */
        addPreMonth : function (date) {
            this.days = this.days.concat(this.getPreMonth(date));
        },

        // add fill up days after this month in last week
        addPostMonth : function (date) {
            if (!date) {
                date = this.getLastDay().date;
            }
            this.days = this.days.concat(this.getPostMonth(date));
        },


        /* creates array of month days
        * @param {date} minDate to start selectable
        * @param {date} maxDate to end range with
        * @return {Array} month days array
        */
        createMonthDays : function (date) {
            var nrMonthDays = lastOfMonth(date).date;
            return compose(nrMonthDays, this.createAddDay(date));
        },

        // add all month days of [date] month to this.days
        addMonth : function (date) {
            this.days = this.days.concat(this.createMonthDays(date));
        },

        addNextMonth : function (date) {
            var curLen = this.days.length,
                last = this.days[curLen - 1];
            console.log(last);
        },

        createMonthRange : function () {
            var i,
                tmpDate,
                copyStart = new Date(this.options.startDate.getTime()),
                curMonth = copyStart.getMonth(),
                loops = this.options.range;

            this.addPreMonth(copyStart);

            for (i = 0; i < loops; i += 1) {
                tmpDate = new Date(copyStart.setMonth(curMonth + i));
                this.addMonth(tmpDate);
            }

            this.addPostMonth(copyStart);

            return this.days;
        },

        appendMonthRange : function (nrMonths) {
            
        }



    };

    return Model;

});

define(function () {
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

define(['lib/jquery'], function ($) {

    var classNames = {
            wrapper : 'dp-datepicker',
            ul      : 'dp',
            year    : 'dp-year',
            month   : 'dp-month',
            weekDays: 'dp-wdays',

            selectable : 'dp-selectable',
            disabled    : 'dp-disabled',
            firstweek   : 'dp-firstweek',

            selectedFirst : 'dp-selected-start',
            range           : 'dp-mo-range'
        },
    
        templates = {
            day : '<li><a data-msdate="${msdate}" href="#" class="${selectable} ${disabled} ${firstweek}">${date}</a></li>',

            month : '<span class="' + classNames.month + '">${month}</span>',

            weekDays : '<div class="' + classNames.weekDays + '">' +
                        '<span>S</span><span>M</span><span>T</span><span>W</span>' +
                        '<span>T</span><span>F</span><span>S</span>' +
                        '</div>',

            year : '<div class="' + classNames.year + '">${year}</div>',

            wrapper : '<div class="' + classNames.wrapper + '">${datepicker}</div>'
        },
        templReg = /\$\{(\w+)\}/gim,
        defaults = {
            shortMonths : ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sept', 'oct', 'nov', 'dec']
        };

    function View(options) {

        this.months = options.months || defaults.shortMonths;

        this.$container = typeof options.containerId === 'string' ? 
                $('#' + options.containerId) : 
                $('body');

        this.$result = $('#' + options.resultId);
    }

    View.prototype = {

        wrap : function (html) {
            return templates.wrapper.replace(templReg, html);
        },

        renderWeekDays : function () {
            return templates.weekDays;
        },

        renderYear : function (date) {
            date = date || new Date();

            var year = date.getFullYear();

            return templates.year.replace(templReg, year);
        },

        renderMonth : function (monthIndex) {
            return templates.month.replace(templReg, this.months[monthIndex]);
        },

        renderDay : function (day, s) {
            var prop = day[s],
                tmpDate = (prop && typeof prop.getDate === 'function') && prop.getDate(),
                month = tmpDate && prop.getMonth();

            switch (s) {
            case 'date':
                return (tmpDate === 1 ? this.renderMonth(month) + ' ' + tmpDate : tmpDate);
            case 'msdate':
                return day.date.getTime();
            case 'selectable':
                return (prop && classNames[s] || '');
            case 'disabled':
                return (prop && classNames[s] || '');
            case 'firstweek':
                return (prop && classNames[s] || '');
            default:
                return prop;
            }

        },

        createRenderDay : function (date) {
            var self = this;
            return function (m, s) {
                return self.renderDay(date, s);
            };
        },

        render : function (days) {
            var self = this,
                html = this.renderYear(days[0] && days[0].date),
                monthArr = days;


            // render days header
            html += this.renderWeekDays();

            // month days
            html += '<ul class="' + classNames.ul + '">';

            monthArr.forEach(function (date) {
                html += templates.day.replace(templReg, self.createRenderDay(date));
            });

            html += '</ul>';

            this.$container.html(this.wrap(html));

            this.$datepicker = this.$container.find('.' + classNames.wrapper).eq(0);

            return this.$datepicker;

        },

        initEvents : function () {
            var self = this;
            // 
            this.$datepicker.on('click', '.' + classNames.selectable, function (e) {
                var $nexts;
                e.preventDefault();

                // oops, should be much more elegant..., but hey it's a start ;-)
                if (!self.$selectedStart) {
                    self.$selectedStart = $(this.parentNode);
                    self.$selectedStart.addClass(classNames.selectedFirst);

                    $nexts = $(this.parentNode).nextAll(); //':not(.' + classNames.selectable + ')'),

                    $nexts.on('mouseenter mouseleave', '.' + classNames.selectable, function (e) {
                        var event = e.type,
                            $prev = $(this.parentNode).prevUntil(self.$selectedStart),
                            len = $prev.length;


                        if (event === 'mouseleave') {
                            $prev.removeClass(classNames.range);

                        } else if (event === 'mouseenter') {
                            while (len--) {

                                if ($prev[0] !== this.parentNode) {
                                    $prev.eq(len).addClass(classNames.range);
                                } else {
                                    break;
                                }
                            }

                        }

                    });



                    // print selected date somewhere, until better implemented
                    self.$result.html(new Date(parseInt(e.target.getAttribute('data-msdate'), 10))); 
                }
            });


            this.$datepicker.on('click', '.' + classNames.month, function (e) {
                
            });
        }
    };

    return View;

});
