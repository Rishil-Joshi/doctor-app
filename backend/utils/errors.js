/**
 * Custom application error class
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error response formatter
 * @param {Error} err
 * @returns {object}
 */
const formatError = (err) => {
  return {
    error: err.message || 'Internal server error',
    statusCode: err.statusCode || 500,
  };
};

/**
 * Common error messages
 */
const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid username or password',
  USERNAME_EXISTS: 'Username already exists',
  EMAIL_EXISTS: 'Email already exists',
  INVALID_EMAIL: 'Invalid email format',
  WEAK_PASSWORD: 'Password must be at least 5 characters',
  PASSWORDS_MISMATCH: 'Passwords do not match',
  INVALID_PHONE: 'Phone number must be exactly 10 digits',
  USERNAME_REQUIRED: 'Username is required',
  PASSWORD_REQUIRED: 'Password is required',
  USER_NOT_FOUND: 'User not found',
  PATIENT_NOT_FOUND: 'Patient not found',
  UNAUTHORIZED: 'Unauthorized access',
  INTERNAL_ERROR: 'Internal server error',
};

module.exports = {
  AppError,
  formatError,
  ERROR_MESSAGES,
};
