$(document).ready(function () {


    $(document).on('click', '.cmpl-transaction', function () {
        transaction.ConfirmPaid($(this).data('uid'));
    });

    $(document).on('click', '.search-btn', function () {
        return transaction.SearchTransaction($(this));
    });

    $(document).on('click', 'input[type=button]#btnFilterVersion', function () {
        return transaction.ManageTransaction($(this));
    });

    $("select#showRecords").on("change", function () {
        return transaction.ShowRecords($(this));
    });

    $(document).on('click', '.sorting', function () {
        return transaction.SortTransaction($(this));
    });
    $('#Search').keypress(function (e) {
        if (e.which === 13)  // the enter key code
            return transaction.SearchTransaction($(this));
    });

    $(document).on('click', '.status-nav', function () {
        $('#status').val($(this).data('status'));
        $('.status-nav').each(function () {
            $(this).removeClass('active');
        })
        $(this).addClass('active');
        Paging();
    });

    // check boxes 
    $(document).on('click', '#ckbCheckAll', function () {
        if ($(this).prop("checked")) {
            $(".checkBoxClass").prop("checked", true);
            var chkLen = $(".checkBoxClass").filter(':checked').length;
            if (chkLen > 0) {
                $('#btnCmplttrans').show();
            }
            else {
                $('#btnCmplttrans').hide();
            }
        } else {
            $(".checkBoxClass").prop("checked", false);
            $('#btnCmplttrans').hide();
        }
    });

    $(document).on('click', '.checkBoxClass', function () {
        if ($(this).prop("checked")) {
            $('#btnCmplttrans').show();
        } else {
            var chkLen = $(".checkBoxClass").filter(':checked').length;
            if (chkLen > 0) {
                $('#btnCmplttrans').show();
            }
            else {
                $('#btnCmplttrans').hide();
            }
        }
    });


    $(document).on('click', '#btnCmplttrans', function () {
        var str = '';
        $('.checkBoxClass').each(function () {
            if ($(this).prop("checked")) {
                if (str != '') {
                    str = str + ',';
                }
                str = str + $(this)[0].dataset.offerid;

            }
        });
       // console.log(str);
        transaction.ConfirmPaid(str);
    });



    $(document).on('click', '.dwnld-trans', function () {
        var queryString = "";
        var minDate = $('#minDate').val();
        var maxDate = $('#maxDate').val();
        var Status = $('#status').val();
        window.location.href = siteURL.GetTransactionExcel + "?" + "startDate=" + minDate + "&endDate=" + maxDate + "&Status=" + Status;
    });


});

var transaction = {
    SortTransaction: function (sender) {
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

    ManageTransaction: function (totalCount) {
        var totalRecords = 0;
        totalRecords = parseInt(totalCount);
        //alert(totalRecords);
        PageNumbering(totalRecords);
    },

    SearchTransaction: function (sender) {
        paging.startIndex = 1;
        Paging(sender);
    },

    ShowRecords: function (sender) {
        paging.startIndex = 1;
        paging.pageSize = parseInt($(sender).find('option:selected').val());
        Paging(sender);
    },

    ConfirmPaid: function (id) {
        $.ConfirmBox("", "Are you sure you want to confirm the record?", null, true, "Yes", true, null, function () {
            $.ajaxExt({
                type: 'POST',
                validate: false,
                showErrorMessage: true,
                messageControl: $('div.messageAlert'),
                showThrobber: true,
                url: baseUrl + siteURL.ConfirmTransaction,
                data: { id: id },
                success: function (results, message, status) {
                    $.ShowMessage($('div.messageAlert'), message, status);
                    setTimeout(function () {
                        Paging();
                    }, 3000);
                }
            });
        }, "", function () {

        });
    }
}


function Paging(sender) {
    var obj = new Object();
    obj.Search = $('#Search').val();
    obj.PageNo = Math.ceil(paging.startIndex / paging.pageSize);
    obj.RecordsPerPage = paging.pageSize;
    obj.SortBy = $('#SortBy').val();
    obj.SortOrder = $('#SortOrder').val();
    obj.Status = $('#status').val();
    obj.minDate = $('#minDate').val();
    obj.maxDate = $('#maxDate').val();

    $.ajaxExt({
        type: "POST",
        validate: false,
        parentControl: $(sender).parents("form:first"),
        data: $.postifyData(obj),
        messageControl: null,
        showThrobber: false,
        throbberPosition: { my: "left center", at: "right center", of: sender, offset: "5 0" },
        url: baseUrl + siteURL.GetTransactionPagingList,
        success: function (results, message) {
            $('#divResult table:first tbody').html(results[0]);
            PageNumbering(results[1]);

        }
    });
}