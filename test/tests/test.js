/* globals asyncTest,deepEqual,equal,expect,module,notDeepEqual,notEqual,notStrictEqual,ok,QUnit,raises,start,stop,strictEqual,test */

QUnit.config.autostart = false;

require(['js/sb-datepicker.model'], function (Model) {

    'use strict';

    QUnit.start();

    function addDays(date, days) {
        return new Date( date.getTime() + (days * 86400000) );
    }

    var today = new Date(); // Today
    var maxDate = addDays(today, 340); // Today + 340 days

    // Relative model
    var modelRelative = new Model({
        minDate   : today,
        startDate : today,
        maxDate   : maxDate,
        range     : 2 // Extend current month to the end of next month
    });

    // Exact model, in the far future to not break tests
    var modelExact = new Model({
        minDate   : new Date(2023, 2, 10),
        startDate : new Date(2023, 2, 10),
        maxDate   : new Date(2023, 8, 10),
        range     : 3
    });


    module("Datepicker model - Public functions");

    test("function getLastDay()", function () {
        // ??
        equal(new Date(modelExact.getLastDay().date).getTime(), maxDate.getTime(), 'getLastDay should return April, 30, 2023');
    });

    test("function isInRange()", function () {
        // Exact model
        // Min date
        equal(modelExact.isInRange(new Date(2023, 2, 10)), true, 'March, 10 2023 should be in range');
        equal(modelExact.isInRange(new Date(2023, 2, 9)), false, 'March, 9 2023 should be out of range');
        // Max date
        equal(modelExact.isInRange(new Date(2023, 8, 10)), true, 'July, 10 2023 should be in range');
        equal(modelExact.isInRange(new Date(2023, 8, 11)), false, 'July, 11 2023 should be out of range');

        // Relative model
        // Min date
        equal(modelRelative.isInRange(today), true, 'Today should be in range');
        equal(modelRelative.isInRange(addDays(today, -1)), false, 'Yesterday should be out of range');
        // Max date
        var myMaxDate = new Date(maxDate.getTime());
        console.log('a', myMaxDate);
        console.log('c', myMaxDate);
        console.log('b', addDays(myMaxDate, 1));
        equal(modelRelative.isInRange(myMaxDate), true, 'maxDate should be in range');
        equal(modelRelative.isInRange(addDays(myMaxDate, 1)), false, 'maxDate +1 should be out of range');
    });






    module("Datepicker model - Days");

    test("days", function () {
        ok(modelRelative instanceof Model, 'instance');
        equal(new Date(modelRelative.today).getDay(), new Date().getDay(), 'current day should be selected as today');
    });






    module("Datepicker model - Month cells");
    var month = modelRelative.createMonthRange();

    test("create month range", function () {
        ok(month, 'month range created succesfully');
        equal(modelRelative.days.length, 70, 'expected number of days'); // Last week of January (5) + February (28) + March (31) + First Week of April (6)
    });

    test("validate passed startDate", function () {
        // TODO
        // equal(modelRelative.options.startDate.getTime(), new Date(2013, 2, 10).getTime(), 'validate passed startDate');
    });

    test("month cells", function () {



        equal(modelRelative.days[0].date.getDate(), 24, "expected first day date");

        var modelRelativeLen = modelRelative.days.length;
        equal(modelRelative.days[modelRelativeLen - 1].date.getDate(), 4, "expected last day date");

        modelRelative.addMonth();
        modelRelative.addPostMonth();

        var newLen = modelRelative.days.length;
        equal(newLen, 98, 'expected after 1 extra month');

        console.log(modelRelative.days);
        console.log(modelRelative.days[newLen -1]);
        equal(modelRelative.days[newLen - 1].date.getDate(), 1, 'expected last day after 1 extra month');

    });
});



