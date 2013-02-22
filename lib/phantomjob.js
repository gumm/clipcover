/**
 * Module dependencies.
 * These are PhantomJS modules - not Node.js modules.
 */
var system = require('system');
var page = require('webpage').create();
var reportPlugin = require('./reporters');
var coveragePlugin = require('./coverage');
var write = new reportPlugin.Spec();

/**
 * Constants.
 */
var config = {};

/**
 * Access to the coverage plugin.
 * Note: This is a different instance of the object that is used by node.
 *      This instance does not have the ability to start and stop the coverage
 *      server. It can only write reports.
 * @type {coveragePlugin.jscoverage}
 */
var coverage = new coveragePlugin.jscoverage();

/**
 * Set up some basic page parameters.
 */
var pageSetup = function() {
    for(var key in config) {
        if (config.hasOwnProperty(key)) {
            switch(key) {
                case 'cookies':
                    page.addCookie(config[key]);
                    break;
                case 'headers':
                    page.customHeaders = config[key];
                    break;
                case 'settings':
                    page.settings = config[key];
                    break;
                case 'viewport':
                    page.viewportSize = config[key];
                    break;
                default:
                    write.phantomDebug('No match for key');
            }
        }
    }
};
pageSetup();

/**
 * Handle calls from the page to PhantomJs.
 * The injected Closure Library Adapter introduces such calls in some
 * of the test runner code.
 * @param obj
 * @returns {string}
 */
page.onCallback = function(obj) {
    var type = obj.type;
    var data = obj.data;

    switch (type) {
        case 'head':
            write.writeHead(data);
            break;
        case 'success':
        case 'failure':
            write.writeResult(data);
            break;
        case 'debug':
            write.phantomDebug(data);
            break;
        case 'finish':
            write.writeFinish(data);
            var reportResult = coverage.save(page);
            write.phantomDebug('Report result: ' + reportResult);
            clearTimeout(waitTimer);
            phantom.exit(0);
            break;
        default:
            console.log('No match for: ' + type);
    }
    return 'Accepted';
};

/**
 * Route "console.log" calls from within the Page context
 * to the PhantomJS context
 * @param msg
 */
page.onConsoleMessage = function(msg) {
    write.pageDebug(msg);
};

/**
 * Exit when an error occurred.
 * @param {string} msg .
 * @param {Array.<string>} trace .
 */
page.onError = function exitOnError(msg, trace) {
    var msgStack = ['ERROR: ' + msg];
    if (trace) {
        msgStack.push('TRACE:');
        trace.forEach(function(t) {
            msgStack.push(' -> ' + (t.file || t.sourceURL) + ': ' + t.line +
                    (t.function ? ' (in function ' + t.function + ')' : ''));
        });
    }
    console.log(msgStack.join('\n'));
    phantom.exit(1);
};

/**
 * Inject adapter.js into the page.
 */
page.onInitialized = function() {
    page.injectJs('./adapter.js');
};

/**
 * The phantom process is a child of the main node process.
 * Timeouts are managed in the main node job. Not here.
 */
var testPath = 'http:0.0.0.0:8080/media/js/trin/tests/all_tests.html';
var waitTimer = null;
page.open(testPath, function(status) {
    if (status === 'success') {
        write.phantomDebug('Testpage Opened: ' + page.url);
    } else {
        console.log('phantomjs: Unable to load page. [' + testPath + ']');
        phantom.exit(1);
    }
});