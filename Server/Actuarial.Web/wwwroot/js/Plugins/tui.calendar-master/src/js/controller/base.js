/**
 * @fileoverview Base calendar controller
 * @author NHN Ent. FE Development Team <dl_javascript@nhnent.com>
 */
'use strict';

var util = require('tui-code-snippet');
var Schedule = require('../model/schedule');
var ScheduleViewModel = require('../model/viewModel/scheduleViewModel');
var datetime = require('../common/datetime');
var common = require('../common/common');
var Theme = require('../theme/theme');

/**
 * @constructor
 * @param {object} options - options for base controller
 * @param {function} [options.groupFunc] - function for group each models {@see Collection#groupBy}
 * @param {themeConfig} [options.theme] - theme object
 * @mixes util.CustomEvents
 */
function Base(options) {
    options = options || {};

    /**
     * function for group each schedule models.
     * @type {function}
     * @param {ScheduleViewModel} viewModel - view model instance
     * @returns {string} group key
     */
    this.groupFunc = options.groupFunc || function(viewModel) {
        var model = viewModel.model;

        if (viewModel.model.isAllDay) {
            return 'allday';
        }

        if (model.category === 'time' && (model.end - model.start > datetime.MILLISECONDS_PER_DAY)) {
            return 'allday';
        }

        return model.category;
    };

    /**
     * schedules collection.
     * @type {Collection}
     */
    this.schedules = common.createScheduleCollection();

    /**
     * Matrix for multidate schedules.
     * @type {object.<string, array>}
     */
    this.dateMatrix = {};

    /**
     * Theme
     * @type {Theme}
     */
    this.theme = new Theme(options.theme);

    /**
     * Calendar list
     * @type {Array.<Calendar>}
     */
    this.calendars = [];
}

/**
 * Calculate contain dates in schedule.
 * @private
 * @param {Schedule} schedule The instance of schedule.
 * @returns {array} contain dates.
 */
Base.prototype._getContainDatesInSchedule = function(schedule) {
    var range = datetime.range(
        datetime.start(schedule.getStarts()),
        datetime.end(schedule.getEnds()),
        datetime.MILLISECONDS_PER_DAY
    );

    return range;
};

/****************
 * CRUD Schedule
 ****************/

/**
 * Create an schedule instance from raw data.
 * @emits Base#beforeCreateSchedule
 * @emits Base#createdSchedule
 * @param {object} options Data object to create schedule.
 * @param {boolean} silent - set true then don't fire events.
 * @returns {Schedule} The instance of Schedule that created.
 */
Base.prototype.createSchedule = function(options, silent) {
    var schedule,
        scheduleData = {
            data: options
        };

    /**
     * @event Base#beforeCreateSchedule
     * @type {Calendar~Schedule[]}
     */
    if (!this.invoke('beforeCreateSchedule', scheduleData)) {
        return null;
    }

    schedule = this.addSchedule(Schedule.create(options));

    if (!silent) {
        /**
         * @event Base#createdSchedule
         * @type {Schedule}
         */
        this.fire('createdSchedule', schedule);
    }

    return schedule;
};

/**
 * @emits Base#beforeCreateSchedule
 * @emits Base#createdSchedule
 * @param {Calendar~Schedule[]} dataList - dataObject list to create schedule.
 * @param {boolean} [silent=false] - set true then don't fire events.
 * @returns {Schedule[]} The instance list of Schedule that created.
 */
Base.prototype.createSchedules = function(dataList, silent) {
    var self = this;

    return util.map(dataList, function(data) {
        return self.createSchedule(data, silent);
    });
};

/**
 * Update an schedule.
 * @emits Base#updateSchedule
 * @param {Schedule} schedule - schedule instance to update
 * @param {object} options updated object data.
 * @returns {Schedule} updated schedule instance
 */
Base.prototype.updateSchedule = function(schedule, options) {
    var start = options.start || schedule.start;
    var end = options.end || schedule.end;

    options = options || {};

    if (options.title) {
        schedule.set('title', options.title);
    }

    if (options.start || options.end) {
        if (schedule.isAllDay) {
            schedule.setAllDayPeriod(start, end);
        } else {
            schedule.setTimePeriod(start, end);
        }
    }

    if (options.color) {
        schedule.set('color', options.color);
    }

    if (options.bgColor) {
        schedule.set('bgColor', options.bgColor);
    }

    if (options.borderColor) {
        schedule.set('borderColor', options.borderColor);
    }

    if (options.origin) {
        schedule.set('origin', options.origin);
    }

    if (!util.isUndefined(options.isAllDay)) {
        schedule.set('isAllDay', options.isAllDay);
    }

    if (!util.isUndefined(options.isPending)) {
        schedule.set('isPending', options.isPending);
    }

    if (!util.isUndefined(options.isFocused)) {
        schedule.set('isFocused', options.isFocused);
    }

    if (options.location) {
        schedule.set('location', options.location);
    }

    if (options.state) {
        schedule.set('state', options.state);
    }

    this._removeFromMatrix(schedule);
    this._addToMatrix(schedule);

    /**
     * @event Base#updateSchedule
     */
    this.fire('updateSchedule');

    return schedule;
};

/**
 * Delete schedule instance from controller.
 * @param {Schedule} schedule - schedule instance to delete
 * @returns {Schedule} deleted model instance.
 */
Base.prototype.deleteSchedule = function(schedule) {
    this._removeFromMatrix(schedule);
    this.schedules.remove(schedule);

    return schedule;
};

/**
 * Set date matrix to supplied schedule instance.
 * @param {Schedule} schedule - instance of schedule.
 */
Base.prototype._addToMatrix = function(schedule) {
    var ownMatrix = this.dateMatrix;
    var containDates = this._getContainDatesInSchedule(schedule);

    util.forEach(containDates, function(date) {
        var ymd = datetime.format(date, 'YYYYMMDD'),
            matrix = ownMatrix[ymd] = ownMatrix[ymd] || [];

        matrix.push(util.stamp(schedule));
    });
};

/**
 * Remove schedule's id from matrix.
 * @param {Schedule} schedule - instance of schedule
 */
Base.prototype._removeFromMatrix = function(schedule) {
    var modelID = util.stamp(schedule);

    util.forEach(this.dateMatrix, function(matrix) {
        var index = util.inArray(modelID, matrix);

        if (~index) {
            matrix.splice(index, 1);
        }
    }, this);
};

/**
 * Add an schedule instance.
 * @emits Base#addedSchedule
 * @param {Schedule} schedule The instance of Schedule.
 * @param {boolean} silent - set true then don't fire events.
 * @returns {Schedule} The instance of Schedule that added.
 */
Base.prototype.addSchedule = function(schedule, silent) {
    this.schedules.add(schedule);
    this._addToMatrix(schedule);

    if (!silent) {
        /**
         * @event Base#addedSchedule
         * @type {object}
         */
        this.fire('addedSchedule', schedule);
    }

    return schedule;
};

/**
 * split schedule model by ymd.
 * @param {Date} start - start date
 * @param {Date} end - end date
 * @param {Collection} scheduleCollection - collection of schedule model.
 * @returns {object.<string, Collection>} splitted schedule model collections.
 */
Base.prototype.splitScheduleByDateRange = function(start, end, scheduleCollection) {
    var range = datetime.range(
            datetime.start(start),
            datetime.end(end),
            datetime.MILLISECONDS_PER_DAY
        ),
        ownMatrix = this.dateMatrix,
        result = {};

    util.forEachArray(range, function(date) {
        var ymd = datetime.format(date, 'YYYYMMDD'),
            matrix = ownMatrix[ymd],
            collection;

        collection = result[ymd] = common.createScheduleCollection();

        if (matrix && matrix.length) {
            util.forEachArray(matrix, function(id) {
                scheduleCollection.doWhenHas(id, function(schedule) {
                    collection.add(schedule);
                });
            });
        }
    });

    return result;
};

/**
 * Return schedules in supplied date range.
 *
 * available only YMD.
 * @param {Date} start start date.
 * @param {Date} end end date.
 * @returns {object.<string, Collection>} schedule collection grouped by dates.
 */
Base.prototype.findByDateRange = function(start, end) {
    var range = datetime.range(
            datetime.start(start),
            datetime.end(end),
            datetime.MILLISECONDS_PER_DAY
        ),
        ownSchedules = this.schedules.items,
        ownMatrix = this.dateMatrix,
        dformat = datetime.format,
        result = {},
        matrix,
        ymd,
        viewModels;

    util.forEachArray(range, function(date) {
        ymd = dformat(date, 'YYYYMMDD');
        matrix = ownMatrix[ymd];
        viewModels = result[ymd] = common.createScheduleCollection();

        if (matrix && matrix.length) {
            viewModels.add.apply(viewModels, util.map(matrix, function(id) {
                return ScheduleViewModel.create(ownSchedules[id]);
            }));
        }
    });

    return result;
};

Base.prototype.clearSchedules = function() {
    this.dateMatrix = {};
    this.schedules.clear();
    /**
     * for inner view when clear schedules
     * @event Base#clearSchedules
     * @type {Schedule}
     */
    this.fire('clearSchedules');
};

/**
 * Set a theme.
 * @param {themeConfig} theme - theme keys, styles
 * @returns {Array.<string>} keys - error keys not predefined.
 */
Base.prototype.setTheme = function(theme) {
    return this.theme.setStyles(theme);
};

/**
 * @typedef {Calendar}
 * @Property {string|number} id - calendar id
 * @Property {string} name - calendar name
 * @Property {string} color - text color when schedule is displayed
 * @Property {string} bgColor - background color schedule is displayed
 * @Property {string} borderColor - color of left border or bullet point when schedule is displayed
 * @Property {boolean} [checked] - whether to show calendar's schedules or not
 */

/**
 * Set calendar list
 * @param {Array.<Calendar>} calendars - calendar list
 */
Base.prototype.setCalendars = function(calendars) {
    this.calendars = calendars;
};

// mixin
util.CustomEvents.mixin(Base);

module.exports = Base;
