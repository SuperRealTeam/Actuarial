var rowCount = 1;
var dateFormat = 'mm/dd/yyyy';
$(document).ready(function () {

    $(document).on('click', 'a.next', function () {
        debugger;
        var stepValid = $($(this).data('step') + ' :input,select').valid();
        if (stepValid) {
            //$(this).attr('data-target', $(this).data('stepto'));
            //$($(this).data('step')).hide();
            $($(this).data('stepto')).slideDown("slow", function () {
            });
            $('html, body').animate({
                scrollTop: $($(this).data('stepto')).offset().top - 80
            }, 1000);
        }
        else
            $(this).removeAttr('data-target');
    });
    $(document).on('click', '#AddUpdateDetails', function () {
        $('.collapse').addClass('show')
        if ($('.MultipleDropDown .dropdown-display').prop('title') != "") {
            $('#OtherDetailsType').val($('.MultipleDropDown .dropdown-display').prop('title'));
            $('.MultipleDropDown .dropdown-display').prop('title')
        }
        if ($('.dropdown-display').prop('title') != "") {
            $('#TypeIAM').val($('.dropdown-display').prop('title'))
        }

        return Contact.AddUpdateDetails($(this));
    });
    $(document).on('click', '#cancelPopup', function () {
        $('#myModal').modal('hide')
    });

    //$(document).on('change', '.currentWork', function () {
    //    if (this.checked)
    //        $(this).prev().hide()
    //    else
    //        $(this).prev().show()
    //})

    //$(document).on('click', '.approve approve-agent', function () {
    //    Agent.ApproveAgentRecord($(this).data('agentid'));
    //})

    $(document).on('click', 'input[type=button]#btnFilterVersion', function () {
        return Contact.ManageContacts($(this));
    });

    $("select#showRecords").on("change", function () {
        return Contact.ShowRecords($(this));
    });

    $(document).on('click', '.sorting', function () {
        return Contact.SortContacts($(this));
    });

    $(document).on('click', '.edit-contact', function () {
        window.location.href = baseUrl + siteURL.EditContact + '/' + $(this).data('id');
    });

    $(document).on('click', '.details-contact', function () {
        window.location.href = baseUrl + siteURL.DetailsContact + '/' + $(this).data('id');
    });

    //$('#Search').keypress(function (e) {
    //    if (e.which === 13)  // the enter key code
    //        return Contact.SearchContacts($(this));
    //});

    $(document).on('click', '.search-btn', function () {
        return Contact.SearchContacts($(this));
    });
    $(document).on('click', '.delete-contact', function () {
        Contact.DeleteContactRecord($(this).data('id'));
    })

    $(document).on('change', '#ContactType', function () {
        if ($(this).val() === '2') {
            $('.req-val').show();
            $('.req-com').prop('required', true);
        }
        else {
            $('.req-val').hide();
            $('.req-com').prop('required', false);
        }

    });

    $(document).on('change', '.MaritalStatus', function () {
        if ($(this).val() != '4') {
            $('.spouseName').val("");
            $('.spouseMobile').val("");
            $('.SpouseEmail').val("");
            $('.anniversary').val("");
            $('.spouseName').prop("disabled", "disabled");
            $('.spouseMobile').prop("disabled", "disabled");
            $('.anniversary').prop("disabled", "disabled");
            $('.SpouseEmail').prop("disabled", "disabled");

        }
        else {
            $('.spouseName').prop("disabled", false);
            $('.spouseMobile').prop("disabled", false);
            $('.anniversary').prop("disabled", false);
            $('.SpouseEmail').prop("disabled", false);
        }
    });


    $(".postcodes").select2(
        {
            placeholder: "Search by postcode",
            multiple: true,
            ajax: {
                url: siteURL.GetPostList,
                global: false,
                cache: false,
                dataType: 'json',
                data: function (term, page) {

                    return {
                        Search: term,
                        RecordsPerPage: 10,
                        PageNo: page
                    };
                },
                results: function (data) {

                    var results = [];
                    $.each(data, function (index, item) {
                        results.push({
                            id: item.id,
                            text: item.name
                        });
                    });
                    return {
                        results: results
                    };
                }
            },
            initSelection: function (element, callback) {
                var id;
                id = $(element).val();
                if (id != "") {
                    return $.ajax({
                        url: baseUrl + siteURL.GetInitPostCodeList,
                        type: "Get",
                        dataType: "json", global: false,
                        cache: false,
                        data: {
                            Ids: id,
                        }
                    }).done(function (data) {
                        var results;
                        results = [];
                        $.each(data, function (index, item) {
                            results.push({
                                id: item.id,
                                text: item.name
                            });
                        });
                        callback(results);
                    });
                }
            },
        });

})

var Contact = {
    AddUpdateDetails: function (sender) {
        var form = $("form");
        $.ajaxExt({
            url: baseUrl + siteURL.AddUpdateContactDetails,
            type: 'POST',
            validate: true,
            formToValidate: form,
            formToPost: form,
            isAjaxForm: true,
            showThrobber: false,
            showErrorMessage: true,
            messageControl: $('div.messageAlert'),
            success: function (results, message) {
                debugger
                $.ShowMessage($('div.messageAlert'), message, MessageType.Success);
                setTimeout(function () {
                    if (siteURL.ContactList != null) {
                        window.location.href = siteURL.ContactList;
                    }
                    else {
                        if (window.location.pathname == "/agency/Contact/AddUpdatePopupContact") {
                            window.location.href = siteURL.AddUpdateProperty;
                        }
                    }
                }, 3000);
            }
        });

        //alert($("iframe").parent("#myModal"));
        //$("iframe").parent(".add-contact-popup").hide();
        //$("iframe").parent("#myModal").hide();//.trigger('click.dismiss.bs.modal');
        return false;
    },
    SortContacts: function (sender) {
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

    ManageContacts: function (totalCount) {
        var totalRecords = 0;
        totalRecords = parseInt(totalCount);
        //alert(totalRecords);
        PageNumbering(totalRecords);
    },

    SearchContacts: function (sender) {
        paging.startIndex = 1;
        Paging(sender);
    },

    ShowRecords: function (sender) {
        paging.startIndex = 1;
        paging.pageSize = parseInt($(sender).find('option:selected').val());
        Paging(sender);
    },

    //DeleteContact: function (sender) {
    //    $.ConfirmBox("", "Are you sure?", null, true, "Yes", true, null, function () {
    //        $.ajax({
    //            type: "GET",
    //            url: siteURL.DeleteContact,
    //            contentType: "application/json",
    //            dataType: "json",
    //            success: function (response) {
    //            },
    //            failure: function (response) {
    //                alert(response);
    //            }
    //        });
    //    });
    //},

    //ApproveAgentRecord: function (id) {
    //    $.ConfirmBox("", "Are you sure want to approve this record?", null, true, "Yes", true, null, function () {
    //        $.ajaxExt({
    //            type: 'POST',
    //            validate: false,
    //            showErrorMessage: true,
    //            messageControl: $('div.messageAlert'),
    //            showThrobber: true,
    //            url: baseUrl + siteURL.ApproveAgent,
    //            data: { agentID: id },
    //            success: function (results, message, status) {
    //                debugger;
    //                $.ShowMessage($('div.messageAlert'), message, status);
    //                Paging();
    //            }
    //        });
    //    }, "", function () {
    //    });
    //},

    //EnableDisableAgent: function (sender) {
    //    $.ConfirmBox("", "Are you sure?", null, true, "Yes", true, null, function () {
    //        $.ajax({
    //            type: "GET",
    //            url: siteURL.EnableDisableAgent,
    //            contentType: "application/json",
    //            dataType: "json",
    //            success: function (response) {
    //            },
    //            failure: function (response) {
    //                alert(response);
    //            }
    //        });
    //    });
    //},

    DeleteContactRecord: function (id) {
        $.ConfirmBox("", "Are you sure?", null, true, "Yes", true, null, function () {
            $.ajaxExt({
                type: 'POST',
                validate: false,
                showErrorMessage: true,
                messageControl: $('div.messageAlert'),
                showThrobber: true,
                url: baseUrl + siteURL.DeleteContact,
                data: { id: id },
                success: function (results, message, status) {
                    debugger;
                    $.ShowMessage($('div.messageAlert'), message, status);
                    window.location.reload();
                }
            });
        }, "", function () {

        });
    },

    AssignStartEndDate: function (count) {
        $('#start-' + count).datepicker({
            defaultDate: "+1w",
            changeMonth: true,
            numberOfMonths: 1
        }).on("change", function () {
            $('#end-' + $(this).data('id')).datepicker("option", "minDate", getDate(this));
        });

        $('#end-' + count).datepicker({
            defaultDate: "+1w",
            changeMonth: true,
            numberOfMonths: 1
        }).on("change", function () {
            $('#start-' + $(this).data('id')).datepicker("option", "maxDate", getDate(this));
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
    obj.SearchBudget = $('#SearchBudget').val();
    obj.SearchContactType = $('#SearchContactType').val();
    obj.IsBranch = $('#IsBranch').val();
    obj.AddedByAgency = $('#AddedByAgency').val();
    obj.IsViewOnly = $('#IsViewOnly').val();
    $.ajaxExt({
        type: "POST",
        validate: false,
        parentControl: $(sender).parents("form:first"),
        data: $.postifyData(obj),
        messageControl: null,
        showThrobber: false,
        throbberPosition: { my: "left center", at: "right center", of: sender, offset: "5 0" },
        url: baseUrl + siteURL.GetContactPagingList,
        success: function (results, message) {
            $('#divResult table:first tbody').html(results[0]);
            PageNumbering(results[1]);

        }
    });
}

function getDate(element) {
    try {
        date = new Date(element.value);;
    } catch (error) {
        date = null;
    }

    return date;
}
