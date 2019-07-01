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

    // File types
    ASM_FILE_EXTENSION: '.asm',
    OBJ_FILE_EXTENSION: '.obj',

    // Assembly Files
    ASM_HEADER: './header.asm',
    ASM_FOOTER: './footer.asm',

    // External Execution
    MASM32_COMPILE: 'c:\\masm32\\bin\\ml.exe',
    MASM32_COMPILE_PARAM1: '/c',
    MASM32_COMPILE_PARAM2: '/coff',
    MASM32_LINK: 'c:\\masm32\\bin\\polink.exe',
    MASM32_LINK_PARAM1: '/SUBSYSTEM:console'
});