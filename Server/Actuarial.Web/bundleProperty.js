var imgPath = 'http://localhost:50490//Property//';
//var imgPath = 'http://bulkbilling.acumobi.com//Property//';
var rowCount = 1;
var rowCount = 1;
var dateFormat = 'mm/dd/yyyy';
var pictures = [];
var floorPictures = [];

var eventHandler = function (ctr) {
	return function () {

		var wrapperContact = $(".input_fields_wrap_contact"); //Fields wrapper
		//  wrapperContact.empty();
		$('.divnew').remove();
		var y = $("#contCount").val(); //initlal text box count
		//if (parseInt($("#contCount").val()) > 0)
		//    y = y - 1;
		$('.selectize-input .item').each(function () {

			//$(wrapper).append('<div class="form-group"><input type="text" class="form-control docProp" placeholder="Title" name="PropertyDocuments[' + x + '].DocTitle" required/><input type="text" placeholder="Description" class=" form-control docProp" name="PropertyDocuments[' + x + '].DocDesc" required/><input name="PropertyDocuments[' + x + '].Document" type="file" class="upload up"><input type="hidden" name="PropertyDocuments.Index" value=' + x + '> <a href="#" class="remove_field"> <i class="fa fa-trash-o" aria-hidden="true"></i></a></div>'); //add input box
			$(wrapperContact).append('<div class="form-group divnew"> <div class="form-check"><label class="form-check-label form_check_inline_label"><input class="form-check-input chkContact" type="checkbox" data-type=' + $(this)[0].dataset.value + '  id="contactlistModel[' + y + '].IsPrimary">' + $(this)[0].innerText.substring(0, $(this)[0].innerText.length - 1) + '<i class="input-helper"></i><span class="hdnspan" style="display:none"> Primary Contact</span></label><input type="hidden" name="contactlistModel[' + y + '].IsPrimary" value=' + false + '><input type="hidden" name="contactlistModel[' + y + '].ContactId" value=' + $(this)[0].dataset.value + '><div class="clearfix"></div></div><a href="javascript:" class="remove_field_contact"> <i class="fa fa-trash-o" aria-hidden="true"></i></a></div>'); //add input box
			y++;
		})
		// $("#contCount").val(y);

	};


};
$(document).ready(function () {
	$("#PropertyContactName").selectize({
		plugins: ['remove_button'],
		maxItems: null,
		valueField: 'id',
		labelField: 'name',
		searchField: 'name',
		options: [],
		load: function (query, callback) {
			if (!query.length) return callback();
			$.ajax({
				url: siteURL.GetContactList,
				type: 'GET',
				dataType: 'json',
				data: {
					Search: query,
					RecordsPerPage: 10,
					AgentID: $("#AgentId").val(),
					ExceptID: $("#hdnPropertyContactName").val()
				},
				error: function () {
					callback();
				},
				success: function (res) {
					//  contList = res;
					callback(res);
				}
			});
		},
		onChange: eventHandler('onChange'),

	})

	$(document).on('change', '.chkContact', function () {
		// $('#hdnPrimaryContact').val('');
		$('.hdnspan').hide();
		if ($(this)[0].checked == true) {
			// console.log($(this).parent().find('.hdnspan'))


			$(this).parent().find('.hdnspan').show();

			$('input.chkContact').not(this).prop('checked', false);
			$('#hdnPrimaryContact').val($(this)[0].dataset.type);
		}

	});

	$('.divreadmore').readmore({
		speed: 75,
		moreLink: '<a href="#">Read more</a>',
		lessLink: '<a href="#">Close</a>',
		collapsedHeight: 100,
		heightMargin: 16,
		embedCSS: false,
		startOpen: false,
		blockCSS: 'display: block; width: 100%;'

	});

	$(document).on('click', '#btnSendEmail', function () {

		if ($("#PrimaryContactEmail").val() != '') {
			$("#msgtextEmail").html("");
			var email_regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
			if (!email_regex.test($("#PrimaryContactEmail").val())) {
				$("#msgtextEmail").html("Enter correct email");
				return false;
			}
			else {
				return Property.SendAppraisalEmail($('#AppraisalUniqueId').val(), $("#PrimaryContactEmail").val());
			}

		}
		else
			$("#msgtextEmail").html("Please add email");
	})

	$(document).on('click', '.doc-link', function () {
		$('#doclink').val($(this).data("typeDoclink"));
		//console.log($('#PropertygoogleLocaltion').val())
		$('#sendDocEmailModal').modal('show');
	})

	// Send Doc link by email
	$(document).on('click', '#btnSendDocEmail', function () {

		if ($("#docemail").val()) {
			$("#msgtextdocEmail").html("");
			var email_regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
			if (!email_regex.test($("#docemail").val())) {
				$("#msgtextdocEmail").html("Enter correct email");
				return false;
			}
			else {
				return Property.SendDocLinkEmail($('#doclink').val(), $("#docemail").val(), $('#PropertygoogleLocaltion').val());
				return true;
			}

		}
		else
			$("#msgtextdocEmail").html("Please add email");
	})


	$(document).on('click', '.apropertytabs', function () {
		var nxttab = $(this).parent('li').next('li').length;
		if (nxttab === 0) {
			$('#btnNext').hide();
		}
		else {
			$('#btnNext').show();
		}
		var prebtn = $(this).parent('li').prev('li').length;
		if (prebtn === 0) {
			$('#btnPrevious').hide();
		}
		else {
			$('#btnPrevious').show();
		}
		setTimeout(function () {
			$("html, body").animate({ scrollTop: 0 }, "slow");
		}, 500);
	})
	if (window.File && window.FileList && window.FileReader) {
		$("#files").on("change", function (e) {
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
	} else {
		alert("Your browser doesn't support to File API")
	}

	if (window.File && window.FileList && window.FileReader) {
		$("#fPics").on("change", function (e) {
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
	} else {
		alert("Your browser doesn't support to File API")
	}
	$(document).on('click', ".removefloor", function () {
		var index = $(this).data('id') - 1;
		var url = $(this).data('url');
		if (url != undefined)
			$('#hastoDeleteFloorPictures').val(url + "," + $('#hastoDeleteFloorPictures').val());
		$(this).parent(".floorPics").remove();
	});
	// Next Prev Button
	$(document).on('click', '#btnNext', function () {
		$('.nav-tabs > .active').next('li').find('a').trigger('click');
		$('#btnPrevious').show();
		var nxttab = $('.nav-tabs > .active').next('li').length;
		if (nxttab === 0) {
			$('#btnNext').hide();
		}

		setTimeout(function () {
			$("html, body").animate({ scrollTop: 0 }, "slow");
		}, 500);
	});

	$("#progressImages").hide();
	$("#progressFloorImages").hide();

	// Upload Property Images
	$(document).on('click', '#btnUploadImages', function () {
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
					stopUpdatingImagesProgressIndicator();
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

	})

	// Upload Floor Images
	$(document).on('click', '#btnUploadFloorImages', function () {
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
					debugger
					uploadDoneFlag2 = 1;
					stopUpdatingFloorImagesProgressIndicator();
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

	})

	var intervalId1;
	var intervalId2;
	var uploadDoneFlag = 0;
	function startUpdatingImagesProgressIndicator() {
		//$("#progressImages").show();
		//if (uploadDoneFlag == 0) {
		//    intervalId2 = setInterval(
		//        // We use the POST requests here to avoid caching problems (we could use the GET requests and disable the cache instead)
		//        function () {
		//            $.ajax(
		//                {
		//                    url: "/agent/uploader/progress",
		//                    type: "POST",
		//                    success: function (progress) {
		//                        if (progress < 100) {
		//                            $("#progressImages").show();
		//                        }
		//                        $("#barImages").css({ width: progress + "%" });
		//                        $("#labelImages").html(progress + "%");
		//                    }
		//                });
		//        },
		//        500
		//    );

		//    }
	}

	var uploadDoneFlag2 = 0;
	function startUpdatingFloorImagesProgressIndicator() {
		$("#progressImages").show();
		if (uploadDoneFlag2 == 0) {
			intervalId1 = setInterval(
				// We use the POST requests here to avoid caching problems (we could use the GET requests and disable the cache instead)
				function () {
					$.ajax(
						{
							url: "/agent/uploader/progress",
							type: "POST",
							success: function (progress) {
								if (progress < 100) {
									$("#progressFloorImages").show();
								}
								$("#barFloorImages").css({ width: progress + "%" });
								$("#labelFloorImages").html(progress + "%");
							}
						});
				},
				500
			);

		}
	}

	function stopUpdatingImagesProgressIndicator() {
		clearInterval(intervalId2);
	}

	function stopUpdatingFloorImagesProgressIndicator() {
		clearInterval(intervalId1);
	}

	$(document).on('click', '#btnPrevious', function () {
		$('.nav-tabs > .active').prev('li').find('a').trigger('click');
		$('#btnNext').show();
		var prebtn = $('.nav-tabs > .active').prev('li').length;
		if (prebtn === 0) {
			$('#btnPrevious').hide();
		}
		setTimeout(function () {
			$("html, body").animate({ scrollTop: 0 }, "slow");
		}, 500);
	});
	$(document).on('click', ".remove", function () {
		var index = $(this).data('id') - 1;
		var url = $(this).data('url');
		if (url != undefined)
			$('#hastoDeletePictures').val(url + "," + $('#hastoDeletePictures').val());
		$(this).parent(".pip").remove();
	});

	//if ($('#AgentId').val() != "" && $('#AgentId').val()) {
	//    $("#drpAgent").val($('#AgentId').val())
	//}

	$(document).on('click', '#AddUpdateDetails', function () {
		$('.upload').val('');
		$("#PropertyDescription").val(CKEDITOR.instances["PropertyDescription"].getData());
		$('.collapse').addClass('show')
		document.getElementById('files').files.FileList = {};
		$("#files").replaceWith($("#files").val('').clone(true));
		$("#fPics").replaceWith($("#fPics").val('').clone(true));
		return Property.AddUpdateDetails($(this));
	});

	$(document).on('click', '.add-new-contact', function () {
		if ($("#PropertyGooglePlacesLocation").val() == "") {
			swal("Alert", "Please enter a address to add new contact", "warning");
			return;
		}
		if ($("#AgentId").val() == "") {
			swal("Alert", "Please select an assigned to add new contact", "warning");
			return;
		}
		$('form.contactForm #AgentId').val($("#AgentId").val());
		$('form.contactForm #PropertyAddress').val($("#PropertyGooglePlacesLocation").val());
		//alert($('form.contactForm #AgentId').val());
		$('#addContactModal').modal('show');

	});

	$(document).on('change', '#ContactType', function () {
		if ($(this).val() === '2') {
			$('.company-div').show();
			$('.req-com').prop('required', true);
		}
		else {
			$('.company-div').hide();
			$('.req-com').prop('required', false);
		}

	});

	$(document).on('click', '#AddUpdateContactDetails', function () {
		return Property.AddUpdateContactDetails($(this));
	});
	//$('#myNotesModal').on('shown.bs.modal', function () {
	//    // alert($(".add-property-note").data("propertyid"));
	//    $("#NotesPropertyId").val($(".add-property-note").data("propertyid"));

	//})
	$(document).on('click', '.add-property-note', function () {
		$("#NotesPropertyId").val($(this).data("propertyid"));
		$('#myNotesModal').modal('show')
	});

	$(document).on('click', '#btnAddNote', function () {
		if ($("#propertyNote").val()) {
			$("#msgtext").html("");
			Property.AddPropertyNote($(this).data('propertyid'));
			setTimeout(function () { $('#myNotesModal').trigger('click.dismiss.bs.modal'); }, 2000);
		}
		else
			$("#msgtext").html("Please add note text");
	})

	$(document).on('click', '.esign-property', function () {
		//alert('check');
		Property.eSignPropertyRecord($(this).data('propertyid'));
	})

	$(document).on('click', '.delete-property', function () {
		Property.DeletePropertyRecord($(this).data('propertyid'));
	})
	$(document).on('click', '.delete-note', function () {
		Property.DeletePropertyNote($(this).data('noteid'));
	})


	$(document).on('change', '.currentWork', function () {
		if (this.checked)
			$(this).prev().hide()
		else
			$(this).prev().show()
	})


	$(document).on('click', '.approve approve-property', function () {
		Property.ApprovePropertyRecord($(this).data('propertyid'));
	})

	$(document).on('click', 'input[type=button]#btnFilterVersion', function () {
		return Property.ManagePropertys($(this));
	});
	$(document).on('click', '.apurpose', function () {
		$('#cur-purpose').val($(this).data('purpose'));
		$('.apurpose').each(function () {
			$(this).removeClass('active');
			$(this).parent().removeClass('active');
		})
		$(this).addClass('active');
		$(this).parent().addClass('active');
		Paging();
	});

	$(document).on('click', '.apropertytabs', function () {
		$('.apropertytabs').each(function () {
			$(this).removeClass('active');
			$(this).parent().removeClass('active');
		})
		$(this).addClass('active');
		$(this).parent().addClass('active');
	})

	$("select#showRecords").on("change", function () {
		return Property.ShowRecords($(this));
	});

	$(document).on('click', '.sorting', function () {
		return Property.SortPropertys($(this));
	});

	$(document).on('click', '.add-enquiry', function () {
		window.location.href = baseUrl + siteURL.AddEnquiry + '/' + $(this).data('propertyid');
	});

	$(document).on('click', '.search-btn', function () {
		return Property.SearchPropertys($(this));
	});


	$(document).on('click', '#addPropertyNote', function () {
		return Property.AddUpdatePropertyNote($(this));

	});

	//$(document).on('click', '.clear-search', function () {
	//    $('input[type="text"], select').val('');
	//    Paging();
	//});

	$(document).on('click', '.see_primary', function () {
		window.location.href = siteURL.ContactDetails + "/" + $(this).data('contact_uid');
	});

	$(document).on('click', '.enquiry-property', function () {
		window.location.href = baseUrl + siteURL.GetPropertyEnquiry + '/' + $(this).data('propertyid');
	});

	$('#Search').keypress(function (e) {
		if (e.which === 13)  // the enter key code
			return Property.SearchPropertys($(this));
	});

	$(document).on('click', '.add-appraisal', function () {
		//window.location.href = baseUrl + siteURL.AddAppraisal + '/' + $(this).data('propertyid');

		if ($('#PropertyContactId').val() != '') {
			window.location.href = baseUrl + siteURL.AddAppraisal + '/' + $(this).data('propertyid');
		}
		else {
			$.ConfirmBox("", "Primary contact is not added. Do you want to add that now ?", null, true, "Yes", true, null, function () {

				//var propID = $('#propertyUniqueID').val();

				//localStorage.setItem('tab', '#collapseTwo');

				//window.location.href = baseUrl + siteURL.EditProperty + '/' + propID;
				$('.nav-tabs a[href="#owners"]').click();
				$('#btnEditOwner').click();

				setTimeout(function () {
					$(window).scrollTop($('#owners').offset().top);
					
				}, 100);

			}, "", function () {
			});
		}


	});

	$(document).on('click', '.upd_agreement', function () {
		console.log($('#PropertySellerEmail').val())
		if ($('#PropertySellerEmail').val() != '') {
			$('#PropertyEnlistModal').modal('show');
		}
		else {
			//$.ConfirmBox("", "Seller Solicitor details are not added. Do you want to add that now ?", null, true, "Yes", true, null, function () {

			//	$('.nav-tabs a[href="#legal"]').click();
			//	$('#btnEditLegalDetail').click();

			//	setTimeout(function () {
			//		$(window).scrollTop($('#legal').offset().top);
			//		$('#PropertySellerFirmName').focus();

			//	}, 100);

			//	//var propID = $('#propertyUniqueID').val();

			//	//localStorage.setItem('tab', '#collapseSix');

			//	//window.location.href = baseUrl + siteURL.EditProperty + '/' + propID;

			//}, "", function () {
			//});
			swal({
				title: "Seller Solicitor",
				text: "Seller Solicitor details are not added",
				type: "info",
				closeOnConfirm: true,
				showLoaderOnConfirm: true
			}, function () {
				$('#PropertyEnlistModal').modal('show');
			});
		}


	});

	$(document).on('click', '.upd_SaleAdvise', function () {
		if ($('#PropertyBuyerEmail').val() != '') {
			$('#SalesAdviseModal').modal('show');
		}
		else {
			$.ConfirmBox("", "Buyer Solicitor details are not added. Please add now", null, true, "OK", true, null, function () {

				$('#SalesAdviseModal').modal('hide');
				// $('#addBuyerSolicitorModal').modal('show');
				$('.nav-tabs a[href="#legal"]').click();
				$('#btnEditLegalDetail').click();

				setTimeout(function () {
					$(window).scrollTop($('#legal').offset().top);
				}, 100);

			}, "", function () {
			});
		}


	});




	$(".postcodes").select2(
		{
			placeholder: "Search by postcode",
			multiple: true,
			maximumSelectionSize: 1,
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


	$(document).on('click', '.details-property', function () {
		window.location.href = baseUrl + siteURL.DetailsProperty + '/' + $(this).data('propertyid');
	});

	//$(document).on('click', '.prop-enlist', function () {
	//	return Property.EnlistProperty($(this).data('propertyid'));
	//   });




	$(document).on('click', '.prop-enlist', function () {
		$('#PropertyUniqueId').val($(this).data('propertyid'));
		$('#propertyUniqueID').val($(this).data('propertyid'));
		$('#PropertyEnlistModal').modal('show');
		//return Property.EnlistProperty($(this).data('propertyid'));
	});


	$(document).on('click', '#btnPropertyEnlist', function () {
		return Property.AgreementDocument($(this));
	});

	$(document).on('click', '#btnUploadContractOfSale', function () {
		return Property.UploadContractOfSale($(this));
	});

	$(document).on('click', '#btnUploadSalesAdvise', function () {
		return Property.UploadSalesAdvise($(this));
	});

	$(document).on('click', '#btnPropertyEnlistNew', function () {
		var msg = "";
		var price = "";
		if ($('#hdnPropPics').length == 0 && $('#PropertyDescription').val() == '') {
			msg = "Property description and photos are not added yet. Do you want to add that now?";
		}
		else if ($('#hdnPropPics').length > 0 && $('#PropertyDescription').val() == '') {
			msg = "Property description are not added yet. Do you want to add that now?";
		}
		else if ($('#hdnPropPics').length == 0 && $('#PropertyDescription').val() != '') {
			msg = "Property photos are not added yet. Do you want to add that now?";
		}
		else if ($('#PropertyPrice').val() == '') {
			msg = "Property price are not added yet. Do you want to add that now?";
			price = "Property price are not added yet. Do you want to add that now?";
		}
		if (msg == '') {
			return Property.EnlistProperty($(this));
		}
		else {
			$.ConfirmBox("", msg, null, true, "Yes", true, null, function () {
				if (price != '') {
					$('.nav-tabs a[href="#listing"]').click();
					$('#btnDetailsListing').click();

					setTimeout(function () {
						$(window).scrollTop($('#listing').offset().top);

					}, 100);
				}
				else {
					$('.nav-tabs a[href="#add_details"]').click();
					$('#btnEditAddDetail').click();

					setTimeout(function () {
						$(window).scrollTop($('#add_details').offset().top);

					}, 100);
				}
				
				//var propID = $('#propertyUniqueID').val();

				//localStorage.setItem('tab', '#collapseFour');

				//window.location.href = baseUrl + siteURL.EditProperty + '/' + propID;

			}, "", function () {
			});
		}
	});

	$(document).on('click', '#btnAddUpdateSolicitorDetail', function () {
		return Property.AddUpdateBuyerSolicitor($(this));
	});

	$(document).on('change', '.priceRadio', function () {
		if ($(this).val() === 'True') {
			$('.price-text').show();
			$('#PropertyPrice').addClass("required");
		}
		else {
			$('.price-text').hide();
			$('#PropertyPrice').removeClass("required");
		}
	});

	$(document).on('click', '.modal-prop-enlist', function () {
		var msg = "";
		var price = "";
		if ($('#hdnPropPics').val() == 0 && $('#PropertyDescription').val() == '') {
			msg = "Property description and photos are not added yet. Do you want to add that now?";
		}
		else if ($('#hdnPropPics').val() > 0 && $('#PropertyDescription').val() == '') {
			msg = "Property description are not added yet. Do you want to add that now?";
		}
		else if ($('#hdnPropPics').val() == 0 && $('#PropertyDescription').val() != '') {
			msg = "Property photos are not added yet. Do you want to add that now?";
		}
		else if ($('#PropertyPrice').val() == '') {
			msg = "Property price are not added yet. Do you want to add that now?";
			price = "Property price are not added yet. Do you want to add that now?";
		}
		if (msg == '') {
			//$('#EnlistPropertyModal').modal('show');
			return Property.EnlistProperty($(this));
		}
		else {
			$.ConfirmBox("", msg, null, true, "Yes", true, null, function () {
				if (price != '') {
					$('.nav-tabs a[href="#listing"]').click();
					$('#btnDetailsListing').click();

					setTimeout(function () {
						$(window).scrollTop($('#listing').offset().top);

					}, 100);
				}
				else {
					$('.nav-tabs a[href="#add_details"]').click();
					$('#btnEditAddDetail').click();

					setTimeout(function () {
						$(window).scrollTop($('#add_details').offset().top);

					}, 100);
				}
				//var propID = $('#propertyUniqueID').val();

				//localStorage.setItem('tab', '#collapseFour');

				//window.location.href = baseUrl + siteURL.EditProperty + '/' + propID;

			}, "", function () {
			});
		}
	});

	/// End

})



function initPlaces() {
	var input = document.getElementsByClassName('google_map_placeholder');
	var autocompletes = [];
	for (var i = 0; i < input.length; i++) {
		var autocomplete = new google.maps.places.Autocomplete(input[i]);
		autocomplete.inputId = input[i].id;
		autocomplete.addListener('place_changed', fillIn);
		autocompletes.push(autocomplete);
	}
	function fillIn() {
		console.log(this.inputId);
		var place = this.getPlace();
		console.log(place.address_components[0].long_name);
	}
}

var Property = {
	AddUpdateContactDetails: function (sender) {
		var form = $("form.contactForm");
		$.ajaxExt({
			url: baseUrl + siteURL.AddUpdateContactDetails,
			type: 'POST',
			validate: true,
			formToValidate: form,
			formToPost: form,
			isScroll: false,
			isAjaxForm: true,
			showThrobber: false,
			showErrorMessage: true,
			messageControl: $('div.messageAlert'),
			success: function (results, message, status, id) {
				if (status == ActionStatus.Successfull) {
					if (id != "") {

						$.ajax({
							url: siteURL.GetInitContactList,
							type: "Get",
							dataType: "json", global: false,
							cache: false,
							data: {
								Ids: id,
							}
						}).done(function (data) {
							var results;
							results = [];

							var wrapperContact = $(".input_fields_wrap_contact"); //Fields wrapper
							//  wrapperContact.empty();

							var y = $("#contCount").val(); //initlal count

							$.each(data, function (index, item) {
								results.push({
									id: item.id,
									text: item.name
								});
								//$(wrapper).append('<div class="form-group"><input type="text" class="form-control docProp" placeholder="Title" name="PropertyDocuments[' + x + '].DocTitle" required/><input type="text" placeholder="Description" class=" form-control docProp" name="PropertyDocuments[' + x + '].DocDesc" required/><input name="PropertyDocuments[' + x + '].Document" type="file" class="upload up"><input type="hidden" name="PropertyDocuments.Index" value=' + x + '> <a href="#" class="remove_field"> <i class="fa fa-trash-o" aria-hidden="true"></i></a></div>'); //add input box
								$(wrapperContact).append('<div class="form-group divnew"> <div class="form-check"><label class="form-check-label form_check_inline_label"><input class="form-check-input chkContact" type="checkbox" data-type=' + item.id + '  id="contactlistModel[' + y + '].IsPrimary">' + item.name + '<i class="input-helper"></i><span class="hdnspan" style="display:none"> Primary Contact</span></label><input type="hidden" name="contactlistModel[' + y + '].IsPrimary" value=' + false + '><input type="hidden" name="contactlistModel[' + y + '].ContactId" value=' + item.id + '><div class="clearfix"></div></div><a href="#" class="remove_field_contact"> <i class="fa fa-trash-o" aria-hidden="true"></i></a></div>'); //add input box
								y++;

								if ($('#hdnPropertyContactName').val() != '')
									$('#hdnPropertyContactName').val($('#hdnPropertyContactName').val() + ',' + item.id)
								else
									$('#hdnPropertyContactName').val(item.id)

							});
							$("#contCount").val(y);
							console.log('results', results)
						});
					}

					// $("#PropertyContactName").select2("val", id)
					$('#addContactModal').modal('hide');
					$('form.contactForm').reset();
				}
				$.ShowMessage($('div.messageAlert'), message, MessageType.Success);

			}
		});

		//alert($("iframe").parent("#myModal"));
		//$("iframe").parent(".add-contact-popup").hide();
		//$("iframe").parent("#myModal").hide();//.trigger('click.dismiss.bs.modal');
		return false;
	},
	BindImagesToForm: function () {
		var i = 0;
		$('.imageThumb').each(function () {
			pictures.push($(this).attr("src"))
			$('.pics').append('<input type="hidden" id="PropertyPics[' + i + ']" name="PropertyPics[' + i + ']" value=' + $(this).attr("src") + ' />');
			i += 1;
		})
		i = 0;
		$('.floorImageThumb').each(function () {
			floorPictures.push($(this).attr("src"))
			$('.floorPix').append('<input type="hidden" id="FloorPics[' + i + ']" name="FloorPics[' + i + ']" value=' + $(this).attr("src") + ' />');
			i += 1;
		})
	},
	AddUpdatePropertyNote: function (sender) {
		var form = $("form.Property_Note_form");
		$.ajaxExt({
			url: baseUrl + siteURL.AddUpdatePropertyNote,
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
					window.location.reload();
				}, 2000);
			}
		});
		return false;
	},
	AddUpdateDetails: function (sender) {
		var form = $("form#AddUpdateProperty");
		$.ajaxExt({
			url: baseUrl + siteURL.AddUpdatePropertyDetails,
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

				var propID = $('#propertyUniqueID').val();
				if (propID != '') {
					window.location.href = baseUrl + siteURL.DetailsProperty + '/' + propID;
				}
				else {
					setTimeout(function () {
						window.location.href = siteURL.PropertyList;
					}, 2000);
				}

			},
			error: function (a, b, data) {
				if (data.hasError == true) {
					$('#PropertyGooglePlacesLocation').focus();
					$('#PropertyGooglePlacesLocation').next().addClass("field-validation-error");
					$('#PropertyGooglePlacesLocation').addClass("input-validation-error");
					$('#PropertyGooglePlacesLocation').next().html('This property is already exist.')
				}
				else {
					$('#PropertyGooglePlacesLocation').next().removeClass("field-validation-error");
					$('#PropertyGooglePlacesLocation').removeClass("input-validation-error");
					$('#PropertyGooglePlacesLocation').next().html('')
				}
			}
		});
		return false;
	},
	SortPropertys: function (sender) {
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

	ManagePropertys: function (totalCount) {
		var totalRecords = 0;
		totalRecords = parseInt(totalCount);
		PageNumbering(totalRecords);
	},

	SearchPropertys: function (sender) {
		paging.startIndex = 1;
		Paging(sender);
	},

	ShowRecords: function (sender) {
		paging.startIndex = 1;
		paging.pageSize = parseInt($(sender).find('option:selected').val());
		Paging(sender);
	},

	DeleteProperty: function (sender) {
		$.ConfirmBox("", "Are you sure?", null, true, "Yes", true, null, function () {
			$.ajax({
				type: "GET",
				url: siteURL.DeleteProperty,
				contentType: "application/json",
				dataType: "json",
				success: function (response) {
				},
				failure: function (response) {
					alert(response);
				}
			});
		});
	},
	DeletePropertyNote: function (sender) {
		$.ConfirmBox("", "Are you sure?", null, true, "Yes", true, null, function () {
			$.ajaxExt({
				type: 'POST',
				validate: false,
				showErrorMessage: true,
				messageControl: $('div.messageAlert'),
				showThrobber: true,
				url: baseUrl + siteURL.DeletePropertyNote,
				data: { noteID: sender },
				success: function (results, message, status) {
					$.ShowMessage($('div.messageAlert'), message, status);
					setTimeout(function () {
						window.location.reload();
					}, 2000);
				}
			});
		}, "", function () {

		});
	},
	ApprovePropertyRecord: function (id) {
		$.ConfirmBox("", "Are you sure want to approve this record?", null, true, "Yes", true, null, function () {
			$.ajaxExt({
				type: 'POST',
				validate: false,
				showErrorMessage: true,
				messageControl: $('div.messageAlert'),
				showThrobber: true,
				url: baseUrl + siteURL.ApproveProperty,
				data: { propertyID: id },
				success: function (results, message, status) {
					$.ShowMessage($('div.messageAlert'), message, status);
					Paging();
				}
			});
		}, "", function () {
		});
	},

	EnableDisableProperty: function (sender) {
		$.ConfirmBox("", "Are you sure?", null, true, "Yes", true, null, function () {
			$.ajax({
				type: "GET",
				url: siteURL.EnableDisableProperty,
				contentType: "application/json",
				dataType: "json",
				success: function (response) {
				},
				failure: function (response) {
					alert(response);
				}
			});
		});
	},

	DeletePropertyRecord: function (id) {
		$.ConfirmBox("", "Are you sure?", null, true, "Yes", true, null, function () {
			$.ajaxExt({
				type: 'POST',
				validate: false,
				showErrorMessage: true,
				messageControl: $('div.messageAlert'),
				showThrobber: true,
				url: baseUrl + siteURL.DeleteProperty,
				data: { propertyID: id },
				success: function (results, message, status) {

					$.ShowMessage($('div.messageAlert'), message, status);
					window.location.reload();
				}
			});
		}, "", function () {

		});
	},

	AddPropertyNote: function (id) {
		var note = $("#propertyNote").val();
		var name = $("#name").val();
		var pid = $("#NotesPropertyId").val();
		//alert($(this).data("propertyid"));

		$.ajaxExt({
			type: 'POST',
			validate: false,
			showErrorMessage: true,
			messageControl: $('div.messageAlert'),
			showThrobber: true,
			url: baseUrl + siteURL.AddNote,
			data: { propertyID: pid, NoteText: note, name: name },
			success: function (results, message, status) {
				$.ShowMessage($('div.messageAlert'), message, status);
				window.location.reload();
			}
		});
	},

	eSignPropertyRecord: function (id) {
		$.ajaxExt({
			type: 'POST',
			validate: false,
			showErrorMessage: true,
			messageControl: $('div.messageAlert'),
			showThrobber: true,
			url: baseUrl + siteURL.eSignProperty,
			data: { propertyID: id },
			success: function (results, message, status) {

				$.ShowMessage($('div.messageAlert'), message, status);
				window.location.reload();
			}
		});
	},

	AddNewExperience: function () {
		var experiencediv = '<tr class="data-contact-person">' +
			'<td><input type="text" name="AffiliationList[' + rowCount + '].CompanyName" class="form-control" /></td>' +
			'<td><textarea name="AffiliationList[' + rowCount + '].CompanyDesc" class="form-control" /></td>' +
			'<td><input type="text" data-id=' + rowCount + ' id=start-' + rowCount + ' name="AffiliationList[' + rowCount + '].StartDate" class="form-control" readonly = "readonly" /></td>' +
			'<td><input type="text" data-id=' + rowCount + ' id=end-' + rowCount + ' name="AffiliationList[' + rowCount + '].EndDate" class="form-control" readonly = "readonly" /></td>' +
			'<td><button type="button" id="btnAdd" class="btn btn-xs btn-primary add-exp">Add More</button>' +
			'<button type="button" id="btnDelete" class="delete-exp btn btn btn-danger btn-xs">Remove</button></td>' +
			'</tr>';
		$('#exp-table').append(experiencediv); // Adding these controls to Main table class  
		Property.AssignStartEndDate(rowCount);
		rowCount += 1;
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

	SendAppraisalEmail: function (appUniqId, email) {

		$.ajaxExt({
			type: 'POST',
			validate: false,
			showErrorMessage: true,
			messageControl: $('div.messageAlert'),
			showThrobber: true,
			url: baseUrl + siteURL.sendAppraisalsEmail,
			data: { appUniqueId: appUniqId, email: email },
			success: function (results, message, status) {
				$.ShowMessage($('div.messageAlert'), message, status);
				window.location.reload();
			}
		});
	},
	AgreementDocument: function (sender) {
		var form = $("#FormPropertyEnlist");
		$.ajaxExt({
			type: 'POST',
			validate: true,
			formToValidate: form,
			formToPost: form,
			isAjaxForm: true,
			showErrorMessage: true,
			messageControl: $('div.messageAlert'),
			showThrobber: true,
			url: baseUrl + siteURL.AgreementDocument,
			success: function (results, message, status, id) {
				$.ShowMessage($('div.messageAlert'), message, status);

				setTimeout(function () {
					window.location.reload();
				}, 2000);

			},
			error: function (message, id) {

				if (id > 0) {
					$.ConfirmBox("", "Required Seller Solicitor Detail want to redirect Edit Property  ?", null, true, "Yes", true, null, function () {

						var propID = $('#propertyUniqueID').val();

						localStorage.setItem('tab', '#collapseSix');

						window.location.href = baseUrl + siteURL.EditProperty + '/' + propID;

					}, "", function () {
					});
				}

			}
		});

	},

	UploadContractOfSale: function (sender) {
		var form = $("#FormContractOfSale");
		$.ajaxExt({
			type: 'POST',
			validate: true,
			formToValidate: form,
			formToPost: form,
			isAjaxForm: true,
			showErrorMessage: true,
			messageControl: $('div.messageAlert'),
			showThrobber: true,
			url: baseUrl + siteURL.ContractOfSale,
			success: function (results, message, status) {
				$.ShowMessage($('div.messageAlert'), message, status);
				setTimeout(function () {
					window.location.reload();
				}, 2000);
			}
		});

	},

	UploadSalesAdvise: function (sender) {
		var form = $("#FormSalesAdvise");
		$.ajaxExt({
			type: 'POST',
			validate: true,
			formToValidate: form,
			formToPost: form,
			isAjaxForm: true,
			showErrorMessage: true,
			messageControl: $('div.messageAlert'),
			showThrobber: true,
			url: baseUrl + siteURL.SalesAdviseDocument,
			success: function (results, message, status) {
				$.ShowMessage($('div.messageAlert'), message, status);
				setTimeout(function () {
					window.location.reload();
				}, 2000);
			},
			error: function (message, id) {

				if (id > 0) {
					//$.ConfirmBox("", "Required Buyer Solicitor Detail want to redirect Edit Property  ?", null, true, "Yes", true, null, function () {

					//	var propID = $('#propertyUniqueID').val();

					//	window.location.href = baseUrl + siteURL.EditProperty + '/' + propID;

					//}, "", function () {
					//});
					$('#SalesAdviseModal').modal('hide');
					$('#addBuyerSolicitorModal').modal('show');
				}

			}
		});

	},

	EnlistProperty: function (sender) {
		$.ConfirmBox("", "Are you sure want to Enlist ?", null, true, "Enlist", true, null, function () {
			var propertyId = $('#propertyUniqueID').val();
		//var form = $("#FormEnlist");
		$.ajaxExt({
			type: 'POST',
			validate: false,
			showErrorMessage: true,
			messageControl: $('div.messageAlert'),
			showThrobber: true,
			url: baseUrl + siteURL.EnlistProperty,
			data: { propertyID: propertyId },
			success: function (results, message, status) {
				$.ShowMessage($('div.messageAlert'), message, status);
				setTimeout(function () {
					window.location.reload();
				}, 2000);
			},
			error: function (message, id) {

				if (id > 0) {
					$.ConfirmBox("", "Required Images want to redirect Edit Property  ?", null, true, "Yes", true, null, function () {

						var propID = $('#propertyUniqueID').val();

						localStorage.setItem('tab', '#collapseFour');

						window.location.href = baseUrl + siteURL.EditProperty + '/' + propID;

					}, "", function () {
					});
				}

			}
		});
		}, "", function () {
		});

	},

	SendDocLinkEmail: function (docLink, email, property) {

		$.ajaxExt({
			type: 'POST',
			validate: false,
			showErrorMessage: true,
			messageControl: $('div.messageAlert'),
			showThrobber: true,
			url: baseUrl + siteURL.sendDocLinkEmail,
			data: { docLink: docLink, email: email, property: property },
			success: function (results, message, status) {
				$.ShowMessage($('div.messageAlert'), message, status);
				window.location.reload();
			}
		});
	},


	AddUpdateBuyerSolicitor: function (sender) {
		var form = $("#FormBuyerSolicitor");
		$.ajaxExt({
			type: 'POST',
			validate: true,
			formToValidate: form,
			formToPost: form,
			isAjaxForm: true,
			showErrorMessage: true,
			messageControl: $('div.messageAlert'),
			showThrobber: true,
			url: baseUrl + siteURL.AddUpdateBuyerSolicitorDetails,
			success: function (results, message, status) {
				$.ShowMessage($('div.messageAlert'), message, status);
				setTimeout(function () {
					window.location.reload();
				}, 2000);
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
	obj.Purpose = $('#cur-purpose').val();
	obj.minDate = $('#minDate').val();
	obj.maxDate = $('#maxDate').val();
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
		url: baseUrl + siteURL.GetPropertyPagingList,
		success: function (results, message) {
			$('#divResult table:first tbody').html(results[0]);
			PageNumbering(results[1]);

		}
	});
}

$(document).on("click", ".add-exp", function () { //
	Property.AddNewExperience();
});

function getDate(element) {
	try {
		date = new Date(element.value);;
	} catch (error) {
		date = null;
	}

	return date;
}

$(document).on("click", ".delete-exp", function () {
	rowCount = -1;
	$(this).closest("tr").remove(); // closest used to remove the respective 'tr' in which I have my controls   
});

function showAddressOnMap(address) {
	geocoder = new google.maps.Geocoder();
	var lat = '';
	var lng = '';
	geocoder.geocode({ 'address': address }, function (results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			lat = results[0].geometry.location.lat(); //getting the lat
			lng = results[0].geometry.location.lng(); //getting the lng
			//alert(lat);
			map.setCenter(results[0].geometry.location);
			var marker = new google.maps.Marker({
				map: map,
				position: results[0].geometry.location
			});
		} else {
			alert("Geocode was not successful for the following reason: " + status);
		}
	});
	var latlng = new google.maps.LatLng(lat, lng);
	var myOptions = {
		zoom: 8,
		center: latlng,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	}
	map = new google.maps.Map(document.getElementById("map"), myOptions);
}
function readmore() {
	debugger
	var dots = document.getElementById("dots");
	var moreText = document.getElementById("more");
	var btnText = document.getElementById("myBtn");

	if (dots.style.display === "none") {
		dots.style.display = "inline";
		btnText.innerHTML = "Read more";
		moreText.style.display = "none";
	} else {
		dots.style.display = "none";
		btnText.innerHTML = "Read less";
		moreText.style.display = "inline";
	}
}
function InitSideMenu() {
    var pgurl = window.location.href.substr(window.location.href
        .lastIndexOf("/") + 1);
    $("ul.nav li.nav-item a.nav-link").each(function () {
        var href = $(this).attr("href").substr($(this).attr("href")
            .lastIndexOf("/") + 1);
        if (href === pgurl)
            $(this).parent().addClass("active-page");
    })
}
/* here's the code if u want to use plain javascript

function setActive() {
  aObj = document.getElementById('nav').getElementsByTagName('a');
  for(i=0;i<aObj.length;i++) { 
    if(document.location.href.indexOf(aObj[i].href)>=0) {
      aObj[i].className='active';
    }
  }
}

window.onload = setActive;

*/
var baseUrl = '';
var MessageType = {
    Success: 1,
    Error: 2,
    Warning: 3,
    None: 4
};
var ViewMode = {
    MapView: 99,
}
var ActionStatus = {
    Successfull: 1,
    Error: 2,
    LoggedOut: 3,
    Unauthorized: 4
}

var Constants = {
    PageSize: 1
}
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
function checkCookie() {
    var username = getCookie("username");
    if (username != "") {
        alert("Welcome again " + username);
    } else {
        username = prompt("Please enter your name:", "");
        if (username != "" && username != null) {
            setCookie("username", username, 365);
        }
    }
}
//====== End Enums & Constants =====

$.ShowThrobber = function (throbberPosition, button) {
    if (button != undefined)
        $(button).attr("disabled", "disabled");
    $(".md-overlay").css("visibility", "visible");
    $(".md-overlay").css("opacity", "1");
    $("#MainThrobberImage").show().position(throbberPosition);
}

$.RemoveThrobber = function (button) {
    if (button != undefined)
        $(button).removeAttr("disabled");
    $("#MainThrobberImage").hide();
    $("#modalThrobberImage").hide();
    $(".md-overlay").removeAttr("style");
}

$.ShowModalThrobber = function (throbberPosition, button) {
    if (button != undefined)
        $(button).attr("disabled", "disabled");
    $("#modalThrobberImage").show().position(throbberPosition);
}

$.ShowMessage = function (messageSpan, message, messageType) {
    /*================= Sample Usage =========================
    $.ShowMessage($(selector), "This is a dummy message", MessageType.Success)
    ==========================================================*/


    if (messageType == MessageType.Success) {
        var htmlMessage = '<button aria-hidden="true" data-dismiss="alert" class="close" type="button">×</button><div class="icon"><i class="fa fa-check sign"></i></div><strong>Success! </strong>' + message;
        //	$(messageSpan).html(htmlMessage).removeClass("alert-info").addClass("alert-success").fadeIn();
        $.showGritterMessage(message, messageType);
        //$("#mod-success .modal-body p[name=returnMessage]:first").html(message);
        //$("button#btnSuccess").trigger("click");
    }
    else if (messageType == MessageType.Error) {
        var htmlMessage = '<button aria-hidden="true" data-dismiss="alert" class="close" type="button">×</button><div class="icon"><i class="fa fa-times-circle sign"></i></div><strong>Error! </strong>' + message;
        //$(messageSpan).html(htmlMessage).removeClass("alert-success").addClass("alert-danger").fadeIn();
        $.showGritterMessage(message, messageType);
    }
    else if (messageType == MessageType.Warning) {
        var htmlMessage = '<button aria-hidden="true" data-dismiss="alert" class="close" type="button">×</button><div class="icon"><i class="fa fa-times-circle sign"></i></div><strong>Alert! </strong>' + message;
        //$(messageSpan).html(htmlMessage).removeClass("alert-success").addClass("alert-warning").fadeIn();
        $.showGritterMessage(message, messageType);
    }
    if (messageType == MessageType.Success) {
        setTimeout(function () {
            $(messageSpan).hide().html('');
        }, 5000);
    }
}

$.ShowThemeAlertMessage = function (messageSpan, message, messageType) {
    //var htmlMessage = '<button aria-hidden="true" data-dismiss="alert" class="close" type="button">×</button><div class="icon"><i class="fa fa-check sign"></i></div><strong>Success! </strong>' + message;
    var htmlMessage = '<button aria-hidden="true" data-dismiss="alert" class="close" type="button">×</button><i class="fa fa-check sign"></i><strong>Success! </strong>' + message;
    $(messageSpan).html(htmlMessage).removeClass("alert-info").addClass("alert-success").fadeIn();
    $('html, body').animate({
        scrollTop: 0
    }, 400);
    setTimeout(function () {
        $(messageSpan).hide().html('');
    }, 5000);
}

$.ShowThemeAlertMessage2 = function (messageSpan, message, messageType) {
    var htmlMessage = '<button aria-hidden="true" data-dismiss="alert" class="close" type="button">×</button><div class="icon"><i class="fa fa-check sign"></i></div><strong>Success! </strong>' + message;
    //var htmlMessage = '<button aria-hidden="true" data-dismiss="alert" class="close" type="button">×</button><i class="fa fa-check sign"></i><strong>Success! </strong>' + message;
    $(messageSpan).html(htmlMessage).removeClass("alert-info").addClass("alert-success").fadeIn();
    $('html, body').animate({
        scrollTop: 0
    }, 400);
    setTimeout(function () {
        $(messageSpan).hide().html('');
    }, 5000);

}

$.showStaticMessage = function (messageSpan, message, messageType) {
    $.gritter.add({
        position: 'bottom-left',
        title: '<strong>Success!</strong>',
        text: message,
        imageIcon: "<img src='/images/success_head.png' width='45'/>",
        class_name: 'clean',
        time: '20000'
    });
}

$.showGritterMessage = function (message, messageType) {
    $.RemoveExistingMessage();
    if (messageType == MessageType.Success) {

        $.gritter.add({
            position: 'bottom-left',
            title: '<strong>Success!</strong>',
            text: message,
            //imageIcon: "<img src='/images/success_head.png' width='45'/>",
            //imageIcon: '<i class="fa fa-check fa-4x" style="color:#4CAE4C"></i>',
            class_name: 'clean',
            time: '5000'
        });

    } else if (messageType == MessageType.Error) {
        $.gritter.add({
            position: 'bottom-left',
            title: '<strong>Error!</strong>',
            text: message,
            //imageIcon: "<img src='/images/error_head.png' width='45'/>",
            //imageIcon: '<i class="fa fa-times-circle fa-4x" style="color:#B94A48"></i>',
            class_name: 'clean',
            time: '5000'

        });
    }
    else if (messageType == MessageType.Warning) {
        $.gritter.add({
            position: 'bottom-left',
            title: '<strong>Warning!</strong>',
            text: message,
            //imageIcon: "<img src='/images/alert_head.png' width='45'/>",
            //imageIcon: '<i class="fa fa-warning fa-4x" style="color:#C09853"></i>',
            class_name: 'clean',
            time: '5000'
        });
    }
}
$(document).ready(function () {
    $(document).ajaxStart(function () {
        var curRequestId = document.activeElement.id;
        if ((curRequestId == "btnUploadImages" || curRequestId == "btnUploadFloorImages") || document.activeElement.className.includes("select2-input")) {
        }
        else {
            $(".modalAjaxLoader").fadeIn();
        }
    });
    $(document).ajaxComplete(function () {
        $(".modalAjaxLoader").fadeOut();
    });
});

$.RemoveExistingMessage = function () {
    $('.gritter-item-wrapper').remove();
}
$.IsNumericCustom = function (input) {
    return (input - 0) == input && input.length > 0;
}

$.IsEmailCustom = function (email) {
    var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}

$.IsCharNum = function (str) {
    if (/[^a-zA-Z0-9]/.test(str)) return false;
    return true;
}

$.IsAlphaNumeric = function (val) {
    if (/[^a-zA-Z0-9 ]/.test(val)) return false;
    return true;
}

$.ValidateFiles = function (form) {

    var isValid = true;

    $(form).find("input[type=file][required-field]").each(function () {
        if (!$.trim($(this).val())) {
            isValid = false;
            $(form).find('span[for=' + $(this).attr('name') + ']').addClass('field-validation-error').removeClass('field-validation-valid').html($(this).attr('required-field'));
        }
        else $(form).find('span[for=' + $(this).attr('name') + ']').addClass('field-validation-valid').removeClass('field-validation-error').html('');
    });

    $(form).find("input[type=file][allowed-formats]").each(function () {
        if ($(this).val()) {
            var filetype = $(this).val().split(".");
            filetype = filetype[filetype.length - 1].toLowerCase();

            if ($(this).attr("allowed-formats").indexOf(filetype) == -1) {
                isValid = false;
                $(form).find('span[for=' + $(this).attr('name') + ']').addClass('field-validation-error').removeClass('field-validation-valid').html($(this).attr('error-message'));
            }
            else $(form).find('span[for=' + $(this).attr('name') + ']').addClass('field-validation-valid').removeClass('field-validation-error').html('');
        }
    });

    return isValid;
}

$.ajaxExt = function (parameters) {

    /*=====================================Sample Usage======================================================
    $.ajaxExt({
    type: "POST",                                                                                       //default is "POST"
    error: function () { },                                                                             //called when an unexpected error occurs
    Async : false,                                                                                      // optional
    data: {name: "value"}                                                                               //overwrites the form parameter
    messageControl:  $(selector),                                                                       //the control where the status message needs to be displayed
    throbberPosition: { my: "left center", at: "right center", of: sender, offset: "5 0" },             //the position at which the throbber needs to be displayed 
    url: url,                                                                                           //the url that needs to be hit
    success: function (data) {},                                                                        //called after the request has been executed without any unhandeled exception
    showThrobber: false                                                                                 //If the throbber need to be displayed
    showErrorMessage : true                                                                             //If the error message needs to be displayed
    containFiles: false                                                                                 //If the form contains files            
    formToPost: $('form')                                                                                     //The reference to the form to be posted
    });
    ===============================================================================================*/

    function onError(a, b, c, parameters) {
        debugger
        if (parameters.showErrorMessage != false) $.ShowMessage($(parameters.messageControl), "Unexpected Error", MessageType.Error);
        else if (parameters.error != undefined) parameters.error("Unexpected Error");

        if (parameters.showThrobber == true) $.RemoveThrobber(parameters.button);
    }

    function onSuccess(data, parameters) {
        //	$('html, body').animate({ scrollTop: 0 }, 400);
        if (parameters.showThrobber == true) $.RemoveThrobber(parameters.button);

        try {
            if (data.status == undefined) {
                if (parameters.showErrorMessage != false) $.ShowMessage($(parameters.messageControl), "Invalid data returned in the response", MessageType.Error);
                else if (parameters.error != undefined) parameters.error("Invalid data returned in the response");

                return false;
            }
        }
        catch (ex) {
            if (parameters.showErrorMessage != false) $.ShowMessage($(parameters.messageControl), "Invalid data returned in the response", MessageType.Error);
            else if (parameters.error != undefined) parameters.error("Invalid data returned in the response");
        }

        if (data.status == ActionStatus.Error) {
            if (parameters.error != undefined)
                parameters.error(data.message, data.id, data);
            if (parameters.showErrorMessage != false)
                $.ShowMessage($(parameters.messageControl), data.message, MessageType.Error);

        }
        else if (parameters.success) {

            if (data.viewMode == ViewMode.MapView) {
                parameters.success(data);
            }
            else {
                parameters.success(data.results, data.message, data.status, data.id, data.list, data.object, data.url, data);
            }
        }
    }

    parameters.type = parameters.type == undefined ? "POST" : parameters.type;
    parameters.showErrorMessage = parameters.showErrorMessage == undefined ? true : parameters.showErrorMessage;
    parameters.showThrobber = parameters.showThrobber == undefined ? true : parameters.showThrobber;
    parameters.showPopupThrobber = parameters.showPopupThrobber == undefined ? false : parameters.showPopupThrobber;
    parameters.validate = parameters.validate == undefined ? false : parameters.validate;
    parameters.global = parameters.global == undefined ? true : parameters.global;
    parameters.cache = parameters.cache == undefined ? true : parameters.cache;
    parameters.containFiles = parameters.containFiles == undefined ? false : parameters.containFiles;
    parameters.isAjaxForm = parameters.isAjaxForm == undefined ? false : parameters.isAjaxForm;
    parameters.isScroll = parameters.isScroll == undefined ? true : parameters.isScroll;
    if (parameters.validate == true) {
        var isValidForm = $(parameters.formToValidate).valid();
        var isValidFiles = true;
        if (parameters.containFiles)
            isValidFiles = $.ValidateFiles(parameters.formToValidate);

        if ((!isValidForm || !isValidFiles)) {
            if (parameters.isScroll != false) {
                $('html, body').animate({
                    //scrollTop: $(parameters.formToValidate).find(".input-validation-error :first").offset().top
                    scrollTop: 5
                }, 400);
            }
            return false;
        }
    }

    if (parameters.showErrorMessage != false) $.ShowMessage($(parameters.messageControl), "", MessageType.None);
    if (parameters.showPopupThrobber == true)
        $.ShowModalThrobber(parameters.throbberPosition, parameters.button);
    else if (parameters.showThrobber == true) $.ShowThrobber(parameters.throbberPosition, parameters.button);

    if (parameters.containFiles == true || parameters.isAjaxForm == true) {

        if ($(parameters.formToPost).length == 0) {
            if (parameters.showErrorMessage != false) $.ShowMessage($(parameters.messageControl), "Form Not Found", MessageType.Error);
            else if (parameters.error != undefined) parameters.error("Form Not Found");
            return false;
        }

        $(parameters.formToPost).ajaxForm({
            url: parameters.url,
            global: parameters.global,
            cache: parameters.cache,
            type: parameters.type,
            error: function (a, b, c) { onError(a, b, c, parameters); },
            success: function (data) { onSuccess(data, parameters); }
        }).submit();
    }
    else {
        $.ajax({
            global: parameters.global,
            cache: parameters.cache,
            url: parameters.url,
            type: parameters.type,
            processData: parameters.processData,
            contentType: parameters.contentType,
            //   async: parameters.Async != undefined ? parameters.Async : true,
            //dataType: $.browser.msie ? "json" : undefined,
            data: parameters.data,
            error: function (a, b, c) { onError(a, b, c, parameters); },
            success: function (data) { onSuccess(data, parameters); }
        });
    }
}

$.OpenPopupWindow = function (parameters) {


    /*=====================================Sample Usage======================================================
    $.OpenPopupWindow({
    url: url,           //the url that needs to be hit
    width: xxx,         //The width of the popup window 
    offsetX: xxx,       //No of pixels to be added horizontally from the center of the screen 
    offsetY: xxx,       //No of pixels to be added vertically from the center of the screen 
    title: "xxxxxx"     //The text to be displayed as the title of the popup windiw 
    html:"htmlcontent" //The html content that need to be shown in the popup
    type: "POST"
    });
    ===============================================================================================*/

    //$("#rmsModal").modal("show");
    //$("#rmsModal").addClass("md-show");
    $("#rmsModalHeader").html(parameters.title);

    $('div.popUpMessageAlert').html('').hide();


    var horizontalCenter = Math.floor(window.innerWidth / 2);
    var verticalCener = Math.floor(window.innerHeight / 2);

    if (parameters.showTitle == false) {
        $("#rmsModal .modal-header").css("display", "none");
    } else {
        $("#rmsModal .modal-header").css("display", "");
    }


    $("#rmsModal").unbind("hidden").unbind("shown");
    $("#rmsModal").on('hidden', function () {
        $("#rmsModal .modal-body").html("");
    });

    var type = parameters.type == undefined ? "POST" : parameters.type;

    $("#rmsModal").on('shown', function () {

    });

    if (!parameters.html) {

        $.ajaxExt({
            type: type,
            validate: false,
            showThrobber: false,
            throbberPosition: { my: "center center", at: "center center", of: $("#rmsModal .modal-body") },
            messageControl: $("div.popUpMessageAlert"),
            url: parameters.url,
            data: parameters.data,
            success: function (data) {
                ;
                $("#rmsModal .modal-body").html(data[0]);

                if (typeof parameters.callback === "function")
                    parameters.callback();
                //	y = verticalCener - parseInt($('#rmsModal').height()) / 2;


            }
        });
    } else {
        $("#rmsModal .modal-body").html(parameters.html);
    }

}
//Delete Confirmation Message
$.OpenDeletePopupWindow = function (parameters) {

    /*Created on 15/07/2014---for confirmation dialog for deletion of record*/

    //$("#WarningHeader").html(parameters.title);

    $(".ConfirmDelete").attr(parameters.attr, parameters.id);
}
$.ShowPopup = function (url, title) {
    ;
    var $this = new Object();
    var overlay = "";
    var methods = {
        init: function (options) {
            $this = $.extend({}, this, methods);
            $this.searching = false;
            $this.o = new Object();
            var defaultOptions = {
                overlaySelector: '.md-overlay',
                closeSelector: '.md-close',
                classAddAfterOpen: 'md-show',
                modalAttr: 'data-modal',
                perspectiveClass: 'md-perspective',
                perspectiveSetClass: 'md-setperspective',
                afterOpen: function (button, modal) {

                },
                afterClose: function (button, modal) {
                    //do your suff
                }
            };

            $this.o = $.extend({}, defaultOptions, options);
            $this.n = new Object();

            overlay = $($this.o.overlaySelector);

        },
        afterOpen: function (button, modal) {
            $this.o.afterOpen(button, modal);

        },
        afterClose: function (button, modal) {
            $this.o.afterClose(button, modal);
        }
    }
    methods.init();
    $.ajax({
        type: "POST",
        url: url,
        success: function (result) {
            $('.modal-body').html('');

            $("#rmsModalHeader").html(title);
            var modal = $("#rmsModal"),
                close = $($this.o.closeSelector, modal);
            var el = $(this);
            $(modal).addClass($this.o.classAddAfterOpen);
            /* overlay.removeEventListener( 'click', removeModalHandler );
            overlay.addEventListener( 'click', removeModalHandler ); */
            $(overlay).on('click', function () {
                removeModalHandler();
                $this.afterClose(el, modal);
                $(overlay).off('click');
            });
            if ($(el).hasClass($this.o.perspectiveSetClass)) {
                setTimeout(function () {
                    $(document.documentElement).addClass($this.o.perspectiveClass);

                }, 25);
            }


            setTimeout(function () {
                modal.css({ 'perspective': 'none' });

                //3D Blur Bug Fix
                if (modal.height() % 2 != 0) { modal.css({ 'height': modal.height() + 1 }); }

            }, 500);

            function removeModal(hasPerspective) {
                $(modal).removeClass($this.o.classAddAfterOpen);
                modal.css({ 'perspective': '1300px' });
                if (hasPerspective) {
                    $(document.documentElement).removeClass($this.o.perspectiveClass);
                }
            }

            function removeModalHandler() {
                removeModal($(el).hasClass($this.o.perspectiveSetClass));
            }

            $(close).on('click', function (ev) {
                ev.stopPropagation();
                removeModalHandler();
                $this.afterClose(el, modal);
            });
            $('.modal-body').append(result.Results[0]);
            $this.afterOpen(el, modal);

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);

            alert(textStatus);
        }
    });
};

$.ClosePopupWindow = function () {
    $("button.md-close").trigger("click");

}

$.EmptyPopupWindow = function () {
    $("#rmsModal .modal-body").html("");
}

$.DeleteConfirm = function (callbackfunction, sender) {
    $("div#mod-warning").find("input[type=button][name=btDeleteConfirm]:first").on("click", function () {
        callbackfunction(sender);
    });
    $("button#btnConfirm").trigger("click");

}

$.ShowMessageOnPopWindow = function (message) {
    $("#rmsModal .modal-body").html("<h3 style='padding:20px;text-align:center'>" + message + "<h3>");
    setTimeout(function () {
        $.ClosePopupWindow();
    }, 1000);

}

$.ShowMessageOnPopup = function (message) {

    $.OpenPopupWindow({
        width: 550,
        showTitle: false,
        showCloseButton: true,
        html: "<h3 style='padding:20px;text-align:center'>" + message + "<h3>"
    });

    setTimeout(function () {
        $.ClosePopupWindow();
    }, 10000);

}

$.FillSelectList = function (selectControl, data, clearData) {
    data = $.parseJSON(data);
    if (clearData != false) $(selectControl).html("");

    for (var i = 0; i < data.length; i++) {
        $(selectControl).append('<option value="' + data[i].Value + '">' + data[i].Text + '</option>');
    }
}

$.postifyData = function (value) {
    var result = {};

    var buildResult = function (object, prefix) {
        for (var key in object) {

            var postKey = isFinite(key)
                ? (prefix != "" ? prefix : "") + "[" + key + "]"
                : (prefix != "" ? prefix + "." : "") + key;

            switch (typeof (object[key])) {
                case "number": case "string": case "boolean":
                    result[postKey] = object[key];
                    break;

                case "object":
                    if (object[key] != null) {
                        if (object[key].toUTCString) result[postKey] = object[key].toUTCString().replace("UTC", "GMT");
                        else buildResult(object[key], postKey != "" ? postKey : key);
                    }
            }
        }
    };

    buildResult(value, "");
    return result;
}

$.ProcessResponse = function (params) {
    $.RemoveThrobber();

    if (params.status != 'success' || params.context.status != 200) {
        $.ShowMessage($(params.messageControl), 'Unexpected Error', MessageType.Error);
        return false;
    }

    var data = $.parseJSON(params.context.responseText);

    try {
        if (data.Status == undefined) {
            if (params.showErrorMessage != false) $.ShowMessage($(params.messageControl), "Invalid data returned in the response", MessageType.Error);
            else if (params.error != undefined) params.error("Invalid data returned in the response");

            return false;
        }
    }
    catch (ex) {
        if (params.showErrorMessage != false) $.ShowMessage($(params.messageControl), "Invalid data returned in the response", MessageType.Error);
        else if (params.error != undefined) params.error("Invalid data returned in the response");
    }

    if (data.Status == ActionStatus.Error) {
        if (params.showErrorMessage != false) $.ShowMessage($(params.messageControl), data.message, MessageType.Error);
        if (params.error != undefined) params.error(data.message);
    }
    else if (params.success) params.success(data.Results);
}

$.ResetValidationMessages = function (parent) {

    if (parent == undefined) parent = $("body");
    $(parent).find('.input-validation-error').addClass('input-validation-valid').removeClass('input-validation-error');
    $(parent).find('.field-validation-error').addClass('field-validation-valid').removeClass('field-validation-error').html('');
}

$.ResetUnobtrusiveValidation = function (form) {
    form.removeData('validator');
    form.removeData('unobtrusiveValidation');
    $.validator.unobtrusive.parse(form);
}

$.ScrollToTop = function () {
    var offset = 220;
    var duration = 500;
    $(window).scroll(function () {
        if ($(this).scrollTop() > offset) $('.back-to-top').fadeIn(duration);
        else $('.back-to-top').fadeOut(duration);
    });


    $('.back-to-top').click(function (event) {
        event.preventDefault();
        $('html, body').animate({ scrollTop: 0 }, duration);
        return false;
    });
}

$.fn.scrollView = function () {
    var duration = 400;
    $('html, body').animate({ scrollTop: 0 }, duration);
}

$.CheckAll = function (sender) {
    if ($(sender).is(':checked')) {
        $("div[name=listingContainer] table[name=Listing] tbody tr").find('input[type=checkbox][name=checkList]').attr('checked', 'checked');
        $("div[name=listingContainer] table[name=Listing] tbody tr").addClass("bgColor");
    }
    else {
        $("[name=listingContainer] table[name=Listing] tbody tr").find('input[type=checkbox][name=checkList]').removeAttr('checked', 'checked');
        $("div[name=listingContainer] table[name=Listing] tbody tr").removeClass("bgColor");
    }
}

jQuery.fn.reset = function () {
    $(this).each(function () { this.reset(); });
}

$.ReplaceSpecialCharacter = function (term) {
    term = term.trim();
    term = term.replace(/[^a-zA-Z0-9\.-]/g, '-');
    term = term.replace('---', '-');
    return term;

}

Array.prototype.remove = function () {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

$.getParameterByName = function (name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

$.htmlDecode = function (n) {
    return $("<div/>").html(n).text()
}

$.htmlEncode = function (n) {
    return $("<div/>").text(n).html()

}
//$(document).on('keyup', '#Search', function () {
//    if ($(this).val() != "")
//        $('.cross-sign').show();
//    else
//        $('.cross-sign').hide();
//});
//$(document).on('click', '.cross-sign', function () {
//    $('#Search').val('');
//    $('#Search').focus();
//    $('.cross-sign').hide();
//    Paging();
//});

$(document).on('keyup', '.search_inp', function (e) {
    if (e.which === 13)  // the enter key code
        Paging();
});

function setCookie(c_name, value, expiredays) {

    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = c_name + "=" + value + ";path=/" + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
}
function getCookie(name) {
    var dc = document.cookie;
    var prefix = name + "=";
    var begin = dc.indexOf("; " + prefix);
    if (begin == -1) {
        begin = dc.indexOf(prefix);
        if (begin != 0) return null;
    } else {
        begin += 2;
    }
    var end = document.cookie.indexOf(";", begin);
    if (end == -1) {
        end = dc.length;
    }
    return unescape(dc.substring(begin + prefix.length, end));
}
function eraseCookie(name) {
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}


$.ConfirmBox = function (title, text, type, showCancelButton, confirmButtonText, closeOnConfirm, sender, actionPerformed, cancelButtonText, cancelPerformed) {
    swal({
        title: title,
        text: text,
        type: type,
        showCancelButton: showCancelButton,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: confirmButtonText,
        cancelButtonText: cancelButtonText,
        closeOnConfirm: closeOnConfirm
    },
        function (isConfirm) {
            if (isConfirm) {
                if (actionPerformed) actionPerformed(sender);
            }
            else {
                if (cancelPerformed) {
                    cancelPerformed(sender);
                }
                return false;
                //swal("Cancelled", "Your imaginary file is safe :)", "error");
            }
        });
};

(function ($) {

    $.fn.locify = function (prefix) {
        var placeSearch, autocomplete;
        var componentForm = {
            street_number: 'short_name',
            route: 'long_name',
            sublocality: 'long_name',
            locality: 'long_name',
            administrative_area_level_1: 'short_name',
            country: 'long_name',
            postal_code: 'short_name',
            sublocality_level_3: 'long_name'
        };

        // Create the autocomplete object, restricting the search to geographical
        // location types.
        autocomplete = new google.maps.places.Autocomplete(this[0], { types: ['geocode'] });
        /** type {!HTMLInputElement} */

        // When the user selects an address from the dropdown, populate the address
        // fields in the form.
        autocomplete.addListener('place_changed', fillInAddress);

        function fillInAddress() {
            // Get the place details from the autocomplete object.

            var place = autocomplete.getPlace();

            for (var component in componentForm) {

                var el = $("[data-gfield=" + component + "]");
                el.val('');
                //document.getElementById(component).disabled = false;
            }

            // Get each component of the address from the place details
            // and fill the corresponding field on the form.
            if (place.address_components != null) {
                for (var i = 0; i < place.address_components.length; i++) {
                    var addressType = place.address_components[i].types[0];
                    if (componentForm[addressType]) {
                        var val = place.address_components[i][componentForm[addressType]];

                        //document.getElementById(addressType).value = val;
                        $("[data-gfield=" + addressType + "]").val(val);
                    }
                    if (i == place.address_components.length - 1) {
                        $('#Address').val(place.address_components[0].long_name + " " + place.address_components[1].long_name + " " + place.address_components[2].long_name);
                    }
                }
            }
        }

    };

}(jQuery));

$(document).on('click', '.popup', function () {
    var popup = document.getElementById($(this).data('rc'));
    popup.classList.toggle("show");
});

//$('body').click(function (evt) {
//    //if (evt.target.className != "action popup" || evt.target.className != "btn btn - outline - success btn - sm mr approve") {
//    //    $(".popuptext").hide();
//    //}
//});

//$('body').on('click',
//    ':not(.action .popup, .another-div-class, .parent-div-class *)',function () {
//        $(".popuptext").hide();
//    });
$(document).on('click', '.clear-search', function () {
    $('input[type="text"]').val('');
    $('select').prop('selectedIndex', 0);
    Paging();
});

Date.prototype.toShortFormat = function () {

    var month_names = ["Jan", "Feb", "Mar",
        "Apr", "May", "Jun",
        "Jul", "Aug", "Sep",
        "Oct", "Nov", "Dec"];

    var day = this.getDate();
    var month_index = this.getMonth();
    var year = this.getFullYear();

    return "" + day + "-" + month_names[month_index] + "-" + year;
}

var paging = {
    startIndex: 1,
    currentPage: 0,
    pageSize: 10,
    pagingWrapper: 'pagingWrapper1',
    first: 'first',
    last: 'last',
    previous: 'prev',
    next: 'next',
    numeric: 'numeric',
    pageInfo: 'pageInfo',
    PagingFunction: ''
}

function PageNumbering(TotalRecords) {
    var totalPages = 0;
    /**** Setting Total Records & Page Size *************/
    totalPages = parseInt((parseInt(TotalRecords) + parseInt(paging.pageSize) - 1) / parseInt(paging.pageSize));
    /**** Setting Total Records & Page Size *************/
    if (TotalRecords === 0 || totalPages === 1) { // in case there are no records or only one page
        $("." + paging.pagingWrapper).css("display", 'none'); // hide the paging 
    }
    else {
        $("." + paging.pagingWrapper).css("display", ''); // show the paging 
    }
    /*  Creating Pagination */
    /*  Code Commented because client don't want numbered paging */

    var LastIndex = parseInt(paging.startIndex - 1 + paging.pageSize); // this is the last displaying record
    if (LastIndex > TotalRecords) { // in case that last page includes records less than the size of the page 
        LastIndex = TotalRecords;
    }
    //$("." + paging.pageInfo).html("Showing <b>" + parseInt(paging.startIndex) + "-" + LastIndex + "</b> of <b>" + TotalRecords + "</b> Records."); // displaying current records interval  and currnet page infromation 
    if (paging.currentPage > 0) {
        $('.' + paging.pagingWrapper + ' .' + paging.first).unbind('click'); // rmove previous click events
        $('.' + paging.pagingWrapper + ' .' + paging.first).removeClass('disabled'); // remove the inactive page style

        $('.' + paging.pagingWrapper + ' .' + paging.first).click(function () { // set goto page to first page 
            GotoPage(0, this);
            return false;
        });
        $('.' + paging.pagingWrapper + ' .' + paging.previous).unbind('click');
        $('.' + paging.pagingWrapper + ' .' + paging.previous).removeClass('disabled');

        $('.' + paging.pagingWrapper + ' .' + paging.previous).click(function () {
            GotoPage(paging.currentPage - 1, this); // set the previous page next value  to current page - 1
            return false;
        });
    }
    else {

        $('.' + paging.pagingWrapper + ' .' + paging.first).addClass('disabled');
        $('.' + paging.pagingWrapper + ' .' + paging.first).unbind('click');
        $('.' + paging.pagingWrapper + ' .' + paging.previous).addClass('disabled');
        $('.' + paging.pagingWrapper + ' .' + paging.previous).unbind('click');
    }
    if (paging.currentPage < totalPages - 1) { // if you are not displaying the last index 
        $('.' + paging.pagingWrapper + ' .' + paging.next).unbind('click');
        $('.' + paging.pagingWrapper + ' .' + paging.next).removeClass('disabled');
        $('.' + paging.pagingWrapper + ' .' + paging.next).click(function () {
            GotoPage(paging.currentPage + 1, this);
            return false;
        });

        $('.' + paging.pagingWrapper + ' .' + paging.last).unbind('click');
        $('.' + paging.pagingWrapper + ' .' + paging.last).removeClass('disabled');
        $('.' + paging.pagingWrapper + ' .' + paging.last).click(function () {
            GotoPage(totalPages - 1, this);
            return false;
        });
    } else {

        $('.' + paging.pagingWrapper + ' .' + paging.next).addClass('disabled');
        $('.' + paging.pagingWrapper + ' .' + paging.next).unbind('click');
        $('.' + paging.pagingWrapper + ' .' + paging.last).addClass('disabled');
        $('.' + paging.pagingWrapper + ' .' + paging.last).unbind('click');
    }


    // displaying the numeric pages by default there are 10 numeric pages 
    var firstPage = 0;
    var lastPage = 10;
    if (paging.currentPage >= 5) {
        lastPage = paging.currentPage + 5;
        firstPage = paging.currentPage - 5
    }
    if (lastPage > totalPages) {
        lastPage = totalPages;
        firstPage = lastPage - 10;
    }
    if (firstPage < 0) {
        firstPage = 0;
    }
    var pagesString = '';
    for (var i = firstPage; i < lastPage; i++) {
        if (i === paging.currentPage)
        { pagesString += "<li class='active " + paging.numeric + "' > <a class='page-link' href='javascript:void(0)'>" + parseInt(i + 1) + "</a></li>" }
        else {
            pagesString += "<li class='" + paging.numeric + "'><a class='page-link' href='javascript:void(0)' onclick='return GotoPage(" + i + ", this)' > " + parseInt(i + 1) + "</a></li>" // add goto page event
        }
    }
    $('.' + paging.pagingWrapper + " li").each(function () {
        if ($(this).hasClass(paging.numeric)) {
            $(this).remove();
        }
    });
    $(pagesString).insertAfter($('.' + paging.pagingWrapper + " ." + paging.previous));
    /**** Loading data and binding grid *******************/
}


/*  This function will call if user click on numbered paging links. */
function GotoPage(page, sender) {
    paging.currentPage = page;
    //paging.PageNo = Math.ceil(paging.startIndex / paging.pageSize);
    paging.startIndex = page * paging.pageSize + 1;
    if (typeof (onGotoPage) !== "undefined")
        onGotoPage(page, sender);
    if (paging.PagingFunction.trim().length > 0) {
        window[paging.PagingFunction]();
    }
    else
        Paging(paging.startIndex, paging.pageSize, sender);

    return false;
}
/// <reference path="jquery-1.4.4-vsdoc.js" />


(function ($) {
    // The following functions are taken from jquery.validate.unobtrusive: getModelPrefix, appendModelPrefix
    function getModelPrefix(fieldName) {
        return fieldName.substr(0, fieldName.lastIndexOf(".") + 1);
    }
    function appendModelPrefix(value, prefix) {
        if (value.indexOf("*.") === 0) {
            value = value.replace("*.", prefix);
        }
        return value;
    }

    function getPropertyValue(propertyName, dataType, prefix) {
        var name = appendModelPrefix(propertyName, prefix);

        // get the actual value of the target control
        // note - this probably needs to cater for more 
        // control types, e.g. radios
        var control = $('*[name=\'' + name + '\']');
        var controlType = control.attr('type');
        var actualValue =
						controlType === 'checkbox' ?
						control.attr('checked') :
						control.val();

        // test for date format and handle (via jQuery UI)
        var dateFormat = control.data('dateformat');
        if (dateFormat != undefined) {
            actualValue = $.datepicker.parseDate(dateFormat, actualValue); // consider testing for parseDate and throwing a helpful message :-)
        }
        return actualValue;
    }

    $.validator.addMethod('requiredif',
			function (value, element, parameters) {
			    var validatorFunc = parameters.validatorFunc;
			    var result = validatorFunc();
			    if (result) {
			        // if the condition is true, reuse the existing 
			        // required field validator functionality
			        return $.validator.methods.required.call(this, value, element, parameters);
			    }
			    return true;
			}
	);

    $.validator.unobtrusive.adapters.add('requiredif',
			['expression'], // what attributes do we want
			function (options) {
			    var prefix = getModelPrefix(options.element.name);
			    var expression = options.params['expression'];
			    var gv = function (propertyName, dataType) { return getPropertyValue(propertyName, dataType, prefix); };
			    eval('function theValidator(gv) { return ' + expression + ';}');
			    options.rules['requiredif'] = {
			        validatorFunc: function () {
			            return theValidator(gv);
			        }
			    };
			    options.messages['requiredif'] = options.message;
			}
	);

})(jQuery);