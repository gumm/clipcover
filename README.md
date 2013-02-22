# Clipcover #

An NPM wrapper for running [Google Closure Library](http://code.google.com/closure/library/index.html) style *_test.html style tests.
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

#### Controlling the Input ####
This means there is a bit of setup to be done. The easiest way was to pass Clipcover a single
working directory as an entry point. This will be used as the root of the web server as well, and all files that
you want to test, should be available below this point.

> clipcover ~/Workspace/myClosureProject/

From this entry point two command line flags control the input. Both these paths are *relative* to the given workspace.
> -f /media/js/tests/all_tests.html 

> -i /media/js/closure-library/
 
Clipcover also needs to know where you want the reports written to. This path is *not* relative, and can be anywhere
on the filesystem. Coverage reports in HTML format will be written to this directory. The TAP output file will also
be located here. Below are examples of the CLI relevant CLI flags:
> -r /tmp/reports/output/

> -o tap.txt




Usage: clipcover [options] workspace <path to project root>

  Options:

    -h, --help                         output usage information
    -V, --version                      output the version number
    -f, --test-file <path>             relative path from workspace to test file [/media/js/trin/tests/all_tests.html]
    -i, --ignore-dir <path>            relative path from workspace, nothing here will be instrumented [/media/js/closure-library/]
    -t, --timeout <milliseconds>       maximum time phantomjs will be kept alive [600000]
    -s, --server-ip-address <address>  coverage server ip address [0.0.0.0]
    -p, --server-port <port>           coverage server port [8080]
    -r, --report-dir <path>            absolute path to dir where reports will be written [/tmp/reports/]
    -o, --output-file <path>           name of test result output file to be written in report dir [result.txt]
