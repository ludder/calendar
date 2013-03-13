/*! daterangepicker - v0.2.0 - 2013-03-12 10:03 */ 
define(function() {
    "use strict";
    function e() {
        window.console && console.log(arguments);
    }
    function t(e, t, n) {
        var a, s = [];
        for (n = n || 1, a = 0; e > a; a += 1) s.push(t(n * a));
        return 0 > n ? s.reverse() : s;
    }
    return {
        debug: e,
        loop: t
    };
}), define([ "lib/jquery", "js/g-datepicker.utils", "js/g-datepicker.model", "js/g-datepicker.view" ], function(e, t, n, a) {
    "use strict";
    function s(e) {
        this.options = e, this.model = new n(this.options), this.view = new a(this.options), 
        this.days = [];
    }
    function r(n) {
        return e.isPlainObject(n) ? new s(n).init() : (t.debug("invalid options object", n), 
        void 0);
    }
    return s.prototype = {
        init: function() {
            this.createMonths(), this.render(), this.initEvents();
        },
        createMonths: function() {
            this.days = this.model.createMonthRange();
        },
        render: function() {
            this.view.render(this.days);
        },
        addMonth: function() {},
        refresh: function() {},
        destroy: function() {},
        initEvents: function() {
            this.view.initEvents();
        }
    }, {
        init: r
    };
}), define(function() {
    "use strict";
    function e(e) {
        return new Date(e.getYear(), e.getMonth(), e.getDate() + 1);
    }
    function t(e) {
        return new Date(e.setDate(1));
    }
    function n(e) {
        return t(e).getDay();
    }
    function a(e) {
        var t = new Date(e.getFullYear(), e.getMonth() + 1, 0);
        return {
            date: t.getDate(),
            weekday: t.getDay()
        };
    }
    function s(e) {
        return new Date(e.getFullYear(), e.getMonth(), e.getDate() - 1);
    }
    return {
        nextDayDate: e,
        firstOfMonthDate: t,
        firstOfMonthWeekday: n,
        lastOfMonth: a,
        yesterday: s
    };
}), define([ "js/g-datepicker.controller" ], function(e) {
    "use strict";
    return {
        init: function(t) {
            return e.init(t);
        }
    };
}), define([ "lib/jquery", "js/g-datepicker.utils", "js/g-datepicker.date" ], function(e, t, n) {
    "use strict";
    function a(t) {
        this.options = e.extend({}, r, t), this.today = s, this.days = [];
    }
    var s = new Date().setHours(0), r = {
        range: 1,
        startDate: s,
        minDate: s,
        maxDate: new Date(2100, 1, 1)
    }, i = t.compose, o = n.firstOfMonthWeekday, d = n.lastOfMonth, c = n.yesterday;
    return a.prototype = {
        getLastDay: function() {
            var e = this.days.length;
            return e && this.days[e - 1];
        },
        isLastDayOfMonth: function(e) {
            var t = d(e).date;
            return e.getDate() === t;
        },
        isInRange: function(e) {
            return e >= this.options.minDate && this.options.maxDate >= e;
        },
        isDisabled: function(e) {
            return this.today > e || e > this.maxDate;
        },
        isFirstWeek: function(e) {
            return 7 >= e.getDate();
        },
        addDay: function(e) {
            return {
                date: e,
                selectable: this.isInRange(e),
                disabled: this.isDisabled(e),
                firstweek: this.isFirstWeek(e),
                lastdayofmonth: this.isLastDayOfMonth(e)
            };
        },
        createAddDay: function(e) {
            var t = this, n = e.getFullYear(), a = e.getMonth(), s = e.getDate();
            return function(e) {
                return t.addDay(new Date(n, a, s + e));
            };
        },
        getPostMonth: function(e) {
            var t = d(e), n = t.weekday, a = 6 - n, s = new Date(e.getFullYear(), e.getMonth() + 1);
            return i(a, this.createAddDay(s));
        },
        getPreMonth: function(e) {
            var t = o(e);
            return i(t, this.createAddDay(c(e)), -1);
        },
        addPreMonth: function(e) {
            this.days = this.days.concat(this.getPreMonth(e));
        },
        addPostMonth: function(e) {
            e || (e = this.getLastDay().date), this.days = this.days.concat(this.getPostMonth(e));
        },
        createMonthDays: function(e) {
            var t = d(e).date;
            return i(t, this.createAddDay(e));
        },
        addMonth: function(e) {
            this.days = this.days.concat(this.createMonthDays(e));
        },
        createMonthRange: function() {
            var e, t, n = new Date(this.options.startDate.getTime()), a = n.getMonth(), s = this.options.range;
            for (this.addPreMonth(n), e = 0; s > e; e += 1) t = new Date(n.setMonth(a + e)), 
            this.addMonth(t);
            return this.addPostMonth(n), this.days;
        }
    }, a;
}), define(function() {
    "use strict";
    function e() {
        window.console && console.log(arguments);
    }
    function t(e, t, n) {
        var a, s = [];
        for (n = n || 1, a = 0; e > a; a += 1) s.push(t(n * a));
        return 0 > n ? s.reverse() : s;
    }
    return {
        debug: e,
        compose: t
    };
}), define([ "lib/jquery" ], function(e) {
    "use strict";
    function t(t) {
        this.months = t.months || n.shortMonths, this.$container = "string" == typeof t.containerId ? e("#" + t.containerId) : e("body"), 
        this.$result = e("#" + t.resultId);
    }
    var n = {
        shortMonths: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec" ],
        shortWeekDays: [ "Zo", "Ma", "Di", "Wo", "Do", "Vr", "Za" ],
        journeyOutward: "Heenreis:",
        journeyReturn: "Terugreis:"
    }, a = {
        wrapper: "g-dp-datepicker",
        ul: "est-dp",
        year: "est-dp-year",
        month: "est-dp-month",
        weekDays: "est-dp-wdays",
        selectable: "est-dp-selectable",
        disabled: "est-dp-disabled",
        firstweek: "est-dp-firstweek",
        lastdayofmonth: "est-dp-lastdayofmonth",
        selectedFirst: "est-dp-selected-start",
        selectedLast: "est-dp-selected-end",
        range: "est-dp-mo-range"
    }, s = {
        daterange_startdate_selected: "est:daterange_startdate_selected",
        daterange_enddate_selected: "est:daterange_enddate_selected",
        daterange_dates_cleared: "est:daterange_dates_cleared"
    }, r = {
        day: '<li class="${disabled} ${lastdayofmonth}"><a data-msdate="${msdate}" href="#" class="${selectable} ${firstweek}">${date}</a></li>',
        month: '<span class="' + a.month + '">${month}</span>',
        weekDays: '<div class="' + a.weekDays + '">' + "<span>" + n.shortWeekDays[0] + "</span>" + "<span>" + n.shortWeekDays[1] + "</span>" + "<span>" + n.shortWeekDays[2] + "</span>" + "<span>" + n.shortWeekDays[3] + "</span>" + "<span>" + n.shortWeekDays[4] + "</span>" + "<span>" + n.shortWeekDays[5] + "</span>" + "<span>" + n.shortWeekDays[6] + "</span>" + "</div>",
        year: '<div class="' + a.year + '">${year}</div>',
        journey: '<div class="' + a.journey + '">' + n.journeyOutward + "</div>",
        wrapper: '<div class="' + a.wrapper + '">${datepicker}</div>'
    }, i = /\$\{(\w+)\}/gim;
    return t.prototype = {
        wrap: function(e) {
            return r.wrapper.replace(i, e);
        },
        renderWeekDays: function() {
            return r.weekDays;
        },
        renderJourney: function() {
            return r.journey;
        },
        renderYear: function(e) {
            e = e || new Date();
            var t = e.getFullYear();
            return r.year.replace(i, t);
        },
        renderMonth: function(e) {
            return r.month.replace(i, this.months[e]);
        },
        renderDay: function(e, t) {
            var n = e[t], s = n && "function" == typeof n.getDate && n.getDate(), r = s && n.getMonth();
            switch (t) {
              case "date":
                return 1 === s ? this.renderMonth(r) + " " + s : s;

              case "msdate":
                return e.date.getTime();

              case "selectable":
                return n && a[t] || "";

              case "disabled":
                return n && a[t] || "";

              case "firstweek":
                return n && a[t] || "";

              case "lastdayofmonth":
                return n && a[t] || "";

              default:
                return n;
            }
        },
        createRenderDay: function(e) {
            var t = this;
            return function(n, a) {
                return t.renderDay(e, a);
            };
        },
        render: function(e) {
            var t = this, n = this.renderYear(e[0] && e[0].date), s = e;
            n += this.renderJourney(), n += this.renderWeekDays(), n += '<ul class="' + a.ul + '">';
            for (var o = 0; s.length > o; o++) n += r.day.replace(i, t.createRenderDay(s[o], o));
            return n += "</ul>", this.$container.html(this.wrap(n)), this.$datepicker = this.$container.find("." + a.wrapper).eq(0), 
            this.$datepicker;
        },
        selectStartDate: function(t, n) {
            var s, r = e(n.parentNode);
            t.$selectedStart = r, t.$selectedStart.addClass(a.selectedFirst), s = r.nextAll(), 
            s.on("mouseenter.calendarhover mouseleave.calendarhover", "." + a.selectable, function(e) {
                t.handleHoverEvent(e.type, t, this.parentNode);
            }), t.publishStartDateSelected(n);
        },
        selectEndDate: function(t, n) {
            if (!t.$selectedEnd) {
                var s, r = e(n.parentNode);
                t.$selectedEnd = r, t.$selectedEnd.addClass(a.selectedLast), s = t.$selectedEnd.siblings(), 
                s.andSelf().off(".calendarhover");
            }
            t.publishEndDateSelected(n);
        },
        setEventSelectMonth: function(t) {
            t.$datepicker.on("click", "." + a.month, function(n) {
                var s, r;
                n.stopPropagation(), s = n.target.parentNode, r = e(s.parentNode).nextAll("." + a.lastdayofmonth + ":first").find("a").get(0), 
                t.clearSelectedDates(t, s.parentNode), t.selectStartDate(t, s), t.selectEndDate(t, r), 
                e(r.parentNode).prevUntil(t.$selectedStart).andSelf().addClass(a.range);
            });
        },
        clearSelectedDates: function(t, n) {
            t.$selectedStart = null, t.$selectedEnd = null;
            var s = a.range + " " + a.selectedFirst + " " + a.selectedLast;
            e(n).siblings().removeClass(s);
        },
        initEvents: function() {
            var e = this;
            e.setEventSelectDate(e), e.setEventSelectMonth(e);
        },
        setEventSelectDate: function(e) {
            this.$datepicker.on("click", "." + a.selectable, function(t) {
                t.preventDefault(), e.$selectedStart ? e.$selectedEnd ? (e.clearSelectedDates(e, this.parentNode), 
                e.selectStartDate(e, t.target)) : e.selectEndDate(e, t.target) : e.selectStartDate(e, t.target);
            });
        },
        handleHoverEvent: function(t, n, s) {
            var r = e(s).prevUntil(n.$selectedStart).andSelf(), i = r.length;
            if ("mouseleave" === t) r.removeClass(a.range); else if ("mouseenter" === t) for (;i-- && r[0] !== s; ) r.eq(i).addClass(a.range);
        },
        publish: function(t) {
            e(this).trigger(t);
        },
        publishDateSelected: function(e, t) {
            var n = {
                type: e,
                date: t
            };
            this.publish(n);
        },
        publishDatesCleared: function() {
            var e = {
                type: s.daterange_dates_cleared
            };
            this.publish(e);
        },
        publishStartDateSelected: function(e) {
            var t = new Date(parseInt(e.getAttribute("data-msdate"), 10));
            this.showJourney(t, n.journeyOutward), this.publishDateSelected(s.daterange_startdate_selected, t);
        },
        publishEndDateSelected: function(e) {
            var t = new Date(parseInt(e.getAttribute("data-msdate"), 10));
            this.showJourney(t, n.journeyReturn), this.publishDateSelected(s.daterange_enddate_selected, t);
        },
        showJourney: function(t, s) {
            var r = s + " " + n.shortWeekDays[t.getDay()] + " " + t.getDate() + " " + n.shortMonths[t.getMonth()];
            e("." + a.journey).html(r);
        }
    }, t;
});