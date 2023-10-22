$(document).ready(function () {
    $(document).on('click', '#AddUpdateDetails', function () {
        return User.AddUpdateDetails($(this));
    });
    $(document).on('click', '#btnChangePassword', function () {
        return User.ChangePassword($(this));
    });
})

var User = {
    AddUpdateDetails: function (sender) {
        var form = $("form");
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
            success: function (results, message) {
                debugger
                $.ShowMessage($('div.messageAlert'), message, MessageType.Success);
                setTimeout(function () {

                }, 3000);
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
                if (status == ActionStatus.Successfull)
                {
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