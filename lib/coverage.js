
var childProcess = require('child_process');
var reportPlugin = require('../lib/reporters');
var write = new reportPlugin.Spec();



function jsCoverageReporter() {
}

/**
 * @override
 */
jsCoverageReporter.prototype.start = function(spawnArgs) {

    /**
     * Start the coverage server.
     */

    return childProcess.exec('jscoverage-server ' + spawnArgs.join(' '),
        function (error, stdout, stderr) {
            write.pageDebug(stdout);
            write.phantomDebug(stderr);
            if (error !== null) {
                write.phantomDebug(error);
            }
        });
};

/**
 * Stop the coverage server.
 */
jsCoverageReporter.prototype.stop = function(exitCallback) {
    var callback = function(){
        write.phantomDebug('Phantom stopped.');
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
        write.phantomDebug('Server stopped.');
        childProcess.exec('jscoverage-server --shutdown');
        callback();
    } else {
        childProcess.exec('jscoverage-server --shutdown');
    }

};

/**
 * @override
 */
jsCoverageReporter.prototype.save = function(page) {

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

exports.jsCoverageReporter = jsCoverageReporter;