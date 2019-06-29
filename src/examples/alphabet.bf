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