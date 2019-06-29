var bfConsts = require('./bf_constants');
var bfLib = require('./bf_lib');
var bfCommands = require('./bf_command');
var inputFilename = './examples/alphabet.bf';//
var outputFilename = './examples/alphabet.asm';

console.log(process.argv);
//if(process.argv.length != 3) {
//    bfLib.usage();
//}

var parse0 = bfLib.readFile(inputFilename);
console.log('Parse 0:');
console.log(parse0);

var parse1 = bfLib.removeComments(parse0);
console.log('Parse 1:');
console.log(parse1);

var commands = bfLib.parse(parse1, 0, 0);
var foo = commands.output[0];

bfLib.compile(commands, outputFilename);

//bfLib.runFile('./ReturnVal1.exe');

return bfConsts.SUCCESS;