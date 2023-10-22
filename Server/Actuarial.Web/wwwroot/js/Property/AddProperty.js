$(document).ready(function () {
    $(document).on('click', '#btnEditOwner', function () {
        PropertyDetails.ToggleOwnerMode($(this));
    })
    $(document).on('click', '#btnEditAttribute', function () {
        PropertyDetails.ToggleAttributeMode($(this));
    })
    $(document).on('click', '#btnEditAddDetail', function () {
        PropertyDetails.ToggleAdditionalDetailsMode($(this));
    })

    $(document).on('click', '#btnEditDocuments', function () {
        PropertyDetails.ToggleDocumentsMode($(this));
    })

    $(document).on('click', '#btnEditLegalDetail', function () {
        PropertyDetails.ToggleLegalMode($(this));
    })
    $(document).on('click', '#btnDetailsListing', function () {
        PropertyDetails.ToggleDetailsListing($(this));
    })

    $(document).on('click', '#btnUpdatePropertyListingDetails', function () {
        PropertyDetails.UpdatePropertyDetailsListing($(this));
    })

    $("#CountBedrooms").attr('readonly', true);
    $("#CountBathrooms").attr('readonly', true);
    $("#CountEnsuites").attr('readonly', true);
    $("#CountCarParking").attr('readonly', true);
    $("#CountToilets").attr('readonly', true);
    $("#CountGarageSpace").attr('readonly', true);
    $("#CountLivingAreas").attr('readonly', true);

    $("#chkCountBedrooms").click(function () {
        if ($(this).is(":checked")) {
            $("#CountBedrooms").attr('readonly', false);
            $("#CountBedrooms").addClass("bx-shadow")
            $("#CountBedrooms").focus();
        } else {
            $("#CountBedrooms").attr('readonly', true);
            $("#CountBedrooms").val('');
            $("#CountBedrooms").removeClass("bx-shadow")
        }
    });

    $("#chkCountBaths").click(function () {
        if ($(this).is(":checked")) {
            $("#CountBathrooms").attr('readonly', false);
            $("#CountBathrooms").addClass("bx-shadow")
            $("#CountBathrooms").focus();
        } else {
            $("#CountBathrooms").attr('readonly', true);
            $("#CountBathrooms").val('');
            $("#CountBathrooms").removeClass("bx-shadow")
        }
    });

    $("#chkCountEnsuites").click(function () {
        if ($(this).is(":checked")) {
            $("#CountEnsuites").attr('readonly', false);
            $("#CountEnsuites").addClass("bx-shadow")
            $("#CountEnsuites").focus();

        } else {
            $("#CountEnsuites").attr('readonly', true);
            $("#CountEnsuites").val('');
            $("#CountEnsuites").removeClass("bx-shadow")
        }
    });

    $("#chkCountCarParking").click(function () {
        if ($(this).is(":checked")) {
            $("#CountCarParking").attr('readonly', false);
            $("#CountCarParking").addClass("bx-shadow");
            $("#CountCarParking").focus();
        } else {
            $("#CountCarParking").attr('readonly', true);
            $("#CountCarParking").val('');
            $("#CountCarParking").removeClass("bx-shadow");
        }
    });

    $("#chkCountToilets").click(function () {
        if ($(this).is(":checked")) {
            $("#CountToilets").attr('readonly', false);
            $("#CountToilets").addClass("bx-shadow");
            $("#CountToilets").focus();
        } else {
            $("#CountToilets").attr('readonly', true);
            $("#CountToilets").removeClass("bx-shadow");
            $("#CountToilets").val('');
        }
    });

    $("#chkCountGarageSpace").click(function () {
        if ($(this).is(":checked")) {
            $("#CountGarageSpace").attr('readonly', false);
            $("#CountGarageSpace").addClass("bx-shadow");
            $("#CountGarageSpace").focus();
        } else {
            $("#CountGarageSpace").attr('readonly', true);
            $("#CountGarageSpace").val('');
            $("#CountGarageSpace").removeClass("bx-shadow");
        }
    });

    $("#chkCountLivingAreas").click(function () {
        if ($(this).is(":checked")) {
            $("#CountLivingAreas").attr('readonly', false);
            $("#CountLivingAreas").addClass("bx-shadow");
            $("#CountLivingAreas").focus();
        } else {
            $("#CountLivingAreas").attr('readonly', true);
            $("#CountLivingAreas").val('');
            $("#CountLivingAreas").removeClass("bx-shadow");
        }
    });
    $(document).on("click", ".remove_field_contact", function (e) { //client click on remove text
        e.preventDefault(); $(this).parent('div').remove();
    })
    $(document).on('click', '#btnUpdatePropertyAttributes', function () {
        return PropertyDetails.AddUpdateAttributeDetails($(this));
    });

    $(document).on('click', '#btnUpdatePropertyLegalDetails', function () {
        return PropertyDetails.AddUpdateLegalDetails($(this));
    });

    $(document).on('click', '#btnUpdatePropertyOwner', function () {
        return PropertyDetails.UpdatePropertyOwner($(this));
    });
    $(document).on('click', '#btnPropertyDocuments', function () {
        var flag = true;
        $(".docProp").each(function () {

            if ($(this).val() == '') {
                $(this).addClass("input-validation-error");
                flag = false;
                return false;
            }
        });
        if (flag) {
            $("#files").replaceWith($("#files").val('').clone(true));
            $("#fPics").replaceWith($("#fPics").val('').clone(true));
            PropertyDetails.AddUpdateDocuments($(this));
        }

    });

    $(document).on('click', '#btnUpdateAditionalDetails', function () {
        $("#files").replaceWith($("#files").val('').clone(true));
        $("#fPics").replaceWith($("#fPics").val('').clone(true));
		$("#PropertyDescription").val(CKEDITOR.instances["PropertyDescription"].getData());
		return PropertyDetails.AddUpdateAditionalDetails($(this));
    })

	$(document).on('change', '.show-price', function () {
		if ($(this).val() === 'True') {
			$('.show-Box').hide();
			$('#ShowText').removeClass("required");
		}
		else {
			$('.show-Box').show();
			$('#ShowText').addClass("required");
		}
	});
});


var PropertyDetails = {
    AddUpdateDocuments: function (sender) {
        $.ajaxExt({
            url: baseUrl + siteURL.UploadDocumnets,
            type: 'POST',
            validate: false,
            formToPost: $("form#AddUpdateProperty"),
            isAjaxForm: true,
            showThrobber: false,
            showErrorMessage: true,
            messageControl: $('div.messageAlert'),
            success: function (results, message, status, id, list) {
                if (status == ActionStatus.Successfull) {
                    $('#myModal1').modal('hide');
                    $('.modal-backdrop').hide();
                    $('#UploadDocumentNameArray').val($('#UploadDocumentNameArray').val() +
                        list);

                    //var arr = list[0].slice(0, -1).split(',');

                    //if (arr.length > 0 && arr[0] != '') {
                    //    $('#divDocumentUpload').html('');
                    //    // var div = $('#divDocumentUpload').append('<div class="col-lg-12"><br/><h4>Newly Uploaded Documents</h4 ></div >');
                    //    var Table = $('#divDocumentUpload').append('<div class="col-lg-12"><br/><h4>Newly Uploaded Documents</h4 ></div ><table id="tblDoc" class="uploaded-documents"> <tr><th>Title</th> <th>Date</th><th>Document</th> </tr></table>');
                    //    for (var i = 0; i < arr.length; i++) {
                    //        var divdoc = '';
                    //        if (arr[i] != '') {
                    //            var currentdate = new Date();
                    //            var datetime = currentdate.getDate() + "/"
                    //                + (currentdate.getMonth() + 1) + "/"
                    //                + currentdate.getFullYear() + " "
                    //                + currentdate.getHours() + ":"
                    //                + currentdate.getMinutes() + ":"
                    //                + currentdate.getSeconds();
                    //            // divdoc = '<div class="col-lg-3"><a href=' + docPath + arr[i] + ' class="docx" id="doc1" target="_blank"><i id="exist_doc_1_icon" class="fa fa-file-text" aria-hidden="true"></i><span id="doc_1_title">' + arr[i] + '</span><span id="doc_1_icon"></span></a>'
                    //            divdoc = '<tr><td>' + arr[i].split('~')[1] + '</td><td> ' + datetime + ' </td><td><a href=' + docPath + arr[i].split('~')[0] + ' class="docx" id="doc1" target="_blank"><i id="exist_doc_1_icon" class="fa fa-file-text" aria-hidden="true"></i><span id="doc_1_title">' + arr[i].split('~')[0] + '</span><span id="doc_1_icon"></span></a> </td></tr>'
                    //        }
                    //        // div.append(divdoc);
                    //        $('#tblDoc tr:last').after(divdoc);
                    //    }
                    //  }
                }
                PropertyDetails.UpdatePropertyDocumentsDetails();
                //$.ShowMessage($('div.messageAlert'), message, MessageType.Success);

            }
        });
    },
    SetRichTextEditor: function () {
        CKEDITOR.env.isCompatible = true;
        CKEDITOR.replace('PropertyDescription', {
            height: 200,
            // Remove unused plugins.
            removePlugins: 'filebrowser,format,horizontalrule,pastetext,pastefromword,scayt,showborders,stylescombo,table,tabletools,tableselection,wsc',
            // Remove unused buttons.
            removeButtons: 'Anchor,BGColor,Font,Strike,Subscript,Superscript',
            // Width and height are not supported in the BBCode format, so object resizing is disabled.
            disableObjectResizing: true,
            // Define font sizes in percent values.
            fontSize_sizes: "30/30%;50/50%;100/100%;120/120%;150/150%;200/200%;300/300%",
            // Strip CKEditor smileys to those commonly used in BBCode.
            smiley_images: [
                'regular_smile.png', 'sad_smile.png', 'wink_smile.png', 'teeth_smile.png', 'tongue_smile.png',
                'embarrassed_smile.png', 'omg_smile.png', 'whatchutalkingabout_smile.png', 'angel_smile.png',
                'shades_smile.png', 'cry_smile.png', 'kiss.png'
            ],
            smiley_descriptions: [
                'smiley', 'sad', 'wink', 'laugh', 'cheeky', 'blush', 'surprise',
                'indecision', 'angel', 'cool', 'crying', 'kiss'
            ]
        });
    },
    ToggleOwnerMode: function (sender) {
        $('#divOwnerForm').toggle();
        $('#divOwnerDetail').toggle();

        if ($(sender).hasClass("mode-view")) {
            $(sender).addClass('mode-edit');
            $(sender).removeClass('mode-view');
            $(sender).html("Cancel");
        }
        else {
            $(sender).addClass('mode-view');
            $(sender).removeClass('mode-edit');
            $(sender).html('<span class="fa fa-edit"></span> ' + "Edit");
        }
    },
    ToggleAttributeMode: function (sender) {
        $('#divAttributedetail').toggle();
        $('#divAttributeForm').toggle();

        if ($(sender).hasClass("mode-view")) {
            $(sender).addClass('mode-edit');
            $(sender).removeClass('mode-view');
            $(sender).html("Cancel");
        }
        else {
            $(sender).addClass('mode-view');
            $(sender).removeClass('mode-edit');
            $(sender).html('<span class="fa fa-edit"></span> ' + "Edit");
        }
    },
    ToggleAdditionalDetailsMode: function (sender) {
        $('#divAdditionaldetail').toggle();
        $('#divAdditionalform').toggle();

        if ($(sender).hasClass("mode-view")) {
            $(sender).addClass('mode-edit');
            $(sender).removeClass('mode-view');
            $(sender).html("Cancel");
            PropertyDetails.GetPropertyAdditionalDetails();

        }
        else {
            $(sender).addClass('mode-view');
            $(sender).removeClass('mode-edit');
            $(sender).html('<span class="fa fa-edit"></span> ' + "Edit");
            $('#divDocumentsEditForm').hide();
            $('#divDocumentsform').hide();
            $('#divDocumentsdetail').show();
        }
    },
    ToggleDocumentsMode: function (sender) {
        $('#divDocumentsdetail').toggle();
        $('#divDocumentsform').toggle();

        if ($(sender).hasClass("mode-view")) {
            $(sender).addClass('mode-edit');
            $(sender).removeClass('mode-view');
            $(sender).html("Cancel");
            PropertyDetails.GetPropertyDocumentDetailsForm();
        }
        else {
            $(sender).addClass('mode-view');
            $(sender).removeClass('mode-edit');
            $(sender).html('<span class="fa fa-edit"></span> ' + "Edit");
            $('#divDocumentsEditForm').hide();
            $('#divDocumentsform').hide();
        }
    },
    ToggleLegalMode: function (sender) {
        $('#divLegalform').toggle();
        $('#divLegaldetail').toggle();

        if ($(sender).hasClass("mode-view")) {
            $(sender).addClass('mode-edit');
            $(sender).removeClass('mode-view');
            $(sender).html("Cancel");
        }
        else {
            $(sender).addClass('mode-view');
            $(sender).removeClass('mode-edit');
            $(sender).html('<span class="fa fa-edit"></span> ' + "Edit");
        }
    },
    ToggleDetailsListing: function (sender) {
        if ($(sender).hasClass("mode-view")) {
            $(sender).addClass('mode-edit');
            $(sender).removeClass('mode-view');
            $(sender).html("Cancel");
            PropertyDetails.GetPropertyDetailsListingDetails(1);
        }
        else {
            $(sender).addClass('mode-view');
            $(sender).removeClass('mode-edit');
            $(sender).html('<span class="fa fa-edit"></span> ' + "Edit");
            PropertyDetails.GetPropertyDetailsListingDetails(2);
        }
    },

    AddUpdateAttributeDetails: function (sender) {
        var form = $("#formPropertyAttributes");
        $.ajaxExt({
            url: baseUrl + siteURL.UpdatePropertyAttributesDetails,
            type: 'POST',
            validate: true,
            formToValidate: form,
            formToPost: form,
            isAjaxForm: true,
            showThrobber: false,
            showErrorMessage: true,
            messageControl: $('div.messageAlert'),
            success: function (results, message, status, id, s, a, d, data) {
                if (data.results != null) {
                    $('#divAttributedetail').html(data.results[0]);
                    PropertyDetails.ToggleAttributeMode($('#btnEditAttribute'));
                    $('#sBedsCount').html($('.pBedsCount').html());
                    $('#sBathsCount').html($('.pBathsCount').html());
                    $('#sCarParkingCount').html($('.pCarParkingCount').html());
                }
            },
            error: function (a, b, data) {
            }
        });
        return false;
    },
    GetPropertyDocumentDetails: function (sender) {
        var form = $("#formPropertyAttributes");
        $.ajaxExt({
            url: baseUrl + siteURL.UpdatePropertyAttributesDetails,
            type: 'POST',
            validate: true,
            formToValidate: form,
            formToPost: form,
            isAjaxForm: true,
            showThrobber: false,
            showErrorMessage: true,
            messageControl: $('div.messageAlert'),
            success: function (results, message, status, id, s, a, d, data) {
                if (data.results != null) {
                    $('#divAttributedetail').html(data.results[0]);
                    PropertyDetails.ToggleAttributeMode($('#btnEditAttribute'));
                }
            },
            error: function (a, b, data) {
            }
        });
        return false;
    },
    UpdatePropertyDocumentsDetails: function (sender) {
        var form = $("#AddUpdateProperty");
        $.ajaxExt({
            url: baseUrl + siteURL.UpdatePropertyDocumentsDetails,
            type: 'POST',
            validate: true,
            formToValidate: form,
            formToPost: form,
            isAjaxForm: true,
            showThrobber: false,
            showErrorMessage: true,
            messageControl: $('div.messageAlert'),
            success: function (results, message, status, id, s, a, d, data) {
                $.ShowMessage($('div.messageAlert'), message, MessageType.Success);
                if (data.results != null) {
                    $('#divDocumentsdetail').html(data.results[0]);
                    PropertyDetails.ToggleDocumentsMode($('#btnEditDocuments'));
                }
            },
            error: function (a, b, data) {
            }
        });
        return false;
    },
    GetPropertyDocumentDetailsForm: function (propertyUniqueID) {
        $.ajaxExt({
            type: 'POST',
            validate: false,
            showErrorMessage: true,
            messageControl: $('div.messageAlert'),
            showThrobber: true,
            url: baseUrl + siteURL.GetPropertyDocumentDetails,
            data: { propertyUniqueID: $('#propertyUniqueID').val() },
            success: function (results, message, status, id, s, a, d, data) {
                if (data.results != null) {
                    $('#divDocumentsEditForm').html(data.results[0]);
                    $('#divDocumentsEditForm').show();
                    $('#divDocumentsform').show();
                    $('#divDocumentsdetail').hide();
                    Document.AddDocumentArea();
                }
            }
        });
        return false;
    },
    InitializeImageUploader: function () {
        $(document).on("change", "#files", function (e) {
            var files = e.target.files,
                filesLength = files.length;
            for (var i = 0; i < filesLength; i++) {
                var f = files[i]
                var fileReader = new FileReader();
                fileReader.onload = (function (e) {
                    var file = e.target;
                    $("<span class=\"pip\">" +
                        "<img class=\"imageThumb\" src=\"" + e.target.result + "\" title=\"" + file.name + "\"/>" +
                        "<br/><span class=\"remove remove-img-btn\" data-id=" + i + ">X</span>" +
                        "</span>").insertAfter("#files");
                });
                fileReader.readAsDataURL(f);
            }
            ////you can also add an event for selecting specific file
            //$.each(e.target.files, function (index, value) {
            //    //Add your condition for allowing only specific file
            //    var fileReader = new FileReader();
            //    fileReader.readAsDataURL(value);
            //    fileArray.push(fileReader);
            //});
        });
        $(document).on("change", "#fPics", function (e) {
            var files = e.target.files,
                filesLength = files.length;
            for (var i = 0; i < filesLength; i++) {
                var f = files[i]
                var fileReader = new FileReader();
                fileReader.onload = (function (e) {
                    var file = e.target;
                    $("<span class=\"floorPics\">" +
                        "<img class=\"floorImageThumb img-prev\" src=\"" + e.target.result + "\" title=\"" + file.name + "\"/>" +
                        "<br/><span class=\"removefloor remove-img-btn\" data-id=" + i + ">X</span>" +
                        "</span>").insertAfter("#fPics");
                });
                fileReader.readAsDataURL(f);
            }
            ////you can also add an event for selecting specific file
            //$.each(e.target.files, function (index, value) {
            //    //Add your condition for allowing only specific file
            //    var fileReader = new FileReader();
            //    fileReader.readAsDataURL(value);
            //    fileArray.push(fileReader);
            //});
        });
    },
    GetPropertyAdditionalDetails: function (propertyUniqueID) {
        $.ajaxExt({
            type: 'POST',
            validate: false,
            showErrorMessage: true,
            messageControl: $('div.messageAlert'),
            showThrobber: true,
            url: baseUrl + siteURL.GetPropertyAdditionalDetails,
            data: { propertyUniqueID: $('#propertyUniqueID').val() },
            success: function (results, message, status, id, s, a, d, data) {
                if (data.results != null) {
                    $('#divAdditionaldetailForm').html(data.results[0]);
                    $('#divAdditionaldetailForm').show();
                    $('#divAdditionalform').show();
                    $('#divAdditionaldetail').hide();
                    PropertyDetails.SetRichTextEditor();
                    PropertyDetails.InitializeImageUploader();

                }
            }
        });
        return false;
    },

    AddUpdateAditionalDetails: function (sender) {
        var form = $("#formAdditionalDetails");
        $.ajaxExt({
            url: baseUrl + siteURL.UpdatePropertyAdditionalDetails,
            type: 'POST',
            validate: true,
            formToValidate: form,
            formToPost: form,
            isAjaxForm: true,
            showThrobber: false,
            showErrorMessage: true,
            messageControl: $('div.messageAlert'),
            success: function (results, message, status, id, s, a, d, data) {

                $.ShowMessage($('div.messageAlert'), message, MessageType.Success);
                if (data.results != null) {
                    $('#divAdditionaldetail').html(data.results[0]);
                    $('#divPDetail').html(data.results[1]);
                    PropertyDetails.ToggleAdditionalDetailsMode($('#btnEditAddDetail'));
                    $('#sPHeading').html($('.pPHeading').html());
                }

            },
            error: function (a, b, data) {
            }
        });
        return false;
    },


    AddUpdateLegalDetails: function (sender) {
        var form = $("#formPropertyLegalDetails");
        $.ajaxExt({
            url: baseUrl + siteURL.updatepropertyLegalDetails,
            type: 'POST',
            validate: true,
            formToValidate: form,
            formToPost: form,
            isAjaxForm: true,
            showThrobber: false,
            showErrorMessage: true,
            messageControl: $('div.messageAlert'),
            success: function (results, message, status, id, s, a, d, data) {

                $.ShowMessage($('div.messageAlert'), message, MessageType.Success);
                if (data.results != null) {
                    $('#divLegaldetail').html(data.results[0]);
                    PropertyDetails.ToggleLegalMode($('#btnEditLegalDetail'));
                }


            },
            error: function (a, b, data) {
            }
        });
        return false;
    },
    UpdatePropertyOwner: function (sender) {
        var form = $("#formOwnerDetails");
        $.ajaxExt({
            url: baseUrl + siteURL.UpdatePropertyOwnerDetails,
            type: 'POST',
            validate: true,
            formToValidate: form,
            formToPost: form,
            isAjaxForm: true,
            showThrobber: false,
            showErrorMessage: true,
            messageControl: $('div.messageAlert'),
            success: function (results, message, status, id, s, a, d, data) {
                $.ShowMessage($('div.messageAlert'), message, MessageType.Success);
                if (data.results != null) {
                    $('#divOwnerDetail').html(data.results[0]);
                    PropertyDetails.ToggleOwnerMode($('#btnEditOwner'));
                }
            },
            error: function (a, b, data) {
            }
        });
        return false;
    },

    GetPropertyDetailsListingDetails: function (mode) {
        $.ajaxExt({
            url: baseUrl + siteURL.GetPropertyDetailsListingDetails,
            type: 'POST',
            data: { propertyUniqueID: $('#propertyUniqueID').val(), viewmode: mode },
            success: function (results, message, status, id, s, a, d, data) {
                if (data.results != null) {
                    $('#propertyListingDetails').html(data.results[0]);
                }
            },
            error: function (a, b, data) {
            }
        });
        return false;
    },
    UpdatePropertyDetailsListing: function (sender) {
        var form = $("#formPropertyDetailsListing");
        $.ajaxExt({
            url: baseUrl + siteURL.UpdatePropertyDetailsListingDetails,
            type: 'POST',
            validate: true,
            formToValidate: form,
            formToPost: form,
            isAjaxForm: true,
            showThrobber: false,
            showErrorMessage: true,
            messageControl: $('div.messageAlert'),
            success: function (results, message, status, id, s, a, d, data) {
                $.ShowMessage($('div.messageAlert'), message, MessageType.Success);
                if (data.results != null) {
                    $('#propertyListingDetails').html(data.results[0]);
                    PropertyDetails.ToggleDetailsListing($('#btnDetailsListing'));
                }
            },
            error: function (a, b, data) {
            }
        });
        return false;
	},

	uploadPropertyPics: function () {
		var input = document.getElementById('files');
		var files = input.files;
		filesLength = files.length;
		var formData = new FormData();

		for (var i = 0; i < filesLength; i++) {
			var f = files[i]
			formData.append("files", f);
		}
		//   startUpdatingImagesProgressIndicator();
		$(".modalAjaxLoader").fadeIn();

		$.ajax(
			{
				url: "/agent/uploader/ImagesUpload",
				data: formData,
				processData: false,
				contentType: false,
				//async: false,
				global: false,
				cache: false,
				type: "POST",
				success: function (data) {
					uploadDoneFlag = 1;
					var returnedValue = data;
					$('#ImagesNameArray').val(returnedValue);
					$('#files').hide();
					$('#btnUploadImages').hide();
					$("#labelImages").html("100%");
					$("#barImages").css({ width: "100%" });
					$('.remove').hide();
					$(".modalAjaxLoader").fadeOut();
					if (returnedValue != "") {
						var splitted = returnedValue.slice(0, -1).split(',');
						for (var i = 0; i < splitted.length; i++) {
							$('.imageThumb')[i].src = imgPath + splitted[i];
						}
					}
				}
			});
	},

	uploadFloorPics: function () {
		var input = document.getElementById('fPics');
		var files = input.files;
		filesLength = files.length;
		var formData = new FormData();

		for (var i = 0; i < filesLength; i++) {
			var f = files[i]
			formData.append("files", f);
		}

		//   startUpdatingFloorImagesProgressIndicator();

		$(".modalAjaxLoader").fadeIn();

		$.ajax(
			{
				url: "/agent/uploader/FloorImagesUpload",
				data: formData,
				processData: false,
				contentType: false,
				//async: false,
				global: false,
				cache: false,
				type: "POST",
				success: function (data) {
					uploadDoneFlag2 = 1;
					var returnedValue = data;
					$('#FloorImagesNameArray').val(returnedValue);
					$('#fPics').hide();
					$('#btnUploadFloorImages').hide();
					$("#labelFloorImages").html("100%");
					$("#barFloorImages").css({ width: "100%" });
					$('.removefloor').hide();
					$(".modalAjaxLoader").fadeOut();
					if (returnedValue != "") {
						var splitted = returnedValue.slice(0, -1).split(',');
						for (var i = 0; i < splitted.length; i++) {
							$('.floorImageThumb')[i].src = imgPath + splitted[i];
						}
					}
				}
			});
	},
}