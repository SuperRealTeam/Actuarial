$(document).ready(function () {
    $(document).on('click', '#btnAddUpdateRating', function () {
        return Rating.AddUpdateDetails($(this));
    });

    $(document).on('click', '.delete-Rating', function () {
        Rating.DeleteRating($(this).data('ratingid'));
    })

    $(document).on('click', '.enable-Rating', function () {
        Rating.EnableDisableRatingRecord($(this).data('ratingid'));
    })

    $(document).on('click', '.edit-Rating', function () {
        window.location.href = baseUrl + siteURL.EditRating + '/' + $(this).data('ratingid');
    });

    $(document).on('click', '.details-Rating', function () {
        window.location.href = baseUrl + siteURL.DetailsRating + '/' + $(this).data('ratingid');
    });


    $(document).on('click', 'input[type=button]#btnFilterVersion', function () {
        return Rating.ManageRatings($(this));
    });

    $("select#showRecords").on("change", function () {
        return Rating.ShowRecords($(this));
    });

    $(document).on('click', '.sorting', function () {
        return Rating.SortRatings($(this));
    });
    $('#Search').keypress(function (e) {
        if (e.which === 13)  // the enter key code
            return Rating.SearchRatings($(this));
    });
})

var Rating = {
    AddUpdateDetails: function (sender) {
        var form = $("form#Rating");
        $.ajaxExt({
            url: baseUrl + siteURL.AddUpdateRatingDetails,
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
                    window.location.href = siteURL.Rating;
                }, 3000);
            }
        });
        return false;
    },

    SortRatings: function (sender) {
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

    ManageRatings: function (totalCount) {
        var totalRecords = 0;
        totalRecords = parseInt(totalCount);
        //alert(totalRecords);
        PageNumbering(totalRecords);
    },

    SearchRatings: function (sender) {
        paging.startIndex = 1;
        Paging(sender);
    },

    ShowRecords: function (sender) {
        paging.startIndex = 1;
        paging.pageSize = parseInt($(sender).find('option:selected').val());
        Paging(sender);
    },

    DeleteRating: function (id) {
        $.ConfirmBox("", "Are you sure?", null, true, "Yes", true, null, function () {
            $.ajaxExt({
                type: 'POST',
                validate: false,
                showErrorMessage: true,
                messageControl: $('div.messageAlert'),
                showThrobber: true,
                url: baseUrl + siteURL.DeleteRating,
                data: { RatingId: id },
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
    EnableDisableRatingRecord: function (sender) {
        $.ConfirmBox("", "Are you sure?", null, true, "Yes", true, null, function () {
            $.ajaxExt({
                type: 'POST',
                validate: false,
                showErrorMessage: true,
                messageControl: $('div.messageAlert'),
                showThrobber: true,
                url: baseUrl + siteURL.EnableDisableRating,
                data: { RatingId: sender },
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
        url: baseUrl + siteURL.GetRatingPagingList,
        success: function (results, message) {
            $('#divResult table:first tbody').html(results[0]);
            PageNumbering(results[1]);

        }
    });
}