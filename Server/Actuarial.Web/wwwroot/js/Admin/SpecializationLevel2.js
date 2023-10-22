$(document).ready(function () {
    $(document).on('click', '#btnAddUpdateSpecializationLevel2', function () {
        return SpecializationLevel2.AddUpdateDetails($(this));
    });

    $(document).on('click', '.delete-SpecializationLevel2', function () {
        SpecializationLevel2.DeleteSpecializationLevel2($(this).data('level2id'));
    })

    $(document).on('click', '.enable-SpecializationLevel2', function () {
        SpecializationLevel2.EnableDisableSpecializationLevel2Record($(this).data('level2id'), $(this).data('isenable'));
    })

    $(document).on('click', '.edit-SpecializationLevel2', function () {
        window.location.href = baseUrl + siteURL.EditSpecializationLevel2 + '/' + $(this).data('level2id');
    });

    $(document).on('click', '.details-SpecializationLevel2', function () {
        window.location.href = baseUrl + siteURL.DetailsSpecializationLevel2 + '/' + $(this).data('level2id');
    });


    $(document).on('click', 'input[type=button]#btnFilterVersion', function () {
        return SpecializationLevel2.ManageSpecializationLevel2s($(this));
    });

    $("select#showRecords").on("change", function () {
        return SpecializationLevel2.ShowRecords($(this));
    });

    $(document).on('click', '.sorting', function () {
        return SpecializationLevel2.SortSpecializationLevel2s($(this));
    });
    $('#Search').keypress(function (e) {
        if (e.which === 13)  // the enter key code
            return SpecializationLevel2.SearchSpecializationLevel2s($(this));
    });
    $(document).on('change', '.preview-img', function (sender) {
        var input = sender.target;

        var ext = $(input).val().split('.').pop().toLowerCase();
        if ($.inArray(ext, ['png', 'jpg', 'jpeg']) === -1) {
            $(input).next().html('invalid extension!').addClass('field-validation-error')
            $(input).val('');
            return;
        }
        else {
            $(input).next().html('').removeClass('field-validation-error')
        }
        var file_size = input.files[0].size;
        if (file_size > 2097152) {
            $(input).next().html('file max size should be 2mb!').addClass('field-validation-error')
            $(input).val('')
            return;
        }
        else {
            $(input).next().html('').removeClass('field-validation-error')
        }
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            $('.div-attachment').css("display", "block");
            reader.onload = function (e) {
                $('#uploaded-img')
                    .attr('src', e.target.result)
                    .width(100);
            };

            reader.readAsDataURL(input.files[0]);
        }
    });
})

var SpecializationLevel2 = {
    AddUpdateDetails: function (sender) {
        var form = $("form#SpecializationLevel2");
        $.ajaxExt({
            url: baseUrl + siteURL.AddUpdateSpecializationLevel2,
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
                    window.location.href = siteURL.SpecializationLevel2;
                }, 3000);
            }
        });
        return false;
    },

    SortSpecializationLevel2s: function (sender) {
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

    ManageSpecializationLevel2s: function (totalCount) {
        var totalRecords = 0;
        totalRecords = parseInt(totalCount);
        //alert(totalRecords);
        PageNumbering(totalRecords);
    },

    SearchSpecializationLevel2s: function (sender) {
        paging.startIndex = 1;
        Paging(sender);
    },

    ShowRecords: function (sender) {
        paging.startIndex = 1;
        paging.pageSize = parseInt($(sender).find('option:selected').val());
        Paging(sender);
    },

    DeleteSpecializationLevel2: function (id) {
        $.ConfirmBox("", "All the related Subcategories will get deleted. Are you sure you want to delete the record?", null, true, "Yes", true, null, function () {
            $.ajaxExt({
                type: 'POST',
                validate: false,
                showErrorMessage: true,
                messageControl: $('div.messageAlert'),
                showThrobber: true,
                url: baseUrl + siteURL.DeleteSpecializationLevel2,
                data: { SpecializationLevel2Id: id },
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
    EnableDisableSpecializationLevel2Record: function (sender, lbl) {
        $.ConfirmBox("", "All the related Subcategories will get  " + lbl + "d" + ". Are you sure you want to " + lbl + " the record?", null, true, "Yes", true, null, function () {
            $.ajaxExt({
                type: 'POST',
                validate: false,
                showErrorMessage: true,
                messageControl: $('div.messageAlert'),
                showThrobber: true,
                url: baseUrl + siteURL.EnableDisableSpecializationLevel2,
                data: { SpecializationLevel2Id: sender },
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
        url: baseUrl + siteURL.GetSpecializationLevel2PagingList,
        success: function (results, message) {
            $('#divResult table:first tbody').html(results[0]);
            PageNumbering(results[1]);

        }
    });
}