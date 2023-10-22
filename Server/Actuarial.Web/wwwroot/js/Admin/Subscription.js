var rowCount = 1;
var dateFormat = 'mm/dd/yyyy';
$(document).ready(function () {

    $(document).on('click', '#AddUpdateDetails', function () {
        return Subscription.AddUpdateDetails($(this));
    });


    $(document).on('click', '.delete-Subscription', function () {
        Subscription.DeleteSubscriptionRecord($(this).data('subscriptionid'));
    })
  
    $(document).on('click', '.enable-Subscription', function () {
        Subscription.EnableDisableSubscriptionRecord($(this).data('subscriptionid'));
    })

    $(document).on('click', 'input[type=button]#btnFilterVersion', function () {
        return Subscription.ManageSubscriptions($(this));
    });

    $("select#showRecords").on("change", function () {
        return Subscription.ShowRecords($(this));
    });

    $(document).on('click', '.sorting', function () {
        return Subscription.SortSubscriptions($(this));
    });

    $(document).on('click', '.edit-Subscription', function () {
        window.location.href = baseUrl + siteURL.EditSubscription + '/' + $(this).data('subscriptionid');
    });

    $(document).on('click', '.details-Subscription', function () {
        window.location.href = baseUrl + siteURL.DetailsSubscription + '/' + $(this).data('subscriptionid');
    });

    $('#Search').keypress(function (e) {
        if (e.which === 13)  // the enter key code
            return Subscription.SearchSubscriptions($(this));
    });
})

var Subscription = {
    AddUpdateDetails: function (sender) {
        var form = $("form");
        $.ajaxExt({
            url: baseUrl + siteURL.AddUpdateSubscriptionDetails,
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
                    window.location.href = siteURL.SubscriptionList;
                }, 3000);
            }
        });
        return false;
    },
    SortSubscriptions: function (sender) {
        if ($(sender).hasClass("sorting_asc")) {
            $('.sorting').removeClass("sorting_asc");
            $('.sorting').removeClass("sorting_desc")
            $(sender).addClass("sorting_desc");
            $('#SortBy').val($(sender).attr('data-sortby'));
            $('#SortOrder').val('Desc');
            paging.startIndex = 1;
            paging.currentPage = 0;
            Paging();
        } else {
            $('.sorting').removeClass("sorting_asc");
            $('.sorting').removeClass("sorting_desc")
            $(sender).addClass("sorting_asc");
            $('#SortBy').val($(sender).attr('data-sortby'));
            $('#SortOrder').val('Asc');
            paging.startIndex = 1;
            paging.currentPage = 0;
            Paging();
        }
    },

    ManageSubscriptions: function (totalCount) {
        var totalRecords = 0;
        totalRecords = parseInt(totalCount);
        //alert(totalRecords);
        PageNumbering(totalRecords);
    },

    SearchSubscriptions: function (sender) {
        paging.startIndex = 1;
        Paging(sender);
    },

    ShowRecords: function (sender) {
        paging.startIndex = 1;
        paging.pageSize = parseInt($(sender).find('option:selected').val());
        Paging(sender);
    },

    CompleteSubscriptionRecord: function (id) {
        $.ConfirmBox("", "Are you sure want to complete this record?", null, true, "Yes", true, null, function () {
            $.ajaxExt({
                type: 'POST',
                validate: false,
                showErrorMessage: true,
                messageControl: $('div.messageAlert'),
                showThrobber: true,
                url: baseUrl + siteURL.CompleteSubscription,
                data: { SubscriptionID: id },
                success: function (results, message, status) {
                    $.ShowMessage($('div.messageAlert'), message, status);
                    setTimeout(function () {
                        Paging();
                    }, 3000);
                }
            });
        }, "", function () {
        });
    },
    DeleteSubscriptionRecord: function (id) {
        $.ConfirmBox("", "Are you sure?", null, true, "Yes", true, null, function () {
            $.ajaxExt({
                type: 'POST',
                validate: false,
                showErrorMessage: true,
                messageControl: $('div.messageAlert'),
                showThrobber: true,
                url: baseUrl + siteURL.DeleteSubscription,
                data: { SubscriptionID: id },
                success: function (results, message, status) {
                    debugger;
                    $.ShowMessage($('div.messageAlert'), message, status);
                    setTimeout(function () {
                        Paging();
                    }, 3000);
                }
            });
        }, "", function () {

        });
    },
    EnableDisableSubscriptionRecord: function (sender) {
        $.ConfirmBox("", "Are you sure?", null, true, "Yes", true, null, function () {
            $.ajaxExt({
                type: 'POST',
                validate: false,
                showErrorMessage: true,
                messageControl: $('div.messageAlert'),
                showThrobber: true,
                url: baseUrl + siteURL.EnableDisableSubscription,
                data: { SubscriptionID: sender },
                success: function (results, message, status) {
                    $.ShowMessage($('div.messageAlert'), message, status);
                    Paging();
                }
            });
        }, "", function () {
        });
    },
    

}
function Paging(sender) {
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
        url: baseUrl + siteURL.GetSubscriptionPagingList,
        success: function (results, message) {
            $('#divResult table:first tbody').html(results[0]);
            PageNumbering(results[1]);

        }
    });
}
function countChar(val) {
    var len = val.value.length;
    if (len >= 500) {
        val.value = val.value.substring(0, 500);
    } else {
        $(this).next().html("Remaining character :" + 500 - len);
    }
};