$(document).ready(function () {
    $(document).on('click', '#AddUpdateRequest', function () {
        return Domicile.RequestToSwitchAgency($(this));
    });
    $('#approveModal').on('shown.bs.modal', function () {
        $("#msgtext").html("");
    })
    $('#approveModal').on('hide.bs.modal', function () {
        $(".txt").removeClass('txt');
    })
    $(document).on('click', '#btnApproveRequest', function () {
        if ($(".txt").val()) {
            $("#msgtext").html("");
            var requestId = $("#DomicileRequestApprovalsId").val();
            var status = $("#Status").val();
            var text = $(".txt").val();
            Domicile.RequestAction(requestId, text, status);
            setTimeout(function () { $('#approveModal').trigger('click.dismiss.bs.modal'); }, 2000);
        }
        else
            $("#msgtext").html("Please add value");
    })

    $(document).on('click', '.approve', function () {
        $('#token').show();
        $('#rejectreason').hide();
        $('#modalheader').text('Add Token');
        $("#DomicileRequestApprovalsId").val($(this).data("requestid"));
        $("#Status").val($(this).data("status"));
        $("#token").addClass('txt');
        $('#approveModal').modal('show');
    })

    $(document).on('click', '.reject', function () {
        $('#rejectreason').show();
        $('#token').hide();
        $('#modalheader').text('Add Comment');
        $("#DomicileRequestApprovalsId").val($(this).data("requestid"));
        $("#Status").val($(this).data("status"));
        $("#rejectreason").addClass('txt');;
        $('#approveModal').modal('show');
    })


    $(document).on('click', 'input[type=button]#btnFilterVersion', function () {
        return Domicile.ManageDomiciles($(this));
    });

    $("select#showRecords").on("change", function () {
        return Domicile.ShowRecords($(this));
    });

    $(document).on('click', '.sorting', function () {
        return Domicile.SortDomicile($(this));
    });

    $('#Search').keypress(function (e) {
        if (e.which === 13)  // the enter key code
            return Domicile.SearchDomicile($(this));
    });
});


var Domicile = {

    RequestToSwitchAgency: function (sender) {
        var form = $("form");
        $.ajaxExt({
            url: baseUrl + siteURL.RequestToSwitchAgency,
            type: 'POST',
            validate: true,
            formToValidate: form,
            formToPost: form,
            isAjaxForm: true,
            showThrobber: false,
            showErrorMessage: true,
            messageControl: $('div.messageAlert'),
            success: function (results, message, status) {
                $.ShowMessage($('div.messageAlert'), message, status);
                setTimeout(function () {
                    window.location.href = baseUrl + siteURL.ListingDomicile;
                }, 3000);
            }
        });
        return false;
    },

    RequestAction: function (requestId, text, status) {

        $.ajaxExt({
            type: 'POST',
            validate: false,
            showErrorMessage: true,
            messageControl: $('div.messageAlert'),
            showThrobber: true,
            url: baseUrl + siteURL.RequestAction,
            data: { requestId: requestId, Text: text, status: status },
            success: function (results, message, status) {

                $.ShowMessage($('div.messageAlert'), message, status);
                $('#approveModal').modal('hide');
                Paging();
            }
        });


    },

    ManageDomiciles: function (totalCount) {
        var totalRecords = 0;
        totalRecords = parseInt(totalCount);
        //alert(totalRecords);
        PageNumbering(totalRecords);
    },

    ShowRecords: function (sender) {
        paging.startIndex = 1;
        paging.pageSize = parseInt($(sender).find('option:selected').val());
        Paging(sender);
    },

    SortDomicile: function (sender) {
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
    SearchDomicile: function (sender) {
        paging.startIndex = 1;
        Paging(sender);
    },
}

function Paging(sender) {
    var obj = new Object();
    obj.Search = $('#Search').val();
    obj.PageNo = Math.ceil(paging.startIndex / paging.pageSize);
    obj.RecordsPerPage = paging.pageSize;
    obj.SortBy = $('#SortBy').val();
    obj.SortOrder = $('#SortOrder').val();
    obj.Category = $('#cur-category').val();
    $.ajaxExt({
        type: "POST",
        validate: false,
        parentControl: $(sender).parents("form:first"),
        data: $.postifyData(obj),
        messageControl: null,
        showThrobber: false,
        throbberPosition: { my: "left center", at: "right center", of: sender, offset: "5 0" },
        url: baseUrl + siteURL.GetDomicilePagingList,
        success: function (results, message) {
            $('#divResult table:first tbody').html(results[0]);
            PageNumbering(results[1]);

        }
    });
}