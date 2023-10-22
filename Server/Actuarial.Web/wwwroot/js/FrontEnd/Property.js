$(document).ready(function () {
    $(".search_postcode").select2(
        {
            placeholder: "Search by postcode",
            multiple: true,
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
                    console.log(results)
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


    // bind filter on page load
    $('.ctrFilter').each(function () {
        if ($(this)[0].type == 'checkbox') {

            if ($(this).prop('checked') == true) {

                var liId = 'li' + $(this)[0].dataset.type;
                var li = '<li id=' + liId + '><a href="javascript:;"><span>' + $(this)[0].dataset.type + '</span><i data-type=' + $(this)[0].dataset.type + ' class="fas fa-times clear_filter"></i></a></li>';

                $('#filterul').append(li);
            }
            else {

            }


        }
        else {
            if ($(this).val() != '') {
                var liId = 'li' + $(this)[0].dataset.type;
                var li = '<li id=' + liId + '><a href="javascript:;"><span>' + $(this)[0].dataset.type + '</span><i data-type=' + $(this)[0].dataset.type + ' class="fas fa-times clear_filter"></i></a></li>';

                $('#filterul').append(li);
            }
        }

    })
})

$(document).on('click', '.make-an-offer', function () {
    if ($('#HasSolicitorDetails').val() == 'True') {
        $('#AddOfferModal').modal('show');
    }
    else {
        $('#addSolicitorModal').modal('show');
    }
});

$(document).on('click', '#btnAddUpdateSolicitorDetail', function () {
    return Property.AddSolicitorDetails($(this));
})


$(document).on('click', '.btn-search', function () {
    var qstr = generatestringUrl();
    window.location.href = siteURL.Property + "?" + qstr;

    //return Property.SearchPropertys($(this));
});
$(document).on('click', '.property_detail', function () {
    window.location.href = siteURL.PropertyDetails + "/" + $(this).data('property_uid');
});

$(document).on('click', '#btnAddOffer', function () {
    if ($('#chkTermsOfOffer').is(":checked")) {
        $(".checkmark1").text("");
        return Property.AddOffer($(this));
    }
    else {
        $(".checkmark1").text("Please accept Terms");
    }
})

$("#txtamount").keyup(function () {
    var VAL = this.value;

    var amount = /^\d+(?:\.\d\d?)?$/;

    if (amount.test(VAL)) {
        $("#msgtext").html("");
    }
    else {
        $("#msgtext").html("InvalidDecimalValue");
    }
});
$(document).on('click', '.prop_wishlist', function () {
    return Property.AddWishlist($(this).data('property_uid'), $(this));
})

$(document).on('change', '.ctrFilter', function () {
    var aa = $(this)[0].dataset.type;
    if ($('#li' + $(this)[0].dataset.type).length > 0) {
        $('#li' + $(this)[0].dataset.type).remove();
    }

    if ($(this)[0].type == 'checkbox') {


        if ($(this).prop('checked') == true) {

            var liId = 'li' + $(this)[0].dataset.type;
            var li = '<li id=' + liId + '><a href="javascript:;"><span>' + $(this)[0].dataset.type + '</span><i data-type=' + $(this)[0].dataset.type + ' class="fas fa-times clear_filter"></i></a></li>';

            $('#filterul').append(li);
        }
        else {

        }


    }
    else {
        if ($(this).val() != '') {
            var liId = 'li' + $(this)[0].dataset.type;
            var li = '<li id=' + liId + '><a href="javascript:;"><span>' + $(this)[0].dataset.type + '</span><i data-type=' + $(this)[0].dataset.type + ' class="fas fa-times clear_filter"></i></a></li>';

            $('#filterul').append(li);
        }
    }

})

$(document).on('click', '.clear_filter', function () {
    var ctr = $('#' + $(this)[0].dataset.type)

    if (ctr[0].type == 'checkbox') {
        ctr.prop('checked', false);
    }
    else {
        ctr.val('');
    }


    $(this).parent('a').parent('li').remove();
})

$(document).on('change', '#SortOrder', function () {
    Paging();
})

var Property = {
    AddSolicitorDetails: function (sender) {
        var form = $("#FormSolicitorDetails");
        $.ajaxExt({
            type: 'POST',
            validate: true,
            formToValidate: form,
            formToPost: form,
            isAjaxForm: true,
            isScroll: false,
            showErrorMessage: true,
            messageControl: $('div.messageAlert'),
            showThrobber: true,
            url: baseUrl + siteURL.AddSolicitorDetails,
            success: function (results, message, status) {
                $.ShowMessage($('div.messageAlert'), message, status);
                setTimeout(function () {
                    window.location.reload();
                }, 3000);
            }
        });
    },

    SearchPropertys: function (sender) {
        paging.startIndex = 1;
        Paging(sender);
    },

    AddOffer: function (sender) {
        var form = $("#form_AddOffer");
        $.ajaxExt({
            type: 'POST',
            validate: true,
            formToValidate: form,
            formToPost: form,
            isAjaxForm: true,
            showErrorMessage: true,
            messageControl: $('div.messageAlert'),
            showThrobber: true,
            url: baseUrl + siteURL.AddOffer,
            success: function (results, message, status) {

                $.ShowMessage($('div.messageAlert'), message, status);
                setTimeout(function () {
                    window.location.reload();
                }, 3000);
            }
        });


    },
    AddWishlist: function (propertyId, ctrl) {

        $.ajaxExt({
            type: 'POST',
            validate: false,
            showErrorMessage: true,
            messageControl: $('div.messageAlert'),
            showThrobber: true,
            url: baseUrl + siteURL.AddWishlist,
            data: { propertyId: propertyId },
            success: function (results, message, status, id) {
                $.ShowMessage($('div.messageAlert'), message, status);
                if (id > 0) {
                    $($(ctrl).children('img')[0]).attr("src", "/images/love.png");
                }
                else {
                    $($(ctrl).children('img')[0]).attr("src", "/images/like.png");

                }
            }
        });
    },
}


function generatestringUrl() {

    var loc = $("#Search").val();
    var minbed = $("#Minbeds").val();
    var maxBeds = $("#Maxbeds").val();
    var minPrice = $("#MinPrice").val();
    var maxPrice = $("#MaxPrice").val();
    var Bathrooms = $("#Bathrooms").val();
    var CarParking = $("#CarParking").val();
    var LivingArea = $("#LivingArea").val();
    var PropertyType = $("#PropertyType").val();


    var qstr = '';
    if (loc != '') {
        qstr = qstr + "loc=" + loc;
    }
    if (minbed != '') {
        if (qstr != '') {
            qstr = qstr + "&";
        }
        qstr = qstr + "minbed=" + minbed;
    }
    if (maxBeds != '') {
        if (qstr != '') {
            qstr = qstr + "&";
        }
        qstr = qstr + "maxBeds=" + maxBeds;
    }
    if (minPrice != '') {
        if (qstr != '') {
            qstr = qstr + "&";
        }
        qstr = qstr + "minPrice=" + minPrice;
    }
    if (maxPrice != '') {
        if (qstr != '') {
            qstr = qstr + "&";
        }
        qstr = qstr + "maxPrice=" + maxPrice;
    }
    if (Bathrooms != '') {
        if (qstr != '') {
            qstr = qstr + "&";
        }
        qstr = qstr + "Bathrooms=" + Bathrooms;
    }
    if (CarParking != '') {
        if (qstr != '') {
            qstr = qstr + "&";
        }
        qstr = qstr + "CarParking=" + CarParking;
    }
    if (LivingArea != '') {
        if (qstr != '') {
            qstr = qstr + "&";
        }
        qstr = qstr + "LivingArea=" + LivingArea;
    }
    if (PropertyType != '') {
        if (qstr != '') {
            qstr = qstr + "&";
        }
        qstr = qstr + "PropertyType=" + PropertyType;
    }

    if ($("#Balcony").prop("checked") == true) {
        if (qstr != '') {
            qstr = qstr + "&";
        }
        qstr = qstr + "Balcony=" + true;
    }
    if ($("#SecureParking").prop("checked") == true) {
        if (qstr != '') {
            qstr = qstr + "&";
        }
        qstr = qstr + "SecureParking=" + true;
    }
    if ($("#AlarmSystem").prop("checked") == true) {
        if (qstr != '') {
            qstr = qstr + "&";
        }
        qstr = qstr + "AlarmSystem=" + true;
    }
    if ($("#Gym").prop("checked") == true) {
        if (qstr != '') {
            qstr = qstr + "&";
        }
        qstr = qstr + "Gym=" + true;
    }
    if ($("#AirConditioning").prop("checked") == true) {
        if (qstr != '') {
            qstr = qstr + "&";
        }
        qstr = qstr + "AirConditioning=" + true;
    }
    if ($("#BuiltInWardrobes").prop("checked") == true) {
        if (qstr != '') {
            qstr = qstr + "&";
        }
        qstr = qstr + "BuiltInWardrobes=" + true;
    }

    return qstr;
}
//function Paging(sender) {
//	var obj = new Object();
//	obj.Search = $('#Search').val();
//	obj.PageNo = Math.ceil(paging.startIndex / paging.pageSize);
//	obj.RecordsPerPage = paging.pageSize;
//	obj.SortBy = $('#SortBy').val();
//	obj.SortOrder = $('#SortOrder').val();
//	obj.cat = $('.active').children().data('cat');
//	obj.minPrice = $('#minPrice').val();
//	obj.maxPrice = $('#maxPrice').val();
//	obj.minBedsCount = $('#minBeds').val();
//	obj.maxBedsCount = $('#maxBeds').val();
//	$.ajaxExt({
//		type: "POST",
//		validate: false,
//		parentControl: $(sender).parents("form:first"),
//		data: $.postifyData(obj),
//		messageControl: null,
//		showThrobber: false,
//		throbberPosition: { my: "left center", at: "right center", of: sender, offset: "5 0" },
//		url: baseUrl + siteURL.GetPropertyPagingList,
//		success: function (results, message) {
//			$('.search-list').html(results[0]);
//			PageNumbering(results[1]);
//		}
//	});
//}

function Paging(sender) {

    var qstr = generatestringUrl();

    var SortOrder = $("#SortOrder").val();

    if (qstr != '') {
        qstr = qstr + "&";
    }
    qstr = qstr + "PageNo=" + paging.startIndex;
    if (qstr != '') {
        qstr = qstr + "&";
    }
    qstr = qstr + "RecordsPerPage=" + paging.pageSize;

    if (SortOrder > 0) {
        if (qstr != '') {
            qstr = qstr + "&";
        }
        qstr = qstr + "SortOrder=" + SortOrder;
    }

    window.location.href = siteURL.Property + "?" + qstr;
}