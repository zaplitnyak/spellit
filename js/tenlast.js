;(function($) {
    var recentVoices = [];
    $(function() {
        chrome.storage.sync.get("recentVoices", function (data) {
            if (chrome.runtime.lastError) {
                /* TODO: сделать глобальный обработчик ошибаг */
                return;
            }
            var recentVoices = (Object.keys(data).length) ? data.recentVoices : [];
            populateRecentList(recentVoices);
        })

    });

    $(document).on("click", ".recentVoiceLink", function (event) {
        event.preventDefault();

        var index = $(this).data("index");
        window.location = "/popup.html?text=" + encodeURIComponent(recentVoices[index]);
    });

    $("#back-button").click(function () {
        window.history.back();
    });

    function populateRecentList(data) {
        recentVoices = data;
        var $list = $("#recent-list"),
            listValues = [];

        if (!recentVoices.length) {
            listValues = "Тут очень пуcто;(";
        }
        for (var i in recentVoices) {
            var $link = $("<a class=\"list-group-item recentVoiceLink\" href=\"#\" data-index=\"" + i + "\"/>");
            $link.text(truncate(recentVoices[i], 40));
            listValues.push($link);
        }
        $list.append(listValues);
    }

    function truncate(text, length, placeholder) {
            placeholder = (typeof placeholder === 'undefined') ? '...' : placeholder;
            var result = text.substring(0, length);
            result += (text.length > length) ? placeholder : '';

            return result;
    }

})(window.jQuery);
