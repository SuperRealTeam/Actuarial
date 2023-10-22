var myDomain = 'http://localhost:50490';
//var myDomain = 'http://bulkbilling.acumobi.com';

function uploadMultipleDocuments(inputId1, inputId2, inputId3) {
    //alert(document.getElementById(inputId1));
    //alert(document.getElementById(inputId2));
    //alert(document.getElementById(inputId3));
    var input = document.getElementById(inputId1);

    var files = input.files;
    var formData = new FormData();

    for (var i = 0; i != files.length; i++) {
        formData.append("files", files[i]);
    }

    //
    input = document.getElementById(inputId2);
    files = input.files;

    for (var i = 0; i != files.length; i++) {
        formData.append("files", files[i]);
    }

    //
    input = document.getElementById(inputId3);
    files = input.files;

    for (var i = 0; i != files.length; i++) {
        formData.append("files", files[i]);
    }

    startUpdatingDocumentsProgressIndicator();
    $(".modalAjaxLoader").fadeIn();
    //var finalvalue="";
    $.ajax(
        {
            url: "/agent/uploader/StartUpload",
            data: formData,
            processData: false,
            contentType: false,
            async: false,
            global: false,
            cache: false,
            type: "POST",
            success: function (data) {
                uploadDoneFlag = 1;
                stopUpdatingDocumentsProgressIndicator();

                var returnedValue = data;
                var array = returnedValue.split(',')

                if (array[0]) {
                    $("#doc1").show();
                    $("#exist_doc_1_icon").hide();
                    $("#doc_1_icon").html("<i class='fa fa-file-text' aria-hidden='true'></i>")
                    $("#doc1").attr("href", myDomain + "//uploads//" + array[0]);
                }

                if (array[1]) {
                    $("#doc2").show();
                    $("#exist_doc_2_icon").hide();
                    $("#doc_2_icon").html("<i class='fa fa-file-text' aria-hidden='true'></i>")
                    $("#doc2").attr("href", myDomain + "//uploads//" + array[1]);
                }

                if (array[2]) {
                    $("#doc3").show();
                    $("#exist_doc_3_icon").hide();
                    $("#doc_3_icon").html("<i class='fa fa-file-text' aria-hidden='true'></i>")
                    $("#doc3").attr("href", myDomain + "//uploads//" + array[2]);
                }

                $("#uploadedDocuments").val(returnedValue);
                $("#PropertyDocuments1_Title").val($("#doctitle1").val());
                $("#PropertyDocuments1_Desc").val($("#docdesc1").val());
                $("#PropertyDocuments2_Title").val($("#doctitle2").val());
                $("#PropertyDocuments2_Desc").val($("#docdesc2").val());
                $("#PropertyDocuments3_Title").val($("#doctitle3").val());
                $("#PropertyDocuments3_Desc").val($("#docdesc3").val());
                //$("#pic_1_title").html($("#imgname1").val());
                //$("#pic_2_title").html($("#imgname2").val());
                //$("#pic_3_title").html($("#imgname3").val());


                $("#labelDocuments").html("100%");
                $("#barDocuments").css({ width: "100%" });
                $("#lblDocumentsStatusUpdate").html("Files uploaded");

                setTimeout(function () { $('#myModal1').trigger('click.dismiss.bs.modal'); }, 2000);
                $(".modalAjaxLoader").fadeOut();
            }
        }
    );
    //return finalvalue;
}

function uploadMultipleImages(inputId1, inputId2, inputId3) {
    //alert(document.getElementById(inputId1));
    //alert(document.getElementById(inputId2));
    //alert(document.getElementById(inputId3));
    var input = document.getElementById(inputId1);

    var files = input.files;
    var formData = new FormData();

    for (var i = 0; i != files.length; i++) {
        formData.append("files", files[i]);
    }

    //
    input = document.getElementById(inputId2);
    files = input.files;

    for (var i = 0; i != files.length; i++) {
        formData.append("files", files[i]);
    }

    //
    input = document.getElementById(inputId3);
    files = input.files;

    for (var i = 0; i != files.length; i++) {
        formData.append("files", files[i]);
    }

    startUpdatingImagesProgressIndicator();
    //var finalvalue="";
    $.ajax(
        {
            url: "/agent/uploader/StartUpload",
            data: formData,
            processData: false,
            contentType: false,
            async: false,
            global: false,
            cache: false,
            type: "POST",
            success: function (data) {
                uploadDoneFlag = 1;
                stopUpdatingImagesProgressIndicator();

                var returnedValue = data;
                var array = returnedValue.split(',')

                if (array[0]) {
                    $("#img1").show();
                    $("#exist_img_1").hide();
                    $("#img_1_icon").html("<a href=" + myDomain + "//uploads//" + array[0] + " aria-hidden='true'><img src=" + myDomain + "//uploads//" + array[0] + " /></a>")
                    //$("#img1").attr("href", myDomain + "//uploads//" + array[0]);
                }

                if (array[1]) {

                    $("#img2").show();
                    $("#exist_img_2").hide();
                    $("#img_2_icon").html("<a href=" + myDomain + "//uploads//" + array[1] + " aria-hidden='true'><img src=" + myDomain + "//uploads//" + array[1] + " /></a>")
                    //$("#img2").attr("href", myDomain + "//uploads//" + array[1]);
                }

                if (array[2]) {
                    $("#img3").show();
                    $("#exist_img_3").hide();
                    $("#img_3_icon").html("<a href=" + myDomain + "//uploads//" + array[2] + " aria-hidden='true'><img src=" + myDomain + "//uploads//" + array[2] + " /></a>")
                    //$("#img3").attr("href", myDomain + "//uploads//" + array[2]);
                }
                $("#uploadedImages").val(data);
                $("#PropertyImages1_Name").val($("#imgname1").val());
                $("#PropertyImages1_Desc").val($("#imgdesc1").val());
                $("#PropertyImages2_Name").val($("#imgname2").val());
                $("#PropertyImages2_Desc").val($("#imgdesc2").val());
                $("#PropertyImages3_Name").val($("#imgname3").val());
                $("#PropertyImages3_Desc").val($("#imgdesc3").val());
                //$("#doc_1_title").html($("#doctitle1").val());
                //$("#doc_2_title").html($("#doctitle2").val());
                //$("#doc_3_title").html($("#doctitle3").val());

                $("#labelImages").html("100%");
                $("#barImages").css({ width: "100%" });
                $("#lblImagesStatusUpdate").html("Files uploaded");

                setTimeout(function () { $('#myModal2').trigger('click.dismiss.bs.modal'); }, 2000);
            }
        }
    );
    //return finalvalue;
}

function uploadFiles(inputId) {
    alert('regular');
    var input = document.getElementById(inputId);
    var files = input.files;
    var formData = new FormData();

    for (var i = 0; i != files.length; i++) {
        formData.append("files", files[i]);
    }

    startUpdatingProgressIndicator();
    $.ajax(
        {
            url: "/agent/uploader/StartUpload",
            data: formData,
            processData: false,
            contentType: false,
            global: false,
            cache: false,

            type: "POST",
            success: function (data) {
                stopUpdatingProgressIndicator();
                alert("Files Uploaded!");
            }
        }
    );
}

var intervalId1;
var intervalId2;
var uploadDoneFlag = 0;

function startUpdatingDocumentsProgressIndicator() {
    $("#progressDocuments").show();

    if (uploadDoneFlag == 0) {
        intervalId1 = setInterval(
            function () {
                // We use the POST requests here to avoid caching problems (we could use the GET requests and disable the cache instead)
                $.post(
                    "/agent/uploader/progress",
                    function (progress) {
                        $("#barDocuments").css({ width: progress + "%" });
                        $("#labelDocuments").html(progress + "%");
                    }
                );
            },
            10
        );
    }
}

function startUpdatingImagesProgressIndicator() {
    //$("#progressImages").show();

    if (uploadDoneFlag == 0) {
        intervalId2 = setInterval(
            function () {
                // We use the POST requests here to avoid caching problems (we could use the GET requests and disable the cache instead)
                $.post(
                    "/agent/uploader/progress",
                    function (progress) {
                        $("#barImages").css({ width: progress + "%" });
                        $("#labelImages").html(progress + "%");
                    }
                );
            },
            500
        );
    }
}

function stopUpdatingDocumentsProgressIndicator() {
    clearInterval(intervalId1);
}

function stopUpdatingImagesProgressIndicator() {
    clearInterval(intervalId2);
}