/* jshint ignore:start */
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
/* jshint ignore:end */

ga('create', 'UA-67525326-1', 'auto');
ga('set', 'checkProtocolTask', null); // Disable file protocol checking. - http://stackoverflow.com/questions/16135000/how-do-you-integrate-universal-analytics-in-to-chrome-extensions


module.exports = {
    trackPageview: function () {
        ga('send', 'pageview');
    },
    trackEvent: function(c, a, l, v, config) {
        ga('send', 'event', c, a, l, v, config);
    }
};