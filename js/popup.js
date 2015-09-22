;(function($) {
$(function() {
    $("p.splt-heading").click(function() {
        window.location = "/menu.html"
    });
    
    $("#repeat-button").click(function() {
        $("iframe#playBack").prop('src', $("iframe#playBack").prop('src'));
    });

    $("#spellItForm").submit(function(event) {
        event.preventDefault(); // prevent default submit behaviour
        // get values from FORM
        var message = $("textarea#message").val();
        if (!message) {
            $(".help-block").text($("textarea#message").data("validationRequiredMessage"));
            $(".help-block").show();

            return false;
        }
        var secretUrl = "https://translate.google.com.ua/translate_tts?ie=UTF-8&tl=ru&client=t&q=";
        var $playBackFrame = $("iframe#playBack");
        var generatedUrl = secretUrl + encodeURIComponent(message);
        $playBackFrame.prop('src', generatedUrl);
        success(generatedUrl);
        $("#download-button").prop("href", generatedUrl);
        $("#download-button").prop("download", message.substring(0, 10) + ".mp3");
    });

    function success(generatedUrl) {
            // Success message
            $('#success').html("<div class='alert alert-success no_margin'>");
            $('#success > .alert-success').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
                .append("</button>");
            $('#success > .alert-success')
                .append("<strong>Бесплатная ссылка для прослушивания: </strong><br/>");
            $('#success > .alert-success')
                .append("<a target=\"_blank\" href=\"" + generatedUrl + "\">" + generatedUrl + "</a>");
            $('#success > .alert-success')
                .append('</div>');
    }
});

/*When clicking on Full hide fail/success boxes */
$('#message').focus(function() {
    $('#success').html('');
    $(".help-block").hide();
    //clear all fields
    $('#spellItForm').trigger("reset");
});
})(window.jQuery);
