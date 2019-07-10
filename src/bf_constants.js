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
    UNABLE_TO_COMPILE: 5,

    // Indentation for .asm file
    COLUMN_1: 20,
    COLUMN_2: 50,

    // Assembly instructions
    ASM_INC_DATA_POINTER: 'inc esi',
    ASM_ADD_DATA_POINTER: 'add esi, ',
    ASM_DEC_DATA_POINTER: 'dec esi',
    ASM_SUB_DATA_POINTER: 'sub esi, ',
    ASM_INC_DATA: 'inc byte ptr [esi]',
    ASM_ADD_DATA: 'add byte ptr [esi], ',
    ASM_DEC_DATA: 'dec byte ptr [esi]',
    ASM_SUB_DATA: 'sub byte ptr [esi], ',
    ASM_CALL_DISPLAY_CURRENT_BYTE: 'call displayCurrentByte',
    ASM_CALL_READ_CURRENT_BYTE: 'call readCurrentByte',
    ASM_WHILE_NOT_ZERO_LABEL: 'whileNotZero',
    ASM_WHILE_NOT_ZERO: 'cmp byte ptr [esi], 0',
    ASM_WHILE_NOT_ZERO_JUMP: 'je endWhileNotZero',
    ASM_END_WHILE_JUMP: 'jmp whileNotZero',
    ASM_END_WHILE_LABEL: 'endWhileNotZero',
    ASM_END_LABEL: ':',
    ASM_COMMENT: '; ',
    ASM_NEW_LINE: '\n',

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