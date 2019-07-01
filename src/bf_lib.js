var fs = require('fs');
var bfConsts = require('./bf_constants');
var bfCommands = require('./bf_command');
var spawn = require('child_process').spawn;

exports.parseParameters = function (args) {
    // Initialise our settings
    var inputFilename = '';
    var asmFilename = '';
    var objFilename = '';
    var debugMode = false;
    var assemble = false;
    var run = false;
        
    if (args.length < 3) {
        // Expected args should be atleast 'node.exe bj.js sourcecode.bf', so anything less
        // than that and we should display the usage
        usage();
    }

    // args[0] and [1] will be 'node.exe' and 'bf.js' so we only need to parse the rest..
    for (var i = 2; i < args.length; i++) {
        // First actual paramter should be the Brainfuck source code file
        if (i == 2) {
            // Initialise the inputFilename setting, and generate the .asm and .obj filenames
            inputFilename = args[i];
            asmFilename = changeFileExtension(inputFilename, bfConsts.ASM_FILE_EXTENSION);
            objFilename = changeFileExtension(inputFilename, bfConsts.OBJ_FILE_EXTENSION);
        } else {
            // Get any remaining parameters
            if (args[i].toUpperCase() === bfConsts.DEBUG_MODE) {
                debugMode = true;
            } else if (args[i].toUpperCase() === bfConsts.ASSEMBLE) {
                assemble = true;
            } else {
                console.log('Unknown parameter: ' + args[i]);
                usage();
            }
        }
    }

    // Finally, return our settings
    return {
        inputFilename: inputFilename,
        asmFilename: asmFilename,
        objFilename: objFilename,
        debugMode: debugMode,
        assemble: assemble,
    };
}

// Small function for changing a file extension.
function changeFileExtension(filename, newExtension) {
    return filename.substr(0, filename.lastIndexOf(".")) + newExtension;
}

// Display command-line usage and return to OS
function usage() {
    console.log('Usage:');
    console.log('node bf.js inputfile [options]');
    console.log('inputfile - Brainfuck source code file (must be current directory due to MAS32 issues)')
    console.log('[options] - /D - Show debugging information during parsing');
    console.log('          - /A - Assemble (must have MASM32 installed)');
    console.log('');
    console.log('e.g. node bf.js ./helloworld.bf /D /A');
    process.exit(bfConsts.USAGE)
};

// Read from a file and return results
exports.readFile = function(filename) {    
    try {
        return fs.readFileSync(filename, "utf-8");
    } catch(err) {
        console.log(err);
        process.exit(bfConsts.INPUT_FILE_NOT_FOUND);
    }
};

// Create and write to a file
exports.writeFile = function(filename, str) {
    try {
        fs.writeFileSync(filename, str)
    } catch(err) {
        console.log(err);
        process.exit(bfConsts.OUTPUT_FILE_NOT_FOUND);
    }
}

// Append to an existing file
function appendFile(filename, str) {
    try {
        fs.appendFileSync(filename, str)
    } catch(err) {
        console.log(err);
        process.exit(bfConsts.OUTPUT_FILE_NOT_FOUND);
    }
}

exports.assemble = function (settings) {
    // Only actually run MASM to assemble and link if the '/A' paramter was used
    if (settings.assemble) {
        assembleProcess = spawn(bfConsts.MASM32_COMPILE, [bfConsts.MASM32_COMPILE_PARAM1, bfConsts.MASM32_COMPILE_PARAM2, settings.asmFilename]);
        assembleProcess.stdout.on('data', function (data) {
            console.log('Assemble: ' + data.toString());
        });
        assembleProcess.stderr.on('data', function (data) {
            console.log('Assemble error: ' + data.toString());
        });
        assembleProcess.on('exit', function (code) {
            console.log('Assemble exit code: ' + code.toString());

            // If we assembled the .obj file, then link..
            if (code == 0) {
                linkProcess = spawn(bfConsts.MASM32_LINK, [bfConsts.MASM32_LINK_PARAM1, settings.objFilename]);
                linkProcess.stdout.on('data', function (data) {
                    console.log('Link: ' + data.toString());
                });
                linkProcess.stderr.on('data', function (data) {
                    console.log('Link error: ' + data.toString());
                });
                linkProcess.on('exit', function (code) {
                    console.log('Link exit code: ' + code.toString());
                });
            }
        });
    }
}

// Remove any non-Brainfuck characters and check for brace balencing (number of '['
// equals number of ']' and that we don't leave any braces open at EOF, or attempt
// to close a brace without an opering one.)
exports.removeComments = function(str) {
    var braketCount = 0;
    try {
        var output = '';
        
        for (var i = 0; i < str.length; i++) {
            var ch = str.charAt(i);
            
            switch(ch)
            {
                case bfConsts.INCREMENT_DATA_POINTER :
                case bfConsts.DECREMENT_DATA_POINTER :
                case bfConsts.INCREMENT_DATA :
                case bfConsts.DECREMENT_DATA :
                case bfConsts.INPUT :
                case bfConsts.OUTPUT :
                case '\n' :
                case '\r' : {
                    output += ch;
                    break;
                }
                case bfConsts.WHILE_NOT_ZERO : {
                    braketCount++;
                    output += ch;
                    break;
                }
                case bfConsts.END_WHILE : {
                    braketCount--;
                    if(braketCount < 0) {
                        throw "Unbalanced brackets!";
                    }
                    output += ch;
                    break;
                }
                default : {
                    output += ' ';
                    break;
                }
            }            
        }
        
        if(braketCount != 0) {
            throw "Unbalanced brackets!";
        }

        return output;
    } catch(err) {
        console.log(err);
        process.exit(bfConsts.UNABLE_TO_PARSE)
    }
}

// Recursive parsing of the Brainfuck program
exports.parse = function(str, index, depth) {
    try {
        var output = [];

        while(index < str.length) {
            var ch = str.charAt(index);
            var lastItem = (output.length > 0) ? output[output.length-1] : null;
                
            switch(ch)
            {
                case bfConsts.INCREMENT_DATA_POINTER : {
                    if ((lastItem != null) && (lastItem instanceof bfCommands.bfIncDataPointerCommand)) {
                        // If the previous command was also a bfIncDataPointerCommand then just grab it and
                        // incremement..
                        lastItem.increment();
                    } else {
                        // ..otherwise, add a new bfIncDataPointerCommand.
                        output.push(new bfCommands.bfIncDataPointerCommand());
                    }
                    break;
                }
                case bfConsts.DECREMENT_DATA_POINTER : {
                    if((lastItem != null) && (lastItem instanceof bfCommands.bfDecDataPointerCommand)) {
                        lastItem.increment();
                    } else {
                        output.push(new bfCommands.bfDecDataPointerCommand());
                    }
                    break;
                }
                case bfConsts.INCREMENT_DATA : {
                    if((lastItem != null) && (lastItem instanceof bfCommands.bfIncDataCommand)) {
                        lastItem.increment();
                    } else {
                        output.push(new bfCommands.bfIncDataCommand());
                    }
                    break;
                }
                case bfConsts.DECREMENT_DATA : {
                    if((lastItem != null) && (lastItem instanceof bfCommands.bfDecDataCommand)) {
                        lastItem.increment();
                    } else {
                        output.push(new bfCommands.bfDecDataCommand());
                    }
                    break;
                }
                case bfConsts.WHILE_NOT_ZERO: {     
                    // Recursively parse...
                    var retVal = this.parse(str, index + 1, depth + 1);
                    // ...and add the bfWhileNotZero entry 
                    output.push(new bfCommands.bfWhileNotZero(retVal.output));
                    index = retVal.index;
                    break;
                }
                case bfConsts.END_WHILE: {
                    // Return to caller, closing the while loop
                    return {
                        output: output,
                        index: index
                    };
                    break;
                }
                case bfConsts.INPUT : {
                    output.push(new bfCommands.bfInputCommand)
                    break;
                }
                case bfConsts.OUTPUT : {
                    output.push(new bfCommands.bfOutputCommand)
                    break;
                }
            }

            index++;
        }
    } catch(err) {
        console.log(err);
        process.exit(bfConsts.UNABLE_TO_PARSE)
    }

    // Return to caller
    return {
        output: output,
        index: index
    };
}

// Shhhh.. Nothing to see here.
var whileCounter;
// Actual compiler
exports.compile = function (commands, asmFilename) {
    try {
        whileCounter = 0;

        // White the header Assembly...
        var header = this.readFile(bfConsts.ASM_HEADER);
        this.writeFile(asmFilename, header);

        // ...and start compiling the commands
        for (var i = 0; i < commands.output.length; i++) {
            compileCommand(commands.output[i], asmFilename);
        }

        // White the footer Assembly
        var footer = this.readFile(bfConsts.ASM_FOOTER);
        appendFile(asmFilename, footer);
    } catch (err) {
        console.log(err);
        process.exit(bfConsts.UNABLE_TO_COMPILE)
    }
}

function compileCommand(command, asmFilename) {
    if (command instanceof bfCommands.bfIncDataPointerCommand) {
        if (command.counter == 1) {
            appendFile(asmFilename,
                '                    inc esi                          ; >\n');
        } else {
            appendFile(asmFilename,
                '                    add esi, ' + padNumber(command.counter, 4) + '                    ; ' + multipleSymbol(bfConsts.INCREMENT_DATA_POINTER, command.counter) + '\n');
        }
    } else if (command instanceof bfCommands.bfDecDataPointerCommand) {
        if (command.counter == 1) {
            appendFile(asmFilename,
                '                    dec esi                          ; <\n');
        } else {
            appendFile(asmFilename,
                '                    sub esi, ' + padNumber(command.counter, 4) + '                    ; ' + multipleSymbol(bfConsts.DECREMENT_DATA_POINTER, command.counter) + '\n');
        }
    } else if (command instanceof bfCommands.bfIncDataCommand) {
        if (command.counter == 1) {
            appendFile(asmFilename,
                '                    inc byte ptr [esi]               ; +\n');
        } else {
            appendFile(asmFilename,
                '                    add byte ptr [esi], ' + padNumber(command.counter, 4) + '         ; ' + multipleSymbol(bfConsts.INCREMENT_DATA, command.counter) + '\n');
        }
    } else if (command instanceof bfCommands.bfDecDataCommand) {
        if (command.counter == 1) {
            appendFile(asmFilename,
                '                    dec byte ptr [esi]               ; -\n');
        } else {
            appendFile(asmFilename,
                '                    sub byte ptr [esi], ' + padNumber(command.counter, 4) + '         ; ' + multipleSymbol(bfConsts.DECREMENT_DATA, command.counter) + '\n');
        }
    } else if (command instanceof bfCommands.bfOutputCommand) {
        appendFile(asmFilename,
            '                    call displayCurrentByte          ; .\n');
    } else if (command instanceof bfCommands.bfInputCommand) {
        appendFile(asmFilename,
            '                    call readCurrentByte             ; ,\n');
    } else if (command instanceof bfCommands.bfWhileNotZero) {
        var currentWhileCounter = whileCounter;
        appendFile(asmFilename,
            'whileNotZero' + padNumber(currentWhileCounter, 4) + ':   cmp byte ptr [esi], 0            ; [\n' +
            '                    je ' + 'endWhileNotZero' + padNumber(currentWhileCounter, 4) + '           ;\n');
        whileCounter++;

        for (var i = 0; i < command.bfCommands.length; i++) {
            compileCommand(command.bfCommands[i], asmFilename);
        }

        appendFile(asmFilename,
            '                    jmp whileNotZero' + padNumber(currentWhileCounter, 4) + '             ; ]\n' +
            'endWhileNotZero' + padNumber(currentWhileCounter, 4) + ':                                 ;\n');
    }
}

// Function for formatting numbers with leading zeros. Helps with text alignment
function padNumber(num, size) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
}

// Function for multiplying symbols. Helps when we have multiple inc/dec Brainfuck commands
// and use ADD/SUB rather than INC/DEC op-codes.
function multipleSymbol(symbol, num) {
    var s = '';
    for (var i = 0; i < num; i++) s += symbol;
    return s;
}