$(document).ready(function () {
    initMap();
    Property.GetDataForMap();
});
//window.onload = function () {
//    Property.GetDataForMap();
//}
var Property = {
    GetDataForMap: function (sender) {
        var obj = new Object();
        obj.Search = $('#Search').val();
        obj.PageNo = Math.ceil(paging.startIndex / paging.pageSize);
        obj.RecordsPerPage = paging.pageSize;
        obj.SortBy = $('#SortBy').val();
        obj.SortOrder = $('#SortOrder').val();
        $.ajaxExt({
            type: "POST",
            validate: false,
            parentControl: $(sender).parents("form:first"),
            data: $.postifyData(obj),
            messageControl: null,
            showThrobber: false,
            throbberPosition: { my: "left center", at: "right center", of: sender, offset: "5 0" },
            url: baseUrl + siteURL.GetPropertyPagingListForMap,
            //success: function (results, message, status, id, list, obj, url, data) {
            success: function (retModel) {
                // $('#divResult table:first tbody').html(results[0]);
                if (retModel.list != null) {

                    var mapOptions = {
                        center: new google.maps.LatLng(retModel.list[0].PropertyGooglePlacesLocationLat, retModel.list[0].PropertyGooglePlacesLocationLong),
                        zoom: 8,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };
                    var infoWindow = new google.maps.InfoWindow();

                    var map = new google.maps.Map(document.getElementById("dvMap"), mapOptions);
                    for (var i = 0; i < retModel.list.length; i++) {
                        var data = retModel.list[i];
                        var myLatlng = new google.maps.LatLng(retModel.list[i].PropertyGooglePlacesLocationLat, retModel.list[i].PropertyGooglePlacesLocationLong);
                        var marker = new google.maps.Marker({
                            position: myLatlng,
                            map: map,
                            title: retModel.list[i].PropertyGooglePlacesLocation
                        });
                        (function (marker, data) {
                            google.maps.event.addListener(marker, "click", function (e) {
                                infoWindow.setContent(data.PropertyGooglePlacesLocation);
                                infoWindow.open(map, marker);
                            });
                        })(marker, data);
                    }

                }

            }
        });
    },
}