
var sbDatepicker = (function (DP) {

    DP.Model = {

    };


}(sbDatepicker));

var SBDatepicker = (function (sbd) {

    sbd.Model = function () {
        
        this.today = new Date();
        // create month cells
        //
        this.startDate = 0;

        this.endDate = 30;

        //this.

    };

    sbd.prototype = {
        
        getDay              : function (date) {
            return date.getDay();
        },

        // create month cells
        createMonthCells : function () {
            var arr = [],
                firstDay = this.today.getDay();
        }

    };

    return sbd;

}(SBDatepicker));
