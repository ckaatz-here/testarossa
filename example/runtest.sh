#!/bin/bash
SCRIPT=$(readlink -f $0)
SCRIPT_DIR=`dirname $SCRIPT`
PROJECT_DIR=`readlink -f $SCRIPT_DIR`
TESTAROSSA=`readlink -f $SCRIPT_DIR/../lib/cli.js`
TEST_DIR=$PROJECT_DIR/test

NODE_PATH=$PROJECT_DIR/node_modules $TESTAROSSA \
    --helpers http,property-template-helper.js \
    --depfile $TEST_DIR/container.js \
    "$@" \
    $TEST_DIR/test-*

exit $?