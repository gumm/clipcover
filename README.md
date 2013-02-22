clipcover
=======

An NPM wrapper for running [Google Closure Library](http://code.google.com/closure/library/index.html) style *_test.html style tests. Code
coverage is supported via the jscoverage package. It runs [phantomjs](http://code.google.com/p/phantomjs/) as the headless browser to run the tests in.
Output is to TAP format and jscoverage's HTML coverage reports.

This is built on closure-library-phantomjs (thanks to [yo_waka](https://github.com/waka))

Building and Installing
-----------------------

```shell
npm install clipcover
```

Or grab the source

```shell
git clone https://github.com/gumm/clipcover.git
```

then cd into clipcover and

```shell
npm install
```

Requirements
------------

It is assumed that you have downloaded and installed jscoverage. To test:
```shell
jscoverage-server --version
```
Should return:
```shell
jscoverage-server 0.5.1
Character encoding support: iconv
Copyright (C) 2010 siliconforks.com
License GPLv2+: GNU GPL version 2 or later <http://siliconforks.com/jscoverage/license.html>
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.
```

PhantomJs is automatically installed and available via the npm wrapper [phantomjs](https://npmjs.org/package/phantomjs)

### Usage

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