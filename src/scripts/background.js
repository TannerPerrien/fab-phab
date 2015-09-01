var crashIdRegex = /^https:\/\/(www\.)?fabric.io\/.*\/(\w+)$/;

chrome.tabs.onUpdated.addListener(function(id, info, tab) {
    var regexParts = crashIdRegex.exec(tab.url);
    // console.log(regexParts);
    if (regexParts && regexParts.length > 2 && regexParts[2]) {
        chrome.pageAction.show(tab.id);
    }
});

chrome.pageAction.onClicked.addListener(function(tab){
    chrome.storage.sync.get({
        phab_url: null
    }, function(items) {
        var url = items.phab_url;
        if (url && url.length > 0) {
            chrome.tabs.executeScript(null, {
                file: "scripts/content.js"
            });
        } else {
            chrome.runtime.openOptionsPage();
        }
    });
});