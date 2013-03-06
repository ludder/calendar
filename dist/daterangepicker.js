/*! daterangepicker - v0.1.0 - 2013-03-06 09:03 */ 
define(function() {
    function e() {
        window.console && console.log(arguments);
    }
    function t(e, t, n) {
        var a, r = [];
        for (n = n || 1, a = 0; e > a; a += 1) r.push(t(n * a));
        return 0 > n ? r.reverse() : r;
    }
    return {
        debug: e,
        loop: t
    };
}), define([ "lib/jquery", "js/sb-datepicker.utils", "js/sb-datepicker.model", "js/sb-datepicker.view" ], function(e, t, n, a) {
    function r(e) {
        this.options = e, this.model = new n(this.options), this.view = new a(this.options), 
        this.days = [];
    }
    function s(n) {
        return e.isPlainObject(n) ? new r(n).init() : (t.debug("invalid options object", n), 
        void 0);
    }
    return r.prototype = {
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
        init: s
    };
}), define(function() {
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
    function r(e) {
        return new Date(e.getFullYear(), e.getMonth(), e.getDate() - 1);
    }
    return {
        nextDayDate: e,
        firstOfMonthDate: t,
        firstOfMonthWeekday: n,
        lastOfMonth: a,
        yesterday: r
    };
}), define([ "js/sb-datepicker.controller" ], function(e) {
    return {
        init: function(t) {
            return e.init(t);
        }
    };
}), define([ "lib/jquery", "js/sb-datepicker.utils", "js/sb-datepicker.date" ], function(e, t, n) {
    function a(t) {
        this.options = e.extend({}, s, t), this.today = r, this.days = [];
    }
    var r = new Date().setHours(0), s = {
        range: 1,
        startDate: r,
        minDate: r,
        maxDate: new Date(2100, 1, 1)
    }, i = t.compose, o = (n.nextDayDate, n.firstOfMonthWeekday), d = n.lastOfMonth, c = n.yesterday;
    return a.prototype = {
        getLastDay: function() {
            var e = this.days.length;
            return e && this.days[e - 1];
        },
        isInRange: function(e) {
            return e > this.options.minDate && this.options.maxDate > e;
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
                firstweek: this.isFirstWeek(e)
            };
        },
        createAddDay: function(e) {
            var t = this, n = e.getFullYear(), a = e.getMonth(), r = e.getDate();
            return function(e) {
                return t.addDay(new Date(n, a, r + e));
            };
        },
        getPostMonth: function(e) {
            var t = d(e), n = t.weektday, a = 6 - n, r = new Date(e.getFullYear(), e.getMonth() + 1);
            return i(a, this.createAddDay(r));
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
        addNextMonth: function() {
            var e = this.days.length, t = this.days[e - 1];
            console.log(t);
        },
        createMonthRange: function() {
            var e, t, n = new Date(this.options.startDate.getTime()), a = n.getMonth(), r = this.options.range;
            for (this.addPreMonth(n), e = 0; r > e; e += 1) t = new Date(n.setMonth(a + e)), 
            this.addMonth(t);
            return this.addPostMonth(n), this.days;
        },
        appendMonthRange: function() {}
    }, a;
}), define(function() {
    function e() {
        window.console && console.log(arguments);
    }
    function t(e, t, n) {
        var a, r = [];
        for (n = n || 1, a = 0; e > a; a += 1) r.push(t(n * a));
        return 0 > n ? r.reverse() : r;
    }
    return {
        debug: e,
        compose: t
    };
}), define([ "lib/jquery" ], function(e) {
    function t(t) {
        this.months = t.months || s.shortMonths, this.$container = "string" == typeof t.containerId ? e("#" + t.containerId) : e("body"), 
        this.$result = e("#" + t.resultId);
    }
    var n = {
        wrapper: "dp-datepicker",
        ul: "dp",
        year: "dp-year",
        month: "dp-month",
        weekDays: "dp-wdays",
        selectable: "dp-selectable",
        disabled: "dp-disabled",
        firstweek: "dp-firstweek",
        selectedFirst: "dp-selected-start",
        range: "dp-mo-range"
    }, a = {
        day: '<li><a data-msdate="${msdate}" href="#" class="${selectable} ${disabled} ${firstweek}">${date}</a></li>',
        month: '<span class="' + n.month + '">${month}</span>',
        weekDays: '<div class="' + n.weekDays + '">' + "<span>S</span><span>M</span><span>T</span><span>W</span>" + "<span>T</span><span>F</span><span>S</span>" + "</div>",
        year: '<div class="' + n.year + '">${year}</div>',
        wrapper: '<div class="' + n.wrapper + '">${datepicker}</div>'
    }, r = /\$\{(\w+)\}/gim, s = {
        shortMonths: [ "jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sept", "oct", "nov", "dec" ]
    };
    return t.prototype = {
        wrap: function(e) {
            return a.wrapper.replace(r, e);
        },
        renderWeekDays: function() {
            return a.weekDays;
        },
        renderYear: function(e) {
            e = e || new Date();
            var t = e.getFullYear();
            return a.year.replace(r, t);
        },
        renderMonth: function(e) {
            return a.month.replace(r, this.months[e]);
        },
        renderDay: function(e, t) {
            var a = e[t], r = a && "function" == typeof a.getDate && a.getDate(), s = r && a.getMonth();
            switch (t) {
              case "date":
                return 1 === r ? this.renderMonth(s) + " " + r : r;

              case "msdate":
                return e.date.getTime();

              case "selectable":
                return a && n[t] || "";

              case "disabled":
                return a && n[t] || "";

              case "firstweek":
                return a && n[t] || "";

              default:
                return a;
            }
        },
        createRenderDay: function(e) {
            var t = this;
            return function(n, a) {
                return t.renderDay(e, a);
            };
        },
        render: function(e) {
            var t = this, s = this.renderYear(e[0] && e[0].date), i = e;
            return s += this.renderWeekDays(), s += '<ul class="' + n.ul + '">', i.forEach(function(e) {
                s += a.day.replace(r, t.createRenderDay(e));
            }), s += "</ul>", this.$container.html(this.wrap(s)), this.$datepicker = this.$container.find("." + n.wrapper).eq(0), 
            this.$datepicker;
        },
        initEvents: function() {
            var t = this;
            this.$datepicker.on("click", "." + n.selectable, function(a) {
                var r;
                a.preventDefault(), t.$selectedStart || (t.$selectedStart = e(this.parentNode), 
                t.$selectedStart.addClass(n.selectedFirst), r = e(this.parentNode).nextAll(), r.on("mouseenter mouseleave", "." + n.selectable, function(a) {
                    var r = a.type, s = e(this.parentNode).prevUntil(t.$selectedStart), i = s.length;
                    if ("mouseleave" === r) s.removeClass(n.range); else if ("mouseenter" === r) for (;i-- && s[0] !== this.parentNode; ) s.eq(i).addClass(n.range);
                }), t.$result.html(new Date(parseInt(a.target.getAttribute("data-msdate"), 10))));
            }), this.$datepicker.on("click", "." + n.month, function() {});
        }
    }, t;
});