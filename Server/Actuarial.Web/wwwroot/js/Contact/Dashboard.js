$(document).ready(function () {

    $(document).on('click', '#AddUpdateContactDetails', function () {
        return User.AddUpdateDetails($(this));
    });

    $(document).on('click', '#btnChangePassword', function () {
        return User.ChangePassword($(this));
    });
    $(document).on('change', '.MaritalStatus', function () {
        if ($(this).val() == '1') {
            $('.spouseName').val("");
            $('.spouseMobile').val("");
            $('.SpouseEmail').val("");
            $('.anniversary').val("");
            $('.spouseName').prop("disabled", "disabled");
            $('.spouseMobile').prop("disabled", "disabled");
            $('.anniversary').prop("disabled", "disabled");
            $('.SpouseEmail').prop("disabled", "disabled");

        }
        else {
            $('.spouseName').prop("disabled", false);
            $('.spouseMobile').prop("disabled", false);
            $('.anniversary').prop("disabled", false);
            $('.SpouseEmail').prop("disabled", false);
        }
    });

    $(".postcodes").select2(
        {
            placeholder: "Search by postcode",
            multiple: true,
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
})

var User = {
    AddUpdateDetails: function (sender) {
        var form = $("form#ContactProfile");
        $.ajaxExt({
            url: baseUrl + siteURL.AddUpdateUserDetails,
            type: 'POST',
            validate: true,
            formToValidate: form,
            formToPost: form,
            isAjaxForm: true,
            showThrobber: false,
            showErrorMessage: true,
            messageControl: $('div.messageAlert'),
            success: function (results, message, status, id, list, object, url, data) {
                $.ShowMessage($('div.messageAlert'), message, MessageType.Success);
                if (status == ActionStatus.Successfull) {
                    setTimeout(function () {
                        window.location.href = baseUrl + siteURL.ProfileDetails;
                    }, 3000);
                }
            }
        });

        //alert($("iframe").parent("#myModal"));
        //$("iframe").parent(".add-contact-popup").hide();
        //$("iframe").parent("#myModal").hide();//.trigger('click.dismiss.bs.modal');
        return false;
    },
    ChangePassword: function (sender) {
        var form = $("form#ChangePassword");
        $.ajaxExt({
            url: baseUrl + siteURL.ChangePassword,
            type: 'POST',
            validate: true,
            formToValidate: form,
            isScroll: false,
            formToPost: form,
            isAjaxForm: true,
            showThrobber: false,
            messageControl: $('div.messageAlert'),
            success: function (results, message, status, id, list, object, url, data) {
                debugger
                $.ShowMessage($('div.messageAlert'), message, status);
                if (status == ActionStatus.Successfull) {
                    $('#divChangePassword').modal('hide');
                    $(form).reset();
                }
            },
            error: function (message, id, data) {

            }
        });

        //alert($("iframe").parent("#myModal"));
        //$("iframe").parent(".add-contact-popup").hide();
        //$("iframe").parent("#myModal").hide();//.trigger('click.dismiss.bs.modal');
        return false;
    },


}