
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; PROGRAM ENDS ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

                    jmp exit                   ; All done!

getIOHandles:       push STD_OUTPUT_HANDLE     ; _In_ DWORD nStdHandle
                    call GetStdHandle          ; https://docs.microsoft.com/en-us/windows/console/getstdhandle
                    mov [consoleOutHandle], eax; Save the output handle
                    push STD_INPUT_HANDLE      ; _In_ DWORD nStdHandle
                    call GetStdHandle          ; https://docs.microsoft.com/en-us/windows/console/getstdhandle
                    mov [consoleInHandle], eax ; Save the input handle
                    ret

displayCurrentByte: push 0                     ; _Reserved_      LPVOID  lpReserved
                    push offset bytesWritten   ; _Out_           LPDWORD lpNumberOfCharsWritten
                    push displayByteLength     ; _In_            DWORD   nNumberOfCharsToWrite
                    push offset displayByte    ; _In_      const VOID *  lpBuffer
                    push consoleOutHandle      ; _In_            HANDLE  hConsoleOutput
                    call WriteConsole          ; https://docs.microsoft.com/en-us/windows/console/writeconsole
                    ret

readCurrentByte:    push - 1                   ; _In_opt_        LPVOID  pInputControl
                    push offset bytesRead      ; _Out_           LPDWORD lpNumberOfCharsRead
                    push 1                     ; _In_            DWORD   nNumberOfCharsToRead
                    push offset displayByte    ; _Out_           LPVOID  lpBuffer
                    push consoleInHandle       ; _In_            HANDLE  hConsoleInput
                    call ReadConsole           ; https://docs.microsoft.com/en-us/windows/console/readconsole
                    ret

; readCurrentByte2: push offset bytesRead        ; Gah! This sort-of works. The problem with ReadConsole is that it doesnt return until <ENTER>
;                   push 1                       ; is pressed. The problem with ReadConsoleInput is that it returns when *any* key is pressed
;                   push offset displayByte      ; including <SHIFT>, <ALT>, <CAPS-LOCK> etc. ReadConsoleInput is too fine for our needs,
;                   push consoleInHandle         ; but depressingly ReadConsole isnt fine enough. :(
;                   call ReadConsoleInput        ; https://docs.microsoft.com/en-us/windows/console/readconsoleinput

exit:              push 0                      ; Exit code zero for success
                   call ExitProcess            ; https://docs.microsoft.com/en-us/windows/desktop/api/processthreadsapi/nf-processthreadsapi-exitprocess

exitWithError:     push 1                      ; Exit code one for failure
                   call ExitProcess            ; https://docs.microsoft.com/en-us/windows/desktop/api/processthreadsapi/nf-processthreadsapi-exitprocess

end start
