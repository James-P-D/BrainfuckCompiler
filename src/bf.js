var bfConsts = require('./bf_constants');
var bfLib = require('./bf_lib');
var bfCommands = require('./bf_command');

// Parse the paramters from the command-line
var settings = bfLib.parseParameters(process.argv);

if (settings.debugMode) {
    // If in debug-mode, output the expected output filenames
    console.log('Input file : ' + settings.inputFilename);
    console.log('Asm file   : ' + settings.asmFilename);
    console.log('Obj file   : ' + settings.objFilename);
    console.log('')
}

// Read the raw Brainfuck sourcecode file
var rawInput = bfLib.readFile(settings.inputFilename);
if (settings.debugMode) {
    console.log('Raw input:');
    console.log(rawInput);
    console.log('')
}

// Remove all non-Brainfuck characters
var parsed = bfLib.removeComments(rawInput);
if (settings.debugMode) {
    console.log('Parsed data:');
    console.log(parsed);
    console.log('')
}

// Parse our clean Brainfuck source-code from the start (0th byte, 0th depth)
var commands = bfLib.parse(parsed, 0, 0);

// Compile the Assembly code for our program
bfLib.compile(commands, settings.asmFilename);

// Call MASM32 to assemble the actual .exe file
bfLib.assemble(settings);

// Return success
return bfConsts.SUCCESS;