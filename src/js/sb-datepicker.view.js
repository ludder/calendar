/*global define */
define(['lib/jquery'], function ($) {

    var classNames = {
            wrapper : 'dp-datepicker',
            year    : 'dp-year',
            month   : 'dp-month',
            weekDays: 'dp-wdays',

            selectable : 'dp-selectable',
            disabled    : 'dp-disabled'
        },
    
        templates = {
            day : '<li><a data-msdate="${msdate}" href="#" class="${selectable} ${disabled}">${date}</a></li>',

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
            html += '<ul class="dp">';

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
                e.preventDefault();
                self.$result.html(new Date(parseInt(e.target.getAttribute('data-msdate'), 10))); 
            });
        }
    };

    return View;

});
