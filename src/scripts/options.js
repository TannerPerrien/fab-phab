var $ = require('jquery');
var _ = require('underscore');
var analytics = require('./analytics.js');

var options = ['phabUrl', 'title', 'titleCss', 'type', 'typeCss', 'description', 'descriptionCss'];

var saveOptions = function() {
    analytics.trackEvent('options', 'save', null, null, {useBeacon: true});
    var data = {};
    $.each(options, function(i, val) {
        data[val] = $('#'+val).val();
    });
    chrome.storage.sync.set(data, function() {
        window.close();
    });
};

var restoreOptions = function() {
    analytics.trackEvent('options', 'restore');
    var data = {};
    $.each(options, function(i, val) {
        data[val] = "";
    });
    chrome.storage.sync.get(data, function(items) {
        $.each(items, function(key, value) {
            $('#'+key).val(value);
        });
    });
};

var exportSettings = function() {
    analytics.trackEvent('options', 'export');
    var data = {};
    $.each(options, function(i, val) {
        data[val] = $('#'+val).val();
    });
    $('#importexport').val(JSON.stringify(data));
};

var importSettings = function() {
    analytics.trackEvent('options', 'import');
    var input = $('#importexport');
    var raw = input.val();
    if (raw) {
        var data = JSON.parse(raw);
        data = _.pick(data, options);
        input.val('');
        chrome.storage.sync.set(data, restoreOptions);
    }
};

document.addEventListener('DOMContentLoaded', restoreOptions);
$('#save').click(saveOptions);
$('#export').click(exportSettings);
$('#import').click(importSettings);

analytics.trackPageview();