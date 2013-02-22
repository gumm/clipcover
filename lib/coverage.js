/**
 * @fileoverview A collection of plugins to interface with a coverage
 *      instrumented files.
 * @author gumm <janhendrik.badenhorst@gmail.com>
 */

/**
 * @interface
 */
function ICoverage() {}

/**
 * @return {null|Object}
 */
ICoverage.prototype.start;

/**
 * @return {null|Object}
 */
ICoverage.prototype.stop;

/**
 * @param {Object} page
 */
ICoverage.prototype.report;



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
}

/**
 * @override
 */
NullCoverageReporter.prototype.start = function() {
    return null;
};

/**
 * @override
 */
NullCoverageReporter.prototype.stop = function() {
    return null;
};

/**
 * @override
 */
NullCoverageReporter.prototype.save = function() {
};


//-----------------------------------------------------[ JsCoverage Reporter ]--

/**
 * Interface with a running jscoverage server.
 *
 * @constructor
 * @implements {ICoverage}
 */
function JsCoverageReporter() {
}

/**
 * @override
 */
JsCoverageReporter.prototype.start = function(spawn, spawnArgs) {

    /**
     * Start the coverage server.
     */
    return spawn('jscoverage-server', spawnArgs);
};

/**
 * Stop the coverage server.
 */
JsCoverageReporter.prototype.stop = function(spawn) {
    return spawn('jscoverage-server', ['--shutdown']);
};

/**
 * @override
 */
JsCoverageReporter.prototype.save = function(page) {
    var save = page.evaluate(function() {
        if (window.jscoverage_report) {
            jscoverage_report();
            return 'Coverage report written by jscoverage';
        } else {
            return 'No coverage report written';
        }
    });
    return save;
};

/**
 * Expose
 */
module.exports = {
    none: NullCoverageReporter,
    jscoverage: JsCoverageReporter
};