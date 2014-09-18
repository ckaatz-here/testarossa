module.exports = function() {
    "use strict";

    return {
        extendTestCase: function(testCase) {
            testCase.addDelay = function(timeout) {
                return testCase.add('adding delay of ' + timeout + ' ms', function(done) {
                    setTimeout(done, timeout);
                });
            };
        }
    };
};
