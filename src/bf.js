var bfConsts = require('./bf_constants');
var bfLib = require('./bf_lib');
var bfCommands = require('./bf_command');

var inputFilename = './examples/alphabet.bf';
var outputFilename = './examples/alphabet.asm';

var settings = bfLib.parseParameters(process.argv);
inputFilename = settings.inputFilename;
outputFilename = settings.outputFilename;

var parse0 = bfLib.readFile(inputFilename);
if (settings.debugMode) {
    console.log('Parse 1:');
    console.log(parse0);
}

var parse1 = bfLib.removeComments(parse0);
if (settings.debugMode) {
    console.log('Parse 2:');
    console.log(parse1);
}

var commands = bfLib.parse(parse1, 0, 0);

bfLib.compile(commands, outputFilename);

//bfLib.runFile('./ReturnVal1.exe');

return bfConsts.SUCCESS;