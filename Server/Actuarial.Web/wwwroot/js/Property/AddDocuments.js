var docPath = 'http://localhost:50490//uploads//';
//var docPath = 'http://bulkbilling.acumobi.com//uploads//';
$(document).ready(function () {
    Document.AddDocumentArea();
    $(document).on('click', '#btnUploaddocuments', function () {
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
            Document.AddUpdateDocuments($(this));
        }
    })



    $(document).on('click', '#btnUploadDetailsDocument', function () {
        var flag = true;
        $(".docProp").each(function () {

            if ($(this).val() === '') {
                $(this).addClass("input-validation-error");
                flag = false;
                return false;
            }
        });
        if (flag) {
            $("#files").replaceWith($("#files").val('').clone(true));
            $("#fPics").replaceWith($("#fPics").val('').clone(true));
            Document.AddUpdateDetailDocuments($(this));
        }
    })

    

    $(document).on('change', '.upload', function () {
		$(this).siblings('.file-name').text(this.files[0].name);
	});
})
Document = {
    AddDocumentArea: function () {

        var max_fields = 10; //maximum input boxes allowed
        var wrapper = $(".input_fields_wrap"); //Fields wrapper
        var add_button = $(".add_field_button"); //Add button ID

        var x = $("#docCount").val(); //initlal text box count
        if (parseInt($("#docCount").val()) > 0)
            x = x - 1;
        $(add_button).click(function (e) { //on add input button click
            ;
            e.preventDefault();
            //  x = parseInt($("#empCount").val());
            if (x < max_fields) { //max input box allowed
                x++; //text box increment
				$(wrapper).append('<div class="input_fields_wrap1 wrapnew"><input type="text" class="form-control docProp" placeholder="Title" name="PropertyDocuments[' + x + '].DocTitle" required/><input name="PropertyDocuments[' + x + '].Document" id="PropertyDocuments[' + x + '].Document" type="file" class="upload up"><input type="hidden" name="PropertyDocuments.Index" value=' + x + '> <a href="#" class="remove_field"> <i class="fa fa-trash-o" aria-hidden="true"></i></a></div>'); //add input box
                //   $("#empCount").val(x);
            }
        });

        $(wrapper).on("click", ".remove_field", function (e) { //client click on remove text
            ;
            e.preventDefault(); $(this).parent('div').remove(); x--;

            //$('#empCount').val(x);
        })

    },

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

                    var arr = list[0].slice(0, -1).split(',');
                    
                    if (arr.length > 0 && arr[0] != '')  {
                        $('#divDocumentUpload').html('');
                       // var div = $('#divDocumentUpload').append('<div class="col-lg-12"><br/><h4>Newly Uploaded Documents</h4 ></div >');
						var Table = $('#divDocumentUpload').append('<div class="col-lg-12"><br/><h4>Newly Uploaded Documents</h4 ></div ><table id="tblDoc" class="uploaded-documents"> <tr><th>Title</th> <th>Date</th><th>Document</th> </tr></table>');
                        for (var i = 0; i < arr.length; i++) {
                            var divdoc = '';
							if (arr[i] != '') {
								var currentdate = new Date();
								var datetime = currentdate.getDate() + "/"
									+ (currentdate.getMonth() + 1) + "/"
									+ currentdate.getFullYear() + " "
									+ currentdate.getHours() + ":"
									+ currentdate.getMinutes() + ":"
									+ currentdate.getSeconds();
                              // divdoc = '<div class="col-lg-3"><a href=' + docPath + arr[i] + ' class="docx" id="doc1" target="_blank"><i id="exist_doc_1_icon" class="fa fa-file-text" aria-hidden="true"></i><span id="doc_1_title">' + arr[i] + '</span><span id="doc_1_icon"></span></a>'
								divdoc = '<tr><td>' + arr[i].split('~')[1] + '</td><td> ' + datetime +' </td><td><a href=' + docPath + arr[i].split('~')[0] + ' class="docx" id="doc1" target="_blank"><i id="exist_doc_1_icon" class="fa fa-file-text" aria-hidden="true"></i><span id="doc_1_title">' + arr[i].split('~')[0] + '</span><span id="doc_1_icon"></span></a> </td></tr>'
                            }
                           // div.append(divdoc);
							$('#tblDoc tr:last').after(divdoc);
						}
                    }
                }
                $.ShowMessage($('div.messageAlert'), message, MessageType.Success);

            }
        });

        //alert($("iframe").parent("#myModal"));
        //$("iframe").parent(".add-contact-popup").hide();
        //$("iframe").parent("#myModal").hide();//.trigger('click.dismiss.bs.modal');
        return false;
    },

    AddUpdateDetailDocuments: function (sender) {
        $.ajaxExt({
            url: baseUrl + siteURL.UploadDetailsDocumnets,
            type: 'POST',
            validate: false,
            formToPost: $("form#formUpdateDocument"),
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

                    var arr = list[0].slice(0, -1).split(',');

                    if (arr.length > 0 && arr[0] != '') {
                        $('#divDocumentUpload').html('');
                        // var div = $('#divDocumentUpload').append('<div class="col-lg-12"><br/><h4>Newly Uploaded Documents</h4 ></div >');
                        var Table = $('#divDocumentUpload').append('<div class="col-lg-12"><br/><h4>Newly Uploaded Documents</h4 ></div ><table id="tblDoc" class="uploaded-documents"> <tr><th>Title</th> <th>Date</th><th>Document</th> </tr></table>');
                        for (var i = 0; i < arr.length; i++) {
                            var divdoc = '';
                            if (arr[i] != '') {
                                var currentdate = new Date();
                                var datetime = currentdate.getDate() + "/"
                                    + (currentdate.getMonth() + 1) + "/"
                                    + currentdate.getFullYear() + " "
                                    + currentdate.getHours() + ":"
                                    + currentdate.getMinutes() + ":"
                                    + currentdate.getSeconds();
                                // divdoc = '<div class="col-lg-3"><a href=' + docPath + arr[i] + ' class="docx" id="doc1" target="_blank"><i id="exist_doc_1_icon" class="fa fa-file-text" aria-hidden="true"></i><span id="doc_1_title">' + arr[i] + '</span><span id="doc_1_icon"></span></a>'
                                divdoc = '<tr><td>' + arr[i].split('~')[1] + '</td><td> ' + datetime + ' </td><td><a href=' + docPath + arr[i].split('~')[0] + ' class="docx" id="doc1" target="_blank"><i id="exist_doc_1_icon" class="fa fa-file-text" aria-hidden="true"></i><span id="doc_1_title">' + arr[i].split('~')[0] + '</span><span id="doc_1_icon"></span></a> </td></tr>'
                            }
                            // div.append(divdoc);
                            $('#tblDoc tr:last').after(divdoc);
                        }
                    }
                }
                $.ShowMessage($('div.messageAlert'), message, MessageType.Success);

            }
        });

        //alert($("iframe").parent("#myModal"));
        //$("iframe").parent(".add-contact-popup").hide();
        //$("iframe").parent("#myModal").hide();//.trigger('click.dismiss.bs.modal');
        return false;
    },
}