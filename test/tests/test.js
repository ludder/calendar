module("model");

var model = new SBDatepicker.Model(),
    view = new SBDatepicker.View();

test("days", function () {
    ok(model instanceof SBDatepicker.Model, 'instance');
    equal(model.today.getDay(), new Date().getDay(), 'today is today');

    
});


test("month cells", function () {

    var month = model.createMonthCells();

    ok(month, 'called month cells');

    equal(model.lastDay(2), '2', 'last date of this month')
    
    view.render(month);
});


