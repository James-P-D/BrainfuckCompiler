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
    SAFE: '/S',

    // Assembly
    ASM_HEADER:
        '.386                  ; 386 Processor Instruction Set\n' +
        '.model flat, stdcall  ; Flat memory model and stdcall method\n' +
        'option casemap: none  ; Case Sensitive\n' +
        '\n' +
        'include c:\\masm32\\include\\windows.inc\n' +
        'include c:\\masm32\\include\\kernel32.inc\n' +
        'include c:\\masm32\\include\\masm32.inc\n' +
        'includelib c:\\masm32\\lib\\kernel32.lib \n' +
        'includelib c:\\masm32\\m32lib\\masm32.lib\n' +
        '\n' +
        '.data\n' +
        'STD_OUTPUT_HANDLE   equ -11                    ; https://docs.microsoft.com/en-us/windows/console/getstdhandle\n' +
        'STD_INPUT_HANDLE    equ -10                    ; https://docs.microsoft.com/en-us/windows/console/getstdhandle\n' +
        'displayByte         db 0                       ; Our output bytes\n' +
        'displayByteLength   equ $ - offset displayByte ; Length of displayByte\n' +
        'BUFFER_SIZE         equ 10000                  ; Brainfuck buffer size\n' +
        'bufferStart         equ $                      ; Start position of buffer\n' +
        'buffer              db BUFFER_SIZE dup(0)      ; Our 10000-byte brainfuck buffer, initialised to zero\n' +
        '\n' +
        '.data?\n' +
        'consoleOutHandle    dd ?                       ; Our ouput handle (currently undefined)\n' +
        'consoleInHandle     dd ?                       ; Our input handle (currently undefined)\n' +
        'bytesWritten        dd ?                       ; Number of bytes written to output (currently undefined)\n' +
        'bytesRead           dd ?                       ; Number of bytes written to input (currently undefined)\n' +
        '\n' +
        '.code\n' +
        'start:              call getIOHandles          ; Get the input/output handles\n' +
        '                    mov esi, bufferStart       ; \n' +
        '\n' +
        ';;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; PROGRAM STARTS ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n' +
        '\n',

    ASM_FOOTER:
        '\n'+
        ';;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; PROGRAM ENDS ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n' +
        '\n' +
        '                    jmp exit                   ; All done!\n' +
        '\n' +
        'getIOHandles:       push STD_OUTPUT_HANDLE     ; _In_ DWORD nStdHandle\n' +
        '                    call GetStdHandle          ; https://docs.microsoft.com/en-us/windows/console/getstdhandle\n' +
        '                    mov [consoleOutHandle], eax; Save the output handle\n' +
        '                    push STD_INPUT_HANDLE      ; _In_ DWORD nStdHandle\n'+
        '                    call GetStdHandle          ; https://docs.microsoft.com/en-us/windows/console/getstdhandle\n' +
        '                    mov [consoleInHandle], eax ; Save the input handle\n' +
        '                    ret\n'+
        '\n' +
        'displayCurrentByte: push 0                     ; _Reserved_      LPVOID  lpReserved\n' +
        '                    push offset bytesWritten   ; _Out_           LPDWORD lpNumberOfCharsWritten\n'+
        '                    push displayByteLength     ; _In_            DWORD   nNumberOfCharsToWrite\n'+
        '                    push offset displayByte    ; _In_      const VOID *  lpBuffer\n'+
        '                    push consoleOutHandle      ; _In_            HANDLE  hConsoleOutput\n'+
        '                    call WriteConsole          ; https://docs.microsoft.com/en-us/windows/console/writeconsole\n'+
        '                    ret\n'+
        '\n' +
        'readCurrentByte:    push - 1                   ; _In_opt_        LPVOID  pInputControl\n'+
        '                    push offset bytesRead      ; _Out_           LPDWORD lpNumberOfCharsRead\n'+
        '                    push 1                     ; _In_            DWORD   nNumberOfCharsToRead\n'+
        '                    push offset displayByte    ; _Out_           LPVOID  lpBuffer\n'+
        '                    push consoleInHandle       ; _In_            HANDLE  hConsoleInput\n'+
        '                    call ReadConsole           ; https://docs.microsoft.com/en-us/windows/console/readconsole\n' +
        '                    ret\n' +
        '\n' +
        '; readCurrentByte2: push offset bytesRead        ; Gah! This sort-of works. The problem with ReadConsole is that it doesnt return until <ENTER>\n' +
        ';                   push 1                       ; is pressed. The problem with ReadConsoleInput is that it returns when *any* key is pressed\n'+
        ';                   push offset displayByte      ; including <SHIFT>, <ALT>, <CAPS-LOCK> etc. ReadConsoleInput is too fine for our needs,\n'+
        ';                   push consoleInHandle         ; but depressingly ReadConsole isnt fine enough. :(\n'+
        ';                   call ReadConsoleInput        ; https://docs.microsoft.com/en-us/windows/console/readconsoleinput\n'+
        '\n'+
        'exit:              push 0                      ; Exit code zero for success\n'+
        '                   call ExitProcess            ; https://docs.microsoft.com/en-us/windows/desktop/api/processthreadsapi/nf-processthreadsapi-exitprocess\n'+
        '\n'+
        'exitWithError:     push 1                      ; Exit code one for failure\n'+
        '                   call ExitProcess            ; https://docs.microsoft.com/en-us/windows/desktop/api/processthreadsapi/nf-processthreadsapi-exitprocess\n'+
        '\n'+
        'end start \n',
});