/**
 * @fileoverview Handling move schedules from drag handler and time grid view
 * @author NHN Ent. FE Development Team <dl_javascript@nhnent.com>
 */
'use strict';

var util = require('tui-code-snippet');
var config = require('../../config');
var datetime = require('../../common/datetime');
var domutil = require('../../common/domutil');
var TZDate = require('../../common/timezone').Date;
var timeCore = require('./core');
var TimeMoveGuide = require('./moveGuide');

/**
 * @constructor
 * @implements {Handler}
 * @mixes timeCore
 * @mixes util.CustomEvents
 * @param {Drag} [dragHandler] - Drag handler instance.
 * @param {TimeGrid} [timeGridView] - TimeGrid view instance.
 * @param {Base} [baseController] - Base controller instance.
 */
function TimeMove(dragHandler, timeGridView, baseController) {
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
     * @type {TimeMoveGuide}
     */
    this._guide = new TimeMoveGuide(this);

    dragHandler.on('dragStart', this._onDragStart, this);
}

/**
 * Destroy method.
 */
TimeMove.prototype.destroy = function() {
    this._guide.destroy();
    this.dragHandler.off(this);
    this.dragHandler = this.timeGridView = this.baseController =
        this._getScheduleDataFunc = this._dragStart = this._guide = null;
};

/**
 * Check target element is expected condition for activate this plugins.
 * @param {HTMLElement} target - The element to check
 * @returns {boolean|object} - return object when satiate condition.
 */
TimeMove.prototype.checkExpectCondition = function(target) {
    if (!domutil.closest(target, config.classname('.time-schedule'))) {
        return false;
    }

    return this._getTimeView(target);
};

/**
 * Get Time view container from supplied element.
 * @param {HTMLElement} target - element to find time view container.
 * @returns {object|boolean} - return time view instance when finded.
 */
TimeMove.prototype._getTimeView = function(target) {
    var container = domutil.closest(target, config.classname('.time-date')),
        matches;

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
 * @emits TimeMove#timeMoveDragstart
 * @param {object} dragStartEventData - Drag#dragStart schedule data.
 */
TimeMove.prototype._onDragStart = function(dragStartEventData) {
    var target = dragStartEventData.target,
        timeView = this.checkExpectCondition(target),
        blockElement = domutil.closest(target, config.classname('.time-date-schedule-block')),
        getScheduleDataFunc,
        scheduleData,
        ctrl = this.baseController,
        targetModelID,
        targetModel;

    if (!timeView || !blockElement) {
        return;
    }

    targetModelID = domutil.getData(blockElement, 'id');
    targetModel = ctrl.schedules.items[targetModelID];

    if (targetModel.isReadOnly) {
        return;
    }

    getScheduleDataFunc = this._getScheduleDataFunc = this._retriveScheduleData(timeView);
    scheduleData = this._dragStart = getScheduleDataFunc(
        dragStartEventData.originEvent, {
            targetModelID: targetModelID,
            model: targetModel
        }
    );

    this.dragHandler.on({
        drag: this._onDrag,
        dragEnd: this._onDragEnd,
        click: this._onClick
    }, this);

    /**
     * @event TimeMove#timeMoveDragstart
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
     * @Property {Schedule} model - model instance
     */
    this.fire('timeMoveDragstart', scheduleData);
};

/**
 * @emits TimeMove#timeMoveDrag
 * @param {MouseEvent} dragEventData - mousemove event object
 * @param {string} [overrideEventName] - name of emitting event to override.
 * @param {function} [revise] - supply function for revise schedule data before emit.
 */
TimeMove.prototype._onDrag = function(dragEventData, overrideEventName, revise) {
    var getScheduleDataFunc = this._getScheduleDataFunc,
        timeView = this._getTimeView(dragEventData.target),
        dragStart = this._dragStart,
        scheduleData;

    if (!timeView || !getScheduleDataFunc || !dragStart) {
        return;
    }

    scheduleData = getScheduleDataFunc(dragEventData.originEvent, {
        currentView: timeView,
        targetModelID: dragStart.targetModelID
    });

    if (revise) {
        revise(scheduleData);
    }

    /**
     * @event TimeMove#timeMoveDrag
     * @type {object}
     * @Property {HTMLElement} target - current target in mouse event object.
     * @Property {Time} relatedView - time view instance related with drag start position.
     * @Property {MouseEvent} originEvent - mouse event object.
     * @Property {number} mouseY - mouse Y px mouse event.
     * @Property {number} gridY - grid Y index value related with mouseY value.
     * @Property {number} timeY - milliseconds value of mouseY points.
     * @Property {number} nearestGridY - nearest grid index related with mouseY value.
     * @Property {number} nearestGridTimeY - time value for nearestGridY.
     * @Property {Time} currentView - time view instance related with current mouse position.
     * @Property {string} targetModelID - The model unique id emitted move schedule.
     */
    this.fire(overrideEventName || 'timeMoveDrag', scheduleData);
};

/**
 * Update model instance by dragend event results.
 * @fires TimeMove#beforeUpdateSchedule
 * @param {object} scheduleData - schedule data from TimeMove#timeMoveDragend
 */
TimeMove.prototype._updateSchedule = function(scheduleData) {
    var ctrl = this.baseController,
        modelID = scheduleData.targetModelID,
        range = scheduleData.nearestRange,
        timeDiff = range[1] - range[0],
        dateDiff = 0,
        schedule = ctrl.schedules.items[modelID],
        relatedView = scheduleData.relatedView,
        currentView = scheduleData.currentView,
        scheduleDuration,
        dateStart,
        dateEnd,
        newStarts,
        newEnds,
        baseDate;

    if (!schedule || !currentView) {
        return;
    }

    timeDiff -= datetime.millisecondsFrom('minutes', 30);
    baseDate = new TZDate(relatedView.getDate());
    dateStart = datetime.start(baseDate);
    dateEnd = datetime.end(baseDate);
    newStarts = new TZDate(schedule.getStarts().getTime() + timeDiff);
    newEnds = new TZDate(schedule.getEnds().getTime() + timeDiff);
    scheduleDuration = schedule.duration();

    if (currentView) {
        dateDiff = currentView.getDate() - relatedView.getDate();
    }

    if (newStarts < dateStart) {
        newStarts = new TZDate(dateStart.getTime());
        newEnds = new TZDate(newStarts.getTime() + scheduleDuration.getTime());
    } else if (newEnds > dateEnd) {
        newEnds = new TZDate(dateEnd.getTime());
        newStarts = new TZDate(newEnds.getTime() - scheduleDuration.getTime());
    }

    newStarts = new TZDate(newStarts.getTime() + dateDiff);
    newEnds = new TZDate(newEnds.getTime() + dateDiff);

    /**
     * @event TimeMove#beforeUpdateSchedule
     * @type {object}
     * @Property {Schedule} schedule - schedule instance to update
     * @Property {Date} start - start time to update
     * @Property {Date} end - end time to update
     */
    this.fire('beforeUpdateSchedule', {
        schedule: schedule,
        start: newStarts,
        end: newEnds
    });
};

/**
 * @emits TimeMove#timeMoveDragend
 * @param {MouseEvent} dragEndEventData - mouseup mouse event object.
 */
TimeMove.prototype._onDragEnd = function(dragEndEventData) {
    var getScheduleDataFunc = this._getScheduleDataFunc,
        currentView = this._getTimeView(dragEndEventData.target),
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
        currentView: currentView,
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
     * @event TimeMove#timeMoveDragend
     * @type {object}
     * @Property {HTMLElement} target - current target in mouse event object.
     * @Property {Time} relatedView - time view instance related with drag start position.
     * @Property {Time} currentView - time view instance related with current mouse position.
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
    this.fire('timeMoveDragend', scheduleData);
};

/**
 * @emits TimeMove#timeMoveClick
 * @param {MouseEvent} clickEventData - click mouse event object.
 */
TimeMove.prototype._onClick = function(clickEventData) {
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

    scheduleData = getScheduleDataFunc(clickEventData.originEvent, {
        targetModelID: dragStart.targetModelID
    });

    /**
     * @event TimeMove#timeMoveClick
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
    this.fire('timeMoveClick', scheduleData);
};

timeCore.mixin(TimeMove);
util.CustomEvents.mixin(TimeMove);

module.exports = TimeMove;

