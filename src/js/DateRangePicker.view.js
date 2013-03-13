/*global define */
define(['lib/jquery'], function ($) {

    'use strict';

    var defaults = {
        // TODO - i18n!
            shortMonths    : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
            shortWeekDays  : ['Zo', 'Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za'],
            journeyOutward : 'Heenreis:',
            journeyReturn  : 'Terugreis:'
        },

        classNames = {
            wrapper  : 'est-dp-datepicker',
            ul       : 'est-dp',
            month    : 'est-dp-month',
            journey    : 'est-dp-journey',
            weekDays : 'est-dp-wdays',

            selectable        : 'est-dp-selectable',
            disabled          : 'est-dp-disabled',
            firstweek         : 'est-dp-firstweek',
            lastdayofmonth    : 'est-dp-lastdayofmonth',

            firstselecteddate : 'est-dp-selected-start',
            lastselecteddate  : 'est-dp-selected-end',
            selectedFirst     : 'est-dp-selected-start',
            selectedLast      : 'est-dp-selected-end',
            range             : 'est-dp-mo-range'
        },

        events = {
            daterange_startdate_selected : 'est:daterange_startdate_selected',
            daterange_enddate_selected   : 'est:daterange_enddate_selected',
            daterange_dates_cleared      : 'est:daterange_dates_cleared',
            daterange_month_in_view      : 'est:daterange_month_in_view'
        },


        templates = {
            day      : '<li class="${disabled} ${lastdayofmonth} ${firstselecteddate} ${lastselecteddate}"><a data-msdate="${msdate}" href="#" class="${selectable} ${firstweek}">${date}</a></li>',
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

            journey : '<div class="' + classNames.journey + '"><strong>' + defaults.journeyOutward + '</strong></div>',

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
            case 'firstselecteddate':
                return (prop && classNames[s] || '');
            case 'lastselecteddate':
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
                html = '',
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

            self.disableDaysBeforeStartDate(self);
            self.publishStartDateSelected(target);

        },

        disableDaysBeforeStartDate : function (self) {
            self.$selectedStart.prevAll()
                .addClass(classNames.disabled)
                .find('a')
                .removeClass(classNames.selectable)
                .off('.calendarhover');
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

        selectInBetweenDays : function(self) {
            $(self.$selectedEnd).prevUntil(self.$selectedStart).addClass(classNames.range);
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
            self.setEventMonthInView(self);
        },

        setEventMonthInView : function (self) {
            // Trhow event when another month is scrolled into view
            var $calendar   = $('.' + classNames.ul);
            var $months     = $calendar.find('.' + classNames.month);
            var activeMonth = self.getActiveMonth($months);

            $calendar.on('scroll', function(){
                var currentMonth = self.getActiveMonth($months);
                if (currentMonth !== activeMonth) {
                    activeMonth = currentMonth;
                    self.publish({
                        type: events.daterange_month_in_view,
                        date: activeMonth
                    });
                }
            });
        },

        getActiveMonth : function ($months) {
            var i, $month, top,
                l = $months.length,
                activeMonth = 0;

            for (i = 0; i < l; i++) {
                $month = $($months[i].parentNode);
                top    = $month.position().top;
                // TODO: how accurate are these measures?
                if (top > -50 && top < 250) {
                    activeMonth = $month.attr('data-msdate');
                    break;
                }
            }

            return activeMonth;
        },

        /**
         * Select start date, end date and in between days when view is generated with known start and end date
         * @return {[type]} [description]
         */
        selectDays : function() {
            var self = this;
            var $container = this.$container;
            if ($container.find('.' + classNames.firstselecteddate) && $container.find('.' + classNames.lastselecteddate)) {

                self.$selectedStart = $container.find('.' + classNames.firstselecteddate);
                self.$selectedEnd = $container.find('.' + classNames.lastselecteddate);
                self.selectInBetweenDays(self);

                // Scroll to first selected day
                var newTop = self.$selectedStart.position().top -20;
                self.$container.find('.' + classNames.ul).animate({'scrollTop': newTop}, 800);
            }
        },

        setEventSelectDate : function(self) {
            this.$datepicker.on('click.calendarclick', '.' + classNames.selectable, function (event) {

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
            var $prev = $(parentNode).prevUntil(self.$selectedStart),
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
            // console.log('event thrown: ', obj.type);
            // console.log('maand: ', (new Date(parseInt(obj.date, 10))).getMonth());
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
            var text = '<strong>' + journeyType + '</strong> ' + defaults.shortWeekDays[date.getDay()] +
                        ' ' + date.getDate() + ' ' + defaults.shortMonths[date.getMonth()];
            $('.' + classNames.journey).html(text);
        }

    };

    return View;

});
