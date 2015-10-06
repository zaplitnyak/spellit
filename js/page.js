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
    
    return BasePage;
}());

