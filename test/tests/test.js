
require(['js/sb-datepicker.model'], function (Model) {

    var model1 = new Model({
        startDate : new Date(2013, 2, 10),
        range   : 2
    });

    module("model");

    test("days", function () {
        ok(model1 instanceof Model, 'instance');
        equal(new Date(model1.today).getDay(), new Date().getDay(), 'today is today');
    });


    test("month cells", function () {

        var month = model1.createMonthRange();

        ok(month, 'called month cells');

        equal(model1.options.startDate.getTime(), new Date(2013, 2, 10).getTime(), 'validate passed startDate');
        
        equal(model1.days.length, 70, 'expected number of days');

        equal(model1.days[0].date.getDate(), 24, "expected first day date");

        var model1Len = model1.days.length;
        equal(model1.days[model1Len - 1].date.getDate(), 4, "expected last day date");

        model1.addMonth();
        model1.addPostMonth();

        var newLen = model1.days.length;
        equal(newLen, 98, 'expected after 1 extra month');

        console.log(model1.days);
        console.log(model1.days[newLen -1]);
        equal(model1.days[newLen - 1].date.getDate(), 1, 'expected last day after 1 extra month');

    });
});



