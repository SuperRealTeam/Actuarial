$(document).ready(function () {
    $(document).on('click', '#btnSendGlobalNotification', function () {
        return Notification.SendNotification($(this));
    });
});
var Notification = {
    SendNotification: function (sender) {
        var form = $("form#formGlobalNotification");
        $.ajaxExt({
            url: baseUrl + siteURL.SendGlobalNotification,
            type: 'POST',
            validate: true,
            formToValidate: form,
            formToPost: form,
            isAjaxForm: true,
            showThrobber: false,
            showErrorMessage: true,
            messageControl: $('div.messageAlert'),
            success: function (results, message) {
                $.ShowMessage($('div.messageAlert'), message, MessageType.Success);
                setTimeout(function () {
                    window.location.href = siteURL.Dashboard;
                }, 3000);
            }
        });
        return false;
    }
};