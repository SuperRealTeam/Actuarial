$(document).ready(function () {
    $(document).on('click', '#btnAddUpdatePatient', function () {
        return Patient.AddUpdateDetails($(this));
    });

    $(document).on('click', '.delete-Patient', function () {
        Patient.DeletePatient($(this).data('patientid'));
    })

    $(document).on('click', '#btndltothermember', function () {
        Patient.DeleteOtherMember($(this).data('uid'));
    })

    $(document).on('click', '#btnAddOtherMember', function () {
        Patient.AddUpdateOtherMember($(this));
    })

    $(document).on('click', '.enable-Patient', function () {
        Patient.EnableDisablePatientRecord($(this).data('patientid'));
    })

    $(document).on('click', '.edit-Patient', function () {
        window.location.href = baseUrl + siteURL.EditPatient + '/' + $(this).data('patientid');
    });

    $(document).on('click', '.details-Patient', function () {
        window.location.href = baseUrl + siteURL.DetailsPatient + '/' + $(this).data('patientid');
    });

    $(document).on('click', '#btnModal', function () {
        $('#AddOtherMemeberModal').modal('show');
    });


    $(document).on('click', 'input[type=button]#btnFilterVersion', function () {
        return Patient.ManagePatients($(this));
    });

    $("select#showRecords").on("change", function () {
        return Patient.ShowRecords($(this));
    });

    $(document).on('click', '.sorting', function () {
        return Patient.SortPatients($(this));
    });

    $('#Search').keypress(function (e) {
        if (e.which === 13)  // the enter key code
            return Patient.SearchPatients($(this));
    });
})

var Patient = {
    AddUpdateDetails: function (sender) {
        var form = $("#formAddPatientDetails");
        $.ajaxExt({
            url: baseUrl + siteURL.AddUpdatePatientDetails,
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
                    window.location.href = siteURL.PatientsList;
                }, 3000);
            }
        });
        return false;
    },

    AddUpdateOtherMember: function (sender) {
        var form = $("#form_AddOtherMember");
        $.ajaxExt({
            url: baseUrl + siteURL.AddUpdateOtherMemeber,
            type: 'POST',
            validate: true,
            formToValidate: form,
            formToPost: form,
            isAjaxForm: true,
            showThrobber: false,
            showErrorMessage: true,
            messageControl: $('div.messageAlert'),
            success: function (results, message) {
                $.ShowMessage($('div.messageAlert'), message, status);
                setTimeout(function () {
                    window.location.reload();
                }, 3000);
            }
        });
        return false;
    },

    SortPatients: function (sender) {
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

    ManagePatients: function (totalCount) {
        var totalRecords = 0;
        totalRecords = parseInt(totalCount);
        //alert(totalRecords);
        PageNumbering(totalRecords);
    },

    SearchPatients: function (sender) {
        paging.startIndex = 1;
        Paging(sender);
    },

    ShowRecords: function (sender) {
        paging.startIndex = 1;
        paging.pageSize = parseInt($(sender).find('option:selected').val());
        Paging(sender);
    },

    DeletePatient: function (id) {
        $.ConfirmBox("", "Are you sure?", null, true, "Yes", true, null, function () {
            $.ajaxExt({
                type: 'POST',
                validate: false,
                showErrorMessage: true,
                messageControl: $('div.messageAlert'),
                showThrobber: true,
                url: baseUrl + siteURL.DeletePatient,
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
    EnableDisablePatientRecord: function (sender) {
        $.ConfirmBox("", "Are you sure?", null, true, "Yes", true, null, function () {
            $.ajaxExt({
                type: 'POST',
                validate: false,
                showErrorMessage: true,
                messageControl: $('div.messageAlert'),
                showThrobber: true,
                url: baseUrl + siteURL.EnableDisablePatient,
                data: { userID: sender },
                success: function (results, message, status) {
                    $.ShowMessage($('div.messageAlert'), message, status);
                    Paging();
                }
            });
        }, "", function () {
        });
    },

    DeleteOtherMember: function (id) {
        $.ConfirmBox("", "Are you sure?", null, true, "Yes", true, null, function () {
            $.ajaxExt({
                type: 'Get',
                validate: false,
                showErrorMessage: true,
                messageControl: $('div.messageAlert'),
                showThrobber: true,
                url: baseUrl + siteURL.DeleteOtherMember,
                data: { uId: id },
                success: function (results, message, status) {
                    $.ShowMessage($('div.messageAlert'), message, status);
                    setTimeout(function () {
                        window.location.reload();
                    }, 3000);
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
        url: baseUrl + siteURL.GetPatientPagingList,
        success: function (results, message) {
            $('#divResult table:first tbody').html(results[0]);
            PageNumbering(results[1]);

        }
    });
}