var docRecords = {};
var patientRecords = {};
$(document).ready(function () {

    Dashboard.BindMapForDoctor();

    $(document).on('click', '.current-map-view', function () {

        $('.current-map-view').removeClass("btn-add");
        $(this).toggleClass("btn-add")
        if ($(this).data('viewtype') == "1") {
            Dashboard.BindMapForDoctor();
        }
        else {
            Dashboard.BindMapForPatient();
        }

    });

    $(document).on('change', '.select-appointment-week', function () {
        Dashboard.GetAppointmentDataForBarChart($(this).val())
    });

});

var Dashboard = {

    BindMapForDoctor: function () {
        $.ajaxExt({
            type: "POST",
            validate: false,
            messageControl: null,
            showThrobber: false,
            url: baseUrl + siteURL.GetDoctorDetailsForMap,
            success: function (results, message, status, id, list, object, url, data) {
                Dashboard.BindMapWithID(list, 1);
            }
        });
    },

    BindMapForPatient: function () {
        $.ajaxExt({
            type: "POST",
            validate: false,
            messageControl: null,
            showThrobber: false,
            url: baseUrl + siteURL.GetPatientDetailsForMap,
            success: function (results, message, status, id, list, object, url, data) {
                setTimeout(function () {
                    Dashboard.BindMapWithID(list, 2);
                }, 1000);
            }
        });
    },

    GetAppointmentDataForBarChart: function (date) {
        $.ajaxExt({
            type: "POST",
            validate: false,
            messageControl: null,
            data: { date: date },
            showThrobber: false,
            url: baseUrl + siteURL.GetDailyAppointmnetViewModel,
            success: function (results, message, status, id, list, object, url, data) {
                Dashboard.BindBarChart(date, object);
            }
        });
    },

    GetUserDataForLineChart: function (date) {
        $.ajaxExt({
            type: "POST",
            validate: false,
            messageControl: null,
            showThrobber: false,
            data: { date: date },
            url: baseUrl + siteURL.GetDailyUserRegistrationViewModel,
            success: function (results, message, status, id, list, object, url, data) {
                Dashboard.BindBarChart(date, object);
            }
        });
    },


    BindMapWithID: function (object, mapType) {

        var mapArray = {};
        for (var i = 0; i < object.length; i++) {
            var rec = {
                lat: object[i].latitude,
                lng: object[i].longitude,
                name: object[i].firstName + " " + object[i].lastName,
                description: object[i].address,
                color: "#6dcacc",
                //  url: (object[i].userType == 2 ? siteURL.DoctorDetails : siteURL.PatientDetails) + '/' + object[i].uid
            }
            mapArray[i] = rec;
        };
        if (mapType === 1)
            docRecords = mapArray;
        else
            patientRecords = mapArray;

        var simplemaps_australiamap_mapdata = {
            main_settings: {
                //General settings
                width: "responsive", //or 'responsive'
                background_color: "#FFFFFF",
                background_transparent: "yes",
                popups: "detect",

                //State defaults
                state_description: "State description",
                state_color: "#88A4BC",
                state_hover_color: "#3B729F",
                state_url: "https://simplemaps.com",
                border_size: 1.5,
                border_color: "#ffffff",
                all_states_inactive: "no",
                all_states_zoomable: "yes",

                //Location defaults
                location_description: "Location description",
                location_color: "#FF0067",
                location_opacity: 0.8,
                location_hover_opacity: 1,
                location_url: "",
                location_size: 35,
                location_type: "marker",
                location_border_color: "#FFFFFF",
                location_border: 2,
                location_hover_border: 2.5,
                all_locations_inactive: "no",
                all_locations_hidden: "no",

                //Label defaults
                label_color: "#ffffff",
                label_hover_color: "#ffffff",
                label_size: 22,
                label_font: "Arial",
                hide_labels: "no",

                //Zoom settings
                manual_zoom: "yes",
                back_image: "no",
                arrow_box: "no",
                navigation_size: "20",
                navigation_color: "white",
                navigation_hover_color: "grey",
                navigation_border_color: "#636363",
                initial_back: "yes",
                initial_zoom: -1,
                initial_zoom_solo: "no",
                region_opacity: 1,
                region_hover_opacity: 0.6,
                zoom_out_incrementally: "yes",
                zoom_percentage: 0.99,
                zoom_time: 1,

                //Popup settings
                popup_color: "white",
                popup_opacity: 0.9,
                popup_shadow: 1,
                popup_corners: 5,
                popup_font: "12px/1.5 Verdana, Arial, Helvetica, sans-serif",
                popup_nocss: "no",

                //Advanced settings
                div: "mapView",
                auto_load: "yes",
                rotate: "0",
                url_new_tab: "yes",
                images_directory: "default",
                import_labels: "no",
                fade_time: 0.1,
                link_text: "View Website"
            },
            state_specific: {
                CT: {
                    name: "Australian Capital Territory",
                    description: "default",
                    color: "default",
                    hover_color: "default",
                    url: "default"
                },
                JB: {
                    name: "Jervis Bay Territory",
                    description: "default",
                    color: "default",
                    hover_color: "default",
                    url: "default"
                },
                NS: {
                    name: "New South Wales",
                    description: "default",
                    color: "default",
                    hover_color: "default",
                    url: "default"
                },
                NT: {
                    name: "Northern Territory",
                    description: "default",
                    color: "default",
                    hover_color: "default",
                    url: "default"
                },
                QL: {
                    name: "Queensland",
                    description: "default",
                    color: "default",
                    hover_color: "default",
                    url: "default"
                },
                SA: {
                    name: "South Australia",
                    description: "default",
                    color: "default",
                    hover_color: "default",
                    url: "default"
                },
                TS: {
                    name: "Tasmania",
                    description: "default",
                    color: "default",
                    hover_color: "default",
                    url: "default"
                },
                VI: {
                    name: "Victoria",
                    description: "default",
                    color: "default",
                    hover_color: "default",
                    url: "default"
                },
                WA: {
                    name: "Western Australia",
                    description: "default",
                    color: "default",
                    hover_color: "default",
                    url: "default"
                }
            },
            locations: mapArray,
        };
        simplemaps_australiamap.mapdata = simplemaps_australiamap_mapdata;
        simplemaps_australiamap.load();
    },

    DynamicMapBinding: function (divID, mapArray) {
        var simplemaps_australiamap_mapdata = {
            main_settings: {
                //General settings
                width: "responsive", //or 'responsive'
                background_color: "#FFFFFF",
                background_transparent: "yes",
                popups: "detect",

                //State defaults
                state_description: "State description",
                state_color: "#88A4BC",
                state_hover_color: "#3B729F",
                state_url: "https://simplemaps.com",
                border_size: 1.5,
                border_color: "#ffffff",
                all_states_inactive: "no",
                all_states_zoomable: "yes",

                //Location defaults
                location_description: "Location description",
                location_color: "#FF0067",
                location_opacity: 0.8,
                location_hover_opacity: 1,
                location_url: "",
                location_size: 35,
                location_type: "marker",
                location_border_color: "#FFFFFF",
                location_border: 2,
                location_hover_border: 2.5,
                all_locations_inactive: "no",
                all_locations_hidden: "no",

                //Label defaults
                label_color: "#ffffff",
                label_hover_color: "#ffffff",
                label_size: 22,
                label_font: "Arial",
                hide_labels: "no",

                //Zoom settings
                manual_zoom: "yes",
                back_image: "no",
                arrow_box: "no",
                navigation_size: "20",
                navigation_color: "white",
                navigation_hover_color: "grey",
                navigation_border_color: "#636363",
                initial_back: "yes",
                initial_zoom: -1,
                initial_zoom_solo: "no",
                region_opacity: 1,
                region_hover_opacity: 0.6,
                zoom_out_incrementally: "yes",
                zoom_percentage: 0.99,
                zoom_time: 1,

                //Popup settings
                popup_color: "white",
                popup_opacity: 0.9,
                popup_shadow: 1,
                popup_corners: 5,
                popup_font: "12px/1.5 Verdana, Arial, Helvetica, sans-serif",
                popup_nocss: "no",

                //Advanced settings
                div: divID,
                auto_load: "yes",
                rotate: "0",
                url_new_tab: "yes",
                images_directory: "default",
                import_labels: "no",
                fade_time: 0.1,
                link_text: "View Website"
            },
            state_specific: {
                CT: {
                    name: "Australian Capital Territory",
                    description: "default",
                    color: "default",
                    hover_color: "default",
                    url: "default"
                },
                JB: {
                    name: "Jervis Bay Territory",
                    description: "default",
                    color: "default",
                    hover_color: "default",
                    url: "default"
                },
                NS: {
                    name: "New South Wales",
                    description: "default",
                    color: "default",
                    hover_color: "default",
                    url: "default"
                },
                NT: {
                    name: "Northern Territory",
                    description: "default",
                    color: "default",
                    hover_color: "default",
                    url: "default"
                },
                QL: {
                    name: "Queensland",
                    description: "default",
                    color: "default",
                    hover_color: "default",
                    url: "default"
                },
                SA: {
                    name: "South Australia",
                    description: "default",
                    color: "default",
                    hover_color: "default",
                    url: "default"
                },
                TS: {
                    name: "Tasmania",
                    description: "default",
                    color: "default",
                    hover_color: "default",
                    url: "default"
                },
                VI: {
                    name: "Victoria",
                    description: "default",
                    color: "default",
                    hover_color: "default",
                    url: "default"
                },
                WA: {
                    name: "Western Australia",
                    description: "default",
                    color: "default",
                    hover_color: "default",
                    url: "default"
                }
            },
            locations: mapArray,
        };
        simplemaps_australiamap.mapdata = simplemaps_australiamap_mapdata;
        simplemaps_australiamap.load();
    },
    ConvertDateToString: function () {
    }, 
    BindBarChart: function (date, data) {
        //set start date and enddate labels
        $('.spn-startdate').html(new Date(data.currentWeek.start))
        $('.spn-enddate').html(new Date(data.currentWeek.end))

        var densityCanvas = document.getElementById("appointmentChart");

        Chart.defaults.global.defaultFontFamily = "Lato";
        Chart.defaults.global.defaultFontSize = 12;

        var RejectedData = {
            label: 'Rejected Appointments',
            data: [5, 14, 20, 18, 11, 3, 30],
            backgroundColor: 'rgb(193, 62, 62)',
            borderWidth: 0,
            //yAxisID: "y-axis-density"
        };

        var AcceptedData = {
            label: 'Accepted Appointments',
            data: [5, 4, 10, 80, 1, 0, 40],
            backgroundColor: 'rgb(62, 193, 62)',
            borderWidth: 0,
            //yAxisID: "y-axis-gravity"
        };

        var RequestedData = {
            label: 'Requested Appointments',
            data: [0, 14, 25, 35, 5, 20, 10],
            backgroundColor: 'rgba(99, 132, 0, 0.6)',
            borderWidth: 0,
            //yAxisID: "y-axis-wravity"
        };

        var planetData = {
            labels: ["04/08/2019", "04/09/2019", "04/10/2019", "04/11/2019", "04/12/2019", "04/13/2019", "04/14/2019"],
            datasets: [RejectedData, AcceptedData, RequestedData]
        };

        var chartOptions = {
            scales: {
                xAxes: [{
                    barPercentage: 1,
                    categoryPercentage: 0.6
                }],
                //yAxes: [{
                //    id: "y-axis-density"
                //}, {
                //    id: "y-axis-gravity"
                //    },
                //    {
                //        id: "y-axis-wravity"
                //    }]
            }
        };

        var barChart = new Chart(densityCanvas, {
            type: 'bar',
            data: planetData,
            options: chartOptions
        });

    },

    RegisteredUserLineChart: function () {

        var config = {
            type: 'line',
            data: {
                labels: ["04/08/2019", "04/09/2019", "04/10/2019", "04/11/2019", "04/12/2019", "04/13/2019", "04/14/2019"],
                datasets: [{
                    label: 'Doctors',
                    fill: false,
                    backgroundColor: window.chartColors.blue,
                    borderColor: window.chartColors.blue,
                    data: [
                        25, 45, 12, 15, 10, 12, 0
                    ],
                }, {
                    label: 'Patients',
                    fill: false,
                    backgroundColor: window.chartColors.green,
                    borderColor: window.chartColors.green,
                    borderDash: [5, 5],
                    data: [
                        15, 5, 10, 5, 13, 2, 0
                    ],
                }, {
                    label: 'Overall',
                    backgroundColor: window.chartColors.red,
                    borderColor: window.chartColors.red,
                    data: [
                        40, 50, 22, 20, 23, 14, 0
                    ],
                    fill: true,
                }]
            },
            options: {
                responsive: true,
                title: {
                    display: true,
                    text: 'Weekly users'
                },
                tooltips: {
                    mode: 'index',
                    intersect: false,
                },
                hover: {
                    mode: 'nearest',
                    intersect: true
                },
                scales: {
                    xAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Weekly'
                        }
                    }],
                    yAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Count'
                        }
                    }]
                }
            }
        };
        var ctx = document.getElementById('registeredUserChart').getContext('2d');
        window.myLine = new Chart(ctx, config);
    }

}