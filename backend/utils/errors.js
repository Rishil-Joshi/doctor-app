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
  WEAK_PASSWORD: 'Password must be at least 8 characters with 1 uppercase letter and 1 number',
  PASSWORDS_MISMATCH: 'Passwords do not match',
  INVALID_PHONE: 'Invalid phone number format',
  MISSING_REQUIREMENT: 'Username, email, password, first name, last name, and phone are required',
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
