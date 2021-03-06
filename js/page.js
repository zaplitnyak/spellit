/**
 * Class BasePage
 *
 * @author Andrew Zaplitnyak <zaplitnyak@gmail.com>
 *
 * @type Function|page_L4.BasePage
 */
var BasePage = (function(){
    /**
     * Constructor
     */
    function BasePage(){
    }

    /**
     * Truncate text
     *
     * @param string text
     * @param int    lengh
     * @param string placeholder[optional]
     *
     * @return string
     */
    BasePage.prototype.truncate = function (text, length, placeholder) {
        placeholder = (typeof placeholder === 'undefined') ? '...' : placeholder;
        var result = text.substring(0, length);
        result += (text.length > length) ? placeholder : '';

        return result;
    }

    /**
     * Yii style translation:)
     * @param string name
     *
     * @return string
     */
    BasePage.prototype.t = function (name) {
        return chrome.i18n.getMessage(name);
    }

    BasePage.prototype.getUrlParameterByName = function (name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(window.location.search);

        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    return BasePage;
}());


/**
 * Class jQueryPage
 *
 * @author Andrew Zaplitnyak <zaplitnyak@gmail.com>
 *
 * @type Function|page_L56.jQueryPage
 */
var jQueryPage = (function ($) {
    jQueryPage.prototype = new BasePage();

    var self;

    /**
     * Constructor
     */
    function jQueryPage() {
        if (window.jQuery === undefined) {
            //TODO: Make Exceptions classes in exceptions.js
            throw new jQueryException("jQuery undefined! Please load jQuery ver. >=1.9");
        }

        self = this;
    }

    /**
     * @param array[jQuery]|jQuery elements
     */
    jQueryPage.prototype.translate = function (elements) {
        var $elements = (elements.length !== undefined) ? elements : [elements],
            translation = '';

        $.each($elements, function() {
            translation = self.t($(this).data("tName"));
            if (translation) {
                $(this).text(translation);
                $(this).prop("title", translation);
                $(this).prop("placeholder", translation);
            }
        });
    };

    /**
     * @param array[jQuery]|jQuery elements
     */
    jQueryPage.prototype.clearData = function (elements) {
        var $elements = (elements.length !== undefined) ? elements : [elements];

        $.each($elements, function() {
            $(this).empty();
        });
    }

    return jQueryPage;
}(window.jQuery));

/**
 * Class SubordinatePage
 *
 * @author Andrew Zaplitnyak <zaplitnyak@gmail.com>
 *
 * @type Function|page_L105.SubordinatePage
 */
var SubordinatePage = (function ($) {
    SubordinatePage.prototype = new jQueryPage();

    /**
     * @type SubordinatePage Represent this in callbacks
     */
    var self;

    var $buttonBack;

    /**
     * Constructor
     */
    function SubordinatePage(selectors) {
        if (window.jQuery === undefined) {
            //TODO: Make Exceptions classes in exceptions.js
            throw new jQueryException("jQuery undefined! Please load jQuery ver. >=1.9");
        }

        self = this;
        if (selectors && selectors.buttonBack) {
            buttonBackConfig.selector = selectors.buttonBack;
            self.$buttonBack = new jQueryElement(buttonBackConfig);
        }
    }

    var buttonBackConfig = {
        events: {
            click: function () {
                window.history.back();
            }
        }
    }

    return SubordinatePage;
}(window.jQuery));

/**
 * Class jQueryElement
 *
 * @author Andrew Zaplitnyak <zaplitnyak@gmail.com>
 *
 * @type page_L100.jQueryElement|Function
 */
var jQueryElement = (function ($) {
    /**
     * @type jQueryElement
     */
    var self;

    /**
     * @type Selector
     */
    var selector;

    /**
     * @type jQuery
     */
    var $element;

    /**
     * @type PlainObject
     */
    var events;

    /**
     * Constructor
     *
     * @param object|string config
     */
    function jQueryElement(config) {
        if (window.jQuery === undefined) {
            //TODO: Make Exceptions classes in exceptions.js|||DULICATED
            throw new jQueryException("jQuery undefined! Please load jQuery ver. >=1.9");
        }
        if (!config) {
            throw new NullException("Element config can't be empty! It must contain selector at least!");
        }
        self = this;

        self.selector = (typeof config === "string") ? config : config.selector;
        if (!self.selector) {
            throw new NullException("Element selector can't be empty! Please, attend: http://api.jquery.com/jquery/#jQuery1");
        }

        self.$element = $(self.selector);
        self.events = (config.events !== undefined) ? config.events : {};

        self.init();
    }

    jQueryElement.prototype.init = function (events) {
        this.getElement().on(this.events);
        this.getElement().on(events);
    }

    /**
     * @returns jQuery
     */
    jQueryElement.prototype.getElement = function () {
        if (this.$element.length === 0) {
            throw new NullException("Element not found! Selector: " + this.selector);
        }

        return this.$element;
    }

    /**
     * @returns string
     */
    jQueryElement.prototype.getSelector = function () {
        return this.selector;
    }

    return jQueryElement;
}(window.jQuery));

