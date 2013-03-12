/* globals asyncTest,deepEqual,equal,expect,module,notDeepEqual,notEqual,notStrictEqual,ok,QUnit,raises,start,stop,strictEqual,test */

QUnit.config.autostart = false;

require(['js/g-datepicker.date'], function ($date) {

    'use strict';

    QUnit.start();

    module("testing date utils");

    var day1 = new Date(2013, 1, 16),
        day2 = new Date(2013, 2, 30),
        day3 = new Date(2013, 1, 28);

    test("next day", function () {

        var day1day = day1.getDate(),
            day2day = day2.getDate(),
            day3day = day3.getDate();

        equal($date.nextDayDate(day1).getDate(), day1day + 1, "next day, 17");
        equal($date.nextDayDate(day2).getDate(), day2day + 1, "expect last day of march, 13");
        equal($date.nextDayDate(day3).getDate(), 1, "next day, expected first of next month");

    });

    test("firstDate", function () {

        equal($date.firstOfMonthDate(day1).getTime(), new Date(2013, 1, 1).getTime(), "date of first date in month");
        equal($date.firstOfMonthDate(day2).getTime(), new Date(2013, 2, 1).getTime(), "date of first date in month");

    });

    test("firstOfMonthWeekday", function () {

        equal($date.firstOfMonthWeekday(day1), 5, 'weekday index of 2013-02-15');
        equal($date.firstOfMonthWeekday(day2), 5, 'weekday index of 2013-03-15');
        equal($date.firstOfMonthWeekday(new Date(2013, 11, 8)), 0,'weekday index of 2013-03-15');
    });


    test("lastOfMonth", function () {

        var t1 = $date.lastOfMonth(day1),
            t2 = $date.lastOfMonth(day2);

        equal(t1.date, 28, 'last date of month');
        equal(t1.weekday, 4, 'last weekday index of month');

        equal(t2.date, 31, 'weekday index of last day of februari 2013');
        equal(t2.weekday, 0,'weekday index of last day of februari 2013');

    });

    test("yesterday", function () {

        equal($date.yesterday(new Date(2013, 11, 10)).getDate(), 9, "the day before the 9th of december");
        equal($date.yesterday(new Date(2013, 11, 1)).getDate(), 30, "the day before the 1st of december");
        equal($date.yesterday(new Date(2013, 0, 1)).getDate(), 31, "the day before the 1st of januari");

    });
});



