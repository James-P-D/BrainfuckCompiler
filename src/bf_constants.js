module.exports = Object.freeze({
    // Valid commands in BrainFuck
    INCREMENT_DATA_POINTER: '>',
    DECREMENT_DATA_POINTER: '<',
    INCREMENT_DATA: '+',
    DECREMENT_DATA: '-',
    WHILE_NOT_ZERO: '[',
    END_WHILE: ']',
    INPUT: ',',
    OUTPUT: '.',

    // Error codes
    SUCCESS: 0,
    USAGE: 1,
    INPUT_FILE_NOT_FOUND: 2,
    OUTPUT_FILE_NOT_FOUND: 3,
    UNABLE_TO_PARSE: 4,
    UNABLE_TO_EXECUTE: 5,
    UNABLE_TO_COMPILE: 6,

    // Parameters
    DEBUG_MODE: '/D',
    ASSEMBLE: '/A',
    RUN: '/R',
    
    // Assembly Files
    ASM_HEADER: './header.asm',
    ASM_FOOTER: './footer.asm'
});