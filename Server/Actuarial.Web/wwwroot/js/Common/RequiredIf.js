(function ($) {
    alert('check1');
    var youtubeUrl =
        new RegExp("^[0-9a-zA-Z ]{1,200}$");
        //new RegExp("(?:http(?:s?)\\:\\/\\/)?(?:www\\.)?youtu(?:be\\.com\\/(?:watch\\?v="
        //    + "|embed\\/|v\\/)|\\.be\\/)([\\w\\-\\_]*)(&(amp;)?‌[\\w\\?‌=]*)?");
    var $jQval = $.validator;

    $jQval.addMethod("requiredif", function (value, element, params) {
        alert('inner');
        if (!value) return true;
        value = $.trim(value);
        if (!value) return true;
        alert('inner1');
        var match = youtubeUrl.exec(value);
        alert('inner2');
        return match && match.index === 0 && match.length > 1 && match[1];
    });
    alert('check2');

    var adapters = $jQval.unobtrusive.adapters;
    adapters.addBool("requiredif");

    //$.validator.unobtrusive.adapters.add("requiredif", ["controlstate"], function (options) {
    //    options.rules["requiredif"] = options.params["controlstate"];
    //    options.messages["requiredif"] = options.message;
    //});
})(jQuery);