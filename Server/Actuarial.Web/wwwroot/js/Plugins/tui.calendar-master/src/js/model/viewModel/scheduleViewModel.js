/**
 * @fileoverview Model for views
 * @author NHN Ent. FE Development Team <dl_javascript@nhnent.com>
 */
'use strict';

var util = require('tui-code-snippet');
var datetime = require('../../common/datetime');

var MILLISECONDS_SCHEDULE_MIN_DURATION = datetime.MILLISECONDS_SCHEDULE_MIN_DURATION;

/**
 * Schedule ViewModel
 * @constructor
 * @param {Schedule} schedule Schedule instance.
 */
function ScheduleViewModel(schedule) {
    /**
     * The model of schedule.
     * @type {Schedule}
     */
    this.model = schedule;

    /**
     * @type {number}
     */
    this.top = 0;

    /**
     * @type {number}
     */
    this.left = 0;

    /**
     * @type {number}
     */
    this.width = 0;

    /**
     * @type {number}
     */
    this.height = 0;

    /**
     * Represent schedule has collide with other schedules when rendering.
     * @type {boolean}
     */
    this.hasCollide = false;

    /**
     * Extra space at rigth side of this schedule.
     * @type {number}
     */
    this.extraSpace = 0;

    /**
     * represent this schedule block is not visible after rendered.
     *
     * in month view, some viewmodel in date need to hide when already rendered before dates.
     *
     * set true then it just shows empty space.
     * @type {boolean}
     */
    this.hidden = false;

    /**
     * whether the schedule includes multiple dates
     */
    this.hasMultiDates = false;

    /**
     * represent render start date used at rendering.
     *
     * if set null then use model's 'start' Property.
     * @type {TZDate}
     */
    this.renderStarts = null;

    /**
     * whether the actual start-date is before the render-start-date
     * @type {boolean}
     */
    this.exceedLeft = false;

    /**
     * represent render end date used at rendering.
     *
     * if set null then use model's 'end' Property.
     * @type {TZDate}
     */
    this.renderEnds = null;

    /**
     * whether the actual end-date is after the render-end-date
     * @type {boolean}
     */
    this.exceedRight = false;
}

/**********
 * static props
 **********/

/**
 * ScheduleViewModel factory method.
 * @param {Schedule} schedule Schedule instance.
 * @returns {ScheduleViewModel} ScheduleViewModel instance.
 */
ScheduleViewModel.create = function(schedule) {
    return new ScheduleViewModel(schedule);
};

/**********
 * prototype props
 **********/

/**
 * return renderStarts Property to render properly when specific schedule that exceed rendering date range.
 *
 * if renderStarts is not set. return model's start Property.
 * @override
 * @returns {Date} render start date.
 */
ScheduleViewModel.prototype.getStarts = function() {
    if (this.renderStarts) {
        return this.renderStarts;
    }

    return this.model.start;
};

/**
 * return renderStarts Property to render properly when specific schedule that exceed rendering date range.
 *
 * if renderEnds is not set. return model's end Property.
 * @override
 * @returns {Date} render end date.
 */
ScheduleViewModel.prototype.getEnds = function() {
    if (this.renderEnds) {
        return this.renderEnds;
    }

    return this.model.end;
};

/**
 * @returns {number} unique number for model.
 */
ScheduleViewModel.prototype.cid = function() {
    return util.stamp(this.model);
};

/**
 * Shadowing valueOf method for schedule sorting.
 * @returns {Schedule} The model of schedule.
 */
ScheduleViewModel.prototype.valueOf = function() {
    return this.model;
};

/**
 * Link duration method
 * @returns {number} Schedule#duration result.
 */
ScheduleViewModel.prototype.duration = function() {
    return this.model.duration();
};

/**
 * Link collidesWith method
 * @param {Schedule|ScheduleViewModel} viewModel - Model or viewmodel instance of Schedule.
 * @returns {boolean} Schedule#collidesWith result.
 */
ScheduleViewModel.prototype.collidesWith = function(viewModel) {
    var ownStarts = this.getStarts(),
        ownEnds = this.getEnds(),
        start = viewModel.getStarts(),
        end = viewModel.getEnds();

    if ((start > ownStarts && start < ownEnds) ||
        (end > ownStarts && end < ownEnds) ||
        (start <= ownStarts && end >= ownEnds)) {
        return true;
    }

    if (Math.abs(start - ownStarts) < MILLISECONDS_SCHEDULE_MIN_DURATION) {
        return true;
    }

    return false;
};

module.exports = ScheduleViewModel;

