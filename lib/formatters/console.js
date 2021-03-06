/*jshint evil: false, strict: false, undef: true, white: false, plusplus:false, node:true */

var path = require('path');
var _ = require('underscore');
var style = require('../colors');
var debug = process.env.DEBUG || false;

function log() {
    var args = Array.prototype.slice.call(arguments);
    args.unshift('  ');
    console.log.apply(console, args);
}

function debugLog() {
    if(debug) {
        console.log(style.orange('DEBUG'));
        var args = Array.prototype.slice.call(arguments);
        args.unshift('  ');
        console.log.apply(console, args);
    }
}

function printObject(prefix, obj) {
    var names = Object.keys(obj);
    names.forEach(function(name) {
        var value = obj[name];
        if(typeof value === 'undefined') {
            return;
        }
        log(prefix,style.bold(name),':',value);
        //replace prefix by same amount of spaces
        prefix = Array(prefix.length + 1).join(" ");
    });
}


module.exports = function(settings) {
    var trimBody_optional = (settings && settings.trimBody_optional) ? settings.trimBody_optional : null;
    //true by default
    var trimBody = (_.isNull(trimBody_optional) || _.isUndefined(trimBody_optional)) ? true : trimBody_optional.toLowerCase() === 'true';
    var startTime = 0;

    function getTrimmedBody(body) {
        var maxlen = 500;
        var shouldTrim = trimBody && !!body && body.length > maxlen;
        if(typeof body === 'string') {
            if(shouldTrim) {
                body = body.substr(0,maxlen) + '...';
            } else {
                return body;
            }
        }
        else if(Buffer.isBuffer(body)) {
            if(shouldTrim) {
                return 'binary buffer: ' + body.slice(0, maxlen).toString('hex') + '...';
            } else {
                return 'binary buffer: ' + body.toString('hex');
            }
        }
        return body;
    }

    function printRequest(req) {
        var requestDescription = _.extend({}, req.headers, {body: getTrimmedBody(req.body)});
        printObject('==>', requestDescription);
    }

    function printResponse(res) {
        var responseDescription = _.extend({status: res.statusCode}, res.headers, {body: getTrimmedBody(res.body)});
        printObject('<==', responseDescription);
    }

    function startStep(description) {
        process.stdout.write(description + ' ... ');
    }


    function endStep(success) {
        if(!success) {
            console.log(style.red(style.bold('FAILED')));
        } else {
            console.log(style.green(style.bold('OK!')));
        }
    }

    return {
        runStarted: function(testCaseCount) {
            startTime = +new Date();
        },
        testCaseStarted: function(testCase, file) {
            console.log(style.cyan("-=>"),'Running', path.basename(file));
        },
        testStarted: function(testCase, test, description, index) {
            startStep(style.yellow('    * ') + description);
        },
        testFailed: function(testCase, test, err, index) {
            endStep(false);
            process.stdout.write('   ' + err.message);
            if(typeof err.actual !== 'undefined' && typeof err.actual !== 'object' && err.expected) {
                process.stdout.write(', expected ' + err.expected + ' but got ' + err.actual);
            }
            process.stdout.write('\n');
            if(test.line) {
                var stackArray = err.stack.split("\n");
                log('have a look at', test.line);
                var outPut = "";
                for (var i =0; i <= 2; i++) {
                    outPut += stackArray[i] + "\n";
                }
                log(style.red("where: ") +  outPut);
                debugLog(err.stack);
            }
            if(debug) {
                if(err.request) {
                    printRequest(err.request);
                }
                if(err.response) {
                    printResponse(err.response);
                }
            }
        },
        testSucceeded: function(testCase, test, description, index) {
            endStep(true);
        },
        testCaseEnded: function(testCase, file, hasFailures) {},
        runEnded: function(testCaseCount, failureCount, totalTestCount) {
            if(failureCount === 0) {
                console.log(style.bold('ran ' + totalTestCount + ' tests in ' +
                        testCaseCount + ' test cases, all ran with ' +
                        style.green('SUCCESS')));
            } else {
                console.log(style.bold('ran ' + testCaseCount + ' test cases, ' + 
                        failureCount + ' of them ' + style.red('FAILED')));
            }
            console.log(style.yellow('took ' + ((+new Date() - startTime) / 1000) + ' s'));
        },
        write: function(message) {
            console.log(message);
        }
    };
};