/*global define */
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
        lastOfMonth = $date.lastOfMonth;


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

        /* create day model
        * @param {date} date object
        */
        addDay : function (date) {
            return {
                "date"          : date,
                "selectable"    : this.isInRange(date),
                "disabled"      : this.isDisabled(date)
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
                last = lastdate.day,
                postFillDays = 6 - last,
                nextMonth = new Date(date.getFullYear(), date.getMonth() + 1);

            return (compose(postFillDays, this.createAddDay(nextMonth)));
        },

        /* fill up month in grid before current month
        * @param {date} date of month
        * @return {array} array of days before this month to fill up grid
        */
        getPreMonth : function (date) {
            var prefillDays = firstOfMonthWeekday(date) + 1; // number of days this week in last month
            return (compose(prefillDays, this.createAddDay(date), -1));
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
            var month       = date.getMonth(),
                year        = date.getFullYear(),
                nrMonthDays = lastOfMonth(date).date + 1,
                daysLen     = this.days.length,
                startDay = 1,
                start,
                last;
/*
            if (daysLen) {
                last = this.days[daysLen - 1].date;
                console.log(isInLastMonth(date, last));
                startDay = isInLastMonth(date, last) ? startDay : last.getDate();
                nrMonthDays  = startDay === 1 ? nrMonthDays : startDay;
            } 
*/
            start = new Date(year, month, date.getDate());

            return compose(nrMonthDays, this.createAddDay(start));
        },

        // add all month days of [date] month to this.days
        addMonth : function (date) {
            if (!date) {
                date = nextDayDate(this.getLastDay().date);
            }
            this.days = this.days.concat(this.createMonthDays(date));
        },

        addNextMonth : function (date) {
            var curLen = this.days.length,
                last = this.days[curLen - 1];
            console.log(last);
        },

        // create full range of days in certain period
        createMonthRange : function () {
            var i,
                tmpDate,
                copyStart = new Date(this.options.startDate.getTime()),
                curMonth = copyStart.getMonth();

            this.addPreMonth(copyStart);
            this.addMonth(copyStart);

            for (i = 1; i < this.options.range; i += 1) {
                tmpDate = new Date(copyStart.setMonth(curMonth += 1));
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
