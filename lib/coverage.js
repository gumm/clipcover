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
JsCoverageReporter.prototype.stop = function(config, exitCallback) {
    var callback = function(){
        config.write.phantomDebug('Phantom stopped.');
        exitCallback();
    };

//    var copyFiles = function(old, replacement, callback) {
//        var writeStream = config.fs.createWriteStream(old, {flags : 'w'});
//        writeStream.on('close', function () {
//            callback();
//        });
//        var readStream = config.fs.createReadStream(replacement);
//        readStream.pipe(writeStream);
//    };
//
//    var prettifyCSS = function(maybeExit) {
//
//        // Replace CSS in the report directory.
//        var oldBasicCss = config.path.join(
//                config.reportDir, 'jscoverage.css'
//        );
//        var newBasicCss = config.path.join(
//                __dirname, '../lib/jscoverage.css'
//        );
//        copyFiles(oldBasicCss, newBasicCss, maybeExit);
//
//        // Replace CSS in the report directory.
//        var newCodeColCss = config.path.join(
//                __dirname, '../lib/jscoverage-highlight.css'
//        );
//        var oldCodeColCss = config.path.join(
//                config.reportDir, 'jscoverage-highlight.css'
//        );
//        copyFiles(oldCodeColCss, newCodeColCss, maybeExit);
//    };

    if (exitCallback) {
        config.write.phantomDebug('Server stopped.');
        config.spawn('jscoverage-server', ['--shutdown']);
        callback();
    } else {
        config.spawn('jscoverage-server', ['--shutdown']);
    }

};

/**
 * @override
 */
JsCoverageReporter.prototype.save = function(page) {

    page.evaluate(function() {

        /**
         * A helper function culled from the adapter.
         * Sends events to phantomjs.
         * @param type
         * @param data
         */
        function sendToPhantomJS(type, data) {
            if (typeof window.callPhantom === 'function') {
                var state = window.callPhantom({
                    'type': type,
                    'data': data
                });
                if (state !== 'Accepted') {
                    throw Error('Can not send data to PhantomJS object');
                }
            } else {
                throw Error('window.callPhantom has not exist');
            }
        }

        if (window.jscoverage_report) {
            jscoverage_report();
            sendToPhantomJS('close', 'Coverage report written by jscoverage');
        } else {
            sendToPhantomJS('close', 'No coverage report written');
        }
    });
};

/**
 * Expose
 */
module.exports = {
    none: NullCoverageReporter,
    jscoverage: JsCoverageReporter
};