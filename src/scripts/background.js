var $ = require('jquery');
var analytics = require('./analytics.js');

var fabCrashIdRegex = /^https:\/\/(www\.)?fabric.io\/.*\/(\w+)$/;
var injectTabMap = {};
var tabDataMap = {};

var processFab = function(response) {
    if (!response.context) {
        console.log("No context");
        return;
    }

    var fabContext = {};
    $.each(response.context, function(key, val) {
        fabContext[key] = decodeURIComponent(val);
    });
    
    chrome.storage.sync.get(null, function(items) {
        var iframe = $('#template_parser')[0];
        var message = {
            context: fabContext,
            templates: items
        };
        iframe.contentWindow.postMessage(message, '*');
    });
};

chrome.tabs.onUpdated.addListener(function(id, info, tab) {
    var fabParts = fabCrashIdRegex.exec(tab.url);
    if (fabParts && fabParts.length > 2 && fabParts[2]) {
        analytics.trackEvent('pageAction', 'show');
        chrome.pageAction.show(id);
        delete injectTabMap[id];
    } else if (tabDataMap[id]) {
        var data = tabDataMap[id];
        delete tabDataMap[id];
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
        phabUrl: null
    }, function(items) {
        var phabUrl = items.phabUrl;
        if (phabUrl && phabUrl.length > 0) {
            chrome.permissions.request({
                permissions: ['tabs'],
                origins: [phabUrl]
            }, function(granted) {
                if (granted) {
                    analytics.trackEvent('pageAction', 'click');
                    if (injectTabMap[tab.id]) {
                        chrome.tabs.sendMessage(tab.id, { action: 'process'}, processFab);
                    } else {
                        chrome.tabs.executeScript(tab.id, {
                            file: "scripts/fab.js"
                        }, function() {
                            injectTabMap[tab.id] = 1;
                            chrome.tabs.sendMessage(tab.id, { action: 'process'}, processFab);
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

window.addEventListener('message', function(event) {
    if (event.data.values) {
        chrome.tabs.create({
            url: event.data.values.phabUrl
        }, function(tab) {
            tabDataMap[tab.id] = {
                values: event.data.values
            };
        });
    }
});

analytics.trackPageview();
