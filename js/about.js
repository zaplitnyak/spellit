var AboutPage = (function($){
    AboutPage.prototype = new SubordinatePage();

    /**
     * @type AboutPage Represent <this> in callback functions
     */
    var self;

    /**
     * @type jQueryElement
     */
    var $divContent;

    /**
     * Constructor
     */
    function AboutPage(selectors) {
       SubordinatePage.call(this, selectors);
       self = this;

       self.init(selectors);
    }

    AboutPage.prototype.init = function (selectors) {
        self.translate($("[data-t-name]"));
        self.$buttonBack && self.$buttonBack.getElement().empty();
        self.$divContent = new jQueryElement(selectors.divContent);
        self.$divContent.getElement().html(self.t("pageAboutText"));
    }

    return AboutPage;
}(window.jQuery));

var pageAbout = new AboutPage({
    buttonBack: "#back-button",
    divContent: "#pageText"
});
