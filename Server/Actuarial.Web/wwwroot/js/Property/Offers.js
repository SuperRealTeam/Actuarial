
var CommentType = {
	BuyerToAgent: 1,
	AgentToBuyer: 2,
	SellerToAgent: 3,
	AgentToSeller: 4
};
$(document).on('click', 'input[type=button]#btnFilterVersion', function () {
	return Offers.ManageOffers($(this));
});

$("select#showRecords").on("change", function () {
	return Offers.ShowRecords($(this));
});

$(document).on('click', '.sorting', function () {
	return Offers.SortOffers($(this));
});
$(document).on('click', '.search-btn', function () {
	return Offers.SearchOffers($(this));
});

$(document).on('click', '.property_detail', function () {
	window.location.href = siteURL.PropertyDetails + "/" + $(this).data('property_uid');
});

$(document).on('click', '.details-offer', function () {
	window.location.href = baseUrl + siteURL.OfferDetail + '/' + $(this).data('offerid');
});

$(document).on('click', '#btnAddComments', function () {
	return Offers.AddOfferComment($(this));

})

$(document).on('click', '.btn-addcommentBuyer', function () {
	$('#CommentsType').val(CommentType.AgentToBuyer);
})
$(document).on('click', '.btn-addcommentSeller', function () {
	$('#CommentsType').val(CommentType.AgentToSeller);
})

$(document).on('click', '.offertab', function () {
	$('#offer-type').val($(this).data('purpose'));
	$('.offertab').each(function () {
		$(this).removeClass('active');
		$(this).parent().removeClass('active');
	})
	$(this).addClass('active');
	$(this).parent().addClass('active');
	Paging();
});

$(document).on('click', '.release-offer', function () {
	Offers.AcceptOffer($(this).data('offerid'));
})

$(document).on('click', '.reject-offer', function () {
	$('#OfferUniqueId').val($(this).data('offerid'));

})

$(document).on('click', '#btnRejectReason', function () {
	return Offers.RejectOffer($(this));

})

// Offers Func Changes
$(document).on('click', '#ckbCheckAll', function () {
	if ($(this).prop("checked")) {
		$(".checkBoxClass").prop("checked", true);
		var chkLen = $(".checkBoxClass").filter(':checked').length;
		if (chkLen > 0) {
			$('#btnReleaseOffers').show();
		}
		else {
			$('#btnReleaseOffers').hide();
		}
	} else {
		$(".checkBoxClass").prop("checked", false);
		$('#btnReleaseOffers').hide();
	}
})

$(document).on('click', '.checkBoxClass', function () {
	if ($(this).prop("checked")) {
		$('#btnReleaseOffers').show();
	} else {
		var chkLen = $(".checkBoxClass").filter(':checked').length;
		if (chkLen > 0) {
			$('#btnReleaseOffers').show();
		}
		else {
			$('#btnReleaseOffers').hide();
		}
	}
})

$(document).on('click', '#btnReleaseOffers', function () {
	var str = '';
	$('.checkBoxClass').each(function () {
		if ($(this).prop("checked")) {
			if (str != '') {
				str = str + ',';
			}
			str = str + $(this)[0].dataset.offerid;

		} else {

		}
	})

	Offers.AcceptOffer(str);
})

$(document).on('click', '.send-SaleAdvise', function () {
	Offers.SendSaleAdvise($(this).data('offerid'));
})

var Offers = {

	SortOffers: function (sender) {
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

	ManageOffers: function (totalCount) {
		var totalRecords = 0;
		totalRecords = parseInt(totalCount);
		//alert(totalRecords);
		PageNumbering(totalRecords);
	},

	SearchOffers: function (sender) {
		paging.startIndex = 1;
		Paging(sender);
	},

	ShowRecords: function (sender) {
		paging.startIndex = 1;
		paging.pageSize = parseInt($(sender).find('option:selected').val());
		Paging(sender);
	},

	AddOfferComment: function (sender) {
		var form = $("#form_AddOfferComment");
		$.ajaxExt({
			type: 'POST',
			validate: true,
			formToValidate: form,
			formToPost: form,
			isAjaxForm: true,
			showErrorMessage: true,
			messageControl: $('div.messageAlert'),
			showThrobber: true,
			url: baseUrl + siteURL.AddOfferComment,
			success: function (results, message, status) {

				$.ShowMessage($('div.messageAlert'), message, status);
				setTimeout(function () {
					window.location.reload();
				}, 3000);
			}
		});


	},
	AcceptOffer: function (id) {
		var btnName = "Release";
		if ($('#hdnUserType').length > 0) {
			btnName = "Accept";
		}
		$.ConfirmBox("", "Are you sure you want to " + btnName + " this offer?", null, true, btnName, true, null, function () {
			$.ajaxExt({
				type: 'POST',
				validate: false,
				showErrorMessage: true,
				messageControl: $('div.messageAlert'),
				showThrobber: true,
				url: baseUrl + siteURL.AcceptOffer,
				data: { offerID: id },
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

	RejectOffer: function (sender) {
		var form = $("#form_RejectOffer");
		$.ajaxExt({
			type: 'POST',
			validate: true,
			formToValidate: form,
			formToPost: form,
			isAjaxForm: true,
			showErrorMessage: true,
			messageControl: $('div.messageAlert'),
			showThrobber: true,
			url: baseUrl + siteURL.RejectOffer,
			success: function (results, message, status) {

				$.ShowMessage($('div.messageAlert'), message, status);
				setTimeout(function () {
					window.location.reload();
				}, 3000);
			}
		});


	},

	SendSaleAdvise: function (id) {
		
		$.ConfirmBox("", "Are you sure you want to Send Sale Advise?", null, true, "Yes", true, null, function () {
			$.ajaxExt({
				type: 'POST',
				validate: false,
				showErrorMessage: true,
				messageControl: $('div.messageAlert'),
				showThrobber: true,
				url: baseUrl + siteURL.SendSaleAdvise,
				data: { offerID: id },
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
	obj.minDate = $('#minDate').val();
	obj.maxDate = $('#maxDate').val();
	obj.myOffers = $('#offer-type').val();

	$.ajaxExt({
		type: "POST",
		validate: false,
		parentControl: $(sender).parents("form:first"),
		data: $.postifyData(obj),
		messageControl: null,
		showThrobber: false,
		throbberPosition: { my: "left center", at: "right center", of: sender, offset: "5 0" },
		url: baseUrl + siteURL.GetOffersPagingList,
		success: function (results, message) {
			$('#divResult table:first tbody').html(results[0]);
			PageNumbering(results[1]);

		}
	});
}