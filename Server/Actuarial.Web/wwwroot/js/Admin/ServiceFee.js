
$(document).ready(function () {
    $(document).on('click', '#btnAddUpdateServiceFee', function () {
        return ServiceFee.AddUpdateDetails($(this));
    });
    $(document).on('click', '#btnUpdatebankdetail', function () {
         return ServiceFee.AddUpdateBankDetails($(this));
    });
    
});

var ServiceFee = {
    AddUpdateDetails: function (sender) {
        var form = $("form#formServiceFee");
        $.ajaxExt({
            url: baseUrl + siteURL.AddUpdateServiceFee,
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
                    window.location.reload();
                }, 3000);
            }
        });
        return false;
    },


    AddUpdateBankDetails: function (sender) {
        var form = $("form#formBankDetails");
        $.ajaxExt({
            url: baseUrl + siteURL.AddUpdateBankdetails,
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
                    window.location.reload();
                }, 3000);
            }
        });
        return false;
    },
};