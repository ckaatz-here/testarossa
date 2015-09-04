var assert = require('assert');

module.exports = function(test) {
    "use strict";
    test.get('', {
        status: 200
    });
    test.add('test whether we got proper json back', function(done) {
        var responseBody = JSON.parse(this.lastResponse.body);
        assert.ok(responseBody.hasOwnProperty("message"), "no message in the object");
        assert.ok(responseBody.message === "Hello World", "wrong text returned");
        done();
    });
    test.add("prepare data upload", function(done) {
        this.uploadData = {data: true};
        done();
    });
    test.post('/', test.property('uploadData'), {
        status: 200
    });
    test.add('test whether we get different json back', function(done) {
        var responseBody = JSON.parse(this.lastResponse.body);
        assert.ok(responseBody.hasOwnProperty("message"), "no message in the object");
        assert.ok(responseBody.message === "Hello POST!", "wrong text returned");
        done();
    });
    test.put('/', test.property('uploadData'), {
        status: 200
    });
    test.add('test whether we get different json back', function(done) {
        var responseBody = JSON.parse(this.lastResponse.body);
        assert.ok(responseBody.hasOwnProperty("message"), "no message in the object");
        assert.ok(responseBody.message === "Hello PUT!", "wrong text returned");
        done();
    });
};