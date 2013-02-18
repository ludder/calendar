/*global define*/
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
