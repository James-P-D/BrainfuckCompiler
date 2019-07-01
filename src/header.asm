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

