var TopPage = (function($){
    TopPage.prototype = new SubordinatePage();

    /**
     * @type TopPage Represent <this> in callback functions
     */
    var self;

    /**
     * Constructor
     */
    function TopPage(selectors) {
       SubordinatePage.call(this, selectors);
       self = this;

       self.init();
    }

    TopPage.prototype.init = function () {
        self.translate($("[data-t-name]"));
        self.clearData($("[data-empty]"));
    }

    return TopPage;
}(window.jQuery));

var pageTop = new TopPage({
    buttonBack: "#back-button"
});
