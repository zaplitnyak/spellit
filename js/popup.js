var PopupPage = (function($){
    PopupPage.prototype = new jQueryPage();

    /**
     * @var PopupPage Represent <this> in callback functions
     */
    var self;

    /**
     * @type string
     */
    var message;

    /**
     * @vars jQuery variables
     */
    var $messageTextArea,
        $spltForm,
        $playBackAudio,
        $startButton,
        $stopButton,
        $repeatButton,
        $appNameHeader;

    /**
     * Constructor
     */
    function PopupPage(selectors) {
       self = this;
       self.message = self.getUrlParameterByName("text");

       self.init(selectors);
    }

    //TODO: do smth with this temporary code
    PopupPage.prototype.init = function (selectors) {
        self.$playBackAudio = new jQueryElement(playBackAudioConfig);
        self.$stopButton = new jQueryElement(stopButtonConfig);
        self.$startButton = new jQueryElement(startButtonConfig);
        self.$repeatButton = new jQueryElement(repeatButtonConfig);
        self.$appNameHeader = new jQueryElement(appNameHeaderConfig);
        self.$spltForm = new jQueryElement(spltFormConfig);
        self.$messageTextArea = new jQueryElement(textAreaConfig);

        self.$playBackAudio.getElement().trigger("clear");

        if (self.message) {
            restoreFromRecent(self.message);
        }

        self.translate($("[data-t-name]"));

    }

    var playBackAudioConfig = {
        selector: "audio#playBack",
        events: {
            clear: function () {
                self.$playBackAudio.getElement().prop("src", "");
                stopPlayback();
            },
            ended: function () {
                stopPlayback();
            }
        }
    };

    var stopButtonConfig = {
        selector: "#stop-button",
        events: {
            click: function () {
                stopPlayback();
            }
        }
    };

    var startButtonConfig = {
        selector: "#start-button"
    };

    var repeatButtonConfig = {
        selector: "#repeat-button",
        events: {
            click: function () {
                startPlayback();
            }
        }
    };

    var appNameHeaderConfig = {
        selector: "p.splt-heading",
        events: {
            click: function () {
                window.location = "/about.html"
            }
        }
    };

    var textAreaConfig = {
        selector: "#message",
        events: {
            focus: function() {
                $('#success').hide();
                $(".help-block").hide();
            }
        }
    };

    var spltFormConfig = {
        selector: "#spellItForm",
        events: {
            submit: function(event) {
                event.preventDefault();

                var secretUrl = "https://translate.google.com.ua/translate_tts?ie=UTF-8&tl=ru&total=1&idx=0&client=t",
                    userText = self.$messageTextArea.getElement().text();
                if (!userText) {
                    //TODO:Implement jQuery Templates
                    $(".help-block").text($("textarea#message").data("validationRequiredMessage"));
                    $(".help-block").show();

                    return false;
                }
                console.log(self.$messageTextArea.getElement());
                var generatedUrl = secretUrl + "&textlen=" + userText.length + "&q=" + encodeURIComponent(userText);
                self.$playBackAudio.getElement().prop('src', generatedUrl);
                console.log(self.$playBackAudio.getElement());
                startPlayback();
                var resultMessage = "<strong>Бесплатная ссылка для прослушивания: </strong><br/>" +
                        "<a target=\"_blank\" href=\"" + generatedUrl + "\">" + generatedUrl + "</a>";
                self.successNotification(resultMessage);
                $("#download-button").prop("href", generatedUrl);
                $("#download-button").prop("download", userText.substring(0, 10) + ".mp3");
                self.saveToRecentVoices(userText);
            }
        }
    };

    function startPlayback() {
        self.$playBackAudio.getElement().trigger("play");
        self.$startButton.getElement().hide();
        self.$stopButton.getElement().show();
    }

    function stopPlayback() {
        self.$playBackAudio.getElement().trigger("pause");
        self.$playBackAudio.getElement().prop("currentTime", 0);
        self.$stopButton.getElement().hide();
        self.$startButton.getElement().show();
    }

    function restoreFromRecent(message) {
        self.$messageTextArea.getElement().text(message);
        self.$spltForm.getElement().submit();
        var currentState = window.history.state;
        window.history.replaceState(currentState, "", "/popup.html");
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

    PopupPage.prototype.successNotification = function (message) {
        var content = $("#successMessageTemplate").render(message);
        $('#success').html(content);
        $('#success').show();
    }

    return PopupPage;
}(window.jQuery));

var pagePopup = new PopupPage({
    
});
