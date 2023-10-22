
var mapViewDoc = {
    BindMapForPatient: function () {
        $.ajaxExt({
            type: "POST",
            validate: false,
            messageControl: null,
            showThrobber: false,
            url: baseUrl + siteURL.GetPatientDetailsForMap,
            success: function (results, message, status, id, list, object, url, data) {
                setTimeout(function () {
                    var mapArray = {};
                    for (var i = 0; i < list.length; i++) {
                        var rec = {
                            lat: list[i].latitude,
                            lng: list[i].longitude,
                            name: list[i].firstName + " " + list[i].lastName,
                            description: list[i].address,
                            color: "#6dcacc",
                            //  url: (object[i].userType == 2 ? siteURL.DoctorDetails : siteURL.PatientDetails) + '/' + object[i].uid
                        }
                        mapArray[i] = rec;
                    };
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
                            div: "mapPatientView",
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
                }, 1000);
            }
        });
    }
}