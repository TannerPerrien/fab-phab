var $ = require('jquery');

var fab_crash_id_regex = /^https:\/\/(www\.)?fabric.io\/.*\/(\w+)$/;
var inject_tab_map = {};
var data_tab_map = {};

chrome.tabs.onUpdated.addListener(function(id, info, tab) {
    var fab_parts = fab_crash_id_regex.exec(tab.url);
    if (fab_parts && fab_parts.length > 2 && fab_parts[2]) {
        chrome.pageAction.show(id);
        delete inject_tab_map[id];
    } else if (data_tab_map[id]) {
        var data = data_tab_map[id];
        delete data_tab_map[id];
        chrome.storage.sync.get(null, function(items) {
            chrome.tabs.executeScript(id, {
                file: "scripts/phab.js"
            }, function() {
                chrome.tabs.sendMessage(id, $.extend({}, data, {options: items}), function(response) {});
            });
        });
    }
});

chrome.pageAction.onClicked.addListener(function(tab){
    chrome.storage.sync.get({
        phab_url: null
    }, function(items) {
        var phab_url = items.phab_url;
        if (phab_url && phab_url.length > 0) {
            chrome.permissions.request({
                permissions: ['tabs'],
                origins: [phab_url]
            }, function(granted) {
                if (granted) {
                    if (inject_tab_map[tab.id]) {
                        chrome.tabs.sendMessage(tab.id, { action: 'process'}, function(response) {});
                    } else {
                        chrome.tabs.executeScript(tab.id, {
                            file: "scripts/fab.js"
                        }, function() {
                            inject_tab_map[tab.id] = 1;
                            chrome.tabs.sendMessage(tab.id, { action: 'process'}, function(response) {});
                        });
                    }
                } else {
                    chrome.runtime.openOptionsPage();
                }
            });
        } else {
            chrome.runtime.openOptionsPage();
        }
    });
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (!request.context) {
        console.log("No context");
    }

    var fab_context = {};
    $.each(request.context, function(key, val) {
        fab_context[key] = decodeURIComponent(val);
    });
    
    chrome.storage.sync.get(null, function(items) {
        var iframe = $('#template_parser')[0];
        var message = {
            context: fab_context,
            templates: items
        };
        iframe.contentWindow.postMessage(message, '*');
    });
    sendResponse();
});

window.addEventListener('message', function(event) {
    if (event.data.values) {
        chrome.tabs.create({
            url: event.data.values.phab_url
        }, function(tab) {
            data_tab_map[tab.id] = {
                values: event.data.values
            };
        });
    }
});