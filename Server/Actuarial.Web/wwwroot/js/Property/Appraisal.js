var referrer = '';
$(document).ready(function () {
	referrer = document.referrer;


	$(document).on('click', '#AddAppraisalDraft', function () {
		$('#IsDraft').val(true);
		if ($("#NoteText").length > 0) {
			$("#NoteText").val(CKEDITOR.instances["NoteText"].getData());
		}
		$('.compProp').removeAttr('required');
		$("#form_AddAppraisal").data("validator").settings.ignore = ".futureDates1"; $("#form_AddAppraisal").valid()
		console.log($('#collapseThree :input').valid())
		if ($('#collapseThree :input').valid() == false) {
			$('.nav-tabs a[href="#menu1"]').click();
		}
		if (checkValidation())
			return Appraisal.AddUpdateAppraisal($(this));
	});

	$(document).on('click', '#AddAppraisal', function () {
		$('#IsDraft').val(false);
		if ($("#NoteText").length > 0) {
			$("#NoteText").val(CKEDITOR.instances["NoteText"].getData());
		}
		$("#form_AddAppraisal").data("validator").settings.ignore = ""; $("#form_AddAppraisal").valid()
		if ($('#collapseThree :input').valid() == false) {
			$('.nav-tabs a[href="#menu1"]').click();
		}
		if ($('#menu2 :input').valid() == false) {
			$('.nav-tabs a[href="#menu2"]').click();
		}
		if (checkValidation())
			return Appraisal.AddUpdateAppraisal($(this));
	});

	$(document).on('click', '.edit-appraisal', function () {
		window.location.href = baseUrl + siteURL.AddAppraisal + '/' + $(this).data('propertyid');
	});

	$(document).on('click', 'input[type=button]#btnFilterVersion', function () {
		return Appraisal.ManageAppraisals($(this));
	});

	$("select#showRecords").on("change", function () {
		return Appraisal.ShowRecords($(this));
	});
	$(document).on('click', '.sorting', function () {
		return Appraisal.SortAppraisals($(this));
	});
	$(document).on('click', '.search-btn', function () {
		return Appraisal.SearchAppraisals($(this));
	});

	$(document).on('click', '.delete-appraisal', function () {
		Appraisal.DeleteAppraisalRecord($(this).data('appraisalid'));
	})

	$(document).on('click', '.details-property', function () {
		window.location.href = baseUrl + siteURL.DetailsProperty + '/' + $(this).data('propertyid');
	});
	$(document).on('click', '.details-agent', function () {
		window.location.href = baseUrl + siteURL.DetailsAgent + '/' + $(this).data('agentid');
	});
	$(document).on('click', '.details-contact', function () {
		window.location.href = baseUrl + siteURL.DetailsContact + '/' + $(this).data('contactid');
	});
	$(document).on('click', '.add-notes', function () {
		$("#AppraisalUniqueId").val($(this).data("appraisalid"));
		$('#AddAppraisalNotesModal').modal('show');
	});

	$(document).on('click', '.add-Followup', function () {
		console.log($(this).data("appraisalid"))
		$("#AppraisalUniqueId").val($(this).data("appraisalid"));
		$('#AddFollowUpModal').modal('show');
	});

	$(document).on('click', '.enquirytab', function () {
		$('#enq-status').val($(this).data('purpose'));
		$('.enquirytab').each(function () {
			$(this).removeClass('active');
			$(this).parent().removeClass('active');
		})
		$(this).addClass('active');
		$(this).parent().addClass('active');
		Paging();
	});

	// Add Appraisal Notes
	$(document).on('click', '#btnAddNotes', function () {

		if ($("#txtnotes").val()) {
			$("#msgtext").html("");
			var appraisalId = $("#AppraisalUniqueId").val();
			var notetext = $("#txtnotes").val();
			$.ajaxExt({
				type: 'POST',
				validate: false,
				showErrorMessage: true,
				messageControl: $('div.messageAlert'),
				showThrobber: true,
				url: baseUrl + siteURL.AddAppraisalNotes,
				data: { appraisalId: appraisalId, notetext: notetext },
				success: function (results, message, status) {

					$.ShowMessage($('div.messageAlert'), message, status);
					setTimeout(function () {
						window.location.reload();
					}, 2000);
				}
			});
		}
		else {
			$("#msgtext").html("Please add value");
		}

	})

	$(document).on('click', '#btnAddFollowUp', function () {
		if ($("#Detail").val()) {
			$("#msgtextDetail").html("");
			return Appraisal.AddUpdateFollowUp($(this));
		}
		else {
			$("#msgtextDetail").html("Please add value");
		}
	})

	$(document).on('click', '.apropertytabs', function () {
		$('.apropertytabs').each(function () {
			$(this).removeClass('active');
			$(this).parent().removeClass('active');
		})
		$(this).addClass('active');
		$(this).parent().addClass('active');
	});

	$(document).on('click', '.accept-appraisal', function () {
		Appraisal.AcceptAppraisal($(this).data('appraisalid'));
	})

	$(document).on('click', '.reject-appraisal', function () {
		console.log($(this).data('appraisalid'))
		$('#AppraisalUniqueId').val($(this).data('appraisalid'));
		$('#RejectAppraisalModal').modal('show');
	})


	$(document).on('click', '.view-appraisal', function () {
		var f = document.createElement('form');
		f.action = baseUrl + siteURL.AppraisalPdf;
		f.method = 'POST';
		f.target = '_blank';

		var i = document.createElement('input');
		i.type = 'hidden';
		i.name = 'RecommendedPriceFrom';
		i.value = $('#RecommendedPriceFrom').val();
		f.appendChild(i);

		var i = document.createElement('input');
		i.type = 'hidden';
		i.name = 'RecommendedPriceTo';
		i.value = $('#RecommendedPriceTo').val();
		f.appendChild(i);

		var i = document.createElement('input');
		i.type = 'hidden';
		i.name = 'CMAReportPrice';
		i.value = $('#CMAReportPrice').val();
		f.appendChild(i);

		var i = document.createElement('input');
		i.type = 'hidden';
		i.name = 'CMAReport';
		i.value = $('#CMAReport').val();
		f.appendChild(i);

		var i = document.createElement('input');
		i.type = 'hidden';
		i.name = 'CMAReportPath';
		i.value = $('#CMAReportPath').val();
		f.appendChild(i);

		var i = document.createElement('input');
		i.type = 'hidden';
		i.name = 'PropertyType';
		i.value = $('#PropertyType').val();
		f.appendChild(i);

		var i = document.createElement('input');
		i.type = 'hidden';
		i.name = 'PropertyAddress';
		i.value = $('#PropertyAddress').val();
		f.appendChild(i);

		var i = document.createElement('input');
		i.type = 'hidden';
		i.name = 'AgentName';
		i.value = $('#AgentName').val();
		f.appendChild(i);

		var i = document.createElement('input');
		i.type = 'hidden';
		i.name = 'AgentContactNumber';
		i.value = $('#AgentContactNumber').val();
		f.appendChild(i);

		var i = document.createElement('input');
		i.type = 'hidden';
		i.name = 'ComparableProperty1Location';
		i.value = $('#ComparableProperty1Location').val();
		f.appendChild(i);

		var i = document.createElement('input');
		i.type = 'hidden';
		i.name = 'ComparableProperty1SoldPrice';
		i.value = $('#ComparableProperty1SoldPrice').val();
		f.appendChild(i);

		var i = document.createElement('input');
		i.type = 'hidden';
		i.name = 'ComparableProperty1Note';
		i.value = $('#ComparableProperty1Note').val();
		f.appendChild(i);

		var i = document.createElement('input');
		i.type = 'hidden';
		i.name = 'ComparableProperty2Location';
		i.value = $('#ComparableProperty2Location').val();
		f.appendChild(i);

		var i = document.createElement('input');
		i.type = 'hidden';
		i.name = 'ComparableProperty2SoldPrice';
		i.value = $('#ComparableProperty2SoldPrice').val();
		f.appendChild(i);

		var i = document.createElement('input');
		i.type = 'hidden';
		i.name = 'ComparableProperty2Note';
		i.value = $('#ComparableProperty2Note').val();
		f.appendChild(i);

		document.body.appendChild(f);
		f.submit();

		//var data = $(this);
		//var form = document.createElement('form');
		//document.body.appendChild(form);
		//form.method = 'post';
		//form.action = baseUrl + siteURL.AppraisalPdf;
		//for (var name in data) {
		//	var input = document.createElement('input');
		//	input.type = 'hidden';
		//	input.name = name;
		//	input.value = data[name];
		//	form.appendChild(input);
		//}
		//form.submit();

		console.log($(this))
	})
});

var Appraisal = {
	AddUpdateAppraisal: function (sender) {
		var form = $("form");
		$.ajaxExt({
			url: baseUrl + siteURL.AddUpdateAppraisalDetails,
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
					// history.go(-1);
					//if ($('#IsDraft').val() == "false") {
					window.location.href = baseUrl + siteURL.PropertyDetails + '/' + $('#propertyUniqueID').val();
					//window.location.href = referrer
					//}
					//else {
					//    window.location.href = referrer;
					//}
					// console.log(referrer);
				}, 2000);
			},
			error: function (message, id) {
				if (id > 0) {
					$.ConfirmBox("", "Required Contact Detail want to redirect Edit Property  ?", null, true, "Yes", true, null, function () {

						var propID = $('#propertyUniqueID').val();

						window.location.href = baseUrl + siteURL.EditProperty + '/' + propID;

					}, "", function () {
					});
				}

			}
		});
		return false;
	},

	AddUpdateFollowUp: function (sender) {
		var appraisalId = $("#AppraisalUniqueId").val();
		var Detail = $("#Detail").val();
		var ScheduledOn = $("#ScheduledOn").val();
		$.ajaxExt({
			type: 'POST',
			validate: false,
			showErrorMessage: true,
			messageControl: $('div.messageAlert'),
			showThrobber: true,
			url: baseUrl + siteURL.AddUpdateReminder,
			data: { Detail: Detail, AppraisalUniqueId: appraisalId, ScheduledOn: ScheduledOn },
			success: function (results, message) {
				$.ShowMessage($('div.messageAlert'), message, MessageType.Success);
				setTimeout(function () {
					window.location.reload();
				}, 3000);
			}
		});
	},

	SortAppraisals: function (sender) {
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
	ManageAppraisals: function (totalCount) {
		var totalRecords = 0;
		totalRecords = parseInt(totalCount);
		//alert(totalRecords);
		PageNumbering(totalRecords);
	},

	SearchAppraisals: function (sender) {
		paging.startIndex = 1;
		Paging(sender);
	},

	ShowRecords: function (sender) {
		paging.startIndex = 1;
		paging.pageSize = parseInt($(sender).find('option:selected').val());
		Paging(sender);
	},

	DeleteAppraisalRecord: function (id) {
		$.ConfirmBox("", "Are you sure?", null, true, "Yes", true, null, function () {
			$.ajaxExt({
				type: 'POST',
				validate: false,
				showErrorMessage: true,
				messageControl: $('div.messageAlert'),
				showThrobber: true,
				url: baseUrl + siteURL.DeleteAppraisal,
				data: { AppraisalID: id },
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

	AcceptAppraisal: function (id) {
		$.ConfirmBox("", "Are you sure want to accept Appraisal ?", null, true, "Accept", true, null, function () {
			$.ajaxExt({
				type: 'POST',
				validate: false,
				showErrorMessage: true,
				messageControl: $('div.messageAlert'),
				showThrobber: true,
				url: baseUrl + siteURL.AcceptAppraisal,
				data: { appraisalId: id },
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
	obj.SearchDateType = $('#SearchDateType').val();
	obj.Status = $('#enq-status').val();
	$.ajaxExt({
		type: "POST",
		validate: false,
		parentControl: $(sender).parents("form:first"),
		data: $.postifyData(obj),
		messageControl: null,
		showThrobber: false,
		throbberPosition: { my: "left center", at: "right center", of: sender, offset: "5 0" },
		url: baseUrl + siteURL.GetAppraisalPagingList,
		success: function (results, message) {
			$('#divResult table:first tbody').html(results[0]);
			PageNumbering(results[1]);

		}
	});
}

function checkValidation() {

	var From = $('#RecommendedPriceFrom').val();
	var To = $('#RecommendedPriceTo').val();

	if (parseInt(To) < parseInt(From)) {
		// $.ShowMessage($('div.messageAlert'), "Price To can't be less than price From", MessageType.Error);
		//$('#RecommendedPriceFrom').val('');
		//$('#RecommendedPriceTo').val('');
		$('#RecommendedPriceToCustom').show();
		return false;
	}
	else {
		$('#RecommendedPriceToCustom').hide();
		return true
	}


}

$("#RecommendedPriceTo").keyup(function () {
	checkValidation();
});
$("#RecommendedPriceFrom").keyup(function () {
	checkValidation();
});

$('#CMAReport').on('change', function () {
	myfile = $(this).val();
	var ext = myfile.split('.').pop();
	if (ext == "pdf") {
	} else {
		$.ShowMessage($('div.messageAlert'), "Only Pdf", MessageType.Error);
		$('#CMAReport').val('');
	}
});
