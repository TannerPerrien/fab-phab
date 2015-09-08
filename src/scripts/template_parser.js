var $ = require('jquery');
var handlebars = require('handlebars');

var parseTemplates = function(context, sources) {
    var templates = {};
    $.each(sources, function(key, source) {
        var template = handlebars.compile(source);
        templates[key] = template(context);
    });
    return templates;
};

window.addEventListener('message', function(event) {
  event.source.postMessage({
      context: event.data.context,
      values: parseTemplates(event.data.context, event.data.templates)
  }, event.origin);
});