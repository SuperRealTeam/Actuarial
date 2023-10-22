$(document).ready(function () {
    $('#approveModal').on('shown.bs.modal', function () {
        $("#msgtext").html("");
    })
    $('#approveModal').on('hide.bs.modal', function () {
        $(".txt").removeClass('txt');
    })
    $(document).on('click', '.approve', function () {
        $('#token').show();
        $('#rejectreason').hide();
        $('#modalheader').text('Add Token');
        // $("#DomicileRequestApprovalsId").val($(this).data("requestid"));
        $("#Status").val($(this).data("status"));
        $("#rejectreason").removeClass('txt');
        $("#token").addClass('txt');
        $('#approveModal').modal('show');
    })

    $(document).on('click', '.reject', function () {
        $('#rejectreason').show();
        $('#token').hide();
        $('#modalheader').text('Add Comment');
        // $("#DomicileRequestApprovalsId").val($(this).data("requestid"));
        $("#Status").val($(this).data("status"));
        $("#token").removeClass('txt');
        $("#rejectreason").addClass('txt');
        $('#approveModal').modal('show');
    })

    $(document).on('click', '#btnApproveRequest', function () {
        if ($(".txt").val()) {
            $("#msgtext").html("");
            var requestId = $("#RequestId").val();
            var status = $("#Status").val();
            var text = $(".txt").val();
            Domicile.SwitchRequestAction(requestId, text, status);
            setTimeout(function () { $('#approveModal').trigger('click.dismiss.bs.modal'); }, 2000);
        }
        else
            $("#msgtext").html("Please add value");
    })
})

var Domicile = {
    SwitchRequestAction: function (requestId, text, status) {

        $.ajaxExt({
            type: 'POST',
            validate: false,
            showErrorMessage: true,
            messageControl: $('div.messageAlert'),
            showThrobber: true,
            url: baseUrl + siteURL.RequestAction,
            data: { requestId: requestId, Text: text, status: status },
            success: function (results, message, status) {

                $.ShowMessage($('div.messageAlert'), message, status);
                $('#approveModal').modal('hide');
                setTimeout(function () {
                    window.location.reload();
                }, 3000);
            }
        });


    },
}