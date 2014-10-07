var _ = require("underscore");
module.exports = function() {
    return {
        init: function(formatters, settings) {
            var logWrapper = {};
            if(formatters.length === 1) {
                return require(formatters[0])(settings);
            } else {
                var loggers = _.map(formatters, function(formatter) {
                    return require(formatter)(settings);
                });
                return {
                    runStarted: function() {
                        var boundArguments = arguments;
                        loggers.forEach(function(logger) {
                            logger.runStarted.apply(logger, boundArguments);
                        });
                    },
                    testCaseStarted: function() {
                        var boundArguments = arguments;
                        loggers.forEach(function(logger) {
                            logger.testCaseStarted.apply(logger, boundArguments);
                        });
                    },
                    testStarted: function(context) {
                        var boundArguments = arguments;
                        loggers.forEach(function(logger) {
                            logger.testStarted.apply(logger, boundArguments);
                        });
                    },
                    testFailed: function() {
                        var boundArguments = arguments;
                        _.forEach(loggers, function(logger) {
                            logger.testFailed.apply(logger, boundArguments);
                        });
                    },
                    testSucceeded: function() {
                        var boundArguments = arguments;
                        loggers.forEach(function(logger) {
                            logger.testSucceeded.apply(logger, boundArguments);
                        });
                    },
                    testCaseEnded: function() {
                        var boundArguments = arguments;
                        loggers.forEach(function(logger) {
                            logger.testCaseEnded.apply(logger, boundArguments);
                        });
                    },
                    runEnded: function() {
                        var boundArguments = arguments;
                        loggers.forEach(function(logger) {
                            logger.runEnded.apply(logger, boundArguments);
                        });
                    },
                    write: function() {
                        var boundArguments = arguments;
                        loggers.forEach(function(logger) {
                            logger.write.apply(logger, boundArguments);
                        });
                    }
                };
            }
        }
    };
};