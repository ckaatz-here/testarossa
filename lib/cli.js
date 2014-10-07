#!/usr/bin/env node
var program = require('commander');
var parser = require('./parse-cli');

program
  .version('0.0.1')
  .usage('[options] <test files ...>')
  .option('--depfile [path]', 'Path to dependency definition file')
  .option('--helpers [list]', 'List of helpers', parser.parseList)
  .option('-f, --formatter [file]', 'symbolic name or path to formatter file')
  .option('--formatters [list]', 'symbolic name or path to formatter files', parser.parseList)
  .option('--timeout [ms]', 'amount of ms to wait before killing a test, defaults to 30000', parseInt)
  .option('--set [key=value,...]', 'dictionary for passing settings to the formatter or helpers', parser.parseDictionary)
  .parse(process.argv);

var timeout = typeof program.timeout === 'number' ? program.timeout : 30000;
var helperFiles = (program.helpers || []).map(parser.normalizeHelper);
var depFile = parser.normalizeFile(program.depfile);
var testFiles = (program.args || []).map(parser.normalizeFile);

var formatterFiles = [];
var formatterFiles = [];
if (program.formatters && program.formatters.length > 0) {
    if (program.formatters.length === 1) {
        formatterFiles.push(parser.normalizeFormatter(program.formatters[0]));
    } else if (program.formatters.length >= 1) {
        formatterFiles = (program.formatters || []).map(parser.normalizeFormatter);
    }
} else if (program.formatter) {
    formatterFiles.push(parser.normalizeFormatter(program.formatter));
} else {
    formatterFiles = [parser.normalizeFormatter('console')];
}

var runTestCases = require('./run').runTestCases;

runTestCases(helperFiles, depFile, testFiles, formatterFiles, timeout, program.set, function(err, hasFailures) {
	if(err) {
		console.log('initialization error:', err);
	}
	process.exit(hasFailures ? 1 : 0);
});