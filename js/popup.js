var PopupPage = (function($){
    PopupPage.prototype = new jQueryPage();

    var $messageTextArea = $('#message'),
        $spltForm = $("#spellItForm"),
        $playBackAudio = $("audio#playBack"),
        $startButton = $("#start-button"),
        $stopButton = $("#stop-button"),
        self,
        text;

    /**
     * Constructor
     */
    function PopupPage() {
       self = this;
       text = self.getUrlParameterByName("text");

       self.init();
    }

    //TODO: do smth with this temporary code
    PopupPage.prototype.init = function () {
        $playBackAudio.prop("src", "");

        $playBackAudio.on("ended", function () {
            self.stopPlayback();
        });

        $stopButton.click(function () {
            self.stopPlayback();
        });

        $messageTextArea.focus(function() {
            $('#success').hide();
            $(".help-block").hide();
        });

        $("p.splt-heading").click(function() {
            window.location = "/about.html"
        });

        $("#repeat-button").click(function() {
            self.startPlayback();
        });

        $spltForm.submit(function(event) {
            event.preventDefault();

            var secretUrl = "https://translate.google.com.ua/translate_tts?ie=UTF-8&tl=ru&total=1&idx=0&client=t",
                message = $("textarea#message").val();
            if (!message) {
                //TODO:Implement jQuery Templates
                $(".help-block").text($("textarea#message").data("validationRequiredMessage"));
                $(".help-block").show();

                return false;
            }

            var generatedUrl = secretUrl + "&textlen=" + message.length + "&q=" + encodeURIComponent(message);
            $playBackAudio.prop('src', generatedUrl);
            self.startPlayback();
            var resultMessage = "<strong>Бесплатная ссылка для прослушивания: </strong><br/>" +
                    "<a target=\"_blank\" href=\"" + generatedUrl + "\">" + generatedUrl + "</a>";
            self.successNotification(resultMessage);
            $("#download-button").prop("href", generatedUrl);
            $("#download-button").prop("download", message.substring(0, 10) + ".mp3");
            self.saveToRecentVoices(message);
        });

        if (text) {
            $messageTextArea.text(text);
            $spltForm.submit();
            var currentState = window.history.state;
            window.history.replaceState(currentState, "", "/popup.html");
        }

        self.translate($("[data-t-name]"));

    }

    PopupPage.prototype.startPlayback = function () {
        $playBackAudio.trigger("play");
        $startButton.hide();
        $stopButton.show();

    }

    PopupPage.prototype.stopPlayback = function () {
        $playBackAudio.trigger("pause");
        $playBackAudio.prop("currentTime", 0);
        $stopButton.hide();
        $startButton.show();
    }

    
    PopupPage.prototype.saveToRecentVoices = function (message) {
        chrome.storage.sync.get("recentVoices", function (data) {
            var recentVoices = (Object.keys(data).length) ? data.recentVoices : [];

            if (recentVoices.length >= 10) {
                recentVoices.pop();
            }

            recentVoices.unshift(message);
            chrome.storage.sync.set({"recentVoices": recentVoices});
        });
    }

    //TODO:Implement jQuery Templates
    PopupPage.prototype.successNotification = function (message) {
        $('#success').html("<div class='alert alert-success splt-success'>");
        $('#success > .alert-success').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
            .append("</button>");
        $('#success > .alert-success')
            .append(message);
        $('#success > .alert-success')
            .append('</div>');
        $('#success').show();
    }

    return PopupPage;
}(window.jQuery));

var pagePopup = new PopupPage();

