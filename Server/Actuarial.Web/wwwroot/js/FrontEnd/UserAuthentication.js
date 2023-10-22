$(document).ready(function () {

    $(document).on('click', '#btnRegister', function () {
        if ($('#Terms').prop('checked'))
            return User.RegisterUser($(this));
        else {
            $('.checkmark1').text("Please accept terms & conditions.").addClass("field-validation-error");
        }
    });

    $(document).on('change', '#Terms', function () {
        if ($('#Terms').prop('checked'))
            $('.checkmark1').text("").removeClass("field-validation-error");
        else {
            $('.checkmark1').text("Please accept terms & conditions.").addClass("field-validation-error");
        }
    });
    $('#formLogin input#Password').keyup(function (event) {
        if (event.keyCode === 13) {
            return User.LoginUser();
        }
    });

    $('#formEmailVerification input#Password').keyup(function (event) {
        if (event.keyCode === 13) {
            return User.EmailVerficationWithPassword($(this))
        }
    });
    $('#forResetPassword input#ConfirmPassword').keyup(function (event) {
        if (event.keyCode === 13) {
            return User.ResetPassword($(this))
        }
    });



    $(document).on('click', '#btnLogin', function () {
        return User.LoginUser();
    });
    $(document).on('click', '#btnForgotPassword', function () {
        return User.ForgotPassword($(this));
    });
    $('#formForgotPassword input#Email').keyup(function (event) {
        if (event.keyCode === 13) {
            User.ForgotPassword($(this))
        }
    });

    $(document).on('click', '#btnResetPassword', function () {
        return User.ResetPassword($(this));
    });
    $(document).on('click', '#btnEmailVerification', function () {
        return User.EmailVerficationWithPassword($(this));
    });

    $(document).on('click', '#btnChangePassword', function () {
        return User.ChangePassword($(this));
    });
});

var User = {

    RegisterUser: function (sender) {
		var form = $("#formRegister");
		
        $.ajaxExt({
            url: baseUrl + siteURL.RegisterUser,
            type: 'POST',
            validate: true,
            formToValidate: form,
            formToPost: form,
            isScroll: false,
            isAjaxForm: true,
            showThrobber: false,
            showErrorMessage: true,
            messageControl: $('div.messageAlert'),
            success: function (results, message) {
                $.ShowMessage($('div.messageAlert'), message, MessageType.Success);
				setTimeout(function () {
					
					var usertype = form.find('#userRoleID').val();
					if (usertype == 10) {
						window.location.reload();
					}
					else {
						window.location.href = siteURL.Login;
					}
                }, 3000);
            }
        });
        return false;
    },

    LoginUser: function () {
        var form = $("#formLogin");
        $.ajaxExt({
            url: baseUrl + siteURL.ajaxLoginUser,
            type: 'POST',
            validate: true,
            formToValidate: form,
            formToPost: form,
            isScroll: false,
            isAjaxForm: true,
            showThrobber: false,
            showErrorMessage: true,
            messageControl: $('div.messageAlert'),
            success: function (results, message, status, id, list, object, url) {
                //$.ShowMessage($('div.messageAlert'), "Login successfully.", MessageType.Success);
                if (status === ActionStatus.Successfull)
                    window.location.href = siteURL.Dashboard;
            }
        });
        return false;
    },

    ForgotPassword: function (sender) {
        var form = $("#formForgotPassword");
        $.ajaxExt({
            url: baseUrl + siteURL.ajxForgotPassword,
            type: 'POST',
            validate: true,
            formToValidate: form,
            formToPost: form,
            isScroll: false,
            isAjaxForm: true,
            showThrobber: false,
            showErrorMessage: true,
            messageControl: $('div.messageAlert'),
            success: function (results, message, status, id, list, object, url) {
                debugger
                $.ShowMessage($('div.messageAlert'), message, MessageType.Success);
                setTimeout(function () {
                    if (status === ActionStatus.Successfull)
                        window.location.reload();
                }, 3000);
            }
        });
        return false;
    },

    ResetPassword: function (sender) {
        var form = $("#forResetPassword");
        $.ajaxExt({
            url: baseUrl + siteURL.ajxResetPassword,
            type: 'POST',
            validate: true,
            formToValidate: form,
            formToPost: form,
            isAjaxForm: true,
            showThrobber: false,
            showErrorMessage: true,
            messageControl: $('div.messageAlert'),
            success: function (results, message, status, id, list, object, url) {
                debugger
                $.ShowMessage($('div.messageAlert'), message, MessageType.Success);
                setTimeout(function () {
					if (status === ActionStatus.Successfull)
						if (id == 10) {
							window.location.href = siteURL.LoginHome
						} else {
							window.location.href = siteURL.Login;
						}
                       
                }, 3000);
            }
        });
        return false;
    },

    EmailVerficationWithPassword: function (sender) {
        var form = $("#formEmailVerification");
        $.ajaxExt({
            url: baseUrl + siteURL.ajxEmailVerficationWithPassword,
            type: 'POST',
            validate: true,
            formToValidate: form,
            formToPost: form,
            isAjaxForm: true,
            showThrobber: false,
            showErrorMessage: true,
            messageControl: $('div.messageAlert'),
            success: function (results, message, status, id, list, object, url) {
                debugger
                $.ShowMessage($('div.messageAlert'), message, MessageType.Success);
                setTimeout(function () {
                    if (status === ActionStatus.Successfull)
						if (id == 10) {
							window.location.href = siteURL.LoginHome
						} else {
							window.location.href = siteURL.Login;
						}
                }, 3000);
            }
        });
        return false;
    },

    ChangePassword: function (sender) {
        var form = $("#formChangePassword");
        $.ajaxExt({
            url: baseUrl + siteURL.ajxChangePassword,
            type: 'POST',
            validate: true,
            formToValidate: form,
            formToPost: form,
            isAjaxForm: true,
            showThrobber: false,
            showErrorMessage: true,
            messageControl: $('div.messageAlert'),
            success: function (results, message, status, id, list, object, url) {
                $.ShowMessage($('div.messageAlert'), message, MessageType.Success);
                setTimeout(function () {
                    if (status === ActionStatus.Successfull)
                        window.location.href = siteURL.Login;
                }, 3000);
            }
        });
        return false;
    },

};