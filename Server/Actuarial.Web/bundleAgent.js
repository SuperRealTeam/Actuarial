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