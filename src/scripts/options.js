function save_options() {
    var phab_url = document.getElementById('phab_url').value;
    chrome.storage.sync.set({
        phab_url: phab_url
    }, function() {
        window.close();
    });
}

function restore_options() {
    chrome.storage.sync.get({
        phab_url: ""
    }, function(items) {
        document.getElementById('phab_url').value = items.phab_url;
    });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);