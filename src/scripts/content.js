var $ = require('jquery');
var handlebars = require('handlebars');

function parseException() {
    var regex = /.*\.(.*)/;
    var exception = $.trim($('.stack-frames:last-of-type .stack-frame-header:last-of-type .title').text());
    var parts = regex.exec(exception);
    return parts.length === 2 ? parts[1] : "";
}

function parseOrigin() {
    return $.trim($('.issue .flex-1 span:first').text());
}

function parseVersion() {
    var regex = /.*([0-9]+\.[0-9]+\.[0-9]+.*\(\d+\))/;
    var version = $.trim($('.i_header .current-details .header5').text());
    var parts = regex.exec(version);
    return parts.length === 2 ? parts[1] : "";
}

function parseUrl() {
    return window.location.href;
}

function parseStacktrace() {
    $('.toggle-code').click();
    return $.trim($('.raw-code').text());
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
        stacktrace: "" // Passing the stack trace results in: HTTP Error 414 Request URI too long
    };
}

function formatUrl(context, url) {
    var template = handlebars.compile(url);
    return template(context);
}

chrome.storage.sync.get({
    phab_url: null
}, function(items) {
    var phab_url = items.phab_url;
    if (phab_url) {
        var context = buildContext();
        var url = formatUrl(context, phab_url);
        window.open(url, '_blank');
    }
});