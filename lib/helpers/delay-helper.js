module.exports = function() {
    "use strict";

    return {
        extendTestCase: function(testCase) {
            testCase.addDelay = function(timeout) {
                var to = timeout || 100;
                return testCase.add('adding delay of ' + to + ' ms', function(done) {
                    setTimeout(function() {
                        done();
                    }, to);
                });
            };
        }
    };
};
