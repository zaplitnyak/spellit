var BasePage = (function(){
    /**
     * Constructor
     */
    function BasePage(){
    }

    /**
     * Truncate text
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

