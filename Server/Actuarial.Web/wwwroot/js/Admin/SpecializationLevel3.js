$(document).ready(function () {
    $(document).on('click', '#btnAddUpdateSpecializationLevel3', function () {
        return SpecializationLevel3.AddUpdateDetails($(this));
    });

    $(document).on('click', '.delete-SpecializationLevel3', function () {
        SpecializationLevel3.DeleteSpecializationLevel3($(this).data('level3id'));
    })

    $(document).on('click', '.enable-SpecializationLevel3', function () {
        SpecializationLevel3.EnableDisableSpecializationLevel3Record($(this).data('level3id'), $(this).data('isenable'));
    })

    $(document).on('click', '.edit-SpecializationLevel3', function () {
        window.location.href = baseUrl + siteURL.EditSpecializationLevel3 + '/' + $(this).data('level3id');
    });

    $(document).on('click', '.details-SpecializationLevel3', function () {
        window.location.href = baseUrl + siteURL.DetailsSpecializationLevel3 + '/' + $(this).data('level3id');
    });


    $(document).on('click', 'input[type=button]#btnFilterVersion', function () {
        return SpecializationLevel3.ManageSpecializationLevel3s($(this));
    });

    $("select#showRecords").on("change", function () {
        return SpecializationLevel3.ShowRecords($(this));
    });

    $("select#FkLevel1Id").on("change", function () {
        return SpecializationLevel3.GetSpecializationLevel2List($(this).val());
        //return SpecializationLevel3.ShowRecords($(this));
    });

    $(document).on('click', '.sorting', function () {
        return SpecializationLevel3.SortSpecializationLevel3s($(this));
    });
    $('#Search').keypress(function (e) {
        if (e.which === 13)  // the enter key code
            return SpecializationLevel3.SearchSpecializationLevel3s($(this));
    });
})

var SpecializationLevel3 = {

    AddUpdateDetails: function (sender) {
        var form = $("form#SpecializationLevel3");
        $.ajaxExt({
            url: baseUrl + siteURL.AddUpdateSpecializationLevel3,
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
                    window.location.href = siteURL.SpecializationLevel3;
                }, 3000);
            }
        });
        return false;
    },

    SortSpecializationLevel3s: function (sender) {
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

    ManageSpecializationLevel3s: function (totalCount) {
        var totalRecords = 0;
        totalRecords = parseInt(totalCount);
        //alert(totalRecords);
        PageNumbering(totalRecords);
    },

    SearchSpecializationLevel3s: function (sender) {
        paging.startIndex = 1;
        Paging(sender);
    },

    ShowRecords: function (sender) {
        paging.startIndex = 1;
        paging.pageSize = parseInt($(sender).find('option:selected').val());
        Paging(sender);
    },

    DeleteSpecializationLevel3: function (id) {
        $.ConfirmBox("", "Are you sure you want to delete the record?", null, true, "Yes", true, null, function () {
            $.ajaxExt({
                type: 'POST',
                validate: false,
                showErrorMessage: true,
                messageControl: $('div.messageAlert'),
                showThrobber: true,
                url: baseUrl + siteURL.DeleteSpecializationLevel3,
                data: { SpecializationLevel3Id: id },
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

    EnableDisableSpecializationLevel3Record: function (sender, lbl) {
        $.ConfirmBox("", "Are you sure you want to " + lbl + " the record ? ", null, true, "Yes", true, null, function () {
            $.ajaxExt({
                type: 'POST',
                validate: false,
                showErrorMessage: true,
                messageControl: $('div.messageAlert'),
                showThrobber: true,
                url: baseUrl + siteURL.EnableDisableSpecializationLevel3,
                data: { SpecializationLevel3Id: sender },
                success: function (results, message, status) {
                    $.ShowMessage($('div.messageAlert'), message, status);
                    Paging();
                }
            });
        }, "", function () {
        });
    },

    GetSpecializationLevel2List: function (sender) {
        $.ajaxExt({
            type: 'POST',
            validate: false,
            showErrorMessage: true,
            messageControl: $('div.messageAlert'),
            showThrobber: true,
            url: baseUrl + siteURL.GetSpecializationLevel2List,
            data: { lvlUID: sender },
            success: function (results, message, status, id, list, object, url, data) {
                console.log(results[0]);
                $(".divlvl2").show();
                $(".divlvl2").html(results[0]);
            }
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
        url: baseUrl + siteURL.GetSpecializationLevel3PagingList,
        success: function (results, message) {
            $('#divResult table:first tbody').html(results[0]);
            PageNumbering(results[1]);

        }
    });
}