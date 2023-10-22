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