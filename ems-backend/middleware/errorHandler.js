import CustomError from "../utils/CustomError.js";

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  let error = { ...err }; // Create a shallow copy of the error object
  error.message = err.message; // Set the message from the original error

  // Log the error for debugging (only in development mode)
  if (process.env.NODE_ENV === "development") {
    console.error("Error Stack:", err.stack);
  }

  // Handle Mongoose Bad ObjectId (e.g., /users/invalidId)
  if (err.name === "CastError" && err.kind === "ObjectId") {
    const message = `Resource not found with id of ${err.value}`;
    error = new CustomError(message, 400);
  }

  // MongoDB duplicate key error (e.g., email already exists)
  if (err.code === 11000) {
    // Extract the field name that caused the duplicate error
    const field = Object.keys(err.keyValue)[0];
    const message = `Duplicate field value entered: ${err.keyValue[field]}. Please use another ${field}. `;
    error = new CustomError(message, 400);
  }

  // Send the structured error response
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined, // Include stack trace only in development
  });
};

export default errorHandler;
