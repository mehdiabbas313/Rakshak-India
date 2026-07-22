const errorMiddleware = (error, req, res, next) => {
  let statusCode = error.statusCode || 500;
  let message = error.message || "Internal server error.";

  if (error.name === "CastError") {
    statusCode = 400;
    message = "Invalid resource ID.";
  }

  if (error.code === 11000) {
    statusCode = 409;

    const duplicateField = Object.keys(error.keyValue || {})[0];

    message = duplicateField
      ? `${duplicateField} already exists.`
      : "Duplicate resource already exists.";
  }

  if (error.name === "ValidationError") {
    statusCode = 400;

    message = Object.values(error.errors)
      .map((item) => item.message)
      .join(", ");
  }

  if (
    error.name === "JsonWebTokenError" ||
    error.name === "TokenExpiredError"
  ) {
    statusCode = 401;
    message = "Invalid or expired authentication token.";
  }

  console.error({
    message: error.message,
    stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    method: req.method,
    path: req.originalUrl,
  });

  return res.status(statusCode).json({
    success: false,
    message,
    errors: error.errors || [],
    stack:
      process.env.NODE_ENV === "development"
        ? error.stack
        : undefined,
  });
};

export default errorMiddleware;