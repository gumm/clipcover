/**
 * @fileoverview The reporter of test result.
 * @author yo_waka
 */


/**
 * Module dependencies.
 */
//var fs = require('fs');
//var system = require('system');


/**
 * Colors of console.
 *
 * @enum {string}
 */
var Colors = {
    GREEN: '\u001b[32m',
    RED: '\u001b[31m',
    GRAY: '\u001b[90m',
    BLACK: '\u001B[30m',
    YELLOW: '\u001B[33m',
    BLUE: '\u001B[34m',
    PURPLE: '\u001B[35m',
    CYAN: '\u001B[36m',
    WHITE: '\u001B[37m',
    RESET: '\u001b[0m'
};


/**
 * Symbols of console.
 * OK: (system.os.name === 'windows') ? '\u221A' : '✓',
 */
var Symbols = {
    OK: '✓',
    NG: '✖',
    PDB: '⌘',
    DOT: '.'
};

/**
 * @param {string} str .
 * @return {string} .
 */
function purple(str) {
    return Colors.PURPLE + str + Colors.RESET;
}

/**
 * @param {string} str .
 * @return {string} .
 */
function cyan(str) {
    return Colors.CYAN + str + Colors.RESET;
}

/**
 * @param {string} str .
 * @return {string} .
 */
function green(str) {
    return Colors.GREEN + str + Colors.RESET;
}

/**
 * @param {string} str .
 * @return {string} .
 */
function red(str) {
    return Colors.RED + str + Colors.RESET;
}

/**
 * @param {string} str .
 * @return {string} .
 */
function gray(str) {
    return Colors.GRAY + str + Colors.RESET;
}


/**
 * @interface
 */
function IReporter() {}

/**
 * @param {Object} testcase .
 */
IReporter.prototype.writeHead;

/**
 * @param {Object} result .
 */
IReporter.prototype.writeResult;

/**
 * @param {Object} results .
 */
IReporter.prototype.writeFinish;

/**
 * @param {Object} debug .
 */
IReporter.prototype.phantomDebug;

/**
 * @param {Object} msg .
 */
IReporter.prototype.pageDebug;


/**
 * Output with dot format.
 *
 * @constructor
 * @implements {IReporter}
 */
function DotReporter() {
    this.stats_ = {
        passed: 0,
        failed: 0,
        time: 0,
        errors: []
    };
    console.log('');
}

/**
 * @type {Object}
 * @private
 */
DotReporter.prototype.stats_;

/**
 * @override
 */
DotReporter.prototype.writeHead = function(testcase) {
};

/**
 * @override
 */
DotReporter.prototype.writeResult = function(result) {
    this.stats_[result.success ? 'passed' : 'failed'] += 1;
    this.stats_.time += result.time;
    result.error && this.stats_.errors.push(result.error);

    if (result.success) {
        console.log(gray(Symbols.DOT));
    } else {
        console.log(red(Symbols.DOT));
    }
};

/**
 * @override
 */
DotReporter.prototype.phantomDebug = function(debug) {
};

/**
 * @override
 */
DotReporter.prototype.pageDebug = function(msg) {
};

/**
 * @override
 */
DotReporter.prototype.writeFinish = function(results) {
    var stats = this.stats_;

    var buf = [];
    buf.push('  ');
    if (results.success) {
        buf.push(green(stats.passed + ' tests complate'));
        buf.push(gray(' (' + stats.time + ' ms)'));
    } else {
        buf.push(
                red(Symbols.NG + ' ' + stats.failed + ' of ' +
                        (stats.passed + stats.failed) + ' tests failed'));
        buf.push(gray(':'));
    }
    console.log('');
    console.log('');
    console.log(buf.join(''));
    console.log('');

    if (results.success) {
        console.log('');
    } else {
        stats.errors.forEach(function(err, idx) {
            console.log('  ' + (idx + 1) + ') ' + err.source + ':');
            console.log('     ' + red(err.message));
            err.stack.split('\n').forEach(function(s) {
                console.log('      ' + gray(s));
            });
        });
        console.log('');
    }
};


/**
 * Output with spec format.
 *
 * @constructor
 * @implements {IReporter}
 */
function SpecReporter() {
    this.stats_ = {
        passed: 0,
        failed: 0,
        time: 0,
        errors: []
    };
    console.log('');
}

/**
 * @type {Object}
 * @private
 */
SpecReporter.prototype.stats_;

/**
 * @override
 */
SpecReporter.prototype.writeHead = function(testcase) {
    console.log('');
    console.log('  ' + testcase.name);
};

/**
 * @override
 */
SpecReporter.prototype.writeResult = function(result) {
    this.stats_[result.success ? 'passed' : 'failed'] += 1;
    this.stats_.time += result.time;
    result.error && this.stats_.errors.push(result.error);

    var buf = [];
    buf.push('    ');
    if (result.success) {
        buf.push(green(Symbols.OK) + ' ' + gray(result.name));
    } else {
        buf.push(red(this.stats_.failed + ') ' + result.name));
    }
    buf.push(gray(' (' + result.time + ' ms)'));

    console.log(buf.join(''));
};

/**
 * @override
 */
SpecReporter.prototype.writeFinish = function(results) {
    var stats = this.stats_;

    var buf = [];
    buf.push('  ');
    if (results.success) {
        buf.push(green(stats.passed + ' tests complate'));
        buf.push(gray(' (' + stats.time + ' ms)'));
    } else {
        buf.push(
                red(Symbols.NG + ' ' + stats.failed + ' of ' +
                        (stats.passed + stats.failed) + ' tests failed'));
        buf.push(gray(':'));
    }
    console.log('');
    console.log('');
    console.log(buf.join(''));
    console.log('');

    if (results.success) {
        console.log('');
    } else {
        stats.errors.forEach(function(err, idx) {
            console.log('  ' + (idx + 1) + ') ' + err.source + ':');
            console.log('     ' + red(err.message));
            err.stack.split('\n').forEach(function(s) {
                console.log('      ' + gray(s));
            });
        });
        console.log('');
    }
};

/**
 * @override
 */
SpecReporter.prototype.phantomDebug = function(debug) {
    var buf = [];
    buf.push('  ');
    buf.push(cyan(Symbols.PDB) + ' ' + cyan(debug));
    console.log(buf.join(''));
};

/**
 * @override
 */
SpecReporter.prototype.pageDebug = function(msg) {
    var buf = [];
    buf.push('    ');
    buf.push(purple(msg));
    console.log(buf.join(''));
};

/**
 * Output with TAP format.
 *
 * @constructor
 * @implements {IReporter}
 */
function TapReporter() {
    this.stats_ = {
        total: 0,
        passed: 0,
        failed: 0
    };
}

/**
 * @type {Object}
 * @private
 */
TapReporter.prototype.stats_;

/**
 * @override
 */
TapReporter.prototype.writeHead = function(testcase) {
    console.log('# ' + testcase.name);
};

/**
 * @override
 */
TapReporter.prototype.writeResult = function(result) {
    this.stats_[result.success ? 'passed' : 'failed'] += 1;

    if (result.success) {
        console.log('ok ' + (++this.stats_.total) + ' ' + result.name);
    } else {
        console.log('not ok ' + (++this.stats_.total) + ' ' + result.name);
        console.log('  ' + result.error.message);
        result.error.stack.split('\n').forEach(function(s) {
            if (!!s) {
                console.log('      ' + s);
            }
        });
    }
};

/**
 * @override
 */
TapReporter.prototype.phantomDebug = function(debug) {
    console.log('PHANTOM DEBUG: ' + debug);
};

/**
 * @override
 */
TapReporter.prototype.pageDebug = function(msg) {
    console.log('DEBUG: ' + msg);
};

/**
 * @override
 */
TapReporter.prototype.writeFinish = function(results) {
    var stats = this.stats_;

    console.log('1..' + stats.total);
    console.log('# tests ' + stats.total);
    console.log('# pass ' + stats.passed);
    console.log('# fail ' + stats.failed);
};


/**
 * Expose
 */
module.exports = {
    Dot: DotReporter,
    Spec: SpecReporter,
    Tap: TapReporter
};
