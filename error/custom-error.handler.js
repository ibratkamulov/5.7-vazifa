class CustomErrorhandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }

  static BadRequest(message) {
    return new CustomErrorhandler(message, 400);
  }

  static Unauthorized(message) {
    return new CustomErrorhandler(message, 401);
  }

  static NotFound(message) {
    return new CustomErrorhandler(message, 404);
  }

  static InternalServerError(message) {
    return new CustomErrorhandler(message, 500);
  }
}

module.exports = CustomErrorhandler;