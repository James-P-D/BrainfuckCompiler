exports.bfIncDataPointerCommand = function() {
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

exports.bfInputCommand = function() {
};

exports.bfOutputCommand = function() {
;}

exports.bfWhileNotZero = function() {
    this.bfCommands = [];

    this.addBFCommand = function(command) {
        this.bfCommands.push(command);
    };
};

exports.bfEndWhile = function() {
};