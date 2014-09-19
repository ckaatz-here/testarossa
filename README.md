Testarossa
==========
[![NPM version](https://badge.fury.io/js/testarossa.svg)](http://badge.fury.io/js/testarossa)

Testarossa, an extensible and truly async test framework for node

Description
-----------
System tests made easy, just add your properties to a testcase, post, get and validate your results.
It comes with different formatters like jUnit, machine and colorful console output.

Example Usage
-------------
Checkout the example folder for a usage example or the simple example below.

    module.exports = function(test) {
        test.add("test-setup", function(done) {
          this.dataToSend = {"name", "foo"};
          done();
        });
        test.get("/api", {status: 200});
        test.add("verify ok message", function(done) {
          var responseBody = JSON.parse(this.lastResponse.body);
          responseBody.should.have.property("message", "ok");
          done();
        });
        test.post("/api/hello", this.dataToSend, {status: 200});
        test.add("check the last response", function(done) {
          var responseBody = JSON.parse(this.lastResponse.body);
          responseBody.should.have.property("message", "hello foo");
          done();
        });
    };

**http helper**

Using the http helper is quite forward for REST API testing. It takes a given path,
optional body data and headers and a mandatory evaluate Object as shorthand validation
(eg: {status: 200} will check against 200 reponse status code).

supported methods: get, head, post, put, delete, trace, options, connect, patch

    $ test.[method](path,[body,][headers,]evaluateObject)
