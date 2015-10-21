var AboutPage = (function($){
    AboutPage.prototype = new SubordinatePage();

    /**
     * @type AboutPage Represent <this> in callback functions
     */
    var self;

    /**
     * Constructor
     */
    function AboutPage(selectors) {
       SubordinatePage.call(this, selectors);
       self = this;

       self.init();
    }

    AboutPage.prototype.init = function () {
        self.translate($("[data-t-name]"));
        self.$buttonBack && self.$buttonBack.getElement().empty();
    }

    return AboutPage;
}(window.jQuery));

var aboutPopup = new AboutPage({
    buttonBack: "#back-button"
});
