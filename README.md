# BrainfuckCompiler
A command-line application for generating [MASM](http://masm32.com/download.htm)-compatible x86 Assembly versions of [Brainfuck](https://en.wikipedia.org/wiki/Brainfuck) programs.

Please note that many of the example Brainfuck programs have been taken from [Daniel B. Cristofani's website](http://www.hevanet.com/cristofd/brainfuck/).

## Usage

```
C:\Dev\BrainfuckCompiler\src>node bf.js alphabet.bf /d /a
Input file : alphabet.bf
Asm file   : alphabet.asm
Obj file   : alphabet.obj

Raw input:
set first cell to 26
++++++++++++++++++++++++++
move to second cell
>
set second cell to 65 (A)
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
move back to first cell
<
while first cell (26) is not zero
[
    move to second cell
    >
        output value
    .
        increase second cell
    +
        move back to first cell
    <
        decrement first cell
    -
]

Parsed data:

++++++++++++++++++++++++++
>
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
<
[
    >
    .
    +
    <
    -
]

Assemble error: Microsoft (R) Macro Assembler Version 6.14.8444
Copyright (C) Microsoft Corp 1981-1997.  All rights reserved.


Assemble:  Assembling: alphabet.asm

***********
ASCII build
***********


Assemble exit code: 0
Link exit code: 0
```

This will have created and compiled an Assembly file that looks something like this:

```assembly
.386                  ; 386 Processor Instruction Set
.model flat, stdcall  ; Flat memory model and stdcall method
option casemap: none  ; Case Sensitive

include c:\\masm32\\include\\windows.inc
include c:\\masm32\\include\\kernel32.inc
include c:\\masm32\\include\\masm32.inc
includelib c:\\masm32\\lib\\kernel32.lib 
includelib c:\\masm32\\m32lib\\masm32.lib

.data
STD_OUTPUT_HANDLE   equ -11                    ; https://docs.microsoft.com/en-us/windows/console/getstdhandle
STD_INPUT_HANDLE    equ -10                    ; https://docs.microsoft.com/en-us/windows/console/getstdhandle
ioByte              db 0                       ; Our input/output byte
ioByteLength        equ $ - offset ioByte      ; Length of ioByte
BUFFER_SIZE         equ 10000                  ; Brainfuck buffer size
bufferStart         equ $                      ; Start position of buffer
buffer              db BUFFER_SIZE dup(0)      ; Our 10000-byte brainfuck buffer, initialised to zero

.data?
consoleOutHandle    dd ?                       ; Our ouput handle (currently undefined)
consoleInHandle     dd ?                       ; Our input handle (currently undefined)
bytesWritten        dd ?                       ; Number of bytes written to output (currently undefined)
bytesRead           dd ?                       ; Number of bytes written to input (currently undefined)

.code
start:              call getIOHandles          ; Get the input/output handles
                    mov esi, bufferStart       ; 

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; PROGRAM STARTS ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

                    add byte ptr [esi], 0026         ; ++++++++++++++++++++++++++
                    inc esi                          ; >
                    add byte ptr [esi], 0065         ; +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                    dec esi                          ; <
whileNotZero0000:   cmp byte ptr [esi], 0            ; [
                    je endWhileNotZero0000           ;
                    inc esi                          ; >
                    call displayCurrentByte          ; .
                    inc byte ptr [esi]               ; +
                    dec esi                          ; <
                    dec byte ptr [esi]               ; -
                    jmp whileNotZero0000             ; ]
endWhileNotZero0000:                                 ;

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; PROGRAM ENDS ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

                    jmp exit                   ; All done!

getIOHandles:       push STD_OUTPUT_HANDLE     ; _In_ DWORD nStdHandle
                    call GetStdHandle          ; https://docs.microsoft.com/en-us/windows/console/getstdhandle
                    mov [consoleOutHandle], eax; Save the output handle
                    push STD_INPUT_HANDLE      ; _In_ DWORD nStdHandle
                    call GetStdHandle          ; https://docs.microsoft.com/en-us/windows/console/getstdhandle
                    mov [consoleInHandle], eax ; Save the input handle
                    ret

displayCurrentByte: mov ah, byte ptr [esi]     ; Move the byte from memory into AH register 
                    mov ioByte, ah             ; Move AH into ioByte
					push 0                     ; _Reserved_      LPVOID  lpReserved
                    push offset bytesWritten   ; _Out_           LPDWORD lpNumberOfCharsWritten
                    push ioByteLength          ; _In_            DWORD   nNumberOfCharsToWrite
                    push offset ioByte         ; _In_      const VOID *  lpBuffer
                    push consoleOutHandle      ; _In_            HANDLE  hConsoleOutput
                    call WriteConsole          ; https://docs.microsoft.com/en-us/windows/console/writeconsole
                    ret

readCurrentByte:    push -1                    ; _In_opt_        LPVOID  pInputControl
                    push offset bytesRead      ; _Out_           LPDWORD lpNumberOfCharsRead
                    push 1                     ; _In_            DWORD   nNumberOfCharsToRead
                    push offset ioByte         ; _Out_           LPVOID  lpBuffer
                    push consoleInHandle       ; _In_            HANDLE  hConsoleInput
                    call ReadConsole           ; https://docs.microsoft.com/en-us/windows/console/readconsole
					mov ah, ioByte             ; Move the byte read into AH register
					mov byte ptr [esi], ah     ; Move the AH register into our memory buffer
                    ret

; readCurrentByte2:   push offset bytesRead      ; Gah! This sort-of works. The problem with ReadConsole is that it doesnt return until <ENTER>
;                     push 1                     ; is pressed. The problem with ReadConsoleInput is that it returns when *any* key is pressed
;                     push offset displayByte    ; including <SHIFT>, <ALT>, <CAPS-LOCK> etc. ReadConsoleInput is too fine for our needs,
;                     push consoleInHandle       ; but depressingly ReadConsole isnt fine enough. :(
;                     call ReadConsoleInput      ; https://docs.microsoft.com/en-us/windows/console/readconsoleinput

exit:              push 0                      ; Exit code zero for success
                   call ExitProcess            ; https://docs.microsoft.com/en-us/windows/desktop/api/processthreadsapi/nf-processthreadsapi-exitprocess

end start
```

All we need to do now is run the file:

```
C:\Dev\BrainfuckCompiler\src>alphabet.exe
ABCDEFGHIJKLMNOPQRSTUVWXYZ
```
