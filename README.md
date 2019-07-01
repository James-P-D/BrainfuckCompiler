# BrainfuckCompiler
A command-line application for generating MASM-compatible x86 Assembly versions of Brainfuck programs

node.js alphabet /d /a 


C:\Users\jdorr\Desktop\Dev\BrainfuckCompiler\src>node bf.js alphabet.bf /d /a
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

C:\Users\jdorr\Desktop\Dev\BrainfuckCompiler\src>alphabet.exe
