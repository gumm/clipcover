/**
 * @fileoverview The reporter of test result.
 * @author yo_waka
 */


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
//    if (results.success) {
//        buf.push(green(stats.passed + ' tests complate'));
//        buf.push(gray(' (' + stats.time + ' ms)'));
//    } else {
//        buf.push(
//                red(Symbols.NG + ' ' + stats.failed + ' of ' +
//                        (stats.passed + stats.failed) + ' tests failed'));
//        buf.push(gray(':'));
//    }
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
        buf.push(red(Symbols.NG + ' ' + this.stats_.failed + ') ' + result.name));
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
 * @param {string} file A path the the output file. This will be clobbered.
 * @param {Object} fs The filesystem module from phantomjs
 * @implements {IReporter}
 */
function TapReporter(file, fs) {

    // Clobber and create the output file on the system.
    if(fs.isFile(file)) {
        fs.remove(file);
    }
    fs.touch(file);

    /**
     * A utility function to write to the output file.
     * @param data
     */
    this.log = function(data) {
        fs.write(file, data + '\n', 'a');
    };

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
    this.log('# ' + testcase.name);
};

/**
 * @override
 */
TapReporter.prototype.writeResult = function(result) {
    this.stats_[result.success ? 'passed' : 'failed'] += 1;

    if (result.success) {
        this.log('ok ' + (++this.stats_.total) + ' ' + result.name);
    } else {
        this.log('not ok ' + (++this.stats_.total) + ' ' + result.name);
        this.log('#  ' + result.error.message);
        var errorStack = result.error.stack.split('\n');

        for (var s=0; s<errorStack.length; s++) {
            if (!!s) {
                this.log('#      ' + errorStack[s]);
            }
        }
    }
};

/**
 * @override
 */
TapReporter.prototype.phantomDebug = function(debug) {
    this.log('PHANTOM DEBUG: ' + debug);
};

/**
 * @override
 */
TapReporter.prototype.pageDebug = function(msg) {
    this.log('DEBUG: ' + msg);
};

/**
 * @override
 */
TapReporter.prototype.writeFinish = function(results) {
    var stats = this.stats_;

    this.log('1..' + stats.total);
    this.log('# tests ' + stats.total);
    this.log('# pass ' + stats.passed);
    this.log('# fail ' + stats.failed);
};


//------------------------------------------------------------[ HTML Reporter]--

/**
 * Output with spec format.
 *
 * @constructor
 * @implements {IReporter}
 */
function HtmlReporter() {
    this.stats_ = {
        passed: 0,
        failed: 0,
        time: 0,
        errors: []
    };
    console.log('');
}

/**
 * @override
 */
HtmlReporter.prototype.writeHead = function(testcase) {
    var buf = [];
    buf.push('<p>');
    buf.push('<span style="font-size: 1.2em">  ' + testcase.name + '</span>');
    console.log(buf.join(''));
};

/**
 * @override
 */
HtmlReporter.prototype.writeResult = function(result) {
    this.stats_[result.success ? 'passed' : 'failed'] += 1;
    this.stats_.time += result.time;
    result.error && this.stats_.errors.push(result.error);

    var buf = [];
    buf.push('<br>');
    if (result.success) {
        buf.push('<span style="color:green">&#149;</span> ' +
            '<span style="color:grey">' + result.name + '</span>');
    } else {
        buf.push('<span style="color:red">&#33;</span> ' +
            '<span style="color:grey">' + result.name + '</span>');
    }
    buf.push('<span style="color:grey">(' + result.time + ' ms)</span>');
    console.log(buf.join(''));
};

/**
 * @override
 */
HtmlReporter.prototype.writeFinish = function(results) {
    var stats = this.stats_;

    var buf = [];
    buf.push('<br>');
    if (results.success) {
        buf.push('<span style="color:green">&#149;' + stats.passed + ' tests complete</span>');
        buf.push('<span style="color:grey">(' + stats.time + ' ms)</span>');
    } else {
        buf.push('<span style="color:red">&#33;' + stats.failed +
            ' of ' + (stats.passed + stats.failed) + ' tests failed</span>');
        buf.push('<span style="color:grey">:</span>');
    }
    buf.push('<br>');
    buf.push('<br>');
    console.log(buf.join(''));

    buf = [];
    if (results.success) {
        buf.push('<br>');
    } else {
        stats.errors.forEach(function(err, idx) {
            buf.push((idx + 1) + ') ' + err.source + ':');
            buf.push('<span style="color:red">' + err.message + '</span>');
            err.stack.split('\n').forEach(function(s) {
                buf.push('<span style="color:grey">' + s + '</span>');
            });
        });
        buf.push('<br>');
    }
    console.log(buf.join(''));
};

/**
 * @override
 */
HtmlReporter.prototype.phantomDebug = function(debug) {
    var buf = [];
    buf.push('<br>');
    buf.push('<span style="color:cyan">&curren; ' + debug + '</span>');
    console.log(buf.join(''));
};

/**
 * @override
 */
HtmlReporter.prototype.pageDebug = function(msg) {
    var buf = [];
    buf.push('<br>');
    buf.push('<span style="color:purple">    ' + msg + '</span>');
    console.log(buf.join(''));
};



/**
 * Expose
 */
module.exports = {
    Dot: DotReporter,
    Spec: SpecReporter,
    Tap: TapReporter,
    Html: HtmlReporter
};


