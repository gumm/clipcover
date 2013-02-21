/**
 * @fileoverview A collection of plugins to interface with a coverage
 *      instrumented files.
 * @author gumm <janhendrik.badenhorst@gmail.com>
 */

var spawn = require('child_process').spawn;

/**
 * @interface
 */
function ICoverage() {}

/**
 * A method to instruct the coverage server to save reports.
 * @param {Object} page
 */
ICoverage.prototype.saveReport;

/**
 * @return {null|Object}
 */
ICoverage.prototype.startServer;

/**
 * A method to give a specific reporter to a coverage manager.
 * @param reporter
 */
ICoverage.prototype.setReporter;

/**
 * An introduction by the active coverage plugin.
 */
ICoverage.prototype.introduce;

//-----------------------------------------------------------[ Null Reporter ]--

/**
 * A null reporter. An implementation with no functionality. Allows us to
 * assign a coverage reporter, and call it as normal, without having to
 * check if it exists.
 *
 * @constructor
 * @implements {ICoverage}
 */
function NullCoverageReporter() {
    this.reporter_;
}

/**
 * @override
 */
NullCoverageReporter.prototype.saveReport = function(page) {
};

NullCoverageReporter.prototype.startServer = function() {
    return null;
};

/**
 * @override
 * @param reporter
 */
NullCoverageReporter.prototype.setReporter = function(reporter) {
    this.reporter_ = reporter;
};

/**
 * @override
 */
NullCoverageReporter.prototype.introduce = function() {
    this.reporter_.phantomDebug('No coverage reporter configured');
};


//-----------------------------------------------------[ JsCoverage Reporter ]--

/**
 * Interface with a running jscoverage server.
 *
 * @constructor
 * @implements {ICoverage}
 */
function JsCoverageReporter() {
    this.reporter_;
}

/**
 * @override
 */
JsCoverageReporter.prototype.startServer = function() {

    /**
     * Start the coverage server.
     */
    var workSpace = '/home/gumm/Workspace/smart-2.12';
    var reportDestination = workSpace + '/media/coverage/';
    var spawnArgs = [
        '--document-root=' + workSpace,
        '--ip-address=0.0.0.0',
        '--port=8080',
        '--no-instrument=/media/js/closure-library/',
        '--report-dir=' + reportDestination
    ];
    return spawn('jscoverage-server', spawnArgs);
};

/**
 * Stop the coverage server.
 */
JsCoverageReporter.prototype.stopServer = function() {
    return spawn('jscoverage-server', ['--shutdown']);
};


/**
 * @override
 * @param reporter
 */
JsCoverageReporter.prototype.setReporter = function(reporter) {
    this.reporter_ = reporter;
};

/**
 * @override
 */
JsCoverageReporter.prototype.saveReport = function(page) {
    var save = page.evaluate(function() {
        if (window.jscoverage_report) {
            jscoverage_report();
            return 'Coverage report written by jscoverage';
        } else {
            return 'No coverage report written';
        }
    });
    this.reporter_.phantomDebug(save);
};

/**
 * @override
 */
JsCoverageReporter.prototype.introduce = function() {
    var introduction = 'Now using jscoverage coverage reporter';
    this.reporter_.phantomDebug(introduction);
};

/**
 * Expose
 */
module.exports = {
    none: NullCoverageReporter,
    jscoverage: JsCoverageReporter
};