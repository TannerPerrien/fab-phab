var $ = require('jquery');

var CSS_SUFFIX = "Css";

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (!request.context) {
        console.log("No context");
    }

    // Set text inputs
    var options = request.options;
    $.each(request.values, function(key, val) {
        var cssKey = key + CSS_SUFFIX;
        if (options[cssKey]) {
            var input = $(options[cssKey]);
            if (input.is('select')) {
                input.find('option').filter(function() {
                    return ($(this).text().toLowerCase() == val.toLowerCase());
                }).prop('selected', true);
            } else {
                input.val(val);
            }
        }
    });
});