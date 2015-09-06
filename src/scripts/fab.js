var $ = require('jquery');

function parseException() {
    var regex = /.*\.(.*)/;
    var exception = $.trim($('.stack-frames:last-of-type .stack-frame-header:last-of-type .title').text());
    var parts = regex.exec(exception);
    if (parts && parts.length == 2) {
        return parts[1];
    }
    return "";
}

function parseOrigin() {
    return $.trim($('.issue .flex-1 span:first').text());
}

function parseVersion() {
    var regex = /.*([0-9]+\.[0-9]+\.[0-9]+.*\(\d+\))/;
    var version = $.trim($('.i_header .current-details .header5').text());
    var parts = regex.exec(version);
    if (parts && parts.length === 2) {
        return parts[1];
    }
    return "";
}

function parseUrl() {
    return window.location.href;
}

function parseStacktrace() {
    $('.toggle-code').click();
    var trace = $.trim($('.raw-code').text());
    $('.toggle-code').click();
    return trace;
}

function buildContext() {
    var exception = parseException();
    var origin = parseOrigin();
    var version = parseVersion();
    var url = parseUrl();
    var stacktrace = parseStacktrace();
    return {
        exception: encodeURIComponent(exception),
        origin: encodeURIComponent(origin),
        version: encodeURIComponent(version),
        url: encodeURIComponent(url),
        stacktrace: parseStacktrace()
    };
}

function process() {
    chrome.runtime.sendMessage({
        context: buildContext()
    }, function(response) { });
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    switch (request.action) {
        case 'process':
            process();
            break;
    }
});