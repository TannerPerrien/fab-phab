var $ = require('jquery');
var _ = require('underscore');

var options = ['phab_url', 'title', 'title_css', 'type', 'type_css', 'description', 'description_css'];

function save_options() {
    var data = {};
    $.each(options, function(i, val) {
        data[val] = $('#'+val).val();
    });
    chrome.storage.sync.set(data, function() {
        window.close();
    });
}

function restore_options() {
    var data = {};
    $.each(options, function(i, val) {
        data[val] = "";
    });
    chrome.storage.sync.get(data, function(items) {
        $.each(items, function(key, value) {
            $('#'+key).val(value);
        });
    });
}

function export_settings() {
    var data = {};
    $.each(options, function(i, val) {
        data[val] = $('#'+val).val();
    });
    $('#importexport').val(JSON.stringify(data));
}

function import_settings() {
    var input = $('#importexport');
    var raw = input.val();
    if (raw) {
        var data = JSON.parse(raw);
        data = _.pick(data, options);
        input.val('');
        chrome.storage.sync.set(data, restore_options);
    }
}

document.addEventListener('DOMContentLoaded', restore_options);
$('#save').click(save_options);
$('#export').click(export_settings);
$('#import').click(import_settings);
