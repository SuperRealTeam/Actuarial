/**
 * @fileoverview Handling resize schedules from drag handler and time grid view
 * @author NHN Ent. FE Development Team <dl_javascript@nhnent.com>
 */
'use strict';

var util = require('tui-code-snippet');
var config = require('../../config');
var datetime = require('../../common/datetime');
var domutil = require('../../common/domutil');
var TZDate = require('../../common/timezone').Date;
var timeCore = require('./core');
var TimeResizeGuide = require('./resizeGuide');

/**
 * @constructor
 * @implements {Handler}
 * @mixes timeCore
 * @mixes util.CustomEvents
 * @param {Drag} [dragHandler] - Drag handler instance.
 * @param {TimeGrid} [timeGridView] - TimeGrid view instance.
 * @param {Base} [baseController] - Base controller instance.
 */
function TimeResize(dragHandler, timeGridView, baseController) {
    /**
     * @type {Drag}
     */
    this.dragHandler = dragHandler;

    /**
     * @type {TimeGrid}
     */
    this.timeGridView = timeGridView;

    /**
     * @type {Base}
     */
    this.baseController = baseController;

    /**
     * @type {function}
     */
    this._getScheduleDataFunc = null;

    /**
     * @type {object}
     */
    this._dragStart = null;

    /**
     * @type {TimeResizeGuide}
     */
    this._guide = new TimeResizeGuide(this);

    dragHandler.on('dragStart', this._onDragStart, this);
}

/**
 * Destroy method
 */
TimeResize.prototype.destroy = function() {
    this._guide.destroy();
    this.dragHandler.off(this);
    this.dragHandler = this.timeGridView = this.baseController =
        this._getScheduleDataFunc = this._dragStart = this._guide = null;
};

/**
 * @param {HTMLElement} target - element to check condition.
 * @returns {object|boolean} - return time view instance or false
 */
TimeResize.prototype.checkExpectCondition = function(target) {
    var container,
        matches;

    if (!domutil.hasClass(target, config.classname('time-resize-handle'))) {
        return false;
    }

    container = domutil.closest(target, config.classname('.time-date'));

    if (!container) {
        return false;
    }

    matches = domutil.getClass(container).match(config.time.getViewIDRegExp);

    if (!matches || matches.length < 2) {
        return false;
    }

    return util.pick(this.timeGridView.children.items, Number(matches[1]));
};

/**
 * @emits TimeResize#timeResizeDragstart
 * @param {object} dragStartEventData - event data of Drag#dragstart
 */
TimeResize.prototype._onDragStart = function(dragStartEventData) {
    var target = dragStartEventData.target,
        timeView = this.checkExpectCondition(target),
        blockElement = domutil.closest(target, config.classname('.time-date-schedule-block')),
        getScheduleDataFunc,
        scheduleData;

    if (!timeView || !blockElement) {
        return;
    }

    getScheduleDataFunc = this._getScheduleDataFunc = this._retriveScheduleData(timeView);
    scheduleData = this._dragStart = getScheduleDataFunc(
        dragStartEventData.originEvent, {
            targetModelID: domutil.getData(blockElement, 'id')
        }
    );

    this.dragHandler.on({
        drag: this._onDrag,
        dragEnd: this._onDragEnd,
        click: this._onClick
    }, this);

    /**
     * @event TimeResize#timeResizeDragstart
     * @type {object}
     * @Property {HTMLElement} target - current target in mouse event object.
     * @Property {Time} relatedView - time view instance related with mouse position.
     * @Property {MouseEvent} originEvent - mouse event object.
     * @Property {number} mouseY - mouse Y px mouse event.
     * @Property {number} gridY - grid Y index value related with mouseY value.
     * @Property {number} timeY - milliseconds value of mouseY points.
     * @Property {number} nearestGridY - nearest grid index related with mouseY value.
     * @Property {number} nearestGridTimeY - time value for nearestGridY.
     * @Property {string} targetModelID - The model unique id emitted move schedule.
     */
    this.fire('timeResizeDragstart', scheduleData);
};

/**
 * Drag#drag event handler
 * @emits TimeResize#timeResizeDrag
 * @param {object} dragEventData - event data of Drag#drag custom event.
 * @param {string} [overrideEventName] - override emitted event name when supplied.
 * @param {function} [revise] - supply function for revise schedule data before emit.
 */
TimeResize.prototype._onDrag = function(dragEventData, overrideEventName, revise) {
    var getScheduleDataFunc = this._getScheduleDataFunc,
        startScheduleData = this._dragStart,
        scheduleData;

    if (!getScheduleDataFunc || !startScheduleData) {
        return;
    }

    scheduleData = getScheduleDataFunc(dragEventData.originEvent, {
        targetModelID: startScheduleData.targetModelID
    });

    if (revise) {
        revise(scheduleData);
    }

    /**
     * @event TimeResize#timeResizeDrag
     * @type {object}
     * @Property {HTMLElement} target - current target in mouse event object.
     * @Property {Time} relatedView - time view instance related with drag start position.
     * @Property {MouseEvent} originEvent - mouse event object.
     * @Property {number} mouseY - mouse Y px mouse event.
     * @Property {number} gridY - grid Y index value related with mouseY value.
     * @Property {number} timeY - milliseconds value of mouseY points.
     * @Property {number} nearestGridY - nearest grid index related with mouseY value.
     * @Property {number} nearestGridTimeY - time value for nearestGridY.
     * @Property {string} targetModelID - The model unique id emitted move schedule.
     */
    this.fire(overrideEventName || 'timeResizeDrag', scheduleData);
};

/**
 * Update model instance by dragend event results.
 * @fires TimeResize#beforeUpdateSchedule
 * @param {object} scheduleData - schedule data from TimeResize#timeResizeDragend
 */
TimeResize.prototype._updateSchedule = function(scheduleData) {
    var ctrl = this.baseController,
        modelID = scheduleData.targetModelID,
        range = scheduleData.nearestRange,
        timeDiff = range[1] - range[0],
        schedule = ctrl.schedules.items[modelID],
        relatedView = scheduleData.relatedView,
        dateEnd,
        newEnds,
        baseDate;

    if (!schedule) {
        return;
    }

    timeDiff -= datetime.millisecondsFrom('minutes', 30);

    baseDate = new TZDate(relatedView.getDate());
    dateEnd = datetime.end(baseDate);
    newEnds = new TZDate(schedule.getEnds().getTime() + timeDiff);

    if (newEnds > dateEnd) {
        newEnds = new TZDate(dateEnd.getTime());
    }

    if (newEnds.getTime() - schedule.getStarts().getTime() < datetime.millisecondsFrom('minutes', 30)) {
        newEnds = new TZDate(schedule.getStarts().getTime() + datetime.millisecondsFrom('minutes', 30));
    }

    /**
     * @event TimeResize#beforeUpdateSchedule
     * @type {object}
     * @Property {Schedule} schedule - schedule instance to update
     * @Property {Date} start - start time to update
     * @Property {Date} end - end time to update
     */
    this.fire('beforeUpdateSchedule', {
        schedule: schedule,
        start: schedule.getStarts(),
        end: newEnds
    });
};

/**
 * Drag#dragEnd event handler
 * @emits TimeResize#timeResizeDragend
 * @param {MouseEvent} dragEndEventData - Mouse event of Drag#dragEnd custom event.
 */
TimeResize.prototype._onDragEnd = function(dragEndEventData) {
    var getScheduleDataFunc = this._getScheduleDataFunc,
        dragStart = this._dragStart,
        scheduleData;

    this.dragHandler.off({
        drag: this._onDrag,
        dragEnd: this._onDragEnd,
        click: this._onClick
    }, this);

    if (!getScheduleDataFunc || !dragStart) {
        return;
    }

    scheduleData = getScheduleDataFunc(dragEndEventData.originEvent, {
        targetModelID: dragStart.targetModelID
    });

    scheduleData.range = [
        dragStart.timeY,
        scheduleData.timeY + datetime.millisecondsFrom('hour', 0.5)
    ];

    scheduleData.nearestRange = [
        dragStart.nearestGridTimeY,
        scheduleData.nearestGridTimeY + datetime.millisecondsFrom('hour', 0.5)
    ];

    this._updateSchedule(scheduleData);

    /**
     * @event TimeResize#timeResizeDragend
     * @type {object}
     * @Property {HTMLElement} target - current target in mouse event object.
     * @Property {Time} relatedView - time view instance related with drag start position.
     * @Property {MouseEvent} originEvent - mouse event object.
     * @Property {number} mouseY - mouse Y px mouse event.
     * @Property {number} gridY - grid Y index value related with mouseY value.
     * @Property {number} timeY - milliseconds value of mouseY points.
     * @Property {number} nearestGridY - nearest grid index related with mouseY value.
     * @Property {number} nearestGridTimeY - time value for nearestGridY.
     * @Property {string} targetModelID - The model unique id emitted move schedule.
     * @Property {number[]} range - milliseconds range between drag start and end.
     * @Property {number[]} nearestRange - milliseconds range related with nearestGridY between start and end.
     */
    this.fire('timeResizeDragend', scheduleData);

    this._getScheduleDataFunc = this._dragStart = null;
};

/**
 * @emits TimeResize#timeResizeClick
 */
TimeResize.prototype._onClick = function() {
    this.dragHandler.off({
        drag: this._onDrag,
        dragEnd: this._onDragEnd,
        click: this._onClick
    }, this);

    /**
     * @event TimeResize#timeResizeClick
     */
    this.fire('timeResizeClick');
};

timeCore.mixin(TimeResize);
util.CustomEvents.mixin(TimeResize);

module.exports = TimeResize;

