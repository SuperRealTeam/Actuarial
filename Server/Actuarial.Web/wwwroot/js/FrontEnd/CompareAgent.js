var AgentSearch = {
	AgentLoc: 1,
	AgencyName: 2,
	AgencyLoc: 3
};

$(document).ready(function () {
	//BindSelect2();

    BindPostCode();


    $(document).on('click', '.btnSearchAgent', function () {
        var search = $('#sPostCode').val();
        var qstr = generatestringUrl();
        var ctr = $('#ddlSearchType')
        if ($(ctr).val() == AgentSearch.AgencyName) {
            search = $('#sAgencyName').val();
        }
       
		
		if (search != '') {

			var qstr = generatestringUrl();
			window.location.href = siteURL.GetAgentsList + "?" + qstr;
			//window.location.href = "http://localhost:50490/CompareAgent/Agents/" + val;
		}
	});

	$(document).on('click', '.request_appraisal', function () {
		var val = $(this).data('agentid')
		// window.location.href = "http://localhost:50490/CompareAgent/RequestAppraisal/" + val;
		window.location.href = siteURL.RequestAppraisal + '/' + val;
	});

	$(document).on('click', '#btnAppraisalRequest', function () {
		console.log($(this))
		return CompareAgent.AddAppraisalRequest($(this));

	})
	$(document).on('click', '.book-appointment', function () {
		return CompareAgent.GetAgentBookedDates($(this).data('agentid'));
		$('#form_Book_Appointment').reset();
	})
	$(document).on('click', '#btnBookAppointment', function () {
		return CompareAgent.AddUpdateReminder($(this));
	});
	var CompareAgent = {
		AddAppraisalRequest: function (sender) {
			var form = $("#form_RequestAppraisal");
			$.ajaxExt({
				type: 'POST',
				validate: true,
				formToValidate: form,
				formToPost: form,
				isAjaxForm: true,
				showErrorMessage: true,
				messageControl: $('div.messageAlert'),
				showThrobber: true,
				url: baseUrl + siteURL.AddAppraisalRequest,
				success: function (results, message, status) {
					$.ShowMessage($('div.messageAlert'), message, status);
					setTimeout(function () {
						//window.location.reload();
						//window.location.href = baseUrl + siteURL.GetInitPostCodeList;
						window.location.href = baseUrl + siteURL.Agents;

					}, 3000);
				}
			});


		},
		GetAgentBookedDates: function (sender) {
			$.ajaxExt({
				type: 'GET',
				data: { agentUID: sender },
				showErrorMessage: true,
				messageControl: $('div.messageAlert'),
				showThrobber: true,
				url: baseUrl + siteURL.GetAgentBookedApointmentDates,
				success: function (data) {
					$('#bookAppointment').modal('show')
					var unavailableDates = data.list;
					$('#AgentId').val(data.id);
					//function unavailable(date) {
					//    dmy = (date.getMonth() + 1) + "-" + (date.getDate() < 10 ? '0' : '') + date.getDate() + "-" + date.getFullYear();
					//    if ($.inArray(dmy, unavailableDates) == -1) {
					//        return [true, ""];
					//    } else {
					//        return [false, "", "Unavailable"];
					//    }
					//}
					//$(".futureDateForBooking").datepicker({
					//    dateFormat: 'mm-dd-yy'
					//    //beforeShowDay: unavailable
					//});
				}
			});


		},
		AddUpdateReminder: function (sender) {
			var form = $("#form_Book_Appointment");

			$.ajaxExt({
				url: baseUrl + siteURL.BookAgentApointmentDate,
				type: 'POST',
				validate: true,
				formToValidate: $("form"),
				formToPost: form,
				isAjaxForm: true,
				showThrobber: false,
				showErrorMessage: true,
				messageControl: $('div.messageAlert'),
				success: function (results, message, status) {
					$.ShowMessage($('div.messageAlert'), message, status);
					if (status == ActionStatus.Successfull) {
						$('#form_Book_Appointment').reset();
						$('#bookAppointment').modal('hide');
					}
					setTimeout(function () {
						window.location.reload();
					}, 3000);
				}
			});
			return false;
		},

	}

    $(document).on('change', '#ddlSearchType', function () {

        if ($(this).val() == AgentSearch.AgencyName) {
            $('#divAgencyName').show();
            $('#divPostCode').hide();
            BindAgencyName();
        } else {
            $('#divAgencyName').hide();
            $('#divPostCode').show();
            BindPostCode();
        }
		//BindSelect2();

	});

	$(document).on('change', '.chk-Agents', function () {
		if ($(this)[0].type == 'checkbox') {
			var liId = 'li' + $(this)[0].id;
			if ($(this).prop('checked') == true) {
				var li = '<li id=' + liId + ' data-agentid=' + $(this)[0].id + '><img src = ' + $(this)[0].dataset.type + ' title = "logo" ></li>';

				$('#ulCompareAgents').append(li);
			}
			else {
				$('#' + liId).remove();
			}
		}
		if ($('#ulCompareAgents li').length > 1) {
			$('#btnCompareAgents').show();
		}
		else {
			$('#btnCompareAgents').hide();
		}
		if ($('#ulCompareAgents li').length > 0) {
			$('#divAgentsSelected').show();
		}
		else {

			$('#divAgentsSelected').hide();

		}

	});

	$(document).on('click', '#btnCompareAgents', function () {
		var str = '';
		$('#ulCompareAgents li').each(function () {

			if (str != '') {
				str = str + ',';
			}
			else {
				str = str + 'Agents=';
			}
			str = str + $(this)[0].dataset.agentid;
		})
		window.location.href = siteURL.CompareAgents + "?" + str;
	});
});


//function BindSelect2() {
//	var ctr = $('#ddlSearchType')
//	if ($(ctr).val() == AgentSearch.AgencyName) {
//		$(".search_postcode").empty();
//		$(".search_postcode").select2(
//			{
//				placeholder: "Search by Company Name",
//				multiple: true,
//				//maximumSelectionSize: 1,
//				ajax: {
//					url: siteURL.GetAgencyNameList,
//					global: false,
//					cache: false,
//					dataType: 'json',
//					data: function (term, page) {

//						return {
//							Search: term,
//							RecordsPerPage: 10,
//							PageNo: page
//						};
//					},
//					results: function (data) {
//						var results = [];
//						$.each(data, function (index, item) {
//							results.push({
//								id: item.id,
//								text: item.name
//							});
//						});
//						return {
//							results: results
//						};
//					}
//				},
//				initSelection: function (element, callback) {
//					var id;
//					id = $(element).val();
//					if (id != "") {
//						return $.ajax({
//							url: baseUrl + siteURL.GetInitAgencyNameList,
//							type: "Get",
//							dataType: "json", global: false,
//							cache: false,
//							data: {
//								Ids: id,
//							}
//						}).done(function (data) {
//							var results;
//							results = [];
//							$.each(data, function (index, item) {
//								results.push({
//									id: item.id,
//									text: item.name
//								});
//							});
//							callback(results);
//						});
//					}
//				},
//			});
//	}
//	else {

//		// Bind Post Code
//		$(".search_postcode").select2(
//			{
//				placeholder: "Search by Postcode",
//				multiple: true,
//				//maximumSelectionSize: 1,
//				ajax: {
//					url: siteURL.GetPostList,
//					global: false,
//					cache: false,
//					dataType: 'json',
//					data: function (term, page) {

//						return {
//							Search: term,
//							RecordsPerPage: 10,
//							PageNo: page
//						};
//					},
//					results: function (data) {
//						var results = [];
//						$.each(data, function (index, item) {
//							results.push({
//								id: item.id,
//								text: item.name
//							});
//						});
//						return {
//							results: results
//						};
//					}
//				},
//				initSelection: function (element, callback) {
//					var id;
//					id = $(element).val();
//					if (id != "") {
//						return $.ajax({
//							url: baseUrl + siteURL.GetInitPostCodeList,
//							type: "Get",
//							dataType: "json", global: false,
//							cache: false,
//							data: {
//								Ids: id,
//							}
//						}).done(function (data) {
//							var results;
//							results = [];
//							$.each(data, function (index, item) {
//								results.push({
//									id: item.id,
//									text: item.name
//								});
//							});
//							callback(results);
//						});
//					}
//				},
//			});
//	}

//}

function BindPostCode() {
    // Bind Post Code
    $("#sPostCode").select2(
        {
            placeholder: "Search by Postcode",
            multiple: true,
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
}

function BindAgencyName() {
    $("#sAgencyName").select2(
        {
            placeholder: "Search by Company Name",
            multiple: true,
            //maximumSelectionSize: 1,
            ajax: {
                url: siteURL.GetAgencyNameList,
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
                        url: baseUrl + siteURL.GetInitAgencyNameList,
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
}


function generatestringUrl() {

	var search = $('#sPostCode').val()

    var source = $("#ddlSearchType").val();

    if (source == AgentSearch.AgencyName) {
        search = $('#sAgencyName').val();
    }

	var qstr = '';
	if (search != '') {
		qstr = qstr + "search=" + search;
	}
	if (source != '') {
		if (qstr != '') {
			qstr = qstr + "&";
		}
		qstr = qstr + "source=" + source;
	}

	return qstr;

}


function Paging(sender) {

	var qstr = generatestringUrl();

	//var SortOrder = $("#SortOrder").val();

	if (qstr != '') {
		qstr = qstr + "&";
	}
	qstr = qstr + "PageNo=" + paging.startIndex;
	if (qstr != '') {
		qstr = qstr + "&";
	}
	qstr = qstr + "RecordsPerPage=" + paging.pageSize;

	//if (SortOrder > 0) {
	//	if (qstr != '') {
	//		qstr = qstr + "&";
	//	}
	//	qstr = qstr + "SortOrder=" + SortOrder;
	//}

	window.location.href = siteURL.GetAgentsList + "?" + qstr;
}