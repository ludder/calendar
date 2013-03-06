/* globals asyncTest,deepEqual,equal,expect,module,notDeepEqual,notEqual,notStrictEqual,ok,QUnit,raises,start,stop,strictEqual,test */

QUnit.config.autostart = false;

require(['js/sb-datepicker.utils'], function ($utils) {

    'use strict';

    QUnit.start();

    module("testing utils");

    test("compose", function () {

        var i = 2;
        var newArr = $utils.compose(10, function (index) {
            return index + (i++);
        });

        equal(newArr.length, 10, "should have 10 items");
        equal(newArr[0], 2, "first item");
        equal(newArr[1], 4, "2e item");
        equal(newArr[2], 6, "3e item");


        var arr2 = $utils.compose(3, function (index) {
            return (new Date(2013, 5, 17 + index));
        });

        equal(arr2.length, 3, "should have 3 items");
        equal(arr2[0].getDate(), 17, "first date is 17");
        equal(arr2[1].getDate(), 18, "2nd date is 18");
        equal(arr2[2].getDate(), 19, "3rd date is 19");
    });

    test("compose reverse", function () {

        var i = 3;
        var arr1 = $utils.compose(3, function (index) {
            return index + i;
        }, -1);

        equal(arr1.length, 3, "should have 3 items");
        equal(arr1[0], 1, "first item");
        equal(arr1[1], 2, "2e item");
        equal(arr1[2], 3, "3e item");

        var arr2 = $utils.compose(3, function (index) {
            return (new Date(2013, 5, 17 + index));
        }, -1);


        equal(arr2[0].getDate(), 15, "first date is 17");
        equal(arr2[1].getDate(), 16, "2nd date is 18");
        equal(arr2[2].getDate(), 17, "3rd date is 19");

    });


});



