/**
 * @fileoverview Factory module for control all other factory.
 * @author NHN Ent. FE Development Team <dl_javascript@nhnent.com>
 */
'use strict';

var util = require('tui-code-snippet'),
    Handlebars = require('handlebars-template-loader/runtime');
var dw = require('../common/dw'),
    datetime = require('../common/datetime'),
    Layout = require('../view/layout'),
    Drag = require('../handler/drag'),
    controllerFactory = require('./controller'),
    weekViewFactory = require('./weekView'),
    monthViewFactory = require('./monthView'),
    TZDate = require('../common/timezone').Date,
    config = require('../config'),
    timezone = require('../common/timezone'),
    reqAnimFrame = require('../common/reqAnimFrame');

var mmin = Math.min;

/**
 * Schedule information
 * @typedef {object} Schedule
 * @Property {string} id - unique schedule id depends on calendar id
 * @Property {string} calendarId - unique calendar id
 * @Property {string} title - schedule title
 * @Property {string|TZDate} start - start time. It's 'string' for input. It's 'TZDate' for output like event handler.
 * @Property {string|TZDate} end - end time. It's 'string' for input. It's 'TZDate' for output like event handler.
 * @Property {boolean} isAllDay - all day schedule
 * @Property {string} category - schedule type('milestone', 'task', allday', 'time')
 * @Property {string} dueDateClass - task schedule type string
 *                                   (any string value is ok and mandatory if category is 'task')
 * @Property {string} location - location
 * @Property {Array.<string>} attendees - attendees
 * @Property {any} recurrenceRule - recurrence rule
 * @Property {boolean} isPending - in progress flag to do something like network job(The schedule will be transparent.)
 * @Property {boolean} isFocused - focused schedule flag
 * @Property {boolean} isVisible - schedule visibility flag
 * @Property {boolean} isReadOnly - schedule read-only flag
 * @Property {boolean} isPrivate - private schedule
 * @Property {string} [color] - schedule text color
 * @Property {string} [bgColor] - schedule background color
 * @Property {string} [dragBgColor] - schedule background color when dragging it
 * @Property {string} [borderColor] - schedule left border color
 * @Property {string} customStyle - schedule's custom css class
 * @Property {any} raw - user data
 */

/**
 * Template functions to support customer renderer
 * @typedef {object} Template
 * @Property {function} [milestoneTitle] - milestone title(at left column) template function
 * @Property {function} [milestone] - milestone template function
   @Property {function} [taskTitle] - task title(at left column) template function
 * @Property {function} [task] - task template function
 * @Property {function} [alldayTitle] - allday title(at left column) template function
 * @Property {function} [allday] - allday template function
 * @Property {function} [time] - time template function
 * @Property {function} [monthMoreTitleDate] - month more layer title template function
 * @Property {function} [monthMoreClose] - month more layer close button template function
 * @Property {function} [monthGridHeader] - month grid header(date, decorator, title) template function
 * @Property {function} [monthGridFooter] - month grid footer(date, decorator, title) template function
 * @Property {function} [monthGridHeaderExceed] - month grid header(exceed schedule count) template function
 * @Property {function} [monthGridFooterExceed] - month grid footer(exceed schedule count) template function
 * @Property {function} [weekDayname] - weekly dayname template function
 *  @Property {function} [monthDayname] - monthly dayname template function
 */

/**
 * Options for daily, weekly view.
 * @typedef {object} WeekOptions
 * @Property {number} [startDayOfWeek=0] - start day of week
 * @Property {Array.<string>} [daynames] - day names in weekly and daily.
 *                    Default values are ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
 * @Property {boolean} [narrowWeekend=false] - make weekend column narrow(1/2 width)
 * @Property {boolean} [workweek=false] - show only 5 days except for weekend
 * @Property {boolean} [showTimezoneCollapseButton=false] - show a collapse button to close multiple timezones
 * @Property {boolean} [timezonesCollapsed=false] - An initial multiple timezones collapsed state
 * @Property {number} [hourStart=0] - Can limit of render hour start.
 * @Property {number} [hourEnd=24] - Can limit of render hour end.
 */

/**
 * Options for monthly view.
 * @typedef {object} MonthOptions
 * @Property {Array.<string>} [daynames] - day names in monthly.
 * Default values are ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
 * @Property {number} [startDayOfWeek=0] - start day of week
 * @Property {boolean} [narrowWeekend=false] - make weekend column narrow(1/2 width)
 * @Property {boolean} [visibleWeeksCount=6] - visible week count in monthly(0 or null are same with 6)
 * @Property {boolean} [isAlways6Week=true] - Always show 6 weeks. If false, show 5 weeks or 6 weeks based on the month.
 * @Property {boolean} [workweek=false] - show only 5 days except for weekend
 * @Property {number} [visibleScheduleCount] - visible schedule count in monthly grid
 * @Property {object} [moreLayerSize] - more layer size
 * @Property {object} [moreLayerSize.width=null] - css width value(px, 'auto').
 *                                                       The default value 'null' is to fit a grid cell.
 * @Property {object} [moreLayerSize.height=null] - css height value(px, 'auto').
 *                                                        The default value 'null' is to fit a grid cell.
 * @Property {object} [grid] - grid's header and footer information
 *  @Property {object} [grid.header] - grid's header informatioin
 *   @Property {number} [grid.header.height=34] - grid's header height
 *  @Property {object} [grid.footer] - grid's footer informatioin
 *   @Property {number} [grid.footer.height=34] - grid's footer height
 * @Property {function} [scheduleFilter=null] - Filter schedules on month view. A parameter is {Schedule} object.
 */

/**
 * @typedef {object} CalendarColor
 * @Property {string} [color] - calendar color
 * @Property {string} [bgColor] - calendar background color
 * @Property {string} [borderColor] - calendar left border color
 */

/**
 * @typedef {object} Timezone
 * @Property {number} [timezoneOffset] - minutes for your timezone offset. If null, use the browser's timezone. Refer to Date.prototype.getTimezoneOffset()
 * @Property {string} [displayLabel] -  display label of your timezone at weekly/daily view(ex> 'GMT+09:00')
 * @Property {string} [tooltip] -  tooltip(ex> 'Seoul')
 * @example
 * var timezoneName = moment.tz.guess();
 * var cal = new Calendar('#calendar', {
 *  timezones: [{
 *      timezoneOffset: 540,
 *      displayLabel: 'GMT+09:00',
 *      tooltip: 'Seoul'
 *  }, {
 *      timezoneOffset: -420,
 *      displayLabel: 'GMT-08:00',
 *      tooltip: 'Los Angeles'
 *  }]
 * });
 */

/**
 * @typedef {object} Options - calendar option object
 * @Property {string} [defaultView='week'] - default view of calendar
 * @Property {boolean|Array.<string>} [taskView=true] - show the milestone and task in weekly, daily view. If the value is array, it can be <b>['milestone', 'task']</b>.
 * @Property {boolean|Array.<string>} [scheduleView=true] - show the all day and time grid in weekly, daily view.  If the value is array, it can be <b>['allday', 'time']</b>.
 * @Property {themeConfig} [theme=themeConfig] - custom theme options
 * @Property {Template} [template={}] - template options
 * @Property {WeekOptions} [week={}] - options for week view
 * @Property {MonthOptions} [month={}] - options for month view
 * @Property {Array.<Calendar>} [calendars=[]] - list of Calendars that can be used to add new schedule
 * @Property {boolean} [useCreationPopup=false] - whether use default creation popup or not
 * @Property {boolean} [useDetailPopup=false] - whether use default detail popup or not
 * @Property {Array.<Timezone>} [timezones] - timezone array.
 *  The first Timezone element is primary and can override Calendar#setTimezoneOffset function.
 *  The rest timezone elements are shown in left timegrid of weekly/daily view.
 * @Property {boolean} [disableDblClick=false] - disable double click to create a schedule
 * @Property {boolean} [isReadOnly=false] - Calendar is read-only mode and a user can't create and modify any schedule.
 */

/**
 * {@link https://nhnent.github.io/tui.code-snippet/latest/tui.util.CustomEvents.html CustomEvents} document at {@link https://github.com/nhnent/tui.code-snippet tui-code-snippet}
 * @typedef {class} CustomEvents
 */

/**
 * @typedef {object} TimeCreationGuide - time creation guide instance to present selected time period
 * @Property {HTMLElement} guideElement - guide element
 * @Property {Object.<string, HTMLElement>} guideElements - map by key. It can be used in monthly view
 * @Property {function} clearGuideElement - hide the creation guide
 * @example
 * calendar.on('beforeCreateSchedule', function(event) {
 *     var guide = event.guide;
 *     // use guideEl$'s left, top to locate your schedule creation popup
 *     var guideEl$ = guide.guideElement ?
 *          guide.guideElement : guide.guideElements[Object.keys(guide.guideElements)[0]];
 *
 *     // after that call this to hide the creation guide
 *     guide.clearGuideElement();
 * });
 */

/**
 * Calendar class
 * @constructor
 * @mixes CustomEvents
 * @param {HTMLElement|string} container - container element or selector id
 * @param {Options} options - calendar options
 * @example
 * var calendar = new tui.Calendar(document.getElementById('calendar'), {
 *     defaultView: 'week',
 *     taskView: true,    // can be also ['milestone', 'task']
 *     scheduleView: true,  // can be also ['allday', 'time']
 *     template: {
 *         milestone: function(schedule) {
 *             return '<span style="color:red;"><i class="fa fa-flag"></i> ' + schedule.title + '</span>';
 *         },
 *         milestoneTitle: function() {
 *             return 'Milestone';
 *         },
 *         task: function(schedule) {
 *             return '&nbsp;&nbsp;#' + schedule.title;
 *         },
 *         taskTitle: function() {
 *             return '<label><input type="checkbox" />Task</label>';
 *         },
 *         allday: function(schedule) {
 *             return schedule.title + ' <i class="fa fa-refresh"></i>';
 *         },
 *         alldayTitle: function() {
 *             return 'All Day';
 *         },
 *         time: function(schedule) {
 *             return schedule.title + ' <i class="fa fa-refresh"></i>' + schedule.start;
 *         }
 *     },
 *     month: {
 *         daynames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
 *         startDayOfWeek: 0,
 *         narrowWeekend: true
 *     },
 *     week: {
 *         daynames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
 *         startDayOfWeek: 0,
 *         narrowWeekend: true
 *     }
 * });
 */
function Calendar(container, options) {
    var opt = options;

    if (util.isString(container)) {
        container = document.querySelector(container);
    }

    /**
     * Calendar color map
     * @type {object}
     * @private
     */
    this._calendarColor = {};

    /**
     * Current rendered date
     * @type {TZDate}
     * @private
     */
    this._renderDate = new TZDate();

    /**
     * start and end date of weekly, monthly
     * @type {object}
     * @private
     */
    this._renderRange = {
        start: null,
        end: null
    };

    /**
     * base controller
     * @type {Base}
     * @private
     */
    this._controller = _createController(options);
    this._controller.setCalendars(options.calendars);

    /**
     * layout view (layout manager)
     * @type {Layout}
     * @private
     */
    this._layout = new Layout(container, this._controller.theme);

    /**
     * global drag handler
     * @type {Drag}
     * @private
     */
    this._dragHandler = new Drag({distance: 10}, this._layout.container);

    /**
     * current rendered view name. ('day', 'week', 'month')
     * @type {string}
     * @default 'week'
     * @private
     */
    this._viewName = opt.defaultView || 'week';

    /**
     * Refresh method. it can be ref different functions for each view modes.
     * @type {function}
     * @private
     */
    this._refreshMethod = null;

    /**
     * Scroll to now. It can be called for 'week', 'day' view modes.
     * @type {function}
     * @private
     */
    this._scrollToNowMethod = null;

    /**
     * It's true if Calendar.prototype.scrollToNow() is called.
     * @type {boolean}
     * @private
     */
    this._requestScrollToNow = false;

    /**
     * Open schedule creation popup
     * @type {function}
     * @private
     */
    this._openCreationPopup = null;

    /**
     * Hide the more view
     * @type {function}
     * @private
     */
    this._hideMoreView = null;

    /**
     * Unique id for requestAnimFrame()
     * @type {number}
     * @private
     */
    this._requestRender = 0;

    /**
     * calendar options
     * @type {Options}
     * @private
     */
    this._options = {};

    this._initialize(options);
}

/**
 * destroy calendar instance.
 */
Calendar.prototype.destroy = function() {
    this._dragHandler.destroy();
    this._controller.off();
    this._layout.clear();
    this._layout.destroy();

    util.forEach(this._options.template, function(func, name) {
        if (func) {
            Handlebars.unregisterHelper(name + '-tmpl');
        }
    });

    this._options = this._renderDate = this._controller =
        this._layout = this._dragHandler = this._viewName =
        this._refreshMethod = this._scrollToNowMethod = null;
};

/**
 * Initialize calendar
 * @param {Options} options - calendar options
 * @private
 */
Calendar.prototype._initialize = function(options) {
    var controller = this._controller,
        viewName = this._viewName,
        timezones = options.timezones || [];

    this._options = util.extend({
        defaultView: viewName,
        taskView: true,
        scheduleView: true,
        template: util.extend({
            allday: null,
            time: null
        }, util.pick(options, 'template') || {}),
        week: util.extend({}, util.pick(options, 'week') || {}),
        month: util.extend({}, util.pick(options, 'month') || {}),
        calendars: [],
        useCreationPopup: false,
        useDetailPopup: false,
        timezones: options.timezones || [{
            timezoneOffset: 0,
            displayLabel: '',
            tooltip: ''
        }],
        disableDblClick: false,
        isReadOnly: false
    }, options);

    this._options.week = util.extend({
        startDayOfWeek: 0,
        workweek: false
    }, util.pick(this._options, 'week') || {});

    this._options.month = util.extend({
        startDayOfWeek: 0,
        workweek: false,
        scheduleFilter: function(schedule) {
            return Boolean(schedule.isVisible) &&
                (schedule.category === 'allday' || schedule.category === 'time');
        }
    }, util.pick(options, 'month') || {});

    if (this._options.isReadOnly) {
        this._options.useCreationPopup = false;
    }

    this._layout.controller = controller;

    util.forEach(this._options.template, function(func, name) {
        if (func) {
            Handlebars.registerHelper(name + '-tmpl', func);
        }
    });

    util.forEach(this._options.calendars || [], function(calendar) {
        this.setCalendarColor(calendar.id, calendar, true);
    }, this);

    // set by primary timezone
    if (timezones.length) {
        timezone.setOffsetByTimezoneOption(timezones[0].timezoneOffset);
    }

    this.changeView(viewName, true);
};

/**********
 * CRUD Methods
 **********/

/**
 * Create schedules and render calendar.
 * @param {Array.<Schedule>} schedules - schedule data list
 * @param {boolean} [silent=false] - no auto render after creation when set true
 * @example
 * calendar.createSchedules([
 *     {
 *         id: '1',
 *         calendarId: '1',
 *         title: 'my schedule',
 *         category: 'time',
 *         dueDateClass: '',
 *         start: '2018-01-18T22:30:00+09:00',
 *         end: '2018-01-19T02:30:00+09:00'
 *     },
 *     {
 *         id: '2',
 *         calendarId: '1',
 *         title: 'second schedule',
 *         category: 'time',
 *         dueDateClass: '',
 *         start: '2018-01-18T17:30:00+09:00',
 *         end: '2018-01-19T17:31:00+09:00'
 *     }
 * ]);
 */
Calendar.prototype.createSchedules = function(schedules, silent) {
    var calColor = this._calendarColor;

    util.forEach(schedules, function(obj) {
        var color = calColor[obj.calendarId];

        if (color) {
            obj.color = color.color;
            obj.bgColor = color.bgColor;
            obj.borderColor = color.borderColor;
        }
    });

    this._controller.createSchedules(schedules, silent);

    if (!silent) {
        this.render();
    }
};

/**
 * Get a schedule object by schedule id and calendar id.
 * @param {string} scheduleId - ID of schedule
 * @param {string} calendarId - calendarId of the schedule
 * @returns {Schedule} schedule object
 * @example
 * var schedule = calendar.getSchedule(scheduleId, calendarId);
 * console.log(schedule.title);
 */
Calendar.prototype.getSchedule = function(scheduleId, calendarId) {
    return this._controller.schedules.single(function(model) {
        return model.id === scheduleId && model.calendarId === calendarId;
    });
};

/**
 * Update the schedule
 * @param {string} scheduleId - ID of a schedule to update
 * @param {string} calendarId - calendarId of the schedule to update
 * @param {Schedule} scheduleData - schedule data to update
 * @param {boolean} [silent=false] - no auto render after creation when set true
 * @example
 * calendar.on('beforeUpdateSchedule', function(event) {
 *     var schedule = event.schedule;
 *     var startTime = event.start;
 *     var endTime = event.end;
 *     calendar.updateSchedule(schedule.id, schedule.calendarId, {
 *         start: startTime,
 *         end: endTime
 *     });
 * });
 */
Calendar.prototype.updateSchedule = function(scheduleId, calendarId, scheduleData, silent) {
    var ctrl = this._controller,
        ownSchedules = ctrl.schedules,
        schedule = ownSchedules.single(function(model) {
            return model.id === scheduleId && model.calendarId === calendarId;
        });

    if (schedule) {
        ctrl.updateSchedule(schedule, scheduleData);

        if (!silent) {
            this.render();
        }
    }
};

/**
 * Delete a schedule.
 * @param {string} scheduleId - ID of schedule to delete
 * @param {string} calendarId - calendarId of the schedule to delete
 * @param {boolean} [silent=false] - no auto render after creation when set true
 */
Calendar.prototype.deleteSchedule = function(scheduleId, calendarId, silent) {
    var ctrl = this._controller,
        ownSchedules = ctrl.schedules,
        schedule = ownSchedules.single(function(model) {
            return model.id === scheduleId && model.calendarId === calendarId;
        });

    if (!schedule) {
        return;
    }

    ctrl.deleteSchedule(schedule);
    if (!silent) {
        this.render();
    }
};

/**********
 * Private Methods
 **********/

/**
 * @param {string|Date} date - date to show in calendar
 * @param {number} [startDayOfWeek=0] - start day of week
 * @param {boolean} [workweek=false] - only show work week
 * @returns {array} render range
 * @private
 */
Calendar.prototype._getWeekDayRange = function(date, startDayOfWeek, workweek) {
    var day, start, end, range,
        msFrom = datetime.millisecondsFrom;

    startDayOfWeek = (startDayOfWeek || 0); // eslint-disable-line
    date = util.isDate(date) ? date : new TZDate(date);
    day = date.getDay();

    // calculate default render range first.
    start = new TZDate(
        Number(date) -
        msFrom('day', day) +
        msFrom('day', startDayOfWeek)
    );

    end = new TZDate(Number(start) + msFrom('day', 6));

    if (day < startDayOfWeek) {
        start = new TZDate(Number(start) - msFrom('day', 7));
        end = new TZDate(Number(end) - msFrom('day', 7));
    }

    if (workweek) {
        range = datetime.range(
            datetime.start(start),
            datetime.end(end),
            datetime.MILLISECONDS_PER_DAY
        );

        range = util.filter(range, function(weekday) {
            return !datetime.isWeekend(weekday.getDay());
        });

        start = range[0];
        end = range[range.length - 1];
    }

    return [start, end];
};

/**
 * Toggle schedules' visibility by calendar ID
 * @param {string} calendarId - calendar id value
 * @param {boolean} toHide - set true to hide schedules
 * @param {boolean} [render=true] - set true then render after change visible Property each models
 */
Calendar.prototype.toggleSchedules = function(calendarId, toHide, render) {
    var ownSchedules = this._controller.schedules;

    render = util.isExisty(render) ? render : true;
    calendarId = util.isArray(calendarId) ? calendarId : [calendarId];

    ownSchedules.each(function(schedule) {
        if (~util.inArray(schedule.calendarId, calendarId)) {
            schedule.set('isVisible', !toHide);
        }
    });

    if (render) {
        this.render();
    }
};

/**********
 * General Methods
 **********/

/**
 * Render the calendar. The real rendering occurs after requestAnimationFrame.
 * If you have to render immediately, use the 'immediately' parameter as true.
 * @param {boolean} [immediately=false] - Render it immediately
 * @example
 * var silent = true;
 * calendar.clear();
 * calendar.createSchedules(schedules, silent);
 * calendar.render();
 * @example
 * // Render a calendar when resizing a window.
 * window.addEventListener('resize', function() {
 *     calendar.render();
 * });
 */
Calendar.prototype.render = function(immediately) {
    if (this._requestRender) {
        reqAnimFrame.cancelAnimFrame(this._requestRender);
    }

    if (immediately) {
        this._renderFunc();
    } else {
        this._requestRender = reqAnimFrame.requestAnimFrame(this._renderFunc, this);
    }
};

/**
 * Render and refresh all layout and process requests.
 * @private
 */
Calendar.prototype._renderFunc = function() {
    if (this._refreshMethod) {
        this._refreshMethod();
    }
    if (this._layout) {
        this._layout.render();
    }
    if (this._scrollToNowMethod && this._requestScrollToNow) {
        this._scrollToNowMethod();
    }

    this._requestScrollToNow = false;
    this._requestRender = null;
};

/**
 * Delete all schedules and clear view. The real rendering occurs after requestAnimationFrame.
 * If you have to render immediately, use the 'immediately' parameter as true.
 * @param {boolean} [immediately=false] - Render it immediately
 * @example
 * calendar.clear();
 * calendar.createSchedules(schedules, true);
 * calendar.render();
 */
Calendar.prototype.clear = function(immediately) {
    this._controller.clearSchedules();
    this.render(immediately);
};

/**
 * Scroll to current time on today in case of daily, weekly view
 * @example
 * function onNewSchedules(schedules) {
 *     calendar.createSchedules(schedules);
 *     if (calendar.getViewName() !== 'month') {
 *         calendar.scrollToNow();
 *     }
 * }
 */
Calendar.prototype.scrollToNow = function() {
    if (this._scrollToNowMethod) {
        this._requestScrollToNow = true;
        // this._scrollToNowMethod() will be called at next frame rendering.
    }
};

/**
 * Move to today.
 * @example
 * function onClickTodayBtn() {
 *     calendar.today();
 * }
 */
Calendar.prototype.today = function() {
    this._renderDate = new TZDate();

    this._setViewName(this._viewName);
    this.move();
    this.render();
};

/**
 * Move the calendar amount of offset value
 * @param {number} offset - offset value.
 * @private
 * @example
 * // move previous week when "week" view.
 * // move previous month when "month" view.
 * calendar.move(-1);
 */
Calendar.prototype.move = function(offset) {
    var renderDate = dw(this._renderDate),
        viewName = this._viewName,
        view = this._getCurrentView(),
        recursiveSet = _setOptionRecurseively,
        startDate, endDate, tempDate,
        startDayOfWeek, visibleWeeksCount, workweek, isAlways6Week, datetimeOptions;

    offset = util.isExisty(offset) ? offset : 0;

    if (viewName === 'month') {
        startDayOfWeek = util.pick(this._options, 'month', 'startDayOfWeek') || 0;
        visibleWeeksCount = mmin(util.pick(this._options, 'month', 'visibleWeeksCount') || 0, 6);
        workweek = util.pick(this._options, 'month', 'workweek') || false;
        isAlways6Week = util.pick(this._options, 'month', 'isAlways6Week');

        if (visibleWeeksCount) {
            datetimeOptions = {
                startDayOfWeek: startDayOfWeek,
                isAlways6Week: false,
                visibleWeeksCount: visibleWeeksCount,
                workweek: workweek
            };

            renderDate.addDate(offset * 7 * datetimeOptions.visibleWeeksCount);
            tempDate = datetime.arr2dCalendar(this._renderDate, datetimeOptions);

            recursiveSet(view, function(childView, opt) {
                opt.renderMonth = datetime.format(renderDate.d, 'YYYY-MM-DD');
            });
        } else {
            datetimeOptions = {
                startDayOfWeek: startDayOfWeek,
                isAlways6Week: isAlways6Week,
                workweek: workweek
            };

            renderDate.addMonth(offset);
            tempDate = datetime.arr2dCalendar(this._renderDate, datetimeOptions);

            recursiveSet(view, function(childView, opt) {
                opt.renderMonth = datetime.format(renderDate.d, 'YYYY-MM');
            });
        }

        startDate = tempDate[0][0];
        endDate = tempDate[tempDate.length - 1][tempDate[tempDate.length - 1].length - 1];
    } else if (viewName === 'week') {
        renderDate.addDate(offset * 7);
        startDayOfWeek = util.pick(this._options, 'week', 'startDayOfWeek') || 0;
        workweek = util.pick(this._options, 'week', 'workweek') || false;
        tempDate = this._getWeekDayRange(renderDate.d, startDayOfWeek, workweek);

        startDate = tempDate[0];
        endDate = tempDate[1];

        recursiveSet(view, function(childView, opt) {
            opt.renderStartDate = datetime.format(startDate, 'YYYY-MM-DD');
            opt.renderEndDate = datetime.format(endDate, 'YYYY-MM-DD');

            childView.setState({
                collapsed: true
            });
        });
    } else if (viewName === 'day') {
        renderDate.addDate(offset);
        startDate = endDate = renderDate.d;

        recursiveSet(view, function(childView, opt) {
            opt.renderStartDate = datetime.format(startDate, 'YYYY-MM-DD');
            opt.renderEndDate = datetime.format(endDate, 'YYYY-MM-DD');

            childView.setState({
                collapsed: true
            });
        });
    }

    this._renderDate = renderDate.d;
    this._renderRange = {
        start: startDate,
        end: endDate
    };
};

/**
 * Move to specific date
 * @param {(Date|string)} date - date to move
 * @example
 * calendar.on('clickDayname', function(event) {
 *     if (calendar.getViewName() === 'week') {
 *         calendar.setDate(new Date(event.date));
 *         calendar.changeView('day', true);
 *     }
 * });
 */
Calendar.prototype.setDate = function(date) {
    if (util.isString(date)) {
        date = datetime.parse(date);
    }

    this._renderDate = new TZDate(Number(date));
    this._setViewName(this._viewName);
    this.move(0);
    this.render();
};

/**
 * Move the calendar forward a day, a week, a month, 2 weeks, 3 weeks.
 * @example
 * function moveToNextOrPrevRange(val) {
    if (val === -1) {
        calendar.prev();
    } else if (val === 1) {
        calendar.next();
    }
}
 */
Calendar.prototype.next = function() {
    this.move(1);
    this.render();
};

/**
 * Move the calendar backward a day, a week, a month, 2 weeks, 3 weeks.
 * @example
 * function moveToNextOrPrevRange(val) {
    if (val === -1) {
        calendar.prev();
    } else if (val === 1) {
        calendar.next();
    }
}
 */
Calendar.prototype.prev = function() {
    this.move(-1);
    this.render();
};

/**
 * Return current rendered view.
 * @returns {View} current view instance
 * @private
 */
Calendar.prototype._getCurrentView = function() {
    var viewName = this._viewName;

    if (viewName === 'day') {
        viewName = 'week';
    }

    return util.pick(this._layout.children.items, viewName);
};

/**
 * Change calendar's schedule color with option
 * @param {string} calendarId - calendar ID
 * @param {CalendarColor} option - color data object
 * @param {boolean} [silent=false] - no auto render after creation when set true
 * @example
 * calendar.setCalendarColor('1', {
 *     color: '#e8e8e8',
 *     bgColor: '#585858',
 *     borderColor: '#a1b56c'
 * });
 * calendar.setCalendarColor('2', {
 *     color: '#282828',
 *     bgColor: '#dc9656',
 *     borderColor: '#a1b56c'
 * });
 * calendar.setCalendarColor('3', {
 *     color: '#a16946',
 *     bgColor: '#ab4642',
 *     borderColor: '#a1b56c'
 * });
 */
Calendar.prototype.setCalendarColor = function(calendarId, option, silent) {
    var calColor = this._calendarColor,
        ownSchedules = this._controller.schedules,
        ownColor = calColor[calendarId];

    if (!util.isObject(option)) {
        config.throwError('Calendar#changeCalendarColor(): color 는 {color: \'\', bgColor: \'\'} 형태여야 합니다.');
    }

    ownColor = calColor[calendarId] = util.extend({
        color: '#000',
        bgColor: '#a1b56c',
        borderColor: '#a1b56c'
    }, option);

    ownSchedules.each(function(model) {
        if (model.calendarId !== calendarId) {
            return;
        }

        model.color = ownColor.color;
        model.bgColor = ownColor.bgColor;
        model.borderColor = ownColor.borderColor;
    });

    if (!silent) {
        this.render();
    }
};

/**********
 * Custom Events
 **********/

/**
 * A bridge-based event handler for connecting a click handler to a user click event handler for each view
 * @fires Calendar#clickSchedule
 * @param {object} clickScheduleData - The event data of 'clickSchedule' handler
 * @private
 */
Calendar.prototype._onClick = function(clickScheduleData) {
    /**
     * Fire this event when click a schedule.
     * @event Calendar#clickSchedule
     * @type {object}
     * @Property {Schedule} schedule - schedule instance
     * @Property {MouseEvent} event - MouseEvent
     * @example
     * calendar.on('clickSchedule', function(event) {
     *     var schedule = event.schedule;
     *
     *     if (lastClickSchedule) {
     *         calendar.updateSchedule(lastClickSchedule.id, lastClickSchedule.calendarId, {
     *             isFocused: false
     *         });
     *     }
     *     calendar.updateSchedule(schedule.id, schedule.calendarId, {
     *         isFocused: true
     *     });
     *
     *     lastClickSchedule = schedule;
     *     // open detail view
     * });
     */
    this.fire('clickSchedule', clickScheduleData);
};

/**
 * A bridge-based event handler for connecting a click handler to a user click event handler for each view
 * @fires Calendar#clickMore
 * @param {object} clickMoreSchedule - The event data of 'clickMore' handler
 * @private
 */
Calendar.prototype._onClickMore = function(clickMoreSchedule) {
    /**
     * Fire this event when click a schedule.
     * @event Calendar#clickMore
     * @type {object}
     * @Property {Date} date - clicked date
     * @Property {HTMLElement} target - more element
     * @example
     * calendar.on('clickMore', function(event) {
     *     console.log('clickMore', event.date, event.target);
     * });
     */
    this.fire('clickMore', clickMoreSchedule);
};

/**
 * dayname click event handler
 * @fires Calendar#clickDayname
 * @param {object} clickScheduleData - The event data of 'clickDayname' handler
 * @private
 */
Calendar.prototype._onClickDayname = function(clickScheduleData) {
    /**
     * Fire this event when click a day name in weekly.
     * @event Calendar#clickDayname
     * @type {object}
     * @Property {string} date - date string by format 'YYYY-MM-DD'
     * @example
     * calendar.on('clickDayname', function(event) {
     *     if (calendar.getViewName() === 'week') {
     *         calendar.setDate(new Date(event.date));
     *         calendar.changeView('day', true);
     *     }
     * });
     */
    this.fire('clickDayname', clickScheduleData);
};

/**
 * @fires {Calendar#n('beforeCreateSchedule', function}
 * @param {object} createScheduleData - select schedule data from allday, time
 * @private
 */
Calendar.prototype._onBeforeCreate = function(createScheduleData) {
    if (this._options.useCreationPopup && !createScheduleData.useCreationPopup) {
        if (this._showCreationPopup) {
            this._showCreationPopup(createScheduleData);

            return;
        }
    }
    /**
     * Fire this event when select time period in daily, weekly, monthly.
     * @event Calendar#beforeCreateSchedule
     * @type {object}
     * @Property {boolean} isAllDay - allday schedule
     * @Property {Date} start - selected start time
     * @Property {Date} end - selected end time
     * @Property {TimeCreationGuide} guide - TimeCreationGuide instance
     * @Property {string} triggerEventName - event name like 'click', 'dblclick'
     * @example
     * calendar.on('beforeCreateSchedule', function(event) {
     *     var startTime = event.start;
     *     var endTime = event.end;
     *     var isAllDay = event.isAllDay;
     *     var guide = event.guide;
     *     var triggerEventName = event.triggerEventName;
     *     var schedule;
     *
     *     if (triggerEventName === 'click') {
     *         // open writing simple schedule popup
     *         schedule = {...};
     *     } else if (triggerEventName === 'dblclick') {
     *         // open writing detail schedule popup
     *         schedule = {...};
     *     }
     *
     *     calendar.createSchedules([schedule]);
     * });
     */
    this.fire('beforeCreateSchedule', createScheduleData);
};

/**
 * @fires Calendar#beforeUpdateSchedule
 * @param {object} updateScheduleData - update schedule data
 * @private
 */
Calendar.prototype._onBeforeUpdate = function(updateScheduleData) {
    /**
     * Fire this event when drag a schedule to change time in daily, weekly, monthly.
     * @event Calendar#beforeUpdateSchedule
     * @type {object}
     * @Property {Schedule} schedule - schedule instance to update
     * @Property {Date} start - start time to update
     * @Property {Date} end - end time to update
     * @example
     * calendar.on('beforeUpdateSchedule', function(event) {
     *     var schedule = event.schedule;
     *     var startTime = event.start;
     *     var endTime = event.end;
     *
     *     calendar.updateSchedule(schedule.id, schedule.calendarId, {
     *         start: startTime,
     *         end: endTime
     *     });
     * });
     */
    this.fire('beforeUpdateSchedule', updateScheduleData);
};

/**
 * @fires Calendar#beforeDeleteSchedule
 * @param {object} deleteScheduleData - delete schedule data
 * @private
 */
Calendar.prototype._onBeforeDelete = function(deleteScheduleData) {
    /**
     * Fire this event when delete a schedule.
     * @event Calendar#beforeDeleteSchedule
     * @type {object}
     * @Property {Schedule} schedule - schedule instance to delete
     * @example
     * calendar.on('beforeDeleteSchedule', function(event) {
     *     var schedule = event.schedule;
     *     alert('The schedule is removed.', schedule);
     * });
     */
    this.fire('beforeDeleteSchedule', deleteScheduleData);
};

/**
 * @fires Calendar#afterRenderSchedule
 * @param {Schedule} scheduleData - schedule data
 * @private
 */
Calendar.prototype._onAfterRenderSchedule = function(scheduleData) {
    /**
     * Fire this event by every single schedule after rendering whole calendar.
     * @event Calendar#afterRenderSchedule
     * @type {object}
     * @Property {Schedule} schedule - a rendered schedule instance
     * @example
     * calendar.on('afterRenderSchedule', function(event) {
     *     var schedule = event.schedule;
     *     var element = calendar.getElement(schedule.id, schedule.calendarId);
     *     // use the element
     *     console.log(element);
     * });
     */
    this.fire('afterRenderSchedule', scheduleData);
};

/**
 * @fires Calendar#clickTimezonesCollapseBtn
 * @param {boolean} timezonesCollapsed - timezones collapsed flag
 * @private
 */
Calendar.prototype._onClickTimezonesCollapseBtn = function(timezonesCollapsed) {
    /**
     * Fire this event by clicking timezones collapse button
     * @event Calendar#clickTimezonesCollapseBtn
     * @type {object}
     * @Property {boolean} timezonesCollapsed - timezones collapes flag
     * @example
     * calendar.on('clickTimezonesCollapseBtn', function(timezonesCollapsed) {
     *     console.log(timezonesCollapsed);
     * });
     */
    this.fire('clickTimezonesCollapseBtn', timezonesCollapsed);
};

/**
 * Toggle calendar factory class, main view, wallview event connection
 * @param {boolean} isAttach - attach events if true.
 * @param {Week|Month} view - Weekly view or Monthly view
 * @private
 */
Calendar.prototype._toggleViewSchedule = function(isAttach, view) {
    var self = this,
        handler = view.handler,
        method = isAttach ? 'on' : 'off';

    util.forEach(handler.click, function(clickHandler) {
        clickHandler[method]('clickSchedule', self._onClick, self);
    });

    util.forEach(handler.dayname, function(clickHandler) {
        clickHandler[method]('clickDayname', self._onClickDayname, self);
    });

    util.forEach(handler.creation, function(creationHandler) {
        creationHandler[method]('beforeCreateSchedule', self._onBeforeCreate, self);
        creationHandler[method]('beforeDeleteSchedule', self._onBeforeDelete, self);
    });

    util.forEach(handler.move, function(moveHandler) {
        moveHandler[method]('beforeUpdateSchedule', self._onBeforeUpdate, self);
    });

    util.forEach(handler.resize, function(resizeHandler) {
        resizeHandler[method]('beforeUpdateSchedule', self._onBeforeUpdate, self);
    });

    // bypass events from view
    view[method]('afterRenderSchedule', self._onAfterRenderSchedule, self);
    view[method]('clickTimezonesCollapseBtn', self._onClickTimezonesCollapseBtn, self);
    view[method]('clickMore', self._onClickMore, self);
};

/**
 * Change current view with view name('day', 'week', 'month')
 * @param {string} newViewName - new view name to render
 * @param {boolean} force - force render despite of current view and new view are equal
 * @example
 * // daily view
 * calendar.changeView('day', true);
 *
 * // weekly view
 * calendar.changeView('week', true);
 *
 * // monthly view(default 6 weeks view)
 * calendar.setOptions({month: {visibleWeeksCount: 6}}, true); // or null
 * calendar.changeView('month', true);
 *
 * // 2 weeks monthly view
 * calendar.setOptions({month: {visibleWeeksCount: 2}}, true);
 * calendar.changeView('month', true);
 *
 * // 3 weeks monthly view
 * calendar.setOptions({month: {visibleWeeksCount: 3}}, true);
 * calendar.changeView('month', true);
 *
 * // narrow weekend
 * calendar.setOptions({month: {narrowWeekend: true}}, true);
 * calendar.setOptions({week: {narrowWeekend: true}}, true);
 * calendar.changeView(calendar.getViewName(), true);
 *
 * // change start day of week(from monday)
 * calendar.setOptions({week: {startDayOfWeek: 1}}, true);
 * calendar.setOptions({month: {startDayOfWeek: 1}}, true);
 * calendar.changeView(calendar.getViewName(), true);
 *
 * // work week
 * calendar.setOptions({week: {workweek: true}}, true);
 * calendar.setOptions({month: {workweek: true}}, true);
 * calendar.changeView(calendar.getViewName(), true);
 */
Calendar.prototype.changeView = function(newViewName, force) {
    var self = this,
        layout = this._layout,
        controller = this._controller,
        dragHandler = this._dragHandler,
        options = this._options,
        viewName = this._viewName,
        created;

    if (!force && viewName === newViewName) {
        return;
    }

    this._setViewName(newViewName);

    // convert day to week
    if (viewName === 'day') {
        viewName = 'week';
    }

    if (newViewName === 'day') {
        newViewName = 'week';
    }
    layout.children.doWhenHas(viewName, function(view) {
        self._toggleViewSchedule(false, view);
    });

    layout.clear();

    if (newViewName === 'month') {
        created = _createMonthView(
            controller,
            layout.container,
            dragHandler,
            options
        );
    } else if (newViewName === 'week' || newViewName === 'day') {
        created = _createWeekView(
            controller,
            layout.container,
            dragHandler,
            options
        );
    }

    layout.addChild(created.view);

    layout.children.doWhenHas(newViewName, function(view) {
        self._toggleViewSchedule(true, view);
    });

    this._refreshMethod = created.refresh;
    this._scrollToNowMethod = created.scrollToNow;
    this._openCreationPopup = created.openCreationPopup;
    this._showCreationPopup = created.showCreationPopup;
    this._hideMoreView = created.hideMoreView;

    this.move();
    this.render();
};

/**
 * @deprecated
 * Toggle task view('Milestone', 'Task') panel
 * @param {boolean} enabled - use task view
 * @example
 * // There is no milestone, task, so hide those view panel
 * calendar.toggleTaskView(false);
 *
 * // There are some milestone, task, so show those view panel.
 * calendar.toggleTaskView(true);
 */
Calendar.prototype.toggleTaskView = function(enabled) {
    var viewName = this._viewName,
        options = this._options;

    options.taskView = enabled;

    this.changeView(viewName, true);
};

/**
 * @deprecated
 * Toggle schedule view('AllDay', TimeGrid') panel
 * @param {boolean} enabled - use task view
 * @example
 * // hide those view panel to show only 'Milestone', 'Task'
 * calendar.toggleScheduleView(false);
 *
 * // show those view panel.
 * calendar.toggleScheduleView(true);
 */
Calendar.prototype.toggleScheduleView = function(enabled) {
    var viewName = this._viewName,
        options = this._options;

    options.scheduleView = enabled;

    this.changeView(viewName, true);
};

/**
 * Set current view name
 * @param {string} viewName - new view name to render
 * @private
 */
Calendar.prototype._setViewName = function(viewName) {
    this._viewName = viewName;
};

/**
 * Get a schedule element by schedule id and calendar id.
 * @param {string} scheduleId - ID of schedule
 * @param {string} calendarId - calendarId of schedule
 * @returns {HTMLElement} schedule element if found or null
 * @example
 * var element = calendar.getElement(scheduleId, calendarId);
 * console.log(element);
 */
Calendar.prototype.getElement = function(scheduleId, calendarId) {
    var schedule = this.getSchedule(scheduleId, calendarId);
    if (schedule) {
        return document.querySelector('[data-schedule-id="' + scheduleId + '"][data-calendar-id="' + calendarId + '"]');
    }

    return null;
};

/**
 * Set a theme. If some keys are not defined in the preset, will be return.
 * @param {object} theme - multiple styles map
 * @returns {Array.<string>} keys - error keys not predefined.
 * @example
 * cal.setTheme({
    'month.dayname.height': '31px',
    'common.dayname.color': '#333',
    'month.dayname.borderBottom': '1px solid #e5e5e5' // Not valid key  will be return.
 * });
 */
Calendar.prototype.setTheme = function(theme) {
    var result = this._controller.setTheme(theme);
    this.render(true);

    return result;
};

/**
 * Set options of calendar
 * @param {Options} options - options to set
 * @param {boolean} [silent=false] - no auto render after creation when set true
 */
Calendar.prototype.setOptions = function(options, silent) {
    util.forEach(options, function(value, name) {
        if (util.isObject(value) && !util.isArray(value)) {
            util.forEach(value, function(innerValue, innerName) {
                this._options[name][innerName] = innerValue;
            }, this);
        } else {
            this._options[name] = value;
        }
    }, this);

    if (!silent) {
        this.changeView(this._viewName, true);
    }
};

/**
 * Get current options.
 * @returns {Options} options
 */
Calendar.prototype.getOptions = function() {
    return this._options;
};

/**
 * Current rendered date
 * @returns {TZDate}
 */
Calendar.prototype.getDate = function() {
    return this._renderDate;
};

/**
 * Start time of rendered date range
 * @returns {TZDate}
 */
Calendar.prototype.getDateRangeStart = function() {
    return this._renderRange.start;
};

/**
 * End time of rendered date range
 * @returns {TZDate}
 */
Calendar.prototype.getDateRangeEnd = function() {
    return this._renderRange.end;
};

/**
 * Get current view name('day', 'week', 'month')
 * @returns {string} view name
 */
Calendar.prototype.getViewName = function() {
    return this._viewName;
};

/**
 * Set calendar list
 * @param {Array.<Object>} calendars - calendar list
 */
Calendar.prototype.setCalendars = function(calendars) {
    this._controller.setCalendars(calendars);
    this.render();
};

/**
 * Open schedule creation popup
 * @param {Schedule} schedule - preset schedule data
 */
Calendar.prototype.openCreationPopup = function(schedule) {
    if (this._openCreationPopup) {
        this._openCreationPopup(schedule);
    }
};

/**
 * Hide the more view
 */
Calendar.prototype.hideMoreView = function() {
    if (this._hideMoreView) {
        this._hideMoreView();
    }
};

/**
 * Set timezone offset
 * @param {number} offset - offset (min)
 * @static
 * @deprecated
 * @example
 * var timezoneName = moment.tz.guess();
 * tui.Calendar.setTimezoneOffset(moment.tz.zone(timezoneName).utcOffset(moment()));
 */
Calendar.setTimezoneOffset = function(offset) {
    timezone.setOffset(offset);
};

/**
 * Set a callback function to get timezone offset by timestamp
 * @param {function} callback - callback function
 * @static
 * @deprecated
 * @example
 * var timezoneName = moment.tz.guess();
 * tui.Calendar.setTimezoneOffsetCallback(function(timestamp) {
 *      return moment.tz.zone(timezoneName).utcOffset(timestamp));
 * });
 */
Calendar.setTimezoneOffsetCallback = function(callback) {
    timezone.setOffsetCallback(callback);
};

/**
 * Create controller instance
 * @returns {Base} controller instance
 * @param {Options} options - calendar options
 * @private
 */
function _createController(options) {
    return controllerFactory(options);
}

/**
 * Create week view instance by dependent module instances
 * @param {Base} controller - controller
 * @param {HTMLElement} container - container element
 * @param {Drag} dragHandler - global drag handler
 * @param {object} options - options for week view
 * @returns {Week} week view instance
 * @private
 */
function _createWeekView(controller, container, dragHandler, options) {
    return weekViewFactory(
        controller,
        container,
        dragHandler,
        options
    );
}

/**
 * Create week view instance by dependent module instances
 * @param {Base} controller - controller
 * @param {HTMLElement} container - container element
 * @param {Drag} dragHandler - global drag handler
 * @param {object} options - options for week view
 * @returns {Month} month view instance
 * @private
 */
function _createMonthView(controller, container, dragHandler, options) {
    return monthViewFactory(
        controller,
        container,
        dragHandler,
        options
    );
}

/**
 * Set child view's options recursively
 * @param {View} view - parent view
 * @param {function} func - option manipulate function
 * @private
 */
function _setOptionRecurseively(view, func) {
    view.recursive(function(childView) {
        var opt = childView.options;

        if (!opt) {
            return;
        }

        func(childView, opt);
    });
}

util.CustomEvents.mixin(Calendar);

module.exports = Calendar;
