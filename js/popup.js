var PopupPage = (function($){
    PopupPage.prototype = new jQueryPage();

    /**
     * @var PopupPage Represent <this> in callback functions
     */
    var self;

    /**
     * @type SpeechSynthesisUtterance
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
        $langSelect,
        $appNameHeader;

    /**
     * Constructor
     */
    function PopupPage(selectors) {
       self = this;
       self.message = new SpeechSynthesisUtterance(self.getUrlParameterByName("text"));

       self.init(selectors);
    }

    //TODO: do smth with this temporary code
    PopupPage.prototype.init = function (selectors) {
        self.$stopButton = new jQueryElement(stopButtonConfig);
        self.$startButton = new jQueryElement(startButtonConfig);
        self.$appNameHeader = new jQueryElement(appNameHeaderConfig);
        self.$spltForm = new jQueryElement(spltFormConfig);
        self.$messageTextArea = new jQueryElement(textAreaConfig);
        self.$langSelect = new jQueryElement(langSelectConfig);

        self.translate($("[data-t-name]"));
        self.$messageTextArea.getElement().focus();

        if (self.message) {
            restoreFromRecent(self.message);
        }

        self.clearData($("[data-empty]"));
        populateLanguages();
        self.message.onend = function(e) {
              stopPlayback();
        };
    }

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
            focus: function () {
                $('#success').hide();
                $(".help-block").hide();
            },
            keydown: function (event) {
                $(".help-block").hide();/* temp solution */
                if (event.keyCode === 13 && event.ctrlKey) {
                    self.$spltForm && self.$spltForm.getElement().submit();
                }
            }
        }
    };

    var langSelectConfig = {
        selector: "#langs",
    };


    var spltFormConfig = {
        selector: "#spellItForm",
        events: {
            submit: function(event) {
                event.preventDefault();

                var secretUrl = "http://translate.google.com.ua/translate_tts?ie=UTF-8&tl=ru&total=1&idx=0&client=t",
                    userText = self.$messageTextArea.getElement().val();
                if (!userText) {
                    $(".help-block").text(self.t("formErrorEmpty"));
                    $(".help-block").show();

                    return false;
                }
                self.message.text = userText;
                self.message.lang = self.$langSelect.getElement().val();
                startPlayback();
                /*var generatedUrl = secretUrl + "&textlen=" + userText.length + "&q=" + encodeURIComponent(userText);
                self.$playBackAudio.getElement().prop('src', generatedUrl);
                self.$repeatButton.getElement().prop('disabled', false);
                var resultMessage = "<strong>" + self.t("playBackUrlMessage") + ": </strong><br/>" +
                        "<a target=\"_blank\" href=\"" + generatedUrl + "\">" + generatedUrl + "</a>";
                self.successNotification(resultMessage);
                $("#download-button").prop("href", generatedUrl);
                $("#download-button").prop("download", userText.substring(0, 10) + ".mp3");*/
                self.saveToRecentVoices(userText);
            }
        }
    };

    function startPlayback() {
        self.$startButton.getElement().hide();
        self.$stopButton.getElement().show();
        window.speechSynthesis.speak(self.message);
    }

    function stopPlayback() {
        self.$stopButton.getElement().hide();
        self.$startButton.getElement().show();
        window.speechSynthesis.cancel();
    }

    function restoreFromRecent(message) {
        self.$messageTextArea.getElement().text(message.text);
        self.$spltForm.getElement().submit();
        var currentState = window.history.state;
        window.history.replaceState(currentState, "", "/popup.html");
    }

    function populateLanguages() {
        var voices = window.speechSynthesis.getVoices();
        var options = '';
        for (var voice in voices) {
            options += '<option value="' + voice.lang + '">' + voice.name + "</option>";
        }
        if (!options) {
            options = '<option value="en-US">English</option><option value="ru-RU">Ruzkiy</option>';
        }
        self.$langSelect.getElement().append(options);
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

    //TODO: Implement JS templater UPD: CRETE OR FIND OTHER SOLUTION. jQ templaters use unsafe eval:(
    PopupPage.prototype.successNotification = function (message) {
        var data = "<div class='alert alert-success splt-success'>\n\
                    <button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button>"
                    + message +
                    "</div>";
        $('#success').html(data);
        $('#success').show();
    }

    return PopupPage;
}(window.jQuery));

var pagePopup = new PopupPage();

