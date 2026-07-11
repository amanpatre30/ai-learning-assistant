const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Server Error";

  // Mongoose bad ObjectID
  if (err.name === "CastError") {
    message = "Resource Not Found";
    statusCode = 404;
  }

  // Mongoose Duplicate Key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exists`;
    statusCode = 400;
  }

  // Mongoose Validation Error
  if (err.name === "ValidationError") {
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    statusCode = 400;
  }

  // Multer upload errors
  if (err.code === "LIMIT_FILE_SIZE") {
    message = "File size exceeds the maximum limit of 10MB";
    statusCode = 400;
  }

  if (
    err.message === "Malformed part header" ||
    err.code === "LIMIT_PART_COUNT" ||
    err.code === "LIMIT_UNEXPECTED_FILE"
  ) {
    message =
      "Invalid multipart upload. Please send the file as form-data with the field name 'file'.";
    statusCode = 400;
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    message = "Invalid token";
    statusCode = 401;
  }

  if (err.name === "TokenExpiredError") {
    message = "Token expired";
    statusCode = 401;
  }

  console.error("Error:", {
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });

  res.status(statusCode).json({
    success: false,
    error: message,
    statusCode,
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
    }),
  });
};

export default errorHandler;
