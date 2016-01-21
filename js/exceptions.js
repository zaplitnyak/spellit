/**
 * Exceptions classes file
 * Here collected all possible exceptions and their general handlers
 */

var CommonException = (function () {
    var self, message, name;

    function CommonException(message, name) {
        self = this;
        self.message = message;
        self.name = (name !== undefined) ? name : CommonException.name;
    }

    CommonException.prototype.toString = function () {
        return self.name + ": " + self.message;
    }

    return CommonException;
}());

var jQueryException = (function () {
    jQueryException.prototype = new CommonException();

    function jQueryException(message) {
        CommonException.apply(this, [message, jQueryException.name]);
    }

    return jQueryException;
}());

var NullException = (function () {
    NullException.prototype = new CommonException();

    function NullException(message) {
        CommonException.apply(this, [message, NullException.name]);
    }

    return NullException;
}());

var ChromeStorageException = (function () {
    ChromeStorageException.prototype = new CommonException();

    function ChromeStorageException(message) {
        CommonException.apply(this, [message, ChromeStorageException.name]);
    }

    return ChromeStorageException;
}());
