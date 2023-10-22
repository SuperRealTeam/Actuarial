$(document).ready(function () {


    //$(document).on('click', '.cmpl-transaction', function () {
    //    transaction.ConfirmPaid($(this).data('uid'));
    //});

    $(document).on('click', 'input[type=button]#btnFilterVersion', function () {
        return reviews.Managereviews($(this));
    });

    $("select#showRecords").on("change", function () {
        return reviews.ShowRecords($(this));
    });

    $(document).on('click', '.sorting', function () {
        return reviews.Sortreviews($(this));
    });
    $('#Search').keypress(function (e) {
        if (e.which === 13)  // the enter key code
            return reviews.Searchreviews($(this));
    });
});

var reviews = {
    Sortreviews: function (sender) {
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

    Managereviews: function (totalCount) {
        var totalRecords = 0;
        totalRecords = parseInt(totalCount);
        //alert(totalRecords);
        PageNumbering(totalRecords);
    },

    Searchreviews: function (sender) {
        paging.startIndex = 1;
        Paging(sender);
    },

    ShowRecords: function (sender) {
        paging.startIndex = 1;
        paging.pageSize = parseInt($(sender).find('option:selected').val());
        Paging(sender);
    },

    //ConfirmPaid: function (id) {
    //    $.ConfirmBox("", "Are you sure you want to confirm the record?", null, true, "Yes", true, null, function () {
    //        $.ajaxExt({
    //            type: 'POST',
    //            validate: false,
    //            showErrorMessage: true,
    //            messageControl: $('div.messageAlert'),
    //            showThrobber: true,
    //            url: baseUrl + siteURL.ConfirmTransaction,
    //            data: { id: id },
    //            success: function (results, message, status) {
    //                $.ShowMessage($('div.messageAlert'), message, status);
    //                setTimeout(function () {
    //                    Paging();
    //                }, 3000);
    //            }
    //        });
    //    }, "", function () {

    //    });
    //}
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
        url: baseUrl + siteURL.GetReviewAndRatings,
        success: function (results, message) {
            $('#divResult table:first tbody').html(results[0]);
            PageNumbering(results[1]);

        }
    });
}