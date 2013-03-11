/*global define */
define(['lib/jquery'], function ($) {

    'use strict';

    var defaults = {
        // TODO - how to i18n?
            shortMonths    : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
            shortWeekDays  : ['Zo', 'Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za'],
            journeyOutward : 'Heenreis:',
            journeyReturn  : 'Terugreis:'
        },

        classNames = {
            wrapper  : 'dp-datepicker',
            ul       : 'dp',
            year     : 'dp-year',
            month    : 'dp-month',
            weekDays : 'dp-wdays',

            journey  : 'dp-journey',

            selectable     : 'dp-selectable',
            disabled       : 'dp-disabled',
            firstweek      : 'dp-firstweek',
            lastdayofmonth : 'dp-lastdayofmonth',

            selectedFirst  : 'dp-selected-start',
            selectedLast   : 'dp-selected-end',
            range          : 'dp-mo-range'
        },

        events = {
            daterange_startdate_selected : 'est:daterange_startdate_selected',
            daterange_enddate_selected   : 'est:daterange_enddate_selected',
            daterange_dates_cleared      : 'est:daterange_dates_cleared'
        },


        templates = {
            day      : '<li class="${disabled} ${lastdayofmonth}"><a data-msdate="${msdate}" href="#" class="${selectable} ${firstweek}">${date}</a></li>',
            // day      : '<li class="${lastdayofmonth}"><a data-msdate="${msdate}" href="#" class="${selectable} ${disabled} ${firstweek}">${date}</a></li>',

            month    : '<span class="' + classNames.month + '">${month}</span>',

            weekDays : '<div class="' + classNames.weekDays + '">' +
                        '<span>' + defaults.shortWeekDays[0] + '</span>' +
                        '<span>' + defaults.shortWeekDays[1] + '</span>' +
                        '<span>' + defaults.shortWeekDays[2] + '</span>' +
                        '<span>' + defaults.shortWeekDays[3] + '</span>' +
                        '<span>' + defaults.shortWeekDays[4] + '</span>' +
                        '<span>' + defaults.shortWeekDays[5] + '</span>' +
                        '<span>' + defaults.shortWeekDays[6] + '</span>' +
                        '</div>',

            year    : '<div class="' + classNames.year + '">${year}</div>',

            journey : '<div class="' + classNames.journey + '">' + defaults.journeyOutward + '</div>',

            wrapper : '<div class="' + classNames.wrapper + '">${datepicker}</div>'
        },

        templReg = /\$\{(\w+)\}/gim;


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

        renderJourney : function () {
            return templates.journey;
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
            case 'firstweek':
                return (prop && classNames[s] || '');
            case 'lastdayofmonth':
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

            // render journey header
            html += this.renderJourney();

            // render days header
            html += this.renderWeekDays();

            // month days
            html += '<ul class="' + classNames.ul + '">';

            // $.each(monthArr, function (date) {
            // monthArr.forEach(function (date, index) {
            //     html += templates.day.replace(templReg, self.createRenderDay(date));
            // });
            for (var i=0; i<monthArr.length; i++) {
                html += templates.day.replace(templReg, self.createRenderDay(monthArr[i], i));
            }

            html += '</ul>';

            this.$container.html(this.wrap(html));

            this.$datepicker = this.$container.find('.' + classNames.wrapper).eq(0);

            return this.$datepicker;

        },

        selectStartDate : function(self, target) {
            var $nexts;
            var $parentNode = $(target.parentNode);

            self.$selectedStart = $parentNode;
            self.$selectedStart.addClass(classNames.selectedFirst);

            $nexts = $parentNode.nextAll();
            $nexts.on('mouseenter.calendarhover mouseleave.calendarhover', '.' + classNames.selectable, function (e) {
                self.handleHoverEvent(e.type, self, this.parentNode);
            });

            self.publishStartDateSelected(target);

        },

        selectEndDate : function(self, target) {
            if (!self.$selectedEnd) {
                // End date selected
                var $sibs;
                var $parentNode = $(target.parentNode);

                self.$selectedEnd = $parentNode;
                self.$selectedEnd.addClass(classNames.selectedLast);

                $sibs = self.$selectedEnd.siblings();

                // Remove hover events
                $sibs.andSelf().off('.calendarhover');
            }

            self.publishEndDateSelected(target);
        },

        setEventSelectMonth : function(self) {
            self.$datepicker.on('click', '.' + classNames.month, function (e) {

                var firstDay, lastDay;
                e.stopPropagation();

                firstDay = e.target.parentNode;
                lastDay = $(firstDay.parentNode).nextAll('.' + classNames.lastdayofmonth + ':first').find('a').get(0);

                // Clear selected dates
                self.clearSelectedDates(self, firstDay.parentNode);

                // Select first and last day of month
                self.selectStartDate(self, firstDay);
                self.selectEndDate(self, lastDay);

                // Select all in between days
                $(lastDay.parentNode).prevUntil(self.$selectedStart).andSelf().addClass(classNames.range);
            });
        },

        clearSelectedDates : function(self, parent) {
            self.$selectedStart = null;
            self.$selectedEnd   = null;

            var classnames = classNames.range + ' ' + classNames.selectedFirst + ' ' + classNames.selectedLast;
            $(parent).siblings().removeClass(classnames);
        },

        initEvents : function () {
            var self = this;

            self.setEventSelectDate(self);
            self.setEventSelectMonth(self);
        },

        setEventSelectDate : function(self) {
            this.$datepicker.on('click', '.' + classNames.selectable, function (event) {

                event.preventDefault();

                if (!self.$selectedStart) {
                    // First click: select start date
                    self.selectStartDate(self, event.target);
                } else {
                    if (!self.$selectedEnd) {
                        // Second click: select end date
                        self.selectEndDate(self, event.target);
                    } else {
                        // Third click: clear and select start date again
                        self.clearSelectedDates(self, this.parentNode);
                        self.selectStartDate(self, event.target);
                    }
                }

            });
        },

        handleHoverEvent: function(eventType, self, parentNode) {
            var $prev = $(parentNode).prevUntil(self.$selectedStart).andSelf(),
                len = $prev.length;

            if (eventType === 'mouseleave') {
                $prev.removeClass(classNames.range);

            } else if (eventType === 'mouseenter') {
                while (len--) {

                    if ($prev[0] !== parentNode) {
                        $prev.eq(len).addClass(classNames.range);
                    } else {
                        break;
                    }
                }

            }
        },

        publish : function(obj) {
            $(this).trigger(obj);

            // DEBUG
            // console.log('event thrown: ' + obj);
        },

        publishDateSelected : function(eventName, date) {
            var obj = {
                type: eventName,
                date: date
            };

            this.publish(obj);
        },

        publishDatesCleared : function() {
            var obj = {
                type: events.daterange_dates_cleared
            };

            this.publish(obj);
        },

        publishStartDateSelected : function(target) {
            var date = new Date(parseInt(target.getAttribute('data-msdate'), 10));
            this.showJourney(date, defaults.journeyOutward);
            this.publishDateSelected(events.daterange_startdate_selected, date);
        },

        publishEndDateSelected : function(target) {
            var date = new Date(parseInt(target.getAttribute('data-msdate'), 10));
            this.showJourney(date, defaults.journeyReturn);
            this.publishDateSelected(events.daterange_enddate_selected, date);
        },

        showJourney : function(date, journeyType) {
            var text = journeyType + ' ' + defaults.shortWeekDays[date.getDay()] +
                        ' ' + date.getDate() + ' ' + defaults.shortMonths[date.getMonth()];
            $('.' + classNames.journey).html(text);
        }

    };

    return View;

});
