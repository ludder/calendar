/* globals asyncTest,deepEqual,equal,expect,module,notDeepEqual,notEqual,notStrictEqual,ok,QUnit,raises,start,stop,strictEqual,test */

QUnit.config.autostart = false;

require(['js/sb-datepicker.model'], function (Model) {

    'use strict';

    QUnit.start();

    // Helper functions
    function addDays(date, days) {
        return new Date( date.getTime() + (days * 86400000) );
    }

    function createNewExactModel() {
        return new Model({
            minDate   : new Date(2023, 2, 10),
            startDate : new Date(2023, 2, 10),
            maxDate   : new Date(2023, 8, 10),
            range     : 3
        });
    }
    // END Helper functions

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
    var modelExact = createNewExactModel();


    module("Datepicker model - Public functions");

    test("function getLastDay()", function () {
        // TODO why breaks???
        // console.log(modelExact);
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
        equal(modelRelative.isInRange(myMaxDate), true, 'maxDate should be in range');
        equal(modelRelative.isInRange(addDays(myMaxDate, 1)), false, 'maxDate +1 should be out of range');
    });

    test("function isDisabled()", function () {
        // Exact model
        equal(modelExact.isDisabled(new Date(2023, 2, 10)), false, 'March, 10 2023 should not be disabled');

        // Relative model
        // Min date
        equal(modelRelative.isDisabled(today), false, 'Today should not be disabled');
        equal(modelRelative.isDisabled(addDays(today, -1)), true, 'Yesterday should be disabled');
        // Max date
        equal(modelRelative.isDisabled(maxDate), false, 'maxDate should not be disabled');
    });

    test("function isFirstWeek()", function () {
        // Exact model
        equal(modelExact.isDisabled(new Date(2023, 2, 1)), false, 'March, 1 should be in the first week of the month');
        equal(modelExact.isDisabled(new Date(2023, 2, 7)), false, 'March, 1 should be in the first week of the month');
        equal(modelExact.isDisabled(new Date(2023, 2, 8)), false, 'March, 1 should be in the first week of the month');
        equal(modelExact.isDisabled(new Date(2023, 2, 31)), false, 'March, 1 should be in the first week of the month');
    });

    test("function addDay()", function () {
        expect(0); // Tested in other functions
    });

    test("function createAddDay()", function () {
        expect(0); // Tested in other functions
    });

    // TODO - function is broken
    test("function getPostMonth()", function () {
        expect(0); // for now...
    //     console.log(modelExact.getPostMonth(new Date(2023, 2, 30)));
    //     equal(modelExact.getPostMonth(new Date(2023, 2, 30)), 101, 'getPostMonth should return ...');
    });

    test("function getPreMonth()", function () {
        // XXX Does this test break when Sunday is not first day of the week??
        equal(modelExact.getPreMonth(new Date(2013, 2, 1)).length, 5, 'March 2013 should return 5 days');
        equal(modelExact.getPreMonth(new Date(2013, 2, 31)).length, 5, 'March, 31 2013 should also return 5 days');
        equal(modelExact.getPreMonth(new Date(2013, 3, 1)).length, 1, 'April 2013 should return 1 day');
        equal(modelExact.getPreMonth(new Date(2013, 8, 1)).length, 0, 'September2013 should return 0 days');
    });

    test("function addPreMonth()", function () {
        // XXX Does this test break when Sunday is not first day of the week??
        var model;

        model = createNewExactModel();
        model.addPreMonth(new Date(2013, 2, 1));
        equal(model.days.length, 5, 'March 2013 should return 5 days');

        model = createNewExactModel();
        model.addPreMonth(new Date(2013, 2, 31));
        equal(model.days.length, 5, 'March 2013 should return 5 days');

        model = createNewExactModel();
        model.addPreMonth(new Date(2013, 3, 1));
        equal(model.days.length, 1, 'April 2013 should return 1 day');

        model = createNewExactModel();
        model.addPreMonth(new Date(2013, 8, 1));
        equal(model.days.length, 0, 'September 2013 should return 0 days');
    });

    test("function addPostMonth()", function () {
        // XXX Does this test break when Sunday is not first day of the week??
        var model;
        equal(1, 0, 'GEBLEVEN BIJ addPostMonth()');
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



