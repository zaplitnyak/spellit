;(function($) {
    $(function() {
        var $messageTextArea = $('#message'),
            $spltForm = $("#spellItForm"),
            $playBackFrame = $("iframe#playBack"),
            text = getUrlParameterByName("text");

        $playBackFrame.prop("src", "");

        $messageTextArea.focus(function() {
            $('#success').hide();
            $(".help-block").hide();
            $('#spellItForm').trigger("reset");
        });

        $("p.splt-heading").click(function() {
            window.location = "/about.html"
        });

        $("#repeat-button").click(function() {
            $("iframe#playBack").prop('src', $("iframe#playBack").prop('src'));
        });

        $spltForm.submit(function(event) {
            event.preventDefault();

            var secretUrl = "https://translate.google.com.ua/translate_tts?ie=UTF-8&tl=ru&client=t&q=",
                message = $("textarea#message").val();
            if (!message) {
                $(".help-block").text($("textarea#message").data("validationRequiredMessage"));
                $(".help-block").show();

                return false;
            }

            var generatedUrl = secretUrl + encodeURIComponent(message);
            $playBackFrame.prop('src', generatedUrl);
            var resultMessage = "<strong>Бесплатная ссылка для прослушивания: </strong><br/>" +
                    "<a target=\"_blank\" href=\"" + generatedUrl + "\">" + generatedUrl + "</a>";
            successNotification(resultMessage);
            $("#download-button").prop("href", generatedUrl);
            $("#download-button").prop("download", message.substring(0, 10) + ".mp3");
            saveRecentVoices(message);
        });

        if (text) {
            $messageTextArea.text(text);
            $spltForm.submit();
            var currentState = window.history.state;
            window.history.replaceState(currentState, "", "/popup.html");
        }
    });

    function successNotification(message) {
        $('#success').html("<div class='alert alert-success splt-success'>");
        $('#success > .alert-success').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
            .append("</button>");
        $('#success > .alert-success')
            .append(message);
        $('#success > .alert-success')
            .append('</div>');
        $('#success').show();
    }

    function saveRecentVoices(message) {
        chrome.storage.sync.get("recentVoices", function (data) {
            var recentVoices = (Object.keys(data).length) ? data.recentVoices : [];

            if (recentVoices.length >= 10) {
                recentVoices.pop();
            }

            recentVoices.unshift(message);
            chrome.storage.sync.set({"recentVoices": recentVoices});
        });
    }

    function getUrlParameterByName(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(window.location.search);

        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

})(window.jQuery);
