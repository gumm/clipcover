/**
 * Module dependencies.
 * These are PhantomJS modules - not Node.js modules.
 */
var system = require('system');
var fs = require('fs');
var args = require('system').args;
var page = require('webpage').create();
var reportPlugin = require('./reporters');
var coveragePlugin = require('./coverage');

/**
 * Configuration.
 * @type {{testTarget: *}}
 */
var config = {
    testTarget: args[1],
    outputFile: args[2]
};

/**
 * A console writer.
 * @type {reportPlugin.Spec}
 */
var spec = new reportPlugin.Spec();

/**
 * A output file writer.
 * @type {reportPlugin.Tap}
 */
var tap = new reportPlugin.Tap(fs, config.outputFile);

/**
 * Access to the coverage plugin.
 * Note: This is a different instance of the object that is used by node.
 *      This instance does not have the ability to start and stop the coverage
 *      server. It can only write reports.
 * @type {coveragePlugin.jscoverage}
 */
var coverage = new coveragePlugin.jscoverage();

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
            spec.writeHead(data);
            tap.writeHead(data);
            break;
        case 'success':
        case 'failure':
            spec.writeResult(data);
            tap.writeResult(data);
            break;
        case 'debug':
            spec.phantomDebug(data);
            tap.phantomDebug(data);
            break;
        case 'finish':
            coverage.save(page);
            spec.writeFinish(data);
            tap.writeFinish(data);
            break;
        case 'close':
            spec.phantomDebug('Report result: ' + data);
            phantom.exit(0);
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
    spec.pageDebug(msg);
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
page.open(config.testTarget, function(status) {
    if (status === 'success') {
        spec.phantomDebug('Testpage Opened: ' + page.url);
    } else {
        console.log('phantomjs: Unable to load page. [' + testPath + ']');
        phantom.exit(1);
    }
});