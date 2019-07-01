// Below are the individual commands. Note that for +, -, >, and <
// we can keep track on the number of concurrent commands of the same
// type. This way if the Brainfuck program contains '+++' (increase
// the current memory location by 1, but do it three times), we
// can resolve this into a single 'ADD' op-code rather than three
// individual 'INC' op-codes.
exports.bfIncDataPointerCommand = function () {
    this.counter = 1;

    this.increment = function() {
        this.counter++;
    };
};

exports.bfDecDataPointerCommand = function() {
    this.counter = 1;

    this.increment = function() {
        this.counter++;
    };
};

exports.bfIncDataCommand = function() {
    this.counter = 1;

    this.increment = function() {
        this.counter++;
    };
};

exports.bfDecDataCommand = function() {
    this.counter = 1;

    this.increment = function() {
        this.counter++;
    };
};

// Don't need to actually do anything for Input/Output commands
// ('.' and ','). We just need to know what 'instanceof' the
// command is
exports.bfInputCommand = function() {
};

exports.bfOutputCommand = function() {
;}

// Finally, we have our while-not-zero command ('[') which just
// needs to include the list of sub-commands for the loop
exports.bfWhileNotZero = function(bfCommands) {
    this.bfCommands = bfCommands;
};
