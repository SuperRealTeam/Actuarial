'use strict';
var CalList = [];
/* eslint-disable require-jsdoc */
/* eslint-env jquery */
/* global moment, tui, chance */
/* global findCalendar, CalendarList, ScheduleList, generateSchedule */

(function (window, Calendar) {
    var cal, resizeThrottled;
    var useCreationPopup = true;
    var useDetailPopup = true;
    var datePicker, selectedCalendar;

    cal = new Calendar('#calendar', {
        defaultView: 'month',
        useCreationPopup: useCreationPopup,
        useDetailPopup: useDetailPopup,
        calendars: CalendarList,
        template: {
            milestone: function (model) {
                return '<span class="calendar-font-icon ic-milestone-b"></span> <span style="background-color: '
                    + "#f59260" + '">' + model.title + '</span>';
            },
            allday: function (schedule) {
                return getTimeTemplate(schedule, true);
            },
            time: function (schedule) {
                return getTimeTemplate(schedule, false);
            }
        }
    });

    // event handlers
    cal.on({
        'clickMore': function (e) {
            console.log('clickMore', e);
        },
        'clickSchedule': function (e) {
            console.log('clickSchedule', e);
            if (e.schedule.calendarId == "1") {
                if (e.schedule.raw.creator.name != "") {
                    $('.tui-full-calendar-section-detail').append("<div class='tui-full-calendar-popup-detail-item'><span class='tui-full-calendar-content b-rec'>" + e.schedule.raw.creator.name + "</span></div>")
                }
                if (e.schedule.raw.creator.phone != "") {
                    $('.tui-full-calendar-section-detail').append("<div class='tui-full-calendar-popup-detail-item'><span class='tui-full-calendar-content b-rec'>" + e.schedule.raw.creator.phone + "</span></div>")
                }
                if (e.schedule.raw.creator.email != "") {
                    $('.tui-full-calendar-section-detail').append("<div class='tui-full-calendar-popup-detail-item'><span class='tui-full-calendar-content b-rec'>" + e.schedule.raw.creator.email + "</span></div>")
                }
            }


        },
        'clickDayname': function (date) {
            console.log('clickDayname', date);
        },
        'beforeCreateEditPopup': function (e) {
            
        },
        'beforeCreateSchedule': function (e) {
            console.log('beforeCreateSchedule', e);
            //e.guide.clearGuideElement();
            if (e.calendarId != "3") {
                saveNewSchedule(e);
            }
            else {
                $.ShowMessage($('div.messageAlert'), "You can not create task from here. Please create from task module.", MessageType.Error);
            }
        },
        'beforeUpdateSchedule': function (e) {
            console.log('beforeUpdateSchedule', e);
            e.schedule.start = e.start;
            e.schedule.end = e.end;
            if (e.schedule.calendarId != "3") {
                UpdateSchedule(e);
            }
            else {
                $.ShowMessage($('div.messageAlert'), "You can not update task from here. Please create from task module.", MessageType.Error);
            }
            // cal.updateSchedule(e.schedule.id, e.schedule.calendarId, e.schedule);
        },
        'beforeDeleteSchedule': function (e) {
            console.log('beforeDeleteSchedule', e);
            //var answer = confirm('Are you sure you want to delete this?');
            //if (answer) {
            Reminder.DeleteReminder(e.schedule);
            //cal.deleteSchedule(e.schedule.id, e.schedule.calendarId);
            //}
            //else {

            //}

        },
        'afterRenderSchedule': function (e) {
            var schedule = e.schedule;
            // var element = cal.getElement(schedule.id, schedule.calendarId);
            // console.log('afterRenderSchedule', element);
        },
        'clickTimezonesCollapseBtn': function (timezonesCollapsed) {
            console.log('timezonesCollapsed', timezonesCollapsed);

            if (timezonesCollapsed) {
                cal.setTheme({
                    'week.daygridLeft.width': '77px',
                    'week.timegridLeft.width': '77px'
                });
            } else {
                cal.setTheme({
                    'week.daygridLeft.width': '60px',
                    'week.timegridLeft.width': '60px'
                });
            }

            return true;
        }
    });

    document.getElementById('calendar').addEventListener('keydown', e => {
        console.log('keydown', e);
    });
    document.getElementById('calendar').addEventListener('mousedown', e => {
        //if (e.target.innerText == "Appointment") {
        //    $('#tui-full-calendar-schedule-location').attr('placeholder', 'Location')
        //    $('#tui-full-calendar-schedule-location').addClass('google_map_placeholder form-control')
        //}
        //else {
        //    $('#tui-full-calendar-schedule-location').attr('placeholder', 'Description')
        //    $('#tui-full-calendar-schedule-location').removeClass('google_map_placeholder form-control')
        //}
        //$('#tui-full-calendar-schedule-location').addClass('google_map_placeholder form-control')
        console.log('mousedown', e.target.innerText);
    });
    /**
     * Get time template for time and all-day
     * @param {Schedule} schedule - schedule
     * @param {boolean} isAllDay - isAllDay or hasMultiDates
     * @returns {string}
     */
    function getTimeTemplate(schedule, isAllDay) {
        var html = [];
        var start = moment(schedule.start.toUTCString());
        if (!isAllDay) {
            html.push('<strong>' + start.format('HH:mm') + '</strong> ');
        }
        if (schedule.isPrivate) {
            html.push('<span class="calendar-font-icon ic-lock-b"></span>');
            html.push(' Private');
        } else {
            if (schedule.isReadOnly) {
                html.push('<span class="calendar-font-icon ic-readonly-b"></span>');
            } else if (schedule.recurrenceRule) {
                html.push('<span class="calendar-font-icon ic-repeat-b"></span>');
            } else if (schedule.attendees.length) {
                html.push('<span class="calendar-font-icon ic-user-b"></span>');
            } else if (schedule.location) {
                html.push('<i class="fa fa-list" aria-hidden="true"></i>');
            }
            html.push(' ' + schedule.title);
        }

        return html.join('');
    }

    /**
     * A listener for click the menu
     * @param {Event} e - click event
     */
    function onClickMenu(e) {
        var target = $(e.target).closest('a[role="menuitem"]')[0];
        var action = getDataAction(target);
        var options = cal.getOptions();
        var viewName = '';

        console.log(target);
        console.log(action);
        switch (action) {
            case 'toggle-daily':
                viewName = 'day';
                break;
            case 'toggle-weekly':
                viewName = 'week';
                break;
            case 'toggle-monthly':
                options.month.visibleWeeksCount = 0;
                viewName = 'month';
                break;
            case 'toggle-weeks2':
                options.month.visibleWeeksCount = 2;
                viewName = 'month';
                break;
            case 'toggle-weeks3':
                options.month.visibleWeeksCount = 3;
                viewName = 'month';
                break;
            case 'toggle-narrow-weekend':
                options.month.narrowWeekend = !options.month.narrowWeekend;
                options.week.narrowWeekend = !options.week.narrowWeekend;
                viewName = cal.getViewName();

                target.querySelector('input').checked = options.month.narrowWeekend;
                break;
            case 'toggle-start-day-1':
                options.month.startDayOfWeek = options.month.startDayOfWeek ? 0 : 1;
                options.week.startDayOfWeek = options.week.startDayOfWeek ? 0 : 1;
                viewName = cal.getViewName();

                target.querySelector('input').checked = options.month.startDayOfWeek;
                break;
            case 'toggle-workweek':
                options.month.workweek = !options.month.workweek;
                options.week.workweek = !options.week.workweek;
                viewName = cal.getViewName();

                target.querySelector('input').checked = !options.month.workweek;
                break;
            default:
                break;
        }

        cal.setOptions(options, true);
        cal.changeView(viewName, true);

        setDropdownCalendarType();
        setRenderRangeText();
        setSchedules();
    }

    function onClickNavi(e) {
        var action = getDataAction(e.target);

        switch (action) {
            case 'move-prev':
                cal.prev();
                break;
            case 'move-next':
                cal.next();
                break;
            case 'move-today':
                cal.today();
                break;
            default:
                return;
        }

        setRenderRangeText();
        setSchedules();
    }

    function onNewSchedule() {
        var title = $('#new-schedule-title').val();
        var location = $('#new-schedule-location').val();
        var isAllDay = document.getElementById('new-schedule-allday').checked;
        var start = datePicker.getStartDate();
        var end = datePicker.getEndDate();
        var calendar = selectedCalendar ? selectedCalendar : CalendarList[0];

        if (!title) {
            return;
        }

        cal.createSchedules([{
            id: String(chance.guid()),
            calendarId: calendar.id,
            title: title,
            isAllDay: isAllDay,
            start: start,
            end: end,
            category: isAllDay ? 'allday' : 'time',
            dueDateClass: '',
            color: calendar.color,
            bgColor: calendar.bgColor,
            dragBgColor: calendar.bgColor,
            borderColor: calendar.borderColor,
            raw: {
                location: location
            },
            state: 'Busy'
        }]);

        $('#modal-new-schedule').modal('hide');
    }

    function onChangeNewScheduleCalendar(e) {
        
        var target = $(e.target).closest('a[role="menuitem"]')[0];
        var calendarId = getDataAction(target);
        changeNewScheduleCalendar(calendarId);
    }

    function changeNewScheduleCalendar(calendarId) {
        var calendarNameElement = document.getElementById('calendarName');
        var calendar = findCalendar(calendarId);
        var html = [];

        html.push('<span class="calendar-bar" style="background-color: ' + calendar.bgColor + '; border-color:' + calendar.borderColor + ';"></span>');
        html.push('<span class="calendar-name">' + calendar.name + '</span>');

        calendarNameElement.innerHTML = html.join('');

        selectedCalendar = calendar;
    }

    function createNewSchedule(event) {
        var start = event.start ? new Date(event.start.getTime()) : new Date();
        var end = event.end ? new Date(event.end.getTime()) : moment().add(1, 'hours').toDate();

        if (useCreationPopup) {
            cal.openCreationPopup({
                start: start,
                end: end
            });
        }
    }


    function onChangeCalendars(e) {
        var calendarId = e.target.value;
        var checked = e.target.checked;
        var viewAll = document.querySelector('.lnb-calendars-item input');
        var calendarElements = Array.prototype.slice.call(document.querySelectorAll('#calendarList input'));
        var allCheckedCalendars = true;

        if (calendarId === 'all') {
            allCheckedCalendars = checked;

            calendarElements.forEach(function (input) {
                var span = input.parentNode;
                input.checked = checked;
                span.style.backgroundColor = checked ? span.style.borderColor : 'transparent';
            });

            CalendarList.forEach(function (calendar) {
                calendar.checked = checked;
            });
        } else {
            findCalendar(calendarId).checked = checked;

            allCheckedCalendars = calendarElements.every(function (input) {
                return input.checked;
            });

            if (allCheckedCalendars) {
                viewAll.checked = true;
            } else {
                viewAll.checked = false;
            }
        }

        refreshScheduleVisibility();
    }

    function refreshScheduleVisibility() {
        var calendarElements = Array.prototype.slice.call(document.querySelectorAll('#calendarList input'));

        CalendarList.forEach(function (calendar) {
            cal.toggleSchedules(calendar.id, !calendar.checked, false);
        });

        cal.render(true);

        calendarElements.forEach(function (input) {
            var span = input.nextElementSibling;
            span.style.backgroundColor = input.checked ? span.style.borderColor : 'transparent';
        });
    }

    function setDropdownCalendarType() {
        var calendarTypeName = document.getElementById('calendarTypeName');
        var calendarTypeIcon = document.getElementById('calendarTypeIcon');
        var options = cal.getOptions();
        var type = cal.getViewName();
        var iconClassName;

        if (type === 'day') {
            type = 'Daily';
            iconClassName = 'calendar-icon ic_view_day';
        } else if (type === 'week') {
            type = 'Weekly';
            iconClassName = 'calendar-icon ic_view_week';
        } else if (options.month.visibleWeeksCount === 2) {
            type = '2 weeks';
            iconClassName = 'calendar-icon ic_view_week';
        } else if (options.month.visibleWeeksCount === 3) {
            type = '3 weeks';
            iconClassName = 'calendar-icon ic_view_week';
        } else {
            type = 'Monthly';
            iconClassName = 'calendar-icon ic_view_month';
        }

        calendarTypeName.innerHTML = type;
        calendarTypeIcon.className = iconClassName;
    }

    function setRenderRangeText() {
        var renderRange = document.getElementById('renderRange');
        var options = cal.getOptions();
        var viewName = cal.getViewName();
        var html = [];
        if (viewName === 'day') {
            html.push(moment(cal.getDate().getTime()).format('YYYY.MM.DD'));
        } else if (viewName === 'month' &&
            (!options.month.visibleWeeksCount || options.month.visibleWeeksCount > 4)) {
            html.push(moment(cal.getDate().getTime()).format('YYYY.MM'));
        } else {
            html.push(moment(cal.getDateRangeStart().getTime()).format('YYYY.MM.DD'));
            html.push(' ~ ');
            html.push(moment(cal.getDateRangeEnd().getTime()).format(' MM.DD'));
        }
        renderRange.innerHTML = html.join('');
    }

    function setSchedules() {
        cal.clear();
        //   generateSchedule(cal.getViewName(), cal.getDateRangeStart(), cal.getDateRangeEnd());
        cal.createSchedules(ScheduleList);
        //      cal.createSchedules(CalList);
        refreshScheduleVisibility();
    }

    function setEventListener() {
        
        $('#menu-navi').on('click', onClickNavi);
        $('.dropdown-menu a[role="menuitem"]').on('click', onClickMenu);
        $('#lnb-calendars').on('change', onChangeCalendars);

        $('#btn-save-schedule').on('click', onNewSchedule);
        $('#btn-new-schedule').on('click', createNewSchedule);

        $('#dropdownMenu-calendars-list').on('click', onChangeNewScheduleCalendar);

        window.addEventListener('resize', resizeThrottled);
    }

    function getDataAction(target) {
        return target.dataset ? target.dataset.action : target.getAttribute('data-action');
    }

    resizeThrottled = tui.util.throttle(function () {
        cal.render();
    }, 50);

    window.cal = cal;

    setDropdownCalendarType();
    setRenderRangeText();

    // setSchedules();
    setEventListener();

})(window, tui.Calendar);

// set calendars
(function () {
    var calendarList = document.getElementById('calendarList');
    var html = [];
    CalendarList.forEach(function (calendar) {
        html.push('<div class="lnb-calendars-item"><label>' +
            '<input type="checkbox" class="tui-full-calendar-checkbox-round" value="' + calendar.id + '" checked>' +
            '<span style="border-color: ' + calendar.borderColor + '; background-color: ' + calendar.borderColor + ';"></span>' +
            '<span>' + calendar.name + '</span>' +
            '</label></div>'
        );
    });
    calendarList.innerHTML = html.join('\n');
})();


function saveNewSchedule(scheduleData) {
    
    var calendar = scheduleData.calendar || findCalendar(scheduleData.calendarId);
    var schedule = {
        //id: String(chance.guid()),
        title: scheduleData.title,
        isAllDay: scheduleData.isAllDay,
        start: scheduleData.start,
        end: scheduleData.end,
        category: scheduleData.isAllDay ? 'allday' : 'time',
        dueDateClass: '',
        color: calendar.color,
        bgColor: calendar.bgColor,
        dragBgColor: calendar.bgColor,
        borderColor: calendar.borderColor,
        location: scheduleData.location,
        raw: {
            class: scheduleData.raw['class']
        },
        state: scheduleData.state
    };
    if (calendar) {
        schedule.calendarId = calendar.id;
        schedule.color = calendar.color;
        schedule.bgColor = calendar.bgColor;
        schedule.borderColor = calendar.borderColor;
    }
    Reminder.AddUpdateReminder(schedule);
    //if (ret) {
    //    cal.createSchedules([schedule]);
    //}
}

function UpdateSchedule(e) {
    Reminder.AddUpdateReminder(e.schedule, true)
}

$(document).ready(function () {
    $('.dropdown-menu a[role="menuitem"]').on('click',
        function () {

        }
    );
    Reminder.GetAppointments();
})

var Reminder = {
    AddUpdateReminder: function (schedule, isUpdate) {
        var obj = new Object();
        obj.AppointmentUniqueId = schedule.id;
        obj.ScheduledOnStartDate = schedule.start._date.toString().split(':00 ')[0];
        obj.ScheduledOnEndDate = schedule.end._date.toString().split(':00 ')[0];
        obj.Detail = schedule.location;
        obj.Notes = schedule.title;
        obj.Type = schedule.calendarId;
        obj.IsBusy = schedule.state;
        obj.IsAllDay = schedule.isAllDay;
        $.ajaxExt({
            type: "POST",
            validate: false,
            data: $.postifyData(obj),
            messageControl: null,
            showThrobber: false,
            url: baseUrl + siteURL.AddUpdateReminder,
            success: function (results) {
                if (status = ActionStatus.Successfull) {
                    schedule.id = results.sUID;
                    if (isUpdate) {
                        cal.updateSchedule(schedule.id, schedule.calendarId, schedule);
                        //for (var i = 0; i < CalList.length; i++) {
                        //    if (CalList[i].id == schedule.id) {
                        //        CalList.splice(i, 1);
                        //        CalList.push([Reminder.GetScheduleObject(obj)]);
                        //        //Reminder.GetScheduleObject(obj);
                        //        break;
                        //    }
                        //}
                    }
                    else {
                        cal.createSchedules([schedule]);
                        //   CalList.push([schedule]);
                    }
                    $.ShowMessage($('div.messageAlert'), results.message, results.status);
                    return true;
                }
                else {
                    return false;
                }
            }
        });
        return false;
    },
    DeleteReminder: function (schedule) {
        $.ConfirmBox("", "Are you sure?", null, true, "Yes", true, null, function () {
            $.ajaxExt({
                type: 'POST',
                validate: false,
                showErrorMessage: true,
                messageControl: $('div.messageAlert'),
                showThrobber: true,
                url: baseUrl + siteURL.DeleteReminder,
                data: { uID: schedule.id },
                success: function (results) {
                    ;
                    if (results.status = ActionStatus.Successfull) {
                        cal.deleteSchedule(schedule.id, schedule.calendarId);
                        //for (var i = 0; i < CalList.length; i++) {
                        //    if (CalList[i].id == schedule.id) {
                        //        CalList.splice(i, 1);
                        //        break;
                        //    }
                        //}
                        //CalList.push([schedule]);
                    }
                    $.ShowMessage($('div.messageAlert'), results.message, results.status);
                }
            });
        }, "", function () {

        });
    },
    GetAppointments: function (schedule) {
        $.ajaxExt({
            type: 'GET',
            validate: false,
            showErrorMessage: true,
            messageControl: $('div.messageAlert'),
            showThrobber: true,
            url: baseUrl + siteURL.GetAppointments,
            success: function (results) {
                if (results.status = ActionStatus.Successfull) {
                    Reminder.BindSchedule(results.list);
                }
                //$.ShowMessage($('div.messageAlert'), results.message, results.status);
            }
        });
    },

    BindSchedule: function (list) {
        ScheduleList = [];
        for (var i = 0; i < list.length; i++) {
            var schedule = new ScheduleInfo();
            schedule.id = list[i].appointmentUniqueId;
            schedule.calendarId = String(list[i].type);
            schedule.title = list[i].notes;
            schedule.isAllday = list[i].isAllDay;
            schedule.isReadOnly = list[i].isReadOnly;
            //generateTime(schedule, cal.getDateRangeStart(), cal.getDateRangeEnd());
            if (schedule.isAllday) {
                schedule.category = 'allday';
            }
            else {
                schedule.category = 'time';
            }
            schedule.start = list[i].scheduledOnStartDate;
            schedule.end = list[i].scheduledOnEndDate;
            //  schedule.isPrivate = chance.bool({ likelihood: 10 });
            if (list[i].type == 3) {
                if (list[i].detail != "" && list[i].detail != null)
                    schedule.location = $.parseHTML(list[i].detail)[0].innerHTML;
            }
            else {
                schedule.location = list[i].detail;
            }

            schedule.description = list[i].detail;
            schedule.color = calendar.color;
            schedule.bgColor = calendar.bgColor;
            schedule.dragBgColor = calendar.dragBgColor;
            schedule.borderColor = calendar.borderColor;

            if (schedule.category === 'milestone') {
                schedule.color = schedule.bgColor;
                schedule.bgColor = 'transparent';
                schedule.dragBgColor = 'transparent';
                schedule.borderColor = 'transparent';
            }

            if (list[i].type == 1) {
                schedule.raw.creator = {
                    name: list[i].submittedByName,
                    avatar: '',
                    company: 'BulkBilling',
                    email: list[i].submittedByEmail,
                    phone: list[i].submittedByPhone
                }
            }
            ScheduleList.push(schedule);
        }
        cal.createSchedules(ScheduleList);
        cal.render(true);
    },
    GetScheduleObject: function (scheduleModel) {
        var schedule = new ScheduleInfo();
        schedule.id = scheduleModel.appointmentUniqueId;
        schedule.calendarId = scheduleModel.type;
        schedule.title = scheduleModel.notes;
        schedule.isAllday = scheduleModel.isAllDay;
        schedule.isReadOnly = scheduleModel.isReadOnly;
        //generateTime(schedule, cal.getDateRangeStart(), cal.getDateRangeEnd());
        if (schedule.isAllday) {
            schedule.category = 'allday';
        }
        else {
            schedule.category = 'time';
        }
        schedule.start = scheduleModel.scheduledOnStartDate;
        schedule.end = scheduleModel.scheduledOnEndDate;
        //  schedule.isPrivate = chance.bool({ likelihood: 10 });
        if (scheduleModel.type == 3) {
            schedule.location = $.parseHTML(scheduleModel.detail)[0].innerHTML;
        }
        else {
            schedule.location = scheduleModel.detail;
        }

        schedule.description = scheduleModel.detail;
        schedule.color = calendar.color;
        schedule.bgColor = calendar.bgColor;
        schedule.dragBgColor = calendar.dragBgColor;
        schedule.borderColor = calendar.borderColor;

        if (schedule.category === 'milestone') {
            schedule.color = schedule.bgColor;
            schedule.bgColor = 'transparent';
            schedule.dragBgColor = 'transparent';
            schedule.borderColor = 'transparent';
        }
        if (schedulemo.type == 1) {
            schedule.raw.creator = {
                name: 'Neeraj Thakur',
                avatar: '',
                company: 'Acuratech Global',
                email: 'neeraj.thakur@acuratechglobal.comsadfasdfsadfsadfsadsdafsadfsa',
                phone: '89898989'
            }
        }

        return schedule;
    }
}



