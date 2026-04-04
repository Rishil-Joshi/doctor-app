const { User } = require('../models/User');
const { generateToken } = require('../utils/jwt');
const {
  validateEmail,
  validatePassword,
  validatePhone,
  validateFirstName,
  validateLastName,
  validateUsername,
} = require('../utils/validators');
const { AppError, ERROR_MESSAGES } = require('../utils/errors');

/**
 * Register a new user
 * @param {object} userData
 * @returns {object} { user, token }
 */
const registerUser = async (userData) => {
  const { username, email, password, confirmPassword, firstName, lastName, phone, specialization, clinicName, role } = userData;

  // Validate each required field with a specific error
  if (!validateUsername(username)) throw new AppError(ERROR_MESSAGES.USERNAME_REQUIRED, 400);
  if (!validatePassword(password)) throw new AppError(ERROR_MESSAGES.PASSWORD_REQUIRED, 400);
  if (password.length < 5) throw new AppError(ERROR_MESSAGES.WEAK_PASSWORD, 400);

  // Validate email format only if provided
  if (email && !validateEmail(email)) throw new AppError(ERROR_MESSAGES.INVALID_EMAIL, 400);

  // Validate passwords match
  if (confirmPassword && password !== confirmPassword) throw new AppError(ERROR_MESSAGES.PASSWORDS_MISMATCH, 400);

  // Check if username exists
  const existingUser = await User.findByUsername(username);
  if (existingUser) {
    throw new AppError(ERROR_MESSAGES.USERNAME_EXISTS, 400);
  }

  // Check if email exists only if provided
  if (email) {
    const existingEmail = await User.findByEmail(email);
    if (existingEmail) {
      throw new AppError(ERROR_MESSAGES.EMAIL_EXISTS, 400);
    }
  }

  // Pass null when email is empty to avoid UNIQUE constraint issues
  const emailValue = email && email.trim() ? email.trim() : null;

  // Create user
  const user = await User.create(username, emailValue, password, firstName, lastName, phone, specialization, clinicName, role);
  const token = generateToken(user.id);

  return { user, token };
};

/**
 * Login user
 * @param {string} username
 * @param {string} password
 * @returns {object} { user, token }
 */
const loginUser = async (username, password) => {
  if (!username || !password) {
    throw new AppError(ERROR_MESSAGES.INVALID_CREDENTIALS, 401);
  }

  const user = await User.findByUsername(username);
  if (!user) {
    throw new AppError(ERROR_MESSAGES.INVALID_CREDENTIALS, 401);
  }

  const isValidPassword = await User.verifyPassword(password, user.password);
  if (!isValidPassword) {
    throw new AppError(ERROR_MESSAGES.INVALID_CREDENTIALS, 401);
  }

  const token = generateToken(user.id);
  const userData = await User.findById(user.id);

  return { user: userData, token };
};

/**
 * Get user profile
 * @param {number} userId
 * @returns {object} user
 */
const getUserProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, 404);
  }
  return user;
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
};
