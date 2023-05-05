const AppError = require("../util/AppError");

const errorHandler = (error, req, res, next) => {
  if (error.name === "ValidationError") {
    return res.status(400).json({
      status: "ValidationError",
      message: error.message,
    });
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: "AppError",
      message: error.message,
    });
  }
  return res
    .status(401)
    .send({ status: false, message: error.message || error });
};

module.exports = errorHandler;
