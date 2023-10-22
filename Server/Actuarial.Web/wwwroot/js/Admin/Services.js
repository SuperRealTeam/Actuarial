$(document).ready(function () {
    $(document).on('click', '#btnAddUpdateService', function () {
        return Service.AddUpdateDetails($(this));
    });

    $(document).on('click', '.delete-Service', function () {
        Service.DeleteService($(this).data('serviceid'));
    })

    $(document).on('click', '.enable-Service', function () {
        Service.EnableDisableServiceRecord($(this).data('serviceid'));
    })

    $(document).on('click', '.edit-Service', function () {
        window.location.href = baseUrl + siteURL.EditService + '/' + $(this).data('serviceid');
    });

    $(document).on('click', '.details-Service', function () {
        window.location.href = baseUrl + siteURL.DetailsService + '/' + $(this).data('serviceid');
    });


    $(document).on('click', 'input[type=button]#btnFilterVersion', function () {
        return Service.ManageServices($(this));
    });

    $("select#showRecords").on("change", function () {
        return Service.ShowRecords($(this));
    });

    $(document).on('click', '.sorting', function () {
        return Service.SortServices($(this));
    });
    $('#Search').keypress(function (e) {
        if (e.which === 13)  // the enter key code
            return Service.SearchServices($(this));
    });
})

var Service = {
    AddUpdateDetails: function (sender) {
        var form = $("form");
        $.ajaxExt({
            url: baseUrl + siteURL.AddUpdateServiceDetails,
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
                    window.location.href = siteURL.ServicesList;
                }, 3000);
            }
        });
        return false;
    },

    SortServices: function (sender) {
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

    ManageServices: function (totalCount) {
        var totalRecords = 0;
        totalRecords = parseInt(totalCount);
        //alert(totalRecords);
        PageNumbering(totalRecords);
    },

    SearchServices: function (sender) {
        paging.startIndex = 1;
        Paging(sender);
    },

    ShowRecords: function (sender) {
        paging.startIndex = 1;
        paging.pageSize = parseInt($(sender).find('option:selected').val());
        Paging(sender);
    },

    DeleteService: function (id) {
        $.ConfirmBox("", "Are you sure?", null, true, "Yes", true, null, function () {
            $.ajaxExt({
                type: 'POST',
                validate: false,
                showErrorMessage: true,
                messageControl: $('div.messageAlert'),
                showThrobber: true,
                url: baseUrl + siteURL.DeleteService,
                data: { ServiceId: id },
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
    EnableDisableServiceRecord: function (sender) {
        $.ConfirmBox("", "Are you sure?", null, true, "Yes", true, null, function () {
            $.ajaxExt({
                type: 'POST',
                validate: false,
                showErrorMessage: true,
                messageControl: $('div.messageAlert'),
                showThrobber: true,
                url: baseUrl + siteURL.EnableDisableService,
                data: { ServiceId: sender },
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
        url: baseUrl + siteURL.GetServicesPagingList,
        success: function (results, message) {
            $('#divResult table:first tbody').html(results[0]);
            PageNumbering(results[1]);

        }
    });
}