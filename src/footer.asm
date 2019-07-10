
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; PROGRAM ENDS ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

                    jmp exit                     ; All done!

getIOHandles:       push STD_OUTPUT_HANDLE       ; _In_ DWORD nStdHandle
                    call GetStdHandle            ; https://docs.microsoft.com/en-us/windows/console/getstdhandle
                    mov [consoleOutHandle], eax  ; Save the output handle
                    push STD_INPUT_HANDLE        ; _In_ DWORD nStdHandle
                    call GetStdHandle            ; https://docs.microsoft.com/en-us/windows/console/getstdhandle
                    mov [consoleInHandle], eax   ; Save the input handle
                    ret

displayCurrentByte: mov ah, byte ptr [esi]       ; Move the byte from memory into AH register 
                    mov ioByte, ah               ; Move AH into ioByte
					push 0                       ; _Reserved_      LPVOID  lpReserved
                    push offset bytesWritten     ; _Out_           LPDWORD lpNumberOfCharsWritten
                    push ioByteLength            ; _In_            DWORD   nNumberOfCharsToWrite
                    push offset ioByte           ; _In_      const VOID *  lpBuffer
                    push consoleOutHandle        ; _In_            HANDLE  hConsoleOutput
                    call WriteConsole            ; https://docs.microsoft.com/en-us/windows/console/writeconsole
                    ret

readCurrentByte:    push -1                      ; _In_opt_        LPVOID  pInputControl
                    push offset bytesRead        ; _Out_           LPDWORD lpNumberOfCharsRead
                    push 1                       ; _In_            DWORD   nNumberOfCharsToRead
                    push offset ioByte           ; _Out_           LPVOID  lpBuffer
                    push consoleInHandle         ; _In_            HANDLE  hConsoleInput
                    call ReadConsole             ; https://docs.microsoft.com/en-us/windows/console/readconsole
                    mov ah, ioByte               ; Move the byte read into AH register
                    mov byte ptr [esi], ah       ; Move the AH register into our memory buffer
                    ret

; readCurrentByte2:   push offset bytesRead        ; Gah! This sort-of works. The problem with ReadConsole is that it doesnt return until <ENTER>
;                     push 1                       ; is pressed. The problem with ReadConsoleInput is that it returns when *any* key is pressed
;                     push offset displayByte      ; including <SHIFT>, <ALT>, <CAPS-LOCK> etc. ReadConsoleInput is too fine for our needs,
;                     push consoleInHandle         ; but depressingly ReadConsole isnt fine enough. :(
;                     call ReadConsoleInput        ; https://docs.microsoft.com/en-us/windows/console/readconsoleinput

exit:              push 0                        ; Exit code zero for success
                   call ExitProcess              ; https://docs.microsoft.com/en-us/windows/desktop/api/processthreadsapi/nf-processthreadsapi-exitprocess

end start
