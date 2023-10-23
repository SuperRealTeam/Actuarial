$(document).ready(function () {
    $(document).on('click', '#btnAddUpdateEmployer', function () {
        return Employer.AddUpdateDetails($(this));
    });

    $(document).on('click', '.delete-Employer', function () {
        Employer.DeleteEmployer($(this).data('userid'));
    })

    $(document).on('click', '.enable-Employer', function () {
        Employer.EnableDisableEmployerRecord($(this).data('userid'));
    })

    $(document).on('click', '.edit-Employer', function () {
        window.location.href = baseUrl + siteURL.EditEmployer + '/' + $(this).data('userid');
    });

    $(document).on('click', '.details-Employer', function () {
        window.location.href = baseUrl + siteURL.DetailsEmployer + '/' + $(this).data('userid');
    });


    $(document).on('click', '.chklevel1', function () {
        if ($(this).is(':checked')) {
            var a = a;
        }
        else {
            $(".level2 input[type=checkbox]").prop('checked', false);
            $(".level3 input[type=checkbox]").prop('checked', false);
            $(".level3").hide();
        }
        $(".chklevel1").each(function (index) {
            if ($(this).is(':checked')) {
                $(".level2." + $(this).data('id')).show();
            }
            else {
               
                $(".level2." + $(this).data('id')).hide();
               
              
            }
        });
    });

    $(document).on('click', '.chklevel2', function () {
        if ($(this).is(':checked')) {
            var a = a;
        }
        else {
            $(".level3 input[type=checkbox]").prop('checked', false);
        }
        $(".chklevel2").each(function (index) {
            if ($(this).is(':checked')) {
                $(".level3." + $(this).data('id')).show();
            }
            else {
              
                $(".level3." + $(this).data('id')).hide();

            }
        });
    });



    $(document).on('click', 'input[type=button]#btnFilterVersion', function () {
        return Employer.ManageEmployers($(this));
    });

    $("select#showRecords").on("change", function () {
        return Employer.ShowRecords($(this));
    });

    $(document).on('click', '.sorting', function () {
        return Employer.SortEmployers($(this));
    });

    $('#Search').keypress(function (e) {
        if (e.which === 13)  // the enter key code
            return Employer.SearchEmployers($(this));
    });
})

var Employer = {
    AddUpdateDetails: function (sender) {
        var form = $("#formAddEmployerDetails");
        $.ajaxExt({
            url: baseUrl + siteURL.AddUpdateEmployerDetails,
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
                    window.location.href = siteURL.EmployersList;
                }, 3000);
            }
        });
        return false;
    },

    SortEmployers: function (sender) {
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

    ManageEmployers: function (totalCount) {
        var totalRecords = 0;
        totalRecords = parseInt(totalCount);
        //alert(totalRecords);
        PageNumbering(totalRecords);
    },

    SearchEmployers: function (sender) {
        paging.startIndex = 1;
        Paging(sender);
    },

    ShowRecords: function (sender) {
        paging.startIndex = 1;
        paging.pageSize = parseInt($(sender).find('option:selected').val());
        Paging(sender);
    },

    DeleteEmployer: function (id) {
        $.ConfirmBox("", "Are you sure you want to delete this record?", null, true, "Yes", true, null, function () {
            $.ajaxExt({
                type: 'POST',
                validate: false,
                showErrorMessage: true,
                messageControl: $('div.messageAlert'),
                showThrobber: true,
                url: baseUrl + siteURL.DeleteEmployer,
                data: { userID: id },
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
    EnableDisableEmployerRecord: function (sender) {
        $.ConfirmBox("", "Are you sure?", null, true, "Yes", true, null, function () {
            $.ajaxExt({
                type: 'POST',
                validate: false,
                showErrorMessage: true,
                messageControl: $('div.messageAlert'),
                showThrobber: true,
                url: baseUrl + siteURL.EnableDisableEmployer,
                data: { userID: sender },
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
        url: baseUrl + siteURL.GetEmployersPagingList,
        success: function (results, message) {
            $('#divResult table:first tbody').html(results[0]);
            PageNumbering(results[1]);

        }
    });
}