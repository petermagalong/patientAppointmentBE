class AppError extends Error {
  constructor(status, message, statusCode) {
    super(message);
    this.status = status;
    this.statusCode = statusCode;
  }
}

module.exports = AppError;
