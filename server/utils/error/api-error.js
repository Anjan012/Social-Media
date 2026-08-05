export class ApiError extends Error {

    constructor(statusCode, message, options = {}) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.details = options.details;

        Error.captureStackTrace(this, this.constructor);
    };

};


/*
code explaination ----------------------
// ApiError inherits everything from JavaScript's built-in Error class. ApiError also has properties of Error class
// options is default in constructor
// super(message) calls the parent Error constructor internally it does this.message = message Without super(), JavaScript won't let you use this in a subclass.
// error.captureStackTrace : This is a Node.js/V8 feature. When an error is created, JavaScript records where it happened.

class → A blueprint for creating objects.

extends → Makes one class inherit features from another class.

ApiError extends Error → ApiError becomes a specialized version of JavaScript's built-in Error.

super() → Calls the parent class constructor and initializes the inherited part.

super(message) → Gives the Error class the error message so it can create a proper error.

constructor() → Runs automatically when we create an object using new.

this → Refers to the current object being created.

this.property = value → Adds a property with a value to the current object.

this.name = this.constructor.name → Stores the class name ("ApiError") as the error name.

this.statusCode = statusCode → Stores the HTTP status code inside the error object.

this.details = options.details → Stores extra information inside the error object.

options = {} → Gives a default empty object if no options are provided.

Error.captureStackTrace() → Keeps a clean record of where the error was created.

new ApiError(...) → Creates a new error object with custom information.

throw new ApiError(...) → Sends that custom error to the error handler.

Custom error classes → Let us create errors with extra information instead of plain messages.

Error class handles → message, name, stack.

ApiError adds → statusCode, details.

this points to → the object created by "new".

Left side of "=" → property we are creating/updating.

Right side of "=" → value we are assigning.

*/