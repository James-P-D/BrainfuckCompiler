var bfConsts = require('./bf_constants');
var bfLib = require('./bf_lib');
var bfCommands = require('./bf_command');

var settings = bfLib.parseParameters(process.argv);

var rawInput = bfLib.readFile(settings.inputFilename);
if (settings.debugMode) {
    console.log('Raw input:');
    console.log(rawInput);
}

var parsed = bfLib.removeComments(rawInput);
if (settings.debugMode) {
    console.log('Parsed data:');
    console.log(parsed);
}

var commands = bfLib.parse(parsed, 0, 0);

bfLib.compile(commands, settings.outputFilename);


return bfConsts.SUCCESS;