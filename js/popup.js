;(function($) {
$(function() {

    $("input,textarea").jqBootstrapValidation({
        preventSubmit: true,
        submitError: function($form, event, errors) {
            // additional error messages or events
        },
        submitSuccess: function($form, event) {
            event.preventDefault(); // prevent default submit behaviour
            // get values from FORM
            var message = $("textarea#message").val();
	    var secretUrl = "https://translate.google.com.ua/translate_tts?ie=UTF-8&tl=ru&total=1&idx=0&textlen=30&tk=878821&client=t&prev=input&q=";
	    var $playBackFrame = $("iframe#playBack");

	    var generatedUrl = secretUrl + encodeURIComponent(message);
	    $playBackFrame.prop('src', generatedUrl)
	    success(generatedUrl);
        },
        filter: function() {
            return $(this).is(":visible");
        },
    });

    function success(generatedUrl) {
	    // Success message
	    $('#success').html("<div class='alert alert-success'>");
	    $('#success > .alert-success').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
		.append("</button>");
	    $('#success > .alert-success')
		.append("<strong>Бесплатная ссылка для прослушивания: </strong><br/>");
	    $('#success > .alert-success')
		.append("<a target=\"_blank\" href=\"" + generatedUrl + "\">" + generatedUrl + "</a>");
	    $('#success > .alert-success')
		.append('</div>');

	    //clear all fields
	    $('#spellItForm').trigger("reset");
    }
});


/*When clicking on Full hide fail/success boxes */
$('#message').focus(function() {
    $('#success').html('');
});
})(window.jQuery);
