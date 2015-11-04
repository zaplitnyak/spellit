var RecentPage = (function($){
    RecentPage.prototype = new SubordinatePage();

    /**
     * @type RecentPage Represent <this> in callback functions
     */
    var self;

    /**
     * @type jQueryElement
     */
    var $listMessages,
        $linkMessage;

    /**
     * @type Array
     */
    var recentMessages = [];

    /**
     * Constructor
     */
    function RecentPage(selectors) {
       SubordinatePage.call(this, selectors);
       self = this;

       self.init(selectors);
    }

    RecentPage.prototype.init = function (selectors) {
        self.translate($("[data-t-name]"));
        self.clearData($("[data-empty]"));

        //TODO: Specify class for operations in storage
        chrome.storage.sync.get("recentVoices", function (data) { storageSuccessCallback(data); });

        self.$listMessages = new jQueryElement(selectors.listMessages);
    }

    var linkMessageConfig = {
        selector: ".recentVoiceLink",
        events: {
            click: function (event) {
                event.preventDefault();

                var index = $(this).data("index");
                window.location = "/popup.html?text=" + encodeURIComponent(self.getRecentMessage(index));
            }
        }
    };

    RecentPage.prototype.getRecentMessage = function (index) {
        return this.recentMessages[index];
    };

    function storageSuccessCallback(data) {
        if (chrome.runtime.lastError) {
            throw new ChromeStorageException(chrome.runtime.lastError);
        }
        self.recentMessages = (Object.keys(data).length) ? data.recentVoices : [];
        populateRecentList(self.recentMessages);
        self.$linkMessage = new jQueryElement(linkMessageConfig);
    }

    function populateRecentList(data) {
        var recentMessages = data;
        var $list = self.$listMessages.getElement(),
            listValues = [];

        if (!recentMessages.length) {
            listValues = "Тут очень пуcто;(";
        }
        for (var i in recentMessages) {
            var $link = $("<a class=\"list-group-item recentVoiceLink\" href=\"#\" data-index=\"" + i + "\"/>");
            $link.text(self.truncate(recentMessages[i], 40));
            listValues.push($link);
        }
        $list.append(listValues);
    }

    return RecentPage;
}(window.jQuery));

var pageRecent = new RecentPage({
    buttonBack: "#back-button",
    listMessages: "#recent-list",
    linkMessage: ".recentVoiceLink"
});
