$(document).ready(function () {
    Doctorhits.GetLevel1DDl();
    $(".search_postcode").select2(
        {
            placeholder: "Search by postcode",
            multiple: false,
            //maximumSelectionSize: 1,
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


    $(document).on('click', '#btnsearchdoctorhits', function () {
        Paging();
    });
    $(document).on('click', '#btnClearDoctorHitsList', function () {
        $("#ddlLevel1").val("");
        $("#txtsuburb").select2('val', null);
      
        Paging();
    });

    $(document).on('click', 'input[type=button]#btnFilterVersion', function () {
        return Doctorhits.ManageDoctorsHits($(this));
    });

    $("select#showRecords").on("change", function () {
        return Doctorhits.ShowRecords($(this));
    });

    $(document).on('click', '.sorting', function () {
        return Doctorhits.SortDoctorsHits($(this));
    });

    $('#Search').keypress(function (e) {
        if (e.which === 13)  // the enter key code
            return Doctorhits.SearchDoctorsHits($(this));
    });
});

var Doctorhits = {

    SortDoctorsHits: function (sender) {
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

    ManageDoctorsHits: function (totalCount) {
        var totalRecords = 0;
        totalRecords = parseInt(totalCount);
        //alert(totalRecords);
        PageNumbering(totalRecords);
    },

    SearchDoctorsHits: function (sender) {
        paging.startIndex = 1;
        Paging(sender);
    },

    ShowRecords: function (sender) {
        paging.startIndex = 1;
        paging.pageSize = parseInt($(sender).find('option:selected').val());
        Paging(sender);
    },


    GetLevel1DDl: function () {
        $.ajaxExt({
            type: "Get",
            validate: false,
            messageControl: null,
            showThrobber: false,
            url: baseUrl + siteURL.GetLevel1ddl,
            success: function (results, message, status, id, list, object, url, data) {
                $("#ddlLevel1").html("");
                var optionhtml1 = '<option value="' +
                    0 + '">' + "--Select Level1--" + '</option>';
                $("#ddlLevel1").append(optionhtml1);

                $.each(list, function (i) {

                    var optionhtml = '<option value="' +
                        list[i].value + '">' + list[i].text + '</option>';
                    $("#ddlLevel1").append(optionhtml);
                });
            }
        });
    },
};


function Paging(sender) {
    var obj = new Object();
    obj.Search = $('#Search').val();
    obj.PageNo = Math.ceil(paging.startIndex / paging.pageSize);
    obj.RecordsPerPage = paging.pageSize;
    obj.SortBy = $('#SortBy').val();
    obj.SortOrder = $('#SortOrder').val();
    obj.suburb = $('#txtsuburb').val();
    obj.level1 = $("#ddlLevel1").val();

    $.ajaxExt({
        type: "POST",
        validate: false,
        parentControl: $(sender).parents("form:first"),
        data: $.postifyData(obj),
        messageControl: null,
        showThrobber: false,
        throbberPosition: { my: "left center", at: "right center", of: sender, offset: "5 0" },
        url: baseUrl + siteURL.GetDoctorsHitsPagingList,
        success: function (results, message) {
            $('#divResult table:first tbody').html(results[0]);
            PageNumbering(results[1]);

        }
    });
}