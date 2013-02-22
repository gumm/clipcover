# Clipcover #

A NPM wrapper for running [Google Closure Library](http://code.google.com/closure/library/index.html) style *_test.html style tests.
Code coverage reporting provided by a [JSCoverage](http://siliconforks.com/jscoverage/) server instance, and tests via a headless [PhantomJS](http://code.google.com/p/phantomjs/) browser.

Test result output is in TAP format and JSCoverage's HTML coverage reports.
Clipcover is built on the excelent work in [closure-library-phantomjs](https://github.com/waka/closure-library-phantomjs) (thanks to [yo_waka](https://github.com/waka))

## Installing ##
Clipcover is packaged as a Node module, and is available via:

```shell
npm install clipcover
```

Or if you prefer the source:

```shell
git clone https://github.com/gumm/clipcover.git
```
Once downloaded, you can get the required dependant packages via:

```shell
npm install
```
This will install PhantomJS as a node module.

## Requirements ##
Clipcover requires on JSCoverage to be installed by hand. For instructions please visit their [download page](http://siliconforks.com/jscoverage/download.html).

Once installed, you can test it with:
```shell
jscoverage-server --version
```
Should return:
```shell
jscoverage-server 0.5.1
Character encoding support: iconv
Copyright (C) 2010 siliconforks.com
License GPLv2+: GNU GPL version 2 or later (http://siliconforks.com/jscoverage/license.html)
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.
```

PhantomJs is automatically installed and available via the npm wrapper [phantomjs](https://npmjs.org/package/phantomjs)

## Usage ##

Clipcover is intended to be run from the command line. When run, it:
 1. spawns an instrumenting web server to serve the HTML test files
 2. spawns a headless browser to provide the environment for the tests to run in
 3. collects test results from the browser
 4. collects coverage results from the server
 5. on compleation of the test run, it closes the browser, closes the server, and stores the reports.

#### Command-line Options ####
This means there is a bit of setup to be done. The easiest way was to pass Clipcover a single
working directory as an entry point. This will be used as the root of the web server as well, and all files that
you want to test, should be available below this point.

`clipcover ~/Workspace/myClosureProject/`

From this entry point two command line flags control the input. Both these paths are *relative* to the given workspace.
Supported command-line options are:
 * `--test-file` or `-f`  A *relative* path the HTML test entry point. [/media/js/tests/all_tests.html]
 * `--ignore` or `-i`     A *relative* path to a directory to be excluded from coverage reports. [/media/js/closure-library/]

Clipcover also needs to know where you want the reports written to. This path is *not* relative, and can be anywhere
on the filesystem. Coverage reports in HTML format will be written to this directory. The TAP output file will also
be located here. Below are examples of the CLI relevant CLI flags:
 * `--report-dir` or `-r` An *absolute* system path to a directory where the reports will be written. [/tmp/reports/output/]
 * `--output-file` or `-o` A name of the TAP report file. Will be written to the directory specified by `--report-dir` [tap.txt]

The server that Clipcover starts needs an IP address and port number. The following flags are used to specify those:
 * `--server-ip-address` or `-s` This is the number part of the address *only* [0.0.0.0]
 * `--server-port` or `-p` The number of the port on which the server will run [8080]
Taken together, these flags (or rather the defaults of these flags) produce a server that is accessable
by pointing your browser to http://0.0.0.0:8080/

For a bit of housekeeping, Clipcover can be given a limited time to run in. This is the maximum time that both the
PhantomJS browser and the JSCover server will be kept alive.
 * `--timeout` or `-t` Is the maximum time - in milliseconds - that the servie will be kept alive. [600000] (10min)

For help
 * `--help` or `-h` Gives remiders of the available CLI flags


```shell
-h, --help                         output usage information
-V, --version                      output the version number
-f, --test-file <path>             relative path from workspace to test file [/media/js/trin/tests/all_tests.html]
-i, --ignore-dir <path>            relative path from workspace, nothing here will be instrumented [/media/js/closure-library/]
-t, --timeout <milliseconds>       maximum time phantomjs will be kept alive [600000]
-s, --server-ip-address <address>  coverage server ip address [0.0.0.0]
-p, --server-port <port>           coverage server port [8080]
-r, --report-dir <path>            absolute path to dir where reports will be written [/tmp/reports/]
-o, --output-file <path>           name of test result output file to be written in report dir [result.txt]
```
