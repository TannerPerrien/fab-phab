var $ = require('jquery');

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (!request.context) {
        console.log("No context");
    }

    // Set text inputs
    var options = request.options;
    $.each(request.values, function(key, val) {
        var css_key = key + "_css";
        if (options[css_key]) {
            var input = $(options[css_key]);
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