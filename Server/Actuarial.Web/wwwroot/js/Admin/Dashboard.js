var docRecords = {};
var patientRecords = {};
$(document).ready(function () {

    $(".search_postcode").select2(
        {
            placeholder: "Search by postcode",
            multiple: false,
            //maximumSelectionSize: 1,
            ajax: {
                url: siteURL.GetPostList,
                global: false,
                cache: false,
                dataType: 'json',
                data: function (term, page) {

                    return {
                        Search: term,
                        RecordsPerPage: 10,
                        PageNo: page
                    };
                },
                results: function (data) {
                    var results = [];
                    $.each(data, function (index, item) {
                        results.push({
                            id: item.id,
                            text: item.name
                        });

                    });
                    return {
                        results: results
                    };
                }
            },
            initSelection: function (element, callback) {
                var id;
                id = $(element).val();
                if (id != "") {
                    return $.ajax({
                        url: baseUrl + siteURL.GetInitPostCodeList,
                        type: "Get",
                        dataType: "json", global: false,
                        cache: false,
                        data: {
                            Ids: id,
                        }
                    }).done(function (data) {
                        var results;
                        results = [];
                        $.each(data, function (index, item) {
                            results.push({
                                id: item.id,
                                text: item.name
                            });
                        });

                        callback(results);
                    });
                }
            },
        });

    Dashboard.BindMapForDoctor();
    Dashboard.GraphByTypeAppointment();
    Dashboard.GetLevel1DDl();
    Dashboard.GetLevel1DDlForDoctor();
    Dashboard.GetCategoriesChart(0);
    Dashboard.GetDoctorPieChart(0);
    Dashboard.GraphByStatusAppointment();


    $("#ddlLevel1").change(function () {
        Dashboard.GetLevel2DDl(this.value);
    });

    $("#ddlLevel1doctor").change(function () {
        Dashboard.GetLevel2DDlForDoctor(this.value);
    });

    $(document).on('click', '#btnSearchdoctorGraph', function () {

        var cat = 0;
        var ddl1 = $("#ddlLevel1doctor").val();
        if (ddl1 > 0) {
            cat = 1;
        }

        var ddl2 = $("#ddlLevel2doctor").val();
        if (ddl2 > 0) {
            cat = 2;
        }
        Dashboard.GetDoctorPieChart(cat);
    });

    $(document).on('click', '#btnSearchCategoryGraph', function () {

        var cat = 0;
        var ddl1 = $("#ddlLevel1").val();
        if (ddl1 > 0) {
            cat = 1;
        }

        var ddl2 = $("#ddlLevel2").val();
        if (ddl2 > 0) {
            cat = 2;
        }
        Dashboard.GetCategoriesChart(cat);
    });
    $(document).on('click', '#btnClearCategoryGraph', function () {
        $("#txtsuburb").select2('val', null);

        Dashboard.GetLevel1DDl();
        Dashboard.GetCategoriesChart(0);


    });
    $(document).on('click', '#btnClearDoctorGraph', function () {
        $("#txtsuburbdoctor").select2('val', null);

        Dashboard.GetLevel1DDlForDoctor();
        Dashboard.GetDoctorPieChart(0);


    });

    //Dashboard.GetAppointmentDataForBarChart();
    Dashboard.GetUserDataForLineChart(1);
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
        Dashboard.GetAppointmentDataForBarChart($(this).val());
    });

    //$(document).on('change', '.select-user-week', function () {
    //    Dashboard.GetUserDataForLineChart($(this).val())
    //});

    $(document).on('change', '#ddlduration', function () {
        Dashboard.GetUserDataForLineChart($(this).val());
    });

    $(document).on('click', '#btnSearchappointmentgraph', function () {
        Dashboard.GraphByTypeAppointment();

    });

    $(document).on('click', '#btnSearchappointmentStatusgraph', function () {
        Dashboard.GraphByStatusAppointment();

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

    GetUserDataForLineChart: function (d) {
        $.ajaxExt({
            type: "POST",
            validate: false,
            messageControl: null,
            showThrobber: false,
            data: { duration: d },
            url: baseUrl + siteURL.GetDailyUserRegistrationViewModel,
            success: function (results, message, status, id, list, object, url, data) {
                Dashboard.RegisteredUserLineChart(object);
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

    BindBarChart: function (date, data) {
        //set start date and enddate labels
        $('.spn-appointmentdate').html(new Date(data.currentWeek.start).toShortFormat() + " - " + new Date(data.currentWeek.end).toShortFormat());



        Chart.defaults.global.defaultFontFamily = "Lato";
        Chart.defaults.global.defaultFontSize = 12;

        var rejectedValue = [];
        var acceptedValue = [];
        var requestedValue = [];
        for (var i = 0; i < data.rejectedAppointments.length; i++) {
            rejectedValue[i] = data.rejectedAppointments[i].count;
        }

        for (var i = 0; i < data.acceptedAppointments.length; i++) {
            acceptedValue[i] = data.acceptedAppointments[i].count;
        }

        for (var i = 0; i < data.requestedAppointments.length; i++) {
            requestedValue[i] = data.requestedAppointments[i].count;
        }

        var RejectedData = {
            label: 'Rejected Appointments',
            data: rejectedValue,
            backgroundColor: 'rgb(193, 62, 62)',
            borderWidth: 0,
            //yAxisID: "y-axis-density"
        };

        var AcceptedData = {
            label: 'Accepted Appointments',
            data: acceptedValue,
            backgroundColor: 'rgb(62, 193, 62)',
            borderWidth: 0,
            //yAxisID: "y-axis-gravity"
        };

        var RequestedData = {
            label: 'Requested Appointments',
            data: requestedValue,
            backgroundColor: 'rgba(99, 132, 0, 0.6)',
            borderWidth: 0,
            //yAxisID: "y-axis-wravity"
        };

        var lbls = [];
        var curDate = new Date(data.currentWeek.start);
        for (var i = 0; i <= 6; i++) {
            var newdate = new Date(data.currentWeek.start);
            newdate.setDate(new Date(data.currentWeek.start).getDate() + i);
            lbls[i] = newdate.toShortFormat();
        }

        //alert(lbls);
        var planetData = {
            labels: lbls,
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
        document.getElementById("containerappointmentChart").innerHTML = '&nbsp;';
        document.getElementById("containerappointmentChart").innerHTML = '<canvas id="appointmentChart" width="300" height="200"></canvas>';
        var densityCanvas = document.getElementById("appointmentChart");

        var barChart = new Chart(densityCanvas, {
            type: 'bar',
            data: planetData,
            options: chartOptions
        });
    },

    RegisteredUserLineChart: function (data) {
        // $('.spn-userdate').html(new Date(data.currentWeek.start).toShortFormat() + " - " + new Date(data.currentWeek.end).toShortFormat());

        //  var lbls = [];
        // var curDate = new Date(data.currentWeek.start);
        //for (var i = 0; i <= 6; i++) {
        //    var newdate = new Date(data.currentWeek.start);
        //    newdate.setDate(new Date(data.currentWeek.start).getDate() + i);
        //    lbls[i] = newdate.toShortFormat();
        //}
        //  var doctorValue = [];
        //  var patientValue = [];
        //for (var i = 0; i < data.doctorList.length; i++) {
        //    doctorValue[i] = data.doctorList[i].count;
        //}
        //for (var i = 0; i < data.patientList.length; i++) {
        //    patientValue[i] = data.patientList[i].count;
        //}

        //var PatientData = {
        //    label: 'Patients',
        //    data: data.patientList,
        //    backgroundColor: 'rgb(193, 62, 62)',
        //    borderWidth: 0,
        //    //yAxisID: "y-axis-density"
        //};

        //var DoctorData = {
        //    label: 'Doctors',
        //    data: data.doctorList,
        //    backgroundColor: 'rgb(62, 193, 62)',
        //    borderWidth: 0,
        //    //yAxisID: "y-axis-gravity"
        //};

        var config = {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Doctors',
                    fill: false,
                    backgroundColor: window.chartColors.blue,
                    borderColor: window.chartColors.blue,
                    data: data.doctorList
                }, {
                    label: 'Patients',
                    fill: false,
                    backgroundColor: window.chartColors.red,
                    borderColor: window.chartColors.red,
                    data: data.patientList
                }]
            },
            options: {
                responsive: true,
                //title: {
                //    display: true,
                //    text: 'Weekly users'
                //},
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
                            labelString: 'Dates'
                        },
                        ticks: {
                            stepSize: 1,
                            min: 0,
                            autoSkip: false
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
        document.getElementById("containerregisteredUserChart").innerHTML = '&nbsp;';
        document.getElementById("containerregisteredUserChart").innerHTML = '<canvas id="registeredUserChart" width="300" height="200"></canvas>';
        var ctx = document.getElementById('registeredUserChart').getContext('2d');
        window.myLine = new Chart(ctx, config);
    },



    // Rohit //

    GetLevel1DDl: function () {
        $.ajaxExt({
            type: "Get",
            validate: false,
            messageControl: null,
            showThrobber: false,
            url: baseUrl + siteURL.GetLevel1ddl,
            success: function (results, message, status, id, list, object, url, data) {
                $("#ddlLevel1").html("");
                var optionhtml1 = '<option value="' +
                    0 + '">' + "Level1" + '</option>';
                $("#ddlLevel1").append(optionhtml1);

                $.each(list, function (i) {

                    var optionhtml = '<option value="' +
                        list[i].value + '">' + list[i].text + '</option>';
                    $("#ddlLevel1").append(optionhtml);
                });

                $("#ddlLevel2").html("");
                var optionhtml2 = '<option value="' +
                    0 + '">' + "Level2" + '</option>';
                $("#ddlLevel2").append(optionhtml2);
            }
        });
    },

    GetLevel1DDlForDoctor: function () {
        $.ajaxExt({
            type: "Get",
            validate: false,
            messageControl: null,
            showThrobber: false,
            url: baseUrl + siteURL.GetLevel1ddl,
            success: function (results, message, status, id, list, object, url, data) {
                $("#ddlLevel1doctor").html("");
                var optionhtml1 = '<option value="' +
                    0 + '">' + "Level1" + '</option>';
                $("#ddlLevel1doctor").append(optionhtml1);

                $.each(list, function (i) {

                    var optionhtml = '<option value="' +
                        list[i].value + '">' + list[i].text + '</option>';
                    $("#ddlLevel1doctor").append(optionhtml);
                });

                $("#ddlLevel2doctor").html("");
                var optionhtml2 = '<option value="' +
                    0 + '">' + "Level2" + '</option>';
                $("#ddlLevel2doctor").append(optionhtml2);
            }
        });
    },

    GetLevel2DDl: function (id) {
        $.ajaxExt({
            type: "Get",
            validate: false,
            messageControl: null,
            showThrobber: false,
            data: { lvl1Id: id },
            url: baseUrl + siteURL.GetLevel2ddl,
            success: function (results, message, status, id, list, object, url, data) {
                $("#ddlLevel2").html("");
                var optionhtml1 = '<option value="' +
                    0 + '">' + "--Select Level2--" + '</option>';
                $("#ddlLevel2").append(optionhtml1);

                $.each(list, function (i) {

                    var optionhtml = '<option value="' +
                        list[i].value + '">' + list[i].text + '</option>';
                    $("#ddlLevel2").append(optionhtml);
                });
            }
        });
    },
    GetLevel2DDlForDoctor: function (id) {
        $.ajaxExt({
            type: "Get",
            validate: false,
            messageControl: null,
            showThrobber: false,
            data: { lvl1Id: id },
            url: baseUrl + siteURL.GetLevel2ddl,
            success: function (results, message, status, id, list, object, url, data) {
                $("#ddlLevel2doctor").html("");
                var optionhtml1 = '<option value="' +
                    0 + '">' + "--Select Level2--" + '</option>';
                $("#ddlLevel2doctor").append(optionhtml1);

                $.each(list, function (i) {

                    var optionhtml = '<option value="' +
                        list[i].value + '">' + list[i].text + '</option>';
                    $("#ddlLevel2doctor").append(optionhtml);
                });
            }
        });
    },

    GetCategoriesChart: function (cattype) {
        var sub = $("#txtsuburb").val();
        var lv1 = $("#ddlLevel1").val();
        var lv2 = $("#ddlLevel2").val();
        $.ajaxExt({
            type: "POST",
            validate: false,
            messageControl: null,
            showThrobber: false,
            data: { suburb: sub, catType: cattype, level1Id: lv1, level2Id: lv2 },
            url: baseUrl + siteURL.GetCategoriesGraph,
            success: function (results, message, status, id, list, object, url, data) {
                Dashboard.BindCategoriesBarChart(object);
            }
        });
    },

    BindCategoriesBarChart: function (d) {

        Chart.defaults.global.defaultFontFamily = "Lato";
        Chart.defaults.global.defaultFontSize = 12;

        var data = {
            label: d.label,
            data: d.data,
            backgroundColor: d.backgroundColor,
            borderWidth: d.borderWidth,
            //yAxisID: "y-axis-density"
        };

        var lbls = d.labelsheading;
        //alert(lbls);
        var planetData = {
            labels: lbls,
            datasets: [data]
        };

        var chartOptions = {
            scales: {
                xAxes: [{
                    barPercentage: 1,
                    categoryPercentage: 0.6
                }],
                yAxes: [{
                    display: true,
                    ticks: {
                        min: 0,
                        beginAtZero: true
                    }
                }]
            }
        };
        document.getElementById("containercategoryChart").innerHTML = '&nbsp;';
        document.getElementById("containercategoryChart").innerHTML = '<canvas id="categoryChart"></canvas>';
        var densityCanvas = document.getElementById("categoryChart");

        var barChart = new Chart(densityCanvas, {
            type: 'bar',
            data: planetData,
            options: chartOptions
        });
    },


    GetDoctorPieChart: function (cattype) {
        var sub = $("#txtsuburbdoctor").val();
        var lv1 = $("#ddlLevel1doctor").val();
        var lv2 = $("#ddlLevel2doctor").val();
        $.ajaxExt({
            type: "POST",
            validate: false,
            messageControl: null,
            showThrobber: false,
            data: { suburb: sub, catType: cattype, level1Id: lv1, level2Id: lv2 },
            url: baseUrl + siteURL.GetDoctorsPieChart,
            success: function (results, message, status, id, list, object, url, data) {
                Dashboard.BindDoctorPieChart(object);
            }
        });
    },

    BindDoctorPieChart: function PropertiesPieChart(d) {
        // Global Options:
        Chart.defaults.global.defaultFontColor = 'black';
        Chart.defaults.global.defaultFontSize = 16;

        var data = {
            labels: d.labelsheading,
            datasets: [
                {
                    fill: true,
                    backgroundColor: [
                        '#1991EB',
                        '#8db3cc', '#c13e3e'],
                    data: d.data,
                    // Notice the borderColor 
                    //borderColor: ['black', 'black'],
                    //borderWidth: [2, 2]
                }
            ]
        };

        // Notice the rotation from the documentation.

        var options = {
            rotation: -0.7 * Math.PI
        };


        // Chart declaration:
        document.getElementById("containerdoctorChart").innerHTML = '&nbsp;';
        document.getElementById("containerdoctorChart").innerHTML = '<canvas id="doctorpieChart"></canvas>';
        var ctx = document.getElementById("doctorpieChart");
        var myBarChart = new Chart(ctx, {
            type: 'pie',
            data: data,
            options: options
        });
    },


   GraphByTypeAppointment: function () {

       var startdate = $('#minDateappointment').val();
       var enddate = $('#maxDateappointment').val();

       $('#divappointmentgraph').empty();
       $('#divappointmentgraph').append('<canvas id="AppointmentGraph"></canvas>');
       $.get(baseUrl + siteURL.GetAppointmentGraph, { startdate: startdate, enddate: enddate }, function (data) {

            // multiple bar chart 

           var ctx = document.getElementById("AppointmentGraph");
            var mybarChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.object.labels,
                    datasets: data.object.graphModellist
                },

                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }

                }
            });
        });
    },


    GraphByStatusAppointment: function () {
        var startdate = $('#minDateappointmentStatus').val();
        var enddate = $('#maxDateappointmentStatus').val();

        $('#divappointmentStatusgraph').empty();
        $('#divappointmentStatusgraph').append('<canvas id="AppointmentStatusGraph"></canvas>');
        $.get(baseUrl + siteURL.GetAppointmnetStatusGraph, { startdate: startdate, enddate: enddate }, function (data) {

            // multiple bar chart 
            
            $('#spnAcceptClaims').html(data.object.acceptAppt);
            $('#spnCompleteClaims').html(data.object.completeAppt);
            $('#spnPendingClaims').html(data.object.pendingAppt);
            $('#spnRejectClaims').html(data.object.rejectAppt);

            var ctx = document.getElementById("AppointmentStatusGraph");
            var mybarChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.object.labels,
                    datasets: data.object.graphModellist
                },

                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }

                }
            });
        });
    }

};


