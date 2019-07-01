var fs = require('fs');
var bfConsts = require('./bf_constants');
var bfCommands = require('./bf_command');
var spawn = require('child_process').spawn;

exports.parseParameters = function(args) {
    var inputFilename = './examples/alphabet.bf';
    var outputFilename = './examples/alphabet.asm';
    var debugMode = true;
    var assemble = false;
    var run = false;
    
    return {
        inputFilename: inputFilename,
        outputFilename: outputFilename,
        debugMode: debugMode,
        assemble: assemble,
        run: run,
    };

    if (args.length < 4) {
        usage();
    }

    for (var i = 2; i < args.length; i++) {
        if (i == 2) {
            inputFilename = args[i];
        } else if (i == 3) {
            outputFilename = args[i];
        } else {
            if (args[i].toUpperCase() === bfConsts.DEBUG_MODE) {
                debugMode = true;
            } else if (args[i].toUpperCase() === bfConsts.ASSEMBLE) {
                assemble = true;
            } else if (args[i].toUpperCase() === bfConsts.RUN) {
                run = true;
            } else {
                console.log('Unknown parameter: ' + args[i]);
                usage();
            }
        }
    }

    if (run && (!assemble)) {
        console.log('Cannot use ' + bfConsts.RUN + ' without ' + bfConsts.ASSEMBLE);
        usage();
    }

    return {
        inputFilename: inputFilename,
        outputFilename: outputFilename,
        debugMode: debugMode,
        assemble: assemble,
        run: run,
    };
}

function usage() {
    console.log('Usage:');
    console.log('node bf.js inputfile outputfile [options]');
    console.log('[options] - /D - Show debugging information during parsing');
    console.log('          - /A - Assemble (must have MASM32 installed)');
    console.log('          - /R - Run (must be used with /a)');
    process.exit(bfConsts.USAGE)
};

exports.readFile = function(filename) {    
    try {
        return fs.readFileSync(filename, "utf-8");
    } catch(err) {
        console.log(err);
        process.exit(bfConsts.INPUT_FILE_NOT_FOUND);
    }
};

exports.writeFile = function(filename, str) {
    try {
        fs.writeFileSync(filename, str)
    } catch(err) {
        console.log(err);
        process.exit(bfConsts.OUTPUT_FILE_NOT_FOUND);
    }
}

function appendFile(filename, str) {
    try {
        fs.appendFileSync(filename, str)
    } catch(err) {
        console.log(err);
        process.exit(bfConsts.OUTPUT_FILE_NOT_FOUND);
    }
}

exports.runFile = function (filename, params) {
    externalProcess = spawn(filename, params);
    externalProcess.stdout.on('data', function (data) {
        console.log('stdout: ' + data.toString());
    });
    externalProcess.stderr.on('data', function (data) {
        console.log('stderr: ' + data.toString());
    });
    externalProcess.on('exit', function (code) {
        console.log('child process exited with code ' + code.toString());
    });
}

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

exports.parse = function(str, index, depth) {
    try {
        var output = [];

        while(index < str.length) {
            var ch = str.charAt(index);
            var lastItem = (output.length > 0) ? output[output.length-1] : null;
                
            switch(ch)
            {
                case bfConsts.INCREMENT_DATA_POINTER : {
                    if((lastItem != null) && (lastItem instanceof bfCommands.bfIncDataPointerCommand)) {
                        lastItem.increment();
                    } else {
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
                case bfConsts.WHILE_NOT_ZERO : {                    
                    var retVal = this.parse(str, index + 1, depth + 1);
                    output.push(retVal.output);
                    index = retVal.index;
                    break;
                }
                case bfConsts.END_WHILE : {
                    output.push(new bfCommands.bfEndWhile());
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
    
    return {
        output: output,
        index: index
    };
}

exports.compile = function (commands, outputFilename) {
    try {
        this.writeFile(outputFilename, bfConsts.ASM_HEADER);

        for (var i = 0; i < commands.output.length; i++) {
            compileCommand(commands.output[i], outputFilename);
        }

        appendFile(outputFilename, bfConsts.ASM_FOOTER);
    } catch (err) {
        console.log(err);
        process.exit(bfConsts.UNABLE_TO_COMPILE)
    }
}

function compileCommand(command, outputFilename) {
    if (command instanceof bfCommands.bfIncDataPointerCommand) {
        if (command.counter == 1) {
            appendFile(outputFilename,
                '                    inc esi                          ; >\n');
        } else {
            appendFile(outputFilename,
                '                    add esi, ' + pad(command.counter, 4) + '                    ; ' + multipleSymbol(bfConsts.INCREMENT_DATA_POINTER, command.counter) + '\n');
        }
    } else if (command instanceof bfCommands.bfDecDataPointerCommand) {
        if (command.counter == 1) {
            appendFile(outputFilename,
                '                    dec esi                          ; <\n');
        } else {
            appendFile(outputFilename,
                '                    sub esi, ' + pad(command.counter, 4) + '                    ; ' + multipleSymbol(bfConsts.DECREMENT_DATA_POINTER, command.counter) + '\n');
        }
    } else if (command instanceof bfCommands.bfIncDataCommand) {
        if (command.counter == 1) {
            appendFile(outputFilename,
                '                    inc byte ptr [esi]               ; +\n')
        } else {
            appendFile(outputFilename,
                '                    add byte ptr [esi], ' + pad(command.counter, 4) + '         ; ' + multipleSymbol(bfConsts.INCREMENT_DATA, command.counter) + '\n');
        }
    } else if (command instanceof bfCommands.bfDecDataCommand) {
        if (command.counter == 1) {
            appendFile(outputFilename,
                '                    dec byte ptr [esi]               ; -\n')
        } else {
            appendFile(outputFilename,
                '                    sub byte ptr [esi], ' + pad(command.counter, 4) + '         ; ' + multipleSymbol(bfConsts.DECREMENT_DATA, command.counter) + '\n');
        }
    } else if (command instanceof bfCommands.bfOutputCommand) {
        appendFile(outputFilename,
            '                    mov ah, byte ptr [esi]           ; .\n' +
            '                    mov displayByte, ah              ; \n' +
            '                    call displayCurrentByte          ; \n');
    } else if (command instanceof bfCommands.bfInputCommand) {
        appendFile(outputFilename,
            '                    call readCurrentByte             ; ,\n')
    } else if (command instanceof bfCommands.bfWhileNotZero) {
        appendFile(outputFilename, '\n');
    } else if (command instanceof bfCommands.bfEndWhile) {

    }
}

function pad(num, size) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
}


function multipleSymbol(symbol, num) {
    var s = '';
    for (var i = 0; i < num; i++) s += symbol;
    return s;
}