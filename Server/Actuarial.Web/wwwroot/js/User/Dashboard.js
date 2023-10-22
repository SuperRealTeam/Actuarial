$(document).ready(function () {
	$(document).on('click', '.goto-task', function () {
		window.location.href = baseUrl + '/contact/' + $(this).data('url') + $(this).data('id');
	});
});

var Profile = {
    GetLoggedInUserDetails: function (sender) {
        $.ajaxExt({
            type: 'GET',
            validate: false,
            global: false,
            showErrorMessage: true,
            messageControl: $('div.messageAlert'),
            showThrobber: true,
            url: baseUrl + Layout.GetLoggedInUserDetails,
            data: { agentID: sender },
            success: function (results, message, status, id, list, object, url) {
                $('.user-name').text(object.firstName + " " + object.lastName);
                if (object.photo_Path == null) {
                    object.photo_Path = "../../images/avatar-default.png";
                }
                $('.img-profile').prop("src", object.photo_Path)
            }
        });
	},

	GetNotifications: function (sender) {
		$.ajaxExt({
			type: 'GET',
			validate: false,
			global: false,
			showErrorMessage: true,
			messageControl: $('div.messageAlert'),
			showThrobber: true,
			url: baseUrl + Layout.GetNotifications,
			success: function (results, message) {
				$('.notification-tab').html(results[0]);
			}
		});
	},
}