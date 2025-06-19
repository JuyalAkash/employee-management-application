class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.message = message; // Custom error message
    this.statusCode = statusCode;
    this.isOperational = true; // Indicates if the error is operational or programming error
    Error.captureStackTrace(this, this.constructor); // Capture the stack trace for debugging
  }
}

export default CustomError;
